<template>
  <div class="processed-detail-page">
    <PageHeader
      title="已办详情 · 云主机（ECS）"
      description="查看已处理订单的详情、流程进度及处理记录"
    >
      <template #actions>
        <a-button @click="goBack">
          <template #icon><ArrowLeftOutlined /></template>
          返回列表
        </a-button>
      </template>
    </PageHeader>

    <div class="processed-detail-page__body">
      <div class="processed-detail-page__main">
        <CloudCard class="processed-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">订单基本信息</span>
            <StatusDot type="done" text="已完成" />
          </div>
          <a-descriptions :column="2" size="small" class="order-desc">
            <a-descriptions-item label="服务名称">云主机（ECS）</a-descriptions-item>
            <a-descriptions-item label="服务规格">2核4G，200G SSD</a-descriptions-item>
            <a-descriptions-item label="服务类型">
              <span class="service-type-tag service-type-tag--basic">基础服务</span>
            </a-descriptions-item>
            <a-descriptions-item label="申请人">李四</a-descriptions-item>
            <a-descriptions-item label="申请机构">北京市朝阳区智慧城市建设局</a-descriptions-item>
            <a-descriptions-item label="申请时间">
              <span class="cell-mono">2026-03-14 10:20:00</span>
            </a-descriptions-item>
            <a-descriptions-item label="服务周期">1年（2026-03 至 2027-03）</a-descriptions-item>
            <a-descriptions-item label="审批人">
              <span class="person-chip">
                <a-avatar size="small" class="person-chip__av person-chip__av--blue">张</a-avatar>
                张三 · 审批人
              </span>
            </a-descriptions-item>
            <a-descriptions-item label="审批时间">
              <span class="cell-mono">2026-03-14 11:30:00</span>
            </a-descriptions-item>
            <a-descriptions-item label="申请备注" :span="2">
              <span class="muted">需要一台云主机用于部署业务系统，配置要求2核4G，200G SSD。</span>
            </a-descriptions-item>
          </a-descriptions>
        </CloudCard>

        <CloudCard class="processed-detail-page__card">
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

      <div class="processed-detail-page__side">
        <CloudCard class="processed-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">关联工单</span>
          </div>
          <div class="workorder-chip workorder-chip--done">
            <div class="workorder-chip__id">
              <span class="cell-mono">TK-0232</span>
            </div>
            <div class="workorder-chip__title">云主机开通工单</div>
            <div class="workorder-chip__desc">云主机已成功开通，IP地址：192.168.1.100，已发送通知给申请人。</div>
            <div class="workorder-chip__owner">
              <a-avatar size="small" class="person-chip__av person-chip__av--green">李</a-avatar>
              负责人：李工（运维团队）
            </div>
          </div>
          <a-button block style="margin-top: 12px" @click="goToWorkorder">
            <template #icon><EyeOutlined /></template>
            查看工单
          </a-button>
        </CloudCard>

        <CloudCard class="processed-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">处理记录</span>
          </div>
          <a-form :model="processForm" layout="vertical" class="process-form">
            <a-form-item label="处理结果">
              <a-radio-group v-model:value="processForm.result" disabled>
                <a-radio value="pass">通过</a-radio>
                <a-radio value="reject">驳回</a-radio>
                <a-radio value="transfer">转交</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="处理意见">
              <a-textarea
                v-model:value="processForm.opinion"
                :rows="4"
                placeholder="处理意见"
                disabled
              />
            </a-form-item>
            <a-form-item label="处理人">
              <a-input v-model:value="processForm.handler" placeholder="处理人" disabled />
            </a-form-item>
            <a-form-item label="处理时间">
              <a-input v-model:value="processForm.handleTime" placeholder="处理时间" disabled />
            </a-form-item>
            <a-form-item>
              <div class="form-actions">
                <a-button type="primary" disabled>提交</a-button>
                <a-button disabled>重置</a-button>
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
  ArrowLeftOutlined, EyeOutlined
} from '@ant-design/icons-vue'
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import StatusDot from '@/components/cloud/StatusDot.vue'

export default {
  name: 'OrderMyProcessedDetail',
  components: {
    PageHeader, CloudCard, StatusDot,
    ArrowLeftOutlined, EyeOutlined
  },
  data() {
    return {
      processForm: {
        result: 'pass',
        opinion: '同意，配置合理，符合业务需求。',
        handler: '张三',
        handleTime: '2026-03-14 11:30:00'
      },
      timeline: [
        { title: '提交申请', time: '2026-03-14 10:20:00 · 李四', state: 'done', dotColor: 'green' },
        { title: '系统派发工单', time: '2026-03-14 11:35:00 · 自动派发 -> TK-0232', state: 'done', dotColor: 'green' },
        { title: '工单流转中', time: '2026-03-14 11:40:00', state: 'done', dotColor: 'green' },
        { title: '服务交付完成', time: '2026-03-14 12:05:00 · 收到工单系统交付完成回执', state: 'done', dotColor: 'green' },
        { title: '服务评价', time: '2026-03-14 15:30:00 · 用户已评价：5星', state: 'done', dotColor: 'green' },
        { title: '订单驳回', time: '工单驳回后记录驳回时间', state: 'wait', dotColor: 'gray' },
        { title: '订单取消', time: '用户取消订单后记录取消时间', state: 'wait', dotColor: 'gray' }
      ]
    }
  },
  methods: {
    goBack() {
      this.$router.push('/workorder/order/myProcessed')
    },
    goToWorkorder() {
      this.$router.push({ path: '/workorder/detail', query: { workorderId: 'TK-0232' } })
    }
  }
}
</script>

<style scoped>
.processed-detail-page {
  padding: 4px 0;
}

.processed-detail-page__body {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 14px;
  margin-top: 14px;
}

.processed-detail-page__main,
.processed-detail-page__side {
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
  .processed-detail-page__body {
    grid-template-columns: 1fr;
  }
}
</style>
