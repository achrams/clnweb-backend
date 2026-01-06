/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import { sep, normalize } from 'node:path'
import app from '@adonisjs/core/services/app'
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const AuthController = () => import('#controllers/auth_controller')
const NewsController = () => import('#controllers/news_controller')

const PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    // ===================== API =====================
    router.post('login', [AuthController, 'login'])
    router
      .group(() => {
        router.get('/', [NewsController, 'list'])
        router.get('/:slug', [NewsController, 'detailSlug'])
      })
      .prefix('/news')

    router
      .group(() => {
        // ===================== ADMIN WP =====================
        router
          .group(() => {
            // ===================== NEWS =====================

            router.get('/', [NewsController, 'index'])
            router.post('/', [NewsController, 'store'])
            router.get('/:id', [NewsController, 'detail'])
            router.put('/:id', [NewsController, 'update'])
            router.patch('/:id', [NewsController, 'edit'])
            router.delete('/:id', [NewsController, 'delete'])
          })
          .prefix('/news')
      })
      .use(middleware.auth())
      .prefix('/admin-wp')
  })
  .prefix('/api')

// ===================== STATIC FILE =====================

router.get('/uploads/*', ({ request, response }) => {
  const pathFile = request.param('*').join(sep)
  const normalizedPath = normalize(pathFile)

  if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
    return response.badRequest('Malformed Path')
  }
  const absolutePath = app.makePath('storage/uploads', normalizedPath)
  console.log({ absolutePath })
  return response.download(absolutePath)
})
