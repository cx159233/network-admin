export function getLinkGroupList(params) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: {
      rows: [
        {
          createBy: 'zhangxixi',
          createTime: '2024-10-22 11:24:35',
          updateBy: 'ranfenghua',
          updateTime: '2024-11-19 13:58:24',
          linkGroupId: '603877673361477',
          siteId: '601807368400965',
          name: '服务对象',
          code: 'Client',
          sortFlag: '1'
        },
        {
          createBy: 'zhangxixi',
          createTime: '2024-10-22 11:24:49',
          updateBy: 'zhangxixi',
          updateTime: '2024-10-23 10:52:40',
          linkGroupId: '603877733531717',
          siteId: '601807368400965',
          name: '组件中枢',
          code: 'CenterComponent',
          sortFlag: '2'
        },
        {
          createBy: 'zhangxixi',
          createTime: '2024-10-22 11:25:06',
          updateBy: 'zhangxixi',
          updateTime: '2024-10-23 10:52:43',
          linkGroupId: '603877803376709',
          siteId: '601807368400965',
          name: '指导单位',
          code: 'Organizers',
          sortFlag: '3'
        },
        {
          createBy: 'zhangxixi',
          createTime: '2024-10-22 11:25:27',
          updateBy: 'zdchenxin',
          updateTime: '2026-04-01 15:07:52',
          linkGroupId: '603877888335941',
          siteId: '601807368400965',
          name: '服务方式',
          code: 'ServiceMethods',
          sortFlag: '4'
        }
      ],
      total: '4'
    }
  })
}

export function addLinkGroup(params) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: {}
  })
}

export function editLinkGroup(params) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: {}
  })
}

export function deleteLinkGroup(params) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: {}
  })
}
