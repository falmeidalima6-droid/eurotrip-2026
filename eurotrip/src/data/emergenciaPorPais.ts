import { TripEvent } from "./types";

export interface InfoEmergenciaPais {
  pais: TripEvent["pais"];
  numeroEmergenciaGeral: string; // polícia/ambulância/bombeiros
  consulado: {
    nome: string;
    endereco: string;
    telefoneGeral?: string;
    telefonePlantao: string;
    observacao?: string;
  };
}

// Dados verificados via busca (Itamaraty / sites oficiais), agosto/2026.
// Sempre confirmar no site oficial antes de precisar: gov.br/mre
export const infoEmergenciaPorPais: InfoEmergenciaPais[] = [
  {
    pais: "Italia",
    numeroEmergenciaGeral: "112",
    consulado: {
      nome: "Consulado-Geral do Brasil em Roma",
      endereco: "Piazza di Pasquino, 8 — 00186 Roma",
      telefoneGeral: "+39 06 688 9661",
      telefonePlantao: "+39 333 118 4682",
      observacao: "Plantão só para emergência comprovada (morte, prisão, acidente grave, hospitalização).",
    },
  },
  {
    pais: "Franca",
    numeroEmergenciaGeral: "112",
    consulado: {
      nome: "Consulado-Geral do Brasil em Paris",
      endereco: "65 Av. Franklin D. Roosevelt — 75008 Paris",
      telefonePlantao: "+33 6 80 80 96 78",
      observacao: "Plantão 24h, só para emergência comprovada.",
    },
  },
  {
    pais: "Espanha",
    numeroEmergenciaGeral: "112",
    consulado: {
      nome: "Consulado-Geral do Brasil em Barcelona",
      endereco: "Avenida Diagonal, 468, 2º — 08006 Barcelona",
      telefoneGeral: "+34 93 488 2288",
      telefonePlantao: "+34 659 078 057",
      observacao: "Plantão só para emergência comprovada (acidente, morte, prisão, hospitalização, desastre).",
    },
  },
  {
    pais: "Portugal",
    numeroEmergenciaGeral: "112",
    consulado: {
      nome: "Consulado-Geral do Brasil em Lisboa",
      endereco: "Rua António Maria Cardoso, nº 39, Chiado — 1200-026 Lisboa",
      telefonePlantao: "+351 962 520 581",
      observacao: "Plantão só para emergência grave e comprovada.",
    },
  },
  {
    pais: "Brasil",
    numeroEmergenciaGeral: "190 (Polícia) / 192 (SAMU) / 193 (Bombeiros)",
    consulado: {
      nome: "—",
      endereco: "—",
      telefonePlantao: "—",
    },
  },
];

export function getInfoEmergencia(pais: TripEvent["pais"]): InfoEmergenciaPais | undefined {
  return infoEmergenciaPorPais.find((i) => i.pais === pais);
}
