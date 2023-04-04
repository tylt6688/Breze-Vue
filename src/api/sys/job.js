import request from "@/utils/http";

export default {

    getJobList() {
        return request({
            url: '/sys/job/select',
            method: 'get'
        })
    },
}