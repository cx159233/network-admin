/*
 * @Author: ranfenghua ranfenghua@cecinvestment.com
 * @Date: 2025-06-20 13:54:19
 * @LastEditors: ranfenghua ranfenghua@cecinvestment.com
 * @LastEditTime: 2025-06-20 13:55:03
 * @FilePath: /cq-network-admin-view/src/api/system/template.js
 * @Description:
 *
 * Copyright (c) 2025 by ${user.email}, All Rights Reserved.
 */
// 删除模板
export function deleteTemplate(templateId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}
// 模板列表查询
export function queryTemplate(query) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: [],
      total: 0
    }
  })
}
// 更新或新增组件
export function addOrUpdateTemplate(query) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}
// 删除组件 -- 物理删除
export function deleteMenu(elementId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}
// 查询组件列表
export function queryElementList(query) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: [],
      total: 0
    }
  })
}
