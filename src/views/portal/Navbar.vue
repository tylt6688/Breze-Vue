<template>
  <div class="page">
    <el-header>
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="searchForm.titleName" placeholder="请输入标题名称" clearable>
            <el-button slot="append" @click="getNavbarPage(0)" icon="el-icon-search">搜索</el-button>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="insertNavbar()" icon="el-icon-plus">
            添加导航
          </el-button>
        </el-form-item>

      </el-form>
    </el-header>
    <el-main>
      <el-table :data="navbars" style="width: 100%" row-key="id" ref="table" border lazy :load="getChildrens"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
        <!-- <el-table-column type="index" width="50">
        </el-table-column> -->
        <el-table-column prop="titleName" label="标题名称">
        </el-table-column>
        <el-table-column prop="flag" label="导航栏类型">
          <template slot-scope="scope">
            <div v-if="scope.row.flag === 0">头部导航</div>
            <div v-if="scope.row.flag === 1">尾部导航</div>
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="导航序号">
        </el-table-column>
        <el-table-column prop="titleUrl" label="链接地址">
        </el-table-column>
        <el-table-column prop="icon" label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="editFormData(scope.row)" icon="el-icon-edit">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <template>
              <el-popconfirm title="确定删除此内容吗?" @confirm="delHandle(scope.row.id)">
                <el-button type="text" slot="reference" icon="el-icon-delete">
                  删除
                </el-button>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <!-- 分页 -->

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="current"
      :page-sizes="[2, 5, 10, 20]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!--编辑主体内容模态框 Start-->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">
      <el-form ref="editForm" :model="editForm" :rules="editFormRules">
        <el-form-item label="导航栏名称" prop="titleName" label-width="100px">
          <el-input v-model="editForm.titleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="导航栏类型" label-width="100px" prop="flag">
          <el-select v-model="editForm.flag" placeholder="请选择导航栏类型">
            <el-option v-for="item in flagValue" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="导航序号" prop="titleUrl" label-width="100px">
          <el-input v-model="editForm.orderNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="跳转路径" prop="titleUrl" label-width="100px">
          <el-input v-model="editForm.titleUrl" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上一级菜单" label-width="100px" prop="parentId">
          <el-select v-model="editForm.parentId" placeholder="请选择上一级菜单">
            <el-option v-for="item in this.parentSelectorList" :key="item.id" :label="item.titleName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
        <el-button @click="resetForm('editForm')">取 消</el-button>
      </div>
    </el-dialog>
    <!--编辑主体内容模态框 End-->
  </div>

</template>

<script>
  import navbar from "@/api/portal/navbar";
  export default {
    name: "Navbar",
    data() {
      return {
        // 分页数据
        total: 0,
        current: 1,
        size: 10,

        searchForm: {
          titleName: ""
        },

        dialogVisible: false,
        navbars: [],
        editForm: {},
        title: "",
        //表单规则
        editFormRules: {
          titleName: [{
            required: true,
            message: "请输入标题名称",
            trigger: "blur",
          }, ],
          flag: [{
            required: true,
            message: "请选择标题类型",
            trigger: "change",
          }, ],

          titleUrl: [{
            required: true,
            message: "请填入链接地址",
            trigger: "blur",
          }, ],
          parentId: [{
            required: true,
            message: "请选择上一级标题",
            trigger: "change",
          }, ],
        },
        //标题类型显示数据
        flagValue: [{
          value: 0,
          label: '头部导航'
        }, {
          value: 1,
          label: '尾部导航',
        }],
        parentSelectorList: []
      };
    },
    created() {},
    mounted() {
      this.getNavbarPage(0);
      this.findAllNavbar();
    },
    methods: {
      // 获取导航菜单列表 Start
      getNavbarPage(id) {
        let params = {
          titleName: this.searchForm.titleName,
          current: this.current,
          size: this.size,
          parentId: id,
        };
        navbar.getNavbarPage(params).then((res) => {
          this.navbars = res.data.result.data.records
          this.total = res.data.result.data.total
        });
      },
      // 获取导航菜单列表 End

      //获取子节点
      getChildrens(tree, treeNode, resolve) {
        // 懒加载树级
        let params = {
          titleName: this.searchForm.titleName,
          current: this.current,
          size: this.size,
          parentId: tree.id,
        };
        navbar.getNavbarPage(params).then((res) => {
          console.log("chiuld", res.data.result.data.records);
          resolve(res.data.result.data.records);
        });
      },
      //查询所有数据的标题和id
      findAllNavbar() {
        navbar.findAllNavbar().then(res => {
          this.parentSelectorList = res.data.result.data;
          this.parentSelectorList.push({
            id: 0,
            titleName: '无'
          })
        })
      },
      insertNavbar(){
        this.title = "新增导航菜单";
        this.dialogVisible = true;
      },
      editFormData(row) {
          this.title = "编辑导航菜单"
          this.dialogVisible = true;
          navbar.getNavbarInfo(row.id).then(res => {
            console.log(typeof res.data.result.data.flag);
            this.editForm = res.data.result.data;
          })
  
      },
      // 新增或编辑Banner图 Start
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log("editForm",this.editForm)
            navbar.submitNavbarForm(this.editForm, this.editForm.id).then((res) => {
              this.$message({
                showClose: true,
                duration: 2000,
                message: "操作成功",
                type: "success",
                onClose: () => {
                  this.getNavbarPage(0);
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
      // 新增或编辑Banner图 End

      // 删除内容 Start
      delHandle(id) {
        navbar.delHandleInfo(id).then((res) => {
          this.$message({
            showClose: true,
            duration: 2000,
            message: "删除成功",
            type: "success",
            onClose: () => {
              this.getNavbarPage(0);
            },
          });
        });
      },
      // 删除内容 End

      // 取消编辑，重置模态框内容 Start
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogVisible = false;
        this.editForm = {};
      },
      handleClose() {
        this.resetForm("editForm");
        this.dialogVisible = false;

      },
      // 取消编辑，重置模态框内容 End

      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.size = val;
        this.getNavbarPage(0);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.current = val;
        this.getNavbarPage(0);
      },

    },
  };
</script>

<style scoped>
  .el-pagination {
    float: right;
    margin-top: 22px;
  }
</style>