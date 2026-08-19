"use client";

import { useEffect, useRef, useState } from "react";
import VoltarMais from "@/components/VoltarMais";
import { useHoje } from "@/lib/useHoje";
import { enviarFotoCloudinary } from "@/lib/cloudinary";
import { db } from "@/lib/db";
import {
  getConfigFamilia,
  setConfigFamilia,
  registrarLocalizacao,
  registrarEstamosBem,
  salvarDiario,
  getDiario,
  salvarMomento,
  getMomento,
  adicionarFoto,
  fotosDoDia,
  excluirFoto,
  comentariosDoDia,
  excluirComentario,
} from "@/lib/familia";
import {
  MapPin,
  Heart,
  BookHeart,
  Camera,
  Link as LinkIcon,
  MessageSquare,
  KeyRound,
  ExternalLink,
  Trash2,
  Check,
  Loader2,
} from "lucide-react";

function hojeISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function FamiliaPainelPage() {
  const { dia } = useHoje();
  const dataHoje = hojeISO();

  const [areaAtiva, setAreaAtiva] = useState(true);
  const [localizacaoAtiva, setLocalizacaoAtiva] = useState(true);
  const [pin, setPin] = useState("");
  const [novoPin, setNovoPin] = useState("");
  const [albumUrl, setAlbumUrl] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const [textoLocal, setTextoLocal] = useState("");
  const [enviandoLocalizacao, setEnviandoLocalizacao] = useState(false);

  const [diarioTexto, setDiarioTexto] = useState("");
  const [salvandoDiario, setSalvandoDiario] = useState(false);

  const [momentoFrase, setMomentoFrase] = useState("");
  const [momentoFotoUrl, setMomentoFotoUrl] = useState<string | null>(null);
  const [enviandoMomento, setEnviandoMomento] = useState(false);

  const [fotos, setFotos] = useState<{ id: number; url: string }[]>([]);
  const [enviandoFotos, setEnviandoFotos] = useState(false);

  const [comentarios, setComentarios] = useState<{ id: number; autor: string; texto: string }[]>([]);

  const inputMomento = useRef<HTMLInputElement>(null);
  const inputFotos = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const [a, l, p, al, diarioSalvo, momentoSalvo, fotosSalvas, comentariosSalvos] = await Promise.all([
        getConfigFamilia("area_ativa"),
        getConfigFamilia("localizacao_ativa"),
        getConfigFamilia("pin"),
        getConfigFamilia("album_google_photos_url"),
        getDiario(dataHoje),
        getMomento(dataHoje),
        fotosDoDia(dataHoje),
        comentariosDoDia(dataHoje),
      ]);
      setAreaAtiva(a !== "false");
      setLocalizacaoAtiva(l !== "false");
      setPin(p || "");
      setAlbumUrl(al || "");
      if (diarioSalvo) setDiarioTexto(diarioSalvo);
      if (momentoSalvo) {
        setMomentoFrase(momentoSalvo.frase || "");
        setMomentoFotoUrl(momentoSalvo.foto_url);
      }
      setFotos(fotosSalvas.map((f) => ({ id: f.id, url: f.url })));
      setComentarios(comentariosSalvos.map((c) => ({ id: c.id, autor: c.autor, texto: c.texto })));
      if (dia) setTextoLocal(`Em ${dia.cidade}`);
      setCarregando(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function avisar(msg: string) {
    setMensagem(msg);
    setTimeout(() => setMensagem(null), 2500);
  }

  async function toggleAreaAtiva() {
    const novo = !areaAtiva;
    setAreaAtiva(novo);
    await setConfigFamilia("area_ativa", String(novo));
  }

  async function toggleLocalizacaoAtiva() {
    const novo = !localizacaoAtiva;
    setLocalizacaoAtiva(novo);
    await setConfigFamilia("localizacao_ativa", String(novo));
  }

  async function atualizarLocalizacao() {
    if (!dia) return;
    setEnviandoLocalizacao(true);
    try {
      let lat: number | undefined;
      let lng: number | undefined;
      if (localizacaoAtiva && "geolocation" in navigator) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 })
          );
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        } catch {
          // segue sem coordenadas se o GPS falhar/negar — o texto ainda é enviado
        }
      }
      await registrarLocalizacao({
        data: dataHoje,
        cidade: dia.cidade,
        pais: dia.pais,
        local_texto: textoLocal || dia.cidade,
        lat,
        lng,
      });
      avisar("Localização atualizada!");
    } finally {
      setEnviandoLocalizacao(false);
    }
  }

  async function marcarEstamosBem() {
    if (!dia) return;
    await registrarEstamosBem(dia.cidade);
    avisar("Avisado à família ✅");
  }

  async function salvarDiarioHoje() {
    setSalvandoDiario(true);
    try {
      await salvarDiario(dataHoje, diarioTexto);
      avisar("Diário salvo!");
    } finally {
      setSalvandoDiario(false);
    }
  }

  async function selecionarFotoMomento(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setEnviandoMomento(true);
    try {
      const url = await enviarFotoCloudinary(file);
      setMomentoFotoUrl(url);
      await salvarMomento(dataHoje, url, momentoFrase);
      avisar("Momento do dia salvo!");
    } catch {
      avisar("Não consegui enviar a foto — tente de novo.");
    } finally {
      setEnviandoMomento(false);
      if (inputMomento.current) inputMomento.current.value = "";
    }
  }

  async function salvarFraseMomento() {
    if (!momentoFotoUrl) return;
    await salvarMomento(dataHoje, momentoFotoUrl, momentoFrase);
    avisar("Frase salva!");
  }

  async function selecionarFotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setEnviandoFotos(true);
    try {
      for (const file of files) {
        try {
          const url = await enviarFotoCloudinary(file);
          await adicionarFoto(dataHoje, url);
          setFotos((f) => [...f, { id: Date.now() + Math.random(), url }]);
        } catch {
          if (db) {
            await db.fotosPendentes.add({
              data: dataHoje,
              nomeArquivo: file.name,
              blob: file,
              status: "pendente",
              criadoEm: new Date().toISOString(),
            });
          }
        }
      }
      avisar("Fotos publicadas para a família!");
    } finally {
      setEnviandoFotos(false);
      if (inputFotos.current) inputFotos.current.value = "";
    }
  }

  async function removerFoto(id: number) {
    await excluirFoto(id);
    setFotos((f) => f.filter((foto) => foto.id !== id));
  }

  async function removerComentario(id: number) {
    await excluirComentario(id);
    setComentarios((c) => c.filter((com) => com.id !== id));
  }

  async function salvarNovoPin() {
    if (!novoPin.trim()) return;
    await setConfigFamilia("pin", novoPin.trim());
    setPin(novoPin.trim());
    setNovoPin("");
    avisar("PIN alterado!");
  }

  async function salvarAlbum() {
    await setConfigFamilia("album_google_photos_url", albumUrl.trim());
    avisar("Link do álbum salvo!");
  }

  if (carregando) {
    return (
      <div className="px-4 pt-4 pb-6">
        <VoltarMais />
        <p className="mt-6 text-ink-soft text-sm">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-6 space-y-5">
      <VoltarMais />
      <div>
        <h1 className="font-display text-xl font-bold">👨‍👩‍👧 Compartilhamento Família</h1>
        <p className="text-xs text-ink-soft mt-1">
          A família acompanha em <span className="font-medium">/familia</span>, protegido por PIN. Nada de documentos,
          reservas ou dados financeiros aparece lá.
        </p>
      </div>

      {mensagem && (
        <div className="rounded-xl bg-success/10 text-success text-sm font-medium px-3 py-2 flex items-center gap-2">
          <Check size={15} /> {mensagem}
        </div>
      )}

      <section className="rounded-2xl bg-paper-raised border border-line p-4 space-y-3">
        <Toggle label="Área Família" ativo={areaAtiva} onToggle={toggleAreaAtiva} />
        <Toggle label="Localização inteligente (por evento, não contínua)" ativo={localizacaoAtiva} onToggle={toggleLocalizacaoAtiva} />
      </section>

      <section className="rounded-2xl bg-paper-raised border border-line p-4 space-y-3">
        <p className="text-xs font-medium text-ink-soft flex items-center gap-1.5">
          <MapPin size={14} /> ONDE ESTAMOS
        </p>
        <input
          value={textoLocal}
          onChange={(e) => setTextoLocal(e.target.value)}
          placeholder="Ex: Perto da Fontana di Trevi"
          className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm"
        />
        <button
          onClick={atualizarLocalizacao}
          disabled={enviandoLocalizacao || !dia}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-ink text-paper font-medium py-2.5 disabled:opacity-50"
        >
          {enviandoLocalizacao ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
          Atualizar localização agora
        </button>
      </section>

      <button
        onClick={marcarEstamosBem}
        disabled={!dia}
        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-success text-white font-medium py-3 disabled:opacity-50"
      >
        <Heart size={16} /> Estamos bem
      </button>

      <section className="rounded-2xl bg-paper-raised border border-line p-4 space-y-3">
        <p className="text-xs font-medium text-ink-soft flex items-center gap-1.5">
          <BookHeart size={14} /> DIÁRIO DE HOJE
        </p>
        <textarea
          value={diarioTexto}
          onChange={(e) => setDiarioTexto(e.target.value)}
          rows={4}
          placeholder="Como foi nosso dia?"
          className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm"
        />
        <button
          onClick={salvarDiarioHoje}
          disabled={salvandoDiario}
          className="w-full rounded-full bg-ink text-paper font-medium py-2.5 disabled:opacity-50"
        >
          {salvandoDiario ? "Salvando..." : "Publicar/Atualizar diário"}
        </button>
      </section>

      <section className="rounded-2xl bg-paper-raised border border-line p-4 space-y-3">
        <p className="text-xs font-medium text-ink-soft flex items-center gap-1.5">
          <Heart size={14} /> MOMENTO DO DIA
        </p>
        {momentoFotoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={momentoFotoUrl} alt="Momento do dia" className="w-full rounded-xl object-cover max-h-56" />
        )}
        <input ref={inputMomento} type="file" accept="image/*" onChange={selecionarFotoMomento} className="hidden" />
        <button
          onClick={() => inputMomento.current?.click()}
          disabled={enviandoMomento}
          className="w-full rounded-full border border-line font-medium py-2.5 disabled:opacity-50"
        >
          {enviandoMomento ? "Enviando..." : momentoFotoUrl ? "Trocar foto" : "Escolher foto"}
        </button>
        <input
          value={momentoFrase}
          onChange={(e) => setMomentoFrase(e.target.value)}
          onBlur={salvarFraseMomento}
          placeholder="Uma frase curta sobre esse momento..."
          className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm"
        />
      </section>

      <section className="rounded-2xl bg-paper-raised border border-line p-4 space-y-3">
        <p className="text-xs font-medium text-ink-soft flex items-center gap-1.5">
          <Camera size={14} /> COMPARTILHAR FOTOS DE HOJE
        </p>
        {fotos.length > 0 && (
          <div className="grid grid-cols-3 gap-1.5">
            {fotos.map((f) => (
              <div key={f.id} className="relative aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.url} alt="" className="w-full h-full object-cover rounded-lg" />
                <button
                  onClick={() => removerFoto(f.id)}
                  aria-label="Remover foto"
                  className="absolute top-1 right-1 bg-ink/70 text-white rounded-full p-1"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ))}
          </div>
        )}
        <input ref={inputFotos} type="file" accept="image/*" multiple onChange={selecionarFotos} className="hidden" />
        <button
          onClick={() => inputFotos.current?.click()}
          disabled={enviandoFotos}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-ink text-paper font-medium py-2.5 disabled:opacity-50"
        >
          {enviandoFotos ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
          {enviandoFotos ? "Enviando..." : "Escolher fotos"}
        </button>
      </section>

      <section className="rounded-2xl bg-paper-raised border border-line p-4 space-y-3">
        <p className="text-xs font-medium text-ink-soft flex items-center gap-1.5">
          <LinkIcon size={14} /> ÁLBUM GOOGLE PHOTOS (opcional)
        </p>
        <input
          value={albumUrl}
          onChange={(e) => setAlbumUrl(e.target.value)}
          onBlur={salvarAlbum}
          placeholder="Cole o link do álbum compartilhado"
          className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm"
        />
      </section>

      {comentarios.length > 0 && (
        <section className="rounded-2xl bg-paper-raised border border-line p-4 space-y-2">
          <p className="text-xs font-medium text-ink-soft flex items-center gap-1.5">
            <MessageSquare size={14} /> COMENTÁRIOS DE HOJE
          </p>
          {comentarios.map((c) => (
            <div key={c.id} className="flex items-start justify-between gap-2 text-sm border-t border-line pt-2 first:border-t-0 first:pt-0">
              <p>
                <span className="font-medium">{c.autor}:</span> {c.texto}
              </p>
              <button onClick={() => removerComentario(c.id)} className="text-ink-soft shrink-0">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </section>
      )}

      <section className="rounded-2xl bg-paper-raised border border-line p-4 space-y-3">
        <p className="text-xs font-medium text-ink-soft flex items-center gap-1.5">
          <KeyRound size={14} /> PIN ATUAL: {pin || "não definido"}
        </p>
        <div className="flex gap-2">
          <input
            value={novoPin}
            onChange={(e) => setNovoPin(e.target.value)}
            placeholder="Novo PIN"
            className="flex-1 rounded-xl border border-line bg-paper px-3 py-2 text-sm"
          />
          <button onClick={salvarNovoPin} className="rounded-full bg-ink text-paper font-medium px-4 text-sm">
            Salvar
          </button>
        </div>
      </section>

      <a
        href="/familia/"
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-1.5 text-sm text-brass font-medium py-2"
      >
        Ver página da família <ExternalLink size={13} />
      </a>
    </div>
  );
}

function Toggle({ label, ativo, onToggle }: { label: string; ativo: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="w-full flex items-center justify-between text-left">
      <span className="text-sm font-medium">{label}</span>
      <span className={`w-11 h-6 rounded-full relative transition-colors ${ativo ? "bg-success" : "bg-line"}`}>
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            ativo ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}
