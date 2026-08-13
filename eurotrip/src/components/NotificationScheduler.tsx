"use client";

import { useEffect } from "react";
import { dias } from "@/data/trip";
import { computarEventosDoDia, minutosAte } from "@/lib/time";

const CHAVE_NOTIFICADOS = "eurotrip-notificados";

function jaNotificou(id: string): boolean {
  try {
    const lista = JSON.parse(localStorage.getItem(CHAVE_NOTIFICADOS) || "[]");
    return lista.includes(id);
  } catch {
    return false;
  }
}

function marcarNotificado(id: string) {
  try {
    const lista = JSON.parse(localStorage.getItem(CHAVE_NOTIFICADOS) || "[]");
    localStorage.setItem(CHAVE_NOTIFICADOS, JSON.stringify([...lista, id]));
  } catch {
    // ignora
  }
}

/**
 * Roda enquanto o app está aberto (em primeiro ou segundo plano na aba).
 * Não substitui push notifications de servidor — é um aviso "best effort"
 * usando a Notification API do próprio navegador, sem custo e sem internet.
 */
export default function NotificationScheduler() {
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    const checar = () => {
      if (Notification.permission !== "granted") return;
      const hoje = new Date();
      const hojeISO = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;
      const dia = dias.find((d) => d.data === hojeISO);
      if (!dia) return;

      const eventos = computarEventosDoDia(dia);
      for (const ev of eventos) {
        if (!ev.horarioRecomendadoSaida) continue;
        const min = minutosAte(dia.pais, ev.horarioRecomendadoSaida, dia.data);
        if (min <= 15 && min >= 0 && !jaNotificou(ev.id)) {
          new Notification(`Sair em ${min} min`, {
            body: ev.titulo,
            tag: ev.id,
          });
          marcarNotificado(ev.id);
        }
      }
    };

    checar();
    const i = setInterval(checar, 60_000);
    return () => clearInterval(i);
  }, []);

  return null;
}
