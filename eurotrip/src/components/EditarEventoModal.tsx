"use client";

import { useState } from "react";
import { X, Trash2, Ban } from "lucide-react";

export interface DadosEdicaoEvento {
  titulo: string;
  horarioInicial: string;
  endereco: string;
  observacoes: string;
}

export default function EditarEventoModal({
  tituloModal,
  valoresIniciais,
  ehPersonalizado,
  onFechar,
  onSalvar,
  onCancelarEvento,
  onExcluir,
}: {
  tituloModal: string;
  valoresIniciais: DadosEdicaoEvento;
  ehPersonalizado: boolean;
  onFechar: () => void;
  onSalvar: (dados: DadosEdicaoEvento) => void;
  onCancelarEvento?: () => void;
  onExcluir?: () => void;
}) {
  const [dados, setDados] = useState<DadosEdicaoEvento>(valoresIniciais);

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 flex items-end justify-center">
      <div className="bg-paper w-full max-w-md rounded-t-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <p className="font-display text-lg font-bold">{tituloModal}</p>
          <button onClick={onFechar} aria-label="Fechar" className="p-1 -m-1">
            <X size={22} />
          </button>
        </div>

        <div className="space-y-3">
          <label className="block">
            <span className="text-xs font-medium text-ink-soft">Título</span>
            <input
              value={dados.titulo}
              onChange={(e) => setDados({ ...dados, titulo: e.target.value })}
              className="w-full mt-1 rounded-xl border border-line bg-paper-raised px-3 py-2 text-sm"
              placeholder="Ex: Jantar no LX Factory"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-ink-soft">Horário</span>
            <input
              value={dados.horarioInicial}
              onChange={(e) => setDados({ ...dados, horarioInicial: e.target.value })}
              placeholder="HH:mm"
              className="w-full mt-1 rounded-xl border border-line bg-paper-raised px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-ink-soft">Endereço</span>
            <input
              value={dados.endereco}
              onChange={(e) => setDados({ ...dados, endereco: e.target.value })}
              className="w-full mt-1 rounded-xl border border-line bg-paper-raised px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-ink-soft">Observações</span>
            <textarea
              value={dados.observacoes}
              onChange={(e) => setDados({ ...dados, observacoes: e.target.value })}
              rows={3}
              className="w-full mt-1 rounded-xl border border-line bg-paper-raised px-3 py-2 text-sm"
            />
          </label>
        </div>

        <button
          onClick={() => onSalvar(dados)}
          className="w-full rounded-full bg-ink text-paper font-medium py-2.5"
        >
          Salvar alteração
        </button>

        {ehPersonalizado ? (
          onExcluir && (
            <button
              onClick={onExcluir}
              className="w-full flex items-center justify-center gap-1.5 text-alert text-sm font-medium py-2"
            >
              <Trash2 size={15} /> Excluir esta atividade
            </button>
          )
        ) : (
          onCancelarEvento && (
            <button
              onClick={onCancelarEvento}
              className="w-full flex items-center justify-center gap-1.5 text-alert text-sm font-medium py-2"
            >
              <Ban size={15} /> Marcar como cancelado
            </button>
          )
        )}
      </div>
    </div>
  );
}
