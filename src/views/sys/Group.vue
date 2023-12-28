<template>
  <div class="page">
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="searchForm.groupName" placeholder="请输入部门名" clearable>
        </el-input>
      </el-form-item>
      <!-- <el-form-item label="">
        <el-select v-model="searchForm.state" placeholder="请选择岗位状态">
          <div v-for="(item,index) in stateOption" :key="index">
            <el-option :label="item.name" :value="item.value"></el-option>
          </div>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getStudentList">查询</el-button>
        <el-button type="primary" icon="el-icon-folder-add" @click="insertOrUpdate">新增部门</el-button>
        <el-button type="primary" icon="el-icon-plus">新增团队</el-button>
      </el-form-item>
    </el-form>

    <el-table highlight-current-row :data="tableData" style="width: 100%; margin-bottom: 20px" row-key="id" border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column prop="name" label="名称" sortable width="180">
      </el-table-column>

      <el-table-column prop="state" label="状态" align="center" width="160">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.state === 0" type="success">正常</el-tag>
          <el-tag size="small" v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="remark" label="备注">
      </el-table-column>

      <el-table-column prop="createTime" :formatter="formatDate" label="创建时间">
      </el-table-column>

      <el-table-column prop="updateTime" :formatter="formatDate" label="更新时间">
      </el-table-column>

      <el-table-column prop="icon" label="操作" width="250px">
        <template slot-scope="scope">
          <el-button type="text" @click="bindJob(scope.row.id)"><i class="el-icon-connection"></i> 关联岗位</el-button>

          <el-divider direction="vertical"></el-divider>

          <el-button type="text" @click="insertOrUpdate(scope.row.id)"><i class="el-icon-edit"></i> 编辑</el-button>

          <el-divider direction="vertical"></el-divider>

          <template>
            <el-popconfirm title="确定要删除吗？" @confirm="deleteGroup(scope.row.id)">
              <el-button type="text" slot="reference"><i class="el-icon-delete"></i> 删除</el-button>
            </el-popconfirm>
          </template>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog :title="title" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">
      <el-form :model="editForm" :rules="FormRules" ref="editForm">
        <el-form-item label="部门名称" prop="name" label-width="100px">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上一级部门" prop="parentId" label-width="100px">
          <el-select v-model="editForm.parentId" placeholder="请选择部门">
            <div v-for="(item,index) in parentGroup" :key="index">
              <el-option :label="item.name" :value="item.id"></el-option>
            </div>
          </el-select>
        </el-form-item>

        <el-form-item label="状态" prop="state" label-width="100px">
          <el-radio-group v-model="editForm.state">
            <el-radio v-for="(item,index) in this.dictobject.sys_state" :key="index" :label="item.dictValue">{{ item.dictKey }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" label-width="100px">
          <el-input v-model="editForm.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="resetForm('editForm')">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="600px">
      <el-form :model="bindForm" ref="bindForm">
        <el-form-item label="部门名称" label-width="100px">
          <el-input disabled v-model="bindForm.group.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择岗位" prop="jobId" label-width="100px">
          <el-select v-model="bindForm.params.jobId" placeholder="请选择岗位">
            <div v-for="(item,index) in bindForm.job" :key="index">
              <el-option :label="item.name" :value="item.id"></el-option>
            </div>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="bind">确 定</el-button>
        <el-button @click="this.dialogFormVisible = false;">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import group from "@/api/sys/group";
  import job from "@/api/sys/job";
  import moment from "moment";
  import dictData from "@/api/sys/dictData";
  export default {
    name: "Group",
    data() {
      return {
        dicts: ['sys_state'],
        dictobject: {},
        searchForm: {
          groupName: ""
        },
        tableData: [],
        FormRules: {
          name: [{
            required: true,
            message: "请输入岗位名称",
            trigger: "blur",
          }, ],
          parentId: [{
            required: true,
            message: "请选择上级部门",
            trigger: "blur",
          }, ],
          state: [{
            required: true,
            message: "请选择状态",
            trigger: "blur",
          }, ],
        },
        editForm: {
          id: "",
          parentId: "",
          name: "",
          state: 0,
          remark: ""
        },
        bindForm: {
          group: "",
          job: "",
          params: {
            groupId: "",
            jobId: ""
          }
        },
        parentGroup: {},
        jobGroup: {},
        dialogVisible: false,
        dialogFormVisible: false,
        title: ""
      };
    },
    created() {
      this.getStudentList();
      this.getDictCache(this.dicts)
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
      getStudentList() {
        let param = {
          name:this.searchForm.groupName
        }
        group.getGroupList(param).then((res) => {
          this.tableData = res.data.result.data;
        });
      },
      bindJob(id) {
        this.dialogFormVisible = true;
        if (id) {
          this.title = "关联岗位"
          this.bindForm.params.groupId = id
          let param = {
            name: ""
          }
          group.getGroupById(id).then((res) => {
            this.bindForm.group = res.data.result.data
          })
          job.getJobList(param).then((res) => {
            this.bindForm.job = res.data.result.data;
          });
        }
      },
      insertOrUpdate(id) {
        this.dialogVisible = true;
        group.getGroupParent().then((res) => {
          this.parentGroup = res.data.result.data;
          this.parentGroup.unshift({
            id: 0,
            name: "无"
          })
        });
        if (id) {
          this.title = "修改部门信息"
          group.getGroupById(id).then((res) => {
            this.editForm = res.data.result.data
          })
        } else {
          this.title = "新增部门"
        }
      },

      //获取字典缓存数据
      getDictCache(dicts) {
        dictData.getCacheData(dicts).then((res) => {
          for(const key in res.data.result.data){
            this.$set(this.dictobject,key,res.data.result.data[key])
          }
        })
      },
      bind() {
        group.bindJob(this.bindForm.params).then((res) => {
          this.handleClose();
          this.getStudentList();
          this.$message({
            message: res.data.message,
            type: 'success'
          });
        })
      },
      submitForm() {
        if (this.editForm.id) {
          group.updateGroup(this.editForm).then((res) => {
            this.handleClose();
            this.getStudentList();
            this.$message({
              message: res.data.message,
              type: 'success'
            });
          })
        } else {
          group.insertGroup(this.editForm).then((res) => {
            this.handleClose();
            this.getStudentList();
            this.$message({
              message: res.data.message,
              type: 'success'
            });
          })
        }
      },
      deleteGroup(id) {
        group.deleteGroup(id).then((res) => {
          this.handleClose();
          this.getStudentList();
          this.$message({
            message: res.data.message,
            type: 'success'
          });
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogVisible = false;
        this.editForm = {};
      },
      handleClose() {
        this.resetForm("editForm");
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