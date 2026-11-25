# -*- coding: utf-8 -*-
"""등록 병원 1,372곳에 공식 명부의 주소를 붙인다 — 2026-11-25 [대표 승인]

왜: 병원 쪽 1,372개에 주소·전화·지도가 없어 검색해서 들어온 사람이 얻는 것이
    「공식 명부에 등록돼 있다」 한 줄뿐이었다(2026-11-25 전수 측정). 같은 이름·같은 지역
    병원이 2~3쪽씩 생긴 것(블리비의원 3쪽)도 주소가 없어 구분이 안 됐기 때문이다.

어디서: 외국인환자 유치 정보시스템(medicalkorea.or.kr) 「유치기관 현황 → 엑셀 저장」.
    로그인 없이 받을 수 있는 공개 자료이고, 칸은 상태·상호·대표자명·연락처·기관구분·
    지역·주소·유치대상국가 8개다. 내려받기는 대표 승인을 받고 했다(2026-11-25).

맞추는 규칙(지어내지 않는다):
 1. 상호를 공백·기호 없이 맞춰 같은 이름만 후보로 둔다.
 2. 후보가 둘 이상이면 ① 우리 지역의 시·도와 같은 것 ② 명부에서 받아 둔 전화·대표자와
    같은 것 ③ 상태가 「유지」인 것 순서로 좁힌다.
 4. 그래도 하나로 좁혀지지 않으면 주소를 넣지 않고 ambiguous 로 적어 둔다.
 5. 명부에 없는 병원(HIRA 출처 271곳 등)은 그대로 빈칸으로 둔다.

쓰는 법: python -I scripts/build-provider-addresses.py <내려받은 xlsx 경로>
결과: data/provider-addresses.json  (slug → {road, sido, phone, ceo, kind, status, nations, source, checked})
"""
from __future__ import annotations
import json, re, sys
from collections import defaultdict
from datetime import date
from pathlib import Path

import openpyxl

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "provider-addresses.json"
TODAY = str(date.today())

SIDO_OF_AREA = {
    "Busan": "부산", "Seomyeon": "부산", "Haeundae": "부산", "Daegu": "대구",
    "Incheon": "인천", "Daejeon": "대전", "Gwangju": "광주", "Ulsan": "울산",
    "Jeju": "제주", "Suwon": "경기", "Seongnam": "경기", "Bundang": "경기",
}


def norm(s: str) -> str:
    return re.sub(r"[\s()\[\]·.,\-'\"]+", "", s or "")


def main() -> None:
    xlsx = Path(sys.argv[1])
    wb = openpyxl.load_workbook(xlsx, read_only=True, data_only=True)
    ws = wb[wb.sheetnames[0]]
    rows = list(ws.iter_rows(values_only=True))
    head = next(i for i, r in enumerate(rows) if r and r[0] == "번호")
    cols = {name: j for j, name in enumerate(rows[head])}
    need = ["상태", "상호", "대표자명", "연락처", "기관구분", "지역", "주소", "유치대상국가"]
    missing = [n for n in need if n not in cols]
    if missing:
        raise SystemExit(f"엑셀에 없는 칸: {missing}")

    index: dict[str, list[dict]] = defaultdict(list)
    total = 0
    for r in rows[head + 1:]:
        if not r or not r[cols["상호"]]:
            continue
        rec = {k: ("" if r[cols[k]] is None else str(r[cols[k]]).strip()) for k in need}
        index[norm(rec["상호"])].append(rec)
        total += 1
    print(f"엑셀 {total}건 · 서로 다른 이름 {len(index)}개")

    src = json.loads((ROOT / "data" / "registered-providers.json").read_text(encoding="utf-8"))
    cpath = ROOT / "data" / "provider-contacts.json"
    known = json.loads(cpath.read_text(encoding="utf-8"))["contacts"] if cpath.exists() else {}

    out: dict[str, dict] = {}
    one = picked = ambiguous = absent = 0
    for c in src["items"]:
        cands = index.get(norm(c["ko"]), [])
        if not cands:
            absent += 1
            continue
        if len(cands) == 1:
            chosen, how = cands[0], "이름 하나뿐"
            one += 1
        else:
            narrowed = cands
            want = SIDO_OF_AREA.get(c["area"])
            if want:
                narrowed = [x for x in narrowed if x["지역"] == want] or narrowed
            k = known.get(c["slug"])
            if k and len(narrowed) > 1:
                by_contact = [x for x in narrowed
                              if (k.get("phone") and x["연락처"] == k["phone"])
                              or (k.get("ceo") and x["대표자명"] == k["ceo"])]
                narrowed = by_contact or narrowed
            if len(narrowed) > 1:
                narrowed = [x for x in narrowed if x["상태"] == "유지"] or narrowed
            if len(narrowed) != 1:
                # 같은 이름의 다른 지점들이다(예: 태흥당한의원 부산 3곳). 어느 쪽이 우리 쪽의
                # 그 병원인지 가릴 근거가 없으므로 주소를 고르지 않고, 후보를 그대로 적어 둔다.
                # 쪽에서는 「이 지역 명부에 같은 이름이 n곳 있다」며 후보 주소를 함께 보여 준다.
                ambiguous += 1
                out[c["slug"]] = {
                    "ambiguous": True, "candidates": len(cands),
                    "options": [{"ceo": x["대표자명"], "road": x["주소"], "sido": x["지역"],
                                 "phone": x["연락처"], "status": x["상태"]}
                                for x in narrowed if x["상태"] == "유지"][:6],
                    "source": "medicalkorea-유치기관현황", "checked": TODAY}
                continue
            chosen, how = narrowed[0], "지역·연락처로 좁힘"
            picked += 1
        out[c["slug"]] = {
            "road": chosen["주소"], "sido": chosen["지역"], "phone": chosen["연락처"],
            "ceo": chosen["대표자명"], "kind": chosen["기관구분"], "status": chosen["상태"],
            "nations": chosen["유치대상국가"], "matched": how,
            "source": "medicalkorea-유치기관현황", "checked": TODAY,
        }
    OUT.write_text(json.dumps({"source": "외국인환자 유치 정보시스템 유치기관 현황(엑셀)",
                               "checked": TODAY, "addresses": out},
                              ensure_ascii=False, indent=1), encoding="utf-8")
    have = len([v for v in out.values() if v.get("road")])
    print(f"우리 병원 {len(src['items'])}곳 중")
    print(f"  주소 넣음 {have}곳 (이름 하나뿐 {one} · 좁혀서 고름 {picked})")
    print(f"  이름이 겹쳐 못 고름 {ambiguous}곳 · 명부에 없음 {absent}곳")
    print(f"     {OUT}")


if __name__ == "__main__":
    main()
