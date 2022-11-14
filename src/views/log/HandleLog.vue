<template>
    <el-main>
        <el-table ref="LoginLogTable" :data="tableData" tooltip-effect="dark" border stripe>

            <el-table-column prop="title" label="操作内容" width="150">
            </el-table-column>
            <el-table-column prop="type" label="操作终端">
            </el-table-column>
            <el-table-column prop="requestIp" label="所属IP" width="150">
            </el-table-column>
            <el-table-column prop="requestPath" label="请求路径" width="200">
            </el-table-column>
            <el-table-column prop="createTime" label="操作时间" :formatter="formatDate">
            </el-table-column>

        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 20, 50, 100]" :current-page="current"
            :page-size="size" :total="total">
        </el-pagination>
    </el-main>

</template>

<script>
    import moment from 'moment';
    import loginlog from "@/api/logapi/logapi";

    export default {
        name: 'LoginLog',
        data() {
            return {
                tableData: [],
                total: 0,
                size: 10,
                current: 1,
                selectVal: '',
                options: [],
            }
        },
        mounted() {
            this.getLoginLogList();
        },
        methods: {
            // 格式化日期时间 Start
            formatDate(row, column) {
                let data = row[column.property]
                if (data == null) {
                    return null
                }
                return moment(data).format("YYYY-MM-DD HH:mm:ss");
            },
            // 格式化日期时间 End
            // 获取表数据 Start
            getLoginLogList() {
                let params = {
                    current: this.current,
                    size: this.size,
                }
                loginlog.getHandleLogInfoList(params).then(res => {
                    this.tableData = res.data.result.data.records;
                    this.size = res.data.result.data.size;
                    this.current = res.data.result.data.current;
                    this.total = res.data.result.data.total;
                })
            },
            // 获取表数据 End

            handleSizeChange(val) {
                this.size = val;
                this.getLoginLogList();
            },

            handleCurrentChange(val) {
                this.current = val;
                this.getLoginLogList();
            },
        },

    }
</script>

<style scoped>
    .el-pagination {
        float: right;
        margin-top: 22px;
    }
</style>