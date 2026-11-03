import { treatments } from "@/data/treatments";
import { categories } from "@/data/categories";
import Link from "next/link";

const fmt = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n}`;

export const metadata = {
  title: "All Treatments & Prices",
  description: "Real prices for Ultherapy, Rejuran, jaw botox, double eyelid and 100+ Korean clinic treatments.",
};

export default function TreatmentsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const query = searchParams.q?.toLowerCase() ?? "";
  const cat = searchParams.category ?? "";

  const filtered = treatments.filter((t) => {
    const matchCat = cat ? t.category === cat : true;
    const matchQ = query
      ? t.en.toLowerCase().includes(query) ||
        t.ko.includes(query) ||
        t.aka.some((a) => a.toLowerCase().includes(query)) ||
        t.prices.some((p) => p.label.toLowerCase().includes(query))
      : true;
    return matchCat && matchQ;
  });

  const activeCat = categories.find((c) => c.slug === cat);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 6 }}>
        {activeCat ? `${activeCat.emoji} ${activeCat.en} prices in Korea` : "Korea clinic treatment prices"}
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: 28, fontSize: 15 }}>
        Real prices paid — not event promotions, not ad prices.
      </p>

      {/* Filter chips */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        <Link
          href="/treatments"
          style={{
            padding: "6px 14px",
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
            background: !cat ? "var(--accent)" : "var(--card)",
            color: !cat ? "#fff" : "var(--muted)",
            border: "1px solid var(--border)",
          }}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/treatments?category=${c.slug}`}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              fontSize: 13,
              textDecoration: "none",
              background: cat === c.slug ? "var(--accent)" : "var(--card)",
              color: cat === c.slug ? "#fff" : "var(--muted)",
              border: "1px solid var(--border)",
            }}
          >
            {c.emoji} {c.en}
          </Link>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>No treatments found. Try a different search.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {filtered.map((t) => (
            <Link
              key={t.slug}
              href={`/treatments/${t.slug}`}
              style={{
                padding: "20px",
                background: "var(--card)",
                borderRadius: 14,
                border: "1px solid var(--border)",
                textDecoration: "none",
                color: "var(--fg)",
                display: "block",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div>
                  <p style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{t.en}</p>
                  <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 8 }}>
                    {t.ko} · {t.ja} · {t["zh-TW"]}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {t.prices.map((p, i) => (
                  <span
                    key={i}
                    style={{
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      padding: "6px 12px",
                      fontSize: 13,
                    }}
                  >
                    <span style={{ fontWeight: 700, color: "var(--accent)" }}>
                      {fmt(p.usdLow)}–{fmt(p.usdHigh)}
                    </span>
                    <span style={{ color: "var(--muted)", marginLeft: 4 }}>{p.label}</span>
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
