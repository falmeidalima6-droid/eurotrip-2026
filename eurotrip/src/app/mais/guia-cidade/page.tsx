"use client";

import { useState } from "react";
import VoltarMais from "@/components/VoltarMais";
import { guiasCidade } from "@/data/guiaCidade";
import { AlertTriangle } from "lucide-react";

export default function GuiaCidadePage() {
  const [aberta, setAberta] = useState(guiasCidade[0].cidade);
  const guia = guiasCidade.find((g) => g.cidade === aberta)!;

  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      <VoltarMais />
      <h1 className="font-display text-xl font-bold">🏙️ Guia rápido da cidade</h1>
      <p className="text-xs text-ink-soft">
        Informação prática pesquisada (não é uma enciclopédia turística) — pode mudar com o tempo, confirmem localmente
        quando possível.
      </p>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {guiasCidade.map((g) => (
          <button
            key={g.cidade}
            onClick={() => setAberta(g.cidade)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${
              aberta === g.cidade ? "bg-ink text-paper" : "bg-paper-raised border border-line"
            }`}
          >
            {g.emoji} {g.cidade}
          </button>
        ))}
      </div>

      <Secao titulo="🚇 Transporte" itens={guia.transporte} />

      <div className="rounded-2xl bg-paper-raised border border-line p-4">
        <p className="text-xs font-medium text-ink-soft uppercase mb-1.5">💶 Gorjeta</p>
        <p className="text-sm">{guia.gorjeta}</p>
      </div>

      <div className="rounded-2xl bg-paper-raised border border-line p-4">
        <p className="text-xs font-medium text-ink-soft uppercase mb-1.5">🚰 Água</p>
        <p className="text-sm">{guia.agua}</p>
      </div>

      <div className="rounded-2xl bg-alert/5 border border-alert/30 p-4">
        <p className="text-xs font-medium text-alert uppercase mb-1.5 flex items-center gap-1.5">
          <AlertTriangle size={13} /> Golpes comuns
        </p>
        <ul className="space-y-1.5">
          {guia.golpes.map((g, i) => (
            <li key={i} className="text-sm text-ink-soft">
              • {g}
            </li>
          ))}
        </ul>
      </div>

      <Secao titulo="📌 Particularidades locais" itens={guia.particularidades} />
    </div>
  );
}

function Secao({ titulo, itens }: { titulo: string; itens: string[] }) {
  return (
    <div className="rounded-2xl bg-paper-raised border border-line p-4">
      <p className="text-xs font-medium text-ink-soft uppercase mb-1.5">{titulo}</p>
      <ul className="space-y-1.5">
        {itens.map((item, i) => (
          <li key={i} className="text-sm">
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
