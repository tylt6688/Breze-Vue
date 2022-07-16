<template>
  <div class="page">
    <el-tabs v-model="activeName" tab-position="top" @tab-click="handleClick">
      <el-tab-pane label="轮播图管理" name="first">
        <el-header>
          <el-button type="primary" @click="bannerDialogVisible = true" icon="el-icon-picture-outline">
          上传轮播图
          </el-button>
        </el-header>
        <el-main>
          <el-table ref="bannerTable" :data="banners" tooltip-effect="dark" border stripe>
            <el-table-column prop="url" label="轮播图" width="300">
              <template slot-scope="scope">
                <el-image style="width: 100%; height: 120px" :src="scope.row.url"></el-image>
              </template>
            </el-table-column>
            <el-table-column prop="alt" label="轮播图主题" width="200">
            </el-table-column>
            <el-table-column prop="orderNum" label="轮播图序号" width="100" align="center">
            </el-table-column>
            <el-table-column prop="url" label="轮播图地址">
            </el-table-column>
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
      </el-tab-pane>
      <!-- 通知公告面板 -->
      <el-tab-pane label="通知公告管理" name="second">
        <el-header>
          <el-button type="primary" @click="notifyDialogVisible = true" icon="el-icon-circle-plus-outline">
          新增通知公告
          </el-button>
          <el-button type="success" @click="commonEditDialogVisible=true" icon="el-icon-edit-outline">
          编辑通知公告
          </el-button>
          <el-button type="danger" @click="delNotifyDialog" icon="el-icon-delete">
          删除通知公告
          </el-button>
        </el-header>
        <Context :tableData="notifyTableData" :total="total" :current="current" :size="size"></Context>
        <el-pagination @size-change="notifyHandleSizeChange" @current-change="notifyHandleCurrentChange"
          layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 20, 50, 100]" :current-page="current"
          :page-size="size" :total="total">
        </el-pagination>
      </el-tab-pane>
      <!-- 新闻动态面板 -->
      <el-tab-pane label="新闻动态管理" name="third">
        <el-header>
          <el-button type="primary" @click="notifyDialogVisible = true" icon="el-icon-circle-plus-outline">新增新闻动态
          </el-button>
          <el-button type="success" @click="commonEditDialogVisible=true" icon="el-icon-edit-outline">编辑新闻动态
          </el-button>
          <el-button type="danger" @click="delNotifyDialog" icon="el-icon-delete">删除新闻动态
          </el-button>
        </el-header>
        <Context :tableData="newsTableData"></Context>
        <el-pagination @size-change="newsHandleSizeChange" @current-change="newsHandleCurrentChange"
          layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 20, 50, 100]" :current-page="current"
          :page-size="size" :total="total">
        </el-pagination>
      </el-tab-pane>
      <!-- 学生天地面板 -->
      <el-tab-pane label="学生天地管理" name="fourth">
        <el-header>
          <el-button type="primary" icon="el-icon-circle-plus-outline">新增学生天地
          </el-button>
          <el-button type="success" icon="el-icon-edit-outline">编辑学生天地
          </el-button>
          <el-button type="danger" icon="el-icon-delete">删除学生天地
          </el-button>
        </el-header>
        <Context :tableData="presenceTableData"></Context>
        <el-pagination @size-change="presenceHandleSizeChange" @current-change="presenceHandleCurrentChange"
          layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 20, 50, 100]" :current-page="current"
          :page-size="size" :total="total">
        </el-pagination>
      </el-tab-pane>
      <!-- 思政教育面板 -->
      <el-tab-pane label="思政教育管理" name="fiveth">
        <el-header>
          <el-button type="primary" icon="el-icon-circle-plus-outline">新增思政教育
          </el-button>
          <el-button type="success" icon="el-icon-edit-outline">编辑思政教育
          </el-button>
          <el-button type="danger" icon="el-icon-delete">删除思政教育
          </el-button>
        </el-header>
        <Context :tableData="thoughtTableData"></Context>
        <el-pagination @size-change="thoughtHandleSizeChange" @current-change="thoughtHandleCurrentChange"
          layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 20, 50, 100]" :current-page="current"
          :page-size="size" :total="total">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>

    <!-- 下方为弹出层模态框 -->

    <!-- 公共输入组件 Start -->
    <el-dialog title="输入标题" :visible.sync="commonEditDialogVisible" :before-close="commonEditHandleClose">
      <el-form ref="commonEditForm" :model="commonEditForm" :rules="commonEditFormRules" size="medium"
        label-width="100px">
        <el-form-item label="请输入标题" prop="title" autocomplete="off">
          <el-input v-model="commonEditForm.title" placeholder="请输入请输入标题" clearable :style="{width: '100%'}">
          </el-input>
          <el-alert title="为保护数据防止误操作，请在此复制相应标题进行操作确认" :closable="false" type="info" style="line-height: 12px;">
          </el-alert>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button v-if="delflag" type="primary" @click="delNotify">删除</el-button>
        <el-button v-else type="primary" @click="submitCommonEdit">确定</el-button>

        <el-button @click="commonEditResetForm('commonEditForm')">取消</el-button>
      </div>
    </el-dialog>
    <!-- 公共输入组件 End -->


    <!-- 新增编辑通知公告 Start -->
    <el-dialog v-dialogDrag title="新增或编辑" :visible.sync="notifyDialogVisible" :before-close="notifyHandleClose">
      <el-form ref="notifyForm" :model="notifyForm" :rules="notifyFormRules" size="medium" label-width="100px">
        <el-form-item label="请输入标题" prop="title">
          <el-input v-model="notifyForm.title" placeholder="请输入请输入标题" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="请输入内容" prop="content">
          <tinymce v-model="notifyForm.content" placeholder="请输入请输入内容" :height="420"></tinymce>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="submitNotifyForm('notifyForm')">确定</el-button>
        <el-button @click="notifyResetForm('notifyForm')">取消</el-button>
      </div>
    </el-dialog>
    <!-- 新增编辑通知公告 End -->

    <!--编辑轮播图模态框 Start-->
    <el-dialog title="编辑轮播图" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">
      <el-form ref="editForm" :model="editForm" :rules="editFormRules">
        <el-form-item label="图片地址" prop="url" label-width="100px">
          <el-input :disabled="true" v-model="editForm.url" autocomplete="off"></el-input>
          <el-alert title="轮播图地址，不可进行编辑" :closable="false" type="info" style="line-height: 12px;">
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
          <el-input style="width:80%" block placeholder="请输入轮播图主题" :autosize="{ minRows: 2, maxRows: 4}" type="textarea"
            v-model="imgalt" autocomplete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="排序" label-width="100px">
          <el-input-number v-model="ordernum" :min="1" label="序号">1</el-input-number>
        </el-form-item>


        <div style="margin: 20px 0;"></div>
        <el-upload ref="upload" style="text-align: center;" action="url" drag :http-request="uploadBanner" multiple
          accept=".png,.jpg" :limit="1" :auto-upload="uploadStatu">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将轮播图拖到此处,或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只允许上传png或jpg文件,大小不超过100MB</div>
        </el-upload>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitBanner">上传</el-button>
        <el-button @click="bannerDialogVisible=false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 上传文件模态框 End -->
  </div>
