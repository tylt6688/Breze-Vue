import request from "@/utils/http";

export default {

    getGroupList() {
        return request({
            url: '/sys/group/select',
            method: 'get'
        })
    },
}