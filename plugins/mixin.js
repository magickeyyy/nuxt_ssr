import Vue from 'vue'
import { formatDate } from '~/mixin/formatDate'
import { formatNumber } from '~/mixin/formatNumber'
import thr_deb from '~/mixin/thr_deb'
import Cookies from 'js-cookie'

Vue.mixin(formatDate)
Vue.mixin(formatNumber)
Vue.mixin(thr_deb)
Vue.mixin({
    methods: {
        Cookies() {
            return Cookies;
        }
    }
})