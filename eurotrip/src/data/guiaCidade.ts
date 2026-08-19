export interface GuiaCidade {
  cidade: string;
  emoji: string;
  transporte: string[];
  gorjeta: string;
  agua: string;
  golpes: string[];
  particularidades: string[];
}

// Pesquisado em agosto/2026 a partir de fontes de viagem — informação prática,
// pode mudar com o tempo. Confirmem localmente quando possível.
export const guiasCidade: GuiaCidade[] = [
  {
    cidade: "Roma",
    emoji: "🇮🇹",
    transporte: [
      "Bilhete BIT: €1,50, vale 100 min em metrô/ônibus/tram — valide na maquininha amarela ao entrar (ônibus/tram) ou na catraca (metrô).",
      "Cartão/celular contactless (tap & go) também funciona direto na catraca e já aplica a tarifa mais vantajosa do dia.",
      "Só usem táxi branco oficial. Trajeto Fiumicino↔centro tem tarifa fixa de €50 — se cobrarem mais, é golpe.",
    ],
    gorjeta: "Não é obrigatória — muitos lugares já cobram 'coperto' (serviço) na conta.",
    agua: "As 'nasoni' (bebedouros de rua) são potáveis e gratuitas, tem centenas espalhadas pela cidade.",
    golpes: [
      "Pulseira ou anel 'de presente' que depois cobram — recusem e sigam andando.",
      "Petição falsa para assinar na rua — nunca parem para assinar nada.",
      "'Ajuda' na máquina de bilhete do metrô que rouba dado do cartão — usem só guichês oficiais.",
    ],
    particularidades: [
      "Ônibus 64 (Termini↔Vaticano) e a Linha A do metrô nos fins de semana são pontos clássicos de batedores de carteira — mochila na frente.",
      "Muitas lojas pequenas fecham para o almoço (riposo), normalmente 13h-16h.",
    ],
  },
  {
    cidade: "Nápoles",
    emoji: "🇮🇹",
    transporte: ["Do aeroporto ao centro: ônibus Alibus, tarifa fixa. Nápoles↔Sorrento: Circumvesuviana ou Campania Express."],
    gorjeta: "Free tour a pé: ~€10 é considerado justo. Serviço de mesa em restaurantes: €1,50-3.",
    agua: "Água da torneira é potável e gratuita.",
    golpes: ["Abordagens de 'ajuda amigável' ou venda insistente perto de pontos turísticos e na Termini/Garibaldi."],
    particularidades: [
      "Furtos (não assaltos violentos) são o principal risco, especialmente em áreas turísticas — fiquem atentos a bolsos e mochilas.",
      "Evitem áreas afastadas do centro à noite.",
    ],
  },
  {
    cidade: "Sorrento / Positano / Amalfi",
    emoji: "🇮🇹",
    transporte: ["Estrada costeira pode ficar congestionada — o ferry entre Sorrento/Positano/Amalfi costuma ser mais tranquilo e às vezes mais rápido."],
    gorjeta: "Igual ao resto da Itália — não obrigatória, serviço às vezes já incluso.",
    agua: "Água da torneira é potável na região.",
    golpes: ["Nenhum golpe específico frequente reportado — atenção padrão com pertences em áreas cheias basta."],
    particularidades: [
      "Alta temporada lota rápido — cheguem aos ferries com a antecedência recomendada (30 min).",
    ],
  },
  {
    cidade: "Veneza",
    emoji: "🇮🇹",
    transporte: [
      "Vaporetto (barco-ônibus): bilhete avulso ~€9,50, vale 75 min. Compensa passe diário se for usar mais de 2x.",
      "Gôndola: preço tabelado pela prefeitura, ~€80-90 por 30-40 min de dia (sobe à noite). Ofertas bem mais baratas de vendedores de rua costumam ser golpe — prefiram o ponto oficial de embarque.",
    ],
    gorjeta: "Não obrigatória, como no resto da Itália.",
    agua: "Torneira é potável.",
    golpes: ["Gondoleiros/vendedores de rua oferecendo passeio fora do preço tabelado perto de Rialto e São Marcos."],
    particularidades: [
      "Boa notícia: como vocês estão hospedados na cidade, NÃO pagam a taxa de acesso ao centro histórico (essa taxa é só para quem visita sem pernoitar).",
      "Curiosidade: tudo flutua em Veneza — até a polícia e a ambulância andam de barco.",
    ],
  },
  {
    cidade: "Paris",
    emoji: "🇫🇷",
    transporte: [
      "Bilhete avulso de metrô: €2,10. Pacote de 10 (carnet): €16,90 — compensa se forem usar bastante.",
      "No RER (ex: linha do aeroporto), validem o bilhete também na SAÍDA, não só na entrada.",
    ],
    gorjeta: "Serviço de 15% já incluso na conta dos restaurantes. Deixar 2-5% de troco é só um gesto, não obrigatório.",
    agua: "Torneira é potável. Peçam 'une carafe d'eau' no restaurante — é água de torneira grátis (a garrafa engarrafada é sempre cobrada à parte).",
    golpes: [
      "Pulseira 'de amizade' oferecida de repente no pulso — se colocarem, vão cobrar.",
      "Petição falsa para assinar na rua.",
      "Nota de dinheiro 'caída' no chão perto de vocês — é isca para distrair enquanto mexem no bolso/bolsa.",
      "Bilhete de metrô/atração vendido na rua com 'desconto' — comprem só em guichês oficiais.",
    ],
    particularidades: ["Metrô nos horários de pico e estações muito turísticas são onde mais acontece furto — mochila na frente."],
  },
  {
    cidade: "Barcelona",
    emoji: "🇪🇸",
    transporte: ["Táxi oficial é preto e amarelo — ou usem Cabify/FreeNow/Uber. Nunca aceitem 'táxi' sem identificação."],
    gorjeta: "Não obrigatória — arredondar a conta já é gentileza suficiente.",
    agua: "As 'fonts' (chafarizes públicos) em parques e praças são gratuitas e potáveis — tragam garrafa reutilizável.",
    golpes: [
      "Golpe do 'cocô de passarinho': alguém 'ajuda' a limpar suas costas enquanto rouba a carteira.",
      "Distração por esbarrão ou pedido de informação seguido de furto.",
      "Casas de câmbio em Las Ramblas — taxas ruins, evitem trocar dinheiro ali.",
    ],
    particularidades: [
      "Batedores de carteira são o principal risco em Las Ramblas, Sagrada Família e praias, especialmente em grupo (um distrai, outro furta).",
      "Ingressos de atrações (Sagrada Família etc.) esgotam rápido — já resolvido no app, mas vale lembrar.",
    ],
  },
  {
    cidade: "Lisboa",
    emoji: "🇵🇹",
    transporte: [
      "Pagar ao motorista do elétrico/ônibus custa quase o dobro (~€3 no elétrico) — melhor usar cartão Viva Viagem (~€1,90 por viagem).",
      "Metrô fecha por volta da 1h da manhã — depois disso, só táxi/Uber/Bolt.",
    ],
    gorjeta: "Não obrigatória — arredondar já é bem visto.",
    agua: "Torneira é potável em Lisboa.",
    golpes: ["Nenhum golpe elaborado muito reportado — o risco maior é furto simples em locais cheios."],
    particularidades: [
      "Elétrico 28 é o ponto clássico de batedor de carteira em Lisboa — mochila na frente, celular guardado.",
      "Cidade é bem inclinada (muitas ladeiras) — vale usar metrô/elevadores para poupar as pernas.",
    ],
  },
  {
    cidade: "Sintra",
    emoji: "🇵🇹",
    transporte: ["Trem sai do Rossio (Lisboa), ~40 min. Saiam de Lisboa antes das 9h — depois das 10h as filas nos palácios ficam longas."],
    gorjeta: "Mesma norma de Portugal — não obrigatória.",
    agua: "Torneira é potável.",
    golpes: ["Nenhum golpe elaborado reportado com frequência — atenção padrão basta."],
    particularidades: ["Quinta da Regaleira fica cheia rápido — desde 2024 o sistema exige horário de entrada marcado, comprar com antecedência (já no app)."],
  },
];
