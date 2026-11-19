import providers from "@/data/registered-providers.json";
import { treatments } from "@/data/treatments";
import prices from "@/data/prices.json";
import type { CategorySlug } from "@/data/categories";

// 등록 병원 자료를 쪽에서 쓰기 쉽게 꺼내는 곳. 자료 원본은 data/registered-providers.json.
export type Provider = {
  slug: string;
  en: string;
  ko: string;
  field: string;
  area: string;
  photo?: boolean;
};

export const CLINICS = providers.items as Provider[];
export const CLINICS_CHECKED = providers.checked;
export const CLINICS_SOURCE = providers.source;

export const FIELD_LABEL: Record<string, string> = {
  skin: "Skin & aesthetics",
  surgery: "Plastic surgery",
  dental: "Dental",
  eye: "Eye",
  women: "Women's health",
  korean: "Korean medicine",
  hospital: "Hospital",
  general: "General & specialist",
};

// 분야에 맞는 시술 분류. 여기에 없는 분야는 가격 자료가 없다고 쪽에서 밝힌다.
const FIELD_CATEGORIES: Record<string, CategorySlug[]> = {
  skin: [
    "lifting",
    "botox",
    "filler",
    "skin-booster",
    "laser",
    "hair-removal",
    "thread-lift",
    "fat-dissolving",
  ],
  surgery: ["double-eyelid", "rhinoplasty", "body", "thread-lift"],
  dental: ["dental"],
};

const PRICED = new Set(prices.items.map((i) => i.slug));

export function clinicBySlug(slug: string): Provider | undefined {
  return CLINICS.find((c) => c.slug === slug);
}

// 이 분야에서 우리가 가격 범위를 가진 시술. 병원이 그 시술을 한다는 뜻은 아니다.
export function pricedTreatmentsForField(field: string) {
  const cats = FIELD_CATEGORIES[field];
  if (!cats) return [];
  return treatments.filter(
    (t) => cats.includes(t.category) && PRICED.has(t.slug),
  );
}

export function sameAreaClinics(c: Provider, limit = 12) {
  return CLINICS.filter(
    (x) => x.area === c.area && x.field === c.field && x.slug !== c.slug,
  ).slice(0, limit);
}

export function areaCount(area: string) {
  return CLINICS.filter((c) => c.area === area).length;
}

export function fieldCount(field: string) {
  return CLINICS.filter((c) => c.field === field).length;
}
