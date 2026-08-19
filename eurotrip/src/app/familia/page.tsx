"use client";

import { useEffect, useState } from "react";
import { dias, BANDEIRAS, TRIP_INFO } from "@/data/trip";
import { computarEventosDoDia } from "@/lib/time";
import {
  conferirPin,
  sessaoFamiliaAtiva,
  marcarSessaoFamilia,
  apelidoFamilia,
  salvarApelidoFamilia,
  getConfigFamilia,
  ultimaLocalizacao,
  ultimoStatus,
  getDiario,
  getMomento,
  fotosDoDia,
  comentariosDoDia,
  enviarComentario,
  enviarReacao,
  reacoesDaFoto,
  RegistroLocalizacao,
  StatusFamilia,
  MomentoDia,
  FotoFamilia,
  ComentarioFamilia,
} from "@/lib/familia";
import { urlMiniatura, urlExibicao } from "@/lib/cloudinary";
import { MapPin, Heart, ExternalLink, Lock } from "lucide-react";

function formatarDataExtensa(iso: string): string {
  const [ano, mes, dia] = iso.split("-").map(Number);
  const d = new Date(ano, mes - 1, dia);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });
}

function hojeISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function tempoAtras(iso: string): string {
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 1) return "agora mesmo";
  if (min < 60) return `há ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h}h`;
  return new Date(iso).toLocaleDateString("pt-BR");
}

export default function AreaFamiliaPage() {
  const [autenticado, setAutenticado] = useState(false);
  const [checandoSessao, setChecandoSessao] = useState(true);
  const [pinDigitado, setPinDigitado] = useState("");
  const [erroLogin, setErroLogin] = useState("");

  useEffect(() => {
    if (sessaoFamiliaAtiva()) setAutenticado(true);
    setChecandoSessao(false);
  }, []);

  async function tentarEntrar() {
    setErroLogin("");
    const ok = await conferirPin(pinDigitado);
    if (ok) {
      marcarSessaoFamilia();
      setAutenticado(true);
    } else {
      setErroLogin("PIN incorreto.");
    }
  }

  if (checandoSessao) return null;

  if (!autenticado) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-4 bg-paper">
        <Lock size={28} className="text-ink-soft" />
        <p className="font-display text-lg font-bold text-center">Área Família — Eurotrip 2026</p>
        <p className="text-sm text-ink-soft text-center">Digite o PIN que Fernanda e Marcos compartilharam com você.</p>
        <input
          value={pinDigitado}
          onChange={(e) => setPinDigitado(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && tentarEntrar()}
          type="tel"
          inputMode="numeric"
          placeholder="PIN"
          className="w-40 text-center text-2xl tracking-widest rounded-xl border border-line px-3 py-2"
          autoFocus
        />
        {erroLogin && <p className="text-alert text-sm">{erroLogin}</p>}
        <button onClick={tentarEntrar} className="rounded-full bg-ink text-paper font-medium px-6 py-2.5">
          Entrar
        </button>
      </div>
    );
  }

  return <ConteudoFamilia />;
}

