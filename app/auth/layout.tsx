import type { Metadata } from "next";

// 로그인 쪽은 검색에 올리지 않는다. 로봇 규칙(app/robots.ts)과 같은 기준.
export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
