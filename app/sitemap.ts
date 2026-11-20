import type { MetadataRoute } from "next";
import { treatments } from "@/data/treatments";
import { guides } from "@/data/guides";
import { glossary } from "@/data/glossary";
import { LOCALES } from "@/data/i18n";
import { AREAS, AREA_TREATMENTS } from "@/lib/areas";
import providers from "@/data/registered-providers.json";
import prices from "@/data/prices.json";

// 쪽 목록. 로그인·관리·제보 확인 쪽은 넣지 않는다(robots.ts 와 같은 기준).
const SITE =
  process.env.NEXT_PUBLIC_SITE_URL || "https://kbeautyprice.vercel.app";

type P = { slug: string };

export default function sitemap(): MetadataRoute.Sitemap {
  const priced = new Date(prices.collected);
  const checked = new Date(providers.checked);
  const items = providers.items as P[];

  const fixed: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: priced, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE}/treatments`,
      lastModified: priced,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE}/hospitals`,
      lastModified: checked,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE}/how-prices-work`,
      lastModified: priced,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE}/guides`,
      lastModified: priced,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE}/glossary`,
      lastModified: priced,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE}/for-clinics`,
      lastModified: checked,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE}/submit`,
      lastModified: checked,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE}/privacy`,
      lastModified: checked,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE}/terms`,
      lastModified: checked,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const treatmentPages: MetadataRoute.Sitemap = treatments.map((t) => ({
    url: `${SITE}/treatments/${t.slug}`,
    lastModified: priced,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const guidePages: MetadataRoute.Sitemap = guides.map((g) => ({
    url: `${SITE}/guides/${g.slug}`,
    lastModified: new Date(g.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const termPages: MetadataRoute.Sitemap = glossary.map((t) => ({
    url: `${SITE}/glossary/${t.slug}`,
    lastModified: priced,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // 언어판(영어 외). 목록 1쪽 + 시술 쪽.
  const localePages: MetadataRoute.Sitemap = LOCALES.flatMap((l) => [
    {
      url: `${SITE}/${l}/treatments`,
      lastModified: priced,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...treatments.map((t) => ({
      url: `${SITE}/${l}/treatments/${t.slug}`,
      lastModified: priced,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ]);

  // 지역 쪽과 지역×시술 쪽. 가격은 지역별로 없고, 지역 등록 병원 수는 명부 확인일에 맞춘다.
  const areaPages: MetadataRoute.Sitemap = AREAS.map((a) => ({
    url: `${SITE}/in/${a.slug}`,
    lastModified: checked,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const areaTreatmentPages: MetadataRoute.Sitemap = AREAS.flatMap((a) =>
    AREA_TREATMENTS.map((t) => ({
      url: `${SITE}/in/${a.slug}/${t.slug}`,
      lastModified: priced,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  );

  const clinicPages: MetadataRoute.Sitemap = items.map((p) => ({
    url: `${SITE}/hospitals/${p.slug}`,
    lastModified: checked,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...fixed,
    ...treatmentPages,
    ...guidePages,
    ...termPages,
    ...localePages,
    ...areaPages,
    ...areaTreatmentPages,
    ...clinicPages,
  ];
}
