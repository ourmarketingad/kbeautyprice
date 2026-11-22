// 지역 쪽의 유일한 입구. 지역별 가격 자료는 없다 — 여기서 말할 수 있는 것은
// ① 공식 명부에 그 지역으로 등록된 병원 수(측정값) ② 그 지역이 행정·교통상 어디인가(사실)뿐이다.
// 「이 지역이 싸다·좋다·많이 받는다」 같은 말은 쓰지 않는다.
import { CLINICS, type Provider } from "@/lib/clinics";
import { treatments, type Treatment } from "@/data/treatments";
import { PRICES } from "@/lib/prices";
import type { CategorySlug } from "@/data/categories";

export type Area = {
  slug: string;
  /** 명부의 area 값과 똑같아야 한다. */
  key: string;
  en: string;
  ko: string;
  /** 행정구역. 확인된 사실만. */
  district: string;
  /** 가까운 전철. 확인된 사실만. */
  transit: string;
  inSeoul: boolean;
};

export const AREAS: Area[] = [
  {
    slug: "gangnam-station",
    key: "Gangnam Station",
    en: "Gangnam Station",
    ko: "강남역",
    district: "Gangnam-gu and Seocho-gu, Seoul",
    transit: "Gangnam Station, Subway Line 2 and the Shinbundang Line",
    inSeoul: true,
  },
  {
    slug: "apgujeong",
    key: "Apgujeong",
    en: "Apgujeong",
    ko: "압구정",
    district: "Gangnam-gu, Seoul",
    transit:
      "Apgujeong Station on Line 3, Apgujeong Rodeo Station on the Suin-Bundang Line",
    inSeoul: true,
  },
  {
    slug: "cheongdam",
    key: "Cheongdam",
    en: "Cheongdam",
    ko: "청담",
    district: "Gangnam-gu, Seoul",
    transit: "Cheongdam Station, Subway Line 7",
    inSeoul: true,
  },
  {
    slug: "sinnonhyeon",
    key: "Sinnonhyeon",
    en: "Sinnonhyeon",
    ko: "신논현",
    district: "Gangnam-gu, Seoul",
    transit: "Sinnonhyeon Station, Line 9 and the Shinbundang Line",
    inSeoul: true,
  },
  {
    slug: "myeongdong",
    key: "Myeongdong",
    en: "Myeongdong",
    ko: "명동",
    district: "Jung-gu, Seoul",
    transit: "Myeongdong Station on Line 4, Euljiro 1-ga Station on Line 2",
    inSeoul: true,
  },
  {
    slug: "hongdae",
    key: "Hongdae",
    en: "Hongdae",
    ko: "홍대",
    district: "Mapo-gu, Seoul",
    transit:
      "Hongik University Station, Line 2, the Airport Railroad and the Gyeongui-Jungang Line",
    inSeoul: true,
  },
  {
    slug: "busan",
    key: "Busan",
    en: "Busan",
    ko: "부산",
    district: "Busan, a separate city from Seoul",
    transit: "Busan city, reached from Seoul by KTX or by flight to Gimhae",
    inSeoul: false,
  },
];

export const areaBySlug = (slug: string) => AREAS.find((a) => a.slug === slug);

/** 이 지역에 등록된 병원. 명부 그대로, 가나다·알파벳 순. */
export const clinicsInArea = (a: Area): Provider[] =>
  CLINICS.filter((c) => c.area === a.key);

/** 분야별 등록 수. 측정값. */
export function fieldBreakdown(a: Area): { field: string; count: number }[] {
  const m = new Map<string, number>();
  for (const c of clinicsInArea(a)) m.set(c.field, (m.get(c.field) ?? 0) + 1);
  return [...m.entries()]
    .map(([field, count]) => ({ field, count }))
    .sort((x, y) => y.count - x.count);
}

/** 시술 분류 → 그 시술을 하는 병원이 속한 명부 분야. 「이 병원이 이 시술을 한다」는 뜻이 아니다. */
const CATEGORY_FIELDS: Record<CategorySlug, string[]> = {
  lifting: ["skin"],
  botox: ["skin"],
  filler: ["skin"],
  "skin-booster": ["skin"],
  laser: ["skin"],
  "hair-removal": ["skin"],
  "thread-lift": ["skin", "surgery"],
  "fat-dissolving": ["skin"],
  "double-eyelid": ["surgery"],
  rhinoplasty: ["surgery"],
  body: ["surgery"],
  dental: ["dental"],
  "hair-transplant": ["skin", "surgery"],
};

export const fieldsForCategory = (c: CategorySlug) => CATEGORY_FIELDS[c] ?? [];

/** 이 시술의 분야로 이 지역에 등록된 병원. 시술 제공 여부는 알 수 없다. */
export function clinicsForTreatmentInArea(a: Area, t: Treatment): Provider[] {
  const fields = fieldsForCategory(t.category);
  return clinicsInArea(a).filter((c) => fields.includes(c.field));
}

/** 지역 쪽을 만드는 시술: 공개 범위가 있는 것만. 범위 없는 시술로 지역 쪽을 찍으면 빈 쪽이 된다. */
const PRICED = new Set(PRICES.map((p) => p.slug));
export const AREA_TREATMENTS: Treatment[] = treatments.filter((t) =>
  PRICED.has(t.slug),
);

/** 지역 x 시술 쪽에서 「예약 전에 확인할 것」으로 보여 줄 용어. 영어 사전 쪽으로 이어진다. */
export const CHECK_TERMS: Record<string, string[]> = {
  lifting: ["shot-count", "cartridge", "event-price"],
  filler: ["cc-and-syringe", "event-price"],
  "skin-booster": ["session-and-course", "event-price"],
  laser: ["session-and-course", "pass-and-pulse"],
  botox: ["event-price", "session-and-course"],
  "hair-removal": ["session-and-course", "package-deal"],
  "double-eyelid": ["anesthesia-fee", "aftercare-fee"],
  body: ["anesthesia-fee", "aftercare-fee"],
  "thread-lift": ["event-price", "session-and-course"],
  "fat-dissolving": ["session-and-course", "event-price"],
  rhinoplasty: ["anesthesia-fee", "aftercare-fee"],
  dental: ["written-quote", "package-deal"],
  "hair-transplant": ["written-quote", "anesthesia-fee"],
};
