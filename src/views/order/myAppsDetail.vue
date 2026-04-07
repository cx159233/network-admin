<template>
  <div class="detail-container">
    <!-- 顶部标题区域 -->
    <div class="detail-header-wrap">
      <el-button size="small" @click="goBack" class="back-btn">
        <i class="el-icon-arrow-left"></i> 返回列表
      </el-button>
      <span class="header-divider"></span>
      <div class="header-title">
        <el-tag size="small" type="success" effect="dark" class="status-tag">
          上架
        </el-tag>
        <span>智能办公系统 · v1.0.0</span>
      </div>
    </div>

    <!-- 应用详情内容 -->
    <div class="detail-content-wrap">
      <!-- 左侧基本信息 -->
      <div class="detail-left">
        <!-- 应用基本信息 -->
        <el-card shadow="never" class="mb-4">
          <template #header>
            <div class="card-header">
              <span>应用基本信息</span>
            </div>
          </template>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">应用名称</div><div class="info-value">智能办公系统</div></div>
            <div class="info-item"><div class="info-label">版本</div><div class="info-value">v1.0.0</div></div>
            <div class="info-item"><div class="info-label">厂商</div><div class="info-value">腾讯科技</div></div>
            <div class="info-item"><div class="info-label">分类</div><div class="info-value">办公软件</div></div>
            <div class="info-item"><div class="info-label">云服务商</div><div class="info-value">腾讯云</div></div>
            <div class="info-item"><div class="info-label">上架时间</div><div class="info-value mono">2024-01-01 10:00:00</div></div>
            <div class="info-item"><div class="info-label">状态</div><div class="info-value"><el-tag type="success" size="small">上架</el-tag></div></div>
            <div class="info-item"><div class="info-label">平台评价</div><div class="info-value">4.5</div></div>
            <div class="info-item full"><div class="info-label">应用描述</div><div class="info-value muted">智能办公系统是一款集成了办公自动化、协同办公、文档管理等功能的企业级应用，旨在提高企业办公效率和管理水平。</div></div>
          </div>
        </el-card>

        <!-- 流程进度 -->
        <el-card shadow="never" class="description-card">
          <template #header>
            <div class="card-header">
              <span>流程进度</span>
            </div>
          </template>
          <div class="tl">
            <div class="tl-row"><div class="tl-spine"><div class="tl-dot done"></div><div class="tl-vl"></div></div><div class="tl-body"><div class="tl-title done">提交申请</div><div class="tl-time">2024-01-01 10:00 · 腾讯科技</div></div></div>
            <div class="tl-row"><div class="tl-spine"><div class="tl-dot done"></div><div class="tl-vl"></div></div><div class="tl-body"><div class="tl-title done">平台审核</div><div class="tl-time">2024-01-02 14:30 · 平台管理员 — 审核通过</div></div></div>
            <div class="tl-row"><div class="tl-spine"><div class="tl-dot done"></div><div class="tl-vl"></div></div><div class="tl-body"><div class="tl-title done">上架成功</div><div class="tl-time">2024-01-03 09:00 · 系统自动上架</div></div></div>
            <div class="tl-row"><div class="tl-spine"><div class="tl-dot on"></div></div><div class="tl-body"><div class="tl-title on">应用运行中</div><div class="tl-time">正常运行中，已为10家机构提供服务</div></div></div>
          </div>
        </el-card>
      </div>

      <!-- 右侧应用操作和评价信息 -->
      <div class="detail-right">
        <!-- 应用操作 -->
        <el-card shadow="never" class="mb-4">
          <template #header>
            <div class="card-header">
              <span>应用操作</span>
            </div>
          </template>
          <div style="display:flex;flex-direction:column;gap:8px;width:100%">
            <div class="custom-button" @click="viewDocumentation">查看文档</div>
            <div class="custom-button" @click="updateVersion">版本更新</div>
            <div class="custom-button danger" @click="takeDownApp">下架应用</div>
          </div>
        </el-card>

        <!-- 评价信息 -->
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>评价信息</span>
            </div>
          </template>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">平台评价</div><div class="info-value">4.5</div></div>
            <div class="info-item"><div class="info-label">使用评价</div><div class="info-value">4.2</div></div>
            <div class="info-item"><div class="info-label">评价数量</div><div class="info-value">25</div></div>
          </div>
          <el-button type="primary" size="small" style="width: 100%; margin-top: 16px" @click="openRatingDialog">提交评价</el-button>
        </el-card>
      </div>
    </div>

    <!-- 评分弹窗 -->
    <el-dialog
      title="提交评价"
      width="600px"
      :visible.sync="ratingDialogVisible"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="ratingForm" :model="ratingForm" label-width="80px">
        <el-form-item label="评分">
          <el-rate v-model="ratingForm.score" :max="5" show-score />
        </el-form-item>
        <el-form-item label="评价描述">
          <el-input v-model="ratingForm.description" type="textarea" rows="4" placeholder="请输入评价描述" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleRatingSubmit">提交</el-button>
        <el-button @click="ratingDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'MyAppsDetail',
  data() {
    return {
      ratingDialogVisible: false,
      ratingForm: {
        score: 0,
        description: ''
      }
    };
  },
  methods: {
    goBack() {
      this.$router.push('/workorder/myApps');
    },
    viewDocumentation() {
      this.$message.info('查看文档功能开发中');
    },
    updateVersion() {
      this.$message.info('版本更新功能开发中');
    },
    takeDownApp() {
      this.$confirm('确定要下架应用吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        this.$message.success('应用下架成功');
      }).catch(() => {});
    },
    openRatingDialog() {
      this.ratingForm.score = 0;
      this.ratingForm.description = '';
      this.ratingDialogVisible = true;
    },
    handleRatingSubmit() {
      // 提交评价
      this.$message.success('评价成功');
      this.ratingDialogVisible = false;
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Mono:wght@400;500&display=swap');

:root{
  --bg:#f2f4f8;
  --surface:#ffffff;
  --surface2:#f7f8fa;
  --border:#e3e7ef;
  --border2:#c8cdd9;
  --text:#1c2033;
  --text2:#5c6480;
  --text3:#9aa0b8;
  --accent:#3b5bdb;
  --accent-dim:#eef2ff;
  --accent-mid:#c5d0fa;
  --green:#2f9e44;
  --green-dim:#ebfbee;
  --green-mid:#b2f2bb;
  --amber:#e67700;
  --amber-dim:#fff9db;
  --amber-mid:#ffec99;
  --red:#c92a2a;
  --red-dim:#fff5f5;
  --red-mid:#ffc9c9;
  --orange:#d9480f;
  --orange-dim:#fff4e6;
  --orange-mid:#ffd8a8;
  --teal:#0c8599;
  --teal-dim:#e3fafc;
  --teal-mid:#99e9f2;
  --purple:#6741d9;
  --purple-dim:#f3f0ff;
  --purple-mid:#d0bfff;
  --r:8px;--rl:12px;--rxl:16px;
  --shadow:0 1px 3px rgba(0,0,0,.07),0 1px 2px rgba(0,0,0,.04);
  --shadow-md:0 4px 16px rgba(0,0,0,.08);
}

/* Main */
.detail-container {
  display: flex;
  flex-direction: column;
  padding: 0 !important;
  margin: -20px;
  height: 100%;
}

.detail-header-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  margin: 0;
  border-radius: 0;
  height: auto;
  flex-shrink: 0;
  position: relative;
  z-index: 10;
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
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 18px;
  color: #303133;
  margin: 0;
}

