const CACHE_NAME = 'news-cache-v1';
const API_URL = '/api/news';

// Установка – прекеш не нужен, только динамическое кэширование
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

// Стратегия: сначала сеть, при ошибке (500 или недоступности) – кэш
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.pathname === API_URL) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Кэшируем только успешные ответы (200)
          if (response.ok) {
            const clonedResponse = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clonedResponse));
            return response;
          }
          // Если ответ с ошибкой (например, 500) – пытаемся отдать кэш
          return caches.match(event.request).then((cached) => {
            if (cached) {
              // Добавляем заголовок, чтобы клиент знал, что данные из кэша
              const headers = new Headers(cached.headers);
              headers.set('X-Cache', 'HIT');
              return new Response(cached.body, {
                status: cached.status,
                statusText: cached.statusText,
                headers: headers
              });
            }
            // Нет кэша – возвращаем исходную ошибку
            return response;
          });
        })
        .catch(() => {
          // Если сеть недоступна или ошибка, пытаемся взять из кэша
          return caches.match(event.request).then((cached) => {
            if (cached) {
              const headers = new Headers(cached.headers);
              headers.set('X-Cache', 'HIT');
              return new Response(cached.body, {
                status: cached.status,
                statusText: cached.statusText,
                headers: headers
              });
            }
            // Если кэша нет – возвращаем fallback-ответ
            return new Response(
              JSON.stringify({ error: 'Нет данных и нет кэша' }),
              { status: 503, headers: { 'Content-Type': 'application/json' } }
            );
          });
        })
    );
  }
});