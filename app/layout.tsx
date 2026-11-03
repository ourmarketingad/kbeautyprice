import type { Metadata } from "next";
import "./globals.css";
import HeaderAuth from "@/components/HeaderAuth";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://kbeautyprice.com"),
  title: {
    default: "KBeautyPrice — Real Prices at Korean Clinics",
    template: "%s | KBeautyPrice",
  },
  description:
    "Search real prices paid at Korean skin clinics and plastic surgery hospitals. Compare Ultherapy, Rejuran, double eyelid and 100+ treatments across Seoul.",
  openGraph: {
    siteName: "KBeautyPrice",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={{
          borderBottom: "1px solid var(--border)",
          padding: "0 1rem",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          background: "var(--bg)",
          zIndex: 100,
        }}>
          <a href="/" style={{ fontWeight: 800, fontSize: 18, color: "var(--accent)", textDecoration: "none", letterSpacing: "-0.5px" }}>
            KBeautyPrice
          </a>
          <nav style={{ display: "flex", gap: 20, fontSize: 14, color: "var(--muted)", alignItems: "center" }}>
            <a href="/treatments" style={{ color: "var(--muted)", textDecoration: "none" }}>Treatments</a>
            <a href="/hospitals" style={{ color: "var(--muted)", textDecoration: "none" }}>Hospitals</a>
            <a href="/submit" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Submit →</a>
            <HeaderAuth />
          </nav>
        </header>
        <main>{children}</main>
        <footer style={{
          borderTop: "1px solid var(--border)",
          padding: "2rem 1rem",
          marginTop: "4rem",
          color: "var(--muted)",
          fontSize: 13,
          textAlign: "center",
        }}>
          <p>KBeautyPrice — Real prices at Korean clinics, submitted by real visitors.</p>
          <p style={{ marginTop: 8 }}>
            Concierge service by{" "}
            <a href="https://koreabeautyconsultant.com" style={{ color: "var(--accent)" }}>COMEDI</a>
            {" "}· Operated by OUR Marketing
          </p>
        </footer>
      </body>
    </html>
  );
}
