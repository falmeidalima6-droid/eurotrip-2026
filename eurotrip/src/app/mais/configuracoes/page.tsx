"use client";

import { useEffect, useState } from "react";
import VoltarMais from "@/components/VoltarMais";
import { db, exportarBackup, importarBackup } from "@/lib/db";
import { syncConfigurado, puxarSync } from "@/lib/supabaseSync";
import { Download, Upload, Bell, Share2, RefreshCw, Link2 } from "lucide-react";

export default function ConfiguracoesPage() {
  const [mensagem, setMensagem] = useState("");
  const [notifOk, setNotifOk] = useState<NotificationPermission | null>(null);
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");
  const [syncAtivo, setSyncAtivo] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");

  useEffect(() => {
    if (!db) return;
    db.configuracoes.get("supabase-url").then((r) => r && setSupabaseUrl(r.valor));
    db.configuracoes.get("supabase-anon-key").then((r) => r && setSupabaseKey(r.valor));
    syncConfigurado().then(setSyncAtivo);
  }, []);

  async function salvarSupabase() {
    if (!db) return;
    await db.configuracoes.put({ chave: "supabase-url", valor: supabaseUrl.trim() });
    await db.configuracoes.put({ chave: "supabase-anon-key", valor: supabaseKey.trim() });
    setSyncAtivo(!!supabaseUrl.trim() && !!supabaseKey.trim());
    setSyncMsg("Configuração salva.");
  }

  async function sincronizarAgora() {
    setSyncMsg("Sincronizando...");
    const resultado = await puxarSync();
    setSyncMsg(resultado.mensagem);
  }

  async function baixarBackup() {
    const json = await exportarBackup();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eurotrip-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMensagem("Backup baixado.");
  }

  async function compartilharBackup() {
    const json = await exportarBackup();
    const file = new File([json], "eurotrip-backup.json", { type: "application/json" });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "Backup Eurotrip 2026" });
      } catch {
        // usuário cancelou — sem problema
      }
    } else {
      baixarBackup();
    }
  }

  async function carregarBackup(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const texto = await file.text();
    try {
      await importarBackup(texto);
      setMensagem("Backup restaurado com sucesso.");
    } catch {
      setMensagem("Não foi possível ler esse arquivo de backup.");
    }
  }

  async function pedirNotificacoes() {
    if (!("Notification" in window)) return;
    const perm = await Notification.requestPermission();
    setNotifOk(perm);
  }

  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      <VoltarMais />
      <h1 className="font-display text-xl font-bold">⚙️ Configurações</h1>

      <section className="rounded-2xl bg-paper-raised border border-line p-4 space-y-3">
        <p className="font-medium text-sm">Backup dos seus dados</p>
        <p className="text-xs text-ink-soft">
          Checklist, gastos, lista de compras, notas e planos ativados ficam salvos só neste celular. Exporte um backup para
          guardar ou compartilhar com quem também está usando o app.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={baixarBackup}
            className="inline-flex items-center gap-1.5 text-sm font-medium bg-ink text-paper rounded-full px-4 py-2"
          >
            <Download size={14} /> Exportar dados (JSON)
          </button>
          <button
            onClick={compartilharBackup}
            className="inline-flex items-center gap-1.5 text-sm font-medium bg-brass-soft text-ink rounded-full px-4 py-2"
          >
            <Share2 size={14} /> Backup compartilhável
          </button>
        </div>
        <label className="inline-flex items-center gap-1.5 text-sm font-medium border border-line rounded-full px-4 py-2 cursor-pointer w-fit">
          <Upload size={14} /> Importar backup
          <input type="file" accept="application/json" className="hidden" onChange={carregarBackup} />
        </label>
        {mensagem && <p className="text-xs text-success">{mensagem}</p>}
      </section>

      <section className="rounded-2xl bg-paper-raised border border-line p-4 space-y-3">
        <p className="font-medium text-sm flex items-center gap-1.5">
          <Link2 size={15} /> Sincronizar entre os dois celulares
        </p>
        <p className="text-xs text-ink-soft">
          Opcional. Sincroniza só o essencial (ingressos comprados, plano ativo do dia, gastos) quando houver internet — o
          resto continua só local. Os dois celulares precisam da mesma URL e chave abaixo. Veja o passo a passo no README
          (seção Supabase).
        </p>
        <input
          value={supabaseUrl}
          onChange={(e) => setSupabaseUrl(e.target.value)}
          placeholder="URL do projeto Supabase (https://xxxx.supabase.co)"
          className="w-full rounded-lg border border-line px-3 py-2 text-xs font-ticket"
        />
        <input
          value={supabaseKey}
          onChange={(e) => setSupabaseKey(e.target.value)}
          placeholder="Chave anon/publishable do projeto"
          className="w-full rounded-lg border border-line px-3 py-2 text-xs font-ticket"
        />
        <div className="flex flex-wrap gap-2">
          <button onClick={salvarSupabase} className="rounded-full bg-ink text-paper px-4 py-2 text-xs font-medium">
            Salvar
          </button>
          {syncAtivo && (
            <button
              onClick={sincronizarAgora}
              className="inline-flex items-center gap-1.5 rounded-full bg-brass-soft text-ink px-4 py-2 text-xs font-medium"
            >
              <RefreshCw size={13} /> Sincronizar agora
            </button>
          )}
        </div>
        {syncMsg && <p className="text-xs text-ink-soft">{syncMsg}</p>}
      </section>

      <section className="rounded-2xl bg-paper-raised border border-line p-4 space-y-2">
        <p className="font-medium text-sm">Notificações locais</p>
        <p className="text-xs text-ink-soft">
          Avisos como &quot;sair em 15 min&quot; funcionam offline, direto do celular — sem servidor.
        </p>
        <button
          onClick={pedirNotificacoes}
          className="inline-flex items-center gap-1.5 text-sm font-medium bg-ink text-paper rounded-full px-4 py-2"
        >
          <Bell size={14} /> Ativar notificações
        </button>
        {notifOk && <p className="text-xs text-ink-soft">Status: {notifOk === "granted" ? "ativadas ✅" : "negadas"}</p>}
      </section>

      <section className="rounded-2xl bg-paper-raised border border-line p-4 space-y-1">
        <p className="font-medium text-sm">Instalar no celular</p>
        <p className="text-xs text-ink-soft">
          Android/Chrome: menu ⋮ → &quot;Adicionar à tela inicial&quot;. Segure o ícone depois de instalado para ver atalhos
          rápidos (Agora / Emergência).
        </p>
      </section>
    </div>
  );
}
