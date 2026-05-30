const CACHE = 'luminary-v4';
const PRECACHE = [
  '/', '/index.html', '/offline.html', '/pricing.html',
  '/checkout.html', '/contact.html', '/pay.html',
  '/more/owner.html', '/more/credits.html',
  '/styles/main.css', '/styles/checkout.css',
  '/scripts/config.js', '/scripts/main.js', '/scripts/checkout.js',
  '/scripts/contact.js', '/scripts/encryption-utils.js',
  '/scripts/timesync.js', '/scripts/management.js', '/scripts/pay.js',
  '/control/pricing_plans.js', '/control/free_plans.js',
  '/control/reviews.js', '/control/contacts.js', '/control/wishes.js',
  '/assets/icon.svg', '/assets/logo.svg', '/manifest.json'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (!e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type !== 'opaque') {
          caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        }
        return res;
      }).catch(() => {
        if (e.request.headers.get('accept')?.includes('text/html'))
          return caches.match('/offline.html');
      });
    })
  );
});
