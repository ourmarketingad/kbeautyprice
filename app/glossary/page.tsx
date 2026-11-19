import Link from "next/link";
import {
  GLOSSARY_CATEGORY,
  glossary,
  type GlossaryCategory,
} from "@/data/glossary";

export const metadata = {
  title: "Korean clinic price glossary",
  description:
    "What the words on a Korean clinic price page and quote actually mean: shot count, VAT, event price, cc, device names and more.",
  // 분류·글자 색인은 같은 쪽을 쿼리로 걸러 보여 준다. 대표 주소를 하나로 고정한다.
  alternates: { canonical: "/glossary" },
};

const CATS = Object.keys(GLOSSARY_CATEGORY) as GlossaryCategory[];
const firstLetter = (s: string) => s.trim().charAt(0).toUpperCase();
const LETTERS = [...new Set(glossary.map((t) => firstLetter(t.en)))].sort();

type Props = {
  searchParams: Promise<{ c?: string; l?: string; q?: string }>;
};

export default async function GlossaryIndex({ searchParams }: Props) {
  const { c = "", l = "", q = "" } = await searchParams;
  const needle = q.trim().toLowerCase();

  const list = glossary
    .filter((t) => (!c || t.category === c) && (!l || firstLetter(t.en) === l))
    .filter(
      (t) =>
        !needle ||
        t.en.toLowerCase().includes(needle) ||
        (t.ko ?? "").includes(needle) ||
        (t.aka ?? []).some((a) => a.toLowerCase().includes(needle)) ||
        t.short.toLowerCase().includes(needle),
    )
    .sort((a, b) => a.en.localeCompare(b.en));

  const link = (cat: string, letter: string) => {
    const p = new URLSearchParams();
    if (cat) p.set("c", cat);
    if (letter) p.set("l", letter);
    if (q) p.set("q", q);
    const s = p.toString();
    return "/glossary" + (s ? "?" + s : "");
  };

  return (
    <div className="wrap page-top">
      <h1 className="page-title">Korean clinic price glossary</h1>
      <p className="sub">
        {glossary.length} terms you will meet on a Korean clinic price page, in
        a quote or in a consultation. Plain explanations of what each word
        changes about the number you pay. No treatment advice and no clinic
        recommendations.
      </p>

      <form className="term-search" action="/glossary" method="get">
        <label htmlFor="q">Search terms</label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="VAT, shot count, filler…"
        />
        <button type="submit">Search</button>
      </form>

      <div className="hscroll flush" aria-label="Category">
        <Link href={link("", l)} aria-current={!c ? "true" : undefined}>
          All ({glossary.length})
        </Link>
        {CATS.map((k) => (
          <Link
            key={k}
            href={link(k, l)}
            aria-current={c === k ? "true" : undefined}
          >
            {GLOSSARY_CATEGORY[k].label} (
            {glossary.filter((t) => t.category === k).length})
          </Link>
        ))}
      </div>

      <div className="hscroll flush" aria-label="First letter">
        <Link href={link(c, "")} aria-current={!l ? "true" : undefined}>
          All letters
        </Link>
        {LETTERS.map((x) => (
          <Link
            key={x}
            href={link(c, x)}
            aria-current={l === x ? "true" : undefined}
          >
            {x}
          </Link>
        ))}
      </div>

      {c && (
        <p className="note" style={{ marginTop: 16 }}>
          {GLOSSARY_CATEGORY[c as GlossaryCategory]?.blurb}
        </p>
      )}

      <p className="note" style={{ marginTop: 12 }} role="status">
        {list.length} {list.length === 1 ? "term" : "terms"}
        {q ? ` matching “${q}”` : ""}
      </p>

      {list.length === 0 ? (
        <p className="none">
          No term matches that. <Link href="/glossary">See all terms</Link>.
        </p>
      ) : (
        <ul className="term-cards">
          {list.map((t) => (
            <li key={t.slug}>
              <Link href={`/glossary/${t.slug}`}>
                <strong>{t.en}</strong>
                {t.ko && <span lang="ko">{t.ko}</span>}
                <span className="term-short">{t.short}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <h2>Where these numbers come from</h2>
      <p className="sub">
        Price ranges on this site are built from prices clinics publish on their
        own websites, with the clinic count and the date shown on every range.{" "}
        <Link href="/how-prices-work">How prices work</Link> ·{" "}
        <Link href="/treatments">See the price ranges</Link>
      </p>
    </div>
  );
}
