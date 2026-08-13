"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { TripEvent } from "@/data/types";

// Ícone padrão do Leaflet não carrega bem com bundlers — apontar para CDN com fallback simples.
const icon = L.divIcon({
  className: "",
  html: `<div style="background:#16213E;color:#fff;border-radius:9999px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;border:2px solid #C89B3C;box-shadow:0 1px 4px rgba(0,0,0,.3)">📍</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export default function MapaDoDia({ eventos }: { eventos: TripEvent[] }) {
  const pontos = eventos.filter((e) => e.coordenada) as (TripEvent & { coordenada: NonNullable<TripEvent["coordenada"]> })[];

  if (pontos.length === 0) return null;

  const centro: [number, number] = [pontos[0].coordenada.lat, pontos[0].coordenada.lng];
  const linha: [number, number][] = pontos.map((p) => [p.coordenada.lat, p.coordenada.lng]);

  return (
    <div className="h-72 rounded-2xl overflow-hidden border border-line">
      <MapContainer center={centro} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={linha} pathOptions={{ color: "#C89B3C", weight: 3, dashArray: "6 6" }} />
        {pontos.map((p) => (
          <Marker key={p.id} position={[p.coordenada.lat, p.coordenada.lng] as [number, number]} icon={icon}>
            <Popup>
              <strong>{p.titulo}</strong>
              {p.horarioInicial && <div>{p.horarioInicial}</div>}
              {p.endereco && <div>{p.endereco}</div>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
