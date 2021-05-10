'use strict'

// const newrelic = require('newrelic')
const Koa = require('koa')
const app = new Koa()
const Router = require('@koa/router')
const routes = new Router()
const { makeRequest } = require('./utils')
const util = require('util')
const setTimeoutPromise = util.promisify(setTimeout)
const cpuSampler = require('./utils/cpu')

const MAX_SEGMENTS = 700

async function doWork() {
  await setTimeoutPromise(1)
}

const PORT = 8089

const cpuState = {
  cpuUser: 0.0,
  cpuSystem: 0.0,
  count: 0
}

cpuSampler.start(cpuState)

const handler = async (ctx, next) => {
  const options = {
    hostname: 'localhost',
    port: 9990,
    path: '/',
    method: 'GET'
  }
  // console.log(result)
  // for (let i = 0; i < MAX_SEGMENTS; i++) {
  //   await newrelic.startSegment(`Segment ${i}`, false, doWork)
  // }

  let result = await makeRequest(options)
  ctx.body = result

  return next()
}

routes.get('/', handler)
routes.get('/kill', (ctx) => {
  cpuSampler.stop()
  console.log(cpuState)
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
