export function listAdSpaces() {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: [
      { adSpaceId: 1, spaceName: '广告位1', spaceCode: 'AD001', width: 300, height: 250 },
      { adSpaceId: 2, spaceName: '广告位2', spaceCode: 'AD002', width: 728, height: 90 }
    ]
  })
}

export function getAdSpace(pageWidgetId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: { adSpaceId: 1, spaceName: '广告位1', spaceCode: 'AD001', width: 300, height: 250 }
  })
}

export function addAdSpace(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function editAdSpace(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function deleteAdSpace(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function publishAdSpace(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function listAdvertisementTypes() {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: [
      { typeId: 1, typeName: '图片广告' },
      { typeId: 2, typeName: '文字广告' },
      { typeId: 3, typeName: '代码广告' }
    ]
  })
}

export function listAdvertisements(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: [
        { advertisementId: 1, adName: '广告1', adSpaceId: 1, adSpaceName: '广告位1', typeId: 1, typeName: '图片广告', status: '1', createTime: '2024-01-01 10:00:00' },
        { advertisementId: 2, adName: '广告2', adSpaceId: 2, adSpaceName: '广告位2', typeId: 2, typeName: '文字广告', status: '1', createTime: '2024-01-02 10:00:00' }
      ],
      total: 2
    }
  })
}

export function getAdvertisement(advertisementId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: { advertisementId: 1, adName: '广告1', adSpaceId: 1, typeId: 1, status: '1', adContent: '{}' }
  })
}

export function addAdvertisement(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function editAdvertisement(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function deleteAdvertisement(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function enableAdvertisement(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function disableAdvertisement(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}
