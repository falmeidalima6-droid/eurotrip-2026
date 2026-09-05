"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ingressos as ingressosBase } from "@/data/ingressos";
import { checklistDefs, checklistDiario } from "@/data/checklistDefs";
import { preViagemDefs } from "@/data/preViagemDefs";
import { db } from "@/lib/db";
import { ListChecks, FileText, Luggage } from "lucide-react";

function contarPendentes(grupos: { categoria: string; itens: string[] }[], marcadoMapa: Record<string, boolean>) {
  return grupos.reduce(
    (soma, grupo) => soma + grupo.itens.filter((item) => !marcadoMapa[`${grupo.categoria}:${item}`]).length,
    0
  );
}

export default function SecaoPreparacao() {
  const [ingressosPendentes, setIngressosPendentes] = useState<number | null>(null);
  const [antesPendentes, setAntesPendentes] = useState<number | null>(null);
  const [malaPendentes, setMalaPendentes] = useState<number | null>(null);

  useEffect(() => {
    if (!db) return;
    (async () => {
      const overrides = await db.ingressoOverrides.toArray();
      const compradosMapa: Record<string, boolean> = {};
      overrides.forEach((o) => (compradosMapa[o.ingressoId] = o.comprado));
      setIngressosPendentes(ingressosBase.filter((i) => !compradosMapa[i.id]).length);

      const checklistRows = await db.checklist.toArray();
      const marcadoMapa: Record<string, boolean> = {};
      checklistRows.forEach((r) => (marcadoMapa[r.id] = r.marcado));

      setAntesPendentes(contarPendentes(preViagemDefs, marcadoMapa));
      setMalaPendentes(
        contarPendentes(checklistDefs, marcadoMapa) +
          contarPendentes([{ categoria: "Diário", itens: checklistDiario }], marcadoMapa)
      );
    })();
  }, []);

  return (
    <section>
      <p className="text-xs font-medium text-ink-soft uppercase tracking-wide mb-2 px-1">📋 Preparação</p>
      <div className="grid grid-cols-3 gap-2">
        <Tile
          href="/mais/pendencias"
          icon={<ListChecks size={20} />}
          label="Pendências"
          contagem={ingressosPendentes}
          destaque={!!ingressosPendentes && ingressosPendentes > 0}
        />
        <Tile
          href="/mais/antes-da-viagem"
          icon={<FileText size={20} />}
          label="Antes da Viagem"
          contagem={antesPendentes}
          destaque={!!antesPendentes && antesPendentes > 0}
        />
        <Tile
          href="/mais/checklist"
          icon={<Luggage size={20} />}
          label="Mala"
          contagem={malaPendentes}
          destaque={!!malaPendentes && malaPendentes > 0}
        />
      </div>
    </section>
  );
}

function Tile({
  href,
  icon,
  label,
  contagem,
  destaque,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  contagem: number | null;
  destaque: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 text-center ${
        destaque ? "bg-alert/5 border-alert/30" : "bg-paper-raised border-line"
      }`}
    >
      <span className={destaque ? "text-alert" : "text-ink-soft"}>{icon}</span>
      <span className="text-xs font-medium leading-tight">{label}</span>
      {contagem !== null && (
        <span className={`text-[11px] font-ticket ${destaque ? "text-alert" : "text-success"}`}>
          {contagem > 0 ? `${contagem} pendentes` : "✅ tudo ok"}
        </span>
      )}
    </Link>
  );
}
