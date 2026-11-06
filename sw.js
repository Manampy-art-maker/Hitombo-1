const C="hitombo-v16";
const A=["./","./index.html","./manifest.json","./verses.json","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(A.map(u=>fetch(u,{cache:"reload"}).then(r=>{if(!r.ok)throw new Error(u);return c.put(u,r)})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;
e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).catch(()=>caches.match("./index.html"))))});
async function showVerse(){
  const r=(await caches.match("./verses.json"))||(await fetch("./verses.json"));
  const l=await r.json();const v=l[Math.floor(Date.now()/864e5)%l.length];
  return self.registration.showNotification("Teny androany: "+v[0],{body:v[1],icon:"./icon-192.png",tag:"teny-androany"});
}
self.addEventListener("periodicsync",e=>{if(e.tag==="teny-androany")e.waitUntil(showVerse())});
self.addEventListener("notificationclick",e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:"window"}).then(cs=>cs.length?cs[0].focus():self.clients.openWindow("./index.html")))});
