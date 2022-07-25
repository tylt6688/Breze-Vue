import axios from "@/http/axios";

export default {

    getStudentInfoList() {
        return axios({
            url: '/department/select',
            method: 'get'
        })
    },
}