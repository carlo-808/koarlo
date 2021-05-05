'use strict'

const Koa = require('koa')
const app = new Koa()
const Router = require('@koa/router')
const routes = new Router()
const { makeRequest } = require('./utils')

const PORT = 8089

const handler = async (ctx, next) => {
  const options = {
    hostname: 'localhost',
    port: 9990,
    path: '/',
    method: 'GET'
  }
  let result = await makeRequest(options)
  console.log(result)

  ctx.body =result

  return next()
}

routes.get('/', handler)
routes.get('/kill', (ctx) => {
  process.exit(0)
})

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    ctx.status = 500
    ctx.body = error
  }
})

app.use(routes.routes())

app.listen(PORT, () => console.log(`server started ${PORT}`))
