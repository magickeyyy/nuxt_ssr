/*
 * @Author: magckeyyy
 * @Date: 2019-10-28 16:31:16
 * @Description: 
 * @Attention: 
 */
// PAY_ALIPAY_H5("支付宝H5支付"),
// PAY_ALIPAY_APP("支付宝APP支付"),
// PAY_ALIPAY_WEB("支付宝电脑网页支付"),
// PAY_WECHAT_H5("微信H5支付"),
// PAY_WECHAT_APP("微信APP支付"),
// PAY_WECHAT_NATIVE("微信电脑网页支付"),
// UNIFIED_TRADE_QUERY("统一订单查询")

export const state = () => ({
    type: '',
    alipay: '',
    wexin:'',
    orderInfo: null
})

export const mutations = {
	SET_PAY(state, {type,alipay,wexin}) {
		switch(type){
            case 'PAY_ALIPAY_WEB':
                state.type = 'PAY_ALIPAY_WEB';
                state.alipay = alipay;
                state.wexin = '';
                break;
            case 'PAY_WECHAT_NATIVE':
                state.type = 'PAY_WECHAT_NATIVE';
                state.alipay = '';
                state.wexin = wexin;
                break;
        }
    },
    SET_ORDER(state,info){
        state.orderInfo = info;
    }
}

export const actions = {
	ASYNC_SET_PAY({commit}, param) {
		commit('SET_PAY', param)
    },
    ASYNC_SET_ORDER({commit}, param) {
		commit('SET_ORDER', param)
	},
}