import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { lintText, toSlug, type ClinicRow, type ItemRow } from "@/lib/listing";
import { won } from "@/lib/prices";

// 운영자 화면. 권한은 데이터베이스 규칙(is_admin)이 막고, 화면도 운영자가 아니면 없는 쪽으로 처리한다.
export const metadata: Metadata = {
  title: "Listings admin",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

type App = {
  id: string;
  clinic_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  note: string | null;
  status: string;
  created_at: string;
};

async function guard() {
  const sb = await createClient();
  const { data } = await sb.rpc("is_admin");
  if (data !== true) notFound();
  return sb;
}

async function approveApp(form: FormData) {
  "use server";
  const sb = await guard();
  const id = String(form.get("id"));
  const { data: app } = await sb.from("clinic_applications").select("*").eq("id", id).single();
  if (!app) return;
  const base = toSlug(String(form.get("name_en") ?? "")) || "clinic";
  const { error } = await sb.from("clinics").insert({
    slug: `${base}-${id.slice(0, 6)}`,
    owner_email: app.email,
    name_en: String(form.get("name_en")).slice(0, 120),
    name_ko: app.clinic_name,
  });
  if (!error) await sb.from("clinic_applications").update({ status: "approved" }).eq("id", id);
  revalidatePath("/admin");
}
async function rejectApp(form: FormData) {
  "use server";
  const sb = await guard();
  await sb.from("clinic_applications").update({ status: "rejected" }).eq("id", String(form.get("id")));
  revalidatePath("/admin");
}
async function reviewClinic(form: FormData) {
  "use server";
  const sb = await guard();
  const publish = form.get("action") === "publish";
  const registry = form.get("registry") === "yes";
  const signed = form.get("signed") === "yes";
  // 등록 명부 확인과 서명된 동의서가 모두 있어야 공개할 수 있다.
  if (publish && !(registry && signed)) redirect("/admin?error=checks");
  await sb
    .from("clinics")
    .update({
      registry_checked: registry,
      agreement_signed: signed,
      status: publish ? "published" : "rejected",
      reject_reason: publish ? null : String(form.get("reason") ?? "").slice(0, 500) || "Please review and resubmit.",
    })
    .eq("id", String(form.get("id")));
  revalidatePath("/admin");
}
async function reviewItem(form: FormData) {
  "use server";
  const sb = await guard();
  const publish = form.get("action") === "publish";
  await sb
    .from("clinic_items")
    .update({
      status: publish ? "published" : "rejected",
      reject_reason: publish ? null : String(form.get("reason") ?? "").slice(0, 500) || "Please review and resubmit.",
    })
    .eq("id", String(form.get("id")));
  revalidatePath("/admin");
}

function Lint({ words }: { words: string[] }) {
  if (!words.length) return null;
  return (
    <p className="alert">Check these words: {words.join(", ")}. A pass here is not legal clearance.</p>
  );
}

type Props = { searchParams: Promise<{ error?: string }> };

export default async function Admin({ searchParams }: Props) {
  const { error } = await searchParams;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) notFound();
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/auth?next=/admin");
  const { data: ok } = await sb.rpc("is_admin");
  if (ok !== true) notFound();
  const [{ data: a }, { data: c }, { data: i }] = await Promise.all([
    sb.from("clinic_applications").select("*").eq("status", "pending").order("created_at"),
    sb.from("clinics").select("*").in("status", ["pending", "draft"]).order("updated_at"),
    sb.from("clinic_items").select("*").eq("status", "pending").order("updated_at"),
  ]);
  const apps = (a ?? []) as App[];
  const clinics = (c ?? []) as ClinicRow[];
  const items = (i ?? []) as ItemRow[];
  return (
    <div className="narrow">
      <h1>Listings admin</h1>
      <p className="note">
        Do not publish until legal review is done and the clinic has signed the
        agreement. See <Link href="/how-prices-work">how prices work</Link>.
      </p>
      {error === "checks" && (
        <p className="alert" role="alert">
          Not published. Tick both the registry check and the signed agreement first.
        </p>
      )}
      <h2>Applications ({apps.length})</h2>
      {apps.map((x) => (
        <section key={x.id} className="cta-band" style={{ display: "block" }}>
          <p>
            <strong>{x.clinic_name}</strong>
            {x.contact_name} · {x.email} {x.phone && `· ${x.phone}`}
          </p>
          {x.note && <p className="note">{x.note}</p>}
          <form action={approveApp} className="form">
            <input type="hidden" name="id" value={x.id} />
            <div className="field">
              <label htmlFor={`e-${x.id}`}>Clinic name in English</label>
              <input id={`e-${x.id}`} name="name_en" required minLength={2} />
            </div>
            <button className="btn" type="submit">Approve and create listing</button>
          </form>
          <form action={rejectApp}>
            <input type="hidden" name="id" value={x.id} />
            <button className="btn-line" style={{ marginTop: 8, background: "none", cursor: "pointer" }} type="submit">
              Reject {x.clinic_name}
            </button>
          </form>
        </section>
      ))}
      <h2>Clinics to review ({clinics.length})</h2>
      {clinics.map((x) => (
        <section key={x.id} className="cta-band" style={{ display: "block" }}>
          <p>
            <strong>{x.name_en}</strong>
            {x.name_ko} · {x.area} · {x.owner_email} · {x.status}
          </p>
          <p>{x.intro}</p>
          <Lint words={lintText(x.intro)} />
          <form action={reviewClinic} className="form">
            <input type="hidden" name="id" value={x.id} />
            <label className="check">
              <input type="checkbox" name="registry" value="yes" defaultChecked={x.registry_checked} />
              <span>Checked on the foreign patient registry</span>
            </label>
            <label className="check">
              <input type="checkbox" name="signed" value="yes" defaultChecked={x.agreement_signed} />
              <span>Signed listing agreement received</span>
            </label>
            <div className="field">
              <label htmlFor={`r-${x.id}`}>Reason, if sending back</label>
              <input id={`r-${x.id}`} name="reason" maxLength={500} />
            </div>
            <div className="chips" style={{ marginTop: 0 }}>
              <button className="btn" name="action" value="publish" type="submit">Publish</button>
              <button className="btn-line" name="action" value="reject" type="submit" style={{ background: "none", cursor: "pointer" }}>Send back</button>
            </div>
          </form>
        </section>
      ))}
      <h2>Prices to review ({items.length})</h2>
      {items.map((x) => (
        <section key={x.id} className="cta-band" style={{ display: "block" }}>
          <p>
            <strong>{x.title}</strong>
            {won(x.price_krw)} · {x.kind} · VAT {x.vat} · {x.treatment_slug}
          </p>
          {x.kind === "event" && (
            <p className="note">
              Regular {x.list_price_krw && won(x.list_price_krw)} · until {x.event_until} · {x.event_target} · {x.event_terms}
            </p>
          )}
          <Lint words={lintText(`${x.title} ${x.event_target ?? ""} ${x.event_terms ?? ""}`)} />
          <form action={reviewItem} className="form">
            <input type="hidden" name="id" value={x.id} />
            <div className="field">
              <label htmlFor={`ir-${x.id}`}>Reason, if sending back</label>
              <input id={`ir-${x.id}`} name="reason" maxLength={500} />
            </div>
            <div className="chips" style={{ marginTop: 0 }}>
              <button className="btn" name="action" value="publish" type="submit">Publish</button>
              <button className="btn-line" name="action" value="reject" type="submit" style={{ background: "none", cursor: "pointer" }}>Send back</button>
            </div>
          </form>
        </section>
      ))}
    </div>
  );
}
