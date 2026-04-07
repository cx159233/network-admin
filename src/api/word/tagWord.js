export function getTagWordList(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: [
        { wordId: 1, word: 'TAG词1', groupId: 1, groupName: '分组1', sort: 1, createTime: '2024-01-01 10:00:00' },
        { wordId: 2, word: 'TAG词2', groupId: 1, groupName: '分组1', sort: 2, createTime: '2024-01-02 10:00:00' }
      ],
      total: 2
    }
  })
}

export function addTagWord(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function batchAddTagWords(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function editTagWord(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function deleteTagWord(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function getTagWordGroupTreeData() {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: [
      {
        groupId: 1,
        groupName: 'TAG分组1',
        children: [
          { groupId: 11, groupName: '子分组1' },
          { groupId: 12, groupName: '子分组2' }
        ]
      },
      {
        groupId: 2,
        groupName: 'TAG分组2',
        children: []
      }
    ]
  })
}

export function addTagWordGroup(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function editTagWordGroup(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function deleteTagWordGroup(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}
