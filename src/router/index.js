// GEMINI_MODIFIED
/*
 * @Author: ranfenghua ranfenghua@cecinvestment.com
 * @Date: 2025-02-17 17:29:09
 * @LastEditors: ranfenghua ranfenghua@cecinvestment.com
 * @LastEditTime: 2025-02-17 17:30:39
 * @FilePath: /cq-network-admin-view/src/router/index.js
 * @Description:
 *
 * Copyright (c) 2025 by ${user.email}, All Rights Reserved.
 */
import Vue from 'vue'
import Router from 'vue-router'
import i18n from '@/i18n'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示你的根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/auth',
    component: () => import('@/views/auth'),
    hidden: true
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  { path: '/401', component: () => import('@/views/error/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: '/portal',
    hidden:true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/index'),
        name: 'Index',
        meta: { title: i18n.t('Router.Home'), icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/portal',
    component: Layout,
    redirect: '/portal/content/site',
    meta: { title: '门户管理' },
    children: [
      {
        path: 'content',
        component: () => import('@/views/cms/contentcore/content'),
        name: 'ContentManagement',
        meta: { title: '内容管理', icon: 'content' },
        children: [
          {
            path: 'site',
            component: () => import('@/views/cms/contentcore/site'),
            name: 'SiteManagement',
            meta: { title: '站点管理' }
          },
          {
            path: 'catalog',
            component: () => import('@/views/cms/contentcore/catalog'),
            name: 'CatalogManagement',
            meta: { title: '栏目管理' }
          },
          {
            path: 'contentList',
            component: () => import('@/views/cms/contentcore/contentList'),
            name: 'ContentList',
            meta: { title: '内容列表' }
          },
          {
            path: 'contentManage',
            component: () => import('@/views/cms/contentcore/contentManage'),
            name: 'ContentManage',
            meta: { title: '内容管理' }
          }
        ]
      },
      {
        path: 'service',
        component: () => import('@/views/cms/contentcore/content'),
        name: 'ServiceManagement',
        alwaysShow: true,
        meta: { title: '服务目录管理', icon: 'list' },
        children: [
          {
            path: 'digitalApp',
            component: () => import('@/views/cms/contentcore/digitalAppList'),
            name: 'DigitalAppList',
            meta: { title: '数字应用管理', icon: 'app-log' }
          },
          {
            path: 'digitalAppDetail',
            component: () => import('@/views/cms/contentcore/digitalAppDetail'),
            name: 'DigitalAppDetail',
            hidden: true,
            meta: { title: '数字应用详情', noCache: true, activeMenu: '/portal/service/digitalApp' }
          },
          {
            path: 'component',
            component: () => import('@/views/cms/contentcore/componentList'),
            name: 'ComponentList',
            meta: { title: '能力组件管理' }
          },
          {
            path: 'componentDetail',
            component: () => import('@/views/cms/contentcore/componentDetail'),
            name: 'ComponentDetail',
            hidden: true,
            meta: { title: '组件详情', noCache: true, activeMenu: '/portal/service/component' }
          },
          {
            path: 'serviceCatalog',
            component: () => import('@/views/cms/contentcore/serviceCatalogList'),
            name: 'ServiceCatalogList',
            meta: { title: '基础服务管理', icon: 'list' }
          },
          {
            path: 'serviceCatalogDetail',
            component: () => import('@/views/cms/contentcore/basicServiceDetail'),
            name: 'ServiceCatalogDetail',
            hidden: true,
            meta: { title: '服务详情', noCache: true, activeMenu: '/portal/service/serviceCatalog' }
          }
        ]
      },
      {
        path: 'auditCenter',
        component: () => import('@/views/workorder/layout'),
        name: 'AuditCenter',
        alwaysShow: true,
        meta: { title: '服务备案审核' },
        children: [
          {
            path: 'qualificationAudit',
            component: () => import('@/views/workorder/orgAudit/qualificationAudit'),
            name: 'QualificationAudit',
            meta: { title: '机构入驻审核', noCache: true }
          },
          {
            path: 'digitalAppAudit',
            component: () => import('@/views/workorder/audit/digitalAppAudit'),
            name: 'DigitalAppAudit',
            meta: { title: '数字应用审核', noCache: true }
          },
          {
            path: 'componentAudit',
            component: () => import('@/views/workorder/audit/componentAudit'),
            name: 'ComponentAudit',
            meta: { title: '能力组件审核', noCache: true }
          },
          {
            path: 'basicServiceAudit',
            component: () => import('@/views/workorder/audit/basicServiceAudit'),
            name: 'BasicServiceAudit',
            meta: { title: '基础服务审核', noCache: true }
          },
          {
            path: 'basicServiceAuditDetail',
            component: () => import('@/views/workorder/audit/basicServiceAuditDetail'),
            name: 'BasicServiceAuditDetail',
            meta: { title: '基础服务审核详情', noCache: true, activeMenu: '/portal/auditCenter/basicServiceAudit' },
            hidden: true
          },
          {
            path: 'qualificationDetail',
            component: () => import('@/views/workorder/orgAudit/qualificationDetail'),
            name: 'QualificationDetail',
            meta: { title: '机构入驻审核详情', noCache: true, activeMenu: '/portal/auditCenter/qualificationAudit' },
            hidden: true
          },
          {
            path: 'digitalAppAuditDetail',
            component: () => import('@/views/workorder/audit/digitalAppAuditDetail'),
            name: 'DigitalAppAuditDetail',
            meta: { title: '数字应用审核详情', noCache: true, activeMenu: '/portal/auditCenter/digitalAppAudit' },
            hidden: true
          },
          {
            path: 'componentAuditDetail',
            component: () => import('@/views/workorder/audit/componentAuditDetail'),
            name: 'ComponentAuditDetail',
            meta: { title: '能力组件审核详情', noCache: true, activeMenu: '/portal/auditCenter/componentAudit' },
            hidden: true
          }
        ]
      },
      {
        path: 'order',
        component: () => import('@/views/order/layout'),
        redirect: '/portal/order/list',
        name: 'PortalOrderCenter',
        alwaysShow: true,
        meta: { title: '订单管理' },
        children: [
          {
            path: 'list',
            component: () => import('@/views/order/list'),
            name: 'PortalOrderList',
            meta: { title: '所有订单' }
          },
          {
            path: 'review',
            component: () => import('@/views/order/review'),
            name: 'PortalServiceReview',
            meta: { title: '服务评价' }
          },
          {
            path: 'myTodo',
            component: () => import('@/views/order/myTodo'),
            name: 'PortalOrderMyTodo',
            hidden: true,
            meta: { title: '我的待办' }
          },
          {
            path: 'myProcessed',
            component: () => import('@/views/order/myProcessed'),
            name: 'PortalOrderMyProcessed',
            hidden: true,
            meta: { title: '我已处理' }
          },
          {
            path: 'detail',
            component: () => import('@/views/order/detail'),
            name: 'PortalOrderDetail',
            meta: { title: '订单详情', noCache: true, activeMenu: '/portal/order/list' },
            hidden: true
          },
          {
            path: 'myTodoDetail',
            component: () => import('@/views/order/myTodoDetail'),
            name: 'PortalOrderMyTodoDetail',
            meta: { title: '订单详情', noCache: true, activeMenu: '/portal/order/myTodo' },
            hidden: true
          },
          {
            path: 'myProcessedDetail',
            component: () => import('@/views/order/myProcessedDetail'),
            name: 'PortalOrderMyProcessedDetail',
            meta: { title: '订单详情', noCache: true, activeMenu: '/portal/order/myProcessed' },
            hidden: true
          }
        ]
      },
      {
        path: 'demand',
        component: () => import('@/views/order/layout'),
        name: 'DemandManagement',
        alwaysShow: true,
        meta: { title: '需求管理（V3）', icon: 'list' },
        children: [
          {
            path: 'all',
            component: () => import('@/views/order/allDemands'),
            name: 'AllDemands',
            meta: { title: '所有需求' }
          },
          {
            path: 'detail',
            component: () => import('@/views/order/allDemandsDetail'),
            name: 'AllDemandsDetail',
            meta: { title: '需求详情', noCache: true, activeMenu: '/portal/demand/all' },
            hidden: true
          }
        ]
      },
      {
        path: 'interaction',
        component: () => import('@/views/cms/contentcore/interaction'),
        name: 'InteractionManagement',
        alwaysShow: true,
        meta: { title: '互动运营', icon: 'interaction' },
        children: [
          {
            path: 'friendLink',
            component: () => import('@/views/cms/link/linkGroup'),
            name: 'FriendLinkManagement',
            meta: { title: '友链管理' }
          }
        ]
      }
    ]
  },
  {
    path: '/workorder',
    component: Layout,
    redirect: '/workorder/serviceDesk',
    meta: { title: '控制台' },
    children: [
      {
        path: 'serviceDesk',
        component: () => import('@/views/workorder/serviceDesk'),
        name: 'ServiceDesk',
        meta: { title: '服务台（V3）' }
      },
      {
          path: 'form',
          component: () => import('@/views/workorder/form'),
          name: 'WorkorderForm',
          meta: { title: '工单表单', activeMenu: '/workorder/serviceDesk', noCache: true },
          hidden: true
        },
      {
        path: 'myBills',
        component: () => import('@/views/workorder/layout'),
        name: 'MyBills',
        hidden: true,
        meta: { title: '我的单据' },
        children: [
          {
            path: 'myTodo',
            component: () => import('@/views/workorder/myTodo'),
            name: 'MyTodo',
            meta: { title: '我的待办', noCache: true }
          },
          {
            path: 'myApproval',
            component: () => import('@/views/workorder/myApproved'),
            name: 'MyApproval',
            meta: { title: '我已处理' }
          },
          {
            path: 'myInitiated',
            component: () => import(/* webpackChunkName: "myInitiated" */ '@/views/workorder/myInitiated'),
            name: 'MyInitiated',
            meta: { title: '我发起的', noCache: true }
          },
          {
            path: 'allBills',
            component: () => import('@/views/workorder/index'),
            name: 'AllBills',
            meta: { title: '所有单据' }
          },
          {
            path: 'detail',
            component: () => import('@/views/workorder/detailNew'),
            name: 'WorkorderDetail',
            meta: { title: '工单详情', noCache: true, activeMenu: '/workorder/myBills/myInitiated' }
          },
          {
            path: 'myTodoDetail',
            component: () => import('@/views/workorder/myTodoDetail'),
            name: 'MyTodoDetail',
            meta: { title: '工单处理', noCache: true, activeMenu: '/workorder/myBills/myTodo' }
          },
          {
            path: 'myApprovedDetail',
            component: () => import('@/views/workorder/myApprovedDetail'),
            name: 'MyApprovedDetail',
            meta: { title: '工单详情', noCache: true, activeMenu: '/workorder/myBills/myApproval' }
          },
          {
            path: 'allBillsDetail',
            component: () => import('@/views/workorder/allBillsDetail'),
            name: 'AllBillsDetail',
            meta: { title: '工单详情', noCache: true, activeMenu: '/workorder/myBills/allBills' }
          }
        ]
      },
      {
        path: 'processConfig',
        component: () => import('@/views/workorder/layout'),
        name: 'ProcessConfig',
        hidden: true,
        meta: { title: '流程配置' }
      },
      {
        path: 'myApps',
        component: () => import('@/views/order/myApps'),
        name: 'MyApps',
        meta: { title: '我的应用', icon: 'app-log' }
      },
      {
        path: 'myAppsDetail',
        component: () => import('@/views/order/layout'),
        name: 'MyAppsDetailLayout',
        redirect: 'noRedirect',
        meta: { title: '数字应用详情' },
        hidden: true,
        children: [
          {
            path: '',
            component: () => import('@/views/order/myAppsDetail'),
            name: 'MyAppsDetail',
            meta: { title: '数字应用详情', noCache: true, activeMenu: '/workorder/myApps' }
          }
        ]
      },
      {
        path: 'order',
        component: () => import('@/views/order/layout'),
        redirect: '/workorder/order/myInitiated',
        name: 'OrderCenter',
        alwaysShow: true,
        meta: { title: '我的订单', icon: 'list' },
        children: [
          {
            path: 'myTodo',
            component: () => import('@/views/order/myTodo'),
            name: 'OrderMyTodo',
            hidden: true,
            meta: { title: '我的待办' }
          },
          {
            path: 'myProcessed',
            component: () => import('@/views/order/myProcessed'),
            name: 'OrderMyProcessed',
            hidden: true,
            meta: { title: '我已处理' }
          },
          {
            path: 'myInitiated',
            component: () => import('@/views/order/myInitiated'),
            name: 'OrderMyInitiated',
            meta: { title: '我发起的' }
          },
          {
            path: 'myReceived',
            component: () => import('@/views/order/myInitiated'),
            name: 'OrderMyReceived',
            meta: { title: '我收到的' }
          },
          {
            path: 'list',
            component: () => import('@/views/order/list'),
            name: 'OrderList',
            meta: { title: '所有订单' }
          },
          {
            path: 'review',
            component: () => import('@/views/order/review'),
            name: 'ServiceReview',
            meta: { title: '服务评价' }
          },
          {
            path: 'detail',
            component: () => import('@/views/order/detail'),
            name: 'OrderDetail',
            meta: { title: '订单详情', noCache: true, activeMenu: '/workorder/order/list' },
            hidden: true
          },
          {
            path: 'myTodoDetail',
            component: () => import('@/views/order/myTodoDetail'),
            name: 'OrderMyTodoDetail',
            meta: { title: '订单详情', noCache: true, activeMenu: '/workorder/order/myTodo' },
            hidden: true
          },
          {
            path: 'myProcessedDetail',
            component: () => import('@/views/order/myProcessedDetail'),
            name: 'OrderMyProcessedDetail',
            meta: { title: '订单详情', noCache: true, activeMenu: '/workorder/order/myProcessed' },
            hidden: true
          },
          {
            path: 'myInitiatedDetail',
            component: () => import('@/views/order/myInitiatedDetail'),
            name: 'OrderMyInitiatedDetail',
            meta: { title: '订单详情', noCache: true, activeMenu: '/workorder/order/myInitiated' },
            hidden: true
          }
        ]
      },
      {
        path: 'myDemand',
        component: () => import('@/views/order/layout'),
        name: 'MyDemand',
        alwaysShow: true,
        meta: { title: '我的需求（V3）', icon: 'list' },
        children: [
          {
            path: 'initiate',
            component: () => import('@/views/order/myDemandInitiate'),
            name: 'MyDemandInitiate',
            meta: { title: '发起需求' }
          },
          {
            path: 'initiateDetail',
            component: () => import('@/views/order/myDemandInitiateDetail'),
            name: 'MyDemandInitiateDetail',
            meta: { title: '需求详情', noCache: true, activeMenu: '/workorder/myDemand/initiate' },
            hidden: true
          },
          {
            path: 'response',
            component: () => import('@/views/order/myDemandResponse'),
            name: 'MyDemandResponse',
            meta: { title: '响应需求' }
          },
          {
            path: 'allDetail',
            component: () => import('@/views/order/myDemandAllDetail'),
            name: 'MyDemandAllDetail',
            meta: { title: '需求详情', noCache: true, activeMenu: '/workorder/myDemand/response' },
            hidden: true
          },
          {
            path: 'responseDetail',
            component: () => import('@/views/order/myDemandResponseDetail'),
            name: 'MyDemandResponseDetail',
            meta: { title: '响应详情', noCache: true, activeMenu: '/workorder/myDemand/response' },
            hidden: true
          }
        ]
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    meta: { title: '系统管理' },
    children: [
      {
        path: '',
        component: () => import('@/views/system/index'),
        name: 'SystemIndex',
        meta: { title: '系统管理' }
      },
      {
        path: 'operlog',
        component: () => import('@/views/system/operlog'),
        name: 'SystemOperLog',
        meta: { noCache: true, title: '操作日志' }
      },
      {
        path: 'accesslog',
        component: () => import('@/views/system/accesslog'),
        name: 'SystemAccessLog',
        meta: { noCache: true, title: '访问日志' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index'),
        name: 'Profile',
        meta: { title: i18n.t('Router.AccountCenter'), icon: 'user' }
      },
      {
        path: 'preference',
        component: () => import('@/views/system/user/userPreference'),
        name: 'UserPreference',
        meta: { title: i18n.t('Router.UserPreference'), icon: 'user' }
      }
    ]
  },
  {
    path: '/cms/preview',
    component: () => import('@/views/cms/contentcore/preview'),
    hidden: true,
    name: 'ContentCorePreview'
  },
  {
    path: '/cms/content/editorW',
    component: () => import('@/views/cms/contentcore/contentEditor'),
    hidden: true,
    name: 'CMSContentEditorW',
    meta: { title: i18n.t('CMS.ContentCore.Route.EditContent') }
  },
  {
    path: '/cms',
    component: Layout,
    hidden: true,
    redirect: '/cms/site',
    children: [
      {
        path: 'site/tabs',
        component: () => import('@/views/cms/contentcore/siteTab'),
        name: 'CMSSiteTab',
        meta: { noCache: true, title: i18n.t('CMS.ContentCore.Route.EditSite'), activeMenu: '/cms/site'}
      },
      {
        path: 'template/editor',
        component: () => import('@/views/cms/contentcore/templateEditor'),
        name: 'CMSTemplateEditor',
        meta: { noCache: true, title: i18n.t('CMS.ContentCore.Route.EditTemplate'), activeMenu: '/configs/template'}
      },
      {
        path: 'file/editor',
        component: () => import('@/views/cms/contentcore/fileEditor'),
        name: 'CMSFileEditor',
        meta: { noCache: true, title: i18n.t('CMS.ContentCore.Route.EditFile'), activeMenu: '/configs/file'}
      },
      {
        path: 'content/editor',
        component: () => import('@/views/cms/contentcore/contentEditor'),
        name: 'CMSContentEditor',
        meta: { noCache: true, title: i18n.t('CMS.ContentCore.Route.EditContent'), activeMenu: '/configs/content'}
      },
      {
        path: 'digitalAppList',
        component: () => import('@/views/cms/contentcore/digitalAppList'),
        name: 'CMSDigitalAppList',
        meta: { noCache: true, title: '数字应用管理', activeMenu: '/cms/digitalAppList'}
      },

    ]
  },
  {
    path: '/operations',
    component: Layout,
    hidden: true,
    redirect: '/operations/link',
    children: [
      {
        path: 'link/list',
        component: () => import('@/views/cms/link/link'),
        name: 'CmsLink',
        meta: { noCache: true, title: i18n.t('CMS.FriendLink.RouteLinkList'), activeMenu: '/operations/link'}
      }
    ]
  }
]

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
]

// 防止连续点击多次路由报错
let routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(err => err)
}

export default new Router({
  base: process.env.VUE_APP_PATH,
  mode: 'hash', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
