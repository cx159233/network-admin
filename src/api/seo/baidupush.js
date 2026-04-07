export function pushToBaidu(contentIds) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      success: true,
      pushedCount: contentIds?.length || 0,
      remain: 998
    }
  })
}
