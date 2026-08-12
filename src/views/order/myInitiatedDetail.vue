<template>
  <div class="initiated-detail-page">
    <PageHeader
      title="我发起的详情 · 统一身份认证组件"
      description="查看已发起订单的详情、流程进度并进行满意度评价"
    >
      <template #actions>
        <a-button @click="goBack">
          <template #icon><ArrowLeftOutlined /></template>
          返回列表
        </a-button>
      </template>
    </PageHeader>

    <div class="initiated-detail-page__body">
      <div class="initiated-detail-page__main">
        <CloudCard class="initiated-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">订单基本信息</span>
            <StatusDot :type="reviewInfo.hasReviewed ? 'evaluated' : 'done'" :text="reviewInfo.hasReviewed ? '已评价' : '已完成'" />
          </div>
          <a-descriptions :column="2" size="small" class="order-desc">
            <a-descriptions-item label="服务名称">统一身份认证组件</a-descriptions-item>
            <a-descriptions-item label="服务规格">支持OAuth2.0/SAML，含SSO单点登录</a-descriptions-item>
            <a-descriptions-item label="服务类型">
              <span class="service-type-tag service-type-tag--component">能力组件</span>
            </a-descriptions-item>
            <a-descriptions-item label="申请人">张三</a-descriptions-item>
            <a-descriptions-item label="申请机构">北京市海淀区数字经济发展局</a-descriptions-item>
            <a-descriptions-item label="申请时间">
              <span class="cell-mono">2026-03-10 09:15:00</span>
            </a-descriptions-item>
            <a-descriptions-item label="申请备注" :span="2">
              <span class="muted">本次申请统一身份认证组件，需支持OAuth2.0/SAML协议，含SSO单点登录功能，请安排团队完成部署与联调。</span>
            </a-descriptions-item>
          </a-descriptions>
        </CloudCard>

        <CloudCard class="initiated-detail-page__card">
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

        <CloudCard class="initiated-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">满意度评价</span>
            <a-button
              type="primary"
              size="small"
              :disabled="!canReview"
              @click="openReviewDialog"
            >
              <template #icon><PlusOutlined /></template>
              新增满意度评价
            </a-button>
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
            <span>订单尚未评价，点击右上角按钮进行评价</span>
          </div>
        </CloudCard>
      </div>

      <div class="initiated-detail-page__side">
        <CloudCard class="initiated-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">关联工单</span>
          </div>
          <div class="workorder-chip">
            <div class="workorder-chip__id">
              <span class="cell-mono">TK-0235</span>
            </div>
            <div class="workorder-chip__title">统一身份认证组件部署交付</div>
            <div class="workorder-chip__owner">负责人：王五（安全团队）</div>
          </div>
          <a-button block style="margin-top: 12px" @click="goToWorkorder">
            <template #icon><EyeOutlined /></template>
            查看工单
          </a-button>
        </CloudCard>

        <CloudCard class="initiated-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">订单操作</span>
          </div>
          <div class="action-list">
            <a-button block danger @click="cancelOrder">
              <template #icon><CloseCircleOutlined /></template>
              取消订单
            </a-button>
            <a-button block @click="forceCloseOrder">
              <template #icon><StopOutlined /></template>
              强制关单
            </a-button>
          </div>
        </CloudCard>
      </div>
    </div>

    <a-modal
      v-model:open="reviewDialogVisible"
      title="新增满意度评价"
      width="520px"
      :mask-closable="false"
      @ok="submitReview"
      @cancel="reviewDialogVisible = false"
    >
      <a-form ref="reviewFormRef" :model="reviewForm" :rules="reviewRules" layout="vertical" class="review-form">
        <a-form-item label="满意度评分" name="score">
          <a-rate v-model:value="reviewForm.score" />
        </a-form-item>
        <a-form-item label="评价描述" name="description">
          <a-textarea
            v-model:value="reviewForm.description"
            :rows="4"
            placeholder="请输入评价描述（非必填）"
            :maxlength="500"
            show-count
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import {
  ArrowLeftOutlined, EyeOutlined, PlusOutlined, FrownOutlined,
  CloseCircleOutlined, StopOutlined
} from '@ant-design/icons-vue'
import { Modal, message } from 'ant-design-vue'
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import StatusDot from '@/components/cloud/StatusDot.vue'

