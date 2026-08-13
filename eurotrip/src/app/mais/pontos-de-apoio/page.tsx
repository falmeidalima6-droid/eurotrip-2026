"use client";

import { useState } from "react";
import VoltarMais from "@/components/VoltarMais";
import { pontosDeApoio } from "@/data/pontosDeApoio";
import { MapPin, AlertCircle } from "lucide-react";

const TIPO_EMOJI: Record<string, string> = {
  restaurante: "🍴",
  lanchonete: "🥪",
  padaria: "🥖",
  banheiro: "🚻",
  agua: "🚰",
};

export default function PontosDeApoioPage() {
  const cidades = Array.from(new Set(pontosDeApoio.map((p) => p.cidade)));
  const [cidade, setCidade] = useState(cidades[0]);

  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      <VoltarMais />
      <h1 className="font-display text-xl font-bold">💧 Pontos de apoio</h1>

      <div className="rounded-xl bg-brass/10 border border-brass/30 p-3 text-xs text-ink-soft flex items-start gap-2">
        <AlertCircle size={14} className="shrink-0 mt-0.5" />
        Lista curada como ponto de partida (base OpenStreetMap), não uma busca ao vivo. Pode estar incompleta ou desatualizada
        — confirme in loco quando tiver sinal.
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {cidades.map((c) => (
          <button
            key={c}
            onClick={() => setCidade(c)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${
              cidade === c ? "bg-ink text-paper" : "bg-paper-raised border border-line"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {pontosDeApoio
          .filter((p) => p.cidade === cidade)
          .map((p) => (
            <div key={p.id} className="rounded-2xl bg-paper-raised border border-line p-4 flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-sm">
                  {TIPO_EMOJI[p.tipo]} {p.nome}
                </p>
                <p className="text-xs text-ink-soft mt-0.5">
                  {p.gratuito === true ? "Gratuito" : p.gratuito === false ? "Pago" : "Gratuito/pago não informado"}
                </p>
                {p.observacoes && <p className="text-xs text-ink-soft mt-1">{p.observacoes}</p>}
              </div>
              <a
                href={`https://maps.google.com/?q=${p.coordenada.lat},${p.coordenada.lng}`}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 inline-flex items-center gap-1 text-xs font-medium bg-ink text-paper rounded-full px-3 py-1.5"
              >
                <MapPin size={12} /> Maps
              </a>
            </div>
          ))}
      </div>
    </div>
  );
}
