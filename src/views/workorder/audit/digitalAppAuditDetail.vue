<template>
  <div class="app-audit-detail-page">
    <PageHeader
      :title="`数字应用审核 · ${appInfo.appName}`"
      description="查看应用申请详情、资质材料及审核记录，并通过或驳回本次申请"
    >
      <template #actions>
        <a-button @click="goBack">
          <template #icon><ArrowLeftOutlined /></template>
          返回列表
        </a-button>
      </template>
    </PageHeader>

    <div class="app-audit-detail-page__body">
      <div class="app-audit-detail-page__main">
        <CloudCard class="app-audit-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">申报信息</span>
            <span class="card-head__sub">提交时间：{{ appInfo.submitTime }}</span>
          </div>
          <div class="detail-step-sidenav">
            <div
              v-for="opt in stepOptions"
              :key="opt.value"
              class="detail-step-sidenav__item"
              :class="{ 'is-active': activeStep === opt.value }"
              @click="activeStep = opt.value"
            >
              {{ opt.label }}
            </div>
          </div>
          <div v-show="activeStep === 0">
            <!-- Step 1: 企业基本情况 -->
            <div class="overview-section">
              <div class="overview-section__title">基本信息</div>
              <table class="detail-table">
                <tbody>
                  <tr>
                    <td class="label-cell">单位（机构）名称</td>
                    <td colspan="3">{{ appInfo.orgName || '--' }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">法定代表人</td>
                    <td>{{ appInfo.legalPerson || '--' }}</td>
                    <td class="label-cell">统一社会信用代码</td>
                    <td>{{ appInfo.creditCode || '--' }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">单位（机构）性质</td>
                    <td colspan="3">{{ appInfo.orgNature || '--' }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">成立时间</td>
                    <td colspan="3">{{ appInfo.establishDate || '--' }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">单位（机构）注册地</td>
                    <td colspan="3">{{ appInfo.regAddress || '--' }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">单位（机构）地址</td>
                    <td colspan="3">{{ appInfo.bizAddress || '--' }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">联系人</td>
                    <td colspan="3">{{ formatContact(appInfo) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="overview-section">
              <div class="overview-section__title">详细信息</div>
              <table class="detail-table">
                <tbody>
                  <tr>
                    <td class="label-cell">应用服务</td>
                    <td>{{ appInfo.appServiceIntro || '--' }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">企业简介</td>
                    <td>{{ appInfo.orgIntro || '--' }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">主要产品或服务介绍</td>
                    <td>{{ appInfo.mainProductIntro || '--' }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">人力情况介绍</td>
                    <td>{{ appInfo.hrIntro || '--' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="overview-section">
              <div class="overview-section__title">真实性承诺</div>
              <table class="detail-table">
                <tbody>
                  <tr>
                    <td class="label-cell">《真实性承诺》</td>
                    <td><FileLinks :files="appInfo.authenticityCommit" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-show="activeStep === 1">
            <!-- Step 2: 应用服务功能情况 -->
            <div class="overview-section">
              <div class="overview-section__title">系统基本情况</div>
              <table class="detail-table">
                <tbody>
                  <tr>
                    <td class="label-cell">应用系统名称</td>
                    <td colspan="3">{{ appInfo.systemName || '--' }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">建设厂商</td>
                    <td colspan="3">{{ appInfo.builderVendor || '--' }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">联系人及联系方式1</td>
                    <td>{{ appInfo.sysContactName ? `${appInfo.sysContactName} ${appInfo.sysContactPhone || ''}` : '--' }}</td>
                    <td class="label-cell">联系人及联系方式2</td>
                    <td>{{ appInfo.sysContact2Name ? `${appInfo.sysContact2Name} ${appInfo.sysContact2Phone || ''}` : '--' }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">应用服务资费</td>
                    <td colspan="3">{{ appInfo.servicePricing || '--' }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">建设总投资（万元）</td>
                    <td>{{ appInfo.totalInvestment != null ? appInfo.totalInvestment : '--' }}</td>
                    <td class="label-cell">系统结构</td>
                    <td>{{ appInfo.systemStructure || '--' }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">系统主要功能</td>
                    <td colspan="3">{{ appInfo.systemMainFunc || '--' }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">系统地址</td>
                    <td colspan="3">{{ appInfo.systemUrl || '--' }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">服务对象</td>
                    <td colspan="3">{{ formatArray(appInfo.serviceTarget) }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">应用覆盖范围</td>
                    <td colspan="3">
                      <div v-if="appInfo.coverBase && appInfo.coverBase.length" class="coverage-box">
                        <div class="coverage-box__title">基层应用覆盖范围</div>
                        <div class="coverage-box__value">{{ formatArray(appInfo.coverBase) }}</div>
                      </div>
                      <div v-if="appInfo.coverPublic && appInfo.coverPublic.length" class="coverage-box">
                        <div class="coverage-box__title">公立应用覆盖范围</div>
                        <div class="coverage-box__value">{{ formatArray(appInfo.coverPublic) }}</div>
                      </div>
                      <div v-if="appInfo.coverTech && appInfo.coverTech.length" class="coverage-box">
                        <div class="coverage-box__title">医技应用覆盖范围</div>
                        <div class="coverage-box__value">{{ formatArray(appInfo.coverTech) }}</div>
                      </div>
                      <span v-if="!hasCoverage">--</span>
                    </td>
                  </tr>
                  <tr>
                    <td class="label-cell">应用发布终端</td>
                    <td colspan="3">{{ formatArray(appInfo.publishTerminal) }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">系统集成情况</td>
                    <td>{{ appInfo.systemIntegration || '--' }}</td>
                    <td class="label-cell">数据库类型</td>
                    <td>{{ appInfo.databaseType || '--' }}</td>
                  </tr>
                  <tr v-if="appInfo.systemIntegrationNote">
                    <td class="label-cell">集成说明</td>
                    <td colspan="3">{{ appInfo.systemIntegrationNote }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">编程语言</td>
                    <td>{{ appInfo.programLang || '--' }}</td>
                    <td class="label-cell">中间件类型</td>
                    <td>{{ appInfo.middlewareType || '--' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="overview-section">
              <div class="overview-section__title">系统部署</div>
              <table class="detail-table">
                <tbody>
                  <tr>
                    <td class="label-cell">部署方式</td>
                    <td>{{ appInfo.deployMethod || '--' }}</td>
                    <td class="label-cell">部署机房所在地</td>
                    <td>{{ appInfo.deployLocation || '--' }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">云服务商名称</td>
                    <td>{{ formatArray(appInfo.cloudProviderName) }}</td>
                    <td class="label-cell">云服务方式</td>
                    <td>{{ formatArray(appInfo.cloudServiceMode) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="overview-section">
              <div class="overview-section__title">主要设备</div>
              <table class="detail-table">
                <tbody>
                  <tr>
                    <td class="label-cell">服务器</td>
                    <td>{{ formatDevice(appInfo.serverName, appInfo.serverConfig, appInfo.serverDeployMode) }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">存储设备</td>
                    <td>{{ formatDevice(appInfo.storageName, appInfo.storageDevice, appInfo.storageDeployMode) }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">备份设备</td>
                    <td>{{ formatDevice(appInfo.backupName, appInfo.backupDevice, appInfo.backupDeployMode) }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">网络设备</td>
                    <td>{{ formatDevice(appInfo.networkName, appInfo.networkDevice, appInfo.networkDeployMode) }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">其他设备</td>
                    <td>{{ formatDevice(appInfo.otherName, appInfo.otherDevice, appInfo.otherDeployMode) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="overview-section">
              <div class="overview-section__title">系统互联</div>
              <table class="detail-table">
                <tbody>
                  <tr>
                    <td class="label-cell">系统互联</td>
                    <td>{{ appInfo.systemInterconnect || '--' }}</td>
                    <td class="label-cell">连接方式</td>
                    <td>{{ appInfo.connectMethod || '--' }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">系统关联名称</td>
                    <td colspan="3">{{ appInfo.relatedSystemName || '--' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="overview-section">
              <div class="overview-section__title">所属网络</div>
              <table class="detail-table">
                <tbody>
                  <tr>
                    <td class="label-cell">所属网络</td>
                    <td colspan="3">{{ formatArray(appInfo.networkScope) }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">网络覆盖范围</td>
                    <td colspan="3">{{ formatArray(appInfo.networkCoverage) }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">网络拓扑及说明</td>
                    <td>{{ appInfo.networkTopology || '--' }}</td>
                    <td class="label-cell">网络拓扑图</td>
                    <td><FileLinks :files="appInfo.networkTopologyFile" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="overview-section">
              <div class="overview-section__title">系统安全</div>
              <table class="detail-table">
                <tbody>
                  <tr>
                    <td class="label-cell">系统等级保护定级情况</td>
                    <td>{{ appInfo.protectionLevel || '--' }}</td>
                    <td class="label-cell">等保备案情况</td>
                    <td>{{ appInfo.protectionFiling || '--' }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">等保备案号</td>
                    <td>{{ appInfo.filingNumber || '--' }}</td>
                    <td class="label-cell">系统分级保护定级情况</td>
                    <td>{{ appInfo.classifiedProtection || '--' }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">分级保护备案情况</td>
                    <td>{{ appInfo.classifiedFiling || '--' }}</td>
                    <td class="label-cell">分保备案号</td>
                    <td>{{ appInfo.classifiedFilingNumber || '--' }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">安全测评及备案报告</td>
                    <td>{{ appInfo.securityAssessment || '--' }}</td>
                    <td class="label-cell">测评报告</td>
                    <td><FileLinks :files="appInfo.securityAssessmentFile" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="overview-section">
              <div class="overview-section__title">数据共享</div>
              <table class="detail-table">
                <tbody>
                  <tr>
                    <td class="label-cell">是否能够接入市共享系统</td>
                    <td>{{ appInfo.dataShareAccess || '--' }}</td>
                    <td class="label-cell">数据共享类型</td>
                    <td>{{ appInfo.dataShareType || '--' }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">文件依据</td>
                    <td colspan="3">{{ appInfo.dataShareBasis || '--' }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">数据共享方式</td>
                    <td>{{ appInfo.dataShareMode || '--' }}</td>
                    <td class="label-cell">数据资源目录</td>
                    <td>{{ appInfo.dataResourceCatalog || '--' }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">数据资源目录附件</td>
                    <td colspan="3"><FileLinks :files="appInfo.dataResourceCatalogFile" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="overview-section">
              <div class="overview-section__title">密码应用与国产适配</div>
              <table class="detail-table">
                <tbody>
                  <tr>
                    <td class="label-cell">系统使用的密码产品情况</td>
                    <td>{{ appInfo.cipherProduct || '--' }}</td>
                    <td class="label-cell">国产适配</td>
                    <td>{{ appInfo.domesticAdaptation || '--' }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">密码应用方案和密码应用安全性评估</td>
                    <td>{{ appInfo.cipherAssessment || '--' }}</td>
                    <td class="label-cell">测评报告</td>
                    <td><FileLinks :files="appInfo.cipherAssessmentFile" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="overview-section">
              <div class="overview-section__title">系统运维情况</div>
              <table class="detail-table">
                <tbody>
                  <tr>
                    <td class="label-cell">运维模式</td>
                    <td>{{ appInfo.opsMode || '--' }}</td>
                    <td class="label-cell">主要运维内容</td>
                    <td>{{ appInfo.opsContent || '--' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="overview-section">
              <div class="overview-section__title">建设预期指标</div>
              <table class="detail-table">
                <tbody>
                  <tr>
                    <td class="label-cell">预期用户数</td>
                    <td>{{ formatIndicator(appInfo.expectedUsersType, appInfo.expectedUsers) }}</td>
                    <td class="label-cell">最大并发数</td>
                    <td>{{ formatIndicator(appInfo.maxConcurrencyType, appInfo.maxConcurrency) }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">简单业务响应时间（秒）</td>
                    <td>{{ formatIndicator(appInfo.responseTimeSimpleType, appInfo.responseTimeSimple) }}</td>
                    <td class="label-cell">复杂业务响应时间（秒）</td>
                    <td>{{ formatIndicator(appInfo.responseTimeComplexType, appInfo.responseTimeComplex) }}</td>
                  </tr>
                  <tr>
                    <td class="label-cell">共享数据量</td>
                    <td colspan="3">{{ formatIndicator(appInfo.sharedDataCountType, appInfo.sharedDataCount) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-show="activeStep === 2">
            <!-- Step 3: 产品或服务的基本情况 -->
            <table class="detail-table">
              <tbody>
                <tr>
                  <td class="label-cell">主要产品或服务详细功能介绍</td>
                  <td>{{ appInfo.productDetailIntro || '--' }}</td>
                </tr>
                <tr>
                  <td class="label-cell">性能指标</td>
                  <td>{{ appInfo.performanceMetrics || '--' }}</td>
                </tr>
                <tr>
                  <td class="label-cell">安全性介绍</td>
                  <td>{{ appInfo.securityIntro || '--' }}</td>
                </tr>
                <tr>
                  <td class="label-cell">可靠性介绍</td>
                  <td>{{ appInfo.reliabilityIntro || '--' }}</td>
                </tr>
                <tr>
                  <td class="label-cell">易用性介绍</td>
                  <td>{{ appInfo.usabilityIntro || '--' }}</td>
                </tr>
                <tr>
                  <td class="label-cell">可维护性介绍</td>
                  <td>{{ appInfo.maintainabilityIntro || '--' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-show="activeStep === 3">
            <!-- Step 4: 相关附件 -->
            <div class="overview-section">
              <div class="overview-section__title">资质证明材料</div>
              <table class="detail-table">
                <tbody>
                  <tr>
                    <td class="label-cell">申报单位营业执照</td>
                    <td><FileLinks :files="appInfo.bizLicense" /></td>
                  </tr>
                  <tr>
                    <td class="label-cell">企业资质证明材料</td>
                    <td><FileLinks :files="appInfo.enterpriseQualification" /></td>
                  </tr>
                  <tr>
                    <td class="label-cell">典型案例企业证明材料</td>
                    <td><FileLinks :files="appInfo.typicalCase" /></td>
                  </tr>
                  <tr>
                    <td class="label-cell">参与服务的团队能力及相关证明材料</td>
                    <td><FileLinks :files="appInfo.teamAbility" /></td>
                  </tr>
                  <tr>
                    <td class="label-cell">《信息安全等级保护》相关证明材料</td>
                    <td><FileLinks :files="appInfo.securityReport" /></td>
                  </tr>
                  <tr>
                    <td class="label-cell">商用密码产品认证能力相关证明材料</td>
                    <td><FileLinks :files="appInfo.cipherCert" /></td>
                  </tr>
                  <tr>
                    <td class="label-cell">其他相关文件及需要说明的情况</td>
                    <td><FileLinks :files="appInfo.otherFiles" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CloudCard>

        <CloudCard class="app-audit-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">审核记录</span>
          </div>
          <a-table :scroll="{ x: 'max-content' }"
            :columns="auditColumns"
            :data-source="auditRecords"
            :pagination="false"
            row-key="id"
            size="middle"
            :expand-icon-column-index="0"
            @expand="onExpand"
          >
            <template #expandedRowRender="{ record }">
              <div v-if="getRecordPipeline(record.id).length > 0" class="audit-pipeline">
                <div
                  v-for="(step, si) in getRecordPipeline(record.id)"
                  :key="si"
                  class="pipeline-step"
                  :class="'pipeline-step--' + step.statusKey"
                >
                  <div class="pipeline-step__dot" :class="'pipeline-step__dot--' + step.statusKey">
                    <CheckOutlined v-if="step.statusKey === 'done'" />
                    <CloseOutlined v-else-if="step.statusKey === 'rejected'" />
                    <span v-else>{{ si + 1 }}</span>
                  </div>
                  <div class="pipeline-step__label">{{ step.title }}</div>
                  <div class="pipeline-step__tag" :class="'pipeline-step__tag--' + step.statusKey">{{ step.statusText }}</div>
                  <div v-if="si < 3" class="pipeline-step__connector" :class="'pipeline-step__connector--' + step.statusKey"></div>
                </div>
              </div>
              <a-empty v-else description="暂无审核流水" :image-style="{ height: '40px' }" />
            </template>
            <template #bodyCell="{ column, record }">
              <StatusDot v-if="column.dataIndex === 'status'" :type="getAuditStatusKey(record.status)" :text="getAuditStatusText(record.status)" />
              <span v-else class="cell-default">{{ record[column.dataIndex] || '--' }}</span>
            </template>
          </a-table>
        </CloudCard>
      </div>

      <div class="app-audit-detail-page__side">
        <CloudCard class="app-audit-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">审核操作</span>
          </div>
          <a-textarea
            v-model:value="auditForm.opinion"
            :rows="5"
            :maxlength="200"
            show-count
            placeholder="填写审核意见（通过/驳回时必填）"
            class="audit-textarea"
          />
          <div class="action-list">
            <a-button block type="primary" @click="approve">
              <template #icon><CheckOutlined /></template>
              审核通过
            </a-button>
            <a-button block danger @click="reject">
              <template #icon><CloseOutlined /></template>
              驳回申请
            </a-button>
          </div>
        </CloudCard>

        <CloudCard class="app-audit-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">联系信息</span>
          </div>
          <div class="contact-list">
            <div class="contact-item">
              <span class="contact-label">申报单位</span>
              <span class="contact-value">{{ appInfo.orgName }}</span>
            </div>
            <div class="contact-item">
              <span class="contact-label">联系人</span>
              <span class="contact-value">{{ appInfo.contactPerson }}</span>
            </div>
            <div class="contact-item">
              <span class="contact-label">电话</span>
              <span class="contact-value cell-mono">{{ appInfo.contactPhone }}</span>
            </div>
            <div class="contact-item">
              <span class="contact-label">系统地址</span>
              <span class="contact-value cell-mono">{{ appInfo.systemUrl }}</span>
            </div>
          </div>
        </CloudCard>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ArrowLeftOutlined, CheckOutlined, CloseOutlined
} from '@ant-design/icons-vue'
import { Modal, message } from 'ant-design-vue'
import { h } from 'vue'
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import StatusDot from '@/components/cloud/StatusDot.vue'

// 附件链接：蓝色可点击（演示环境提示下载）
const FileLinks = {
  name: 'FileLinks',
  props: {
    files: { type: [Array, String], default: null }
  },
  setup(props) {
    return () => {
      const arr = Array.isArray(props.files) ? props.files : (props.files ? [props.files] : [])
      if (!arr.length) return h('span', '--')
      return h(
        'span',
        { class: 'file-links' },
        arr.reduce((acc, f, i) => {
          if (i > 0) acc.push('、')
          acc.push(h('a', {
            class: 'file-link',
            onClick: () => { message.info(`演示环境：《${f}》下载暂不可用`) }
          }, f))
          return acc
        }, [])
      )
    }
  }
}

// 申报信息演示数据（字段与新增数字应用申报4步骤表单保持一致）
const APP_FORM_MOCK = {
  orgName: '重庆卫生健康信息技术有限公司',
  legalPerson: '张三',
  creditCode: '91500000MA60XXXXXX',
  orgNature: '国有',
  establishDate: '2020-03-15',
  regAddress: '重庆市 渝北区 龙山街道XXX号',
  bizAddress: '重庆市 渝北区 龙山街道XXX号',
  contactPerson: '李四',
  contactPhone: '13800138000',
  contactPosition: '项目经理',
  contactEmail: 'lisi@cqhw.com',
  appServiceIntro: '云HIS、云LIS、云PACS、心电云、基本公共卫生服务、信息安全等，覆盖区域内各级医疗卫生机构。',
  orgIntro: '公司成立于2020年，专注于卫生健康信息化领域，主营业务涵盖区域卫生信息平台、医院信息化系统建设与运维，服务覆盖全市38个区县。',
  mainProductIntro: '主要产品为区域智慧医疗服务平台，面向基层医疗卫生机构与公立医院，提供诊疗、公卫、影像、心电等一体化应用场景。',
  hrIntro: '员工总数320人，研发人员150人，运维人员60人，服务人员40人，经营管理人员70人；核心技术人员均具备PMP、系统架构师等资质，人员结构稳定。',
  authenticityCommit: '真实性承诺书（法人签章）.pdf',
  systemName: '区域智慧医疗服务平台',
  builderVendor: '重庆卫生健康信息技术有限公司',
  sysContactName: '王五',
  sysContactPhone: '13900139000',
  sysContact2Name: '赵六',
  sysContact2Phone: '13700137000',
  servicePricing: '基于系统 20万元/年，基于功能模块 2万元/个/年',
  totalInvestment: 580,
  systemMainFunc: '提供门诊住院一体化诊疗、电子病历、检验检查报告共享、影像云PACS、心电远程诊断、家庭医生签约与慢病随访管理等核心功能。',
  systemUrl: 'https://medcloud.cqhw.example.com',
  systemStructure: 'B/S',
  serviceTarget: ['基层医疗卫生机构', '公立医院'],
  coverBase: ['基本公共卫生服务', '医院信息系统（HIS）', '家庭医生签约'],
  coverPublic: ['医院信息系统（HIS）', '影像归档和通信系统（PACS）'],
  publishTerminal: ['网页', '自建APP'],
  systemIntegration: '已集成',
  databaseType: 'MySQL 8.0、达梦DM8',
  programLang: 'Java、Vue、Python',
  middlewareType: '东方通TongWeb、Redis、Kafka',
  deployMethod: '通过云服务商部署',
  deployLocation: '重庆市 两江新区水土数据中心',
  cloudProviderName: ['浪潮云'],
  cloudServiceMode: ['行业云'],
  serverName: '20台/套 浪潮NF5280M6',
  serverConfig: '4路8核 AMD 6136，16G内存，2*300G',
  serverDeployMode: ['自有机房'],
  storageName: '5台/套 华为OceanStor 5310',
  storageDevice: '双控，64G缓存，2*480G SSD + 12*4T SAS',
  storageDeployMode: ['自有机房'],
  backupName: '2台/套 Veritas NetBackup一体机',
  backupDevice: '备份容量100TB，万兆光口',
  backupDeployMode: ['自有机房'],
  networkName: '4台/套 华为CE12800',
  networkDevice: '48口10GE光，6口40GE',
  networkDeployMode: ['自有机房'],
  otherName: '2台/套 GPU推理服务器',
  otherDevice: '4*NVIDIA T4，128G内存',
  otherDeployMode: ['自有机房'],
  systemInterconnect: '系统关联运行',
  relatedSystemName: '重庆市全民健康信息平台、区域影像云平台',
  connectMethod: '接口调用',
  networkScope: ['互联网', '业务专网'],
  networkCoverage: ['市级', '区县（开发区）'],
  networkTopology: '有',
  networkTopologyFile: '网络拓扑图.pdf',
  protectionLevel: '三级',
  protectionFiling: '已备案',
  filingNumber: '渝公网安备50011202000XXX号',
  classifiedProtection: '无涉密',
  classifiedFiling: '未备案',
  classifiedFilingNumber: '',
  securityAssessment: '有',
  securityAssessmentFile: '安全测评及备案报告.pdf',
  dataShareAccess: '是',
  dataShareType: '无条件共享',
  dataShareBasis: '',
  dataShareMode: 'API接口共享',
  dataResourceCatalog: '有',
  dataResourceCatalogFile: '数据资源目录.xlsx',
  cipherProduct: '商用密码',
  domesticAdaptation: '国产化产品',
  cipherAssessment: '有',
  cipherAssessmentFile: '密码应用安全性评估报告.pdf',
  opsMode: '统一运维',
  opsContent: '7×24小时系统监控、故障响应、数据备份、版本升级与安全加固。',
  expectedUsers: '5000',
  expectedUsersType: '≥',
  responseTimeSimple: '1',
  responseTimeSimpleType: '≤',
  responseTimeComplex: '3',
  responseTimeComplexType: '≤',
  maxConcurrency: '2000',
  maxConcurrencyType: '≥',
  sharedDataCount: '100',
  sharedDataCountType: '≥',
  productDetailIntro: '平台采用微服务架构，包含门诊医生工作站、住院管理、电子病历、检验检查、影像归档与传输、心电远程诊断、家庭医生签约、慢病随访管理等模块，支持区域协同与数据互通。',
  performanceMetrics: '服务性能：简单业务响应时间≤1秒，复杂业务响应时间≤3秒；网络性能：出口带宽≥1Gbps；云性能：可用性≥99.9%。',
  securityIntro: '建立安全管理制度，支持访问控制、身份认证、数据加密传输与存储，通过三级等保测评，具备完善的用户隐私保护机制。',
  reliabilityIntro: '两地三中心容灾备份架构，RPO≤15分钟，RTO≤2小时，核心数据库主备双活。',
  usabilityIntro: '界面遵循医疗行业设计规范，支持快捷键操作、模板化录入，主要功能操作不超过3步。',
  maintainabilityIntro: '提供统一日志管理与监控告警，支持灰度发布与版本回滚，故障排查工具齐全。',
  bizLicense: '营业执照.pdf',
  enterpriseQualification: '软件企业证书.pdf、ISO27001认证证书.pdf',
  typicalCase: 'XX医院合作合同.pdf、用户使用反馈报告.pdf',
  teamAbility: '团队资质证明材料.pdf',
  securityReport: '等级保护测评报告.pdf',
  cipherCert: '商用密码产品认证证书.pdf',
  otherFiles: '第三方产品授权函.pdf'
}

export default {
  name: 'DigitalAppAuditDetail',
  components: {
    PageHeader, CloudCard, StatusDot,
    ArrowLeftOutlined, CheckOutlined, CloseOutlined,
    FileLinks
  },
  data() {
    return {
      activeStep: 0,
      stepOptions: [
        { label: '企业基本情况', value: 0 },
        { label: '应用服务功能情况', value: 1 },
        { label: '产品或服务的基本情况', value: 2 },
        { label: '相关附件', value: 3 }
      ],
      appInfo: {
        id: 1,
        appName: '区域智慧医疗服务平台',
        submitTime: '2026-03-01 14:00',
        ...APP_FORM_MOCK
      },
      auditRecords: [
        { id: 1, submitTime: '2024-01-01 10:00', status: 'approved', auditor: '平台管理员', auditTime: '2024-01-02 14:30', opinion: '审核通过，应用符合上架标准。' },
        { id: 2, submitTime: '2024-02-10 09:00', status: 'rejected', auditor: '平台管理员', auditTime: '2024-02-11 16:00', opinion: '安全评估报告不完整，请补充后重新提交。' },
        { id: 3, submitTime: '2024-02-15 11:00', status: 'approved', auditor: '平台管理员', auditTime: '2024-02-16 10:30', opinion: '材料已补齐，审核通过。' },
        { id: 4, submitTime: '2024-03-01 14:00', status: 'pending', auditor: '', auditTime: '', opinion: '' }
      ],
      auditForm: { opinion: '' },
      expandedRowKeys: [],
      auditSteps: [
        { key: 1, title: '申报材料评估' },
        { key: 2, title: '应用技术测评' },
        { key: 3, title: '现场演示答辩' },
        { key: 4, title: '评估结果公示' }
      ],
      auditPipelineData: {
        1: { currentStep: 4, auditStatus: 20, steps: { 1: { status: 'approved' }, 2: { status: 'approved' }, 3: { status: 'approved' }, 4: { status: 'approved' } } },
        2: { currentStep: 3, auditStatus: 30, steps: { 1: { status: 'approved' }, 2: { status: 'approved' }, 3: { status: 'rejected' }, 4: { status: 'pending' } } },
        3: { currentStep: 4, auditStatus: 20, steps: { 1: { status: 'approved' }, 2: { status: 'approved' }, 3: { status: 'approved' }, 4: { status: 'approved' } } },
        4: { currentStep: 1, auditStatus: 10, steps: { 1: { status: 'processing' }, 2: { status: 'pending' }, 3: { status: 'pending' }, 4: { status: 'pending' } } }
      },
      auditColumns: [
        { title: '提交时间', dataIndex: 'submitTime', key: 'submitTime', width: 150 },
        { title: '审核状态', dataIndex: 'status', key: 'status', width: 100 },
        { title: '审核人', dataIndex: 'auditor', key: 'auditor', width: 110 },
        { title: '审核时间', dataIndex: 'auditTime', key: 'auditTime', width: 150 },
        { title: '审核意见', dataIndex: 'opinion', key: 'opinion', ellipsis: true }
      ]
    }
  },
  created() {
    const appId = this.$route.query.id
    if (appId) {
      this.loadAppDetail(appId)
    }
  },
  computed: {
    hasCoverage() {
      const r = this.appInfo
      return !!(r.coverBase?.length || r.coverPublic?.length || r.coverTech?.length)
    }
  },
  methods: {
    formatArray(arr) {
      if (Array.isArray(arr)) return arr.join('、') || '--'
      return arr || '--'
    },
    formatContact(record) {
      if (!record || !record.contactPerson) return '--'
      const parts = [record.contactPerson, record.contactPhone].filter(Boolean)
      const extras = [record.contactPosition, record.contactEmail].filter(Boolean)
      let text = parts.join(' ')
      if (extras.length) text += `（${extras.join(' / ')}）`
      return text
    },
    formatDevice(name, config, deployMode) {
      const parts = []
      if (name) parts.push(name)
      if (config) parts.push(config)
      if (deployMode && deployMode.length) parts.push(`部署方式：${Array.isArray(deployMode) ? deployMode.join('、') : deployMode}`)
      return parts.length ? parts.join('；') : '--'
    },
    formatIndicator(type, val) {
      if (val == null || val === '') return '--'
      return `${type || ''} ${val}`
    },
    getDemoContainer() {
      return document.querySelector('.app-main__content') || document.body;
    },
    getDrawerContainer() {
      return document.querySelector('.app-overlay') || document.body;
    },
    loadAppDetail() {},
    goBack() {
      this.$router.push('/portal/auditCenter/digitalAppAudit')
    },
    approve() {
      if (!this.auditForm.opinion.trim()) {
        message.warning('请填写审核意见')
        return
      }
      Modal.confirm({
        getContainer: this.getDemoContainer,
        title: '确认通过',
        content: '确定要通过该应用的审核吗？',
        okText: '确定',
        cancelText: '取消',
        okType: 'primary',
        onOk: () => {
          message.success('审核通过，应用已激活')
          this.goBack()
        }
      })
    },
    reject() {
      if (!this.auditForm.opinion.trim()) {
        message.warning('请填写驳回原因')
        return
      }
      Modal.confirm({
        getContainer: this.getDemoContainer,
        title: '确认驳回',
        content: '确定要拒绝该应用的审核吗？',
        okText: '确定',
        cancelText: '取消',
        okType: 'danger',
        onOk: () => {
          message.success('审核已驳回')
          this.goBack()
        }
      })
    },
    getAuditStatusKey(status) {
      const map = { approved: 'done', rejected: 'rejected', pending: 'processing' }
      return map[status] || 'default'
    },
    getAuditStatusText(status) {
      const map = { approved: '已通过', rejected: '已驳回', pending: '待审核' }
      return map[status] || '未知'
    },
    // 审核流水：根据审核记录ID返回4阶段流水数据
    getRecordPipeline(recordId) {
      const pdata = this.auditPipelineData[recordId]
      if (!pdata) return []
      return this.auditSteps.map((step, idx) => {
        const s = (pdata.steps && pdata.steps[step.key]) || { status: 'pending' }
        const statusMap = {
          approved: { statusKey: 'done', statusText: '已通过' },
          rejected: { statusKey: 'rejected', statusText: '已驳回' },
          processing: { statusKey: 'active', statusText: '待审核' },
          pending: { statusKey: 'pending', statusText: '待审核' }
        }
        const mapped = statusMap[s.status] || statusMap.pending
        return {
          title: step.title,
          statusKey: mapped.statusKey,
          statusText: mapped.statusText
        }
      })
    },
    onExpand(expanded, record) {
      if (expanded) {
        this.expandedRowKeys.push(record.id)
      } else {
        this.expandedRowKeys = this.expandedRowKeys.filter(k => k !== record.id)
      }
    }
  }
}
</script>

<style scoped>
.app-audit-detail-page {
  padding: 4px 0;
}

.app-audit-detail-page__body {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 14px;
  margin-top: 14px;
}

.app-audit-detail-page__main,
.app-audit-detail-page__side {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.card-head__title {
  font-size: 15px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}

.card-head__sub {
  font-size: 12px;
  color: #86909C;
}

/* 二级步骤导航：极简（选中项小胶囊，其余纯文字） */
.detail-step-sidenav {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;
}

.detail-step-sidenav__item {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.45);
  padding: 4px 14px;
  border: 1px solid transparent;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.detail-step-sidenav__item:hover {
  color: #1677FF;
}

.detail-step-sidenav__item.is-active {
  color: #1677FF;
  background: rgba(22, 119, 255, 0.06);
  border-color: rgba(22, 119, 255, 0.35);
  font-weight: 600;
}

.overview-section {
  margin-bottom: 16px;
}

.overview-section:last-child {
  margin-bottom: 0;
}

.overview-section__title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 10px;
  line-height: 1.4;
}

/* 详情字段表格（固定列宽保证对齐） */
.detail-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 13px;
}

.detail-table td {
  border: 1px solid #E5E6EB;
  padding: 8px 12px;
  word-break: break-word;
  vertical-align: top;
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.6;
}

.detail-table .label-cell {
  width: 170px;
  background: #F7F8FA;
  color: rgba(0, 0, 0, 0.45);
  font-weight: 500;
}

/* 应用覆盖范围分组 */
.coverage-box {
  padding: 8px 12px;
  border: 1px solid #E5E6EB;
  border-radius: 8px;
  margin-bottom: 8px;
}

.coverage-box:last-child {
  margin-bottom: 0;
}

.coverage-box__title {
  font-size: 13px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 4px;
}

.coverage-box__value {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.6;
}

.cell-default {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}

.cell-mono {
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
  font-variant-numeric: tabular-nums;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.85);
  letter-spacing: -0.2px;
}

.muted {
  color: #86909C;
  font-size: 13px;
  line-height: 1.6;
}

.info-desc :deep(.ant-descriptions-item-label) {
  color: #86909C;
  font-size: 13px;
  width: 100px;
}

.info-desc :deep(.ant-descriptions-item-content) {
  color: rgba(0, 0, 0, 0.85);
  font-size: 13px;
}

.material-list :deep(.ant-list-item) {
  padding: 10px 0;
}

.material-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: #E8F3FF;
  color: #165DFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.material-name {
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.material-size {
  font-size: 11px;
  color: #86909C;
}

.audit-textarea {
  margin-bottom: 12px;
}

.action-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.contact-label {
  color: #86909C;
  font-size: 12px;
  width: 64px;
  flex-shrink: 0;
}

.contact-value {
  color: rgba(0, 0, 0, 0.85);
  font-size: 13px;
  flex: 1;
  word-break: break-all;
  min-width: 0;
}

@media (max-width: 1100px) {
  .app-audit-detail-page__body {
    grid-template-columns: 1fr;
  }
}

/* ===== 审核流水（展开行） ===== */
.audit-pipeline {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px 16px;
  gap: 0;
}

.pipeline-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
  min-width: 0;
}

.pipeline-step__dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
  z-index: 1;
}

.pipeline-step__dot--pending {
  color: #86909C;
  background: #FFFFFF;
  border: 1.5px solid #C9CDD4;
}

.pipeline-step__dot--active {
  color: #FFFFFF;
  background: #165DFF;
  border-color: #165DFF;
  box-shadow: 0 2px 6px rgba(22, 93, 255, 0.35);
}

.pipeline-step__dot--done {
  color: #FFFFFF;
  background: #16A34A;
  border-color: #16A34A;
}

.pipeline-step__dot--rejected {
  color: #FFFFFF;
  background: #EF4444;
  border-color: #EF4444;
}

.pipeline-step__label {
  font-size: 11px;
  color: rgba(0, 0, 0, 0.65);
  margin-top: 6px;
  text-align: center;
  white-space: nowrap;
}

.pipeline-step--active .pipeline-step__label {
  color: #165DFF;
  font-weight: 600;
}

.pipeline-step__tag {
  display: inline-block;
  padding: 1px 6px;
  font-size: 10px;
  font-weight: 500;
  border-radius: 3px;
  margin-top: 4px;
}

.pipeline-step__tag--pending {
  background: #F2F3F5;
  color: #86909C;
}

.pipeline-step__tag--active {
  background: #E8F3FF;
  color: #165DFF;
}

.pipeline-step__tag--done {
  background: #E9F9EF;
  color: #16A34A;
}

.pipeline-step__tag--rejected {
  background: #FFEDEC;
  color: #EF4444;
}

.pipeline-step__connector {
  position: absolute;
  top: 12px;
  left: calc(50% + 16px);
  width: calc(100% - 32px);
  height: 2px;
  background: #E5E6EB;
  z-index: 0;
}

.pipeline-step__connector--done {
  background: #16A34A;
}
</style>

<style>
/* 附件链接：蓝色可点击下载（unscoped，FileLinks 为独立组件，scoped 选择器作用不到） */
.file-links .file-link,
.file-link {
  color: #1677FF;
  cursor: pointer;
  word-break: break-all;
}

.file-link:hover {
  text-decoration: underline;
}
</style>
