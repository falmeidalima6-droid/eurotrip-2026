"use client";

import { useEffect } from "react";
import { syncConfigurado, puxarSync } from "@/lib/supabaseSync";

export default function SyncOnLoad() {
  useEffect(() => {
    (async () => {
      if (typeof navigator === "undefined" || !navigator.onLine) return;
      const ativo = await syncConfigurado();
      if (ativo) await puxarSync();
    })();
  }, []);

  return null;
}
