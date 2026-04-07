// 查询用户列表
export function listUser(query) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    rows: [
      { userId: 1, userName: 'admin', nickName: '系统管理员', deptName: '技术部', email: 'admin@example.com', phonenumber: '13800138000', status: '0', createTime: '2024-01-01 00:00:00' },
      { userId: 2, userName: 'test', nickName: '测试用户', deptName: '测试部', email: 'test@example.com', phonenumber: '13900139000', status: '0', createTime: '2024-01-02 00:00:00' }
    ],
    total: 2
  })
}

// 查询用户详细
export function getUser(userId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      userId: userId,
      userName: 'admin',
      nickName: '系统管理员',
      email: 'admin@example.com',
      phonenumber: '13800138000',
      sex: '0',
      deptId: 100,
      deptName: '技术部',
      roleIds: [1],
      status: '0'
    }
  })
}

// 新增用户
export function addUser(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: { userId: Date.now(), ...data }
  })
}

// 修改用户
export function updateUser(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: data
  })
}

// 删除用户
export function delUser(userIds) {
  return Promise.resolve({
    code: 200,
    message: '删除成功',
    data: null
  })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  return Promise.resolve({
    code: 200,
    message: '重置成功',
    data: null
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      userName: 'admin',
      nickName: '系统管理员',
      email: 'admin@example.com',
      phonenumber: '13800138000',
      sex: '0'
    }
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  return Promise.resolve({
    code: 200,
    message: '修改成功',
    data: null
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return Promise.resolve({
    code: 200,
    message: '上传成功',
    data: { url: '/mock/images/avatar.png' }
  })
}

// 查询授权角色
export function getAuthRole(userId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    roles: [
      { roleId: 1, roleName: '管理员', flag: true },
      { roleId: 2, roleName: '普通用户', flag: false }
    ]
  })
}

// 保存授权角色
export function updateAuthRole(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: null
  })
}

// 查询部门下拉树结构
export function deptTreeSelect() {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: [
      { id: 100, label: '技术部', children: [{ id: 101, label: '前端组' }, { id: 102, label: '后端组' }] },
      { id: 200, label: '测试部' }
    ]
  })
}

export function getHomeUserInfo() {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      contentCount: 100,
      todayVisit: 500,
      totalVisit: 10000
    }
  })
}

export function getHomeShortcuts() {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: [
      { name: '内容管理', path: '/cms/content', icon: 'document' },
      { name: '栏目管理', path: '/cms/catalog', icon: 'tree' }
    ]
  })
}

export function getUserPreferences() {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      theme: 'light',
      sidebar: true
    }
  })
}

export function getUserPreference(preferenceId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: { preferenceId: preferenceId, value: 'mock-value' }
  })
}

export function saveUserPreferences(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: null
  })
}
