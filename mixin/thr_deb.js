/*
 * @Author: magckeyyy
 * @Date: 2019-10-28 16:31:16
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-11-08 16:46:02
 * @Description: 
 * @Attention: 
 */
import _ from 'lodash'
export default {
    methods: {
        mixin_m_throttle(func, wait, options) {
            return _.throttle(func, wait, options);
        },
        mixin_m_debounce(func, wait, options) {
            return _.debounce(func, wait, options);
        },
    }
}