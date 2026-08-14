"use client";

import Link from "next/link";
import { hotels } from "@/data/hotels";
import { X } from "lucide-react";

const FRASE_POR_PAIS: Record<string, { frase: string; obrigado: string }> = {
  Italia: { frase: "Mi porti a:", obrigado: "Grazie" },
  Franca: { frase: "Emmenez-moi à :", obrigado: "Merci" },
  Espanha: { frase: "Lléveme a:", obrigado: "Gracias" },
  Portugal: { frase: "Leve-me para:", obrigado: "Obrigado(a)" },
};

export default function MotoristaClient({ id }: { id: string }) {
  const hotel = hotels.find((h) => h.id === id);

  if (!hotel) {
    return (
      <div className="min-h-screen bg-ink text-paper flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p>Hotel não encontrado.</p>
        <Link href="/reservas" className="underline">Voltar</Link>
      </div>
    );
  }

  const idioma = FRASE_POR_PAIS[hotel.pais] ?? { frase: "Leve-me para:", obrigado: "Obrigado(a)" };

  return (
    <div className="fixed inset-0 z-50 bg-white text-black flex flex-col">
      <div className="flex justify-end p-4">
        <Link href="/reservas" aria-label="Fechar" className="p-2 -m-2">
          <X size={24} />
        </Link>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6 text-center">
        <p className="text-2xl font-medium">{idioma.frase}</p>
        <p className="font-display text-4xl font-bold leading-tight">{hotel.nome}</p>
        <p className="text-3xl leading-snug">{hotel.endereco}</p>
        {hotel.telefone && <p className="text-xl text-gray-600">{hotel.telefone}</p>}
        <p className="text-xl text-gray-500 mt-4">{idioma.obrigado}</p>
      </div>
    </div>
  );
}
