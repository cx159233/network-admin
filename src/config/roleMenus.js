// 角色与可见菜单的映射
// 角色：admin（运营管理）、developer（开发者）、org（机构用户）
// 每个角色的菜单结构跟 sidebarRoutes 一致（顶层 path + children）

// 顶层路由 path 常量
const PORTAL = '/portal'
const WORKORDER = '/workorder'
const SYSTEM = '/system'

// 运营管理：门户管理扁平化为一级菜单（内容管理、服务目录管理、服务审核管理、服务开通管理、需求管理、互动运营）+ 系统管理
const adminRoleMenus = [
  {
    path: PORTAL,
    flatten: true,
    children: [
      { path: 'content' },
      { path: 'service' },
      { path: 'auditCenter' },
      { path: 'order' },
      { path: 'orgCollaboration', children: [{ path: 'list' }] },
      { path: 'demand' }
    ]
  },
  {
    path: SYSTEM,
    children: []
  }
]

// 开发者：控制台 - 我的应用、我的订单（我收到的）、我的需求（响应需求）
const developerRoleMenus = [
  {
    path: WORKORDER,
    title: '服务管理',
    children: [
      { path: 'myApps' },
      { path: 'order', children: [{ path: 'myInitiated' }] },
      { path: 'myDemand', children: [{ path: 'response' }] }
    ]
  }
]

// 机构用户：控制台/服务台、我的订单（我发起的）、我的需求（发起需求）
const orgRoleMenus = [
  {
    path: WORKORDER,
    children: [
      { path: 'serviceDesk' },
      { path: 'order', children: [{ path: 'mySubscriptions' }] },
      { path: 'myDemand', children: [{ path: 'initiate' }] }
    ]
  }
]

export const roleMenuConfig = {
  admin: adminRoleMenus,
  developer: developerRoleMenus,
  org: orgRoleMenus
}

export const roleLabels = {
  admin: { label: '运营用户', orgName: '运营管理平台（卫健及运营单位）' },
  developer: { label: '服务商/厂商', orgName: '开发者工作台（服务商/厂商）' },
  org: { label: '医疗机构', orgName: '机构工作台（医疗机构）' }
}

export const roleList = [
  { key: 'admin', ...roleLabels.admin },
  { key: 'developer', ...roleLabels.developer },
  { key: 'org', ...roleLabels.org }
]

// 根据 role 配置过滤完整菜单树
export function filterMenusByRole(allMenus, role) {
  const config = roleMenuConfig[role]
  if (!config) return allMenus
  const result = []
  allMenus.forEach(topRoute => {
    const cfg = config.find(c => c.path === topRoute.path)
    if (!cfg) return
    // 支持 title 覆盖
    if (cfg.title) {
      topRoute = { ...topRoute, meta: { ...topRoute.meta, title: cfg.title } }
    }
    // 扁平化：把父级的 children 提升为一级菜单，path 改为绝对路径
    if (cfg.flatten) {
      const base = topRoute.path.replace(/\/$/, '')
      const promoted = (topRoute.children || [])
        .filter(child => !child.hidden)
        .map(child => {
          const childCfg = cfg.children && cfg.children.find(cc => cc.path === child.path)
          const absolutePath = `${base}/${child.path}`.replace(/\/+/g, '/')
          let filteredGrandChildren = child.children || []
          if (childCfg && childCfg.children && childCfg.children.length > 0) {
            filteredGrandChildren = filteredGrandChildren.filter(gc => childCfg.children.some(gcc => gcc.path === gc.path))
          }
          return { ...child, path: absolutePath, children: filteredGrandChildren }
        })
      result.push(...promoted)
      return
    }
    if (!cfg.children || cfg.children.length === 0) {
      result.push(topRoute)
      return
    }
    const filteredChildren = topRoute.children
      ? topRoute.children
          .map(child => {
            const childCfg = cfg.children.find(cc => cc.path === child.path)
            if (!childCfg) return null
            if (!childCfg.children || childCfg.children.length === 0) {
              return child
            }
            const filteredGrandChildren = child.children
              ? child.children.filter(gc => childCfg.children.some(gcc => gcc.path === gc.path))
              : []
            return { ...child, children: filteredGrandChildren }
          })
          .filter(Boolean)
      : []
    result.push({ ...topRoute, children: filteredChildren })
  })
  return result
}
