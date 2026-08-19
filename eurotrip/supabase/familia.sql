-- Área Família — Eurotrip 2026
-- Cole este código inteiro no SQL Editor da Supabase e clique em "Run".

create table if not exists familia_config (
  chave text primary key,
  valor text
);

create table if not exists familia_localizacao (
  id bigint generated always as identity primary key,
  data date not null,
  cidade text,
  pais text,
  local_texto text,
  lat double precision,
  lng double precision,
  criado_em timestamptz default now()
);

create table if not exists familia_diario (
  data date primary key,
  texto text,
  atualizado_em timestamptz default now()
);

create table if not exists familia_momento (
  data date primary key,
  foto_url text,
  frase text,
  atualizado_em timestamptz default now()
);

create table if not exists familia_status (
  id bigint generated always as identity primary key,
  texto text default 'Tudo certo por aqui',
  cidade text,
  criado_em timestamptz default now()
);

create table if not exists familia_fotos (
  id bigint generated always as identity primary key,
  data date not null,
  url text not null,
  ordem int default 0,
  criado_em timestamptz default now()
);

create table if not exists familia_comentarios (
  id bigint generated always as identity primary key,
  data date not null,
  autor text not null,
  texto text not null,
  criado_em timestamptz default now()
);

create table if not exists familia_reacoes (
  id bigint generated always as identity primary key,
  foto_id bigint references familia_fotos(id) on delete cascade,
  emoji text not null,
  autor text,
  criado_em timestamptz default now()
);

-- Segurança: como o app não tem sistema de login, o acesso é protegido pelo
-- link + PIN no lado do aplicativo, não por autenticação de banco. As regras
-- abaixo liberam leitura/escrita para a chave pública (anon), no mesmo nível
-- de proteção que o restante do app já usa hoje.
alter table familia_config enable row level security;
alter table familia_localizacao enable row level security;
alter table familia_diario enable row level security;
alter table familia_momento enable row level security;
alter table familia_status enable row level security;
alter table familia_fotos enable row level security;
alter table familia_comentarios enable row level security;
alter table familia_reacoes enable row level security;

drop policy if exists "acesso publico" on familia_config;
create policy "acesso publico" on familia_config for all using (true) with check (true);
drop policy if exists "acesso publico" on familia_localizacao;
create policy "acesso publico" on familia_localizacao for all using (true) with check (true);
drop policy if exists "acesso publico" on familia_diario;
create policy "acesso publico" on familia_diario for all using (true) with check (true);
drop policy if exists "acesso publico" on familia_momento;
create policy "acesso publico" on familia_momento for all using (true) with check (true);
drop policy if exists "acesso publico" on familia_status;
create policy "acesso publico" on familia_status for all using (true) with check (true);
drop policy if exists "acesso publico" on familia_fotos;
create policy "acesso publico" on familia_fotos for all using (true) with check (true);
drop policy if exists "acesso publico" on familia_comentarios;
create policy "acesso publico" on familia_comentarios for all using (true) with check (true);
drop policy if exists "acesso publico" on familia_reacoes;
create policy "acesso publico" on familia_reacoes for all using (true) with check (true);

-- Configuração inicial: PIN da família e área ativada.
insert into familia_config (chave, valor) values ('pin', '1234')
  on conflict (chave) do nothing;
insert into familia_config (chave, valor) values ('area_ativa', 'true')
  on conflict (chave) do nothing;
insert into familia_config (chave, valor) values ('localizacao_ativa', 'true')
  on conflict (chave) do nothing;
