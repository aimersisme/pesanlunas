import { Boxes, ChevronRight, FileText, MessageCircle, Settings, SlidersHorizontal, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { getActiveBusiness } from "@/lib/business";
import { LogoutButton } from "@/components/logout-button";

const menus = [
  [Users, "Pelanggan", "Kelola data pelanggan"],
  [Boxes, "Produk & Jasa", "Katalog sederhana untuk order"],
  [FileText, "Invoice", "Riwayat dan tautan invoice"],
  [SlidersHorizontal, "Template & Custom Field", "Sesuaikan form order tiap usaha"],
  [MessageCircle, "Integrasi WhatsApp", "Manual, Fonnte, atau Starsender"],
  [Settings, "Pengaturan Usaha", "Profil, rekening, invoice, anggota"],
] as const;

export default async function MorePage() {
  const business = await getActiveBusiness();
  return <AppShell>
    <header className="pageHeader"><div><h1>Lainnya</h1><p>{business.name} · akses sebagai {business.role}</p></div></header>
    <section className="menuPanel">
      {menus.map(([Icon, title, desc]) => <button className="menuRow" key={title}><Icon size={20} /><span><strong>{title}</strong><small>{desc}</small></span><ChevronRight size={18} /></button>)}
    </section>
    <section className="menuPanel"><LogoutButton /></section>
    <div className="buildNote"><strong>Foundation v0.1.3</strong><span>Auth ✓ · Onboarding ✓ · Dashboard ✓ · Pesanan read ✓ · Piutang + WA manual ✓</span></div>
  </AppShell>;
}
