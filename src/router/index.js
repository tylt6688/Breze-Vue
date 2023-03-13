import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store"
import axios from "@/utils/http"

import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'


Vue.use(VueRouter);

const routes = [{
    path: '/login',
    name: 'Login',
    meta: {
      title: "登录"
    },
    component: Login
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/dashboard',
    children: [{
        path: '/dashboard',
        name: 'DashBoard',
        component: () => import('@/views/framework/DashBoard.vue'),
        meta: {
          title: "仪表盘"
        },
      },
      {
        path: '/user_center',
        name: 'UserCenter',
        component: () => import('@/views/framework/UserCenter.vue'),
        meta: {
          title: "个人中心"
        },
      },

    ]
  },
  // 错误页面  
  {
    path: '/401',
    name: '401Page',
    component: () => import('@/views/error/401.vue')
  },
  {
    path: '/403',
    name: '403Page',
    component: () => import('@/views/error/403.vue')
  },
  {
    path: '/404',
    name: '404Page',
    component: () => import('@/views/error/404.vue')
  },

]

// 设置路由模式为history
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


// 配置全局路由导航守卫
router.beforeEach((to, from, next) => {
  // 后端动态路由生成
  let hasRoute = store.state.menus.hasRoutes;

  let token = localStorage.getItem("token");
  // 如果当前是登录页并且token为空时就去登录页,不为空且正确时直接跳转主页,防止手动输入登录地址时不跳转情况
  if (token) {
    if (to.path == '/login') {
      next('/');
    }
    // 验证token不为空并且hasRoute为空时去请求获取SideMenu菜单树
    else if (!hasRoute) {
      axios.get("/sys/menu/nav").then(res => {
        // 传递给Home页面一个触发事件，让Home页面去更新加载用户信息
        // bus.$emit('LoadUserInfo');
        // 拿到menuList
        store.commit("setMenuList", res.data.result.data.nav);
        // 拿到用户权限
        store.commit("setPermList", res.data.result.data.authority);
        // 动态绑定路由
        let newRoutes = router.options.routes;
        res.data.result.data.nav.forEach(menu => {
          if (menu.children) {
            menu.children.forEach(e => {
              // 转成路由
              let route = menuToRoute(e);
              // 把路由添加到路由管理中
              if (route) {
                // 一定要看看往哪个newRoutes数组下标路由里面加，一般按照你上面定义的每个父级路由顺序来，我在此处下标[0]第一个是登录页
                newRoutes[1].children.push(route);
              }
            })
          }
        })
        router.addRoutes(newRoutes);
        hasRoute = true;
        store.commit("changeRouteState", hasRoute);
        // 加载Portal首页管理模块路由
        loadModeRoutes();
        // 都没问题的话地址请求哪里就去哪里
        next({
          path: to.path
        })
      })
    }
  } else {
    // token为空的话直接跳到登录页
    next();
  }
  // 每个页面的浏览器标签名称显示
  to.meta.title && (document.title = "清枫Breze—" + to.meta.title);
  next();
})


// 导航转成路由
const menuToRoute = (menu) => {
  if (!menu.component) {
    return null
  }
  // TODO 查看转成路由的menu
  console.log("查看转成路由的menu", menu);
  let route = {
    name: menu.name,
    path: menu.path,
    meta: {
      icon: menu.icon,
      title: menu.title
    }
  }
  route.component = () => import('@/views/' + menu.component + '.vue')
  return route
}


// 首页管理模块路由
async function loadModeRoutes() {
  let modeRoutes = []
  let res = await axios.get("/breze/portal/modeCard/select");
  let modeList = res.data.result.data;

  modeList.forEach(mode => {
    modeRoutes.push({
      name: mode.modeComponent,
      path: mode.modeLink,
      meta: {
        title: mode.modeTitle
      },
      component: () => import('@/views/' + mode.modeComponent + '.vue')
    })
  })
  modeRoutes.forEach(route => {
    router.addRoute('Home', route);
  })
}

// 防止重复点击一个路径是浏览器报路径重复的错
const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

export default router