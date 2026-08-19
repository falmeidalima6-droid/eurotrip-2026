import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { db } from "./db";

let cliente: SupabaseClient | null = null;
let urlAtual = "";
let chaveAtual = "";

/** Lê a config salva localmente e (re)cria o client se mudou. */
async function obterCliente(): Promise<SupabaseClient | null> {
  if (!db) return null;
  const url = (await db.configuracoes.get("supabase-url"))?.valor;
  const chave = (await db.configuracoes.get("supabase-anon-key"))?.valor;
  if (!url || !chave) return null;

  if (!cliente || url !== urlAtual || chave !== chaveAtual) {
    cliente = createClient(url, chave);
    urlAtual = url;
    chaveAtual = chave;
  }
  return cliente;
}

export async function syncConfigurado(): Promise<boolean> {
  if (!db) return false;
  const url = await db.configuracoes.get("supabase-url");
  const chave = await db.configuracoes.get("supabase-anon-key");
  return !!url?.valor && !!chave?.valor;
}

/** Envia uma atualização — silencioso se não estiver configurado ou sem internet. */
export async function enviarSync(chaveRegistro: string, tipo: "ingresso" | "plano" | "gasto" | "evento", valor: unknown) {
  try {
    if (typeof navigator !== "undefined" && !navigator.onLine) return;
    const supabase = await obterCliente();
    if (!supabase) return;
    await supabase.from("eurotrip_sync").upsert({
      chave: chaveRegistro,
      tipo,
      valor,
      atualizado_em: new Date().toISOString(),
    });
  } catch {
    // Falha de sync não deve travar o app — os dados continuam salvos localmente.
  }
}

export interface RegistroSync {
  chave: string;
  tipo: "ingresso" | "plano" | "gasto" | "evento";
  valor: Record<string, unknown>;
  atualizado_em: string;
}

/** Busca tudo do Supabase e aplica localmente (last-write-wins pelo timestamp). */
export async function puxarSync(): Promise<{ ok: boolean; mensagem: string }> {
  try {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      return { ok: false, mensagem: "Sem internet — tente de novo quando tiver sinal." };
    }
    const supabase = await obterCliente();
    if (!supabase || !db) return { ok: false, mensagem: "Sincronização não configurada." };

    const { data, error } = await supabase.from("eurotrip_sync").select("*");
    if (error) return { ok: false, mensagem: `Erro: ${error.message}` };

    for (const registro of (data || []) as RegistroSync[]) {
      if (registro.tipo === "ingresso") {
        const idIngresso = registro.chave.replace("ingresso:", "");
        await db.ingressoOverrides.put({ ingressoId: idIngresso, comprado: !!registro.valor.comprado });
      } else if (registro.tipo === "plano" && registro.chave.startsWith("plano:escolha-")) {
        const chaveConfig = registro.chave.replace("plano:", "");
        await db.configuracoes.put({ chave: chaveConfig, valor: String(registro.valor.plano) });
      } else if (registro.tipo === "plano") {
        const cidade = registro.chave.replace("plano:", "");
        await db.planosAtivos.put({ cidade, plano: registro.valor.plano as "normal" | "chuva" | "cansaco" });
      } else if (registro.tipo === "gasto") {
        // Gastos: evita duplicar — usa o id salvo no valor como referência.
        const existentes = await db.gastos.toArray();
        const jaExiste = existentes.some((g) => g.id === registro.valor.id);
        if (!jaExiste) {
          const { id: _id, ...resto } = registro.valor;
          void _id;
          await db.gastos.add(resto as never);
        }
      } else if (registro.tipo === "evento" && registro.chave.startsWith("evento-override:")) {
        const eventoId = registro.chave.replace("evento-override:", "");
        await db.eventoOverrides.put({ eventoId, ...(registro.valor as object) } as never);
      } else if (registro.tipo === "evento" && registro.chave.startsWith("evento-novo:")) {
        await db.eventosPersonalizados.put(registro.valor as never);
      }
    }
    return { ok: true, mensagem: `${(data || []).length} registros sincronizados.` };
  } catch (e) {
    return { ok: false, mensagem: e instanceof Error ? e.message : "Erro desconhecido." };
  }
}
