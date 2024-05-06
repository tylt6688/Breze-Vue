import request from "@/utils/request";

export default {

    getGroupList(param) {
        return request({
            url: '/sys/group/select',
            method: 'get',
            params:param
        })
    },
    getGroupById(id) {
        return request({
            url: '/sys/group/select/'+id,
            method: 'get'
        })
    },
    getGroupParent(){
        return request({
            url: '/sys/group/getGroupParent',
            method: 'get'
        })
    },
    updateGroup(param){
        return request({
            url: '/sys/group/update',
            method: 'put',  
            data:param
        })
    },
    insertGroup(param){
        return request({
            url: '/sys/group/insert',
            method: 'post',
            data:param
        })
    },
    deleteGroup(id){
        return request({
            url: '/sys/group/delete?id='+id,
            method: 'delete',
        })
    },
    bindJob(param){
        return request({
            url: '/sys/group/bind/insert',
            method: 'post',
            data:param
        })
    }
}