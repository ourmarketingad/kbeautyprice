# KBeautyPrice 실브라우저 점검. python -X utf8 qa/smoke.py http://127.0.0.1:4470 [캡처폴더]
# Supabase 환경 변수 없이 띄운 서버에서 돌린다(저장소에 아무것도 쓰이지 않음).
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8")
BASE = (sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:4470").rstrip("/")
OUT = sys.argv[2] if len(sys.argv) > 2 else ""
ok, bad = [], []


def check(name, cond, info=""):
    (ok if cond else bad).append(name + (f" | {info}" if info and not cond else ""))


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):
        return None


def get(path):
    with urllib.request.urlopen(BASE + path, timeout=30) as r:
        return r.status, r.read().decode("utf-8", "ignore")


def post(data):
    body = urllib.parse.urlencode(data).encode()
    op = urllib.request.build_opener(NoRedirect)
    try:
        r = op.open(urllib.request.Request(BASE + "/api/submit", data=body), timeout=30)
        return r.status, r.headers.get("location", "")
    except urllib.error.HTTPError as e:
        return e.code, e.headers.get("location", "")


prices = json.load(open("data/prices.json", encoding="utf-8"))["items"]
tr = open("data/treatments.ts", encoding="utf-8").read()
slugs = re.findall(r'slug: "([^"]+)"', tr)
check("금액 묶음마다 병원 3곳 이상", all(p["clinics"] >= 3 for p in prices))
check("금액 묶음의 시술이 목록에 있음", all(p["slug"] in slugs for p in prices))
check("금액 범위 최저≤최고", all(0 < p["low"] <= p["high"] for p in prices))

AUDIT = "D:/아워마케팅/OUR-Marketing-KB/80_work/ourmarketing/web/2026-11-06-kbeautyprice/price-groups-audit.json"
CLINICS = sorted({r["clinic"].split(" ")[0] for g in json.load(open(AUDIT, encoding="utf-8")) for r in g["rows"]})
BANNED = re.compile(r"real visitors|No fake|No ads|Submit a real|\bbest\b|cheapest|★|before and after photos of|guarantee", re.I)
guides = re.findall(r'slug: "([^"]+)"', open("data/guides.ts", encoding="utf-8").read())
PAGES = [f"/guides/{g}" for g in guides] + ["/for-clinics", "/guides", "/", "/treatments", "/how-prices-work", "/hospitals", "/submit", "/privacy", "/terms", "/auth"] + [f"/treatments/{s}" for s in slugs]
for p in PAGES:
    st, h = get(p)
    body = re.sub(r"<script.*?</script>|<style.*?</style>", " ", h, flags=re.S)
    vis = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", body))
    check(p + " 200", st == 200)
    check(p + " H1 하나", len(re.findall(r"<h1[\s>]", h)) == 1, str(len(re.findall(r"<h1[\s>]", h))))
    check(p + " 검색 차단", re.search(r'name="robots" content="noindex', h) is not None)
    check(p + " 근거 없는 표현 없음", not BANNED.search(vis), str(BANNED.findall(vis))[:60])
    if p.startswith("/treatments") or p == "/":
        check(p + " 금액 옆 병원명 없음", not any(c in vis for c in CLINICS), str([c for c in CLINICS if c in vis]))
    check(p + " 고유 제목", bool(re.findall(r"<title>(.*?)</title>", h)))
for s in slugs:
    h = get("/treatments/" + s)[1]
    want = [p for p in prices if p["slug"] == s]
    if want:
        check(f"{s} 금액 표시", all(f"{p['low']:,}" in h for p in want))
    else:
        check(f"{s} 근거 없으면 숫자 없음", "No published range yet" in h and "₩" not in re.sub(r"[\d,]*per dollar", "", re.sub(r"₩\s*\{?1,400", "", h)).split("Clinics are not named")[0].split("<main")[-1])
