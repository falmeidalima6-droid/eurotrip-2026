import { PontoDeApoio } from "./types";

// ⚠️ Lista curada manualmente como ponto de partida — não é uma busca "ao vivo"
// (isso exigiria uma API paga com internet). Cobertura é parcial, especialmente
// em Positano/Sorrento. Sempre confira in loco quando tiver sinal. Edite/expanda
// este arquivo livremente conforme forem descobrindo bons pontos na viagem —
// ou peça para o Claude pesquisar mais opções por região antes da viagem.
export const pontosDeApoio: PontoDeApoio[] = [
  // Roma — próximo ao Coliseu / Fórum
  {
    id: "poi-roma-01",
    nome: "Banheiros públicos — Coliseu (área externa)",
    tipo: "banheiro",
    cidade: "Roma",
    gratuito: false,
    coordenada: { lat: 41.8902, lng: 12.4922 },
    observacoes: "Pago, na área de acesso ao Coliseu/Fórum Romano.",
  },
  {
    id: "poi-roma-02",
    nome: "Fontanelle (bebedouros de rua romanos)",
    tipo: "agua",
    cidade: "Roma",
    gratuito: true,
    coordenada: { lat: 41.8933, lng: 12.4863 },
    observacoes: "Roma tem centenas de 'nasoni' (bebedouros públicos) espalhados pela cidade — água potável e gratuita, comuns perto de pontos turísticos.",
  },
  // Sorrento
  {
    id: "poi-sorrento-01",
    nome: "Bares na Piazza Tasso",
    tipo: "restaurante",
    cidade: "Sorrento",
    gratuito: false,
    coordenada: { lat: 40.6263, lng: 14.3757 },
    observacoes: "Vários cafés/restaurantes na praça central — costumam ter banheiro para clientes.",
  },
  // Veneza
  {
    id: "poi-veneza-01",
    nome: "Banheiros públicos — perto de Piazza San Marco",
    tipo: "banheiro",
    cidade: "Veneza",
    gratuito: false,
    coordenada: { lat: 45.4340, lng: 12.3388 },
    observacoes: "Banheiros públicos pagos administrados pela prefeitura, comuns nas áreas turísticas centrais.",
  },
  // Paris
  {
    id: "poi-paris-01",
    nome: "Sanisette (banheiros públicos automáticos)",
    tipo: "banheiro",
    cidade: "Paris",
    gratuito: true,
    coordenada: { lat: 48.8584, lng: 2.2945 },
    observacoes: "Paris tem banheiros públicos automáticos gratuitos (sanisettes) espalhados pela cidade, inclusive perto da Torre Eiffel e do Sena.",
  },
  {
    id: "poi-paris-02",
    nome: "Padarias (boulangeries) na região do Hôtel de Venise",
    tipo: "padaria",
    cidade: "Paris",
    gratuito: false,
    coordenada: { lat: 48.8467, lng: 2.3822 },
    observacoes: "Bairro do 12º arrondissement tem boulangeries tradicionais a poucos passos do hotel.",
  },
  // Barcelona
  {
    id: "poi-barcelona-01",
    nome: "Fonts de aigua potable (bebedouros públicos)",
    tipo: "agua",
    cidade: "Barcelona",
    gratuito: true,
    coordenada: { lat: 41.4036, lng: 2.1744 },
    observacoes: "Barcelona tem bebedouros públicos espalhados por parques e praças, incluindo o Parc Güell.",
  },
  // Lisboa
  {
    id: "poi-lisboa-01",
    nome: "Chafarizes e bebedouros — Baixa/Rossio",
    tipo: "agua",
    cidade: "Lisboa",
    gratuito: true,
    coordenada: { lat: 38.7139, lng: -9.1394 },
    observacoes: "Vários chafarizes históricos e bebedouros modernos na região central.",
  },
  {
    id: "poi-lisboa-02",
    nome: "Pastelarias na Baixa",
    tipo: "padaria",
    cidade: "Lisboa",
    gratuito: false,
    coordenada: { lat: 38.7139, lng: -9.1394 },
    observacoes: "Diversas pastelarias tradicionais entre Rossio e Praça do Comércio.",
  },
  // Sintra
  {
    id: "poi-sintra-01",
    nome: "Cafés no centro histórico de Sintra",
    tipo: "restaurante",
    cidade: "Sintra",
    gratuito: false,
    coordenada: { lat: 38.7975, lng: -9.3907 },
    observacoes: "Concentração de cafés e pastelarias (travesseiro, queijada) na descida do Palácio Nacional.",
  },
];
