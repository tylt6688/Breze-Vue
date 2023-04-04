import request from "@/utils/http";

export default {
    // 获取当前登录用户信息
    getUserInfo() {
        return request({
            url: "/sys/user/get_userinfo",
            method: 'get'
        })
    },
    // 获取用户列表 Start
    getUserList(userDto) {
        return request({
            url: "/sys/user/select",
            method: 'post',
            data: userDto
        })
    },

    // 编辑用户信息时回显
    editUserInfo(id) {
        return request({
            url: "/sys/user/info/" + id,
            method: 'get'
        })
    },
    // 编辑资料
    submitUserInfoForm(editForm) {
        return request({
            url: "/sys/user/update_userinfo",
            method: 'post',
            data: editForm
        })
    },
    // 头像上传
    uploadAvatar(formData) {
        return request({
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
        return request({
            url: "/sys/user/update_password",
            method: 'post',
            data: passForm,
        })
    },
    // 重置密码
    repassPassword(id) {
        return request({
            url: "/sys/user/reset_password",
            method: 'post',
            data: id,
        })
    },
    // 用户自定义上传Excel
    uploadExcel(formData) {
        return request({
            url: "/sys/user/import_excel",
            method: 'post',
            data: formData,
            headers: {
                "Content-type": "multipart/form-data",
            }
        })
    },
    // 下载用户导入模板Excel
    exportModelExcel() {
        return request({
            url: "/sys/user/export_model_excel",
            method: 'get',
            responseType: "arraybuffer",
        })
    },
    // 所有用户模板Excel
    exportExcel() {
        return request({
            url: "/sys/user/export_excel",
            method: 'get',
            responseType: "arraybuffer",
        })
    },
    // 增加或修改用户 
    submitForm(editForm, id) {
        return request({
            url: "/sys/user/" + (id ? "update" : "insert"),
            method: 'post',
            data: editForm
        })
    },
    // 删除或批量删除用户
    delHandle(ids) {
        return request({
            url: "/sys/user/delete",
            method: 'delete',
            data: ids
        })
    },
    // 分配角色
    submitRole(id, roleIds) {
        return request({
            url: "/sys/user/role_perm/" + id,
            method: 'post',
            data: roleIds
        })
    },
    // 批量分配角色
    roleMoreHandle(userIds, roleIds) {
        return request({
            url: "/sys/user/role_more_perm?userIds=" + userIds,
            method: 'post',
            data: roleIds
        })
    },


    // 获取用户数量 
    getUserCount() {
        return request({
            url: "/sys/user/user_count",
            method: 'get'
        })
    },

}