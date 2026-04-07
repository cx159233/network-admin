<template>
  <div class="detail-container">
    <!-- 顶部标题区域 -->
    <div class="detail-header-wrap">
      <el-button size="small" @click="goBack" class="back-btn">
        <i class="el-icon-arrow-left"></i> 返回列表
      </el-button>
      <span class="header-divider"></span>
      <span class="header-title">#ORD-2024-0001 · 等保三级合规评估</span>
    </div>

    <!-- 工单详情内容 -->
    <div class="detail-content-wrap">
      <div class="detail-left">
        <!-- 订单基本信息 -->
        <el-card shadow="never" class="mb-4">
          <template #header>
            <div class="card-header">
              <span>订单基本信息</span>
            </div>
          </template>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">申请人</div><div class="info-value">张三</div></div>
            <div class="info-item"><div class="info-label">所属部门</div><div class="info-value">技术部</div></div>
            <div class="info-item"><div class="info-label">所属机构</div><div class="info-value">北京市海淀区数字经济发展局</div></div>
            <div class="info-item"><div class="info-label">申请时间</div><div class="info-value mono">2024-03-15 14:32</div></div>
            <div class="info-item"><div class="info-label">服务周期</div><div class="info-value">1年（2024-03 至 2025-03）</div></div>
            <div class="info-item"><div class="info-label">审批人</div><div class="info-value"><span class="av-chip"><span class="av blue">李</span> 李四 · IT管理员</span></div></div>
            <div class="info-item"><div class="info-label">审批时间</div><div class="info-value mono">2024-03-15 16:08</div></div>
            <div class="info-item"><div class="info-label">开通方式</div><div class="info-value">人工 + 工单交付</div></div>
            <div class="info-item full"><div class="info-label">申请备注</div><div class="info-value muted">本次申请等保三级评估，包含差距分析、渗透测试和整改报告，请安排专业团队对接。</div></div>
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
            <div class="tl-row"><div class="tl-spine"><div class="tl-dot done"></div><div class="tl-vl"></div></div><div class="tl-body"><div class="tl-title done">提交申请</div><div class="tl-time">2024-03-15 14:32 · 张三</div></div></div>
            <div class="tl-row"><div class="tl-spine"><div class="tl-dot done"></div><div class="tl-vl"></div></div><div class="tl-body"><div class="tl-title done">单级审批通过</div><div class="tl-time">2024-03-15 16:08 · 李四（IT管理员）— 同意，符合安全合规要求</div></div></div>
            <div class="tl-row"><div class="tl-spine"><div class="tl-dot done"></div><div class="tl-vl"></div></div><div class="tl-body"><div class="tl-title done">系统派发工单</div><div class="tl-time">2024-03-15 16:10 · 自动派发 → TK-0234 · 安全团队</div></div></div>
            <div class="tl-row"><div class="tl-spine"><div class="tl-dot on"></div><div class="tl-vl"></div></div><div class="tl-body"><div class="tl-title on">工单执行中</div><div class="tl-time">安全团队已与申请人对接，正在进行现场评估准备</div></div></div>
            <div class="tl-row"><div class="tl-spine"><div class="tl-dot wait"></div><div class="tl-vl"></div></div><div class="tl-body"><div class="tl-title wait">服务交付完成</div><div class="tl-time">等待工单关闭后自动更新</div></div></div>
            <div class="tl-row"><div class="tl-spine"><div class="tl-dot wait"></div></div><div class="tl-body"><div class="tl-title wait">服务评价</div><div class="tl-time">交付完成后用户可评价</div></div></div>
          </div>
        </el-card>
      </div>

      <div class="detail-right">
        <!-- 关联工单 -->
        <el-card shadow="never" class="mb-4">
          <template #header>
            <div class="card-header">
              <span>关联工单</span>
            </div>
          </template>
          <div style="border:1px solid #ffec99;border-left:3px solid #e67700;border-radius:8px;padding:12px;background:#fff9db">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">
              <span style="font-family:'DM Mono',monospace;font-size:11px;color:#e67700;font-weight:600">TK-0234</span>
              <span class="sb processing" style="font-size:10px;padding:2px 6px">处理中</span>
            </div>
            <div style="font-size:13px;font-weight:500;margin-bottom:5px;color:#1c2033">等保三级合规评估服务交付</div>
            <div style="font-size:12px;color:#5c6480;line-height:1.6;margin-bottom:8px">已与申请人确认评估范围，覆盖3个核心系统，本周五启动现场评估。</div>
            <div class="av-chip" style="font-size:11px;color:#9aa0b8"><span class="av amber">王</span> 负责人：王五（安全团队）</div>
          </div>
          <div style="display:flex;gap:6px;margin-top:10px">
            <el-button plain size="small" style="flex:1">查看工单</el-button>
            <el-button plain size="small" style="flex:1">催单</el-button>
          </div>
        </el-card>

        <!-- 处理操作 -->
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>处理操作</span>
            </div>
          </template>
          <div class="process-form">
            <el-form :model="processForm" label-position="top">
              <el-form-item label="处理结果">
                <el-radio-group v-model="processForm.result">
                  <el-radio label="pass">通过</el-radio>
                  <el-radio label="reject">驳回</el-radio>
                  <el-radio label="transfer">转交</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="处理意见">
                <el-input
                  v-model="processForm.comment"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入处理意见"
                  maxlength="500"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item v-if="processForm.result === 'transfer'" label="转交人">
                <el-select v-model="processForm.transferTo" placeholder="请选择转交人" style="width: 100%">
                  <el-option label="王五" value="wangwu" />
                  <el-option label="赵六" value="zhaoliu" />
                  <el-option label="孙七" value="sunqi" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-check" @click="submitProcess">提交处理</el-button>
                <el-button @click="resetProcess">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderMyTodoDetail',
  data() {
    return {
      processForm: {
        result: 'pass',
        comment: '',
        transferTo: ''
      }
    };
  },
  methods: {
    goBack() {
      this.$router.push('/workorder/order/myTodo');
    },
    submitProcess() {
      // 提交处理
      if (!this.processForm.comment.trim()) {
        this.$message.warning('请输入处理意见');
        return;
      }
      if (this.processForm.result === 'transfer' && !this.processForm.transferTo) {
        this.$message.warning('请选择转交人');
        return;
      }

      const resultText = {
        'pass': '通过',
        'reject': '驳回',
        'transfer': '转交'
      }[this.processForm.result];

      this.$confirm({
        title: '确认提交',
        message: `确定要${resultText}该订单吗？`,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        // 模拟提交处理
        setTimeout(() => {
          this.$message.success('处理成功');
          // 重置表单
          this.resetProcess();
        }, 500);
      }).catch(() => {});
    },
    resetProcess() {
      this.processForm = {
        result: 'pass',
        comment: '',
        transferTo: ''
      };
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

/* Buttons */
.btn{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:var(--r);font-size:13px;font-weight:500;cursor:pointer;border:none;transition:all .12s;font-family:'DM Sans',sans-serif;white-space:nowrap}
.btn-primary{background:var(--accent);color:#fff}
.btn-primary:hover{background:#3451c5}
.btn-ghost{background:transparent;color:var(--text2);border:1px solid var(--border2)}
.btn-ghost:hover{background:var(--surface2);color:var(--text);border-color:var(--border2)}
.btn-warn{background:var(--amber-dim);color:var(--amber);border:1px solid var(--amber-mid)}
.btn-warn:hover{background:var(--amber-mid)}
.btn-danger{background:var(--red-dim);color:var(--red);border:1px solid var(--red-mid)}
.btn-success{background:var(--green-dim);color:var(--green);border:1px solid var(--green-mid)}
.btn-sm{padding:5px 10px;font-size:12px}


/* Status badge */
.sb{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600;white-space:nowrap}
.sb::before{content:'';width:5px;height:5px;border-radius:50%;flex-shrink:0}
.sb.critical{background:var(--red-dim);color:var(--red)}
.sb.critical::before{background:var(--red);animation:blink 1s infinite}
.sb.urgent{background:var(--orange-dim);color:var(--orange)}
.sb.urgent::before{background:var(--orange);animation:blink 1.5s infinite}
.sb.warning{background:var(--amber-dim);color:var(--amber)}
.sb.warning::before{background:var(--amber)}
.sb.normal{background:var(--green-dim);color:var(--green)}
.sb.normal::before{background:var(--green)}
.sb.pending{background:var(--amber-dim);color:var(--amber)}
.sb.pending::before{background:var(--amber);animation:blink 1.5s infinite}
.sb.processing{background:var(--accent-dim);color:var(--accent)}
.sb.processing::before{background:var(--accent);animation:blink 1.5s infinite}
.sb.done{background:var(--green-dim);color:var(--green)}
.sb.done::before{background:var(--green)}
.sb.closed{background:var(--surface2);color:var(--text3)}
.sb.closed::before{background:var(--text3)}
.sb.rejected{background:var(--red-dim);color:var(--red)}
.sb.rejected::before{background:var(--red)}
.sb.active{background:var(--green-dim);color:var(--green)}
.sb.active::before{background:var(--green)}
.sb.provisioning{background:var(--teal-dim);color:var(--teal)}
.sb.provisioning::before{background:var(--teal);animation:blink 1.5s infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.35}}


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


/* Avatar chip */
.av-chip{display:inline-flex;align-items:center;gap:5px}
.av{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:600}
.av.blue{background:var(--accent-dim);color:var(--accent)}
.av.amber{background:var(--amber-dim);color:var(--amber)}
.av.green{background:var(--green-dim);color:var(--green)}

/* Scrollbar */
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:3px}

/* 处理操作样式 */
.process-form {
  padding: 8px 0;
}

.process-form .el-form-item {
  margin-bottom: 20px;
}

.process-form .el-radio-group {
  display: flex;
  gap: 20px;
}

.process-form .el-radio {
  margin-right: 0;
}
</style>