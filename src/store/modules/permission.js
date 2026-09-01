import auth from '@/plugins/auth'
import router, { constantRoutes, dynamicRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'
import InnerLink from '@/layout/components/InnerLink'

// Vite 通过 import.meta.glob 预扫描所有 views，运行时用相对路径 key 查找动态 import 函数
const viewModules = import.meta.glob('/src/views/**/*.vue')

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
        meta: { title: '内容管理', icon: 'resource' },
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
          },
          {
            name: 'FriendLinkManagement',
            path: 'friendLink',
            component: 'cms/link/linkGroup',
            meta: { title: '友链管理', icon: 'link' }
          }
        ]
      },
      {
        name: 'ServiceManagement',
        path: 'service',
        component: 'cms/contentcore/content',
        alwaysShow: true,
        meta: { title: '服务目录管理', icon: 'component' },
        children: [
          {
            name: 'DigitalAppList',
            path: 'digitalApp',
            component: 'cms/contentcore/digitalAppList',
            meta: { title: '数字应用管理', icon: 'app-log' }
          },
          {
            name: 'SecurityServiceList',
            path: 'securityService',
            component: 'cms/contentcore/securityServiceList',
            meta: { title: '安全服务管理', icon: 'shield' }
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
            meta: { title: '基础服务管理', icon: 'server' }
          }
        ]
      },
      {
        name: 'AuditCenter',
        path: 'auditCenter',
        component: 'workorder/layout',
        alwaysShow: true,
        meta: { title: '服务审核管理', icon: 'shield' },
        children: [
          {
            name: 'QualificationAudit',
            path: 'qualificationAudit',
            component: 'workorder/orgAudit/qualificationAudit',
            meta: { title: '机构入驻审核', icon: 'people' }
          },
          {
            name: 'DigitalAppAudit',
            path: 'digitalAppAudit',
            component: 'workorder/audit/digitalAppAudit',
            meta: { title: '数字应用审核', icon: 'checkbox' }
          },
          {
            name: 'SecurityServiceAudit',
            path: 'securityServiceAudit',
            component: 'workorder/audit/securityServiceAudit',
            meta: { title: '安全服务审核', icon: 'checkbox' }
          },
          {
            name: 'ComponentAudit',
            path: 'componentAudit',
            component: 'workorder/audit/componentAudit',
            meta: { title: '能力组件审核', icon: 'checkbox' }
          },
          {
            name: 'BasicServiceAudit',
            path: 'basicServiceAudit',
            component: 'workorder/audit/basicServiceAudit',
            meta: { title: '基础服务审核', icon: 'checkbox' }
          }
        ]
      },
      {
        name: 'OrderCenterAdmin',
        path: 'order',
        component: 'order/layout',
        redirect: '/portal/order/list',
        alwaysShow: true,
        meta: { title: '服务开通管理', icon: 'monitor' },
        children: [
          {
            name: 'OrderList',
            path: 'list',
            component: 'order/list',
            meta: { title: '服务开通列表', icon: 'list' }
          },
          {
            name: 'ServiceReview',
            path: 'review',
            component: 'order/review',
            meta: { title: '质量评价管理', icon: 'star' }
          },
          {
            name: 'OrderMyTodo',
            path: 'myTodo',
            component: 'order/myTodo',
            hidden: true,
            meta: { title: '我的待办', icon: 'date' }
          },
          {
            name: 'OrderMyProcessed',
            path: 'myProcessed',
            component: 'order/myProcessed',
            hidden: true,
            meta: { title: '我已处理', icon: 'time' }
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
      },
      {
        name: 'OrgCollaboration',
        path: 'orgCollaboration',
        component: 'order/layout',
        alwaysShow: true,
        meta: { title: '机构协同管理', icon: 'home' },
        children: [
          {
            name: 'OrgCollaborationList',
            path: 'list',
            component: 'order/orgCollaboration',
            meta: { title: '机构列表' }
          }
        ]
      },
      {
        name: 'DemandManagement',
        path: 'demand',
        component: 'order/layout',
        alwaysShow: true,
        meta: { title: '需求管理', icon: 'form' },
        children: [
          {
            name: 'AllDemands',
            path: 'all',
            component: 'order/allDemands',
            meta: { title: '所有需求', icon: 'list' }
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
    meta: { title: '概览', icon: 'monitor' },
    children: [
      {
        name: 'ServiceDesk',
        path: 'serviceDesk',
        component: 'workorder/serviceDesk',
        meta: { title: '工作台', icon: 'home' }
      },
      {
        name: 'MyBills',
        path: 'myBills',
        component: 'workorder/layout',
        hidden: true,
        meta: { title: '我的单据', icon: 'file-text' },
        children: [
          {
            name: 'MyInitiated',
            path: 'myInitiated',
            component: 'workorder/index',
            meta: { title: '我发起的', icon: 'upload' }
          }
        ]
      },
      {
        name: 'MyApps',
        path: 'myApps',
        component: 'order/myApps',
        meta: { title: '服务上架', icon: 'form' }
      },
      {
        name: 'OrderCenter',
        path: 'order',
        component: 'order/layout',
        redirect: '/workorder/order/myInitiated',
        alwaysShow: true,
        meta: { title: '开通管理', icon: 'tab' },
        children: [
          {
            name: 'OrderMySubscriptions',
            path: 'mySubscriptions',
            component: 'order/mySubscriptions',
            meta: { title: '服务开通', icon: 'upload' }
          },
          {
            name: 'OrderMyInitiated',
            path: 'myInitiated',
            component: 'order/myInitiated',
            meta: { title: '开通记录', icon: 'upload' }
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
      },
      {
        name: 'MyDemand',
        path: 'myDemand',
        component: 'order/layout',
        alwaysShow: true,
        meta: { title: '需求管理', icon: 'form' },
        children: [
          {
            name: 'MyDemandInitiate',
            path: 'initiate',
            component: 'order/myDemandInitiate',
            meta: { title: '需求发起', icon: 'form' }
          },
          {
            name: 'MyDemandResponse',
            path: 'response',
            component: 'order/myDemandResponse',
            meta: { title: '需求响应', icon: 'message' }
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
        name: 'SystemDict',
        path: 'dict',
        component: 'system/dict',
        meta: { title: '字典管理', icon: 'dict' }
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
        const sdata = JSON.parse(JSON.stringify(allMenus))
        const rdata = JSON.parse(JSON.stringify(allMenus))
        const sidebarRoutes = filterAsyncRouter(sdata)
        const rewriteRoutes = filterAsyncRouter(rdata)
        const asyncRoutes = filterDynamicRoutes(dynamicRoutes);
        rewriteRoutes.push({ path: '/:pathMatch(.*)*', redirect: '/404', hidden: true })
        asyncRoutes.forEach(route => {
          router.addRoute(route)
        })
        commit('SET_ROUTES', rewriteRoutes)
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
  return () => viewModules[`/src/views/${view}.vue`]()
}

export default permission
