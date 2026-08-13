"use client";

import { PontoMapa } from "@/data/pontosMapa";

const EMOJI: Record<PontoMapa["tipo"], string> = {
  hotel: "🏨",
  estacao: "🚉",
  aeroporto: "✈️",
  porto: "⛴️",
  atracao: "📍",
};

const COR: Record<PontoMapa["tipo"], string> = {
  hotel: "#B23A2E",
  estacao: "#16213E",
  aeroporto: "#16213E",
  porto: "#16213E",
  atracao: "#C89B3C",
};

export default function MapaEsquematico({ pontos, cidade }: { pontos: PontoMapa[]; cidade: string }) {
  if (pontos.length === 0) return null;

  const PAD = 60;
  const W = 340;
  const H = 340;

  const lats = pontos.map((p) => p.lat);
  const lngs = pontos.map((p) => p.lng);
  const latMin = Math.min(...lats);
  const latMax = Math.max(...lats);
  const lngMin = Math.min(...lngs);
  const lngMax = Math.max(...lngs);

  // Evita divisão por zero quando só há 1 ponto ou pontos quase idênticos
  const latSpan = Math.max(latMax - latMin, 0.001);
  const lngSpan = Math.max(lngMax - lngMin, 0.001);

  function projetar(lat: number, lng: number): [number, number] {
    // Longitude cresce para leste (x), latitude cresce para norte, mas em SVG y cresce para baixo — inverte.
    const x = PAD + ((lng - lngMin) / lngSpan) * (W - 2 * PAD);
    const y = PAD + (1 - (lat - latMin) / latSpan) * (H - 2 * PAD);
    return [x, y];
  }

  return (
    <div className="rounded-2xl border border-line bg-paper-raised p-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        <rect x={0} y={0} width={W} height={H} fill="#F6F3EC" rx={16} />
        {/* Linha conectando os pontos na ordem em que aparecem */}
        <polyline
          points={pontos.map((p) => projetar(p.lat, p.lng).join(",")).join(" ")}
          fill="none"
          stroke="#DDD6C4"
          strokeWidth={2}
          strokeDasharray="5 5"
        />
        {pontos.map((p) => {
          const [x, y] = projetar(p.lat, p.lng);
          return (
            <g key={p.id}>
              <circle cx={x} cy={y} r={5} fill={COR[p.tipo]} stroke="white" strokeWidth={1.5} />
              <text x={x} y={y - 10} textAnchor="middle" fontSize={9} fill="#16213E" fontWeight={600}>
                {EMOJI[p.tipo]} {p.nome}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="text-center text-xs text-ink-soft pt-1">
        Mapa esquemático de {cidade} — posições relativas reais, sem depender de internet.
      </p>
    </div>
  );
}
