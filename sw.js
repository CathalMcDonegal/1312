const CACHE_NAME = 'normativa-penal-bcn-v9';
const APP_SHELL = ['./','./index.html','./css/styles.css','./css/cp.css','./js/app.js','./js/extras.js','./manifest.json','./logo.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL)));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));});
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE_NAME).then(c=>c.put(event.request,copy)).catch(()=>{});return response;}).catch(()=>caches.match(event.request).then(c=>c||caches.match('./index.html'))));});
