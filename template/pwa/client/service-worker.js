importScripts('/sw-toolbox.js')


toolbox.precache(['/', '/introduce', '/test', '/manifest.json'])

toolbox.router.get('/', toolbox.networkFirst)
toolbox.router.get('/introduce', toolbox.networkFirst)
toolbox.router.get('/test', toolbox.networkFirst)

toolbox.router.get('/manifest.json', toolbox.cacheFirst)
toolbox.router.get('/runtime.*.js', toolbox.cacheFirst)
toolbox.router.get('/*.png', toolbox.cacheFirst)
toolbox.router.get('/bundle.*.js', toolbox.cacheFirst)
toolbox.router.get('/chunk.*.js', toolbox.cacheFirst)
