const CACHE = "cai2026-v1";

const files = [

"./",
"./index.html",
"./style.css",
"./script.js"

];

self.addEventListener("install", e=>{

e.waitUntil(

caches.open(CACHE).then(cache=>cache.addAll(files))

);

});

self.addEventListener("fetch",e=>{

e.respondWith(

caches.match(e.request).then(res=>{

return res || fetch(e.request);

})

);

});
