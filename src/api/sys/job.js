import request from "@/utils/request";

export default {

    getJobList(param) {
        return request({
            url: '/sys/job/select',
            method: 'get',
            params:param
        })
    },
    getJobById(id){
        return request({
            url : '/sys/job/select/'+id,
            method:'get'
        })
    },
    editJob(param){
        return request({
            url: '/sys/job/update',
            method:'put',
            data:param
        })
    },
    insertJob(param){
        return request({
            url:'/sys/job/insert',
            method:'post',
            data:param
        })
    },
    deleteJob(id){
        return request({
            url:'/sys/job/delete?id='+id,
            method:'delete',
        })
    },
}