import request from "axios";
export default {
    // 获取验证码
    getCaptcha() {
        return request({
            url: '/captcha',
            method: 'get'
        })
    },
    // 发起登录请求
    submitFormLogin(param) {
        return request({
            url: '/breze/login?' + param,
            method: 'post'
        })
    },
    // 退出登录 
    logout() {
        return request({
            url: "/breze/logout",
            method: 'post'
        })
    },
}