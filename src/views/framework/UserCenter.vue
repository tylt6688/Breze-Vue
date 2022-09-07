<template>
  <div class="page">
    <el-tabs tab-position="top" style="height: 100%; text-align: center">
      <!-- TODO个人资料面板 -->
      <el-tab-pane label="用户信息">
        <el-upload class="avatar-uploader" action="url" :show-file-list="false" :http-request="uploadAvatar"
          :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <el-tooltip v-if="userInfo.avatar" effect="dark" content="点击更换头像" placement="bottom">
            <el-avatar v-if="userInfo.avatar" fit="cover" :size="120" :src="userInfo.avatar">
            </el-avatar>
          </el-tooltip>
          <div>
            <el-tooltip v-if="!userInfo.avatar" effect="dark" content="点击上传头像" placement="bottom">
              <i v-if="!userInfo.avatar" class="el-icon-plus avatar-uploader-icon"></i>
            </el-tooltip>
          </div>
        </el-upload>

        <el-descriptions title="个人资料" :column="3" style="margin: 0 auto; width: 70%" border>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              统一用户名
            </template>
            {{ userInfo.username }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              姓名
            </template>
            {{ userInfo.trueName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              手机号
            </template>
            {{ userInfo.phone }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-tickets"></i>
              用户身份
            </template>
            <!-- 这里一定要加作用域插槽: -->
            <template :slot-scope="userInfo">
              <el-tag style="margin: 3px" size="small" v-for="(item, index) in userInfo.roles" :key="index">
                {{ item.name }}</el-tag>
            </template>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-s-finance"></i>
              邮箱
            </template>
            {{ userInfo.email }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-location-outline"></i>
              所在城市
            </template>
            {{ userInfo.city }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-wallet"></i>
              所属部门
            </template>
            {{ userInfo.department }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-timer"></i>
              账号创建时间
            </template>
            {{ formatDate(userInfo.createTime) }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-timer"></i>
              最近一次登录时间
            </template>
            {{ formatDate(userInfo.loginTime) }}
          </el-descriptions-item>

          <template slot="extra" :slot-scope="userInfo">
            <el-button @click="editUserInfo(userInfo.id)" type="primary" size="small">编辑资料</el-button>
          </template>
        </el-descriptions>
      </el-tab-pane>

      <!-- TODO修改密码面板 -->
      <el-tab-pane label="修改密码">
        <h2>您好！{{ userInfo.trueName }}</h2>
        <el-form :model="passForm" status-icon :rules="rules" ref="passForm" label-width="100px">
          <el-form-item label="旧密码" prop="currentPass">
            <el-input type="password" v-model="passForm.currentPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input type="password" v-model="passForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="passForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitPassForm('passForm')">提交</el-button>
            <el-button @click="resetForm('passForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <!-- TODO安全隐私面板 -->
      <el-tab-pane label="安全隐私">
        <el-form ref="form" label-width="100px">
          <el-form-item label="登录邮件提醒">
            <el-switch @change="changeLoginWarn" v-model="loginWarn" active-color="#13ce66" inactive-color="#ff4949"
              active-text="开启" inactive-text="关闭">
            </el-switch>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <!-- TODO意见反馈面板 -->
      <el-tab-pane label="意见反馈">
        <el-form ref="elForm" :model="suggformData" :rules="suggrules" size="medium" label-width="100px">
          <el-row>
            <el-form-item label="建议反馈" prop="suggest">
              <el-input v-model="suggformData.suggest" type="textarea" placeholder="请输入您对此平台的建议反馈"
                :autosize="{ minRows: 4, maxRows: 4 }" :style="{ width: '100%' }"></el-input>
            </el-form-item>
            <el-row>
              <el-form-item label="评分" prop="star">
                <el-rate v-model="suggformData.star" :max="5"></el-rate>
              </el-form-item>
            </el-row>
          </el-row>
          <el-form-item size="large">
            <el-button type="primary" @click="">提交</el-button>
            <el-button @click="resetForm('elForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <!--TODO编辑个人信息模态框-->
    <el-dialog v-dialogDrag title="个人信息" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editForm">
        <el-form-item label="唯一用户名" prop="username" label-width="100px">
          <el-input :disabled="true" v-model="editForm.username" autocomplete="off"></el-input>
          <el-alert title="用于唯一登录身份ID标识，不可更改" :closable="false" type="info" style="line-height: 12px">
          </el-alert>
        </el-form-item>
        <el-form-item label="真实姓名" prop="trueName" label-width="100px">
          <el-input v-model="editForm.trueName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" label-width="100px">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone" label-width="100px">
          <el-input v-model="editForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="居住地" prop="city" label-width="100px">
          <el-input v-model="editForm.city" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUserInfoForm('editForm')">确 定</el-button>
        <el-button @click="resetUserInfoForm('editForm')">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import moment from "moment";
  import userCenter from "@/api/framework/userCenter";
  import user from "@/api/sys/user";
  export default {
    inject: ["reloadAvatar"],
    name: "UserCenter",
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value !== this.passForm.password) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      };
      return {
        suggformData: {
          suggest: undefined,
          star: 0,
        },
        suggrules: {
          suggest: [{
            required: true,
            message: "请输入您对此平台的建议反馈",
            trigger: "blur",
          }, ],
          star: [{
            required: true,
            message: "评分不能为空",
            trigger: "change",
          }, ],
        },
        // 个人中心页面参数
        loginWarn: false,
        dialogVisible: false,
        editForm: {},
        userInfo: {},
        editFormRules: {
          truename: [{
            required: true,
            message: "请输入用户真实姓名",
            trigger: "blur",
          }, ],
          phone: [{
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          }, ],
          email: [{
            required: true,
            message: "请输入邮箱",
            trigger: "blur",
          }, ],
          city: [{
            required: true,
            message: "请输入所在城市",
            trigger: "blur",
          }, ],
        },
        // 重置密码页面参数
        passForm: {
          password: "",
          checkPass: "",
          currentPass: "",
        },
        rules: {
          password: [{
              required: true,
              message: "请输入新密码",
              trigger: "blur",
            },
            {
              min: 6,
              max: 12,
              message: "长度在 6 到 12 个字符",
              trigger: "blur",
            },
          ],
          checkPass: [{
            required: true,
            validator: validatePass,
            trigger: "blur",
          }, ],
          currentPass: [{
            required: true,
            message: "请输入当前密码",
            trigger: "blur",
          }, ],
        },
      };
    },
    created() {
      this.getUserInfo();
    },
    methods: {
      formatDate(date) {
        if (date == null) {
          return null;
        }
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
      },
      // 更新登录提醒状态 Start
      changeLoginWarn(e) {
        var loginwarn = "";
        if (e) {
          loginwarn = 0;
        } else {
          loginwarn = 1;
        }
        let params = {
          loginwarn: loginwarn,
          id: this.userInfo.id
        }
        userCenter.changeLoginWarn(qs.stringify(params)).then((res) => {
          this.$message({
            showClose: true,
            duration: 2000,
            message: "更新邮件提醒状态成功",
            type: "success",
            onClose: () => {
              this.getUserInfo();
            },
          });
          this.dialogVisible = false;
        });
      },
      // 更新登录提醒状态 End

      // 获取用户信息 Start
      getUserInfo() {
        user.getUserInfo().then((res) => {
          this.userInfo = res.data.result.data.result;
          if (this.userInfo.loginwarn === 0) {
            this.loginWarn = true;
          }
        });
      },
      // 获取用户信息 End

      // 编辑用户信息时回显 Start
      editUserInfo(id) {
        user.editUserInfo(id).then((res) => {
          this.editForm = res.data.result.data;
          this.dialogVisible = true;
        });
      },
      // 编辑用户信息时回显 End

      resetUserInfoForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogVisible = false;
        this.editForm = {};
      },
      handleClose() {
        this.resetUserInfoForm("editForm");
      },

      // 编辑资料 Start
      submitUserInfoForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            user.submitUserInfoForm(this.editForm).then((res) => {
              this.$message({
                showClose: true,
                duration: 2000,
                message: "更新个人信息成功",
                type: "success",
                onClose: () => {
                  this.getUserInfo();
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
      // 编辑资料 End

      // 上传头像 Start
      handleAvatarSuccess(res, file) {
        console.log(file);
      },
      // 上传头像前进行检查
      beforeAvatarUpload(file) {
        const isJPG = file.type === "image/jpeg";
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error("上传头像图片只能是 JPG 格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }
        return isJPG && isLt2M;
      },
      // 开始上传
      uploadAvatar(param) {
        const formData = new FormData();
        formData.append("avatar", param.file);
        user.uploadAvatar(formData).then((res) => {
          console.log(res.data);
          this.$message({
            showClose: true,
            duration: 2000,
            message: "上传头像成功",
            type: "success",
            onClose: () => {
              this.getUserInfo();
              // 局部刷新注入方式
              this.reloadAvatar();
            },
          });
        });
      },

      // 上传头像 End

      // 修改密码 Start
      submitPassForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const that = this;
            that
              .$confirm("此操作将进行密码修改, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
              .then(() => {
                user.submitPassForm(this.passForm).then((res) => {
                  console.log("messsge", res);
                  this.$message({
                    type: "success",
                    message: `${res.data.result.data}`,
                  });
                });
                this.$refs[formName].resetFields();
              })
              .catch(() => {
                this.$refs[formName].resetFields();
                this.$message({
                  type: "info",
                  message: "已取消修改",
                });
              });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      // 修改密码 End

      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    },
  };
</script>

<style scoped lang="scss">
  // 此处必须使用透传进行样式定义，避免污染全局样式
  /deep/ .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 60px;
    width: 120px;
    height: 120px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  /deep/ .avatar-uploader .el-upload:hover {
    border-color: #409eff;
    filter: alpha(Opacity=80);
    -moz-opacity: 0.8;
    opacity: 0.8;
  }

  /deep/ .avatar-uploader-icon {
    font-size: 30px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }

  /deep/ .el-form {
    width: 420px;
    margin: 50px auto;
  }

  /deep/ .el-rate {
    display: inline-block;
    vertical-align: text-top;
  }
</style>