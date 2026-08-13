-- Eurotrip 2026 — esquema mínimo para sincronização opcional entre os dois celulares.
-- Rode isto uma vez no SQL Editor do seu projeto Supabase (gratuito).
--
-- Só guarda o essencial: ingressos comprados, plano ativo do dia (Sintra/Belém,
-- Chuva/Cansaço) e gastos. Documentos, notas e checklist continuam só no celular
-- de cada um.

create table if not exists eurotrip_sync (
  chave text primary key,        -- ex: 'ingresso:i01', 'plano:Barcelona', 'gasto:<uuid>'
  tipo text not null,            -- 'ingresso' | 'plano' | 'gasto'
  valor jsonb not null,
  atualizado_em timestamptz not null default now()
);

alter table eurotrip_sync enable row level security;

-- Sem login neste app (só vocês dois vão ter a URL e a chave do projeto),
-- então liberamos leitura/escrita para a chave anônima. Não coloquem essa
-- URL/chave em nenhum lugar público.
create policy "leitura publica" on eurotrip_sync
  for select using (true);

create policy "escrita publica" on eurotrip_sync
  for insert with check (true);

create policy "atualizacao publica" on eurotrip_sync
  for update using (true);
