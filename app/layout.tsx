import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import HeaderAuth from "@/components/HeaderAuth";
import TabBar from "@/components/TabBar";

// [대표 승인 전] 도메인 연결과 검색 공개는 승인 뒤에 한다. 공개할 때 INDEXABLE 만 true 로 바꾼다.
const INDEXABLE = false;

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://kbeautyprice.vercel.app",
  ),
  title: {
    default: "KBeautyPrice | What treatments cost in Seoul, with sources",
    template: "%s | KBeautyPrice",
  },
  description:
    "Price ranges for Korean clinic treatments, taken from prices clinics publish on their own websites. Every number shows how many clinics and when we checked.",
  robots: INDEXABLE
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: { siteName: "KBeautyPrice", type: "website" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <header className="site-head">
          <div className="site-head-in">
            <Link href="/" className="brand">
              KBeautyPrice
            </Link>
            <nav className="site-nav" aria-label="Main">
              <Link className="desk" href="/treatments">Prices</Link>
              <Link className="desk" href="/guides">Guides</Link>
              <Link className="desk" href="/hospitals">Registered clinics</Link>
              <Link href="/submit">Report a price</Link>
              <HeaderAuth />
            </nav>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="site-foot">
          <div className="wrap">
            <div className="foot-links">
              <Link href="/how-prices-work">How prices work</Link>
              <Link href="/guides">Guides</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
            <p>
              Reference information, not a quote or medical advice. KBeautyPrice
              does not diagnose or recommend treatment.
            </p>
            <p>
              Operated by OUR Marketing (아워마케팅) · CEO Seungyeon Park ·
              Business registration 472-21-02120 · Foreign patient attraction
              registration A-2026-01-02-07119
            </p>
            <p>
              12F Daeryung Seocho Tower, 327 Gangnam-daero, Seocho-gu, Seoul ·
              ourmarketingad@gmail.com
            </p>
          </div>
        </footer>
        <TabBar />
      </body>
    </html>
  );
}
