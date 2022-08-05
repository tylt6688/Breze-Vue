import Vue from 'vue'
import Vuex from 'vuex'
import menus from "./modules/menus";


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 此处设定全局token
    token: ''
  },
  getters: {},
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      localStorage.setItem("token", token)
    },
  },
  actions: {},
  modules: {
    menus
  }
})