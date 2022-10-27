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
              <el-popconfirm title="确定删除此内容吗?" @confirm="delHandle(scope.row)">
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
          <el-select v-model="editForm.flag" placeholder="请选择导航栏类型" @change="currStationChange">
            <el-option v-for="item in flagValue" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="导航序号" prop="orderNum" label-width="100px">
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

        count: "",

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
          orderNum: [{
            required: true,
            message: "请输入导航序号",
            trigger: "blur",
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
        parentSelectorList: [],
      };
    },
    created() {},
    mounted() {
      this.getNavbarPage(0);
      this.findNavbarCount();
    },
    methods: {
      // 获取导航菜单列表 
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
          resolve(res.data.result.data.records);
        });
      },
      //查询指定导航类型的数据
      findAllNavbar(flag, row) {
        navbar.findAllNavbar(flag).then(res => {
          this.parentSelectorList = res.data.result.data;
          this.parentSelectorList.unshift({
            id: 0,
            titleName: '无'
          })
          //删除数组中的本身数据，只操作编辑框
          if (row) {
            this.parentSelectorList.forEach((item, index) => {
              if (item.id == row.id) {
                this.parentSelectorList.splice(index, 1);
              }
            })
          }
        })
      },
      // 查询所有数据数量
      findNavbarCount() {
        navbar.findCount().then(res => {
          this.count = res.data.result.data;
        })
      },
      // 新增按钮调用
      insertNavbar() {
        this.title = "新增导航菜单";
        this.dialogVisible = true;
        this.editForm.orderNum = this.count + 1;
      },
      // 编辑按钮调用
      editFormData(row) {
        this.title = "编辑导航菜单"
        this.dialogVisible = true;
        navbar.getNavbarInfo(row.id).then(res => {
          this.editForm = res.data.result.data;
          this.findAllNavbar(parseInt(this.editForm.flag), row);
        })

      },
      // 导航类型选择器值变化调用  flag
      currStationChange(val) {
        this.findAllNavbar(val, null);
      },
      // 新增或编辑Banner图 
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            navbar.submitNavbarForm(this.editForm, this.editForm.id).then((res) => {
              this.$message({
                showClose: true,
                duration: 2000,
                message: res.data.message,
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

      // 删除内容 
      delHandle(row) {
        if (row.hasChildren) {
          this.$message({
            message: '该数据存在分支，禁止删除',
            type: 'warning'
          });
          return;
        }
        navbar.delHandleInfo(row.id).then((res) => {
          this.$message({
            showClose: true,
            duration: 2000,
            message: res.data.message,
            type: "success",
            onClose: () => {
              this.getNavbarPage(0);
            },
          });
        });
      },

      // 取消编辑，重置模态框内容 
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogVisible = false;
        this.editForm = {};
      },
      // 模态框关闭
      handleClose() {
        this.resetForm("editForm");
        this.dialogVisible = false;

      },
      // 页码和当前页数量改变调用
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