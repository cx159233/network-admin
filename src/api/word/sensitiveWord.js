export function getSensitiveWordList(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: [
        { wordId: 1, word: '敏感词1', replaceWord: '替换词1', createTime: '2024-01-01 10:00:00' },
        { wordId: 2, word: '敏感词2', replaceWord: '替换词2', createTime: '2024-01-02 10:00:00' }
      ],
      total: 2
    }
  })
}

export function addSensitiveWord(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function editSensitiveWord(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function deleteSensitiveWord(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function checkSensitiveWords(text) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      hasSensitive: false,
      sensitiveWords: []
    }
  })
}
