# 입점 흐름 시험. 운영 저장소 대신 가짜 서버를 써서 신청→승인→가격 등록→공개까지 실제 화면으로 돌린다.
# 권한 규칙 자체는 여기서 시험하지 않는다(가짜 서버라서). 권한은 데이터베이스에서 따로 시험한다.
# 사용: python -X utf8 qa/listing_flow.py [캡처폴더]  (4471·54399 포트, next dev 를 직접 띄움)
import base64, json, os, re, subprocess, sys, threading, time, urllib.parse, urllib.request, uuid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8")
OUT = sys.argv[1] if len(sys.argv) > 1 else ""
MOCK = 54399
# 4471 을 다른 프로젝트 서버가 쓰고 있을 때 QA_PORT 로 바꿔 돌린다(2026-11-07, comedi 가 4471 사용).
PORT = int(os.environ.get("QA_PORT", "4471"))
BASE = f"http://127.0.0.1:{PORT}"
ok, bad = [], []


def check(n, c, info=""):
    (ok if c else bad).append(n + (f" | {info}" if info and not c else ""))


DB = {"clinic_applications": [], "clinics": [], "clinic_items": []}
FAIL = {"apply": False}
USERS = {"owner": "owner@example.test", "admin": "admin@example.test", "other": "other@example.test"}


def jwt(sub):
    b = lambda d: base64.urlsafe_b64encode(json.dumps(d).encode()).rstrip(b"=").decode()
    return f'{b({"alg":"none"})}.{b({"sub":sub,"exp":int(time.time())+86400,"role":"authenticated","aud":"authenticated"})}.x'


def user(sub):
    return {"id": sub, "aud": "authenticated", "role": "authenticated", "email": USERS.get(sub, "x@example.test"), "app_metadata": {}, "user_metadata": {}, "created_at": "2026-01-01T00:00:00Z"}


def match(row, q):
    for k, v in q.items():
        if k in ("select", "order", "columns", "limit"):
            continue
        v = v[0]
        if v.startswith("eq."):
            if str(row.get(k)) != v[3:]:
                return False
        elif v.startswith("in."):
            if str(row.get(k)) not in v[3:].strip("()").replace('"', "").split(","):
                return False
    return True


