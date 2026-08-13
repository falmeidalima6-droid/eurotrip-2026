"use client";

import { useEffect, useState } from "react";
import { formatarHoraLocal } from "@/lib/time";
import { TripEvent } from "@/data/types";

export default function RelogioDuplo({ pais }: { pais: TripEvent["pais"] }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(i);
  }, []);

  if (pais === "Brasil") return null;

  return (
    <div key={tick} className="flex items-center justify-center gap-4 text-xs font-ticket text-ink-soft">
      <span>🌍 {formatarHoraLocal(pais)} local</span>
      <span className="text-line">·</span>
      <span>🇧🇷 {formatarHoraLocal("Brasil")} Brasil</span>
    </div>
  );
}
