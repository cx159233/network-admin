export function getAdStatList(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: [
        { statId: 1, adId: 1, adName: '广告1', viewCount: 1000, clickCount: 50, clickRate: '5.00%', statDate: '2024-01-01' },
        { statId: 2, adId: 2, adName: '广告2', viewCount: 2000, clickCount: 100, clickRate: '5.00%', statDate: '2024-01-02' }
      ],
      total: 2
    }
  })
}

export function getLineChartStatDatas(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      xAxis: ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'],
      series: [
        { name: '曝光量', data: [1000, 1200, 1100, 1300, 1400] },
        { name: '点击量', data: [50, 60, 55, 65, 70] }
      ]
    }
  })
}

export function getAdClickLogList(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: [
        { logId: 1, adId: 1, adName: '广告1', ip: '192.168.1.1', clickTime: '2024-01-01 10:00:00' },
        { logId: 2, adId: 1, adName: '广告1', ip: '192.168.1.2', clickTime: '2024-01-01 11:00:00' }
      ],
      total: 2
    }
  })
}

export function getAdViewLogList(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: [
        { logId: 1, adId: 1, adName: '广告1', ip: '192.168.1.1', viewTime: '2024-01-01 10:00:00' },
        { logId: 2, adId: 1, adName: '广告1', ip: '192.168.1.2', viewTime: '2024-01-01 11:00:00' }
      ],
      total: 2
    }
  })
}
