import axios from "@/utils/http/axios";
import request from "axios";
export default {
    // 获取验证码
    getKaptcha() {
        return request({
            url: '/kaptcha',
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