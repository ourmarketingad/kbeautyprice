export const metadata = {
  title: "Privacy",
  description: "What KBeautyPrice collects and how it is used.",
};

export default function Privacy() {
  return (
    <div className="narrow">
      <h1>Privacy notice</h1>
      <p>Operator: OUR Marketing (아워마케팅). Contact: ourmarketingad@gmail.com.</p>
      <h2>What we collect</h2>
      <ul>
        <li>Price reports: treatment, amount, price, year and any notes you write.</li>
        <li>If you create an account: your email address and the reports linked to it.</li>
        <li>Clinic applications: clinic name, contact name, work email, phone and your message.</li>
      </ul>
      <p>You do not need an account to report a price. Please do not write names, phone numbers or health details in notes.</p>
      <h2>Why</h2>
      <p>To check reports and publish anonymous price ranges, and to let you see your own reports.</p>
      <h2>Keeping and deleting</h2>
      <p>We keep account data until you ask us to delete it. To delete your account or reports, or to ask what we hold, write to the address above.</p>
      <h2>Service providers</h2>
      <p>Hosting by Vercel and database and sign-in by Supabase, which may process data outside Korea.</p>
    </div>
  );
}
