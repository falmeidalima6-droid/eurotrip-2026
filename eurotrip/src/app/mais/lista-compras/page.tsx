"use client";

import { useEffect, useState } from "react";
import VoltarMais from "@/components/VoltarMais";
import { db, ItemCompra } from "@/lib/db";
import { Check, Trash2, Plus } from "lucide-react";

export default function ListaComprasPage() {
  const [itens, setItens] = useState<ItemCompra[]>([]);
  const [novoItem, setNovoItem] = useState("");
  const [novaQtd, setNovaQtd] = useState("");

  useEffect(() => {
    if (!db) return;
    db.listaCompras.toArray().then(setItens);
  }, []);

  async function adicionar() {
    if (!db || !novoItem.trim()) return;
    const item: ItemCompra = { item: novoItem.trim(), quantidade: novaQtd.trim() || undefined, comprado: false };
    const id = await db.listaCompras.add(item);
    setItens((i) => [...i, { ...item, id }]);
    setNovoItem("");
    setNovaQtd("");
  }

  async function alternar(id?: number) {
    if (!db || id === undefined) return;
    const item = itens.find((i) => i.id === id);
    if (!item) return;
    const atualizado = { ...item, comprado: !item.comprado };
    await db.listaCompras.put(atualizado);
    setItens((i) => i.map((x) => (x.id === id ? atualizado : x)));
  }

  async function remover(id?: number) {
    if (!db || id === undefined) return;
    await db.listaCompras.delete(id);
    setItens((i) => i.filter((x) => x.id !== id));
  }

  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      <VoltarMais />
      <h1 className="font-display text-xl font-bold">🛍️ Lista de compras</h1>

      <div className="flex gap-2">
        <input
          value={novoItem}
          onChange={(e) => setNovoItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && adicionar()}
          placeholder="Novo item"
          className="flex-1 rounded-lg border border-line px-3 py-2 text-sm"
        />
        <input
          value={novaQtd}
          onChange={(e) => setNovaQtd(e.target.value)}
          placeholder="Qtd."
          className="w-16 rounded-lg border border-line px-2 py-2 text-sm"
        />
        <button onClick={adicionar} className="rounded-lg bg-ink text-paper px-3">
          <Plus size={18} />
        </button>
      </div>

      <div className="space-y-1.5">
        {itens.map((i) => (
          <div key={i.id} className="flex items-center justify-between rounded-xl bg-paper-raised border border-line p-3">
            <button onClick={() => alternar(i.id)} className="flex items-center gap-2.5 flex-1 text-left">
              <span
                className={`flex items-center justify-center w-5 h-5 rounded border shrink-0 ${
                  i.comprado ? "bg-success border-success text-white" : "border-line"
                }`}
              >
                {i.comprado && <Check size={13} />}
              </span>
              <span className={i.comprado ? "line-through text-ink-soft" : ""}>
                {i.item} {i.quantidade ? `(${i.quantidade})` : ""}
              </span>
            </button>
            <button onClick={() => remover(i.id)}>
              <Trash2 size={15} className="text-ink-soft" />
            </button>
          </div>
        ))}
        {itens.length === 0 && <p className="text-center text-ink-soft py-6 text-sm">Lista vazia.</p>}
      </div>
    </div>
  );
}
