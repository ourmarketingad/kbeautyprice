import Link from "next/link";
import { Odometer } from "@/components/Motion";
import { treatmentImage } from "@/lib/images";
import { usd, won, range, type PriceRow } from "@/lib/prices";

export default function PriceCard({
  slug,
  name,
  sub,
  row,
  odometer = false,
  lazy = true,
}: {
  slug: string;
  name: string;
  sub?: string;
  row?: PriceRow;
  odometer?: boolean;
  lazy?: boolean;
}) {
  return (
    <li>
      <Link href={`/treatments/${slug}`}>
        <img
          src={treatmentImage(slug)}
          alt=""
          width={640}
          height={480}
          loading={lazy ? "lazy" : "eager"}
          decoding="async"
        />
        <span className="card-body">
          <span className="card-name">{name}</span>
          {sub && <span className="card-spec">{sub}</span>}
          {row ? (
            <>
              <span className="card-price">
                {odometer ? <Odometer value={won(row.low)} /> : won(row.low)}
              </span>
              <span className="card-to">to {won(row.high)}</span>
              <span className="card-usd">≈ {range(row.low, row.high, usd)}</span>
              <span className="card-meta">
                <b>{row.clinics} clinics</b> published this
              </span>
            </>
          ) : (
            <span className="card-meta">No published range yet</span>
          )}
        </span>
      </Link>
    </li>
  );
}
