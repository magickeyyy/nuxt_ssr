/*
 * @Author: magckeyyy
 * @Date: 2019-10-28 16:31:16
 * @Description: 
 * @Attention: 
 */
export const state = ()=>({
    // 跳转预订信息页的上传参数
    orderPre:null,
    // 生成的订单信息
    orderInfo:null,
    HQOrderpre:null, // 好巧预定准备信息
    YHOrderpre: null, // 游海团房预定准备信息
    member: null, // 订单填写页入住成员信息，用于限制入住人信息填写
    payInfo: null,
})

export const mutations = {
    SET_ORDERPRE(state,data){
        state.orderPre = data;
    },
    SET_ORDERINFO(state,data){
        state.orderInfo = data;
    },
    SET_ORDERPRE(state, { type, pre, member }) {
        // type：HQ、YH,修改一个重置另一个，每次进订单页就检查state中的值是否存在否则go-1
        let another = type==="HQ"?"YH":'HQ';
        state[type + 'Orderpre'] = pre;
        state.member = member;
        state[another + 'Orderpre'] = null;
    },
    SET_ORDER(state, data) {
        state.payInfo = data;
    },
}

export const actions = {
    ASYNC_SET_ORDERPRE({commit}, param){
        commit('SET_ORDERPRE',param)
    },
    ASYNC_SET_ORDERINFO({commit}, param){
        commit('SET_ORDERINFO',param)
    }
}