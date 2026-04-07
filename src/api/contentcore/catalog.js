// 插叙栏目类型
export function getCatalogTypes() {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: [
      { type: 'channel', name: '普通栏目' },
      { type: 'link', name: '链接栏目' }
    ]
  })
}

// 查询内容类型
export function getContentTypes() {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: [
      { id: 'article', name: '文章' },
      { id: 'image', name: '图集' },
      { id: 'video', name: '视频' },
      { id: 'audio', name: '音频' },
      { id: 'download', name: '下载' }
    ]
  })
}

// 查询栏目树结构
export function getCatalogTreeData(params) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: {
      rows: [
        {
          id: '603612031123525',
          parentId: '0',
          label: '首页',
          disabled: false,
          checked: false,
          props: {
            alias: '重庆市卫生健康云',
            internalUrl: 'iurl://catalog?id=603612031123525',
            logoSrc: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/7400af347a464359882a0d1e881e29fb.png',
            logo: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/7400af347a464359882a0d1e881e29fb.png',
            path: '/home/',
            description: '构建统一的 "卫生健康云" 服务体系，探索卫生健康行业融合创新发展，营造卫生健康数字新生态',
            name: '首页'
          },
          root: true,
          defaultExpanded: false,
          new: false
        },
        {
          id: '603612031287365',
          parentId: '0',
          label: '数字应用',
          disabled: false,
          checked: false,
          props: {
            alias: '数字健康应用服务',
            internalUrl: 'iurl://catalog?id=603612031287365',
            logoSrc: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/aec24d78b2414fc7991c2de484893056.png',
            logo: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/aec24d78b2414fc7991c2de484893056.png',
            path: '/digital/application/',
            description: '强化协同加快提升基层医疗机构患者救治能力，提升基层医疗服务效能，加强市级医疗数字能力共享和下沉',
            name: '数字应用'
          },
          root: true,
          defaultExpanded: false,
          new: false
        },
        {
          id: '603612031287366',
          parentId: '0',
          label: '组件中枢',
          disabled: false,
          checked: false,
          props: {
            alias: '组件中枢',
            internalUrl: 'iurl://catalog?id=603612031287366',
            logoSrc: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/091762e562fc483e97495a1ed1c960df.png',
            logo: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/091762e562fc483e97495a1ed1c960df.png',
            path: '/component/hub/',
            description: '构建智能高效的应用支撑体系，为卫生健康行业应用提供基础技术支撑，沉淀 卫生健康行业特色能力组件库，形成行业应用公共组件共建共享服务模式，提高数字健康创新应用构建效率，催生卫生健康服务新模式与新业态',
            name: '组件中枢'
          },
          root: true,
          defaultExpanded: false,
          new: false
        },
        {
          id: '603612031291461',
          parentId: '0',
          label: '安全服务',
          disabled: false,
          checked: false,
          props: {
            alias: '智慧安全服务',
            internalUrl: 'iurl://catalog?id=603612031291461',
            logoSrc: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/bb02c6f5e85642dc9bf72d4834e77ff0.png',
            logo: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/bb02c6f5e85642dc9bf72d4834e77ff0.png',
            path: '/security/service/',
            description: '利用人工智能和大数据技术，实时监控分析安全威胁，提供高效的预警和响应，确保很多种和网络环境的全方位安全。',
            name: '安全服务'
          },
          root: true,
          defaultExpanded: false,
          new: false
        },
        {
          id: '603612031291462',
          parentId: '0',
          label: '数字科研',
          disabled: false,
          checked: false,
          props: {
            alias: '重庆市医学科研数字服务',
            internalUrl: 'iurl://catalog?id=603612031291462',
            logoSrc: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/25ab52198198469aa78ee5b82dbe2ca1.png',
            logo: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/25ab52198198469aa78ee5b82dbe2ca1.png',
            path: '/digital/research/',
            description: '开展医学领域科研服务数字化赋能，为医学科研活动的过程、进展和结果提供数据支持服务、数据处理服务、配套支持服务，提升科技创新能力，营造良好科研环境，规范开展科研工作',
            name: '数字科研'
          },
          root: true,
          defaultExpanded: false,
          new: false
        },
        {
          id: '603612031291463',
          parentId: '0',
          label: '区块链',
          disabled: false,
          checked: false,
          props: {
            alias: '区块链创新应用',
            internalUrl: 'iurl://catalog?id=603612031291463',
            logoSrc: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/275e0e48b6fe4fdcbd5a9ab1e23faa0e.png',
            logo: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/275e0e48b6fe4fdcbd5a9ab1e23faa0e.png',
            path: '/block/chain/',
            description: '以区块链、云计算、大数据等新一代信息技术为引领，构建"1221"一体化卫生健康数字化新基础体系，以"渝康链"区块链公共服务平台为底座，以电子处方流转为切入口，实现医疗数据流转和共享、数据资产管理、价值实现和跨行业业务协同',
            name: '区块链'
          },
          root: true,
          defaultExpanded: false,
          new: false
        },
        {
          id: '603612031291464',
          parentId: '0',
          label: '信息资讯',
          disabled: false,
          checked: false,
          props: {
            alias: '信息资讯',
            internalUrl: 'iurl://catalog?id=603612031291464',
            logoSrc: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/4d5bbb1837774b869b5e6bcffa9b7fbe.png',
            logo: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/4d5bbb1837774b869b5e6bcffa9b7fbe.png',
            path: '/infomations/',
            description: '了解最新动态',
            name: '信息资讯'
          },
          children: [
            {
              id: '603612133322821',
              parentId: '603612031291464',
              label: '通知公告',
              disabled: false,
              checked: false,
              props: {
                alias: 'xxzx_tzgg',
                internalUrl: 'iurl://catalog?id=603612133322821',
                logoSrc: '',
                logo: '',
                path: 'xxzx/tzgg/',
                description: '',
                name: '通知公告'
              },
              children: [
                {
                  id: '603612180066373',
                  parentId: '603612133322821',
                  label: '通知',
                  disabled: false,
                  checked: false,
                  props: {
                    alias: 'xxzx_tzgg_tz',
                    internalUrl: 'iurl://catalog?id=603612180066373',
                    logoSrc: '',
                    logo: '',
                    path: 'xxzx/tzgg/tz/',
                    description: '',
                    name: '通知'
                  },
                  root: false,
                  defaultExpanded: false,
                  new: false
                },
                {
                  id: '603612256587845',
                  parentId: '603612133322821',
                  label: '公告',
                  disabled: false,
                  checked: false,
                  props: {
                    alias: 'xxzx_tzgg_gg',
                    internalUrl: 'iurl://catalog?id=603612256587845',
                    logoSrc: '',
                    logo: '',
                    path: 'xxzx/tzgg/gg/',
                    description: '',
                    name: '公告'
                  },
                  root: false,
                  defaultExpanded: false,
                  new: false
                },
                {
                  id: '603612256587846',
                  parentId: '603612133322821',
                  label: '网络信息安全',
                  disabled: false,
                  checked: false,
                  props: {
                    alias: 'xxzx_tzgg_wlxxaq',
                    internalUrl: 'iurl://catalog?id=603612256587846',
                    logoSrc: '',
                    logo: '',
                    path: 'xxzx/tzgg/wlxxaq/',
                    description: '',
                    name: '网络信息安全'
                  },
                  root: false,
                  defaultExpanded: false,
                  new: false
                }
              ],
              root: false,
              defaultExpanded: false,
              new: false
            },
            {
              id: '603612378570821',
              parentId: '603612031291464',
              label: '工作动态',
              disabled: false,
              checked: false,
              props: {
                alias: 'xxzx_gzdt',
                internalUrl: 'iurl://catalog?id=603612378570821',
                logoSrc: '',
                logo: '',
                path: 'xxzx/gzdt/',
                description: '',
                name: '工作动态'
              },
              children: [
                {
                  id: '603612437631045',
                  parentId: '603612378570821',
                  label: '工作交流',
                  disabled: false,
                  checked: false,
                  props: {
                    alias: 'xxzx_gzdt_gzjl',
                    internalUrl: 'iurl://catalog?id=603612437631045',
                    logoSrc: '',
                    logo: '',
                    path: 'xxzx/gzdt/gzjl/',
                    description: '',
                    name: '工作交流'
                  },
                  root: false,
                  defaultExpanded: false,
                  new: false
                }
              ],
              root: false,
              defaultExpanded: false,
              new: false
            },
            {
              id: '603612378579013',
              parentId: '603612031291464',
              label: '专项工作',
              disabled: false,
              checked: false,
              props: {
                alias: 'xxzx_zxgz',
                internalUrl: 'iurl://catalog?id=603612378579013',
                logoSrc: '',
                logo: '',
                path: 'xxzx/zxgz/',
                description: '',
                name: '专项工作'
              },
              children: [
                {
                  id: '603612498563141',
                  parentId: '603612378579013',
                  label: '信息化建设',
                  disabled: false,
                  checked: false,
                  props: {
                    alias: 'xxzx_zxgz_xxhjs',
                    internalUrl: 'iurl://catalog?id=603612498563141',
                    logoSrc: '',
                    logo: '',
                    path: 'xxzx/zxgz/xxhjs/',
                    description: '',
                    name: '信息化建设'
                  },
                  root: false,
                  defaultExpanded: false,
                  new: false
                }
              ],
              root: false,
              defaultExpanded: false,
              new: false
            },
            {
              id: '603612378583109',
              parentId: '603612031291464',
              label: '文档下载中心',
              disabled: false,
              checked: false,
              props: {
                alias: 'xxzx_wdxzzx',
                internalUrl: 'iurl://catalog?id=603612378583109',
                logoSrc: '',
                logo: '',
                path: 'xxzx/wdxzzx/',
                description: '',
                name: '文档下载中心'
              },
              children: [
                {
                  id: '603612612546629',
                  parentId: '603612378583109',
                  label: '资料下载',
                  disabled: false,
                  checked: false,
                  props: {
                    alias: 'xxzx_wdxzzx_zlxz',
                    internalUrl: 'iurl://catalog?id=603612612546629',
                    logoSrc: '',
                    logo: '',
                    path: 'xxzx/wdxzzx/zlxz/',
                    description: '',
                    name: '资料下载'
                  },
                  root: false,
                  defaultExpanded: false,
                  new: false
                },
                {
                  id: '604267432271941',
                  parentId: '603612378583109',
                  label: '系统操作手册',
                  disabled: false,
                  checked: false,
                  props: {
                    alias: 'xxzx_wdxzzx_xtczsc',
                    internalUrl: 'iurl://catalog?id=604267432271941',
                    logoSrc: '',
                    logo: '',
                    path: 'xxzx/wdxzzx/xtczsc/',
                    description: '',
                    name: '系统操作手册'
                  },
                  root: false,
                  defaultExpanded: false,
                  new: false
                },
                {
                  id: '603612612550726',
                  parentId: '603612378583109',
                  label: '模版下载',
                  disabled: false,
                  checked: false,
                  props: {
                    alias: 'xxzx_wdxzzx_mbxz',
                    internalUrl: 'iurl://catalog?id=603612612550726',
                    logoSrc: 'https://inews.gtimg.com/om_bt/Os3eJ8u3SgB3Kd-zrRRhgfR5hUvdwcVPKUTNO6O7sZfUwAA/641',
                    logo: 'https://inews.gtimg.com/om_bt/Os3eJ8u3SgB3Kd-zrRRhgfR5hUvdwcVPKUTNO6O7sZfUwAA/641',
                    path: 'xxzx/wdxzzx/mbxz/',
                    description: '',
                    name: '模版下载'
                  },
                  root: false,
                  defaultExpanded: false,
                  new: false
                },
                {
                  id: '603612612550727',
                  parentId: '603612378583109',
                  label: '软件下载',
                  disabled: false,
                  checked: false,
                  props: {
                    alias: 'xxzx_wdxzzx_rjxz',
                    internalUrl: 'iurl://catalog?id=603612612550727',
                    logoSrc: '',
                    logo: '',
                    path: 'xxzx/wdxzzx/rjxz/',
                    description: '',
                    name: '软件下载'
                  },
                  root: false,
                  defaultExpanded: false,
                  new: false
                }
              ],
              root: false,
              defaultExpanded: false,
              new: false
            }
          ],
          root: true,
          defaultExpanded: false,
          new: false
        },
        {
          id: '603612031295557',
          parentId: '0',
          label: '关于我们',
          disabled: false,
          checked: false,
          props: {
            alias: '关于我们',
            internalUrl: 'iurl://catalog?id=603612031295557',
            logoSrc: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/bfb7859351694ad6892f721975a8b8c3.png',
            logo: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/bfb7859351694ad6892f721975a8b8c3.png',
            path: '/about/us/',
            description: '',
            name: '关于我们'
          },
          root: true,
          defaultExpanded: false,
          new: false
        }
      ],
      expandMode: '',
      siteName: '渝康云'
    }
  })
}

