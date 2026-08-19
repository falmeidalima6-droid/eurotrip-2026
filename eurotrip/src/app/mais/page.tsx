import Link from "next/link";
import {
  FileText,
  CheckSquare,
  Briefcase,
  Wallet,
  Languages,
  Siren,
  ShoppingCart,
  Droplets,
  Settings,
  ListChecks,
  Search,
  AlertOctagon,
  BookHeart,
  Landmark,
  Users,
} from "lucide-react";

const ITENS = [
  { href: "/mais/pendencias", label: "Painel de pendências", icon: ListChecks, destaque: true },
  { href: "/mais/familia", label: "Compartilhamento Família", icon: Users },
  { href: "/mais/busca", label: "Busca", icon: Search },
  { href: "/mais/guia-cidade", label: "Guia rápido da cidade", icon: Landmark },
  { href: "/mais/documentos", label: "Documentos", icon: FileText },
  { href: "/mais/checklist", label: "Checklist", icon: CheckSquare },
  { href: "/mais/bagagem", label: "Bagagem", icon: Briefcase },
  { href: "/mais/dinheiro", label: "Dinheiro", icon: Wallet },
  { href: "/mais/frases", label: "Frases úteis", icon: Languages },
  { href: "/mais/pontos-de-apoio", label: "Pontos de apoio", icon: Droplets },
  { href: "/mais/emergencia", label: "Emergência", icon: Siren, destaque: true },
  { href: "/mais/se-der-errado", label: "Se algo der errado", icon: AlertOctagon, destaque: true },
  { href: "/mais/diario", label: "Diário da viagem", icon: BookHeart },
  { href: "/mais/lista-compras", label: "Lista de compras", icon: ShoppingCart },
  { href: "/mais/configuracoes", label: "Configurações e backup", icon: Settings },
];

export default function MaisPage() {
  return (
    <div className="px-4 pt-4 pb-6 space-y-3">
      <h1 className="font-display text-xl font-bold mb-2">Mais</h1>
      {ITENS.map(({ href, label, icon: Icon, destaque }) => (
        <Link
          key={href}
          href={href}
          className={`flex items-center gap-3 rounded-2xl border p-4 ${
            destaque ? "bg-alert/5 border-alert/30" : "bg-paper-raised border-line"
          }`}
        >
          <Icon size={20} className={destaque ? "text-alert" : "text-ink-soft"} />
          <span className="font-medium">{label}</span>
        </Link>
      ))}
    </div>
  );
}
