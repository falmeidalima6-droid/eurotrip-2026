import { toZonedTime, format as formatTz } from "date-fns-tz";
import { TripEvent, DiaRoteiro } from "@/data/types";
import { FUSOS } from "@/data/trip";

/** Hora atual no fuso do país informado (retorna objeto Date "deslocado" para exibição). */
export function agoraNoFuso(pais: TripEvent["pais"]): Date {
  return toZonedTime(new Date(), FUSOS[pais]);
}

export function formatarHoraLocal(pais: TripEvent["pais"], fmt = "HH:mm"): string {
  return formatTz(agoraNoFuso(pais), fmt, { timeZone: FUSOS[pais] });
}

export function formatarDataLocal(pais: TripEvent["pais"], fmt = "EEEE, d 'de' MMMM"): string {
  return formatTz(agoraNoFuso(pais), fmt, { timeZone: FUSOS[pais] });
}

/** Compara "agora" (no fuso do evento) com o horário do evento. Retorna minutos (pode ser negativo). */
export function minutosAte(pais: TripEvent["pais"], horaHHmm: string, dataYYYYMMDD?: string): number {
  const agora = agoraNoFuso(pais);
  const [h, m] = horaHHmm.split(":").map(Number);
  const alvo = new Date(agora);
  if (dataYYYYMMDD) {
    const [ano, mes, dia] = dataYYYYMMDD.split("-").map(Number);
    alvo.setFullYear(ano, mes - 1, dia);
  }
  alvo.setHours(h, m, 0, 0);
  return Math.round((alvo.getTime() - agora.getTime()) / 60000);
}

export function dataDeHoje(pais: TripEvent["pais"] = "Italia"): string {
  return formatarHoraLocal(pais, "yyyy-MM-dd");
}

export interface EventoComputado extends TripEvent {
  statusComputado: "concluido" | "agora" | "proximo" | "futuro" | "pulado" | "a-confirmar" | "cancelado";
  minutosParaSair?: number;
}

/**
 * Calcula o status de cada evento do dia comparando com a hora atual,
 * aplicando a lógica de "horário de abandono": se o evento anterior
 * ultrapassar seu horarioAbandono e ainda não foi concluído manualmente,
 * o próximo evento (sem horário fixo/reserva) é marcado como "pulado".
 */
export function computarEventosDoDia(dia: DiaRoteiro): EventoComputado[] {
  const agora = agoraNoFuso(dia.pais);
  const agoraMin = agora.getHours() * 60 + agora.getMinutes();
  const hojeStr = dataDeHoje(dia.pais);
  const diaEhHoje = dia.data === hojeStr;
  const diaJaPassou = dia.data < hojeStr;
  const diaEhFuturo = dia.data > hojeStr;
  const eventos = dia.eventos;
  const resultado: EventoComputado[] = [];
  let abandonoAtivado = false;

  for (let i = 0; i < eventos.length; i++) {
    const ev = eventos[i];
    const inicioMin = ev.horarioInicial ? toMin(ev.horarioInicial) : undefined;
    const fimMin = ev.horarioFinal ? toMin(ev.horarioFinal) : inicioMin;
    const abandonoMin = ev.horarioAbandono ? toMin(ev.horarioAbandono) : undefined;

    let status: EventoComputado["statusComputado"] = "futuro";

    if (ev.status === "a-confirmar" && !ev.confirmado) {
      status = "a-confirmar";
    } else if (diaJaPassou) {
      // Dia inteiro já ficou no passado: tudo concluído, sem comparar horário.
      status = "concluido";
    } else if (diaEhFuturo) {
      // Dia inteiro ainda está por vir: nada é "concluído" ou "agora" ainda.
      status = "futuro";
    } else if (diaEhHoje) {
      // Efeito dominó: se um evento anterior tinha horário de abandono e foi ultrapassado,
      // pula automaticamente eventos sem horário fixo (voo/trem/reserva) que viriam depois dele.
      if (abandonoAtivado && !temHorarioFixo(ev)) {
        status = "pulado";
        resultado.push({ ...ev, statusComputado: status });
        continue;
      }

      if (inicioMin !== undefined) {
        if (fimMin !== undefined && agoraMin > fimMin) {
          status = "concluido";
        } else if (agoraMin >= inicioMin && (fimMin === undefined || agoraMin <= fimMin)) {
          status = "agora";
        } else if (agoraMin < inicioMin) {
          status = "futuro";
        }
      }

      if (abandonoMin !== undefined && agoraMin > abandonoMin && status !== "concluido") {
        abandonoAtivado = true;
      }
    }

    resultado.push({ ...ev, statusComputado: status });
  }

  // Marca o primeiro evento "futuro" como "próximo"
  const idxProximo = resultado.findIndex((e) => e.statusComputado === "futuro");
  if (idxProximo >= 0) {
    resultado[idxProximo] = { ...resultado[idxProximo], statusComputado: "proximo" };
  }

  return resultado;
}

function temHorarioFixo(ev: TripEvent): boolean {
  return ["voo", "trem", "ferry", "transfer", "checkin", "checkout"].includes(ev.categoria) || !!ev.numeroReserva;
}

function toMin(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Semáforo 🟢🟡🔴 comparando agora com o horário recomendado de saída de um evento. */
export function semaforoSaida(pais: TripEvent["pais"], horarioRecomendadoSaida?: string, dataYYYYMMDD?: string): "verde" | "amarelo" | "vermelho" | null {
  if (!horarioRecomendadoSaida) return null;
  const min = minutosAte(pais, horarioRecomendadoSaida, dataYYYYMMDD);
  if (min < 0) return "vermelho";
  if (min <= 15) return "amarelo";
  return "verde";
}
