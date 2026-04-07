// 查询站点列表
export function listSite(query) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: {
      rows: [
        {
          createBy: 'zhangxixi',
          createTime: '2024-10-16 15:00:29',
          updateBy: 'cqsk002',
          updateTime: '2025-03-13 11:13:53',
          siteId: '601807368400965',
          parentId: '0',
          name: '渝康云',
          isPublish: 'Y',
          logo: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/1075398db95f469f88531e198b90ecfe.png',
          logoSrc: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/1075398db95f469f88531e198b90ecfe.png',
          path: 'YWMH',
          resourceUrl: 'http://10.107.2.151/cq-network-org-view/#/home/http://health-cloud.cq.hc/',
          sortFlag: '172906203000',
          publishPipeProps: {},
          configProps: {}
        }
      ],
      total: '1'
    }
  })
}

export function getSiteOptions() {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: [
      { siteId: '601807368400965', name: '渝康云' }
    ]
  })
}

// 获取当前站点
export function getCurrentSite() {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: {
      siteId: '601807368400965',
      name: '渝康云',
      domain: 'www.example.com'
    }
  })
}

// 设置当前站点
export function setCurrentSite(siteId) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: null
  })
}

// 查询站点详细
export function getSite(siteId) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: {
      siteId: siteId,
      name: '渝康云',
      domain: 'www.example.com',
      path: 'YWMH',
      resourceUrl: 'http://10.107.2.151/cq-network-org-view/#/home/http://health-cloud.cq.hc/',
      logo: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/1075398db95f469f88531e198b90ecfe.png',
      logoSrc: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/1075398db95f469f88531e198b90ecfe.png',
      description: '渝康云卫生健康服务平台',
      status: 1,
      publishPipeDatas: [
        { pipeCode: 'pc', pipeName: 'PC端' },
        { pipeCode: 'mobile', pipeName: '移动端' }
      ],
      configProps: {}
    }
  })
}

// 新增站点配置
export function addSite(data) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: { siteId: Date.now(), ...data }
  })
}

// 修改站点配置
export function updateSite(data) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: data
  })
}

// 删除站点配置
export function delSite(siteId) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: null
  })
}

// 发布站点
export function publishSite(data) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: null
  })
}

export function publishUnSite(data) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: null
  })
}

// 导出站点主题
export function exportSiteTheme(data) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: { downloadUrl: '/mock/download/theme.zip' }
  })
}

// 重建全站索引
export function rebuildIndex() {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: null
  })
}

// 获取站点扩展属性
export function getSiteExtends(params) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: {
      seoTitle: '渝康云',
      seoKeywords: '卫生健康, 云服务',
      seoDescription: '渝康云卫生健康服务平台'
    }
  })
}

// 保存站点扩展属性
export function saveSiteExtends(siteId, data) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: null
  })
}

// 站点自定义属性列表
export function getSitePropertyList(params) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    rows: [
      { propId: 1, propName: '备案号', propValue: '京ICP备12345678号' },
      { propId: 2, propName: '版权信息', propValue: '© 2024 渝康云' }
    ],
    total: 2
  })
}

// 新增站点自定义属性
export function addSiteProperty(data) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: { propId: Date.now(), ...data }
  })
}

// 修改站点自定义属性
export function saveSiteProperty(data) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: data
  })
}

// 删除站点自定义属性
export function deleteSiteProperty(data) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: null
  })
}

// 获取站点默认模板配置数据
export function getDefaultTemplates(params) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: {
      indexTemplate: 'index.html',
      listTemplate: 'list.html',
      detailTemplate: 'detail.html'
    }
  })
}

// 保存站点默认模板配置数据
export function saveDefaultTemplates(data) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: null
  })
}

// 站点默认模板配置应用到指定栏目
export function applyDefaultTemplate(data) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: null
  })
}

// 上传水印图片
export function uploadWatermarker(siteId, data) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: { url: '/mock/images/watermark.png' }
  })
}

// 动态模板类型
export function getDynamicPageTypes() {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: [
      { type: 'search', name: '搜索页' },
      { type: 'tag', name: 'TAG页' },
      { type: 'special', name: '专题页' }
    ]
  })
}