</template>

<script>
  import Context from '@/components/Context'
  import tinymce from '@/components/tinymce/tinymce'
  export default {

    name: "IndexManage",
    components: {
      Context,
      tinymce
    },
    data() {
      return {
        // 分页数据
        total: 0,
        size: 10,
        current: 1,
        delflag: false,
        commonEditForm: {
          title: "",
        },

        notifyTableData: [],
        newsTableData: [],
        presenceTableData: [],
        thoughtTableData: [],

        activeName: "first",
        imgalt: "",
        ordernum: "",
        dialogVisible: false,
        bannerDialogVisible: false,
        notifyDialogVisible: false,
        commonEditDialogVisible: false,
        uploadStatu: false,
        banners: [],
        editForm: {},
        notifyForm: {},
        editFormRules: {
          alt: [{
            required: true,
            message: '请输入图片主题',
            trigger: 'blur'
          }],
        },
        notifyFormRules: {
          title: [{
            required: true,
            message: '请输入标题',
            trigger: 'blur'
          }],
        },
        commonEditFormRules: {
          title: [{
            required: true,
            message: '请输入标题',
            trigger: 'blur'
          }],
        },

      }
    },
    created() {},
    mounted() {
      this.getBanner();
    },
    methods: {

      commonEditHandleClose() {
        this.commonEditResetForm('commonEditForm');
      },
      commonEditResetForm(formName) {
        this.$refs[formName].resetFields();
        this.commonEditDialogVisible = false;
        this.commonEditForm.title = "";
      },


      submitCommonEdit() {
        console.log(this.commonEditForm.title)
        this.$axios.get("/notify/selectbytitle/" + this.commonEditForm.title).then(res => {
          this.notifyForm = res.data.result.data;
          this.commonEditHandleClose();
          this.$message({
            showClose: true,
            duration: 1500,
            message: '正在启动编辑器...',
            type: 'warning',
            onClose: () => {
              this.notifyDialogVisible = true;
            }
          });


        })
      },
      delNotifyDialog() {
        this.delflag = true;
        this.commonEditDialogVisible = true;
      },
      //根据commonTitle删除
      delNotify() {
        this.$axios.post("/notify/delete/" + this.commonEditForm.title).then(res => {
          this.$message({
            showClose: true,
            duration: 1500,
            message: '删除成功',
            type: 'success',
            onClose: () => {
              this.getNotify();
              this.commonEditDialogVisible = false;
            }
          });
        })

      },

      // 获取卡片数据 Start
      getNotify() {
        this.$axios.get("/notify/select", {
          params: {
            current: this.current,
            size: this.size
          }
        }).then(res => {
          this.notifyTableData = res.data.result.data.records;
          this.size = res.data.result.data.size;
          this.current = res.data.result.data.current;
          this.total = res.data.result.data.total;
        })
      },
      getNews() {
        this.$axios.get("/news/select", {
          params: {
            current: this.current,
            size: this.size
          }
        }).then(res => {
          this.newsTableData = res.data.result.data.records;
          this.size = res.data.result.data.size;
          this.current = res.data.result.data.current;
          this.total = res.data.result.data.total;
        })
      },
      getPresence() {
        this.$axios.get("/presence/select", {
          params: {
            current: this.current,
            size: this.size
          }
        }).then(res => {
          this.presenceTableData = res.data.result.data.records;
          this.size = res.data.result.data.size;
          this.current = res.data.result.data.current;
          this.total = res.data.result.data.total;
        })
      },
      getThought() {
        this.$axios.get("/thought/select", {
          params: {
            current: this.current,
            size: this.size
          }
        }).then(res => {
          this.thoughtTableData = res.data.result.data.records;
          this.size = res.data.result.data.size;
          this.current = res.data.result.data.current;
          this.total = res.data.result.data.total;
        })
      },
      // 获取卡片数据 End

      // 获取轮播图 Start
      getBanner() {
        this.$axios.get("/banner/select").then(res => {
          this.banners = res.data.result.data;
        })
      },
      // 获取轮播图 End

      // 编辑轮播图 Start
      editHandle(id) {
        this.$axios.get('/banner/info/' + id).then(res => {
          this.editForm = res.data.result.data;
          this.dialogVisible = true;
        })
      },
      // 编辑轮播图 End

      // 取消编辑，重置模态框内容 Start
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogVisible = false;
        this.editForm = {};
      },
      handleClose() {
        this.resetForm('editForm');
      },
      // 取消编辑，重置模态框内容 End




      // 用户自定义上传Banner图 Start
      uploadBanner(param) {
        const alt = this.imgalt;
        const ordernum = this.ordernum;
        const formData = new FormData();
        formData.append("file", param.file);
        formData.append("alt", alt);
        formData.append("orderNum", ordernum);
        this.$axios
          .post("/banner/upload", formData, {
            "Content-type": "multipart/form-data",
          })
          .then((res) => {
            this.bannerDialogVisible = false;
            this.$message({
              showClose: true,
              duration: 2000,
              message: '上传成功',
              type: 'success',
              onClose: () => {
                this.getBanner();
              }
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
            this.$axios.post('/banner/update', this.editForm)
              .then(res => {
                this.$message({
                  showClose: true,
                  duration: 2000,
                  message: '编辑成功',
                  type: 'success',
                  onClose: () => {
                    this.getBanner();
                  }
                });
                this.dialogVisible = false;
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 新增或编辑Banner图 End

      // 删除Banner图 Start
      delHandle(url) {
        this.$axios.post("/banner/delete", url).then(res => {
          this.$message({
            showClose: true,
            duration: 2000,
            message: "删除轮播图成功",
            type: 'success',
            onClose: () => {
              this.getBanner();
            }
          });
        })
      },
      // 删除Banner图 End

      bannerHandClose() {
        this.bannerDialogVisible = false;
      },
      // 标签切换请求数据 Start
      handleClick(tab, event) {
        console.log(tab.index, event);
        if (tab.index == 1) {
          this.getNotify();
        } else if (tab.index == 2) {
          this.getNews();
        } else if (tab.index == 3) {
          this.getPresence();
        } else if (tab.index == 4) {
          this.getThought();
        }
      },
      // 标签切换请求数据 End
      notifyResetForm(formName) {
        this.$refs[formName].resetFields();
        this.notifyDialogVisible = false;
        this.notifyForm = {};
      },
      notifyHandleClose() {
        this.notifyResetForm('notifyForm');
      },
      // 分页数据请求 Start
      notifyHandleSizeChange(val) {
        this.size = val;
        this.getNotify();
      },

      notifyHandleCurrentChange(val) {
        this.current = val;
        this.getNotify();
      },
      newsHandleSizeChange(val) {
        this.size = val;
        this.getNews();
      },

      newsHandleCurrentChange(val) {
        this.current = val;
        this.getNews();
      },
      presenceHandleSizeChange(val) {
        this.size = val;
        this.getPresence();
      },

      presenceHandleCurrentChange(val) {
        this.current = val;
        this.getPresence();
      },
      thoughtHandleSizeChange(val) {
        this.size = val;
        this.getThought();
      },

      thoughtHandleCurrentChange(val) {
        this.current = val;
        this.getThought();
      },
      // 分页数据请求 End

      // 新增或编辑Notify Start
      submitNotifyForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post('/notify/' + (this.notifyForm.id ? 'update' : 'insert'), this.notifyForm)
              .then(res => {
                this.$message({
                  showClose: true,
                  duration: 2000,
                  message: '编辑成功',
                  type: 'success',
                  onClose: () => {
                    this.getNotify();
                  }
                });
                this.notifyDialogVisible = false;
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 新增或编辑Notify End
    }
  }
</script>

<style scoped>
  .el-pagination {
    float: right;
    margin-top: 22px;
  }
</style>