<template>
  <div class="page">
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" icon="el-icon-folder-add">新增学院</el-button>
        <el-button type="primary" icon="el-icon-plus">新增系部</el-button>
      </el-form-item>
    </el-form>

    <el-table
      highlight-current-row
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="name" label="名称" sortable width="180">
      </el-table-column>

      <el-table-column prop="created" label="创建时间"> </el-table-column>

      <el-table-column prop="remark" label="备注"> </el-table-column>

      <el-table-column prop="update" label="更新时间"> </el-table-column>

      <el-table-column prop="icon" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button type="text" @click="editHandle(scope.row.id)"
            ><i class="el-icon-edit"></i> 编辑</el-button
          >

          <el-divider direction="vertical"></el-divider>

          <template>
            <el-popconfirm
              title="确定要删除吗？"
              @confirm="delHandle(scope.row.id)"
            >
              <el-button type="text" slot="reference"
                ><i class="el-icon-delete"></i> 删除</el-button
              >
            </el-popconfirm>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import department from "@/api/sys/department";
export default {
  name: "Department",
  data() {
    return {
      tableData: [],
    };
  },
  created() {
    this.getStudentList();
  },
  methods: {
    getStudentList() {
      department.getUserInfo().then((res) => {
        this.tableData = res.data.result.data;
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