import axios from "@/utils/http/axios";

export default {
    getNotifyInfo(id) {
        return axios({
            url: "/notify/selectbyid/"+id,
            method: 'get'
        })
    }
}