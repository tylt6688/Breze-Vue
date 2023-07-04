<template>
  <div class="page">
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="searchForm.jobName" placeholder="请输入岗位名" clearable>
        </el-input>

      </el-form-item>
      <el-form-item label="">
        <el-select v-model="searchForm.state" placeholder="请选择岗位状态">
          <div v-for="(item,index) in stateOption" :key="index">
            <el-option :label="item.name" :value="item.value"></el-option>
          </div>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getJobPageList">查询</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="insertAndUpdate(null)">新增岗位</el-button>
      </el-form-item>
    </el-form>

    <el-table highlight-current-row :data="tableData" style="width: 100%; margin-bottom: 20px" row-key="id" border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column type="selection" width="50" align="center">
      </el-table-column>
      <el-table-column prop="name" label="岗位名称" sortable width="180">
      </el-table-column>

      <el-table-column prop="state" label="状态" align="center" width="160">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.state === 0" type="success">正常</el-tag>
          <el-tag size="small" v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="remark" label="备注"> </el-table-column>

      <el-table-column prop="createTime" :formatter="formatDate" label="创建时间"> </el-table-column>

      <el-table-column prop="updateTime" :formatter="formatDate" label="更新时间"> </el-table-column>

      <el-table-column prop="icon" label="操作" width="150px">
        <template slot-scope="scope">

          <el-button type="text" @click="insertAndUpdate(scope.row.id)"><i class="el-icon-edit"></i> 编辑</el-button>

          <el-divider direction="vertical"></el-divider>

          <template>
            <el-popconfirm title="确定要删除吗？" @confirm="deleteJob(scope.row.id)">
              <el-button type="text" slot="reference"><i class="el-icon-delete"></i> 删除</el-button>
            </el-popconfirm>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">
      <el-form :model="editForm" :rules="FormRules" ref="editForm">
        <el-form-item label="岗位名称" prop="name" label-width="100px">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="state" label-width="100px">
          <el-radio-group v-model="editForm.state">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" label-width="100px">
          <el-input v-model="editForm.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitJob">确 定</el-button>
        <el-button @click="resetForm('editForm')">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import job from "@/api/sys/job";
  import moment from "moment";
  export default {
    name: "Job",
    data() {
      return {
        searchForm: {
          jobName: ""
        },
        tableData: [],
        stateOption: [{
            name: "正常",
            value: 0
          },
          {
            name: "禁用",
            value: 1
          }
        ],
        FormRules: {
          name: [{
            required: true,
            message: "请输入岗位名称",
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
          name: "",
          state: 0,
          remark: ""
        },
        dialogVisible: false,
        title: ""
      };
    },
    created() {
      this.getJobPageList();
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
      getJobPageList() {
        let param = {
          name:this.searchForm.jobName
        }
        job.getJobList(param).then((res) => {
          this.tableData = res.data.result.data;
        });
      },
      insertAndUpdate(id) {
        this.dialogVisible = true
        if (id) {
          this.title = "修改岗位信息"
          job.getJobById(id).then((res) => {
            this.editForm = res.data.result.data;
          })
        } else {
          this.title = "新增岗位"
        }
      },
      submitJob() {
        if (this.editForm.id) {
          job.editJob(this.editForm).then((res) => {
            this.handleClose();
            this.getJobPageList();
            this.$message({
              message: res.data.message,
              type: 'success'
            });
          })
        } else {
          job.insertJob(this.editForm).then((res) => {
            this.handleClose();
            this.getJobPageList();
            this.$message({
              message: res.data.message,
              type: 'success'
            });
          })
        }
      },
      deleteJob(id) {
        job.deleteJob(id).then((res) => {
          this.$message({
            message: res.data.message,
            type: 'success'
          });
          this.getJobPageList();
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