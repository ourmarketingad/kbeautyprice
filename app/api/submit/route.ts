import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const treatment = formData.get("treatment")?.toString() ?? "";
    const spec = formData.get("spec")?.toString() ?? "";
    const usd = parseFloat(formData.get("usd")?.toString() ?? "0");
    const krw = formData.get("krw")?.toString() ? parseFloat(formData.get("krw")!.toString()) : null;
    const year = parseInt(formData.get("year")?.toString() ?? "2026");
    const notes = formData.get("notes")?.toString() ?? "";

    if (!treatment || !usd) {
      return NextResponse.redirect(new URL("/submit?error=missing", req.url));
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("submissions").insert({
      user_id: user?.id ?? null,
      treatment,
      spec: spec || null,
      usd_paid: usd,
      krw_paid: krw,
      year_of_visit: year,
      notes: notes || null,
      status: "pending",
    });

    if (error) {
      console.error("[submit] DB error:", error);
      return NextResponse.redirect(new URL("/submit?error=server", req.url));
    }

    return NextResponse.redirect(new URL("/submit?success=1", req.url));
  } catch (e) {
    console.error("[submit] error:", e);
    return NextResponse.redirect(new URL("/submit?error=server", req.url));
  }
}
