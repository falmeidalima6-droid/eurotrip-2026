"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import HojePage from "./hoje/page";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/hoje/");
  }, [router]);

  // Renderiza o conteúdo de Hoje diretamente também, para garantir que
  // a página raiz nunca fique vazia/404 num export estático.
  return <HojePage />;
}
