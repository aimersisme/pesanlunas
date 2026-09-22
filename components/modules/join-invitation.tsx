"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { Brand } from "@/components/brand";

export function JoinInvitation({ token }: { token: string }) {
  const supabase = useMemo(() => createClient(), []);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  async function accept() {
    setBusy(true);
    const { error } = await supabase.rpc("accept_business_invitation", { p_token: token });
    setBusy(false);
    if (error) return setMsg(error.message);
    window.location.href = "/dashboard";
  }
  return <main className="authStage"><section className="authCard"><Brand/><div className="authIntro"><h1>Gabung ke Tim</h1><p>Terima undangan PesanLunas setelah login dengan email yang diundang.</p></div>{msg?<div className="formMessage">{msg}</div>:null}<button className="primaryButton" style={{width:"100%"}} onClick={()=>void accept()} disabled={busy||!token}>{busy?"Memproses...":"Terima Undangan"}</button><p className="authSwitch"><Link href="/auth/login">Login dulu jika belum masuk</Link></p></section></main>;
}
