"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { Check } from "lucide-react";

const ITENS_TROCA_CIDADE = [
  "Arrumar malas",
  "Separar documentos",
  "Separar bilhetes/ingressos do dia seguinte",
  "Conferir checkout",
  "Conferir horário do próximo transporte",
];

const ITENS_BATERIA = [
  "Celular de Fernanda carregado",
  "Celular de Marcos carregado",
  "Power bank carregado",
  "Câmera carregada (se for usar)",
];

export default function PrepararAmanha({ data, temTrocaDeCidade }: { data: string; temTrocaDeCidade: boolean }) {
  const [marcados, setMarcados] = useState<Record<string, boolean>>({});
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    if (!db) return;
    db.checklist.toArray().then((todos) => {
      const mapa: Record<string, boolean> = {};
      todos.forEach((t) => {
        if (t.categoria === `noite:${data}`) mapa[t.id] = t.marcado;
      });
      setMarcados(mapa);
      setPronto(true);
    });
  }, [data]);

  async function toggle(item: string) {
    const id = `noite:${data}:${item}`;
    const novo = !marcados[id];
    setMarcados((m) => ({ ...m, [id]: novo }));
    if (db) await db.checklist.put({ id, categoria: `noite:${data}`, texto: item, marcado: novo });
  }

  const itens = temTrocaDeCidade ? [...ITENS_TROCA_CIDADE, ...ITENS_BATERIA] : ITENS_BATERIA;

  return (
    <div className="rounded-2xl bg-paper-raised border border-line p-4">
      <p className="text-xs font-medium text-ink-soft uppercase mb-2">🌙 Preparar amanhã</p>
      <ul className="space-y-1.5">
        {itens.map((item) => {
          const id = `noite:${data}:${item}`;
          const marcado = pronto && marcados[id];
          return (
            <li key={id}>
              <button onClick={() => toggle(item)} className="flex items-center gap-2.5 w-full text-left py-1">
                <span
                  className={`flex items-center justify-center w-5 h-5 rounded border shrink-0 ${
                    marcado ? "bg-success border-success text-white" : "border-line"
                  }`}
                >
                  {marcado && <Check size={13} />}
                </span>
                <span className={`text-sm ${marcado ? "line-through text-ink-soft" : ""}`}>{item}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
