import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  AREAS,
  AREA_TREATMENTS,
  areaBySlug,
  clinicsInArea,
  fieldBreakdown,
} from "@/lib/areas";
import { CLINICS_CHECKED, FIELD_LABEL } from "@/lib/clinics";
import { COLLECTED, pricesFor, range, won } from "@/lib/prices";
import { LOCALES, LOCALE_META } from "@/data/i18n";
import { areaL10n } from "@/data/areas-i18n";

// 지역 묶음 쪽. 지역별 가격은 없다고 쪽에서 분명히 말한다. 순위·추천을 쓰지 않는다.

type Props = { params: Promise<{ area: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => AREAS.map((a) => ({ area: a.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { area } = await params;
  const a = areaBySlug(area);
  if (!a) return { title: "Area not found" };
  const n = clinicsInArea(a).length;
  return {
    title: `Clinics and treatment prices in ${a.en}`,
    description: `${n.toLocaleString("en-US")} clinics in ${a.en} are on the official registry of institutions permitted to receive foreign patients, checked ${CLINICS_CHECKED}. Published price ranges on this site are nationwide, not per area.`,
    alternates: {
      canonical: `/in/${a.slug}`,
      languages: {
        en: `/in/${a.slug}`,
        ...Object.fromEntries(
          LOCALES.map((l) => [LOCALE_META[l].htmlLang, `/${l}/in/${a.slug}`]),
        ),
        "x-default": `/in/${a.slug}`,
      },
    },
  };
}

export default async function AreaPage({ params }: Props) {
  const { area } = await params;
  const a = areaBySlug(area);
  if (!a) notFound();

  const clinics = clinicsInArea(a);
  const fields = fieldBreakdown(a);
  const others = AREAS.filter((x) => x.slug !== a.slug);

  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Registered clinics", item: "/hospitals" },
      { "@type": "ListItem", position: 2, name: a.en, item: `/in/${a.slug}` },
    ],
  };

  return (
    <div className="wrap page-top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <p className="note">
        <Link href="/hospitals">Registered clinics</Link> · {a.en}
      </p>
      <h1 className="page-title">Clinics and prices in {a.en}</h1>
      <p className="sub">
        <span lang="ko">{a.ko}</span> · {a.district}.{" "}
        {clinics.length.toLocaleString("en-US")} clinics here are on the
        official Medical Korea maintained registry of institutions permitted to
        receive foreign patients, checked {CLINICS_CHECKED}.
      </p>

      <h2>What this page can and cannot tell you</h2>
      <ul className="clinic-list">
        <li>
          The clinic count for {a.en} is from the public registry. It is a count
          of registered institutions, not a count of good ones.
        </li>
        <li>
          The price ranges on this site come from prices clinics publish on
          their own websites. They are not broken down by area, so there is no
          &ldquo;{a.en} price&rdquo; here and we do not invent one.
        </li>
        <li>
          No rankings, reviews, ratings or before-and-after photos, here or
          anywhere on this site.
        </li>
      </ul>

      <h2>{a.en} in the registry</h2>
      <table className="clinic-spec">
        <tbody>
          <tr>
            <th scope="row">Registered clinics</th>
            <td>{clinics.length.toLocaleString("en-US")}</td>
          </tr>
          <tr>
            <th scope="row">District</th>
            <td>{a.district}</td>
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

      <h2>By field</h2>
      <ul className="clinic-list">
        {fields.map((f) => (
          <li key={f.field}>
            <Link href={`/hospitals?area=${encodeURIComponent(a.key)}&field=${f.field}`}>
              {FIELD_LABEL[f.field] ?? f.field}
            </Link>{" "}
            — {f.count.toLocaleString("en-US")} registered
          </li>
        ))}
      </ul>

      <h2>Treatment prices, with {a.en} clinic counts</h2>
      <p className="sub">
        Ranges collected {COLLECTED} from clinic websites across Seoul. Each
        page below also tells you how many registered clinics in {a.en} work in
        that field.
      </p>
      <table className="clinic-spec">
        <tbody>
          {AREA_TREATMENTS.map((t) => {
            const lead = pricesFor(t.slug).find((p) => p.kind === "list");
            return (
              <tr key={t.slug}>
                <th scope="row">
                  <Link href={`/in/${a.slug}/${t.slug}`}>
                    {t.en} in {a.en}
                  </Link>
                </th>
                <td>
                  {lead ? (
                    <>
                      <strong>{range(lead.low, lead.high, won)}</strong>
                      <br />
                      <small>
                        {lead.spec} · {lead.clinics} clinics published this
                      </small>
                    </>
                  ) : (
                    <small>Event prices only — see the page</small>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="note" style={{ marginTop: 12 }}>
        <Link href="/how-prices-work">How these numbers are collected</Link> ·{" "}
        <Link href="/treatments">All treatments</Link>
      </p>

      <h2>Registered clinics in {a.en}</h2>
      <p className="sub">
        Clinic names are kept on the registry pages, not beside prices. All{" "}
        {clinics.length.toLocaleString("en-US")} are listed alphabetically, with
        no ranking and no recommendation.
      </p>
      <p className="note">
        <Link href={`/hospitals?area=${encodeURIComponent(a.key)}`}>
          See all {clinics.length.toLocaleString("en-US")} registered clinics in{" "}
          {a.en}
        </Link>
      </p>

      <h2>Other areas</h2>
      <p className="note">
        {others.map((o, i) => (
          <span key={o.slug}>
            {i > 0 && " · "}
            <Link href={`/in/${o.slug}`}>{o.en}</Link>
          </span>
        ))}
      </p>

      <h2>Other languages</h2>
      <p className="note">
        {LOCALES.map((l, i) => (
          <span key={l}>
            {i > 0 && " · "}
            <Link href={`/${l}/in/${a.slug}`} hrefLang={LOCALE_META[l].htmlLang}>
              {LOCALE_META[l].label}
              {areaL10n(l, a.slug) ? ` — ${areaL10n(l, a.slug)!.name}` : ""}
            </Link>
          </span>
        ))}
      </p>
    </div>
  );
}
