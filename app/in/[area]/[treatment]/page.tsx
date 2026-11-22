import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  AREAS,
  AREA_TREATMENTS,
  CHECK_TERMS,
  areaBySlug,
  clinicsForTreatmentInArea,
  clinicsInArea,
  fieldsForCategory,
} from "@/lib/areas";
import { CLINICS_CHECKED, FIELD_LABEL } from "@/lib/clinics";
import { categories } from "@/data/categories";
import { glossary } from "@/data/glossary";
import { LOCALES, LOCALE_META } from "@/data/i18n";
import {
  COLLECTED,
  KRW_PER_USD,
  KIND_LABEL,
  MIN_CLINICS,
  VAT_LABEL,
  pricesFor,
  range,
  usd,
  won,
} from "@/lib/prices";

// 지역 × 시술 쪽. 「압구정 울쎄라 가격」처럼 긴 검색어를 받는다.
// 지역별 가격 자료는 없다. 그래서 이 쪽은 ① 전국 공개 범위 ② 그 지역 등록 병원 수(측정값)
// ③ 그 지역에서 물어볼 것만 말하고, 지역 가격을 지어내지 않는다.

type Props = { params: Promise<{ area: string; treatment: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return AREAS.flatMap((a) =>
    AREA_TREATMENTS.map((t) => ({ area: a.slug, treatment: t.slug })),
  );
}

const termBySlug = (s: string) => glossary.find((g) => g.slug === s);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { area, treatment } = await params;
  const a = areaBySlug(area);
  const t = AREA_TREATMENTS.find((x) => x.slug === treatment);
  if (!a || !t) return { title: "Page not found" };
  const n = clinicsForTreatmentInArea(a, t).length;
  const lead = pricesFor(t.slug).find((p) => p.kind === "list");
  return {
    title: `${t.en} in ${a.en} — clinics and published prices`,
    description: lead
      ? `${n.toLocaleString("en-US")} registered clinics in ${a.en} work in this field. Across Seoul, ${lead.clinics} clinics publish ${lead.spec} at ${range(lead.low, lead.high, won)}, collected ${COLLECTED}. Prices are not published by area.`
      : `${n.toLocaleString("en-US")} registered clinics in ${a.en} work in this field. What to check before booking, and the published price range across Seoul.`,
    alternates: {
      canonical: `/in/${a.slug}/${t.slug}`,
      languages: {
        en: `/in/${a.slug}/${t.slug}`,
        ...Object.fromEntries(
          LOCALES.map((l) => [
            LOCALE_META[l].htmlLang,
            `/${l}/in/${a.slug}/${t.slug}`,
          ]),
        ),
        "x-default": `/in/${a.slug}/${t.slug}`,
      },
    },
  };
}

