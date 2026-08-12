<template>
  <div class="audit-action-box">
    <div class="audit-action-box__title">{{ title }}</div>
    <a-textarea
      :value="opinion"
      @update:value="$emit('update:opinion', $event)"
      :rows="5"
      :maxlength="200"
      show-count
      placeholder="填写审核意见（通过/驳回时必填）"
      class="audit-textarea"
    />
    <div class="action-list">
      <a-button block type="primary" size="large" @click="$emit('approve')">
        <template #icon><CheckOutlined /></template>
        {{ approveText }}
      </a-button>
      <a-button block danger size="large" @click="$emit('reject')">
        <template #icon><CloseOutlined /></template>
        {{ rejectText }}
      </a-button>
    </div>
  </div>
</template>

<script>
import { CheckOutlined, CloseOutlined } from '@ant-design/icons-vue'

export default {
  name: 'AuditActionBox',
  components: { CheckOutlined, CloseOutlined },
  props: {
    opinion: { type: String, default: '' },
    title: { type: String, default: '审核操作' },
    approveText: { type: String, default: '审核通过' },
    rejectText: { type: String, default: '驳回申请' }
  },
  emits: ['update:opinion', 'approve', 'reject']
}
</script>

<style scoped>
.audit-action-box {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
}

.audit-action-box__title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 12px;
}

.audit-textarea {
  margin-bottom: 12px;
}

.action-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
