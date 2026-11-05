"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function HeaderAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (user) {
    return (
      <a href="/my-submissions" style={{
        color: "var(--fg)", textDecoration: "none", fontWeight: 600,
        background: "var(--card)", border: "1px solid var(--border)",
        padding: "5px 12px", borderRadius: 8, fontSize: 13,
      }}>
        My prices
      </a>
    );
  }

  return (
    <a href="/auth" style={{
      color: "#fff", textDecoration: "none", fontWeight: 600,
      background: "var(--accent)", padding: "5px 12px", borderRadius: 8, fontSize: 13,
    }}>
      Sign in
    </a>
  );
}
