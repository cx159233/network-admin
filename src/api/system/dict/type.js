// 查询字典类型列表
export function listType(query) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: [
        { dictId: 1, dictName: '用户状态', dictType: 'sys_normal_disable', status: '0', createTime: '2024-01-15 10:00:00' },
        { dictId: 2, dictName: '用户性别', dictType: 'sys_user_sex', status: '0', createTime: '2024-01-15 10:00:00' },
        { dictId: 3, dictName: '是否', dictType: 'sys_yes_no', status: '0', createTime: '2024-01-15 10:00:00' },
        { dictId: 4, dictName: '通知类型', dictType: 'sys_notice_type', status: '0', createTime: '2024-01-15 10:00:00' },
        { dictId: 5, dictName: '通知状态', dictType: 'sys_notice_status', status: '0', createTime: '2024-01-15 10:00:00' }
      ],
      total: 5
    }
  })
}

// 查询字典类型详细
export function getType(dictId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      dictId: dictId,
      dictName: '用户状态',
      dictType: 'sys_normal_disable',
      status: '0',
      remark: '用户账号状态',
      createTime: '2024-01-15 10:00:00'
    }
  })
}

// 新增字典类型
export function addType(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: true
  })
}

// 修改字典类型
export function updateType(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: true
  })
}

// 删除字典类型
export function delType(dictIds) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: true
  })
}

// 刷新字典缓存
export function refreshCache() {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: true
  })
}

// 获取字典选择框列表
export function optionselect() {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: [
      { dictId: 1, dictName: '用户状态', dictType: 'sys_normal_disable' },
      { dictId: 2, dictName: '用户性别', dictType: 'sys_user_sex' },
      { dictId: 3, dictName: '是否', dictType: 'sys_yes_no' },
      { dictId: 4, dictName: '通知类型', dictType: 'sys_notice_type' },
      { dictId: 5, dictName: '通知状态', dictType: 'sys_notice_status' }
    ]
  })
}
