import request from '@/utils/http'

export default {
    //分页查询
    getNavbarPage(params) {
        return request({
            url: '/breze/portal/navbar/page',
            method: 'get',
            params: params
        })
    },
    // 通过Id获取
    getNavbarInfo(id) {
        return request({
            url: '/breze/portal/navbar/select_navbar/'+id,
            method: 'get'
        })
    },
    // 查询所有数据
    findAllNavbar(flag){
        return request({
            url: '/breze/portal/navbar/find_all_data/'+flag,
            method: 'get',
        })
    },
    // 查询所有数据条数
    findCount(){
        return request({
            url: '/breze/portal/navbar/count',
            method: 'get',
        })
    },
    // 编辑
    submitNavbarForm(editForm,id){
        return request({
            url: '/breze/portal/navbar/' + (id ? "update" : "insert"),
            method: 'post',
            data: editForm
          })
    },
    // 删除
    delHandleInfo(id) {
        return request({
            url: '/breze/portal/navbar/delete' ,
            method: 'post',
            data: id
        })
    },
}