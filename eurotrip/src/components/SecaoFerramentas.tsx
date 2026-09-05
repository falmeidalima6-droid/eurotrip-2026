"use client";

import Link from "next/link";
import { Users, Mic } from "lucide-react";

export default function SecaoFerramentas() {
  return (
    <section>
      <p className="text-xs font-medium text-ink-soft uppercase tracking-wide mb-2 px-1">🛠️ Durante a Viagem</p>
      <div className="grid grid-cols-2 gap-2">
        <Link
          href="/mais/familia"
          className="flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-brass/10 border border-brass/30 p-4 text-center"
        >
          <Users size={20} className="text-brass" />
          <span className="text-xs font-medium leading-tight">Compartilhamento Família</span>
        </Link>
        <a
          href="https://tradutor-voz-deploy.vercel.app/"
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-paper-raised border border-line p-4 text-center"
        >
          <Mic size={20} className="text-ink-soft" />
          <span className="text-xs font-medium leading-tight">Tradutor de Voz</span>
        </a>
      </div>
    </section>
  );
}
