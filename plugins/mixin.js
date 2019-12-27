import Vue from 'vue'
import { formatDate } from '~/mixin/formatDate'
import { formatNumber } from '~/mixin/formatNumber'
import thr_deb from '~/mixin/thr_deb'
import { storage } from '~/mixin/storage'

Vue.mixin(formatDate)
Vue.mixin(formatNumber)
Vue.mixin(thr_deb)
Vue.mixin(storage)