<template>
  <div class="todo-detail-page">
    <PageHeader
      title="待办详情 · 等保三级合规评估"
      description="处理待办订单，查看订单基础信息、流程进度并提交处理意见"
    >
      <template #actions>
        <a-button @click="goBack">
          <template #icon><ArrowLeftOutlined /></template>
          返回列表
        </a-button>
      </template>
    </PageHeader>

    <div class="todo-detail-page__body">
      <div class="todo-detail-page__main">
        <CloudCard class="todo-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">订单基本信息</span>
            <StatusDot type="processing" text="工单流转中" />
          </div>
          <a-descriptions :column="2" size="small" class="order-desc">
            <a-descriptions-item label="服务名称">等保三级合规评估</a-descriptions-item>
            <a-descriptions-item label="服务规格">差距分析 + 渗透测试 + 整改报告</a-descriptions-item>
            <a-descriptions-item label="服务类型">
              <span class="service-type-tag service-type-tag--security">安全服务</span>
            </a-descriptions-item>
            <a-descriptions-item label="申请人">张三</a-descriptions-item>
            <a-descriptions-item label="申请机构">北京市海淀区数字经济发展局</a-descriptions-item>
            <a-descriptions-item label="申请时间">
              <span class="cell-mono">2026-03-15 14:32:00</span>
            </a-descriptions-item>
            <a-descriptions-item label="服务周期">1年（2026-03 至 2027-03）</a-descriptions-item>
            <a-descriptions-item label="审批人">
              <span class="person-chip">
                <a-avatar size="small" class="person-chip__av person-chip__av--blue">李</a-avatar>
                李四 · IT管理员
              </span>
            </a-descriptions-item>
            <a-descriptions-item label="审批时间">
              <span class="cell-mono">2026-03-15 16:08:00</span>
            </a-descriptions-item>
            <a-descriptions-item label="申请备注" :span="2">
              <span class="muted">本次申请等保三级评估，包含差距分析、渗透测试和整改报告，请安排专业团队对接。</span>
            </a-descriptions-item>
          </a-descriptions>
        </CloudCard>

        <CloudCard class="todo-detail-page__card">
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
      </div>

      <div class="todo-detail-page__side">
        <CloudCard class="todo-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">关联工单</span>
          </div>
          <div class="workorder-chip">
            <div class="workorder-chip__id">
              <span class="cell-mono">TK-0234</span>
            </div>
            <div class="workorder-chip__title">等保三级合规评估服务交付</div>
            <div class="workorder-chip__desc">已与申请人确认评估范围，覆盖3个核心系统，本周五启动现场评估。</div>
            <div class="workorder-chip__owner">
              <a-avatar size="small" class="person-chip__av person-chip__av--amber">王</a-avatar>
              负责人：王五（安全团队）
            </div>
          </div>
          <a-button block style="margin-top: 12px" @click="goToWorkorder">
            <template #icon><EyeOutlined /></template>
            查看工单
          </a-button>
        </CloudCard>

        <CloudCard class="todo-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">处理操作</span>
          </div>
          <a-form :model="processForm" layout="vertical" class="process-form">
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
              <div class="form-actions">
                <a-button type="primary" @click="submitProcess">
                  <template #icon><CheckOutlined /></template>
                  提交处理
                </a-button>
                <a-button @click="resetProcess">重置</a-button>
              </div>
            </a-form-item>
          </a-form>
        </CloudCard>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ArrowLeftOutlined, EyeOutlined, CheckOutlined
} from '@ant-design/icons-vue'
import { Modal, message } from 'ant-design-vue'
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import StatusDot from '@/components/cloud/StatusDot.vue'

export default {
  name: 'OrderMyTodoDetail',
  components: {
    PageHeader, CloudCard, StatusDot,
    ArrowLeftOutlined, EyeOutlined, CheckOutlined
  },
  data() {
    return {
      processForm: {
        result: 'pass',
        comment: '',
        transferTo: undefined
      },
      timeline: [
        { title: '提交申请', time: '2026-03-15 14:32:00 · 张三', state: 'done', dotColor: 'green' },
        { title: '系统派发工单', time: '2026-03-15 16:10:00 · 自动派发 -> TK-0234', state: 'done', dotColor: 'green' },
        { title: '工单流转中', time: '2026-03-15 16:15:00', state: 'on', dotColor: 'blue' },
        { title: '服务交付完成', time: '等待工单系统回执', state: 'wait', dotColor: 'gray' },
        { title: '服务评价', time: '交付完成后可评价', state: 'wait', dotColor: 'gray' },
        { title: '订单驳回', time: '工单驳回后记录驳回时间', state: 'wait', dotColor: 'gray' },
        { title: '订单取消', time: '用户取消订单后记录取消时间', state: 'wait', dotColor: 'gray' }
      ]
    }
  },
  methods: {
    goBack() {
      this.$router.push('/workorder/order/myTodo')
    },
    goToWorkorder() {
      this.$router.push({ path: '/workorder/detail', query: { workorderId: 'TK-0234' } })
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
      const resultText = {
        pass: '通过',
        reject: '驳回',
        transfer: '转交'
      }[this.processForm.result]
      Modal.confirm({
        title: '确认提交',
        content: `确定要${resultText}该订单吗？`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          setTimeout(() => {
            message.success('处理成功')
            this.resetProcess()
          }, 300)
        }
      })
    },
    resetProcess() {
      this.processForm = {
        result: 'pass',
        comment: '',
        transferTo: undefined
      }
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

.person-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.85);
}

.person-chip__av {
  font-size: 11px;
  font-weight: 600;
}

.person-chip__av--blue {
  background: #E8F3FF;
  color: #165DFF;
}

.person-chip__av--amber {
  background: rgba(245, 158, 11, 0.12);
  color: #F59E0B;
}

.person-chip__av--green {
  background: rgba(22, 163, 74, 0.12);
  color: #16A34A;
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
  margin-bottom: 6px;
  line-height: 1.5;
}

.workorder-chip__desc {
  font-size: 12px;
  color: #4E5969;
  line-height: 1.6;
  margin-bottom: 8px;
}

.workorder-chip__owner {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #86909C;
}

.process-form {
  padding-top: 4px;
}

.form-actions {
  display: flex;
  gap: 8px;
}

@media (max-width: 1100px) {
  .todo-detail-page__body {
    grid-template-columns: 1fr;
  }
}
</style>
