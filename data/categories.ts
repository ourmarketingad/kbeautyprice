export type CategorySlug =
  | "lifting"
  | "botox"
  | "filler"
  | "skin-booster"
  | "laser"
  | "double-eyelid"
  | "rhinoplasty"
  | "hair-removal"
  | "thread-lift"
  | "fat-dissolving"
  | "body"
  | "dental"
  | "hair-transplant";

export interface Category {
  slug: CategorySlug;
  en: string;
  ko: string;
  ja: string;
  "zh-TW": string;
  emoji: string;
  description: string;
}

export const categories: Category[] = [
  { slug: "lifting", en: "Lifting & HIFU", ko: "리프팅·초음파", ja: "リフティング", "zh-TW": "拉提·音波", emoji: "🔆", description: "Ultherapy, Thermage, Sofwave, XERF, Shurink" },
  { slug: "botox", en: "Botox", ko: "보톡스", ja: "ボトックス", "zh-TW": "肉毒桿菌", emoji: "💉", description: "Jaw, forehead, skin, eye, trap botox" },
  { slug: "filler", en: "Filler", ko: "필러", ja: "フィラー", "zh-TW": "玻尿酸填充", emoji: "✨", description: "Hyaluronic acid, nose, lips, under-eye, cheek" },
  { slug: "skin-booster", en: "Skin Booster", ko: "스킨부스터", ja: "スキンブースター", "zh-TW": "皮膚補水針", emoji: "💧", description: "Rejuran, Juvelook, Exosome, PDRN" },
  { slug: "laser", en: "Laser & Pigment", ko: "레이저·색소", ja: "レーザー", "zh-TW": "雷射·色素", emoji: "⚡", description: "Toning, Pico, Fraxel, IPL, spot removal" },
  { slug: "double-eyelid", en: "Double Eyelid", ko: "쌍꺼풀", ja: "二重まぶた", "zh-TW": "雙眼皮", emoji: "👁", description: "Non-incision, incision, ptosis correction" },
  { slug: "rhinoplasty", en: "Rhinoplasty", ko: "코성형", ja: "鼻整形", "zh-TW": "隆鼻·鼻整形", emoji: "👃", description: "Bridge, tip, revision rhinoplasty" },
  { slug: "hair-removal", en: "Hair Removal", ko: "제모", ja: "脱毛", "zh-TW": "除毛·脫毛", emoji: "🌿", description: "Laser hair removal, full body, men" },
  { slug: "thread-lift", en: "Thread Lift", ko: "실리프팅", ja: "スレッドリフト", "zh-TW": "埋線拉提", emoji: "🪡", description: "PDO, PCL, PLLA threads" },
  { slug: "fat-dissolving", en: "Fat Dissolving", ko: "지방분해", ja: "脂肪溶解", "zh-TW": "溶脂·縮下巴", emoji: "🔥", description: "Kybella, PCDC injection, body contouring" },
  { slug: "dental", en: "Dental", ko: "치과", ja: "歯科", "zh-TW": "牙齒整形", emoji: "🦷", description: "Veneers, whitening, implant, Invisalign" },
  { slug: "hair-transplant", en: "Hair Transplant", ko: "모발이식", ja: "植毛", "zh-TW": "植髮", emoji: "💈", description: "FUE, DHI hair transplant" },
  { slug: "body", en: "Liposuction", ko: "지방흡입", ja: "脂肪吸引", "zh-TW": "抽脂", emoji: "", description: "Liposuction" },
];
