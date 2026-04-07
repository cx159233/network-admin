// 查询扩展模型列表
export function listXModel(query) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: [
        {
          modelId: 1,
          modelName: '产品模型',
          modelCode: 'product',
          tableName: 'cms_product',
          status: 1,
          createTime: '2024-01-01 12:00:00'
        },
        {
          modelId: 2,
          modelName: '案例模型',
          modelCode: 'case',
          tableName: 'cms_case',
          status: 1,
          createTime: '2024-01-02 12:00:00'
        }
      ],
      total: 2
    }
  })
}

export function listXModelOptions() {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: [
      { modelId: 1, modelName: '产品模型', modelCode: 'product' },
      { modelId: 2, modelName: '案例模型', modelCode: 'case' }
    ]
  })
}

// 查询扩展模型数据保存表字段
export function listXModelTableFields(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: [
      { field: 'id', type: 'bigint', comment: 'ID' },
      { field: 'title', type: 'varchar', comment: '标题' },
      { field: 'content', type: 'text', comment: '内容' },
      { field: 'create_time', type: 'datetime', comment: '创建时间' }
    ]
  })
}

// 新增扩展模型
export function addXModel(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: { modelId: Date.now() }
  })
}

// 修改扩展模型
export function editXModel(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

// 删除扩展模型
export function deleteXModel(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

// 查询扩展模型字段列表
export function listXModelField(query) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: [
        {
          fieldId: 1,
          modelId: query.modelId,
          fieldName: 'price',
          fieldLabel: '价格',
          fieldType: 'number',
          isRequired: 1,
          sort: 1
        },
        {
          fieldId: 2,
          modelId: query.modelId,
          fieldName: 'brand',
          fieldLabel: '品牌',
          fieldType: 'text',
          isRequired: 0,
          sort: 2
        }
      ],
      total: 2
    }
  })
}

// 新增扩展模型字段
export function addXModelField(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: { fieldId: Date.now() }
  })
}

// 修改扩展模型字段
export function editXModelField(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

// 删除扩展模型字段
export function deleteXModelField(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function getXModelFieldData(modelId, dataType, dataId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      modelId: modelId,
      dataType: dataType,
      dataId: dataId,
      fields: {
        price: '199.99',
        brand: '示例品牌'
      }
    }
  })
}
