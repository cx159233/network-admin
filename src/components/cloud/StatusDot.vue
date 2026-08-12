<template>
  <span class="status-cell">
    <span :class="['status-dot', `status-dot--${type}`]"></span>
    <span :class="['status-text', `status-text--${type}`]">
      <slot>{{ text }}</slot>
    </span>
  </span>
</template>

<script>
export default {
  name: 'StatusDot',
  props: {
    type: { type: String, default: 'default' },
    text: { type: String, default: '' }
  }
}
</script>

<style scoped>
.status-cell {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}
.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 6px;
  flex-shrink: 0;
}
.status-dot--processing {
  background: #165DFF;
  box-shadow: 0 0 0 3px rgba(22, 93, 255, 0.15);
  animation: status-pulse 1.8s infinite;
}
.status-dot--done { background: #16A34A; }
.status-dot--evaluated { background: #722ED1; }
.status-dot--rejected { background: #EF4444; }
.status-dot--cancelled { background: #C9CDD4; }
.status-dot--warning { background: #F59E0B; }
.status-dot--default { background: #D9D9D9; }

.status-text {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

@keyframes status-pulse {
  0% { box-shadow: 0 0 0 0 rgba(22, 93, 255, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(22, 93, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(22, 93, 255, 0); }
}
</style>
