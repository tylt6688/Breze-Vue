<template>
    <div class="page">
        <!-- 头部操作部分 Start -->
        <el-form :inline="true">
            <el-form-item>
                <el-autocomplete v-model="searchForm.tableName" :fetch-suggestions="querySearch" @select="handleSelect"
                    placeholder="请输入内容">
                </el-autocomplete>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-download" @click="generateCode(null)">批量生成
                </el-button>
            </el-form-item>

            <el-form-item>
                <el-tag type="success">当前数据库: {{currentDataBase}}</el-tag>
            </el-form-item>

            <el-form-item>
                <el-select v-model="generCodeParams.dataBaseName" @change="getTableData" placeholder="请选择数据库">
                    <el-option v-for="(item,index) in dataBaseOptions" :value="item" :key="index">
                    </el-option>
                </el-select>
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

                    <el-table-column prop="tableName" label="数据表名称">
                    </el-table-column>

                    <el-table-column prop="remark" label="描述信息" show-overflow-tooltip>
                    </el-table-column>

                    <el-table-column prop="coding" label="编码格式" align="center" show-overflow-tooltip>
                    </el-table-column>

                    <el-table-column prop="createTime" label="创建时间" align="center" show-overflow-tooltip
                        :formatter="formatDate">
                    </el-table-column>

                    <el-table-column prop="icon" label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" icon="el-icon-download" @click="generateCode(scope.row)">生成代码
                            </el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </el-col>
        </el-row>

        <!-- 分页数据选择 -->
        <div class="footer-page">
            <el-row>
                <el-col :span="24">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 20, 50, 100]"
                        :current-page="currentPage" :page-size="pageSize" :total="tableData?tableData.length:total">
                    </el-pagination>
                </el-col>
            </el-row>
        </div>

        <!--编辑代码生成下载模板模态框-->
        <el-dialog v-dialogDrag title="生成信息" :visible.sync="generCodeDialogVisible" width="600px"
            :before-close="generCodeDialogClose">
            <el-form :model="generCodeParams" :rules="generCodeFormRules" ref="generCodeForm">

                <el-form-item label="所选数据库" label-width="100px">
                    <el-input v-model="currentDataBase" autocomplete="off" :disabled="true"></el-input>
                    <el-alert title="用于生成代码的数据库名称，请注意确认" :closable="false" type="info" style="line-height: 12px">
                    </el-alert>
                </el-form-item>

                <el-form-item label="作者名称" label-width="100px" prop="author">
                    <el-input v-model="generCodeParams.author" autocomplete="off"></el-input>
                    <el-alert title="作者名尽量填写，会在代码注释中体现" :closable="false" type="warning" show-icon
                        style="line-height: 12px">
                    </el-alert>
                </el-form-item>

                <el-form-item label="项目包名" label-width="100px" prop="packageName">
                    <el-input v-model="generCodeParams.packageName" autocomplete="off"></el-input>
                    <el-alert title="包名间通过'.'隔开" type="info" show-icon :closable="false" style="line-height: 12px">
                    </el-alert>
                </el-form-item>

                <el-form-item label="输出目录" label-width="100px">

                    <el-select v-model="generCodeParams.outputDir" placeholder="请选择本地生成路径" @change="getOutputDir">
                        <el-option v-for="(item,index) in outputDirOptions" :value="item" :key="index">
                        </el-option>
                    </el-select>
                    <el-alert title="Windows系统下默认生成到D盘根目录下" type="info" :closable="false" style="line-height: 12px">
                    </el-alert>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sendGenerateCode">确 定</el-button>
                <el-button @click="generCodeDialogClose">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import codegener from '@/api/codegener/codegener'
    export default {
        name: "CodeGener",
        data() {
            return {
                dataBaseOptions: [],
                currentDataBase: '',
                searchForm: {
                    tableName: "",
                },
                // 表格数据
                tableData: [],
                generCodeFormRules: {

                    packageName: [{
                        required: true,
                        message: "请输入项目包名",
                        trigger: "blur"
                    }],

                },
                // 分页数据
                total: 0,
                pageSize: 10,
                currentPage: 1,

                outputDirOptions: ['C://', 'D://', 'E://'],

                // 生成代码参数
                generCodeParams: {
                    dataBaseName: '',
                    tableNames: [],
                    tablePrefix: [],
                    packageName: '',
                    author: '',
                    outputDir: 'D://'
                },

                generCodeDialogVisible: false,

                multipleSelection: [],
            };
        },

        mounted() {
            this.getTableData(this.generCodeParams.dataBaseName);
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
                return this.$moment(data).format("YYYY-MM-DD HH:mm:ss");
            },

            // 获取数据库
            getDataBases() {
                codegener.getDataBases().then((res) => {
                    this.dataBaseOptions = res.data.result.data;
                })
            },


            // 获取数据列表
            getTableData(dataBaseName) {
                if (dataBaseName == "") {
                    dataBaseName = "breze";
                }
                this.currentDataBase = dataBaseName;
                this.generCodeParams.dataBaseName = dataBaseName;

                codegener.getTableData(dataBaseName).then((res) => {
                    this.tableData = res.data.result.data;
                })
            },

            // 动态查询搜索
            querySearch(queryString, cb) {
                let tableNames = this.tableData.map(item => {
                    return {
                        value: item.tableName
                    }
                });
                let results = queryString ? tableNames.filter(this.createFilter(queryString)) : tableNames;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },

            // 创建拦截寻找指定字符串
            createFilter(queryString) {
                return (result) => {
                    return (result.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },

            // 选择搜索结果
            handleSelect(item) {
                console.log(item);
            },


            // 获取输出路径
            getOutputDir(e) {
                this.generCodeParams.outputDir = e;
            },

            // 生成代码
            generateCode(row) {
                this.generCodeDialogVisible = true;

                let tableNames = [];
                let tablePrefixs = [];

                if (this.multipleSelection.length === 0 && row != null) {
                    tableNames.push(row.tableName);
                    tablePrefixs.push(row.tableName.split("_")[0] + "_");
                } else if (this.multipleSelection.length != 0 && row == null) {
                    this.multipleSelection.forEach(item => {
                        tableNames.push(item.tableName)
                        tablePrefixs.push(item.tableName.split("_")[0] + "_")
                    })
                } else {
                    this.$message.error('出现异常');
                    return;
                }

                this.generCodeParams.tableNames = tableNames;
                this.generCodeParams.tablePrefix = tablePrefixs;

            },
            
            // 后端请求生成代码
            sendGenerateCode() {
                this.$refs['generCodeForm'].validate((valid) => {
                    if (valid) {
                        codegener.genertedCode(this.generCodeParams).then((res) => {
                            this.$message({
                                message: res.data.message,
                                type: 'success'
                            });
                            this.generCodeDialogClose();
                        })
                    }
                });

            },

            // 关闭生成信息模态框
            generCodeDialogClose() {
                this.generCodeDialogVisible = false;
                this.$refs['generCodeForm'].resetFields();
            },


            handleSelectionChange(val) {
                this.multipleSelection = val;
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