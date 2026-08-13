import { hotels } from "@/data/hotels";
import MotoristaClient from "./MotoristaClient";

export function generateStaticParams() {
  return hotels.map((h) => ({ id: h.id }));
}

export default async function MotoristaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MotoristaClient id={id} />;
}
