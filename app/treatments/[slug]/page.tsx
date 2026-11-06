import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Odometer, RangeBar } from "@/components/Motion";
import PriceCard from "@/components/PriceCard";
import QuoteBar from "@/components/QuoteBar";
import { treatmentImage } from "@/lib/images";
import { publishedItemsFor } from "@/lib/listing";
import { categories } from "@/data/categories";
import { guides } from "@/data/guides";
import { treatments } from "@/data/treatments";
import {
  COLLECTED,
  COMEDI_QUOTE,
  KIND_LABEL,
  KRW_PER_USD,
  MIN_CLINICS,
  VAT_LABEL,
  pricesFor,
  range,
  usd,
  won,
  type PriceRow,
} from "@/lib/prices";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const revalidate = 300;
export const generateStaticParams = () =>
  treatments.map((t) => ({ slug: t.slug }));

const SITE = "https://kbeautyprice.vercel.app";

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

const shortDate = (d: string) =>
  new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
const longDate = (d: string) =>
  new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

/** 자주 묻는 질문. 답은 전부 이 페이지의 가격 데이터에서 만든다(효과·안전 같은 의학 주장은 쓰지 않는다). */
function faqFor(name: string, rows: PriceRow[]) {
  const list = rows.find((r) => r.kind === "list");
  const event = rows.find((r) => r.kind === "event");
  const out: { q: string; a: string }[] = [];
  if (list) {
    out.push({
      q: `How much does ${name} cost in Seoul?`,
      a: `${list.clinics} Seoul clinics list ${list.spec} at ${range(list.low, list.high, won)} on their own websites (about ${range(list.low, list.high, usd)}). We checked on ${longDate(list.seenOn)}. Your price depends on the clinic, product and plan.`,
    });
  } else {
    out.push({
      q: `How much does ${name} cost in Seoul?`,
      a: `Fewer than ${MIN_CLINICS} clinics we checked publish the same item, so we show no range rather than a guess. A written quote from the clinic is the reliable number.`,
    });
  }
  const vatRow = list ?? event;
  if (vatRow) {
    const vat: Record<string, string> = {
      included: "The clinics we counted show prices with VAT included.",
      excluded:
        "The clinics we counted show prices before VAT, so the amount you pay can be higher.",
      mixed:
        "It differs by clinic: some published prices include VAT and some do not.",
      unknown: "Most clinics we counted do not say whether VAT is included.",
    };
    out.push({
      q: "Is VAT included in these prices?",
      a: `${vat[vatRow.vat] ?? vat.unknown} Ask the clinic to state VAT on your written quote.`,
    });
  }
  if (event) {
    out.push({
      q: "What is the event price?",
      a: `${event.clinics} clinics also show a limited event price of ${range(event.low, event.high, won)}. Event prices depend on dates or on who qualifies, so we keep them separate from listed prices.`,
    });
  }
  out.push({
    q: "Why do prices differ so much between clinics?",
    a: "Clinics differ in the product or device version, the dose, what is bundled in, and whether VAT is included. Compare written quotes item by item.",
  });
  return out;
}

