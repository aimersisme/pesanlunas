import { ReceiptText } from "lucide-react";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand">
      <span className="brandIcon"><ReceiptText size={22} strokeWidth={2.4} /></span>
      {!compact && <span className="brandName">PesanLunas</span>}
    </div>
  );
}
