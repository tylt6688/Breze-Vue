<template>
  <div class="page">
    <el-header>
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="searchForm.titleName" placeholder="请输入名称" clearable>
            <el-button slot="append" @click="getContentList" icon="el-icon-search">搜索</el-button>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="insertContent" icon="el-icon-picture-outline">
            添加主页内容
          </el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table ref="maincontentTable"  :data="maincontents" style="width: 100%" row-key="orderNum" border lazy :load="getChildrens"
        :tree-props="{ children: 'children' }">
        <el-table-column prop="mainTitle" label="主标题">
        </el-table-column>
        <el-table-column prop="subtitle" label="副标题">
        </el-table-column>

        <el-table-column prop="titleInfo" label="内容模块简介">
        </el-table-column>
        <el-table-column prop="imgUrl" label="内容模块图片" align="center">
          <template slot-scope="scope">
            <el-image style="width: 100%;" :src="scope.row.imgUrl">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
                <div style="font-size:12px">暂无图片显示，请上传</div>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="routerPath" label="指定路由跳转"> </el-table-column>
        <el-table-column prop="orderNum" label="内容序号"> </el-table-column>

        <el-table-column prop="icon" label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="text" @click="editContent(scope.row.id)" icon="el-icon-edit">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <template>
              <el-popconfirm title="确定删除此内容吗?" @confirm="delContent(scope.row)">
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
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="current"
        :page-sizes="[2, 5, 10, 20]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!--编辑主体内容模态框 Start-->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="600px" style="margin-top:-10vh"
      :before-close="handleClose">
      <el-form ref="editForm" :model="editForm" :rules="editFormRules">
        <el-form-item label="主标题" prop="titleName" label-width="100px">
          <el-input v-model="editForm.mainTitle" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="副标题" prop="titleName" label-width="100px">
          <el-input v-model="editForm.subtitle" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容简介" prop="titleInfo" label-width="100px">
          <el-input v-model="editForm.titleInfo" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="展示图片" label-width="100px">
          <el-upload action="#" list-type="picture-card" ref="upload" :auto-upload="false" :file-list="fileList"
            :http-request="uploadFile" :on-change="uploadHandelChage" :before-upload="beforeAvatarUpload">
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                  <i class="el-icon-download"></i>
                </span>
                <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="导航序号" prop="orderNum" label-width="100px">
          <el-input v-model="editForm.orderNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="跳转链接" prop="routerPath" label-width="100px">
          <el-input v-model="editForm.routerPath" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="按钮信息" prop="buttonInfo" label-width="100px">
          <el-input v-model="editForm.buttonInfo" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUpload('editForm')">确 定</el-button>
        <el-button @click="resetForm('editForm')">取 消</el-button>
      </div>
    </el-dialog>
    <!--编辑主体内容模态框 End-->

    <el-dialog :visible.sync="dialogImgVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

  </div>

</template>

