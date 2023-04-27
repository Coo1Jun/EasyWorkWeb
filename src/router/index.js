import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import TopPage from '@/layout/top-page'

/**
 * 注意：子菜单仅在路由children.length>=1时出现
 * 详细见: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   如果设置为true，项目将不会显示在侧边栏中（默认值为false）
 * alwaysShow: true               如果设置为true，将始终显示root菜单
 *                                如果未设置alwaysShow，则当项目具有多个子路由时，
 *                                它将变成嵌套模式，否则不显示root菜单
 * redirect: noRedirect           如果设置为noRedirect，则不会在面包屑中重定向
 * name:'router-name'             该名称由<keep-alive>使用 (必须设置！！！)
 * meta : {
    roles: ['admin','editor']    控制页面角色（您可以设置多个角色）
    title: 'title'               侧边栏和面包屑中显示的名称（推荐设置）
    icon: 'svg-name'/'el-icon-x' 侧边栏中显示的图标
    breadcrumb: false            如果设置为false，则该项将隐藏在breadcrumb中（默认值为true）
    activeMenu: '/example/list'  如果设置了路径，侧边栏将突出显示您设置的路径
  }
 */

/**
 * constantRoutes
 * 没有权限要求的基本页
 * 所有角色都可以访问
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },

  {
    path: '/login',
    name: 'Login',
    component: TopPage,
    hidden: true
  },
  {
    path: '/signup',
    name: 'Signup',
    component: TopPage,
    hidden: true
  },
  {
    path: '/forgot',
    name: 'Forgot',
    component: TopPage,
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // ****************** 以下是侧边栏显示内容 ********************
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '工作台', icon: 'el-icon-house' }
    }]
  },

  {
    path: '/mission',
    component: Layout,
    name: 'Mission',
    redirect: '/mission/projects',
    meta: { title: '项目', icon: 'el-icon-document' },
    children: [
      {
        hidden: true,
        path: 'projects',
        name: 'Projects',
        component: () => import('@/views/projects/index')
      },
      {
        hidden: true,
        path: 'projects/details',
        name: 'Details',
        component: () => import('@/views/planboard/index'),
        meta: { title: '概览' }
      }
    ]
  },

  {
    path: '/message',
    component: Layout,
    children: [
      {
        path: 'chat',
        name: 'Chat',
        component: () => import('@/views/chat/index'),
        meta: { title: '聊天', icon: 'el-icon-chat-dot-square' }
      }
    ]
  },

  {
    path: '/calendar',
    component: Layout,
    children: [
      {
        path: 'my',
        name: 'My',
        component: () => import('@/views/calendar/index'),
        meta: { title: '日历', icon: 'el-icon-date' }
      }
    ]
  },

  {
    path: '/drive',
    component: Layout,
    children: [
      {
        path: 'personal',
        name: 'Personal',
        component: () => import('@/views/disk/index'),
        meta: { title: '网盘', icon: 'el-icon-folder-opened' }
      }
    ]
  },

  {
    path: '/contacts',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Contacts',
        component: () => import('@/views/addressbook/index'),
        meta: { title: '通讯录', icon: 'el-icon-notebook-2' }
      }
    ]
  },

  {
    path: '/console',
    name: 'Console',
    component: Layout,
    redirect: '/console/group',
    meta: { title: '项目组', icon: 'el-icon-user' },
    // meta: { title: '管理后台', icon: 'el-icon-setting' },
    children: [
      {
        path: 'account',
        name: 'Account',
        hidden: true,
        component: () => import('@/views/account/index'),
        meta: { title: '账户资料设置' }
      },
      // {
      //   path: 'department',
      //   name: 'Department',
      //   component: () => import('@/views/department/index'),
      //   meta: { title: '部门', icon: 'department' },
      //   children: [
      //     {
      //       hidden: true,
      //       path: 'member',
      //       name: 'Member',
      //       component: () => import('@/views/department/member/index'),
      //       meta: { title: '成员' }
      //     }
      //   ]
      // },
      {
        hidden: true,
        path: 'group',
        name: 'Group',
        component: () => import('@/views/group/index'),
        // meta: { title: '组', icon: 'el-icon-user' },
        children: [
          {
            hidden: true,
            path: 'member',
            name: 'GroupMember',
            component: () => import('@/views/group/member/index'),
            meta: { title: '项目组成员' }
          }
        ]
      }
    ]
  },

  // 404页必须放在末尾！！！
  { path: '*', redirect: '/404', hidden: true }
]

/**
 * 需要根据用户角色动态加载的路由
 */
export const asyncRoutes = []

const createRouter = () => new Router({
  // mode: 'history', // 需要服务支持
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
