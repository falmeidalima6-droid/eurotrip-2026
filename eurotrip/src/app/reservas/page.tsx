"use client";

import { useState } from "react";
import Link from "next/link";
import { hotels } from "@/data/hotels";
import { transportes } from "@/data/transportes";
import AnexosDocumento from "@/components/AnexosDocumento";
import { Phone, MapPin, Copy, AlertTriangle, Car } from "lucide-react";

const TIPO_EMOJI: Record<string, string> = { voo: "✈️", trem: "🚄", ferry: "⛴️", transfer: "🚐" };

export default function ReservasPage() {
  const [aba, setAba] = useState<"hoteis" | "transportes">("hoteis");

  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      <h1 className="font-display text-xl font-bold">Reservas</h1>

      <div className="flex rounded-full bg-paper-raised border border-line p-1">
        <button
          onClick={() => setAba("hoteis")}
          className={`flex-1 rounded-full py-2 text-sm font-medium ${aba === "hoteis" ? "bg-ink text-paper" : "text-ink-soft"}`}
        >
          🏨 Hotéis
        </button>
        <button
          onClick={() => setAba("transportes")}
          className={`flex-1 rounded-full py-2 text-sm font-medium ${aba === "transportes" ? "bg-ink text-paper" : "text-ink-soft"}`}
        >
          ✈️🚆⛴️ Transportes
        </button>
      </div>

      {aba === "hoteis" && (
        <div className="space-y-3">
          {hotels.map((h) => (
            <div key={h.id} className="rounded-2xl bg-paper-raised border border-line p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-ticket text-xs text-brass uppercase">{h.cidade}</p>
                <p className="text-xs text-ink-soft">
                  {h.checkin.split("-").reverse().slice(0, 2).join("/")}–{h.checkout.split("-").reverse().slice(0, 2).join("/")}
                </p>
              </div>
              <p className="font-display font-semibold text-lg">{h.nome}</p>
              <p className="text-sm text-ink-soft flex items-start gap-1.5">
                <MapPin size={14} className="shrink-0 mt-0.5" /> {h.endereco}
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm border-t border-line pt-2">
                <div>
                  <p className="text-ink-soft text-xs">Check-in</p>
                  <p className="font-ticket">{h.horarioCheckin}</p>
                </div>
                <div>
                  <p className="text-ink-soft text-xs">Checkout</p>
                  <p className="font-ticket">{h.horarioCheckout}</p>
                </div>
              </div>
              {h.numeroReserva && (
                <p className="text-sm">
                  <span className="text-ink-soft">Reserva: </span>
                  {h.numeroReserva}
                </p>
              )}
              {h.taxaTuristica && <p className="text-sm text-ink-soft">💶 Taxa turística: {h.taxaTuristica}</p>}
              {h.observacoes && (
                <p className="text-sm text-ink-soft flex items-start gap-1.5">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" /> {h.observacoes}
                </p>
              )}
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(h.endereco)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium bg-ink text-paper rounded-full px-3 py-1.5"
                >
                  <MapPin size={12} /> Mapa
                </a>
                <button
                  onClick={() => navigator.clipboard?.writeText(h.endereco)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium bg-brass-soft text-ink rounded-full px-3 py-1.5"
                >
                  <Copy size={12} /> Copiar endereço
                </button>
                <Link
                  href={`/reservas/motorista/${h.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium bg-ink text-paper rounded-full px-3 py-1.5"
                >
                  <Car size={12} /> Mostrar ao motorista
                </Link>
                {h.telefone && (
                  <a
                    href={`tel:${h.telefone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium bg-brass-soft text-ink rounded-full px-3 py-1.5"
                  >
                    <Phone size={12} /> {h.telefone}
                  </a>
                )}
              </div>
              <AnexosDocumento referenciaId={h.id} />
            </div>
          ))}
        </div>
      )}

      {aba === "transportes" && (
        <div className="space-y-3">
          {(["voo", "trem", "ferry", "transfer"] as const).map((tipo) => {
            const lista = transportes.filter((t) => t.tipo === tipo);
            if (lista.length === 0) return null;
            return (
              <div key={tipo}>
                <p className="text-xs font-medium text-ink-soft uppercase mt-3 mb-1.5">
                  {TIPO_EMOJI[tipo]} {tipo}s
                </p>
                <div className="space-y-2">
                  {lista.map((t) => (
                    <div key={t.id} className="rounded-2xl bg-paper-raised border border-line p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{t.origem} → {t.destino}</p>
                        <p className="font-ticket text-xs text-brass">
                          {t.data.split("-").reverse().slice(0, 2).join("/")}
                        </p>
                      </div>
                      <p className="text-sm text-ink-soft">
                        {t.empresa} {t.numero ? `· ${t.numero}` : ""}
                      </p>
                      <p className="font-ticket text-sm">
                        {t.horarioPartida} → {t.horarioChegada} {t.duracao ? `(${t.duracao})` : ""}
                      </p>
                      {(t.terminal || t.estacao || t.plataforma) && (
                        <p className="text-xs text-ink-soft">
                          {[t.terminal && `Terminal ${t.terminal}`, t.estacao, t.plataforma && `Plataforma ${t.plataforma}`]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      )}
                      {t.bagagem && <p className="text-xs text-ink-soft">🧳 {t.bagagem}</p>}
                      {t.reserva && <p className="text-xs text-ink-soft">Reserva: {t.reserva}</p>}
                      {t.antecedenciaRecomendada && (
                        <p className="text-xs text-brass">⏱ Antecedência recomendada: {t.antecedenciaRecomendada}</p>
                      )}
                      {t.alerta && (
                        <p className="flex items-start gap-1.5 text-xs text-alert bg-alert/10 rounded-lg p-2 mt-1">
                          <AlertTriangle size={13} className="shrink-0 mt-0.5" /> {t.alerta}
                        </p>
                      )}
                      {t.observacoes && <p className="text-xs text-ink-soft">{t.observacoes}</p>}
                      <AnexosDocumento referenciaId={t.id} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
