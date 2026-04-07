// 查询模板文件数据集合
export function getTemplateList(query) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: [
        {
          templateId: 1,
          templateName: 'index.html',
          fileSize: 1024,
          fileType: 'html',
          path: '/templates/index.html',
          modifyTime: '2024-01-01 12:00:00'
        },
        {
          templateId: 2,
          templateName: 'list.html',
          fileSize: 2048,
          fileType: 'html',
          path: '/templates/list.html',
          modifyTime: '2024-01-02 12:00:00'
        },
        {
          templateId: 3,
          templateName: 'detail.html',
          fileSize: 1536,
          fileType: 'html',
          path: '/templates/detail.html',
          modifyTime: '2024-01-03 12:00:00'
        }
      ],
      total: 3
    }
  })
}

// 查询模板文件内容
export function getTemplateDetail(templateId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      templateId: templateId,
      templateName: 'index.html',
      content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>首页</title>\n</head>\n<body>\n  <h1>首页模板</h1>\n</body>\n</html>',
      path: '/templates/index.html'
    }
  })
}

// 模板文件重命名
export function renameTemplate(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

// 新增模板文件
export function addTemplate(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: { templateId: Date.now() }
  })
}

// 修改模板
export function editTemplate(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

// 删除模板
export function delTemplate(templates) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

// 删除区块模板缓存
export function clearIncludeCache(templates) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}
