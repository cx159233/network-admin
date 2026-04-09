<template>
  <div class="app-container">
    <div class="detail-container">
      <!-- 顶部标题区域 -->
      <div class="detail-header-wrap">
        <el-button size="small" @click="goBack" class="back-btn">
          <i class="el-icon-arrow-left"></i> 返回列表
        </el-button>
        <span class="header-divider"></span>
        <span class="header-title">{{ compInfo.name }}</span>
        <span class="sb done" style="margin-left:12px">发布</span>
      </div>

      <!-- 组件详情内容 -->
      <div class="detail-content-wrap">
        <div class="detail-left">
          <!-- 组件基本信息 -->
          <el-card shadow="never">
            <template #header>
              <div class="card-header"><span>组件基本信息</span></div>
            </template>
            <div class="info-grid">
              <div class="info-item"><div class="info-label">组件名称</div><div class="info-value">{{ compInfo.name }}</div></div>
              <div class="info-item"><div class="info-label">服务商名称</div><div class="info-value">{{ compInfo.serviceProviderName }}</div></div>
              <div class="info-item"><div class="info-label">云服务商</div><div class="info-value">{{ compInfo.deployServiceProviderView }}</div></div>
              <div class="info-item"><div class="info-label">开放范围</div><div class="info-value">{{ compInfo.coverView }}</div></div>
              <div class="info-item"><div class="info-label">联系人</div><div class="info-value">{{ compInfo.contact1Name }}</div></div>
              <div class="info-item"><div class="info-label">联系电话</div><div class="info-value mono">{{ compInfo.contact1Phone }}</div></div>
              <div class="info-item full"><div class="info-label">组件描述</div><div class="info-value muted">{{ compInfo.description }}</div></div>
            </div>
          </el-card>
        </div>

        <div class="detail-right">
          <!-- 评价信息 -->
          <el-card shadow="never">
            <template #header>
              <div class="card-header"><span>评价信息</span></div>
            </template>
            <div class="review-section">
              <div class="review-row">
                <span class="review-label">平台评价</span>
                <el-rate v-model="compInfo.platformRating" disabled show-score />
              </div>
              <div class="review-row">
                <span class="review-label">使用评价</span>
                <el-rate v-model="compInfo.usageRating" disabled show-score />
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CMSComponentDetail',
  data() {
    return {
      compInfo: {
        name: '未设置',
        serviceProviderName: '未设置',
        deployServiceProviderView: '未设置',
        coverView: '未设置',
        description: '未设置',
        contact1Name: '未设置',
        contact1Phone: '未设置',
        platformRating: 0,
        usageRating: 0
      }
    };
  },
  created() {
    const q = this.$route.query;
    if (q && q.name) {
      this.compInfo = {
        name: q.name || '未设置',
        serviceProviderName: q.serviceProviderName || '未设置',
        deployServiceProviderView: q.deployServiceProviderView || '未设置',
        coverView: q.coverView || '未设置',
        description: q.description || '未设置',
        contact1Name: q.contact1Name || '未设置',
        contact1Phone: q.contact1Phone || '未设置',
        platformRating: parseFloat(q.platformRating) || 0,
        usageRating: parseFloat(q.usageRating) || 0
      };
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.app-container {
  padding: 20px;
  background-color: #ffffff;
  min-height: 100%;
  box-sizing: border-box;
}

.detail-container {
  display: flex;
  flex-direction: column;
  margin: -20px;
  height: calc(100% + 40px);
}

.detail-header-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.back-btn {
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: 500;
}

.back-btn:hover {
  background-color: #ecf5ff;
  border-color: #409eff;
  color: #409eff;
}

.header-divider {
  width: 1px;
  height: 18px;
  background: #f0f0f0;
  flex-shrink: 0;
}

.header-title {
  font-weight: 600;
  font-size: 18px;
  color: #303133;
}

.detail-content-wrap {
  display: flex;
  gap: 24px;
  padding: 20px 24px 24px;
  flex: 1;
  overflow-y: auto;
  background-color: #f2f4f8;
}

.detail-left {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.detail-right {
  width: 340px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-header {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #409eff;
  font-size: 15px;
  padding: 4px 0;
}

.card-header::before {
  content: '';
  width: 4px;
  height: 16px;
  background-color: #409eff;
  margin-right: 8px;
  border-radius: 2px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 40px;
  padding: 8px 0;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.info-item.full {
  grid-column: 1/-1;
}

.info-item:hover {
  background-color: #ecf5ff;
}

.info-label {
  color: #606266;
  font-size: 13px;
  width: 90px;
  flex-shrink: 0;
  font-weight: 500;
}

.info-value {
  color: #303133;
  font-size: 13px;
  flex: 1;
  font-weight: 400;
  word-break: break-all;
}

.info-value.mono {
  font-family: 'DM Mono', monospace;
  font-size: 12px;
}

.info-value.muted {
  font-weight: 400;
  color: #5c6480;
}

.sb {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  background: #ebfbee;
  color: #2f9e44;
}

.sb::before {
  content: '';
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #2f9e44;
  flex-shrink: 0;
}

.review-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 4px 0;
}

.review-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.review-label {
  color: #606266;
  font-size: 13px;
  width: 72px;
  flex-shrink: 0;
  font-weight: 500;
}

::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #c8cdd9; border-radius: 3px; }
</style>
