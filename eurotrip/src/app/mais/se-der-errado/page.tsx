"use client";

import { useState } from "react";
import VoltarMais from "@/components/VoltarMais";
import { AlertTriangle } from "lucide-react";

interface Cenario {
  titulo: string;
  passos: string[];
}

const CENARIOS: Cenario[] = [
  {
    titulo: "✈️ Perdemos o voo",
    passos: [
      "Procurem o balcão da companhia aérea imediatamente (não esperem em fila de outra companhia).",
      "Se for a mesma reserva de conexão, a companhia normalmente reacomoda no próximo voo sem custo.",
      "Guardem o cartão de embarque/comprovante como prova.",
      "Avisem o hotel seguinte sobre o atraso, se o horário de chegada mudar.",
    ],
  },
  {
    titulo: "🚄 Perdemos o trem",
    passos: [
      "Na Itália (Trenitalia/Italo) e em Portugal/Espanha, procurem o guichê de atendimento na própria estação — muitas vezes é possível pegar o próximo trem com pequena taxa.",
      "Tenham o número da reserva e o nome usado na compra em mãos.",
      "Se for um trem de longa distância caro, considerem contatar a empresa pelo app/site primeiro.",
    ],
  },
  {
    titulo: "⛴️ Ferry cancelado",
    passos: [
      "Procurem a bilheteria do porto — cancelamentos costumam ser por mau tempo, e a empresa geralmente reembolsa ou reacomoda no próximo horário.",
      "Guardem o comprovante de compra e o número do bilhete.",
      "Tenham um plano B de horário alternativo no mesmo dia, se houver.",
    ],
  },
  {
    titulo: "🚐 Não encontramos o transfer",
    passos: [
      "Liguem ou mandem WhatsApp direto para o número da empresa (está na Central de Transportes do app).",
      "Aguardem no ponto de encontro combinado por pelo menos 15–20 min antes de considerar alternativa.",
      "Como plano B, táxi/Uber costuma resolver — guardem esse custo para reembolso, se aplicável.",
    ],
  },
  {
    titulo: "🛂 Perdemos um documento",
    passos: [
      "Passaporte: contatem o Consulado Brasileiro mais próximo (dados em Mais → Emergência) o quanto antes.",
      "Tenham uma cópia digital do passaporte salva (Mais → Documentos) para acelerar o processo.",
      "Registrem um boletim de ocorrência local — o consulado costuma pedir isso para emitir documento de viagem provisório.",
    ],
  },
  {
    titulo: "📱 Celular perdido",
    passos: [
      "Usem o celular do outro para localizar/bloquear via 'Encontrar meu Celular' (Google) ou 'Buscar' (Apple).",
      "Troquem a senha das contas principais (e-mail, banco) assim que possível.",
      "Avisem o banco/emissora do cartão se havia Apple Pay/Google Pay configurado no aparelho.",
      "Tenham os contatos essenciais também anotados em papel ou no e-mail, não só no celular perdido.",
    ],
  },
  {
    titulo: "🧳 Mala extraviada",
    passos: [
      "Façam a queixa (PIR - Property Irregularity Report) no balcão da companhia aérea ANTES de sair da área de bagagem.",
      "Anotem o número do PIR e o telefone de rastreamento fornecido.",
      "Guardem notas fiscais de itens de necessidade comprados por causa do extravio — a companhia costuma reembolsar.",
    ],
  },
  {
    titulo: "🏨 Problema no hotel",
    passos: [
      "Falem primeiro diretamente com a recepção, com calma e por escrito se possível (e-mail/WhatsApp) para ter registro.",
      "Se reservaram por Hoteis.com/Booking, o suporte deles pode intermediar rapidamente.",
      "Tenham o número de reserva sempre à mão (está em Reservas, dentro de cada hotel).",
    ],
  },
];

export default function SeDerErradoPage() {
  const [aberto, setAberto] = useState<string | null>(null);

  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      <VoltarMais />
      <h1 className="font-display text-xl font-bold">🚨 Se algo der errado</h1>
      <p className="text-sm text-ink-soft">Toque no cenário para ver os passos recomendados.</p>

      <div className="space-y-2">
        {CENARIOS.map((c) => (
          <div key={c.titulo} className="rounded-2xl bg-paper-raised border border-line overflow-hidden">
            <button
              onClick={() => setAberto(aberto === c.titulo ? null : c.titulo)}
              className="w-full text-left p-4 font-medium flex items-center justify-between"
            >
              {c.titulo}
            </button>
            {aberto === c.titulo && (
              <div className="px-4 pb-4 space-y-2">
                {c.passos.map((p, i) => (
                  <p key={i} className="text-sm text-ink-soft flex items-start gap-2">
                    <span className="font-ticket text-brass shrink-0">{i + 1}.</span> {p}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-brass/10 border border-brass/30 p-3 text-xs text-ink-soft flex items-start gap-2">
        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
        Orientações gerais, não substituem o bom senso na hora — em caso de risco à segurança, ligue 112 primeiro.
      </div>
    </div>
  );
}
