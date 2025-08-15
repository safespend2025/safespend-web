// Service Worker básico para SafeSpend Web
const CACHE = 'safespend-web-v1';
const PRECACHE = ['/', '/index.html','/app.js','/manifest.json','/icons/icon-192.png','/icons/icon-512.png'];

self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(PRECACHE)));
  self.skipWaiting();
});
self.addEventListener('activate', (e)=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE?caches.delete(k):null))));
  self.clients.claim();
});
self.addEventListener('fetch', (e)=>{
  const req = e.request;
  if (req.mode==='navigate'){
    e.respondWith(fetch(req).catch(()=>caches.match('/index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(r=>r||fetch(req)));
});
