import axios from "@/utils/http";

export default {

    getGroupList() {
        return axios({
            url: '/sys/group/select',
            method: 'get'
        })
    },
}