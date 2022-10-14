import axios from '@/utils/http/axios'

export default {
    // 获取
    getMaincontentInfo() {
        return axios({
            url: '/breze/portal/mainContent/select',
            method: 'get'
        })
    },
    // 编辑
    editHandle(id) {
        return axios({
            url: '/breze/portal/mainContent/info/' + id,
            method: 'get'
        })
    },
    //分页
    getNameList(params) {
        return axios({
            url: '/breze/portal/mainContent/page',
            method: 'get',
            params: params
        })
    },
    // 用户添加
    uploadBanner(formData) {
        return axios({
            url: '/breze/portal/mainContent/insert',
            method: 'post',
            data: formData,
           
        })
    },
    // 编辑
    submitMaincontentForm(editForm) {
        return axios({
            url: '/breze/portal/mainContent/update',
            method: 'post',
            data: editForm,
        })
    },
    // 删除
    delHandleInfo(id) {
        return axios({
            url: '/breze/portal/mainContent/delete' ,
            method: 'post',
            data: id
        })
    },
}