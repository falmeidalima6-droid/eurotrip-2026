"use client";

import Link from "next/link";
import { useHoje } from "@/lib/useHoje";
import { computarEventosDoDia, formatarHoraLocal } from "@/lib/time";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export default function DeslocamentoPage() {
  const { dia } = useHoje();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(i);
  }, []);

  const eventos = dia ? computarEventosDoDia(dia) : [];
  const evento =
    eventos.find((e) => e.statusComputado === "agora" && ["voo", "trem", "ferry", "transfer"].includes(e.categoria)) ||
    eventos.find((e) => e.statusComputado === "proximo" && ["voo", "trem", "ferry", "transfer"].includes(e.categoria));

  if (!dia || !evento) {
    return (
      <div className="min-h-screen bg-ink text-paper flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p>Nenhum deslocamento com transporte previsto agora.</p>
        <Link href="/hoje" className="underline">Voltar</Link>
      </div>
    );
  }

  return (
    <div key={tick} className="fixed inset-0 z-50 bg-ink text-paper flex flex-col">
      <div className="flex justify-between items-center px-5 pt-5">
        <span className="font-ticket text-xs opacity-60">{formatarHoraLocal(dia.pais)} local</span>
        <Link href="/hoje" aria-label="Fechar" className="p-2 -m-2">
          <X size={22} />
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6 text-center">
        <div className="flex items-center gap-3 font-display text-2xl sm:text-3xl font-bold uppercase">
          <span>{evento.origem || dia.cidade}</span>
          <span className="text-brass">→</span>
          <span>{evento.destino}</span>
        </div>

        <div className="font-ticket text-6xl sm:text-7xl font-semibold tracking-tight text-brass">
          {evento.horarioInicial || "--:--"}
        </div>

        <div className="font-ticket text-lg sm:text-xl uppercase tracking-widest opacity-90">
          {evento.empresa} {evento.numero}
        </div>

        <div className="flex gap-6 font-ticket text-sm sm:text-base opacity-80 uppercase">
          {evento.terminal && <span>Terminal {evento.terminal}</span>}
          {evento.plataforma && <span>Plataforma {evento.plataforma}</span>}
          {evento.estacaoAeroportoPorto && <span>{evento.estacaoAeroportoPorto}</span>}
        </div>

        {evento.alerta && (
          <div className="mt-2 rounded-lg bg-alert/20 border border-alert/40 px-4 py-2 text-sm">
            {evento.alerta}
          </div>
        )}
      </div>

      <div className="px-6 pb-8 text-center">
        <p className="font-ticket text-xs opacity-50 uppercase tracking-widest">Eurotrip 2026 · Fernanda + Marcos</p>
      </div>
    </div>
  );
}
