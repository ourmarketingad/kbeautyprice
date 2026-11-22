import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DICTS, LOCALES, LOCALE_META, isLocale, type Locale } from "@/data/i18n";
import { AREA_DICTS } from "@/data/areas-text";
import { areaL10n, fieldL10n } from "@/data/areas-i18n";
import {
  AREAS,
  AREA_TREATMENTS,
  CHECK_TERMS,
  areaBySlug,
  clinicsForTreatmentInArea,
  clinicsInArea,
  fieldsForCategory,
} from "@/lib/areas";
import { CLINICS_CHECKED } from "@/lib/clinics";
import { categories } from "@/data/categories";
import { glossary } from "@/data/glossary";
import {
  COLLECTED,
  KRW_PER_USD,
  MIN_CLINICS,
  pricesFor,
  range,
  usd,
  won,
} from "@/lib/prices";

// 언어별 지역 × 시술 쪽. 영어 쪽(/in/<area>/<treatment>)과 같은 자료를 쓴다.
// 지역별 가격 자료는 없다 — 전국 공개 범위, 그 지역 등록 병원 수(측정값), 물어볼 것만 말한다.

type Props = { params: Promise<{ lang: string; area: string; treatment: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return LOCALES.flatMap((lang) =>
    AREAS.flatMap((a) =>
      AREA_TREATMENTS.map((t) => ({
        lang,
        area: a.slug,
        treatment: t.slug,
      })),
    ),
  );
}

const num = (n: number) => n.toLocaleString("en-US");
const termBySlug = (s: string) => glossary.find((g) => g.slug === s);

const dateIn = (d: string, lang: Locale) =>
  new Date(d + "T00:00:00Z").toLocaleDateString(LOCALE_META[lang].htmlLang, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, area, treatment } = await params;
  if (!isLocale(lang)) return {};
  const a = areaBySlug(area);
  const l = areaL10n(lang, area);
  const t = AREA_TREATMENTS.find((x) => x.slug === treatment);
  if (!a || !l || !t) return {};
  const ad = AREA_DICTS[lang];
  const name = t[LOCALE_META[lang].nameKey] || t.en;
  const n = num(clinicsForTreatmentInArea(a, t).length);
  const lead = pricesFor(t.slug).find((p) => p.kind === "list");
  return {
    title: ad.atTitle(name, l.name),
    description: lead
      ? ad.atMetaWith(
          n,
          l.name,
          lead.clinics,
          lead.spec,
          range(lead.low, lead.high, won),
          dateIn(COLLECTED, lang),
        )
      : ad.atMetaNo(n, l.name),
    alternates: {
      canonical: `/${lang}/in/${a.slug}/${t.slug}`,
      languages: {
        en: `/in/${a.slug}/${t.slug}`,
        ...Object.fromEntries(
          LOCALES.map((x) => [
            LOCALE_META[x].htmlLang,
            `/${x}/in/${a.slug}/${t.slug}`,
          ]),
        ),
        "x-default": `/in/${a.slug}/${t.slug}`,
      },
    },
  };
}

