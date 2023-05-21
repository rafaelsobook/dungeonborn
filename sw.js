self.addEventListener('install', e => {
    console.log('Installed SW')
})

const version = 'dungeonBV1'
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then( allCaches => {
            allCaches.map(cacheName => cacheName !== version ? caches.delete(cacheName) : cacheName)
        })
    )
})
const innerRequests = ['POST', 'PATCH', 'DELETE']
self.addEventListener('fetch', e => {
    const isInnerReq = innerRequests.some(innerReq => innerReq === e.request.method)
    if(isInnerReq) return console.log('the request is from innerAPI will return')
    e.respondWith(
        fetch(e.request)
        .then(allReq => {
            const resClone = allReq.clone();
            caches.open(version).then(cache => {
                cache.put(e.request, resClone)
            })
            return allReq
        }).catch( () => caches.match(e.request))
    )
})