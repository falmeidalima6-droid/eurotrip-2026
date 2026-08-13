"use client";

import { useEffect, useState } from "react";
import { db, Anexo } from "@/lib/db";
import { Paperclip, Trash2, Upload, FileText } from "lucide-react";

export default function AnexosDocumento({ referenciaId }: { referenciaId: string }) {
  const [anexos, setAnexos] = useState<Anexo[]>([]);

  useEffect(() => {
    if (!db) return;
    db.anexos.where("referenciaId").equals(referenciaId).toArray().then(setAnexos);
  }, [referenciaId]);

  async function adicionar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !db) return;
    const anexo: Anexo = {
      referenciaId,
      nomeArquivo: file.name,
      mimeType: file.type || "application/octet-stream",
      blob: file,
      criadoEm: new Date().toISOString(),
    };
    const id = await db.anexos.add(anexo);
    setAnexos((a) => [...a, { ...anexo, id }]);
    e.target.value = "";
  }

  async function remover(id?: number) {
    if (!db || id === undefined) return;
    await db.anexos.delete(id);
    setAnexos((a) => a.filter((x) => x.id !== id));
  }

  function abrir(anexo: Anexo) {
    const url = URL.createObjectURL(anexo.blob);
    window.open(url, "_blank");
  }

  return (
    <div className="pt-1">
      {anexos.length > 0 && (
        <div className="space-y-1 mb-2">
          {anexos.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-2 text-xs bg-paper rounded-lg px-2.5 py-1.5">
              <button onClick={() => abrir(a)} className="flex items-center gap-1.5 flex-1 min-w-0 text-left">
                <FileText size={13} className="shrink-0" />
                <span className="truncate">{a.nomeArquivo}</span>
              </button>
              <button onClick={() => remover(a.id)} aria-label="Remover anexo">
                <Trash2 size={13} className="text-ink-soft shrink-0" />
              </button>
            </div>
          ))}
        </div>
      )}
      <label className="inline-flex items-center gap-1.5 text-xs font-medium border border-line rounded-full px-3 py-1.5 cursor-pointer">
        {anexos.length > 0 ? <Upload size={12} /> : <Paperclip size={12} />}
        {anexos.length > 0 ? "Anexar outro documento" : "Anexar documento (PDF/imagem)"}
        <input type="file" accept="application/pdf,image/*" className="hidden" onChange={adicionar} />
      </label>
    </div>
  );
}
