import Link from "next/link";

export const metadata = {
  title: "List your clinic",
  description:
    "How clinics can list their own prices on KBeautyPrice, and how listings are checked before they appear.",
};

const ERRORS: Record<string, string> = {
  missing: "Enter the clinic name and your name.",
  email: "Enter a valid email address.",
  phone: "Enter a valid phone number, or leave it empty.",
  consent: "Please tick the box to agree before sending.",
  server: "We could not save your application. Please try again in a few minutes.",
};

type Props = { searchParams: Promise<{ sent?: string; error?: string }> };

export default async function ForClinics({ searchParams }: Props) {
  const { sent, error } = await searchParams;
  return (
    <div className="narrow">
      <h1>List your clinic on KBeautyPrice</h1>
      <p className="article-answer">
        Registered clinics can show their own treatments and prices to foreign
        visitors. No fee applies unless we both agree to it in writing first.
      </p>
      <h2>What a listing includes</h2>
      <ul className="check-list">
        <li>A clinic page with your introduction and area</li>
        <li>Your treatments and prices, marked as provided by the clinic</li>
        <li>A clinic login to update prices, reviewed before they go live</li>
        <li>Your own clinic photos (interior or exterior), shown only with your written permission</li>
      </ul>
      <h2>Rules for every listing</h2>
      <ul className="check-list">
        <li>Your clinic is on the foreign patient registry</li>
        <li>No patient reviews, before-and-after images or superlatives</li>
        <li>Event prices state the regular price, dates, who qualifies and conditions</li>
        <li>You confirm your content meets Korean medical advertising rules</li>
      </ul>
      <h2>What we do not promise</h2>
      <p>
        This is a new site, and we have no traffic figures to share yet. We do
        not promise visitors, enquiries or bookings. Listing does not change the
        published price ranges, and clinics cannot pay for a better range or rank.
      </p>
      <h2 id="apply">Apply</h2>
      {sent === "1" ? (
        <p className="article-answer" role="status">
          Thank you. We received your application and will reply by email.
        </p>
      ) : (
        <>
          {error && (
            <p className="alert" role="alert">
              {ERRORS[error] ?? ERRORS.server}
            </p>
          )}
          <form action="/api/clinic-apply" method="POST" className="form">
            <div className="field">
              <label htmlFor="clinic">Clinic name (required)</label>
              <input id="clinic" name="clinic" required minLength={2} maxLength={120} autoComplete="organization" />
            </div>
            <div className="field">
              <label htmlFor="name">Your name (required)</label>
              <input id="name" name="name" required maxLength={80} autoComplete="name" />
            </div>
            <div className="field">
              <label htmlFor="email">Work email (required)</label>
              <input id="email" name="email" type="email" required maxLength={200} autoComplete="email" />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" type="tel" maxLength={40} autoComplete="tel" />
            </div>
            <div className="field">
              <label htmlFor="note">Anything we should know</label>
              <textarea id="note" name="note" rows={3} maxLength={1000} />
            </div>
            <div aria-hidden="true" style={{ position: "absolute", left: -9999 }}>
              <label htmlFor="website">Leave this empty</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <label className="check">
              <input type="checkbox" name="consent" value="yes" required />
              <span>
                I agree that KBeautyPrice may use these details to reply about
                this listing. See the <Link href="/privacy">privacy notice</Link>.
              </span>
            </label>
            <button type="submit" className="btn">
              Send application
            </button>
          </form>
        </>
      )}
      <p className="note">
        Clinic staff with an approved listing can <Link href="/manage">sign in here</Link>.
      </p>
    </div>
  );
}
