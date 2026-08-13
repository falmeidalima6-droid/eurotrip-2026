"use client";

import { useEffect, useState } from "react";
import VoltarMais from "@/components/VoltarMais";
import { checklistDefs, checklistDiario } from "@/data/checklistDefs";
import { db } from "@/lib/db";
import { Check } from "lucide-react";

export default function ChecklistPage() {
  const [marcados, setMarcados] = useState<Record<string, boolean>>({});
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    if (!db) return;
    db.checklist.toArray().then((todos) => {
      const mapa: Record<string, boolean> = {};
      todos.forEach((t) => (mapa[t.id] = t.marcado));
      setMarcados(mapa);
      setPronto(true);
    });
  }, []);

  async function toggle(categoria: string, item: string) {
    const id = `${categoria}:${item}`;
    const novo = !marcados[id];
    setMarcados((m) => ({ ...m, [id]: novo }));
    if (db) await db.checklist.put({ id, categoria, texto: item, marcado: novo });
  }

  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      <VoltarMais />
      <h1 className="font-display text-xl font-bold">✅ Checklist</h1>

      <Grupo titulo="Antes de sair do hotel (diário)" categoria="Diário" itens={checklistDiario} marcados={marcados} onToggle={toggle} pronto={pronto} />

      {checklistDefs.map((g) => (
        <Grupo key={g.categoria} titulo={g.categoria} categoria={g.categoria} itens={g.itens} marcados={marcados} onToggle={toggle} pronto={pronto} />
      ))}
    </div>
  );
}

function Grupo({
  titulo,
  categoria,
  itens,
  marcados,
  onToggle,
  pronto,
}: {
  titulo: string;
  categoria: string;
  itens: string[];
  marcados: Record<string, boolean>;
  onToggle: (categoria: string, item: string) => void;
  pronto: boolean;
}) {
  return (
    <div className="rounded-2xl bg-paper-raised border border-line p-4">
      <p className="font-medium mb-2 uppercase text-xs text-ink-soft tracking-wide">{titulo}</p>
      <ul className="space-y-1.5">
        {itens.map((item) => {
          const id = `${categoria}:${item}`;
          const marcado = pronto && marcados[id];
          return (
            <li key={id}>
              <button
                onClick={() => onToggle(categoria, item)}
                className="flex items-center gap-2.5 w-full text-left py-1"
              >
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
      </ul>
    </div>
  );
}
