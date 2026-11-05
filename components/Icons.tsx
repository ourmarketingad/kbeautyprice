// 자체 선 아이콘. 24칸 기준, 굵기 1.7.
const P: Record<string, string> = {
  home: "M4 11l8-7 8 7M6 9.5V20h12V9.5M10 20v-6h4v6",
  price: "M3.5 12.5V5a1.5 1.5 0 0 1 1.5-1.5h7.5L21 12l-8.5 8.5-9-8zM8 8h.01",
  guide: "M5 4.5h9.5L19 9v10.5H5zM14 4.5V9h5M8.5 13h7M8.5 16.5h5",
  clinic: "M12 21s7-6.2 7-11.5a7 7 0 1 0-14 0C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
  arrow: "M9 5l7 7-7 7",
  chat: "M4 5.5h16v11H9.5L5 20.5v-4H4z",
  lifting: "M12 20V6M7 11l5-5 5 5M6 20h12",
  botox: "M9 3h6M10 3v3.5L6.5 10v9a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-9L14 6.500V3M6.500 13h11",
  filler: "M18 3l3 3M16 5l3 3M17 7L8 16l-3 .9.9-3L15 5M5 17l-2 4 4-2",
  "skin-booster": "M12 3c3.500 4.200 6 7.200 6 10.500a6 6 0 0 1-12 0C6 10.200 8.500 7.200 12 3zM9 14a3 3 0 0 0 3 3",
  laser: "M4 20L14 10M14 10l1.500-5M14 10l5-1.500M17 3v2M21 7h-2M16 16h4M18 14v4",
  "double-eyelid": "M2.500 12S6 6.500 12 6.500 21.500 12 21.500 12 18 17.500 12 17.500 2.500 12 2.500 12zM12 14.500a2.500 2.500 0 1 0 0-5 2.500 2.500 0 0 0 0 5zM5 8.500C7 5.500 9.500 4 12 4s5 1.500 7 4.500",
  rhinoplasty: "M13 3c-.5 5-3.500 9-5.500 12.500-.8 1.500.3 3 2 3 1.200 0 2-.4 3-.4 1.100 0 1.900.9 3.500.4",
  "hair-removal": "M4 9h9l3 3-3 3H4zM16 12h4M8 15v5M4 20h8",
  "thread-lift": "M4 18c3 0 3-12 6-12s3 12 6 12 3-8 4-10M20 4v4h-3",
  "fat-dissolving": "M12 21a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM8 4h.01M16 3h.01M12 12v5M9.500 14.500h5",
  dental: "M7 3.500c2 0 3 1 5 1s3-1 5-1c2.500 0 3.500 2.500 3 5-.5 2.200-1.500 3.500-1.800 6-.3 2.500-.7 6-2.200 6-1.800 0-1.300-5-4-5s-2.200 5-4 5c-1.500 0-1.900-3.500-2.200-6-.3-2.500-1.300-3.800-1.800-6-.5-2.500.5-5 3-5z",
  "hair-transplant": "M6 21c0-8 1-13 6-13s6 5 6 13M9 8c-1-2-1-3-.5-5M15 8c1-2 1-3 .5-5M12 8V3",
  body: "M3 8h18v8H3zM7 8v3M11 8v4M15 8v3M19 8v4",
};

export function Icon({ name, size = 24 }: { name: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={P[name] ?? P.price} />
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={light ? "logo logo-light" : "logo"}>
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
        <rect width="26" height="26" rx="7" fill={light ? "#fff" : "#1b64da"} />
        <path
          d="M6.500 8l3.200 10L13 10l3.300 8 3.200-10M5.500 12.500h15M5.500 15h15"
          fill="none"
          stroke={light ? "#1b64da" : "#fff"}
          strokeWidth="1.700"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      KBeautyPrice
    </span>
  );
}
