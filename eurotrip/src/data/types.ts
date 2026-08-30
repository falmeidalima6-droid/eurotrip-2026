// ============================================================
// EUROTRIP 2026 — Modelo de dados central
// Edite os arquivos em src/data/days/*.ts para atualizar o roteiro.
// ============================================================

export type Categoria =
  | "voo"
  | "trem"
  | "ferry"
  | "transfer"
  | "hotel"
  | "passeio"
  | "restaurante"
  | "caminhada"
  | "aeroporto"
  | "estacao"
  | "imigracao"
  | "checkin"
  | "checkout"
  | "tempo-livre"
  | "lembrete"
  | "documento";

export type StatusEvento =
  | "futuro"
  | "proximo"
  | "agora"
  | "concluido"
  | "alterado"
  | "cancelado"
  | "a-confirmar"
  | "pulado"; // marcado pelo "horário de abandono"

export type UrgenciaCompra = "vermelho" | "laranja" | "verde";

export interface Coordenada {
  lat: number;
  lng: number;
}

export interface TripEvent {
  id: string;
  data: string; // YYYY-MM-DD
  cidade: string;
  pais: "Brasil" | "Italia" | "Franca" | "Espanha" | "Portugal";
  categoria: Categoria;
  titulo: string;
  horarioInicial?: string; // HH:mm, hora local do evento
  horarioFinal?: string;
  horarioOficial?: string; // ex: horário do voo/trem no bilhete
  horarioRecomendadoSaida?: string; // margem de segurança
  duracaoPrevista?: string; // ex "2h30"
  origem?: string;
  destino?: string;
  endereco?: string;
  coordenada?: Coordenada;
  empresa?: string;
  numero?: string; // nº do voo/trem/ferry
  estacaoAeroportoPorto?: string;
  terminal?: string;
  plataforma?: string;
  numeroReserva?: string;
  pessoas?: string[];
  bagagem?: string;
  status: StatusEvento;
  observacoes?: string;
  links?: { label: string; url: string }[];
  documentos?: string[];
  prioridade?: "alta" | "media" | "baixa";
  precisaInternet?: boolean;
  confirmado: boolean;
  alerta?: string; // ex: "🧳 ATENÇÃO — 3ª MALA"
  planoB?: string;
  dicaMetro?: string; // opção de metrô: bilhete, linha, estação, direção, onde trocar
  horarioAbandono?: string; // HH:mm — se ultrapassado, próximo evento é pulado automaticamente
  levar?: string[]; // "o que preciso levar agora"
  opcaoAlternativaTitulo?: string; // ex: "Opção B: Montmartre"
  opcaoAlternativaDescricao?: string;
}

export interface DiaRoteiro {
  data: string; // YYYY-MM-DD
  diaSemana: string;
  cidade: string;
  pais: TripEvent["pais"];
  titulo: string;
  emoji?: string;
  eventos: TripEvent[];
  planoChuva?: string;
  planoCansaco?: string;
  linkExternoLabel?: string;
  linkExternoUrl?: string;
}

export interface Hotel {
  id: string;
  nome: string;
  cidade: string;
  pais: TripEvent["pais"];
  endereco: string;
  coordenada?: Coordenada;
  checkin: string; // data YYYY-MM-DD
  checkout: string; // data YYYY-MM-DD
  horarioCheckin: string;
  horarioCheckout: string;
  telefone?: string;
  numeroReserva?: string;
  observacoes?: string;
  taxaTuristica?: string;
}

export interface Transporte {
  id: string;
  tipo: "voo" | "trem" | "ferry" | "transfer";
  data: string;
  empresa: string;
  numero?: string;
  origem: string;
  destino: string;
  horarioPartida: string;
  horarioChegada: string;
  duracao?: string;
  terminal?: string;
  estacao?: string;
  plataforma?: string;
  bagagem?: string;
  reserva?: string;
  observacoes?: string;
  antecedenciaRecomendada?: string;
  alerta?: string;
}

export interface Ingresso {
  id: string;
  nome: string;
  cidade: string;
  urgencia: UrgenciaCompra;
  dataNecessaria?: string; // até quando comprar
  comprado: boolean;
  observacoes?: string;
}

export interface PontoDeApoio {
  id: string;
  nome: string;
  tipo: "restaurante" | "lanchonete" | "padaria" | "banheiro" | "agua";
  cidade: string;
  gratuito?: boolean;
  coordenada: Coordenada;
  endereco?: string;
  observacoes?: string;
  proximoDe?: string; // referência ao id do evento/atração
}

export interface Frase {
  categoria: string;
  pt: string;
  idioma: "it" | "fr" | "es" | "en";
  traducao: string;
}
