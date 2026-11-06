import Link from "next/link";
import { Icon } from "@/components/Icons";
import { DrawLine, WordTitle } from "@/components/Motion";
import PriceCard from "@/components/PriceCard";
import { LINE_JA, LINE_TW, WHATSAPP } from "@/components/QuoteBar";
import { categories } from "@/data/categories";
import { guides } from "@/data/guides";
import { treatments } from "@/data/treatments";
import { guideImage } from "@/lib/images";
import { COLLECTED, EVIDENCE, PRICES } from "@/lib/prices";

const withData = new Set(PRICES.map((p) => p.slug));
const FEATURES = [
  {
    href: "/treatments/ultherapy",
    img: "/img/lifting.webp",
    kicker: "Published prices",
    title: "Ultherapy, 300 shots",
    text: "What Seoul clinics show on their own websites",
  },
  {
    href: "/guides/what-a-written-quote-should-include",
    img: "/img/hero-quote.webp",
    kicker: "Guide",
    title: "What belongs on a written quote",
    text: "The checklist before you agree to anything",
  },
  {
    href: "/submit",
    img: "/img/hero-report.webp",
    kicker: "Help others",
    title: "Paid in Korea? Report it",
    text: "No name needed. Published after five reports",
  },
];

export default function HomePage() {
  const rows = PRICES.filter(
    (p, i, all) =>
      p.kind === "list" &&
      all.findIndex((x) => x.slug === p.slug && x.kind === "list") === i,
  ).slice(0, 8);
  const cats = categories.filter((c) =>
    treatments.some((t) => t.category === c.slug),
  );
  return (
    <>
      <section className="top-band">
        <div className="wrap">
          <WordTitle text="Seoul clinic prices, with the source on every number." />
          <form
            action="/treatments"
            method="get"
            className="search-pill"
            role="search"
          >
            <label className="sr-only" htmlFor="q">
              Search treatments
            </label>
            <input
              id="q"
              name="q"
              type="search"
              placeholder="Ultherapy, jaw botox, 리쥬란"
              autoComplete="off"
            />
            <button type="submit" aria-label="Search">
              <Icon name="search" size={22} />
            </button>
          </form>
        </div>
        <div className="wrap">
        <dl className="proof">
          <div>
            <dt>Prices read</dt>
            <dd>{EVIDENCE.prices}</dd>
          </div>
          <div>
            <dt>Clinic websites</dt>
            <dd>{EVIDENCE.clinics}</dd>
          </div>
          <div>
            <dt>Last checked</dt>
            <dd>
              {new Date(COLLECTED + "T00:00:00Z").toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                timeZone: "UTC",
              })}
            </dd>
          </div>
          <Link href="/how-prices-work">How we collect prices</Link>
        </dl>
        </div>
        <div className="feat" aria-label="Featured">
          {FEATURES.map((f) => (
            <Link key={f.href} href={f.href} className="feat-card">
              <img src={f.img} alt="" width={640} height={480} />
              <span>
                <em>{f.kicker}</em>
                <strong>{f.title}</strong>
                {f.text}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <nav className="cats wrap" aria-label="Treatment categories">
        {cats.map((c) => (
          <Link key={c.slug} href={`/treatments?category=${c.slug}`}>
            <span>
              <Icon name={c.slug} size={26} />
            </span>
            {c.en}
          </Link>
        ))}
      </nav>

      <section className="section wrap" aria-labelledby="ranges">
        <div className="sec-head">
          <h2 id="ranges">Published prices</h2>
          <Link href="/treatments" aria-label="See all prices">
            <Icon name="arrow" size={20} />
          </Link>
        </div>
        <p className="sub">
          {withData.size} treatments · checked {COLLECTED} · three clinics or
          more
        </p>
        <ul className="cards">
          {rows.map((p, i) => {
            const t = treatments.find((x) => x.slug === p.slug);
            return (
              <PriceCard
                key={p.slug + p.spec}
                slug={p.slug}
                name={p.spec}
                sub={t?.ko}
                row={p}
                odometer
                lazy={i > 1}
              />
            );
          })}
        </ul>
      </section>

      <div className="wrap">
        <DrawLine />
      </div>
      <section className="section wrap" aria-labelledby="guides">
        <div className="sec-head">
          <h2 id="guides">Guides</h2>
          <Link href="/guides" aria-label="See all guides">
            <Icon name="arrow" size={20} />
          </Link>
        </div>
        <ul className="guide-list">
          {guides.slice(0, 3).map((g) => (
            <li key={g.slug}>
              <Link href={`/guides/${g.slug}`}>
                <span>
                  <span className="guide-group">{g.group}</span>
                  <strong>{g.title}</strong>
                </span>
                <img src={guideImage(g.slug)} alt="" width={640} height={480} loading="lazy" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="wrap">
        <DrawLine />
      </div>
      <section className="section wrap" aria-labelledby="kinds">
        <h2 id="kinds">Three prices, three meanings</h2>
        <div className="three">
          <div>
            <h3>Listed price</h3>
            <p>The clinic&apos;s regular or pre-discount price on its page.</p>
          </div>
          <div>
            <h3>Event price</h3>
            <p>Limited by date or by who qualifies. We keep it separate.</p>
          </div>
          <div>
            <h3 className="mark">Your written quote</h3>
            <p>What a clinic proposes for you, item by item. This one counts.</p>
          </div>
        </div>
      </section>

      <section className="section wrap">
        <div className="cta-dark">
          <h2>Want a number for your own plan?</h2>
          <p>
            COMEDI, run by the same company, can ask a clinic for a written
            quote. Clinics may pay COMEDI a referral fee, explained in writing
            before you book.
          </p>
          <div>
            <a className="btn" href={WHATSAPP}>
              <Icon name="chat" size={18} /> WhatsApp
            </a>
            <a className="btn-soft" href={LINE_JA} lang="ja">
              LINE 日本語
            </a>
            <a className="btn-soft" href={LINE_TW} lang="zh-Hant">
              LINE 繁中
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