export default {
  name: 'OrderMyInitiatedDetail',
  components: {
    PageHeader, CloudCard, StatusDot,
    ArrowLeftOutlined, EyeOutlined, PlusOutlined, FrownOutlined,
    CloseCircleOutlined, StopOutlined
  },
  data() {
    return {
      source: 'initiated',
      orderStatus: '已完成',
      reviewInfo: {
        hasReviewed: false,
        score: 0,
        description: '',
        reviewTime: ''
      },
      reviewDialogVisible: false,
      reviewForm: {
        score: 0,
        description: ''
      },
      reviewRules: {
        score: [
          { required: true, message: '请选择满意度评分', trigger: 'change', type: 'number', min: 1 }
        ]
      },
      timeline: [
        { title: '提交申请', time: '2026-03-10 09:15:00 · 张三', state: 'done', dotColor: 'green' },
        { title: '系统派发工单', time: '2026-03-10 10:30:00 · 自动派发 -> TK-0235', state: 'done', dotColor: 'green' },
        { title: '工单流转中', time: '2026-03-10 10:35:00', state: 'done', dotColor: 'green' },
        { title: '服务交付完成', time: '2026-03-12 16:20:00 · 收到工单系统交付完成回执', state: 'done', dotColor: 'green' },
        { title: '服务评价', time: '可新增满意度评价', state: 'on', dotColor: 'blue' },
        { title: '订单驳回', time: '工单驳回后记录驳回时间', state: 'wait', dotColor: 'gray' },
        { title: '订单取消', time: '用户取消订单后记录取消时间', state: 'wait', dotColor: 'gray' }
      ]
    }
  },
  computed: {
    canReview() {
      return this.source === 'initiated' && this.orderStatus === '已完成' && !this.reviewInfo.hasReviewed
    }
  },
  created() {
    if (this.$route.query.source) {
      this.source = this.$route.query.source
    }
  },
  methods: {
    goBack() {
      this.$router.push('/workorder/order/myInitiated')
    },
    goToWorkorder() {
      this.$router.push({ path: '/workorder/detail', query: { workorderId: 'TK-0235' } })
    },
    openReviewDialog() {
      this.reviewForm = { score: 0, description: '' }
      this.reviewDialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.reviewFormRef) {
          this.$refs.reviewFormRef.clearValidate()
        }
      })
    },
    submitReview() {
      this.$refs.reviewFormRef.validate().then(() => {
        const now = new Date()
        const pad = n => (n < 10 ? '0' + n : '' + n)
        const reviewTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
        this.reviewInfo = {
          hasReviewed: true,
          score: this.reviewForm.score,
          description: this.reviewForm.description || '--',
          reviewTime
        }
        this.reviewDialogVisible = false
        message.success('评价提交成功')
      }).catch(() => {})
    },
    forceCloseOrder() {
      Modal.confirm({
        title: '强制关单',
        content: '确定要强制关单吗？',
        okText: '确定',
        cancelText: '取消',
        okType: 'warning',
        onOk: () => {
          message.success('强制关单成功')
        }
      })
    },
    cancelOrder() {
      Modal.confirm({
        title: '取消订单',
        content: '确定要取消订单吗？',
        okText: '确定',
        cancelText: '取消',
        okType: 'danger',
        onOk: () => {
          message.success('订单取消成功')
        }
      })
    }
  }
}
</script>

<style scoped>
.initiated-detail-page {
  padding: 4px 0;
}

.initiated-detail-page__body {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 14px;
  margin-top: 14px;
}

.initiated-detail-page__main,
.initiated-detail-page__side {
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
  border: 1px solid rgba(22, 163, 74, 0.30);
  border-left: 3px solid #16A34A;
  border-radius: 8px;
  padding: 12px;
  background: rgba(22, 163, 74, 0.06);
}

.workorder-chip__id {
  margin-bottom: 6px;
}

.workorder-chip__id .cell-mono {
  color: #16A34A;
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

.review-form {
  padding-top: 4px;
}

@media (max-width: 1100px) {
  .initiated-detail-page__body {
    grid-template-columns: 1fr;
  }
}
</style>
