"use client";

import { useEffect, useState } from "react";
import VoltarMais from "@/components/VoltarMais";
import { checklistDefs, checklistDiario } from "@/data/checklistDefs";
import { db, ItemPersonalizado } from "@/lib/db";
import { Check, Plus, X } from "lucide-react";

export default function ChecklistPage() {
  const [marcados, setMarcados] = useState<Record<string, boolean>>({});
  const [extras, setExtras] = useState<ItemPersonalizado[]>([]);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    if (!db) return;
    Promise.all([db.checklist.toArray(), db.itensPersonalizados.toArray()]).then(([todos, itens]) => {
      const mapa: Record<string, boolean> = {};
      todos.forEach((t) => (mapa[t.id] = t.marcado));
      setMarcados(mapa);
      setExtras(itens);
      setPronto(true);
    });
  }, []);

  async function toggle(categoria: string, item: string) {
    const id = `${categoria}:${item}`;
    const novo = !marcados[id];
    setMarcados((m) => ({ ...m, [id]: novo }));
    if (db) await db.checklist.put({ id, categoria, texto: item, marcado: novo });
  }

  async function adicionarItem(categoria: string, texto: string) {
    if (!db || !texto.trim()) return;
    const novoId = await db.itensPersonalizados.add({ categoria, texto: texto.trim() });
    setExtras((e) => [...e, { id: novoId, categoria, texto: texto.trim() }]);
  }

  async function removerItem(item: ItemPersonalizado) {
    if (!db || item.id === undefined) return;
    await db.itensPersonalizados.delete(item.id);
    await db.checklist.delete(`${item.categoria}:${item.texto}`);
    setExtras((e) => e.filter((i) => i.id !== item.id));
  }

  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      <VoltarMais />
      <h1 className="font-display text-xl font-bold">✅ Checklist</h1>
      <p className="text-xs text-ink-soft">
        Pode adicionar itens seus em qualquer lista — antes de viajar ou durante a viagem. Fica salvo no celular.
      </p>

      <Grupo
        titulo="Antes de sair do hotel (diário)"
        categoria="Diário"
        itens={checklistDiario}
        extras={extras.filter((e) => e.categoria === "Diário")}
        marcados={marcados}
        onToggle={toggle}
        onAdicionar={adicionarItem}
        onRemover={removerItem}
        pronto={pronto}
      />

      {checklistDefs.map((g) => (
        <Grupo
          key={g.categoria}
          titulo={g.categoria}
          categoria={g.categoria}
          itens={g.itens}
          extras={extras.filter((e) => e.categoria === g.categoria)}
          marcados={marcados}
          onToggle={toggle}
          onAdicionar={adicionarItem}
          onRemover={removerItem}
          pronto={pronto}
        />
      ))}
    </div>
  );
}

function Grupo({
  titulo,
  categoria,
  itens,
  extras,
  marcados,
  onToggle,
  onAdicionar,
  onRemover,
  pronto,
}: {
  titulo: string;
  categoria: string;
  itens: string[];
  extras: ItemPersonalizado[];
  marcados: Record<string, boolean>;
  onToggle: (categoria: string, item: string) => void;
  onAdicionar: (categoria: string, texto: string) => void;
  onRemover: (item: ItemPersonalizado) => void;
  pronto: boolean;
}) {
  const [novoTexto, setNovoTexto] = useState("");

  return (
    <div className="rounded-2xl bg-paper-raised border border-line p-4">
      <p className="font-medium mb-2 uppercase text-xs text-ink-soft tracking-wide">{titulo}</p>
      <ul className="space-y-1.5">
        {itens.map((item) => {
          const id = `${categoria}:${item}`;
          const marcado = pronto && marcados[id];
          return (
            <li key={id}>
              <button onClick={() => onToggle(categoria, item)} className="flex items-center gap-2.5 w-full text-left py-1">
                <span
                  className={`flex items-center justify-center w-5 h-5 rounded border shrink-0 ${
                    marcado ? "bg-success border-success text-white" : "border-line"
                  }`}
                >
                  {marcado && <Check size={13} />}
                </span>
                <span className={marcado ? "line-through text-ink-soft" : ""}>{item}</span>
              </button>
            </li>
          );
        })}

        {extras.map((extra) => {
          const id = `${categoria}:${extra.texto}`;
          const marcado = pronto && marcados[id];
          return (
            <li key={extra.id} className="flex items-center gap-2.5 w-full py-1">
              <button onClick={() => onToggle(categoria, extra.texto)} className="flex items-center gap-2.5 flex-1 text-left">
                <span
                  className={`flex items-center justify-center w-5 h-5 rounded border shrink-0 ${
                    marcado ? "bg-success border-success text-white" : "border-line"
                  }`}
                >
                  {marcado && <Check size={13} />}
                </span>
                <span className={marcado ? "line-through text-ink-soft" : ""}>{extra.texto}</span>
              </button>
              <button
                onClick={() => onRemover(extra)}
                aria-label="Remover item"
                className="p-1 -m-1 text-ink-soft shrink-0"
              >
                <X size={14} />
              </button>
            </li>
          );
        })}
      </ul>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!novoTexto.trim()) return;
          onAdicionar(categoria, novoTexto);
          setNovoTexto("");
        }}
        className="flex items-center gap-2 mt-3 pt-3 border-t border-line"
      >
        <input
          value={novoTexto}
          onChange={(e) => setNovoTexto(e.target.value)}
          placeholder="Adicionar item..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink-soft"
        />
        <button
          type="submit"
          aria-label="Adicionar"
          className="flex items-center justify-center w-7 h-7 rounded-full bg-ink text-paper shrink-0"
        >
          <Plus size={15} />
        </button>
      </form>
    </div>
  );
}
