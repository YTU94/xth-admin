import Main from '@/view/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/components',
    name: 'components',
    meta: {
      icon: 'logo-buffer',
      title: '活动'
    },
    component: Main,
    children: [
      {
        path: 'markdown_page',
        name: 'markdown_page',
        meta: {
          icon: 'logo-markdown',
          title: 'Markdown编辑器'
        },
        component: () => import('@/view/components/markdown/markdown.vue')
      },
      {
        path: 'editor_page',
        name: 'editor_page',
        meta: {
          icon: 'ios-create',
          title: '富文本编辑器'
        },
        component: () => import('@/view/components/editor/editor.vue')
      }
    ]
  },
  {
    path: '/excel',
    name: 'excel',
    meta: {
      icon: 'ios-stats',
      title: 'EXCEL导入导出'
    },
    component: Main,
    children: [
      {
        path: 'upload-excel',
        name: 'upload-excel',
        meta: {
          icon: 'ios-cube',
          title: '导入EXCEL'
        },
        component: () => import('@/view/excel/upload-excel.vue')
      },
      {
        path: 'export-excel',
        name: 'export-excel',
        meta: {
          icon: 'md-download',
          title: '导出EXCEL'
        },
        component: () => import('@/view/excel/export-excel.vue')
      }
    ]
  },
  {
    path: '/venue',
    name: 'venue',
    component: Main, 
    children: [
      {
        path: 'venue',
        name: 'venue',
        meta: {
          icon: 'ios-cube',
          title: '场馆'
        },
        component: () => import('@/view/venue/index.vue')
      }
    ] 
  },
  {
    path: '/coach',
    name: 'coach',
    component: Main, 
    children: [
      {
        path: 'coach',
        name: 'coach',
        meta: {
          icon: 'ios-cube',
          title: '教练'
        },
        component: () => import('@/view/coach/index.vue')
      }
    ] 
  },
  {
    path: '/coupons',
    name: 'coupons',
    component: Main, 
    children: [
      {
        path: 'coupons',
        name: 'coupons',
        meta: {
          icon: 'ios-cube',
          title: '优惠卷'
        },
        component: () => import('@/view/coupons/index.vue')
      }
    ] 
  },
  {
    path: '/city',
    name: 'city',
    component: Main, 
    children: [
      {
        path: 'city',
        name: 'city',
        meta: {
          icon: 'ios-cube',
          title: '城市'
        },
        component: () => import('@/view/city/index.vue')
      }
    ] 
  },
  {
    path: '/users',
    name: 'users',
    component: Main, 
    children: [
      {
        path: 'users',
        name: 'users',
        meta: {
          icon: 'ios-cube',
          title: '用户'
        },
        component: () => import('@/view/users/index.vue')
      }
    ] 
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/venue/index.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
