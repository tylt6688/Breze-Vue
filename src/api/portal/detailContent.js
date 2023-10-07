import request from '@/utils/http'

export default {
   
    //分页
    getContentList(params) {
        return request({
            url: '/breze/portal/detailContent/page',
            method: 'get',
            params: params
        })
    },
    // 通过Id查询数据
    findContentById(id) {
        return request({
            url: '/breze/portal/detailContent/info/' + id,
            method: 'get'
        })
    },
    // 编辑（没改变图片）
    editContent(editForm) {
        return request({
            url: '/breze/portal/detailContent/update',
            method: 'post',
            data: editForm,
        })
    },
    // 删除
    delContentInfo(formData) {
        return request({
            url: '/breze/portal/detailContent/delete' ,
            method: 'post',
            data: formData
        })
    },
    //新增或编辑(改变原图片)
    upload(formData){
        return request({
          url: '/breze/portal/detailContent/insert',
          method: 'post',
          data: formData,
        })
      },
}