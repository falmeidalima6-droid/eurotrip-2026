"use client";

import dynamic from "next/dynamic";
import { useHoje } from "@/lib/useHoje";
import { useOnlineStatus } from "@/lib/useOnlineStatus";
import { pontosMapaPorCidade, PontoMapa } from "@/data/pontosMapa";
import MapaEsquematico from "@/components/MapaEsquematico";
import { MapPin, ExternalLink } from "lucide-react";

const MapaDoDia = dynamic(() => import("@/components/MapaDoDia"), { ssr: false });

export default function MapaPage() {
  const { dia } = useHoje();
  const online = useOnlineStatus();

  if (!dia) {
    return (
      <div className="px-4 pt-4">
        <h1 className="font-display text-xl font-bold mb-2">🗺️ Mapa do dia</h1>
        <p className="text-ink-soft">Nenhum dia de viagem ativo hoje.</p>
      </div>
    );
  }

  const pontosComCoordenada = dia.eventos.filter((e) => e.coordenada);
  const pontosSemCoordenada = dia.eventos.filter((e) => !e.coordenada && (e.endereco || e.destino));

  // Mapa esquemático: junta os pontos conhecidos de todas as cidades que aparecem no dia, na ordem em que surgem.
  const cidadesDoDia = Array.from(new Set(dia.eventos.map((e) => e.cidade)));
  const pontosEsquematicos: PontoMapa[] = [];
  const idsVistos = new Set<string>();
  for (const cidade of cidadesDoDia) {
    const pontos = pontosMapaPorCidade[cidade];
    if (!pontos) continue;
    for (const p of pontos) {
      const chave = `${cidade}-${p.id}`;
      if (!idsVistos.has(chave)) {
        idsVistos.add(chave);
        pontosEsquematicos.push(p);
      }
    }
  }

  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      <h1 className="font-display text-xl font-bold">🗺️ Mapa do dia</h1>
      <p className="text-sm text-ink-soft">{dia.titulo}</p>

      {pontosEsquematicos.length > 0 && (
        <MapaEsquematico pontos={pontosEsquematicos} cidade={cidadesDoDia.join(" / ")} />
      )}

      {online && pontosComCoordenada.length > 0 ? (
        <MapaDoDia eventos={dia.eventos} />
      ) : (
        <div className="rounded-2xl bg-brass/10 border border-brass/30 p-3 text-sm text-ink-soft">
          {online
            ? "Nenhum ponto com coordenadas cadastradas para hoje ainda."
            : "🟠 Offline — o mapa esquemático acima e a lista abaixo continuam disponíveis. O mapa interativo (OpenStreetMap) volta quando tiver internet."}
        </div>
      )}

      <div className="space-y-2">
        {[...pontosComCoordenada, ...pontosSemCoordenada].map((ev) => (
          <div key={ev.id} className="rounded-2xl bg-paper-raised border border-line p-3 flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-sm">{ev.titulo}</p>
              {ev.horarioInicial && <p className="font-ticket text-xs text-brass">{ev.horarioInicial}</p>}
              {ev.endereco && <p className="text-xs text-ink-soft mt-0.5">{ev.endereco}</p>}
              {ev.duracaoPrevista && <p className="text-xs text-ink-soft">Duração: {ev.duracaoPrevista}</p>}
              {ev.empresa && <p className="text-xs text-ink-soft">{ev.empresa}</p>}
            </div>
            <a
              href={
                ev.coordenada
                  ? `https://maps.google.com/?q=${ev.coordenada.lat},${ev.coordenada.lng}`
                  : `https://maps.google.com/?q=${encodeURIComponent(ev.endereco || ev.destino || "")}`
              }
              target="_blank"
              rel="noreferrer"
              className="shrink-0 inline-flex items-center gap-1 text-xs font-medium bg-ink text-paper rounded-full px-3 py-1.5"
            >
              <MapPin size={12} /> Maps
            </a>
          </div>
        ))}
        {pontosComCoordenada.length === 0 && pontosSemCoordenada.length === 0 && (
          <p className="text-center text-ink-soft py-6 text-sm">Nenhum local com endereço cadastrado para hoje.</p>
        )}
      </div>

      <a
        href="https://www.google.com/maps"
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-1.5 text-sm font-medium text-ink-soft py-2"
      >
        <ExternalLink size={14} /> Abrir Google Maps
      </a>
    </div>
  );
}
