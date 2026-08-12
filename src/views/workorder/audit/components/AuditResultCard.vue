<template>
  <div class="audit-result-card" :class="'audit-result-card--' + theme">
    <div class="audit-result-card__head">
      <span class="audit-result-card__badge">
        <component :is="iconComp" class="audit-result-card__badge-icon" />
        <span>{{ statusText }}</span>
      </span>
      <span class="audit-result-card__time">{{ record.auditTime || '--' }}</span>
    </div>
    <div class="audit-result-card__body">
      <div class="audit-result-card__row">
        <span class="audit-result-card__label">审核人</span>
        <span class="audit-result-card__value">{{ record.auditor || '--' }}</span>
      </div>
      <div class="audit-result-card__opinion" v-if="record.opinion">
        <span class="audit-result-card__label">审核意见</span>
        <div class="audit-result-card__opinion-text">{{ record.opinion }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons-vue'

export default {
  name: 'AuditResultCard',
  components: { CheckCircleFilled, CloseCircleFilled },
  props: {
    record: { type: Object, default: () => ({}) }
  },
  computed: {
    status() {
      return (this.record && this.record.status) || 'approved'
    },
    theme() {
      return this.status === 'rejected' ? 'reject' : 'approve'
    },
    statusText() {
      const map = { approved: '审核通过', rejected: '审核驳回', pending: '待审核' }
      return map[this.status] || '已完成'
    },
    iconComp() {
      return this.status === 'rejected' ? 'CloseCircleFilled' : 'CheckCircleFilled'
    }
  }
}
</script>

<style scoped>
.audit-result-card {
  border-radius: 8px;
  padding: 14px 16px;
  margin-bottom: 16px;
  border: 1px solid #E5E6EB;
  background: #FFFFFF;
}

.audit-result-card--approve {
  border-color: #E3EEDD;
  background: #F7FBF4;
}

.audit-result-card--reject {
  border-color: #F5D7D3;
  background: #FBF3F2;
}

.audit-result-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #E5E6EB;
}

.audit-result-card__badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
}

.audit-result-card--approve .audit-result-card__badge {
  color: #16A34A;
}

.audit-result-card--reject .audit-result-card__badge {
  color: #EF4444;
}

.audit-result-card__badge-icon {
  font-size: 15px;
}

.audit-result-card__time {
  font-size: 12px;
  color: #86909C;
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
}

.audit-result-card__body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.audit-result-card__row {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.audit-result-card__opinion {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.audit-result-card__label {
  flex-shrink: 0;
  font-size: 12px;
  color: #86909C;
  width: 56px;
}

.audit-result-card__value {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
}

.audit-result-card__opinion-text {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.75);
  line-height: 1.6;
  padding: 8px 12px;
  background: #FFFFFF;
  border-radius: 6px;
  border-left: 3px solid #E5E6EB;
}

.audit-result-card--approve .audit-result-card__opinion-text {
  border-left-color: #16A34A;
}

.audit-result-card--reject .audit-result-card__opinion-text {
  color: #C23E3E;
  border-left-color: #EF4444;
}
</style>
