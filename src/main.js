// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
Vue.config.productionTip = false

Vue.use(VueLazyload, {
	loading: '../static/loading-svg/loading-bars.svg'
});
Vue.use(Vuex);
Vue.use(infiniteScroll)

const store = new Vuex.Store({
	state: {
		nickName: '',
		cartCount: 0
	},
	mutations: {
		updateUserInfo(state, nickName) {
			state.nickName = nickName;
		},
		initCartCount(state, cartCount) {
			state.cartCount = cartCount;
		},
		updateCartCount(state, cartCount) {
			state.cartCount += cartCount;
		}
	}
});

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
    store,
	template: '<App/>',
	components: { App }
})
