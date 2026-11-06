"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HeaderAuth from "@/components/HeaderAuth";
import { Logo } from "@/components/Icons";

export default function SiteHeader() {
  // 시안 B(2026-11-06 대표 선택): 첫 화면·가격 목록·시술 상세·칼럼 목록은 코랄 머리 띠
  const path = usePathname();
  const home =
    path === "/" || path === "/guides" || path.startsWith("/treatments");
  return (
    <header className={home ? "site-head on-brand" : "site-head"}>
      <div className="site-head-in">
        <Link href="/" className="brand" aria-label="KBeautyPrice home">
          <Logo light={home} />
        </Link>
        <nav className="site-nav" aria-label="Main">
          <Link className="desk" href="/treatments">
            Prices
          </Link>
          <Link className="desk" href="/guides">
            Guides
          </Link>
          <Link className="desk" href="/hospitals">
            Registered clinics
          </Link>
          <Link className="desk" href="/submit">
            Report a price
          </Link>
          <HeaderAuth />
        </nav>
      </div>
    </header>
  );
}
