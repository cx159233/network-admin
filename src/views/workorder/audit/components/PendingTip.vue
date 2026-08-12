<template>
  <div class="pending-tip">
    <ClockCircleOutlined class="pending-tip__icon" />
    <span class="pending-tip__text">当前步骤尚未开始，请完成前面的审核步骤</span>
  </div>
</template>

<script>
import { ClockCircleOutlined } from '@ant-design/icons-vue'

export default {
  name: 'PendingTip',
  components: { ClockCircleOutlined }
}
</script>

<style scoped>
.pending-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 24px;
  background: #F7F8FA;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px dashed #E5E6EB;
}

.pending-tip__icon {
  font-size: 20px;
  color: #86909C;
}

.pending-tip__text {
  font-size: 13px;
  color: #86909C;
}
</style>
