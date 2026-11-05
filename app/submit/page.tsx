import Link from "next/link";
import { treatments } from "@/data/treatments";

export const metadata = {
  title: "Report a price",
  description:
    "Report what you paid at a Korean clinic, without your name. Reports appear only after five people report the same item.",
};

type Props = {
  searchParams: Promise<{ treatment?: string; success?: string; error?: string }>;
};

const ERRORS: Record<string, string> = {
  missing: "Choose a treatment and enter the price you paid.",
  price: "Enter a price between $1 and $200,000, or between ₩1,000 and ₩300,000,000.",
  consent: "Please tick the box to agree before sending.",
  server: "We could not save your report. Please try again in a few minutes.",
};

export default async function SubmitPage({ searchParams }: Props) {
  const { treatment = "", success, error } = await searchParams;
  if (success === "1") {
    return (
      <div className="narrow">
        <h1>Thank you. We received your report.</h1>
        <p>
          We check reports first. Yours will count toward a published number
          once five people report the same item.
        </p>
        <Link className="btn" href="/treatments">
          Back to prices
        </Link>
      </div>
    );
  }
  return (
    <div className="narrow">
      <h1>Report a price</h1>
      <p>
        Tell us what you paid. No name, clinic or photo is needed. Please do not
        write names, phone numbers or health details in the notes.
      </p>
      {error && (
        <p className="alert" role="alert">
          {ERRORS[error] ?? ERRORS.server}
        </p>
      )}
      <form action="/api/submit" method="POST" className="form">
        <div className="field">
          <label htmlFor="treatment">Treatment (required)</label>
          <select id="treatment" name="treatment" defaultValue={treatment} required>
            <option value="">Select a treatment</option>
            {treatments.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.en}
              </option>
            ))}
            <option value="other">Other (describe in notes)</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="spec">Amount or size</label>
          <input id="spec" name="spec" maxLength={120} placeholder="300 shots, 50 units, 2cc" />
        </div>
        <div className="two-col">
          <div className="field">
            <label htmlFor="krw">Price paid in won</label>
            <input id="krw" name="krw" type="number" min={1000} max={300000000} inputMode="numeric" placeholder="1050000" />
          </div>
          <div className="field">
            <label htmlFor="usd">Or in US dollars</label>
            <input id="usd" name="usd" type="number" min={1} max={200000} inputMode="numeric" placeholder="750" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="year">Year of visit (required)</label>
          <select id="year" name="year" required defaultValue="2026">
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" rows={3} maxLength={500} placeholder="Event price, VAT included, product brand" />
        </div>
        <label className="check">
          <input type="checkbox" name="consent" value="yes" required />
          <span>
            I paid this myself, and I agree that KBeautyPrice may use this report
            in anonymous price ranges. See the <Link href="/privacy">privacy notice</Link>.
          </span>
        </label>
        <button type="submit" className="btn">
          Send report
        </button>
      </form>
    </div>
  );
}
