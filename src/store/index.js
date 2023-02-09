import Vue from 'vue'
import Vuex from 'vuex'
import menus from "./modules/menus";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 设定全局token
    token: '',
    // 设定用户信息
    userInfo: {}
  },
  getters: {},
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      localStorage.setItem("token", token);
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
  },
  actions: {},
  modules: {
    menus
  }
})