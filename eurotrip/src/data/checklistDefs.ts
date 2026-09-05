export interface ChecklistDef {
  categoria: string;
  itens: string[];
}

export const checklistDefs: ChecklistDef[] = [
  {
    categoria: "Documentos",
    itens: ["Passaporte", "Seguro", "Cartões", "Reservas", "Bilhetes"],
  },
  {
    categoria: "Bagagem",
    itens: [
      "Mala despachada",
      "Mala de cabine",
      "Mochila",
      "Medicamentos",
      "Itens pessoais",
    ],
  },
  {
    categoria: "Eletrônicos",
    itens: [
      "Cordão marrom para celular",
      "Cordão crossbody cinza para celular",
      "Capas de chuva",
      "Bastão selfie/tripé",
      "Câmera de ação SJCAM C300",
      "2 adaptadores de tomada",
      "Fone Soundcore P30",
      "Power bank",
      "Cartão MicroSD SanDisk 128GB",
      "Cabos",
    ],
  },
];

export const checklistDiario = ["Passaporte", "Celular", "Power bank", "Carteira", "Cartão", "Dinheiro", "Chave do hotel", "Ingresso do dia", "Água"];
