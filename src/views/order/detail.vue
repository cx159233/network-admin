<template>
  <div class="order-detail-page">
    <PageHeader
      :title="`订单详情 · ${orderInfo.orderNo}`"
      description="查看订单基础信息、流程进度、关联工单及满意度评价"
    >
      <template #actions>
        <a-button @click="goBack">
          <template #icon><ArrowLeftOutlined /></template>
          返回列表
        </a-button>
      </template>
    </PageHeader>

    <div class="order-detail-page__body">
      <div class="order-detail-page__main">
        <CloudCard class="order-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">订单基本信息</span>
            <StatusDot :type="getStatusKey(orderInfo.status)" :text="orderInfo.status" />
          </div>
          <a-descriptions :column="2" size="small" class="order-desc">
            <a-descriptions-item label="服务名称">{{ orderInfo.serviceName }}</a-descriptions-item>
            <a-descriptions-item label="服务类型">
              <span :class="['service-type-tag', `service-type-tag--${getServiceTypeClass(orderInfo.serviceType)}`]">{{ orderInfo.serviceType }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="服务规格" :span="2">{{ orderInfo.serviceSpec }}</a-descriptions-item>
            <a-descriptions-item label="申请人">{{ orderInfo.applicant }}</a-descriptions-item>
            <a-descriptions-item label="申请机构">{{ orderInfo.orgName }}</a-descriptions-item>
            <a-descriptions-item label="申请时间">
              <span class="cell-mono">{{ orderInfo.applyTime }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="订单号">
              <span class="cell-mono">{{ orderInfo.orderNo }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="申请备注" :span="2">
              <span class="muted">{{ orderInfo.remark }}</span>
            </a-descriptions-item>
          </a-descriptions>
        </CloudCard>

        <CloudCard class="order-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">流程进度</span>
          </div>
          <a-timeline class="order-timeline">
            <a-timeline-item
              v-for="(step, idx) in timeline"
              :key="idx"
              :color="step.dotColor"
            >
              <div :class="['tl-title', `tl-title--${step.state}`]">{{ step.title }}</div>
              <div class="tl-time">{{ step.time }}</div>
            </a-timeline-item>
          </a-timeline>
        </CloudCard>

        <CloudCard class="order-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">满意度评价</span>
          </div>
          <div v-if="reviewInfo.hasReviewed" class="review-result">
            <div class="review-row">
              <span class="review-label">满意度评分</span>
              <a-rate v-model:value="reviewInfo.score" disabled />
            </div>
            <div class="review-row">
              <span class="review-label">评价内容</span>
              <span class="review-desc">{{ reviewInfo.description }}</span>
            </div>
            <div class="review-row">
              <span class="review-label">评价时间</span>
              <span class="review-desc cell-mono">{{ reviewInfo.reviewTime }}</span>
            </div>
          </div>
          <div v-else class="review-empty">
            <FrownOutlined class="review-empty__icon" />
            <span>订单尚未完成，暂不可评价</span>
          </div>
        </CloudCard>
      </div>

      <div class="order-detail-page__side">
        <CloudCard class="order-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">关联工单</span>
          </div>
          <div class="workorder-chip">
            <div class="workorder-chip__id">
              <span class="cell-mono">{{ workorderInfo.id }}</span>
            </div>
            <div class="workorder-chip__title">{{ workorderInfo.title }}</div>
            <div class="workorder-chip__owner">负责人：{{ workorderInfo.owner }}</div>
          </div>
          <a-button block style="margin-top: 12px" @click="goToWorkorder">
            <template #icon><EyeOutlined /></template>
            查看工单
          </a-button>
        </CloudCard>

        <CloudCard class="order-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">订单操作</span>
          </div>
          <div class="action-list">
            <a-button block danger @click="cancelOrder">
              <template #icon><CloseCircleOutlined /></template>
              取消订单
            </a-button>
          </div>
        </CloudCard>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ArrowLeftOutlined, EyeOutlined, CloseCircleOutlined, FrownOutlined
} from '@ant-design/icons-vue'
import { Modal, message } from 'ant-design-vue'
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import StatusDot from '@/components/cloud/StatusDot.vue'

export default {
  name: 'OrderDetail',
  components: {
    PageHeader, CloudCard, StatusDot,
    ArrowLeftOutlined, EyeOutlined, CloseCircleOutlined, FrownOutlined
  },
  data() {
    return {
      orderInfo: {
        orderNo: '202608100095',
        serviceName: '智慧园区综合管理平台',
        serviceSpec: '标准版，含500个设备接入 + 数据看板',
        serviceType: '数字应用',
        applicant: '张三',
        orgName: '北京市海淀区数字经济发展局',
        applyTime: '2026-03-15 14:32:00',
        status: '工单流转中',
        remark: '本次申请智慧园区综合管理平台标准版，含500个设备接入及数据看板功能，请安排团队完成部署与联调。'
      },
      workorderInfo: {
        id: 'TK-0234',
        title: '智慧园区综合管理平台部署交付',
        owner: '王五（安全团队）'
      },
      reviewInfo: {
        hasReviewed: false,
        score: 0,
        description: '',
        reviewTime: ''
      },
      timeline: [
        { title: '提交申请', time: '2026-03-15 14:32:00 · 张三', state: 'done', dotColor: 'green' },
        { title: '系统派发工单', time: '2026-03-15 16:10:00 · 自动派发 -> TK-0234', state: 'done', dotColor: 'green' },
        { title: '工单流转中', time: '2026-03-15 16:15:00', state: 'on', dotColor: 'blue' },
        { title: '服务交付完成', time: '等待工单系统回执', state: 'wait', dotColor: 'gray' },
        { title: '服务评价', time: '交付完成后可评价', state: 'wait', dotColor: 'gray' }
      ]
    }
  },
  methods: {
    getDemoContainer() {
      return document.querySelector('.app-main__content') || document.body;
    },
    getDrawerContainer() {
      return document.querySelector('.app-overlay') || document.body;
    },
    goBack() {
      const currentPath = this.$route.path
      if (currentPath.startsWith('/portal/order')) {
        this.$router.push('/portal/order/list')
      } else {
        this.$router.push('/workorder/order/list')
      }
    },
    goToWorkorder() {
      this.$router.push({ path: '/workorder/detail', query: { workorderId: this.workorderInfo.id } })
    },
    cancelOrder() {
      Modal.confirm({
        getContainer: this.getDemoContainer,
        title: '取消订单',
        content: '确定要取消该订单吗？取消后无法恢复。',
        okText: '确定',
        cancelText: '返回',
        okType: 'danger',
        onOk: () => {
          message.success('订单取消成功')
        }
      })
    },
    getServiceTypeClass(type) {
      const map = {
        '数字应用': 'digital',
        '安全服务': 'security',
        '能力组件': 'component',
        '基础服务': 'basic'
      }
      return map[type] || ''
    },
    getStatusKey(status) {
      const map = {
        '工单流转中': 'processing',
        '已完成': 'done',
        '已评价': 'evaluated',
        '已驳回': 'rejected',
        '已取消': 'cancelled'
      }
      return map[status] || 'default'
    }
  }
}
</script>

<style scoped>
.order-detail-page {
  padding: 4px 0;
}

.order-detail-page__body {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 14px;
  margin-top: 14px;
}

.order-detail-page__main,
.order-detail-page__side {
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
  color: #86909C;
  font-size: 13px;
  line-height: 1.6;
}

.order-desc :deep(.ant-descriptions-item-label) {
  color: #86909C;
  font-size: 13px;
  width: 88px;
}

.order-desc :deep(.ant-descriptions-item-content) {
  color: rgba(0, 0, 0, 0.85);
  font-size: 13px;
}

.order-timeline {
  padding-top: 4px;
}

.tl-title {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 2px;
}

.tl-title--done { color: #4E5969; }
.tl-title--on { color: #165DFF; font-weight: 600; }
.tl-title--wait { color: #C9CDD4; }

.tl-time {
  font-size: 11px;
  color: #86909C;
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
  letter-spacing: -0.2px;
}

.review-result {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 4px 0;
}

.review-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.review-label {
  color: #86909C;
  font-size: 13px;
  width: 80px;
  flex-shrink: 0;
  white-space: nowrap;
}

.review-desc {
  color: rgba(0, 0, 0, 0.85);
  font-size: 13px;
  flex: 1;
  word-break: break-all;
  min-width: 0;
}

.review-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px 0;
  color: #C9CDD4;
  font-size: 13px;
}

.review-empty__icon {
  font-size: 32px;
}

.workorder-chip {
  border: 1px solid rgba(245, 158, 11, 0.30);
  border-left: 3px solid #F59E0B;
  border-radius: 8px;
  padding: 12px;
  background: rgba(245, 158, 11, 0.06);
}

.workorder-chip__id {
  margin-bottom: 6px;
}

.workorder-chip__id .cell-mono {
  color: #F59E0B;
  font-weight: 600;
  font-size: 12px;
}

.workorder-chip__title {
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 5px;
  line-height: 1.5;
}

.workorder-chip__owner {
  font-size: 11px;
  color: #86909C;
}

.action-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@media (max-width: 1100px) {
  .order-detail-page__body {
    grid-template-columns: 1fr;
  }
}
</style>
