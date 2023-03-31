<template>
  <div class="page">
    <!-- 头部操作部分 Start -->
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="请输入名称" clearable>
          <el-button slot="append" @click="getRoleList" icon="el-icon-search">搜索</el-button>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="dialogVisible = true" icon="el-icon-plus">新增角色</el-button>
      </el-form-item>
      <el-form-item>
        <el-popconfirm title="确定删除已选项吗？" @confirm="delHandle(null)">
          <el-button type="danger" slot="reference" :disabled="delBtlState" icon="el-icon-delete">批量删除
          </el-button>
        </el-popconfirm>
      </el-form-item>
    </el-form>
    <!-- 头部操作部分 End -->

    <!-- 表格数据 -->
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" border stripe
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>

      <el-table-column prop="name" label="名称" show-overflow-tooltip> </el-table-column>

      <el-table-column prop="code" label="唯一编码"  show-overflow-tooltip>
      </el-table-column>

      <el-table-column prop="remark" label="描述" show-overflow-tooltip>
      </el-table-column>

      <el-table-column prop="state" label="状态" align="center" width="140">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.state === 0" type="success">正常</el-tag>
          <el-tag size="small" v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="创建时间" align="center" :formatter="formatDate" show-overflow-tooltip>
      </el-table-column>

      <el-table-column prop="updateTime" label="更新时间" align="center" :formatter="formatDate" show-overflow-tooltip>
      </el-table-column>

      <el-table-column prop="icon" label="操作" width="240">
        <template slot-scope="scope">
          <el-button type="text" @click="permHandle(scope.row.id)" icon="el-icon-thumb">分配权限
          </el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" @click="editHandle(scope.row.id)" icon="el-icon-edit">编辑</el-button>
          <el-divider direction="vertical"></el-divider>
          <template>
            <el-popconfirm title="确定删除此角色吗？" @confirm="delHandle(scope.row.id)">
              <el-button type="text" slot="reference" icon="el-icon-delete">删除</el-button>
            </el-popconfirm>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页数据选择 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 20, 50, 100]" :current-page="current"
      :page-size="size" :total="total">
    </el-pagination>

    <!--新增角色模态框-->
    <el-dialog title="角色信息" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">
        <el-form-item label="角色名称" prop="name" label-width="100px">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="唯一编码" prop="code" label-width="100px">
          <el-input v-model="editForm.code" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="描述" prop="remark" label-width="100px">
          <el-input v-model="editForm.remark" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="state" label-width="100px">
          <el-radio-group v-model="editForm.state">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 分配权限模态框 -->
    <el-dialog title="分配权限" :visible.sync="permDialogVisible" width="600px">
      <el-form :model="permForm">
        <el-form-item label="父子关联">
          <el-switch v-model="checkStrictly" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-tree :data="permTreeData" accordion show-checkbox ref="permTree" node-key="id"
          :check-strictly="!checkStrictly" :props="defaultProps">
        </el-tree>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPermFormHandle('permForm')">确 定</el-button>
        <el-button @click="permDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import moment from "moment";
  import role from "@/api/sys/role";
  import menu from "@/api/sys/menu";

  export default {
    // inject: ["reload"],
    name: "Role",
    data() {
      return {
        permDialogVisible: false,
        // 批量删除
        delBtlState: true,
        // 父子联动
        checkStrictly: true,
        dialogVisible: false,
        // 分页数据
        total: 0,
        size: 10,
        current: 1,

        tableData: [],
        permTreeData: [],
        multipleSelection: [],
        searchForm: {},
        permForm: {},
        editForm: {
          state: 0
        },

        defaultProps: {
          label: "title",
          children: "children",
        },
        editFormRules: {
          name: [{
            required: true,
            message: "请输入角色名称",
            trigger: "blur",
          }, ],
          code: [{
            required: true,
            message: "请输入唯一编码",
            trigger: "blur",
          }, ],
          state: [{
            required: true,
            message: "请选择状态",
            trigger: "blur",
          }, ],
        },

      };
    },
    mounted() {
      this.getRoleList();
      menu.getMenuTree().then((res) => {
        this.permTreeData = res.data.result.data;
      });
    },
    methods: {
      // 时间格式化 Start
      formatDate(row, column) {
        // 获取单元格数据
        let data = row[column.property];
        if (data == null) {
          return null;
        }
        return moment(data).format("YYYY-MM-DD HH:mm:ss");
      },
      // 时间格式化 End

      toggleSelection(rows) {
        if (rows) {
          rows.forEach((row) => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        console.log("勾选", val);
        this.multipleSelection = val;
        this.delBtlState = val.length == 0;
      },

      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.size = val;
        this.getRoleList();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.current = val;
        this.getRoleList();
      },

      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.editForm = {};
      },

      resetEditForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogVisible = false;
        this.editForm = {};
      },
      handleClose() {
        this.resetEditForm("editForm");
      },
      // 获取角色列表数据
      getRoleList() {
        let params = {
          name: this.searchForm.name,
          current: this.current,
          size: this.size,
        };
        role.getRoleList(params).then((res) => {
          this.tableData = res.data.result.data.records;
          this.size = res.data.result.data.size;
          this.current = res.data.result.data.current;
          this.total = res.data.result.data.total;
        });
      },

      // 新增或更新角色信息
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            role.submitRoleForm(this.editForm, this.editForm.id).then((res) => {
              this.$message({
                showClose: true,
                duration: 2000,
                message: "操作成功",
                type: "success",
                onClose: () => {
                  this.getRoleList();
                },
              });
              this.dialogVisible = false;
              this.resetEditForm(formName);
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      editHandle(id) {
        role.roleInfo(id).then((res) => {
          this.editForm = res.data.result.data;
          this.dialogVisible = true;
        });
      },
      // 删除角色
      delHandle(id) {
        var ids = [];
        if (id) {
          ids.push(id);
        } else {
          this.multipleSelection.forEach((row) => {
            ids.push(row.id);
          });
        }
        role.delHandle(ids).then((res) => {
          this.$message({
            showClose: true,
            duration: 2000,
            message: "操作成功",
            type: "success",
            onClose: () => {
              this.getRoleList();
            },
          });
        });
      },
      // 根据角色id获取相应菜单列表
      permHandle(id) {
        this.permDialogVisible = true;
        role.permHandle(id).then((res) => {
          this.$refs.permTree.setCheckedKeys(res.data.result.data.menuIds);
          this.permForm = res.data.result.data;
        });
      },

      // 回显权限编辑中已选择的权限
      submitPermFormHandle(formName) {
        var menuIds = this.$refs.permTree.getCheckedKeys();
        role.submitPermFormHandle(menuIds, this.permForm.id).then((res) => {
          this.$message({
            showClose: true,
            duration: 2000,
            message: "操作成功",
            type: "success",
            onClose: () => {
              // 刷新整个页面，因为此处是变更的后端数据，此时后端数据传输过来后无法进行双向响应，所以数据在缓存中前端未读取到，并且路由更新通过url,只能刷新页面解决，相对后面的方法其实没什么软用了但还是留着吧
              // this.$router.go(0);
              this.getRoleList();
              // this.reload();
            },
          });
          this.permDialogVisible = false;
          this.resetEditForm(formName);
        });
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