import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fitDesc, fitTitle } from "@/lib/meta";
import { DICTS, LOCALES, LOCALE_META, isLocale, type Locale } from "@/data/i18n";
import { AREA_DICTS } from "@/data/areas-text";
import { areaL10n, fieldL10n } from "@/data/areas-i18n";
import {
  AREAS,
  AREA_TREATMENTS,
  areaBySlug,
  clinicsInArea,
  fieldBreakdown,
} from "@/lib/areas";
import { CLINICS_CHECKED } from "@/lib/clinics";
import { COLLECTED, pricesFor, range, won } from "@/lib/prices";

// 언어별 지역 묶음 쪽. 영어 쪽(/in/<area>)과 같은 자료를 쓰고 문구만 사전에서 가져온다.
// 지역별 가격은 없다고 어느 언어에서도 분명히 말한다. 순위·추천은 쓰지 않는다.

type Props = { params: Promise<{ lang: string; area: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return LOCALES.flatMap((lang) => AREAS.map((a) => ({ lang, area: a.slug })));
}

const num = (n: number) => n.toLocaleString("en-US");

const dateIn = (d: string, lang: Locale) =>
  new Date(d + "T00:00:00Z").toLocaleDateString(LOCALE_META[lang].htmlLang, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, area } = await params;
  if (!isLocale(lang)) return {};
  const a = areaBySlug(area);
  const l = areaL10n(lang, area);
  if (!a || !l) return {};
  const ad = AREA_DICTS[lang];
  return {
    title: fitTitle([ad.areaTitle(l.name)]),
    description: fitDesc(
      ad.areaMeta(
        l.name,
        num(clinicsInArea(a).length),
        dateIn(CLINICS_CHECKED, lang),
      ),
    ),
    alternates: {
      canonical: `/${lang}/in/${a.slug}`,
      languages: {
        en: `/in/${a.slug}`,
        ...Object.fromEntries(
          LOCALES.map((x) => [LOCALE_META[x].htmlLang, `/${x}/in/${a.slug}`]),
        ),
        "x-default": `/in/${a.slug}`,
      },
    },
  };
}

export default async function LocalisedArea({ params }: Props) {
  const { lang, area } = await params;
  if (!isLocale(lang)) notFound();
  const a = areaBySlug(area);
  const l = areaL10n(lang, area);
  if (!a || !l) notFound();

  const d = DICTS[lang];
  const ad = AREA_DICTS[lang];
  const clinics = clinicsInArea(a);
  const fields = fieldBreakdown(a);
  const others = AREAS.filter((x) => x.slug !== a.slug);
  const nameIn = (t: (typeof AREA_TREATMENTS)[number]) =>
    t[LOCALE_META[lang].nameKey] || t.en;
  const otherName = (slug: string) => areaL10n(lang, slug)?.name ?? slug;

  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: ad.registryCrumb,
        item: "/hospitals",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: l.name,
        item: `/${lang}/in/${a.slug}`,
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
        · {l.name}
      </p>
      <h1 className="page-title">{ad.areaTitle(l.name)}</h1>
      <p className="sub">
        {lang !== "ko" && <span lang="ko">{a.ko} · </span>}
        {ad.areaLead(
          l.name,
          l.district,
          num(clinics.length),
          dateIn(CLINICS_CHECKED, lang),
        )}
      </p>

      <h2>{ad.canTellTitle}</h2>
      <ul className="clinic-list">
        <li>{ad.canTell1(l.name)}</li>
        <li>{ad.canTell2(l.name)}</li>
        <li>{ad.canTell3}</li>
      </ul>

      <h2>{ad.registryTitle(l.name)}</h2>
      <table className="clinic-spec">
        <tbody>
          <tr>
            <th scope="row">{ad.rowRegistered}</th>
            <td>{num(clinics.length)}</td>
          </tr>
          <tr>
            <th scope="row">{ad.rowDistrict}</th>
            <td>{l.district}</td>
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

      <h2>{ad.byFieldTitle}</h2>
      <ul className="clinic-list">
        {fields.map((f) => (
          <li key={f.field}>
            <Link
              href={`/hospitals?area=${encodeURIComponent(a.key)}&field=${f.field}`}
              hrefLang="en"
            >
              {fieldL10n(lang, f.field)}
            </Link>{" "}
            — {ad.registeredCount(num(f.count))}
          </li>
        ))}
      </ul>

      <h2>{ad.priceTitle(l.name)}</h2>
      <p className="sub">{ad.priceLead(dateIn(COLLECTED, lang), l.name)}</p>
      <table className="clinic-spec">
        <tbody>
          {AREA_TREATMENTS.map((t) => {
            const lead = pricesFor(t.slug).find((p) => p.kind === "list");
            return (
              <tr key={t.slug}>
                <th scope="row">
                  <Link href={`/${lang}/in/${a.slug}/${t.slug}`}>
                    {ad.inArea(nameIn(t), l.name)}
                  </Link>
                </th>
                <td>
                  {lead ? (
                    <>
                      <strong>{range(lead.low, lead.high, won)}</strong>
                      <br />
                      <small>
                        {lead.spec} · {ad.clinicsPublished(lead.clinics)}
                      </small>
                    </>
                  ) : (
                    <small>{ad.eventOnly}</small>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="note" style={{ marginTop: 12 }}>
        <Link href="/how-prices-work" hrefLang="en">
          {ad.howCollectedLink}
        </Link>{" "}
        ·{" "}
        <Link href={`/${lang}/treatments`}>{ad.allTreatmentsLink}</Link>
      </p>

      <h2>{ad.clinicsHereTitle(l.name)}</h2>
      <p className="sub">{ad.clinicsHereLead(num(clinics.length), l.name)}</p>
      <p className="note">
        <Link href={`/hospitals?area=${encodeURIComponent(a.key)}`} hrefLang="en">
          {ad.seeAllClinics(num(clinics.length), l.name)}
        </Link>
      </p>

      <h2>{ad.otherAreasTitle}</h2>
      <p className="note">
        {others.map((o, i) => (
          <span key={o.slug}>
            {i > 0 && " · "}
            <Link href={`/${lang}/in/${o.slug}`}>{otherName(o.slug)}</Link>
          </span>
        ))}
      </p>

      <h2>{d.otherLanguages}</h2>
      <p className="note">
        <Link href={`/in/${a.slug}`} hrefLang="en">
          {d.seeEnglish}
        </Link>
        {LOCALES.filter((x) => x !== lang).map((x) => (
          <span key={x}>
            {" · "}
            <Link
              href={`/${x}/in/${a.slug}`}
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
