import request from "@/utils/request";

export default {

    getDictPageList(param) {
        return request({
            url: '/sys/dict/get_dict_page',
            method: 'get',
            params: param
        })
    },
    getDictSelectList(){
        return request({
            url: '/sys/dict/get_option_select',
            method: 'get',
        })
    },
    getDictInfo(id) {
        return request({
            url: '/sys/dict/get_dict_by_id/' +id,
            method: 'get',
        })
    },
    submitDictForm(editForm) {
        return request({
            url: '/sys/dict/insert_or_update',
            method: 'post',
            data: editForm
        })
    },
    deleteDictInfo(id) {
        return request({
            url: '/sys/dict/delete_dict/' +id,
            method: 'delete',
        })
    },
    importExcel(formData) {
        return request({
            url: '/sys/dict/import_excel',
            method: 'post',
            data: formData
        })
    },
    exportModelExcel() {
        return request({
            url: "/sys/dict/dict_template_excel",
            method: 'get',
            responseType: "arraybuffer",
        })
    },
    exportExcel() {
        return request({
            url: '/sys/dict/export_excel',
            method: 'get',
            responseType: "arraybuffer",
        })
    },


}