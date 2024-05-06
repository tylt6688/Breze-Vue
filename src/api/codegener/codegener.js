import request from "@/utils/request";

export default {
    getDataBases() {
        return request({
            url: "/tool/code/show_databases",
            method: 'get'
        })
    },
    getTableData(dataBaseName) {
        return request({
            url: "/tool/code/get_tables",
            method: 'get',
            params: {dataBaseName}
        })
    },
    genertedCode(tableName) {
        return request({
            url: "/tool/code/generate",
            method: 'post',
            data: tableName
        })
    }
}