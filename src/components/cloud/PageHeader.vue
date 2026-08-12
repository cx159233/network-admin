<template>
  <section class="page-header">
    <div class="page-header__left">
      <div class="page-header__title-row">
        <span class="page-header__title">{{ title }}</span>
        <a-tag v-if="badge" :color="badgeColor" class="page-header__badge">{{ badge }}</a-tag>
      </div>
      <div v-if="description" class="page-header__desc">{{ description }}</div>
    </div>
    <div v-if="$slots.actions" class="page-header__right">
      <slot name="actions" />
    </div>
  </section>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    badge: { type: String, default: '' },
    badgeColor: { type: String, default: 'processing' }
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}
.page-header__left {
  min-width: 0;
  flex: 1;
}
.page-header__title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.page-header__title {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
  color: rgba(0, 0, 0, 0.85);
}
.page-header__badge {
  margin: 0;
  font-size: 11px;
}
.page-header__desc {
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.6;
  color: #4E5969;
}
.page-header__right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
</style>
