<template>
  <el-container>
    
    <!-- 侧边菜单栏 -->
    <el-aside width="auto">
      <SideMenu></SideMenu>
    </el-aside>

    <el-container>
      <el-header>
        <!-- <strong class="title">清 枫 多 端 一 体 化 管 理 平 台</strong> -->
        <div class="header-avatar">
          
          <div class="header-search">
            <div class="search-div">
              <i class="el-icon-search" slot="suffix"></i>
              <el-autocomplete class="inline-input" v-model="searchForm.titleName" value-key="viewName"
                :fetch-suggestions="querySearch" placeholder="请输入菜单名称" :trigger-on-focus="false" @select="handleSelect">
              </el-autocomplete>
            </div>
          </div>

          <el-avatar v-if="isChangeAvatar" fit="scale-down" size="large" :src="userInfo.avatar"></el-avatar>

          <el-dropdown>
            <span class="el-dropdown-link">
              {{ userInfo.trueName }}
              <i class="el-icon-arrow-down el-icon--right"></i>
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

          <el-tooltip effect="dark" content="刷新" placement="bottom">
            <i class="el-icon-refresh" @click="reload" style="cursor:pointer;"></i>
          </el-tooltip>

          <el-tooltip effect="dark" content="全屏切换" placement="bottom">
            <i :class="screenIcon" @click="fullScreen" style="cursor:pointer;"></i>
          </el-tooltip>
        </div>
      </el-header>

      <!-- 此处class关联返回顶部操作，禁止删除 -->
      <el-main class="container" v-loading.fullscreen.lock="fullscreenLoading">
        <!-- 将tabs置顶 -->
        <Tabs class="tabs"></Tabs>

        <div style="margin: 0 1rem">
          <!-- 暂时关闭折叠动画效果 -->
          <!-- <el-collapse-transition> -->
          <!-- 中间核心界面 -->
          <router-view v-if="isRouterAlive"></router-view>
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
  import login from "@/api/login/login"
  import user from "@/api/sys/user"
  import menu from "@/api/sys/menu"

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
        // 注射方式局部刷新头像
        isChangeAvatar: true,
        screenIcon: "",
        // 首页右上角用户信息
        userInfo: {
          id: "",
          trueName: "",
          avatar: "",
        },
        searchForm: {
          titleName: ""
        },
        // 消息数量
        messageNum: "",
        restaurants: [],
        isRouterAlive: true,
        fullscreenLoading: false

      };
    },

    mounted() {
      if (this.$store.getters.getToken) {
        this.getUserInfo();
        this.getUserInfoFormLocal();
      }
      this.screenIcon = screenfull.isFullscreen ? "el-icon-crop" : "el-icon-full-screen";
    },


    methods: {
      // 局部刷新页面
      reload() {
        this.isRouterAlive = false;
        this.$nextTick(() => {
          this.isRouterAlive = true;
        })
      },
      // 全屏方法 Start
      fullScreen() {
        if (!ScreenFull.isEnabled) {
          this.$message({
            message: "您的浏览器不支持全屏操作",
            type: "warning",
          });
          return false;
        }
        ScreenFull.toggle();
        this.screenIcon = ScreenFull.isFullscreen ? "el-icon-full-screen" : "el-icon-crop";
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
        let userShow = JSON.parse(sessionStorage.getItem("userInfo"));
        if (userShow) {
          this.userInfo.trueName = userShow.trueName;
          this.userInfo.avatar = userShow.avatar;
        }

      },

      // 获取当前登录用户信息 Start
      getUserInfo() {
        user.getUserInfo().then((res) => {
          this.userInfo = res.data.result.data;
          let userData = {
            avatar: res.data.result.data.avatar,
            trueName: res.data.result.data.trueName
          }
          this.$store.commit("setUserInfo", userData);
        });
      },
      // 获取当前登录用户信息 End

      // 搜索框查询菜单跳转
      querySearch(queryString, cb) {
        let results = [{
          viewName: "",
          title: "",
          name: "",
          path: ""
        }]
        this.searchForm.titleName = queryString;
        menu.selectByMenuName(this.searchForm.titleName).then((res) => {
          this.restaurants = res.data.result.data;
          this.restaurants.forEach(function (item, index, obj) {
            results[index].viewName = item.parentTitle + " > " + item.title;
            results[index].title = item.title;
            results[index].name = item.name;
            results[index].path = item.path;
          })
          cb(results);
        })
      },

      // 搜索框选择或点击事件
      handleSelect(item) {
        this.searchForm.titleName = "";
        this.$store.commit("addTab", item);
        this.$router.push(item.path);
      },

      // 退出登录 Start
      logout() {
        login.logout().then((res) => {
          this.$store.commit("resetState");
          this.$store.commit("removeToken");
          this.$router.push("/login");
        });
      },
      //退出登录 End
    },
  };
</script>

<style scoped>
  .el-container {
    padding: 0;
    margin: 0 auto;
    height: 100%;
    width: 100%;
  }

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



  .header-avatar {
    float: right;
    width: 560px;
    display: flex;
    justify-content: space-around;
    align-items: center;

  }

  .header-search {
    width: 260px;
    text-align: right;
  }

  .search-div {
    width: 100%;
    display: inline-flex;
    align-items: center;
    flex-direction: row-reverse;
  }

  .el-icon-search {
    position: relative;
    right: 40px;
    border: 0;
    z-index: 90;
    background: Transparent;
    color: #ffffff;
  }


  .inline-input {
    width: 100%;
  }

  .inline-input>>>.el-input__inner {
    border-radius: 45px;
    background: Transparent;
    border: 2px solid #c1e1ff;
  }

  /* 设置inline-input中placeholder颜色为白色 */
  .inline-input>>>.el-input__inner::placeholder {
    color: #ffffff;
  }

  .inline-input:hover>>>.el-input__inner {
    border: 2px solid #ffffff;
    background: #038af8ed;
  }

  .el-dropdown-link {
    cursor: pointer;
    font-weight: 500;
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
<style>
  .el-loading-mask {
    z-index: 1000 !important;
  }
</style>