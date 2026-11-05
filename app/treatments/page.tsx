import Link from "next/link";
import { categories } from "@/data/categories";
import { treatments } from "@/data/treatments";
import PriceCard from "@/components/PriceCard";
import { COLLECTED, hasPrices, pricesFor } from "@/lib/prices";

export const metadata = {
  title: "Treatment prices in Seoul",
  description:
    "Price ranges for Korean clinic treatments from prices clinics publish, with clinic counts and the date checked.",
};

type Props = {
  searchParams: Promise<{ category?: string; q?: string }>;
};

export default async function TreatmentsPage({ searchParams }: Props) {
  const { category = "", q = "" } = await searchParams;
  const needle = q.trim().toLowerCase();
  const list = treatments
    .filter((t) => !category || t.category === category)
    .filter((t) =>
      !needle
        ? true
        : [t.en, t.ko, t.ja, t["zh-TW"], ...t.aka]
            .join(" ")
            .toLowerCase()
            .includes(needle),
    )
    .sort((a, b) => Number(hasPrices(b.slug)) - Number(hasPrices(a.slug)));
  return (
    <div className="wrap page-top">
      <h1 className="page-title">
        Treatment prices in Seoul
      </h1>
      <p className="sub">
        From clinics&apos; own websites, checked {COLLECTED}.
      </p>
      <form action="/treatments" method="get" className="search" role="search">
        <label className="sr-only" htmlFor="tq">
          Search treatments
        </label>
        <input
          id="tq"
          name="q"
          defaultValue={q}
          placeholder="Ultherapy, jaw botox, 리쥬란"
          autoComplete="off"
        />
        {category && <input type="hidden" name="category" value={category} />}
        <button className="btn" type="submit">
          Search
        </button>
      </form>
      <div className="hscroll flush">
        <Link href="/treatments" aria-current={!category ? "true" : undefined}>
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/treatments?category=${c.slug}`}
            aria-current={category === c.slug ? "true" : undefined}
          >
            {c.en}
          </Link>
        ))}
      </div>
      {list.length === 0 ? (
        <p className="none" style={{ marginTop: 24 }}>
          Nothing matches that search. Try another name, or{" "}
          <Link href="/treatments">see all treatments</Link>.
        </p>
      ) : (
        <ul className="cards">
          {list.map((t) => {
            const rows = pricesFor(t.slug);
            const first = rows.find((r) => r.kind === "list") ?? rows[0];
            return (
              <PriceCard
                key={t.slug}
                slug={t.slug}
                name={t.en}
                sub={first ? first.spec : t.ko}
                row={first}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
}
