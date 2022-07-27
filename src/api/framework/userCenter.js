import axios from "@/http/axios";

export default {
    // 更新登录提醒状态
    changeLoginWarn(loginwarn,id) {
        return axios({
            url: '/sys/user/updateloginwarn?loginwarn='+loginwarn+"&id="+id,
            method: 'post'
        })
    }
}