"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getDiaPorData, BANDEIRAS, dias } from "@/data/trip";
import { computarEventosDoDia } from "@/lib/time";
import { DiaRoteiro, TripEvent } from "@/data/types";
import EventCard from "@/components/EventCard";
import EditarEventoModal, { DadosEdicaoEvento } from "@/components/EditarEventoModal";
import { db, EventoOverride, EventoPersonalizado } from "@/lib/db";
import { enviarSync } from "@/lib/supabaseSync";
import { ArrowLeft, ArrowRight, CloudRain, BatteryLow, RotateCcw, Plus } from "lucide-react";

export default function DiaClient({ data }: { data: string }) {
  const [plano, setPlano] = useState<"normal" | "chuva" | "cansaco">("normal");
  const [pronto, setPronto] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, EventoOverride>>({});
  const [personalizados, setPersonalizados] = useState<EventoPersonalizado[]>([]);
  const [editando, setEditando] = useState<{ tipo: "existente" | "novo"; id: string } | null>(null);

  const diaBase = getDiaPorData(data);
  const idxDia = dias.findIndex((d) => d.data === data);
  const diaAnterior = idxDia > 0 ? dias[idxDia - 1] : null;
  const proximoDia = idxDia >= 0 && idxDia < dias.length - 1 ? dias[idxDia + 1] : null;
  const dia = diaBase;

  useEffect(() => {
    if (!db || !diaBase) return;
    (async () => {
      const registro = await db.planosAtivos.get(diaBase.cidade);
      if (registro) setPlano(registro.plano);
      const [todosOverrides, todosPersonalizados] = await Promise.all([
        db.eventoOverrides.toArray(),
        db.eventosPersonalizados.where("data").equals(data).toArray(),
      ]);
      const mapa: Record<string, EventoOverride> = {};
      todosOverrides.forEach((o) => (mapa[o.eventoId] = o));
      setOverrides(mapa);
      setPersonalizados(todosPersonalizados);
      setPronto(true);
    })();
  }, [diaBase, data]);

  async function ativarPlano(novo: "normal" | "chuva" | "cansaco") {
    if (!diaBase) return;
    setPlano(novo);
    if (db) await db.planosAtivos.put({ cidade: diaBase.cidade, plano: novo });
    enviarSync(`plano:${diaBase.cidade}`, "plano", { plano: novo });
  }


  async function salvarOverride(eventoId: string, dadosBase: TripEvent, dados: DadosEdicaoEvento) {
    const registro: EventoOverride = {
      eventoId,
      tituloEditado: dados.titulo !== dadosBase.titulo ? dados.titulo : undefined,
      horarioEditado: dados.horarioInicial !== (dadosBase.horarioInicial || "") ? dados.horarioInicial : undefined,
      enderecoEditado: dados.endereco !== (dadosBase.endereco || "") ? dados.endereco : undefined,
      observacoesEditadas: dados.observacoes !== (dadosBase.observacoes || "") ? dados.observacoes : undefined,
      cancelado: overrides[eventoId]?.cancelado || false,
      atualizadoEm: new Date().toISOString(),
    };
    if (db) await db.eventoOverrides.put(registro);
    setOverrides((m) => ({ ...m, [eventoId]: registro }));
    enviarSync(`evento-override:${eventoId}`, "evento", registro);
    setEditando(null);
  }

  async function cancelarEvento(eventoId: string) {
    const atual = overrides[eventoId] || { eventoId };
    const registro: EventoOverride = { ...atual, cancelado: true, atualizadoEm: new Date().toISOString() };
    if (db) await db.eventoOverrides.put(registro);
    setOverrides((m) => ({ ...m, [eventoId]: registro }));
    enviarSync(`evento-override:${eventoId}`, "evento", registro);
    setEditando(null);
  }

  async function salvarNovoEvento(dados: DadosEdicaoEvento) {
    if (!diaBase || !dados.titulo.trim()) return;
    const id = `custom-${Date.now()}`;
    const novo: EventoPersonalizado = {
      id,
      data,
      cidade: diaBase.cidade,
      pais: diaBase.pais,
      titulo: dados.titulo.trim(),
      categoria: "passeio",
      horarioInicial: dados.horarioInicial || undefined,
      endereco: dados.endereco || undefined,
      observacoes: dados.observacoes || undefined,
      criadoEm: new Date().toISOString(),
    };
    if (db) await db.eventosPersonalizados.put(novo);
    setPersonalizados((p) => [...p, novo]);
    enviarSync(`evento-novo:${id}`, "evento", novo);
    setEditando(null);
  }

  async function excluirPersonalizado(id: string) {
    if (db) await db.eventosPersonalizados.delete(id);
    setPersonalizados((p) => p.filter((e) => e.id !== id));
    setEditando(null);
  }

  const diaComEdicoes: DiaRoteiro | null = useMemo(() => {
    if (!dia) return null;
    const eventosBase: TripEvent[] = dia.eventos.map((ev) => {
      const ov = overrides[ev.id];
      if (!ov) return ev;
      return {
        ...ev,
        titulo: ov.tituloEditado ?? ev.titulo,
        horarioInicial: ov.horarioEditado ?? ev.horarioInicial,
        endereco: ov.enderecoEditado ?? ev.endereco,
        observacoes: ov.observacoesEditadas ?? ev.observacoes,
      };
    });
    const eventosCustom: TripEvent[] = personalizados.map((p) => ({
      id: p.id,
      data: p.data,
      cidade: p.cidade,
      pais: p.pais,
      categoria: (p.categoria as TripEvent["categoria"]) || "passeio",
      titulo: `✏️ ${p.titulo}`,
      horarioInicial: p.horarioInicial,
      endereco: p.endereco,
      observacoes: p.observacoes,
      status: "futuro",
      confirmado: true,
    }));
    const todos = [...eventosBase, ...eventosCustom].sort((a, b) =>
      (a.horarioInicial || "99:99").localeCompare(b.horarioInicial || "99:99")
    );
    return { ...dia, eventos: todos };
  }, [dia, overrides, personalizados]);

  if (!diaBase) {
    return (
      <div className="px-4 pt-4">
        <p>Dia não encontrado.</p>
        <Link href="/roteiro" className="text-brass underline">Voltar ao roteiro</Link>
      </div>
    );
  }

  let eventos = diaComEdicoes ? computarEventosDoDia(diaComEdicoes) : [];
  eventos = eventos.map((ev) => (overrides[ev.id]?.cancelado ? { ...ev, statusComputado: "cancelado" as const } : ev));

  const temPlanoChuva = !!diaBase.planoChuva;
  const temPlanoCansaco = !!diaBase.planoCansaco;

  const eventoEditando = editando?.tipo === "existente" ? eventos.find((e) => e.id === editando.id) : null;
  const personalizadoEditando = editando?.tipo === "novo" && editando.id !== "novo" ? personalizados.find((p) => p.id === editando.id) : null;

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
          <EventCard
            key={ev.id}
            evento={ev}
            onEditar={() => setEditando({ tipo: ev.id.startsWith("custom-") ? "novo" : "existente", id: ev.id })}
          />
        ))}
      </div>

      <button
        onClick={() => setEditando({ tipo: "novo", id: "novo" })}
        className="w-full flex items-center justify-center gap-1.5 rounded-2xl border border-dashed border-line text-ink-soft text-sm font-medium py-3"
      >
        <Plus size={15} /> Adicionar atividade a este dia
      </button>

      <div className="flex gap-2">
        {diaAnterior && (
          <Link
            href={`/roteiro/${diaAnterior.data}`}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl bg-paper-raised border border-line text-sm font-medium py-3"
          >
            <ArrowLeft size={15} /> {diaAnterior.cidade}
          </Link>
        )}
        {proximoDia && (
          <Link
            href={`/roteiro/${proximoDia.data}`}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl bg-ink text-paper text-sm font-medium py-3"
          >
            {proximoDia.cidade} <ArrowRight size={15} />
          </Link>
        )}
      </div>

      {editando?.tipo === "existente" && eventoEditando && (
        <EditarEventoModal
          tituloModal="Editar atividade"
          valoresIniciais={{
            titulo: eventoEditando.titulo,
            horarioInicial: eventoEditando.horarioInicial || "",
            endereco: eventoEditando.endereco || "",
            observacoes: eventoEditando.observacoes || "",
          }}
          ehPersonalizado={false}
          onFechar={() => setEditando(null)}
          onSalvar={(dados) => {
            const original = dia!.eventos.find((e) => e.id === editando.id)!;
            salvarOverride(editando.id, original, dados);
          }}
          onCancelarEvento={() => cancelarEvento(editando.id)}
        />
      )}

      {editando?.tipo === "novo" && editando.id === "novo" && (
        <EditarEventoModal
          tituloModal="Nova atividade"
          valoresIniciais={{ titulo: "", horarioInicial: "", endereco: "", observacoes: "" }}
          ehPersonalizado={false}
          onFechar={() => setEditando(null)}
          onSalvar={salvarNovoEvento}
        />
      )}

      {editando?.tipo === "novo" && personalizadoEditando && (
        <EditarEventoModal
          tituloModal="Editar atividade"
          valoresIniciais={{
            titulo: personalizadoEditando.titulo,
            horarioInicial: personalizadoEditando.horarioInicial || "",
            endereco: personalizadoEditando.endereco || "",
            observacoes: personalizadoEditando.observacoes || "",
          }}
          ehPersonalizado={true}
          onFechar={() => setEditando(null)}
          onSalvar={async (dados) => {
            const atualizado: EventoPersonalizado = {
              ...personalizadoEditando,
              titulo: dados.titulo,
              horarioInicial: dados.horarioInicial || undefined,
              endereco: dados.endereco || undefined,
              observacoes: dados.observacoes || undefined,
            };
            if (db) await db.eventosPersonalizados.put(atualizado);
            setPersonalizados((p) => p.map((e) => (e.id === atualizado.id ? atualizado : e)));
            enviarSync(`evento-novo:${atualizado.id}`, "evento", atualizado);
            setEditando(null);
          }}
          onExcluir={() => excluirPersonalizado(personalizadoEditando.id)}
        />
      )}
    </div>
  );
}
