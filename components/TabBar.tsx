"use client";
// 휴대폰 하단 탭. 시술·칼럼 상세에서는 상담 버튼(QuoteBar)이 그 자리를 쓴다. PC에서는 숨긴다.
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  ["/", "Home"],
  ["/treatments", "Prices"],
  ["/guides", "Guides"],
  ["/hospitals", "Clinics"],
] as const;

export default function TabBar() {
  const path = usePathname();
  if (/^\/(treatments|guides)\/./.test(path)) return null;
  return (
    <nav className="tab-bar" aria-label="Main tabs">
      {TABS.map(([href, label]) => {
        const on = href === "/" ? path === "/" : path.startsWith(href);
        return (
          <Link key={href} href={href} aria-current={on ? "page" : undefined}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
