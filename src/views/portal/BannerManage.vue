<template>
  <div class="page">
        <el-header>
          <el-button type="primary" @click="bannerDialogVisible = true" icon="el-icon-picture-outline">
            上传轮播图
          </el-button>
        </el-header>
        <el-main>
          <el-table ref="bannerTable" :data="banners" tooltip-effect="dark" border stripe>
            <el-table-column prop="url" label="轮播图">
              <template slot-scope="scope">
                <el-image style="width: 100%; height: 120px" :src="scope.row.url"></el-image>
              </template>
            </el-table-column>
            <el-table-column prop="alt" label="轮播图主题" >
            </el-table-column>
            <el-table-column prop="orderNum" label="轮播图序号" align="center">
            </el-table-column>
            <el-table-column prop="url" label="轮播图地址"> </el-table-column>
            <el-table-column prop="icon" label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="text" @click="editHandle(scope.row.id)" icon="el-icon-edit">编辑</el-button>
                <el-divider direction="vertical"></el-divider>
                <template>
                  <el-popconfirm title="确定删除此轮播图吗?" @confirm="delHandle(scope.row.url)">
                    <el-button type="text" slot="reference" icon="el-icon-delete">
                      删除
                    </el-button>
                  </el-popconfirm>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-main> 


    <!--编辑轮播图模态框 Start-->
    <el-dialog title="编辑轮播图" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">
      <el-form ref="editForm" :model="editForm" :rules="editFormRules">
        <el-form-item label="图片地址" prop="url" label-width="100px">
          <el-input :disabled="true" v-model="editForm.url" autocomplete="off"></el-input>
          <el-alert title="轮播图地址，不可进行编辑" :closable="false" type="info" style="line-height: 12px">
          </el-alert>
        </el-form-item>

        <el-form-item label="排序号" prop="orderNum" label-width="100px">
          <el-input-number v-model="editForm.orderNum" :min="1" label="序号">1</el-input-number>
        </el-form-item>

        <el-form-item label="图片主题" prop="alt" label-width="100px">
          <el-input v-model="editForm.alt" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
        <el-button @click="resetForm('editForm')">取 消</el-button>
      </div>
    </el-dialog>
    <!--编辑轮播图模态框 End-->

    <!-- 上传文件模态框 Start -->
    <el-dialog title="上传轮播图" :visible.sync="bannerDialogVisible" width="600px" :before-close="bannerHandClose">
      <el-form>
        <el-form-item label="主题" label-width="100px">
          <el-input style="width: 80%" block placeholder="请输入轮播图主题" :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea" v-model="imgalt" autocomplete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="排序" label-width="100px">
          <el-input-number v-model="ordernum" :min="1" label="序号">1</el-input-number>
        </el-form-item>

        <div style="margin: 20px 0"></div>
        <el-upload ref="upload" style="text-align: center" action="url" drag :http-request="uploadBanner" multiple
          accept=".png,.jpg" :limit="1" :auto-upload="uploadState">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将轮播图拖到此处,或<em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">
            只允许上传png或jpg文件,大小不超过100MB
          </div>
        </el-upload>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitBanner">上传</el-button>
        <el-button @click="handCloseUplod">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 上传文件模态框 End -->
  </div>
</template>

<script>

  import banner from "@/api/portal/banner";
  export default {
    name: "BannerManage",
    data() {
      return {
        // 分页数据
        total: 0,
        size: 10,
        current: 1,
  
        imgalt: "",
        ordernum: "",
        dialogVisible: false,
        bannerDialogVisible: false,

        uploadState: false,
        banners: [],
        editForm: {},
        editFormRules: {
          alt: [{
            required: true,
            message: "请输入图片主题",
            trigger: "blur",
          }, ],
        },
      };
    },
    created() {},
    mounted() {
      this.getBanner();
    },
    methods: {

      // 获取轮播图 Start
      getBanner() {
        banner.getBannerInfo().then((res) => {
          this.banners = res.data.result.data;
        });
      },
      // 获取轮播图 End

      // 编辑轮播图 Start
      editHandle(id) {
        banner.editHandle(id).then((res) => {
          this.editForm = res.data.result.data;
          this.dialogVisible = true;
        });
      },
      // 编辑轮播图 End

      // 取消编辑，重置模态框内容 Start
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogVisible = false;
        this.editForm = {};
      },
      handleClose() {
        this.resetForm("editForm");
      },
      // 取消编辑，重置模态框内容 End

      handCloseUplod(){
        this.imgalt = "";
        this.bannerDialogVisible = false;
        this.$refs.upload.clearFiles()
      },

      // 用户自定义上传Banner图 Start
      uploadBanner(param) {
        const alt = this.imgalt;
        const ordernum = this.ordernum;
        console.log("ordernum",ordernum)
        const formData = new FormData();
        console.log("formdata",typeof formData)
        formData.append("file", param.file);
        formData.append("alt", alt);
        formData.append("orderNum", ordernum);
        banner.uploadBanner(formData).then((res) => {
          this.imgalt = "";
        this.bannerDialogVisible = false;
        this.$refs.upload.clearFiles()
          this.$message({
            showClose: true,
            duration: 2000,
            message: res.data.message,
            type: "success",
            onClose: () => {
              this.getBanner();
            },
          });
        });
      },
      submitBanner() {
        this.$refs.upload.submit();
      },
      // 用户自定义上传Banner图 End

      // 新增或编辑Banner图 Start
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            banner.submitBannerForm(this.editForm).then((res) => {
              this.$message({
                showClose: true,
                duration: 2000,
                message: res.data.message,
                type: "success",
                onClose: () => {
                  this.getBanner();
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
      // 新增或编辑Banner图 End

      // 删除Banner图 Start
      delHandle(url) {
        banner.delHandleInfo(url).then((res) => {
          this.$message({
            showClose: true,
            duration: 2000,
            message: res.data.message,
            type: "success",
            onClose: () => {
              this.getBanner();
            },
          });
        });
      },
      // 删除Banner图 End

      bannerHandClose() {
        this.bannerDialogVisible = false;
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