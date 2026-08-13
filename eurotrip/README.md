# Eurotrip 2026 — Fernanda + Marcos

App companheiro de viagem, 100% gratuito e offline-first, para a Eurotrip de 04 a 17/10/2026
(Rio → Paris → Roma → Nápoles/Sorrento → Positano/Amalfi → Veneza → Paris → Barcelona → Lisboa → Rio).

Feito com Next.js 16 (export estático) + TypeScript + Tailwind CSS v4 + PWA/Service Worker + Dexie (IndexedDB).

---

## 1. Rodar localmente

```bash
npm install
npm run dev
```
Abra http://localhost:3000 — redireciona para `/hoje`.

## 2. Gerar o build de produção (estático)

```bash
npm run build
```
Isso roda `next build` (gera a pasta `out/`, site 100% estático) e depois o script
`scripts/generate-sw-manifest.js` (gera `out/precache-manifest.json`, usado pelo Service Worker
para cachear o app inteiro no primeiro carregamento).

Para testar o build de produção localmente antes de publicar:
```bash
npx serve out
```

## 3. Publicar gratuitamente na Vercel

1. Suba este projeto para um repositório no GitHub.
2. Em https://vercel.com, clique em "Add New Project" e importe o repositório.
3. A Vercel detecta Next.js automaticamente. Não é preciso configurar nada — o
   `next.config.ts` já está com `output: "export"`, então roda no plano gratuito
   (Hobby) sem usar funções serverless nem banco de dados.
4. Deploy. Você terá uma URL tipo `eurotrip.vercel.app`.

Alternativa igualmente gratuita: como o site é 100% estático, também funciona em
GitHub Pages, Netlify ou Cloudflare Pages — é só apontar para a pasta `out/`.

## 4. Instalar no Android (PWA)

1. Abra a URL publicada no Chrome do Android.
2. Deixe a página carregar completamente uma vez (com internet) — isso baixa e
   instala o Service Worker, que cacheia o app inteiro.
3. Toque no menu ⋮ do Chrome → **"Adicionar à tela inicial"** (ou o banner de instalação
   pode aparecer sozinho).
4. Abra o app pela tela inicial — a partir daqui funciona como um app nativo, inclusive
   com a barra de navegação e cor de tema.
5. Segure o ícone do app na tela inicial para ver os atalhos rápidos "Agora" e "Emergência".

## 5. Atualizar o roteiro

Toda a viagem está em `src/data/`:

- `src/data/days/day01.ts` até `day14.ts` — um arquivo por dia, com todos os eventos.
- `src/data/hotels.ts` — hotéis (endereço, check-in/checkout, telefone, reserva).
- `src/data/transportes.ts` — voos, trens, ferries, transfers.
- `src/data/ingressos.ts` — ingressos pendentes e nível de urgência (🔴🟠🟢).
- `src/data/pontosDeApoio.ts` — banheiros, água, padarias etc. por cidade.
- `src/data/frases.ts` — frases úteis offline.

Edite os campos que ainda estão como `confirmado: false` ou `"⚠️ A CONFIRMAR"` assim que
tiver a informação definitiva, salve, rode `npm run build` de novo e publique (a Vercel
republica automaticamente a cada push no repositório, se conectado ao GitHub).

Campos importantes de cada evento (`src/data/types.ts`):
- `horarioAbandono`: se esse horário passar, o próximo evento sem horário fixo é
  marcado como "pulado" automaticamente (evita o efeito dominó).
- `planoChuva` / `planoCansaco` (no nível do dia, em `DiaRoteiro`): alternativa curta
  ativável manualmente na tela do roteiro do dia.
- `coordenada`: adicione `{ lat, lng }` em qualquer evento para ele aparecer no Mapa do dia.

## 6. Sincronizar entre os dois celulares (opcional)

Por padrão, cada celular guarda seus dados só localmente. Se quiserem que ingressos comprados,
o plano ativo do dia (Sintra/Belém, Chuva/Cansaço) e os gastos apareçam nos dois celulares, dá
pra ligar uma sincronização leve e gratuita via Supabase — leva uns 5 minutos, uma vez só:

1. Criem uma conta gratuita em https://supabase.com e um novo projeto (plano Free).
2. No painel do projeto, abram o **SQL Editor** e rodem o conteúdo do arquivo
   `supabase-schema.sql` (está na raiz deste projeto) — isso cria a tabelinha usada pela sincronização.
