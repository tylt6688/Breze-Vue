<template>
  <div class="page">
    <el-header>
      <el-form :inline="true">
        <el-form-item label="字典名称">
          <el-input v-model="searchForm.dictName" placeholder="请输入字典名称"></el-input>
        </el-form-item>
        <el-form-item label="字典类型">
          <el-input v-model="searchForm.dictType" placeholder="请输入字典类型"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDictPage()" icon="el-icon-search">
            搜索
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="insertDict()" icon="el-icon-plus">
            新增字典
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="excelDialogVisible = true" icon="el-icon-upload2">
            导入
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="info" @click="exportExcel" icon="el-icon-download">
            导出
          </el-button>
        </el-form-item>

      </el-form>
    </el-header>
    <el-main>
      <el-table :data="dictList" style="width: 100%" row-key="id" ref="table" border
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column prop="name" label="字典名称" align="center">
        </el-table-column>
        <el-table-column prop="type" label="字典类型" align="center">
          <template slot-scope="scope">
            <el-link type="primary" @click="toDictDataPage(scope.row)">{{scope.row.type}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.state === 0" type="success">正常</el-tag>
            <el-tag size="small" v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="remark" label="备注" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" :formatter="formatDate" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="icon" label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="editDictForm(scope.row)" icon="el-icon-edit">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <template>
              <el-popconfirm title="确定删除此内容吗?" @confirm="deleteDict(scope.row)">
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
    <el-dialog :title="title" :visible.sync="dialogVisible" width="500px" :before-close="handleClose">
      <el-form ref="editForm" :model="editForm" :rules="editFormRules">
        <el-form-item label="字典名称" prop="name" label-width="100px">
          <el-input v-model="editForm.name" autocomplete="off" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="字典类型" label-width="100px" prop="type">
          <el-input v-model="editForm.type" autocomplete="off" :disabled="inputDisable" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state" label-width="100px">
          <el-radio-group v-model="editForm.state" style="width:300px">
            <el-radio v-for="(item,index) in this.dictobject.sys_state" :key="index" :label="item.dictValue">{{ item.dictKey }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" label-width="100px">
          <el-input type="textarea" v-model="editForm.remark" rows="3" style="width:300px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
        <el-button @click="resetForm('editForm')">取 消</el-button>
      </div>
    </el-dialog>
    <!--编辑主体内容模态框 End-->

    <!--导入excel模态框 Start-->
    <el-dialog title="上传文件" :visible.sync="excelDialogVisible" width="500px" :before-close="handCloseUplod">
      <el-button type="primary" round @click="exportModelExcel" style="margin-bottom:3%">下载 Excel 导入模板</el-button>
      <el-upload ref="upload" style="text-align: center" action="url" drag :http-request="importExcel" multiple
        accept=".xlsx,.xls" :limit="1" :auto-upload="false">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitExcel()">确 定</el-button>
        <el-button @click="handCloseUplod">取 消</el-button>
      </div>
    </el-dialog>
    <!--导入excel模态框 End-->
  </div>

</template>

<script>
  import dict from "@/api/sys/dict";
  import moment from "moment";
  import dictData from '@/api/sys/dictData';
  export default {
    name: "Dict",
    data() {
      return {
        dicts: ['sys_state'],
        dictobject: {},
        // 分页数据
        total: 0,
        current: 1,
        size: 10,

        searchForm: {
          dictName: "",
          dictType: ""
        },
        multipleSelection: [],
        dialogVisible: false,
        excelDialogVisible: false,
        inputDisable: false,

        dictList: [],

        editForm: {
          state: 0
        },
        title: "",
        //表单规则
        editFormRules: {
          name: [{
            required: true,
            message: "请输入字典名称",
            trigger: "blur",
          }, ],
          type: [{
            required: true,
            message: "请输入字典类型",
            trigger: "blur",
          }, ],
          state: [{
            required: true,
            message: "请确定状态",
            trigger: "blur",
          }, ],
        },
      };
    },
    created() {},
    mounted() {
      this.getDictPage();
      this.getDcitCache(this.dicts)
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

      // 获取字典类型分页数据 
      getDictPage() {
        let params = {
          dictName: this.searchForm.dictName,
          dictType: this.searchForm.dictType,
          current: this.current,
          size: this.size,
        };
        dict.getDictPageList(params).then((res) => {
          this.dictList = res.data.result.data.records
          this.total = res.data.result.data.total
          console.log(res.data)
        });
      },

      getDcitCache(dicts) {
        dictData.getCacheData(dicts).then((res) => {
          for(const key in res.data.result.data){
            this.$set(this.dictobject,key,res.data.result.data[key])
          }

        })
      },
      // 新增按钮调用
      insertDict() {
        this.title = "添加字典";
        this.dialogVisible = true;
      },
      // 编辑按钮调用
      editDictForm(row) {
        this.title = "修改字典"
        this.dialogVisible = true;
        this.inputDisable = true
        dict.getDictInfo(row.id).then(res => {
          this.editForm = res.data.result.data;
        })

      },
      // 新增或编辑提交处理
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.editForm)
            dict.submitDictForm(this.editForm).then((res) => {
              this.$message({
                showClose: true,
                duration: 2000,
                message: res.data.message,
                type: "success",
                onClose: () => {
                  this.getDictPage();
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

      // 删除单一字典类型
      deleteDict(row) {
        dict.deleteDictInfo(row.id).then((res) => {
          this.$message({
            showClose: true,
            duration: 2000,
            message: res.data.message,
            type: "success",
            onClose: () => {
              this.getDictPage();
            },
          })

        }).catch(error => {
          this.$message({
            showClose: true,
            duration: 2000,
            message: error.response.data.message,
            type: "error",
          });
        });
      },
      //导入excel确认
      submitExcel() {
        this.$refs.upload.submit();
      },
      //导入excel处理
      importExcel(param) {
        const formData = new FormData();
        console.log("formdata", typeof formData)
        formData.append("file", param.file);
        dict.importExcel(formData).then((res) => {
          this.$message({
            showClose: true,
            duration: 2000,
            message: res.data.message,
            type: "success",
            onClose: () => {
              this.getDictPage();
            },
          });
          this.handCloseUplod()
        });
      },
      // 下载excel模板
      exportModelExcel() {
        dict.exportModelExcel()
          .then((res) => {
            const blob = new Blob([res.data]);
            const blobURL = window.URL.createObjectURL(blob);
            const tmpLink = document.createElement("a");
            tmpLink.style.display = "none";
            tmpLink.href = blobURL;
            tmpLink.setAttribute("download", "数据字典模板.xlsx");
            document.body.appendChild(tmpLink);
            tmpLink.click();
            document.body.removeChild(tmpLink);
            this.handCloseUplod()
          })
          .catch((error) => {
            console.log(error);
          });
      },
      exportExcel() {
        dict.exportExcel().then((res) => {
          console.log("sdgsdg", res)
          const blob = new Blob([res.data]);
          const blobURL = window.URL.createObjectURL(blob);
          const tmpLink = document.createElement("a");
          tmpLink.style.display = "none";
          tmpLink.href = blobURL;
          tmpLink.setAttribute("download", "数据字典.xlsx");
          document.body.appendChild(tmpLink);
          tmpLink.click();
          document.body.removeChild(tmpLink);
        })
      },
      toDictDataPage(row) {
        localStorage.setItem("dict", JSON.stringify({
          "name": row.name,
          "type": row.type
        }))
        this.$router.push({
          path: "/dictData"
        })
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
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
      // 导入模态框关闭
      handCloseUplod() {
        this.excelDialogVisible = false;
        this.$refs.upload.clearFiles()
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