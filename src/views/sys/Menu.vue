<template>
  <div class="page">
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" @click="dialogDirVisible = true" icon="el-icon-folder-add">新增目录</el-button>
        <el-button type="primary" @click="dialogVisible = true" icon="el-icon-plus">新增组件</el-button>
      </el-form-item>
    </el-form>

    <el-table highlight-current-row :data="tableData" style="width: 100%; margin-bottom: 20px" row-key="id" border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column prop="title" label="名称" sortable width="180">
      </el-table-column>

      <el-table-column prop="perms" label="权限编码" sortable width="200">
      </el-table-column>

      <el-table-column prop="icon" label="图标" align="center">
        <template slot-scope="scope">
          <i style="font-size: 25px" :class="scope.row.icon"></i>
        </template>
      </el-table-column>

      <el-table-column prop="type" label="类型" align="center">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.type === 0">目录</el-tag>
          <el-tag size="small" v-else-if="scope.row.type === 1" type="success">菜单</el-tag>
          <el-tag size="small" v-else-if="scope.row.type === 2" type="info">按钮</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="path" label="菜单URL">
        <template slot-scope="scope">
          <el-link type="primary">{{ scope.row.path }}</el-link>
        </template>
      </el-table-column>

      <el-table-column prop="component" label="页面组件"> </el-table-column>

      <el-table-column prop="sort" sortable label="排序号" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type===0">{{scope.row.sort}}</el-tag>
          <el-tag v-else-if="scope.row.type===1" type="success">{{scope.row.sort}}</el-tag>
          <el-tag v-else type="info">{{scope.row.sort}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="state" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.state === 0" type="success">正常</el-tag>
          <el-tag size="small" v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="icon" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="editHandle(scope.row.id)"><i class="el-icon-edit"></i> 编辑</el-button>

          <el-divider direction="vertical"></el-divider>

          <template>
            <el-popconfirm title="确定要删除吗？" @confirm="delHandle(scope.row.id)">
              <el-button type="text" slot="reference"><i class="el-icon-delete"></i> 删除</el-button>
            </el-popconfirm>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!--新增目录对话框-->
    <el-dialog title="新增目录" :visible.sync="dialogDirVisible" width="600px" :before-close="handleClose">
      <el-form :model="editForm" :rules="editDirFormRules" ref="editForm" label-width="100px" class="demo-editForm">
        <el-form-item label="目录名称" prop="title" label-width="100px">
          <el-input v-model="editForm.title" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="权限编码" prop="perms" label-width="100px">
          <el-input v-model="editForm.perms" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="图标" prop="icon" label-width="100px">
          <e-icon-picker v-model="editForm.icon" placement="bottom" />
        </el-form-item>

        <el-form-item label="状态" prop="state" label-width="100px">
          <el-radio-group v-model="editForm.state">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="序号" prop="orderNum" label-width="100px">
          <el-input-number v-model="editForm.orderNum" :min="1" label="序号">1</el-input-number>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--新增二级菜单以及编辑对话框-->
    <el-dialog title="新增编辑" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">
        <el-form-item v-if="editForm.type != 0" label="上级菜单" prop="parentId">
          <el-select v-model="editForm.parentId" placeholder="请选择上级菜单">
            <template v-for="(item, index) in tableData">
              <el-option :label="item.title" :value="item.id"></el-option>
              <template v-for="(child, index) in item.children">
                <el-option :label="child.title" :value="child.id">
                  <span>{{ "- " + child.title }}</span>
                </el-option>
              </template>
            </template>
          </el-select>
        </el-form-item>

        <el-form-item label="组件名称" prop="title" label-width="100px">
          <el-input v-model="editForm.title" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="权限编码" prop="perms" label-width="100px">
          <el-input v-model="editForm.perms" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="图标" prop="icon" label-width="100px">
          <e-icon-picker v-model="editForm.icon" placement="bottom" />
        </el-form-item>

        <el-form-item v-if="editForm.type === 1" label="菜单URL" prop="path" label-width="100px">
          <el-input v-model="editForm.path" autocomplete="off"></el-input>
          <el-alert title="只有类型为菜单时为必填项，用于页面路径跳转" :closable="false" type="info" style="line-height: 12px">
          </el-alert>
        </el-form-item>

        <el-form-item v-if="editForm.type === 1" label="菜单组件" prop="component" label-width="100px">
          <el-input v-model="editForm.component" autocomplete="off"></el-input>
          <el-alert title="只有类型为菜单时为必填项，用于页面组件生成" :closable="false" type="info" style="line-height: 12px">
          </el-alert>
        </el-form-item>

        <el-form-item label="类型" prop="type" label-width="100px">
          <el-radio-group v-model="editForm.type">
            <el-radio v-for="(item,index) in this.dictobject.sys_menu_type" :key="index" :label="item.dictValue">{{ item.dictKey }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="状态" prop="state" label-width="100px">
          <el-radio-group v-model="editForm.state">
            <el-radio v-for="(item,index) in this.dictobject.sys_state" :key="index" :label="item.dictValue">{{ item.dictKey }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="排序号" prop="orderNum" label-width="100px">
          <el-input-number v-model="editForm.orderNum" :min="1" label="排序号"></el-input-number>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import menu from "@/api/sys/menu";
  import dictData from "@/api/sys/dictData";
  export default {
    name: "Menu",
    data() {
      return {
        dicts: ['sys_state','sys_menu_type'],
        dictobject: {},

        tableData: [],
        editForm: {
          orderNum: 1,
          state: 0
        },

        dialogVisible: false,
        dialogDirVisible: false,

        editDirFormRules: {
          name: [{
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }],
          perms: [{
            required: true,
            message: "请输入权限编码",
            trigger: "blur"
          }],

          orderNum: [{
            required: true,
            message: "请填入排序号",
            trigger: "blur"
          }],
          state: [{
            required: true,
            message: "请选择状态",
            trigger: "blur"
          }],
        },

        editFormRules: {
          parentId: [{
            required: true,
            message: "请选择上级菜单",
            trigger: "blur"
          }],
          name: [{
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }],
          perms: [{
            required: true,
            message: "请输入权限编码",
            trigger: "blur"
          }],
          type: [{
            required: true,
            message: "请选择状态",
            trigger: "blur"
          }],
          orderNum: [{
            required: true,
            message: "请填入排序号",
            trigger: "blur"
          }],
          state: [{
            required: true,
            message: "请选择状态",
            trigger: "blur"
          }],
        },
      };
    },
    created() {
      this.getMenuTree();
      this.getDcitCache(this.dicts)
    },
    methods: {
      // 获取菜单树 Start
      getMenuTree() {
        menu.getMenuTree().then((res) => {
          this.tableData = res.data.result.data;
        });
      },
      // 获取菜单树 End

      //获取字典缓存数据
      getDcitCache(dicts) {
        dictData.getCacheData(dicts).then((res) => {
          for(const key in res.data.result.data){
            this.$set(this.dictobject,key,res.data.result.data[key])
          }
        })
      },

      // 新增菜单 Start
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (!this.editForm.parentId) {
              this.editForm.parentId = 0;
              this.editForm.type = 0;
            }
            menu.submitMenuForm(this.editForm, this.editForm.id).then((res) => {
              this.$message({
                showClose: true,
                duration: 2000,
                message: "操作成功",
                type: "success",
                onClose: () => {
                  this.getMenuTree();
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
      // 新增菜单 End

      // 回显菜单组件信息 Start
      editHandle(id) {
        menu.editHandle(id).then((res) => {
          //进行已存在信息的表单回显
          this.dialogVisible = true;
          this.editForm = res.data.result.data;
        });
      },
      // 回显菜单组件信息 End

      //重新设置编辑模态框为空
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.editForm = {};
      },
      //表单关闭后进行重置
      handleClose() {
        this.dialogVisible = false;
        this.dialogDirVisible = false;
        this.resetForm("editForm");
      },

      // 删除菜单 Start
      delHandle(id) {
        menu.delHandle(id).then((res) => {
          this.$message({
            showClose: true,
            duration: 2000,
            message: "删除成功",
            type: "success",
            onClose: () => {
              this.getMenuTree();
            },
          });
        });
      },
      // 删除菜单 End
    },
  };
</script>


<style scoped>
</style>