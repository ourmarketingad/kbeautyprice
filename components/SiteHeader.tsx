"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HeaderAuth from "@/components/HeaderAuth";
import { Logo } from "@/components/Icons";

export default function SiteHeader() {
  const home = usePathname() === "/";
  return (
    <header className={home ? "site-head on-brand" : "site-head"}>
      <div className="site-head-in">
        <Link href="/" className="brand" aria-label="KBeautyPrice home">
          <Logo />
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
