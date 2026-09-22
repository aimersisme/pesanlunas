"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";
import { Brand } from "@/components/brand";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const search = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const name = String(form.get("name") || "").trim();
    const supabase = createClient();

    try {
      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        if (!data.session) {
          setMessage("Akun dibuat. Cek email konfirmasi Supabase, lalu login.");
          return;
        }
        router.replace("/onboarding");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.replace(search.get("next") || "/dashboard");
      }
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="authStage">
      <section className="authCard">
        <Brand />
        <div className="authIntro">
          <h1>{mode === "login" ? "Masuk ke PesanLunas" : "Mulai kelola order dengan rapi"}</h1>
          <p>Pesanan tercatat, tagihan cepat lunas.</p>
        </div>
        <form onSubmit={submit} className="formStack">
          {mode === "register" && (
            <label>Nama Anda<input name="name" required placeholder="Contoh: Rina" autoComplete="name" /></label>
          )}
          <label>Email<input name="email" required type="email" placeholder="nama@email.com" autoComplete="email" /></label>
          <label>Password<input name="password" required minLength={6} type="password" placeholder="Minimal 6 karakter" autoComplete={mode === "login" ? "current-password" : "new-password"} /></label>
          {message && <div className="formMessage">{message}</div>}
          <button className="primaryButton" disabled={loading}>{loading ? "Memproses..." : mode === "login" ? "Masuk" : "Buat Akun"}</button>
        </form>
        <p className="authSwitch">
          {mode === "login" ? "Belum punya akun? " : "Sudah punya akun? "}
          <Link href={mode === "login" ? "/auth/register" : "/auth/login"}>{mode === "login" ? "Daftar" : "Masuk"}</Link>
        </p>
      </section>
    </main>
  );
}
