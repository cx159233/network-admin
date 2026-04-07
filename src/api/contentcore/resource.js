export function getResourceTypes() {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: [
      { type: 'image', name: '图片' },
      { type: 'video', name: '视频' },
      { type: 'audio', name: '音频' },
      { type: 'file', name: '文档' }
    ]
  })
}

// 查询资源列表
export function getResrouceList(query) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: [
        {
          resourceId: 1,
          resourceName: 'logo.png',
          resourceType: 'image',
          fileSize: 10240,
          filePath: '/resources/logo.png',
          uploadTime: '2024-01-01 12:00:00',
          uploadUser: 'admin'
        },
        {
          resourceId: 2,
          resourceName: 'banner.jpg',
          resourceType: 'image',
          fileSize: 20480,
          filePath: '/resources/banner.jpg',
          uploadTime: '2024-01-02 12:00:00',
          uploadUser: 'admin'
        },
        {
          resourceId: 3,
          resourceName: 'demo.pdf',
          resourceType: 'file',
          fileSize: 51200,
          filePath: '/resources/demo.pdf',
          uploadTime: '2024-01-03 12:00:00',
          uploadUser: 'admin'
        }
      ],
      total: 3
    }
  })
}

// 获取资源详情
export function getResourceDetail(resourceId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      resourceId: resourceId,
      resourceName: 'logo.png',
      resourceType: 'image',
      fileSize: 10240,
      filePath: '/resources/logo.png',
      uploadTime: '2024-01-01 12:00:00',
      uploadUser: 'admin'
    }
  })
}

// 新增资源
export function addResource(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: { resourceId: Date.now() }
  })
}

// 修改资源
export function updateResource(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

// 删除资源
export function delResource(resourceIds) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}
