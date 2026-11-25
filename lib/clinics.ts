import providers from "@/data/registered-providers.json";
import contacts from "@/data/provider-addresses.json";
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

// 공식 명부(외국인환자 유치 정보시스템 「유치기관 현황」)에서 받아온 병원별 정보.
// 2026-11-25: 병원 쪽에 주소·전화가 하나도 없어 검색해서 들어온 사람이 얻는 것이
// 「명부에 등록돼 있다」 한 줄뿐이었고, 같은 이름 병원을 구분할 값도 없었다.
// 1,372곳 중 1,252곳을 맞췄다(이름이 겹쳐 못 고른 80곳·명부에 없는 40곳은 빈칸).
// scripts/build-provider-addresses.py 가 만든다.
export type Contact = {
  road?: string;      // 도로명 주소
  sido?: string;      // 시·도
  phone?: string;     // 연락처
  ceo?: string;       // 대표자명
  kind?: string;      // 기관 구분(의원·병원 등)
  status?: string;    // 명부 상태(유지 등)
  nations?: string;   // 유치 대상 국가
  matched?: string;   // 어떻게 맞췄는지
  ambiguous?: boolean; // 이름이 겹쳐 고르지 못한 경우
  candidates?: number;
  options?: { ceo: string; road: string; sido: string; phone: string; status: string }[];
  source: string;
  checked: string;
};
export const CONTACTS = (contacts.addresses ?? {}) as Record<string, Contact>;
export const CONTACTS_CHECKED = contacts.checked as string;

export function contactFor(slug: string): Contact | undefined {
  const v = CONTACTS[slug];
  return v && !v.ambiguous ? v : undefined;
}

/** 우리 자료 안에서 이름 + 지역이 겹치는 병원인지. 제목·제목줄을 구분하는 데 쓴다. */
const NAME_AREA_COUNT = new Map<string, number>();
for (const c of CLINICS) {
  const k = `${c.ko}|${c.area}`;
  NAME_AREA_COUNT.set(k, (NAME_AREA_COUNT.get(k) ?? 0) + 1);
}
export function isAmbiguous(c: Provider): boolean {
  return (NAME_AREA_COUNT.get(`${c.ko}|${c.area}`) ?? 0) > 1;
}

/**
 * 같은 이름·같은 지역 쪽이 여럿일 때 대표로 쓸 쪽의 slug.
 * 우리 원자료(심평원 출처)에서 온 여러 행이 명부의 같은 이름 여러 지점 중 어느 것인지
 * 가릴 근거가 없다. 쪽을 지우면 이미 색인된 주소가 404가 되므로, 쪽은 두고 대표주소
 * (canonical)를 한 쪽으로 모아 검색엔진이 같은 것으로 보게 한다.
 */
export function groupLeadSlug(c: Provider): string {
  if (!isAmbiguous(c)) return c.slug;
  return CLINICS.filter((x) => x.ko === c.ko && x.area === c.area)
    .map((x) => x.slug)
    .sort()[0];
}

/** 이름이 겹쳐 주소를 고르지 못한 경우의 후보 목록(명부에서 그 지역 「유지」 기관들). */
export function ambiguousOptions(slug: string) {
  const v = CONTACTS[slug];
  return v?.ambiguous ? (v.options ?? []) : [];
}

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
