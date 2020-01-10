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
    },
    play_search: { // 去搜索列表页
        countryId: '',
        countryCn: '',
        cityId: '',
        cityCn: '',
        showCity: true,
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
    },
    SET_PLAY_SEARCH(state, data) {
        state.play_search = data;
    }
};
