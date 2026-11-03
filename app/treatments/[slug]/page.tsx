import { treatments } from "@/data/treatments";
import { categories } from "@/data/categories";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return treatments.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const t = treatments.find((x) => x.slug === params.slug);
  if (!t) return {};
  const low = t.prices[0]?.usdLow ?? 0;
  const high = t.prices[t.prices.length - 1]?.usdHigh ?? 0;
  return {
    title: `${t.en} Korea Price`,
    description: `Real prices for ${t.en} at Korean clinics — from $${low} to $${high}. Compare what visitors actually paid, not ad prices.`,
  };
}

const fmt = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n}`;

export default function TreatmentPage({ params }: { params: { slug: string } }) {
  const t = treatments.find((x) => x.slug === params.slug);
  if (!t) notFound();

  const cat = categories.find((c) => c.slug === t.category);
  const related = treatments.filter((x) => x.category === t.category && x.slug !== t.slug).slice(0, 4);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem" }}>
      <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 12 }}>
        <Link href="/treatments" style={{ color: "var(--muted)", textDecoration: "none" }}>Treatments</Link>
        {" "}›{" "}
        <Link href={`/treatments?category=${t.category}`} style={{ color: "var(--muted)", textDecoration: "none" }}>{cat?.en}</Link>
        {" "}›{" "}{t.en}
      </p>

      <h1 style={{ fontSize: 30, fontWeight: 900, marginBottom: 8 }}>{t.en} — Korea price</h1>
      <p style={{ color: "var(--muted)", fontSize: 15, marginBottom: 28 }}>
        {t.ko} · {t.ja} · {t["zh-TW"]}
      </p>

      {/* Price table */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>Price ranges</h2>
        <div style={{ border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>Spec</th>
                <th style={{ padding: "12px 16px", textAlign: "right", fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>USD</th>
                <th style={{ padding: "12px 16px", textAlign: "right", fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>KRW</th>
                <th style={{ padding: "12px 16px", textAlign: "center", fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>Unit</th>
              </tr>
            </thead>
            <tbody>
              {t.prices.map((p, i) => (
                <tr key={i} style={{ borderBottom: i < t.prices.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <td style={{ padding: "14px 16px", fontWeight: 600, fontSize: 14 }}>{p.label}</td>
                  <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 800, color: "var(--accent)", fontSize: 15 }}>
                    {fmt(p.usdLow)}–{fmt(p.usdHigh)}
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "right", color: "var(--muted)", fontSize: 13 }}>
                    ₩{p.krwLow.toLocaleString()}–₩{p.krwHigh.toLocaleString()}
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "center", color: "var(--muted)", fontSize: 13 }}>{p.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 10 }}>
          Based on partner clinic data · Exchange rate ~₩1,400/USD · Prices vary by clinic, brand and session count
        </p>
      </div>

      {/* Submit CTA */}
      <div style={{
        background: "var(--accent-light)",
        borderRadius: 14,
        padding: "20px 24px",
        marginBottom: 32,
        display: "flex",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Had {t.en} in Seoul?</p>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>Tell us what you paid and help others plan.</p>
        </div>
        <Link
          href={`/submit?treatment=${t.slug}`}
          style={{
            background: "var(--accent)",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 10,
            fontWeight: 700,
            textDecoration: "none",
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          Submit my price →
        </Link>
      </div>

      {/* Concierge */}
      <div style={{
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: "20px 24px",
        marginBottom: 32,
        display: "flex",
        gap: 16,
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Want help booking {t.en} in Seoul?</p>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>COMEDI arranges consultations, interpretation and follow-up.</p>
        </div>
        <a
          href="https://koreabeautyconsultant.com"
          target="_blank"
          style={{
            border: "2px solid var(--accent)",
            color: "var(--accent)",
            padding: "10px 18px",
            borderRadius: 10,
            fontWeight: 700,
            textDecoration: "none",
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          Ask COMEDI →
        </a>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>Related treatments</h2>
          <div style={{ display: "grid", gap: 10 }}>
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/treatments/${r.slug}`}
                style={{
                  padding: "14px 18px",
                  background: "var(--card)",
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  textDecoration: "none",
                  color: "var(--fg)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: 600, fontSize: 14 }}>{r.en}</span>
                <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: 13 }}>
                  {fmt(r.prices[0]?.usdLow ?? 0)}+ →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
