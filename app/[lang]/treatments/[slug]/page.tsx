import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DICTS, LOCALES, LOCALE_META, isLocale, type Locale } from "@/data/i18n";
import { categories } from "@/data/categories";
import { treatments } from "@/data/treatments";
import {
  COLLECTED,
  KRW_PER_USD,
  MIN_CLINICS,
  pricesFor,
  range,
  usd,
  won,
  type PriceRow,
} from "@/lib/prices";

// 영어가 아닌 언어의 시술 가격 쪽. 영어 쪽(/treatments/<slug>)과 같은 자료를 쓰고 문구만 사전에서 가져온다.
// 숫자·날짜·병원 수는 번역하지 않는다. 효과·적합성 주장은 쓰지 않는다.

type Props = { params: Promise<{ lang: string; slug: string }> };

const SITE = "https://kbeautyprice.vercel.app";

export const dynamicParams = false;
export function generateStaticParams() {
  return LOCALES.flatMap((lang) =>
    treatments.map((t) => ({ lang, slug: t.slug })),
  );
}

const nameIn = (t: (typeof treatments)[number], lang: Locale) =>
  t[LOCALE_META[lang].nameKey] || t.en;

const dateIn = (d: string, lang: Locale) =>
  new Date(d + "T00:00:00Z").toLocaleDateString(LOCALE_META[lang].htmlLang, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const t = treatments.find((x) => x.slug === slug);
  if (!t) return {};
  const d = DICTS[lang];
  const name = nameIn(t, lang);
  const has = pricesFor(slug).length > 0;
  return {
    title: d.priceInSeoul(name),
    description: has ? d.metaWithRange(name) : d.metaNoRange(name),
    alternates: {
      canonical: `/${lang}/treatments/${slug}`,
      languages: {
        en: `/treatments/${slug}`,
        ...Object.fromEntries(
          LOCALES.map((l) => [
            LOCALE_META[l].htmlLang,
            `/${l}/treatments/${slug}`,
          ]),
        ),
        "x-default": `/treatments/${slug}`,
      },
    },
  };
}

function faqFor(lang: Locale, name: string, rows: PriceRow[]) {
  const d = DICTS[lang];
  const list = rows.find((r) => r.kind === "list");
  const event = rows.find((r) => r.kind === "event");
  const out: { q: string; a: string }[] = [];
  out.push({
    q: d.faqCost(name),
    a: list
      ? d.faqCostA(
          list.clinics,
          list.spec,
          range(list.low, list.high, won),
          range(list.low, list.high, usd),
          dateIn(list.seenOn, lang),
        )
      : d.faqCostNoneA(MIN_CLINICS),
  });
  const vatRow = list ?? event;
  if (vatRow) {
    const key = (vatRow.vat in d.faqVatA ? vatRow.vat : "unknown") as
      | "included"
      | "excluded"
      | "mixed"
      | "unknown";
    out.push({ q: d.faqVat, a: d.faqVatA[key] });
  }
  if (event) {
    out.push({
      q: d.faqEvent,
      a: d.faqEventA(event.clinics, range(event.low, event.high, won)),
    });
  }
  out.push({ q: d.faqWhyDiffer, a: d.faqWhyDifferA });
  return out;
}

export default async function LocalisedTreatment({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const t = treatments.find((x) => x.slug === slug);
  if (!t) notFound();

  const d = DICTS[lang];
  const name = nameIn(t, lang);
  const rows = pricesFor(slug);
  const cat = categories.find((c) => c.slug === t.category);
  const catName = cat ? cat[LOCALE_META[lang].nameKey] || cat.en : "";
  const related = treatments
    .filter((x) => x.category === t.category && x.slug !== slug)
    .slice(0, 6);
  const faq = faqFor(lang, name, rows);
  const kindLabel = (k: string) => (k === "event" ? d.eventPrice : d.listedPrice);
  const vatLabel = (v: string) =>
    v === "included"
      ? d.vatIncluded
      : v === "excluded"
        ? d.vatExcluded
        : v === "mixed"
          ? d.vatMixed
          : d.vatUnknown;

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
            name: d.prices,
            item: `${SITE}/${lang}/treatments`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name,
            item: `${SITE}/${lang}/treatments/${slug}`,
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
        <Link href={`/${lang}/treatments`}>{d.prices}</Link>
        {catName && ` · ${catName}`}
      </p>
      <h1 className="page-title">{d.priceInSeoul(name)}</h1>
      <p className="sub">
        <span lang="en">{t.en}</span>
        {t.ko && lang !== "ko" && <span lang="ko"> · {t.ko}</span>}
      </p>

      {rows.length === 0 ? (
        <>
          <h2>{d.noRangeTitle}</h2>
          <p className="term-p">{d.noRangeBody(MIN_CLINICS)}</p>
        </>
      ) : (
        <>
          <h2>{d.publishedRanges}</h2>
          <table className="term-spec">
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
                      {d.clinicsCount} {p.clinics} · {d.checkedOn}{" "}
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
            )}
          </p>
        </>
      )}

      <h2>{d.faqTitle}</h2>
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

      {related.length > 0 && (
        <>
          <h2>{d.related}</h2>
          <ul className="term-list">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/${lang}/treatments/${r.slug}`}>
                  {nameIn(r, lang)}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <h2>{d.otherLanguages}</h2>
      <p className="note">
        <Link href={`/treatments/${slug}`} hrefLang="en">
          {d.seeEnglish}
        </Link>
        {LOCALES.filter((l) => l !== lang).map((l) => (
          <span key={l}>
            {" · "}
            <Link
              href={`/${l}/treatments/${slug}`}
              hrefLang={LOCALE_META[l].htmlLang}
            >
              {LOCALE_META[l].label}
            </Link>
          </span>
        ))}
        {" · "}
        <Link href="/glossary" hrefLang="en">
          {d.glossaryNote}
        </Link>
      </p>

      <p className="note" style={{ marginTop: 18 }}>
        {d.disclaimer}
      </p>
    </div>
  );
}
