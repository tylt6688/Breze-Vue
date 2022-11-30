import axios from "@/utils/http";

export default {

    getJobList() {
        return axios({
            url: '/sys/job/select',
            method: 'get'
        })
    },
}