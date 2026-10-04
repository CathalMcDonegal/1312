#!/usr/bin/env python3
import json
import re
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from bs4 import BeautifulSoup
from pypdf import PdfReader

NORMS = [
    {"section":"codi-penal","name":"Codi Penal","id":"BOE-A-1995-25444","url":"https://www.boe.es/buscar/act.php?id=BOE-A-1995-25444&tn=1"},
    {"section":"lecrim","name":"LECrim","id":"BOE-A-1882-6036","url":"https://www.boe.es/buscar/act.php?id=BOE-A-1882-6036&tn=1"},
    {"section":"circulacio","name":"Llei de trànsit","id":"BOE-A-2015-11722","url":"https://www.boe.es/buscar/act.php?id=BOE-A-2015-11722&tn=1"},
    {"section":"seguretat","name":"Seguretat ciutadana","id":"BOE-A-2015-3442","url":"https://www.boe.es/buscar/act.php?id=BOE-A-2015-3442&tn=1"},
]

OUT = Path("data/normativa-oficial.json")
ORD_URL = "https://bop.diba.cat/anuncio/ver-pdf/3882054"
ORD_CORRECCIO_URL = "https://bcnroc.ajuntament.barcelona.cat/jspui/bitstream/11703/144306/11/BOPB_esmena-ordenana-mesures-convivencia_2026.pdf"
ARTICLE_RE = re.compile(r"^Art[ií]culo\s+([0-9]+(?:\s+(?:bis|ter|qu[aá]ter|quinquies|sexies))?)\.?\s*(.*)$", re.I)

def clean(value):
    return re.sub(r"\s+", " ", value or "").strip()

def fetch_html(url):
    req = urllib.request.Request(url, headers={"User-Agent":"Mozilla/5.0 (compatible; 1312 legal app)"})
    with urllib.request.urlopen(req, timeout=90) as response:
        return response.read()

def parse_norm(norm):
    soup = BeautifulSoup(fetch_html(norm["url"]), "html.parser")
    lines = [clean(x) for x in soup.stripped_strings if clean(x)]

    candidates = {}
    current = None
    buffer = []

    def flush():
        nonlocal current, buffer
        if current is None:
            return
        body = clean(" ".join(buffer))
        if body:
            candidates.setdefault(current, []).append(body)
        current = None
        buffer = []

    for line in lines:
        match = ARTICLE_RE.match(line)
        if match:
            flush()
            current = clean(match.group(1))
            heading = clean(match.group(2))
            buffer = [heading] if heading else []
        elif current is not None:
            buffer.append(line)

    flush()

    articles = []
    for article_no, versions in candidates.items():
        # The BOE page contains both an index and the actual consolidated article.
        # Keeping the longest occurrence avoids storing the short index entry.
        text = max(versions, key=len)
        if len(text) < 20:
            continue
        title = f"Article {article_no}"
        article_id = f"{norm['section']}-{re.sub(r'[^a-z0-9]+','-',article_no.lower()).strip('-')}"
        articles.append({
            "id": article_id,
            "article": article_no,
            "title": title,
            "keywords": [],
            "summary": text,
            "text": text,
            "source": norm["url"].replace("&tn=1",""),
            "sourceLabel": "BOE — text consolidat de caràcter informatiu"
        })

    def sort_key(item):
        m = re.match(r"(\d+)", item["article"])
        return (int(m.group(1)) if m else 99999, item["article"])

    return sorted(articles, key=sort_key)


def parse_ordenanca():
    req = urllib.request.Request(ORD_URL, headers={"User-Agent":"Mozilla/5.0 (compatible; 1312 legal app)"})
    with urllib.request.urlopen(req, timeout=90) as response:
        reader = PdfReader(response)
    text = "\n".join(page.extract_text() or "" for page in reader.pages)
    text = re.sub(r"\s+", " ", text)
    chunks = re.split(r"(?=Article\s+(?:[0-9]+|únic)\b)", text, flags=re.I)
    items = []
    for i, chunk in enumerate(chunks):
        chunk = clean(chunk)
        if len(chunk) < 80:
            continue
        m = re.match(r"Article\s+([^\.]+)\.?(.*)", chunk, re.I)
        article_no = clean(m.group(1)) if m else "Document 2026"
        items.append({
            "id": f"ordenanca-2026-{i}",
            "article": article_no,
            "title": "Ordenança de convivència — reforma 2026",
            "keywords": ["ordenança", "convivència", "civisme", "Barcelona"],
            "summary": chunk,
            "text": chunk,
            "source": "https://bop.diba.cat/anunci/3882054/aprovacio-definitiva-de-l-ordenanca-de-modificacio-de-l-ordenanca-de-mesures-per-fomentar-i-garantir-la-convivencia-ciutadana-a-l-espai-public-ajuntament-de-barcelona",
            "sourceLabel": "BOPB — reforma publicada 15/01/2026"
        })
    items.append({
        "id":"ordenanca-correccio-2026",
        "article":"Correcció 2026",
        "title":"Rectificació d'errades materials",
        "keywords":["correcció","rectificació","article 43","article 66","article 67","article 101"],
        "summary":"Rectificació oficial publicada el 06/05/2026 de diverses errades materials de la reforma de l'Ordenança de convivència.",
        "text":"Rectificació oficial publicada el 06/05/2026. Es corregeixen, entre d'altres, referències dels articles 43.2, 66, 67 i 101 de la reforma publicada el 15/01/2026.",
        "source":ORD_CORRECCIO_URL,
        "sourceLabel":"Ajuntament de Barcelona / BOPB — rectificació 06/05/2026"
    })
    return items

def main():
    output = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "notice": "Text consolidat del BOE de caràcter informatiu. Per a finalitats jurídiques cal consultar la publicació oficial.",
        "sources": {},
        "data": {}
    }

    for norm in NORMS:
        try:
            items = parse_norm(norm)
            if not items:
                raise RuntimeError("No s'han detectat articles a la pàgina BOE")
            output["data"][norm["section"]] = items
            output["sources"][norm["section"]] = {
                "name": norm["name"], "url": norm["url"].replace("&tn=1",""),
                "boeId": norm["id"], "count": len(items)
            }
            print(f"{norm['name']}: {len(items)} articles")
        except Exception as exc:
            print(f"ERROR {norm['name']}: {exc}")
            raise


    ord_items = parse_ordenanca()
    output["data"]["ordenanca"] = ord_items
    output["sources"]["ordenanca"] = {
        "name":"Ordenança de convivència de Barcelona",
        "url":ORD_URL,
        "correccioUrl":ORD_CORRECCIO_URL,
        "date":"2026-05-06",
        "count":len(ord_items)
    }
    print(f"Ordenança Barcelona: {len(ord_items)} entrades")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(output, ensure_ascii=False, separators=(",",":")), encoding="utf-8")
    print(f"Wrote {OUT}")

if __name__ == "__main__":
    main()
