const CACHE_NAME='codex-v20';
const APP_SHELL=['./','./index.html','./css/styles.css','./css/cp.css','./css/normativa.css','./js/app.js','./js/codex-legal.js','./js/cp-enhance.js','./js/extras.js','./js/nav.js','./js/normativa-plus.js','./js/normativa.js','./js/normativa-ui.js','./manifest.json','./logo.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE_NAME).then(c=>Promise.allSettled(APP_SHELL.map(u=>c.add(u)))).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE_NAME).then(c=>c.put(event.request,copy)).catch(()=>{});return response}).catch(()=>caches.match(event.request).then(c=>c||caches.match('./index.html'))))});
