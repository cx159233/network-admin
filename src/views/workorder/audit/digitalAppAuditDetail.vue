<template>
  <div class="detail-container">
    <!-- 顶部标题区域 -->
    <div class="detail-header-wrap">
      <el-button size="small" @click="goBack" class="back-btn">
        <i class="el-icon-arrow-left"></i> 返回列表
      </el-button>
      <span class="header-divider"></span>
      <span class="header-title">数字应用审核 · {{ appInfo.appName }}</span>
    </div>

    <!-- 工单详情内容 -->
    <div class="detail-content-wrap">
      <div class="detail-main">
        <!-- 左侧主内容 -->
        <div class="dl-main">
          <!-- 应用基本信息 -->
          <div class="card">
            <div class="card-hd">
              <span class="cht">应用基本信息</span>
              <span class="sb pending" style="margin-left: auto">{{ appInfo.auditStatus === 10 ? '待审核' : appInfo.auditStatus === 20 ? '已通过' : '已拒绝' }}</span>
            </div>
            <div class="qual-hero">
              <div class="qual-av">{{ appInfo.appName.charAt(0) }}</div>
              <div style="flex: 1">
                <div class="org-title">{{ appInfo.appName }}</div>
                <div class="org-meta">
                  <span class="org-code">{{ appInfo.version }}</span>
                  <span class="org-type">{{ appInfo.category }}</span>
                </div>
              </div>
            </div>
            <div class="ip" style="border-top: 1px solid #e3e7ef">
              <div class="ip-i"><div class="ip-lbl">厂商</div><div class="ip-val">{{ appInfo.vendor }}</div></div>
              <div class="ip-i"><div class="ip-lbl">云服务商</div><div class="ip-val">{{ appInfo.cloudProvider }}</div></div>
              <div class="ip-i"><div class="ip-lbl">提交时间</div><div class="ip-val mono">{{ appInfo.submitTime }}</div></div>
              <div class="ip-i"><div class="ip-lbl">审核状态</div><div class="ip-val">{{ appInfo.auditStatus === 10 ? '待审核' : appInfo.auditStatus === 20 ? '已通过' : '已拒绝' }}</div></div>
              <div class="ip-i full"><div class="ip-lbl">应用描述</div><div class="ip-val muted">{{ appInfo.description }}</div></div>
              <div class="ip-i full"><div class="ip-lbl">审核意见</div><div class="ip-val muted">{{ appInfo.auditOpinion || '未审核' }}</div></div>
            </div>
          </div>

          <!-- 提交材料核验 -->
          <div class="card">
            <div class="card-hd">
              <span class="cht">提交材料核验</span>
              <span class="chs">{{ appInfo.materials.length }} 份 · 点击查看原件</span>
            </div>
            <div class="doc-list">
              <div
                v-for="(material, index) in appInfo.materials"
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

          <!-- 审核核验清单 -->
          <div class="card">
            <div class="card-hd">
              <span class="cht">审核核验清单</span>
              <span class="chs">已完成 {{ completedCount }} / 5 项</span>
            </div>
            <div class="chk-list">
              <div
                v-for="(item, index) in appInfo.checklist"
                :key="index"
                class="chk-item"
              >
                <div class="chk-box" :class="item.statusClass" @click="toggleCheckItem(index)">{{ item.checkIcon }}</div>
                <div class="chk-text">
                  <div class="chk-lbl">{{ item.title }}</div>
                  <div class="chk-desc">{{ item.description }}</div>
                </div>
                <div class="chk-res">
                  <span class="sb" :class="item.statusClass" style="font-size: 10px; padding: 2px 7px">{{ item.statusText }}</span>
                </div>
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
              <button class="btn btn-ghost" style="width: 100%; justify-content: center; font-size: 12px" @click="sendNotice">
                发送补充材料通知
              </button>
            </div>
          </div>

          <!-- 处理进度 -->
          <div class="card">
            <div class="card-hd"><span class="cht">处理进度</span></div>
            <div class="card-bd" style="padding: 14px">
              <div class="tl">
                <div v-for="(step, index) in appInfo.processSteps" :key="index" class="tl-row">
                  <div class="tl-sp">
                    <div class="tl-d" :class="step.statusClass"></div>
                    <div class="tl-vl" v-if="index < appInfo.processSteps.length - 1"></div>
                  </div>
                  <div class="tl-b">
                    <div class="tl-t" :class="step.statusClass">{{ step.title }}</div>
                    <div class="tl-m">{{ step.time }} · {{ step.handler }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- SLA 进度 -->
          <div class="card">
            <div class="card-hd"><span class="cht">SLA 进度</span></div>
            <div class="card-bd" style="padding: 14px; display: flex; flex-direction: column; gap: 8px">
              <div style="display: flex; justify-content: space-between; font-size: 12px">
                <span style="color: #9aa0b8">承诺时限</span>
                <span style="font-weight: 500">1 个工作日</span>
              </div>
              <div class="prog-wrap"><div class="prog amber" style="width: 28%"></div></div>
              <div style="font-size: 11px; color: #d9480f; font-weight: 500">已用 2h 20m · 剩余约 6h 20m</div>
            </div>
          </div>

          <!-- 审核说明 -->
          <div class="card">
            <div class="card-hd"><span class="cht">审核说明</span></div>
            <div class="card-bd" style="padding: 12px 14px">
              <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px">
                <div style="display: flex; gap: 6px; align-items: flex-start; color: #5c6480">
                  <span style="color: #3b5bdb; flex-shrink: 0; margin-top: 1px">①</span>
                  全部 5 项核验通过后方可点击「审核通过」
                </div>
                <div style="display: flex; gap: 6px; align-items: flex-start; color: #5c6480">
                  <span style="color: #3b5bdb; flex-shrink: 0; margin-top: 1px">②</span>
                  通过后系统自动激活应用并发布到应用市场
                </div>
                <div style="display: flex; gap: 6px; align-items: flex-start; color: #5c6480">
                  <span style="color: #3b5bdb; flex-shrink: 0; margin-top: 1px">③</span>
                  驳回需填写明确原因，厂商可在修改材料后重新提交
                </div>
                <div style="display: flex; gap: 6px; align-items: flex-start; color: #5c6480">
                  <span style="color: #3b5bdb; flex-shrink: 0; margin-top: 1px">④</span>
                  「补充材料通知」将以站内信+邮件形式发送给申请人
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
  name: "DigitalAppAuditDetail",
  data() {
    return {
      appInfo: {
        id: 1,
        appName: '智能办公系统',
        version: 'v1.0.0',
        vendor: '腾讯科技',
        category: '办公软件',
        cloudProvider: '腾讯云',
        submitTime: '2024-01-01 10:00:00',
        description: '智能办公系统是一款集协同办公、文档管理、审批流程等功能于一体的企业级办公软件，旨在提高企业内部沟通效率和管理水平。',
        auditStatus: 10,
        auditOpinion: '',
        auditTime: '',
        auditor: '',
        materials: [
          {
            name: '应用截图.png',
            size: '2.4 MB',
            bgColor: '#fff1f0',
            statusClass: 'ok',
            statusIcon: '✓',
            icon: '📄'
          },
          {
            name: '应用说明文档.pdf',
            size: '1.8 MB',
            bgColor: '#fff1f0',
            statusClass: 'ok',
            statusIcon: '✓',
            icon: '📄'
          },
          {
            name: '安全评估报告.pdf',
            size: '890 KB',
            bgColor: '#f0f9ff',
            statusClass: 'ing',
            statusIcon: '⟳',
            icon: '📄'
          },
          {
            name: '厂商资质证明.pdf',
            size: '1.1 MB',
            bgColor: '#fff1f0',
            statusClass: 'wait',
            statusIcon: '—',
            icon: '📄'
          },
          {
            name: '用户手册.pdf',
            size: '560 KB',
            bgColor: '#fff1f0',
            statusClass: 'wait',
            statusIcon: '—',
            icon: '📄'
          }
        ],
        checklist: [
          {
            title: '应用功能完整性核验',
            description: '确认应用功能与描述一致，无缺失功能',
            statusClass: 'ok',
            statusText: '通过',
            checkIcon: '✓',
            checked: true
          },
          {
            title: '安全合规性核验',
            description: '应用符合安全合规要求，无安全隐患',
            statusClass: 'ok',
            statusText: '通过',
            checkIcon: '✓',
            checked: true
          },
          {
            title: '性能稳定性核验',
            description: '应用性能稳定，响应时间符合要求',
            statusClass: 'reviewing',
            statusText: '核验中',
            checkIcon: '',
            checked: false
          },
          {
            title: '用户体验核验',
            description: '应用界面友好，操作流程清晰',
            statusClass: 'draft',
            statusText: '待核验',
            checkIcon: '',
            checked: false
          },
          {
            title: '文档完整性核验',
            description: '应用文档完整，包含用户手册、部署指南等',
            statusClass: 'draft',
            statusText: '待核验',
            checkIcon: '',
            checked: false
          }
        ],
        processSteps: [
          {
            title: '提交申请',
            time: '2024-01-01 10:00',
            handler: '腾讯科技',
            statusClass: 'done'
          },
          {
            title: '材料预审',
            time: '2024-01-01 10:30',
            handler: '系统自动校验通过',
            statusClass: 'done'
          },
          {
            title: '人工审核',
            time: '进行中',
            handler: '等待 2h 18m',
            statusClass: 'on'
          },
          {
            title: '审核结果通知',
            time: '等待审核结果',
            handler: '',
            statusClass: 'wait'
          }
        ]
      },
      auditForm: {
        opinion: ''
      }
    };
  },
  computed: {
    completedCount() {
      return this.appInfo.checklist.filter(item => item.checked).length;
    }
  },
  created() {
    const appId = this.$route.query.id;
    if (appId) {
      this.loadAppDetail(appId);
    }
  },
  methods: {
    loadAppDetail(appId) {
      // API请求获取应用详情
    },
    goBack() {
      this.$router.push('/workorder/auditCenter/digitalAppAudit');
    },
    approve() {
      if (!this.auditForm.opinion.trim()) {
        this.$message.error('请填写审核意见');
        return;
      }
      this.$confirm('确定要通过该应用的审核吗？', '确认通过', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        this.$message.success('审核通过，应用已激活');
        this.goBack();
      }).catch(() => {});
    },
    reject() {
      if (!this.auditForm.opinion.trim()) {
        this.$message.error('请填写驳回原因');
        return;
      }
      this.$confirm('确定要拒绝该应用的审核吗？', '确认拒绝', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$message.success('审核已拒绝');
        this.goBack();
      }).catch(() => {});
    },
    sendNotice() {
      this.$message.success('补充材料通知已发送');
    },
    toggleCheckItem(index) {
      this.appInfo.checklist[index].checked = !this.appInfo.checklist[index].checked;
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

/* 应用信息卡 */
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

.org-type {
  display: inline-block;
  background: #e3f2fd;
  color: #1565c0;
  padding: 1px 7px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
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

/* 核验清单 */
.chk-list {
  display: flex;
  flex-direction: column;
}

.chk-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 18px;
  border-bottom: 1px solid #e3e7ef;
}

.chk-item:last-child {
  border-bottom: none;
}

.chk-box {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 2px solid #c8cdd9;
  flex-shrink: 0;
  margin-top: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.12s;
  font-size: 10px;
  color: #fff;
}

.chk-box.ok {
  background: #3b5bdb;
  border-color: #3b5bdb;
}

.chk-box.ng {
  background: #c92a2a;
  border-color: #c92a2a;
}

.chk-text {
  flex: 1;
}

.chk-lbl {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 2px;
}

.chk-desc {
  font-size: 11px;
  color: #9aa0b8;
}

.chk-res {
  margin-left: auto;
  flex-shrink: 0;
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

.btn-ghost {
  background: transparent;
  color: #5c6480;
  border: 1px solid #c8cdd9;
}

.btn-ghost:hover {
  background: #f7f8fa;
  color: #1c2033;
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

.sb.approved {
  background: #ebfbee;
  color: #2f9e44;
}

.sb.approved::before {
  background: #2f9e44;
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

.tl-d.wait {
  background: #c8cdd9;
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

.tl-t.wait {
  color: #9aa0b8;
}

.tl-m {
  font-size: 11px;
  color: #9aa0b8;
  font-family: 'DM Mono', monospace;
}

/* 进度条 */
.prog-wrap {
  height: 6px;
  background: #f7f8fa;
  border-radius: 3px;
  overflow: hidden;
}

.prog {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s;
}

.prog.amber {
  background: #e67700;
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