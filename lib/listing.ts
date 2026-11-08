// 병원 입점: 공개 조회와 문구 검사. 공개 범위 금액(data/prices.json)과 섞지 않는다.
import { createClient as createPublic } from "@supabase/supabase-js";

export type ClinicRow = {
  id: string;
  slug: string;
  owner_email: string;
  name_en: string;
  name_ko: string | null;
  area: string | null;
  intro: string | null;
  registry_checked: boolean;
  agreement_signed: boolean;
  /** 병원이 낸 실사 사진. 운영자가 사용 허락(photo_consent)을 확인한 뒤에만 넣는다. */
  photo_url: string | null;
  photo_consent: boolean;
  status: "draft" | "pending" | "published" | "rejected";
  reject_reason: string | null;
};
export type ItemRow = {
  id: string;
  clinic_id: string;
  treatment_slug: string;
  title: string;
  price_krw: number;
  kind: "list" | "event";
  list_price_krw: number | null;
  event_until: string | null;
  event_target: string | null;
  event_terms: string | null;
  vat: "included" | "excluded" | "unknown";
  status: "pending" | "published" | "rejected";
  reject_reason: string | null;
};
export type PublicItem = ItemRow & {
  clinics: { slug: string; name_en: string; area: string | null };
};

const anon = () =>
  process.env.NEXT_PUBLIC_SUPABASE_URL
    ? createPublic(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { persistSession: false } },
      )
    : null;

export async function publishedClinic(slug: string) {
  const sb = anon();
  if (!sb) return null;
  const { data: clinic } = await sb
    .from("clinics")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (!clinic) return null;
  const { data: items } = await sb
    .from("clinic_items")
    .select("*")
    .eq("clinic_id", clinic.id)
    .order("title");
  return { clinic: clinic as ClinicRow, items: (items ?? []) as ItemRow[] };
}

export async function publishedItemsFor(treatment: string) {
  const sb = anon();
  if (!sb) return [] as PublicItem[];
  const { data } = await sb
    .from("clinic_items")
    .select("*, clinics!inner(slug, name_en, area)")
    .eq("treatment_slug", treatment)
    .order("title");
  return (data ?? []) as unknown as PublicItem[];
}

/** 운영자 검토를 돕는 표시용 검사. 통과가 법적 안전을 뜻하지 않는다. */
const WARN =
  /최고|최저|유일|보장|완치|부작용 ?없|무통|100 ?%|1위|전후|후기|체험담|best|cheapest|lowest|guarantee|no side effect|painless|before.?and.?after|#1|number one|testimonial|review/i;
export const lintText = (t: string | null | undefined) =>
  [...new Set((t ?? "").match(new RegExp(WARN.source, "gi")) ?? [])];

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
export const toSlug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
