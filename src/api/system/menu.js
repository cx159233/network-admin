// 查询菜单列表
export function listMenu(query) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: [
      { menuId: 1, menuName: '系统管理', parentId: 0, orderNum: 1, path: '/system', component: 'Layout', icon: 'system', menuType: 'M' },
      { menuId: 2, menuName: '用户管理', parentId: 1, orderNum: 1, path: 'user', component: 'system/user/index', icon: 'user', menuType: 'C' },
      { menuId: 3, menuName: '角色管理', parentId: 1, orderNum: 2, path: 'role', component: 'system/role/index', icon: 'peoples', menuType: 'C' }
    ]
  })
}

// 查询菜单详细
export function getMenu(menuId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      menuId: menuId,
      menuName: '示例菜单',
      parentId: 0,
      orderNum: 1,
      path: '/example',
      component: 'Layout',
      icon: 'example',
      menuType: 'C'
    }
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: [
      { id: 0, label: '根目录', children: [
        { id: 1, label: '系统管理', children: [
          { id: 2, label: '用户管理' },
          { id: 3, label: '角色管理' }
        ]}
      ]}
    ]
  })
}

export function getUserMenuTree() {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: [
      { menuId: 1, menuName: '系统管理', icon: 'system', children: [
        { menuId: 2, menuName: '用户管理', icon: 'user' },
        { menuId: 3, menuName: '角色管理', icon: 'peoples' }
      ]}
    ]
  })
}

// 新增菜单
export function addMenu(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: { menuId: Date.now(), ...data }
  })
}

// 修改菜单
export function updateMenu(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: data
  })
}

// 删除菜单
export function delMenu(menuId) {
  return Promise.resolve({
    code: 200,
    message: '删除成功',
    data: null
  })
}
