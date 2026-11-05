import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "My Submissions" };

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  pending:  { label: "Under review", color: "#d97706", bg: "#fef3c720" },
  approved: { label: "Published",    color: "#16a34a", bg: "#16a34a18" },
  rejected: { label: "Not published", color: "#6b7280", bg: "var(--card)" },
};

export default async function MySubmissionsPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) redirect("/auth");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: submissions } = await supabase
    .from("submissions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  async function signOut() {
    "use server";
    const { createClient: serverClient } = await import("@/lib/supabase/server");
    const sb = await serverClient();
    await sb.auth.signOut();
    redirect("/");
  }

  return (
    <div style={{ maxWidth: 700, margin: "3rem auto", padding: "0 1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4 }}>My submissions</h1>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>{user.email}</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/submit" style={{
            padding: "9px 16px", background: "var(--accent)", color: "#fff",
            borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 13,
          }}>
            + Submit price
          </Link>
          <form action={signOut}>
            <button type="submit" style={{
              padding: "9px 16px", background: "var(--card)", color: "var(--muted)",
              border: "1px solid var(--border)", borderRadius: 8, fontWeight: 600,
              cursor: "pointer", fontSize: 13,
            }}>
              Sign out
            </button>
          </form>
        </div>
      </div>

      {!submissions || submissions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--muted)" }}>
          <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No submissions yet</p>
          <p style={{ fontSize: 14, marginBottom: 24 }}>Share what you paid to help other visitors.</p>
          <Link href="/submit" style={{
            display: "inline-block", background: "var(--accent)", color: "#fff",
            padding: "12px 24px", borderRadius: 10, fontWeight: 700,
            textDecoration: "none", fontSize: 14,
          }}>
            Submit a price →
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {submissions.map((s) => {
            const st = STATUS_LABEL[s.status] ?? STATUS_LABEL.pending;
            return (
              <div key={s.id} style={{
                padding: "18px 20px", background: "var(--card)",
                borderRadius: 12, border: "1px solid var(--border)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
                      {s.treatment}{s.spec ? ` — ${s.spec}` : ""}
                    </p>
                    <p style={{ color: "var(--muted)", fontSize: 13 }}>
                      ${s.usd_paid}{s.krw_paid ? ` / ₩${s.krw_paid.toLocaleString()}` : ""} · {s.year_of_visit}
                    </p>
                    {s.notes && (
                      <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 6 }}>{s.notes}</p>
                    )}
                  </div>
                  <span style={{
                    padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                    color: st.color, background: st.bg, flexShrink: 0,
                  }}>
                    {st.label}
                  </span>
                </div>
                <p style={{ color: "var(--muted)", fontSize: 11, marginTop: 10 }}>
                  Submitted {new Date(s.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
