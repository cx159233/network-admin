// 查询能力组件列表
export function getComponentList(query) {
  // 能力组件 mock 数据
  const mockData = [
    {
      "componentId": "NLZJ202410210001",
      "siteId": "411683596922949",
      "name": "电子健康卡",
      "showOrder": 4,
      "logo": "http://10.128.23.29:9080/api/cms/resource/src/ucmp/20241024/2074a333b5844ed186a85f523b12b247.png",
      "description": "电子健康卡是按照国家统一标准生成的、具备身份识别功能的「健康身份证」，可实现诊前、诊中、诊后各环节医疗服务「一码通用」，能解决「一院一卡、重复发卡、多卡并存、互不通用」等传统就医繁琐问题。",
      "serviceProviderName": "",
      "contactName1": "",
      "contactPhone1": "",
      "contactName2": "",
      "contactPhone2": "",
      "deployServiceProvider": "10251",
      "deployServiceProviderView": "影像云",
      "cover": "10257",
      "coverView": "市级",
      "status": 20,
      "createBy": "zhangxixi",
      "createTime": "2024-10-21 10:43:04"
    },
    {
      "componentId": "NLZJ202410220001",
      "siteId": "601807368400965",
      "name": "无界诊疗的云桌面系统",
      "showOrder": 2,
      "logo": "",
      "description": "提供手机、平板、笔记本等多种可移动接入的国产化云桌面诊疗终端，一套专属账号保障了所有数据的跟随，无需重复的工作电脑、个人电脑来回数据流转；支持用户数据备份、系统容灾、移动云盘等能力；结合AI大数据分析能力助力医患资源的合理分配，提升患者的就医体验。",
      "serviceProviderName": "",
      "contactName1": "",
      "contactPhone1": "",
      "contactName2": "",
      "contactPhone2": "",
      "deployServiceProvider": "10253",
      "deployServiceProviderView": "移动云",
      "cover": "10258",
      "coverView": "区（县）域",
      "status": 20,
      "createBy": "zhangxixi",
      "createTime": "2024-10-22 14:08:38"
    },
    {
      "componentId": "NLZJ202410240001",
      "siteId": "601807368400965",
      "name": "慧影影像AI辅助诊断整合工具",
      "showOrder": 3,
      "logo": "",
      "description": "通过运用云计算、大数据分析和机器学习等方法，提供面向临床的影像智能辅助诊断服务，系统通过对数千或数万例图像进行训练和学习，能够快速准确地识别和分类病灶，辅助医生快速判断和诊断疾病。可针对多种影像学图像，如CT、DR等影像进行自动分析和提取信息，从而为疾病的早期、准确诊断和治疗提供有力的支持。",
      "serviceProviderName": "",
      "contactName1": "",
      "contactPhone1": "",
      "contactName2": "",
      "contactPhone2": "",
      "deployServiceProvider": "10250",
      "deployServiceProviderView": "浪潮云",
      "cover": "10257",
      "coverView": "市级",
      "status": 20,
      "createBy": "zhangxixi",
      "createTime": "2024-10-24 14:59:25"
    },
    {
      "componentId": "NLZJ202410240002",
      "siteId": "601807368400965",
      "name": "慧影影像分析工具",
      "showOrder": 1,
      "logo": "",
      "description": "以影像数据为驱动，融合放射组学、深度学习分析方法和人工智能技术，将影像数据、病理数据、检查报告、临床信息等数据进行融合管理，通过自动化的分析和挖掘，辅助医生完成高价值的科研工作，激活数据价值，提升医院科研能力，输出高水平科研成果。平台支持基于放射、超声、病理、核医学以及临床数据的多科室影像临床融合的科研课题，实现覆盖全院、多科室、单科室、个人课题等多种场景研究的一站式医疗大数据研究解决方案。",
      "serviceProviderName": "",
      "contactName1": "",
      "contactPhone1": "",
      "contactName2": "",
      "contactPhone2": "",
      "deployServiceProvider": "10250",
      "deployServiceProviderView": "浪潮云",
      "cover": "10256",
      "coverView": "不限",
      "status": 20,
      "createBy": "zhangxixi",
      "createTime": "2024-10-24 15:00:03"
    },
    {
      "componentId": "NLZJ202410240003",
      "siteId": "601807368400965",
      "name": "慧影影像结果查看器组件",
      "showOrder": 1,
      "logo": "",
      "description": "1、患者可随时随地获取个人DICOM格式的影像数据和检查报告，支持通过电脑、平板、手机等移动终端查看到个人的影像图像和检查报告，既方便安全易于分享又不会丢失损坏。2、医生可随时随地调阅原始影像进行阅片，解决了阅片及处理影像受办公环境的限制问题，极大程度的方便影像科医生的办公。以DICOM方式查看影像，看片质量不受影响，方便安全，不受办公环境限制，实现影像数据的互联互通。",
      "serviceProviderName": "",
      "contactName1": "",
      "contactPhone1": "",
      "contactName2": "",
      "contactPhone2": "",
      "deployServiceProvider": "10250",
      "deployServiceProviderView": "浪潮云",
      "cover": "10256",
      "coverView": "不限",
      "status": 20,
      "createBy": "zhangxixi",
      "createTime": "2024-10-24 15:00:21"
    },
    {
      "componentId": "NLZJ202410240004",
      "siteId": "601807368400965",
      "name": "医信签CA认证工具",
      "showOrder": 4,
      "logo": "",
      "description": "提供用户在线实名核验、CA数字证书签发、证书续期和基于数字证书的登录认证服务。能够结合用户移动终端，提供扫码认证、短信认证、动态令牌认证、UKEY认证等多种CA登录认证功能，满足在PC端和移动端的可信CA认证需求。",
      "serviceProviderName": "",
      "contactName1": "",
      "contactPhone1": "",
      "contactName2": "",
      "contactPhone2": "",
      "deployServiceProvider": "10250",
      "deployServiceProviderView": "浪潮云",
      "cover": "10256",
      "coverView": "不限",
      "status": 20,
      "createBy": "zhangxixi",
      "createTime": "2024-10-24 15:00:40"
    },
    {
      "componentId": "NLZJ202410240005",
      "siteId": "601807368400965",
      "name": "医信签医护电子签名工具",
      "showOrder": 1,
      "logo": "",
      "description": "为医护人员提供医疗文书电子签名服务，支持扫码签名、授权签名、移动签名、对方会签等多种方式，满足PC端和移动端的签署业务需求，提供电子签名文件存储、查验、取证等服务，满足《电子签名法》等法律法规要求。",
      "serviceProviderName": "",
      "contactName1": "",
      "contactPhone1": "",
      "contactName2": "",
      "contactPhone2": "",
      "deployServiceProvider": "10250",
      "deployServiceProviderView": "浪潮云",
      "cover": "10256",
      "coverView": "不限",
      "status": 20,
      "createBy": "zhangxixi",
      "createTime": "2024-10-24 15:01:13"
    },
    {
      "componentId": "NLZJ202410240006",
      "siteId": "601807368400965",
      "name": "医信签患者电子签名工具",
      "showOrder": 1,
      "logo": "",
      "description": "为患者、家属提供医疗文书电子签名服务，支持智能签名屏、有线签字板、智能手机等多种终端，提供患者身份核验、医疗文书浏览、签字采集、指纹采集、录音录像采集和文书电子签名和签名查验等功能。提供签署文件存储、查验、取证等服务，满足《电子签名法》等法律法规要求。",
      "serviceProviderName": "",
      "contactName1": "",
      "contactPhone1": "",
      "contactName2": "",
      "contactPhone2": "",
      "deployServiceProvider": "10250",
      "deployServiceProviderView": "浪潮云",
      "cover": "10256",
      "coverView": "不限",
      "status": 20,
      "createBy": "zhangxixi",
      "createTime": "2024-10-24 15:01:28"
    },
    {
      "componentId": "NLZJ202410240007",
      "siteId": "601807368400965",
      "name": "亲笔签手写电子化签名与电子印章能力组件",
      "showOrder": 1,
      "logo": "",
      "description": "手写电子化签名与电子印章能力组件是电子文件、电子公文、电子病案的关键基础设施支撑。采用人工智能技术实现「数字笔迹」，满足电子化签署与纸质签署具有同等法律效力。与传统CA技术不同，突破了医疗服务场景下随机人群无需CA证书的面签和远程签署身份鉴别与意愿表达合一印证难题，同时免去了经营主体购买CA证书环境，建立了程序更便利、资源更集约的医疗服务新模式。电子印章来源于公安部印模库，权威、可靠。同时，利用笔迹来进行印章的调用，可锁定用印人身份，确保用印安全。",
      "serviceProviderName": "",
      "contactName1": "",
      "contactPhone1": "",
      "contactName2": "",
      "contactPhone2": "",
      "deployServiceProvider": "10250",
      "deployServiceProviderView": "浪潮云",
      "cover": "10256",
      "coverView": "不限",
      "status": 20,
      "createBy": "zhangxixi",
      "createTime": "2024-10-24 15:01:43"
    },
    {
      "componentId": "NLZJ202410240008",
      "siteId": "601807368400965",
      "name": "数科文档网页轻阅读组件",
      "showOrder": 1,
      "logo": "",
      "description": "系统提供在线预览和文件处理服务，实现多格式阅览、文件编辑、安全管控、可视化签章验章等特色功能，可应用于网站发布、协同办公、移动办公、无纸化会议、电子签约等多种场景。支持将OFFICE/WPS系列文档、OFD/PDF等版式文件、OFD/PDF文件流、图片、网页、文本文件、音视频、压缩包等多格式文档实时解析并向用户按需推送，支持加密文档的解析，方便用户在各类系统平台上免插件方式原版原式、快捷阅读常见文档内容，支持打印、下载与分享。",
      "serviceProviderName": "",
      "contactName1": "",
      "contactPhone1": "",
      "contactName2": "",
      "contactPhone2": "",
      "deployServiceProvider": "10250",
      "deployServiceProviderView": "浪潮云",
      "cover": "10256",
      "coverView": "不限",
      "status": 20,
      "createBy": "zhangxixi",
      "createTime": "2024-10-24 15:13:21"
    },
    {
      "componentId": "NLZJ202410240009",
      "siteId": "601807368400965",
      "name": "数科文件转换迁移组件",
      "showOrder": 1,
      "logo": "",
      "description": "支持将 0ffice、WPS、PDF、图片、网页、Visio、TXT、CEB、CEBX、SEP、PS、二扫、CAJ、XPS、EML、CAD 等格式文件转换为 OFD 版式文件，也可将 OFD 文件转换为 PDF 文件、CEB 文件和图片文件,实现 OFD 格式与 PDF、CEB 及图片格式的互转功能,支持将 OFD 文件转换为 OFD-A 文件，实现归档格式标准化转换处理。提供格式转换和版式加工服务，支持集群配置，提供实时转换、批量转换和套版转换功能，支持元数据处理、数字签名处理、批量盖章、二维码处理等版式文档二次功能。",
      "serviceProviderName": "",
      "contactName1": "",
      "contactPhone1": "",
      "contactName2": "",
      "contactPhone2": "",
      "deployServiceProvider": "10250",
      "deployServiceProviderView": "浪潮云",
      "cover": "10256",
      "coverView": "不限",
      "status": 20,
      "createBy": "zhangxixi",
      "createTime": "2024-10-24 15:13:39"
    },
    {
      "componentId": "NLZJ202410240010",
      "siteId": "601807368400965",
      "name": "飞图医学影像浏览工具",
      "showOrder": 1,
      "logo": "",
      "description": "医学影像浏览工作站是专门用于查看、操作和分析医学影像数据(如CT、MRI、X射线等)的应用程序,能够打开标准DICOM格式的影像数据,提供基本的影像处理功能(如调整窗宽/窗位、测量、标注等)、三维重建、影像融合等多种功能,为临床医生提供高效便捷的影像诊断辅助。",
      "serviceProviderName": "",
      "contactName1": "",
      "contactPhone1": "",
      "contactName2": "",
      "contactPhone2": "",
      "deployServiceProvider": "10250",
      "deployServiceProviderView": "浪潮云",
      "cover": "10256",
      "coverView": "不限",
      "status": 20,
      "createBy": "zhangxixi",
      "createTime": "2024-10-24 15:13:57"
    },
    {
      "componentId": "NLZJ202410240011",
      "siteId": "601807368400965",
      "name": "沁铭数字影像调阅工具",
      "showOrder": 1,
      "logo": "",
      "description": "数字胶片影像调阅模块是一种基于云计算技术的影像查看和分享解决方案，它改变了传统的物理胶片使用方式，使得医生、患者及授权人员能够通过互联网安全地访问和查看医学影像。支持允许用户从任何有网络连接的地方访问医学影像，无需在特定地点或使用专用设备，提高了影像数据的可访问性和灵活性。支持提供高质量的图像显示功能，支持放大、缩小、旋转、窗口/水平调整等操作，使医生能够清晰、准确地查看细节，提高诊断精度。多模态融合，支持多种医学影像格式（如DICOM），并能将不同类型的影像（如CT、MRI、X-ray等）整合在一起，方便进行对比分析和综合诊断。支持注释与测量，提供画图、箭头、文字标注等功能，以及距离、角度、面积等测量工具，帮助医生在影像上做标记和测量，便于讨论和教学。",
      "serviceProviderName": "",
      "contactName1": "",
      "contactPhone1": "",
      "contactName2": "",
      "contactPhone2": "",
      "deployServiceProvider": "10250",
      "deployServiceProviderView": "浪潮云",
      "cover": "10256",
      "coverView": "不限",
      "status": 20,
      "createBy": "zhangxixi",
      "createTime": "2024-10-24 15:14:12"
    },
    {
      "componentId": "NLZJ202410240012",
      "siteId": "601807368400965",
      "name": "沁铭数字影像后期处理工具",
      "showOrder": 1,
      "logo": "",
      "description": "移动端医学影像三维后处理模块是专门为移动设备设计的高级影像处理软件，它将复杂的医学影像处理能力带入了便携式设备，支持智能手机、平板电脑、笔记本电脑等，拓展了临床应用的场景，无在急诊评估、手术规划还是患者教育，都发挥重要作用支持三维重建，利用计算机算法将二维医学影像（如CT或MRI切片）转换为三维模型，帮助医生和患者更直观地理解解剖结构和病理变化。支持多平面重组（MPR），允许用户在轴向、冠状面、矢状面等多个方向上查看影像，甚至可以自定义视角，以便全面分析病灶位置和形态。支持体积渲染（VR），通过透明度和色彩映射技术，实现对组织结构的半透明或全透明渲染，提供更为逼真的视觉效果，有助于识别复杂解剖关系。支持最大强度投影（MIP）：突出显示高密度结构，如血管、骨骼等，对于血管造影、骨科影像等场景特别有用。支持最小强度投影（MinIP），MinIP用于显示低密度区域，如气道、肠道等空腔器官的内部情况。支持在同一界面基于音视频同步交互下的多方影像诊断同步和三维后处理同步等操作功能。",
      "serviceProviderName": "",
      "contactName1": "",
      "contactPhone1": "",
      "contactName2": "",
      "contactPhone2": "",
      "deployServiceProvider": "10250",
      "deployServiceProviderView": "浪潮云",
      "cover": "10256",
      "coverView": "不限",
      "status": 20,
      "createBy": "zhangxixi",
      "createTime": "2024-10-24 15:14:27"
    }
  ];

  // 过滤条件
  let filteredData = [...mockData];

  if (query && query.name) {
    filteredData = filteredData.filter(item =>
      item.name && item.name.includes(query.name)
    );
  }

  if (query && query.cover) {
    filteredData = filteredData.filter(item =>
      item.coverView === query.cover
    );
  }

  if (query && query.status) {
    filteredData = filteredData.filter(item =>
      String(item.status) === String(query.status)
    );
  }

  // 分页
  const pageNum = query && query.pageNum ? parseInt(query.pageNum) : 1;
  const pageSize = query && query.pageSize ? parseInt(query.pageSize) : 10;
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;
  const pagedData = filteredData.slice(start, end);

  return Promise.resolve({
    code: 200,
    msg: 'SUCCESS',
    data: {
      rows: pagedData,
      total: String(filteredData.length)
    }
  });
}

// 删除能力组件
export function delComponent(componentIds) {
  return Promise.resolve({
    code: 200,
    message: '删除成功',
    data: {}
  });
}

// 发布能力组件
export function publishComponent(componentIds) {
  return Promise.resolve({
    code: 200,
    message: '发布成功',
    data: {}
  });
}

// 下线能力组件
export function offlineComponent(componentIds) {
  return Promise.resolve({
    code: 200,
    message: '下线成功',
    data: {}
  });
}
