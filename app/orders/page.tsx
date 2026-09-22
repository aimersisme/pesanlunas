import Link from "next/link";
import { ChevronRight, Plus, Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";
import { getActiveBusiness } from "@/lib/business";
import { formatDate, formatIDR } from "@/lib/format";

export const dynamic = "force-dynamic";

type CustomerRelation = { name?: string | null };
type OrderRow = {
  id: string;
  order_number: string;
  order_date: string;
  status: string;
  grand_total: number | string | null;
  balance_due: number | string | null;
  customers: unknown;
};

function getCustomer(value: unknown): CustomerRelation | null {
  if (Array.isArray(value)) return (value[0] as CustomerRelation | undefined) ?? null;
  if (value && typeof value === "object") return value as CustomerRelation;
  return null;
}

const tabs = [
  ["all", "Semua"], ["confirmed", "Baru"], ["in_progress", "Diproses"], ["completed", "Selesai"],
] as const;

function statusLabel(status: string, balance: number): [string, string] {
  if (balance === 0) return ["Lunas", "paid"];
  if (status === "in_progress") return ["Diproses", "process"];
  if (status === "completed") return ["Selesai", "paid"];
  return ["Belum Bayar", "unpaid"];
}

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const business = await getActiveBusiness(supabase);
  const active = params.status || "all";
  let query = supabase.from("orders").select("id,order_number,order_date,status,grand_total,balance_due,customers(name)").eq("business_id", business.id).is("deleted_at", null).order("created_at", { ascending: false }).limit(50);
  if (active !== "all") query = query.eq("status", active);
  const { data: rawOrderRows } = await query;
  const orderRows = (rawOrderRows ?? []) as unknown as OrderRow[];
  const needle = (params.q || "").trim().toLowerCase();
  const orders = orderRows.filter((order: OrderRow) => {
    if (!needle) return true;
    const customer = getCustomer(order.customers);
    return order.order_number.toLowerCase().includes(needle) || (customer?.name || "").toLowerCase().includes(needle);
  });

  return (
    <AppShell>
      <header className="pageHeader"><div><h1>Pesanan</h1><p>Kelola semua pesanan pelanggan</p></div><Link className="smallAddButton" href="/orders?new=1"><Plus size={18} /></Link></header>
      <form className="searchBox"><Search size={19} /><input name="q" defaultValue={params.q || ""} placeholder="Cari nama pelanggan atau nomor pesanan..." /></form>
      <div className="filterTabs">{tabs.map(([value, label]) => <Link key={value} className={active === value ? "active" : ""} href={`/orders?status=${value}`}>{label}</Link>)}</div>
      <section className="orderList">
        {orders.length === 0 ? <div className="emptyPanel">Belum ada pesanan pada filter ini.</div> : orders.map((order: OrderRow) => {
          const customer = getCustomer(order.customers);
          const [label, tone] = statusLabel(order.status, Number(order.balance_due ?? 0));
          const customerName = customer?.name?.trim() || "Pelanggan";
          const initials = customerName.split(/\s+/).slice(0, 2).map((part: string) => part.charAt(0)).join("").toUpperCase();
          return <article className="orderCard" key={order.id}>
            <span className="customerAvatar">{initials}</span>
            <div className="orderMain"><strong>{customerName}</strong><small>{order.order_number}</small><small>{formatDate(order.order_date)}</small></div>
            <div className="orderRight"><b>{formatIDR(order.grand_total)}</b><span className={`statusPill ${tone}`}>{label}</span></div>
            <ChevronRight size={20} className="orderChevron" />
          </article>;
        })}
      </section>
      <Link className="floatingCTA" href="/orders?new=1"><Plus size={22} /> Catat Order</Link>
    </AppShell>
  );
}
