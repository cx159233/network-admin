export function getSiteList() {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: [
      { siteId: '1', siteName: '示例站点1', siteUrl: 'https://example1.com' },
      { siteId: '2', siteName: '示例站点2', siteUrl: 'https://example2.com' }
    ]
  })
}

export function refreshBdTongjiToken() {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: null
  })
}

// 站点趋势概览数据
export function getSiteTrendOverviewDatas(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      pvCount: 12580,
      uvCount: 6420,
      ipCount: 5890,
      avgVisitTime: 180,
      avgVisitPages: 3.5,
      bounceRate: 45.2
    }
  })
}

// 站点区域分布概览数据
export function getSiteDistrictOverviewDatas(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      items: [
        { province: '北京', pv: 3500, uv: 1800 },
        { province: '上海', pv: 2800, uv: 1500 },
        { province: '广东', pv: 2200, uv: 1200 },
        { province: '浙江', pv: 1500, uv: 800 },
        { province: '江苏', pv: 1200, uv: 600 }
      ]
    }
  })
}

// 站点其他概览数据
export function getSiteOtherOverviewDatas(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      sourceItems: [
        { source: '搜索引擎', value: 45 },
        { source: '直接访问', value: 30 },
        { source: '外部链接', value: 15 },
        { source: '社交媒体', value: 10 }
      ],
      deviceItems: [
        { device: 'PC', value: 60 },
        { device: 'Mobile', value: 35 },
        { device: 'Tablet', value: 5 }
      ]
    }
  })
}

// 站点趋势分析数据
export function getSiteTimeTrendDatas(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      items: [
        { date: '2024-01-01', pv: 420, uv: 210, ip: 195 },
        { date: '2024-01-02', pv: 450, uv: 225, ip: 210 },
        { date: '2024-01-03', pv: 380, uv: 190, ip: 175 },
        { date: '2024-01-04', pv: 520, uv: 260, ip: 240 },
        { date: '2024-01-05', pv: 480, uv: 240, ip: 220 },
        { date: '2024-01-06', pv: 350, uv: 175, ip: 160 },
        { date: '2024-01-07', pv: 390, uv: 195, ip: 180 }
      ]
    }
  })
}
