import type { Metadata } from "next";
import { notFound } from "next/navigation";
import QuoteBar from "@/components/QuoteBar";
import { publishedClinic } from "@/lib/listing";
import { VAT_LABEL, won } from "@/lib/prices";

type Props = { params: Promise<{ slug: string }> };
export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await publishedClinic((await params).slug);
  if (!data) return {};
  return {
    title: `${data.clinic.name_en} prices`,
    description: `Treatments and prices provided by ${data.clinic.name_en}. Marked as clinic-provided and reviewed before publishing.`,
  };
}

export default async function ClinicPage({ params }: Props) {
  const data = await publishedClinic((await params).slug);
  if (!data) notFound();
  const { clinic, items } = data;
  return (
    <div className="narrow has-quote-bar">
      <p className="note">Listed by the clinic · Advertising information</p>
      <h1>{clinic.name_en}</h1>
      {clinic.name_ko && <p lang="ko" className="sub">{clinic.name_ko}{clinic.area ? ` · ${clinic.area}` : ""}</p>}
      {clinic.intro && <p>{clinic.intro}</p>}
      <h2>Prices provided by the clinic</h2>
      {items.length === 0 ? (
        <p className="note">No prices listed yet.</p>
      ) : (
        <ul className="price-panels">
          {items.map((i) => (
            <li key={i.id}>
              <div className="price-row">
                <span className="price-name">
                  {i.title}
                  <span className="price-spec">
                    <span className={i.kind === "event" ? "tag event" : "tag"}>
                      {i.kind === "event" ? "Event price" : "Listed price"}
                    </span>{" "}
                    {VAT_LABEL[i.vat]}
                  </span>
                </span>
                <span className="price-val">{won(i.price_krw)}</span>
                {i.kind === "event" && (
                  <span className="price-meta">
                    Regular {i.list_price_krw && won(i.list_price_krw)} · until{" "}
                    {i.event_until} · {i.event_target} · {i.event_terms}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="note">
        Prices are provided by the clinic and may change. KBeautyPrice does not
        verify results or recommend this clinic. Ask for a written quote.
      </p>
      <QuoteBar />
    </div>
  );
}