function ConteudoFamilia() {
  const [diaSelecionado, setDiaSelecionado] = useState(hojeISO());
  const [localizacao, setLocalizacao] = useState<RegistroLocalizacao | null>(null);
  const [status, setStatus] = useState<StatusFamilia | null>(null);
  const [diario, setDiario] = useState<string | null>(null);
  const [momento, setMomento] = useState<MomentoDia | null>(null);
  const [fotos, setFotos] = useState<FotoFamilia[]>([]);
  const [comentarios, setComentarios] = useState<ComentarioFamilia[]>([]);
  const [albumUrl, setAlbumUrl] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [novoComentario, setNovoComentario] = useState("");
  const [apelido, setApelido] = useState<string | null>(null);
  const [apelidoInput, setApelidoInput] = useState("");

  const diaRoteiro = dias.find((d) => d.data === diaSelecionado);
  const idxRoteiro = dias.findIndex((d) => d.data === diaSelecionado);
  const proximaCidade = idxRoteiro >= 0 ? dias.slice(idxRoteiro + 1).find((d) => d.cidade !== diaRoteiro?.cidade) : null;

  useEffect(() => {
    setApelido(apelidoFamilia());
  }, []);

  useEffect(() => {
    setCarregando(true);
    (async () => {
      const [loc, st, di, mo, fo, co, al] = await Promise.all([
        diaSelecionado === hojeISO() ? ultimaLocalizacao() : Promise.resolve(null),
        diaSelecionado === hojeISO() ? ultimoStatus() : Promise.resolve(null),
        getDiario(diaSelecionado),
        getMomento(diaSelecionado),
        fotosDoDia(diaSelecionado),
        comentariosDoDia(diaSelecionado),
        getConfigFamilia("album_google_photos_url"),
      ]);
      setLocalizacao(loc);
      setStatus(st);
      setDiario(di);
      setMomento(mo);
      setFotos(fo);
      setComentarios(co);
      setAlbumUrl(al);
      setCarregando(false);
    })();
  }, [diaSelecionado]);

  async function publicarComentario() {
    if (!novoComentario.trim()) return;
    let nome = apelido;
    if (!nome) {
      const digitado = apelidoInput.trim() || "Família";
      salvarApelidoFamilia(digitado);
      setApelido(digitado);
      nome = digitado;
    }
    await enviarComentario(diaSelecionado, nome, novoComentario.trim());
    setComentarios((c) => [...c, { id: Date.now(), data: diaSelecionado, autor: nome!, texto: novoComentario.trim(), criado_em: new Date().toISOString() }]);
    setNovoComentario("");
  }

  const eventosComputados = diaRoteiro ? computarEventosDoDia(diaRoteiro) : [];

  return (
    <div className="max-w-md mx-auto px-4 pt-6 pb-10 space-y-5">
      <header className="text-center space-y-1">
        <p className="text-2xl">🌍</p>
        <h1 className="font-display text-xl font-bold">{TRIP_INFO.titulo}</h1>
        <p className="text-ink-soft text-sm">{TRIP_INFO.viajantes}</p>
      </header>

      <div className="text-center">
        <p className="text-xs font-medium text-brass">
          {new Date(diaSelecionado + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
          {diaRoteiro ? ` — ${diaRoteiro.cidade} ${BANDEIRAS[diaRoteiro.pais]}` : localizacao?.cidade ? ` — ${localizacao.cidade}` : ""}
        </p>
        {!diaRoteiro && (
          <p className="text-[11px] text-ink-soft mt-0.5">Fora do período oficial da viagem (04/10 a 17/10)</p>
        )}
      </div>

      <div className="rounded-2xl bg-ink text-paper px-4 py-2.5 flex items-center justify-between">
        <span className="font-medium text-sm">
          {formatarDataExtensa(diaSelecionado)}
          {diaRoteiro ? ` — ${diaRoteiro.cidade} ${BANDEIRAS[diaRoteiro.pais]}` : diaSelecionado === hojeISO() ? " (fora do período da viagem)" : ""}
        </span>
        {diaSelecionado !== hojeISO() && (
          <button onClick={() => setDiaSelecionado(hojeISO())} className="text-xs underline text-paper/80 shrink-0 ml-2">
            ir para hoje
          </button>
        )}
      </div>

      {diaSelecionado === hojeISO() && localizacao && (
        <section className="rounded-2xl bg-paper-raised border border-line p-4 space-y-2">
          <p className="text-xs font-medium text-success flex items-center gap-1.5">🟢 ONDE ESTAMOS</p>
          <p className="font-medium">
            📍 {localizacao.local_texto || localizacao.cidade} {localizacao.cidade ? BANDEIRAS[localizacao.pais as keyof typeof BANDEIRAS] || "" : ""}
          </p>
          <p className="text-xs text-ink-soft">Atualizado {tempoAtras(localizacao.criado_em)}</p>
          {localizacao.lat && localizacao.lng && (
            <a
              href={`https://maps.google.com/?q=${localizacao.lat},${localizacao.lng}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium bg-ink text-paper rounded-full px-3 py-1.5 mt-1"
            >
              <MapPin size={12} /> Ver no mapa
            </a>
          )}
        </section>
      )}

      {diaRoteiro && (
        <section className="rounded-2xl bg-paper-raised border border-line p-4 space-y-3">
          <p className="font-display font-semibold">
            {BANDEIRAS[diaRoteiro.pais]} {diaRoteiro.cidade.toUpperCase()}
          </p>
          <p className="text-xs font-medium text-ink-soft">HOJE — {diaRoteiro.titulo}</p>
          <ul className="space-y-1 text-sm">
            {eventosComputados.slice(0, 8).map((ev) => (
              <li key={ev.id} className="flex items-center gap-2">
                <span>{ev.statusComputado === "concluido" ? "✓" : ev.statusComputado === "agora" ? "●" : "○"}</span>
                <span className={ev.statusComputado === "concluido" ? "text-ink-soft line-through" : ""}>{ev.titulo}</span>
              </li>
            ))}
          </ul>
          {proximaCidade && (
            <p className="text-xs text-brass border-t border-line pt-2">
              ➡️ Próxima cidade: {proximaCidade.cidade} {BANDEIRAS[proximaCidade.pais]}
            </p>
          )}
        </section>
      )}

      <ProgressaoCidades atual={diaRoteiro?.cidade} />

      {!carregando && fotos.length > 0 && (
        <section className="space-y-2">
          <p className="text-xs font-medium text-ink-soft">📸 EM FOTOS</p>
          <div className="grid grid-cols-3 gap-1.5">
            {fotos.map((f) => (
              <FotoComReacao key={f.id} foto={f} apelido={apelido} onPedirApelido={setApelidoInput} apelidoInput={apelidoInput} />
            ))}
          </div>
          {albumUrl && (
            <a
              href={albumUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-brass mt-1"
            >
              Ver álbum completo <ExternalLink size={11} />
            </a>
          )}
        </section>
      )}

      {!carregando && momento?.foto_url && (
        <section className="rounded-2xl bg-paper-raised border border-line p-4 space-y-2">
          <p className="text-xs font-medium text-ink-soft">❤️ MOMENTO DO DIA</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={urlExibicao(momento.foto_url)} alt="Momento do dia" className="w-full rounded-xl object-cover" loading="lazy" />
          {momento.frase && <p className="italic text-sm">&ldquo;{momento.frase}&rdquo;</p>}
        </section>
      )}

      {!carregando && diario && (
        <section className="rounded-2xl bg-paper-raised border border-line p-4 space-y-1">
          <p className="text-xs font-medium text-ink-soft">📖 NOSSO DIA</p>
          <p className="text-sm whitespace-pre-wrap">{diario}</p>
        </section>
      )}

      {diaSelecionado === hojeISO() && status && (
        <section className="rounded-2xl bg-success/10 border border-success/30 p-4 space-y-1">
          <p className="text-xs font-medium text-success flex items-center gap-1.5">
            <Heart size={13} /> {status.texto.toUpperCase()}
          </p>
          <p className="text-xs text-ink-soft">
            {status.cidade} · última confirmação {tempoAtras(status.criado_em)}
          </p>
        </section>
      )}

      <section className="rounded-2xl bg-paper-raised border border-line p-4 space-y-3">
        <p className="text-xs font-medium text-ink-soft">💬 FAMÍLIA</p>
        {comentarios.map((c) => (
          <p key={c.id} className="text-sm">
            <span className="font-medium">{c.autor}:</span> {c.texto}
          </p>
        ))}
        {!apelido && (
          <input
            value={apelidoInput}
            onChange={(e) => setApelidoInput(e.target.value)}
            placeholder="Seu nome (só na primeira vez)"
            className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm"
          />
        )}
        <div className="flex gap-2">
          <input
            value={novoComentario}
            onChange={(e) => setNovoComentario(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && publicarComentario()}
            placeholder="Escreva um comentário..."
            className="flex-1 rounded-xl border border-line bg-paper px-3 py-2 text-sm"
          />
          <button onClick={publicarComentario} className="rounded-full bg-ink text-paper font-medium px-4 text-sm">
            Enviar
          </button>
        </div>
      </section>

      <HistoricoDias diaSelecionado={diaSelecionado} onSelecionar={setDiaSelecionado} />
    </div>
  );
}

function ProgressaoCidades({ atual }: { atual?: string }) {
  const sequencia: string[] = [];
  dias.forEach((d) => {
    if (sequencia[sequencia.length - 1] !== d.cidade) sequencia.push(d.cidade);
  });
  const idxAtual = atual ? sequencia.indexOf(atual) : -1;

  return (
    <section className="rounded-2xl bg-paper-raised border border-line p-4">
      <p className="text-xs font-medium text-ink-soft mb-2">ROTEIRO DA VIAGEM</p>
      <div className="flex flex-wrap items-center gap-1.5 text-sm">
        {sequencia.map((cidade, i) => (
          <span key={cidade} className="flex items-center gap-1.5">
            <span
              className={
                i < idxAtual
                  ? "text-ink-soft"
                  : i === idxAtual
                  ? "font-bold text-brass"
                  : "text-ink-soft/50"
              }
            >
              {cidade}
              {i < idxAtual ? " ✓" : ""}
            </span>
            {i < sequencia.length - 1 && <span className="text-ink-soft/40">→</span>}
          </span>
        ))}
      </div>
      {idxAtual >= 0 && <p className="text-xs text-brass mt-2">📍 Vocês estão aqui</p>}
    </section>
  );
}

function HistoricoDias({ diaSelecionado, onSelecionar }: { diaSelecionado: string; onSelecionar: (d: string) => void }) {
  return (
    <section className="space-y-2">
      <p className="text-xs font-medium text-ink-soft">HISTÓRICO DA VIAGEM</p>
      <div className="space-y-1.5">
        {dias.map((d) => (
          <button
            key={d.data}
            onClick={() => onSelecionar(d.data)}
            className={`w-full text-left rounded-xl border px-3 py-2 text-sm flex items-center justify-between ${
              d.data === diaSelecionado ? "border-brass bg-brass/10" : "border-line bg-paper-raised"
            }`}
          >
            <span>
              {d.data.split("-").reverse().slice(0, 2).join("/")} — {d.cidade} {BANDEIRAS[d.pais]}
            </span>
            {d.data === hojeISO() && <span className="text-[10px] text-brass font-medium">HOJE</span>}
          </button>
        ))}
      </div>
    </section>
  );
}

function FotoComReacao({
  foto,
  apelido,
  apelidoInput,
  onPedirApelido,
}: {
  foto: FotoFamilia;
  apelido: string | null;
  apelidoInput: string;
  onPedirApelido: (v: string) => void;
}) {
  const [reacoes, setReacoes] = useState<Record<string, number>>({});

  useEffect(() => {
    reacoesDaFoto(foto.id).then(setReacoes);
  }, [foto.id]);

  async function reagir(emoji: string) {
    const nome = apelido || apelidoInput.trim() || "Família";
    if (!apelido) salvarApelidoFamilia(nome);
    await enviarReacao(foto.id, emoji, nome);
    setReacoes((r) => ({ ...r, [emoji]: (r[emoji] || 0) + 1 }));
  }

  return (
    <div className="space-y-1">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={urlMiniatura(foto.url)} alt="" loading="lazy" className="w-full aspect-square object-cover rounded-lg" />
      <div className="flex gap-1 flex-wrap">
        {["❤️", "😍", "😂", "👏"].map((e) => (
          <button key={e} onClick={() => reagir(e)} className="text-xs bg-paper-raised border border-line rounded-full px-1.5 py-0.5">
            {e} {reacoes[e] || ""}
          </button>
        ))}
      </div>
    </div>
  );
}
