<template>
    <el-main>
        <el-table ref="LoginLogTable" :data="tableData" tooltip-effect="dark" border stripe>

            <el-table-column prop="userName" label="登录用户">
            </el-table-column>
            
            <el-table-column prop="trueName" label="登录用户">
            </el-table-column>
            <el-table-column prop="state" label="账户状态" align="center" width="80">
                <template slot-scope="scope">
                    <el-tag size="small" v-if="scope.row.state === 0" type="success">正常</el-tag>
                    <el-tag size="small" v-else-if="scope.row.state === 1" type="danger">禁用</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="ipAddress" label="登录IP">
            </el-table-column>
            <el-table-column prop="ipLocation" label="IP所在地">
            </el-table-column>
            <el-table-column prop="os" label="操作系统">
            </el-table-column>
            <el-table-column prop="createTime" label="登录时间" :formatter="formatDate">
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
                return moment(data).format("YYYY 年 MM 月 DD 日 - HH : mm");
            },
            // 格式化日期时间 End
            // 获取表数据 Start
            getLoginLogList() {
                let params = {
                    current: this.current,
                    size: this.size,
                }
                loginlog.getLoginLogInfoList(params).then(res => {
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