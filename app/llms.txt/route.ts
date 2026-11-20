import { treatments } from "@/data/treatments";
import { guides } from "@/data/guides";
import { GLOSSARY_CATEGORY, glossary } from "@/data/glossary";
import providers from "@/data/registered-providers.json";
import prices from "@/data/prices.json";
import { AREAS, AREA_TREATMENTS, clinicsInArea } from "@/lib/areas";

// AI 검색이 읽는 안내 파일. 숫자가 낡지 않게 자료에서 그때그때 만든다.
const SITE =
  process.env.NEXT_PUBLIC_SITE_URL || "https://kbeautyprice.vercel.app";

export const dynamic = "force-static";

export function GET() {
  const withPrice = [...new Set(prices.items.map((i) => i.slug))];
  const body = `# KBeautyPrice

> Price ranges for aesthetic and clinic treatments in Seoul, taken from prices clinics publish on their own websites. Every range states how many clinics it covers and the date we checked.

Operated by OUR Marketing (아워마케팅), Seoul. Foreign patient attraction registration A-2026-01-02-07119.

## How the numbers are made

- A range is shown only when at least ${3} clinics publish the same treatment at the same size or shot count.
- Listed prices (regular or pre-discount) and event prices are shown separately, never blended.
- First-visit trial prices, bundles and prices older than 12 months are left out.
- Prices last collected ${prices.collected}: ${prices.evidence.prices} prices from ${prices.evidence.clinics} clinics across ${prices.evidence.pages} pages.
- Won is the charged currency. US dollars are a rough guide at ${prices.krwPerUsd} won per dollar.

## What this site does not publish

- No clinic names next to prices, no rankings, no clinic-versus-clinic comparisons.
- No patient reviews, star ratings or before-and-after photos.
- No prices given to us privately by a clinic.
- Nothing here is a quote, a recommendation or medical advice.

## Pages

- [Treatment prices](${SITE}/treatments): ${treatments.length} treatments, ${withPrice.length} with a published range.
- [How prices work](${SITE}/how-prices-work): the collection rules above, in full.
- [Registered clinics](${SITE}/hospitals): ${providers.items.length} providers from the official Medical Korea maintained registry of institutions permitted to receive foreign patients, checked ${providers.checked}. Listed alphabetically. A listing is not a recommendation.
- [Guides](${SITE}/guides): ${guides.length} articles on reading Korean clinic prices and quotes.
- [Glossary](${SITE}/glossary): ${glossary.length} terms found on Korean clinic price pages and quotes, in ${Object.keys(GLOSSARY_CATEGORY).length} groups — ${Object.values(GLOSSARY_CATEGORY).map((g) => g.label.toLowerCase()).join(", ")}.
- [Areas](${SITE}/in/gangnam-station): ${AREAS.length} areas in the registry, each with a page per priced treatment. Clinic counts per area are measured from the registry; prices are NOT published per area and we do not estimate them.
- [Report a price](${SITE}/submit): visitors tell us what they paid, anonymously.
- [For clinics](${SITE}/for-clinics): how a registered clinic lists its own treatments and prices.

## Treatments with a published price range

${treatments
  .filter((t) => withPrice.includes(t.slug))
  .map((t) => `- [${t.en}](${SITE}/treatments/${t.slug})`)
  .join("\n")}

## Areas, with registered clinic counts

Prices on this site are not broken down by area. An area page gives the registry count for that area plus the nationwide published range.

${AREAS.map((a) => `- [${a.en}](${SITE}/in/${a.slug}): ${clinicsInArea(a).length} registered clinics, ${a.district}.`).join(String.fromCharCode(10))}

Each area also has a page per treatment, at ${SITE}/in/<area>/<treatment>, for these ${AREA_TREATMENTS.length} treatments: ${AREA_TREATMENTS.map((t) => t.slug).join(", ")}.

## Guides

${guides
  .map((g) => `- [${g.title}](${SITE}/guides/${g.slug}) (${g.date})`)
  .join("\n")}

## Glossary terms

${glossary
  .map((t) => `- [${t.en}](${SITE}/glossary/${t.slug}): ${t.short}`)
  .join("\n")}

## Citing this site

Please cite the treatment page you used and the date shown on it, because ranges change when we re-collect prices. Example: "KBeautyPrice, Ultherapy Prime range, collected ${prices.collected}".
`;
  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
