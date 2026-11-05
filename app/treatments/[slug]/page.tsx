import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Odometer } from "@/components/Motion";
import QuoteBar from "@/components/QuoteBar";
import { categories } from "@/data/categories";
import { treatments } from "@/data/treatments";
import {
  COMEDI_QUOTE,
  KIND_LABEL,
  KRW_PER_USD,
  MIN_CLINICS,
  VAT_LABEL,
  pricesFor,
  range,
  usd,
  won,
} from "@/lib/prices";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () =>
  treatments.map((t) => ({ slug: t.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = treatments.find((x) => x.slug === slug);
  if (!t) return {};
  return {
    title: `${t.en} price in Seoul`,
    description: pricesFor(slug).length
      ? `${t.en} price ranges from prices Seoul clinics publish, with clinic counts and the date checked.`
      : `${t.en} in Seoul: not enough clinics publish this price yet. How to get a written quote instead.`,
  };
}

export default async function TreatmentPage({ params }: Props) {
  const { slug } = await params;
  const t = treatments.find((x) => x.slug === slug);
  if (!t) notFound();
  const rows = pricesFor(slug);
  const cat = categories.find((c) => c.slug === t.category);
  const related = treatments
    .filter((x) => x.category === t.category && x.slug !== slug)
    .slice(0, 6);
  return (
    <div className="wrap page-top has-quote-bar">
      <p className="note">
        <Link href="/treatments">Prices</Link>
        {cat && (
          <>
            {" · "}
            <Link href={`/treatments?category=${cat.slug}`}>{cat.en}</Link>
          </>
        )}
      </p>
      <h1 className="h2" style={{ fontSize: "clamp(30px,4.4vw,42px)" }}>
        {t.en} price in Seoul
      </h1>
      <p className="sub">
        <span lang="ko">{t.ko}</span> · <span lang="ja">{t.ja}</span> ·{" "}
        <span lang="zh-Hant">{t["zh-TW"]}</span>
      </p>

      {rows.length === 0 ? (
        <div className="cta-band" style={{ marginTop: 24 }}>
          <p>
            <strong>No published range yet</strong>
            Fewer than {MIN_CLINICS} clinics we checked publish the same item,
            so we show no number rather than a guess.
          </p>
          <a className="btn" href={COMEDI_QUOTE}>
            Ask for a written quote
          </a>
        </div>
      ) : (
        <ul className="price-list">
          {rows.map((p) => (
            <li key={p.spec + p.kind}>
              <div className="price-row">
                <span className="price-name">
                  {p.spec}
                  <span className="price-spec">
                    <span className={p.kind === "event" ? "tag event" : "tag"}>
                      {KIND_LABEL[p.kind]}
                    </span>{" "}
                    {VAT_LABEL[p.vat] ?? VAT_LABEL.unknown}
                  </span>
                </span>
                <span className="price-val">
                  <Odometer value={range(p.low, p.high, won)} />
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
      <p className="note" style={{ marginTop: 12 }}>
        Clinics are not named or ranked. US dollars are approximate at ₩
        {KRW_PER_USD.toLocaleString("en-US")} per dollar; clinics charge in won.
        Your price depends on the clinic, product and plan.{" "}
        <Link href="/how-prices-work">How we collect prices</Link>
      </p>

      <section className="section" aria-labelledby="quote-check">
        <h2 id="quote-check">What to check on a written quote</h2>
        <ul className="price-list">
          {[
            "Product or device, dose, and number of sessions",
            "Whether anaesthesia, medication and follow-up visits are included",
            "Whether VAT is included, and how refunds work",
            "Who performs the treatment, and how long the quote is valid",
          ].map((x) => (
            <li key={x} style={{ padding: "12px 0" }}>
              {x}
            </li>
          ))}
        </ul>
        <p className="note" style={{ marginTop: 12 }}>
          Whether a treatment suits you is for a doctor to decide at
          consultation.
        </p>
      </section>

      {rows.length > 0 && (
        <section className="section">
          <div className="cta-band">
            <p>
              <strong>Want a number for your own plan?</strong>
              COMEDI, run by the same company, can request a written quote.
              Clinics may pay COMEDI a referral fee, explained in writing before
              you book.
            </p>
            <a className="btn" href={COMEDI_QUOTE}>
              Ask COMEDI
            </a>
          </div>
        </section>
      )}

      <section className="section">
        <div className="chips">
          <Link href={`/submit?treatment=${t.slug}`}>
            Report what you paid for {t.en}
          </Link>
          {related.map((r) => (
            <Link key={r.slug} href={`/treatments/${r.slug}`}>
              {r.en}
            </Link>
          ))}
        </div>
      </section>
      <QuoteBar treatment={t.en} />
    </div>
  );
}
