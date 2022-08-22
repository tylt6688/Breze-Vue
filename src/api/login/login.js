import axios from "@/utils/http/axios";
export default {
    // 获取验证码
    getKaptcha() {
        return axios({
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