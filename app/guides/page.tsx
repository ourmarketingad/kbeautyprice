import Link from "next/link";
import { guides } from "@/data/guides";

export const metadata = {
  title: "Guides to Korean clinic prices",
  description:
    "Short guides on reading clinic prices in Korea, what a written quote should include and what clinics publish.",
};

export default function Guides() {
  return (
    <div className="wrap page-top">
      <h1 className="page-title">Guides</h1>
      <p className="sub">
        Short answers on prices and quotes. These guides cover costs, not
        medical advice.
      </p>
      <ul className="guide-list">
        {guides.map((g) => (
          <li key={g.slug}>
            <Link href={`/guides/${g.slug}`}>
              <span className="guide-group">{g.group}</span>
              <strong>{g.title}</strong>
              <span className="guide-answer">{g.answer}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