class H(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def send(self, code, body=None):
        d = json.dumps(body).encode() if body is not None else b""
        self.send_response(code)
        self.send_header("content-type", "application/json")
        self.send_header("content-length", str(len(d)))
        self.send_header("access-control-allow-origin", "*")
        self.send_header("access-control-allow-headers", "*")
        self.send_header("access-control-allow-methods", "*")
        self.end_headers()
        self.wfile.write(d)

    def who(self):
        m = re.match(r"Bearer (.+)", self.headers.get("authorization", ""))
        if not m:
            return None
        try:
            p = m.group(1).split(".")[1]
            return json.loads(base64.urlsafe_b64decode(p + "==")).get("sub")
        except Exception:
            return None

    def handle_any(self):
        n = int(self.headers.get("content-length") or 0)
        data = json.loads(self.rfile.read(n) or b"null") if n else None
        u = urllib.parse.urlparse(self.path)
        q = urllib.parse.parse_qs(u.query)
        p = u.path
        if p == "/auth/v1/user":
            s = self.who()
            return self.send(200, user(s)) if s in USERS else self.send(401, {"message": "no"})
        if p == "/rest/v1/rpc/is_admin":
            return self.send(200, self.who() == "admin")
        t = p.replace("/rest/v1/", "")
        if t not in DB:
            return self.send(404, {})
        anon = self.who() is None
        if self.command == "GET":
            rows = [r for r in DB[t] if match(r, q)]
            # 공개 조회는 공개된 것만(운영 규칙과 같게)
            if anon and t == "clinics":
                rows = [r for r in rows if r["status"] == "published"]
            if anon and t == "clinic_items":
                pub = {c["id"]: c for c in DB["clinics"] if c["status"] == "published"}
                rows = [dict(r, clinics=pub[r["clinic_id"]]) for r in rows if r["status"] == "published" and r["clinic_id"] in pub]
            if "vnd.pgrst.object" in self.headers.get("accept", ""):
                return self.send(200, rows[0]) if rows else self.send(406, {"code": "PGRST116", "message": "none"})
            return self.send(200, rows)
        if self.command == "POST":
            if t == "clinic_applications" and FAIL["apply"]:
                return self.send(500, {"code": "XX000", "message": "fail"})
            for r in data if isinstance(data, list) else [data]:
                r = dict(r, id=str(uuid.uuid4()))
                r.setdefault("status", {"clinics": "draft"}.get(t, "pending"))
                for k in ("reject_reason", "intro", "area", "name_ko"):
                    r.setdefault(k, None)
                r.setdefault("registry_checked", False)
                r.setdefault("agreement_signed", False)
                # 데이터베이스의 할인 5요소 규칙과 같게
                if t == "clinic_items" and r.get("kind") == "event" and not (r.get("list_price_krw") and r["list_price_krw"] > r["price_krw"] and r.get("event_until") and r.get("event_target") and r.get("event_terms")):
                    return self.send(400, {"code": "23514", "message": "check"})
                DB[t].append(r)
            return self.send(201)
        if self.command == "PATCH":
            for r in DB[t]:
                if match(r, q):
                    r.update(data)
            return self.send(204)
        if self.command == "DELETE":
            DB[t][:] = [r for r in DB[t] if not match(r, q)]
            return self.send(204)

    def do_OPTIONS(self):
        self.send(204)

    do_GET = do_POST = do_PATCH = do_DELETE = handle_any


threading.Thread(target=ThreadingHTTPServer(("127.0.0.1", MOCK), H).serve_forever, daemon=True).start()
env = dict(os.environ, NEXT_PUBLIC_SUPABASE_URL=f"http://127.0.0.1:{MOCK}", NEXT_PUBLIC_SUPABASE_ANON_KEY="test-key")
srv = subprocess.Popen(f"npx next dev -p {PORT} -H 127.0.0.1", shell=True, env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
for _ in range(120):
    try:
        urllib.request.urlopen(BASE + "/for-clinics", timeout=60)
        break
    except Exception:
        time.sleep(1)


def cookie(sub):
    s = {"access_token": jwt(sub), "refresh_token": "r", "token_type": "bearer", "expires_in": 86400, "expires_at": int(time.time()) + 86400, "user": user(sub)}
    v = "base64-" + base64.urlsafe_b64encode(json.dumps(s).encode()).rstrip(b"=").decode()
    return {"name": "sb-127-auth-token", "value": v, "url": BASE}


def over(pg, path):
    r = {}
    for w in (320, 390, 768, 1440):
        pg.set_viewport_size({"width": w, "height": 800})
        pg.goto(BASE + path, wait_until="networkidle")
        r[w] = pg.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
    pg.set_viewport_size({"width": 390, "height": 800})
    return r


def shot(pg, name):
    if OUT:
        os.makedirs(OUT, exist_ok=True)
        pg.screenshot(path=f"{OUT}/{name}.png", full_page=True)


try:
    with sync_playwright() as p:
        br = p.chromium.launch()

        def ctx(sub=None):
            c = br.new_context(viewport={"width": 390, "height": 800})
            if sub:
                c.add_cookies([cookie(sub)])
            pg = c.new_page()
            errs = []
            pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.on("console", lambda m: errs.append(m.text) if m.type == "error" and "404" not in m.text else None)
            pg.errs = errs
            return pg

        # 1. 신청
        a = ctx()
        a.goto(BASE + "/for-clinics", wait_until="networkidle")
        shot(a, "for-clinics")
        form_btn = "form.form button[type=submit]"
        a.click(form_btn)
        check("빈 신청은 브라우저에서 막힘", a.url.endswith("/for-clinics") and not DB["clinic_applications"])

        def fill(pg):
            pg.fill("#clinic", "시험의원")
            pg.fill("#name", "담당자")
            pg.fill("#email", "owner@example.test")
            pg.check("input[name=consent]")

        FAIL["apply"] = True
        fill(a)
        a.click(form_btn)
        a.wait_for_url("**error=server**")
        check("저장 실패 안내", "could not save" in a.inner_text("main"))
        check("저장 실패 때 쌓이지 않음", len(DB["clinic_applications"]) == 0)
        FAIL["apply"] = False
        fill(a)
        a.fill("#phone", "abc")
        a.click(form_btn)
        a.wait_for_url("**error=phone**")
        check("전화 형식 안내", "valid phone" in a.inner_text("main"))
        fill(a)
        a.fill("#note", "메모")
        a.dblclick(form_btn)
        a.wait_for_url("**sent=1**")
        a.wait_for_load_state("networkidle")
        check("신청 완료 안내", "received your application" in a.inner_text("main"))
        check("중복 클릭해도 1건", len(DB["clinic_applications"]) == 1, str(len(DB["clinic_applications"])))
        check("신청 내용 저장", bool(DB["clinic_applications"]) and DB["clinic_applications"][0]["email"] == "owner@example.test")
        shot(a, "for-clinics-sent")
        # 2. 권한 화면
        o = ctx("owner")
        o.goto(BASE + "/manage", wait_until="networkidle")
        check("승인 전 병원은 연결 없음 안내", "No listing is linked" in o.inner_text("main"))
        r = o.goto(BASE + "/admin")
        check("병원 계정은 운영자 화면 404", r.status == 404, str(r.status))
        a2 = ctx()
        a2.goto(BASE + "/manage", wait_until="networkidle")
        check("비로그인 관리 화면은 로그인으로", "/auth?next=/manage" in a2.url or "/auth?next=%2Fmanage" in a2.url, a2.url)
        a2.goto(BASE + "/admin", wait_until="networkidle")
        check("비로그인 운영자 화면은 로그인으로", "/auth?next=/admin" in a2.url or "/auth?next=%2Fadmin" in a2.url, a2.url)
        # 3. 운영자 승인
        d = ctx("admin")
        d.goto(BASE + "/admin", wait_until="networkidle")
        shot(d, "admin-app")
        check("운영자가 신청을 봄", "시험의원" in d.inner_text("main"))
        d.fill("input[name=name_en]", "Test Clinic")
        d.click("text=Approve and create listing")
        d.wait_for_function("document.body.innerText.includes('Clinics to review (1)')")
        check("승인하면 병원 생성", len(DB["clinics"]) == 1 and DB["clinics"][0]["status"] == "draft")
        check("신청 상태 승인", DB["clinic_applications"][0]["status"] == "approved")
        c = DB["clinics"][0]
        check("주소 형식", re.fullmatch(r"test-clinic-[0-9a-f]{6}", c["slug"]) is not None, c["slug"])
        # 4. 병원 입력
        o.goto(BASE + "/manage", wait_until="networkidle")
        check("병원 관리 화면 표시", "Test Clinic" in o.inner_text("main"))
        o.fill("textarea[name=intro]", "The best clinic in Gangnam.")
        o.fill("input[name=area]", "Gangnam")
        o.click("text=Save and send for review")
        o.wait_for_url("**saved=1**")
        o.wait_for_load_state("networkidle")
        check("저장하면 검토 대기", DB["clinics"][0]["status"] == "pending")
        o.select_option("select[name=treatment]", "rejuran")
        o.fill("input[name=title]", "Rejuran Healer, 2cc")
        o.fill("input[name=price]", "350000")
        o.click("text=Add item")
        o.wait_for_function("document.body.innerText.includes('Rejuran Healer, 2cc')")
        check("가격 추가", len(DB["clinic_items"]) == 1 and DB["clinic_items"][0]["status"] == "pending", str(DB["clinic_items"]))
        check("가격 검토 대기 표시", "Waiting for review" in o.inner_text("main"))
        o.select_option("select[name=treatment]", "rejuran")
        o.fill("input[name=title]", "Event no terms")
        o.fill("input[name=price]", "300000")
        o.select_option("select[name=kind]", "event")
        o.click("text=Add item")
        o.wait_for_url("**error=item**")
        o.wait_for_load_state("networkidle")
        check("할인 요소 빠지면 거절", len(DB["clinic_items"]) == 1 and "could not save that item" in o.inner_text("main"))
        o.select_option("select[name=treatment]", "rejuran")
        o.fill("input[name=title]", "Rejuran event")
        o.fill("input[name=price]", "300000")
        o.select_option("select[name=kind]", "event")
        o.fill("input[name=list_price]", "350000")
        o.fill("input[name=until]", "2030-01-31")
        o.fill("input[name=target]", "First visit")
        o.fill("input[name=terms]", "One per person")
        o.click("text=Add item")
        o.wait_for_function("document.body.innerText.includes('Rejuran event')")
        check("할인 요소 다 있으면 등록", len(DB["clinic_items"]) == 2, str(len(DB["clinic_items"])))
        shot(o, "manage")
        check("목록 점 없음", o.evaluate("getComputedStyle(document.querySelector('.price-panels')).listStyleType") == "none")
        check("행사 칸은 평소 숨김", not o.is_visible("input[name=list_price]"))
        o.select_option("select[name=kind]", "event")
        check("행사 가격 고르면 칸 표시", o.is_visible("input[name=list_price]"))
        o.select_option("select[name=kind]", "list")
        # 5. 공개 전 차단
        a3 = ctx()
        r = a3.goto(BASE + f"/clinics/{c['slug']}")
        check("승인 전 병원 쪽은 404", r.status == 404, str(r.status))
        # 6. 운영자 검토
        d.goto(BASE + "/admin", wait_until="networkidle")
        shot(d, "admin-review")
        check("과장 표현 경고", "Check these words: best" in d.inner_text("main"), d.inner_text("main")[:300])
        pub = d.locator("form:has(input[name=registry]) button[value=publish]")
        pub.click()
        d.wait_for_url("**error=checks**")
        d.wait_for_load_state("networkidle")
        check("명부·동의서 없이 공개 불가", DB["clinics"][0]["status"] == "pending" and "Not published" in d.inner_text("main"))
        d.locator("input[name=reason]").first.fill("Remove the word best.")
        d.locator("form:has(input[name=registry]) button[value=reject]").click()
        d.wait_for_function("document.body.innerText.includes('Clinics to review (0)')")
        check("되돌리기", DB["clinics"][0]["status"] == "rejected")
        o.goto(BASE + "/manage", wait_until="networkidle")
        check("되돌린 이유 표시", "Remove the word best" in o.inner_text("main"))
        o.fill("textarea[name=intro]", "A clinic in Gangnam.")
        o.click("text=Save and send for review")
        o.wait_for_url("**saved=1**")
        o.wait_for_load_state("networkidle")
        d.goto(BASE + "/admin", wait_until="networkidle")
        d.check("input[name=registry]")
        d.check("input[name=signed]")
        pub.click()
        d.wait_for_function("document.body.innerText.includes('Clinics to review (0)')")
        check("확인 뒤 공개", DB["clinics"][0]["status"] == "published" and DB["clinics"][0]["agreement_signed"])
        for want in (1, 0):
            d.goto(BASE + "/admin", wait_until="networkidle")
            d.locator("form:has(input[name=reason]) button[value=publish]").first.click()
            d.wait_for_function(f"document.body.innerText.includes('Prices to review ({want})')")
        check("가격 공개", all(i["status"] == "published" for i in DB["clinic_items"]), str([i["status"] for i in DB["clinic_items"]]))
        # 7. 공개 쪽
        a3.goto(BASE + f"/clinics/{c['slug']}", wait_until="networkidle")
        t = a3.inner_text("main")
        shot(a3, "clinic-page")
        check("공개 쪽 병원명·금액", "Test Clinic" in t and "350,000" in t, t[:200])
        check("광고 표시", "Advertising information" in t)
        check("할인 5요소 표시", all(s in t for s in ("Regular", "2030-01-31", "First visit", "One per person")))
        check("견적 안내", "written quote" in t)
        a3.goto(BASE + "/treatments/rejuran", wait_until="networkidle")
        t = a3.inner_text("main")
        shot(a3, "treatment-listed")
        check("시술 쪽 병원 제공 가격 구역", "Prices provided by clinics" in t and "Test Clinic" in t, t[:200])
        a3.goto(BASE + "/treatments/botox", wait_until="networkidle")
        check("다른 시술에 안 섞임", "Prices provided by clinics" not in a3.inner_text("main"))
        # 8. 삭제
        o.goto(BASE + "/manage", wait_until="networkidle")
        o.click("text=Delete Rejuran event")
        o.wait_for_function("!document.body.innerText.includes('Delete Rejuran event')")
        check("가격 삭제", len(DB["clinic_items"]) == 1)
        # 9. 넘침·콘솔
        for name, pg, path in (("입점 안내", a3, "/for-clinics"), ("병원 쪽", a3, f"/clinics/{c['slug']}"), ("관리", o, "/manage"), ("운영자", d, "/admin")):
            r = over(pg, path)
            check(name + " 가로 넘침 없음", all(v <= 0 for v in r.values()), str(r))
        lab = o.evaluate("[...document.querySelectorAll('main input:not([type=hidden]),main select,main textarea')].filter(e=>!e.closest('label')&&!(e.id&&document.querySelector(`label[for=\"${e.id}\"]`))).length")
        check("관리 화면 입력칸 라벨", lab == 0, str(lab))
        for n, pg in (("방문자", a), ("병원", o), ("운영자", d)):
            check(n + " 콘솔 오류 없음", not pg.errs, str(pg.errs[:2]))
        br.close()
except Exception as e:
    bad.append("중단: " + str(e)[:400])
finally:
    subprocess.run(f"taskkill /F /T /PID {srv.pid}", shell=True, capture_output=True)
print("\n".join("FAIL " + b for b in bad))
print(f"PASS {len(ok)} / FAIL {len(bad)}")
sys.exit(1 if bad else 0)
