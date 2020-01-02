/*
 * @Author: magckeyyy
 * @Date: 2019-10-28 16:31:16
 * @Description: 
 * @Attention: 
 */
export const state = () => ({
    token:null,
	userInfo:{},
	logined: false,
	nameList: []
})

export const mutations = {
	SET_LOGIN(state, { token, logined, userInfo }) {
		state.token = token;
		state.logined = logined;
		state.userInfo = userInfo;
	},
	SET_NAMELIST(state, list) {
		state.nameList = list;	
	}
}