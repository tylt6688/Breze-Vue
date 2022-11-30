import axios from "@/utils/http";
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
        return axios({
            url: '/login?' + param,
            method: 'post'
        })
    },
}