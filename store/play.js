/*
 * @Author: magckeyyy
 * @Date: 2019-10-28 16:31:16
 * @Description: 
 * @Attention: 
 */
export const state = () => ({
    resetTags: 1,
    payInfo: {}, // 支付信息
    npp:{ // 玩乐订单填写页面联系人手机号、前缀、姓名
        contactName: '',
        contactTelPrefix: '86',
        contactTelephone: '',
    }
});

export const mutations = {
    SET_RESTTAGS(state, data) {
        state.resetTags++;
    },
    SET_ORDER(state, data) {
        state.payInfo = data;
    },
    SET_NPP(state, data) {
        Object.keys(data).map(v => {
            if(data[v]) {
                state.npp[v] = data[v];
            }
        });
    }
};
