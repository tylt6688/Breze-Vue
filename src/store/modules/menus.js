import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

let title = '首页';
let name = 'Index';
export default {
	state: {
		menuList: [],
		permList: [],
		hasRoutes: false,
		editableTabsValue: name,
		editableTabs: [{
			title: title,
			name: name,
		}]
	},
	mutations: {
		setMenuList(state, menus) {
			state.menuList = menus
		},
		setPermList(state, perms) {
			state.permList = perms
		},
		changeRouteStatus(state, hasRoutes) {
			state.hasRoutes = hasRoutes
		},

		//添加home页激活每个打开的tab
		addTab(state, tab) {
			//防止多次点击多个激活导致标签重复问题
			let index = state.editableTabs.findIndex(e => e.name === tab.name)

			if (index === -1) {
				//-1表示没有找到已经激活的页面，开始创建
				state.editableTabs.push({
					title: tab.title,
					name: tab.name,
				});
			}
			state.editableTabsValue = tab.name;
		},

		resetState: (state) => {
			state.menuList = []
			state.permList = []
			state.hasRoutes = false
			state.editableTabsValue = name
			state.editableTabs = [{
				title: title,
				name: name,
			}]
		}

	},
	actions: {},

}