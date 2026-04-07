export function getLinkList(params) {
  // 根据 groupId 返回不同的数据
  const groupId = params?.groupId

  // 服务对象 - 603877673361477
  if (groupId === '603877673361477' || groupId === 603877673361477) {
    return Promise.resolve({
      code: 200,
      msg: 'SUCCESS',
      data: {
        rows: [
          {
            createBy: 'zhangxixi',
            createTime: '2024-10-22 11:41:06',
            updateBy: 'ranfenghua',
            updateTime: '2024-11-19 13:59:40',
            remark: '基层医疗卫生机构,基层一体化',
            linkId: '603881732681797',
            siteId: '601807368400965',
            groupId: '603877673361477',
            name: '基层医疗卫生机构',
            url: 'http://10.107.2.244/cq-network-org-view/#/digital/application?title=基层医疗卫生机构&subTitle=基层一体化',
            logo: '',
            sortFlag: '172956846500'
          },
          {
            createBy: 'zhangxixi',
            createTime: '2024-10-22 11:41:30',
            updateBy: 'ranfenghua',
            updateTime: '2024-11-19 13:59:45',
            remark: '公立医院,远程医疗',
            linkId: '603881830744133',
            siteId: '601807368400965',
            groupId: '603877673361477',
            name: '公立医院',
            url: 'http://10.107.2.244/cq-network-org-view/#/digital/application?title=公立医院&subTitle=远程医疗',
            sortFlag: '172956848900'
          },
          {
            createBy: 'zhangxixi',
            createTime: '2024-10-22 11:41:44',
            updateBy: 'ranfenghua',
            updateTime: '2024-11-19 13:59:51',
            remark: '医技护人员,资质证书办理',
            linkId: '603881890041925',
            siteId: '601807368400965',
            groupId: '603877673361477',
            name: '医技护人员',
            url: 'http://10.107.2.244/cq-network-org-view/#/digital/application?title=医技护人员&subTitle=资质证书办理',
            sortFlag: '172956850400'
          }
        ],
        total: '3'
      }
    })
  }

  // 组件中枢 - 603877733531717 - 返回空数据
  if (groupId === '603877733531717' || groupId === 603877733531717) {
    return Promise.resolve({
      code: 200,
      msg: 'SUCCESS',
      data: {
        rows: [],
        total: '0'
      }
    })
  }

  // 指导单位 - 603877803376709
  if (groupId === '603877803376709' || groupId === 603877803376709) {
    return Promise.resolve({
      code: 200,
      msg: 'SUCCESS',
      data: {
        rows: [
          {
            createBy: 'zhangxixi',
            createTime: '2024-10-22 11:42:20',
            updateBy: 'zhangxixi',
            updateTime: '2024-10-22 11:42:20',
            linkId: '603882036191301',
            siteId: '601807368400965',
            groupId: '603877803376709',
            name: '重庆市卫生健康委员会',
            sortFlag: '172956853900'
          },
          {
            createBy: 'zhangxixi',
            createTime: '2024-10-22 11:42:26',
            updateBy: 'zhangxixi',
            updateTime: '2024-10-22 11:42:26',
            linkId: '603882063618117',
            siteId: '601807368400965',
            groupId: '603877803376709',
            name: '重庆市卫生健康信息中心',
            sortFlag: '172956854600'
          }
        ],
        total: '2'
      }
    })
  }

  // 服务方式 - 603877888335941
  if (groupId === '603877888335941' || groupId === 603877888335941) {
    return Promise.resolve({
      code: 200,
      msg: 'SUCCESS',
      data: {
        rows: [
          {
            createBy: 'zhangxixi',
            createTime: '2024-10-22 11:42:35',
            updateBy: 'zhangxixi',
            updateTime: '2024-10-22 11:42:35',
            linkId: '603882099515461',
            siteId: '601807368400965',
            groupId: '603877888335941',
            name: '电话咨询：（023）61965109',
            sortFlag: '172956855500'
          }
        ],
        total: '1'
      }
    })
  }

  // 默认数据
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: {
      rows: [],
      total: '0'
    }
  })
}

export function addLink(params) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: {}
  })
}

export function editLink(params) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: {}
  })
}

export function deleteLink(params) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: {}
  })
}
