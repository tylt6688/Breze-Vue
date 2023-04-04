import request from "@/utils/http";

export default {
    getDataBases() {
        return request({
            url: "/tool/code/show_databases",
            method: 'get'
        })
    },
    getTableData(dataBaseName) {
        return request({
            url: "/tool/code/tables",
            method: 'get',
            params: {
                dataBaseName
            }
        })
    },
    generteCode(params){
        return request({
            url: "/tool/code/generate",
            method: 'post',
            data: params
        })
    }
}