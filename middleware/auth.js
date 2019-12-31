/*
 * @Author: magckeyyy
 * @Date: 2019-11-29 11:42:19
 * @Description: redirect至默认子路由在plugins/extendRoutes中定义redirect
 * @Attention: 没有详细资料包括官网，debugger看传参
 */
import { Message } from 'view-design';
export default ({ app: { router }, redirect, store, route }) => {
    if (!store.state.login.token && route.meta instanceof Array && route.meta.filter(v => v.login === 2).length > 0) {
        Message.error('请登录');
        return redirect(200, '/');
    } else if(!store.state.login.token && route.meta instanceof Object && route.meta.login === 2) {
        Message.error('请登录');
        return redirect(200, '/');
    }
    const PLAY_PAY_REG = /^\b(bus|play|hotel)\b-\b(pay)\b$/g;
    // router.matched.length===0,404
    const module_name = route.name?route.name.split('-')[0]:'';
    if(PLAY_PAY_REG.test(route.name) && (!store.state[module_name].payInfo || JSON.stringify(store.state[module_name].payInfo) === '{}')) {
        // 目前订单页name都是paly-order、bus-order、hotel-team、hotel-scatters,直接返回模块首页
        // 想返回上一页，如果上一页不统一，无法获取上一页路径。
        // router.go(-1)页面会闪错误。
        // redirect(status, path, query:object), 目前看来status没有卵用
        return redirect(200, '/' + module_name);
    }
};
