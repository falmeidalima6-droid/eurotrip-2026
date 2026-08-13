import { Categoria } from "@/data/types";

export const CATEGORIA_EMOJI: Record<Categoria, string> = {
  voo: "✈️",
  trem: "🚄",
  ferry: "⛴️",
  transfer: "🚐",
  hotel: "🏨",
  passeio: "📍",
  restaurante: "🍴",
  caminhada: "🚶",
  aeroporto: "🛫",
  estacao: "🚉",
  imigracao: "🛂",
  checkin: "🔑",
  checkout: "🧳",
  "tempo-livre": "☕",
  lembrete: "⏰",
  documento: "📄",
};

export const STATUS_LABEL: Record<string, string> = {
  futuro: "Futuro",
  proximo: "Próximo",
  agora: "Agora",
  concluido: "Concluído",
  alterado: "Alterado",
  cancelado: "Cancelado",
  "a-confirmar": "A confirmar",
  pulado: "Pulado (horário de abandono)",
};

export const STATUS_COLOR: Record<string, string> = {
  futuro: "text-ink-soft",
  proximo: "text-brass",
  agora: "text-alert",
  concluido: "text-ink-soft/60 line-through",
  alterado: "text-warn",
  cancelado: "text-ink-soft/60 line-through",
  "a-confirmar": "text-warn",
  pulado: "text-ink-soft/50 line-through",
};
