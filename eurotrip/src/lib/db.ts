import Dexie, { Table } from "dexie";

export interface ChecklistItem {
  id: string; // categoria:item ou id do dia para checklist diário
  categoria: string;
  texto: string;
  marcado: boolean;
}

export interface Anotacao {
  id?: number;
  data: string; // timestamp ISO
  tipo: "observacao" | "lugar" | "lembrete" | "alteracao";
  texto: string;
}

export interface Gasto {
  id?: number;
  data: string; // YYYY-MM-DD
  categoria: string;
  valor: number;
  moeda: string;
  meioPagamento: string;
  quemPagou?: string; // "Fernanda" | "Marcos" | "Casal"
  descricao?: string;
}

export interface ItemCompra {
  id?: number;
  item: string;
  quantidade?: string;
  comprado: boolean;
}

export interface EventoOverride {
  eventoId: string; // chave primária
  status?: string;
  observacoesEditadas?: string;
  horarioEditado?: string;
  enderecoEditado?: string;
}

export interface IngressoOverride {
  ingressoId: string; // chave primária
  comprado: boolean;
}

export interface PlanoAtivo {
  cidade: string; // chave primária
  plano: "normal" | "chuva" | "cansaco";
}

export interface ConfiguracaoItem {
  chave: string; // chave primária
  valor: string;
}

export interface Anexo {
  id?: number;
  referenciaId: string; // id do hotel ou transporte
  nomeArquivo: string;
  mimeType: string;
  blob: Blob;
  criadoEm: string;
}

class EurotripDB extends Dexie {
  checklist!: Table<ChecklistItem, string>;
  anotacoes!: Table<Anotacao, number>;
  gastos!: Table<Gasto, number>;
  listaCompras!: Table<ItemCompra, number>;
  eventoOverrides!: Table<EventoOverride, string>;
  ingressoOverrides!: Table<IngressoOverride, string>;
  planosAtivos!: Table<PlanoAtivo, string>;
  configuracoes!: Table<ConfiguracaoItem, string>;
  anexos!: Table<Anexo, number>;

  constructor() {
    super("eurotrip2026");
    this.version(1).stores({
      checklist: "id",
      anotacoes: "++id, data, tipo",
      gastos: "++id, data, categoria",
      listaCompras: "++id",
      eventoOverrides: "eventoId",
      ingressoOverrides: "ingressoId",
      planosAtivos: "cidade",
      configuracoes: "chave",
    });
    this.version(2).stores({
      anexos: "++id, referenciaId",
    });
  }
}

export const db = typeof window !== "undefined" ? new EurotripDB() : (null as unknown as EurotripDB);

// -------- Backup / Restore --------
export async function exportarBackup(): Promise<string> {
  if (!db) return "{}";
  const [checklist, anotacoes, gastos, listaCompras, eventoOverrides, ingressoOverrides, planosAtivos, configuracoes, anexos] =
    await Promise.all([
      db.checklist.toArray(),
      db.anotacoes.toArray(),
      db.gastos.toArray(),
      db.listaCompras.toArray(),
      db.eventoOverrides.toArray(),
      db.ingressoOverrides.toArray(),
      db.planosAtivos.toArray(),
      db.configuracoes.toArray(),
      db.anexos.toArray(),
    ]);

  const anexosSerializados = await Promise.all(
    anexos.map(async (a) => ({
      ...a,
      blob: undefined,
      blobBase64: await blobParaBase64(a.blob),
    }))
  );

  return JSON.stringify(
    {
      versao: 2,
      exportadoEm: new Date().toISOString(),
      checklist,
      anotacoes,
      gastos,
      listaCompras,
      eventoOverrides,
      ingressoOverrides,
      planosAtivos,
      configuracoes,
      anexos: anexosSerializados,
    },
    null,
    2
  );
}

export async function importarBackup(json: string): Promise<void> {
  if (!db) return;
  const dados = JSON.parse(json);
  await db.transaction(
    "rw",
    [db.checklist, db.anotacoes, db.gastos, db.listaCompras, db.eventoOverrides, db.ingressoOverrides, db.planosAtivos, db.configuracoes, db.anexos],
    async () => {
      if (dados.checklist) await db.checklist.bulkPut(dados.checklist);
      if (dados.anotacoes) await db.anotacoes.bulkPut(dados.anotacoes);
      if (dados.gastos) await db.gastos.bulkPut(dados.gastos);
      if (dados.listaCompras) await db.listaCompras.bulkPut(dados.listaCompras);
      if (dados.eventoOverrides) await db.eventoOverrides.bulkPut(dados.eventoOverrides);
      if (dados.ingressoOverrides) await db.ingressoOverrides.bulkPut(dados.ingressoOverrides);
      if (dados.planosAtivos) await db.planosAtivos.bulkPut(dados.planosAtivos);
      if (dados.configuracoes) await db.configuracoes.bulkPut(dados.configuracoes);
      if (dados.anexos) {
        for (const a of dados.anexos) {
          if (!a.blobBase64) continue;
          const blob = base64ParaBlob(a.blobBase64, a.mimeType);
          await db.anexos.put({ id: a.id, referenciaId: a.referenciaId, nomeArquivo: a.nomeArquivo, mimeType: a.mimeType, blob, criadoEm: a.criadoEm });
        }
      }
    }
  );
}

function blobParaBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(",")[1] || "");
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function base64ParaBlob(base64: string, mimeType: string): Blob {
  const bytes = atob(base64);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: mimeType });
}
