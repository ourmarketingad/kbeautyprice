import Link from "next/link";
import ClinicCard from "@/components/ClinicCard";
import providers from "@/data/registered-providers.json";

export const metadata = {
  title: "Registered clinics in Korea",
  description:
    "Clinics on the official Medical Korea maintained registry of institutions that may receive foreign patients, by area and field.",
};

type P = {
  slug: string;
  en: string;
  ko: string;
  field: string;
  area: string;
  photo?: boolean;
};
const all = providers.items as P[];
const CHECKED = providers.checked;
const FIELD: Record<string, string> = {
  skin: "Skin & aesthetics",
  surgery: "Plastic surgery",
  dental: "Dental",
  eye: "Eye",
  women: "Women's health",
  korean: "Korean medicine",
  hospital: "Hospital",
  general: "General & specialist",
};
const AREAS = [...new Set(all.map((p) => p.area))].sort();
const PAGE = 30;

type Props = {
  searchParams: Promise<{ area?: string; field?: string; limit?: string }>;
};

export default async function Hospitals({ searchParams }: Props) {
  const { area = "", field = "", limit = "" } = await searchParams;
  const shown = Math.min(Math.max(Number(limit) || PAGE, PAGE), 300);
  const list = all.filter(
    (p) => (!area || p.area === area) && (!field || p.field === field),
  );
  const link = (a: string, f: string) => {
    const q = new URLSearchParams();
    if (a) q.set("area", a);
    if (f) q.set("field", f);
    const s = q.toString();
    return "/hospitals" + (s ? "?" + s : "");
  };
  return (
    <div className="wrap page-top">
      <h1 className="page-title">
        Registered clinics in Korea
      </h1>
      <p className="sub">
        {all.length.toLocaleString("en-US")} providers from the official Medical
        Korea maintained registry, checked {CHECKED}. Listed alphabetically, not
        ranked. A listing is not a recommendation and says nothing about price,
        quality or which treatments a clinic offers.
      </p>
      <div className="hscroll flush" aria-label="Area">
        <Link href={link("", field)} aria-current={!area ? "true" : undefined}>
          All areas
        </Link>
        {AREAS.map((a) => (
          <Link
            key={a}
            href={link(a, field)}
            aria-current={area === a ? "true" : undefined}
          >
            {a}
          </Link>
        ))}
      </div>
      <div className="hscroll flush" aria-label="Field">
        <Link href={link(area, "")} aria-current={!field ? "true" : undefined}>
          All fields
        </Link>
        {Object.entries(FIELD).map(([k, v]) => (
          <Link
            key={k}
            href={link(area, k)}
            aria-current={field === k ? "true" : undefined}
          >
            {v}
          </Link>
        ))}
      </div>
      <p className="note" style={{ marginTop: 16 }} role="status">
        {list.length.toLocaleString("en-US")} providers
        {list.length > shown ? `, first ${shown} shown` : ""}
      </p>
      {list.length === 0 ? (
        <p className="none">No registered provider matches this area and field.</p>
      ) : (
        <ul className="clinic-cards">
          {list.slice(0, shown).map((p) => (
            <ClinicCard
              key={p.slug}
              slug={p.slug}
              en={p.en}
              ko={p.ko}
              meta={`${p.area} · ${FIELD[p.field]}`}
              hasPhoto={Boolean(p.photo)}
            />
          ))}
        </ul>
      )}
      {list.length > shown && (
        <div className="chips">
          <Link
            href={`${link(area, field)}${area || field ? "&" : "?"}limit=${shown + PAGE}`}
            scroll={false}
          >
            Show {Math.min(PAGE, list.length - shown)} more
          </Link>
        </div>
      )}
    </div>
  );
}
