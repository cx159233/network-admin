export function getRecycleContentList(query) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: [
        {
          backupId: 1,
          contentId: 101,
          title: '已删除的文章1',
          contentType: 'article',
          deleteTime: '2024-01-01 12:00:00',
          deleteUser: 'admin'
        },
        {
          backupId: 2,
          contentId: 102,
          title: '已删除的文章2',
          contentType: 'article',
          deleteTime: '2024-01-02 12:00:00',
          deleteUser: 'admin'
        }
      ],
      total: 2
    }
  })
}

export function recoverRecycleContent(backupIds) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function deleteRecycleContents(backupIds) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}
