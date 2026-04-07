export function genSitemap(params) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      url: '/sitemap.xml',
      generatedTime: new Date().toISOString(),
      urlCount: 256
    }
  })
}
