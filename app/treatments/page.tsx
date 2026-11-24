import Link from "next/link";
import { categories } from "@/data/categories";
import { treatments } from "@/data/treatments";
import PriceCard from "@/components/PriceCard";
import { bandPhoto } from "@/lib/images";
import { COLLECTED, hasPrices, pricesFor } from "@/lib/prices";
import { LOCALES, LOCALE_META } from "@/data/i18n";

export const metadata = {
  title: "Treatment prices in Seoul",
  description:
    "Price ranges for Korean clinic treatments from prices clinics publish, with clinic counts and the date checked.",
  // 분류·검색은 같은 쪽을 쿼리로 걸러 보여 준다. 대표 주소를 하나로 고정한다.
  // 언어 연결: 이 쪽은 5개 언어판이 모두 살아 있는데(/ja/treatments 등) 영어 쪽만 연결이
  // 없어서 구글이 묶음으로 보지 못했다 — 2026-11-24 전수 측정에서 찾은 유일한 실제 누락이다.
  alternates: {
    canonical: "/treatments",
    languages: {
      en: "/treatments",
      ...Object.fromEntries(
        LOCALES.map((l) => [LOCALE_META[l].htmlLang, `/${l}/treatments`]),
      ),
      "x-default": "/treatments",
    },
  },
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
    <>
    <section className="band band-photo" style={bandPhoto("seoul-myeongdong")}>
      <div className="wrap">
      <h1 className="page-title">
        Treatment prices in Seoul
      </h1>
      <p className="sub">
        From clinics&apos; own websites, checked {COLLECTED}.
      </p>
      <form action="/treatments" method="get" className="search band-form" role="search">
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
      </div>
    </section>
    <div className="sheet">
    <div className="wrap">
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
    </div>
    </>
  );
}
