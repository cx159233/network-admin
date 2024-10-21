import request from '@/utils/request'

// 获取路由
export const getRouters = () => {
  return request({
    url: '/gdmercury-api/system/menu/getRouters?clientId=cq-network-admin-view',
    method: 'get'
  })
}
