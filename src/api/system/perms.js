// 保存权限配置{ownerType: 授权对象类型, owner: 授权对象唯一标识, permissions: []}
export function savePermissions(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: true
  })
}

// 菜单权限数据
export function getMenuPerms(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: [
      { menuId: 1, menuName: '系统管理', parentId: 0, orderNum: 1, perms: '', checked: false },
      { menuId: 2, menuName: '用户管理', parentId: 1, orderNum: 1, perms: 'system:user:list', checked: true },
      { menuId: 3, menuName: '用户新增', parentId: 2, orderNum: 1, perms: 'system:user:add', checked: true },
      { menuId: 4, menuName: '用户修改', parentId: 2, orderNum: 2, perms: 'system:user:edit', checked: false },
      { menuId: 5, menuName: '用户删除', parentId: 2, orderNum: 3, perms: 'system:user:remove', checked: false },
      { menuId: 6, menuName: '角色管理', parentId: 1, orderNum: 2, perms: 'system:role:list', checked: true },
      { menuId: 7, menuName: '菜单管理', parentId: 1, orderNum: 3, perms: 'system:menu:list', checked: true },
      { menuId: 8, menuName: '部门管理', parentId: 1, orderNum: 4, perms: 'system:dept:list', checked: false },
      { menuId: 9, menuName: '岗位管理', parentId: 1, orderNum: 5, perms: 'system:post:list', checked: false },
      { menuId: 10, menuName: '字典管理', parentId: 1, orderNum: 6, perms: 'system:dict:list', checked: false },
      { menuId: 11, menuName: '参数管理', parentId: 1, orderNum: 7, perms: 'system:config:list', checked: false },
      { menuId: 12, menuName: '通知公告', parentId: 1, orderNum: 8, perms: 'system:notice:list', checked: false },
      { menuId: 13, menuName: '操作日志', parentId: 1, orderNum: 9, perms: 'system:operlog:list', checked: false },
      { menuId: 14, menuName: '登录日志', parentId: 1, orderNum: 10, perms: 'system:loginlog:list', checked: false }
    ]
  })
}
