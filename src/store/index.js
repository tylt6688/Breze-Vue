import Vue from 'vue'
import Vuex from 'vuex'
import menus from "./modules/menus"

import Cookies from 'js-cookie'

Vue.use(Vuex);

const state = {
  // 设定全局token
  token: Cookies.get("token"),
  // 设定用户信息
  userInfo: {}
};

const getters = {
  getToken(state) {
    console.log("获取store token",state.token)
    return state.token;
  },
};

const mutations = {
  setToken(state, token) {
    state.token = token;
    Cookies.set("token", token);
  },
  removeToken(state) {
    state.token = null;
    Cookies.remove("token");
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo;
    sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
  }
};

const actions={};



export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {
    menus
  }
})