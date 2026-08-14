import Link from "next/link";
import {
  MapPin,
  Languages,
  Siren,
  Wallet,
  BookHeart,
  Landmark,
  Droplets,
  AlertOctagon,
  Ticket,
  FileText,
} from "lucide-react";

const ITENS = [
  { href: "/mapa", label: "Mapa", icon: MapPin },
  { href: "/reservas", label: "Reservas", icon: Ticket },
  { href: "/mais/frases", label: "Frases", icon: Languages },
  { href: "/mais/guia-cidade", label: "Guia da cidade", icon: Landmark },
  { href: "/mais/dinheiro", label: "Dinheiro", icon: Wallet },
  { href: "/mais/documentos", label: "Documentos", icon: FileText },
  { href: "/mais/pontos-de-apoio", label: "Pontos de apoio", icon: Droplets },
  { href: "/mais/emergencia", label: "Emergência", icon: Siren },
  { href: "/mais/se-der-errado", label: "Se der errado", icon: AlertOctagon },
  { href: "/mais/diario", label: "Diário", icon: BookHeart },
];

export default function OQueOAppOferece() {
  return (
    <section className="space-y-2">
      <p className="text-xs font-medium text-ink-soft uppercase px-1">✨ O que mais o app faz por vocês</p>
      <div className="grid grid-cols-4 gap-2">
        {ITENS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1.5 rounded-2xl bg-paper-raised border border-line p-3 text-center"
          >
            <Icon size={18} className="text-ink-soft" />
            <span className="text-[10px] leading-tight font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
