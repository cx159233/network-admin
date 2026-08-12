<template>
  <div class="filter-bar">
    <div v-if="$slots.actions" class="filter-bar__left">
      <slot name="actions" />
    </div>
    <div class="filter-bar__spacer" />
    <div v-if="$slots.default || $slots.extra || showActions" class="filter-bar__right">
      <span v-if="label" class="filter-bar__label">{{ label }}</span>
      <slot />
      <slot name="extra" />
      <template v-if="showActions">
        <a-button type="primary" @click="$emit('search')">
          <template #icon><SearchOutlined /></template>
          查询
        </a-button>
        <a-button @click="$emit('reset')">
          <template #icon><ReloadOutlined /></template>
          重置
        </a-button>
      </template>
      <slot name="suffix" />
    </div>
  </div>
</template>

<script>
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue'

export default {
  name: 'FilterBar',
  components: { SearchOutlined, ReloadOutlined },
  props: {
    label: { type: String, default: '' },
    showActions: { type: Boolean, default: true }
  },
  emits: ['search', 'reset']
}
</script>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding: 14px 16px;
}
.filter-bar__left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.filter-bar__spacer {
  flex: 1;
}
.filter-bar__right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.filter-bar__label {
  font-size: 12px;
  color: #86909C;
  flex-shrink: 0;
}
</style>
