/*
 * @Author: magckeyyy
 * @Date: 2019-10-28 16:31:16
 * @Description: 
 * @Attention: 
 */
export const state = () => ({
    token: undefined,
	userInfo: {},
	logined: false,
	nameList: []
})

export const mutations = {
	SET_LOGIN(state, { token, logined = false, userInfo = {} }) {
		state.token = token;
		state.logined = logined;
		state.userInfo = userInfo;
	},
	SET_NAMELIST(state, list) {
		state.nameList = list;	
	}
}
export const actions = {
	ASYNC_SET_LOGIN({ commit }, { token, logined = false, userInfo = {} }) {
		commit('SET_LOGIN', { token, logined, userInfo })
	}
}