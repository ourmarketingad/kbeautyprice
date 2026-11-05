// 사물 이미지 연결. 사람·병원 내부 사진이 아니라 안내용 이미지다(바닥글에 표기).
const BY_SLUG: Record<string, string> = {
  ultherapy: "lifting",
  shurink: "lifting",
  sofwave: "lifting",
  thermage: "thermage",
  "jaw-botox": "botox",
  "skin-botox": "botox",
  rejuran: "booster",
  juvelook: "juvelook",
  "pico-toning": "laser",
  potenza: "potenza",
  "dermal-filler": "filler",
  "laser-hair-removal": "hair",
  "double-eyelid-non-incision": "eye",
  "double-eyelid-incision": "eye",
  rhinoplasty: "nose",
  liposuction: "body",
};
const BY_GUIDE: Record<string, string> = {
  "why-same-treatment-different-price": "guide-a",
  "is-the-lowest-price-the-final-price": "guide-b",
  "what-a-written-quote-should-include": "guide-c",
  "questions-before-you-pay": "guide-d",
  "ultherapy-300-shots-published-prices": "lifting",
  "rejuran-healer-2cc-published-prices": "booster",
};
export const treatmentImage = (slug: string) =>
  `/img/${BY_SLUG[slug] ?? "hero-price"}.webp`;
export const guideImage = (slug: string) =>
  `/img/${BY_GUIDE[slug] ?? "guide-c"}.webp`;
