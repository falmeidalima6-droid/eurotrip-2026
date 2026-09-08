"use client";

import { useState } from "react";
import { hotels } from "@/data/hotels";
import { ChevronDown, ChevronUp, Plane, Hotel as HotelIcon, MapIcon } from "lucide-react";

const CIDADES = [
  { local: "🇮🇹 Roma", chegada: "05/10", saida: "08/10", noites: 3 },
  { local: "🇮🇹 Sorrento (Costa Amalfitana)", chegada: "08/10", saida: "10/10", noites: 2 },
  { local: "🇮🇹 Veneza", chegada: "10/10", saida: "11/10", noites: 1 },
  { local: "🇫🇷 Paris", chegada: "11/10", saida: "13/10", noites: 2 },
  { local: "🇪🇸 Barcelona", chegada: "13/10", saida: "15/10", noites: 2 },
  { local: "🇵🇹 Lisboa", chegada: "15/10", saida: "17/10", noites: 2 },
];

const VOOS = [
  { trecho: "Rio de Janeiro → Paris → Roma", data: "04-05/10", empresa: "Air France (AF443 + AF1404)" },
  { trecho: "Veneza → Paris", data: "11/10", empresa: "EasyJet" },
  { trecho: "Paris → Barcelona", data: "13/10", empresa: "Iberia/Vueling (IB5225)" },
  { trecho: "Barcelona → Lisboa", data: "15/10", empresa: "Iberia/Vueling (IB5634)" },
  { trecho: "Lisboa → Rio de Janeiro (via Viracopos)", data: "17/10", empresa: "Azul" },
];

function SecaoColapsavel({ titulo, icone, children }: { titulo: string; icone: React.ReactNode; children: React.ReactNode }) {
  const [aberto, setAberto] = useState(false);
  return (
    <div className="rounded-2xl bg-paper-raised border border-line overflow-hidden">
      <button
        onClick={() => setAberto((a) => !a)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <span className="font-medium flex items-center gap-2">
          {icone} {titulo}
        </span>
        {aberto ? <ChevronUp size={18} className="text-ink-soft" /> : <ChevronDown size={18} className="text-ink-soft" />}
      </button>
      {aberto && <div className="px-4 pb-4 space-y-2 text-sm">{children}</div>}
    </div>
  );
}

export default function VisaoGeralFamilia() {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-ink-soft uppercase tracking-wide px-1">Visão geral da viagem</p>

      <SecaoColapsavel titulo="Roteiro — cidades e datas" icone={<MapIcon size={18} className="text-brass" />}>
        {CIDADES.map((c) => (
          <div key={c.local} className="flex items-center justify-between border-b border-line last:border-0 py-1.5">
            <span>{c.local}</span>
            <span className="text-ink-soft text-xs">{c.chegada} → {c.saida} ({c.noites}n)</span>
          </div>
        ))}
      </SecaoColapsavel>

      <SecaoColapsavel titulo="Voos principais" icone={<Plane size={18} className="text-brass" />}>
        {VOOS.map((v) => (
          <div key={v.trecho} className="border-b border-line last:border-0 py-1.5">
            <p className="font-medium">{v.trecho}</p>
            <p className="text-ink-soft text-xs">{v.data} — {v.empresa}</p>
          </div>
        ))}
        <p className="text-xs text-ink-soft pt-1">+ trens e ferries entre as cidades da Itália (Roma-Nápoles, Nápoles-Sorrento, Sorrento-Positano-Amalfi, Nápoles-Veneza).</p>
      </SecaoColapsavel>

      <SecaoColapsavel titulo="Hospedagens" icone={<HotelIcon size={18} className="text-brass" />}>
        {hotels.map((h) => (
          <div key={h.id} className="border-b border-line last:border-0 py-1.5">
            <p className="font-medium">{h.nome}</p>
            <p className="text-ink-soft text-xs">{h.cidade} — {h.checkin.split("-").reverse().join("/")} a {h.checkout.split("-").reverse().join("/")}</p>
          </div>
        ))}
      </SecaoColapsavel>
    </div>
  );
}
