// 当前发布任务队列长度
export function getPublishTaskCount() {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: 0
  })
}

// 清空发布任务队列
export function clearPublishTask() {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}
