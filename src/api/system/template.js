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
import request from "@/utils/request";
// 删除模板
export function deleteTemplate(templateId) {
  return request({
    url: `/system/workbench-template/delete/${templateId}`,
    method: 'get'
  })
}
// 模板列表查询
export function queryTemplate(query) {
  return request({
    url: '/system/workbench-template/list',
    method: 'get',
    params: query
  })
}
// 更新或新增组件
export function addOrUpdateTemplate(query) {
  return request({
    url: '/system/workbench-element/addOrUpdate',
    method: 'post',
    data: query
  })
}
// 删除组件 -- 物理删除
export function deleteMenu(elementId) {
  return request({
    url: `/system/workbench-element/delete/${elementId}`,
    method: 'get'
  })
}
// 查询组件列表
export function queryElementList(query) {
  return request({
    url: '/system/workbench-element/list',
    method: 'get',
    params: query
  })
}
