import request from "@/utils/request";

export default {
    getDictDataPageList(param){
        return request({
            url: '/sys/dict/data/get_dict_data_page',
            method: 'get',
            params: param
        })
    },


    deleteDictData(id){
        return request({
            url: '/sys/dict/data/delete_dict_data/'+id,
            method: 'delete',
        })
    },
    submitDictDataForm(editForm){
        return request({
            url: '/sys/dict/data/insert_or_update',
            method: 'post',
            data: editForm
        })
    },
    getDiceDataInfo(id){
        return request({
            url: '/sys/dict/data/get_dict_data_by_id/' + id,
            method: 'get',
        })
    },

    importExcel(formData) {
        return request({
            url: '/sys/dict/data/import_excel',
            method: 'post',
            data: formData
        })
    },
    exportModelExcel() {
        return request({
            url: "/sys/dict/data/dict_template_excel",
            method: 'get',
            responseType: "arraybuffer",
        })
    },
    exportExcel() {
        return request({
            url: '/sys/dict/data/export_excel',
            method: 'get',
            responseType: "arraybuffer",
        })
    },

    getCacheData(dicts){
        return request({
            url: '/sys/dict/data/get_dict_data_by_type',
            method: 'get',
           params: {
            dicts: dicts.join(',')
           }
        })
    }

}