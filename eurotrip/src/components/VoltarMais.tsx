import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function VoltarMais() {
  return (
    <Link href="/mais" className="inline-flex items-center gap-1 text-sm text-ink-soft">
      <ArrowLeft size={16} /> Mais
    </Link>
  );
}
