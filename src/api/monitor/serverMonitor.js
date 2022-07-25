import axios from "@/http/axios";

export default {
    // 获取CPU数据
    getLoginLogCpuList() {
        return axios({
            url: '/monitor/server/cpuinfo',
            method: 'get'
        })
    },
}