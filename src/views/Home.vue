<template>
  <el-container>
    <!-- 侧边菜单栏 -->
    <el-aside width="auto">
      <!-- 开启滚动，避免出现滚动条 -->
      <el-scrollbar>
        <SideMenu></SideMenu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header>
        <!-- <strong class="title">清 枫 多 端 一 体 化 权 限 服 务 平 台</strong> -->
        <div class="header-avatar">
          <el-avatar v-if="isChangeAvatar" fit="scale-down" size="large" :src="userInfo.avatar"></el-avatar>
          <el-dropdown>
            <span class="el-dropdown-link">
              {{ userInfo.trueName}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-user-solid">
                <router-link to="/user_center" tag="span">个人中心</router-link>
              </el-dropdown-item>
              <el-dropdown-item icon="el-icon-switch-button" divided @click.native="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div class="badge_panel">
            <el-badge :value="messageNum" :max="99" class="badge_item">
              <el-dropdown>
                <el-button type="primary" size="medium" icon="el-icon-message-solid" circle>消息</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>暂无</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-badge>
          </div>
          <el-tooltip effect="dark" content="全屏切换" placement="bottom">
            <i @click="fullScreen" :class="screenIcon"></i>
          </el-tooltip>
        </div>
      </el-header>

      <!-- 此处class关联返回顶部操作，禁止删除 -->
      <el-main class="container">
        <!-- 将tabs置顶 -->
        <Tabs class="tabs"></Tabs>

        <div style="margin: 0 1rem">
          <!-- 暂时关闭折叠动画效果 -->
          <!-- <el-collapse-transition> -->
          <!-- 中间核心界面 -->
          <router-view></router-view>
          <!-- </el-collapse-transition> -->
        </div>
        <!-- 全局内容返回顶部锚点 -->
        <el-backtop target=".container" :visibility-height="50" :bottom="12" :right="50"></el-backtop>
      </el-main>

      <!-- <el-footer> 🐱‍🏍 Copyright © 2022 💙 青枫网络工作室 </el-footer> -->
      <el-footer> 🐱‍🏍 Copyright © 2022 💙 开发测试专用 </el-footer>
    </el-container>
  </el-container>
</template>

<script>
  import SideMenu from "./inc/SideMenu"
  import Tabs from "./inc/Tabs"
  import screenfull from "screenfull"
  import user from "@/api/sys/user"
  import bus from "@/bus"

  export default {
    emits: ['LoadUserInfo'],
    name: "Home",
    provide() {
      return {
        reloadAvatar: this.reloadAvatar,
      };
    },
    components: {
      SideMenu,
      Tabs,
    },
    data() {
      return {
        screenIcon: "",
        // 注射方式局部刷新头像
        isChangeAvatar: true,
        // 首页右上角用户信息
        userInfo: {
          id: "",
          trueName: "",
          avatar: "",
        },
        // 消息数量
        messageNum: "",
      };
    },

    mounted() {
      bus.$on('LoadUserInfo',this.getUserInfo());
      this.getUserInfoFormLocal();
      this.screenIcon = screenfull.isFullscreen ? "el-icon-crop" : "el-icon-full-screen";
    },
    beforeDestroy() {
      bus.$off('LoadUserInfo');
    },

    methods: {
      // 全屏方法 Start
      fullScreen() {
        if (!screenfull.isEnabled) {
          this.$message({
            message: "您的浏览器不支持全屏操作",
            type: "warning",
          });
          return false;
        }
        screenfull.toggle();
        this.screenIcon = screenfull.isFullscreen ?
          "el-icon-full-screen" :
          "el-icon-crop";
      },
      // 全屏方法 End

      // 局部刷新头像 Start
      reloadAvatar() {
        this.getUserInfo();
        this.getUserInfoFormLocal();
        this.isChangeAvatar = false;
        this.$nextTick(() => (this.isChangeAvatar = true));
      },
      // 局部刷新头像 End

      getUserInfoFormLocal() {
        if (localStorage.getItem("userInfo")) {
          var userShow = JSON.parse(localStorage.getItem("userInfo"));
          this.userInfo.trueName = userShow.trueName;
          this.userInfo.avatar = userShow.avatar;
        }
      },

      // 获取当前登录用户信息 Start
      getUserInfo() {
        user.getUserInfo().then((res) => {
          this.userInfo = res.data.result.data;
          var jsonData = {
            "avatar": res.data.result.data.avatar,
            "trueName": res.data.result.data.trueName
          }
          localStorage.setItem("userInfo", JSON.stringify(jsonData))
        });
      },
      // 获取当前登录用户信息 End

      // 退出登录 Start
      logout() {
        user.logout().then((res) => {
          localStorage.clear();
          sessionStorage.clear();
          this.$store.commit("resetState");
          this.$router.push("/login");
        });
      },
      //退出登录 End
    },
  };
</script>

<style scoped>
  .title {
    font-size: 26px;
    margin-left: 16%;
    text-shadow: 0 0.1em 0.2em black;
  }

  .tabs {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: #ffffff;
  }

  .tabs>>>.el-tabs__item:nth-child(1) span {
    display: none;
  }

  .el-container {
    padding: 0;
    margin: 0 auto;
    height: 100%;
    width: 100%;
  }

  .header-avatar {
    float: right;
    width: 260px;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .el-dropdown-link {
    cursor: pointer;
  }

  .el-header {
    background-color: #409eff;
    color: #ffffff;
    text-align: center;
    padding-top: 10px;
  }

  .el-aside {
    /* TODO　防止左侧菜单栏出现滚动条 */
    overflow: hidden;
    /* 侧边栏折叠动画速度 */
    transition: width 0.25s;
    -webkit-transition: width 0.25s;
    -moz-transition: width 0.25s;
    -o-transition: width 0.25s;
  }

  .badge_panel {
    padding-top: 2px;
  }

  .badge_item {
    margin-right: 20px;
  }

  .el-main {
    color: #333;
    padding: 0;
  }

  /* 作为el-backtop锚点使用 */
  .container {
    overflow-x: hidden;
  }

  .el-footer {
    background-color: #ffffff;
    color: rgba(51, 51, 51, 0.747);
    text-align: center;
    line-height: 60px;
  }

  .el-icon-message-solid {
    margin-bottom: 50px;
    float: right;
    font-size: 20px;
  }
</style>