// 시안 A · 에디토리얼: 상자 없이 큰 글자와 여백, 가격은 표처럼 한 줄씩(Wise 비교 페이지 결).
import Link from "next/link";
import "../preview.css";
import { EVIDENCE, checked, previewMeta, rows, topGuides } from "../data";

export const metadata = { title: "Design A", ...previewMeta };

export default function A() {
  return (
    <div className="pa">
      <section className="pa-hero wrap">
        <p className="pa-kicker">Seoul · {EVIDENCE.clinics} clinic websites · checked {checked}</p>
        <h1>
          What it <em>actually</em> costs in Seoul.
        </h1>
        <p className="pa-deck">
          Price ranges taken from what clinics publish themselves. No rankings,
          no paid placement, a source behind every number.
        </p>
        <form action="/treatments" className="pa-search" role="search">
          <label className="sr-only" htmlFor="pa-q">Search treatments</label>
          <input id="pa-q" name="q" placeholder="Search Ultherapy, Rejuran, jaw botox…" />
          <button type="submit">Search</button>
        </form>
      </section>

      <section className="pa-list wrap" aria-labelledby="pa-l">
        <div className="pa-list-head">
          <h2 id="pa-l">Published prices</h2>
          <span>{rows.length} treatments</span>
        </div>
        <ol>
          {rows.map((r) => (
            <li key={r.slug}>
              <Link href={`/treatments/${r.slug}`}>
                <img src={r.img} alt="" width={64} height={64} loading="lazy" />
                <span className="pa-name">
                  <strong>{r.name}</strong>
                  <span>{r.spec}</span>
                </span>
                <span className="pa-price">
                  <strong>{r.won}</strong>
                  <span>≈ {r.usd} · {r.clinics} clinics</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="pa-guides wrap" aria-labelledby="pa-g">
        <h2 id="pa-g">Before you book</h2>
        <div>
          {topGuides.map((g) => (
            <Link key={g.slug} href={`/guides/${g.slug}`}>
              <span>{g.group}</span>
              <strong>{g.title}</strong>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
