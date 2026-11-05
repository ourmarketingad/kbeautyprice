import type { CategorySlug } from "./categories";

export interface Treatment {
  slug: string;
  category: CategorySlug;
  en: string;
  ko: string;
  ja: string;
  "zh-TW": string;
  aka: string[];
  popularityRank?: number;
}

export const treatments: Treatment[] = [
  // ─── LIFTING ───────────────────────────────────────────────
  {
    slug: "ultherapy",
    category: "lifting",
    en: "Ultherapy Prime",
    ko: "울쎄라 프라임",
    ja: "ウルセラプライム",
    "zh-TW": "極線音波 Ultherapy Prime",
    aka: ["ultherapy korea price", "ulthera seoul", "ウルセラ 韓国 値段", "韓國 音波拉提 價格"],
    popularityRank: 1,
  },
  {
    slug: "thermage",
    category: "lifting",
    en: "Thermage FLX",
    ko: "써마지 FLX",
    ja: "サーマージFLX",
    "zh-TW": "鳳凰電波 Thermage FLX",
    aka: ["thermage korea price", "thermage flx seoul", "サーマージ 韓国 値段", "韓國 鳳凰電波 價格"],
    popularityRank: 2,
  },
  {
    slug: "shurink",
    category: "lifting",
    en: "Shurink (Budget HIFU)",
    ko: "슈링크·리니어지",
    ja: "シュリンク",
    "zh-TW": "舒緹緊 Shurink",
    aka: ["shurink korea price", "budget hifu seoul", "シュリンク 韓国 値段"],
  },
  {
    slug: "sofwave",
    category: "lifting",
    en: "Sofwave",
    ko: "소프웨이브",
    ja: "ソフウェーブ",
    "zh-TW": "Sofwave 索夫波",
    aka: ["sofwave korea price", "ソフウェーブ 韓国"],
  },
  // ─── BOTOX ───────────────────────────────────────────────
  {
    slug: "jaw-botox",
    category: "botox",
    en: "Jaw Botox (Masseter)",
    ko: "사각턱 보톡스",
    ja: "エラボトックス",
    "zh-TW": "國字臉瘦臉針",
    aka: ["jaw botox korea price", "masseter botox seoul", "エラ ボトックス 韓国 値段", "韓國 瘦臉針 價格"],
    popularityRank: 3,
  },
  {
    slug: "skin-botox",
    category: "botox",
    en: "Skin Botox (Pore-tightening)",
    ko: "피부 보톡스",
    ja: "肌ボトックス",
    "zh-TW": "皮膚肉毒·毛孔緊緻",
    aka: ["skin botox korea price", "glass skin botox", "肌ボトックス 韓国 値段"],
  },
  // ─── SKIN BOOSTER ────────────────────────────────────────
  {
    slug: "rejuran",
    category: "skin-booster",
    en: "Rejuran Healer",
    ko: "리쥬란 힐러",
    ja: "リジュラン",
    "zh-TW": "逆時針 Rejuran",
    aka: ["rejuran korea price", "pdrn injection seoul", "リジュラン 韓国 値段", "韓國 逆時針 價格"],
    popularityRank: 4,
  },
  {
    slug: "juvelook",
    category: "skin-booster",
    en: "Juvelook (Collagen Booster)",
    ko: "쥬벨룩",
    ja: "ジュベルック",
    "zh-TW": "Juvelook 膠原蛋白",
    aka: ["juvelook korea price", "collagen booster seoul", "ジュベルック 韓国 値段"],
  },
  // ─── DOUBLE EYELID ───────────────────────────────────────
  {
    slug: "double-eyelid-non-incision",
    category: "double-eyelid",
    en: "Double Eyelid — Non-incision",
    ko: "쌍꺼풀 비절개",
    ja: "二重まぶた 埋没法",
    "zh-TW": "雙眼皮 縫線法",
    aka: ["double eyelid korea price", "non-incision eyelid seoul", "埋没 二重 韓国 値段", "韓國 雙眼皮 縫線 價格"],
    popularityRank: 5,
  },
  {
    slug: "double-eyelid-incision",
    category: "double-eyelid",
    en: "Double Eyelid — Incision",
    ko: "쌍꺼풀 절개",
    ja: "二重まぶた 切開法",
    "zh-TW": "雙眼皮 切開法",
    aka: ["double eyelid incision korea", "切開 二重 韓国 値段"],
  },
  // ─── HAIR REMOVAL ───────────────────────────────────────
  {
    slug: "laser-hair-removal",
    category: "hair-removal",
    en: "Laser Hair Removal",
    ko: "레이저 제모",
    ja: "レーザー脱毛",
    "zh-TW": "雷射除毛",
    aka: ["laser hair removal korea price", "hair removal seoul", "レーザー脱毛 韓国 値段", "韓國 雷射除毛 價格"],
  },
  {
    slug: "pico-toning",
    category: "laser",
    en: "Pico toning",
    ko: "피코토닝",
    ja: "ピコトーニング",
    "zh-TW": "皮秒淨膚",
    aka: ["pico toning korea price", "ピコトーニング 韓国", "韓國 皮秒 價格"],
  },
  {
    slug: "potenza",
    category: "laser",
    en: "Potenza",
    ko: "포텐자",
    ja: "ポテンツァ",
    "zh-TW": "Potenza 微針電波",
    aka: ["potenza korea price", "ポテンツァ 韓国", "韓國 Potenza 價格"],
  },
  {
    slug: "dermal-filler",
    category: "filler",
    en: "Hyaluronic filler",
    ko: "히알루론산 필러",
    ja: "ヒアルロン酸フィラー",
    "zh-TW": "玻尿酸",
    aka: ["filler korea price", "フィラー 韓国 値段", "韓國 玻尿酸 價格"],
  },
  {
    slug: "liposuction",
    category: "body",
    en: "Liposuction",
    ko: "지방흡입",
    ja: "脂肪吸引",
    "zh-TW": "抽脂",
    aka: ["liposuction korea price", "脂肪吸引 韓国 値段", "韓國 抽脂 價格"],
  },
  {
    slug: "rhinoplasty",
    category: "rhinoplasty",
    en: "Rhinoplasty",
    ko: "코성형",
    ja: "鼻整形",
    "zh-TW": "隆鼻",
    aka: ["rhinoplasty korea price", "鼻整形 韓国 値段", "韓國 隆鼻 價格"],
  },
];
