"use client";

import { useEffect, useState } from "react";
import VoltarMais from "@/components/VoltarMais";
import { db, Anotacao } from "@/lib/db";
import { useHoje } from "@/lib/useHoje";
import { Trash2, Plus } from "lucide-react";

const TIPOS: { valor: Anotacao["tipo"]; label: string }[] = [
  { valor: "observacao", label: "📝 Anotação" },
  { valor: "lugar", label: "❤️ Lugar favorito" },
  { valor: "lembrete", label: "⏰ Lembrete" },
  { valor: "alteracao", label: "🔄 Alteração de horário" },
];

export default function DiarioPage() {
  const { dia } = useHoje();
  const [entradas, setEntradas] = useState<Anotacao[]>([]);
  const [texto, setTexto] = useState("");
  const [tipo, setTipo] = useState<Anotacao["tipo"]>("observacao");

  useEffect(() => {
    if (!db) return;
    db.anotacoes.orderBy("data").reverse().toArray().then(setEntradas);
  }, []);

  async function adicionar() {
    if (!db || !texto.trim()) return;
    const nova: Anotacao = { data: new Date().toISOString(), tipo, texto: texto.trim() };
    const id = await db.anotacoes.add(nova);
    setEntradas((e) => [{ ...nova, id }, ...e]);
    setTexto("");
  }

  async function remover(id?: number) {
    if (!db || id === undefined) return;
    await db.anotacoes.delete(id);
    setEntradas((e) => e.filter((x) => x.id !== id));
  }

  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      <VoltarMais />
      <h1 className="font-display text-xl font-bold">📔 Diário da viagem</h1>
      {dia && <p className="text-sm text-ink-soft">Hoje: {dia.cidade}</p>}

      <div className="rounded-2xl bg-paper-raised border border-line p-4 space-y-2">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TIPOS.map((t) => (
            <button
              key={t.valor}
              onClick={() => setTipo(t.valor)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
                tipo === t.valor ? "bg-ink text-paper" : "bg-paper border border-line"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={3}
          placeholder="Escreva aqui..."
          className="w-full rounded-lg border border-line px-3 py-2 text-sm"
        />
        <button
          onClick={adicionar}
          className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-ink text-paper py-2 text-sm font-medium"
        >
          <Plus size={14} /> Adicionar
        </button>
      </div>

      <div className="space-y-2">
        {entradas.map((e) => (
          <div key={e.id} className="rounded-xl bg-paper-raised border border-line p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-ink-soft">
                  {TIPOS.find((t) => t.valor === e.tipo)?.label} · {new Date(e.data).toLocaleString("pt-BR")}
                </p>
                <p className="text-sm mt-1">{e.texto}</p>
              </div>
              <button onClick={() => remover(e.id)}>
                <Trash2 size={15} className="text-ink-soft shrink-0" />
              </button>
            </div>
          </div>
        ))}
        {entradas.length === 0 && <p className="text-center text-ink-soft py-6 text-sm">Nenhuma entrada ainda.</p>}
      </div>
    </div>
  );
}
