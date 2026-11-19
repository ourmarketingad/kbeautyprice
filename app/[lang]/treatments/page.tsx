import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DICTS, LOCALES, LOCALE_META, isLocale, type Locale } from "@/data/i18n";
import { categories } from "@/data/categories";
import { treatments } from "@/data/treatments";
import { COLLECTED, pricesFor, range, won } from "@/lib/prices";

// 언어별 시술 목록. 가격이 있는 시술을 먼저 보여 준다.

type Props = { params: Promise<{ lang: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));

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
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = DICTS[lang];
  return {
    title: d.allTreatments,
    description: d.allTreatmentsLead(
      treatments.length,
      treatments.filter((t) => pricesFor(t.slug).length > 0).length,
      COLLECTED,
    ),
    alternates: {
      canonical: `/${lang}/treatments`,
      languages: {
        en: "/treatments",
        ...Object.fromEntries(
          LOCALES.map((l) => [LOCALE_META[l].htmlLang, `/${l}/treatments`]),
        ),
        "x-default": "/treatments",
      },
    },
  };
}

export default async function LocalisedTreatments({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = DICTS[lang];
  const withPrice = treatments.filter((t) => pricesFor(t.slug).length > 0);
  const without = treatments.filter((t) => pricesFor(t.slug).length === 0);

  const card = (t: (typeof treatments)[number]) => {
    const lead = pricesFor(t.slug).find((p) => p.kind === "list");
    const cat = categories.find((c) => c.slug === t.category);
    return (
      <li key={t.slug}>
        <Link href={`/${lang}/treatments/${t.slug}`}>
          <strong>{nameIn(t, lang)}</strong>
          <span lang="en">{t.en}</span>
          <span className="term-short">
            {lead
              ? `${range(lead.low, lead.high, won)} · ${d.clinicsCount} ${lead.clinics}`
              : d.noRangeTitle}
            {cat ? ` · ${cat[LOCALE_META[lang].nameKey] || cat.en}` : ""}
          </span>
        </Link>
      </li>
    );
  };

  return (
    <div className="wrap page-top" lang={LOCALE_META[lang].htmlLang}>
      <h1 className="page-title">{d.allTreatments}</h1>
      <p className="sub">
        {d.allTreatmentsLead(
          treatments.length,
          withPrice.length,
          dateIn(COLLECTED, lang),
        )}
      </p>

      <h2>{d.publishedRanges}</h2>
      <ul className="term-cards">{withPrice.map(card)}</ul>

      {without.length > 0 && (
        <>
          <h2>{d.noRangeTitle}</h2>
          <ul className="term-cards">{without.map(card)}</ul>
        </>
      )}

      <h2>{d.otherLanguages}</h2>
      <p className="note">
        <Link href="/treatments" hrefLang="en">
          {d.seeEnglish}
        </Link>
        {LOCALES.filter((l) => l !== lang).map((l) => (
          <span key={l}>
            {" · "}
            <Link href={`/${l}/treatments`} hrefLang={LOCALE_META[l].htmlLang}>
              {LOCALE_META[l].label}
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
