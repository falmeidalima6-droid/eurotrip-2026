// Eurotrip 2026 — Service Worker
// Estratégia: pré-cachear todo o app (gerado como site estático) no install,
// para funcionar 100% offline depois do primeiro carregamento. Tiles de mapa
// (OpenStreetMap) usam stale-while-revalidate: mostram a versão salva na hora
// e atualizam em segundo plano quando há internet.

const CACHE_VERSION = "eurotrip-v1";
const APP_CACHE = `${CACHE_VERSION}-app`;
const TILES_CACHE = `${CACHE_VERSION}-tiles`;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(APP_CACHE);
      try {
        const resposta = await fetch("/precache-manifest.json");
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

  // Mesma origem: cache-first (app shell), com fallback de navegação para /hoje/
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request));
  }
});

async function cacheFirst(request) {
  const cache = await caches.open(APP_CACHE);
  const cacheado = await cache.match(request, { ignoreSearch: true });
  if (cacheado) return cacheado;

  try {
    const resposta = await fetch(request);
    if (resposta.ok) cache.put(request, resposta.clone());
    return resposta;
  } catch {
    if (request.mode === "navigate") {
      const fallback = await cache.match("/hoje/");
      if (fallback) return fallback;
    }
    return new Response("Offline e sem versão salva desta página.", {
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
