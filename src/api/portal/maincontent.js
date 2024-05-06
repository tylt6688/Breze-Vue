import request from '@/utils/request'

export default {
   
    //分页
    getContentList(params) {
        return request({
            url: '/breze/portal/mainContent/page',
            method: 'get',
            params: params
        })
    },
    // 通过Id查询数据
    findContentById(id) {
        return request({
            url: '/breze/portal/mainContent/info/' + id,
            method: 'get'
        })
    },
    // 编辑（没改变图片）
    editContent(editForm) {
        return request({
            url: '/breze/portal/mainContent/update',
            method: 'post',
            data: editForm,
        })
    },
    // 删除
    delContentInfo(formData) {
        return request({
            url: '/breze/portal/mainContent/delete' ,
            method: 'post',
            data: formData
        })
    },
    //新增或编辑(改变原图片)
    upload(formData){
        return request({
          url: '/breze/portal/mainContent/insert',
          method: 'post',
          data: formData,
        })
      },
      getSelectOptionInfo(){
        return request({
            url: '/breze/portal/mainContent/get_select_option',
            method: 'get',
          })
      },
}