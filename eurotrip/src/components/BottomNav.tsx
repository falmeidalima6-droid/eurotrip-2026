"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarDays, MapPin, Ticket, Menu } from "lucide-react";

const ITEMS = [
  { href: "/hoje", label: "Hoje", icon: Home },
  { href: "/roteiro", label: "Roteiro", icon: CalendarDays },
  { href: "/mapa", label: "Mapa", icon: MapPin },
  { href: "/reservas", label: "Reservas", icon: Ticket },
  { href: "/mais", label: "Mais", icon: Menu },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-paper-raised border-t border-line max-w-lg mx-auto"
      aria-label="Navegação principal"
    >
      <ul className="flex justify-between">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
                  active ? "text-ink" : "text-ink-soft"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.4 : 1.8} color={active ? "#c89b3c" : undefined} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
