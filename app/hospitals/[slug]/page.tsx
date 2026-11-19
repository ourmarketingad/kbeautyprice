import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  CLINICS,
  CLINICS_CHECKED,
  FIELD_LABEL,
  areaCount,
  clinicBySlug,
  pricedTreatmentsForField,
  sameAreaClinics,
} from "@/lib/clinics";
import prices from "@/data/prices.json";

// 등록 병원 한 곳의 쪽. 순위·별점·후기·전후사진·추천을 쓰지 않는다.
// 이 쪽은 「공식 명부에 등록돼 있다」는 사실과 지역·분야만 말하고, 가격은 병원이 아니라 시술 쪽으로 보낸다.

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CLINICS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = clinicBySlug(slug);
  if (!c) return { title: "Clinic not found" };
  const field = FIELD_LABEL[c.field] ?? c.field;
  return {
    title: `${c.en} — ${field} in ${c.area}`,
    description: `${c.en} is on the official Medical Korea maintained registry of institutions permitted to receive foreign patients (${field}, ${c.area}), checked ${CLINICS_CHECKED}. A listing is not a recommendation.`,
    alternates: { canonical: `/hospitals/${c.slug}` },
  };
}

export default async function ClinicPage({ params }: Props) {
  const { slug } = await params;
  const c = clinicBySlug(slug);
  if (!c) notFound();

  const field = FIELD_LABEL[c.field] ?? c.field;
  const priced = pricedTreatmentsForField(c.field);
  const nearby = sameAreaClinics(c);
  const inArea = areaCount(c.area);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: c.en,
    alternateName: c.ko !== c.en ? c.ko : undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: c.area,
      addressCountry: "KR",
    },
    medicalSpecialty: field,
    url: `/hospitals/${c.slug}`,
  };

  return (
    <div className="wrap page-top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="note">
        <Link href="/hospitals">Registered clinics</Link> ·{" "}
        <Link href={`/hospitals?area=${encodeURIComponent(c.area)}`}>
          {c.area}
        </Link>
      </p>
      <h1 className="page-title" lang={c.en === c.ko ? "ko" : undefined}>
        {c.en}
      </h1>
      {c.en !== c.ko && (
        <p className="sub" lang="ko">
          {c.ko}
        </p>
      )}
      <p className="sub">
        On the official Medical Korea maintained registry of institutions
        permitted to receive foreign patients. Checked {CLINICS_CHECKED}. A
        listing is not a recommendation and says nothing about price, quality or
        which treatments this clinic offers.
      </p>

      <h2>Key information</h2>
      <table className="clinic-spec">
        <tbody>
          <tr>
            <th scope="row">Field</th>
            <td>
              <Link href={`/hospitals?field=${c.field}`}>{field}</Link>
            </td>
          </tr>
          <tr>
            <th scope="row">Area</th>
            <td>
              <Link href={`/hospitals?area=${encodeURIComponent(c.area)}`}>
                {c.area}
              </Link>{" "}
              · {inArea.toLocaleString("en-US")} registered providers in this
              area
            </td>
          </tr>
          <tr>
            <th scope="row">Foreign patient registry</th>
            <td>Listed, checked {CLINICS_CHECKED}</td>
          </tr>
          <tr>
            <th scope="row">Prices on this site</th>
            <td>
              {priced.length > 0
                ? "None for this clinic. Ranges below are for the field, across clinics."
                : "None for this clinic or this field."}
            </td>
          </tr>
        </tbody>
      </table>

      <h2>What we know, and what we do not</h2>
      <ul className="clinic-list">
        <li>
          We know this provider is on the public registry, in {c.area}, under{" "}
          {field}. That is what the registry publishes.
        </li>
        <li>
          We do not hold this clinic&apos;s own prices, opening hours, doctors,
          languages or treatment list. Ask the clinic directly.
        </li>
        <li>
          We do not publish reviews, ratings, before-and-after photos or
          rankings, for any clinic.
        </li>
        <li>
          Being on the registry means the institution may receive foreign
          patients. It is not a quality mark.
        </li>
      </ul>

      {priced.length > 0 ? (
        <>
          <h2>What these treatments cost in Seoul</h2>
          <p className="sub">
            Ranges from prices clinics publish on their own websites, collected{" "}
            {prices.collected}. They are not this clinic&apos;s prices and are
            not a quote.
          </p>
          <ul className="clinic-list">
            {priced.map((t) => (
              <li key={t.slug}>
                <Link href={`/treatments/${t.slug}`}>{t.en}</Link>
              </li>
            ))}
          </ul>
          <p className="note">
            <Link href="/how-prices-work">
              How these numbers are collected
            </Link>
          </p>
        </>
      ) : (
        <>
          <h2>Prices</h2>
          <p className="sub">
            We have no published price ranges for {field} yet. We collect
            ranges only where at least three clinics publish the same treatment
            at the same size.{" "}
            <Link href="/treatments">See the treatments we do cover</Link>.
          </p>
        </>
      )}

      {nearby.length > 0 && (
        <>
          <h2>
            Other registered {field.toLowerCase()} providers in {c.area}
          </h2>
          <p className="sub">
            Listed alphabetically, not ranked. Not a recommendation.
          </p>
          <ul className="clinic-list">
            {nearby.map((n) => (
              <li key={n.slug}>
                <Link href={`/hospitals/${n.slug}`} lang="ko">
                  {n.en}
                </Link>
              </li>
            ))}
          </ul>
          <p className="note">
            <Link href={`/hospitals?area=${encodeURIComponent(c.area)}&field=${c.field}`}>
              See all in {c.area}
            </Link>
          </p>
        </>
      )}

      <h2>If this is your clinic</h2>
      <p className="sub">
        A registered clinic can show its own treatments and prices here, marked
        as provided by the clinic.{" "}
        <Link href="/for-clinics">How listing works</Link>.
      </p>
    </div>
  );
}
