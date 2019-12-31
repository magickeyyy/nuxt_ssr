const Koa = require('koa')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')

const app = new Koa()

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'

async function start () {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }
let result;
function findobj(data) {
  let arr;
  let isArr = (data) instanceof Array
  let isObj = (data) instanceof Object
  if(!isObj && !isArr) return;
  if(arr && arr.length === 0) return;
  if(isArr) {
    arr = data;
  }
  if(!isArr && isObj) {
    arr = Object.keys(data).map( v => data[v])
    console.log(arr.length)
  }
  for(let i = 0; i < arr.length; i++) {
    if((arr[i]) instanceof Object && arr[i].msg && arr[i].msg === '操作成功') {
      result = arr[i];
      console.log(arr[i])
      return;
    } else {
      findobj(arr[i])
    }
  }
}

  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    if(ctx.url === '/client/web/api/auth/login/username') {
      // findobj(ctx.res)
    }
    if(ctx.url === '/client/web/api/customer/logout') {
      console.log(333,ctx.res.body)
    }
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
