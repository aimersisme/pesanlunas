"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListOrdered, WalletCards, MoreHorizontal } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Beranda", icon: Home },
  { href: "/orders", label: "Pesanan", icon: ListOrdered },
  { href: "/receivables", label: "Piutang", icon: WalletCards },
  { href: "/more", label: "Lainnya", icon: MoreHorizontal },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="mobileNav" aria-label="Navigasi utama">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
        return (
          <Link className={`mobileNavItem ${active ? "active" : ""}`} href={href} key={href}>
            <Icon size={22} strokeWidth={active ? 2.7 : 2} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
