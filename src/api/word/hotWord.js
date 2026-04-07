export function getHotWordList(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: [
        { wordId: 1, word: '热词1', groupId: 1, groupName: '分组1', sort: 1, createTime: '2024-01-01 10:00:00' },
        { wordId: 2, word: '热词2', groupId: 1, groupName: '分组1', sort: 2, createTime: '2024-01-02 10:00:00' }
      ],
      total: 2
    }
  })
}

export function addHotWord(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function editHotWord(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function deleteHotWord(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function getHotWordGroupTreeData() {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: [
      {
        groupId: 1,
        groupName: '热词分组1',
        children: [
          { groupId: 11, groupName: '子分组1' },
          { groupId: 12, groupName: '子分组2' }
        ]
      },
      {
        groupId: 2,
        groupName: '热词分组2',
        children: []
      }
    ]
  })
}

export function getHotWordGroupOptions() {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: [
      { groupId: 1, groupName: '热词分组1' },
      { groupId: 2, groupName: '热词分组2' }
    ]
  })
}

export function addHotWordGroup(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function editHotWordGroup(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function deleteHotWordGroup(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}
