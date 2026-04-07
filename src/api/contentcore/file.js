// 站点目录TreeData
export function getDirectoryTreeData() {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: [
      {
        id: 'root',
        label: '根目录',
        children: [
          {
            id: 'templates',
            label: 'templates',
            children: [
              { id: 'templates/index.html', label: 'index.html' },
              { id: 'templates/list.html', label: 'list.html' }
            ]
          },
          {
            id: 'images',
            label: 'images',
            children: [
              { id: 'images/logo.png', label: 'logo.png' },
              { id: 'images/banner.jpg', label: 'banner.jpg' }
            ]
          },
          {
            id: 'css',
            label: 'css',
            children: [
              { id: 'css/style.css', label: 'style.css' }
            ]
          }
        ]
      }
    ]
  })
}

// 获取指定目录下文件
export function getFileList(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: [
        {
          fileId: 1,
          fileName: 'index.html',
          fileType: 'html',
          fileSize: 1024,
          modifyTime: '2024-01-01 12:00:00'
        },
        {
          fileId: 2,
          fileName: 'list.html',
          fileType: 'html',
          fileSize: 2048,
          modifyTime: '2024-01-02 12:00:00'
        },
        {
          fileId: 3,
          fileName: 'style.css',
          fileType: 'css',
          fileSize: 512,
          modifyTime: '2024-01-03 12:00:00'
        }
      ],
      total: 3
    }
  })
}

// 文件重命名
export function renameFile(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

// 新建文件
export function addFile(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

// 获取文件内容
export function readFile(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>示例</title>\n</head>\n<body>\n  <h1>示例文件内容</h1>\n</body>\n</html>',
      fileName: data.fileName || 'index.html'
    }
  })
}

// 修改文件
export function editFile(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

// 删除文件
export function deleteFile(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}
