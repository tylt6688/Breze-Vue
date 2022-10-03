<template>
    <div class="page">
        <el-form :inline="true">
            <el-form-item>
                <el-button type="primary" icon="el-icon-folder-add">新增菜单</el-button>
            </el-form-item>
        </el-form>
        <el-row :gutter="20">
            <el-col :span="6" class="card-col">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>sdfsdg</span>
                        <el-dropdown style="float:right" trigger="click" size="small">
                            <span class="el-dropdown-link">
                                <i class="el-icon-more"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>编辑</el-dropdown-item>
                                <el-dropdown-item>删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>

                    </div>
                    <div class="text item">
                        <!-- <el-link @click="toDetail()" :underline="false"> -->
                            <div class="item-title">gewgfdgheh多少个的各位股东身份Gregege</div>
                        <!-- </el-link> -->
                        
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6" class="card-col">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>sdfsdg</span>
                        <el-dropdown style="float:right" trigger="click" size="small">
                            <span class="el-dropdown-link">
                                <i class="el-icon-more"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>编辑</el-dropdown-item>
                                <el-dropdown-item>删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>

                    </div>
                    <div class="text item">
                        <!-- <el-link @click="toDetail()" :underline="false"> -->
                            <div class="item-title">gewgfdgheh多少个的各位股东身份Gregege</div>
                        <!-- </el-link> -->
                        
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6" class="card-col">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>sdfsdg</span>
                        <el-dropdown style="float:right" trigger="click" size="small">
                            <span class="el-dropdown-link">
                                <i class="el-icon-more"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>编辑</el-dropdown-item>
                                <el-dropdown-item>删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>

                    </div>
                    <div class="text item">
                        <!-- <el-link @click="toDetail()" :underline="false"> -->
                            <div class="item-title">gewgfdgheh多少个的各位股东身份Gregege</div>
                        <!-- </el-link> -->
                        
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6" class="card-col">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>sdfsdg</span>
                        <el-dropdown style="float:right" trigger="click" size="small">
                            <span class="el-dropdown-link">
                                <i class="el-icon-more"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>编辑</el-dropdown-item>
                                <el-dropdown-item>删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>

                    </div>
                    <div class="text item">
                        <!-- <el-link @click="toDetail()" :underline="false"> -->
                            <div class="item-title">gewgfdgheh多少个的各位股东身份Gregege</div>
                        <!-- </el-link> -->
                        
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6" class="card-col">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>sdfsdg</span>
                        <el-dropdown style="float:right" trigger="click" size="small">
                            <span class="el-dropdown-link">
                                <i class="el-icon-more"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>编辑</el-dropdown-item>
                                <el-dropdown-item>删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>

                    </div>
                    <div class="text item">
                        <!-- <el-link @click="toDetail()" :underline="false"> -->
                            <div class="item-title">gewgfdgheh多少个的各位股东身份Gregege</div>
                        <!-- </el-link> -->
                        
                    </div>
                </el-card>
            </el-col>



        </el-row>

    </div>
</template>

<script>
    export default {
        name: "PortalManage",

        data() {
            return {

            };
        },
        created() {},
        mounted() {

        },
        methods: {},
    };
</script>

<style scoped>
    .box-card {
        width: 80%;
        border-radius: 25px;

    }

    .card-col {
        margin: 1% 0;
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

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both;
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
</style>