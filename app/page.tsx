import Link from "next/link";
import { DrawLine, Odometer, WordTitle } from "@/components/Motion";
import { categories } from "@/data/categories";
import { guides } from "@/data/guides";
import { treatments } from "@/data/treatments";
import {
  COLLECTED,
  KIND_LABEL,
  PRICES,
  range,
  usd,
  won,
} from "@/lib/prices";
import { LINE_JA, LINE_TW, WHATSAPP } from "@/components/QuoteBar";

const withData = new Set(PRICES.map((p) => p.slug));

export default function HomePage() {
  const rows = PRICES.filter((p) => p.kind === "list").slice(0, 8);
  const cats = categories.filter((c) =>
    treatments.some((t) => t.category === c.slug && withData.has(t.slug)),
  );
  return (
    <>
      <section className="hero wrap">
        <WordTitle text="What treatments cost in Seoul, with the source on every number." />
        <p className="hero-deck">
          Ranges from prices clinics publish on their own websites, with how
          many clinics and the date checked.
        </p>
        <form action="/treatments" method="get" className="search" role="search">
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
          <button type="submit" className="btn">
            Search
          </button>
        </form>
      </section>

      <div className="hscroll wrap" aria-label="Categories">
        {cats.map((c) => (
          <Link key={c.slug} href={`/treatments?category=${c.slug}`}>
            {c.en}
          </Link>
        ))}
      </div>

      <section className="section wrap" aria-labelledby="ranges">
        <h2 id="ranges">Published price ranges</h2>
        <p className="sub">
          {withData.size} treatments · checked {COLLECTED}. A range needs at
          least three clinics.
        </p>
        <ul className="cards">
          {rows.map((p) => {
            const t = treatments.find((x) => x.slug === p.slug);
            return (
              <li key={p.slug + p.spec}>
                <Link href={`/treatments/${p.slug}`}>
                  <span className="card-name">{t?.en ?? p.slug}</span>
                  <span className="card-spec">{p.spec}</span>
                  <span className="card-price">
                    <Odometer value={won(p.low)} />
                  </span>
                  <span className="card-to">to {won(p.high)}</span>
                  <span className="card-meta">
                    {KIND_LABEL[p.kind]} · {p.clinics} clinics · about{" "}
                    {range(p.low, p.high, usd)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="chips">
          <Link href="/treatments">See all treatments</Link>
        </div>
      </section>

      <div className="wrap">
        <DrawLine />
      </div>
      <section className="section wrap" aria-labelledby="guides">
        <h2 id="guides">Guides</h2>
        <ul className="guide-list">
          {guides.slice(0, 3).map((g) => (
            <li key={g.slug}>
              <Link href={`/guides/${g.slug}`}>
                <span className="guide-group">{g.group}</span>
                <strong>{g.title}</strong>
              </Link>
            </li>
          ))}
        </ul>
        <div className="chips">
          <Link href="/guides">See all guides</Link>
        </div>
      </section>

      <div className="wrap">
        <DrawLine />
      </div>
      <section className="section wrap" aria-labelledby="kinds">
        <h2 id="kinds">Three prices, three different meanings</h2>
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
            <h3>Your written quote</h3>
            <p>What a clinic proposes for you, item by item. This one counts.</p>
          </div>
        </div>
      </section>

      <section className="section wrap">
        <div className="cta-band">
          <p>
            <strong>Want a written quote?</strong>
            COMEDI, run by the same company, can ask a clinic for you. Clinics
            may pay COMEDI a referral fee, explained in writing before you book.
          </p>
          <div className="chips" style={{ marginTop: 0 }}>
            <a className="btn" href={WHATSAPP}>
              WhatsApp
            </a>
            <a className="btn-line" href={LINE_JA} lang="ja">
              LINE 日本語
            </a>
            <a className="btn-line" href={LINE_TW} lang="zh-Hant">
              LINE 繁中
            </a>
          </div>
        </div>
      </section>

      <section className="section wrap">
        <div className="cta-band">
          <p>
            <strong>Paid for a treatment in Korea?</strong>
            Report it without your name. Reports appear after five people report
            the same item. None are published yet.
          </p>
          <Link className="btn-line" href="/submit">
            Report a price
          </Link>
        </div>
      </section>
    </>
  );
}
