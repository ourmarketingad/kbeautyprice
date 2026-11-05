import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { treatments } from "@/data/treatments";
import { createClient } from "@/lib/supabase/server";
import type { ClinicRow, ItemRow } from "@/lib/listing";
import { won } from "@/lib/prices";

export const metadata: Metadata = {
  title: "Manage your listing",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const STATUS: Record<string, string> = {
  draft: "Not submitted",
  pending: "Waiting for review",
  published: "Live",
  rejected: "Changes needed",
};
const int = (v: FormDataEntryValue | null) => {
  const n = Number(v?.toString().trim());
  return Number.isInteger(n) && n > 0 ? n : null;
};
const str = (v: FormDataEntryValue | null, max: number) =>
  (v?.toString() ?? "").trim().slice(0, max) || null;

async function saveClinic(form: FormData) {
  "use server";
  const sb = await createClient();
  // 내용을 고치면 다시 검토받는다. 권한은 데이터베이스 규칙이 막는다.
  const { error } = await sb
    .from("clinics")
    .update({
      name_en: str(form.get("name_en"), 120),
      name_ko: str(form.get("name_ko"), 120),
      area: str(form.get("area"), 60),
      intro: str(form.get("intro"), 1200),
      status: "pending",
      reject_reason: null,
    })
    .eq("id", String(form.get("id")));
  if (error) redirect("/manage?error=clinic");
  revalidatePath("/manage");
  redirect("/manage?saved=1");
}

async function addItem(form: FormData) {
  "use server";
  const kind = form.get("kind") === "event" ? "event" : "list";
  const price = int(form.get("price"));
  const title = str(form.get("title"), 120);
  const treatment = str(form.get("treatment"), 60);
  if (!price || !title || !treatment) redirect("/manage?error=item");
  const sb = await createClient();
  const { error } = await sb.from("clinic_items").insert({
    clinic_id: String(form.get("clinic_id")),
    treatment_slug: treatment,
    title,
    price_krw: price,
    kind,
    list_price_krw: kind === "event" ? int(form.get("list_price")) : null,
    event_until: kind === "event" ? str(form.get("until"), 10) : null,
    event_target: kind === "event" ? str(form.get("target"), 120) : null,
    event_terms: kind === "event" ? str(form.get("terms"), 200) : null,
    vat: ["included", "excluded"].includes(String(form.get("vat")))
      ? String(form.get("vat"))
      : "unknown",
  });
  if (error) redirect("/manage?error=item");
  revalidatePath("/manage");
  redirect("/manage?saved=1");
}

async function removeItem(form: FormData) {
  "use server";
  const sb = await createClient();
  await sb.from("clinic_items").delete().eq("id", String(form.get("id")));
  revalidatePath("/manage");
}

async function signOut() {
  "use server";
  const sb = await createClient();
  await sb.auth.signOut();
  redirect("/");
}

type Props = { searchParams: Promise<{ error?: string; saved?: string }> };

export default async function Manage({ searchParams }: Props) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) redirect("/auth?next=/manage");
  const { error, saved } = await searchParams;
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/auth?next=/manage");
  const { data: clinics } = await sb.from("clinics").select("*");
  const mine = ((clinics ?? []) as ClinicRow[]).filter(
    (c) => c.owner_email.toLowerCase() === user.email?.toLowerCase(),
  );
  const ids = mine.map((c) => c.id);
  const { data: rows } = ids.length
    ? await sb.from("clinic_items").select("*").in("clinic_id", ids).order("title")
    : { data: [] };
  const items = (rows ?? []) as ItemRow[];
  return (
    <div className="narrow">
      <h1>Manage your listing</h1>
      <p className="note">Signed in as {user.email}</p>
      {saved && <p className="article-answer" role="status">Saved. We will review it before it goes live.</p>}
      {error === "clinic" && (
        <p className="alert" role="alert">
          We could not save your clinic details. Check the English name and try again.
        </p>
      )}
      {error === "item" && (
        <p className="alert" role="alert">
          We could not save that item. Check the price. Event prices need the
          regular price (higher than the event price), end date, who qualifies
          and conditions.
        </p>
      )}
      {mine.length === 0 && (
        <p>
          No listing is linked to this email yet. If your application was
          approved, sign in with the email you applied with and confirm it. To
          apply, see <Link href="/for-clinics">List your clinic</Link>.
        </p>
      )}
      {mine.map((c) => (
        <section key={c.id}>
          <h2>{c.name_en}</h2>
          <p>
            <span className="tag">{STATUS[c.status]}</span>{" "}
            {c.status === "published" && <Link href={`/clinics/${c.slug}`}>View page</Link>}
          </p>
          {c.reject_reason && <p className="alert">{c.reject_reason}</p>}
          <form action={saveClinic} className="form">
            <input type="hidden" name="id" value={c.id} />
            <div className="field">
              <label htmlFor={`en-${c.id}`}>Clinic name in English</label>
              <input id={`en-${c.id}`} name="name_en" defaultValue={c.name_en} required minLength={2} maxLength={120} />
            </div>
            <div className="field">
              <label htmlFor={`ko-${c.id}`}>Clinic name in Korean</label>
              <input id={`ko-${c.id}`} name="name_ko" defaultValue={c.name_ko ?? ""} maxLength={120} />
            </div>
            <div className="field">
              <label htmlFor={`area-${c.id}`}>Area</label>
              <input id={`area-${c.id}`} name="area" defaultValue={c.area ?? ""} maxLength={60} placeholder="Gangnam" />
            </div>
            <div className="field">
              <label htmlFor={`intro-${c.id}`}>Introduction</label>
              <textarea id={`intro-${c.id}`} name="intro" rows={5} maxLength={1200} defaultValue={c.intro ?? ""} />
            </div>
            <p className="note">Saving sends your page for review. A live page is hidden until the review is done.</p>
            <button className="btn" type="submit">
              Save and send for review
            </button>
          </form>

          <h2>Treatments and prices</h2>
          {items.filter((i) => i.clinic_id === c.id).length === 0 ? (
            <p className="note">No items yet.</p>
          ) : (
            <ul className="price-panels">
              {items
                .filter((i) => i.clinic_id === c.id)
                .map((i) => (
                  <li key={i.id}>
                    <div className="price-row">
                      <span className="price-name">
                        {i.title}
                        <span className="price-spec">
                          <span className="tag">{i.status === "published" ? "Live" : i.status === "rejected" ? "Changes needed" : "Waiting for review"}</span>{" "}
                          {i.kind === "event" ? "Event price" : "Listed price"}
                        </span>
                      </span>
                      <span className="price-val">{won(i.price_krw)}</span>
                      {i.reject_reason && <span className="price-meta">{i.reject_reason}</span>}
                    </div>
                    <form action={removeItem}>
                      <input type="hidden" name="id" value={i.id} />
                      <button type="submit" className="btn-line" style={{ marginTop: 6, background: "none", cursor: "pointer" }}>
                        Delete {i.title}
                      </button>
                    </form>
                  </li>
                ))}
            </ul>
          )}
          <form action={addItem} className="form">
            <input type="hidden" name="clinic_id" value={c.id} />
            <div className="field">
              <label htmlFor={`t-${c.id}`}>Treatment</label>
              <select id={`t-${c.id}`} name="treatment" required defaultValue="">
                <option value="">Select a treatment</option>
                {treatments.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.en}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor={`title-${c.id}`}>Item name with dose or size</label>
              <input id={`title-${c.id}`} name="title" required minLength={2} maxLength={120} placeholder="Rejuran Healer, 2cc" />
            </div>
            <div className="two-col">
              <div className="field">
                <label htmlFor={`price-${c.id}`}>Price in won</label>
                <input id={`price-${c.id}`} name="price" type="number" required min={1000} max={300000000} inputMode="numeric" />
              </div>
              <div className="field">
                <label htmlFor={`vat-${c.id}`}>VAT</label>
                <select id={`vat-${c.id}`} name="vat" defaultValue="excluded">
                  <option value="excluded">Excluded</option>
                  <option value="included">Included</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label htmlFor={`kind-${c.id}`}>Price type</label>
              <select id={`kind-${c.id}`} name="kind" defaultValue="list">
                <option value="list">Listed price</option>
                <option value="event">Event price</option>
              </select>
            </div>
            <div className="event-fields">
            <p className="note">Event prices must show all four of these.</p>
            <div className="two-col">
              <div className="field">
                <label htmlFor={`lp-${c.id}`}>Regular price in won</label>
                <input id={`lp-${c.id}`} name="list_price" type="number" min={1000} max={300000000} inputMode="numeric" />
              </div>
              <div className="field">
                <label htmlFor={`until-${c.id}`}>Event ends</label>
                <input id={`until-${c.id}`} name="until" type="date" />
              </div>
            </div>
            <div className="field">
              <label htmlFor={`target-${c.id}`}>Who qualifies</label>
              <input id={`target-${c.id}`} name="target" maxLength={120} />
            </div>
            <div className="field">
              <label htmlFor={`terms-${c.id}`}>Conditions</label>
              <input id={`terms-${c.id}`} name="terms" maxLength={200} />
            </div>
            </div>
            <button className="btn" type="submit">
              Add item
            </button>
          </form>
        </section>
      ))}
      <form action={signOut}>
        <button type="submit" className="btn-line" style={{ background: "none", cursor: "pointer" }}>
          Sign out
        </button>
      </form>
    </div>
  );
}
