import request from "@/utils/request";
export default {
    // 更新登录提醒状态
    changeLoginWarn(params) {
        return request({
            url: '/sys/user/update_login_warn?' + params,
            method: 'post'
        })
    }
}