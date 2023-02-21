<template>
  <!-- 登录 -->
  <el-container>
    <el-header>
      <!-- <strong style="font-size: 35px; font-family: 楷体">欢 迎 来 到 清 枫 一 体 化 管 理 平 台</strong> -->
    </el-header>

    <el-main>
      <el-row type="flex" justify="center" align="middle">
        <el-col :xs="8" :sm="8" :md="8" :lg="9" :xl="11">
          <el-image fit="cover" :src="require('@/assets/login.png')" style="margin-top: 60px">
          </el-image>
        </el-col>

        <el-col :span="2">
          <el-divider direction="vertical"></el-divider>
        </el-col>

        <el-col :xs="8" :sm="6" :md="8" :lg="7" :xl="11">
          <el-card class="box-card" shadow="hover" :body-style="{ padding: '0px' }">
            <div slot="header" class="clearfix">
              <el-tabs>
                <el-tag type="info">科技拥抱生活🙆‍♂️</el-tag>
                <!-- 账户密码登录面板 -->
                <el-tab-pane label="密码登录">
                  <div class="login">
                    <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="80px">
                      <el-form-item label="用户名" prop="username" style="width: 380px">
                        <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
                      </el-form-item>
                      <el-form-item prop="password" style="width: 380px">
                        <span slot="label"> 密&emsp;码 </span>
                        <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
                      </el-form-item>
                      <el-form-item label="验证码" prop="code" style="width: 380px">
                        <el-input v-model="loginForm.code" style="width: 140px; float: left" maxlength="5"
                          placeholder="请输入验证码"></el-input>
                        <el-image :src="captchaImg" class="captcha_img" @click="getCaptcha"></el-image>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" round @click="submitForm('loginForm')">立即登录</el-button>
                        <el-button round @click="resetForm('loginForm')">重置数据</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-tab-pane>
                <!-- 手机号验证码登录面板 -->
                <el-tab-pane label="免密登录">
                  <div class="login">
                    <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="80px">
                      <el-form-item label="手机号" prop="username" style="width: 380px">
                        <el-input v-model="loginForm.username"></el-input>
                      </el-form-item>
                      
                      <el-form-item label="验证码" prop="password" style="width: 380px">
                        <el-input v-model="loginForm.password" type="password"></el-input>
                      </el-form-item>

                      <el-form-item>
                        <el-button type="primary" round @click="submitForm('loginForm')">立即登录</el-button>
                        <el-button round @click="resetForm('loginForm')">重置数据</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-tab-pane>
                <!-- 微信扫码登录面板 -->
                <el-tab-pane label="微信登录">
                  <el-image style="width: 50%; height: 50%" :src="require('@/assets/blog.png')"></el-image>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
    <!-- 网站底部信息 -->
    <el-footer> 🐱‍🏍Copyright © 2021-2022 青枫网络工作室 All Rights Reserved.</el-footer>
  </el-container>
</template>

<script>
  import login from "@/api/login/login";
  export default {
    name: "Login",
    data() {
      return {
        // 图片验证码
        captchaImg: "",
        // 登录表单
        loginForm: {
          username: "breze",
          password: "123456",
          key: "",
          code: ""
        },
        rules: {
          username: [{
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          }, ],
          password: [{
            required: true,
            message: "请输入密码",
            trigger: "blur",
          }, ],
          code: [{
              required: true,
              message: "请输入验证码",
              trigger: "blur",
            },
            {
              min: 5,
              max: 5,
              message: "长度为 5 个字符",
              trigger: "blur",
            },
          ],
        },
      };
    },

    mounted() {
      this.getCaptcha();
    },
    methods: {
      // 获取验证码 Start
      getCaptcha() {
        login.getCaptcha().then((res) => {
          this.loginForm.key = res.data.result.data.key;
          this.captchaImg = res.data.result.data.base64Img;
        });
      },
      // 获取验证码 End

      // 立即登录 Start
      submitForm(formName) {
        console.log("stringify", this.qs.stringify(this.loginForm));
        this.$refs[formName].validate((valid) => {
          if (valid) {
            login.submitFormLogin(this.qs.stringify(this.loginForm)).then((res) => {
                const jwt = res.headers["authorization"];
                this.$store.commit("SET_TOKEN", jwt);
                this.$router.push("/dashboard");
              })
              .catch((res) => {
                this.getCaptcha();
              });
          } else {
            console.log("错误提交!");
            return false;
          }
        });
      },
      //  立即登录 End

      //  重置表单 Start
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      //  重置表单 End
    },
  };
</script>

<style scoped>
  .el-container {
    height: 100%;
  }

  .el-row {
    background-color: #ffffff;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    height: 100%;
  }

  .el-divider {
    height: 260px;
  }

  .captcha_img {
    float: left;
    margin-left: 8px;
    border-radius: 4px;
  }

  .login {
    margin-top: 20px;
  }

  .el-header,
  .el-footer {
    color: rgb(0, 0, 0);
    text-align: center;
  }

  .el-header {
    margin-top: 5%;
    /* line-height: 120px; */
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both;
  }
</style>