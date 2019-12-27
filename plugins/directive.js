/*
 * @Author: magckeyyy
 * @Date: 2019-11-07 17:05:49
 * @Description: 
 * @Attention: 
 */
import Vue from 'vue'
import VueSticky from "vue-sticky"

// v-noimg="value"
Vue.directive('noimg', {
    bind: function (el, { value }, vnode) {
        const usable = [ '280-180', '286-184', '320-430', '480-276', '960-600', '1120-430' ];
        let section = usable.find(v => v === value) || usable[0];
        const img = require('../assets/public_img/no_img'+section+'.png')
        el.onerror = function () {
            // 最多执行两次，然后销毁onerror
            let n = el.getAttribute('error');
            n?el.setAttribute('error', n++):(el.setAttribute('error', 1))
            el.src = img;
            // el.style.width="100%";
            // el.style.height="100%";
            if(n>2){
                el.onerror = null;
            }
        }
    }
})

Vue.directive('sticky', VueSticky)