for p in ("/nope", "/treatments/nope"):
    try:
        get(p)
        check("없는 주소 404 " + p, False)
    except urllib.error.HTTPError as e:
        check("없는 주소 404 " + p, e.code == 404)

# 접수 검증(서버)
base = {"treatment": "rejuran", "krw": "200000", "year": "2026", "consent": "yes"}
for name, patch, want in (
    ("빈 값", {"treatment": "", "krw": ""}, "error=missing"),
    ("없는 시술", {"treatment": "hack"}, "error=missing"),
    ("금액 없음", {"krw": ""}, "error=missing"),
    ("금액 음수", {"krw": "-5"}, "error=missing"),
    ("금액 과다", {"krw": "999999999"}, "error=price"),
    ("글자 금액", {"krw": "abc"}, "error=missing"),
    ("동의 없음", {"consent": ""}, "error=consent"),
    ("연도 이상", {"year": "1999"}, "error=missing"),
):
    st, loc = post({**base, **patch})
    check("접수 " + name, st == 303 and want in loc, f"{st} {loc}")
if "127.0.0.1" in BASE or "localhost" in BASE:
    # 운영 주소에서는 실제 저장소에 쓰이므로 정상 접수를 시험하지 않는다
    st, loc = post(base)
    check("접수 저장소 없음=실패 표시", st == 303 and "error=server" in loc, f"{st} {loc}")

# 입점 신청 검증(저장 전 단계만)
def apply(data):
    body = urllib.parse.urlencode(data).encode()
    op = urllib.request.build_opener(NoRedirect)
    try:
        r = op.open(urllib.request.Request(BASE + "/api/clinic-apply", data=body), timeout=30)
        return r.status, r.headers.get("location", "")
    except urllib.error.HTTPError as e:
        return e.code, e.headers.get("location", "")


ab = {"clinic": "Test", "name": "A", "email": "a@example.com", "consent": "yes"}
for name, patch, want in (
    ("병원명 없음", {"clinic": ""}, "error=missing"),
    ("이름 없음", {"name": ""}, "error=missing"),
    ("메일 형식", {"email": "nope"}, "error=email"),
    ("전화 형식", {"phone": "abc"}, "error=phone"),
    ("동의 없음", {"consent": ""}, "error=consent"),
    ("로봇 칸", {"website": "x", "clinic": ""}, "sent=1"),
):
    st, loc = apply({**ab, **patch})
    check("입점 신청 " + name, st == 303 and want in loc, f"{st} {loc}")
# 로그인 없이 관리·운영 화면
for path, want in (("/manage", "/auth"), ("/admin", None)):
    op = urllib.request.build_opener(NoRedirect)
    try:
        r = op.open(BASE + path, timeout=30)
        code, loc = r.status, ""
    except urllib.error.HTTPError as e:
        code, loc = e.code, e.headers.get("location", "")
    if want:
        check(path + " 로그인으로 이동", code in (302, 303, 307) and want in loc, f"{code} {loc}")
    else:
        check(path + " 비로그인 차단", code in (302, 303, 307, 404), str(code))
try:
    get("/clinics/not-a-clinic")
    check("없는 병원 쪽 404", False)
except urllib.error.HTTPError as e:
    check("없는 병원 쪽 404", e.code == 404)

