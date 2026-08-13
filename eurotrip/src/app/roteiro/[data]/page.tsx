import { dias } from "@/data/trip";
import DiaClient from "./DiaClient";

export function generateStaticParams() {
  return dias.map((d) => ({ data: d.data }));
}

export default async function DiaPage({ params }: { params: Promise<{ data: string }> }) {
  const { data } = await params;
  return <DiaClient data={data} />;
}
