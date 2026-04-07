// 查询公告列表
export function listNotice(query) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: [
        { noticeId: 1, noticeTitle: '系统维护通知', noticeType: '1', status: '0', createBy: 'admin', createTime: '2024-01-15 10:00:00' },
        { noticeId: 2, noticeTitle: '新版本发布公告', noticeType: '2', status: '0', createBy: 'admin', createTime: '2024-01-14 09:00:00' },
        { noticeId: 3, noticeTitle: '假期安排通知', noticeType: '1', status: '1', createBy: 'admin', createTime: '2024-01-10 14:00:00' },
        { noticeId: 4, noticeTitle: '安全升级提醒', noticeType: '2', status: '0', createBy: 'admin', createTime: '2024-01-08 11:00:00' },
        { noticeId: 5, noticeTitle: '功能更新说明', noticeType: '2', status: '0', createBy: 'admin', createTime: '2024-01-05 16:00:00' }
      ],
      total: 5
    }
  })
}

// 查询公告详细
export function getNotice(noticeId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      noticeId: noticeId,
      noticeTitle: '系统维护通知',
      noticeType: '1',
      noticeContent: '<p>系统将于本周六凌晨2点进行维护升级，预计维护时间为2小时。请提前保存好您的工作。</p>',
      status: '0',
      createBy: 'admin',
      createTime: '2024-01-15 10:00:00',
      updateTime: '2024-01-15 10:00:00'
    }
  })
}

// 新增公告
export function addNotice(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: true
  })
}

// 修改公告
export function updateNotice(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: true
  })
}

// 删除公告
export function delNotice(noticeIds) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: true
  })
}
