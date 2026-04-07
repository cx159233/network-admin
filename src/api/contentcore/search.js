// 查询内容索引列表
export function getContentIndexList(query) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: [],
      total: 0
    }
  })
}

// 删除内容索引
export function deleteContentIndex(contentIds) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

// 内容索引详情
export function getContentIndexDetail(contentId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function rebuildIndex() {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}
