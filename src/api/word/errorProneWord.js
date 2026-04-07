export function getErrorProneWordList(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: [
        { wordId: 1, errorWord: '易错词1', correctWord: '正确词1', createTime: '2024-01-01 10:00:00' },
        { wordId: 2, errorWord: '易错词2', correctWord: '正确词2', createTime: '2024-01-02 10:00:00' }
      ],
      total: 2
    }
  })
}

export function addErrorProneWord(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function editErrorProneWord(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function deleteErrorProneWord(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function checkFallibleWords(text) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      hasError: false,
      errorWords: []
    }
  })
}
