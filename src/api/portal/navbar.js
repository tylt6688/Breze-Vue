import axios from '@/utils/http/axios'

export default {
    // 获取
    getNavbarInfo() {
        return axios({
            url: '/breze/portal/navbar/select',
            method: 'get'
        })
    },
    //分页
   
    getNameList(params) {
        return axios({
            url: '/breze/portal/navbar/page',
            method: 'get',
            params: params
        })
    },
    // 编辑
    editHandle(id) {
        return axios({
            url: '/breze/portal/navbar/info/' + id,
            method: 'get'
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
    // 编辑
    submitNavbarForm(editForm) {
        return axios({
            url: '/breze/portal/navbar/update',
            method: 'post',
            data: editForm,
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