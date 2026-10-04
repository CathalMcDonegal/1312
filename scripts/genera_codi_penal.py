#!/usr/bin/env python3
import json
import re
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from bs4 import BeautifulSoup

URL = "https://www.boe.es/buscar/act.php?id=BOE-A-1995-25444&tn=0&p=20260409"
OUT = Path("data/codi-penal.json")
ARTICLE_RE = re.compile(r"^Artículo\s+([0-9]+(?:\s+(?:bis|ter|quáter|quinquies|sexies))?)\.?\s*(.*)$", re.I)

def clean(v):
    return re.sub(r"\s+", " ", v or "").strip()

def anchor_for(article):
    return "a" + re.sub(r"\s+", "", article.lower())

def fetch():
    req = urllib.request.Request(URL, headers={"User-Agent":"Mozilla/5.0 (compatible; 1312 legal app)"})
    with urllib.request.urlopen(req, timeout=90) as r:
        return r.read()

def parse():
    soup = BeautifulSoup(fetch(), "html.parser")
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
        m = ARTICLE_RE.match(line)
        if m:
            flush()
            current = clean(m.group(1))
            buffer = [clean(m.group(2))] if clean(m.group(2)) else []
        elif current is not None:
            buffer.append(line)
    flush()
    items = []
    for article, versions in candidates.items():
        anchor = anchor_for(article)
        matching = [v for v in versions if f"#{anchor}" in v.lower()]
        text = max(matching or versions, key=len)
        if len(text) < 20:
            continue
        items.append({
            "id": f"codi-penal-{article.lower().replace(' ','-')}",
            "article": article,
            "title": f"Article {article}",
            "keywords": [],
            "summary": text,
            "text": text,
            "source": "https://www.boe.es/buscar/act.php?id=BOE-A-1995-25444",
            "sourceLabel": "BOE — text consolidat de caràcter informatiu"
        })
    def key(x):
        m = re.match(r"(\d+)", x["article"])
        return (int(m.group(1)) if m else 99999, x["article"])
    return sorted(items, key=key)

def main():
    items = parse()
    if len(items) < 700:
        raise RuntimeError(f"S'han detectat només {len(items)} articles; s'atura per evitar publicar dades incompletes.")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "source": "BOE-A-1995-25444",
        "updated": "09/04/2026",
        "count": len(items),
        "notice": "Text consolidat del BOE de caràcter informatiu. Per a finalitats jurídiques cal consultar la publicació oficial.",
        "data": items
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Codi Penal: {len(items)} articles")

if __name__ == "__main__":
    main()
