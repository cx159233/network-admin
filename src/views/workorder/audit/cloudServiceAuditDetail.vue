<template>
  <div class="detail-container">
    <!-- 顶部标题区域 -->
    <div class="detail-header-wrap">
      <el-button size="small" @click="goBack" class="back-btn">
        <i class="el-icon-arrow-left"></i> 返回列表
      </el-button>
      <span class="header-divider"></span>
      <span class="header-title">云服务审核 · {{ serviceInfo.serviceName }}</span>
    </div>

    <!-- 工单详情内容 -->
    <div class="detail-content-wrap">
      <div class="detail-main">
        <!-- 左侧主内容 -->
        <div class="dl-main">
          <!-- 服务基本信息 -->
          <div class="card">
            <div class="card-hd">
              <span class="cht">服务基本信息</span>
              <span class="sb pending" style="margin-left: auto">待审核</span>
            </div>
            <div class="qual-hero">
              <div class="qual-av">{{ serviceInfo.serviceName.charAt(0) }}</div>
              <div style="flex: 1">
                <div class="org-title">{{ serviceInfo.serviceName }}</div>
                <div class="org-meta">
                  <span class="org-code">{{ serviceInfo.serviceId }}</span>
                </div>
              </div>
            </div>
            <div class="ip" style="border-top: 1px solid #e3e7ef">
              <div class="ip-i"><div class="ip-lbl">云服务商</div><div class="ip-val">{{ serviceInfo.cloudProvider }}</div></div>
              <div class="ip-i"><div class="ip-lbl">服务类型</div><div class="ip-val">{{ serviceInfo.serviceType }}</div></div>
              <div class="ip-i"><div class="ip-lbl">区域</div><div class="ip-val">{{ serviceInfo.region }}</div></div>
              <div class="ip-i"><div class="ip-lbl">提交时间</div><div class="ip-val mono">{{ serviceInfo.submitTime }}</div></div>
              <div class="ip-i full"><div class="ip-lbl">服务描述</div><div class="ip-val muted">{{ serviceInfo.description }}</div></div>
            </div>
          </div>

          <!-- 提交材料核验 -->
          <div class="card">
            <div class="card-hd">
              <span class="cht">提交材料核验</span>
              <span class="chs">{{ serviceInfo.materials.length }} 份 · 点击查看原件</span>
            </div>
            <div class="doc-list">
              <div
                v-for="(material, index) in serviceInfo.materials"
                :key="index"
                class="doc-item"
              >
                <div class="doc-ico" :style="{ background: material.bgColor }">{{ material.icon }}</div>
                <div class="doc-name">{{ material.name }}</div>
                <div class="doc-size">{{ material.size }}</div>
                <div :class="['doc-status', material.statusClass]">{{ material.statusIcon }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧操作栏 -->
        <div class="dl-side">
          <!-- 审核操作 -->
          <div class="card">
            <div class="card-hd"><span class="cht">审核操作</span></div>
            <div class="card-bd" style="padding: 14px; display: flex; flex-direction: column; gap: 8px">
              <textarea
                v-model="auditForm.opinion"
                class="rf-textarea"
                style="min-height: 72px; margin-bottom: 0"
                placeholder="填写审核意见（通过/驳回时必填）..."
              ></textarea>
              <button class="btn btn-success" style="width: 100%; justify-content: center" @click="approve">
                ✓ 审核通过
              </button>
              <button class="btn btn-danger" style="width: 100%; justify-content: center" @click="reject">
                ✕ 驳回申请
              </button>
            </div>
          </div>

          <!-- 处理进度 -->
          <div class="card">
            <div class="card-hd"><span class="cht">处理进度</span></div>
            <div class="card-bd" style="padding: 14px">
              <div class="tl">
                <div v-for="(step, index) in serviceInfo.processSteps" :key="index" class="tl-row">
                  <div class="tl-sp">
                    <div class="tl-d" :class="step.statusClass"></div>
                    <div class="tl-vl" v-if="index < serviceInfo.processSteps.length - 1"></div>
                  </div>
                  <div class="tl-b">
                    <div style="display:flex;align-items:center;gap:8px">
                      <div class="tl-t" :class="step.statusClass">{{ step.title }}</div>
                    </div>
                    <div class="tl-m">{{ step.time }} · {{ step.handler }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CloudServiceAuditDetail",
  data() {
    return {
      serviceInfo: {
        id: 1,
        serviceName: '云服务器ECS',
        serviceId: 'SVC001',
        serviceType: 'ecs',
        cloudProvider: '电信云',
        region: '华东',
        submitTime: '2024-01-01 10:00',
        description: '弹性计算服务，提供安全可靠、弹性可扩展的云服务器',
        materials: [
          {
            name: '服务规格说明.pdf',
            size: '1.2 MB',
            bgColor: '#fff1f0',
            statusClass: 'ok',
            statusIcon: '✓',
            icon: '📄'
          },
          {
            name: '定价方案.pdf',
            size: '850 KB',
            bgColor: '#f0f9ff',
            statusClass: 'ok',
            statusIcon: '✓',
            icon: '📄'
          }
        ],
        processSteps: [
          {
            title: '提交申请',
            time: '2024-01-01 10:00',
            handler: '系统自动提交',
            statusClass: 'done'
          },
          {
            title: '人工审核',
            time: '进行中',
            handler: '等待审核',
            statusClass: 'on'
          }
        ]
      },
      auditForm: {
        opinion: ''
      }
    };
  },
  created() {
    const serviceId = this.$route.query.id;
    if (serviceId) {
      this.loadServiceDetail(serviceId);
    }
  },
  methods: {
    loadServiceDetail(serviceId) {
      // API请求获取详情
    },
    goBack() {
      this.$router.push('/portal/auditCenter/cloudServiceAudit');
    },
    approve() {
      if (!this.auditForm.opinion.trim()) {
        this.$message.error('请填写审核意见');
        return;
      }
      this.$message.success('审核通过');
      this.goBack();
    },
    reject() {
      if (!this.auditForm.opinion.trim()) {
        this.$message.error('请填写驳回原因');
        return;
      }
      this.$message.success('审核已驳回');
      this.goBack();
    }
  }
};
</script>

<style scoped>
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
  padding: 12px 24px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  margin: 0;
  border-radius: 0;
  height: auto;
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
  margin: 0;
}

