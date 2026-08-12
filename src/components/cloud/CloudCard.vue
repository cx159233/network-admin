<template>
  <div class="cloud-card" :class="{ 'cloud-card-hover': hoverable }">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'CloudCard',
  props: {
    hoverable: { type: Boolean, default: false }
  }
}
</script>

<style scoped>
.cloud-card {
  background: #FFFFFF;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}
.cloud-card-hover {
  transition: box-shadow 0.2s, border-color 0.2s;
}
.cloud-card-hover:hover {
  box-shadow: 0 8px 24px rgba(22, 93, 255, 0.10), 0 2px 6px rgba(15, 23, 42, 0.04);
}
</style>
