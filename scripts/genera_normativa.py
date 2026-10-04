#!/usr/bin/env python3
import json
import re
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

NORMS = [
    {
        "section": "codi-penal",
        "name": "Codi Penal",
        "id": "BOE-A-1995-25444",
        "url": "https://www.boe.es/buscar/act.php?id=BOE-A-1995-25444",
    },
    {
        "section": "lecrim",
        "name": "LECrim",
        "id": "BOE-A-1882-6036",
        "url": "https://www.boe.es/buscar/act.php?id=BOE-A-1882-6036",
    },
    {
        "section": "circulacio",
        "name": "Llei de trànsit",
        "id": "BOE-A-2015-11722",
        "url": "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11722",
    },
    {
        "section": "seguretat",
        "name": "Seguretat ciutadana",
        "id": "BOE-A-2015-3442",
        "url": "https://www.boe.es/buscar/act.php?id=BOE-A-2015-3442",
    },
]

API = "https://www.boe.es/datosabiertos/api/legislacion-consolidada/id/{}/texto"
OUT = Path("data/normativa-oficial.json")

def local(tag):
    return tag.rsplit("}", 1)[-1].lower()

def clean(text):
    text = re.sub(r"\s+", " ", text or "").strip()
    return text

def element_text(el):
    return clean(" ".join(t for t in el.itertext() if t and t.strip()))

def fetch_xml(url):
    req = urllib.request.Request(url, headers={"User-Agent": "1312-app/1.0"})
    with urllib.request.urlopen(req, timeout=60) as response:
        return ET.fromstring(response.read())

def latest_version(block):
    versions = [c for c in block if local(c.tag) == "version"]
    if not versions:
        return block
    return versions[-1]

def parse_norm(norm):
    root = fetch_xml(API.format(norm["id"]))
    articles = []
    for block in root.iter():
        if local(block.tag) != "bloque":
            continue

        tipo = clean(block.attrib.get("tipo", ""))
        if not tipo:
            for child in block:
                if local(child.tag) == "tipo":
                    tipo = element_text(child)
                    break

        title = ""
        article_no = ""
        for child in block:
            tag = local(child.tag)
            value = element_text(child)
            if tag in ("titulo", "title") and value:
                title = value
            elif tag in ("numero", "num", "articulo") and value:
                article_no = value

        if "art" not in tipo.lower() and not re.search(r"\b(?:art[ií]culo|art\.?)\s*[0-9]", title, re.I):
            continue

        version = latest_version(block)
        content = element_text(version)
        if not content:
            continue

        if not article_no:
            m = re.search(r"art[ií]culo\s+([0-9]+(?:\s+bis)?(?:\s+ter)?(?:\s+quater)?)", title, re.I)
            article_no = m.group(1) if m else title

        if title.lower().startswith("artículo"):
            display_title = title
        else:
            display_title = title or f"Article {article_no}"

        article_id = f"{norm['section']}-{re.sub(r'[^a-z0-9]+', '-', article_no.lower()).strip('-')}"
        articles.append({
            "id": article_id,
            "article": article_no,
            "title": display_title,
            "keywords": [],
            "summary": content,
            "text": content,
            "source": norm["url"],
            "sourceLabel": "BOE — text consolidat informatiu",
        })

    # Evita duplicats conservant l'última aparició.
    unique = {}
    for item in articles:
        unique[item["id"]] = item
    return list(unique.values())

def main():
    output = {
        "generatedAt": __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat(),
        "notice": "Text consolidat del BOE de caràcter informatiu. Per a finalitats jurídiques cal consultar la publicació oficial.",
        "sources": {},
        "data": {},
    }

    for norm in NORMS:
        items = parse_norm(norm)
        output["data"][norm["section"]] = items
        output["sources"][norm["section"]] = {
            "name": norm["name"],
            "url": norm["url"],
            "boeId": norm["id"],
            "count": len(items),
        }
        print(f"{norm['name']}: {len(items)} articles")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(output, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {OUT}")

if __name__ == "__main__":
    main()
