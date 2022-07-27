import axios from "@/http/axios";

export default {
    getNotifyInfo(id) {
        return axios({
            url: "/notify/selectbyid/"+id,
            method: 'get'
        })
    }
}