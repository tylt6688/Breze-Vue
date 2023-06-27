<template>
    <div class="page">
        <!-- 头部操作部分 Start -->
        <el-form :inline="true">
            <el-form-item>
                <el-input v-model="searchForm.tableName" placeholder="请输入表名称" clearable>
                    <el-button slot="append" @click="queryTableData" icon="el-icon-search">搜索</el-button>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-download" @click="generateCode(null)">批量生成
                </el-button>
            </el-form-item>

            <el-form-item>
                <el-select v-model="value" placeholder="请选择数据库" @change="getTableData">
                    <el-option v-for="(item,index) in options" :value="item" :key="index">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-tag type="success">当前数据库: {{currentDataBase}}</el-tag>
            </el-form-item>
        </el-form>
        <!-- 头部操作部分 End -->

        <!-- 表格数据 -->
        <el-row class="table-info">
            <el-col :span="24">
                <el-table ref="multipleTable"
                    :data="tableData?tableData.slice((this.currentPage - 1) * this.pageSize, (this.currentPage - 1) * this.pageSize + this.pageSize):tableData"
                    tooltip-effect="dark" style="width: 100%" border stripe @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center">
                    </el-table-column>

                    <el-table-column type="index" label="序号" width="50" align="center">
                    </el-table-column>

                    <el-table-column prop="tableName" label="数据表名称"> </el-table-column>

                    <el-table-column prop="remark" label="描述信息" show-overflow-tooltip>
                    </el-table-column>

                    <el-table-column prop="entity" label="对应实体" show-overflow-tooltip>
                    </el-table-column>

                    <el-table-column prop="coding" label="编码格式" align="center" show-overflow-tooltip>
                    </el-table-column>

                    <el-table-column prop="createTime" label="创建时间" align="center" :formatter="formatDate"
                        show-overflow-tooltip>
                    </el-table-column>

                    <el-table-column prop="icon" label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" @click="generateCode(scope.row)" icon="el-icon-download">生成代码
                            </el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </el-col>
        </el-row>
        <!-- 分页数据选择 -->
        <el-row class="footer-page">
            <el-col :span="24">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 20, 50, 100]"
                    :current-page="currentPage" :page-size="pageSize" :total="tableData?tableData.length:total">
                </el-pagination>
            </el-col>
        </el-row>
        <!-- 导入表格弹窗 -->
        <el-dialog title="表格列表" :visible.sync="dialogTableVisible">
            <el-row>
                <el-col :span="24">
                    <el-form :inline="true">
                        <el-form-item label="表名称">
                            <el-input v-model="searchForm.tableName" placeholder="请输入表名称" clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="queryDialogTableData" icon="el-icon-search">搜索</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-table
                        :data="deletedData?deletedData.slice((this.dialogCurrentPage - 1) * this.dialogPageSize, (this.dialogCurrentPage - 1) * this.dialogPageSize + this.dialogPageSize):deletedData"
                        tooltip-effect="dark" style="width: 100%" border stripe
                        @selection-change="handleSelectionChangeDialog">

                        <el-table-column type="selection" width="50" align="center">
                        </el-table-column>

                        <el-table-column prop="tableName" label="表名称" width="120"> </el-table-column>

                        <el-table-column prop="remark" label="描述信息" width="180" show-overflow-tooltip>
                        </el-table-column>

                        <el-table-column prop="createTime" label="创建时间" width="180" align="center"
                            :formatter="formatDate" show-overflow-tooltip>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>

            <el-col :span="12" :offset="9">
                <el-pagination @size-change="handleSizeChangeDialog" @current-change="handleCurrentChangeDialog"
                    layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 20, 50, 100]"
                    :current-page="dialogCurrentPage" :page-size="dialogPageSize"
                    :total="deletedData?deletedData.length:dialogTotal">
                </el-pagination>
            </el-col>
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogTableVisible = false">取 消</el-button>
                <el-button type="primary" @click="addTableData()">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import moment from "moment";
    import codegener from '@/api/codegener/codegener';

    function getCamelCase(str) {
        return str.replace(/_([a-z])/g, function (all, i) {
            return i.toUpperCase();
        })
    }
    export default {
        name: "CodeGener",
        data() {
            return {
                options: [],
                value: '',
                currentDataBase: '',
                searchForm: {
                    tableName: "",
                },
                // 分页数据
                total: 0,
                pageSize: 10,
                currentPage: 1,

                dialogTotal: 0,
                dialogPageSize: 10,
                dialogCurrentPage: 1,

                dialogTableVisible: false,
                tableData: [], // 展示的数据
                tableDataCache: [{ // 查询到的数据
                    entity: "",
                }],
                deletedData: [], // 已删除的展示数据
                deletedDataCache: [], // 已删除的元数据
                multipleSelection: [],
                multipleSelectionDialog: [],
            };
        },
        created() {
            this.getTableData(this.value);
            this.getDataBases();

        },
        methods: {
            // 时间格式化
            formatDate(row, column) {
                // 获取单元格数据
                let data = row[column.property];
                if (data == null) {
                    return null;
                }
                return moment(data).format("YYYY-MM-DD HH:mm:ss");
            },

            // 获取数据库 
            getDataBases() {
                codegener.getDataBases().then((res) => {
                    this.options = res.data.result.data;
                })
            },


            // 获取数据列表
            getTableData(tableName) {
                if (tableName == "") {
                    tableName = "breze";
                }
                this.currentDataBase = tableName;
                codegener.getTableData(tableName).then((res) => {

                    this.tableDataCache = res.data.result.data;

                    this.total = res.data.result.data.length;
                    this.tableDataCache.forEach(item => {
                        item.entity = getCamelCase(item.tableName)
                    });
                    this.tableData = this.tableDataCache;
                })
            },

            // 查询
            queryTableData() {
                if (this.searchForm.tableName == "") {
                    this.tableData = this.tableDataCache;
                    return;
                }
                for (let i in this.searchForm) {
                    const arr = []
                    if (this.searchForm[i] !== '') {
                        if (this.tableData.length != this.total) {
                            this.tableData = this.tableDataCache;
                        }
                        this.tableData.forEach((item) => {

                            if (item[i].toUpperCase().indexOf(this.searchForm[i].toUpperCase()) !== -1) {
                                arr.push(item)
                            }
                        })
                        this.tableData = arr
                    }
                }
                this.searchForm.tableName = ""
            },

            // 弹窗查询
            queryDialogTableData() {

                if (this.searchForm.tableName == "") {
                    this.deletedData = this.deletedDataCache;
                    return;
                }
                for (let i in this.searchForm) {
                    const arr = []
                    if (this.searchForm[i] !== '') {
                        if (this.deletedData.length != this.dialogTotal) {
                            this.deletedData = this.deletedDataCache;
                        }
                        this.deletedData.forEach((item) => {

                            if (item[i].toUpperCase().indexOf(this.searchForm[i].toUpperCase()) !== -1) {
                                arr.push(item)
                            }
                        })
                        this.deletedData = arr
                    }
                }
                this.searchForm.tableName = ""
            },

            // 导入表格
            addTableData() {

                for (var i = 0; i < this.multipleSelectionDialog.length; i++) {
                    var index = this.deletedDataCache.findIndex(item => {
                        if (item.tableName == this.multipleSelectionDialog[i].tableName) {
                            return true;
                        }
                    })
                    this.tableDataCache.push(this.multipleSelectionDialog[i])
                    this.deletedDataCache.splice(index, 1);
                }
                this.dialogTableVisible = false;

            },

            // 删除表格
            deleteTableInfo(index) {
                var tempData = this.tableData.splice(index, 1)[0];
                this.deletedDataCache.push(tempData);

            },
            getDialogData() {
                this.dialogTableVisible = true;
                this.dialogTotal = this.deletedData.length;
                this.deletedData = this.deletedDataCache;


            },

            // 生成代码
            generateCode(row) {
                var tableNames = []
                var tablePrefixs = []
                if (this.multipleSelection == 0 && row != null) {
                    tableNames.push(row.tableName)
                    tablePrefixs.push(row.tableName.split("_")[0] + "_")
                } else if (this.multipleSelection != 0 && row == null) {
                    for (var i = 0; i < this.multipleSelection.length; i++) {
                        tableNames.push(this.multipleSelection[i].tableName)
                        tablePrefixs.push(this.multipleSelection[i].tableName.split("_")[0] + "_")
                    }
                } else {
                    this.$message.error('请求失败');
                    return;
                }
                let params = {
                    dataBaseName: this.value,
                    tableNames: tableNames,
                    tablePrefix: tablePrefixs,
                    packageName: "",
                    author: ""
                }
                codegener.genertedCode(params).then((res) => {
                    this.$message({
                        message: '代码生成成功',
                        type: 'success'
                    });
                })
            },
            // 生成代码 End


            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleSelectionChangeDialog(val) {
                this.multipleSelectionDialog = val;
            },
            handleSizeChangeDialog(val) {
                this.dialogPageSize = val;
                this.dialogCurrentPage = 1;
                this.deletedData = this.list.slice(0, this.dialogPageSize);

            },
            handleCurrentChangeDialog(val) {
                this.dialogCurrentPage = val;
                if (val == 1) {
                    this.deletedData = this.list.slice(0, this.dialogPageSize);
                    return;
                }
                val = (val - 1) * this.dialogPageSize;
                this.deletedData = this.list.slice(val, val + this.dialogPageSize);

            },


            handleSizeChange(val) {
                this.pageSize = val;
                this.currentPage = 1;
                this.tableData = this.list.slice(0, this.pageSize);

            },
            handleCurrentChange(val) {
                this.currentPage = val;
                if (val == 1) {
                    this.tableData = this.list.slice(0, this.pageSize);
                    return;
                }
                val = (val - 1) * this.pageSize;
                this.tableData = this.list.slice(val, val + this.pageSize);

            }
        }
    };
</script>

<style scoped>
    .footer-page {
        margin-top: 20px;
        text-align: right;
    }
</style>