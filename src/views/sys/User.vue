<template>
  <div class="page">
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable>
          <el-button slot="append" @click="getUserList" icon="el-icon-search">搜索</el-button>
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="dialogVisible = true" v-if="hasAuth('sys:user:insert')" icon="el-icon-plus">
          新增用户</el-button>
      </el-form-item>

      <el-form-item>
        <el-popconfirm title="确定将已选择用户批量删除吗?" @confirm="delHandle(null)">
          <el-button type="danger" icon="el-icon-delete" slot="reference" :disabled="delBtlState"
            v-if="hasAuth('sys:user:delete')">
            批量删除</el-button>
        </el-popconfirm>
      </el-form-item>

      <el-form-item>
        <el-button type="warning" icon="el-icon-connection" @click="roleMoreHandle" :disabled="permMoreBtlState">
          批量授权</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="success" @click="moreDialogVisible = true" v-if="hasAuth('sys:user:insert')"
          icon="el-icon-upload2">批量导入
        </el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="info" @click="exportExcel" icon="el-icon-download">批量导出
        </el-button>
      </el-form-item>
    </el-form>

    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" border stripe
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center">
      </el-table-column>

      <el-table-column label="头像" width="70" align="center">
        <template slot-scope="scope">
          <el-avatar shape="square" size="medium" :src="scope.row.avatar"></el-avatar>
        </template>
      </el-table-column>

      <el-table-column prop="username" label="用户名" width="120">
      </el-table-column>

      <el-table-column prop="name" sortable label="角色名称">
        <template slot-scope="scope">
          <el-tag style="margin: 3px" size="small" v-for="(item, index) in scope.row.roles" :key="index">
            {{ item.name }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="trueName" align="center" label="真实姓名" width="100">
      </el-table-column>

      <el-table-column prop="email" label="邮箱"> </el-table-column>

      <el-table-column prop="phone" label="手机号"> </el-table-column>

      <el-table-column prop="state" label="状态" align="center" width="80">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.state === 0" type="success">正常</el-tag>
          <el-tag size="small" v-else-if="scope.row.state === 1" type="danger">禁用</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="创建时间" align="center" :formatter="formatDate" width="160">
      </el-table-column>

      <el-table-column prop="icon" label="操作" width="330">
        <template slot-scope="scope">
          <el-button type="text" @click="roleHandle(scope.row.id)" icon="el-icon-thumb">分配角色</el-button>
          <el-divider direction="vertical"></el-divider>

          <el-button type="text" @click="repassHandle(scope.row.id, scope.row.username)" icon="el-icon-refresh-left">
            重置密码</el-button>
          <el-divider direction="vertical"></el-divider>

          <el-button type="text" @click="editHandle(scope.row.id)" icon="el-icon-edit">编辑</el-button>
          <el-divider direction="vertical"></el-divider>

          <template>
            <el-popconfirm title="确定删除此用户吗?" @confirm="delHandle(scope.row.id)">
              <el-button type="text" slot="reference" icon="el-icon-delete">删除</el-button>
            </el-popconfirm>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      layout="total, sizes, prev, pager, next, jumper" background :page-sizes="[10, 20, 50, 100]" :current-page="current"
      :page-size="size" :total="total">
    </el-pagination>

    <!--新增编辑单用户模态框 Start-->
    <el-dialog title="新增或编辑用户" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editForm">
        <el-form-item label="登录用户名" prop="username" label-width="100px">
          <el-input v-model="editForm.username" autocomplete="off"></el-input>

          <el-alert title="用户名可为统一工号，新增用户初始密码为:123456" :closable="false" type="info" style="line-height: 12px">
          </el-alert>
        </el-form-item>

        <el-form-item label="真实姓名" prop="trueName" label-width="100px">
          <el-input v-model="editForm.trueName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email" label-width="100px">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="phone" label-width="100px">
          <el-input v-model="editForm.phone" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="state" label-width="100px">
          <el-radio-group v-model="editForm.state">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
        <el-button @click="resetForm('editForm')">取 消</el-button>
      </div>
    </el-dialog>
    <!--新增单用户模态框 End-->

    <!--批量新增模态框 Start-->
    <el-dialog title="批量新增用户" :visible.sync="moreDialogVisible" width="600px" :before-close="moreHandClose">
      <el-button type="primary" round @click="exportModelExcel">下载 Excel 导入模板</el-button>

      <el-upload ref="upload" class="downloadModel" action="url" drag :http-request="uploadExcel" multiple
        accept=".xls,.xlsx" :limit="1" :auto-upload="uploadState">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传xlsx文件,请按照模板文件上传
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitExcel">上传</el-button>
        <el-button @click="moreDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--批量新增模态框 End-->

    <!-- 分配权限模态框 Start-->
    <el-dialog title="分配角色" :visible.sync="roleDialogFormVisible" width="600px">
      <el-form :model="roleForm">
        <el-tree :data="roleTreeData" show-checkbox ref="roleTree" :check-strictly="checkStrictly" node-key="id"
          :default-expand-all="true" :props="defaultProps">
        </el-tree>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRoleHandle('roleForm')">确 定</el-button>
        <el-button @click="roleDialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限模态框 End-->

    <!-- 批量分配权限模态框 Start-->
    <el-dialog title="批量分配角色" :visible.sync="roleMoreDialogFormVisible" width="600px">
      <el-form :model="roleForm">
        <el-tree :data="roleTreeData" show-checkbox ref="roleMoreTree" :check-strictly="checkStrictly" node-key="id"
          :default-expand-all="true" :props="defaultProps">
        </el-tree>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitMoreRoleHandle('roleForm')">确 定</el-button>
        <el-button @click="roleMoreDialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 批量分配权限模态框 End-->
  </div>
</template>



<script>
  import moment from "moment";
  import user from "@/api/sys/user";
  import role from "@/api/sys/role";

  export default {
    name: "User",
    data() {
      return {
        dialogVisible: false,
        moreDialogVisible: false,
        uploadState: false,
        permMoreBtlState: true,
        delBtlState: true,
        checkStrictly: true,
        roleDialogFormVisible: false,
        roleMoreDialogFormVisible: false,

        searchForm: {
          username: ""
        },
        total: 0,
        size: 10,
        current: 1,

        editForm: {
          state: 0
        },
        roleForm: {},

        tableData: [],
        roleTreeData: [],
        treeCheckedKeys: [],
        multipleSelection: [],

        defaultProps: {
          children: "children",
          label: "name",
        },

        editFormRules: {
          username: [{
            required: true,
            message: "请输入用户名称",
            trigger: "blur",
          }, ],
          truename: [{
            required: true,
            message: "请输入用户真实姓名",
            trigger: "blur",
          }, ],
          email: [{
            required: true,
            message: "请输入邮箱",
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
    created() {
      this.getUserList();
      this.getRoleTree();
    },
    methods: {
      // 格式化日期时间 Start
      formatDate(row, column) {
        let data = row[column.property];
        if (data == null) {
          return null;
        }
        return moment(data).format("YYYY-MM-DD HH:mm:ss");
      },
      // 格式化日期时间 End

      // 获取已存在权限 Start
      getRoleTree() {
        role.getRoleList().then((res) => {
          this.roleTreeData = res.data.result.data.records;
        });
      },
      // 获取已存在权限 End

      // 获取用户列表 Start
      getUserList() {
        console.log("searchForm", this.searchForm.username);
        let params = {
          username: this.searchForm.username,
          current: this.current,
          size: this.size,
        };
        user.getUserList(params).then((res) => {
          this.tableData = res.data.result.data.records;
          this.size = res.data.result.data.size;
          this.current = res.data.result.data.current;
          this.total = res.data.result.data.total;
        });
      },

      // 获取用户列表 End

      // 获取选中的行数据 Start
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
        console.log("勾选的值", val);
        this.multipleSelection = val;
        this.delBtlState = val.length == 0;
        this.permMoreBtlState = val.length == 0;
      },
      // 获取选中的行数据 End

      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.size = val;
        this.getUserList();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.current = val;
        this.getUserList();
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogVisible = false;
        this.editForm = {};
      },
      handleClose() {
        this.resetForm("editForm");
      },
      moreHandClose() {
        this.moreDialogVisible = false;
      },

      // 用户自定义上传Excel Start
      uploadExcel(param) {
        const formData = new FormData();
        formData.append("file", param.file);
        user.uploadExcel(formData).then((res) => {
          this.moreDialogVisible = false;
          this.$message({
            showClose: true,
            duration: 2000,
            message: "导入成功",
            type: "success",
            onClose: () => {
              this.getUserList();
            },
          });
        });
      },
      submitExcel() {
        this.$refs.upload.submit();
      },
      // 用户自定义上传Excel END

      // 导出当前所有用户Excel Start
      exportExcel() {
        user.exportExcel()
          .then((res) => {
            const blob = new Blob([res.data]);
            const blobURL = window.URL.createObjectURL(blob);
            const tmpLink = document.createElement("a");
            tmpLink.style.display = "none";
            tmpLink.href = blobURL;
            tmpLink.setAttribute("download", "平台用户文件.xlsx");
            document.body.appendChild(tmpLink);
            tmpLink.click();
            document.body.removeChild(tmpLink);
          })
          .catch((error) => {
            console.log(error);
          });
      },
      // 导出当前所有用户Excel End

      // 导出Excel上传模板 Start
      exportModelExcel() {
        user.exportModelExcel()
          .then((res) => {
            const blob = new Blob([res.data]);
            const blobURL = window.URL.createObjectURL(blob);
            const tmpLink = document.createElement("a");
            tmpLink.style.display = "none";
            tmpLink.href = blobURL;
            tmpLink.setAttribute("download", "上传用户模板文件.xlsx");
            document.body.appendChild(tmpLink);
            tmpLink.click();
            document.body.removeChild(tmpLink);
          })
          .catch((error) => {
            console.log(error);
          });
      },
      // 导出Excel上传模板 END

      // 增加或修改用户 Start
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            user.submitForm(this.editForm, this.editForm.id).then((res) => {
              this.$message({
                showClose: true,
                duration: 2000,
                message: "操作成功",
                type: "success",
                onClose: () => {
                  this.getUserList();
                },
              });
              this.dialogVisible = false;
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      // 增加或修改用户 End

      // 编辑用户 Start
      editHandle(id) {
        user.editUserInfo(id).then((res) => {
          this.editForm = res.data.result.data;
          this.dialogVisible = true;
        });
      },
      // 编辑用户 End

      // 删除或批量删除用户 Start
      delHandle(id) {
        var ids = [];
        if (id) {
          ids.push(id);
        } else {
          this.multipleSelection.forEach((row) => {
            ids.push(row.id);
          });
        }
        console.log(ids);
        user.delHandle(ids).then((res) => {
          this.$message({
            showClose: true,
            duration: 2000,
            message: "删除成功",
            type: "success",
            onClose: () => {
              this.getUserList();
            },
          });
        });
      },
      // 删除或批量删除用户 End

      // 批量分配角色 Start
      roleMoreHandle() {
        this.roleMoreDialogFormVisible = true;
      },
      submitMoreRoleHandle(formName) {
        var userIds = [];
        this.multipleSelection.forEach((row) => {
          userIds.push(row.id);
        });

        var roleIds = this.$refs.roleMoreTree.getCheckedKeys();

        user.roleMoreHandle(roleIds, userIds).then((res) => {
          this.$message({
            showClose: true,
            duration: 2000,
            message: "批量分配成功",
            type: "success",
            onClose: () => {
              this.getUserList();
              this.$refs.roleMoreTree.setCheckedKeys([]);
            },
          });
          this.roleMoreDialogFormVisible = false;
        });
      },
      // 批量分配角色 End

      // 根据用户id回显角色信息 Start
      roleHandle(id) {
        this.roleDialogFormVisible = true;
        user.editUserInfo(id).then((res) => {
          this.roleForm = res.data.result.data;
          let roleIds = [];
          this.roleForm.roles.forEach((row) => {
            roleIds.push(row.id);
          });
          this.$refs.roleTree.setCheckedKeys(roleIds);
        });
      },
      // 回显角色 End

      // 分配角色 Start
      submitRoleHandle(formName) {
        var roleIds = this.$refs.roleTree.getCheckedKeys();
        console.log(roleIds);
        user.submitRoleHandle(roleIds, this.roleForm.id).then((res) => {
          this.$message({
            showClose: true,
            duration: 2000,
            message: "操作成功",
            type: "success",
            onClose: () => {
              this.getUserList();
            },
          });
          this.roleDialogFormVisible = false;
        });
      },
      // 分配角色 End

      // 重置密码 Start
      repassHandle(id, username) {
        this.$confirm(
          "将重置用户[ " + username + " ]的密码, 是否继续?",
          "重置密码", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(() => {
          user.repassPassword(id).then((res) => {
            this.$message({
              showClose: true,
              duration: 2000,
              message: "重置密码成功",
              type: "success",
              onClose: () => {},
            });
          });
        });
      },
      // 重置密码 End
    },
  };
</script>

<style lang="less" scoped>
  .el-pagination {
    float: right;
    margin-top: 22px;
  }

  .downloadModel {
    margin-top: 5%;
    margin-left: 17%;
  }
</style>