import { Router } from 'itty-router'
import bcrypt from 'bcryptjs'

const router = Router()

const iterations = 12

router.get('/hash', ({ query }) => {
  try {
    const password = decodeURIComponent(query?.password ?? '')
    if (!password)
      return new Response('Missing password or hash', { status: 400 })
    const hash = bcrypt.hashSync(password, iterations)
    return new Response(hash, { status: 200 })
  } catch (error: any) {
    return new Response(error.message, { status: 500 })
  }
})

router.get('/compare', ({ query }) => {
  const password = decodeURIComponent(query?.password ?? '')
  const hash = decodeURIComponent(query?.hash ?? '')
  if (!password || !hash)
    return new Response('Missing password or hash', { status: 400 })
  const areEqual = bcrypt.compareSync(password, hash)
  return new Response(areEqual ? 'success' : 'failure', {
    status: areEqual ? 200 : 400,
  })
})

router.all('*', () => new Response('404, not found!', { status: 404 }))

addEventListener('fetch', (e) => {
  e.respondWith(router.handle(e.request))
})
