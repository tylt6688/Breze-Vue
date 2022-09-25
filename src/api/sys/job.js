import axios from "@/utils/http/axios";

export default {

    getJobList() {
        return axios({
            url: '/sys/job/select',
            method: 'get'
        })
    },
}