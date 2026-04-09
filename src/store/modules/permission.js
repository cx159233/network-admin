import auth from '@/plugins/auth'
import router, { constantRoutes, dynamicRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'
import InnerLink from '@/layout/components/InnerLink'

// 写死的完整菜单数据
const allMenus = [
  {
    name: 'Portal',
    path: '/portal',
    component: 'Layout',
    alwaysShow: true,
    meta: { title: '门户管理', icon: 'monitor' },
    children: [
      {
        name: 'ContentManagement',
        path: 'content',
        component: 'cms/contentcore/content',
        meta: { title: '内容管理', icon: 'content' },
        children: [
          {
            name: 'SiteManagement',
            path: 'site',
            component: 'cms/contentcore/site',
            meta: { title: '站点管理', icon: 'site-setting' }
          },
          {
            name: 'CatalogManagement',
            path: 'catalog',
            component: 'cms/contentcore/catalog',
            meta: { title: '栏目管理', icon: 'catalog' }
          },
          {
            name: 'ContentList',
            path: 'contentList',
            component: 'cms/contentcore/contentList',
            meta: { title: '内容列表', icon: 'list' },
            hidden: true
          },
          {
            name: 'ContentManage',
            path: 'contentManage',
            component: 'cms/contentcore/contentManage',
            meta: { title: '内容管理', icon: 'edit' }
          }
        ]
      },
      {
        name: 'ServiceManagement',
        path: 'service',
        component: 'cms/contentcore/content',
        alwaysShow: true,
        meta: { title: '服务管理', icon: 'list' },
        children: [
          {
            name: 'DigitalAppList',
            path: 'digitalApp',
            component: 'cms/contentcore/digitalAppList',
            meta: { title: '数字应用管理', icon: 'app-log' }
          },
          {
            name: 'ComponentList',
            path: 'component',
            component: 'cms/contentcore/componentList',
            meta: { title: '能力组件管理', icon: 'component' }
          },
          {
            name: 'ServiceCatalogList',
            path: 'serviceCatalog',
            component: 'cms/contentcore/serviceCatalogList',
            meta: { title: '服务目录', icon: 'list' }
          }
        ]
      },
      {
        name: 'InteractionManagement',
        path: 'interaction',
        component: 'cms/contentcore/interaction',
        alwaysShow: true,
        meta: { title: '互动运营', icon: 'link' },
        children: [
          {
            name: 'FriendLinkManagement',
            path: 'friendLink',
            component: 'cms/link/linkGroup',
            meta: { title: '友链管理', icon: 'link' }
          }
        ]
      },
      {
        name: 'AuditCenter',
        path: 'auditCenter',
        component: 'workorder/layout',
        alwaysShow: true,
        meta: { title: '审核管理', icon: 'tree' },
        children: [
          {
            name: 'QualificationAudit',
            path: 'qualificationAudit',
            component: 'workorder/orgAudit/qualificationAudit',
            meta: { title: '机构入驻审核', icon: 'form' }
          },
          {
            name: 'DigitalAppAudit',
            path: 'digitalAppAudit',
            component: 'workorder/audit/digitalAppAudit',
            meta: { title: '数字应用审核', icon: 'form' }
          },
          {
            name: 'ComponentAudit',
            path: 'componentAudit',
            component: 'workorder/audit/componentAudit',
            meta: { title: '能力组件审核', icon: 'form' }
          }
        ]
      },
      {
        name: 'OrderCenterAdmin',
        path: 'order',
        component: 'order/layout',
        redirect: '/workorder/order/list',
        alwaysShow: true,
        meta: { title: '订单管理', icon: 'list' },
        children: [
          {
            name: 'OrderList',
            path: 'list',
            component: 'order/list',
            meta: { title: '所有订单', icon: 'list' }
          },
          {
            name: 'ServiceReview',
            path: 'review',
            component: 'order/review',
            meta: { title: '服务评价', icon: 'star' }
          },
          {
            name: 'OrderMyTodo',
            path: 'myTodo',
            component: 'order/myTodo',
            hidden: true,
            meta: { title: '我的待办', icon: 'form' }
          },
          {
            name: 'OrderMyProcessed',
            path: 'myProcessed',
            component: 'order/myProcessed',
            hidden: true,
            meta: { title: '我已处理', icon: 'form' }
          },
          {
            name: 'OrderMyTodoDetail',
            path: 'myTodoDetail',
            component: 'order/myTodoDetail',
            meta: { title: '订单详情' },
            hidden: true
          },
          {
            name: 'OrderMyProcessedDetail',
            path: 'myProcessedDetail',
            component: 'order/myProcessedDetail',
            meta: { title: '订单详情' },
            hidden: true
          }
        ]
      }
    ]
  },
  {
    name: 'Workorder',
    path: '/workorder',
    component: 'Layout',
    alwaysShow: true,
    meta: { title: '控制台', icon: 'form' },
    children: [
      {
        name: 'ServiceDesk',
        path: 'serviceDesk',
        component: 'workorder/serviceDesk',
        meta: { title: '服务台', icon: 'form' }
      },
      {
        name: 'MyBills',
        path: 'myBills',
        component: 'workorder/layout',
        hidden: true,
        meta: { title: '我的单据', icon: 'form' },
        children: [
          {
            name: 'MyInitiated',
            path: 'myInitiated',
            component: 'workorder/index',
            meta: { title: '我发起的', icon: 'form' }
          }
        ]
      },
      {
        name: 'MyApps',
        path: 'myApps',
        component: 'order/myApps',
        meta: { title: '我的应用', icon: 'app-log' }
      },
      {
        name: 'OrderCenter',
        path: 'order',
        component: 'order/layout',
        redirect: '/workorder/order/myInitiated',
        alwaysShow: true,
        meta: { title: '我的订单', icon: 'list' },
        children: [
          {
            name: 'OrderMyInitiated',
            path: 'myInitiated',
            component: 'order/myInitiated',
            meta: { title: '我发起的', icon: 'form' }
          },
          {
            name: 'OrderDetail',
            path: 'detail',
            component: 'order/detail',
            meta: { title: '订单详情' },
            hidden: true
          },
          {
            name: 'OrderMyInitiatedDetail',
            path: 'myInitiatedDetail',
            component: 'order/myInitiatedDetail',
            meta: { title: '订单详情' },
            hidden: true
          }
        ]
      }
    ]
  },
  {
    name: 'System',
    path: '/system',
    component: 'Layout',
    alwaysShow: true,
    meta: { title: '系统管理', icon: 'system' },
    children: [
      {
        name: 'SystemIndex',
        path: '',
        component: 'system/index',
        meta: { title: '系统管理', icon: 'system' }
      },
      {
        name: 'SystemOperLog',
        path: 'operlog',
        component: 'system/operlog',
        meta: { title: '操作日志' }
      },
      {
        name: 'SystemAccessLog',
        path: 'accesslog',
        component: 'system/accesslog',
        meta: { title: '访问日志' }
      }
    ]
  }
]

const permission = {
  state: {
    routes: [],
    addRoutes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    },
    SET_DEFAULT_ROUTES: (state, routes) => {
      state.defaultRoutes = constantRoutes.concat(routes)
    },
    SET_TOPBAR_ROUTES: (state, routes) => {
      state.topbarRouters = routes
    },
    SET_SIDEBAR_ROUTERS: (state, routes) => {
      state.sidebarRouters = routes
    },
  },
  actions: {
    // 生成路由 - 使用写死的菜单数据
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
        // 使用写死的菜单数据
        const sdata = JSON.parse(JSON.stringify(allMenus))
        const rdata = JSON.parse(JSON.stringify(allMenus))
        const sidebarRoutes = filterAsyncRouter(sdata)
        const rewriteRoutes = filterAsyncRouter(rdata, false, true)
        const asyncRoutes = filterDynamicRoutes(dynamicRoutes);
        rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true })
        router.addRoutes(asyncRoutes);
        commit('SET_ROUTES', rewriteRoutes)
        // 将所有菜单原样添加到侧边栏路由，在Sidebar组件中根据当前路由过滤显示
        commit('SET_SIDEBAR_ROUTERS', sidebarRoutes)
        commit('SET_DEFAULT_ROUTES', sidebarRoutes)
        commit('SET_TOPBAR_ROUTES', sidebarRoutes)
        resolve(rewriteRoutes)
      })
    }
  }
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = []
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      } else {
        // 处理非ParentView的子路由
        el.children.forEach(c => {
          if (lastRouter) {
            c.path = lastRouter.path + '/' + el.path + '/' + c.path
          } else {
            c.path = el.path + '/' + c.path
          }
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes) {
  const res = []
  routes.forEach(route => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route)
      }
    } else if (route.roles) {
      if (auth.hasRoleOr(route.roles)) {
        res.push(route)
      }
    }
  })
  return res
}

export const loadView = (view) => {
  if (process.env.NODE_ENV === 'development') {
    return (resolve) => require([`@/views/${view}`], resolve)
  } else {
    // 使用 import 实现生产环境的路由懒加载
    return () => import(`@/views/${view}`)
  }
}

export default permission
