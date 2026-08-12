<template>
  <div class="demand-detail-page">
    <PageHeader
      :title="`需求详情 · ${demandInfo.demandNo}`"
      description="查看我发起的需求详情及响应内容"
    >
      <template #actions>
        <a-button @click="goBack">
          <template #icon><ArrowLeftOutlined /></template>
          返回列表
        </a-button>
      </template>
    </PageHeader>

    <div class="demand-detail-page__body">
      <div class="demand-detail-page__main">
        <CloudCard class="demand-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">需求信息</span>
            <StatusDot :type="getDemandStatusKey(demandInfo.status)" :text="demandInfo.status" />
          </div>
          <a-descriptions :column="2" size="small" class="demand-desc">
            <a-descriptions-item label="需求编号">
              <span class="cell-mono">{{ demandInfo.demandNo }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="服务类型">
              <span :class="['service-type-tag', `service-type-tag--${getServiceTypeClass(demandInfo.serviceType)}`]">{{ demandInfo.serviceType }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="申请机构">{{ demandInfo.orgName }}</a-descriptions-item>
            <a-descriptions-item label="申请人">{{ demandInfo.applicant }}</a-descriptions-item>
            <a-descriptions-item label="发布时间">
              <span class="cell-mono">{{ demandInfo.publishTime }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="需求状态">{{ demandInfo.status }}</a-descriptions-item>
            <a-descriptions-item label="需求描述" :span="2">
              <span class="muted">{{ demandInfo.demandDescription }}</span>
            </a-descriptions-item>
          </a-descriptions>
        </CloudCard>

        <CloudCard v-if="demandInfo.responseContent" class="demand-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">响应信息</span>
          </div>
          <a-descriptions :column="2" size="small" class="demand-desc">
            <a-descriptions-item label="响应机构">{{ demandInfo.respondent || '--' }}</a-descriptions-item>
            <a-descriptions-item label="响应时间">
              <span class="cell-mono">{{ demandInfo.responseTime || '--' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="预估报价">
              <span class="price-text">¥{{ demandInfo.estimatedPrice }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="预计工期">{{ demandInfo.estimatedDuration || '--' }}</a-descriptions-item>
            <a-descriptions-item label="响应内容" :span="2">
              <span class="muted">{{ demandInfo.responseContent }}</span>
            </a-descriptions-item>
          </a-descriptions>
        </CloudCard>
      </div>

      <div class="demand-detail-page__side">
        <CloudCard class="demand-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">需求状态</span>
          </div>
          <div class="status-block">
            <StatusDot :type="getDemandStatusKey(demandInfo.status)" :text="demandInfo.status" />
            <div class="status-block__time">发布于 {{ demandInfo.publishTime }}</div>
          </div>
          <div class="info-mini-list">
            <div class="info-mini">
              <span class="info-mini__label">服务类型</span>
              <span class="info-mini__value">{{ demandInfo.serviceType }}</span>
            </div>
            <div class="info-mini">
              <span class="info-mini__label">申请人</span>
              <span class="info-mini__value">{{ demandInfo.applicant }}</span>
            </div>
            <div class="info-mini">
              <span class="info-mini__label">申请机构</span>
              <span class="info-mini__value">{{ demandInfo.orgName }}</span>
            </div>
          </div>
        </CloudCard>

        <CloudCard v-if="demandInfo.responseContent" class="demand-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">响应摘要</span>
          </div>
          <div class="metric-list">
            <div class="metric">
              <div class="metric__label">预估报价</div>
              <div class="metric__value">¥{{ demandInfo.estimatedPrice }}</div>
            </div>
            <div class="metric">
              <div class="metric__label">预计工期</div>
              <div class="metric__value">{{ demandInfo.estimatedDuration || '--' }}</div>
            </div>
            <div class="metric">
              <div class="metric__label">响应机构</div>
              <div class="metric__value metric__value--text">{{ demandInfo.respondent || '--' }}</div>
            </div>
          </div>
        </CloudCard>
      </div>
    </div>
  </div>
</template>

<script>
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import StatusDot from '@/components/cloud/StatusDot.vue'

export default {
  name: 'MyDemandInitiateDetail',
  components: {
    PageHeader, CloudCard, StatusDot,
    ArrowLeftOutlined
  },
  data() {
    return {
      demandInfo: {
        demandNo: 'DM-20260810-0012',
        demandDescription: '需要一个统一的身份认证平台，支持OAuth2.0和SAML协议，要求支持至少10万用户的并发认证，并提供SSO单点登录功能',
        serviceType: '安全服务',
        orgName: '北京市海淀区数字经济发展局',
        applicant: '张三',
        status: '已响应',
        publishTime: '2026-03-18 10:30:00',
        respondent: '北京信息安全技术有限公司',
        responseContent: '可提供统一身份认证平台方案，支持OAuth2.0/SAML协议，含SSO单点登录，支持10万+用户并发认证。',
        estimatedPrice: '280,000',
        estimatedDuration: '40个工作日',
        responseTime: '2026-03-19 14:20:00'
      }
    }
  },
  methods: {
    goBack() {
      this.$router.push('/workorder/myDemand/initiate')
    },
    getDemandStatusKey(status) {
      const map = {
        '待响应': 'warning',
        '已响应': 'processing',
        '已完成': 'done',
        '已关闭': 'cancelled'
      }
      return map[status] || 'default'
    },
    getServiceTypeClass(type) {
      const map = {
        '数字应用': 'digital',
        '安全服务': 'security',
        '能力组件': 'component',
        '基础服务': 'basic'
      }
      return map[type] || ''
    }
  }
}
</script>

<style scoped>
.demand-detail-page {
  padding: 4px 0;
}

.demand-detail-page__body {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 14px;
  margin-top: 14px;
}

.demand-detail-page__main,
.demand-detail-page__side {
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

.cell-mono {
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
  font-variant-numeric: tabular-nums;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.85);
  letter-spacing: -0.2px;
}

.muted {
  color: #4E5969;
  font-size: 13px;
  line-height: 1.6;
}

.price-text {
  color: #F59E0B;
  font-weight: 600;
  font-size: 14px;
}

.demand-desc :deep(.ant-descriptions-item-label) {
  color: #86909C;
  font-size: 13px;
  width: 160px !important;
  min-width: 160px !important;
  max-width: 160px !important;
  white-space: nowrap;
}

.demand-desc :deep(.ant-descriptions-item-content) {
  color: rgba(0, 0, 0, 0.85);
  font-size: 13px;
}

.status-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 4px 0 14px;
  border-bottom: 1px solid #F2F3F5;
  margin-bottom: 14px;
}

.status-block__time {
  font-size: 11px;
  color: #86909C;
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
}

.info-mini-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-mini {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.info-mini__label {
  color: #86909C;
  font-size: 12px;
  width: 64px;
  flex-shrink: 0;
}

.info-mini__value {
  color: rgba(0, 0, 0, 0.85);
  font-size: 13px;
  flex: 1;
  min-width: 0;
  word-break: break-all;
}

.metric-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.metric__label {
  font-size: 11px;
  color: #86909C;
  margin-bottom: 4px;
}

.metric__value {
  font-size: 16px;
  font-weight: 600;
  color: #F59E0B;
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
}

.metric__value--text {
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  font-family: inherit;
}

@media (max-width: 1100px) {
  .demand-detail-page__body {
    grid-template-columns: 1fr;
  }
}
</style>
