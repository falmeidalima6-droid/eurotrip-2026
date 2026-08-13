"use client";

import { useEffect, useState } from "react";
import VoltarMais from "@/components/VoltarMais";
import { db, Gasto } from "@/lib/db";
import { hotels } from "@/data/hotels";
import { enviarSync } from "@/lib/supabaseSync";
import { Trash2, Download, Check } from "lucide-react";

const QUEM = ["Casal", "Fernanda", "Marcos"];

const CAMPOS_CARTEIRA = [
  { chave: "carteira:wise", label: "Wise — saldo aproximado / cartão" },
  { chave: "carteira:revolut", label: "Revolut — saldo aproximado / cartão" },
  { chave: "carteira:cartao-principal", label: "Qual é o principal do dia (Wise ou Revolut)" },
  { chave: "carteira:dinheiro", label: "Dinheiro em espécie (aproximado)" },
];

export default function DinheiroPage() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [cotacao, setCotacao] = useState("");
  const [form, setForm] = useState({ categoria: "", valor: "", moeda: "EUR", meioPagamento: "", quemPagou: "Casal" });
  const [conversorValor, setConversorValor] = useState("");
  const [carteira, setCarteira] = useState<Record<string, string>>({});
  const [pagamentos, setPagamentos] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!db) return;
    db.gastos.orderBy("data").reverse().toArray().then(setGastos);
    db.configuracoes.get("cotacao-eur-brl").then((c) => c && setCotacao(c.valor));
    db.configuracoes.toArray().then((rows) => {
      const c: Record<string, string> = {};
      rows.forEach((r) => {
        if (r.chave.startsWith("carteira:")) c[r.chave] = r.valor;
      });
      setCarteira(c);
    });
    db.ingressoOverrides.toArray(); // no-op warmup
    db.configuracoes.toArray().then((rows) => {
      const p: Record<string, boolean> = {};
      rows.forEach((r) => {
        if (r.chave.startsWith("pago:")) p[r.chave] = r.valor === "true";
      });
      setPagamentos(p);
    });
  }, []);

  async function adicionarGasto() {
    if (!db || !form.valor) return;
    const novo: Gasto = {
      data: new Date().toISOString().slice(0, 10),
      categoria: form.categoria || "Outro",
      valor: parseFloat(form.valor.replace(",", ".")) || 0,
      moeda: form.moeda,
      meioPagamento: form.meioPagamento,
      quemPagou: form.quemPagou,
    };
    const id = await db.gastos.add(novo);
    setGastos((g) => [{ ...novo, id }, ...g]);
    setForm({ categoria: "", valor: "", moeda: "EUR", meioPagamento: "", quemPagou: "Casal" });
    enviarSync(`gasto:${id}`, "gasto", { ...novo, id });
  }

  async function removerGasto(id?: number) {
    if (!db || id === undefined) return;
    await db.gastos.delete(id);
    setGastos((g) => g.filter((x) => x.id !== id));
  }

  async function salvarCotacao(v: string) {
    setCotacao(v);
    if (db) await db.configuracoes.put({ chave: "cotacao-eur-brl", valor: v });
  }

  async function salvarCarteira(chave: string, valor: string) {
    setCarteira((c) => ({ ...c, [chave]: valor }));
    if (db) await db.configuracoes.put({ chave, valor });
  }

  async function alternarPago(chave: string) {
    const novo = !pagamentos[chave];
    setPagamentos((p) => ({ ...p, [chave]: novo }));
    if (db) await db.configuracoes.put({ chave, valor: String(novo) });
  }

  function exportarCSV() {
    const linhas = [
      ["data", "categoria", "valor", "moeda", "meioPagamento", "quemPagou"].join(","),
      ...gastos.map((g) => [g.data, g.categoria, g.valor, g.moeda, g.meioPagamento, g.quemPagou || ""].join(",")),
    ];
    const blob = new Blob([linhas.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gastos-eurotrip.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const totalEUR = gastos.filter((g) => g.moeda === "EUR").reduce((s, g) => s + g.valor, 0);
  const totalPorPessoa = QUEM.map((q) => ({
    quem: q,
    total: gastos.filter((g) => g.moeda === "EUR" && (g.quemPagou || "Casal") === q).reduce((s, g) => s + g.valor, 0),
  }));
  const cotacaoNum = parseFloat(cotacao.replace(",", "."));
  const conversorNum = parseFloat(conversorValor.replace(",", "."));

  const itensPendentes = [
    ...hotels.map((h) => ({ chave: `pago:hotel:${h.id}`, label: `Hotel — ${h.nome}` })),
    { chave: "pago:taxas-turisticas", label: "Taxas turísticas (pagas no local, várias cidades)" },
    { chave: "pago:transfer-enjoy", label: "Transfer Enjoy Travelling (10/10)" },
    { chave: "pago:free-tours", label: "Gorjetas de free tours (se fizerem)" },
    { chave: "pago:bagagem-extra", label: "Possível bagagem extra (3ª mala, 10/10)" },
  ];

  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      <VoltarMais />
      <h1 className="font-display text-xl font-bold">💶 Dinheiro</h1>

      <div className="rounded-2xl bg-paper-raised border border-line p-4 space-y-2">
        <p className="font-medium text-sm">Conversor EUR ↔ BRL (manual, offline)</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-soft">1 EUR =</span>
          <input
            value={cotacao}
            onChange={(e) => salvarCotacao(e.target.value)}
            placeholder="6,10"
            className="w-20 rounded-lg border border-line px-2 py-1 text-sm font-ticket"
          />
          <span className="text-xs text-ink-soft">BRL</span>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <input
            value={conversorValor}
            onChange={(e) => setConversorValor(e.target.value)}
            placeholder="Valor em EUR"
            className="flex-1 rounded-lg border border-line px-3 py-1.5 text-sm font-ticket"
          />
          <span className="font-ticket text-sm">
            {!isNaN(conversorNum) && !isNaN(cotacaoNum) ? `≈ R$ ${(conversorNum * cotacaoNum).toFixed(2)}` : "—"}
          </span>
        </div>
      </div>

      <div className="rounded-2xl bg-paper-raised border border-line p-4 space-y-2">
        <p className="font-medium text-sm">💳 Carteira financeira</p>
        <p className="text-xs text-ink-soft">Sem números completos de cartão — só o essencial pra saber com o que estão contando.</p>
        {CAMPOS_CARTEIRA.map((c) => (
          <div key={c.chave}>
            <label className="text-xs text-ink-soft block mb-1">{c.label}</label>
            <input
              value={carteira[c.chave] || ""}
              onChange={(e) => salvarCarteira(c.chave, e.target.value)}
              className="w-full rounded-lg border border-line px-3 py-1.5 text-sm"
            />
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-paper-raised border border-line p-4 space-y-2">
        <p className="font-medium text-sm">📋 Pagamentos</p>
        {itensPendentes.map((i) => (
          <button key={i.chave} onClick={() => alternarPago(i.chave)} className="flex items-center gap-2.5 w-full text-left py-1">
            <span
              className={`flex items-center justify-center w-5 h-5 rounded border shrink-0 ${
                pagamentos[i.chave] ? "bg-success border-success text-white" : "border-line"
              }`}
            >
              {pagamentos[i.chave] && <Check size={13} />}
            </span>
            <span className={`text-sm ${pagamentos[i.chave] ? "line-through text-ink-soft" : ""}`}>{i.label}</span>
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-paper-raised border border-line p-4 space-y-2">
        <p className="font-medium text-sm">Novo gasto</p>
        <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="Categoria"
            value={form.categoria}
            onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
            className="rounded-lg border border-line px-3 py-2 text-sm"
          />
          <input
            placeholder="Valor"
            value={form.valor}
            onChange={(e) => setForm((f) => ({ ...f, valor: e.target.value }))}
            className="rounded-lg border border-line px-3 py-2 text-sm font-ticket"
          />
          <select
            value={form.moeda}
            onChange={(e) => setForm((f) => ({ ...f, moeda: e.target.value }))}
            className="rounded-lg border border-line px-3 py-2 text-sm"
          >
            <option>EUR</option>
            <option>BRL</option>
          </select>
          <select
            value={form.quemPagou}
            onChange={(e) => setForm((f) => ({ ...f, quemPagou: e.target.value }))}
            className="rounded-lg border border-line px-3 py-2 text-sm"
          >
            {QUEM.map((q) => (
              <option key={q}>{q}</option>
            ))}
          </select>
          <input
            placeholder="Meio de pagamento"
            list="meios-pagamento"
            value={form.meioPagamento}
            onChange={(e) => setForm((f) => ({ ...f, meioPagamento: e.target.value }))}
            className="col-span-2 rounded-lg border border-line px-3 py-2 text-sm"
          />
          <datalist id="meios-pagamento">
            <option value="Wise" />
            <option value="Revolut" />
            <option value="Dinheiro" />
          </datalist>
        </div>
        <button onClick={adicionarGasto} className="w-full rounded-lg bg-ink text-paper py-2 text-sm font-medium">
          Adicionar gasto
        </button>
      </div>

      <div className="rounded-2xl bg-brass/10 border border-brass/30 p-3 space-y-1">
        <p className="text-sm font-medium">Total gasto em EUR: € {totalEUR.toFixed(2)}</p>
        <div className="text-xs text-ink-soft flex gap-3">
          {totalPorPessoa.map((t) => (
            <span key={t.quem}>
              {t.quem}: €{t.total.toFixed(2)}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {gastos.map((g) => (
          <div key={g.id} className="flex items-center justify-between rounded-xl bg-paper-raised border border-line p-3">
            <div>
              <p className="text-sm font-medium">{g.categoria}</p>
              <p className="text-xs text-ink-soft">{g.data} · {g.meioPagamento} · {g.quemPagou || "Casal"}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-ticket text-sm">
                {g.moeda === "EUR" ? "€" : "R$"} {g.valor.toFixed(2)}
              </span>
              <button onClick={() => removerGasto(g.id)}>
                <Trash2 size={15} className="text-ink-soft" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {gastos.length > 0 && (
        <button
          onClick={exportarCSV}
          className="flex items-center justify-center gap-1.5 w-full rounded-lg border border-line py-2 text-sm font-medium"
        >
          <Download size={14} /> Exportar gastos (CSV)
        </button>
      )}
    </div>
  );
}
