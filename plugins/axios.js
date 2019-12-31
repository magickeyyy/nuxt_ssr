import QS from 'qs';
import { Message } from 'view-design';

const urlencoded = 'application/x-www-form-urlencoded;charset=UTF-8';
const json = 'application/json;charset=UTF-8';

function checkResp(blob, name) {
  if ('msSaveOrOpenBlob' in navigator) {
      // Microsoft Edge and Microsoft Internet Explorer 10-11
      window.navigator.msSaveOrOpenBlob(blob, name);
  } else {
      // standard code for Google Chrome, Mozilla Firefox etc
      let url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
      window.URL.revokeObjectURL(a.href);
  }
}

/* 只能使用this.$axios({})使用才能获取到自定义配置(@nuxt/axios版本更新,) */
export default function ({ $axios, app: { router, store }, route, redirect, next }, inject) {
    $axios.onRequest(config => {
        // 处理IE每次请求参数相同就取缓存的问题
        if(process.client && navigator.userAgent.indexOf('Trident') !== -1) {
            // config.headers['Cache-Control'] = 'no-cache';
            config.headers['Pragma'] = 'no-cache';
        }
        if(config.headers.token) {
            if(store.state.login.logined && store.state.login.token) {
              config.headers['Authorization'] = store.state.login.token;
              delete config.headers.token;
            } else {
              redirect(401, '/');
            }
        }
        if (config.headers.encode === 'urlencoded') {
            config.data = QS.stringify(config.data);
            config.headers[config.method]['Content-Type'] = urlencoded;
            delete config.headers.encode;
        }
        return config
    })
    
    // 返回回调
    $axios.onResponse(res => {
        let data = res.data;
        if (res.status * 1 === 200) {
            // 下载
            if (res.config.custom && res.config.custom.blob) {
                checkResp(new Blob([res.data]), res.config.custom.blob);
                data = { success: true, data: null, status: 200, msg: '下载成功' };
            }
            if (!res.data.success && !(res.config.custom && res.config.custom.blob)) {
                Message.error(res.data.msg || res.msg || '后台未定义错误信息');
            }
            return data;
        }
    });

    $axios.onError(error => {
      const code = parseInt(error.response && error.response.status)
      if (code === 400) {
        redirect('/400')
      }
    })

    $axios.onResponseError(error => {
      let response = error.response;
      if (!response) {
          Message.error('未知错误！');
      } else {
          let status = response.status * 1;
          if (status >= 500) {
              if (status === 504) {
                  Message.error(response.statusText + '响应超时,请重试');
              } else {
                  Message.error(response.statusText + '服务器出错');
              }
          } else if (status >= 400) {
              if (status === 401) {
                  if (process.client) {
                      sessionStorage.removeItem('token');
                      sessionStorage.removeItem('userID');

                      localStorage.removeItem('token');
                      localStorage.removeItem('userID');
                  }
                  Message.error('请登录');
              } else {
                  Message.error(response.data.msg || response.message || error.message);
              }
          }
      }
      return Promise.resolve(
          error.message || response.data || { code: 500, data: null, msg: '未知错误', success: false },
      );
  });
  }

