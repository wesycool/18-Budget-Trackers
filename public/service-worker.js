const CACHE_STATIC_NAME = "precache";
const FILES_TO_CACHE = [
  "/",
  "/styles.css",
  "/index.js",
  "/indexedDb.js",
  "/manifest.webmanifest",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
]


self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(self.skipWaiting())
  )
})


// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then( keyList => {
        return Promise.all(keyList.map( key => {
            if (key !== CACHE_STATIC_NAME) return caches.delete(key);
        }))
    })
  )
  return self.clients.claim()
})


self.addEventListener('fetch', event => {
  if (event.request.method != "POST"){
    event.respondWith(
      caches.match(event.request)
      .then(response => {
        return (!navigator.onLine)? response : caches.open(CACHE_STATIC_NAME).then(cache => {
          return fetch(event.request).then(response => {
            return cache.put(event.request, response.clone()).then(() => {return response})
          })
        })
      })
    )
  }

})