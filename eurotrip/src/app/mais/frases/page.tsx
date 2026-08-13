"use client";

import { useState } from "react";
import VoltarMais from "@/components/VoltarMais";
import FraseTelaCheia from "@/components/FraseTelaCheia";
import { frases } from "@/data/frases";
import { ExternalLink } from "lucide-react";

const IDIOMAS = [
  { code: "it", label: "🇮🇹 Italiano", googleCode: "it" },
  { code: "fr", label: "🇫🇷 Francês", googleCode: "fr" },
  { code: "es", label: "🇪🇸 Espanhol", googleCode: "es" },
  { code: "en", label: "🇬🇧 Inglês", googleCode: "en" },
] as const;

export default function FrasesPage() {
  const [idioma, setIdioma] = useState<(typeof IDIOMAS)[number]["code"]>("it");
  const [selecionada, setSelecionada] = useState<{ pt: string; traducao: string } | null>(null);
  const categorias = Array.from(new Set(frases.map((f) => f.categoria)));
  const idiomaAtual = IDIOMAS.find((i) => i.code === idioma)!;

  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      <VoltarMais />
      <h1 className="font-display text-xl font-bold">🗣️ Frases úteis</h1>
      <p className="text-xs text-ink-soft">Toque numa frase para ver em tela cheia, pra mostrar pra quem estiver conversando com vocês.</p>

      <div className="rounded-2xl bg-brass/10 border border-brass/30 p-3 text-sm">
        <p className="text-ink-soft mb-2">
          As frases abaixo funcionam 100% offline. Para qualquer outra coisa que surgir na conversa (falada ou escrita, nos
          dois sentidos), use o Modo Conversa do Google Tradutor — precisa de internet:
        </p>
        <a
          href={`https://translate.google.com/?sl=pt&tl=${idiomaAtual.googleCode}&op=translate`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium bg-ink text-paper rounded-full px-4 py-2"
        >
          <ExternalLink size={14} /> Modo Conversa (PT ⇄ {idiomaAtual.label.split(" ")[1]})
        </a>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {IDIOMAS.map((i) => (
          <button
            key={i.code}
            onClick={() => setIdioma(i.code)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${
              idioma === i.code ? "bg-ink text-paper" : "bg-paper-raised border border-line"
            }`}
          >
            {i.label}
          </button>
        ))}
      </div>

      {categorias.map((cat) => (
        <div key={cat} className="rounded-2xl bg-paper-raised border border-line p-4">
          <p className="text-xs font-medium text-ink-soft uppercase mb-2">{cat}</p>
          <div className="space-y-2">
            {frases
              .filter((f) => f.categoria === cat && f.idioma === idioma)
              .map((f) => (
                <button
                  key={f.pt}
                  onClick={() => setSelecionada({ pt: f.pt, traducao: f.traducao })}
                  className="ticket-perforation last:after:hidden w-full text-left"
                >
                  <p className="text-sm text-ink-soft">{f.pt}</p>
                  <p className="font-medium">{f.traducao}</p>
                </button>
              ))}
          </div>
        </div>
      ))}

      {selecionada && (
        <FraseTelaCheia pt={selecionada.pt} traducao={selecionada.traducao} onFechar={() => setSelecionada(null)} />
      )}
    </div>
  );
}
