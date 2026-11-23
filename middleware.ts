import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";
import { detectBot, pageKind } from "@/lib/bots";

// 로봇 방문 한 줄을 bot_hits 표에 남긴다.
// 응답을 붙잡아 두지 않으려고 기다리지 않고 보낸다(waitUntil 로 응답 뒤에 마무리).
// 실패해도 사이트에는 영향이 없다 — 세는 일이 사람 보는 쪽을 막으면 안 된다.
function logBotHit(request: NextRequest, event: NextFetchEvent) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return;

  const bot = detectBot(request.headers.get("user-agent"));
  if (!bot) return;

  const { pathname } = request.nextUrl;
  const { kind, lang } = pageKind(pathname);

  event.waitUntil(
    fetch(`${url}/rest/v1/bot_hits`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        bot: bot.name,
        bot_group: bot.group,
        page_kind: kind,
        path: pathname.slice(0, 300),
        lang,
      }),
    }).catch(() => {})
  );
}

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  let supabaseResponse = NextResponse.next({ request });
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return supabaseResponse;

  logBotHit(request, event);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.getUser();
  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
