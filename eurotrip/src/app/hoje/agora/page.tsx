"use client";

import Link from "next/link";
import { useHoje } from "@/lib/useHoje";
import { computarEventosDoDia, formatarHoraLocal, formatarDataLocal, minutosAte } from "@/lib/time";
import { CATEGORIA_EMOJI } from "@/lib/categorias";
import RelogioDuplo from "@/components/RelogioDuplo";
import Semaforo from "@/components/Semaforo";
import { ArrowLeft, MapPin, Copy, Navigation } from "lucide-react";

export default function AgoraPage() {
  const { dia } = useHoje();

  if (!dia) {
    return (
      <div className="px-4 pt-4">
        <VoltarLink />
        <p className="mt-6 text-center text-ink-soft">Nenhuma atividade hoje.</p>
      </div>
    );
  }

  const eventos = computarEventosDoDia(dia);
  const atual = eventos.find((e) => e.statusComputado === "agora");
  const proximo = eventos.find((e) => e.statusComputado === "proximo");
  const ehTransporte = proximo && ["voo", "trem", "ferry", "transfer"].includes(proximo.categoria);

  return (
    <div className="px-4 pt-4 pb-8 space-y-5">
      <VoltarLink />

      <div className="text-center">
        <p className="font-display text-2xl font-bold">{dia.cidade}</p>
        <p className="text-ink-soft text-sm">{formatarDataLocal(dia.pais)}</p>
        <p className="font-ticket text-lg mt-1">{formatarHoraLocal(dia.pais)}</p>
        <div className="mt-2">
          <RelogioDuplo pais={dia.pais} />
        </div>
      </div>

      {atual && (
        <section className="rounded-2xl bg-ink text-paper p-5">
          <p className="text-xs uppercase tracking-wide opacity-70">Você está no período previsto para</p>
          <p className="font-display text-xl font-bold mt-1">
            {CATEGORIA_EMOJI[atual.categoria]} {atual.titulo}
          </p>
          {atual.endereco && <p className="text-sm opacity-80 mt-1">{atual.endereco}</p>}
        </section>
      )}

      {proximo && (
        <section className="rounded-2xl bg-paper-raised border border-line p-5 space-y-3">
          <p className="text-xs uppercase tracking-wide text-ink-soft">Próximo compromisso</p>
          <p className="font-display text-lg font-semibold">
            {CATEGORIA_EMOJI[proximo.categoria]} {proximo.titulo}
          </p>

          {proximo.horarioInicial && (
            <div className="flex items-center gap-3">
              <span className="font-ticket text-2xl bg-ink text-paper rounded-lg px-3 py-1">
                {proximo.horarioInicial}
              </span>
              <Contador pais={dia.pais} hora={proximo.horarioInicial} data={dia.data} />
            </div>
          )}

          {proximo.horarioRecomendadoSaida && (
            <div>
              <p className="text-sm text-ink-soft">Sair até:</p>
              <p className="font-ticket text-lg text-brass">{proximo.horarioRecomendadoSaida}</p>
              <div className="mt-1">
                <Semaforo pais={dia.pais} horarioRecomendadoSaida={proximo.horarioRecomendadoSaida} data={dia.data} />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm border-t border-line pt-3">
            {proximo.origem && (
              <div>
                <p className="text-ink-soft text-xs">Origem</p>
                <p className="font-medium">{proximo.origem}</p>
              </div>
            )}
            {proximo.destino && (
              <div>
                <p className="text-ink-soft text-xs">Destino</p>
                <p className="font-medium">{proximo.destino}</p>
              </div>
            )}
            {proximo.duracaoPrevista && (
              <div>
                <p className="text-ink-soft text-xs">Duração</p>
                <p className="font-medium">{proximo.duracaoPrevista}</p>
              </div>
            )}
            {proximo.empresa && (
              <div>
                <p className="text-ink-soft text-xs">Meio de transporte</p>
                <p className="font-medium">{proximo.empresa} {proximo.numero}</p>
              </div>
            )}
          </div>

          {proximo.endereco && (
            <p className="flex items-start gap-1.5 text-sm">
              <MapPin size={14} className="shrink-0 mt-0.5" /> {proximo.endereco}
            </p>
          )}

          {proximo.observacoes && <p className="text-sm text-ink-soft">{proximo.observacoes}</p>}

          <div className="flex flex-wrap gap-2 pt-1">
            {ehTransporte && (
              <Link
                href="/hoje/deslocamento"
                className="inline-flex items-center gap-1.5 text-sm font-medium bg-alert text-white rounded-full px-4 py-2"
              >
                <Navigation size={14} /> Cartão de deslocamento
              </Link>
            )}
            {(proximo.endereco || proximo.coordenada) && (
              <a
                href={
                  proximo.coordenada
                    ? `https://maps.google.com/?q=${proximo.coordenada.lat},${proximo.coordenada.lng}`
                    : `https://maps.google.com/?q=${encodeURIComponent(proximo.endereco || "")}`
                }
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium bg-ink text-paper rounded-full px-4 py-2"
              >
                <MapPin size={14} /> Mapa
              </a>
            )}
            {proximo.numeroReserva && (
              <button
                onClick={() => navigator.clipboard?.writeText(proximo.numeroReserva || "")}
                className="inline-flex items-center gap-1.5 text-sm font-medium bg-brass-soft text-ink rounded-full px-4 py-2"
              >
                <Copy size={14} /> Reserva
              </button>
            )}
          </div>
        </section>
      )}

      {!atual && !proximo && (
        <p className="text-center text-ink-soft">Nenhum evento com horário definido agora — confira o roteiro completo do dia.</p>
      )}
    </div>
  );
}

function VoltarLink() {
  return (
    <Link href="/hoje" className="inline-flex items-center gap-1 text-sm text-ink-soft">
      <ArrowLeft size={16} /> Voltar
    </Link>
  );
}

function Contador({ pais, hora, data }: { pais: Parameters<typeof minutosAte>[0]; hora: string; data: string }) {
  const min = minutosAte(pais, hora, data);
  if (min < 0) return <span className="text-sm text-ink-soft">em andamento</span>;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return (
    <span className="text-sm text-ink-soft">
      Faltam {h > 0 ? `${h}h ` : ""}
      {m}min
    </span>
  );
}
