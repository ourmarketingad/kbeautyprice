// 시안 C · 짙은 첫 화면(핀테크 결): 짙은 바탕 위 큰 흰 제목 + 숫자 세 개, 아래는 흰 바탕 사진 격자.
import Link from "next/link";
import "../preview.css";
import { EVIDENCE, checked, previewMeta, rows } from "../data";

export const metadata = { title: "Design C", ...previewMeta };

export default function C() {
  const lead = rows[0];
  return (
    <div className="pc">
      <section className="pc-hero">
        <div className="wrap pc-hero-in">
          <div>
            <h1>Know the price<br /><em>before</em> the clinic.</h1>
            <p>Ranges from {EVIDENCE.clinics} Seoul clinic websites. Checked {checked}.</p>
            <form action="/treatments" className="pc-search" role="search">
              <label className="sr-only" htmlFor="pc-q">Search treatments</label>
              <input id="pc-q" name="q" placeholder="Search a treatment" />
              <button type="submit">Find prices</button>
            </form>
          </div>
          {lead && (
            <Link href={`/treatments/${lead.slug}`} className="pc-ticket">
              <span>{lead.spec}</span>
              <strong>{lead.won}</strong>
              <span>≈ {lead.usd}</span>
              <span className="pc-ticket-foot">{lead.clinics} clinics published this · listed price</span>
            </Link>
          )}
        </div>
        <dl className="wrap pc-stats">
          <div><dt>Prices read</dt><dd>{EVIDENCE.prices}</dd></div>
          <div><dt>Clinic websites</dt><dd>{EVIDENCE.clinics}</dd></div>
          <div><dt>Treatments</dt><dd>{rows.length}</dd></div>
        </dl>
      </section>
      <section className="wrap pc-grid-sec" aria-labelledby="pc-g">
        <h2 id="pc-g">Published prices</h2>
        <div className="pc-grid">
          {rows.map((r) => (
            <Link key={r.slug} href={`/treatments/${r.slug}`}>
              <img src={r.img} alt="" width={640} height={480} loading="lazy" />
              <span className="pc-g-name">{r.name}</span>
              <strong>{r.won}</strong>
              <span className="pc-g-meta">{r.clinics} clinics · ≈ {r.usd}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
