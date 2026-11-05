import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import QuoteBar from "@/components/QuoteBar";
import { guideImage } from "@/lib/images";
import { getGuide, guides } from "@/data/guides";
import { KIND_LABEL, pricesFor, range, usd, won } from "@/lib/prices";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => guides.map((g) => ({ slug: g.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = getGuide((await params).slug);
  if (!g) return {};
  return { title: g.title, description: g.answer.slice(0, 155) };
}

export default async function GuidePage({ params }: Props) {
  const g = getGuide((await params).slug);
  if (!g) notFound();
  const rows = g.priceSlug ? pricesFor(g.priceSlug) : [];
  const more = guides.filter((x) => x.slug !== g.slug).slice(0, 3);
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: g.title,
      datePublished: g.date,
      dateModified: g.date,
      author: { "@type": "Organization", name: "KBeautyPrice" },
      publisher: { "@type": "Organization", name: "OUR Marketing" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: g.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];
  return (
    <div className="narrow article has-quote-bar">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <img className="detail-hero" src={guideImage(g.slug)} alt="" width={640} height={480} />
      <p className="note">
        <Link href="/guides">Guides</Link> · {g.group} · {g.date}
      </p>
      <h1>{g.title}</h1>
      <p className="article-answer">{g.answer}</p>
      {rows.length > 0 && (
        <ul className="price-panels">
          {rows.map((p) => (
            <li key={p.spec + p.kind}>
              <div className="price-row">
                <span className="price-name">
                  {p.spec}
                  <span className="price-spec">{KIND_LABEL[p.kind]}</span>
                </span>
                <span className="price-val">
                  {range(p.low, p.high, won)}
                  <span className="price-meta">
                    About {range(p.low, p.high, usd)} · {p.clinics} clinics ·
                    checked {p.seenOn}
                  </span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
      {g.blocks.map((b) => (
        <section key={b.h}>
          <h2>{b.h}</h2>
          {b.p?.map((t) => (
            <p key={t}>{t}</p>
          ))}
          {b.items && (
            <ul className="check-list">
              {b.items.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
      <section>
        <h2>Common questions</h2>
        {g.faq.map((f) => (
          <div key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}
      </section>
      <p className="note">
        Written by KBeautyPrice about costs and quotes. Not medical advice and
        not reviewed by a doctor.
      </p>
      <div className="chips">
        {g.priceSlug && <Link href={`/treatments/${g.priceSlug}`}>See this treatment</Link>}
        {more.map((m) => (
          <Link key={m.slug} href={`/guides/${m.slug}`}>
            {m.title}
          </Link>
        ))}
      </div>
      <QuoteBar />
    </div>
  );
}
