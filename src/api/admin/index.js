import request from '@/utils/request'
function getCSRFToken() {
  return request({
    url: `/gdmercury-api/uaa/sec/create/csrf-token`,
    method: 'get'
  })
}

 export  async function getDicts(str) {
  const url = `/gdmercury-api/system/dict/data/list?pageNum=1&pageSize=9999&dictType=${str}`
  const token = await getCSRFToken()
  const reqConfig = {url, 'CSRF-Token': token.data}
  return request(reqConfig)
}
// 创建应用
export function createApplication(params) {
  return request({
    url: '/cms/application',
    method: 'post',
    data:params
  })
}
// 编辑应用
export function getCmsPutApplication(params) {
  return request({
    url: '/cms/application',
    method: 'put',
    data:params
  })
}
// 查询应用详情
export function getApplicationDetail(applicationId) {
  return request({
    url: `/cms/application/${applicationId}`,
    method: 'get'
  })
}
// 查询应用列表
export function getApplicationList(params) {
  return request({
    url: `/cms/application/list`,
    method: 'get',
    params
  })
}
// 删除应用
export function deleteApplication(params) {
  return request({
    url: '/cms/application',
    method: 'DELETE',
    data:params
  })
}
// 发布应用
export function publishApplication(params) {
  return request({
    url: '/cms/application/publish',
    method: 'put',
    data:params
  })
}
// 下线应用
export function putApplication(params) {
  return request({
    url: '/cms/application/offline',
    method: 'put',
    data:params
  })
}


// 创建组件
export function createComponent(params) {
  return request({
    url: '/cms/component',
    method: 'post',
    data:params
  })
}
// 编辑组件
export function getCmsPutComponent(params) {
  return request({
    url: '/cms/component',
    method: 'put',
    data:params
  })
}
// 查询应用详情
export function getComponentDetail(componentId) {
  return request({
    url: `/cms/component/${componentId}`,
    method: 'get'
  })
}
// 查询应用列表
export function getComponentList(params) {
  return request({
    url: `/cms/component/list`,
    method: 'get',
    params
  })
}
// 删除应用
export function deleteComponent(params) {
  return request({
    url: '/cms/component',
    method: 'DELETE',
    data:params
  })
}
// 发布应用
export function publishComponent(params) {
  return request({
    url: '/cms/component/publish',
    method: 'put',
    data:params
  })
}
// 下线应用
export function putComponent(params) {
  return request({
    url: '/cms/component/offline',
    method: 'put',
    data:params
  })
}

export  async function CSRF(req) {
  const token = await getCSRFToken()
  const reqConfig = {...req, 'CSRF-Token': token.data}

  return request(reqConfig)
}
// 获取用户详细信息
export async function getInfo() {
  return CSRF({
    url: '/gdmercury-api/system/V2/userInfo/getUser',
    method: 'get'
  })
}

//获取权限
export async function getRolesAndPermission() {
  return CSRF({
    url: '/gdmercury-api/system/V2/userInfo/getRolesAndPermission',
    method: 'get'
  })
}
