<template>
  <div class="workorder-detail-page">
    <PageHeader
      :title="`我已审批详情 · ${ticket.code}`"
      description="查看已审批工单的详细信息、处理结果与处理记录"
    >
      <template #actions>
        <a-button @click="goBack">
          <template #icon><ArrowLeftOutlined /></template>
          返回列表
        </a-button>
      </template>
    </PageHeader>

    <div class="workorder-detail-page__body">
      <div class="workorder-detail-page__main">
        <CloudCard class="workorder-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">基本信息</span>
            <StatusDot :type="getStatusKey(ticket.status)" :text="ticket.status" />
          </div>
          <a-descriptions :column="2" size="small" class="ticket-desc">
            <a-descriptions-item label="工单编号">
              <span class="cell-mono">{{ ticket.code }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="工单类型">{{ ticket.type }}</a-descriptions-item>
            <a-descriptions-item label="申请人">{{ ticket.applicant }}</a-descriptions-item>
            <a-descriptions-item label="所属部门">{{ ticket.department }}</a-descriptions-item>
            <a-descriptions-item label="联系方式">
              <span class="cell-mono">{{ ticket.contact }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="处理人">{{ ticket.handler }}</a-descriptions-item>
            <a-descriptions-item label="申请时间">
              <span class="cell-mono">{{ ticket.createTime }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="完成时间">
              <span class="cell-mono">{{ ticket.finishTime }}</span>
            </a-descriptions-item>
          </a-descriptions>
        </CloudCard>

        <CloudCard class="workorder-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">工单描述</span>
          </div>
          <div class="ticket-description">{{ ticket.description }}</div>
        </CloudCard>

        <CloudCard class="workorder-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">处理结果</span>
          </div>
          <div class="result-list">
            <div class="result-row">
              <span class="result-label">处理结果</span>
              <span :class="['result-pill', `result-pill--${processResult.type}`]">{{ processResult.text }}</span>
            </div>
            <div class="result-row">
              <span class="result-label">处理意见</span>
              <span class="result-value">{{ processResult.comment }}</span>
            </div>
            <div v-if="ticket.status === '已完成'" class="result-row result-row--rating">
              <span class="result-label">满意度评价</span>
              <div class="satisfaction-block">
                <a-rate v-model:value="satisfaction.score" disabled />
                <span class="satisfaction-comment">{{ satisfaction.comment }}</span>
              </div>
            </div>
          </div>
        </CloudCard>
      </div>

      <div class="workorder-detail-page__side">
        <CloudCard class="workorder-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">处理状态</span>
          </div>
          <a-timeline class="process-timeline">
            <a-timeline-item
              v-for="(step, idx) in processSteps"
              :key="idx"
              :color="getStepColor(step.status)"
            >
              <div :class="['tl-title', `tl-title--${step.status}`]">{{ step.title }}</div>
              <div class="tl-time">{{ step.time || '待处理' }}</div>
              <div class="tl-handler">处理人：{{ step.handler || '--' }}</div>
            </a-timeline-item>
          </a-timeline>
        </CloudCard>

        <CloudCard class="workorder-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">处理记录</span>
          </div>
          <div class="record-list">
            <div v-for="(record, idx) in processRecords" :key="idx" class="record-item">
              <div class="record-time">{{ record.time }}</div>
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
  name: 'MyApprovedDetail',
  components: {
    PageHeader, CloudCard, StatusDot,
    ArrowLeftOutlined
  },
  data() {
    return {
      ticket: {
        id: 1,
        code: 'WO20260401001',
        title: '系统权限申请',
        type: '业务申请',
        createTime: '2026-04-01 14:20:00',
        finishTime: '2026-04-01 16:30:00',
        applicant: '王五',
        department: '技术部',
        contact: '13800138001',
        status: '已完成',
        handler: '当前用户',
        description: '因工作需要，申请开通系统管理员权限，用于日常系统维护工作。'
      },
      processResult: {
        type: 'success',
        text: '通过',
        comment: '已核实申请人身份，符合权限申请条件，审批通过。'
      },
      satisfaction: {
        score: 5,
        comment: '处理速度很快，服务态度很好！'
      },
      processSteps: [
        { title: '提交申请', time: '2026-04-01 14:20:00', handler: '王五', status: 'completed' },
        { title: '部门审批', time: '2026-04-01 15:00:00', handler: '李四', status: 'completed' },
        { title: '权限配置', time: '2026-04-01 16:00:00', handler: '当前用户', status: 'completed' },
        { title: '服务交付', time: '2026-04-01 16:30:00', handler: '当前用户', status: 'completed' }
      ],
      processRecords: [
        { time: '2026-04-01 14:20:00', content: '王五提交了系统权限申请工单', handler: '王五' },
        { time: '2026-04-01 15:00:00', content: '李四审批通过了工单', handler: '李四' },
        { time: '2026-04-01 16:00:00', content: '当前用户完成了权限配置', handler: '当前用户' },
        { time: '2026-04-01 16:30:00', content: '工单已完成，申请人已确认', handler: '当前用户' }
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
    loadTicketDetail() {
      setTimeout(() => {}, 300)
    },
    goBack() {
      this.$router.go(-1)
    },
    getStepColor(status) {
      const map = {
        completed: 'green',
        processing: 'blue',
        pending: 'gray'
      }
      return map[status] || 'gray'
    },
    getStatusKey(status) {
      const map = {
        '待处理': 'processing',
        '处理中': 'processing',
        '已完成': 'done',
        '已关闭': 'cancelled'
      }
      return map[status] || 'default'
    }
  }
}
</script>

<style scoped>
.workorder-detail-page {
  padding: 4px 0;
}

.workorder-detail-page__body {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 14px;
  margin-top: 14px;
}

.workorder-detail-page__main,
.workorder-detail-page__side {
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
  color: rgba(0, 0,0, 0.85);
}

.cell-mono {
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
  font-variant-numeric: tabular-nums;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.85);
  letter-spacing: -0.2px;
}

.ticket-desc :deep(.ant-descriptions-item-label) {
  color: #86909C;
  font-size: 13px;
  width: 88px;
}

.ticket-desc :deep(.ant-descriptions-item-content) {
  color: rgba(0, 0, 0, 0.85);
  font-size: 13px;
}

.ticket-description {
  font-size: 13px;
  line-height: 1.7;
  color: rgba(0, 0, 0, 0.85);
  white-space: pre-wrap;
  padding: 12px 14px;
  background: #F7F8FA;
  border-radius: 6px;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 10px 12px;
  background: #F7F8FA;
  border-radius: 6px;
}

.result-row--rating {
  align-items: center;
}

.result-label {
  color: #86909C;
  font-size: 13px;
  width: 80px;
  flex-shrink: 0;
  white-space: nowrap;
}

.result-value {
  color: rgba(0, 0, 0, 0.85);
  font-size: 13px;
  flex: 1;
  line-height: 1.6;
  word-break: break-all;
}

.result-pill {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  border-radius: 11px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
}

.result-pill--success { background: rgba(22, 163, 74, 0.10); color: #16A34A; }
.result-pill--danger { background: rgba(239, 68, 68, 0.10); color: #EF4444; }
.result-pill--warning { background: rgba(245, 158, 11, 0.10); color: #F59E0B; }

.satisfaction-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.satisfaction-comment {
  font-size: 12px;
  color: #86909C;
  font-style: italic;
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
  color: #86909C;
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
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
  letter-spacing: -0.2px;
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
  color: #86909C;
  text-align: right;
}

@media (max-width: 1100px) {
  .workorder-detail-page__body {
    grid-template-columns: 1fr;
  }
}
</style>
