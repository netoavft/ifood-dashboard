// Service worker do Painel Cidadão do Mundo.
// Estratégia REDE-PRIMEIRO de propósito: o painel muda com frequência e os dados são ao vivo,
// então o cache só entra em cena quando a rede falha (ex.: abrir no elevador). Assim nunca
// existe o risco de alguém ficar preso numa versão antiga do painel.
const CACHE = 'painel-cdm-v2';

self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(
  caches.keys()
    .then((nomes) => Promise.all(nomes.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
    .then(() => clients.claim())
));

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  // Só interceptamos arquivos do próprio site. Chamadas externas (ex.: Supabase) vão
  // direto à rede: recriar requisições CORS com init quebra no Safari/iOS ("Load failed").
  if (new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    // cache: 'no-cache' força revalidar com o servidor (o GitHub Pages manda max-age=600,
    // que seguraria a versão antiga por até 10 minutos no cache HTTP do navegador)
    fetch(e.request, { cache: 'no-cache' })
      .then((resp) => {
        // guarda uma copia para o modo offline
        if (resp.ok) {
          const copia = resp.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copia));
        }
        return resp;
      })
      .catch(() => caches.match(e.request))
  );
});
