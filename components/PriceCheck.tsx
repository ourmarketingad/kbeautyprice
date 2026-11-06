"use client";
// 첫 화면 가격 계산기(Wise 홈 계산기 참고). 시술을 고르면 공개 가격 범위가 바로 나온다.
// 숫자는 data/prices.json 의 정가(list) 줄만 쓴다. 병원 이름은 없다.
import Link from "next/link";
import { useState } from "react";
import { Odometer } from "@/components/Motion";
import { VAT_LABEL, range, usd, won, type PriceRow } from "@/lib/prices";

type Option = { slug: string; name: string; row: PriceRow };

const shortDate = (d: string) =>
  new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });

export default function PriceCheck({ options }: { options: Option[] }) {
  const [slug, setSlug] = useState(options[0]?.slug ?? "");
  const pick = options.find((o) => o.slug === slug) ?? options[0];
  if (!pick) return null;
  const { row } = pick;
  return (
    <section className="calc" aria-labelledby="calc-title">
      <h2 id="calc-title" className="calc-title">
        Check a price
      </h2>
      <label className="calc-label" htmlFor="calc-treatment">
        Treatment
      </label>
      <select
        id="calc-treatment"
        className="calc-select"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.slug} value={o.slug}>
            {o.name}
          </option>
        ))}
      </select>
      <div className="calc-out" aria-live="polite">
        <span className="calc-spec">{row.spec}</span>
        <strong className="calc-val">
          <Odometer key={slug} value={range(row.low, row.high, won)} />
        </strong>
        <dl className="calc-facts">
          <div>
            <dt>About</dt>
            <dd>{range(row.low, row.high, usd)}</dd>
          </div>
          <div>
            <dt>Clinics</dt>
            <dd>{row.clinics}</dd>
          </div>
          <div>
            <dt>Checked</dt>
            <dd>{shortDate(row.seenOn)}</dd>
          </div>
        </dl>
        <p className="calc-vat">{VAT_LABEL[row.vat] ?? VAT_LABEL.unknown} · listed prices on clinic websites</p>
      </div>
      <div className="btn-pair">
        <Link className="btn" href={`/treatments/${pick.slug}`}>
          See the full price page
        </Link>
        <Link className="btn-line" href="/how-prices-work">
          How we collect prices
        </Link>
      </div>
    </section>
  );
}
