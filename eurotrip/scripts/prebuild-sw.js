/* eslint-disable @typescript-eslint/no-require-imports */
// Roda ANTES do `next build` (hook "prebuild" do npm).
// Gera public/sw.js já com o número de versão certo deste build, para que,
// quando o Next.js copiar a pasta public/ para out/, o arquivo já esteja
// correto — sem precisar "consertar" depois (foi isso que causava uma
// corrida entre esse ajuste e a cópia do Next, fazendo às vezes a versão
// antiga "__BUILD_VERSION__" ir parar no site publicado).
const fs = require("fs");
const path = require("path");

const versao = `eurotrip-${Date.now()}`;

const conteudoSW = `// Eurotrip 2026 — Service Worker (gerado automaticamente a cada build)
// Estratégia: telas (HTML) usam "network-first" — sempre busca a versão mais
// nova quando há internet, e só usa a guardada se estiver offline. Isso faz
// o app atualizar sozinho a cada nova publicação, sem precisar de nenhum
// truque manual. Arquivos estáticos (JS/CSS/ícones) usam cache-first, porque
// o nome deles já muda sozinho a cada build (são seguros de guardar direto).
// Tiles de mapa (OpenStreetMap) usam stale-while-revalidate.

const CACHE_VERSION = "${versao}";
const APP_CACHE = \`\${CACHE_VERSION}-app\`;
const TILES_CACHE = \`\${CACHE_VERSION}-tiles\`;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(APP_CACHE);
      try {
        const resposta = await fetch("/precache-manifest.json", { cache: "reload" });
        const arquivos = await resposta.json();
        await Promise.allSettled(
          arquivos.map(async (url) => {
            try {
              const req = new Request(url, { cache: "reload" });
              const res = await fetch(req);
              if (res.ok) await cache.put(url, res);
            } catch {
              // ignora falhas individuais — não deve travar a instalação
            }
          })
        );
      } catch {
        // manifest ainda não existe (ex: dev mode) — segue sem pré-cache
      }
      self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const nomes = await caches.keys();
      await Promise.all(
        nomes.filter((n) => n.startsWith("eurotrip-") && n !== APP_CACHE && n !== TILES_CACHE).map((n) => caches.delete(n))
      );
      self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Tiles do mapa: stale-while-revalidate
  if (url.hostname.endsWith("tile.openstreetmap.org")) {
    event.respondWith(staleWhileRevalidate(request, TILES_CACHE));
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Telas (navegação/HTML): sempre tenta buscar a versão mais nova primeiro.
  const ehNavegacao =
    request.mode === "navigate" || (request.headers.get("accept") || "").includes("text/html");
  if (ehNavegacao) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Arquivos estáticos (JS/CSS/ícones/manifest): cache-first, são seguros e rápidos.
  event.respondWith(cacheFirst(request));
});

async function networkFirst(request) {
  const cache = await caches.open(APP_CACHE);
  try {
    const resposta = await fetch(request, { cache: "no-store" });
    if (resposta.ok) cache.put(request, resposta.clone());
    return resposta;
  } catch {
    const cacheado = await cache.match(request, { ignoreSearch: true });
    if (cacheado) return cacheado;
    const fallback = await cache.match("/hoje/");
    if (fallback) return fallback;
    return new Response("Offline e sem versão salva desta página.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(APP_CACHE);
  const cacheado = await cache.match(request, { ignoreSearch: true });
  if (cacheado) return cacheado;

  try {
    const resposta = await fetch(request);
    if (resposta.ok) cache.put(request, resposta.clone());
    return resposta;
  } catch {
    return new Response("Offline e sem versão salva deste arquivo.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

async function staleWhileRevalidate(request, nomeCache) {
  const cache = await caches.open(nomeCache);
  const cacheado = await cache.match(request);
  const buscaDeFundo = fetch(request)
    .then((res) => {
      if (res.ok) cache.put(request, res.clone());
      return res;
    })
    .catch(() => undefined);
  return cacheado || (await buscaDeFundo) || new Response("", { status: 504 });
}
`;

const publicSwPath = path.join(__dirname, "..", "public", "sw.js");
fs.writeFileSync(publicSwPath, conteudoSW);
console.log(`public/sw.js gerado com a versão: ${versao}`);
