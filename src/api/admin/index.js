import request from '@/utils/request'

// Mock 用户信息
const MOCK_USER = {
  userId: 1,
  userName: 'admin',
  nickName: '系统管理员',
  email: 'admin@example.com',
  phonenumber: '13800138000',
  sex: '0',
  avatar: '',
  accountList: [
    {
      avatar: ''
    }
  ]
}

// Mock 角色信息
const MOCK_ROLES = ['admin', 'common']

// Mock 权限信息
const MOCK_PERMISSIONS = [
  '*:*:*', // 所有权限
  'system:user:list',
  'system:user:add',
  'system:user:edit',
  'system:user:delete',
  'system:role:list',
  'system:role:add',
  'system:role:edit',
  'system:role:delete',
  'system:menu:list',
  'cms:content:list',
  'cms:content:add',
  'cms:content:edit',
  'cms:content:delete',
  'cms:catalog:list',
  'cms:site:list'
]

function getCSRFToken() {
  return Promise.resolve({ data: 'mock-csrf-token' })
}

 export  async function getDicts(str) {
  // Mock 字典数据
  const mockDicts = {
    'sys_normal_disable': [
      { dictValue: '0', dictLabel: '正常' },
      { dictValue: '1', dictLabel: '停用' }
    ],
    'sys_show_hide': [
      { dictValue: '0', dictLabel: '显示' },
      { dictValue: '1', dictLabel: '隐藏' }
    ],
    'sys_yes_no': [
      { dictValue: 'Y', dictLabel: '是' },
      { dictValue: 'N', dictLabel: '否' }
    ],
    'sys_user_sex': [
      { dictValue: '0', dictLabel: '男' },
      { dictValue: '1', dictLabel: '女' },
      { dictValue: '2', dictLabel: '未知' }
    ]
  }
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    rows: mockDicts[str] || []
  })
}

// 创建应用
export function createApplication(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: { id: Date.now(), ...params }
  })
}

// 编辑应用
export function getCmsPutApplication(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: params
  })
}

// 查询应用详情
export function getApplicationDetail(applicationId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      applicationId: applicationId,
      name: '示例应用',
      code: 'demo-app',
      status: 1
    }
  })
}

// 查询应用列表
export function getApplicationList(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    rows: [
      { applicationId: 1, name: '应用1', code: 'app1', status: 1 },
      { applicationId: 2, name: '应用2', code: 'app2', status: 1 }
    ],
    total: 2
  })
}

// 删除应用
export function deleteApplication(params) {
  return Promise.resolve({
    code: 200,
    message: '删除成功',
    data: null
  })
}

// 发布应用
export function publishApplication(params) {
  return Promise.resolve({
    code: 200,
    message: '发布成功',
    data: null
  })
}

// 下线应用
export function putApplication(params) {
  return Promise.resolve({
    code: 200,
    message: '下线成功',
    data: null
  })
}


// 创建组件
export function createComponent(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: { componentId: Date.now(), ...params }
  })
}

// 编辑组件
export function getCmsPutComponent(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: params
  })
}

// 查询组件详情
export function getComponentDetail(componentId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      componentId: componentId,
      name: '示例组件',
      code: 'demo-component'
    }
  })
}

// 查询组件列表
export function getComponentList(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    rows: [
      { componentId: 1, name: '组件1', code: 'comp1' },
      { componentId: 2, name: '组件2', code: 'comp2' }
    ],
    total: 2
  })
}

// 删除组件
export function deleteComponent(params) {
  return Promise.resolve({
    code: 200,
    message: '删除成功',
    data: null
  })
}

// 发布组件
export function publishComponent(params) {
  return Promise.resolve({
    code: 200,
    message: '发布成功',
    data: null
  })
}

// 下线组件
export function putComponent(params) {
  return Promise.resolve({
    code: 200,
    message: '下线成功',
    data: null
  })
}

export  async function CSRF(req) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: null
  })
}

// 获取用户详细信息 - Mock 数据
export async function getInfo() {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    user: MOCK_USER,
    roles: MOCK_ROLES
  })
}

// 获取权限 - Mock 数据
export async function getRolesAndPermission() {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    permissions: MOCK_PERMISSIONS
  })
}
