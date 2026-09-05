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
    categoria: "🧴 Cabelo / Banho",
    itens: [
      "Shampoo — frasco de viagem",
      "Condicionador — frasco de viagem",
      "Sabonete líquido",
      "Leave-in/creme para cabelo",
      "Escova/pente",
      "Elásticos/presilhas de cabelo",
    ],
  },
  {
    categoria: "🪥 Higiene",
    itens: [
      "Escova de dentes",
      "Creme dental",
      "Fio dental",
      "Desodorante",
      "Álcool em gel",
      "Lenços de papel",
      "Lenços umedecidos",
      "Cotonetes",
    ],
  },
  {
    categoria: "🧴 Pele",
    itens: [
      "Hidratante facial",
      "Hidratante corporal",
      "Protetor solar",
      "Hidratante labial",
      "Demaquilante/água micelar",
      "Perfume/decant pequeno",
    ],
  },
  {
    categoria: "💄 Maquiagem",
    itens: [
      "Base",
      "Corretivo",
      "Pó compacto",
      "Blush",
      "Rímel",
      "Lápis de olho/sobrancelha",
      "Delineador, se usar",
      "Batom",
      "Pincéis",
      "Esponja",
    ],
  },
  {
    categoria: "👃 Nariz / Garganta",
    itens: ["Soro fisiológico para o nariz", "Naridrin", "Própolis", "Pastilhas para garganta"],
  },
  {
    categoria: "🦶 Pés / Longas Caminhadas",
    itens: [
      "Antichulé/Tuff — definir qual será o principal",
      "Band-Aid",
      "Curativos próprios para bolhas",
      "Gelol",
    ],
  },
  {
    categoria: "🩹 Primeiros Cuidados",
    itens: ["Termômetro", "Antisséptico pequeno", "Repelente"],
  },
  {
    categoria: "💊 Farmacinha",
    itens: [
      "Neosaldina",
      "Vonau",
      "Toragesic",
      "Simeticona",
      "Loratadina",
      "Tylenol Sinus",
      "Eno/pastilhas",
    ],
  },
  {
    categoria: "💊 Medicamentos com Prescrição",
    itens: [
      "Azitromicina",
      "Clavulin",
      "Outros que o médico indicar",
      "Receitas/prescrições correspondentes",
      "Manter identificação/embalagens originais",
    ],
  },
  {
    categoria: "🛫 Saquinho Transparente — Cabine",
    itens: [
      "Shampoo",
      "Condicionador",
      "Sabonete líquido",
      "Leave-in",
      "Hidratantes",
      "Protetor solar",
      "Perfume",
      "Álcool em gel",
      "Soro nasal",
      "Própolis líquido",
      "Gelol, se gel",
      "Base líquida",
      "Corretivo líquido/cremoso",
      "Rímel",
      "Delineador líquido",
      "Gloss/batom líquido, se levar",
      "1 saquinho de 1L para Fernanda + 1 saquinho de 1L para Marcos (um cada)",
    ],
  },
  {
    categoria: "📦 Já Comprado para Organização",
    itens: [
      "Kit de potes/frascos de viagem — Mercado Livre",
      "Saquinho transparente resselável para líquidos — confirmar se o kit já inclui",
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
      "Power bank (2x Basike, 37Wh e 74Wh — confirmado dentro do limite de 100Wh, sem autorização)",
      "Cartão MicroSD SanDisk 128GB",
      "Cabos",
    ],
  },
];

export const checklistDiario = ["Passaporte", "Celular", "Power bank", "Carteira", "Cartão", "Dinheiro", "Chave do hotel", "Ingresso do dia", "Água"];
