const typeList = [
  { dictId: 10057, dictName: '服务对象', dictType: 'Client', status: '0', remark: '数字应用服务对象，服务上架使用', createTime: '2026-03-01 09:00:00' },
  { dictId: 10058, dictName: '基层应用覆盖范围', dictType: 'AppScope_PrimaryHospital', status: '0', remark: '面向基层医疗卫生机构的应用覆盖范围', createTime: '2026-03-01 09:00:00' },
  { dictId: 10059, dictName: '应用架构', dictType: 'SoftwareArchitecture', status: '0', remark: '数字应用应用架构，服务上架使用', createTime: '2026-03-01 09:00:00' },
  { dictId: 10060, dictName: '部署云服务商', dictType: 'CloudProvider', status: '0', remark: '数字应用部署云服务商，服务上架使用', createTime: '2026-03-01 09:00:00' },
  { dictId: 10061, dictName: '开放范围', dictType: 'OpenRange', status: '0', remark: '开放范围', createTime: '2026-03-01 09:00:00' },
  { dictId: 10062, dictName: '服务专区', dictType: 'ServiceZone', status: '0', remark: '服务专区分类，服务上架使用', createTime: '2026-03-01 09:00:00' },
  { dictId: 10063, dictName: 'X86专区_服务分类', dictType: 'ServiceType_X86Zone', status: '0', remark: 'X86专区服务分类，服务上架使用', createTime: '2026-03-01 09:00:00' },
  { dictId: 10064, dictName: '信创专区_服务分类', dictType: 'ServiceType_XinChuangZone', status: '0', remark: '信创专区服务分类，服务上架使用', createTime: '2026-03-01 09:00:00' },
  { dictId: 10065, dictName: '密码服务专区_服务分类', dictType: 'ServiceType_CipherZone', status: '0', remark: '密码服务专区服务分类，服务上架使用', createTime: '2026-03-01 09:00:00' },
  { dictId: 10066, dictName: '超算、智算专区_服务分类', dictType: 'ServiceType_SuperComputeZone', status: '0', remark: '超算、智算专区服务分类，服务上架使用', createTime: '2026-03-01 09:00:00' },
  { dictId: 10068, dictName: '公立应用覆盖范围', dictType: 'AppScope_Hospital', status: '0', remark: '面向公立医院的应用覆盖范围', createTime: '2026-03-01 09:00:00' },
  { dictId: 10069, dictName: '医技应用覆盖范围', dictType: 'AppScope_MedicalPersonnel', status: '0', remark: '面向医技护人员的应用覆盖范围', createTime: '2026-03-01 09:00:00' }
]

function filterType(query) {
  let list = typeList
  if (query.dictName) {
    list = list.filter(i => (i.dictName || '').includes(query.dictName))
  }
  if (query.dictType) {
    list = list.filter(i => (i.dictType || '').includes(query.dictType))
  }
  if (query.status !== undefined && query.status !== '' && query.status !== null) {
    list = list.filter(i => i.status === query.status)
  }
  return list
}

// 查询字典类型列表
export function listType(query) {
  const q = query || {}
  let list = filterType(q)
  const total = list.length
  const pageNum = q.pageNum || 1
  const pageSize = q.pageSize || 10
  list = list.slice((pageNum - 1) * pageSize, pageNum * pageSize)
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: list,
      total
    }
  })
}

// 查询字典类型详细
export function getType(dictId) {
  const target = typeList.find(i => i.dictId === Number(dictId))
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: target || null
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
    data: typeList.map(i => ({ dictId: i.dictId, dictName: i.dictName, dictType: i.dictType }))
  })
}