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
  "zh-CN": string;
  es: string;
  emoji: string;
  description: string;
}

export const categories: Category[] = [
  { slug: "lifting", en: "Lifting & HIFU", ko: "리프팅·초음파", ja: "リフティング", "zh-TW": "拉提·音波", "zh-CN": "提升·超声刀", es: "Lifting y HIFU", emoji: "🔆", description: "Ultherapy, Thermage, Sofwave, XERF, Shurink" },
  { slug: "botox", en: "Botox", ko: "보톡스", ja: "ボトックス", "zh-TW": "肉毒桿菌", "zh-CN": "肉毒素", es: "Bótox", emoji: "💉", description: "Jaw, forehead, skin, eye, trap botox" },
  { slug: "filler", en: "Filler", ko: "필러", ja: "フィラー", "zh-TW": "玻尿酸填充", "zh-CN": "玻尿酸填充", es: "Rellenos", emoji: "✨", description: "Hyaluronic acid, nose, lips, under-eye, cheek" },
  { slug: "skin-booster", en: "Skin Booster", ko: "스킨부스터", ja: "スキンブースター", "zh-TW": "皮膚補水針", "zh-CN": "水光·胶原针", es: "Skin boosters", emoji: "💧", description: "Rejuran, Juvelook, Exosome, PDRN" },
  { slug: "laser", en: "Laser & Pigment", ko: "레이저·색소", ja: "レーザー", "zh-TW": "雷射·色素", "zh-CN": "激光·色素", es: "Láser y pigmentación", emoji: "⚡", description: "Toning, Pico, Fraxel, IPL, spot removal" },
  { slug: "double-eyelid", en: "Double Eyelid", ko: "쌍꺼풀", ja: "二重まぶた", "zh-TW": "雙眼皮", "zh-CN": "双眼皮", es: "Doble párpado", emoji: "👁", description: "Non-incision, incision, ptosis correction" },
  { slug: "rhinoplasty", en: "Rhinoplasty", ko: "코성형", ja: "鼻整形", "zh-TW": "隆鼻·鼻整形", "zh-CN": "隆鼻", es: "Rinoplastia", emoji: "👃", description: "Bridge, tip, revision rhinoplasty" },
  { slug: "hair-removal", en: "Hair Removal", ko: "제모", ja: "脱毛", "zh-TW": "除毛·脫毛", "zh-CN": "脱毛", es: "Depilación láser", emoji: "🌿", description: "Laser hair removal, full body, men" },
  { slug: "thread-lift", en: "Thread Lift", ko: "실리프팅", ja: "スレッドリフト", "zh-TW": "埋線拉提", "zh-CN": "线雕提升", es: "Hilos tensores", emoji: "🪡", description: "PDO, PCL, PLLA threads" },
  { slug: "fat-dissolving", en: "Fat Dissolving", ko: "지방분해", ja: "脂肪溶解", "zh-TW": "溶脂·縮下巴", "zh-CN": "溶脂", es: "Lipólisis", emoji: "🔥", description: "Kybella, PCDC injection, body contouring" },
  { slug: "dental", en: "Dental", ko: "치과", ja: "歯科", "zh-TW": "牙齒整形", "zh-CN": "牙科", es: "Odontología", emoji: "🦷", description: "Veneers, whitening, implant, Invisalign" },
  { slug: "hair-transplant", en: "Hair Transplant", ko: "모발이식", ja: "植毛", "zh-TW": "植髮", "zh-CN": "植发", es: "Injerto capilar", emoji: "💈", description: "FUE, DHI hair transplant" },
  { slug: "body", en: "Liposuction", ko: "지방흡입", ja: "脂肪吸引", "zh-TW": "抽脂", "zh-CN": "吸脂", es: "Liposucción", emoji: "", description: "Liposuction" },
];
