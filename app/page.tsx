// 첫 화면 — 시안 B(2026-11-06 대표 선택): 코랄 머리 띠 + 흰 검색 → 위로 겹치는 흰 판(아이콘 타일·가격 카드 띠·계산기·글)
// 옛 첫 화면 내용은 모두 남겼다: 검색·많이 찾는 시술·계산기·근거 숫자·분류·가격·글·세 가지 가격·상담. 옛 사진 카드 3장은 가격 띠·글·제보 칸으로 옮겼다.
import Link from "next/link";
import { preload } from "react-dom";
import { Icon } from "@/components/Icons";
import { Odometer, WordTitle } from "@/components/Motion";
import PriceCheck from "@/components/PriceCheck";
import { LINE_JA, LINE_TW, WHATSAPP } from "@/components/QuoteBar";
import { categories } from "@/data/categories";
import { guides } from "@/data/guides";
import { treatments } from "@/data/treatments";
import { guideImage, treatmentImage } from "@/lib/images";
import { bandPhoto } from "@/lib/images";
import { COLLECTED, EVIDENCE, PRICES, VAT_LABEL, range, usd, won } from "@/lib/prices";

const checked = new Date(COLLECTED + "T00:00:00Z").toLocaleDateString("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export default function HomePage() {
  // 첫 화면 띠 뒤 사진을 먼저 받는다(첫 화면 큰 그림 시간이 늦어지지 않게)
  preload("/img/photo/seoul-gangnam-m.webp", { as: "image", media: "(max-width: 760px)", fetchPriority: "high" });
  preload("/img/photo/seoul-gangnam.webp", { as: "image", media: "(min-width: 761px)", fetchPriority: "high" });
  const listed = treatments.flatMap((t) => {
    const row = PRICES.find((p) => p.slug === t.slug && p.kind === "list");
    return row ? [{ t, row }] : [];
  });
  const withData = new Set(listed.map((x) => x.t.slug));
  const calcOptions = listed.map(({ t, row }) => ({ slug: t.slug, name: t.en, row }));
  const popular = treatments
    .filter((t) => t.popularityRank && withData.has(t.slug))
    .sort((a, b) => (a.popularityRank ?? 99) - (b.popularityRank ?? 99))
    .slice(0, 4);
  const cats = categories.filter((c) =>
    treatments.some((t) => t.category === c.slug),
  );
  return (
    <>
      <section className="band band-home band-photo" style={bandPhoto("seoul-gangnam")}>
        <div className="wrap">
          <WordTitle text="Clinic prices in Seoul, checked for you" />
          <form action="/treatments" method="get" className="band-search" role="search">
            <label className="sr-only" htmlFor="q">
              Search treatments
            </label>
            <Icon name="search" size={20} />
            <input
              id="q"
              name="q"
              type="search"
              placeholder="Ultherapy, jaw botox, 리쥬란"
              autoComplete="off"
            />
            <button type="submit">Search</button>
          </form>
          <nav className="band-pop" aria-label="Often searched">
            {popular.map((t) => (
              <Link key={t.slug} href={`/treatments/${t.slug}`}>
                {t.en}
              </Link>
            ))}
          </nav>
          <dl className="band-proof">
            <div>
              <dt>Prices read</dt>
              <dd>{EVIDENCE.prices}</dd>
            </div>
            <div>
              <dt>Clinic websites</dt>
              <dd>{EVIDENCE.clinics}</dd>
            </div>
            <div>
              <dt>Checked</dt>
              <dd>{checked}</dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="sheet">
        <div className="wrap">
          <nav className="tiles" aria-label="Treatment categories">
            {/* 휴대폰 4칸 × 2줄이 꽉 차게: 분류 7개 + 전체 */}
            {cats.slice(0, 7).map((c) => (
              <Link key={c.slug} href={`/treatments?category=${c.slug}`}>
                <span>
                  <Icon name={c.slug} size={26} />
                </span>
                {c.en}
              </Link>
            ))}
            <Link href="/treatments">
              <span>
                <Icon name="arrow" size={26} />
              </span>
              All prices
            </Link>
          </nav>

          {/* 모델 사진(Unsplash 라이선스, 출처표 80_work/.../photos/rights.tsv). 시술 결과처럼 보이지 않는 생활 사진만 쓴다. */}
          <Link href="/how-prices-work" className="promise">
            <span className="promise-text">
              <span className="guide-group">How it works</span>
              <strong>Prices from clinic websites, not ads</strong>
              <span>No rankings, no paid placement. Every range shows how many clinics and when we checked.</span>
              <span className="promise-link">How we collect prices</span>
            </span>
            <img src="/img/photo/model-skincare.webp" alt="" width={720} height={900} />
          </Link>

          <section aria-labelledby="ranges">
            <div className="sec-row">
              <h2 id="ranges">Published prices</h2>
              <Link href="/treatments">See all</Link>
            </div>
            <p className="sec-sub">
              {listed.length} treatments · three clinics or more · listed prices on clinic websites
            </p>
            <ul className="rail">
              {listed.map(({ t, row }, i) => (
                <li key={t.slug}>
                  <Link href={`/treatments/${t.slug}`} className="rail-card">
                    <img
                      src={treatmentImage(t.slug)}
                      alt=""
                      width={640}
                      height={480}
                      loading={i > 2 ? "lazy" : "eager"}
                    />
                    <span className="rail-body">
                      <span className="rail-name">{row.spec}</span>
                      <span className="rail-ko" lang="ko">{t.ko}</span>
                      <strong>
                        <Odometer value={won(row.low)} />
                      </strong>
                      <span className="rail-to">to {won(row.high)}</span>
                      <span className="rail-meta">
                        ≈ {range(row.low, row.high, usd)} · {row.clinics} clinics
                        <br />
                        {VAT_LABEL[row.vat] ?? VAT_LABEL.unknown}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <div className="home-calc">
            <PriceCheck options={calcOptions} />
          </div>

          <section aria-labelledby="guides">
            <div className="sec-row">
              <h2 id="guides">Read before you book</h2>
              <Link href="/guides">All guides</Link>
            </div>
            <ul className="guide-cards">
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
              <li>
                <Link href="/submit" className="report-card">
                  <span>
                    <span className="guide-group">Help others</span>
                    <strong>Paid in Korea? Report what you paid</strong>
                    <span className="report-sub">No name needed. Published after five reports.</span>
                  </span>
                  <img src="/img/photo/lotion-pink.webp" alt="" width={640} height={480} loading="lazy" />
                </Link>
              </li>
            </ul>
          </section>

          <section aria-labelledby="kinds">
            <div className="sec-row">
              <h2 id="kinds">Three prices, three meanings</h2>
            </div>
            <div className="kinds">
              <div>
                <h3>Listed price</h3>
                <p>The clinic&apos;s regular or pre-discount price on its page.</p>
              </div>
              <div>
                <h3>Event price</h3>
                <p>Limited by date or by who qualifies. We keep it separate.</p>
              </div>
              <div className="kinds-key">
                <h3>Your written quote</h3>
                <p>What a clinic proposes for you, item by item. This one counts.</p>
              </div>
            </div>
          </section>

          <section className="cta-dark home-cta">
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
          </section>
        </div>
      </div>
    </>
  );
}
