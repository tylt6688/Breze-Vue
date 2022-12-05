import axios from "@/utils/http";

export default {
    // 获取CPU数据
    getLoginLogCpuList() {
        return axios({
            url: '/monitor/server/cpu_info',
            method: 'get'
        })
    },
}