.detail-content-wrap {
  display: flex;
  gap: 24px;
  padding: 20px 24px 24px;
  flex: 1;
  overflow-y: auto;
  background-color: #f2f4f8;
}

.detail-main {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  width: 100%;
}

.dl-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.dl-side {
  width: 272px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
}

.card-hd {
  padding: 14px 18px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #409eff;
  font-size: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.card-hd::before {
  content: '';
  width: 4px;
  height: 16px;
  background-color: #409eff;
  margin-right: 8px;
  border-radius: 2px;
  flex-shrink: 0;
}

.card-bd {
  padding: 18px;
}

.cht {
  font-size: 13px;
  font-weight: 600;
  color: #409eff;
}

.chs {
  font-size: 11px;
  color: #8c8c8c;
}

/* 服务信息卡 */
.qual-hero {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
}

.qual-av {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: linear-gradient(135deg, #eef2ff, #f3f0ff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  color: #3b5bdb;
  flex-shrink: 0;
  border: 1px solid #e3e7ef;
}

.org-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 3px;
}

.org-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #9aa0b8;
  flex-wrap: wrap;
}

.org-code {
  font-family: 'DM Mono', monospace;
}

/* 信息对网格 */
.ip {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
}

.ip-i {
  padding: 10px 16px;
  border-bottom: 1px solid #e3e7ef;
}

.ip-i:nth-child(odd) {
  border-right: 1px solid #e3e7ef;
}

