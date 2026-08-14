"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ingressos as ingressosBase } from "@/data/ingressos";
import { checklistDefs } from "@/data/checklistDefs";
import { db } from "@/lib/db";
import { ChevronRight, ListChecks } from "lucide-react";

const CATEGORIAS_PRE_VIAGEM = checklistDefs.filter((g) => g.categoria === "Documentos" || g.categoria === "Bagagem");

export default function ResumoPendencias() {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    if (!db) return;
    (async () => {
      const overrides = await db.ingressoOverrides.toArray();
      const compradosMapa: Record<string, boolean> = {};
      overrides.forEach((o) => (compradosMapa[o.ingressoId] = o.comprado));
      const ingressosPendentes = ingressosBase.filter((i) => !compradosMapa[i.id]).length;

      const checklistRows = await db.checklist.toArray();
      const marcadoMapa: Record<string, boolean> = {};
      checklistRows.forEach((r) => (marcadoMapa[r.id] = r.marcado));
      const checklistPendente = CATEGORIAS_PRE_VIAGEM.reduce(
        (soma, grupo) => soma + grupo.itens.filter((item) => !marcadoMapa[`${grupo.categoria}:${item}`]).length,
        0
      );

      setTotal(ingressosPendentes + checklistPendente);
    })();
  }, []);

  if (total === null) return null;

  return (
    <Link
      href="/mais/pendencias"
      className={`flex items-center justify-between rounded-2xl border p-4 ${
        total > 0 ? "bg-alert/5 border-alert/30" : "bg-success/5 border-success/30"
      }`}
    >
      <div className="flex items-center gap-3">
        <ListChecks size={20} className={total > 0 ? "text-alert" : "text-success"} />
        <div>
          <p className="font-medium text-sm">{total > 0 ? `Faltam ${total} itens resolver` : "Tudo resolvido por enquanto ✅"}</p>
          <p className="text-xs text-ink-soft">Ingressos + checklist antes da viagem</p>
        </div>
      </div>
      <ChevronRight size={18} className="text-ink-soft shrink-0" />
    </Link>
  );
}
