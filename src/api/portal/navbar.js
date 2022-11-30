import axios from '@/utils/http'

export default {
    //分页查询
    getNavbarPage(params) {
        return axios({
            url: '/breze/portal/navbar/page',
            method: 'get',
            params: params
        })
    },
    // 通过Id获取
    getNavbarInfo(id) {
        return axios({
            url: '/breze/portal/navbar/selectNavbar/'+id,
            method: 'get'
        })
    },
    // 查询所有数据
    findAllNavbar(flag){
        return axios({
            url: '/breze/portal/navbar/findAllData/'+flag,
            method: 'get',
        })
    },
    // 查询所有数据条数
    findCount(){
        return axios({
            url: '/breze/portal/navbar/count',
            method: 'get',
        })
    },
    // 编辑
    submitNavbarForm(editForm,id){
        return axios({
            url: '/breze/portal/navbar/' + (id ? "update" : "insert"),
            method: 'post',
            data: editForm
          })
    },
    // 删除
    delHandleInfo(id) {
        return axios({
            url: '/breze/portal/navbar/delete' ,
            method: 'post',
            data: id
        })
    },
}