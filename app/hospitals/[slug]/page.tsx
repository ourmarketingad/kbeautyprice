import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  CLINICS,
  CLINICS_CHECKED,
  FIELD_LABEL,
  areaCount,
  CONTACTS_CHECKED,
  ambiguousOptions,
  clinicBySlug,
  contactFor,
  groupLeadSlug,
  isAmbiguous,
  pricedTreatmentsForField,
  sameAreaClinics,
} from "@/lib/clinics";
import prices from "@/data/prices.json";
import { fitDesc, fitTitle } from "@/lib/meta";

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
  const con = contactFor(c.slug);
  // 길이를 맞춘 이유: 2026-11-24 전수 측정에서 이 묶음 1,372쪽 전부가 설명문 160자를 넘겨
  // 검색 결과에서 뒤가 잘렸고, 378쪽은 제목도 60자를 넘겼다. 「명부일 뿐 추천이 아니다」는
  // 문장은 쪽 본문에 그대로 있으므로 설명문에서는 뺀다.
  return {
    // 같은 이름·같은 지역 병원이 2~3곳 있어 제목이 겹쳤다(블리비의원 3쪽 등, 2026-11-25 실측).
    // 명부의 대표자명을 붙여 구분한다. 겹치지 않는 병원에는 붙이지 않는다.
    title: fitTitle([
      isAmbiguous(c) && con?.ceo ? `${c.en} (${con.ceo})` : c.en,
      `${field} in ${c.area}`,
    ]),
    description: fitDesc(
      `${c.en} (${field}, ${c.area}) is on the official registry of institutions permitted to receive foreign patients. Checked ${CLINICS_CHECKED}.`,
    ),
    // 같은 이름·같은 지역 쪽이 여럿이면 대표주소를 한 쪽으로 모은다(쪽은 지우지 않는다).
    alternates: { canonical: `/hospitals/${groupLeadSlug(c)}` },
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
  // 명부에서 받아온 전화·대표자·기관 구분. 없으면 그 칸을 아예 내지 않는다(빈칸을 지어내지 않는다).
  const con = contactFor(c.slug);
  const options = ambiguousOptions(c.slug);
  // 지도: 주소를 아직 갖고 있지 않으므로 「검색 링크」로만 보낸다. 주소를 안 적는 대신
  // 사람이 바로 찾을 수 있게 한다. 주소를 받으면 이 자리를 주소 + 길찾기로 바꾼다.
  // 지도는 주소가 있으면 주소로, 없으면 이름 + 시·도로 찾게 한다.
  const mapQuery = encodeURIComponent((con?.road || `${c.ko} ${con?.sido ?? ""}`).trim());

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: c.en,
    alternateName: c.ko !== c.en ? c.ko : undefined,
    address: {
      "@type": "PostalAddress",
      ...(con?.road ? { streetAddress: con.road } : {}),
      addressLocality: c.area,
      addressRegion: con?.sido,
      addressCountry: "KR",
    },
    ...(con?.phone ? { telephone: con.phone } : {}),
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
      {options.length > 0 && (
        // 명부에 같은 이름이 여러 곳 있고(지점), 우리 자료만으로는 어느 곳인지 가릴 수 없다.
        // 주소를 하나 골라 적으면 틀릴 수 있으므로 후보를 그대로 보여 준다.
        <section className="clinic-options">
          <h2>Clinics with this name on the registry</h2>
          <p className="note">
            The registry lists {options.length} clinics with this name. We cannot
            tell from the public data which one this listing is, so we do not pick
            an address for you. Checked {CONTACTS_CHECKED}.
          </p>
          <ul>
            {options.map((o, i) => (
              <li key={i} lang="ko">
                {o.road}
                {o.phone ? ` · ${o.phone}` : ""}
                {o.ceo ? ` · ${o.ceo}` : ""}
              </li>
            ))}
          </ul>
        </section>
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
          {con?.phone && (
            <tr>
              <th scope="row">Phone</th>
              <td>
                <a href={`tel:${con.phone.replace(/[^0-9+]/g, "")}`}>{con.phone}</a>{" "}
                · from the registry, checked {con.checked}
              </td>
            </tr>
          )}
          {con?.ceo && (
            <tr>
              <th scope="row">Representative</th>
              <td lang="ko">{con.ceo}</td>
            </tr>
          )}
          {con?.kind && (
            <tr>
              <th scope="row">Institution type</th>
              <td lang="ko">
                {con.kind}
                {con.status ? ` · ${con.status}` : ""}
              </td>
            </tr>
          )}
          {con?.road && (
            <tr>
              <th scope="row">Address</th>
              <td>
                <span lang="ko">{con.road}</span>
                <br />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Google Maps
                </a>{" "}
                · from the registry, checked {con.checked}
              </td>
            </tr>
          )}
          {con?.nations && (
            <tr>
              <th scope="row">Registered for patients from</th>
              <td lang="ko">{con.nations}</td>
            </tr>
          )}
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
          {field}
          {con
            ? ", with the address, phone number, representative, institution type and registered patient countries the registry lists"
            : ""}
          . That is what the registry publishes.
        </li>
        <li>
          We do not hold this clinic&apos;s own prices, opening hours, doctors,
          languages or treatment list{con?.road ? "" : ", or its street address"}.
          Ask the clinic directly.
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
