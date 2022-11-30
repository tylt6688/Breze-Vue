import axios from '@/utils/http'

export default {
   
    //分页
    getContentList(params) {
        return axios({
            url: '/breze/portal/mainContent/page',
            method: 'get',
            params: params
        })
    },
    // 通过Id查询数据
    findContentById(id) {
        return axios({
            url: '/breze/portal/mainContent/info/' + id,
            method: 'get'
        })
    },
    // 编辑（没改变图片）
    editContent(editForm) {
        return axios({
            url: '/breze/portal/mainContent/update',
            method: 'post',
            data: editForm,
        })
    },
    // 删除
    delContentInfo(formData) {
        return axios({
            url: '/breze/portal/mainContent/delete' ,
            method: 'post',
            data: formData
        })
    },
    //新增或编辑(改变原图片)
    upload(formData){
        return axios({
          url: '/breze/portal/mainContent/insert',
          method: 'post',
          data: formData,
        })
      },
}