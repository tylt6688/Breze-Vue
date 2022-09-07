import axios from "@/utils/http/axios";

export default {
    // 获取菜单树
    getMenuTree() {
        return axios({
            url: '/sys/menu/select',
            method: 'get'
        })
    },
    // 新增或修改菜单
    submitMenuForm(editForm, id) {
        return axios({
            url: '/sys/menu/' + (id ? "update" : "insert"),
            method: 'post',
            data: editForm
        })
    },
    // 回显菜单组件信息
    editHandle(id) {
        return axios({
            url: '/sys/menu/info/' + id,
            method: 'get'
        })
    },
    // 删除菜单 Start
    delHandle(id) {
        return axios({
            url: '/sys/menu/delete',
            method: 'post',
            params: {
                id: id
            }
        })
    },
}