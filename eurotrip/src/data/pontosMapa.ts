export interface PontoMapa {
  id: string;
  nome: string;
  lat: number;
  lng: number;
  tipo: "hotel" | "estacao" | "aeroporto" | "porto" | "atracao";
}

// Coordenadas de pontos de referência amplamente conhecidos e estáveis
// (marcos históricos/turísticos — não mudam de lugar). Hotéis vêm de hotels.ts.
export const pontosMapaPorCidade: Record<string, PontoMapa[]> = {
  Roma: [
    { id: "hotel", nome: "MDM Guesthouse", lat: 41.9109, lng: 12.4644, tipo: "hotel" },
    { id: "coliseu", nome: "Coliseu", lat: 41.8902, lng: 12.4922, tipo: "atracao" },
    { id: "vaticano", nome: "Praça São Pedro", lat: 41.9022, lng: 12.4539, tipo: "atracao" },
    { id: "trevi", nome: "Fontana di Trevi", lat: 41.9009, lng: 12.4833, tipo: "atracao" },
    { id: "spagna", nome: "Piazza di Spagna", lat: 41.9057, lng: 12.4823, tipo: "atracao" },
    { id: "termini", nome: "Roma Termini", lat: 41.9007, lng: 12.5015, tipo: "estacao" },
    { id: "fiumicino", nome: "Aeroporto Fiumicino", lat: 41.8003, lng: 12.2389, tipo: "aeroporto" },
  ],
  Nápoles: [
    { id: "centrale", nome: "Napoli Centrale", lat: 40.8524, lng: 14.2721, tipo: "estacao" },
    { id: "plebiscito", nome: "Piazza del Plebiscito", lat: 40.8358, lng: 14.2488, tipo: "atracao" },
  ],
  Sorrento: [
    { id: "hotel", nome: "Orange Suites", lat: 40.6263, lng: 14.3757, tipo: "hotel" },
    { id: "tasso", nome: "Piazza Tasso", lat: 40.6263, lng: 14.3757, tipo: "atracao" },
  ],
  Positano: [{ id: "centro", nome: "Spiaggia Grande", lat: 40.628, lng: 14.4848, tipo: "atracao" }],
  Amalfi: [{ id: "centro", nome: "Piazza Duomo", lat: 40.634, lng: 14.6027, tipo: "atracao" }],
  Veneza: [
    { id: "hotel", nome: "Hotel Leone", lat: 45.4444, lng: 12.3267, tipo: "hotel" },
    { id: "rialto", nome: "Ponte Rialto", lat: 45.438, lng: 12.3358, tipo: "atracao" },
    { id: "marco", nome: "Praça São Marcos", lat: 45.4342, lng: 12.3388, tipo: "atracao" },
    { id: "aeroporto", nome: "Aeroporto Marco Polo", lat: 45.5053, lng: 12.3519, tipo: "aeroporto" },
  ],
  Paris: [
    { id: "hotel", nome: "Hôtel de Venise", lat: 48.8467, lng: 2.3822, tipo: "hotel" },
    { id: "louvre", nome: "Louvre", lat: 48.8606, lng: 2.3376, tipo: "atracao" },
    { id: "notredame", nome: "Notre-Dame", lat: 48.853, lng: 2.3499, tipo: "atracao" },
    { id: "eiffel", nome: "Torre Eiffel", lat: 48.8584, lng: 2.2945, tipo: "atracao" },
    { id: "trocadero", nome: "Trocadéro", lat: 48.8626, lng: 2.2886, tipo: "atracao" },
    { id: "cdg", nome: "Aeroporto CDG", lat: 49.0097, lng: 2.5479, tipo: "aeroporto" },
    { id: "orly", nome: "Aeroporto Orly", lat: 48.7233, lng: 2.3794, tipo: "aeroporto" },
  ],
  Barcelona: [
    { id: "hotel", nome: "Hotel ILUNION", lat: 41.4082, lng: 2.2059, tipo: "hotel" },
    { id: "sagrada", nome: "Sagrada Família", lat: 41.4036, lng: 2.1744, tipo: "atracao" },
    { id: "rambla", nome: "La Rambla", lat: 41.3809, lng: 2.1735, tipo: "atracao" },
    { id: "gracia", nome: "Passeig de Gràcia", lat: 41.3953, lng: 2.1619, tipo: "atracao" },
    { id: "bcn", nome: "Aeroporto BCN", lat: 41.2974, lng: 2.0833, tipo: "aeroporto" },
  ],
  Lisboa: [
    { id: "hotel", nome: "Hotel Mundial", lat: 38.7157, lng: -9.1366, tipo: "hotel" },
    { id: "rossio", nome: "Rossio", lat: 38.7139, lng: -9.1394, tipo: "atracao" },
    { id: "comercio", nome: "Praça do Comércio", lat: 38.7078, lng: -9.1366, tipo: "atracao" },
    { id: "lis", nome: "Aeroporto de Lisboa", lat: 38.7813, lng: -9.1359, tipo: "aeroporto" },
  ],
  Sintra: [
    { id: "pena", nome: "Palácio da Pena", lat: 38.7876, lng: -9.3906, tipo: "atracao" },
    { id: "regaleira", nome: "Quinta da Regaleira", lat: 38.7967, lng: -9.39, tipo: "atracao" },
    { id: "estacao", nome: "Estação de Sintra", lat: 38.7975, lng: -9.3841, tipo: "estacao" },
  ],
  Belém: [
    { id: "jeronimos", nome: "Mosteiro dos Jerónimos", lat: 38.6979, lng: -9.2065, tipo: "atracao" },
    { id: "torre", nome: "Torre de Belém", lat: 38.6916, lng: -9.216, tipo: "atracao" },
  ],
};
