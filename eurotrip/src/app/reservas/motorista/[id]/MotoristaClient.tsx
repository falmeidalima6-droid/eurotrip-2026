"use client";

import Link from "next/link";
import { hotels } from "@/data/hotels";
import { X } from "lucide-react";

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

  return (
    <div className="fixed inset-0 z-50 bg-white text-black flex flex-col">
      <div className="flex justify-end p-4">
        <Link href="/reservas" aria-label="Fechar" className="p-2 -m-2">
          <X size={24} />
        </Link>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6 text-center">
        <p className="text-2xl font-medium">Por favor, me leve para:</p>
        <p className="font-display text-4xl font-bold leading-tight">{hotel.nome}</p>
        <p className="text-3xl leading-snug">{hotel.endereco}</p>
        {hotel.telefone && <p className="text-xl text-gray-600">{hotel.telefone}</p>}
        <p className="text-xl text-gray-500 mt-4">Grazie / Merci / Gracias / Obrigado(a)</p>
      </div>
    </div>
  );
}
