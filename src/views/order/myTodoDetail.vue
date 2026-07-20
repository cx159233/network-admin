<template>
  <div class="detail-container">
    <!-- 顶部标题区域 -->
    <div class="detail-header-wrap">
      <el-button size="small" @click="goBack" class="back-btn">
        <i class="el-icon-arrow-left"></i> 返回列表
      </el-button>
    </div>

    <!-- 工单详情内容 -->
    <div class="detail-content-wrap">
      <div class="detail-left">
        <!-- 订单基本信息 -->
        <el-card shadow="hover" class="mb-4">
          <div slot="header" class="clearfix">
            <span>订单基本信息</span>
            <span class="sb processing" style="float: right">工单流转中</span>
          </div>
          <div class="detail-kv">
            <div class="kv-item"><label>服务名称</label><span>等保三级合规评估</span></div>
            <div class="kv-item"><label>服务规格</label><span>差距分析 + 渗透测试 + 整改报告</span></div>
            <div class="kv-item"><label>服务类型</label><span>安全服务</span></div>
            <div class="kv-item"><label>申请人</label><span>张三</span></div>
            <div class="kv-item"><label>申请机构</label><span>北京市海淀区数字经济发展局</span></div>
            <div class="kv-item"><label>申请时间</label><span class="mono">2024-03-15 14:32:00</span></div>
            <div class="kv-item"><label>服务周期</label><span>1年（2024-03 至 2025-03）</span></div>
            <div class="kv-item"><label>审批人</label><span><span class="av-chip"><span class="av blue">李</span> 李四 · IT管理员</span></span></div>
            <div class="kv-item"><label>审批时间</label><span class="mono">2024-03-15 16:08:00</span></div>
            <div class="kv-item full"><label>申请备注</label><span class="muted">本次申请等保三级评估，包含差距分析、渗透测试和整改报告，请安排专业团队对接。</span></div>
          </div>
        </el-card>

        <!-- 流程进度 -->
        <el-card shadow="hover" class="description-card">
          <div slot="header" class="clearfix">
            <span>流程进度</span>
          </div>
          <div class="tl">
            <div class="tl-row"><div class="tl-spine"><div class="tl-dot done"></div><div class="tl-vl"></div></div><div class="tl-body"><div class="tl-title done">提交申请</div><div class="tl-time">2024-03-15 14:32:00 · 张三</div></div></div>
            <div class="tl-row"><div class="tl-spine"><div class="tl-dot done"></div><div class="tl-vl"></div></div><div class="tl-body"><div class="tl-title done">系统派发工单</div><div class="tl-time">2024-03-15 16:10:00 · 自动派发 → TK-0234</div></div></div>
            <div class="tl-row"><div class="tl-spine"><div class="tl-dot on"></div><div class="tl-vl"></div></div><div class="tl-body"><div class="tl-title on">工单流转中</div><div class="tl-time">2024-03-15 16:15:00</div></div></div>
            <div class="tl-row"><div class="tl-spine"><div class="tl-dot wait"></div><div class="tl-vl"></div></div><div class="tl-body"><div class="tl-title wait">服务交付完成</div><div class="tl-time">等待工单系统回执</div></div></div>
            <div class="tl-row"><div class="tl-spine"><div class="tl-dot wait"></div><div class="tl-vl"></div></div><div class="tl-body"><div class="tl-title wait">服务评价</div><div class="tl-time">交付完成后可评价</div></div></div>
            <div class="tl-row"><div class="tl-spine"><div class="tl-dot wait"></div><div class="tl-vl"></div></div><div class="tl-body"><div class="tl-title wait">订单驳回</div><div class="tl-time">工单驳回后记录驳回时间</div></div></div>
            <div class="tl-row"><div class="tl-spine"><div class="tl-dot wait"></div></div><div class="tl-body"><div class="tl-title wait">订单取消</div><div class="tl-time">用户取消订单后记录取消时间</div></div></div>
          </div>
        </el-card>
      </div>

      <div class="detail-right">
        <!-- 关联工单 -->
        <el-card shadow="hover" class="mb-4">
          <div slot="header" class="clearfix">
            <span>关联工单</span>
          </div>
          <div style="border:1px solid #ffec99;border-left:3px solid #e67700;border-radius:8px;padding:12px;background:#fff9db">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">
              <span style="font-family:'DM Mono',monospace;font-size:11px;color:#e67700;font-weight:600">TK-0234</span>
            </div>
            <div style="font-size:13px;font-weight:500;margin-bottom:5px;color:#1c2033">等保三级合规评估服务交付</div>
            <div style="font-size:12px;color:#5c6480;line-height:1.6;margin-bottom:8px">已与申请人确认评估范围，覆盖3个核心系统，本周五启动现场评估。</div>
            <div class="av-chip" style="font-size:11px;color:#9aa0b8"><span class="av amber">王</span> 负责人：王五（安全团队）</div>
          </div>
          <div style="display:flex;gap:6px;margin-top:10px">
            <el-button plain size="small" style="width:100%">查看工单</el-button>
          </div>
        </el-card>

        <!-- 处理操作 -->
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>处理操作</span>
          </div>
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
/* Main */
.detail-container {
  display: flex;
  flex-direction: column;
  padding: 0 !important;
  margin: -20px;
  min-height: calc(100vh - 50px);
  background-color: #f2f4f8;
}

.detail-header-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
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

.detail-content-wrap {
  display: flex;
  gap: 14px;
  padding: 16px 20px 16px;
  flex: 1;
  overflow-y: auto;
  background-color: #f2f4f8;
}

.detail-left {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-left > * { min-width: 0; overflow: hidden; }

.detail-right {
  width: 272px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
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
  color: #303133;
  font-size: 14px;
}

/* 键值对网格 */
.detail-kv {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 6px 40px;
  overflow: hidden;
}

.kv-item {
  display: flex;
  align-items: baseline;
  font-size: 14px;
  line-height: 2;
}

.kv-item.full {
  grid-column: 1 / -1;
}

.kv-item label {
  color: #8c8c8c;
  width: 100px;
  flex-shrink: 0;
  font-weight: 400;
  white-space: nowrap;
}

.kv-item span {
  color: #262626;
  word-break: break-all;
  font-weight: 400;
  font-size: 14px;
  min-width: 0;
}

.kv-item .mono {
  font-family: 'DM Mono', monospace;
  font-size: 13px;
}

.kv-item .muted {
  color: #262626;
}

/* Status badge */
.sb{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600;white-space:nowrap}
.sb::before{content:'';width:5px;height:5px;border-radius:50%;flex-shrink:0}
.sb.processing{background:#eef2ff;color:#3b5bdb}
.sb.processing::before{background:#3b5bdb;animation:blink 1.5s infinite}
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
.av.blue{background:#eef2ff;color:#3b5bdb}

/* Scrollbar */
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:#c8cdd9;border-radius:3px}

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