.ip-i.full {
  grid-column: 1 / -1;
  border-right: none;
}

.ip-i:nth-last-child(-n+2):not(.full) {
  border-bottom: none;
}

.ip-i.full:last-child {
  border-bottom: none;
}

.ip-lbl {
  font-size: 10px;
  color: #9aa0b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 3px;
}

.ip-val {
  font-size: 13px;
  font-weight: 500;
  color: #1c2033;
}

.ip-val.muted {
  font-weight: 400;
  color: #5c6480;
}

.ip-val.mono {
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  font-weight: 400;
}

/* 文档列表 */
.doc-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 18px;
}

.doc-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #e3e7ef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.12s;
}

.doc-item:hover {
  border-color: #3b5bdb;
  background: #eef2ff;
}

.doc-ico {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  flex-shrink: 0;
}

.doc-name {
  font-size: 13px;
  font-weight: 500;
  flex: 1;
}

.doc-size {
  font-size: 11px;
  color: #9aa0b8;
  font-family: 'DM Mono', monospace;
}

.doc-status {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  flex-shrink: 0;
}

.doc-status.ok {
  background: #ebfbee;
  color: #2f9e44;
  border: 1px solid #b2f2bb;
}

.doc-status.ng {
  background: #fff5f5;
  color: #c92a2a;
  border: 1px solid #ffc9c9;
}

.doc-status.wait {
  background: #f7f8fa;
  color: #9aa0b8;
  border: 1px solid #c8cdd9;
}

.doc-status.ing {
  background: #eef2ff;
  color: #3b5bdb;
  border: 1px solid #c5d0fa;
}

/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.12s;
  font-family: 'DM Sans', sans-serif;
  white-space: nowrap;
}

.btn-success {
  background: #ebfbee;
  color: #2f9e44;
  border: 1px solid #b2f2bb;
}

.btn-success:hover {
  background: #b2f2bb;
}

.btn-danger {
  background: #fff5f5;
  color: #c92a2a;
  border: 1px solid #ffc9c9;
}

.btn-danger:hover {
  background: #ffc9c9;
}

/* 状态标签 */
.sb {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.sb::before {
  content: '';
  width: 5px;
  height: 5px;
  border-radius: 50%;
  flex-shrink: 0;
}

.sb.pending {
  background: #fff9db;
  color: #e67700;
}

.sb.pending::before {
  background: #e67700;
}

/* 时间线 */
.tl {
  display: flex;
  flex-direction: column;
}

.tl-row {
  display: flex;
  gap: 12px;
  margin-bottom: 6px;
}

.tl-sp {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 14px;
  flex-shrink: 0;
}

.tl-d {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 5px;
  flex-shrink: 0;
}

.tl-d.done {
  background: #2f9e44;
}

.tl-d.on {
  background: #3b5bdb;
  box-shadow: 0 0 0 3px #c5d0fa;
}

.tl-vl {
  flex: 1;
  width: 1px;
  background: #c8cdd9;
  margin: 3px 0;
  min-height: 16px;
}

.tl-row:last-child .tl-vl {
  display: none;
}

.tl-b {
  padding-bottom: 14px;
  flex: 1;
}

.tl-t {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 2px;
}

.tl-t.done {
  color: #5c6480;
}

.tl-t.on {
  color: #1c2033;
}

.tl-m {
  font-size: 11px;
  color: #9aa0b8;
  font-family: 'DM Mono', monospace;
}

/* 文本框样式 */
.rf-textarea {
  width: 100%;
  background: #fff;
  border: 1px solid #e3e7ef;
  border-radius: 8px;
  padding: 10px 12px;
  color: #1c2033;
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  outline: none;
  resize: vertical;
  min-height: 80px;
  line-height: 1.6;
  transition: border-color 0.12s;
}

.rf-textarea:focus {
  border-color: #3b5bdb;
}
</style>