export default async function LocalisedAreaTreatment({ params }: Props) {
  const { lang, area, treatment } = await params;
  if (!isLocale(lang)) notFound();
  const a = areaBySlug(area);
  const l = areaL10n(lang, area);
  const t = AREA_TREATMENTS.find((x) => x.slug === treatment);
  if (!a || !l || !t) notFound();

  const d = DICTS[lang];
  const ad = AREA_DICTS[lang];
  const nameKey = LOCALE_META[lang].nameKey;
  const name = t[nameKey] || t.en;
  const rows = pricesFor(t.slug);
  const lead = rows.find((p) => p.kind === "list") ?? rows[0];
  const cat = categories.find((c) => c.slug === t.category);
  const catName = cat ? cat[nameKey] || cat.en : "";
  const inField = clinicsForTreatmentInArea(a, t);
  const allInArea = clinicsInArea(a);
  const fields = fieldsForCategory(t.category);
  const fieldNames = fields.map((f) => fieldL10n(lang, f)).join(" · ");
  const terms = [
    ...(CHECK_TERMS[t.category] ?? []),
    "vat",
    "first-visit-price",
    "written-quote",
  ]
    .map(termBySlug)
    .filter((x): x is NonNullable<typeof x> => Boolean(x));
  const otherTreatments = AREA_TREATMENTS.filter(
    (x) => x.slug !== t.slug,
  ).slice(0, 8);
  const otherAreas = AREAS.filter((x) => x.slug !== a.slug);
  const otherAreaName = (slug: string) => areaL10n(lang, slug)?.name ?? slug;

  const kindLabel = (k: string) => (k === "event" ? d.eventPrice : d.listedPrice);
  const vatLabel = (v: string) =>
    v === "included"
      ? d.vatIncluded
      : v === "excluded"
        ? d.vatExcluded
        : v === "mixed"
          ? d.vatMixed
          : d.vatUnknown;

  const faq = [
    {
      q: ad.faqCostQ(name, l.name),
      a: lead
        ? ad.faqCostAWith(
            l.name,
            lead.clinics,
            lead.spec,
            range(lead.low, lead.high, won),
            range(lead.low, lead.high, usd),
            dateIn(lead.seenOn, lang),
          )
        : ad.faqCostANo(MIN_CLINICS),
    },
    { q: ad.faqElsewhereQ(name), a: ad.faqElsewhereA },
    {
      q: ad.faqHowManyQ(l.name),
      a: ad.faqHowManyA(
        num(inField.length),
        num(allInArea.length),
        l.name,
        fieldNames,
        name,
      ),
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
          {
            "@type": "ListItem",
            position: 1,
            name: l.name,
            item: `/${lang}/in/${a.slug}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: ad.inArea(name, l.name),
            item: `/${lang}/in/${a.slug}/${t.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <div className="wrap page-top" lang={LOCALE_META[lang].htmlLang}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <p className="note">
        <Link href="/hospitals" hrefLang="en">
          {ad.registryCrumb}
        </Link>{" "}
        · <Link href={`/${lang}/in/${a.slug}`}>{l.name}</Link>
        {catName && (
          <>
            {" · "}
            <Link href={`/${lang}/treatments`}>{catName}</Link>
          </>
        )}
      </p>
      <h1 className="page-title">{ad.inArea(name, l.name)}</h1>
      <p className="sub">
        <span lang="en">{t.en}</span>
        {lang !== "ko" && t.ko && <span lang="ko"> · {t.ko}</span>}
        <br />
        {ad.atLead(
          l.district,
          num(inField.length),
          l.name,
          fieldNames,
          dateIn(CLINICS_CHECKED, lang),
        )}
      </p>

      <h2>{ad.readFirstTitle}</h2>
      <p className="sub">{ad.readFirstBody(l.name, name)}</p>

      {rows.length > 0 && (
        <>
          <h2>{ad.rangeTitle}</h2>
          <table className="clinic-spec">
            <tbody>
              {rows.map((p) => (
                <tr key={p.spec + p.kind}>
                  <th scope="row">
                    {p.spec}
                    <br />
                    <small>
                      {kindLabel(p.kind)} · {vatLabel(p.vat)}
                    </small>
                  </th>
                  <td>
                    <strong>{range(p.low, p.high, won)}</strong>
                    <br />
                    <small>
                      {d.aboutUsd} {range(p.low, p.high, usd)} ·{" "}
                      {ad.clinicsPublished(p.clinics)} · {d.checkedOn}{" "}
                      {dateIn(p.seenOn, lang)}
                    </small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="note" style={{ marginTop: 12 }}>
            {d.notNamed(
              KRW_PER_USD.toLocaleString("en-US"),
              dateIn(COLLECTED, lang),
            )}{" "}
            <Link href={`/${lang}/treatments/${t.slug}`}>
              {ad.fullPricePage(name)}
            </Link>{" "}
            ·{" "}
            <Link href="/how-prices-work" hrefLang="en">
              {ad.howCollectedLink}
            </Link>
          </p>
        </>
      )}

      <h2>{ad.whatAreaHasTitle(l.name)}</h2>
      <table className="clinic-spec">
        <tbody>
          <tr>
            <th scope="row">{ad.rowFieldClinics}</th>
            <td>{ad.rowFieldClinicsVal(num(inField.length), fieldNames)}</td>
          </tr>
          <tr>
            <th scope="row">{ad.rowAllClinics}</th>
            <td>{num(allInArea.length)}</td>
          </tr>
          <tr>
            <th scope="row">{ad.rowTransit}</th>
            <td>{l.transit}</td>
          </tr>
          <tr>
            <th scope="row">{ad.rowChecked}</th>
            <td>{CLINICS_CHECKED}</td>
          </tr>
        </tbody>
      </table>

      {inField.length > 0 && (
        <>
          <h2>{ad.whereToLookTitle(l.name)}</h2>
          <p className="sub">
            {ad.whereToLookBody(
              num(inField.length),
              fieldNames,
              l.name,
              name,
            )}
          </p>
          <p className="note">
            <Link
              href={`/hospitals?area=${encodeURIComponent(a.key)}&field=${fields[0]}`}
              hrefLang="en"
            >
              {ad.seeFieldClinics(num(inField.length), fieldNames, l.name)}
            </Link>{" "}
            ·{" "}
            <Link href={`/${lang}/in/${a.slug}`}>
              {ad.everythingIn(l.name)}
            </Link>
          </p>
        </>
      )}

      <h2>{ad.checkTitle(l.name)}</h2>
      <p className="note">{ad.glossaryEnNote}</p>
      <ul className="clinic-list">
        {terms.map((g) => (
          <li key={g.slug}>
            <Link href={`/glossary/${g.slug}`} hrefLang="en">
              <span lang="en">{g.en}</span>
            </Link>{" "}
            — <span lang="en">{g.short}</span>
          </li>
        ))}
      </ul>

      <h2>{ad.questionsTitle}</h2>
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

      <h2>{ad.inOtherAreasTitle(name)}</h2>
      <p className="note">
        {otherAreas.map((o, i) => (
          <span key={o.slug}>
            {i > 0 && " · "}
            <Link href={`/${lang}/in/${o.slug}/${t.slug}`}>
              {otherAreaName(o.slug)}
            </Link>
          </span>
        ))}
      </p>

      <h2>{ad.otherTreatmentsTitle(l.name)}</h2>
      <p className="note">
        {otherTreatments.map((o, i) => (
          <span key={o.slug}>
            {i > 0 && " · "}
            <Link href={`/${lang}/in/${a.slug}/${o.slug}`}>
              {o[nameKey] || o.en}
            </Link>
          </span>
        ))}
      </p>

      <h2>{d.otherLanguages}</h2>
      <p className="note">
        <Link href={`/in/${a.slug}/${t.slug}`} hrefLang="en">
          {d.seeEnglish}
        </Link>
        {LOCALES.filter((x) => x !== lang).map((x) => (
          <span key={x}>
            {" · "}
            <Link
              href={`/${x}/in/${a.slug}/${t.slug}`}
              hrefLang={LOCALE_META[x].htmlLang}
            >
              {LOCALE_META[x].label}
            </Link>
          </span>
        ))}
      </p>

      <p className="note" style={{ marginTop: 18 }}>
        {d.disclaimer}
      </p>
    </div>
  );
}
