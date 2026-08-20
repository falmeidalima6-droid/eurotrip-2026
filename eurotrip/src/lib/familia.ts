"use client";

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { db } from "./db";

// A Área Família precisa funcionar em QUALQUER celular (família toda),
// não só no celular de Fernanda/Marcos — por isso a URL e a chave pública
// (anon) ficam fixas aqui, em vez de dependerem da configuração local do
// app privado. A chave "anon" é feita para ser pública; ela não dá acesso
// a nada que as regras de segurança (RLS) da Supabase não permitam.
const SUPABASE_URL_PADRAO = "https://znbkfwkmdsohatoenwbx.supabase.co";
const SUPABASE_ANON_KEY_PADRAO =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuYmtmd2ttZHNvaGF0b2Vud2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2NTUwNzQsImV4cCI6MjEwMjIzMTA3NH0.X0DTlnrwdgW7fPX8y0Tmp16jV1v88wMJppusxHbWuSc";

let cliente: SupabaseClient | null = null;

async function obterCliente(): Promise<SupabaseClient | null> {
  if (cliente) return cliente;
  // Se o app privado já tiver uma config própria salva localmente, respeita
  // ela; senão (caso comum: celular de um familiar), usa a padrão fixa acima.
  let url = SUPABASE_URL_PADRAO;
  let chave = SUPABASE_ANON_KEY_PADRAO;
  if (db) {
    const urlLocal = (await db.configuracoes.get("supabase-url"))?.valor;
    const chaveLocal = (await db.configuracoes.get("supabase-anon-key"))?.valor;
    if (urlLocal) url = urlLocal;
    if (chaveLocal) chave = chaveLocal;
  }
  cliente = createClient(url, chave);
  return cliente;
}

// -------- Config (PIN, on/off, álbum) --------
export async function getConfigFamilia(chave: string): Promise<string | null> {
  const sb = await obterCliente();
  if (!sb) return null;
  const { data } = await sb.from("familia_config").select("valor").eq("chave", chave).maybeSingle();
  return data?.valor ?? null;
}

export async function setConfigFamilia(chave: string, valor: string): Promise<void> {
  const sb = await obterCliente();
  if (!sb) return;
  await sb.from("familia_config").upsert({ chave, valor });
}

// -------- PIN / sessão --------
export async function conferirPin(pin: string): Promise<boolean> {
  const pinSalvo = await getConfigFamilia("pin");
  return !!pinSalvo && pin.trim() === pinSalvo.trim();
}

export function sessaoFamiliaAtiva(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("eurotrip-familia-sessao") === "ok";
}

export function marcarSessaoFamilia(): void {
  if (typeof window !== "undefined") localStorage.setItem("eurotrip-familia-sessao", "ok");
}

export function apelidoFamilia(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("eurotrip-familia-apelido");
}

export function salvarApelidoFamilia(nome: string): void {
  if (typeof window !== "undefined") localStorage.setItem("eurotrip-familia-apelido", nome);
}

// -------- Localização --------
export interface RegistroLocalizacao {
  id: number;
  data: string;
  cidade: string | null;
  pais: string | null;
  local_texto: string | null;
  lat: number | null;
  lng: number | null;
  criado_em: string;
}

export async function registrarLocalizacao(reg: {
  data: string;
  cidade: string;
  pais: string;
  local_texto: string;
  lat?: number;
  lng?: number;
}): Promise<void> {
  const sb = await obterCliente();
  if (!sb) return;
  await sb.from("familia_localizacao").insert(reg);
}

