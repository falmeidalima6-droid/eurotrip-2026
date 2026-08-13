"use client";

import { useEffect, useState } from "react";
import { dias, TRIP_INFO } from "@/data/trip";
import { DiaRoteiro } from "@/data/types";

export interface EstadoHoje {
  dia: DiaRoteiro | null;
  amanha: DiaRoteiro | null;
  estado: "antes" | "durante" | "depois";
  diasParaComeco: number;
}

function hojeISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function useHoje(): EstadoHoje {
  const [estado, setEstado] = useState<EstadoHoje>(() => calcular());

  useEffect(() => {
    const interval = setInterval(() => setEstado(calcular()), 60_000);
    return () => clearInterval(interval);
  }, []);

  return estado;

  function calcular(): EstadoHoje {
    const hoje = hojeISO();
    const idx = dias.findIndex((d) => d.data === hoje);
    if (idx >= 0) {
      return {
        dia: dias[idx],
        amanha: dias[idx + 1] || null,
        estado: "durante",
        diasParaComeco: 0,
      };
    }
    if (hoje < TRIP_INFO.dataInicio) {
      const msDia = 24 * 60 * 60 * 1000;
      const diff = Math.ceil((new Date(TRIP_INFO.dataInicio).getTime() - new Date(hoje).getTime()) / msDia);
      return { dia: null, amanha: dias[0], estado: "antes", diasParaComeco: diff };
    }
    return { dia: null, amanha: null, estado: "depois", diasParaComeco: 0 };
  }
}
