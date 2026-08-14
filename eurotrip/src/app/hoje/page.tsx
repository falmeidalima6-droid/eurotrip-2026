"use client";

import Link from "next/link";
import { useHoje } from "@/lib/useHoje";
import { computarEventosDoDia } from "@/lib/time";
import { hotels } from "@/data/hotels";
import { BANDEIRAS, TRIP_INFO } from "@/data/trip";
import { CATEGORIA_EMOJI } from "@/lib/categorias";
import RelogioDuplo from "@/components/RelogioDuplo";
import Semaforo from "@/components/Semaforo";
import PrepararAmanha from "@/components/PrepararAmanha";
import ResumoPendencias from "@/components/ResumoPendencias";
import OQueOAppOferece from "@/components/OQueOAppOferece";
import { MapPin, ChevronRight, Search } from "lucide-react";

export default function HojePage() {
  const { dia, amanha, estado, diasParaComeco } = useHoje();

  return (
    <div className="px-4 pt-4 pb-6 space-y-5">
      <header className="text-center space-y-1 pt-2 relative">
        <Link
          href="/mais/busca"
          aria-label="Buscar"
          className="absolute right-0 top-10 p-2 rounded-full bg-paper-raised border border-line"
        >
          <Search size={16} className="text-ink-soft" />
        </Link>
        <h1 className="font-display text-2xl font-bold tracking-tight">{TRIP_INFO.titulo}</h1>
        <p className="text-ink-soft text-sm">{TRIP_INFO.viajantes}</p>
        <p className="font-ticket text-xs text-brass">04/10 → 17/10</p>
      </header>

      {estado === "antes" && (
        <div className="rounded-2xl bg-ink text-paper p-5 text-center">
          <p className="font-ticket text-3xl font-bold">{diasParaComeco}</p>
          <p className="text-sm mt-1">dias até o embarque ✈️</p>
        </div>
      )}

      {estado === "depois" && (
        <div className="rounded-2xl bg-ink text-paper p-5 text-center">
          <p className="text-lg font-medium">Viagem concluída 🎉</p>
          <p className="text-sm text-paper/70 mt-1">Vejam o roteiro completo em &quot;Roteiro&quot;.</p>
        </div>
      )}

      {dia && (
        <>
          <RelogioDuplo pais={dia.pais} />

          <ResumoPendencias />

          <Link
            href="/hoje/agora"
            className="block rounded-2xl bg-alert text-white p-5 text-center active:scale-[0.98] transition-transform"
          >
            <p className="text-sm uppercase tracking-wide opacity-90">📍 Agora</p>
            <p className="font-display text-xl font-bold mt-1">{dia.cidade}</p>
            <p className="text-xs opacity-90 mt-1">Toque para ver o cartão completo</p>
          </Link>

          <section className="rounded-2xl bg-paper-raised border border-line p-4">
            <p className="text-xs font-medium text-ink-soft mb-2">HOJE — {dia.diaSemana}</p>
            <p className="font-display text-lg font-semibold">{BANDEIRAS[dia.pais]} {dia.titulo}</p>
            <ProximoResumo dia={dia} />
          </section>

          <Link
            href={`/roteiro/${dia.data}`}
            className="flex items-center justify-between rounded-2xl bg-paper-raised border border-line p-4"
          >
            <span className="font-medium">Ver linha do tempo completa</span>
            <ChevronRight size={18} className="text-ink-soft" />
          </Link>

          <OndeDormimos data={dia.data} />

          {amanha && amanha.cidade !== dia.cidade && (
            <section className="rounded-2xl bg-brass/10 border border-brass/30 p-4">
              <p className="text-xs font-medium text-brass mb-1">⚠️ AMANHÃ TEM DESLOCAMENTO</p>
              <p className="font-medium">{amanha.cidade}</p>
            </section>
          )}
          {amanha && <PrepararAmanha data={dia.data} temTrocaDeCidade={amanha.cidade !== dia.cidade} />}
          {amanha && (
            <section className="rounded-2xl bg-paper-raised border border-line p-4">
              <p className="text-xs font-medium text-ink-soft mb-1">AMANHÃ</p>
              <p className="font-medium">{amanha.titulo}</p>
            </section>
          )}

          <OQueOAppOferece />
        </>
      )}

      {!dia && amanha && (
        <Link
          href={`/roteiro/${amanha.data}`}
          className="block rounded-2xl bg-paper-raised border border-line p-4 text-center"
        >
          Ver primeiro dia do roteiro ({amanha.titulo})
        </Link>
      )}
    </div>
  );
}

function ProximoResumo({ dia }: { dia: NonNullable<ReturnType<typeof useHoje>["dia"]> }) {
  const eventos = computarEventosDoDia(dia);
  const proximo = eventos.find((e) => e.statusComputado === "proximo" || e.statusComputado === "agora");
  if (!proximo) return null;
  return (
    <div className="mt-3 pt-3 border-t border-line">
      <p className="text-xs text-ink-soft">PRÓXIMO</p>
      <p className="font-medium mt-0.5">
        {CATEGORIA_EMOJI[proximo.categoria]} {proximo.titulo}
      </p>
      {proximo.horarioInicial && (
        <p className="font-ticket text-sm text-brass mt-0.5">{proximo.horarioInicial}</p>
      )}
      {proximo.horarioRecomendadoSaida && (
        <div className="mt-2">
          <Semaforo pais={dia.pais} horarioRecomendadoSaida={proximo.horarioRecomendadoSaida} data={dia.data} />
        </div>
      )}
    </div>
  );
}

function OndeDormimos({ data }: { data: string }) {
  const hotel = hotels.find((h) => data >= h.checkin && data < h.checkout);
  if (!hotel) return null;
  return (
    <section className="rounded-2xl bg-paper-raised border border-line p-4">
      <p className="text-xs font-medium text-ink-soft mb-1">🛏️ ONDE DORMIMOS HOJE</p>
      <p className="font-medium">{hotel.nome}</p>
      <p className="text-sm text-ink-soft flex items-center gap-1 mt-0.5">
        <MapPin size={13} /> {hotel.cidade}
      </p>
    </section>
  );
}
