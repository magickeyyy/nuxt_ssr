import Vue from 'vue'
import { formatDate } from '~/mixin/formatDate'
import { storage } from '~/mixin/storage'
import { formatNumber } from '~/mixin/formatNumber'
import thr_deb from '~/mixin/thr_deb'

Vue.mixin(formatDate)
Vue.mixin(storage)
Vue.mixin(formatNumber)
Vue.mixin(thr_deb)