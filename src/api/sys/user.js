import axios from "@/utils/http/axios";

export default {
    // 获取用户列表 Start
    getUserList(params) {
        return axios({
            url: "/sys/user/select",
            method: 'get',
            params: params
        })
    },
    // 获取当前登录用户信息
    getUserInfo() {
        return axios({
            url: "/sys/user/get_userinfo",
            method: 'get'
        })
    },
    // 编辑用户信息时回显
    editUserInfo(id) {
        return axios({
            url: "/sys/user/info/" + id,
            method: 'get'
        })
    },
    // 编辑资料
    submitUserInfoForm(editForm) {
        return axios({
            url: "/sys/user/update_userinfo",
            method: 'post',
            data: editForm
        })
    },
    // 头像上传
    uploadAvatar(formData) {
        return axios({
            url: "/sys/user/update_avatar",
            method: 'post',
            data: formData,
            headers: {
                "Content-type": "multipart/form-data"
            }
        })
    },
    // 修改密码
    submitPassForm(passForm) {
        return axios({
            url: "/sys/user/update_password",
            method: 'post',
            data: passForm,
        })
    },
    // 重置密码
    repassPassword(id) {
        return axios({
            url: "/sys/user/reseat_password",
            method: 'post',
            data: id,
        })
    },
    // 用户自定义上传Excel
    uploadExcel(formData) {
        return axios({
            url: "/sys/user/upload_excel",
            method: 'post',
            data: formData,
            headers: {
                "Content-type": "multipart/form-data",
            }
        })
    },
    // 下载用户导入模板Excel
    exportModelExcel() {
        return axios({
            url: "/sys/user/download_model_excel",
            method: 'get',
            responseType: "arraybuffer",
        })
    },
    // 所有用户模板Excel
    exportExcel() {
        return axios({
            url: "/sys/user/export_excel",
            method: 'get',
            responseType: "arraybuffer",
        })
    },
    // 增加或修改用户 
    submitForm(editForm, id) {
        return axios({
            url: "/sys/user/" + (id ? "update" : "insert"),
            method: 'post',
            data: editForm
        })
    },
    // 删除或批量删除用户
    delHandle(ids) {
        return axios({
            url: "/sys/user/delete",
            method: 'post',
            data: ids
        })
    },
    // 分配角色
    submitRoleHandle(roleIds, id) {
        return axios({
            url: "/sys/user/role_perm/" + id,
            method: 'post',
            data: roleIds
        })
    },
    // 批量分配角色
    roleMoreHandle(roleIds, userIds) {
        return axios({
            url: "/sys/user/role_more_perm?userIds=" + userIds,
            method: 'post',
            data: roleIds
        })
    },

    // 退出登录 
    logout() {
        return axios({
            url: "/logout",
            method: 'post'
        })
    },
}