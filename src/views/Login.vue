<template>
  <el-container>

    <el-header>
      <!-- <strong class="title">欢 迎 来 到 清 枫 一 体 化 管 理 平 台</strong> -->
    </el-header>

    <el-main>
      <el-row type="flex" justify="center" align="middle">

        <el-col :xs="0" :sm="8" :md="7" :lg="7" :xl="8">
          <el-image fit="cover" :src="require('@/assets/login.png')"></el-image>
        </el-col>

        <el-col :xs="0" :sm="1" :md="2" :lg="2" :xl="2">
          <el-divider direction="vertical"></el-divider>
        </el-col>

        <el-col :xs="20" :sm="14" :md="8" :lg="7" :xl="8">
          <el-card class="box-card" shadow="hover" :body-style="{ padding: '0px' }">
            <div class="clearfix" slot="header">
              <el-tabs>
                <el-tag type="info">科技拥抱生活🙆‍♂️</el-tag>
                <!-- 账户密码登录面板 -->
                <el-tab-pane label="密码登录">
                  <div class="login">
                    <el-form :model="loginForm" :rules="rules" ref="accountLoginForm" label-width="80px">
                      <el-form-item class="login-form-item" label="用户名" prop="username">
                        <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
                      </el-form-item>
                      <el-form-item class="login-form-item" prop="password">
                        <span slot="label"> 密&emsp;码 </span>
                        <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
                      </el-form-item>
                      <el-form-item class="login-form-item" label="验证码" prop="code">
                        <el-row>
                          <el-col :span="12">
                            <el-input v-model="loginForm.code" placeholder="请输入验证码"></el-input>
                          </el-col>
                          <el-col :span="12">
                            <el-image class="captcha-img" :src="captchaImg" @click="getCaptcha()"></el-image>
                          </el-col>
                        </el-row>
                      </el-form-item>

                      <el-form-item>
                        <el-row>
                          <el-col :span="14">
                            <el-button type="primary" round @click="submitForm('accountLoginForm')">立即登录</el-button>
                          </el-col>
                          <el-col :span="10">
                            <el-button round @click="resetForm('accountLoginForm')">重置数据</el-button>
                          </el-col>
                        </el-row>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-tab-pane>
                <!-- 手机号验证码登录面板 -->
                <el-tab-pane label="免密登录">
                  <div class="login">
                    <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="80px">
                      <el-form-item class="login-form-item" label="手机号" prop="username">
                        <el-input v-model="verifyForm.phone"></el-input>
                      </el-form-item>

                      <el-form-item class="login-form-item" label="验证码" prop="password">
                        <el-input v-model="verifyForm.verify"></el-input>
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
                  <el-image class="wxcode-img" :src="require('@/assets/blog.png')"></el-image>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>

    <!-- 网站底部信息 -->
    <el-footer> 🐱‍🏍Copyright © 2021-2023 青枫网络工作室 All Rights Reserved.</el-footer>
    <!-- <el-footer> 🐱‍🏍Copyright © 2021-2023 QF All Rights Reserved.</el-footer> -->

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
          code: "breze"
        },
        verifyForm: {
          phone: "",
          verify: ""
        },
        rules: {
          username: [{
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }],
          password: [{
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }],
          code: [{
              required: true,
              message: "请输入验证码",
              trigger: "blur"
            },
            {
              min: 5,
              max: 5,
              message: "长度为 5 个字符",
              trigger: "blur"
            }
          ],
        },
      };
    },
    created() {
      this.getCaptcha();
    },
    mounted() {},
    methods: {
      // 获取验证码
      getCaptcha() {
        login.getCaptcha().then((res) => {
          this.captchaImg = res.data.result.data.base64Img;
          this.loginForm.key = res.data.result.data.key;

        });
      },
      //  重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      // 立即登录
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            login.submitFormLogin(this.$qs.stringify(this.loginForm))
              .then((res) => {
                console.log(res);
                const token = res.headers["authorization"];
                this.$store.commit("setToken", token);
                this.$router.push("/");
              })
              .catch((err) => {
                this.getCaptcha();
                this.$message({
                  message: err,
                  type: "warning"
                });
              });
          } else {
            this.getCaptcha();
            this.$message({
              message: "数据格式不正确",
              type: "warning"
            });
          }
        });
      },




    },
  };
</script>

<style scoped>
  .el-container {
    height: 100%;
    width: 100%;
  }

  .el-header {
    color: rgb(0, 0, 0);
    text-align: center;
    line-height: 120px;
    height: 40%;
  }

  .el-main {
    height: 60%;
    display: flex;
    /* 主轴对齐方式 */
    justify-content: center;
    /* 侧轴对齐方式 */
    align-items: center;
  }

  .el-footer {
    color: rgb(0, 0, 0);
    text-align: center;
    height: 10%;
  }

  .el-row {
    background-color: #ffffff;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
  }

  .el-divider {
    height: 260px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both;
  }

  .title {
    font-size: 35px;
    font-family: "楷体";
  }

  .login-form-item {
    width: 100%;
  }

  .captcha-img {
    float: left;
    margin-left: 8px;
    border-radius: 4px;
  }

  .login {
    margin-top: 20px;
  }

  .wxcode-img {
    width: 50%;
    height: 50%;
  }
</style>