with sync_playwright() as p:
    br = p.chromium.launch()
    sample = ["/for-clinics", "/guides", "/guides/" + guides[4], "/", "/treatments", "/treatments/rejuran", "/treatments/rhinoplasty", "/hospitals", "/submit", "/how-prices-work"]
    for w in (320, 390, 768, 1280, 1440):
        c = br.new_context(viewport={"width": w, "height": 900})
        c.route("**/api/clinic-photo/**", lambda r: r.fulfill(status=204, body=""))
        for path in sample:
            pg = c.new_page()
            errs = []
            pg.on("pageerror", lambda e: errs.append(str(e)[:100]))
            pg.on("console", lambda m: errs.append(m.text[:100]) if m.type == "error" else None)
            pg.goto(BASE + path, wait_until="networkidle", timeout=60000)
            pg.wait_for_timeout(300)
            over = pg.evaluate("document.documentElement.scrollWidth-document.documentElement.clientWidth")
            check(f"{w} {path} 가로 넘침 0", over <= 0, str(over))
            check(f"{w} {path} 콘솔·예외 0", not errs, str(errs[:2]))
            if w in (390, 1440):
                small = pg.evaluate("""()=>[...document.querySelectorAll('main a,main button,main input,main select,header a')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&r.height<24&&!e.closest('p')&&e.type!=='hidden'}).length""")
                check(f"{w} {path} 작은 터치 영역 0", small == 0, str(small))
                nolabel = pg.evaluate("""()=>[...document.querySelectorAll('main input:not([type=hidden]),main select,main textarea')].filter(e=>!e.labels||!e.labels.length).length""")
                check(f"{w} {path} 라벨 연결", nolabel == 0, str(nolabel))
                if OUT:
                    pg.wait_for_timeout(1800)
                    n = path.strip("/").replace("/", "_") or "home"
                    pg.screenshot(path=f"{OUT}/{n}_{w}.jpg", type="jpeg", quality=60, full_page=True)
            pg.close()
        c.close()
    c = br.new_context(viewport={"width": 1440, "height": 900})
    c.route("**/api/clinic-photo/**", lambda r: r.fulfill(status=204, body=""))
    pg = c.new_page()
    seen = set()
    for path in ("/", "/treatments", "/treatments/rejuran", "/hospitals", "/how-prices-work"):
        pg.goto(BASE + path, wait_until="domcontentloaded")
        seen |= set(pg.evaluate("[...document.querySelectorAll('a[href^=\"/\"]')].map(a=>a.getAttribute('href'))"))
    fails = []
    for h in sorted(seen):
        try:
            with urllib.request.urlopen(BASE + urllib.parse.quote(h, safe="/?=&"), timeout=30) as r:
                if r.status != 200:
                    fails.append(h)
        except Exception as e:
            fails.append(f"{h} {e}")
    check(f"내부 링크 {len(seen)}개 200", not fails, str(fails[:4]))
    pg.goto(BASE + "/", wait_until="networkidle")
    check("건너뛰기 링크", pg.locator("a.skip").count() == 1)
    pg.fill("#q", "리쥬란")
    pg.keyboard.press("Enter")
    pg.wait_for_url("**/treatments?q=**")
    check("홈 검색 한글", pg.locator("a[href='/treatments/rejuran']").count() == 1)
    pg.goto(BASE + "/treatments?q=zzzz", wait_until="domcontentloaded")
    check("검색 결과 없음 안내", "Nothing matches" in pg.inner_text("main"))
    pg.goto(BASE + "/treatments?category=filler", wait_until="domcontentloaded")
    check("분류 필터", pg.locator("a[href='/treatments/dermal-filler']").count() == 1 and pg.locator("a[href='/treatments/rejuran']").count() == 0)
    pg.goto(BASE + "/hospitals?area=Myeongdong&field=skin", wait_until="domcontentloaded")
    check("명부 필터", "providers" in pg.inner_text("main") and "Gangnam Station ·" not in pg.inner_text("main"))
    # 병원 사진: 유료 호출을 막고 가짜 응답으로 시험
    calls = []
    cp = br.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    PIX = "https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png"

    def fake_photo(route):
        calls.append(route.request.url)
        n = len(calls)
        if n % 3 == 0:
            route.fulfill(status=204, body="")
        else:
            route.fulfill(status=200, content_type="application/json", body=json.dumps({"uri": PIX, "authors": [{"name": "Tester", "uri": "https://example.com/a"}]}))

    cp.route("**/api/clinic-photo/**", fake_photo)
    pc = cp.new_page()
    pc.goto(BASE + "/hospitals", wait_until="networkidle")
    pc.wait_for_timeout(800)
    first = len(calls)
    total = pc.locator(".clinic-card").count()
    check("사진은 화면에 든 카드만 요청", 0 < first < total, f"{first}/{total}")
    check("사진 표시와 출처 표기", pc.locator(".clinic-card img").count() > 0 and "Google" in pc.locator(".clinic-card small").first.inner_text())
    check("사진 없는 카드는 대체 표시", pc.locator(".clinic-photo > span").count() > 0)
    hs = pc.evaluate("[...document.querySelectorAll('.clinic-photo')].slice(0,8).map(e=>Math.round(e.getBoundingClientRect().height))")
    check("병원 사진 높이 일정", len(set(hs)) == 1, str(hs))
    before = pc.locator(".clinic-card").count()
    pc.locator("a", has_text="more").last.click()
    pc.wait_for_timeout(800)
    check("더 보기로 병원 늘어남", pc.locator(".clinic-card").count() > before)
    over = pc.evaluate("document.documentElement.scrollWidth-document.documentElement.clientWidth")
    check("병원 카드 가로 넘침 0", over <= 0, str(over))
    cp.close()
    # 서버: 승인 안 된 값은 구글을 부르지 않음
    st, _ = (lambda r: (r.status, r.read()))(urllib.request.urlopen(BASE + "/api/clinic-photo/not-a-clinic", timeout=20))
    check("없는 병원 사진 요청 204", st == 204, str(st))
    # 휴대폰 동선: 하단 탭·고정 버튼이 내용을 가리지 않는지
    cm = br.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    cm.route("**/api/clinic-photo/**", lambda r: r.fulfill(status=204, body=""))
    pm = cm.new_page()
    pm.goto(BASE + "/", wait_until="networkidle")
    check("휴대폰 하단 탭 4개", pm.locator(".tab-bar a").count() == 4)
    broken = pm.evaluate("async()=>{const r=[];for(const i of document.images){if(!i.complete)continue;if(i.naturalWidth===0)r.push(i.src)}return r}")
    check("홈 깨진 이미지 0", not broken, str(broken[:3]))
    check("탭 높이 충분", all(pm.locator(".tab-bar a").nth(i).bounding_box()["height"] >= 44 for i in range(4)))
    check("첫 화면에 검색창", pm.locator("#q").bounding_box()["y"] < 700)
    for path in ("/", "/treatments", "/treatments/rejuran", "/guides", "/hospitals", "/how-prices-work"):
        pm.goto(BASE + path, wait_until="domcontentloaded")
        left = pm.evaluate("""()=>Math.min(...[...document.querySelectorAll('main h1,main h2,main p,main li')].filter(e=>e.getBoundingClientRect().width>0&&!e.closest('.sr-only')&&!e.closest('.quote-bar')).map(e=>e.getBoundingClientRect().left))""")
        check(f"{path} 휴대폰 좌우 여백", left >= 16, str(left))
    pm.goto(BASE + "/", wait_until="networkidle")
    pm.evaluate("scrollTo(0, document.documentElement.scrollHeight)")
    pm.wait_for_timeout(300)
    gap = pm.evaluate("""()=>{const f=document.querySelector('.site-foot p:last-child').getBoundingClientRect();const t=document.querySelector('.tab-bar').getBoundingClientRect();return t.top-f.bottom}""")
    check("맨 아래 바닥글이 탭에 안 가림", gap >= 0, str(gap))
    for path, sel in (("/treatments/rejuran", ".quote-bar"), ("/guides/" + guides[0], ".quote-bar")):
        pm.goto(BASE + path, wait_until="networkidle")
        check(path + " 고정 상담 버튼", pm.locator(sel).is_visible())
        check(path + " 하단 탭 대신 표시", pm.locator(".tab-bar").count() == 0)
        pm.evaluate("scrollTo(0, document.documentElement.scrollHeight)")
        pm.wait_for_timeout(300)
        gap = pm.evaluate("""()=>{const f=document.querySelector('.site-foot p:last-child').getBoundingClientRect();const t=document.querySelector('.quote-bar').getBoundingClientRect();return t.top-f.bottom}""")
        check(path + " 맨 아래가 버튼에 안 가림", gap >= 0, str(gap))
    pm.goto(BASE + "/treatments/rejuran", wait_until="networkidle")
    for i in range(3):
        check(f"상담 버튼 {i} 높이", pm.locator(".quote-bar a").nth(i).bounding_box()["height"] >= 40)
    check("확대 막지 않음", "maximum-scale" not in (pm.get_attribute("meta[name=viewport]", "content") or ""))
    cm.close()
    # 숫자 띠 끝 상태
    pg.goto(BASE + "/treatments/rejuran", wait_until="networkidle")
    pg.wait_for_timeout(3000)
    check("숫자 효과 뒤 일반 글자로 복귀", pg.locator(".odo-col").count() == 0)
    want = pg.locator(".odo .sr-only").first.inner_text()
    shown = pg.locator(".odo > span[aria-hidden]").first.inner_text()
    check("숫자 효과 뒤 금액 일치", want == shown, f"{want} / {shown}")
    # 화면 밖 카드도 실제 금액이어야 한다
    pg.goto(BASE + "/", wait_until="domcontentloaded")
    pg.wait_for_timeout(500)
    bad_zero = pg.evaluate("""()=>[...document.querySelectorAll('.odo > span[aria-hidden]')].filter(e=>{const r=e.getBoundingClientRect();return r.top>innerHeight&&e.textContent!==e.parentElement.querySelector('.sr-only').textContent}).length""")
    check("화면 밖 금액이 실제 값", bad_zero == 0, str(bad_zero))
    # 좌우 여백
    pad = pg.evaluate("""()=>[...document.querySelectorAll('main section h2,main h1')].map(e=>e.getBoundingClientRect().left)""")
    check("제목 왼쪽 여백 16px 이상(1440)", min(pad) >= 16, str(min(pad)))
    check("숫자 띠 글자 읽힘", "₩" in pg.locator(".odo .sr-only").first.inner_text())
    # 폼: 동의 칸 비어 있음, 빈 제출 막힘
    pg.goto(BASE + "/for-clinics", wait_until="networkidle")
    check("입점 동의 칸 비어 있음", not pg.is_checked("input[name=consent]"))
    check("트래픽 약속 없음", "no traffic figures" in pg.inner_text("main"))
    pg.goto(BASE + "/submit?treatment=rejuran", wait_until="networkidle")
    check("시술 미리 선택", pg.input_value("#treatment") == "rejuran")
    check("동의 칸 비어 있음", not pg.is_checked("input[name=consent]"))
    pg.click("button[type=submit]")
    pg.wait_for_timeout(300)
    check("빈 제출 브라우저에서 막힘", "/submit" in pg.url and "error" not in pg.url)
    pg.goto(BASE + "/submit?error=consent", wait_until="domcontentloaded")
    check("오류 안내 표시", pg.locator("main [role=alert]").count() == 1)
    pg.goto(BASE + "/submit?success=1", wait_until="domcontentloaded")
    check("완료 화면", "We received" in pg.inner_text("main"))
    # 움직임 줄이기
    c2 = br.new_context(viewport={"width": 390, "height": 844}, reduced_motion="reduce")
    p2 = c2.new_page()
    p2.goto(BASE + "/treatments/rejuran", wait_until="networkidle")
    check("움직임 줄이기: 숫자 띠 없음", p2.locator(".odo-col").count() == 0)
    p2.goto(BASE + "/", wait_until="networkidle")
    check("움직임 줄이기: 제목 애니메이션 없음", p2.locator(".word-title.on").count() == 0)
    c2.close()
    br.close()

for x in bad:
    print("FAIL", x)
print(f"PASS {len(ok)} / FAIL {len(bad)}")
sys.exit(1 if bad else 0)