.status-tag {
  margin-right: 12px;
  font-weight: 500;
  padding: 0 10px;
  height: 24px;
  line-height: 22px;
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

.detail-left .mb-4 {
  margin-bottom: 0 !important;
}

.description-card {
  margin-bottom: 0;
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
}

.info-value.mono {
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  font-weight: 400;
}

.info-value.muted {
  font-weight: 400;
  color: #5c6480;
}

/* Timeline */
.tl{display:flex;flex-direction:column;padding:8px 0}
.tl-row{display:flex;gap:12px}
.tl-spine{display:flex;flex-direction:column;align-items:center;width:14px;flex-shrink:0}
.tl-dot{width:8px;height:8px;border-radius:50%;margin-top:5px;flex-shrink:0}
.tl-dot.done{background:#2f9e44}
.tl-dot.on{background:#3b5bdb;box-shadow:0 0 0 3px #c5d0fa}
.tl-dot.wait{background:#c8cdd9}
.tl-dot.red{background:#c92a2a}
.tl-vl{flex:1;width:1px;background:#e3e7ef;margin:3px 0;min-height:16px}
.tl-row:last-child .tl-vl{display:none}
.tl-body{padding-bottom:14px;flex:1}
.tl-title{font-size:13px;font-weight:500;margin-bottom:2px}
.tl-title.done{color:#5c6480}
.tl-title.on{color:#1c2033}
.tl-title.wait{color:#9aa0b8}
.tl-time{font-size:11px;color:#9aa0b8;font-family:'DM Mono',monospace}

/* 自定义按钮样式 */
.custom-button {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #ffffff;
  color: #606266;
  font-size: 12px;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s;
  box-sizing: border-box;
}

.custom-button:hover {
  border-color: #409eff;
  color: #409eff;
}

.custom-button.danger {
  border-color: #f56c6c;
  color: #f56c6c;
}

.custom-button.danger:hover {
  border-color: #f56c6c;
  background-color: #fef0f0;
  color: #f56c6c;
}

/* Scrollbar */
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:3px}
</style>