<template>
  <div class="page">
    <el-header>
      <el-form :inline="true">
        <el-form-item label="字典名称">
          <el-select v-model="searchForm.dictName"  placeholder="请选择字典类型">
            <el-option v-for="item in typeOptions" :key="item.type" :label="item.name" :value="item.type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.state" placeholder="请选择数据状态">
            <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDictDataPage()" icon="el-icon-search">
            搜索
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="insertDictData()" icon="el-icon-plus">
            添加数据
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
        <!-- <el-form-item>
          <el-button
          type="warning"
          plain
          icon="el-icon-close"
          size="mini"
          @click="handleClosetab"
        >关闭</el-button>
        </el-form-item> -->

      </el-form>
    </el-header>
    <el-main>
      <el-table :data="dictDataList" style="width: 100%" row-key="id" ref="table" border
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column prop="dictKey" label="字典标签" align="center">
        </el-table-column>
        <el-table-column prop="dictValue" label="字典值" align="center">
        </el-table-column>
        <el-table-column prop="sort" label="字典排序" align="center">
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
            <el-button type="text" @click="editFormData(scope.row)" icon="el-icon-edit">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <template>
              <el-popconfirm title="确定删除此内容吗?" @confirm="deleteDictData(scope.row)">
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
        <el-form-item label="字典类型" label-width="100px">
          <el-input v-model="editForm.dictType" autocomplete="off" :disabled="true" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="字典标签" label-width="100px" prop="dictKey">
          <el-input v-model="editForm.dictKey" autocomplete="off" style="width:300px" placeholder="请输入字典标签"></el-input>
        </el-form-item>
        <el-form-item label="字典值" label-width="100px" prop="dictValue">
          <el-input v-model="editForm.dictValue" autocomplete="off" style="width:300px" placeholder="请输入字典值"></el-input>
        </el-form-item>
        <el-form-item label="显示排序" label-width="100px" prop="sort">
          <el-input-number v-model="editForm.sort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="样式属性" label-width="100px" prop="valueClass">
          <el-select v-model="editForm.valueClass">
            <el-option v-for="item in valueClassOptions" :key="item.value" :label="item.label + '(' + item.value + ')'"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="state" label-width="100px">
          <el-radio-group v-model="editForm.state" style="width:300px">
            <el-radio v-for="(item,index) in this.dictobject.sys_state" :key="index" :label="item.dictValue">{{ item.dictKey }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" label-width="100px">
          <el-input type="textarea" v-model="editForm.remark" rows="3" style="width:300px" placeholder="请输入备注信息">
          </el-input>
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
  import dictData from "@/api/sys/dictData";
  import dict from "@/api/sys/dict";
  import moment from "moment";
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

        count: "",

        searchForm: {
          dictName: "",
          state: ""
        },

        type: "",
        name: "",
        // 默认字典类型
        defaultDictType: "",

        typeOptions: [],

        dictType: '',
        multipleSelection: [],
        dialogVisible: false,
        excelDialogVisible:false,

        dictDataList: [],
        editForm: {

        },
        title: "",
        //表单规则
        editFormRules: {
          dictKey: [{
            required: true,
            message: "请输入字典标签",
            trigger: "blur",
          }, ],
          dictValue: [{
            required: true,
            message: "请输入字典键值",
            trigger: "blur",
          }, ],
          sort: [{
            required: true,
            message: "数据顺序不能为空",
            trigger: "blur"
          }],
          valueClass: [{
            required: true,
            message: "请选择样式类型",
            trigger: "change",
          }, ],
          state: [{
            required: true,
            message: '请选择状态',
            trigger: 'change'
          }],
          remark: [{
            required: true,
            message: "请输入备注信息",
            trigger: "blur",
          }, ],

        },
        valueClassOptions: [{
            value: "default",
            label: "默认"
          },
          {
            value: "primary",
            label: "主要"
          },
          {
            value: "success",
            label: "成功"
          },
          {
            value: "info",
            label: "信息"
          },
          {
            value: "warning",
            label: "警告"
          },
          {
            value: "danger",
            label: "危险"
          }
        ],

        parentSelectorList: [],
      };
    },
    created() {
      const dict = JSON.parse(localStorage.getItem("dict"))
      this.searchForm.dictName = dict.type
    },
    mounted() {
      this.getDictDataPage();
      this.getDictSelectList()
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
      // 获取导航菜单列表 
      getDictDataPage() {
        let params = {
          dictType: this.searchForm.dictName,
          state: this.searchForm.state,
          current: this.current,
          size: this.size,
        };
        console.log("searchFowm", this.dictType)
        dictData.getDictDataPageList(params).then((res) => {
          this.dictDataList = res.data.result.data.records
          this.total = res.data.result.data.total
          console.log("ressdfs", res.data)
          this.reset()
        });
      },
      getDictSelectList() {
        dict.getDictSelectList().then((res) => {
          this.typeOptions = res.data.result.data;
        });
      },
       //获取字典缓存数据
       getDcitCache(dicts) {
        dictData.getCacheData(dicts).then((res) => {
          for(const key in res.data.result.data){
            this.$set(this.dictobject,key,res.data.result.data[key])
          }

        })
      },
      // 新增按钮调用
      insertDictData() {
        this.reset()
        this.title = "新增字典数据";
        this.dialogVisible = true;
      },
      // 编辑按钮调用
      editFormData(row) {
        this.reset()
        this.title = "编辑字典数据"
        this.dialogVisible = true;
        dictData.getDiceDataInfo(row.id).then(res => {
          this.editForm = res.data.result.data;
          console.log("dictData",res.data)
        })

      },
      // 新增或编辑
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            dictData.submitDictDataForm(this.editForm).then((res) => {
              this.$message({
                showClose: true,
                duration: 2000,
                message: res.data.message,
                type: "success",
                onClose: () => {
                  this.getDictDataPage();
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
      deleteDictData(row) {
        dictData.deleteDictData(row.id).then((res) => {
          this.$message({
            showClose: true,
            duration: 2000,
            message: res.data.message,
            type: "success",
            onClose: () => {
              this.getDictDataPage();
            },
          });
        });
      },
      reset() {
        this.editForm = {
          dictType: this.searchForm.dictName,
          dictKey: undefined,
          dictValue: undefined,
          valueClass: 'default',
          state: 0,
          sort: 0,
          remark: undefined
        }
      },
      //导入excel确认
      submitExcel() {
        this.$refs.upload.submit();
      },
      //导入excel处理
      importExcel(param) {
        const formData = new FormData();
        formData.append("file", param.file);
        dictData.importExcel(formData).then((res) => {
          this.$message({
            showClose: true,
            duration: 2000,
            message: res.data.message,
            type: "success",
            onClose: () => {
              this.getDictDataPage();
            },
          });
          this.handCloseUplod()
        });
      },
      // 下载excel模板
      exportModelExcel() {
        dictData.exportModelExcel()
          .then((res) => {
            const blob = new Blob([res.data]);
            const blobURL = window.URL.createObjectURL(blob);
            const tmpLink = document.createElement("a");
            tmpLink.style.display = "none";
            tmpLink.href = blobURL;
            tmpLink.setAttribute("download", "字典数据模板.xlsx");
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
        dictData.exportExcel().then((res) => {
          const blob = new Blob([res.data]);
          const blobURL = window.URL.createObjectURL(blob);
          const tmpLink = document.createElement("a");
          tmpLink.style.display = "none";
          tmpLink.href = blobURL;
          tmpLink.setAttribute("download", "字典数据.xlsx");
          document.body.appendChild(tmpLink);
          tmpLink.click();
          document.body.removeChild(tmpLink);
        })
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 取消编辑，重置模态框内容 
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogVisible = false;
        this.reset()
      },
      handleClosetab() {

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