export default async function TreatmentPage({ params }: Props) {
  const { slug } = await params;
  const t = treatments.find((x) => x.slug === slug);
  if (!t) notFound();
  const rows = pricesFor(slug);
  const listed = await publishedItemsFor(slug);
  const cat = categories.find((c) => c.slug === t.category);
  const related = treatments
    .filter((x) => x.category === t.category && x.slug !== slug)
    .slice(0, 4);
  const relatedRows = related.map((r) => ({
    t: r,
    row: pricesFor(r.slug).find((p) => p.kind === "list"),
  }));
  const min = rows.length ? Math.min(...rows.map((r) => r.low)) : 0;
  const max = rows.length ? Math.max(...rows.map((r) => r.high)) : 0;
  const lead = rows.find((r) => r.kind === "list") ?? rows[0];
  const faq = faqFor(t.en, rows);
  const reading = [
    ...guides.filter((g) => g.slug.startsWith(t.slug.split("-")[0])),
    ...guides.filter((g) =>
      ["why-same-treatment-different-price", "is-the-lowest-price-the-final-price"].includes(g.slug),
    ),
  ].slice(0, 3);

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Prices", item: `${SITE}/treatments` },
          ...(cat
            ? [{ "@type": "ListItem", position: 2, name: cat.en, item: `${SITE}/treatments?category=${cat.slug}` }]
            : []),
          { "@type": "ListItem", position: cat ? 3 : 2, name: t.en, item: `${SITE}/treatments/${t.slug}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="wrap detail has-quote-bar">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <header className="detail-head">
        <img
          className="detail-hero"
          src={treatmentImage(t.slug)}
          alt=""
          width={640}
          height={480}
        />
        <div className="detail-intro">
          <p className="note">
            <Link href="/treatments">Prices</Link>
            {cat && (
              <>
                {" · "}
                <Link href={`/treatments?category=${cat.slug}`}>{cat.en}</Link>
              </>
            )}
          </p>
          <h1 className="detail-title">{t.en} price in Seoul</h1>
          <p className="sub">
            <span lang="ko">{t.ko}</span> · <span lang="ja">{t.ja}</span> ·{" "}
            <span lang="zh-Hant">{t["zh-TW"]}</span>
          </p>
          {lead && (
            <p className="detail-answer">
              <span>{lead.spec}</span>
              <strong>{range(lead.low, lead.high, won)}</strong>
              <span>
                About {range(lead.low, lead.high, usd)} · {lead.clinics} clinics ·{" "}
                {KIND_LABEL[lead.kind].toLowerCase()}
              </span>
            </p>
          )}
        </div>
      </header>

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
        <section className="section" aria-labelledby="ranges">
          <h2 id="ranges">Published price ranges</h2>
          <ul className="price-panels">
            {rows.map((p, i) => (
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
                  </span>
                  {rows.length > 1 && (
                    <RangeBar low={p.low} high={p.high} min={min} max={max} kind={p.kind} order={i} />
                  )}
                  <dl className="price-facts">
                    <div>
                      <dt>About, in US$</dt>
                      <dd>{range(p.low, p.high, usd)}</dd>
                    </div>
                    <div>
                      <dt>Clinics</dt>
                      <dd>{p.clinics}</dd>
                    </div>
                    <div>
                      <dt>Checked</dt>
                      <dd>{shortDate(p.seenOn)}</dd>
                    </div>
                  </dl>
                </div>
              </li>
            ))}
          </ul>
          {rows.length > 1 && (
            <p className="range-scale" aria-hidden="true">
              <span>Bars share one scale: {won(min)}</span>
              <span>{won(max)}</span>
            </p>
          )}
          <p className="note" style={{ marginTop: 12 }}>
            Clinics are not named or ranked. US dollars are approximate at ₩
            {KRW_PER_USD.toLocaleString("en-US")} per dollar ({longDate(COLLECTED)});
            clinics charge in won. <Link href="/how-prices-work">How we collect prices</Link>
          </p>
        </section>
      )}

      {listed.length > 0 && (
        <section className="section" aria-labelledby="clinic-listed">
          <h2 id="clinic-listed">Prices provided by clinics</h2>
          <p className="note">
            Advertising information from listed clinics, sorted by item name. Not part
            of the ranges above and not a recommendation.
          </p>
          <ul className="price-panels">
            {listed.map((i) => (
              <li key={i.id}>
                <Link className="price-row" href={`/clinics/${i.clinics.slug}`}>
                  <span className="price-name">
                    {i.title}
                    <span className="price-spec">
                      {i.clinics.name_en} · {i.kind === "event" ? "Event price" : "Listed price"}
                    </span>
                  </span>
                  <span className="price-val">{won(i.price_krw)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="section" aria-labelledby="quote-check">
        <h2 id="quote-check">What to check on a written quote</h2>
        <ul className="check-list">
          {[
            "Product or device, dose, and number of sessions",
            "Whether anaesthesia, medication and follow-up visits are included",
            "Whether VAT is included, and how refunds work",
            "Who performs the treatment, and how long the quote is valid",
          ].map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <p className="note" style={{ marginTop: 12 }}>
          Whether a treatment suits you is for a doctor to decide at
          consultation.
        </p>
      </section>

      <section className="section" aria-labelledby="faq">
        <h2 id="faq">Questions about {t.en} prices</h2>
        <div className="faq">
          {faq.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {rows.length > 0 && (
        <section className="section desk-only">
          <div className="cta-band">
            <p>
              <strong>Want a number for your own plan?</strong>
              COMEDI, run by the same company, can request a written quote.
              Clinics may pay COMEDI a referral fee, explained in writing before
              you book.
            </p>
            <span className="btn-pair">
              <a className="btn" href={COMEDI_QUOTE}>
                Ask COMEDI
              </a>
              <Link className="btn-line" href="/how-prices-work">
                How prices work
              </Link>
            </span>
          </div>
        </section>
      )}

      {reading.length > 0 && (
        <section className="section" aria-labelledby="read-next">
          <h2 id="read-next">Read next</h2>
          <ul className="guide-list">
            {reading.map((g) => (
              <li key={g.slug}>
                <Link href={`/guides/${g.slug}`}>
                  <span>
                    <span className="guide-group">{g.group}</span>
                    <strong>{g.title}</strong>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 이 시술에 범위가 없으면 다른 시술 금액도 보이지 않게(숫자 없는 페이지 원칙) 이름만 */}
      {related.length > 0 && rows.length > 0 && (
        <section className="section" aria-labelledby="related">
          <h2 id="related">More in {cat?.en ?? "this category"}</h2>
          <ul className="cards">
            {relatedRows.map(({ t: r, row }) => (
              <PriceCard
                key={r.slug}
                slug={r.slug}
                name={row?.spec ?? r.en}
                sub={r.ko}
                row={row}
              />
            ))}
          </ul>
        </section>
      )}

      <section className="section">
        <div className="chips">
          <Link href={`/submit?treatment=${t.slug}`}>
            Report what you paid for {t.en}
          </Link>
          {rows.length === 0 &&
            related.map((r) => (
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
