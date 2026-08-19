"use client";

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { db } from "./db";

let cliente: SupabaseClient | null = null;
let urlAtual = "";
let chaveAtual = "";

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
