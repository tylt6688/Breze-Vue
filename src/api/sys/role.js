import axios from "@/utils/http";

export default {
    // 获取角色列表数据
    getRoleList(params) {
        return axios({
            url: '/sys/role/select_page',
            method: 'get',
            params: params
        })
    },
    // 新增或更新角色信息
    submitRoleForm(editForm, id) {
        return axios({
            url: '/sys/role/' + (id ? "update" : "insert"),
            method: 'post',
            data: editForm
        })
    },

    roleInfo(id) {
        return axios({
            url: "/sys/role/info/" + id,
            method: 'get'
        })
    },
    delHandle(roleIds) {
        return axios({
            url: "/sys/role/delete",
            method: 'delete',
            data: roleIds
        })
    },
    // 根据角色id获取相应菜单列表
    permHandle(id) {
        return axios({
            url: "/sys/role/info/" + id,
            method: 'get'
        })
    },
   // 回显权限编辑中已选择的权限
   submitPermFormHandle(menuIds,id) {
        return axios({
            url: "/sys/role/perm/" + id,
            method: 'post',
            data: menuIds
        })
    },
}