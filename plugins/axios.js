/* 只能使用this.$axios({})使用才能获取到自定义配置(@nuxt/axios版本更新,) */
export default function ({ $axios, app: { router, store }, route, redirect, next }, inject) {
    $axios.onRequest(config => {
        // 处理IE每次请求参数相同就取缓存的问题
        config.headers['Cache-Control'] = 'no-cache';
        config.headers['Pragma'] = 'no-cache';

        if(config.headers.token && store.state.login.token) {
            config.headers['Authorization'] = store.state.login.token;
        } else {
            redirect(401, '/');
        }
    })
  
    $axios.onError(error => {
      const code = parseInt(error.response && error.response.status)
      if (code === 400) {
        redirect('/400')
      }
    })
  }

import Vue from 'vue'

