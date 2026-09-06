"use client";

import Link from "next/link";
import { guiasCidade } from "@/data/guiaCidade";
import { ChevronRight } from "lucide-react";

export default function SupermercadosHoje({ cidade }: { cidade: string }) {
  const guia = guiasCidade.find((g) => cidade.includes(g.cidade) || g.cidade.includes(cidade));
  if (!guia || !guia.supermercados) return null;

  return (
    <Link
      href="/mais/guia-cidade"
      className="block rounded-2xl bg-paper-raised border border-line p-4 active:scale-[0.98] transition-transform"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-ink-soft uppercase">🛒 Supermercados em {guia.cidade}</p>
        <ChevronRight size={16} className="text-ink-soft shrink-0" />
      </div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {guia.supermercados.map((s, i) => (
          <span key={i} className="text-xs bg-paper border border-line rounded-full px-2.5 py-1">
            {s}
          </span>
        ))}
      </div>
      {guia.comidaBarata && (
        <p className="text-xs text-ink-soft">🍽️ Comida barata também no Guia da Cidade — toque para ver</p>
      )}
    </Link>
  );
}
