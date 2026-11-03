export interface Hospital {
  slug: string;
  name: string;
  nameKo: string;
  district: string; // Gangnam, Apgujeong, Sinchon, etc.
  categories: string[]; // category slugs
  specialties: string[];
  foreignPatientService: boolean;
  englishSupport: boolean;
  address: string;
  naverMapUrl?: string;
  website?: string;
  instagramUrl?: string;
  note?: string;
}

export const hospitals: Hospital[] = [
  {
    slug: "id-hospital",
    name: "ID Hospital",
    nameKo: "아이디병원",
    district: "Apgujeong",
    categories: ["double-eyelid", "rhinoplasty"],
    specialties: ["Face contouring", "Rhinoplasty", "Double eyelid", "Eyes"],
    foreignPatientService: true,
    englishSupport: true,
    address: "636 Eonju-ro, Gangnam-gu, Seoul",
    naverMapUrl: "https://map.naver.com/",
    note: "One of Korea's largest plastic surgery hospitals, well-known for face contouring",
  },
  {
    slug: "the-plus-dermatology",
    name: "The Plus Dermatology",
    nameKo: "더플러스피부과",
    district: "Gangnam",
    categories: ["lifting", "skin-booster", "laser"],
    specialties: ["HIFU lifting", "Rejuran", "Skin boosters", "Laser"],
    foreignPatientService: true,
    englishSupport: true,
    address: "Gangnam-daero, Gangnam-gu, Seoul",
    note: "Popular among foreign visitors for skin rejuvenation treatments",
  },
  {
    slug: "jk-plastic-surgery",
    name: "JK Plastic Surgery",
    nameKo: "JK성형외과",
    district: "Apgujeong",
    categories: ["double-eyelid", "rhinoplasty"],
    specialties: ["Rhinoplasty", "Double eyelid", "Breast augmentation"],
    foreignPatientService: true,
    englishSupport: true,
    address: "Apgujeong-ro, Gangnam-gu, Seoul",
    note: "Known for rhinoplasty, large international patient base",
  },
  {
    slug: "banobagi",
    name: "Banobagi Plastic Surgery",
    nameKo: "바노바기성형외과",
    district: "Sinchon",
    categories: ["double-eyelid", "rhinoplasty"],
    specialties: ["Face contouring", "Double eyelid", "Rhinoplasty", "Anti-aging"],
    foreignPatientService: true,
    englishSupport: true,
    address: "Yonsei-ro, Seodaemun-gu, Seoul",
    note: "Well-known for natural-looking results; popular YouTube presence",
  },
  {
    slug: "grand-plastic-surgery",
    name: "Grand Plastic Surgery",
    nameKo: "그랜드성형외과",
    district: "Gangnam",
    categories: ["double-eyelid", "rhinoplasty"],
    specialties: ["Rhinoplasty", "Double eyelid", "Forehead", "Face contouring"],
    foreignPatientService: true,
    englishSupport: true,
    address: "Gangnam-daero, Gangnam-gu, Seoul",
    note: "Frequently featured in foreign patient reviews on Reddit and forums",
  },
  {
    slug: "oracle-dermatology",
    name: "Oracle Dermatology",
    nameKo: "오라클피부과",
    district: "Gangnam",
    categories: ["lifting", "botox", "filler", "skin-booster"],
    specialties: ["HIFU", "Ultherapy", "Thermage", "Filler", "Botox"],
    foreignPatientService: true,
    englishSupport: true,
    address: "Teheran-ro, Gangnam-gu, Seoul",
    note: "Multi-branch clinic popular for lifting treatments and skin boosters",
  },
  {
    slug: "shimmian-plastic-surgery",
    name: "Shimmian Plastic Surgery",
    nameKo: "심미안성형외과",
    district: "Apgujeong",
    categories: ["double-eyelid"],
    specialties: ["Ptosis correction", "Double eyelid revision", "Eye revision"],
    foreignPatientService: true,
    englishSupport: false,
    address: "Apgujeong-ro, Gangnam-gu, Seoul",
    note: "Highly regarded for eye revision cases and ptosis correction",
  },
  {
    slug: "365mc",
    name: "365mc",
    nameKo: "365mc비만클리닉",
    district: "Multiple",
    categories: ["fat-dissolving"],
    specialties: ["Liposuction", "Fat dissolving injections", "Body contouring"],
    foreignPatientService: true,
    englishSupport: true,
    address: "Multiple locations in Seoul",
    note: "Korea's largest body contouring chain; liposuction specialists",
  },
];
