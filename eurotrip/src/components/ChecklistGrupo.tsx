"use client";

import { useState } from "react";
import { ItemPersonalizado } from "@/lib/db";
import { Check, Plus, X } from "lucide-react";

export default function ChecklistGrupo({
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
  const total = itens.length + extras.length;
  const feitos = itens.filter((item) => pronto && marcados[`${categoria}:${item}`]).length +
    extras.filter((extra) => pronto && marcados[`${categoria}:${extra.texto}`]).length;

  return (
    <div className="rounded-2xl bg-paper-raised border border-line p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="font-medium uppercase text-xs text-ink-soft tracking-wide">{titulo}</p>
        {pronto && total > 0 && (
          <span className={`text-xs font-ticket ${feitos === total ? "text-success" : "text-ink-soft"}`}>
            {feitos}/{total}
          </span>
        )}
      </div>
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
