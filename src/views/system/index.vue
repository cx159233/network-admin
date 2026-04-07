<template>
  <div class="app-container">
    <div class="empty-container">
      <el-empty
        description="
          <span class='empty-text'>暂无数据</span>
        "
      >
      </el-empty>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SystemIndex',
  data() {
    return {
    };
  },
  methods: {
  }
};
</script>

<style scoped>
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 600px;
}

.empty-text {
  font-size: 16px;
  color: #909399;
}
</style>