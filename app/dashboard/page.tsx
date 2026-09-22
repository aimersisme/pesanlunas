import Link from "next/link";
import { Bell, ChevronRight, Clock3, Plus, ReceiptText, ShoppingCart, WalletCards } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Brand } from "@/components/brand";
import { StatCard } from "@/components/stat-card";
import { MonthlyChart } from "@/components/monthly-chart";
import { createClient } from "@/lib/supabase/server";
import { getActiveBusiness } from "@/lib/business";
import { compactIDR, formatIDR, greeting } from "@/lib/format";

export const dynamic = "force-dynamic";

type CustomerRelation = { name?: string | null };
type RecentOrderRow = {
  id: string;
  order_number: string;
  order_date: string;
  grand_total: number | string | null;
  balance_due: number | string | null;
  status: string;
  customers: unknown;
};
type MonthOrderRow = {
  order_date: string;
  grand_total: number | string | null;
  status: string;
};
type Summary = {
  order_today: number;
  order_need_process: number;
  order_value_period: number;
  cash_received_period: number;
  active_receivables: number;
  due_today: number;
  overdue: number;
};

function getCustomer(value: unknown): CustomerRelation | null {
  if (Array.isArray(value)) return (value[0] as CustomerRelation | undefined) ?? null;
  if (value && typeof value === "object") return value as CustomerRelation;
  return null;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const business = await getActiveBusiness(supabase);
  const now = new Date();
  const from = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-01`;
  const to = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)).getUTCDate()).padStart(2, "0")}`;

  const [summaryResult, recentResult, monthOrderResult] = await Promise.all([
    supabase.rpc("get_dashboard_summary", { p_business_id: business.id, p_from: from, p_to: to }),
    supabase.from("orders").select("id,order_number,order_date,grand_total,balance_due,status,customers(name)").eq("business_id", business.id).is("deleted_at", null).order("created_at", { ascending: false }).limit(4),
    supabase.from("orders").select("order_date,grand_total,status").eq("business_id", business.id).gte("order_date", from).lte("order_date", to).is("deleted_at", null),
  ]);

  const dashboardWarning =
    summaryResult.error?.message || recentResult.error?.message || monthOrderResult.error?.message || "";
  const summary = (summaryResult.data ?? {}) as Partial<Summary>;
  const recent = (recentResult.data ?? []) as unknown as RecentOrderRow[];
  const monthOrders = (monthOrderResult.data ?? []) as unknown as MonthOrderRow[];
  const days = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)).getUTCDate();
  const daily = Array.from({ length: days }, (_unused, index) => ({ day: index + 1, value: 0 }));

  monthOrders.forEach((row: MonthOrderRow) => {
    if (row.status === "cancelled") return;
    const day = Number(String(row.order_date).slice(-2));
    if (daily[day - 1]) daily[day - 1].value += Number(row.grand_total ?? 0);
  });

  return (
    <AppShell>
      <header className="topHeader">
        <Brand />
        <button className="iconButton" aria-label="Notifikasi"><Bell size={22} /></button>
      </header>

      <section className="welcomeBlock">
        <h1>{greeting(business.timezone)} 👋</h1>
        <p>Semoga hari ini makin lancar jualannya.</p>
      </section>

      {dashboardWarning ? (
        <section className="formMessage" style={{ marginBottom: 14 }}>
          Dashboard terhubung, tetapi ada query yang perlu diperiksa: {dashboardWarning}
        </section>
      ) : null}

      <section className="businessCard">
        <span className="businessAvatar"><ReceiptText size={23} /></span>
        <div><strong>{business.name}</strong><small>Order & piutang dalam satu tempat</small></div>
        <ChevronRight size={22} />
      </section>

      <section className="statsGrid">
        <StatCard icon={ShoppingCart} label="Order Hari Ini" value={String(summary.order_today ?? 0)} />
        <StatCard icon={WalletCards} label="Belum Dibayar" value={compactIDR(summary.active_receivables ?? 0)} tone="red" />
        <StatCard icon={Clock3} label="Jatuh Tempo" value={String((summary.due_today ?? 0) + (summary.overdue ?? 0))} tone="amber" />
      </section>

      <MonthlyChart data={daily} />

      <section className="sectionBlock">
        <div className="sectionTitle"><h2>Aktivitas Terbaru</h2><Link href="/orders">Lihat Semua</Link></div>
        <div className="activityList">
          {recent.length === 0 ? <div className="emptyState">Belum ada order. Mulai dengan mencatat pesanan pertama.</div> : recent.map((order: RecentOrderRow) => {
            const customer = getCustomer(order.customers);
            return (
              <Link href="/orders" className="activityRow" key={order.id}>
                <span className="activityIcon"><ShoppingCart size={18} /></span>
                <div><strong>{customer?.name || "Pelanggan"}</strong><small>{order.order_number} · {order.status.replaceAll("_", " ")}</small></div>
                <b>{formatIDR(order.grand_total)}</b>
              </Link>
            );
          })}
        </div>
      </section>

      <Link className="floatingCTA" href="/orders?new=1"><Plus size={22} /> Catat Order</Link>
    </AppShell>
  );
}
