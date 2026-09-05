"use client";

import { useEffect, useState } from "react";
import VoltarMais from "@/components/VoltarMais";
import ChecklistGrupo from "@/components/ChecklistGrupo";
import { preViagemDefs } from "@/data/preViagemDefs";
import { db, ItemPersonalizado } from "@/lib/db";

export default function AntesDaViagemPage() {
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
      <h1 className="font-display text-xl font-bold">🧾 Antes da Viagem</h1>
      <p className="text-xs text-ink-soft">
        Providências e compras a resolver com antecedência — internet, farmácia, documentos, financeiro. Marque à
        medida que for resolvendo, fica salvo no celular.
      </p>

      {preViagemDefs.map((g) => (
        <ChecklistGrupo
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
