import type { CategorySlug } from "./categories";

export interface PriceRange {
  label: string;
  usdLow: number;
  usdHigh: number;
  krwLow: number;
  krwHigh: number;
  unit: string;
  note?: string;
}

export interface Treatment {
  slug: string;
  category: CategorySlug;
  en: string;
  ko: string;
  ja: string;
  "zh-TW": string;
  aka: string[];
  prices: PriceRange[];
  submissionCount: number; // user submissions
  popularityRank?: number;
}

const KRW = 1400; // approx KRW to USD

const usd = (krw: number) => Math.round(krw / KRW);

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
    submissionCount: 0,
    prices: [
      { label: "100 shots", krwLow: 300000, krwHigh: 540000, usdLow: usd(300000), usdHigh: usd(540000), unit: "per session" },
      { label: "300 shots", krwLow: 850000, krwHigh: 1530000, usdLow: usd(850000), usdHigh: usd(1530000), unit: "per session" },
      { label: "600 shots", krwLow: 1700000, krwHigh: 2970000, usdLow: usd(1700000), usdHigh: usd(2970000), unit: "per session" },
    ],
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
    submissionCount: 0,
    prices: [
      { label: "300 shots", krwLow: 1090000, krwHigh: 1090000, usdLow: usd(1090000), usdHigh: usd(1090000), unit: "per session" },
      { label: "600 shots", krwLow: 1890000, krwHigh: 2600000, usdLow: usd(1890000), usdHigh: usd(2600000), unit: "per session" },
      { label: "Eye 450 shots", krwLow: 1680000, krwHigh: 2200000, usdLow: usd(1680000), usdHigh: usd(2200000), unit: "per session" },
    ],
  },
  {
    slug: "shurink",
    category: "lifting",
    en: "Shurink (Budget HIFU)",
    ko: "슈링크·리니어지",
    ja: "シュリンク",
    "zh-TW": "舒緹緊 Shurink",
    aka: ["shurink korea price", "budget hifu seoul", "シュリンク 韓国 値段"],
    submissionCount: 0,
    prices: [
      { label: "Shurink 300 shots", krwLow: 159000, krwHigh: 200000, usdLow: usd(159000), usdHigh: usd(200000), unit: "per session" },
      { label: "Shurink 600 shots", krwLow: 290000, krwHigh: 390000, usdLow: usd(290000), usdHigh: usd(390000), unit: "per session" },
    ],
  },
  {
    slug: "sofwave",
    category: "lifting",
    en: "Sofwave",
    ko: "소프웨이브",
    ja: "ソフウェーブ",
    "zh-TW": "Sofwave 索夫波",
    aka: ["sofwave korea price", "ソフウェーブ 韓国"],
    submissionCount: 0,
    prices: [
      { label: "100 shots", krwLow: 980000, krwHigh: 980000, usdLow: usd(980000), usdHigh: usd(980000), unit: "per session" },
      { label: "200 shots", krwLow: 1880000, krwHigh: 1880000, usdLow: usd(1880000), usdHigh: usd(1880000), unit: "per session" },
    ],
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
    submissionCount: 0,
    prices: [
      { label: "Korean brand 50 units", krwLow: 22000, krwHigh: 50000, usdLow: usd(22000), usdHigh: usd(50000), unit: "per side" },
      { label: "Allergan 50 units", krwLow: 100000, krwHigh: 150000, usdLow: usd(100000), usdHigh: usd(150000), unit: "per side" },
    ],
  },
  {
    slug: "skin-botox",
    category: "botox",
    en: "Skin Botox (Pore-tightening)",
    ko: "피부 보톡스",
    ja: "肌ボトックス",
    "zh-TW": "皮膚肉毒·毛孔緊緻",
    aka: ["skin botox korea price", "glass skin botox", "肌ボトックス 韓国 値段"],
    submissionCount: 0,
    prices: [
      { label: "Full face", krwLow: 60000, krwHigh: 120000, usdLow: usd(60000), usdHigh: usd(120000), unit: "per session" },
    ],
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
    submissionCount: 0,
    prices: [
      { label: "Face 2cc", krwLow: 180000, krwHigh: 350000, usdLow: usd(180000), usdHigh: usd(350000), unit: "per session" },
      { label: "Course 3 sessions", krwLow: 450000, krwHigh: 900000, usdLow: usd(450000), usdHigh: usd(900000), unit: "course" },
    ],
  },
  {
    slug: "juvelook",
    category: "skin-booster",
    en: "Juvelook (Collagen Booster)",
    ko: "쥬벨룩",
    ja: "ジュベルック",
    "zh-TW": "Juvelook 膠原蛋白",
    aka: ["juvelook korea price", "collagen booster seoul", "ジュベルック 韓国 値段"],
    submissionCount: 0,
    prices: [
      { label: "Face 1 vial", krwLow: 200000, krwHigh: 350000, usdLow: usd(200000), usdHigh: usd(350000), unit: "per session" },
    ],
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
    submissionCount: 0,
    prices: [
      { label: "Both eyes", krwLow: 500000, krwHigh: 1500000, usdLow: usd(500000), usdHigh: usd(1500000), unit: "per operation" },
    ],
  },
  {
    slug: "double-eyelid-incision",
    category: "double-eyelid",
    en: "Double Eyelid — Incision",
    ko: "쌍꺼풀 절개",
    ja: "二重まぶた 切開法",
    "zh-TW": "雙眼皮 切開法",
    aka: ["double eyelid incision korea", "切開 二重 韓国 値段"],
    submissionCount: 0,
    prices: [
      { label: "Both eyes", krwLow: 1200000, krwHigh: 3000000, usdLow: usd(1200000), usdHigh: usd(3000000), unit: "per operation" },
    ],
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
    submissionCount: 0,
    prices: [
      { label: "Full legs", krwLow: 200000, krwHigh: 500000, usdLow: usd(200000), usdHigh: usd(500000), unit: "per session" },
      { label: "Underarm", krwLow: 50000, krwHigh: 150000, usdLow: usd(50000), usdHigh: usd(150000), unit: "per session" },
      { label: "Full body", krwLow: 500000, krwHigh: 1500000, usdLow: usd(500000), usdHigh: usd(1500000), unit: "per session" },
    ],
  },
];
