<template>
  <div class="page">
    <el-header>
      <el-form :inline="true">
        <el-form-item>
          <el-select v-model="searchForm.contentId" clearable placeholder="请选择">
            <el-option v-for="item in selectList" :key="item.id" :label="item.mainTitle" :value="item.id">
            </el-option>
          </el-select>
          <el-button  @click="getContentList" icon="el-icon-search">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="insertContent" icon="el-icon-picture-outline">
            添加主页内容
          </el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table ref="detailContntTable" :data="detailContents" style="width: 100%" row-key="orderNum" border lazy
        :load="getChildrens" :tree-props="{ children: 'children' }">
        <el-table-column prop="mainTitle" label="主标题">
        </el-table-column>
        <el-table-column prop="subTitle" label="副标题">
        </el-table-column>

        <el-table-column prop="info" label="内容模块简介">
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
        <el-table-column prop="orderNum" label="内容序号"> </el-table-column>

        <el-table-column prop="icon" label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="text" @click="editContent(scope.row.id)" icon="el-icon-edit">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <template>
              <el-popconfirm title="确定删除此内容吗?" @confirm="delContent(scope.row)" >
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
        <el-form-item label="上级菜单" label-width="100px">
          <el-select v-model="editForm.contentId" clearable placeholder="请选择">
            <el-option v-for="item in selectList" :key="item.id" :label="item.mainTitle" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主标题" prop="mainTitle" label-width="100px">
          <el-input v-model="editForm.mainTitle" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="副标题" prop="subTitle" label-width="100px">
          <el-input v-model="editForm.subTitle" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容简介" prop="info" label-width="100px">
          <el-input v-model="editForm.info" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="展示图片" label-width="100px" v-if="flag">
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
          <!-- <el-input v-model="editForm.orderNum" autocomplete="off"></el-input> -->
          <el-input-number v-model="editForm.orderNum" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="父级菜单" label-width="100px" prop="parentId">
          <el-select v-model="editForm.parentId" placeholder="请选择上一级菜单">
            <el-option v-for="item in this.detailContents" :key="item.id" :label="item.mainTitle" :value="item.id">
            </el-option>
          </el-select>
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
  import detailContent from "@/api/portal/detailContent";
  export default {
    name: "DetailContent",
    data() {
      return {
        // 分页数据
        total: 0,
        size: 10,
        current: 1,
        searchForm: {
          contentId: ""
        },

        title: "",
        //序号列表
        orderList: [],

        selectList: [],
        flag: true,
        fileList: [],
        //图片缩略图
        dialogImageUrl: '',
        dialogImgVisible: false,
        disabled: false,

        dialogVisible: false,

        editForm: {},

        form: {},
        detailContents: [],
        editFormRules: {
          mainTitle: [{
            required: true,
            message: "请输入标题",
            trigger: "blur",
          }, ],
          subTitle: [{
            required: true,
            message: "请输入标题",
            trigger: "blur",
          }, ],
          info: [{
            required: true,
            message: "请输入简介介绍",
            trigger: "blur",
          }, ],
          orderNum: [{
            required: true,
            message: "请输入排列序号",
            trigger: "blur",
          }, ],
          parentId: [{
            required: true,
            message: "请选择上一级标题",
            trigger: "change",
          }, ],
        },
      };
    },
    created() {},
    mounted() {
      this.getContentList();
      this.getSelectInfo();
    },
    methods: {

      // 获取用户列表 
      getContentList() {
        let params = {
          contentId: this.searchForm.contentId,
          current: this.current,
          size: this.size,
          parentId: 0
        };
        detailContent.getContentList(params).then((res) => {
          this.detailContents = res.data.result.data.records;
          console.log("detailContent", this.detailContents)
          this.total = res.data.result.data.total
          this.detailContents.forEach(detailContent => {
            this.orderList.push(
              detailContent.orderNum
            )
            if (detailContent.children.length != 0) {
              detailContent.children.forEach(detailContent => {
                this.orderList.push(
                  detailContent.orderNum
                )
              })
            }
          })
          console.log("orderList", this.orderList)
        });
      },
      //获取子节点
      getChildrens(tree, treeNode, resolve) {
        // 懒加载树级 
        console.log(resolve)
        resolve(this.detailContents.children)
      },

      getSelectInfo() {
        maincontent.getSelectOptionInfo().then((res) => {
          console.log(res)
          this.selectList = res.data.result.data;
        })
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
        detailContent.findContentById(id).then((res) => {
          this.editForm = res.data.result.data;
          console.log("edit", this.editForm)
          if (res.data.result.data.imgUrl != null) {
            this.fileList.push({
              'url': res.data.result.data.imgUrl
            })
            var edit = document.getElementsByClassName("el-upload--picture-card")[0];
            edit.style.display = "none"
          }
          if(this.editForm.parentId == 0){
            this.flag = false;
          }

        });
      },


      // 触发上传图片
      submitUpload() {
        console.log("dsgds",this.$refs.upload.uploadFiles)
        if (this.$refs.upload.uploadFiles.length != 0) {
          this.$refs.upload.submit();
        } else {
          detailContent.editContent(this.editForm).then((res) => {
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
        detailContent
          .upload(form)
          .then((response) => {
            this.dialogVisible = false;
            this.editForm = {};
            this.$refs.upload.clearFiles()
            this.$message({
              showClose: true,
              duration: 2000,
              message: response.data.message,
              type: "success",
              onClose: () => {
                this.getContentList();
                this.handleClose();
              },
            });
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
        var edit = document.getElementsByClassName("el-upload--picture-card")[0];
        edit.style.display = "none"
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
        if(row.children.length == 0){
          detailContent.delContentInfo(row).then((res) => {
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
        }else{
          this.$message({
              showClose: true,
              duration: 2000,
              message: "该信息有子节点，无法删除",
              type: "error",
              onClose: () => {
                this.getContentList();
              },
            });
        }
      },
      // 取消编辑，重置模态框内容 
      resetForm(formName) {
        this.dialogVisible = false;
        this.$refs[formName].resetFields();
        this.$refs.upload.clearFiles()
        var edit = document.getElementsByClassName("el-upload--picture-card")[0];
        edit.style.display = "",
          this.fileList = []
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