3. Em **Project Settings → API**, copiem a **Project URL** e a chave **anon/public**.
4. No app, abram **Mais → Configurações** e colem essas duas informações no campo de
   sincronização, depois toquem em "Salvar". Façam isso nos dois celulares, com os mesmos dados.
5. Pronto — a partir daí, toda vez que alguém marcar um ingresso como comprado, mudar o plano do
   dia ou registrar um gasto (com internet), isso fica disponível pro outro celular puxar. Toquem
   em "Sincronizar agora" pra buscar o que o outro atualizou, ou deixem — o app já puxa sozinho
   quando abre, se tiver internet.

**Importante:** isso é opcional e não afeta o funcionamento offline do resto do app — só essa
sincronização específica precisa de internet no momento em que roda. Documentos anexados, notas do
diário e o checklist continuam só no celular de cada um, por design (menos dado sensível
trafegando, menos coisa pra sincronizar).

## 7. Anexar documentos (voucher, bilhete, etc.)

Em Reservas (hotéis e transportes), cada card tem um botão "Anexar documento". O
arquivo (PDF ou imagem) fica salvo **só no IndexedDB do celular** — nunca é enviado a
nenhum servidor. Isso significa que também não vai para o backup em texto (JSON) sem
querer perder o histórico: o botão "Backup compartilhável" em Mais → Configurações
inclui os anexos, convertidos para um formato de texto portátil, então dá pra
transferir entre o celular do Marcos e da Fernanda se os dois usarem o app.

## 8. Checklist de teste offline (façam isso antes de viajar)

Eu já validei que o build gera todas as páginas corretamente com os dados certos
(roteiro, hotéis, transportes) — toda a pasta `out/` foi testada localmente e as 35
rotas respondem com o conteúdo correto. **O que eu não consegui testar neste ambiente**
foi o comportamento do Service Worker num navegador real (não tenho acesso a um
navegador de verdade aqui) — então façam este teste manual uma vez, com calma, antes
da viagem:

1. Abra o app publicado (com internet).
2. Navegue por todas as telas: Hoje, Agora, Roteiro (alguns dias), Mapa, Reservas,
   Mais (Checklist, Dinheiro, Emergência etc).
3. Feche o app.
4. Ative o **modo avião** no celular.
5. Abra o app de novo pela tela inicial.
6. Confirme que consegue acessar: Hoje, Roteiro completo, Hotéis, Transportes,
   Checklist, Emergência — tudo isso é a base essencial que **não pode depender de
   internet**.
7. O Mapa vai mostrar a lista do roteiro em vez do mapa interativo quando estiver
   offline (é o comportamento esperado) — a menos que vocês já tenham visitado aquela
   área do mapa com internet antes (o Service Worker cacheia os tiles conforme usados).

Se algo não abrir offline depois desse teste, o mais provável é que o Service Worker
não terminou de instalar antes de vocês tirarem a internet — abram de novo com internet,
esperem uns 10 segundos na tela inicial, e repitam o teste.

## 9. Limitações honestas (leiam antes de confiar 100%)

- **Pontos de apoio** (banheiro/água/padaria): é uma lista curada manualmente como ponto
  de partida, não uma busca ao vivo — cobertura parcial, principalmente em
  Positano/Sorrento. Confirmem in loco quando tiverem sinal.
- **Notificações locais** ("sair em 15 min"): funcionam enquanto o app está aberto
  (em primeiro ou segundo plano na aba/app). Não é um push de servidor — então não é
  100% garantido que disparem se o app ficar fechado por muito tempo. Ainda assim, é
  gratuito e não depende de internet.
- **Mapa interativo**: usa tiles do OpenStreetMap (gratuito, sem chave). Só ficam
  disponíveis offline as áreas que vocês já visualizaram com internet antes.
- Todos os campos marcados `⚠️ A CONFIRMAR` no roteiro (ver README seção 5) precisam
  da informação real de vocês antes da viagem.

## 10. Estrutura de pastas

```
src/
  app/                 rotas (Hoje, Roteiro, Mapa, Reservas, Mais + subpáginas)
  components/          componentes de UI reutilizáveis
  data/                todo o roteiro, hotéis, transportes, ingressos etc.
  lib/                 lógica de horário/fuso, banco local (Dexie), categorias
public/
  manifest.json        manifest do PWA (com atalhos)
  sw.js                Service Worker (cache offline)
  icon-*.png           ícones do app
scripts/
  generate-sw-manifest.js   gera a lista de arquivos que o Service Worker deve cachear
```