// 查询栏目信息
export function getCatalogData(catalogId) {
  // 根据 catalogId 返回不同的栏目数据
  const catalogMap = {
    '603612031123525': {
      name: '首页',
      alias: '重庆市卫生健康云',
      path: '/home/',
      description: '构建统一的 "卫生健康云" 服务体系，探索卫生健康行业融合创新发展，营造卫生健康数字新生态',
      logoSrc: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/7400af347a464359882a0d1e881e29fb.png'
    },
    '603612031287365': {
      name: '数字应用',
      alias: '数字健康应用服务',
      path: '/digital/application/',
      description: '强化协同加快提升基层医疗机构患者救治能力，提升基层医疗服务效能，加强市级医疗数字能力共享和下沉',
      logoSrc: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/aec24d78b2414fc7991c2de484893056.png'
    },
    '603612031287366': {
      name: '组件中枢',
      alias: '组件中枢',
      path: '/component/hub/',
      description: '构建智能高效的应用支撑体系，为卫生健康行业应用提供基础技术支撑，沉淀 卫生健康行业特色能力组件库，形成行业应用公共组件共建共享服务模式，提高数字健康创新应用构建效率，催生卫生健康服务新模式与新业态',
      logoSrc: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/091762e562fc483e97495a1ed1c960df.png'
    },
    '603612031291461': {
      name: '安全服务',
      alias: '智慧安全服务',
      path: '/security/service/',
      description: '利用人工智能和大数据技术，实时监控分析安全威胁，提供高效的预警和响应，确保很多种和网络环境的全方位安全。',
      logoSrc: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/bb02c6f5e85642dc9bf72d4834e77ff0.png'
    },
    '603612031291462': {
      name: '数字科研',
      alias: '重庆市医学科研数字服务',
      path: '/digital/research/',
      description: '开展医学领域科研服务数字化赋能，为医学科研活动的过程、进展和结果提供数据支持服务、数据处理服务、配套支持服务，提升科技创新能力，营造良好科研环境，规范开展科研工作',
      logoSrc: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/25ab52198198469aa78ee5b82dbe2ca1.png'
    },
    '603612031291463': {
      name: '区块链',
      alias: '区块链创新应用',
      path: '/block/chain/',
      description: '以区块链、云计算、大数据等新一代信息技术为引领，构建"1221"一体化卫生健康数字化新基础体系，以"渝康链"区块链公共服务平台为底座，以电子处方流转为切入口，实现医疗数据流转和共享、数据资产管理、价值实现和跨行业业务协同',
      logoSrc: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/275e0e48b6fe4fdcbd5a9ab1e23faa0e.png'
    },
    '603612031291464': {
      name: '信息资讯',
      alias: '信息资讯',
      path: '/infomations/',
      description: '了解最新动态',
      logoSrc: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/4d5bbb1837774b869b5e6bcffa9b7fbe.png'
    },
    '603612031295557': {
      name: '关于我们',
      alias: '关于我们',
      path: '/about/us/',
      description: '',
      logoSrc: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/bfb7859351694ad6892f721975a8b8c3.png'
    }
  };

  const catalog = catalogMap[catalogId] || { name: '栏目' + catalogId, alias: '栏目别名', path: '/', description: '', logoSrc: '' };

  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: {
      catalogId: catalogId,
      name: catalog.name,
      alias: catalog.alias,
      path: catalog.path,
      description: catalog.description,
      logoSrc: catalog.logoSrc,
      contentType: 'article',
      status: 1,
      visibleFlag: 'Y',
      publishPipeDatas: [
        { pipeCode: 'pc', pipeName: 'PC端' },
        { pipeCode: 'mobile', pipeName: '移动端' }
      ],
      configProps: {}
    }
  })
}

// 新增栏目
export function addCatalog(data) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: { catalogId: Date.now(), ...data }
  })
}

export function batchAddCatalog(data) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: null
  })
}

// 修改栏目
export function updateCatalog(data) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: data
  })
}

// 删除栏目
export function delCatalog(catalogId) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: null
  })
}

// 转移栏目
export function moveCatalog(fromCatalogId, toCatalogId) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: null
  })
}

// 发布栏目
export function publishCatalog(data) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: null
  })
}

// 获取栏目扩展属性
export function getCatalogExtends(params) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: {
      seoTitle: '首页',
      seoKeywords: '卫生健康, 云服务',
      seoDescription: '渝康云首页'
    }
  })
}

// 保存栏目扩展属性
export function saveCatalogExtends(catalogId, data) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: null
  })
}

// 栏目扩展配置应用到栏目
export function applyConfigPropsToChildren(data) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: null
  })
}

// 栏目发布通道配置应用到子栏目
export function applyPublishPipeToChildren(data) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: null
  })
}

// 修改栏目显示状态
export function changeVisible(catlaogId, visible) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: null
  })
}

export function sortCatalog(data) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: null
  })
}

export function generateAliasAndPath(data) {
  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: { alias: 'example', path: '/example' }
  })
}
