// 디자인 시안(대표 선택 전, 운영 메뉴에 연결 안 함)이 함께 쓰는 자료. 숫자는 운영과 같은 data/prices.json.
import { categories } from "@/data/categories";
import { guides } from "@/data/guides";
import { treatments } from "@/data/treatments";
import { COLLECTED, EVIDENCE, PRICES, range, usd, won } from "@/lib/prices";
import { treatmentImage } from "@/lib/images";

export const rows = treatments.flatMap((t) => {
  const r = PRICES.find((p) => p.slug === t.slug && p.kind === "list");
  return r
    ? [
        {
          slug: t.slug,
          name: t.en,
          ko: t.ko,
          spec: r.spec,
          won: range(r.low, r.high, won),
          low: won(r.low),
          usd: range(r.low, r.high, usd),
          clinics: r.clinics,
          img: treatmentImage(t.slug),
        },
      ]
    : [];
});
export const cats = categories.filter((c) =>
  treatments.some((t) => t.category === c.slug),
);
export const topGuides = guides.slice(0, 3);
export const checked = new Date(COLLECTED + "T00:00:00Z").toLocaleDateString(
  "en-GB",
  { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" },
);
export { EVIDENCE };
export const previewMeta = { robots: { index: false, follow: false } };
