"use client";

import { useEffect, useState } from "react";
import VoltarMais from "@/components/VoltarMais";
import { db } from "@/lib/db";
import { useHoje } from "@/lib/useHoje";
import { hotels } from "@/data/hotels";
import { getInfoEmergencia } from "@/data/emergenciaPorPais";
import { Copy, Phone } from "lucide-react";

const CAMPOS = [
  { chave: "emergencia:contato1", label: "Contato de emergência 1 (nome + telefone)" },
  { chave: "emergencia:contato2", label: "Contato de emergência 2 (nome + telefone)" },
  { chave: "emergencia:seguro", label: "Seguro viagem", padrao: "Universal Assistance — reserva Decolar 1949351600" },
  { chave: "emergencia:observacoes", label: "Outras informações importantes" },
];

export default function EmergenciaPage() {
  const { dia } = useHoje();
  const [valores, setValores] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!db) return;
    db.configuracoes.toArray().then((rows) => {
      const mapa: Record<string, string> = {};
      rows.forEach((r) => {
        if (r.chave.startsWith("emergencia:")) mapa[r.chave] = r.valor;
      });
      setValores(mapa);
    });
  }, []);

  async function salvar(chave: string, valor: string) {
    setValores((v) => ({ ...v, [chave]: valor }));
    if (db) await db.configuracoes.put({ chave, valor });
  }

  const hotelAtual = dia ? hotels.find((h) => dia.data >= h.checkin && dia.data < h.checkout) : null;
  const infoPais = dia ? getInfoEmergencia(dia.pais) : undefined;

  const resumo = [
    infoPais ? `Emergência geral (${dia?.pais}): ${infoPais.numeroEmergenciaGeral}` : "",
    infoPais ? `${infoPais.consulado.nome}: ${infoPais.consulado.endereco} — plantão ${infoPais.consulado.telefonePlantao}` : "",
    hotelAtual ? `Hotel atual: ${hotelAtual.nome}, ${hotelAtual.endereco}, tel: ${hotelAtual.telefone}` : "",
    valores["emergencia:contato1"] ? `Contato 1: ${valores["emergencia:contato1"]}` : "",
    valores["emergencia:contato2"] ? `Contato 2: ${valores["emergencia:contato2"]}` : "",
    `Seguro: ${valores["emergencia:seguro"] || "Universal Assistance — reserva Decolar 1949351600"}`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      <VoltarMais />
      <h1 className="font-display text-xl font-bold text-alert">🆘 Emergência</h1>

      {infoPais && (
        <div className="rounded-2xl bg-alert text-white p-4 space-y-1">
          <p className="text-xs uppercase tracking-wide opacity-80">Emergência geral — {dia?.pais}</p>
          <a href={`tel:${infoPais.numeroEmergenciaGeral.split(" ")[0]}`} className="font-ticket text-3xl font-bold block">
            {infoPais.numeroEmergenciaGeral}
          </a>
          <p className="text-xs opacity-80">Polícia, ambulância e bombeiros (número único na União Europeia)</p>
        </div>
      )}

      {infoPais && infoPais.consulado.nome !== "—" && (
        <div className="rounded-2xl bg-paper-raised border border-line p-4 space-y-1.5">
          <p className="text-xs font-medium text-ink-soft">CONSULADO BRASILEIRO</p>
          <p className="font-medium">{infoPais.consulado.nome}</p>
          <p className="text-sm text-ink-soft">{infoPais.consulado.endereco}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            <a
              href={`tel:${infoPais.consulado.telefonePlantao.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-alert/10 text-alert rounded-full px-3 py-1.5"
            >
              <Phone size={12} /> Plantão: {infoPais.consulado.telefonePlantao}
            </a>
            {infoPais.consulado.telefoneGeral && (
              <a
                href={`tel:${infoPais.consulado.telefoneGeral.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-1.5 text-xs font-medium bg-brass-soft text-ink rounded-full px-3 py-1.5"
              >
                <Phone size={12} /> Geral: {infoPais.consulado.telefoneGeral}
              </a>
            )}
          </div>
          {infoPais.consulado.observacao && <p className="text-xs text-ink-soft pt-1">{infoPais.consulado.observacao}</p>}
        </div>
      )}

      {hotelAtual && (
        <div className="rounded-2xl bg-paper-raised border border-line p-4">
          <p className="text-xs font-medium text-ink-soft mb-1">HOTEL ATUAL</p>
          <p className="font-medium">{hotelAtual.nome}</p>
          <p className="text-sm text-ink-soft">{hotelAtual.endereco}</p>
          {hotelAtual.telefone && <p className="text-sm text-ink-soft">{hotelAtual.telefone}</p>}
        </div>
      )}

      {CAMPOS.map((c) => (
        <div key={c.chave} className="rounded-2xl bg-paper-raised border border-line p-4">
          <label className="text-xs font-medium text-ink-soft block mb-1.5">{c.label}</label>
          <textarea
            value={valores[c.chave] ?? c.padrao ?? ""}
            onChange={(e) => salvar(c.chave, e.target.value)}
            rows={2}
            placeholder="⚠️ A preencher"
            className="w-full text-sm rounded-lg border border-line bg-paper px-3 py-2"
          />
        </div>
      ))}

      <button
        onClick={() => navigator.clipboard?.writeText(resumo)}
        className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-ink text-paper py-2.5 text-sm font-medium"
      >
        <Copy size={14} /> Copiar tudo
      </button>
    </div>
  );
}
