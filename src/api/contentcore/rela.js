export function getRelaContentList(query) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: [
        {
          relaId: 1,
          contentId: 1,
          relaContentId: 2,
          relaContentTitle: '相关内容文章1',
          sort: 1
        },
        {
          relaId: 2,
          contentId: 1,
          relaContentId: 3,
          relaContentTitle: '相关内容文章2',
          sort: 2
        }
      ],
      total: 2
    }
  })
}

export function addRelaContents(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function delRelaContents(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}
