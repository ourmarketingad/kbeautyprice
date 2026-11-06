import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isEmail } from "@/lib/listing";

const back = (req: NextRequest, q: string) =>
  NextResponse.redirect(new URL("/for-clinics?" + q + "#apply", req.url), 303);
const text = (v: FormDataEntryValue | null, max: number) =>
  (v?.toString() ?? "").trim().slice(0, max);

export async function POST(req: NextRequest) {
  try {
    const f = await req.formData();
    // 로봇 차단용 숨은 칸. 채워져 있으면 저장하지 않고 성공처럼 보낸다.
    if (text(f.get("website"), 10)) return back(req, "sent=1");
    const clinic_name = text(f.get("clinic"), 120);
    const contact_name = text(f.get("name"), 80);
    const email = text(f.get("email"), 200);
    const phone = text(f.get("phone"), 40);
    const note = text(f.get("note"), 1000);
    if (clinic_name.length < 2 || !contact_name) return back(req, "error=missing");
    if (!isEmail(email)) return back(req, "error=email");
    if (phone && !/^[+\d][\d\s()-]{6,}$/.test(phone)) return back(req, "error=phone");
    if (f.get("consent") !== "yes") return back(req, "error=consent");
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return back(req, "error=server");
    const sb = await createClient();
    const { error } = await sb.from("clinic_applications").insert({
      clinic_name,
      contact_name,
      email: email.toLowerCase(),
      phone: phone || null,
      note: note || null,
    });
    if (error) {
      console.error("[clinic-apply] 저장 실패:", error.code);
      return back(req, "error=server");
    }
    return back(req, "sent=1");
  } catch {
    return back(req, "error=server");
  }
}
