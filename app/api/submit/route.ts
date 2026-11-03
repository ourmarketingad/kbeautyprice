import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const treatment = formData.get("treatment")?.toString() ?? "";
    const spec = formData.get("spec")?.toString() ?? "";
    const usd = formData.get("usd")?.toString() ?? "";
    const krw = formData.get("krw")?.toString() ?? "";
    const year = formData.get("year")?.toString() ?? "";
    const notes = formData.get("notes")?.toString() ?? "";

    if (!treatment || !usd) {
      return NextResponse.redirect(new URL("/submit?error=missing", req.url));
    }

    // TODO: persist to Supabase when configured
    // For now just log server-side and acknowledge
    console.log("[KBeautyPrice submission]", { treatment, spec, usd, krw, year, notes });

    return NextResponse.redirect(new URL("/submit?success=1", req.url));
  } catch {
    return NextResponse.redirect(new URL("/submit?error=server", req.url));
  }
}
