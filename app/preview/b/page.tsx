// 시안 B · 앱형(K-Beauty Station 결): 코랄 머리 띠 + 흰 검색, 그 위로 겹치는 흰 판, 아이콘 타일, 옆으로 넘기는 가격 카드.
import Link from "next/link";
import "../preview.css";
import { Icon } from "@/components/Icons";
import { EVIDENCE, cats, checked, previewMeta, rows, topGuides } from "../data";

export const metadata = { title: "Design B", ...previewMeta };

export default function B() {
  return (
    <div className="pb">
      <section className="pb-band">
        <div className="wrap">
          <h1>Clinic prices in Seoul,<br />checked for you</h1>
          <form action="/treatments" className="pb-search" role="search">
            <label className="sr-only" htmlFor="pb-q">Search treatments</label>
            <Icon name="search" size={20} />
            <input id="pb-q" name="q" placeholder="Search Ultherapy, Rejuran…" />
          </form>
          <p className="pb-meta">{EVIDENCE.prices} prices · {EVIDENCE.clinics} clinic websites · {checked}</p>
        </div>
      </section>
      <div className="pb-sheet">
        <div className="wrap">
          <nav className="pb-tiles" aria-label="Categories">
            {cats.slice(0, 8).map((c) => (
              <Link key={c.slug} href={`/treatments?category=${c.slug}`}>
                <span><Icon name={c.slug} size={26} /></span>
                {c.en}
              </Link>
            ))}
          </nav>
          <div className="pb-sec">
            <h2>Popular prices</h2>
            <Link href="/treatments">See all</Link>
          </div>
          <div className="pb-rail">
            {rows.map((r) => (
              <Link key={r.slug} href={`/treatments/${r.slug}`} className="pb-card">
                <img src={r.img} alt="" width={640} height={480} loading="lazy" />
                <span className="pb-card-body">
                  <span className="pb-card-name">{r.name}</span>
                  <strong>from {r.low}</strong>
                  <span className="pb-card-meta">{r.clinics} clinics · ≈ {r.usd}</span>
                </span>
              </Link>
            ))}
          </div>
          <div className="pb-sec">
            <h2>Read before you book</h2>
          </div>
          <div className="pb-guides">
            {topGuides.map((g) => (
              <Link key={g.slug} href={`/guides/${g.slug}`}>
                <span>{g.group}</span>
                <strong>{g.title}</strong>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
