import axios from "@/utils/http/axios";

export default {

    getGroupList() {
        return axios({
            url: '/sys/group/select',
            method: 'get'
        })
    },
}