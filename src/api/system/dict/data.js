const dictDataList = [
  // 服务对象 Client
  { dictCode: 10224, dictSort: 0, dictLabel: '基层医疗卫生机构', dictValue: 'AppScope_PrimaryHospital', dictType: 'Client', cssClass: '', listClass: '', status: '0', remark: '基层医疗卫生机构,基层一体化', createTime: '2024-10-11 16:29:04' },
  { dictCode: 10225, dictSort: 1, dictLabel: '公立医院', dictValue: 'AppScope_Hospital', dictType: 'Client', cssClass: '', listClass: '', status: '0', remark: '公立医院,远程医疗', createTime: '2024-10-11 16:29:36' },
  { dictCode: 10226, dictSort: 2, dictLabel: '医技护人员', dictValue: 'AppScope_MedicalPersonnel', dictType: 'Client', cssClass: '', listClass: '', status: '0', remark: '医技护人员,资质证书办理', createTime: '2024-10-11 16:29:36' },
  // 应用架构 SoftwareArchitecture
  { dictCode: 10245, dictSort: 0, dictLabel: 'B/S', dictValue: '0', dictType: 'SoftwareArchitecture', cssClass: '', listClass: '', status: '0', remark: '--', createTime: '2024-10-14 10:37:15' },
  { dictCode: 10246, dictSort: 1, dictLabel: 'C/S架构', dictValue: '1', dictType: 'SoftwareArchitecture', cssClass: '', listClass: '', status: '0', remark: '--', createTime: '2024-10-14 10:37:26' },
  { dictCode: 10247, dictSort: 2, dictLabel: 'B/S+C/S', dictValue: '2', dictType: 'SoftwareArchitecture', cssClass: '', listClass: '', status: '0', remark: '--', createTime: '2024-10-14 10:37:50' },
  { dictCode: 10248, dictSort: 3, dictLabel: '单机', dictValue: '3', dictType: 'SoftwareArchitecture', cssClass: '', listClass: '', status: '0', remark: '--', createTime: '2024-10-14 10:38:03' },
  { dictCode: 10249, dictSort: 4, dictLabel: '其他', dictValue: '4', dictType: 'SoftwareArchitecture', cssClass: '', listClass: '', status: '0', remark: '--', createTime: '2024-10-14 10:38:12' },
  // 部署云服务商 CloudProvider
  { dictCode: 10250, dictSort: 0, dictLabel: '浪潮云', dictValue: '0', dictType: 'CloudProvider', cssClass: '', listClass: '', status: '0', remark: '--', createTime: '2024-10-14 10:38:32' },
  { dictCode: 10251, dictSort: 1, dictLabel: '影像云', dictValue: '1', dictType: 'CloudProvider', cssClass: '', listClass: '', status: '0', remark: '--', createTime: '2024-10-14 10:38:41' },
  { dictCode: 10252, dictSort: 2, dictLabel: '电信云', dictValue: '2', dictType: 'CloudProvider', cssClass: '', listClass: '', status: '0', remark: '--', createTime: '2024-10-14 10:38:50' },
  { dictCode: 10253, dictSort: 3, dictLabel: '移动云', dictValue: '3', dictType: 'CloudProvider', cssClass: '', listClass: '', status: '0', remark: '--', createTime: '2024-10-14 10:38:58' },
  { dictCode: 10254, dictSort: 4, dictLabel: '联通云', dictValue: '4', dictType: 'CloudProvider', cssClass: '', listClass: '', status: '0', remark: '--', createTime: '2024-10-14 10:39:09' },
  { dictCode: 10255, dictSort: 5, dictLabel: '紫光云', dictValue: '5', dictType: 'CloudProvider', cssClass: '', listClass: '', status: '0', remark: '--', createTime: '2024-10-14 10:39:18' },
  // 基层应用覆盖范围 AppScope_PrimaryHospital
  { dictCode: 10227, dictSort: 0, dictLabel: '基本公共卫生服务', dictValue: '0', dictType: 'AppScope_PrimaryHospital', cssClass: '', listClass: '', status: '0', remark: '由专业公共卫生机构及社区卫生服务中心（站）、乡镇卫生院、村卫生室等基层医疗卫生机构向全体居民提供的、公益性的公共卫生干预措施，主要起健康维护、健康促进、疾病预防等作用。', createTime: '2024-10-11 16:35:09' },
  { dictCode: 10228, dictSort: 1, dictLabel: '医院信息系统（HIS）', dictValue: '1', dictType: 'AppScope_PrimaryHospital', cssClass: '', listClass: '', status: '0', remark: '为基层医疗卫生机构实现包括统数据一管理、传染病报卡、门诊管理、住院管理、库存管理、病案管理、门诊医生工作站、门诊护士工作站、住院医生工作站、住院护士工作站、电子病历、财务管理、医保管理、基础数据、系统管理、接口管理等功能应用。', createTime: '2024-10-11 16:35:40' },
  { dictCode: 10229, dictSort: 2, dictLabel: '实验室信息管理系统（LIS）', dictValue: '2', dictType: 'AppScope_PrimaryHospital', cssClass: '', listClass: '', status: '0', remark: '为基层医疗卫生机构提供了以医疗服务机构为主体,以医疗资源和检验信息的协作和共享为目标，实现区域内检验资源的互联与互通，打通辖区内各医疗卫生机构的云LIS系统。', createTime: '2024-10-11 16:36:03' },
  { dictCode: 10230, dictSort: 3, dictLabel: '影像归档和通信系统（PACS）', dictValue: '3', dictType: 'AppScope_PrimaryHospital', cssClass: '', listClass: '', status: '0', remark: '为基层医疗卫生机构提供了以区域内代表性医院为核心，通过构造区域内部的医学影像信息交换平台，以实现区域内医院的医学影像资源的共享与整合的云RIS/PACS系统。', createTime: '2024-10-14 10:28:51' },
  { dictCode: 10231, dictSort: 4, dictLabel: '智慧管理平台（HRP）', dictValue: '4', dictType: 'AppScope_PrimaryHospital', cssClass: '', listClass: '', status: '0', remark: '以公立医院新发展框架为基座，以"业财融合、流程重塑、科技增效、数智运营"为驱动，打造医疗机构智慧运营"人力域、财务域、物资域、风控域、决策域"五大场景，支持单体医院、多院区医院、医疗集团、医共体等各种医疗机构运营管理精细化转型，赋能医疗价值回归。', createTime: '2024-10-14 10:29:21' },
  { dictCode: 10232, dictSort: 5, dictLabel: '心电', dictValue: '5', dictType: 'AppScope_PrimaryHospital', cssClass: '', listClass: '', status: '0', remark: '为基层医疗卫生机构提供了心电检查从预约登记、操作检查、编写报告、集中存储、网络传输、临床共享、医生会诊、统计检索全流程的信息化管理。为医院心电图检查，建立信息化工作平台，是心电图数字化存储、信息化共享、提高医生之间协同工作能力的理想解决方案。为心功能科、急诊科与临床科室之间建立起心电信息传输与报告的发布的网络化流程，解决长期困扰医院的门诊心电图检查混乱、急诊心电图诊断效率低，临床科室心电图人工穿梭检查效率低，心电图纸备份繁琐、会诊调阅困难的问题。', createTime: '2024-10-14 10:29:46' },
  { dictCode: 10233, dictSort: 6, dictLabel: '家庭医生签约', dictValue: '6', dictType: 'AppScope_PrimaryHospital', cssClass: '', listClass: '', status: '0', remark: '组建以全科医生为主的服务团队，明确责任和义务,以重点人群为基础，签订服务合同，采取预约服务、主动服务和上门服务等业务进行管理的家庭医生签约系统。', createTime: '2024-10-14 10:30:02' },
  { dictCode: 10234, dictSort: 7, dictLabel: '村卫生室管理', dictValue: '7', dictType: 'AppScope_PrimaryHospital', cssClass: '', listClass: '', status: '0', remark: '集成基本公共卫生服务和基本医疗服务两大服务体系，公卫主要功能为居民电子健康档案管理、家庭医生签约、慢病管理、老年人健康管理、健康教育、突发公卫事件、传染病上报、肺结核、精神病等健康管理；基本医疗主要功能：门诊医生站、医保报销、费用管理、挂号管理、药品进销存、药品统一调拨等', createTime: '2024-10-14 10:30:20' },
  { dictCode: 10235, dictSort: 8, dictLabel: '药店应用管理', dictValue: '8', dictType: 'AppScope_PrimaryHospital', cssClass: '', listClass: '', status: '0', remark: '面向零售药店行业，通过人工智能应用，赋能线上和线下购药场景，提升服务效率和质量，增加客流转化和复购，进行患者购药全流程管理。', createTime: '2024-10-14 10:30:37' },
  { dictCode: 10236, dictSort: 9, dictLabel: '智能外呼', dictValue: '9', dictType: 'AppScope_PrimaryHospital', cssClass: '', listClass: '', status: '0', remark: '基于人工智能核心技术、智能语音交互技术与智能外呼服务平台，按照家庭医生工作内容为不同人群制定外呼方案，通过专业的互动话术，自动进行电话或短信服务，帮助家庭医生完成慢病随访、健康档案更新、考核与满意度调查、体检预约、通知宣教等日常工作和考核任务，最大程度上降低医护人员的工作负担，让其能比较轻松地对大量的签约居民和患者进行服务，进而有效地改善医患关系，促进签约服务提质增效。', createTime: '2024-10-14 10:31:03' },
  { dictCode: 10237, dictSort: 10, dictLabel: '辅助诊疗', dictValue: '10', dictType: 'AppScope_PrimaryHospital', cssClass: '', listClass: '', status: '0', remark: '运用医学人工智能等技术，建设覆盖试点区域内全部基层医疗卫生机构的医学人工智能基层辅助应用及信息化支撑体系，规范基层常见病、多发病的诊疗行为，改善基层医疗卫生服务质量，使城乡居民在基层医疗卫生机构享有同质化、规范化的卫生健康服务', createTime: '2024-10-14 10:31:31' },
  { dictCode: 10238, dictSort: 11, dictLabel: '临床专病库', dictValue: '11', dictType: 'AppScope_PrimaryHospital', cssClass: '', listClass: '', status: '0', remark: '利用大数据信息化技术对电子病历、检验检查、处方处置等临床数据进行数据清洗、数据标准化、数据萃取和知识图谱构建等手段构建符合临床科研场景所需的高质量科学研究专病数据库，为指导临床科研和疾病的防治发展提供有力的技术支持和高质量的数据来源。', createTime: '2024-10-14 10:31:46' },
  { dictCode: 10239, dictSort: 12, dictLabel: '区域综合', dictValue: '12', dictType: 'AppScope_PrimaryHospital', cssClass: '', listClass: '', status: '0', remark: '平台建设服务于全区域范围内的医疗卫生机构，对区域内的医疗、健康数据标准统一管理，形成统一注册、统一服务、统一监控、统一监管、统一数据中心的管理模式，并提供医疗卫生信息共享、医疗卫生业务协同、综合卫生管理及居民公众服务。', createTime: '2024-10-14 10:32:04' },
  { dictCode: 10240, dictSort: 13, dictLabel: '基本公共卫生服务绩效评价', dictValue: '13', dictType: 'AppScope_PrimaryHospital', cssClass: '', listClass: '', status: '0', remark: '系统以基本公卫服务个案数据为基础，结合绩效评价的管理要求和考核标准，自动抓取个案信息，通过大数据全量计算健康档案各数据指标，对基层医疗卫生机构绩效进行定性足量评价,对考核工作进行全程管理。', createTime: '2024-10-14 10:32:24' },
  { dictCode: 10270, dictSort: 14, dictLabel: '妇幼健康', dictValue: '14', dictType: 'AppScope_PrimaryHospital', cssClass: '', listClass: '', status: '0', remark: '以妇幼保健业务和管理为核心，符合国家妇幼保健院评审标准以及妇幼保健业务数据规范，满足基本公卫要求，促进各类妇幼健康服务机构互相协作，为区域妇女儿童提供全面、及时、高效的服务与关注，尽早发现问题扫清障碍，提升辖区妇幼健康质量，并提高区域管理决策水平。', createTime: '2024-10-18 16:01:48' },
  // 公立应用覆盖范围 AppScope_Hospital
  { dictCode: 10271, dictSort: 1, dictLabel: '医院信息系统（HIS）', dictValue: '1', dictType: 'AppScope_Hospital', cssClass: '', listClass: '', status: '0', icon: '', remark: '对医院及其所属各部门的人流、物流、财流进行综合管理，对在医疗活动各阶段产生的数据进行采集、存储、处理、提取、传输、汇总，加工形成各种信息，从而为医院的整体运行提供全面的自动化管理及各种服务的信息系统。', createTime: '2024-10-18 16:12:46' },
  { dictCode: 10272, dictSort: 2, dictLabel: '实验室信息管理系统（LIS）', dictValue: '2', dictType: 'AppScope_Hospital', cssClass: '', listClass: '', status: '0', icon: '', remark: 'LIS系统是实验室信息管理系统，是医院信息管理的重要组成部分，主要用于实验室检验工作流程管理、病人信息管理、检验结果查询、统计和报表打印等。', createTime: '2024-10-18 16:12:59' },
  { dictCode: 10273, dictSort: 3, dictLabel: '影像归档和通信系统（PACS）', dictValue: '3', dictType: 'AppScope_Hospital', cssClass: '', listClass: '', status: '0', icon: '', remark: 'PACS系统以实现医学影像数字化存储、诊断为核心任务，从医学影像设备（如CT、CR、DR、MR、DSA、RF等）获取影像，集中存储、综合管理医学影像及病人相关信息，提供检查预约、病人信息登记、计算机阅片、电子报告书写、胶片打印、数据备份等一系列功能', createTime: '2024-10-18 16:13:12' },
  { dictCode: 10274, dictSort: 4, dictLabel: '心电', dictValue: '4', dictType: 'AppScope_Hospital', cssClass: '', listClass: '', status: '0', icon: '', remark: '心电系统主要实现心电检查从预约登记、操作检查、编写报告、集中存储、网络传输、临床共享、医生会诊、统计检索全流程的信息化管理。为医院心电图检查，建立信息化工作平台，是心电图数字化存储、信息化共享、提高医生之间协同工作能力的理想解决方案。为心功能科、急诊科与临床科室之间建立起心电信息传输与报告的发布的网络化流程，解决长期困扰医院的门诊心电图检查混乱、急诊心电图诊断效率低，临床科室心电图人工穿梭检查效率低，心电图纸备份繁琐、会诊调阅困难的问题。', createTime: '2024-10-18 16:13:24' },
  { dictCode: 10275, dictSort: 5, dictLabel: '医养结合一体化', dictValue: '5', dictType: 'AppScope_Hospital', cssClass: '', listClass: '', status: '0', icon: '', remark: '以为老年人服务为核心，打造面向单体医院和区域医共体的"1+N"智慧医养服务一体化模式，整合机构医疗与养老资源，支持医共体内医养结合信息互通共享及业务协作，旨在为区域老年人提供个性、高效、全面的医养服务与关怀。', createTime: '2024-10-18 16:13:37' },
  { dictCode: 10276, dictSort: 6, dictLabel: '智慧管理平台（HRP）', dictValue: '6', dictType: 'AppScope_Hospital', cssClass: '', listClass: '', status: '0', icon: '', remark: '以公立医院新发展框架为基座，以"业财融合、流程重塑、科技增效、数智运营"为驱动，打造医疗机构智慧运营"人力域、财务域、物资域、风控域、决策域"五大场景，支持单体医院、多院区医院、医疗集团、医共体等各种医疗机构运营管理精细化转型，赋能医疗价值回归。', createTime: '2024-10-18 16:13:50' },
  { dictCode: 10277, dictSort: 7, dictLabel: '药店应用管理', dictValue: '7', dictType: 'AppScope_Hospital', cssClass: '', listClass: '', status: '0', icon: '', remark: '面向零售药店行业，通过人工智能应用，赋能线上和线下购药场景，提升服务效率和质量，增加客流转化和复购，进行患者购药全流程管理。', createTime: '2024-10-18 16:24:43' },
  { dictCode: 10278, dictSort: 8, dictLabel: '智能外呼', dictValue: '8', dictType: 'AppScope_Hospital', cssClass: '', listClass: '', status: '0', icon: '', remark: '基于人工智能核心技术、智能语音交互技术与智能外呼服务平台，按照家庭医生工作内容为不同人群制定外呼方案，通过专业的互动话术，自动进行电话或短信服务，帮助家庭医生完成慢病随访、健康档案更新、考核与满意度调查、体检预约、通知宣教等日常工作和考核任务，最大程度上降低医护人员的工作负担，让其能比较轻松地对大量的签约居民和患者进行服务，进而有效地改善医患关系，促进签约服务提质增效。', createTime: '2024-10-18 16:25:12' },
  { dictCode: 10279, dictSort: 9, dictLabel: '临床专病库', dictValue: '9', dictType: 'AppScope_Hospital', cssClass: '', listClass: '', status: '0', icon: '', remark: '利用大数据信息化技术对电子病历、检验检查、处方处置等临床数据进行数据清洗、数据标准化、数据萃取和知识图谱构建等手段构建符合临床科研场景所需的高质量科学研究专病数据库，为指导临床科研和疾病的防治发展提供有力的技术支持和高质量的数据来源。', createTime: '2024-10-18 16:25:24' },
  { dictCode: 10280, dictSort: 10, dictLabel: '医共体信息平台', dictValue: '10', dictType: 'AppScope_Hospital', cssClass: '', listClass: '', status: '0', icon: '', remark: '遵循医卫行业标准和业界通用模型，在适应区域医疗一体化主流平台的构建模式、技术路线及产品选型的基础上，运用"平台+应用+标准"的核心理念，实现区域医疗数据资源统一、区域医疗门户集成统一、区域医疗平台服务统一、区域医疗协同应用统一，以开放化，一体化、敏捷型的架构设计，提供医共体"资源共享中心、质量控制中心、业务协同中心、医保管理中心、便民服务中心和运营管理中心"六大应用体系，支撑县域医共体各医疗卫生机构的内外互通、上下联通、横纵贯通和生态融通。', createTime: '2024-10-18 16:25:41' },
  // 医技应用覆盖范围 AppScope_MedicalPersonnel（暂无可选项）
  // 服务专区 ServiceZone
  { dictCode: 10280, dictSort: 0, dictLabel: 'X86专区', dictValue: '0', dictType: 'ServiceZone', cssClass: '', listClass: '', status: '0', remark: '兼容性强，适用于各类企业应用信创', createTime: '2026-03-01 09:00:00' },
  { dictCode: 10281, dictSort: 1, dictLabel: '信创专区', dictValue: '1', dictType: 'ServiceZone', cssClass: '', listClass: '', status: '0', remark: '国产化替代，安全可控密码服务', createTime: '2026-03-01 09:00:00' },
  { dictCode: 10282, dictSort: 2, dictLabel: '密码服务专区', dictValue: '2', dictType: 'ServiceZone', cssClass: '', listClass: '', status: '0', remark: '国产密码算法，安全合规超算', createTime: '2026-03-01 09:00:00' },
  { dictCode: 10283, dictSort: 3, dictLabel: '超算、智算专区', dictValue: '3', dictType: 'ServiceZone', cssClass: '', listClass: '', status: '0', remark: '高性能计算与AI算力', createTime: '2026-03-01 09:00:00' },
  // 服务分类 X86专区 ServiceType_X86Zone
  { dictCode: 10300, dictSort: 0, dictLabel: '机房云托管服务', dictValue: '0', dictType: 'ServiceType_X86Zone', cssClass: '', listClass: '', status: '0', remark: '--', createTime: '2026-03-01 09:00:00' },
  { dictCode: 10301, dictSort: 1, dictLabel: '计算服务', dictValue: '1', dictType: 'ServiceType_X86Zone', cssClass: '', listClass: '', status: '0', remark: '--', createTime: '2026-03-01 09:00:00' },
  { dictCode: 10302, dictSort: 2, dictLabel: '存储服务', dictValue: '2', dictType: 'ServiceType_X86Zone', cssClass: '', listClass: '', status: '0', remark: '--', createTime: '2026-03-01 09:00:00' },
  { dictCode: 10303, dictSort: 3, dictLabel: '网络服务', dictValue: '3', dictType: 'ServiceType_X86Zone', cssClass: '', listClass: '', status: '0', remark: '--', createTime: '2026-03-01 09:00:00' },
  { dictCode: 10304, dictSort: 4, dictLabel: '安全服务', dictValue: '4', dictType: 'ServiceType_X86Zone', cssClass: '', listClass: '', status: '0', remark: '--', createTime: '2026-03-01 09:00:00' },
  { dictCode: 10305, dictSort: 5, dictLabel: '大数据服务', dictValue: '5', dictType: 'ServiceType_X86Zone', cssClass: '', listClass: '', status: '0', remark: '--', createTime: '2026-03-01 09:00:00' },
  { dictCode: 10306, dictSort: 6, dictLabel: '备份容灾服务', dictValue: '6', dictType: 'ServiceType_X86Zone', cssClass: '', listClass: '', status: '0', remark: '--', createTime: '2026-03-01 09:00:00' },
  { dictCode: 10307, dictSort: 7, dictLabel: '数据库服务', dictValue: '7', dictType: 'ServiceType_X86Zone', cssClass: '', listClass: '', status: '0', remark: '--', createTime: '2026-03-01 09:00:00' },
  // 服务分类 信创专区 ServiceType_XinChuangZone
  { dictCode: 10310, dictSort: 0, dictLabel: '机房云托管服务', dictValue: '0', dictType: 'ServiceType_XinChuangZone', cssClass: '', listClass: '', status: '0', remark: '--', createTime: '2026-03-01 09:00:00' },
  { dictCode: 10311, dictSort: 1, dictLabel: '计算服务', dictValue: '1', dictType: 'ServiceType_XinChuangZone', cssClass: '', listClass: '', status: '0', remark: '--', createTime: '2026-03-01 09:00:00' },
  { dictCode: 10312, dictSort: 2, dictLabel: '存储服务', dictValue: '2', dictType: 'ServiceType_XinChuangZone', cssClass: '', listClass: '', status: '0', remark: '--', createTime: '2026-03-01 09:00:00' },
  { dictCode: 10313, dictSort: 3, dictLabel: '网络服务', dictValue: '3', dictType: 'ServiceType_XinChuangZone', cssClass: '', listClass: '', status: '0', remark: '--', createTime: '2026-03-01 09:00:00' },
  { dictCode: 10314, dictSort: 4, dictLabel: '软件服务', dictValue: '4', dictType: 'ServiceType_XinChuangZone', cssClass: '', listClass: '', status: '0', remark: '--', createTime: '2026-03-01 09:00:00' },
  // 服务分类 密码服务专区 ServiceType_CipherZone
  { dictCode: 10320, dictSort: 0, dictLabel: '密码服务', dictValue: '0', dictType: 'ServiceType_CipherZone', cssClass: '', listClass: '', status: '0', remark: '--', createTime: '2026-03-01 09:00:00' },
  // 服务分类 超算、智算专区 ServiceType_SuperComputeZone
  { dictCode: 10330, dictSort: 0, dictLabel: '超算服务', dictValue: '0', dictType: 'ServiceType_SuperComputeZone', cssClass: '', listClass: '', status: '0', remark: '--', createTime: '2026-03-01 09:00:00' },
  { dictCode: 10331, dictSort: 1, dictLabel: '智算服务', dictValue: '1', dictType: 'ServiceType_SuperComputeZone', cssClass: '', listClass: '', status: '0', remark: '--', createTime: '2026-03-01 09:00:00' },
  // 开放范围 OpenRange
  { dictCode: 10256, dictSort: 0, dictLabel: '不限', dictValue: '0', dictType: 'OpenRange', cssClass: '', listClass: '', status: '0', remark: '--', createTime: '2024-10-14 10:39:33' },
  { dictCode: 10257, dictSort: 1, dictLabel: '市级', dictValue: '1', dictType: 'OpenRange', cssClass: '', listClass: '', status: '0', remark: '--', createTime: '2024-10-14 10:39:41' },
  { dictCode: 10258, dictSort: 2, dictLabel: '区（县）域', dictValue: '2', dictType: 'OpenRange', cssClass: '', listClass: '', status: '0', remark: '--', createTime: '2024-10-14 10:39:49' }
]

// 查询字典数据列表
export function listData(query) {
  const q = query || {}
  let list = dictDataList
  if (q.dictType) {
    list = list.filter(i => i.dictType === q.dictType)
  }
  if (q.dictLabel) {
    list = list.filter(i => (i.dictLabel || '').includes(q.dictLabel))
  }
  if (q.status !== undefined && q.status !== '' && q.status !== null) {
    list = list.filter(i => i.status === q.status)
  }
  const total = list.length
  const pageNum = q.pageNum || 1
  const pageSize = q.pageSize || 10
  list = list.slice((pageNum - 1) * pageSize, pageNum * pageSize)
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: {
      rows: list,
      total
    }
  })
}

// 查询字典数据详细
export function getData(dictCode) {
  const target = dictDataList.find(i => i.dictCode === Number(dictCode))
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: target || null
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  const list = dictDataList.filter(i => i.dictType === dictType && i.status === '0')
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: list
  })
}

// 新增字典数据
export function addData(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: true
  })
}

// 修改字典数据
export function updateData(data) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: true
  })
}

// 删除字典数据
export function delData(dictCode) {
  return Promise.resolve({
    code: 200,
    message: '操作成功',
    data: true
  })
}