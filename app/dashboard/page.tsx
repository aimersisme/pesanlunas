import Link from "next/link";
import { Bell, ChevronRight, Clock3, Plus, ReceiptText, ShoppingCart, TrendingUp, WalletCards } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Brand } from "@/components/brand";
import { StatCard } from "@/components/stat-card";
import { MonthlyChart } from "@/components/monthly-chart";
import { createClient } from "@/lib/supabase/server";
import { compactIDR, formatIDR, greeting } from "@/lib/format";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type Business = { id:string; name:string; slug:string; timezone:string; role:string };
type Summary = {
  order_today:number; order_need_process:number; order_value_period:number; cash_received_period:number;
  active_receivables:number; due_today:number; overdue:number; invoice_total_period:number; invoice_paid_period:number; collection_rate:number;
};
type RecentOrder = { id:string; order_number:string; order_date:string; grand_total:number|string|null; balance_due:number|string|null; status:string; customer_name:string|null };
type ChartPoint = { day:number; value:number|string };
type Payload = { business:Business|null; summary?:Partial<Summary>; recent?:RecentOrder[]; chart?:ChartPoint[] };

export default async function DashboardPage() {
  const supabase = await createClient();
  const now = new Date();
  const from = `${now.getUTCFullYear()}-${String(now.getUTCMonth()+1).padStart(2,"0")}-01`;
  const lastDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth()+1, 0)).getUTCDate();
  const to = `${now.getUTCFullYear()}-${String(now.getUTCMonth()+1).padStart(2,"0")}-${String(lastDay).padStart(2,"0")}`;
  const { data, error } = await supabase.rpc("get_single_dashboard_payload", { p_from: from, p_to: to });
  if (error) {
    if (error.message.includes("AUTH_REQUIRED")) redirect("/auth/login");
    throw new Error(`DASHBOARD_PAYLOAD_FAILED: ${error.message}. Jalankan SQL patch v0.2.1.`);
  }
  const payload = (data ?? {}) as unknown as Payload;
  if (!payload.business) redirect("/onboarding");
  const business = payload.business;
  const summary = payload.summary ?? {};
  const recent = payload.recent ?? [];
  const chartMap = new Map((payload.chart ?? []).map((x) => [Number(x.day), Number(x.value ?? 0)]));
  const daily = Array.from({ length:lastDay }, (_,index) => ({ day:index+1, value:chartMap.get(index+1) ?? 0 }));
  const collection = Math.max(0, Math.min(100, Number(summary.collection_rate ?? 0)));

  return <AppShell>
    <header className="topHeader"><Brand/><button className="iconButton" aria-label="Notifikasi"><Bell size={22}/></button></header>
    <section className="welcomeBlock"><h1>{greeting(business.timezone)} 👋</h1><p>Semoga hari ini makin lancar jualannya.</p></section>

    <section className="businessCard premiumBusinessCard">
      <span className="businessAvatar"><ReceiptText size={23}/></span>
      <div><strong>{business.name}</strong><small>Order & piutang dalam satu tempat</small></div><ChevronRight size={22}/>
    </section>

    <section className="statsGrid">
      <StatCard icon={ShoppingCart} label="Order Hari Ini" value={String(summary.order_today ?? 0)}/>
      <StatCard icon={WalletCards} label="Belum Dibayar" value={compactIDR(summary.active_receivables ?? 0)} tone="red"/>
      <StatCard icon={Clock3} label="Jatuh Tempo" value={String((summary.due_today ?? 0)+(summary.overdue ?? 0))} tone="amber"/>
    </section>

    <section className="collectionCard">
      <div className="collectionRing" style={{background:`conic-gradient(#07965a ${collection}%, #e7eee9 0)`}}><div><strong>{collection}%</strong><span>tertagih</span></div></div>
      <div className="collectionCopy"><span className="eyebrow"><TrendingUp size={14}/> Pembayaran bulan ini</span><h2>{formatIDR(summary.cash_received_period ?? 0)}</h2><p>Dari invoice bulan ini {formatIDR(summary.invoice_total_period ?? 0)}.</p></div>
      <Link href="/receivables" className="collectionLink">Lihat Piutang <ChevronRight size={16}/></Link>
    </section>

    <MonthlyChart data={daily}/>

    <section className="sectionBlock"><div className="sectionTitle"><h2>Aktivitas Terbaru</h2><Link href="/orders">Lihat Semua</Link></div><div className="activityList">
      {recent.length===0 ? <div className="emptyState upgradedEmpty"><ShoppingCart size={26}/><strong>Belum ada order</strong><span>Catat pesanan pertama untuk mulai melihat aktivitas bisnis.</span></div> : recent.map(order => <Link href={`/orders/${order.id}`} className="activityRow" key={order.id}><span className="activityIcon"><ShoppingCart size={18}/></span><div><strong>{order.customer_name || "Pelanggan"}</strong><small>{order.order_number} · {order.status.replaceAll("_"," ")}</small></div><b>{formatIDR(order.grand_total)}</b></Link>)}
    </div></section>
    <Link className="floatingCTA" href="/orders/new"><Plus size={22}/> Catat Order</Link>
  </AppShell>;
}
