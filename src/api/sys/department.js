import axios from "@/utils/http/axios";

export default {

    getStudentInfoList() {
        return axios({
            url: '/department/select',
            method: 'get'
        })
    },
}