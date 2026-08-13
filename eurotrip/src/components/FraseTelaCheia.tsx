"use client";

import { X } from "lucide-react";

export default function FraseTelaCheia({
  pt,
  traducao,
  onFechar,
}: {
  pt: string;
  traducao: string;
  onFechar: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-ink text-paper flex flex-col">
      <div className="flex justify-end p-4">
        <button onClick={onFechar} aria-label="Fechar" className="p-2 -m-2">
          <X size={24} />
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6 text-center">
        <p className="font-display text-4xl font-bold leading-tight">{traducao}</p>
        <p className="text-lg text-paper/60">{pt}</p>
      </div>
    </div>
  );
}