export default async function AreaTreatment({ params }: Props) {
  const { area, treatment } = await params;
  const a = areaBySlug(area);
  const t = AREA_TREATMENTS.find((x) => x.slug === treatment);
  if (!a || !t) notFound();

  const rows = pricesFor(t.slug);
  const lead = rows.find((p) => p.kind === "list") ?? rows[0];
  const cat = categories.find((c) => c.slug === t.category);
  const inField = clinicsForTreatmentInArea(a, t);
  const allInArea = clinicsInArea(a);
  const fields = fieldsForCategory(t.category);
  const fieldNames = fields.map((f) => FIELD_LABEL[f] ?? f).join(" and ");
  const terms = [
    ...(CHECK_TERMS[t.category] ?? []),
    "vat",
    "first-visit-price",
    "written-quote",
  ]
    .map(termBySlug)
    .filter((x): x is NonNullable<typeof x> => Boolean(x));
  const otherTreatments = AREA_TREATMENTS.filter((x) => x.slug !== t.slug).slice(
    0,
    8,
  );
  const otherAreas = AREAS.filter((x) => x.slug !== a.slug);

  const faq = [
    {
      q: `How much does ${t.en} cost in ${a.en}?`,
      a: lead
        ? `We do not hold prices by area, so there is no ${a.en} figure. Across Seoul, ${lead.clinics} clinics publish ${lead.spec} between ${range(lead.low, lead.high, won)} (about ${range(lead.low, lead.high, usd)}), checked ${lead.seenOn}. Clinics in ${a.en} may charge inside or outside that range.`
        : `We do not hold prices by area. We publish a range only where at least ${MIN_CLINICS} clinics publish the same treatment at the same size, and this one has event prices only. Ask clinics for a written quote.`,
    },
    {
      q: `Is ${t.en} cheaper somewhere else in Seoul?`,
      a: `We cannot say. The prices we collect are not tagged by area, and the clinics that publish them are spread across Seoul. Anyone telling you one district is cheaper for this treatment is guessing unless they show you their numbers.`,
    },
    {
      q: `How many clinics in ${a.en} do this?`,
      a: `${inField.length.toLocaleString("en-US")} of the ${allInArea.length.toLocaleString("en-US")} registered clinics in ${a.en} are registered under ${fieldNames}, which is the field this treatment belongs to. The registry does not list which treatments each clinic offers, so this is the field count, not a count of clinics that perform ${t.en}.`,
    },
  ];

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: a.en, item: `/in/${a.slug}` },
          {
            "@type": "ListItem",
            position: 2,
            name: `${t.en} in ${a.en}`,
            item: `/in/${a.slug}/${t.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <div className="wrap page-top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <p className="note">
        <Link href="/hospitals">Registered clinics</Link> ·{" "}
        <Link href={`/in/${a.slug}`}>{a.en}</Link>
        {cat && (
          <>
            {" · "}
            <Link href={`/treatments?category=${cat.slug}`}>{cat.en}</Link>
          </>
        )}
      </p>
      <h1 className="page-title">
        {t.en} in {a.en}
      </h1>
      <p className="sub">
        <span lang="ko">{t.ko}</span> · {a.district}.{" "}
        {inField.length.toLocaleString("en-US")} registered clinics in {a.en}{" "}
        work in {fieldNames.toLowerCase()}, checked {CLINICS_CHECKED}.
      </p>

      <h2>Read this first</h2>
      <p className="sub">
        Clinics in Korea do not publish prices by district, and we do not
        collect them that way, so <strong>there is no {a.en} price</strong> for{" "}
        {t.en} on this site. What follows is the range clinics publish across
        Seoul, plus what {a.en} actually has in the registry. We would rather
        say that than make a number up.
      </p>

      {rows.length > 0 && (
        <>
          <h2>Published range across Seoul</h2>
          <table className="clinic-spec">
            <tbody>
              {rows.map((p) => (
                <tr key={p.spec + p.kind}>
                  <th scope="row">
                    {p.spec}
                    <br />
                    <small>
                      {KIND_LABEL[p.kind]} · {VAT_LABEL[p.vat] ?? p.vat}
                    </small>
                  </th>
                  <td>
                    <strong>{range(p.low, p.high, won)}</strong>
                    <br />
                    <small>
                      about {range(p.low, p.high, usd)} · {p.clinics} clinics
                      published this · checked {p.seenOn}
                    </small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="note" style={{ marginTop: 12 }}>
            Clinics are not named, at their request. Converted at ₩
            {KRW_PER_USD.toLocaleString("en-US")} to the dollar on {COLLECTED};
            clinics charge in won.{" "}
            <Link href={`/treatments/${t.slug}`}>
              Full {t.en} price page
            </Link>{" "}
            · <Link href="/how-prices-work">how we collect prices</Link>
          </p>
        </>
      )}

      <h2>What {a.en} has</h2>
      <table className="clinic-spec">
        <tbody>
          <tr>
            <th scope="row">Clinics in this field</th>
            <td>
              {inField.length.toLocaleString("en-US")} registered under{" "}
              {fieldNames.toLowerCase()}
            </td>
          </tr>
          <tr>
            <th scope="row">All registered clinics here</th>
            <td>{allInArea.length.toLocaleString("en-US")}</td>
          </tr>
          <tr>
            <th scope="row">Getting there</th>
            <td>{a.transit}</td>
          </tr>
          <tr>
            <th scope="row">Registry checked</th>
            <td>{CLINICS_CHECKED}</td>
          </tr>
        </tbody>
      </table>

      {inField.length > 0 && (
        <>
          <h2>
            Where to look in {a.en}
          </h2>
          <p className="sub">
            We do not put clinic names next to prices anywhere on this site, so
            the list of clinics is kept separate from the numbers above.{" "}
            {inField.length.toLocaleString("en-US")} registered{" "}
            {fieldNames.toLowerCase()} clinics in {a.en} are listed
            alphabetically in the registry, with no ranking and no
            recommendation. The registry does not say which treatments a clinic
            offers, so ask before you travel.
          </p>
          <p className="note">
            <Link
              href={`/hospitals?area=${encodeURIComponent(a.key)}&field=${fields[0]}`}
            >
              See the {inField.length.toLocaleString("en-US")} registered{" "}
              {fieldNames.toLowerCase()} clinics in {a.en}
            </Link>{" "}
            · <Link href={`/in/${a.slug}`}>everything in {a.en}</Link>
          </p>
        </>
      )}

      <h2>What to check before you book in {a.en}</h2>
      <ul className="clinic-list">
        {terms.map((g) => (
          <li key={g.slug}>
            <Link href={`/glossary/${g.slug}`}>{g.en}</Link> — {g.short}
          </li>
        ))}
      </ul>

      <h2>Questions</h2>
      <dl className="term-list">
        {faq.map((f) => (
          <div key={f.q}>
            <dt>
              <strong>{f.q}</strong>
            </dt>
            <dd style={{ margin: "6px 0 0" }}>{f.a}</dd>
          </div>
        ))}
      </dl>

      <h2>{t.en} in other areas</h2>
      <p className="note">
        {otherAreas.map((o, i) => (
          <span key={o.slug}>
            {i > 0 && " · "}
            <Link href={`/in/${o.slug}/${t.slug}`}>{o.en}</Link>
          </span>
        ))}
      </p>

      <h2>Other treatments in {a.en}</h2>
      <p className="note">
        {otherTreatments.map((o, i) => (
          <span key={o.slug}>
            {i > 0 && " · "}
            <Link href={`/in/${a.slug}/${o.slug}`}>{o.en}</Link>
          </span>
        ))}
      </p>

      <h2>Other languages</h2>
      <p className="note">
        {LOCALES.map((l, i) => (
          <span key={l}>
            {i > 0 && " · "}
            <Link
              href={`/${l}/in/${a.slug}/${t.slug}`}
              hrefLang={LOCALE_META[l].htmlLang}
            >
              {LOCALE_META[l].label}
            </Link>
          </span>
        ))}
      </p>
    </div>
  );
}
