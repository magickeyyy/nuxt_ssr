/*
 * @Author: magckeyyy
 * @Date: 2019-12-17 10:10:32
 * @Description: 
 * @Attention: 
 */
export const state = () => ({
    payInfo: {}, // 支付信息
    orderData:{},//支付数据
});

export const mutations = {
   SET_ORDER(state, data) {
        state.payInfo = data;
    },
    SET_DATA(state,data){
        state.orderData=data
    }
};

export const actions = {
    ASYNC_SET_ORDER({commit}, param) {
        commit('SET_ORDER', param);
        return new Promise((resolve, reject) => {
            resolve();
        })
    },
    ASYNC_SET_DATA({commit},param){
        commit('SET_DATA',param);
    }
}