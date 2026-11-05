"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    setLoading(true);
    setMessage(null);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      });
      if (error) {
        setMessage({ text: error.message, ok: false });
      } else {
        setMessage({ text: "Check your email for a confirmation link!", ok: true });
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage({ text: error.message, ok: false });
      } else {
        router.push("/my-submissions");
        router.refresh();
      }
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 400, margin: "5rem auto", padding: "0 1rem" }}>
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 6 }}>
        {mode === "signup" ? "Create account" : "Sign in"}
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 28 }}>
        {mode === "signup"
          ? "Track your price submissions and see their approval status."
          : "Welcome back."}
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{ display: "block", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            style={{
              width: "100%", padding: "11px 14px", borderRadius: 10,
              border: "1px solid var(--border)", background: "var(--card)",
              color: "var(--fg)", fontSize: 14,
            }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Min 6 characters"
            minLength={6}
            style={{
              width: "100%", padding: "11px 14px", borderRadius: 10,
              border: "1px solid var(--border)", background: "var(--card)",
              color: "var(--fg)", fontSize: 14,
            }}
          />
        </div>

        {message && (
          <p style={{
            padding: "10px 14px", borderRadius: 8, fontSize: 13,
            background: message.ok ? "#16a34a18" : "#ef444418",
            color: message.ok ? "#16a34a" : "#ef4444",
            border: `1px solid ${message.ok ? "#16a34a40" : "#ef444440"}`,
          }}>
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "13px", background: "var(--accent)", color: "#fff",
            border: "none", borderRadius: 10, fontWeight: 700, fontSize: 15,
            cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "…" : mode === "signup" ? "Create account" : "Sign in"}
        </button>
      </form>

      <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 20, textAlign: "center" }}>
        {mode === "signup" ? "Already have an account? " : "No account yet? "}
        <button
          onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setMessage(null); }}
          style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13 }}
        >
          {mode === "signup" ? "Sign in" : "Create one"}
        </button>
      </p>

      <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 24, textAlign: "center", lineHeight: 1.6 }}>
        No personal information is required beyond your email.
        We never share your data.
      </p>
    </div>
  );
}
