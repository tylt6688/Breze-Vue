import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from "element-ui"
import eIconPicker from 'e-icon-picker'
import axios from '@/utils/http/axios'
import qs from "qs"



import "e-icon-picker/lib/symbol.js"; //基本彩色图标库
import 'e-icon-picker/lib/index.css'; // 基本样式，包含基本图标
import 'element-ui/lib/theme-chalk/icon.css'; //element-ui 图标库
import "element-ui/lib/theme-chalk/index.css"
import './utils/dialog/dialog'


// 控制台生产信息提示是否开启
Vue.config.productionTip = false;

//定义全局引用变量
// Vue.prototype.$axios = axios; 
Vue.prototype.$qs = qs;

Vue.prototype.BASE_API = axios.defaults.baseURL;

Vue.use(Element);

// 全局图标选择管理
Vue.use(eIconPicker, {
	FontAwesome: false,
	ElementUI: true,
	eIcon: false, // 自带的图标，来自阿里妈妈
	eIconSymbol: false, // 是否开启彩色图标
	addIconList: [],
	removeIconList: [],
	zIndex: 3100 // 选择器弹层的最低层,全局配置
});


// 根据混合机制设定全局方法组件应用，根据后台数据进行权限控制
Vue.mixin({
	methods: {
		hasAuth(perm) {
			var authority = this.$store.state.menus.permList;
			return authority.indexOf(perm) > -1
		}
	}
})

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')