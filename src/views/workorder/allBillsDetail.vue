<template>
  <div class="bills-detail-page">
    <PageHeader
      :title="`工单详情 · ${ticket.code}`"
      :description="ticket.title"
    >
      <template #actions>
        <a-button @click="goBack">
          <template #icon><ArrowLeftOutlined /></template>
          返回列表
        </a-button>
      </template>
    </PageHeader>

    <div class="bills-detail-page__body">
      <div class="bills-detail-page__main">
        <CloudCard class="bills-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">基本信息</span>
            <StatusDot :type="getStatusKey(ticket.status)" :text="ticket.status" />
          </div>
          <a-descriptions :column="2" size="small" class="info-desc">
            <a-descriptions-item label="工单编号">
              <span class="cell-mono">{{ ticket.code }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="工单类型">{{ ticket.type }}</a-descriptions-item>
            <a-descriptions-item label="申请人">{{ ticket.applicant }}</a-descriptions-item>
            <a-descriptions-item label="所属部门">{{ ticket.department }}</a-descriptions-item>
            <a-descriptions-item label="联系方式">
              <span class="cell-mono">{{ ticket.contact }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="当前处理人">{{ ticket.handler }}</a-descriptions-item>
            <a-descriptions-item label="申请时间">
              <span class="cell-mono">{{ ticket.createTime }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="更新时间">
              <span class="cell-mono">{{ ticket.updateTime }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="工单状态" :span="2">{{ ticket.status }}</a-descriptions-item>
          </a-descriptions>
        </CloudCard>

        <CloudCard class="bills-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">工单描述</span>
          </div>
          <div class="ticket-description">{{ ticket.description }}</div>
        </CloudCard>
      </div>

      <div class="bills-detail-page__side">
        <CloudCard class="bills-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">处理状态</span>
          </div>
          <a-timeline class="process-timeline">
            <a-timeline-item
              v-for="(step, idx) in processSteps"
              :key="idx"
              :color="getTimelineColor(step.status)"
            >
              <div :class="['tl-title', `tl-title--${step.status}`]">{{ step.title }}</div>
              <div class="tl-time">{{ step.time || '-' }}</div>
              <div class="tl-handler">{{ step.handler || '-' }}</div>
            </a-timeline-item>
          </a-timeline>
        </CloudCard>

        <CloudCard class="bills-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">处理记录</span>
          </div>
          <div class="record-list">
            <div v-for="(record, idx) in processRecords" :key="idx" class="record-item">
              <div class="record-time cell-mono">{{ record.time }}</div>
              <div class="record-content">{{ record.content }}</div>
              <div class="record-handler">- {{ record.handler }}</div>
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
  name: 'AllBillsDetail',
  components: {
    PageHeader, CloudCard, StatusDot,
    ArrowLeftOutlined
  },
  data() {
    return {
      ticket: {
        id: 1,
        code: 'WO20260402001',
        title: '网络服务申请',
        type: '业务申请',
        createTime: '2026-04-02 10:00:00',
        updateTime: '2026-04-02 14:30:00',
        applicant: '张三',
        department: '技术部',
        contact: '13800138000',
        status: '处理中',
        priority: '普通',
        handler: '李四',
        description: '因业务需求，需要申请网络服务，用于公司内部系统访问。请相关部门尽快处理。'
      },
      processSteps: [
        { title: '提交申请', time: '2026-04-02 10:00:00', handler: '张三', status: 'completed' },
        { title: '部门审批', time: '2026-04-02 11:00:00', handler: '李四', status: 'completed' },
        { title: '网络服务配置', time: '2026-04-02 14:00:00', handler: '王五', status: 'processing' },
        { title: '服务交付', time: '', handler: '', status: 'pending' }
      ],
      processRecords: [
        { time: '2026-04-02 10:00:00', content: '张三提交了网络服务申请工单', handler: '张三' },
        { time: '2026-04-02 11:00:00', content: '李四审批通过了网络服务申请工单', handler: '李四' },
        { time: '2026-04-02 14:00:00', content: '王五开始配置网络服务', handler: '王五' }
      ]
    }
  },
  created() {
    const ticketId = this.$route.query.workorderId
    if (ticketId) {
      this.loadTicketDetail(ticketId)
    }
  },
  methods: {
    loadTicketDetail() {},
    goBack() {
      this.$router.push('/workorder/myBills/allBills')
    },
    getStatusKey(status) {
      const map = { '待处理': 'processing', '处理中': 'processing', '已完成': 'done', '已关闭': 'cancelled' }
      return map[status] || 'default'
    },
    getTimelineColor(status) {
      const map = { completed: 'green', processing: 'blue', pending: 'gray' }
      return map[status] || 'gray'
    }
  }
}
</script>

<style scoped>
.bills-detail-page {
  padding: 4px 0;
}

.bills-detail-page__body {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 14px;
  margin-top: 14px;
}

.bills-detail-page__main,
.bills-detail-page__side {
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

.info-desc :deep(.ant-descriptions-item-label) {
  color: #86909C;
  font-size: 13px;
  width: 88px;
}

.info-desc :deep(.ant-descriptions-item-content) {
  color: rgba(0, 0, 0, 0.85);
  font-size: 13px;
}

.ticket-description {
  font-size: 13px;
  line-height: 1.8;
  color: rgba(0, 0, 0, 0.85);
  white-space: pre-wrap;
  padding: 12px 14px;
  background: #F7F8FA;
  border-radius: 8px;
  min-height: 80px;
}

.process-timeline {
  padding-top: 4px;
}

.tl-title {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 2px;
}

.tl-title--completed { color: #4E5969; }
.tl-title--processing { color: #165DFF; font-weight: 600; }
.tl-title--pending { color: #C9CDD4; }

.tl-time {
  font-size: 11px;
  color: #86909C;
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
  letter-spacing: -0.2px;
  margin-bottom: 2px;
}

.tl-handler {
  font-size: 11px;
  color: #4E5969;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.record-item {
  padding: 10px 12px;
  background: #F7F8FA;
  border-radius: 6px;
  border-left: 3px solid #165DFF;
}

.record-time {
  font-size: 11px;
  color: #86909C;
  margin-bottom: 4px;
}

.record-content {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 1.5;
  margin-bottom: 4px;
}

.record-handler {
  font-size: 11px;
  color: #4E5969;
  text-align: right;
}

@media (max-width: 1100px) {
  .bills-detail-page__body {
    grid-template-columns: 1fr;
  }
}
</style>
