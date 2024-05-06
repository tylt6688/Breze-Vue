import request from "@/utils/request";

export default {
    // 获取当前登录用户信息
    getUserInfo() {
        return request({
            url: "/sys/user/current_userinfo",
            method: "get"
        });
    },
    // 获取用户列表 Start
    getUserList(userDto) {
        return request({
            url: "/sys/user/select",
            method: "post",
            data: userDto
        });
    },

    // 编辑用户信息时回显
    editUserInfo(id) {
        return request({
            url: "/sys/user/info/" + id,
            method: "get"
        });
    },
    // 编辑资料
    submitUserInfoForm(editForm) {
        return request({
            url: "/sys/user/update",
            method: "post",
            data: editForm
        });
    },
    // 头像上传
    uploadAvatar(formData) {
        return request({
            url: "/sys/user/update_avatar",
            method: "post",
            data: formData,
            headers: {
                "Content-type": "multipart/form-data"
            },
        });
    },
    // 修改密码
    submitPassForm(passForm) {
        return request({
            url: "/sys/user/update_password",
            method: "post",
            data: passForm,
        });
    },
    // 重置密码
    repassPassword(id) {
        return request({
            url: "/sys/user/reset_password",
            method: "post",
            data: id,
        });
    },
    // 用户自定义上传Excel
    uploadExcel(formData) {
        return request({
            url: "/sys/user/import_excel",
            method: "post",
            data: formData,
            headers: {
                "Content-type": "multipart/form-data",
            },
        });
    },
    // 导出所有用户信息Excel
    exportExcel() {
        return request({
            url: "/sys/user/export_excel",
            method: "get",
            responseType: "arraybuffer",
        });
    },
    // 下载用户导入模板Excel
    exportModelExcel() {
        return request({
            url: "/sys/user/export_template_excel",
            method: "get",
            responseType: "arraybuffer",
        });
    },

    // 增加用户
    insertUser(user) {
        return request({
            url: "/sys/user/insert",
            method: "post",
            data: user
        });
    },

    // 删除或批量删除用户
    deleteUser(userList) {
        return request({
            url: "/sys/user/delete",
            method: "DELETE",
            data: userList,
        });
    },

    // 修改用户
    updateUser(user) {
        return request({
            url: "/sys/user/update",
            method: "PUT",
            data: user
        });
    },

    
    // 分配角色
    permRole(permRoleDTO) {
        return request({
            url: "/sys/user/perm_role/",
            method: "post",
            data: permRoleDTO,
        });
    },

    // 获取用户数量
    getUserCount() {
        return request({
            url: "/sys/user/user_count",
            method: "get"
        });
    },
};