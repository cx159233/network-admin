<template>
  <div class="service-audit-detail-page">
    <PageHeader
      :title="`基础服务审核 · ${serviceInfo.serviceName}`"
      description="查看服务申请详情、资质材料及审核记录，并通过或驳回本次申请"
    >
      <template #actions>
        <a-button @click="goBack">
          <template #icon><ArrowLeftOutlined /></template>
          返回列表
        </a-button>
      </template>
    </PageHeader>

    <div class="service-audit-detail-page__body">
      <div class="service-audit-detail-page__main">
        <CloudCard class="service-audit-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">服务基本信息</span>
          </div>
          <a-descriptions :column="2" size="small" class="info-desc">
            <a-descriptions-item label="服务名称">{{ serviceInfo.serviceName }}</a-descriptions-item>
            <a-descriptions-item label="服务ID">
              <span class="cell-mono">{{ serviceInfo.serviceId }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="服务专区">{{ getServiceZoneLabel(serviceInfo.serviceZone) }}</a-descriptions-item>
            <a-descriptions-item label="部署云服务商">{{ serviceInfo.cloudProvider }}</a-descriptions-item>
            <a-descriptions-item label="服务分类">{{ serviceInfo.serviceType }}</a-descriptions-item>
            <a-descriptions-item label="服务商名称">{{ serviceInfo.vendor }}</a-descriptions-item>
            <a-descriptions-item label="服务等级">{{ serviceInfo.serviceLevel }}</a-descriptions-item>
            <a-descriptions-item label="提交时间">
              <span class="cell-mono">{{ serviceInfo.submitTime }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="服务范围">{{ serviceInfo.serviceScope }}</a-descriptions-item>
            <a-descriptions-item label="服务描述" :span="2">
              <span class="muted">{{ serviceInfo.description }}</span>
            </a-descriptions-item>
          </a-descriptions>
        </CloudCard>

        <CloudCard class="service-audit-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">资质材料</span>
          </div>
          <a-list :data-source="serviceInfo.materials" class="material-list">
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

        <CloudCard class="service-audit-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">审核记录</span>
          </div>
          <a-table :scroll="{ x: 'max-content' }"
            :columns="auditColumns"
            :data-source="auditRecords"
            :pagination="false"
            row-key="id"
            size="middle"
          >
            <template #bodyCell="{ column, record }">
              <StatusDot v-if="column.dataIndex === 'status'" :type="getAuditStatusKey(record.status)" :text="getAuditStatusText(record.status)" />
              <span v-else class="cell-default">{{ record[column.dataIndex] || '--' }}</span>
            </template>
          </a-table>
        </CloudCard>
      </div>

      <div class="service-audit-detail-page__side">
        <CloudCard class="service-audit-detail-page__card">
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

        <CloudCard class="service-audit-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">服务商信息</span>
          </div>
          <div class="contact-list">
            <div class="contact-item">
              <span class="contact-label">服务商</span>
              <span class="contact-value">{{ serviceInfo.vendor }}</span>
            </div>
            <div class="contact-item">
              <span class="contact-label">部署云服务商</span>
              <span class="contact-value">{{ serviceInfo.cloudProvider }}</span>
            </div>
            <div class="contact-item">
              <span class="contact-label">服务等级</span>
              <span class="contact-value">{{ serviceInfo.serviceLevel }}</span>
            </div>
            <div class="contact-item">
              <span class="contact-label">服务范围</span>
              <span class="contact-value">{{ serviceInfo.serviceScope }}</span>
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
  name: 'BasicServiceAuditDetail',
  components: {
    PageHeader, CloudCard, StatusDot,
    ArrowLeftOutlined, CheckOutlined, CloseOutlined, DownloadOutlined, FileOutlined
  },
  data() {
    return {
      serviceInfo: {
        id: 1,
        serviceName: '弹性计算服务ECS',
        serviceId: 'SVC-2024-0001',
        serviceZone: 'X86Zone',
        cloudProvider: '浪潮云',
        serviceType: '计算服务',
        vendor: '浪潮云信息技术有限公司',
        submitTime: '2024-03-01 10:00:00',
        description: '弹性计算服务（ECS）是一种简单高效、处理能力可弹性伸缩的计算服务，帮助快速构建更稳定、安全的应用，提升运维效率，降低IT成本。',
        serviceScope: '全国',
        serviceLevel: 'SLA 99.95%',
        materials: [
          { name: '服务技术白皮书.pdf', size: '3.2 MB' },
          { name: '安全合规认证.pdf', size: '1.5 MB' },
          { name: '服务等级协议SLA.pdf', size: '920 KB' },
          { name: '厂商资质证明.pdf', size: '1.1 MB' }
        ]
      },
      auditForm: { opinion: '' },
      auditRecords: [
        { id: 1, submitTime: '2024-03-01 10:00', status: 'approved', auditor: '平台管理员', auditTime: '2024-03-02 09:30', opinion: '服务符合上架标准，审核通过。' },
        { id: 2, submitTime: '2024-03-05 11:00', status: 'pending', auditor: '', auditTime: '', opinion: '' }
      ],
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
    const serviceId = this.$route.query.id
    if (serviceId) {
      this.loadServiceDetail(serviceId)
    }
  },
  methods: {
    getDemoContainer() {
      return document.querySelector('.app-main__content') || document.body;
    },
    getDrawerContainer() {
      return document.querySelector('.app-overlay') || document.body;
    },
    loadServiceDetail() {},
    goBack() {
      this.$router.push('/portal/auditCenter/basicServiceAudit')
    },
    approve() {
      if (!this.auditForm.opinion.trim()) {
        message.warning('请填写审核意见')
        return
      }
      Modal.confirm({
        getContainer: this.getDemoContainer,
        title: '确认通过',
        content: '确定要通过该服务的审核吗？',
        okText: '确定',
        cancelText: '取消',
        okType: 'primary',
        onOk: () => {
          message.success('审核通过，服务已上架')
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
        content: '确定要拒绝该服务的审核吗？',
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
    getServiceZoneLabel(zone) {
      const map = { X86Zone: 'X86专区', XinChuangZone: '信创专区', CipherZone: '密码服务专区', SuperComputeZone: '超算、智算专区' }
      return map[zone] || zone || '--'
    }
  }
}
</script>

<style scoped>
.service-audit-detail-page {
  padding: 4px 0;
}

.service-audit-detail-page__body {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 14px;
  margin-top: 14px;
}

.service-audit-detail-page__main,
.service-audit-detail-page__side {
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
  .service-audit-detail-page__body {
    grid-template-columns: 1fr;
  }
}
</style>
