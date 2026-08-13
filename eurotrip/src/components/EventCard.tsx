"use client";

import { EventoComputado } from "@/lib/time";
import { CATEGORIA_EMOJI, STATUS_LABEL, STATUS_COLOR } from "@/lib/categorias";
import { AlertTriangle, MapPin, FileText, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function EventCard({ evento }: { evento: EventoComputado }) {
  const [expandido, setExpandido] = useState(evento.statusComputado === "agora" || evento.statusComputado === "proximo");
  const destaque = evento.statusComputado === "agora";
  const proximo = evento.statusComputado === "proximo";

  return (
    <div
      className={`rounded-2xl border p-4 transition-colors ${
        destaque
          ? "border-alert bg-alert/5"
          : proximo
          ? "border-brass bg-brass/5"
          : "border-line bg-paper-raised"
      }`}
    >
      <button
        onClick={() => setExpandido((v) => !v)}
        className="w-full flex items-start gap-3 text-left"
      >
        <span className="text-xl leading-none mt-0.5">{CATEGORIA_EMOJI[evento.categoria]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {evento.horarioInicial && (
              <span className="font-ticket text-sm bg-ink text-paper rounded px-1.5 py-0.5">
                {evento.horarioInicial}
              </span>
            )}
            <span className={`text-xs font-medium ${STATUS_COLOR[evento.statusComputado]}`}>
              {STATUS_LABEL[evento.statusComputado]}
            </span>
          </div>
          <p className={`font-medium mt-1 ${evento.statusComputado === "concluido" || evento.statusComputado === "pulado" ? "line-through text-ink-soft" : ""}`}>
            {evento.titulo}
          </p>
        </div>
        <ChevronDown size={18} className={`mt-1 shrink-0 text-ink-soft transition-transform ${expandido ? "rotate-180" : ""}`} />
      </button>

      {evento.alerta && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-alert/10 text-alert text-sm p-2">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <span>{evento.alerta}</span>
        </div>
      )}

      {expandido && (
        <div className="mt-3 space-y-2 text-sm text-ink-soft border-t border-line pt-3">
          {evento.horarioRecomendadoSaida && (
            <p>
              <strong className="text-ink">Sair até:</strong> {evento.horarioRecomendadoSaida}
            </p>
          )}
          {evento.empresa && (
            <p>
              <strong className="text-ink">Empresa:</strong> {evento.empresa}
              {evento.numero ? ` · ${evento.numero}` : ""}
            </p>
          )}
          {(evento.origem || evento.destino) && (
            <p>
              <strong className="text-ink">Trajeto:</strong> {evento.origem} → {evento.destino}
            </p>
          )}
          {evento.duracaoPrevista && (
            <p>
              <strong className="text-ink">Duração:</strong> {evento.duracaoPrevista}
            </p>
          )}
          {evento.endereco && (
            <p className="flex items-start gap-1.5">
              <MapPin size={14} className="shrink-0 mt-0.5" />
              <span>{evento.endereco}</span>
            </p>
          )}
          {evento.numeroReserva && (
            <p>
              <strong className="text-ink">Reserva:</strong> {evento.numeroReserva}
            </p>
          )}
          {evento.bagagem && (
            <p>
              <strong className="text-ink">Bagagem:</strong> {evento.bagagem}
            </p>
          )}
          {evento.levar && evento.levar.length > 0 && (
            <p>
              <strong className="text-ink">Levar:</strong> {evento.levar.join(", ")}
            </p>
          )}
          {evento.observacoes && <p>{evento.observacoes}</p>}
          {evento.dicaMetro && (
            <details className="rounded-lg bg-ink/5 p-2">
              <summary className="cursor-pointer font-medium text-ink text-sm">🚇 Opção: ir de metrô</summary>
              <p className="mt-1.5">{evento.dicaMetro}</p>
            </details>
          )}
          {evento.opcaoAlternativaTitulo && (
            <div className="rounded-lg bg-brass/10 p-2">
              <p className="font-medium text-ink">{evento.opcaoAlternativaTitulo}</p>
              {evento.opcaoAlternativaDescricao && <p>{evento.opcaoAlternativaDescricao}</p>}
            </div>
          )}
          {evento.planoB && (
            <p>
              <strong className="text-ink">Plano B:</strong> {evento.planoB}
            </p>
          )}
          <div className="flex flex-wrap gap-2 pt-1">
            {evento.coordenada && (
              <a
                href={`https://maps.google.com/?q=${evento.coordenada.lat},${evento.coordenada.lng}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium bg-ink text-paper rounded-full px-3 py-1.5"
              >
                <MapPin size={12} /> Abrir no Google Maps
              </a>
            )}
            {evento.endereco && !evento.coordenada && (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(evento.endereco)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium bg-ink text-paper rounded-full px-3 py-1.5"
              >
                <MapPin size={12} /> Abrir no Google Maps
              </a>
            )}
            {evento.numeroReserva && (
              <button
                onClick={() => navigator.clipboard?.writeText(evento.numeroReserva || "")}
                className="inline-flex items-center gap-1 text-xs font-medium bg-brass-soft text-ink rounded-full px-3 py-1.5"
              >
                <FileText size={12} /> Copiar reserva
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
