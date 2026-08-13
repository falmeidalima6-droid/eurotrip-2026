"use client";

import { useOnlineStatus } from "@/lib/useOnlineStatus";

export default function StatusOnlineBadge() {
  const online = useOnlineStatus();

  return (
    <div className="fixed top-2 right-2 z-50">
      <span
        className={`font-ticket text-[10px] px-2 py-1 rounded-full border ${
          online
            ? "bg-white/80 text-success border-success/30"
            : "bg-warn/10 text-warn border-warn/40"
        }`}
      >
        {online ? "🟢 Online" : "🟠 Offline — roteiro disponível"}
      </span>
    </div>
  );
}
