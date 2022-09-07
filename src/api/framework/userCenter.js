import axios from "@/utils/http/axios";

export default {
    // 更新登录提醒状态
    changeLoginWarn(params) {
        return axios({
            url: '/sys/user/update_login_warn?' + params,
            method: 'post'
        })
    }
}