import { Clock3, MessageCircle, WalletCards } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";
import { getActiveBusiness } from "@/lib/business";
import { formatDate, formatIDR, normalizeWhatsApp } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ReceivablesPage() {
  const business = await getActiveBusiness();
  const supabase = await createClient();
  const { data } = await supabase.from("v_receivables").select("*").eq("business_id", business.id).in("effective_payment_status", ["unpaid", "partial", "overdue"]).order("due_date", { ascending: true }).limit(100);
  const total = (data || []).reduce((sum, row) => sum + Number(row.balance_due || 0), 0);

  return (
    <AppShell>
      <header className="pageHeader"><div><h1>Piutang</h1><p>Pantau tagihan yang belum lunas</p></div></header>
      <section className="receivableHero"><WalletCards size={22} /><span>Total Piutang Aktif</span><strong>{formatIDR(total)}</strong><small>{(data || []).length} invoice belum lunas</small></section>
      <section className="receivableList">
        {(data || []).length === 0 ? <div className="emptyPanel">Semua tagihan sudah beres 🎉</div> : (data || []).map((row) => {
          const overdue = row.effective_payment_status === "overdue";
          const phone = normalizeWhatsApp(row.customer_whatsapp);
          const text = encodeURIComponent(`Halo ${row.customer_name}, kami mengingatkan sisa tagihan ${row.invoice_number} sebesar ${formatIDR(row.balance_due)}${row.due_date ? `, jatuh tempo ${formatDate(row.due_date)}` : ""}. Terima kasih.`);
          return <article className="receivableCard" key={row.invoice_id}>
            <div className="receivableTop"><span className={`receivableIcon ${overdue ? "late" : ""}`}><Clock3 size={18} /></span><div><strong>{row.customer_name}</strong><small>{row.invoice_number}</small></div><b>{formatIDR(row.balance_due)}</b></div>
            <div className="receivableMeta"><span>Jatuh tempo: {formatDate(row.due_date)}</span><span className={overdue ? "lateText" : ""}>{overdue ? `Terlambat ${Math.abs(Number(row.days_from_due || 0))} hari` : row.effective_payment_status === "partial" ? "Sudah ada pembayaran" : "Belum dibayar"}</span></div>
            {phone ? <a className="waButton" target="_blank" rel="noreferrer" href={`https://wa.me/${phone}?text=${text}`}><MessageCircle size={18} /> Tagih via WhatsApp</a> : <span className="waDisabled">Nomor WhatsApp pelanggan belum diisi</span>}
          </article>;
        })}
      </section>
    </AppShell>
  );
}
