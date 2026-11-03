import { hospitals } from "@/data/hospitals";
import { categories } from "@/data/categories";
import Link from "next/link";

export const metadata = {
  title: "Seoul Clinics & Hospitals",
  description:
    "Clinics in Seoul that see foreign patients — skin clinics, plastic surgery hospitals and dental offices. Filter by treatment type.",
};

export default function HospitalsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const cat = searchParams.category ?? "";
  const filtered = cat
    ? hospitals.filter((h) => h.categories.includes(cat))
    : hospitals;

  const activeCat = categories.find((c) => c.slug === cat);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 6 }}>
        {activeCat
          ? `${activeCat.emoji} ${activeCat.en} clinics in Seoul`
          : "Seoul clinics — foreign patient friendly"}
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: 28, fontSize: 15 }}>
        Hospitals and skin clinics that see international visitors. Prices vary — check the treatment page for real price ranges.
      </p>

      {/* Filter chips */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        <Link
          href="/hospitals"
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
            href={`/hospitals?category=${c.slug}`}
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

      {/* Hospital list */}
      {filtered.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>No clinics listed yet for this category.</p>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {filtered.map((h) => (
            <div
              key={h.slug}
              style={{
                padding: "20px 24px",
                background: "var(--card)",
                borderRadius: 14,
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <p style={{ fontWeight: 800, fontSize: 17, marginBottom: 2 }}>
                    {h.name}
                  </p>
                  <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 8 }}>
                    {h.nameKo} · {h.district}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  {h.englishSupport && (
                    <span
                      style={{
                        background: "#16a34a18",
                        color: "#16a34a",
                        border: "1px solid #16a34a40",
                        borderRadius: 6,
                        padding: "4px 10px",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      English OK
                    </span>
                  )}
                  {h.foreignPatientService && (
                    <span
                      style={{
                        background: "var(--accent-light)",
                        color: "var(--accent)",
                        border: "1px solid var(--accent)40",
                        borderRadius: 6,
                        padding: "4px 10px",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      Foreign patients
                    </span>
                  )}
                </div>
              </div>

              {/* Specialties */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: h.note ? 10 : 0 }}>
                {h.specialties.map((s, i) => (
                  <span
                    key={i}
                    style={{
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      padding: "3px 10px",
                      fontSize: 12,
                      color: "var(--muted)",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              {h.note && (
                <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 10, lineHeight: 1.5 }}>
                  {h.note}
                </p>
              )}

              {/* Address */}
              <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 10 }}>
                📍 {h.address}
                {h.naverMapUrl && (
                  <>
                    {" · "}
                    <a
                      href={h.naverMapUrl}
                      target="_blank"
                      style={{ color: "var(--accent)", textDecoration: "none" }}
                    >
                      Map →
                    </a>
                  </>
                )}
              </p>

              {/* Category links */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
                {h.categories.map((catSlug) => {
                  const catObj = categories.find((c) => c.slug === catSlug);
                  return catObj ? (
                    <Link
                      key={catSlug}
                      href={`/treatments?category=${catSlug}`}
                      style={{
                        fontSize: 12,
                        color: "var(--muted)",
                        textDecoration: "none",
                        border: "1px solid var(--border)",
                        borderRadius: 6,
                        padding: "3px 8px",
                      }}
                    >
                      {catObj.emoji} {catObj.en} prices →
                    </Link>
                  ) : null;
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit CTA */}
      <div
        style={{
          marginTop: 40,
          padding: "24px",
          background: "var(--card)",
          borderRadius: 14,
          border: "1px solid var(--border)",
          textAlign: "center",
        }}
      >
        <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
          Been to a clinic not listed here?
        </p>
        <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 16 }}>
          Submit the price you paid and help other visitors compare.
        </p>
        <Link
          href="/submit"
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
          Submit a real price →
        </Link>
      </div>
    </div>
  );
}
