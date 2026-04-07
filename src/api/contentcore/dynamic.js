export function getDynamicPageInitDataTypes(query) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function getDynamicPageList(query) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: [],
      total: 0
    }
  })
}

export function getDynamicPageDetail(pageId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function addDynamicPage(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function editDynamicPage(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function deleteDynamicPages(pageIds) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}
