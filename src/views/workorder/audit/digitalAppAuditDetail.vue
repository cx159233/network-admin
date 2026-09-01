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
            <span class="card-head__title">应用基本信息</span>
          </div>
          <a-descriptions :column="2" size="small" class="info-desc">
            <a-descriptions-item label="应用名称">{{ appInfo.appName }}</a-descriptions-item>
            <a-descriptions-item label="系统地址">
              <span class="cell-mono">{{ appInfo.systemUrl }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="提交时间">
              <span class="cell-mono">{{ appInfo.submitTime }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="应用架构">{{ appInfo.appArchitecture }}</a-descriptions-item>
            <a-descriptions-item label="服务对象" :span="2">{{ appInfo.targetObjectStr }}</a-descriptions-item>
            <a-descriptions-item label="部署云服务商" :span="2">{{ appInfo.cloudProviderStr }}</a-descriptions-item>
            <a-descriptions-item label="应用覆盖范围" :span="2">{{ appInfo.appScope }}</a-descriptions-item>
            <a-descriptions-item label="应用描述" :span="2">
              <span class="muted">{{ appInfo.description }}</span>
            </a-descriptions-item>
          </a-descriptions>
        </CloudCard>

        <CloudCard class="app-audit-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">服务商信息</span>
          </div>
          <a-descriptions :column="2" size="small" class="info-desc">
            <a-descriptions-item label="服务商名称">{{ appInfo.serviceProvider }}</a-descriptions-item>
            <a-descriptions-item label="合作伙伴">{{ appInfo.cooperativeEnterprise || '--' }}</a-descriptions-item>
            <a-descriptions-item label="联系人1">{{ appInfo.contact1Name }}</a-descriptions-item>
            <a-descriptions-item label="联系电话1">
              <span class="cell-mono">{{ appInfo.contact1Phone }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="联系人2">{{ appInfo.contact2Name || '--' }}</a-descriptions-item>
            <a-descriptions-item label="联系电话2">
              <span class="cell-mono">{{ appInfo.contact2Phone || '--' }}</span>
            </a-descriptions-item>
          </a-descriptions>
        </CloudCard>

        <CloudCard class="app-audit-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">资质材料</span>
          </div>
          <a-list :data-source="appInfo.materials" class="material-list">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #avatar>
                    <div class="material-icon"><FileOutlined /></div>
                  </template>
                  <template #title>
                    <span class="material-name">{{ item.name }}</span>
                  </template>
                  <template #description>
                    <span class="material-size">{{ item.size }}</span>
                  </template>
                </a-list-item-meta>
                <template #actions>
                  <a-button type="link" size="small" @click="downloadMaterial(item)">
                    <template #icon><DownloadOutlined /></template>
                    下载
                  </a-button>
                </template>
              </a-list-item>
            </template>
          </a-list>
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
              <span class="contact-label">服务商</span>
              <span class="contact-value">{{ appInfo.serviceProvider }}</span>
            </div>
            <div class="contact-item">
              <span class="contact-label">联系人</span>
              <span class="contact-value">{{ appInfo.contact1Name }}</span>
            </div>
            <div class="contact-item">
              <span class="contact-label">电话</span>
              <span class="contact-value cell-mono">{{ appInfo.contact1Phone }}</span>
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
  ArrowLeftOutlined, CheckOutlined, CloseOutlined, DownloadOutlined, FileOutlined
} from '@ant-design/icons-vue'
import { Modal, message } from 'ant-design-vue'
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import StatusDot from '@/components/cloud/StatusDot.vue'

export default {
  name: 'DigitalAppAuditDetail',
  components: {
    PageHeader, CloudCard, StatusDot,
    ArrowLeftOutlined, CheckOutlined, CloseOutlined, DownloadOutlined, FileOutlined
  },
  data() {
    return {
      appInfo: {
        id: 1,
        appName: '智能办公系统',
        serviceProvider: '腾讯科技',
        cooperativeEnterprise: '北京协同科技有限公司',
        systemUrl: 'https://oa.tencent.com',
        logo: '',
        contact1Name: '张经理',
        contact1Phone: '13800138000',
        contact2Name: '李主管',
        contact2Phone: '13900139000',
        submitTime: '2024-01-01 10:00',
        description: '智能办公系统是一款集协同办公、文档管理、审批流程等功能于一体的企业级办公软件，旨在提高企业内部沟通效率和管理水平。',
        targetObjectStr: '基层医疗卫生机构、公立医院',
        appArchitecture: 'B/S',
        cloudProviderStr: '浪潮云、移动云',
        appScope: '医院信息系统（HIS）、基本公共卫生服务',
        materials: [
          { name: '应用截图.png', size: '2.4 MB' },
          { name: '应用说明文档.pdf', size: '1.8 MB' },
          { name: '安全评估报告.pdf', size: '890 KB' },
          { name: '厂商资质证明.pdf', size: '1.1 MB' }
        ]
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
        { key: 4, title: '服务目录发布' }
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
  methods: {
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
    downloadMaterial(material) {
      message.success('下载附件：' + material.name)
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
