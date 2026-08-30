import VoltarMais from "@/components/VoltarMais";
import { Clock, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export default function JogoBarcaPage() {
  return (
    <div className="px-4 pt-4 pb-6 space-y-5">
      <VoltarMais />
      <div>
        <h1 className="font-display text-xl font-bold">⚽ Plano do jogo — Barcelona x Getafe</h1>
        <p className="text-xs text-ink-soft mt-1">La Liga, domingo 11/10/2026, Camp Nou. Horário oficial ainda não definido.</p>
      </div>

      <section className="rounded-2xl bg-brass/10 border border-brass/30 p-4 space-y-2">
        <p className="text-xs font-medium text-brass flex items-center gap-1.5">
          <Clock size={14} /> STATUS ATUAL — AGUARDANDO
        </p>
        <p className="text-sm">
          A LaLiga costuma divulgar o horário oficial de cada rodada entre <strong>15 e 20 dias antes</strong> do jogo.
          Pra esse jogo (11/10), isso cai entre <strong>21 e 26 de setembro de 2026</strong>.
        </p>
        <p className="text-sm text-ink-soft">
          ⚠️ Não compramos nada ainda (voos, hotel extra, ingresso) — decidir e comprar tudo de uma vez só quando o
          horário sair evita pagar por um plano mais caro sem necessidade.
        </p>
      </section>

      <section className="rounded-2xl bg-paper-raised border border-line p-4 space-y-2">
        <p className="font-medium flex items-center gap-2">
          <AlertTriangle size={18} className="text-alert" /> Custos de alterar os voos já pagos (se precisar mexer)
        </p>
        <ul className="text-sm space-y-1.5 list-disc list-inside text-ink-soft">
          <li><strong>EasyJet Veneza→Paris (EJU4874):</strong> NÃO dá pra redirecionar pra Barcelona (a easyJet não voa essa rota) — fica perdido (€278,94) se optarem por ir a Barcelona.</li>
          <li><strong>Iberia/Vueling Paris→Barcelona (IB5225) e Barcelona→Lisboa (IB5634):</strong> alteração custa €45/pessoa (€90 por voo) + diferença de tarifa, sem reembolso. Só mexer aqui se o Plano B for realmente acionado — o ideal é reaproveitar os dois sem alteração nenhuma.</li>
        </ul>
      </section>

      <section className="rounded-2xl bg-paper-raised border border-line p-4 space-y-2">
        <p className="font-medium flex items-center gap-2">
          <Clock size={18} className="text-ink-soft" /> Prazo das hospedagens (ainda há folga)
        </p>
        <ul className="text-sm space-y-1.5 list-disc list-inside text-ink-soft">
          <li>Hotel de Paris (Hôtel de Venise): cancelamento/alteração <strong>grátis até 9/10 às 12h00</strong> (horário de Paris)</li>
          <li>Hotel de Barcelona (ILUNION): cancelamento/alteração <strong>grátis até 10/10 às 00h01</strong></li>
        </ul>
        <p className="text-xs text-ink-soft">Decidindo em setembro, sobra folga confortável até essas datas de outubro.</p>
      </section>

      <section className="rounded-2xl bg-paper-raised border border-line p-4 space-y-3">
        <p className="font-medium flex items-center gap-2 text-success">
          <CheckCircle2 size={18} /> Se o jogo for 14h ou 16h15 — Plano A (simples)
        </p>
        <ul className="text-sm space-y-1.5 list-disc list-inside text-ink-soft">
          <li>Sair de Veneza de manhã (Vueling ~09h10) até Barcelona</li>
          <li>Assistir ao jogo, seguir direto pra Paris à noite (AF1249 21h15 → CDG 23h10)</li>
          <li>Dormir em Paris — Louvre 09h do dia 12 preservado, sem stress</li>
          <li>Sagrada Família continua no dia 14/10, como já está</li>
        </ul>
        <p className="text-sm font-medium pt-1">Custo estimado: <span className="text-success">~€710-790</span></p>
      </section>

      <section className="rounded-2xl bg-paper-raised border border-line p-4 space-y-3">
        <p className="font-medium flex items-center gap-2 text-alert">
          <XCircle size={18} /> Se o jogo for 18h30 ou 21h — Plano B (completo)
        </p>
        <p className="text-sm text-ink-soft">
          Jogo à noite não deixa tempo pra voar até Paris na mesma noite. Nesse caso, a melhor resposta é
          <strong> antecipar a Sagrada Família pro próprio dia 11/10</strong> — assim os voos Paris→Barcelona (13/10) e
          Barcelona→Lisboa (15/10), que já estão pagos, continuam sendo usados normalmente.
        </p>
        <p className="text-xs font-medium text-ink-soft uppercase tracking-wide pt-1">Ajustes necessários</p>
        <ul className="text-sm space-y-1.5 list-disc list-inside">
          <li>Comprar voo novo: Veneza → Barcelona (11/10)</li>
          <li>Comprar ingresso novo da Sagrada Família pro dia 11/10 (o ingresso do dia 14, já comprado, fica sem uso — sem reembolso)</li>
          <li>1 diária extra de hotel em Barcelona (11/10)</li>
          <li>Ajustar a reserva do hotel de Paris (grátis até 9/10 — sem custo se feito a tempo)</li>
          <li>Comprar voo novo: Barcelona → Paris (12/10, de manhã)</li>
          <li className="text-success">✅ Voo Paris → Barcelona (13/10) — já pago, reaproveitado sem custo extra</li>
          <li className="text-success">✅ Voo Barcelona → Lisboa (15/10) — já pago, reaproveitado sem custo extra</li>
        </ul>
        <p className="text-sm font-medium pt-1">Custo estimado: <span className="text-alert">~€950-1.050</span></p>
        <p className="text-xs text-ink-soft">
          Mais caro que o Plano A, mas <strong>preserva 100% o dia de Sintra/Regaleira/Belém (16/10)</strong> — a
          alternativa de simplesmente esticar a estadia em Barcelona por 4 dias eliminaria esse dia inteiro do
          roteiro, então não vale a pena.
        </p>
      </section>

      <section className="rounded-2xl bg-paper-raised border border-line p-4 space-y-2">
        <p className="font-medium flex items-center gap-2">
          <AlertTriangle size={18} className="text-brass" /> O que já vale fazer agora, independente do jogo
        </p>
        <p className="text-sm">
          Comprar o ingresso da <strong>Quinta da Regaleira</strong> (horário marcado, 10h00 do dia 16/10) — não tem
          nenhuma relação com essa decisão do jogo, e o sistema deles exige compra antecipada de qualquer forma.
        </p>
      </section>

      <p className="text-xs text-ink-soft text-center pt-2">
        Ingresso do jogo em si: ~€100-180 (2 pessoas) — só compra junto com o resto, na hora de decidir entre Plano A ou B.
      </p>
    </div>
  );
}
