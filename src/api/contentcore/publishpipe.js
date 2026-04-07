// 查询发布通道列表
export function getPublishPipeList(query) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    rows: [
      { publishPipeId: 1, name: 'PC端', code: 'pc', status: 1 },
      { publishPipeId: 2, name: '移动端', code: 'mobile', status: 1 }
    ],
    total: 2
  })
}

// 查询发布通道列表
export function getPublishPipeSelectData(query) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: [
      { publishPipeId: 1, name: 'PC端' },
      { publishPipeId: 2, name: '移动端' }
    ]
  })
}

// 查询发布通道详情
export function getPublishPipeData(siteId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      publishPipeId: 1,
      name: 'PC端',
      code: 'pc',
      status: 1,
      config: '{}'
    }
  })
}

// 新增发布通道
export function addPublishPipe(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: { publishPipeId: Date.now(), ...data }
  })
}

// 修改发布通道
export function updatePublishPipe(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: data
  })
}

// 删除发布通道
export function delPublishPipe(publishPipeIds) {
  return Promise.resolve({
    code: 200,
    message: '删除成功',
    data: null
  })
}

export function getPublishPipePropValue(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: { propValue: 'mock-value' }
  })
}
