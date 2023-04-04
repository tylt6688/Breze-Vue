import request from "@/utils/http";

export default {
    // 获取菜单树
    getMenuTree() {
        return request({
            url: '/sys/menu/select',
            method: 'get'
        })
    },
    // 新增或修改菜单
    submitMenuForm(editForm, id) {
        return request({
            url: '/sys/menu/' + (id ? "update" : "insert"),
            method: 'post',
            data: editForm
        })
    },
    // 回显菜单组件信息
    editHandle(id) {
        return request({
            url: '/sys/menu/info/' + id,
            method: 'get'
        })
    },
    // 删除菜单 Start
    delHandle(id) {
        return request({
            url: '/sys/menu/delete',
            method: 'delete',
            params: {
                id: id
            }
        })
    },
    // 根据名称查询二级菜单
    selectByMenuName(menuTitle) {
        return request({
            url: '/sys/menu/select_menu_title/' + menuTitle,
            method: 'get',
        })
    }
}