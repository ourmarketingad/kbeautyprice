import Link from "next/link";
import { guides } from "@/data/guides";
import { guideImage } from "@/lib/images";

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
              <span>
                <span className="guide-group">{g.group}</span>
                <strong>{g.title}</strong>
              </span>
              <img src={guideImage(g.slug)} alt="" width={640} height={480} loading="lazy" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
