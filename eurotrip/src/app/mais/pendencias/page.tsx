"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import VoltarMais from "@/components/VoltarMais";
import { ingressos as ingressosBase } from "@/data/ingressos";
import { checklistDefs } from "@/data/checklistDefs";
import { db } from "@/lib/db";
import { enviarSync } from "@/lib/supabaseSync";
import { Check } from "lucide-react";

const URGENCIA_INFO = {
  vermelho: { emoji: "🔴", label: "Comprar assim que abrir", cor: "border-alert/40 bg-alert/5" },
  laranja: { emoji: "🟠", label: "Comprar antecipadamente", cor: "border-warn/40 bg-warn/5" },
  verde: { emoji: "🟢", label: "Pode decidir perto da viagem", cor: "border-success/40 bg-success/5" },
};

// Categorias de checklist que fazem sentido resolver ANTES da viagem
// (a categoria "Diário"/antes-de-sair-do-hotel não entra aqui, é do dia a dia).
const CATEGORIAS_PRE_VIAGEM = checklistDefs.filter((g) => g.categoria === "Documentos" || g.categoria === "Bagagem");

export default function PendenciasPage() {
  const [comprados, setComprados] = useState<Record<string, boolean>>({});
  const [emergenciaVazia, setEmergenciaVazia] = useState(true);
  const [checklistMarcado, setChecklistMarcado] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!db) return;
    db.ingressoOverrides.toArray().then((rows) => {
      const mapa: Record<string, boolean> = {};
      rows.forEach((r) => (mapa[r.ingressoId] = r.comprado));
      setComprados(mapa);
    });
    db.configuracoes.get("emergencia:contato1").then((r) => setEmergenciaVazia(!r?.valor));
    db.checklist.toArray().then((rows) => {
      const mapa: Record<string, boolean> = {};
      rows.forEach((r) => (mapa[r.id] = r.marcado));
      setChecklistMarcado(mapa);
    });
  }, []);

  async function alternar(id: string) {
    const novo = !comprados[id];
    setComprados((c) => ({ ...c, [id]: novo }));
    if (db) await db.ingressoOverrides.put({ ingressoId: id, comprado: novo });
    enviarSync(`ingresso:${id}`, "ingresso", { comprado: novo });
  }

  async function alternarChecklist(categoria: string, item: string) {
    const id = `${categoria}:${item}`;
    const novo = !checklistMarcado[id];
    setChecklistMarcado((m) => ({ ...m, [id]: novo }));
    if (db) await db.checklist.put({ id, categoria, texto: item, marcado: novo });
  }

  const pendentes = ingressosBase.filter((i) => !comprados[i.id]);
  const ordenados = [...pendentes].sort((a, b) => {
    const ordem = { vermelho: 0, laranja: 1, verde: 2 };
    return ordem[a.urgencia] - ordem[b.urgencia];
  });

  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      <VoltarMais />
      <h1 className="font-display text-xl font-bold">📋 Painel de pendências</h1>
      <p className="text-sm text-ink-soft">Tudo que ainda depende de uma ação de vocês, num só lugar.</p>

      <section className="space-y-2">
        <p className="text-xs font-medium text-ink-soft uppercase">Ingressos ({ordenados.length} pendentes)</p>
        {ordenados.map((i) => {
          const info = URGENCIA_INFO[i.urgencia];
          return (
            <div key={i.id} className={`rounded-2xl border p-4 ${info.cor}`}>
              <button onClick={() => alternar(i.id)} className="w-full flex items-start gap-3 text-left">
                <span
                  className={`flex items-center justify-center w-5 h-5 rounded border shrink-0 mt-0.5 ${
                    comprados[i.id] ? "bg-success border-success text-white" : "border-line bg-white"
                  }`}
                >
                  {comprados[i.id] && <Check size={13} />}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    {info.emoji} {i.nome} <span className="text-ink-soft font-normal">— {i.cidade}</span>
                  </p>
                  <p className="text-xs text-ink-soft mt-0.5">{info.label}</p>
                  {i.dataNecessaria && (
                    <p className="text-xs text-ink-soft">Antes de: {i.dataNecessaria.split("-").reverse().join("/")}</p>
                  )}
                  {i.observacoes && <p className="text-xs text-ink-soft mt-1">{i.observacoes}</p>}
                </div>
              </button>
            </div>
          );
        })}
        {ordenados.length === 0 && <p className="text-sm text-success">✅ Todos os ingressos foram marcados como comprados.</p>}
      </section>

      <section className="space-y-2">
        <p className="text-xs font-medium text-ink-soft uppercase">Checklist antes da viagem</p>
        {CATEGORIAS_PRE_VIAGEM.map((grupo) => {
          const faltando = grupo.itens.filter((item) => !checklistMarcado[`${grupo.categoria}:${item}`]);
          if (faltando.length === 0) return null;
          return (
            <div key={grupo.categoria} className="rounded-2xl border border-line bg-paper-raised p-4">
              <p className="font-medium text-sm mb-2">{grupo.categoria}</p>
              <ul className="space-y-1.5">
                {faltando.map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => alternarChecklist(grupo.categoria, item)}
                      className="flex items-center gap-2.5 w-full text-left"
                    >
                      <span className="flex items-center justify-center w-5 h-5 rounded border border-line shrink-0" />
                      <span className="text-sm">{item}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        {CATEGORIAS_PRE_VIAGEM.every((g) => g.itens.every((item) => checklistMarcado[`${g.categoria}:${item}`])) && (
          <p className="text-sm text-success">✅ Checklist de documentos e bagagem completo.</p>
        )}
        <Link href="/mais/checklist" className="text-xs text-ink-soft underline">
          Ver checklist completo (inclui o do dia a dia)
        </Link>
      </section>

      {emergenciaVazia && (
        <section className="rounded-2xl bg-alert/5 border border-alert/30 p-4">
          <p className="font-medium text-sm text-alert">Contatos de emergência ainda não preenchidos</p>
          <p className="text-xs text-ink-soft mt-1">Vá em Mais → Emergência para completar.</p>
        </section>
      )}
    </div>
  );
}
