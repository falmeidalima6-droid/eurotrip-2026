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
      "Mochila/bolsa de passeio",
      "Medicamentos",
      "Itens pessoais",
    ],
  },
  {
    categoria: "Roupas",
    itens: ["Pijama", "Roupa íntima", "Sutiãs/tops confortáveis", "Camisetas"],
  },
  {
    categoria: "Higiene — Banho e cabelo",
    itens: [
      "Shampoo — frasco até 100 ml",
      "Condicionador — frasco até 100 ml",
      "Sabonete líquido — frasco pequeno",
      "Creme/leave-in para cabelo — pote pequeno",
    ],
  },
  {
    categoria: "Higiene — Pessoal",
    itens: [
      "Creme dental — embalagem pequena",
      "Enxaguante bucal — frasco pequeno, se quiser levar",
      "Desodorante",
      "Hidratante corporal — frasco pequeno",
      "Hidratante facial",
      "Protetor solar",
    ],
  },
  {
    categoria: "Higiene — Pés",
    itens: ["Antichulé", "Tuff para os pés", "Talco/pó para pés, se necessário"],
  },
  {
    categoria: "Higiene — Outros",
    itens: [
      "Perfume — decant/frasco pequeno",
      "Álcool em gel pequeno",
      "Demaquilante/água micelar, se usar",
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
