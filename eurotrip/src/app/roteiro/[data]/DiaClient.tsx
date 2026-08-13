"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDiaPorData, BANDEIRAS, day13PlanoB } from "@/data/trip";
import { computarEventosDoDia } from "@/lib/time";
import EventCard from "@/components/EventCard";
import { db } from "@/lib/db";
import { enviarSync } from "@/lib/supabaseSync";
import { ArrowLeft, CloudRain, BatteryLow, RotateCcw } from "lucide-react";

const DIA_COM_DUAS_OPCOES = "2026-10-16";

export default function DiaClient({ data }: { data: string }) {
  const [plano, setPlano] = useState<"normal" | "chuva" | "cansaco">("normal");
  const [opcaoLisboa, setOpcaoLisboa] = useState<"sintra" | "belem">("sintra");
  const [pronto, setPronto] = useState(false);

  const diaBase = getDiaPorData(data);
  const temDuasOpcoes = data === DIA_COM_DUAS_OPCOES;
  const dia = temDuasOpcoes && opcaoLisboa === "belem" ? day13PlanoB : diaBase;

  useEffect(() => {
    if (!db || !diaBase) return;
    (async () => {
      const registro = await db.planosAtivos.get(diaBase.cidade);
      if (registro) setPlano(registro.plano);
      if (temDuasOpcoes) {
        const escolha = await db.configuracoes.get(`escolha-dia:${DIA_COM_DUAS_OPCOES}`);
        if (escolha?.valor === "belem") setOpcaoLisboa("belem");
      }
      setPronto(true);
    })();
  }, [diaBase, temDuasOpcoes]);

  async function ativarPlano(novo: "normal" | "chuva" | "cansaco") {
    if (!diaBase) return;
    setPlano(novo);
    if (db) await db.planosAtivos.put({ cidade: diaBase.cidade, plano: novo });
    enviarSync(`plano:${diaBase.cidade}`, "plano", { plano: novo });
  }

  async function escolherOpcaoLisboa(opcao: "sintra" | "belem") {
    setOpcaoLisboa(opcao);
    if (db) await db.configuracoes.put({ chave: `escolha-dia:${DIA_COM_DUAS_OPCOES}`, valor: opcao });
    enviarSync(`plano:escolha-${DIA_COM_DUAS_OPCOES}`, "plano", { plano: opcao });
  }

  if (!diaBase) {
    return (
      <div className="px-4 pt-4">
        <p>Dia não encontrado.</p>
        <Link href="/roteiro" className="text-brass underline">Voltar ao roteiro</Link>
      </div>
    );
  }

  const eventos = dia ? computarEventosDoDia(dia) : [];
  const temPlanoChuva = !!diaBase.planoChuva;
  const temPlanoCansaco = !!diaBase.planoCansaco;

  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      <Link href="/roteiro" className="inline-flex items-center gap-1 text-sm text-ink-soft">
        <ArrowLeft size={16} /> Roteiro completo
      </Link>

      <header>
        <p className="font-ticket text-xs text-brass">{diaBase.data.split("-").reverse().join("/")} · {diaBase.diaSemana}</p>
        <h1 className="font-display text-xl font-bold mt-0.5">
          {BANDEIRAS[diaBase.pais]} {dia?.titulo}
        </h1>
      </header>

      {temDuasOpcoes && pronto && (
        <div className="rounded-2xl bg-paper-raised border border-line p-3 space-y-2">
          <p className="text-xs font-medium text-ink-soft">ESCOLHA DO DIA — as duas opções ficam disponíveis, escolham quando quiserem</p>
          <div className="flex gap-2">
            <button
              onClick={() => escolherOpcaoLisboa("sintra")}
              className={`flex-1 text-sm font-medium rounded-full px-3 py-2 ${
                opcaoLisboa === "sintra" ? "bg-ink text-paper" : "bg-paper border border-line"
              }`}
            >
              🏰 Sintra
            </button>
            <button
              onClick={() => escolherOpcaoLisboa("belem")}
              className={`flex-1 text-sm font-medium rounded-full px-3 py-2 ${
                opcaoLisboa === "belem" ? "bg-ink text-paper" : "bg-paper border border-line"
              }`}
            >
              🏛️ Belém
            </button>
          </div>
        </div>
      )}

      {pronto && (temPlanoChuva || temPlanoCansaco) && (
        <div className="rounded-2xl bg-paper-raised border border-line p-3 space-y-2">
          <p className="text-xs font-medium text-ink-soft">SEGUNDA CAMADA DO ROTEIRO</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => ativarPlano("normal")}
              className={`text-xs font-medium rounded-full px-3 py-1.5 flex items-center gap-1 ${
                plano === "normal" ? "bg-ink text-paper" : "bg-paper border border-line"
              }`}
            >
              <RotateCcw size={12} /> Roteiro normal
            </button>
            {temPlanoChuva && (
              <button
                onClick={() => ativarPlano("chuva")}
                className={`text-xs font-medium rounded-full px-3 py-1.5 flex items-center gap-1 ${
                  plano === "chuva" ? "bg-warn text-white" : "bg-paper border border-line"
                }`}
              >
                <CloudRain size={12} /> Ativar Plano Chuva
              </button>
            )}
            {temPlanoCansaco && (
              <button
                onClick={() => ativarPlano("cansaco")}
                className={`text-xs font-medium rounded-full px-3 py-1.5 flex items-center gap-1 ${
                  plano === "cansaco" ? "bg-warn text-white" : "bg-paper border border-line"
                }`}
              >
                <BatteryLow size={12} /> Ativar Plano Cansaço
              </button>
            )}
          </div>
          {plano === "chuva" && diaBase.planoChuva && (
            <p className="text-sm text-ink-soft border-t border-line pt-2">☔ {diaBase.planoChuva}</p>
          )}
          {plano === "cansaco" && diaBase.planoCansaco && (
            <p className="text-sm text-ink-soft border-t border-line pt-2">😴 {diaBase.planoCansaco}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        {eventos.map((ev) => (
          <EventCard key={ev.id} evento={ev} />
        ))}
      </div>
    </div>
  );
}
