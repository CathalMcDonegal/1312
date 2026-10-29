#!/usr/bin/env python3
"""Tradueix al català el text de la normativa (castellà -> català) amb l'API de Claude.
Escriu data/normativa-ca.json. Incremental (només articles nous o modificats), en paral·lel
i tolerant a errors: si un lot falla, reintenta els articles un per un."""
import concurrent.futures as cf, hashlib, json, os, re, threading, time, urllib.error, urllib.request
from datetime import datetime, timezone
from pathlib import Path

SRC, OUT = Path("data/normativa-oficial.json"), Path("data/normativa-ca.json")
MODEL = os.environ.get("TRAD_MODEL", "claude-sonnet-5-5")
SECTIONS = [s for s in os.environ.get("TRAD_SECTIONS", "codi-penal,circulacio,seguretat,lecrim").split(",") if s]
MAX_CALLS = int(os.environ.get("TRAD_MAX_CALLS", "900"))
WORKERS = int(os.environ.get("TRAD_WORKERS", "4"))
BATCH_CHARS = 6000
KEY = os.environ["ANTHROPIC_API_KEY"]
SYSTEM = ("Ets un traductor jurídic expert en normativa espanyola. Tradueixes del castellà al català "
          "en registre jurídic-administratiu normatiu, amb terminologia precisa (p. ex. «pena de presó», "
          "«delicte lleu», «Ministeri de l'Interior»). No resumeixes, no afegeixes ni ometis res, i mantens "
          "la numeració, els apartats i les referències a altres lleis o articles. Mantén com a primera frase "
          "el títol de l'article.")

def h(t): return hashlib.sha1(t.encode("utf-8")).hexdigest()[:12]

def call(prompt):
    body = json.dumps({"model": MODEL, "max_tokens": 16000, "system": SYSTEM,
                       "messages": [{"role": "user", "content": prompt}]}).encode()
    for attempt in range(5):
        req = urllib.request.Request("https://api.anthropic.com/v1/messages", data=body, headers={
            "x-api-key": KEY, "anthropic-version": "2023-06-01", "content-type": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=300) as r:
                d = json.load(r)
            return "".join(b.get("text", "") for b in d.get("content", []) if b.get("type") == "text")
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 529):
                time.sleep(20 * (attempt + 1)); continue
            print("HTTP", e.code, e.read()[:300]); return ""
        except Exception as e:
            print("Error:", e); time.sleep(10)
    return ""

def translate(batch):
    prompt = ("Tradueix al català cadascun dels articles següents. Respon NOMÉS amb un bloc "
              '<art id="ID">traducció</art> per article, sense cap altre text.\n\n' +
              "\n\n".join(f'<art id="{x["id"]}">{x["text"]}</art>' for x in batch))
    got = dict(re.findall(r'<art id="([^"]+)">(.*?)</art>', call(prompt), re.S))
    ids = {x["id"] for x in batch}
    return {i: t.strip() for i, t in got.items() if i in ids and t.strip()}

def batches(todo):
    cur, size = [], 0
    for it in todo:
        if cur and size + len(it["text"]) > BATCH_CHARS:
            yield cur; cur, size = [], 0
        cur.append(it); size += len(it["text"])
    if cur: yield cur

def main():
    src = json.loads(SRC.read_text(encoding="utf-8"))["data"]
    out = json.loads(OUT.read_text(encoding="utf-8")) if OUT.exists() else {"items": {}}
    items = out.setdefault("items", {})
    todo = [x for s in SECTIONS for x in src.get(s, []) if items.get(x["id"], {}).get("h") != h(x["text"])]
    lots = list(batches(todo))[:MAX_CALLS]
    print(f"{len(todo)} articles pendents · {len(lots)} lots en aquesta execució")
    lock, state = threading.Lock(), {"n": 0}

    def work(batch):
        got = translate(batch)
        if len(batch) > 1:
            for x in batch:
                if x["id"] not in got: got.update(translate([x]))
        with lock:
            for x in batch:
                if x["id"] in got: items[x["id"]] = {"h": h(x["text"]), "x": got[x["id"]]}
            state["n"] += 1
            out.update({"generatedAt": datetime.now(timezone.utc).isoformat(), "model": MODEL})
            OUT.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
            print(f"lot {state['n']}/{len(lots)}: {sum(x['id'] in got for x in batch)}/{len(batch)} · total {len(items)}", flush=True)

    with cf.ThreadPoolExecutor(WORKERS) as ex: list(ex.map(work, lots))
    print("Fet.")

if __name__ == "__main__":
    main()
