"use client";

import { useEffect, useState } from "react";
import VoltarMais from "@/components/VoltarMais";
import { db } from "@/lib/db";
import { AlertTriangle } from "lucide-react";

const REGRAS = [
  { empresa: "Air France (AF443, Rio → Paris)", regra: "1 mala despachada por adulto (confirmado no voucher Decolar)." },
  { empresa: "Air France (AF1404, Paris → Roma)", regra: "⚠️ A CONFIRMAR — franquia não detalhada nos e-mails recebidos." },
  { empresa: "EasyJet (Veneza → Paris)", regra: "⚠️ A CONFIRMAR — franquia não detalhada nos e-mails recebidos." },
  {
    empresa: "Vueling/Iberia IB5225 (Paris → Barcelona)",
    regra: "1 mala despachada por passageiro (confirmado por e-mail).",
  },
  {
    empresa: "Vueling/Iberia IB5634 (Barcelona → Lisboa)",
    regra: "Item pessoal 40×30×15cm, mala de cabine até 10kg/56×40×25cm, mala despachada 1 peça até 23kg/158cm (confirmado por e-mail).",
  },
  { empresa: "Azul (Lisboa → Rio)", regra: "⚠️ A CONFIRMAR — franquia não detalhada nos e-mails recebidos." },
  { empresa: "Trens (Frecciarossa, Italo, Campania Express, CP)", regra: "Sem franquia formal — cada passageiro leva o que conseguir carregar até o assento." },
  { empresa: "Ferries (Alilauro, Seremar)", regra: "⚠️ A CONFIRMAR." },
  {
    empresa: "Transfer Enjoy Travelling (10/10, Sorrento → Nápoles)",
    regra: "🧳 ATENÇÃO — existe uma 3ª mala no grupo e pode haver cobrança adicional por ela.",
    alerta: true,
  },
];

export default function BagagemPage() {
  const [notas, setNotas] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!db) return;
    db.configuracoes.toArray().then((rows) => {
      const mapa: Record<string, string> = {};
      rows.forEach((r) => {
        if (r.chave.startsWith("bagagem:")) mapa[r.chave] = r.valor;
      });
      setNotas(mapa);
    });
  }, []);

  async function salvar(chave: string, valor: string) {
    setNotas((n) => ({ ...n, [chave]: valor }));
    if (db) await db.configuracoes.put({ chave, valor });
  }

  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      <VoltarMais />
      <h1 className="font-display text-xl font-bold">🧳 Bagagem</h1>

      {REGRAS.map((r) => {
        const chave = `bagagem:${r.empresa}`;
        return (
          <div
            key={r.empresa}
            className={`rounded-2xl border p-4 space-y-2 ${r.alerta ? "bg-alert/5 border-alert/30" : "bg-paper-raised border-line"}`}
          >
            <p className="font-medium text-sm">{r.empresa}</p>
            <p className={`text-sm flex items-start gap-1.5 ${r.alerta ? "text-alert" : "text-ink-soft"}`}>
              {r.alerta && <AlertTriangle size={14} className="shrink-0 mt-0.5" />}
              {r.regra}
            </p>
            <textarea
              placeholder="Adicionar nota própria..."
              value={notas[chave] || ""}
              onChange={(e) => salvar(chave, e.target.value)}
              rows={2}
              className="w-full text-sm rounded-lg border border-line bg-paper px-3 py-2"
            />
          </div>
        );
      })}
    </div>
  );
}
