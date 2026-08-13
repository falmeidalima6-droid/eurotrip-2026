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
      "Adaptador de tomada",
      "Power bank",
      "Cabos",
      "Medicamentos",
      "Itens pessoais",
    ],
  },
];

export const checklistDiario = ["Passaporte", "Celular", "Power bank", "Carteira", "Cartão", "Dinheiro", "Chave do hotel", "Ingresso do dia", "Água"];
