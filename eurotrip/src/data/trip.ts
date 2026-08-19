import { DiaRoteiro, TripEvent } from "./types";
import { day01 } from "./days/day01";
import { day02 } from "./days/day02";
import { day03 } from "./days/day03";
import { day04 } from "./days/day04";
import { day05 } from "./days/day05";
import { day06 } from "./days/day06";
import { day07 } from "./days/day07";
import { day08 } from "./days/day08";
import { day09 } from "./days/day09";
import { day10 } from "./days/day10";
import { day11 } from "./days/day11";
import { day12 } from "./days/day12";
import { day13 } from "./days/day13";
import { day14 } from "./days/day14";

export const TRIP_INFO = {
  titulo: "EUROTRIP 2026",
  viajantes: "Fernanda + Marcos",
  dataInicio: "2026-10-04",
  dataFim: "2026-10-17",
  rota: "Rio de Janeiro → Paris → Roma → Nápoles/Sorrento → Positano/Amalfi → Veneza → Paris → Barcelona → Lisboa → Rio de Janeiro",
};

export const dias: DiaRoteiro[] = [
  day01, day02, day03, day04, day05, day06, day07,
  day08, day09, day10, day11, day12, day13, day14,
];

export const todosEventos: TripEvent[] = dias.flatMap((d) => d.eventos);

export function getDiaPorData(data: string): DiaRoteiro | undefined {
  return dias.find((d) => d.data === data);
}

export function getEventoPorId(id: string): TripEvent | undefined {
  return todosEventos.find((e) => e.id === id);
}

// Fuso horário local de cada país da viagem (para exibição "hora local")
export const FUSOS: Record<TripEvent["pais"], string> = {
  Brasil: "America/Sao_Paulo",
  Italia: "Europe/Rome",
  Franca: "Europe/Paris",
  Espanha: "Europe/Madrid",
  Portugal: "Europe/Lisbon",
};

export const BANDEIRAS: Record<TripEvent["pais"], string> = {
  Brasil: "🇧🇷",
  Italia: "🇮🇹",
  Franca: "🇫🇷",
  Espanha: "🇪🇸",
  Portugal: "🇵🇹",
};
