<template>
  <div class="todo-detail-page">
    <PageHeader
      :title="`工单详情 · ${ticket.code}`"
      :description="ticket.title"
    >
      <template #actions>
        <a-button @click="goBack">
          <template #icon><ArrowLeftOutlined /></template>
          返回列表
        </a-button>
        <a-button type="primary" @click="handleProcess">
          <template #icon><CheckOutlined /></template>
          处理
        </a-button>
      </template>
    </PageHeader>

    <div class="todo-detail-page__body">
      <div class="todo-detail-page__main">
        <CloudCard class="todo-detail-page__card">
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
            <a-descriptions-item label="紧急程度">
              <span :class="['priority-pill', `priority-pill--${getPriorityKey(ticket.priority)}`]">{{ ticket.priority }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="申请时间">
              <span class="cell-mono">{{ ticket.createTime }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="工单状态">{{ ticket.status }}</a-descriptions-item>
          </a-descriptions>
        </CloudCard>

        <CloudCard class="todo-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">工单描述</span>
          </div>
          <div class="ticket-description">{{ ticket.description }}</div>
        </CloudCard>

        <CloudCard ref="processCard" class="todo-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">处理操作</span>
          </div>
          <a-form layout="vertical" :model="processForm" class="process-form">
            <a-form-item label="处理结果">
              <a-radio-group v-model:value="processForm.result">
                <a-radio value="pass">通过</a-radio>
                <a-radio value="reject">驳回</a-radio>
                <a-radio value="transfer">转交</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="处理意见">
              <a-textarea
                v-model:value="processForm.comment"
                :rows="4"
                placeholder="请输入处理意见"
                :maxlength="500"
                show-count
              />
            </a-form-item>
            <a-form-item v-if="processForm.result === 'transfer'" label="转交人">
              <a-select v-model:value="processForm.transferTo" placeholder="请选择转交人">
                <a-select-option value="wangwu">王五</a-select-option>
                <a-select-option value="zhaoliu">赵六</a-select-option>
                <a-select-option value="sunqi">孙七</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-space>
                <a-button type="primary" @click="submitProcess">
                  <template #icon><CheckOutlined /></template>
                  提交处理
                </a-button>
                <a-button @click="resetProcess">重置</a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </CloudCard>
      </div>

      <div class="todo-detail-page__side">
        <CloudCard class="todo-detail-page__card">
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
              <div class="tl-time">{{ step.time || '—' }}</div>
              <div class="tl-handler">{{ step.handler || '—' }}</div>
            </a-timeline-item>
          </a-timeline>
        </CloudCard>

        <CloudCard class="todo-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">处理记录</span>
          </div>
          <div class="record-list">
            <div v-for="(record, idx) in processRecords" :key="idx" class="record-item">
              <div class="record-time cell-mono">{{ record.time }}</div>
              <div class="record-content">{{ record.content }}</div>
              <div class="record-handler">— {{ record.handler }}</div>
            </div>
          </div>
        </CloudCard>
      </div>
    </div>
  </div>
</template>

<script>
import { ArrowLeftOutlined, CheckOutlined } from '@ant-design/icons-vue'
import { Modal, message } from 'ant-design-vue'
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import StatusDot from '@/components/cloud/StatusDot.vue'

export default {
  name: 'MyTodoDetail',
  components: {
    PageHeader, CloudCard, StatusDot,
    ArrowLeftOutlined, CheckOutlined
  },
  data() {
    return {
      ticket: {
        id: 1,
        code: 'WO20260402001',
        title: '网络服务申请',
        type: '业务申请',
        createTime: '2026-04-02 10:00:00',
        applicant: '张三',
        department: '技术部',
        contact: '13800138000',
        status: '待处理',
        priority: '普通',
        description: '因业务需求，需要申请网络服务，用于公司内部系统访问。请相关部门尽快处理。'
      },
      processForm: {
        result: 'pass',
        comment: '',
        transferTo: undefined
      },
      processSteps: [
        { title: '提交申请', time: '2026-04-02 10:00:00', handler: '张三', status: 'completed' },
        { title: '部门审批', time: '', handler: '当前用户', status: 'processing' },
        { title: '网络服务配置', time: '', handler: '', status: 'pending' },
        { title: '服务交付', time: '', handler: '', status: 'pending' }
      ],
      processRecords: [
        { time: '2026-04-02 10:00:00', content: '张三提交了网络服务申请工单', handler: '张三' }
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
      this.$router.push('/workorder/myBills/myTodo')
    },
    handleProcess() {
      const el = this.$refs.processCard && this.$refs.processCard.$el
      if (el && el.scrollIntoView) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    },
    submitProcess() {
      if (!this.processForm.comment.trim()) {
        message.warning('请输入处理意见')
        return
      }
      if (this.processForm.result === 'transfer' && !this.processForm.transferTo) {
        message.warning('请选择转交人')
        return
      }
      const resultText = { pass: '通过', reject: '驳回', transfer: '转交' }[this.processForm.result]
      Modal.confirm({
        title: '确认提交',
        content: `确定要${resultText}该工单吗？`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.processRecords.unshift({
            time: this.formatNow(),
            content: `当前用户${resultText}了工单，处理意见：${this.processForm.comment}`,
            handler: '当前用户'
          })
          this.processSteps[1].status = 'completed'
          this.processSteps[1].time = this.formatNow()
          this.processSteps[2].status = 'processing'
          message.success('处理成功')
          this.resetProcess()
        }
      })
    },
    resetProcess() {
      this.processForm = { result: 'pass', comment: '', transferTo: undefined }
    },
    formatNow() {
      const d = new Date()
      const pad = (n) => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    },
    getStatusKey(status) {
      const map = { '待处理': 'processing', '处理中': 'processing', '已完成': 'done', '已关闭': 'cancelled' }
      return map[status] || 'default'
    },
    getPriorityKey(priority) {
      const map = { '紧急': 'danger', '高': 'danger', '普通': 'default', '低': 'default' }
      return map[priority] || 'default'
    },
    getTimelineColor(status) {
      const map = { completed: 'green', processing: 'blue', pending: 'gray' }
      return map[status] || 'gray'
    }
  }
}
</script>

<style scoped>
.todo-detail-page {
  padding: 4px 0;
}

.todo-detail-page__body {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 14px;
  margin-top: 14px;
}

.todo-detail-page__main,
.todo-detail-page__side {
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

.priority-pill {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  border-radius: 11px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
}

.priority-pill--danger { background: rgba(239, 68, 68, 0.10); color: #EF4444; }
.priority-pill--default { background: #F2F3F5; color: #4E5969; }

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
  .todo-detail-page__body {
    grid-template-columns: 1fr;
  }
}
</style>
