"use client";

import Link from "next/link";
import { dias } from "@/data/trip";
import { BANDEIRAS } from "@/data/trip";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

export default function RoteiroPage() {
  const [busca, setBusca] = useState("");

  const filtrados = dias.filter((d) => {
    if (!busca.trim()) return true;
    const alvo = busca.toLowerCase();
    return (
      d.titulo.toLowerCase().includes(alvo) ||
      d.cidade.toLowerCase().includes(alvo) ||
      d.data.includes(alvo) ||
      d.eventos.some(
        (e) =>
          e.titulo.toLowerCase().includes(alvo) ||
          e.empresa?.toLowerCase().includes(alvo) ||
          e.numero?.toLowerCase().includes(alvo)
      )
    );
  });

  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      <h1 className="font-display text-xl font-bold">Roteiro completo</h1>

      <input
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar (ex: EasyJet, Positano, 09/10)"
        className="w-full rounded-xl border border-line bg-paper-raised px-4 py-2.5 text-sm"
      />

      <div className="space-y-2">
        {filtrados.map((d) => (
          <Link
            key={d.data}
            href={`/roteiro/${d.data}`}
            className="flex items-center justify-between rounded-2xl bg-paper-raised border border-line p-4"
          >
            <div>
              <p className="font-ticket text-xs text-brass">
                {d.data.split("-").reverse().slice(0, 2).join("/")} · {d.diaSemana}
              </p>
              <p className="font-medium mt-0.5">
                {BANDEIRAS[d.pais]} {d.titulo}
              </p>
            </div>
            <ChevronRight size={18} className="text-ink-soft shrink-0" />
          </Link>
        ))}
        {filtrados.length === 0 && <p className="text-center text-ink-soft py-8">Nada encontrado.</p>}
      </div>
    </div>
  );
}
