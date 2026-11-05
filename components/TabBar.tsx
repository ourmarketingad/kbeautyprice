"use client";
// 휴대폰 하단 탭. 시술·칼럼 상세에서는 상담 버튼(QuoteBar)이 그 자리를 쓴다. PC에서는 숨긴다.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icons";

const TABS = [
  ["/", "Home", "home"],
  ["/treatments", "Prices", "price"],
  ["/guides", "Guides", "guide"],
  ["/hospitals", "Clinics", "clinic"],
] as const;

export default function TabBar() {
  const path = usePathname();
  if (/^\/(treatments|guides)\/./.test(path)) return null;
  return (
    <nav className="tab-bar" aria-label="Main tabs">
      {TABS.map(([href, label, icon]) => {
        const on = href === "/" ? path === "/" : path.startsWith(href);
        return (
          <Link key={href} href={href} aria-current={on ? "page" : undefined}>
            <Icon name={icon} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
