"use client";

import { semaforoSaida } from "@/lib/time";
import { TripEvent } from "@/data/types";

const CORES = {
  verde: { bg: "bg-success/10", text: "text-success", label: "🟢 No horário" },
  amarelo: { bg: "bg-warn/10", text: "text-warn", label: "🟡 Hora de ir se preparando" },
  vermelho: { bg: "bg-alert/10", text: "text-alert", label: "🔴 Já passou da hora de sair" },
};

export default function Semaforo({
  pais,
  horarioRecomendadoSaida,
  data,
}: {
  pais: TripEvent["pais"];
  horarioRecomendadoSaida?: string;
  data?: string;
}) {
  const cor = semaforoSaida(pais, horarioRecomendadoSaida, data);
  if (!cor) return null;
  const c = CORES[cor];
  return (
    <div className={`rounded-full px-3 py-1.5 text-sm font-medium ${c.bg} ${c.text} inline-block`}>
      {c.label}
    </div>
  );
}
