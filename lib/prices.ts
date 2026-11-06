// 금액 표시의 유일한 입구. data/prices.json 은 scripts/build-prices.mjs 가 근거 파일에서 만든다.
// 규칙: 같은 조건을 공개한 병원 3곳 이상일 때만 범위를 보여 준다. 병원 이름은 싣지 않는다.
// 정가와 이벤트가는 섞지 않는다. 독자 제보는 같은 항목 5건이 모이기 전에는 쓰지 않는다.
import data from "@/data/prices.json";

export type PriceRow = {
  slug: string;
  spec: string;
  kind: "list" | "event";
  low: number;
  high: number;
  clinics: number;
  vat: string;
  seenOn: string;
};

export const PRICES = data.items as PriceRow[];
export const COLLECTED: string = data.collected;
export const KRW_PER_USD: number = data.krwPerUsd;
/** 근거 규모: 읽은 가격 수·병원 수·병원 페이지 수(병원 이름은 공개 데이터에 없다). */
export const EVIDENCE: { prices: number; clinics: number; pages: number } = data.evidence;
export const MIN_CLINICS = 3;

export const pricesFor = (slug: string) =>
  PRICES.filter((p) => p.slug === slug);
export const hasPrices = (slug: string) => pricesFor(slug).length > 0;

export const won = (n: number) => "₩" + n.toLocaleString("en-US");
export const usd = (n: number) =>
  "$" + (Math.round(n / KRW_PER_USD / 10) * 10).toLocaleString("en-US");
export const range = (low: number, high: number, f: (n: number) => string) =>
  f(low) === f(high) ? f(low) : `${f(low)} – ${f(high)}`;

export const KIND_LABEL = { list: "Listed price", event: "Event price" } as const;
export const VAT_LABEL: Record<string, string> = {
  included: "VAT included",
  excluded: "VAT excluded",
  unknown: "VAT not stated",
  mixed: "VAT differs by clinic",
};

export const COMEDI_QUOTE = "https://koreabeautyconsultant.com/connect?lang=en";
