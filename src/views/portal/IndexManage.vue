<template>
    <div class="page">
        <el-container>
            <!-- 头部搜索框 Start -->
            <el-header>
                <el-form :inline="true">
                    <el-form-item>
                        <el-input v-model="searchForm.modeTitle" placeholder="请输入模块标题" clearable>
                            <el-button slot="append" @click="getModeCardInfo" icon="el-icon-search">搜索</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-folder-add" @click="dialogModeVisible = true">新增菜单
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-header>
            <!-- 头部搜索框 End -->

            <!-- 模块显示内容 Start -->
            <el-main>
                <el-row class="main-row" :gutter="20" type="flex" justify="start">
                    <el-col :span="6" class="card-col" v-for="(item,index) in modeCardList" :key="index">
                        <el-card class="box-card" shadow="hover">
                            <div slot="header">
                                <router-link :to="item.modeLink">

                                    <span>{{item.modeTitle}}</span>
                                </router-link>
                                <el-dropdown style="float:right" trigger="click" size="small" @command="handleCommand">
                                    <span class="el-dropdown-link">
                                        <i class="el-icon-more"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item :command="beforeHandleCommand('edit', item)">编辑
                                        </el-dropdown-item>
                                        <el-dropdown-item :command="beforeHandleCommand('delete', item)">删除
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                            <div class="text item">
                                <!-- <el-link @click="toDetail()" :underline="false"> -->
                                <div class="item-title">{{item.modeInfo}}</div>
                                <!-- </el-link> -->

                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-main>
            <!-- 模块显示内容 End -->
            <el-footer>
                <!-- 分页数据选择 Start -->
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 20, 50, 100]"
                    :current-page="current" :page-size="size" :total="total">
                </el-pagination>
                <!-- 分页数据选择 End-->
            </el-footer>
        </el-container>
        <!-- 新建编辑模态框 Start -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogModeVisible" width="500px" :before-close="handleClose">
            <el-form :model="editForm" :rules="editModeFormRules" ref="editForm" label-width="100px"
                class="demo-editForm">
                <el-form-item label="模块标题" prop="modeTitle" label-width="100px">
                    <el-input v-model="editForm.modeTitle" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="模块介绍" prop="modeInfo" label-width="100px">
                    <el-input v-model="editForm.modeInfo" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="模块URL" prop="modeLink" label-width="100px">
                    <el-input v-model="editForm.modeLink" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="模块组件" prop="modeComponent" label-width="100px">
                    <el-input v-model="editForm.modeComponent" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
                    <el-button @click="resetForm('editForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 新建编辑模态框 Start -->
    </div>
</template>

<script>
    import modeCard from '@/api/portal/modeCard'
    export default {
        name: "PortalManage",
        data() {
            return {
                // 分页数据
                total: 0,
                size: 10,
                current: 1,
                //数据存储列表
                modeCardList: [],
                //搜索框条件
                searchForm: {},
                dialogModeVisible: false,
                dialogTitle:"新增模块",
                //新建编辑存储
                editForm: {},
                //表单规则
                editModeFormRules: {
                    modeTitle: [{
                        required: true,
                        message: "请输入模块名称",
                        trigger: "blur",
                    }, ],
                    modeInfo: [{
                        required: true,
                        message: "请输入模块介绍",
                        trigger: "blur",
                    }, ],

                    modeLink: [{
                        required: true,
                        message: "请填入模块URL",
                        trigger: "blur",
                    }, ],
                    modeComponent: [{
                        required: true,
                        message: "请填入模块组件",
                        trigger: "blur",
                    }, ],
                },
            };
        },
        created() {},
        mounted() {
            this.getModeCardInfo();
        },
        methods: {
            // 获取分页数据 Start
            getModeCardInfo() {
                let params = {
                    modeTitle: this.searchForm.modeTitle,
                    current: this.current,
                    size: this.size,
                }
                modeCard.getModeCardInfo(params).then((res) => {
                    this.modeCardList = res.data.result.data.records;
                    this.total = res.data.result.data.total;

                })
            },

            // 新增模块 
            submitForm(formName) {
                console.log(this.editForm)
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log(this.editForm)
                        modeCard.submitModeForm(this.editForm, this.editForm.id).then((res) => {
                            this.$message({
                                showClose: true,
                                duration: 2000,
                                message: "操作成功",
                                type: "success",
                                onClose: () => {
                                    this.getModeCardInfo();
                                },
                            });
                            this.handleClose();
                        });
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            },

            // 下拉菜单参数配置 
            beforeHandleCommand(flag, command) {
                return {
                    'flag': flag,
                    'command': command
                }
            },

            // 下拉菜单执行方法 
            handleCommand(val) {
                switch (val.flag) {
                    case 'edit':
                        this.dialogModeVisible = true;
                        this.dialogTitle = "编辑模块"
                        this.findModeInfo(val.command.id);
                        break;
                    case 'delete':
                        this.deleteModeCard(val.command)
                        break;
                    default:
                        break;
                }
            },
            findModeInfo(id){
                modeCard.findDataById(id).then(res => {
                    this.editForm = res.data.result.data;
                })
            },
            // 删除单个数据 
            deleteModeCard(item) {
                this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    modeCard.deleteModeCard(item.id).then((res) => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!',
                            onClose: () => {
                                this.getModeCardInfo();
                            },
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            
            // 重新设置编辑模态框为空
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.editForm = {};
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.size = val;
                this.getModeCardInfo();
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.current = val;
                this.getModeCardInfo();
            },
            //表单关闭后进行重置
            handleClose() {
                this.dialogModeVisible = false;
                this.resetForm("editForm");
            },
        },
    };
</script>

<style scoped>
    .el-header {
        width: 100%;
        line-height: 60px;
        box-shadow: 0px 5px 8px -12px #000000;
    }

    .el-main {
        height: calc(100vh - 308px);
    }

    .box-card {
        width: 80%;
        border-radius: 25px;
    }
    .main-row{
        flex-wrap:wrap
    }
    .card-col {
        margin: 2% 0;
    }

    .text {
        font-size: 14px;
    }

    .text>>>.el-link {
        display: block;
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

    .el-card__header a {
        text-decoration: none;
        color: #333;
    }

    .el-dropdown-link {
        cursor: pointer;
    }

    .el-icon-arrow-down {
        font-size: 12px;
    }

    .demonstration {
        display: block;
        color: #8492a6;
        font-size: 14px;
        margin-bottom: 20px;
    }

    .el-pagination {
        float: right;
        margin-top: 22px;
    }
</style>