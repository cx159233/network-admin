export function getContentDynamicData(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      total: 1256,
      todayAdd: 12,
      weekAdd: 86,
      monthAdd: 342,
      pending: 23,
      published: 1180
    }
  })
}

export function getContentStatByCatalog(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      items: [
        { catalogName: '新闻资讯', contentCount: 450, percent: 35.8 },
        { catalogName: '产品中心', contentCount: 320, percent: 25.5 },
        { catalogName: '技术支持', contentCount: 280, percent: 22.3 },
        { catalogName: '关于我们', contentCount: 120, percent: 9.6 },
        { catalogName: '招聘信息', contentCount: 86, percent: 6.8 }
      ]
    }
  })
}

export function getContentStatByUser(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      items: [
        { userName: '张三', contentCount: 320, deptName: '编辑部' },
        { userName: '李四', contentCount: 280, deptName: '技术部' },
        { userName: '王五', contentCount: 210, deptName: '市场部' },
        { userName: '赵六', contentCount: 180, deptName: '运营部' },
        { userName: '钱七', contentCount: 150, deptName: '客服部' }
      ]
    }
  })
}