<script>
  import maincontent from "@/api/portal/maincontent";
  export default {
    name: "MaincontentManage",
    data() {
      return {
        // 分页数据
        total: 0,
        size: 10,
        current: 1,
        searchForm: {
          titleName: ""
        },

        title: "",
        //序号列表
        orderList: [],

        fileList: [],
        //图片缩略图
        dialogImageUrl: '',
        dialogImgVisible: false,
        disabled: false,

        dialogVisible: false,

        editForm: {},

        form: {},
        maincontents: [],
        editFormRules: {
          titleName: [{
            required: true,
            message: "请输入标题",
            trigger: "blur",
          }, ],
          titleInfo: [{
            required: true,
            message: "请输入简介介绍",
            trigger: "blur",
          }, ],
          orderNum: [{
            required: true,
            message: "请输入排列序号",
            trigger: "blur",
          }, ],
          routerPath: [{
            required: true,
            message: "请填入链接地址",
            trigger: "blur",
          }, ],
          buttonInfo: [{
            required: true,
            message: "请输入按钮显示信息",
            trigger: "blur",
          }, ],
        },
      };
    },
    created() {},
    mounted() {
      this.getContentList();
    },
    methods: {

      // 获取用户列表 
      getContentList() {
        let params = {
          titleName: this.searchForm.titleName,
          current: this.current,
          size: this.size,
          parentId: 0
        };
        maincontent.getContentList(params).then((res) => {
          this.maincontents = res.data.result.data.records;
          console.log("maincontents",this.maincontents)
          this.total = res.data.result.data.total
          this.maincontents.forEach(maincontent => {
            this.orderList.push(
              maincontent.orderNum
            )
          })
        });
      },
      //获取子节点
      getChildrens(tree, treeNode, resolve) {
        // 懒加载树级 
          resolve(this.maincontents.children)
      },
      // 获取内容 
      insertContent() {
        this.dialogVisible = true;
        this.title = "新增内容";
        var index = 1;
        while (this.orderList.indexOf(index) !== -1) {
          index++;
        }
        this.editForm.orderNum = index;
      },
      // 编辑内容 
      editContent(id) {
        this.dialogVisible = true;
        this.title = "编辑内容";
        maincontent.findContentById(id).then((res) => {
          this.editForm = res.data.result.data;
          this.fileList.push({
            'url': res.data.result.data.imgUrl
          })
          var edit = document.getElementsByClassName("el-upload--picture-card")[0];
          edit.style.display = "none"
        });
      },


      // 触发上传图片
      submitUpload() {
        if (this.$refs.upload.uploadFiles[0].raw) {
          this.$refs.upload.submit();
        } else {
          maincontent.editContent(this.editForm).then((res) => {
            this.$message({
              message: res.data.message,
              type: "success",
            });
            this.handleClose();
            this.getContentList();
          })
        }
        // debugger
      },
      // 上传图片
      uploadFile(item) {
        // debugger
        this.dialogVisible = false;
        let fileObj = item.file;
        const json = JSON.stringify(this.editForm);
        const blob = new Blob([json], {
          type: 'application/json'
        });
        const form = new FormData();
        form.append("file", fileObj);
        form.append("editData", blob) // 文件对象  'upload'是后台接收的参数名
        maincontent
          .upload(form)
          .then((response) => {
            this.$message({
              message: res.data.message,
              type: "success",
            });
            this.$refs["upload"].clearFiles();
            this.getContentList();
          })
          .catch((error) => {
            this.$refs["upload"].clearFiles();
          });
      },
      // 上传图片之前判断
      beforeAvatarUpload(file) {
        const isJPG = file.type === "image/jpeg" || file.type === "image/png";
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error("上传头像图片只能是 JPG 格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }
        return isJPG && isLt2M;
      },
      // 文件上传改变钩子
      uploadHandelChage(file, fileList) {
        if (fileList.length > 1) {
          fileList.splice(0, fileList.length, file)
        }
      },
      // 文件缩略图删除
      handleRemove(file) {
        let uploadFiles = this.$refs.upload.uploadFiles
        for (var i = 0; i < uploadFiles.length; i++) {
          if (uploadFiles[i]['url'] == file.url) {
            uploadFiles.splice(i, 1)
          }
        }
        var edit = document.getElementsByClassName("el-upload--picture-card")[0];
        edit.style.display = ""
      },
      // 文件缩略图查看
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogImgVisible = true;
      },
      // 文件缩略图下载
      handleDownload(file) {
        window.open(file.url)
      },

      // 删除内容 Start
      delContent(row) {
        maincontent.delContentInfo(row).then((res) => {
          this.$message({
            showClose: true,
            duration: 2000,
            message: res.data.message,
            type: "success",
            onClose: () => {
              this.getContentList();
            },
          });
        });
      },
      // 取消编辑，重置模态框内容 
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogVisible = false;
        this.editForm = {};
        this.$refs.upload.clearFiles()
        this.fileList = []
        var edit = document.getElementsByClassName("el-upload--picture-card")[0];
        edit.style.display = ""
      },
      handleClose() {
        this.resetForm("editForm");
      },

      // 页码和当前页数量改变调用
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.size = val;
        this.getContentList();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.current = val;
        this.getContentList();
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