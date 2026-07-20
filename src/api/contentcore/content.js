// 查询内容列表
export function getContentList(query) {
  // 数字应用栏目 ID
  const digitalAppCatalogId = '603612031287365';

  // 如果是数字应用栏目，返回应用列表数据
  if (query && String(query.catalogId) === digitalAppCatalogId) {
    const allRows = [
          {
            applicationId: 'SZYY202410180001',
            siteId: '411683596922949',
            name: '卫宁健康区域医疗卫生信息应用服务',
            address: 'http://10.227.10.14:10000/basic-frame/#/',
            serviceProviderName: '重庆卫宁健康科技有限公司',
            partnerName: '',
            contactName1: '陈宇鹏',
            contactPhone1: '18523554131',
            contactName2: '',
            contactPhone2: '',
            target: '10224;10225',
            targetView: '基层医疗卫生机构；公立医院',
            architecture: '10282',
            architectureView: '',
            deployServiceProvider: '10252',
            deployServiceProviderView: '电信云',
            cover: [
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10227', value: '基本公共卫生服务' },
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10228', value: '医院信息系统（HIS）' },
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10233', value: '家庭医生签约' },
              { type: 'AppScope_Hospital', typeValue: '公立医院', key: '10271', value: '医院信息系统（HIS）' }
            ],
            status: 10,
            createBy: 'zhangxixi',
            createTime: '2024-10-18 11:21:45',
            contentId: 'SZYY202410180001',
            title: '卫宁健康区域医疗卫生信息应用服务',
            contentType: 'app',
            catalogId: digitalAppCatalogId,
            appId: 'SZYY202410180001',
            targetObject: '基层医疗卫生机构；公立医院',
            appScope: '基层医疗卫生机构、公立医院',
            serviceProvider: '重庆卫宁健康科技有限公司',
            cooperativeEnterprise: '',
            cloudProvider: '电信云'
          },
          {
            applicationId: 'SZYY202410210001',
            siteId: '411683596922949',
            name: '同步远方医卫一体化应用服务',
            showOrder: 2,
            logo: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/f0ec5e42fbed4be1a35e18a43c0a9800.png',
            description: '对卫生院/社区卫生服中心、村卫生室/社区卫生服务站的信息系统升级建设，建设集"医卫一体化、界面一体化、数据一体化、业务一体化、流程一体化"的深度一体化的区域医疗卫生信息系统，实现数据互通、业务协同。',
            address: 'http://10.229.2.61:8080/synthetic/login',
            serviceProviderName: '同步远方（重庆）科技有限公司',
            partnerName: '',
            contactName1: '任燕',
            contactPhone1: '18771998099',
            contactName2: '罗甫名',
            contactPhone2: '15023873113',
            target: '10224;10225',
            targetView: '基层医疗卫生机构；公立医院',
            architecture: '',
            architectureView: '',
            deployServiceProvider: '10251',
            deployServiceProviderView: '影像云',
            cover: [
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10227', value: '基本公共卫生服务' },
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10228', value: '医院信息系统（HIS）' },
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10233', value: '家庭医生签约' },
              { type: 'AppScope_Hospital', typeValue: '公立医院', key: '10271', value: '医院信息系统（HIS）' }
            ],
            status: 10,
            createBy: 'zhangxixi',
            createTime: '2024-10-21 14:45:23',
            contentId: 'SZYY202410210001',
            title: '同步远方医卫一体化应用服务',
            contentType: 'app',
            catalogId: digitalAppCatalogId,
            appId: 'SZYY202410210001',
            targetObject: '基层医疗卫生机构；公立医院',
            appScope: '基层医疗卫生机构、公立医院',
            serviceProvider: '同步远方（重庆）科技有限公司',
            cooperativeEnterprise: '',
            cloudProvider: '影像云'
          },
          {
            applicationId: 'SZYY202410210002',
            siteId: '601807368400965',
            name: '中联公共卫生应用服务',
            showOrder: 3,
            logo: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/b50e1c0472a14787bf8de3f0fab26b99.png',
            description: '面向卫生健康主管单位及基层医疗卫生机构；侧重基层医疗卫生机构的基本公共卫生服务、家庭医生签约履约服务、医卫联动等为一体的基层医疗卫生机构综合管理信息系统；主要为提升基层医务人员的工作效率，着力辖区居民疾病防控，提供各级卫生健康部门宏观决策所需的公卫业务数据。',
            address: 'http://10.227.4.13:8899/account/login',
            serviceProviderName: '重庆中联信息产业有限责任公司',
            partnerName: '中国电信股份有限公司重庆分公司',
            contactName1: '胡虹剑',
            contactPhone1: '13368268201',
            contactName2: '',
            contactPhone2: '',
            target: '10224',
            targetView: '基层医疗卫生机构',
            architecture: '',
            architectureView: '',
            deployServiceProvider: '10252',
            deployServiceProviderView: '电信云',
            cover: [
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10233', value: '家庭医生签约' },
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10227', value: '基本公共卫生服务' }
            ],
            status: 10,
            createBy: 'zhangxixi',
            createTime: '2024-10-21 15:38:24',
            contentId: 'SZYY202410210002',
            title: '中联公共卫生应用服务',
            contentType: 'app',
            catalogId: digitalAppCatalogId,
            appId: 'SZYY202410210002',
            targetObject: '基层医疗卫生机构',
            appScope: '基层医疗卫生机构',
            serviceProvider: '重庆中联信息产业有限责任公司',
            cooperativeEnterprise: '中国电信股份有限公司重庆分公司',
            cloudProvider: '电信云'
          },
          {
            applicationId: 'SZYY202410210003',
            siteId: '601807368400965',
            name: '沁铭重庆一体化健康应用服务',
            showOrder: 4,
            logo: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/36027d4ec2ec44d58d04b8e0717c28dd.png',
            description: '适用于行业主管部门、基层医疗卫生机构。本系统涵盖医疗机构临床诊疗、医技、基本公卫、家医签约、数据治理、绩效考评、经济核算与运营管理的一体化应用基层医疗健康云系统。着力提升基层医疗卫生机构临床诊疗、检查检验、公卫服务、家医签约服务质效，促进医防融合，为病患提供高效便捷的就医体验，为行业主管部门提供高可靠数据支撑。',
            address: 'http://10.229.2.64:8081/master/#/login',
            serviceProviderName: '重庆沁铭医疗器械有限公司',
            partnerName: '',
            contactName1: '宦玉胜 ',
            contactPhone1: '13436022134',
            contactName2: '',
            contactPhone2: '',
            target: '10224;10225',
            targetView: '基层医疗卫生机构；公立医院',
            architecture: '',
            architectureView: '',
            deployServiceProvider: '10251',
            deployServiceProviderView: '影像云',
            cover: [
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10227', value: '基本公共卫生服务' },
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10228', value: '医院信息系统（HIS）' },
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10229', value: '实验室信息管理系统（LIS）' },
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10233', value: '家庭医生签约' },
              { type: 'AppScope_Hospital', typeValue: '公立医院', key: '10271', value: '医院信息系统（HIS）' },
              { type: 'AppScope_Hospital', typeValue: '公立医院', key: '10272', value: '实验室信息管理系统（LIS）' }
            ],
            status: 10,
            createBy: 'zhangxixi',
            createTime: '2024-10-21 17:04:10',
            contentId: 'SZYY202410210003',
            title: '沁铭重庆一体化健康应用服务',
            contentType: 'app',
            catalogId: digitalAppCatalogId,
            appId: 'SZYY202410210003',
            targetObject: '基层医疗卫生机构；公立医院',
            appScope: '基层医疗卫生机构、公立医院',
            serviceProvider: '重庆沁铭医疗器械有限公司',
            cooperativeEnterprise: '',
            cloudProvider: '影像云'
          },
          {
            applicationId: 'SZYY202410210004',
            siteId: '601807368400965',
            name: '创业慧康一体化基层医疗卫生应用服务',
            showOrder: 5,
            logo: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/e2132fbe78964846aac6f66c42cda57f.png',
            description: '依据国家相关要求，建立以大公卫一体化为目标的基层医疗卫生信息系统为居民提供全周期健康服务保障，为管理部门、社区卫生服务中心(卫生院)等医疗机构提供高效信息技术支撑。系统高度集成，在"云部署"的基础上，具备快速响应机制，为客户提供平滑升级解决方案。系统包含:基层医疗信息系统（HIS）、基本公共卫生信息系统、家庭医生签约系统、基层LIS系统、基层PACS系统。',
            address: 'http://10.227.11.11:18080/rbmh-phis/index.html#',
            serviceProviderName: '创业慧康科技股份有限公司',
            partnerName: '',
            contactName1: '张瑜',
            contactPhone1: '18983622836',
            contactName2: '',
            contactPhone2: '',
            target: '10224;10225',
            targetView: '基层医疗卫生机构；公立医院',
            architecture: '',
            architectureView: '',
            deployServiceProvider: '10252',
            deployServiceProviderView: '电信云',
            cover: [
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10227', value: '基本公共卫生服务' },
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10228', value: '医院信息系统（HIS）' },
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10229', value: '实验室信息管理系统（LIS）' },
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10233', value: '家庭医生签约' },
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10234', value: '村卫生室管理' },
              { type: 'AppScope_Hospital', typeValue: '公立医院', key: '10271', value: '医院信息系统（HIS）' },
              { type: 'AppScope_Hospital', typeValue: '公立医院', key: '10272', value: '实验室信息管理系统（LIS）' }
            ],
            status: 10,
            createBy: 'zhangxixi',
            createTime: '2024-10-21 17:06:21',
            contentId: 'SZYY202410210004',
            title: '创业慧康一体化基层医疗卫生应用服务',
            contentType: 'app',
            catalogId: digitalAppCatalogId,
            appId: 'SZYY202410210004',
            targetObject: '基层医疗卫生机构；公立医院',
            appScope: '基层医疗卫生机构、公立医院',
            serviceProvider: '创业慧康科技股份有限公司',
            cooperativeEnterprise: '',
            cloudProvider: '电信云'
          },
          {
            applicationId: 'SZYY202410210005',
            siteId: '601807368400965',
            name: '东软云基层医疗卫生机构信息化系统',
            showOrder: 1,
            logo: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/95d2eb06f4554fc6ad1e55606cd51b9a.png',
            description: '东软云基层医疗卫生机构信息化系统是以健康档案为主线、电子病历为核心、云计算技术为支撑的医疗卫生一体化服务产品，包括医院信息管理、公共卫生、电子病历、医技医辅、家庭医生签约等子系统，满足医疗机构"人、财、物、质量、决策"管理要求。系统全部采用B/S架构，统一云化部署，功能高度集成，页面风格一致，医疗公卫体检业务无缝流转、数据自动同步。',
            address: '',
            serviceProviderName: '东软集团股份有限公司',
            partnerName: '',
            contactName1: '王一鹏',
            contactPhone1: '13638331039',
            contactName2: '',
            contactPhone2: '',
            target: '10224',
            targetView: '基层医疗卫生机构',
            architecture: '',
            architectureView: '',
            deployServiceProvider: '10254',
            deployServiceProviderView: '联通云',
            cover: [
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10227', value: '基本公共卫生服务' },
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10228', value: '医院信息系统（HIS）' },
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10229', value: '实验室信息管理系统（LIS）' },
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10230', value: '影像归档和通信系统（PACS）' },
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10233', value: '家庭医生签约' }
            ],
            status: 30,
            createBy: 'zhangxixi',
            createTime: '2024-10-21 17:09:01',
            contentId: 'SZYY202410210005',
            title: '东软云基层医疗卫生机构信息化系统',
            contentType: 'app',
            catalogId: digitalAppCatalogId,
            appId: 'SZYY202410210005',
            targetObject: '基层医疗卫生机构',
            appScope: '基层医疗卫生机构',
            serviceProvider: '东软集团股份有限公司',
            cooperativeEnterprise: '',
            cloudProvider: '联通云'
          },
          {
            applicationId: 'SZYY202410220001',
            siteId: '601807368400965',
            name: '铭衡基层医疗业务信息应用服务',
            showOrder: 6,
            logo: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/5d8eb42661cd4f35839d6f1ed7935804.png',
            description: '适用于行业主管部门、基层医疗卫生机构。本系统涵盖医疗机构临床诊疗、医技、基本公卫、家医签约、数据治理、绩效考评、经济核算与运营管理的一体化应用基层医疗业务综合管理系统。着力提升基层医疗卫生机构临床诊疗、检查检验、公卫服务、家医签约服务质效，促进医防融合，为病患提供高效便捷的就医体验，为行业主管部门提供高可靠数据支撑。',
            address: 'http://10.107.100.26:8082/login?redirect=%2Findex&type=1',
            serviceProviderName: '重庆铭衡科技开发有限公司',
            partnerName: '',
            contactName1: '李成',
            contactPhone1: '13637845801',
            contactName2: '',
            contactPhone2: '',
            target: '10224;10225',
            targetView: '基层医疗卫生机构；公立医院',
            architecture: '10246',
            architectureView: 'C/S架构',
            deployServiceProvider: '10250',
            deployServiceProviderView: '浪潮云',
            cover: [
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10227', value: '基本公共卫生服务' },
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10228', value: '医院信息系统（HIS）' },
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10229', value: '实验室信息管理系统（LIS）' },
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10230', value: '影像归档和通信系统（PACS）' },
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10233', value: '家庭医生签约' },
              { type: 'AppScope_Hospital', typeValue: '公立医院', key: '10271', value: '医院信息系统（HIS）' },
              { type: 'AppScope_Hospital', typeValue: '公立医院', key: '10272', value: '实验室信息管理系统（LIS）' },
              { type: 'AppScope_Hospital', typeValue: '公立医院', key: '10273', value: '影像归档和通信系统（PACS）' }
            ],
            status: 10,
            createBy: 'zhangxixi',
            createTime: '2024-10-22 13:54:34',
            contentId: 'SZYY202410220001',
            title: '铭衡基层医疗业务信息应用服务',
            contentType: 'app',
            catalogId: digitalAppCatalogId,
            appId: 'SZYY202410220001',
            targetObject: '基层医疗卫生机构；公立医院',
            appScope: '基层医疗卫生机构、公立医院',
            serviceProvider: '重庆铭衡科技开发有限公司',
            cooperativeEnterprise: '',
            cloudProvider: '浪潮云'
          },
          {
            applicationId: 'SZYY202410220002',
            siteId: '601807368400965',
            name: '久远银海基层公共卫生应用服务',
            showOrder: 7,
            logo: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/33bf7996b66749d5b80626bfa6e98f40.png',
            description: '以辖区内常住居民为基础，构建公共卫生服务管理，涵盖居民健康档案、健康体检、健康教育、老年人管理、慢病管理、儿童健康管理、孕产妇健康管理、肺结核健康管理、精神障碍健康管理等；以家庭医生为主线，进行签约管理、健康评估、干预、追踪、随访等，并利用移动互联网和智能终端提供远程诊疗，确保居民健康得到全面、精准、及时的管理和服务。',
            address: 'http://10.227.3.17:9080/ehr-face/login.html',
            serviceProviderName: '四川久远银海软件股份有限公司',
            partnerName: '中国电信',
            contactName1: '熊丽霞',
            contactPhone1: '15215114110',
            contactName2: '',
            contactPhone2: '',
            target: '10224',
            targetView: '基层医疗卫生机构',
            architecture: '',
            architectureView: '',
            deployServiceProvider: '10252',
            deployServiceProviderView: '电信云',
            cover: [
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10227', value: '基本公共卫生服务' },
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10233', value: '家庭医生签约' }
            ],
            status: 10,
            createBy: 'zhangxixi',
            createTime: '2024-10-22 14:19:29',
            contentId: 'SZYY202410220002',
            title: '久远银海基层公共卫生应用服务',
            contentType: 'app',
            catalogId: digitalAppCatalogId,
            appId: 'SZYY202410220002',
            targetObject: '基层医疗卫生机构',
            appScope: '基层医疗卫生机构',
            serviceProvider: '四川久远银海软件股份有限公司',
            cooperativeEnterprise: '中国电信',
            cloudProvider: '电信云'
          },
          {
            applicationId: 'SZYY202410220003',
            siteId: '601807368400965',
            name: '联通数字健康综合应用服务',
            showOrder: 8,
            logo: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/3b12ae5a1e474f24bd9e689a0d39a76c.png',
            description: '按照医疗服务、业务管理、数据治理、信息安全等各项业务实际需要统一规划建设，帮助医疗机构实现智慧运营、智慧管理，做到整个县域基本医疗和基本公共卫生深度融合，形成"未病早预防、小病就近看、转诊帮对接"的防治体系，促进"以疾病治疗为中心向以健康管理为中心"转变，主动为居民提供全生命周期健康管理服务，做好基层"健康守门人"。',
            address: 'http://10.122.2.8:8180/nportal-ui/home.html#/dashboard',
            serviceProviderName: '中国联合网络通信有限公司重庆市分公司',
            partnerName: '',
            contactName1: '秦晓龙',
            contactPhone1: '18623109527',
            contactName2: '',
            contactPhone2: '',
            target: '10225;10224',
            targetView: '公立医院；基层医疗卫生机构',
            architecture: '',
            architectureView: '',
            deployServiceProvider: '10254',
            deployServiceProviderView: '联通云',
            cover: [
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10227', value: '基本公共卫生服务' },
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10228', value: '医院信息系统（HIS）' },
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10229', value: '实验室信息管理系统（LIS）' },
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10231', value: '智慧管理平台（HRP）' },
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10233', value: '家庭医生签约' },
              { type: 'AppScope_Hospital', typeValue: '公立医院', key: '10271', value: '医院信息系统（HIS）' },
              { type: 'AppScope_Hospital', typeValue: '公立医院', key: '10272', value: '实验室信息管理系统（LIS）' },
              { type: 'AppScope_Hospital', typeValue: '公立医院', key: '10276', value: '智慧管理平台（HRP）' }
            ],
            status: 10,
            createBy: 'zhangxixi',
            createTime: '2024-10-22 14:21:39',
            contentId: 'SZYY202410220003',
            title: '联通数字健康综合应用服务',
            contentType: 'app',
            catalogId: digitalAppCatalogId,
            appId: 'SZYY202410220003',
            targetObject: '公立医院；基层医疗卫生机构',
            appScope: '公立医院、基层医疗卫生机构',
            serviceProvider: '中国联合网络通信有限公司重庆市分公司',
            cooperativeEnterprise: '',
            cloudProvider: '联通云'
          },
          {
            applicationId: 'SZYY202410220004',
            siteId: '601807368400965',
            name: '渝医康基层卫生数字化一体服务',
            showOrder: 9,
            logo: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/8592eb8c1b014693a16d1dc45dbfb921.png',
            description: '本集成化系统由"家庭医生签约服务、基本公共卫生服务、居民电子健康档案质控、慢性病报告卡管理、基层卫生大数据分析与辅助决策和基层医疗卫生机构资源管理"为一体的基层卫生数字化管理和业务系统组成。手机端和PC端结合，实现家庭医生有效签约、基本公共卫生服务互联互通、信息共享和业务协同、运用高效准确的大数据统计分析，多维度掌握辖区内居民电子健康档案数据质量，对基层医疗卫生机构进行全过程管理，提高服务效率，消除行业内信息孤岛，不断创新服务模式，旨在辅助各级机构在智慧医疗、信息惠民、居民参与等多方面取得阶段性成效。',
            address: '',
            serviceProviderName: '重庆渝医康科技有限公司',
            partnerName: '',
            contactName1: '胡君',
            contactPhone1: '18983267597',
            contactName2: '',
            contactPhone2: '',
            target: '10224',
            targetView: '基层医疗卫生机构',
            architecture: '',
            architectureView: '',
            deployServiceProvider: '10254',
            deployServiceProviderView: '联通云',
            cover: [
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10227', value: '基本公共卫生服务' },
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10233', value: '家庭医生签约' }
            ],
            status: 10,
            createBy: 'zhangxixi',
            createTime: '2024-10-22 14:22:51',
            contentId: 'SZYY202410220004',
            title: '渝医康基层卫生数字化一体服务',
            contentType: 'app',
            catalogId: digitalAppCatalogId,
            appId: 'SZYY202410220004',
            targetObject: '基层医疗卫生机构',
            appScope: '基层医疗卫生机构',
            serviceProvider: '重庆渝医康科技有限公司',
            cooperativeEnterprise: '',
            cloudProvider: '联通云'
          },
          {
            applicationId: 'SZYY202410220005',
            siteId: '601807368400965',
            name: '中联基层医疗卫生机构综合应用服务',
            showOrder: 3,
            logo: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/46b8c8f9aaf041128485193d282ed60f.png',
            description: '面向卫生健康主管单位及基层医疗卫生机构；侧重基层医疗卫生机构的临床诊疗、检查检验、药品进销存、医保报销、电子发票、经济核算等管理，同时集基本公卫、家庭医生签约履约服务等为一体的基层医疗卫生机构综合管理信息系统；主要为提升基层医务人员的工作效率，增强辖区居民就诊过程的获得感，提供各级卫生健康部门宏观决策所需的各类业务数据。',
            address: 'http://10.227.4.10:8081/login.html',
            serviceProviderName: '重庆中联信息产业有限责任公司',
            partnerName: '中国电信股份有限公司重庆分公司',
            contactName1: '胡虹剑',
            contactPhone1: '13368268201',
            contactName2: '',
            contactPhone2: '',
            target: '10224;10225',
            targetView: '基层医疗卫生机构；公立医院',
            architecture: '',
            architectureView: '',
            deployServiceProvider: '10252',
            deployServiceProviderView: '电信云',
            cover: [
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10228', value: '医院信息系统（HIS）' },
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10229', value: '实验室信息管理系统（LIS）' },
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10230', value: '影像归档和通信系统（PACS）' },
              { type: 'AppScope_Hospital', typeValue: '公立医院', key: '10271', value: '医院信息系统（HIS）' },
              { type: 'AppScope_Hospital', typeValue: '公立医院', key: '10272', value: '实验室信息管理系统（LIS）' },
              { type: 'AppScope_Hospital', typeValue: '公立医院', key: '10273', value: '影像归档和通信系统（PACS）' }
            ],
            status: 10,
            createBy: 'zhangxixi',
            createTime: '2024-10-22 14:25:21',
            contentId: 'SZYY202410220005',
            title: '中联基层医疗卫生机构综合应用服务',
            contentType: 'app',
            catalogId: digitalAppCatalogId,
            appId: 'SZYY202410220005',
            targetObject: '基层医疗卫生机构；公立医院',
            appScope: '基层医疗卫生机构、公立医院',
            serviceProvider: '重庆中联信息产业有限责任公司',
            cooperativeEnterprise: '中国电信股份有限公司重庆分公司',
            cloudProvider: '电信云'
          },
          {
            applicationId: 'SZYY202410220006',
            siteId: '601807368400965',
            name: '中国电信HIS服务',
            showOrder: 6,
            logo: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/117d3dc9290749198174ba2114537cce.png',
            description: '基于临床运营一体化、标准规范一体化、机构管理一体化等，精简数据对接流程，降低平台运维成本 ，提升监管部门对基层医疗业务的统一监管。有效实现区域内基层医疗卫生机构间、基层与二级医院间医疗信息共享和业务协同，不断提升基层医疗卫生服务能力。建立统一、共享的区域电子病历中心实现社区/乡镇卫生院与下属村卫生室，药品统一调拨，统一请领，全程有效监管药品流向及下属机构药品使用情况。',
            address: 'http://10.227.2.18:6660',
            serviceProviderName: '中国电信股份有限公司重庆分公司',
            partnerName: '重庆中联信息产业有限责任公司；四川久远银海软件股份有限公司',
            contactName1: '邹尧',
            contactPhone1: '18983085480',
            contactName2: '',
            contactPhone2: '',
            target: '10225;10224',
            targetView: '公立医院；基层医疗卫生机构',
            architecture: '',
            architectureView: '',
            deployServiceProvider: '10252',
            deployServiceProviderView: '电信云',
            cover: [
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10228', value: '医院信息系统（HIS）' },
              { type: 'AppScope_Hospital', typeValue: '公立医院', key: '10271', value: '医院信息系统（HIS）' }
            ],
            status: 10,
            createBy: 'zhangxixi',
            createTime: '2024-10-22 14:27:06',
            contentId: 'SZYY202410220006',
            title: '中国电信HIS服务',
            contentType: 'app',
            catalogId: digitalAppCatalogId,
            appId: 'SZYY202410220006',
            targetObject: '公立医院；基层医疗卫生机构',
            appScope: '公立医院、基层医疗卫生机构',
            serviceProvider: '中国电信股份有限公司重庆分公司',
            cooperativeEnterprise: '重庆中联信息产业有限责任公司；四川久远银海软件股份有限公司',
            cloudProvider: '电信云'
          },
          {
            applicationId: 'SZYY202410220007',
            siteId: '601807368400965',
            name: '久远银海基层医疗一体化应用服务',
            showOrder: 8,
            logo: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/c346feef32ff4d5cbbaefc702f5d78dd.png',
            description: '采用云架构和"一套中心+N个应用"设计理念，以患者为中心、诊疗业务流程为主线，整合门诊、住院、库存、费用等业务，以及涵盖标本采集、标本送检、签收、拒收登记、标本检验、报告审核全流程监控管理的日常检验业务，实现各业务信息互联互通、高效协同，提高医疗服务质量和效率。',
            address: 'http://10.227.3.13:8180/nportal-ui/index.html',
            serviceProviderName: '四川久远银海软件股份有限公司',
            partnerName: '中国电信',
            contactName1: '熊丽霞',
            contactPhone1: '15215114110',
            contactName2: '',
            contactPhone2: '',
            target: '10224;10225',
            targetView: '基层医疗卫生机构；公立医院',
            architecture: '',
            architectureView: '',
            deployServiceProvider: '10252',
            deployServiceProviderView: '电信云',
            cover: [
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10228', value: '医院信息系统（HIS）' },
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10229', value: '实验室信息管理系统（LIS）' },
              { type: 'AppScope_Hospital', typeValue: '公立医院', key: '10271', value: '医院信息系统（HIS）' },
              { type: 'AppScope_Hospital', typeValue: '公立医院', key: '10272', value: '实验室信息管理系统（LIS）' }
            ],
            status: 10,
            createBy: 'zhangxixi',
            createTime: '2024-10-22 14:28:41',
            contentId: 'SZYY202410220007',
            title: '久远银海基层医疗一体化应用服务',
            contentType: 'app',
            catalogId: digitalAppCatalogId,
            appId: 'SZYY202410220007',
            targetObject: '基层医疗卫生机构；公立医院',
            appScope: '基层医疗卫生机构、公立医院',
            serviceProvider: '四川久远银海软件股份有限公司',
            cooperativeEnterprise: '中国电信',
            cloudProvider: '电信云'
          },
          {
            applicationId: 'SZYY202410220008',
            siteId: '601807368400965',
            name: '卫宁健康LIS服务',
            showOrder: 1,
            logo: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/e1f7e84155f04c1393b85492f17f208a.png',
            description: '实现基层医疗卫生机构院内数字化检验服务，完成检验设备联机，通过前置服务器进行检验数据集中上传，实现病人信息与检验信息的信息化流转及临床科室对检验数据的调阅。功能包括常规设备联机、检验结果处理模块、检验标本登记及收费管理、查询统计、报告发布回收及临床调阅、检验条码管理、检验设备条码双工通讯、标本外送管理、危急值提醒、检验质控管理等。',
            address: 'http://10.227.10.10:90/frame/#/index',
            serviceProviderName: '重庆卫宁健康科技有限公司',
            partnerName: '',
            contactName1: '陈宇鹏',
            contactPhone1: '18523554131',
            contactName2: '',
            contactPhone2: '',
            target: '10224;10225',
            targetView: '基层医疗卫生机构；公立医院',
            architecture: '',
            architectureView: '',
            deployServiceProvider: '10252',
            deployServiceProviderView: '电信云',
            cover: [
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10229', value: '实验室信息管理系统（LIS）' },
              { type: 'AppScope_Hospital', typeValue: '公立医院', key: '10272', value: '实验室信息管理系统（LIS）' }
            ],
            status: 10,
            createBy: 'zhangxixi',
            createTime: '2024-10-22 14:29:38',
            contentId: 'SZYY202410220008',
            title: '卫宁健康LIS服务',
            contentType: 'app',
            catalogId: digitalAppCatalogId,
            appId: 'SZYY202410220008',
            targetObject: '基层医疗卫生机构；公立医院',
            appScope: '基层医疗卫生机构、公立医院',
            serviceProvider: '重庆卫宁健康科技有限公司',
            cooperativeEnterprise: '',
            cloudProvider: '电信云'
          },
          {
            applicationId: 'SZYY202410220009',
            siteId: '601807368400965',
            name: '同步远方LIS服务',
            showOrder: 2,
            logo: '/gdmercury-api/network-cms/api/cms/resource/src/ucmp/20250221/d76676da527f420c863028e6c28a6fdf.png',
            description: '实现对放射类医疗设备的接入、图像采集、图像管理、报告模块、报告编辑、数据分析和对比、相关报表及查询等。基于平台，实现医疗机构之间影像数据的共享与交换。',
            address: 'http://10.228.10.8:90/ui/',
            serviceProviderName: '同步远方（重庆）科技有限公司',
            partnerName: '',
            contactName1: '任燕  ',
            contactPhone1: '18771998099',
            contactName2: '罗甫名',
            contactPhone2: '15023873113',
            target: '10225;10224',
            targetView: '公立医院；基层医疗卫生机构',
            architecture: '',
            architectureView: '',
            deployServiceProvider: '10251',
            deployServiceProviderView: '影像云',
            cover: [
              { type: 'AppScope_PrimaryHospital', typeValue: '基层医疗卫生机构', key: '10229', value: '实验室信息管理系统（LIS）' },
              { type: 'AppScope_Hospital', typeValue: '公立医院', key: '10272', value: '实验室信息管理系统（LIS）' }
            ],
            status: 10,
            createBy: 'zhangxixi',
            createTime: '2024-10-22 14:30:41',
            contentId: 'SZYY202410220009',
            title: '同步远方LIS服务',
            contentType: 'app',
            catalogId: digitalAppCatalogId,
            appId: 'SZYY202410220009',
            targetObject: '公立医院；基层医疗卫生机构',
            appScope: '公立医院、基层医疗卫生机构',
            serviceProvider: '同步远方（重庆）科技有限公司',
            cooperativeEnterprise: '',
            cloudProvider: '影像云'
          }
        ];
    const pageNum = query && query.pageNum ? parseInt(query.pageNum) : 1;
    const pageSize = query && query.pageSize ? parseInt(query.pageSize) : 10;
    const start = (pageNum - 1) * pageSize;
    return Promise.resolve({
      code: 200,
      msg: 'SUCCESS',
      data: {
        rows: allRows.slice(start, start + pageSize),
        total: String(allRows.length)
      }
    });
  }

  // 默认返回示例内容数据
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: [
        {
          contentId: 1,
          title: '示例内容1',
          contentType: 'article',
          status: 1,
          publishDate: '2024-01-01 12:00:00',
          createTime: '2024-01-01 10:00:00',
          author: 'admin'
        },
        {
          contentId: 2,
          title: '示例内容2',
          contentType: 'article',
          status: 2,
          publishDate: '2024-01-02 12:00:00',
          createTime: '2024-01-02 10:00:00',
          author: 'admin'
        }
      ],
      total: 2
    }
  });
}

// 初始化内容编辑数据
export function getInitContentEditorData(catalogId, contentType, contentId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      contentId: contentId || 1,
      catalogId: catalogId,
      contentType: contentType || 'article',
      title: '',
      content: '',
      summary: '',
      tags: [],
      attributes: []
    }
  })
}

// 新增内容
export function addContent(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: { contentId: Date.now() }
  })
}

// 修改内容
export function saveContent(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

// 删除内容
export function delContent(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

// 发布内容
export function publishContent(contentIds) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

// 锁定内容
export function lockContent(contentId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

// 解锁内容
export function unLockContent(contentId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function createIndexes(contentId) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function copyContent(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function moveContent(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function setTopContent(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function cancelTopContent(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function sortContent(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function offlineContent(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function toPublishContent(contentIds) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function archiveContent(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function addContentAttribute(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}

export function removeContentAttribute(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {}
  })
}
