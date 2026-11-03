import { categories } from "@/data/categories";
import { treatments } from "@/data/treatments";
import Link from "next/link";

const fmt = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;

const popularTreatments = treatments
  .filter((t) => t.popularityRank)
  .sort((a, b) => (a.popularityRank ?? 99) - (b.popularityRank ?? 99));

export default function HomePage() {
  return (
    <div>
      {/* ── HERO ─────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg, #1e1433 0%, #0a0a0a 60%)",
        color: "#fff",
        padding: "4rem 1rem 3rem",
        textAlign: "center",
      }}>
        <p style={{ fontSize: 13, color: "#a78bfa", fontWeight: 600, letterSpacing: 2, marginBottom: 16, textTransform: "uppercase" }}>
          Real prices · No ads · 11 languages
        </p>
        <h1 style={{ fontSize: "clamp(2rem,6vw,3.5rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 16, letterSpacing: "-1px" }}>
          So… how much did<br />
          <span style={{ color: "#a78bfa" }}>Korea actually cost?</span>
        </h1>
        <p style={{ color: "#9ca3af", fontSize: "clamp(1rem,3vw,1.2rem)", marginBottom: 32, maxWidth: 520, margin: "0 auto 32px" }}>
          Compare real prices paid at Seoul skin clinics and surgery hospitals.
          No fake event prices. No ads.
        </p>

        {/* Search bar */}
        <form action="/treatments" method="get" style={{ maxWidth: 560, margin: "0 auto", display: "flex", gap: 8 }}>
          <input
            name="q"
            placeholder="e.g. Ultherapy 300 shots, jaw botox, Rejuran..."
            style={{
              flex: 1,
              padding: "14px 18px",
              borderRadius: 12,
              border: "none",
              fontSize: 15,
              outline: "none",
              background: "#fff",
              color: "#111",
            }}
          />
          <button type="submit" style={{
            padding: "14px 24px",
            background: "#7c3aed",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
          }}>
            Search
          </button>
        </form>

        <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
          {["Ultherapy 300 shots", "Jaw botox", "Rejuran", "Double eyelid"].map((term) => (
            <a
              key={term}
              href={`/treatments?q=${encodeURIComponent(term)}`}
              style={{
                background: "#ffffff18",
                color: "#d1d5db",
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 13,
                textDecoration: "none",
                border: "1px solid #ffffff22",
              }}
            >
              {term}
            </a>
          ))}
        </div>

        <p style={{ color: "#6b7280", fontSize: 13, marginTop: 24 }}>
          Price data from real visitors · Updated 2026
        </p>
      </section>

      {/* ── POPULAR PRICES ─────────────────────── */}
      <section style={{ maxWidth: 900, margin: "3rem auto", padding: "0 1rem" }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>
          Most searched treatments
        </h2>
        <div style={{ display: "grid", gap: 12 }}>
          {popularTreatments.map((t) => {
            const p = t.prices[1] ?? t.prices[0];
            return (
              <Link
                key={t.slug}
                href={`/treatments/${t.slug}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  background: "var(--card)",
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  textDecoration: "none",
                  color: "var(--fg)",
                  gap: 12,
                }}
              >
                <div>
                  <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{t.en}</p>
                  <p style={{ color: "var(--muted)", fontSize: 13 }}>{p.label}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontWeight: 800, fontSize: 16, color: "var(--accent)" }}>
                    {fmt(p.usdLow)}–{fmt(p.usdHigh)}
                  </p>
                  <p style={{ color: "var(--muted)", fontSize: 12 }}>
                    ₩{p.krwLow.toLocaleString()}–₩{p.krwHigh.toLocaleString()}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Link href="/treatments" style={{ color: "var(--accent)", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
            View all treatments →
          </Link>
        </div>
      </section>

      {/* ── CATEGORIES ─────────────────────────── */}
      <section style={{ maxWidth: 900, margin: "0 auto 3rem", padding: "0 1rem" }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>
          Browse by category
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/treatments?category=${cat.slug}`}
              style={{
                padding: "16px",
                background: "var(--card)",
                borderRadius: 12,
                border: "1px solid var(--border)",
                textDecoration: "none",
                color: "var(--fg)",
                display: "block",
              }}
            >
              <span style={{ fontSize: 24 }}>{cat.emoji}</span>
              <p style={{ fontWeight: 700, fontSize: 14, marginTop: 8 }}>{cat.en}</p>
              <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 4, lineHeight: 1.4 }}>{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SUBMIT CTA ─────────────────────────── */}
      <section style={{
        maxWidth: 900,
        margin: "0 auto 4rem",
        padding: "2rem",
        background: "var(--accent-light)",
        borderRadius: 16,
        textAlign: "center",
      }}>
        <p style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
          Visited a Seoul clinic? Share what you paid.
        </p>
        <p style={{ color: "var(--muted)", marginBottom: 20, fontSize: 15 }}>
          Your price helps the next person know what to expect — no name required.
        </p>
        <Link
          href="/submit"
          style={{
            display: "inline-block",
            background: "var(--accent)",
            color: "#fff",
            padding: "14px 28px",
            borderRadius: 10,
            fontWeight: 700,
            textDecoration: "none",
            fontSize: 15,
          }}
        >
          Submit a real price →
        </Link>
      </section>

      {/* ── COMEDI LINK ────────────────────────── */}
      <section style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "0 1rem 3rem",
        display: "flex",
        gap: 16,
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        borderTop: "1px solid var(--border)",
        paddingTop: "2rem",
      }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
            Need help booking the right clinic?
          </p>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>
            COMEDI is a registered Seoul beauty concierge — research, booking and interpretation included.
          </p>
        </div>
        <a
          href="https://koreabeautyconsultant.com"
          target="_blank"
          style={{
            padding: "12px 20px",
            border: "2px solid var(--accent)",
            borderRadius: 10,
            color: "var(--accent)",
            fontWeight: 700,
            textDecoration: "none",
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          Visit COMEDI →
        </a>
      </section>
    </div>
  );
}