export async function ultimaLocalizacao(): Promise<RegistroLocalizacao | null> {
  const sb = await obterCliente();
  if (!sb) return null;
  const { data } = await sb
    .from("familia_localizacao")
    .select("*")
    .order("criado_em", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data as RegistroLocalizacao | null;
}

export async function localizacoesDoDia(data: string): Promise<RegistroLocalizacao[]> {
  const sb = await obterCliente();
  if (!sb) return [];
  const { data: rows } = await sb
    .from("familia_localizacao")
    .select("*")
    .eq("data", data)
    .order("criado_em", { ascending: true });
  return (rows as RegistroLocalizacao[]) || [];
}

// -------- Diário --------
export async function salvarDiario(data: string, texto: string): Promise<void> {
  const sb = await obterCliente();
  if (!sb) return;
  await sb.from("familia_diario").upsert({ data, texto, atualizado_em: new Date().toISOString() });
}

export async function getDiario(data: string): Promise<string | null> {
  const sb = await obterCliente();
  if (!sb) return null;
  const { data: row } = await sb.from("familia_diario").select("texto").eq("data", data).maybeSingle();
  return row?.texto ?? null;
}

// -------- Momento do dia --------
export interface MomentoDia {
  foto_url: string | null;
  frase: string | null;
}

export async function salvarMomento(data: string, fotoUrl: string, frase: string): Promise<void> {
  const sb = await obterCliente();
  if (!sb) return;
  await sb.from("familia_momento").upsert({ data, foto_url: fotoUrl, frase, atualizado_em: new Date().toISOString() });
}

export async function getMomento(data: string): Promise<MomentoDia | null> {
  const sb = await obterCliente();
  if (!sb) return null;
  const { data: row } = await sb.from("familia_momento").select("foto_url, frase").eq("data", data).maybeSingle();
  return (row as MomentoDia) || null;
}

// -------- Estamos bem --------
export async function registrarEstamosBem(cidade: string): Promise<void> {
  const sb = await obterCliente();
  if (!sb) return;
  await sb.from("familia_status").insert({ texto: "Tudo certo por aqui", cidade });
}

export interface StatusFamilia {
  texto: string;
  cidade: string | null;
  criado_em: string;
}

export async function ultimoStatus(): Promise<StatusFamilia | null> {
  const sb = await obterCliente();
  if (!sb) return null;
  const { data } = await sb
    .from("familia_status")
    .select("texto, cidade, criado_em")
    .order("criado_em", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data as StatusFamilia | null;
}

// -------- Fotos --------
export interface FotoFamilia {
  id: number;
  data: string;
  url: string;
  ordem: number;
  criado_em: string;
}

export async function adicionarFoto(data: string, url: string): Promise<void> {
  const sb = await obterCliente();
  if (!sb) return;
  await sb.from("familia_fotos").insert({ data, url });
}

export async function fotosDoDia(data: string): Promise<FotoFamilia[]> {
  const sb = await obterCliente();
  if (!sb) return [];
  const { data: rows } = await sb
    .from("familia_fotos")
    .select("*")
    .eq("data", data)
    .order("criado_em", { ascending: true });
  return (rows as FotoFamilia[]) || [];
}

export async function excluirFoto(id: number): Promise<void> {
  const sb = await obterCliente();
  if (!sb) return;
  await sb.from("familia_fotos").delete().eq("id", id);
}

// -------- Comentários --------
export interface ComentarioFamilia {
  id: number;
  data: string;
  autor: string;
  texto: string;
  criado_em: string;
}

export async function comentariosDoDia(data: string): Promise<ComentarioFamilia[]> {
  const sb = await obterCliente();
  if (!sb) return [];
  const { data: rows } = await sb
    .from("familia_comentarios")
    .select("*")
    .eq("data", data)
    .order("criado_em", { ascending: true });
  return (rows as ComentarioFamilia[]) || [];
}

export async function enviarComentario(data: string, autor: string, texto: string): Promise<void> {
  const sb = await obterCliente();
  if (!sb) return;
  await sb.from("familia_comentarios").insert({ data, autor, texto });
}

export async function excluirComentario(id: number): Promise<void> {
  const sb = await obterCliente();
  if (!sb) return;
  await sb.from("familia_comentarios").delete().eq("id", id);
}

// -------- Reações --------
export async function enviarReacao(fotoId: number, emoji: string, autor: string): Promise<void> {
  const sb = await obterCliente();
  if (!sb) return;
  await sb.from("familia_reacoes").insert({ foto_id: fotoId, emoji, autor });
}

export async function reacoesDaFoto(fotoId: number): Promise<Record<string, number>> {
  const sb = await obterCliente();
  if (!sb) return {};
  const { data } = await sb.from("familia_reacoes").select("emoji").eq("foto_id", fotoId);
  const contagem: Record<string, number> = {};
  (data || []).forEach((r: { emoji: string }) => {
    contagem[r.emoji] = (contagem[r.emoji] || 0) + 1;
  });
  return contagem;
}
