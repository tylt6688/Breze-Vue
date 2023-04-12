import request from "@/utils/http";

export default {

    getJobList() {
        return request({
            url: '/sys/job/select',
            method: 'get',
        })
    },
    getJobById(id){
        return request({
            url : '/sys/job/select/'+id,
            method:'get'
        })
    },
    searchJobList(params){
        return request({
            url: '/sys/job/searchAnd',
            method:'post',
            data:params
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