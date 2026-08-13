"use client";

import { useState } from "react";
import Link from "next/link";
import VoltarMais from "@/components/VoltarMais";
import { todosEventos } from "@/data/trip";
import { hotels } from "@/data/hotels";
import { transportes } from "@/data/transportes";
import { ingressos } from "@/data/ingressos";
import { CATEGORIA_EMOJI } from "@/lib/categorias";
import { ChevronRight } from "lucide-react";

export default function BuscaPage() {
  const [q, setQ] = useState("");
  const alvo = q.trim().toLowerCase();

  const eventosEncontrados = alvo
    ? todosEventos.filter(
        (e) =>
          e.titulo.toLowerCase().includes(alvo) ||
          e.empresa?.toLowerCase().includes(alvo) ||
          e.numero?.toLowerCase().includes(alvo) ||
          e.cidade.toLowerCase().includes(alvo) ||
          e.data.includes(alvo)
      )
    : [];

  const hoteisEncontrados = alvo ? hotels.filter((h) => h.nome.toLowerCase().includes(alvo) || h.cidade.toLowerCase().includes(alvo)) : [];

  const transportesEncontrados = alvo
    ? transportes.filter(
        (t) =>
          t.empresa.toLowerCase().includes(alvo) ||
          t.numero?.toLowerCase().includes(alvo) ||
          t.origem.toLowerCase().includes(alvo) ||
          t.destino.toLowerCase().includes(alvo)
      )
    : [];

  const ingressosEncontrados = alvo ? ingressos.filter((i) => i.nome.toLowerCase().includes(alvo) || i.cidade.toLowerCase().includes(alvo)) : [];

  const semResultado =
    alvo && eventosEncontrados.length === 0 && hoteisEncontrados.length === 0 && transportesEncontrados.length === 0 && ingressosEncontrados.length === 0;

  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      <VoltarMais />
      <h1 className="font-display text-xl font-bold">🔎 Busca</h1>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Ex: Veneza, AF443, Hotel Mundial, Sagrada Família..."
        autoFocus
        className="w-full rounded-xl border border-line bg-paper-raised px-4 py-2.5 text-sm"
      />

      {semResultado && <p className="text-center text-ink-soft py-6">Nada encontrado.</p>}

      {hoteisEncontrados.length > 0 && (
        <Grupo titulo="Hotéis">
          {hoteisEncontrados.map((h) => (
            <Link key={h.id} href="/reservas" className="flex items-center justify-between rounded-xl bg-paper-raised border border-line p-3">
              <span>
                🏨 {h.nome} <span className="text-ink-soft text-xs">— {h.cidade}</span>
              </span>
              <ChevronRight size={16} className="text-ink-soft" />
            </Link>
          ))}
        </Grupo>
      )}

      {transportesEncontrados.length > 0 && (
        <Grupo titulo="Transportes">
          {transportesEncontrados.map((t) => (
            <Link key={t.id} href="/reservas" className="flex items-center justify-between rounded-xl bg-paper-raised border border-line p-3">
              <span>
                {t.empresa} {t.numero} — {t.origem} → {t.destino}
              </span>
              <ChevronRight size={16} className="text-ink-soft" />
            </Link>
          ))}
        </Grupo>
      )}

      {ingressosEncontrados.length > 0 && (
        <Grupo titulo="Ingressos">
          {ingressosEncontrados.map((i) => (
            <Link key={i.id} href="/mais/pendencias" className="flex items-center justify-between rounded-xl bg-paper-raised border border-line p-3">
              <span>
                🎟️ {i.nome} <span className="text-ink-soft text-xs">— {i.cidade}</span>
              </span>
              <ChevronRight size={16} className="text-ink-soft" />
            </Link>
          ))}
        </Grupo>
      )}

      {eventosEncontrados.length > 0 && (
        <Grupo titulo="Roteiro">
          {eventosEncontrados.map((e) => (
            <Link key={e.id} href={`/roteiro/${e.data}`} className="flex items-center justify-between rounded-xl bg-paper-raised border border-line p-3">
              <span>
                {CATEGORIA_EMOJI[e.categoria]} {e.titulo}{" "}
                <span className="text-ink-soft text-xs">
                  — {e.data.split("-").reverse().slice(0, 2).join("/")}
                </span>
              </span>
              <ChevronRight size={16} className="text-ink-soft" />
            </Link>
          ))}
        </Grupo>
      )}
    </div>
  );
}

function Grupo({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-ink-soft uppercase">{titulo}</p>
      {children}
    </div>
  );
}
