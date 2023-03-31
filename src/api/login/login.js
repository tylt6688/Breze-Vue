import request from "axios";
export default {
    // 获取验证码
    getCaptcha() {
        return request({
            url: '/captcha',
            method: 'get'
        })
    },
    // 提交登录请求
    submitFormLogin(param) {
        return request({
            url: '/login?' + param,
            method: 'post'
        })
    },
}