import { COLLECTED, KRW_PER_USD, MIN_CLINICS } from "@/lib/prices";

export const metadata = {
  title: "How prices work",
  description:
    "Where KBeautyPrice numbers come from, what we leave out, and how reader reports are handled.",
};

export default function HowPricesWork() {
  return (
    <div className="narrow">
      <h1>How prices work</h1>
      <p>
        Numbers here come from prices clinics publish on their own websites. We
        last checked on {COLLECTED}.
      </p>
      <h2>What we show</h2>
      <ul>
        <li>
          A range, only when at least {MIN_CLINICS} clinics publish the same
          treatment and size. If details still differ, the label says so.
        </li>
        <li>
          Listed prices and event prices separately, never blended. A listed
          price is the regular or pre-discount price on the clinic&apos;s page.
        </li>
        <li>
          First-visit trial prices, bundles and prices older than 12 months are
          left out.
        </li>
        <li>How many clinics the range covers and the date we checked.</li>
        <li>
          US dollars as a rough guide at ₩{KRW_PER_USD.toLocaleString("en-US")}{" "}
          per dollar. Clinics charge in won.
        </li>
      </ul>
      <h2>What we leave out</h2>
      <ul>
        <li>Clinic names next to prices, rankings and clinic comparisons.</li>
        <li>Reviews, star ratings and before-and-after photos.</li>
        <li>Prices shared with us privately by clinics.</li>
        <li>Numbers we cannot trace to a source.</li>
      </ul>
      <h2>Reader reports</h2>
      <p>
        Readers can report what they paid without giving a name. Reports are
        checked first and appear only after five people report the same item. No
        reader reports are published yet.
      </p>
      <h2>Limits</h2>
      <p>
        A published price may not be what you pay. It can change without notice
        and may exclude VAT, anaesthesia or follow-up. Only a written quote from
        the clinic tells you your price. This site is not medical advice.
      </p>
      <h2>Corrections</h2>
      <p>
        If a number is wrong or a clinic has changed its price, write to
        ourmarketingad@gmail.com.
      </p>
    </div>
  );
}
