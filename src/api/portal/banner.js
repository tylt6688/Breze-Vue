import request from '@/utils/http'

export default {
    // 获取轮播图
    getBannerInfo() {
        return request({
            url: '/breze/portal/banner/select',
            method: 'get'
        })
    },
    // 通过Id获取轮播图信息
    editHandle(id) {
        return request({
            url: '/breze/portal/banner/info/' + id,
            method: 'get'
        })
    },
    // 用户自定义上传Banner图 
    uploadBanner(formData) {
        return request({
            url: '/breze/portal/banner/upload',
            method: 'post',
            data: formData,
            headers: {
                "Content-type": "multipart/form-data",
            }

        })
    },
    // 新增或编辑Banner图
    submitBannerForm(editForm) {
        return request({
            url: '/breze/portal/banner/update',
            method: 'post',
            data: editForm,
        })
    },
    // 删除Banner图
    delHandleInfo(url) {
        return request({
            url: '/breze/portal/banner/delete',
            method: 'post',
            data: url,
        })
    },
}