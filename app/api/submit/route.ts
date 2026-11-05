import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { treatments } from "@/data/treatments";

const back = (req: NextRequest, q: string) =>
  NextResponse.redirect(new URL("/submit?" + q, req.url), 303);
const num = (v: FormDataEntryValue | null) => {
  const n = Number(v?.toString().trim() ?? "");
  return Number.isFinite(n) && n > 0 ? n : null;
};
const clean = (v: FormDataEntryValue | null, max: number) =>
  (v?.toString() ?? "").trim().slice(0, max) || null;

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const treatment = form.get("treatment")?.toString() ?? "";
    const known = treatment === "other" || treatments.some((t) => t.slug === treatment);
    const usd = num(form.get("usd"));
    const krw = num(form.get("krw"));
    if (!known || (!usd && !krw)) return back(req, "error=missing");
    if ((usd && usd > 200000) || (krw && (krw < 1000 || krw > 300000000)))
      return back(req, "error=price");
    if (form.get("consent") !== "yes") return back(req, "error=consent");
    const year = Number(form.get("year"));
    if (![2024, 2025, 2026].includes(year)) return back(req, "error=missing");
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return back(req, "error=server");

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase.from("submissions").insert({
      user_id: user?.id ?? null,
      treatment,
      spec: clean(form.get("spec"), 120),
      usd_paid: usd ?? Math.round((krw as number) / 1400),
      krw_paid: krw,
      year_of_visit: year,
      notes: clean(form.get("notes"), 500),
      status: "pending",
    });
    if (error) {
      console.error("[submit] 저장 실패:", error.code);
      return back(req, "error=server");
    }
    return back(req, "success=1");
  } catch {
    return back(req, "error=server");
  }
}
