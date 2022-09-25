<template>
    <!-- 首页管理数据展示组件 -->
    <el-main>
        <el-table ref="departmentTable" :data="tableData" tooltip-effect="dark" border stripe>

            <el-table-column prop="title" label="标题">
            </el-table-column>
            <el-table-column prop="content" label="内容">
                <template slot-scope="scope">
                    <div v-html="scope.row.content"></div>
                </template>
            </el-table-column>
            <el-table-column prop="created" label="发布时间" :formatter="formatDate">
            </el-table-column>
        </el-table>

    </el-main>
</template>

<script>
    import moment from 'moment';
    export default {
        name: 'Context',
        props: {
            tableData: {
                type: Array,
            },

        },
        data() {
            return {

            }
        },
        methods: {
            // 格式化日期时间 Start
            formatDate(row, column) {
                let data = row[column.property]
                if (data == null) {
                    return null
                }
                return moment(data).format("YYYY 年 MM 月 DD 日 - HH 时 mm 分");
            },
            // 格式化日期时间 End
        }

    }
</script>

<style scoped>

</style>