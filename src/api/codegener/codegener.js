import axios from "@/utils/http";

export default {
    getDataBases() {
        return axios({
            url: "/tool/code/show_databases",
            method: 'get'
        })
    },
    getTableData(dataBaseName) {
        return axios({
            url: "/tool/code/tables",
            method: 'get',
            params: {
                dataBaseName
            }
        })
    },
    generteCode(params){
        return axios({
            url: "/tool/code/generate",
            method: 'post',
            data: params
        })
    }
}