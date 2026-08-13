import type { Metadata, Viewport } from "next";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import StatusOnlineBadge from "@/components/StatusOnlineBadge";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import NotificationScheduler from "@/components/NotificationScheduler";
import SyncOnLoad from "@/components/SyncOnLoad";

export const metadata: Metadata = {
  title: "Eurotrip 2026",
  description: "Companheiro de viagem offline de Fernanda + Marcos — 04 a 17/10/2026",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Eurotrip 2026",
  },
};

export const viewport: Viewport = {
  themeColor: "#16213E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <ServiceWorkerRegister />
        <NotificationScheduler />
        <SyncOnLoad />
        <StatusOnlineBadge />
        <main className="flex-1 pb-20 max-w-lg mx-auto w-full">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
