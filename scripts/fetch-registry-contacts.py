# -*- coding: utf-8 -*-
"""등록 병원 1,372곳의 전화·대표자명·상태를 정부 유치기관 명부에서 받아온다 — 2026-11-25

왜: 병원 쪽 1,372개에 연락 수단이 하나도 없었다(2026-11-25 전수 측정). 또 같은 이름·
    같은 지역 병원이 2~3쪽씩 있어 제목이 겹쳤는데(블리비의원 3쪽), 구분할 값이 없었다.
    명부에는 기관마다 대표자명·연락처가 있어 이 둘로 구분이 된다.

어디서: 외국인환자 유치 정보시스템(medicalkorea.or.kr) 「유치기관 현황조회」 공개 화면.
    로그인 없이 보이는 목록이고 robots.txt 가 막지 않는 경로다. 기관명으로 한 건씩 조회한다.
    이 화면에는 주소가 없다(표 머리말에는 있지만 값은 엑셀 내려받기에만 들어 있다).

규칙: 이름이 정확히 같은 행만 받는다. 여러 행이 나오면 전부 적어 두고(동명 기관),
      우리 쪽 지역과 맞는 것을 고른다. 못 찾은 곳은 빈칸으로 두고 개수를 보고한다.

쓰는 법: python -I scripts/fetch-registry-contacts.py [--limit N]
결과: data/provider-contacts.json  (slug → {phone, ceo, kind, sido, status, matches, source, checked})
"""
from __future__ import annotations
import html, json, re, sys, time, urllib.parse, urllib.request
from datetime import date
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "provider-contacts.json"
URL = "https://www.medicalkorea.or.kr/korp/agencyStateList.do"
TODAY = str(date.today())
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36"

# 우리 지역 꼬리표 → 명부의 시·도 값. 같은 이름이 여럿일 때 고르는 데만 쓴다.
SIDO_OF_AREA = {
    "Busan": "부산", "Seomyeon": "부산", "Haeundae": "부산", "Daegu": "대구",
    "Incheon": "인천", "Daejeon": "대전", "Gwangju": "광주", "Ulsan": "울산",
    "Jeju": "제주", "Suwon": "경기", "Seongnam": "경기", "Bundang": "경기",
}
TAG = re.compile(r"<[^>]+>")


def norm(s: str) -> str:
    return re.sub(r"[\s()\[\]·.,\-'\"]+", "", TAG.sub("", s))


def query(name: str) -> list[dict]:
    body = urllib.parse.urlencode({"korName": name}).encode()
    req = urllib.request.Request(URL, data=body, headers={
        "X-Requested-With": "XMLHttpRequest", "User-Agent": UA,
        "Content-Type": "application/x-www-form-urlencoded"})
    with urllib.request.urlopen(req, timeout=30) as r:
        t = r.read().decode("utf-8", "replace")
    out = []
    for row in re.findall(r"<tr>(.*?)</tr>", t, re.S):
        cells = [" ".join(html.unescape(TAG.sub(" ", c)).split())
                 for c in re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", row, re.S)]
        if len(cells) >= 7 and cells[0] not in ("No", ""):
            out.append({"status": cells[1], "name": cells[2], "ceo": cells[3],
                        "phone": cells[4], "kind": cells[5], "sido": cells[6]})
    return out


def main() -> None:
    limit = int(sys.argv[sys.argv.index("--limit") + 1]) if "--limit" in sys.argv else None
    src = json.loads((ROOT / "data" / "registered-providers.json").read_text(encoding="utf-8"))
    items = src["items"][:limit] if limit else src["items"]
    got: dict[str, dict] = {}
    if OUT.exists():
        got = json.loads(OUT.read_text(encoding="utf-8")).get("contacts", {})
    found = miss = 0
    for i, c in enumerate(items, 1):
        if c["slug"] in got:
            continue
        try:
            rows = query(c["ko"])
        except Exception as e:
            print(f"  ! {c['ko']} 조회 실패 {type(e).__name__}")
            time.sleep(2)
            continue
        same = [r for r in rows if norm(r["name"]) == norm(c["ko"])]
        if same:
            want = SIDO_OF_AREA.get(c["area"])
            pick = next((r for r in same if want and r["sido"] == want), same[0])
            got[c["slug"]] = {**pick, "matches": len(same), "source": "medicalkorea-유치기관현황",
                              "checked": TODAY}
            found += 1
        else:
            miss += 1
        if i % 50 == 0:
            print(f"  {i}/{len(items)} · 찾음 {found} · 못 찾음 {miss}")
            OUT.write_text(json.dumps({"source": "외국인환자 유치 정보시스템 유치기관 현황조회",
                                       "checked": TODAY, "contacts": got},
                                      ensure_ascii=False, indent=1), encoding="utf-8")
        time.sleep(0.25)
    OUT.write_text(json.dumps({"source": "외국인환자 유치 정보시스템 유치기관 현황조회",
                               "checked": TODAY, "contacts": got},
                              ensure_ascii=False, indent=1), encoding="utf-8")
    multi = len([v for v in got.values() if v.get("matches", 1) > 1])
    print(f"끝 — 전체 {len(items)} · 찾음 {found} · 못 찾음 {miss} · 동명 기관 {multi}")
    print(f"     {OUT}")


if __name__ == "__main__":
    main()
