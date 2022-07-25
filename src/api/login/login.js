import axios from "@/http/axios";
export default{
    //TODO 获取验证码
    getKaptchaInfo(){
        return axios({
            url: '/kaptcha',
            method: 'get'
        })
    },
    //TODO 获取验证码
    submitFormLogin(param){
        return axios({
            url: '/login?'+param,
            method: 'post'
        })
    },
}