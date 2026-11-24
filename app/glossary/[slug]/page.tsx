import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fitDesc, fitTitle } from "@/lib/meta";
import {
  GLOSSARY_CATEGORY,
  getTerm,
  glossary,
  termsInCategory,
} from "@/data/glossary";
import { treatments } from "@/data/treatments";
import { KIND_LABEL, pricesFor, range, usd, won } from "@/lib/prices";
import prices from "@/data/prices.json";

// 용어 하나의 쪽. 설명과 「가격에서 무엇이 달라지는가」만 쓴다.
// 효과·적합성 주장, 병원 이름, 환자 사례를 쓰지 않는다.

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => glossary.map((t) => ({ slug: t.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = getTerm((await params).slug);
  if (!t) return { title: "Term not found" };
  return {
    // 제목 49쪽이 60자를 넘겨 검색 결과에서 잘렸다(2026-11-24 실측) → 토막 단위로 맞춘다.
    title: fitTitle([`${t.en}${t.ko ? ` (${t.ko})` : ""}`, "what it means on a Korean price"]),
    description: fitDesc(t.short),
    alternates: { canonical: `/glossary/${t.slug}` },
  };
}

export default async function TermPage({ params }: Props) {
  const t = getTerm((await params).slug);
  if (!t) notFound();

  const cat = GLOSSARY_CATEGORY[t.category];
  const related = (t.related ?? [])
    .map((s) => getTerm(s))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));
  const sameCat = termsInCategory(t.category)
    .filter((x) => x.slug !== t.slug && !related.some((r) => r.slug === x.slug))
    .slice(0, 6);
  const rows = t.priceSlug ? pricesFor(t.priceSlug) : [];
  const treatment = t.priceSlug
    ? treatments.find((x) => x.slug === t.priceSlug)
    : undefined;

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      name: t.en,
      alternateName: t.aka,
      description: t.short,
      inDefinedTermSet: {
        "@type": "DefinedTermSet",
        name: "Korean clinic price glossary",
        url: "/glossary",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Glossary", item: "/glossary" },
        { "@type": "ListItem", position: 2, name: t.en, item: `/glossary/${t.slug}` },
      ],
    },
  ];

  return (
    <div className="wrap page-top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <p className="note">
        <Link href="/glossary">Glossary</Link> ·{" "}
        <Link href={`/glossary?c=${t.category}`}>{cat.label}</Link>
      </p>

      <h1 className="page-title">
        {t.en}
        {t.ko && (
          <span className="term-ko" lang="ko">
            {t.ko}
          </span>
        )}
      </h1>
      <p className="sub">{t.short}</p>

      {t.aka && t.aka.length > 0 && (
        <table className="term-spec">
          <tbody>
            <tr>
              <th scope="row">Also called</th>
              <td>{t.aka.join(" · ")}</td>
            </tr>
            <tr>
              <th scope="row">Category</th>
              <td>
                <Link href={`/glossary?c=${t.category}`}>{cat.label}</Link>
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {t.blocks.map((b) => (
        <section key={b.h}>
          <h2>{b.h}</h2>
          {b.p.map((para, i) => (
            <p key={i} className="term-p">
              {para}
            </p>
          ))}
        </section>
      ))}

      {rows.length > 0 && treatment && (
        <>
          <h2>What {treatment.en} costs in Seoul</h2>
          <p className="sub">
            From prices clinics publish on their own websites, collected{" "}
            {prices.collected}. Not a quote.
          </p>
          <div className="price-panels">
            {rows.map((r, i) => (
              <div key={i} className="price-row">
                <span className="price-spec">
                  {r.spec} · {KIND_LABEL[r.kind] ?? r.kind}
                </span>
                <span className="price-val">
                  {range(r.low, r.high, won)}{" "}
                  <small>({range(r.low, r.high, usd)})</small>
                </span>
                <span className="price-meta">
                  {r.clinics} clinics · checked {r.seenOn}
                </span>
              </div>
            ))}
          </div>
          <p className="note">
            <Link href={`/treatments/${treatment.slug}`}>
              Full {treatment.en} page
            </Link>{" "}
            · <Link href="/how-prices-work">How prices work</Link>
          </p>
        </>
      )}

      {related.length > 0 && (
        <>
          <h2>Related terms</h2>
          <ul className="term-list">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/glossary/${r.slug}`}>{r.en}</Link> — {r.short}
              </li>
            ))}
          </ul>
        </>
      )}

      {sameCat.length > 0 && (
        <>
          <h2>More in {cat.label.toLowerCase()}</h2>
          <ul className="term-list">
            {sameCat.map((r) => (
              <li key={r.slug}>
                <Link href={`/glossary/${r.slug}`}>{r.en}</Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="note" style={{ marginTop: 20 }}>
        Reference information about pricing words, not medical advice and not a
        quote. Ask the clinic what its own price covers.
      </p>
    </div>
  );
}
