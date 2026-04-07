export function listPageWidgetTypes() {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: [
      { type: 'carousel', name: '轮播图' },
      { type: 'links', name: '友情链接' },
      { type: 'notice', name: '公告' },
      { type: 'stat', name: '统计' }
    ]
  })
}

export function listPageWidgets(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: [
        {
          pageWidgetId: 1,
          name: '首页轮播图',
          type: 'carousel',
          code: 'home_carousel',
          status: 1,
          createTime: '2024-01-01 12:00:00'
        },
        {
          pageWidgetId: 2,
          name: '友情链接',
          type: 'links',
          code: 'friend_links',
          status: 1,
          createTime: '2024-01-02 12:00:00'
        },
        {
          pageWidgetId: 3,
          name: '系统公告',
          type: 'notice',
          code: 'system_notice',
          status: 1,
          createTime: '2024-01-03 12:00:00'
        }
      ],
      total: 3
    }
  })
}

export function getPageWidget(pageWidgetId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      pageWidgetId: pageWidgetId,
      name: '首页轮播图',
      type: 'carousel',
      code: 'home_carousel',
      status: 1,
      config: {
        items: [
          { image: '/uploads/slide1.jpg', link: '#', title: '幻灯片1' },
          { image: '/uploads/slide2.jpg', link: '#', title: '幻灯片2' }
        ]
      },
      createTime: '2024-01-01 12:00:00'
    }
  })
}

export function addPageWidget(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: { pageWidgetId: Date.now() }
  })
}

export function editPageWidget(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function deletePageWidget(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function publishPageWidgets(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}
