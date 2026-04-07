// 查询角色列表
export function listRole(query) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    rows: [
      { roleId: 1, roleName: '超级管理员', roleKey: 'admin', status: '0', createTime: '2024-01-01 00:00:00' },
      { roleId: 2, roleName: '普通用户', roleKey: 'user', status: '0', createTime: '2024-01-02 00:00:00' }
    ],
    total: 2
  })
}

// 查询角色详细
export function getRole(roleId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      roleId: roleId,
      roleName: '超级管理员',
      roleKey: 'admin',
      roleSort: 1,
      status: '0',
      menuIds: [1, 2, 3]
    }
  })
}

// 新增角色
export function addRole(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: { roleId: Date.now(), ...data }
  })
}

// 修改角色
export function updateRole(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: data
  })
}

// 角色状态修改
export function changeRoleStatus(roleId, status) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: null
  })
}

// 删除角色
export function delRole(roleIds) {
  return Promise.resolve({
    code: 200,
    message: '删除成功',
    data: null
  })
}

// 查询角色已授权用户列表
export function allocatedUserList(query) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    rows: [
      { userId: 1, userName: 'admin', nickName: '系统管理员' }
    ],
    total: 1
  })
}

// 查询角色未授权用户列表
export function unallocatedUserList(query) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    rows: [
      { userId: 2, userName: 'test', nickName: '测试用户' }
    ],
    total: 1
  })
}

// 批量取消用户授权的角色
export function authUserCancel(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: null
  })
}

// 批量授权角色给指定用户
export function authUserAdd(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: null
  })
}
