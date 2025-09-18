"use client";
import { useState } from "react";
import { useUser } from "@/store/user";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const register = useUser(s => s.register);
  const router = useRouter();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;
    register(value.toLowerCase());
    router.push("/orders");
  }

  return (
    <main style={{ padding: 24, maxWidth: 420 }}>
      <h1>Créer un compte</h1>
      <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <button type="submit">Créer</button>
      </form>
      <p style={{ marginTop: 8 }}>
        Déjà inscrit ? <a href="/auth/login">Se connecter</a>
      </p>
    </main>
  );
}
