import VoltarMais from "@/components/VoltarMais";
import { ExternalLink, MapPinned } from "lucide-react";

export default function MeuMapaPage() {
  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      <VoltarMais />
      <h1 className="font-display text-xl font-bold">🗺️ Meu Mapa — roteiro completo</h1>
      <p className="text-xs text-ink-soft">
        Todos os pontos do roteiro (109 lugares) organizados por dia, em camadas que dá pra ligar/desligar. Abre
        melhor pelo app Google Maps → Os seus lugares → Mapas.
      </p>

      <a
        href="https://www.google.com/maps/d/u/0/edit?mid=15zm3AVKFqVX2VCFCm-UY8gy2AkD-_MM&usp=sharing"
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-between rounded-2xl bg-paper-raised border border-line p-4"
      >
        <span className="flex items-center gap-2 font-medium">
          <MapPinned size={18} className="text-brass" /> Parte 1 — 04/10 a 14/10
        </span>
        <ExternalLink size={16} className="text-ink-soft" />
      </a>

      <a
        href="https://www.google.com/maps/d/u/0/edit?mid=1KjgrHhjxyAe3An55R2iyuWKmiLDU5gg&usp=sharing"
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-between rounded-2xl bg-paper-raised border border-line p-4"
      >
        <span className="flex items-center gap-2 font-medium">
          <MapPinned size={18} className="text-brass" /> Parte 2 — 15/10 a 17/10
        </span>
        <ExternalLink size={16} className="text-ink-soft" />
      </a>

      <p className="text-xs text-ink-soft pt-2">
        ⚠️ Precisa de internet pra carregar — não substitui os links de rota individuais que já estão em cada dia do
        roteiro, que continuam funcionando como plano B sem sinal.
      </p>
    </div>
  );
}
