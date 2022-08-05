import axios from "@/utils/http/axios";

export default {

    submitCommonEdit(title) {
        return axios({
            url: '/notify/selectbytitle/' + title,
            method: 'get'
        })
    },
    //根据commonTitle删除
    delNotify(title) {
        return axios({
            url: '/notify/delete/' + title,
            method: 'post'
        })
    },
    // 编辑轮播图
    editHandle(id) {
        return axios({
            url: '/banner/info/' + id,
            method: 'get'
        })
    },
    // 用户自定义上传Banner图 
    uploadBanner(formData) {
        return axios({
            url: '/banner/upload',
            method: 'post',
            data: formData,
            headers: {
                "Content-type": "multipart/form-data",
            }

        })
    },
    // 新增或编辑Banner图
    submitBannerForm(editForm) {
        return axios({
            url: '/banner/update',
            method: 'post',
            data: editForm,
        })
    },
    // 删除Banner图
    delHandleInfo(url) {
        return axios({
            url: '/banner/delete',
            method: 'post',
            data: url,
        })
    },
    // 新增或编辑Notify
    submitNotifyForm(notifyForm,id) {
        return axios({
            url: '/notify/'+(id ? "update" : "insert"),
            method: 'post',
            data: notifyForm
        })
    },
}