export function listRule(query) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: [],
      total: 0
    }
  })
}

export function getRule(ruleId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function addRule(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function editRule(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function delRule(ids) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}
