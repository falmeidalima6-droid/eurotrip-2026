"use client";

import VoltarMais from "@/components/VoltarMais";
import BloqueioPin from "@/components/BloqueioPin";
import AnexosDocumento from "@/components/AnexosDocumento";
import { hotels } from "@/data/hotels";
import { transportes } from "@/data/transportes";

const CATEGORIAS_UPLOAD = [
  { id: "doc-passaporte-fernanda", label: "Passaporte — Fernanda" },
  { id: "doc-passaporte-marcos", label: "Passaporte — Marcos" },
  { id: "doc-seguro-viagem", label: "Cartão/apólice do seguro viagem" },
  { id: "doc-ingressos", label: "Ingressos (Coliseu, Vaticano, Torre Eiffel, Sagrada Família etc.)" },
  { id: "doc-vouchers-diversos", label: "Outros vouchers/comprovantes" },
  { id: "doc-cartoes-bancarios", label: "Contatos dos bancos/emissores dos cartões (para bloqueio em caso de perda)" },
  { id: "doc-outros", label: "Outros documentos importantes" },
];

export default function DocumentosPage() {
  return (
    <BloqueioPin>
    <div className="px-4 pt-4 pb-6 space-y-4">
      <VoltarMais />
      <h1 className="font-display text-xl font-bold">📄 Documentos</h1>
      <p className="text-sm text-ink-soft">
        Anexe fotos ou PDFs — ficam salvos só neste celular (IndexedDB local), nunca são enviados a nenhum servidor. Para
        cada reserva específica (hotel/voo/trem/van), o anexo fica na própria aba Reservas.
      </p>

      {CATEGORIAS_UPLOAD.map((c) => (
        <div key={c.id} className="rounded-2xl bg-paper-raised border border-line p-4">
          <p className="font-medium text-sm mb-2">{c.label}</p>
          <AnexosDocumento referenciaId={c.id} />
        </div>
      ))}

      <div className="rounded-2xl bg-paper-raised border border-line p-4">
        <p className="font-medium mb-2">Hotéis — nº de reserva</p>
        <ul className="text-sm text-ink-soft space-y-1">
          {hotels.map((h) => (
            <li key={h.id}>
              {h.nome}: {h.numeroReserva}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl bg-paper-raised border border-line p-4">
        <p className="font-medium mb-2">Voos com nº de reserva</p>
        <ul className="text-sm text-ink-soft space-y-1">
          {transportes
            .filter((t) => t.tipo === "voo" && t.reserva)
            .map((t) => (
              <li key={t.id}>
                {t.origem} → {t.destino}: {t.reserva}
              </li>
            ))}
        </ul>
      </div>
    </div>
    </BloqueioPin>
  );
}
