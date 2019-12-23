const extendRoutes = require('./plugins/extendRoutes.js');
module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: '游海旅行-欧洲酒店、大车、司导、门票餐厅、玩乐、商旅游学资源一站式B2B预定平台',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: '游海旅行-欧洲酒店、大车、司导、门票餐厅、玩乐、商旅游学资源一站式B2B预定平台，游海旅行，游海，B2B，欧洲，法国，酒店，大车，司导，门票餐厅，玩乐，行程定制',
      },
    ],
    link: [{
        rel: 'icon',
        type: 'image/x-icon',
        href: '/icon_logo.png'
      },
      // iconfont class
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'https://at.alicdn.com/t/font_1360760_m5i8wwqcqaq.css'
      },
    ],
    script: [
      // iconfont svg
      {
        rel: 'script',
        type: 'text/javascript',
        src: 'https://at.alicdn.com/t/font_1360760_m5i8wwqcqaq.js'
      },
      {
        rel: 'script',
        type: 'text/javascript',
        defer: 'defer',
        src: 'https://ditu.google.cn/maps/api/js?key=AIzaSyDOW8NW4egQT4QFsyLzaOlDR95ib12XywM',
      },
      {
        rel: 'script',
        type: 'text/javascript',
        async: 'async',
        src: 'https://ykf-webchat.7moor.com/javascripts/7moorInit.js?accessId=81b474d0-0430-11ea-959c-cfbc3ad39d7f&autoShow=true&language=ZHCN',
      },
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#E9047B'
  },
  /*
   ** Global CSS
   */
  css: [{
      src: '~/assets/style/reset.less',
      lang: 'less'
    },
    {
      src: '~/assets/style/common.less',
      lang: 'less'
    },
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{
      src: '~/plugins/i18n',
      ssr: true
    },
    {
      src: '~plugins/view-design',
      ssr: true
    },
    '~/plugins/mixin',
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  router: {
    middleware: ['i18n', 'auth'],
    extendRoutes,
  },
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/style-resources'
  ],
  styleResources: {
    less: './assets/style/variable.less'
  },
  axios: {
    proxy: true,
    // prefix: '/api/web/api', // web/api是WEB接口公共部分
    // credentials: true,
  },
  proxy: {
    '/client': {
      target: process.env.NODE_ENV === 'production' ? 'http://39.98.245.40:9000' : 'http://192.168.8.13:19300', // 39.98.245.40:9000   //192.168.8.13:19300
      // target: 'http://39.98.245.40:9000', // 39.98.245.40:9000   //192.168.8.13:19300
      pathRewrite: {
        '^/client': '/',
        changeOrigin: true,
      },
    },
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    devtools: true,
    extend(config, {
      isDev,
      isClient
    }) {},
  }
}
