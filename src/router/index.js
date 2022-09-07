import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import axios from "../utils/http/axios";
import store from "../store"
import Index from "../views/Index.vue"

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
    component: () => import('../views/Home.vue'),
    redirect: '/index',
    children: [{
        path: '/index',
        name: 'Index',
        component: Index,
        meta: {
          title: "首页"
        },
      },
      {
        path: '/userCenter',
        name: 'UserCenter',
        component: () => import('../views/framework/UserCenter.vue'),
        meta: {
          title: "个人中心"
        },
      },

      {
        path: '/in401',
        name: 'Page401',
        component: () => import('../views/error/401.vue')
      },
      {
        path: '/in404',
        name: 'Page404',
        component: () => import('../views/error/404.vue')
      },

    ]
  },
  // 外部使用
  {
    path: '/404',
    name: 'Page404',
    component: () => import('../views/error/404.vue')
  },
  {
    path: '/401',
    name: 'Page401',
    component: () => import('../views/error/401.vue')
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 防止重复点击一个路径是浏览器报路径重复的错
const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}


// 配置全局路由导航守卫
router.beforeEach((to, from, next) => {
  // 后端动态路由生成
  let hasRoute = store.state.menus.hasRoutes;
  // 判断token是否存在
  let token = localStorage.getItem("token");
  // 如果当前是登录页并且token不存在时就不管了,防止手动输入登录
  if (to.path == '/login') {
    if (!token) {
      next();
    } else {
      next('/');
    }
  }
  // token不存在的话直接跳到登录页
  else if (!token) {
    next({
      path: '/login'
    })
  }
  // 验证token存在并且hasRoute为空时去请求获取SideMenu菜单树
  else if (token && !hasRoute) {
    axios.get("/sys/menu/nav", {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    }).then(res => {
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
              // 一定要看看往哪个newRoutes数组下标路由里面加，一般按照你上面定义的每个父路由顺序来，我在此处下标0第一个是登录页
              newRoutes[1].children.push(route);
            }
          })
        }
      })
      router.addRoutes(newRoutes);
      hasRoute = true;
      store.commit("changeRouteStatus", hasRoute);
      // 都没问题的话地址请求哪里就去哪里
      next({
        path: to.path
      })
    })
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



export default router