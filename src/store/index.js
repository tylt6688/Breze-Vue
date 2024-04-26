import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie'
import menus from "./modules/menus"

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
  // 设置token至state中
  setToken(state, token) {
    state.token = token;
    Cookies.set("token", token);
  },
  // 将token从state中移除
  removeToken(state) {
    state.token = undefined;
    Cookies.remove("token");
  },
  // 设置用户信息至sessionStorage中
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