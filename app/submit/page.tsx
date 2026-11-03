import { treatments } from "@/data/treatments";

export const metadata = {
  title: "Submit a real price",
  description: "Share what you actually paid at a Korean clinic. Helps others compare real prices, not ad prices.",
};

export default function SubmitPage({
  searchParams,
}: {
  searchParams: { treatment?: string; success?: string; error?: string };
}) {
  const pre = searchParams.treatment ?? "";
  const success = searchParams.success === "1";
  const error = searchParams.error;

  if (success) {
    return (
      <div style={{ maxWidth: 600, margin: "6rem auto", padding: "0 1rem", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>Thank you!</h1>
        <p style={{ color: "var(--muted)", fontSize: 15, marginBottom: 32 }}>
          Your price submission has been received. We review submissions before publishing — it will appear within 1–2 days.
        </p>
        <a
          href="/treatments"
          style={{
            display: "inline-block",
            background: "var(--accent)",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: 10,
            fontWeight: 700,
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          Browse more treatment prices →
        </a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "3rem auto", padding: "0 1rem" }}>
      <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Submit a real price</h1>
      {error && (
        <p style={{ color: "#ef4444", background: "#ef444420", border: "1px solid #ef444440", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 14 }}>
          Something went wrong. Please try again.
        </p>
      )}
      <p style={{ color: "var(--muted)", marginBottom: 32, fontSize: 15 }}>
        No name required. Your submission helps other visitors know what clinics actually charge.
      </p>

      <form
        action="/api/submit"
        method="POST"
        style={{ display: "flex", flexDirection: "column", gap: 18 }}
      >
        {/* Treatment */}
        <div>
          <label style={{ display: "block", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
            Treatment *
          </label>
          <select
            name="treatment"
            defaultValue={pre}
            required
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--fg)",
              fontSize: 14,
            }}
          >
            <option value="">Select treatment…</option>
            {treatments.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.en}
              </option>
            ))}
            <option value="other">Other (write below)</option>
          </select>
        </div>

        {/* Spec */}
        <div>
          <label style={{ display: "block", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
            Spec / amount (e.g. "300 shots", "50 units", "2cc")
          </label>
          <input
            name="spec"
            placeholder="e.g. 300 shots, Allergan 50 units"
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--fg)",
              fontSize: 14,
            }}
          />
        </div>

        {/* Price */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
              Price you paid (USD) *
            </label>
            <input
              name="usd"
              type="number"
              placeholder="e.g. 750"
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "var(--card)",
                color: "var(--fg)",
                fontSize: 14,
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
              Price in KRW (optional)
            </label>
            <input
              name="krw"
              type="number"
              placeholder="e.g. 1050000"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "var(--card)",
                color: "var(--fg)",
                fontSize: 14,
              }}
            />
          </div>
        </div>

        {/* Year */}
        <div>
          <label style={{ display: "block", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
            Year of visit *
          </label>
          <select
            name="year"
            required
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--fg)",
              fontSize: 14,
            }}
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label style={{ display: "block", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
            Notes (optional)
          </label>
          <textarea
            name="notes"
            placeholder="e.g. Was a first-visit promo, price for Korean brand not Allergan, included VAT..."
            rows={3}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--fg)",
              fontSize: 14,
              resize: "vertical",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "14px",
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          Submit price
        </button>
      </form>

      <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 16, lineHeight: 1.6 }}>
        We review submissions before publishing. No personal information is collected.
        Submissions are public once approved.
      </p>
    </div>
  );
}
