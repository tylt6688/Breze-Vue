import axios from '@/utils/http/axios'

export default {
    // 通过Id获取
    getNavbarInfo(id) {
        return axios({
            url: '/breze/portal/navbar/selectNavbar/'+id,
            method: 'get'
        })
    },
    //分页查询
    getNavbarPage(params) {
        return axios({
            url: '/breze/portal/navbar/page',
            method: 'get',
            params: params
        })
    },
    findAllNavbar(){
        return axios({
            url: '/breze/portal/navbar/findAllData',
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
    // 用户添加
    uploadNavbar(formData) {
        return axios({
            url: '/breze/portal/navbar/insert',
            method: 'post',
            data: formData,
           
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