<template>
  <!-- TODO 登录 -->
  <el-container>
    <el-header>
      <strong style="font-size: 35px; font-family: 楷体"
        >欢 迎 来 到 清 枫 一 体 化 权 限 管 理 平 台</strong
      >
    </el-header>

    <el-main>
      <el-row type="flex" justify="center" align="middle">
        <el-col :xl="6" :lg="8" :xs="4" :sm="2" :md="5">
          <el-image
            fit="cover"
            :src="require('@/assets/login.png')"
            style="margin-top: 60px"
          >
          </el-image>
        </el-col>

        <el-col :span="2">
          <el-divider direction="vertical"></el-divider>
        </el-col>

        <el-col :xl="6" :lg="7">
          <el-card
            class="box-card"
            shadow="hover"
            :body-style="{ padding: '0px' }"
          >
            <div slot="header" class="clearfix">
              <el-tabs>
                <el-tag type="info">科技拥抱生活🙆‍♂️</el-tag>
                <!-- TODO 账户密码登录面板 -->
                <el-tab-pane label="密码登录">
                  <div class="login">
                    <el-form
                      :model="loginForm"
                      :rules="rules"
                      ref="loginForm"
                      label-width="80px"
                    >
                      <el-form-item
                        label="用户名"
                        prop="username"
                        style="width: 380px"
                      >
                        <el-input
                          v-model="loginForm.username"
                          placeholder="请输入用户名"
                        ></el-input>
                      </el-form-item>
                      <el-form-item prop="password" style="width: 380px">
                        <span slot="label"> 密&emsp;码 </span>
                        <el-input
                          v-model="loginForm.password"
                          type="password"
                          placeholder="请输入密码"
                        ></el-input>
                      </el-form-item>
                      <el-form-item
                        label="验证码"
                        prop="code"
                        style="width: 380px"
                      >
                        <el-input
                          v-model="loginForm.code"
                          style="width: 172px; float: left"
                          maxlength="5"
                          placeholder="请输入验证码"
                        ></el-input>
                        <el-image
                          :src="kaptchaImg"
                          class="kaptchaImg"
                          @click="getKaptcha"
                        ></el-image>
                      </el-form-item>
                      <el-form-item>
                        <el-button
                          type="primary"
                          round
                          @click="submitForm('loginForm')"
                          >立即登录</el-button
                        >
                        <el-button round @click="resetForm('loginForm')"
                          >重置数据</el-button
                        >
                      </el-form-item>
                    </el-form>
                  </div>
                </el-tab-pane>
                <!-- TODO 手机号验证码登录面板 -->
                <el-tab-pane label="免密登录">
                  <div class="login">
                    <el-form
                      :model="loginForm"
                      :rules="rules"
                      ref="loginForm"
                      label-width="80px"
                    >
                      <el-form-item
                        label="手机号"
                        prop="username"
                        style="width: 380px"
                      >
                        <el-input v-model="loginForm.username"></el-input>
                      </el-form-item>
                      <el-form-item
                        label="验证码"
                        prop="password"
                        style="width: 380px"
                      >
                        <el-input
                          v-model="loginForm.password"
                          type="password"
                        ></el-input>
                      </el-form-item>

                      <el-form-item>
                        <el-button
                          type="primary"
                          round
                          @click="submitForm('loginForm')"
                          >立即登录</el-button
                        >
                        <el-button round @click="resetForm('loginForm')"
                          >重置数据</el-button
                        >
                      </el-form-item>
                    </el-form>
                  </div>
                </el-tab-pane>
                <!-- TODO 微信扫码登录面板 -->
                <el-tab-pane label="微信登录">
                  <el-image
                    style="width: 50%; height: 50%"
                    :src="require('@/assets/blog.png')"
                  ></el-image>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
    <!-- TODO 网站底部信息 -->
    <el-footer> 🐱‍🏍青枫网络工作室 © 版权所有 </el-footer>
  </el-container>
</template>

<script>
import qs from "qs";
import login from "@/api/login/login";
export default {
  name: "Login",
  data() {
    return {
      // 图片验证码
      kaptchaImg: "",
      // 登录表单
      loginForm: {
        username: "",
        password: "",
        code: "",
        key: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
        code: [
          {
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
  created() {
    this.getKaptcha();
  },
  methods: {
    //TODO 获取验证码 Start
    getKaptcha() {
      login.getKaptchaInfo().then((res) => {
        this.loginForm.key = res.data.result.data.key;
        this.kaptchaImg = res.data.result.data.base64Img;
      });
    },
    // 获取验证码 End
    // TODO 立即登录 Start
    submitForm(formName) {
      console.log("stringify", qs.stringify(this.loginForm));
      this.$refs[formName].validate((valid) => {
        if (valid) {
          login.submitFormLogin(qs.stringify(this.loginForm)).then((res) => {
              const jwt = res.headers["authorization"];
              this.$store.commit("SET_TOKEN", jwt);
              this.$router.push("/index");
            })
            .catch((res) => {
              console.log(res.message);
              this.getKaptcha();
            });
        } else {
          console.log("错误提交!");
          return false;
        }
      });
    },
    //  立即登录 End
    // TODO 重置表单 Start
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

.kaptchaImg {
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