// 查询字典数据列表
export function listData(query) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: [
        { dictCode: 1, dictSort: 1, dictLabel: '启用', dictValue: '0', dictType: 'sys_normal_disable', cssClass: 'success', listClass: 'success', status: '0', createTime: '2024-01-15 10:00:00' },
        { dictCode: 2, dictSort: 2, dictLabel: '禁用', dictValue: '1', dictType: 'sys_normal_disable', cssClass: 'danger', listClass: 'danger', status: '0', createTime: '2024-01-15 10:00:00' },
        { dictCode: 3, dictSort: 1, dictLabel: '男', dictValue: '0', dictType: 'sys_user_sex', cssClass: '', listClass: '', status: '0', createTime: '2024-01-15 10:00:00' },
        { dictCode: 4, dictSort: 2, dictLabel: '女', dictValue: '1', dictType: 'sys_user_sex', cssClass: '', listClass: '', status: '0', createTime: '2024-01-15 10:00:00' },
        { dictCode: 5, dictSort: 3, dictLabel: '未知', dictValue: '2', dictType: 'sys_user_sex', cssClass: '', listClass: '', status: '0', createTime: '2024-01-15 10:00:00' }
      ],
      total: 5
    }
  })
}

// 查询字典数据详细
export function getData(dictCode) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      dictCode: dictCode,
      dictSort: 1,
      dictLabel: '启用',
      dictValue: '0',
      dictType: 'sys_normal_disable',
      cssClass: 'success',
      listClass: 'success',
      status: '0',
      remark: '正常状态',
      createTime: '2024-01-15 10:00:00'
    }
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: [
      { dictCode: 1, dictSort: 1, dictLabel: '启用', dictValue: '0', dictType: dictType, cssClass: 'success', listClass: 'success', status: '0' },
      { dictCode: 2, dictSort: 2, dictLabel: '禁用', dictValue: '1', dictType: dictType, cssClass: 'danger', listClass: 'danger', status: '0' }
    ]
  })
}

// 新增字典数据
export function addData(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: true
  })
}

// 修改字典数据
export function updateData(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: true
  })
}

// 删除字典数据
export function delData(dictCode) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: true
  })
}
