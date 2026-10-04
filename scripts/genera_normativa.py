#!/usr/bin/env python3
import json
import re
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from bs4 import BeautifulSoup

NORMS = [
    {"section":"codi-penal","name":"Codi Penal","id":"BOE-A-1995-25444","url":"https://www.boe.es/buscar/act.php?id=BOE-A-1995-25444&tn=1"},
    {"section":"lecrim","name":"LECrim","id":"BOE-A-1882-6036","url":"https://www.boe.es/buscar/act.php?id=BOE-A-1882-6036&tn=1"},
    {"section":"circulacio","name":"Llei de trànsit","id":"BOE-A-2015-11722","url":"https://www.boe.es/buscar/act.php?id=BOE-A-2015-11722&tn=1"},
    {"section":"seguretat","name":"Seguretat ciutadana","id":"BOE-A-2015-3442","url":"https://www.boe.es/buscar/act.php?id=BOE-A-2015-3442&tn=1"},
]

OUT = Path("data/normativa-oficial.json")
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

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(output, ensure_ascii=False, separators=(",",":")), encoding="utf-8")
    print(f"Wrote {OUT}")

if __name__ == "__main__":
    main()
