<template>
  <div class="stat-card cloud-card cloud-card-hover">
    <div class="stat-card__top">
      <span class="stat-card__label">{{ label }}</span>
      <span v-if="$slots.icon" class="stat-card__icon" :class="iconClass">
        <slot name="icon" />
      </span>
    </div>
    <div class="stat-card__value-row">
      <span class="stat-card__value" :class="valueClass">{{ value }}</span>
      <span v-if="unit" class="stat-card__unit">{{ unit }}</span>
    </div>
    <div v-if="delta || trend" class="stat-card__delta-row">
      <span :class="deltaClass">{{ delta }}</span>
      <span v-if="trend" class="stat-card__trend">{{ trend }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatCard',
  props: {
    label: { type: String, required: true },
    value: { type: [String, Number], required: true },
    unit: { type: String, default: '' },
    delta: { type: String, default: '' },
    trend: { type: String, default: '' },
    tone: { type: String, default: 'default' },
    iconTone: { type: String, default: 'primary' }
  },
  computed: {
    valueClass() {
      const map = {
        primary: 'stat-card__value--primary',
        success: 'stat-card__value--success',
        warning: 'stat-card__value--warning',
        danger: 'stat-card__value--danger'
      }
      return map[this.tone] || ''
    },
    deltaClass() {
      const map = {
        primary: 'stat-card__delta--primary',
        success: 'stat-card__delta--success',
        warning: 'stat-card__delta--warning',
        danger: 'stat-card__delta--danger'
      }
      return map[this.tone] || 'stat-card__delta--default'
    },
    iconClass() {
      const map = {
        primary: 'stat-card__icon--primary',
        success: 'stat-card__icon--success',
        warning: 'stat-card__icon--warning',
        danger: 'stat-card__icon--danger'
      }
      return map[this.iconTone] || 'stat-card__icon--primary'
    }
  }
}
</script>

<style scoped>
.stat-card {
  padding: 16px;
}
.stat-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.stat-card__label {
  font-size: 12px;
  color: #4E5969;
}
.stat-card__icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
.stat-card__icon--primary { background: #E8F3FF; color: #165DFF; }
.stat-card__icon--success { background: rgba(22, 163, 74, 0.10); color: #16A34A; }
.stat-card__icon--warning { background: rgba(245, 158, 11, 0.10); color: #F59E0B; }
.stat-card__icon--danger { background: rgba(239, 68, 68, 0.10); color: #EF4444; }

.stat-card__value-row {
  margin-top: 8px;
  display: flex;
  align-items: baseline;
  gap: 4px;
}
.stat-card__value {
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.2px;
  color: rgba(0, 0, 0, 0.85);
}
.stat-card__value--primary { color: #165DFF; }
.stat-card__value--success { color: #16A34A; }
.stat-card__value--warning { color: #F59E0B; }
.stat-card__value--danger { color: #EF4444; }

.stat-card__unit {
  font-size: 12px;
  color: #86909C;
}

.stat-card__delta-row {
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
}
.stat-card__delta--primary { color: #165DFF; }
.stat-card__delta--success { color: #16A34A; }
.stat-card__delta--warning { color: #F59E0B; }
.stat-card__delta--danger { color: #EF4444; }
.stat-card__delta--default { color: #86909C; }
.stat-card__trend {
  color: #86909C;
}
</style>
