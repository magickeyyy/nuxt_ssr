export const state = () => ({
	locales: ['en', 'zh'],
	locale: 'zh',
	navStyle:'',
	// 在axios中每个请求都会在开始时+1，结束时-1；在路由跳转前后都清零，然后调用全局loading方法
	loading: 0,
	ss: ''
})

export const mutations = {
	SET_LANG(state, locale) {
		if (state.locales.includes(locale)) {
			state.locale = locale
		}
	},
	SET_NAVSTYLE(state, str){
		state.navStyle = str
	},
	SET_LOADING(state, n) {
		state.loading = n
	},
	SET_SS(state, n){
		state.ss = n;
	}
}

export const actions = {
	ASYNC_SET_LANG({commit}, param) {
		commit('SET_LANG', param)
	},
	ASYNC_SET_NAVSTYLE({commit}, str) {
		commit('SET_NAVSTYLE', str)
	},
	async nuxtServerInit({ commit}, {app: { router }, store, req, res, query, params, route}) {
		let cookie = req.headers.cookie;
		await commit('SET_SS', req.headers.cookie)
	}
}