"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { Lock } from "lucide-react";

export default function BloqueioPin({ children }: { children: React.ReactNode }) {
  const [pinSalvo, setPinSalvo] = useState<string | null>(null);
  const [desbloqueado, setDesbloqueado] = useState(false);
  const [entrada, setEntrada] = useState("");
  const [criando, setCriando] = useState(false);
  const [erro, setErro] = useState(false);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    if (!db) return;
    db.configuracoes.get("pin-documentos").then((r) => {
      setPinSalvo(r?.valor || null);
      setPronto(true);
    });
  }, []);

  async function salvarNovoPin() {
    if (entrada.length < 4) return;
    if (db) await db.configuracoes.put({ chave: "pin-documentos", valor: entrada });
    setPinSalvo(entrada);
    setDesbloqueado(true);
    setEntrada("");
  }

  function conferir() {
    if (entrada === pinSalvo) {
      setDesbloqueado(true);
      setErro(false);
    } else {
      setErro(true);
    }
    setEntrada("");
  }

  if (!pronto) return null;

  if (desbloqueado) return <>{children}</>;

  if (!pinSalvo && !criando) {
    return (
      <div className="px-4 pt-10 text-center space-y-3">
        <Lock size={32} className="mx-auto text-ink-soft" />
        <p className="font-medium">Proteger esta seção com PIN?</p>
        <p className="text-sm text-ink-soft">Documentos ficam com uma trava extra local (só neste celular).</p>
        <div className="flex gap-2 justify-center pt-2">
          <button onClick={() => setCriando(true)} className="rounded-full bg-ink text-paper px-4 py-2 text-sm font-medium">
            Criar PIN
          </button>
          <button onClick={() => setDesbloqueado(true)} className="rounded-full border border-line px-4 py-2 text-sm font-medium">
            Agora não
          </button>
        </div>
      </div>
    );
  }

  if (!pinSalvo && criando) {
    return (
      <div className="px-4 pt-10 text-center space-y-3">
        <Lock size={32} className="mx-auto text-ink-soft" />
        <p className="font-medium">Crie um PIN de 4 dígitos</p>
        <input
          type="password"
          inputMode="numeric"
          maxLength={6}
          value={entrada}
          onChange={(e) => setEntrada(e.target.value.replace(/\D/g, ""))}
          className="w-32 text-center text-2xl font-ticket rounded-lg border border-line px-3 py-2 mx-auto block"
          autoFocus
        />
        <button onClick={salvarNovoPin} className="rounded-full bg-ink text-paper px-4 py-2 text-sm font-medium">
          Salvar PIN
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 pt-10 text-center space-y-3">
      <Lock size={32} className="mx-auto text-ink-soft" />
      <p className="font-medium">Digite o PIN</p>
      <input
        type="password"
        inputMode="numeric"
        maxLength={6}
        value={entrada}
        onChange={(e) => setEntrada(e.target.value.replace(/\D/g, ""))}
        onKeyDown={(e) => e.key === "Enter" && conferir()}
        className="w-32 text-center text-2xl font-ticket rounded-lg border border-line px-3 py-2 mx-auto block"
        autoFocus
      />
      {erro && <p className="text-sm text-alert">PIN incorreto.</p>}
      <button onClick={conferir} className="rounded-full bg-ink text-paper px-4 py-2 text-sm font-medium">
        Entrar
      </button>
    </div>
  );
}
