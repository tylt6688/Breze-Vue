import request from "@/utils/request";

export default {
    // 获取CPU数据
    getLoginLogCpuList() {
        return request({
            url: '/monitor/server/cpu_info',
            method: 'get'
        })
    },
}