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
            <span class="sb done" style="float: right">{{ reviewInfo.hasReviewed ? '已评价' : '已完成' }}</span>
          </div>
          <div class="detail-kv">
            <div class="kv-item"><label>服务名称</label><span>统一身份认证组件</span></div>
            <div class="kv-item"><label>服务规格</label><span>支持OAuth2.0/SAML，含SSO单点登录</span></div>
            <div class="kv-item"><label>服务类型</label><span>能力组件服务</span></div>
            <div class="kv-item"><label>申请人</label><span>张三</span></div>
            <div class="kv-item"><label>申请机构</label><span>北京市海淀区数字经济发展局</span></div>
            <div class="kv-item"><label>申请时间</label><span class="mono">2024-03-10 09:15:00</span></div>
            <div class="kv-item full"><label>申请备注</label><span class="muted">本次申请统一身份认证组件，需支持OAuth2.0/SAML协议，含SSO单点登录功能，请安排团队完成部署与联调。</span></div>
          </div>
        </el-card>

        <!-- 流程进度 -->
        <el-card shadow="hover" class="description-card">
          <div slot="header" class="clearfix">
            <span>流程进度</span>
          </div>
          <div class="tl">
            <div class="tl-row"><div class="tl-spine"><div class="tl-dot done"></div><div class="tl-vl"></div></div><div class="tl-body"><div class="tl-title done">提交申请</div><div class="tl-time">2024-03-10 09:15:00 · 张三</div></div></div>
            <div class="tl-row"><div class="tl-spine"><div class="tl-dot done"></div><div class="tl-vl"></div></div><div class="tl-body"><div class="tl-title done">系统派发工单</div><div class="tl-time">2024-03-10 10:30:00 · 自动派发 → TK-0234</div></div></div>
            <div class="tl-row"><div class="tl-spine"><div class="tl-dot done"></div><div class="tl-vl"></div></div><div class="tl-body"><div class="tl-title done">工单流转中</div><div class="tl-time">2024-03-10 10:35:00</div></div></div>
            <div class="tl-row"><div class="tl-spine"><div class="tl-dot done"></div><div class="tl-vl"></div></div><div class="tl-body"><div class="tl-title done">服务交付完成</div><div class="tl-time">2024-03-12 16:20:00 · 收到工单系统交付完成回执</div></div></div>
            <div class="tl-row"><div class="tl-spine"><div class="tl-dot on"></div><div class="tl-vl"></div></div><div class="tl-body"><div class="tl-title on">服务评价</div><div class="tl-time">{{ reviewInfo.hasReviewed ? '已完成满意度评价' : '可新增满意度评价' }}</div></div></div>
            <div class="tl-row"><div class="tl-spine"><div class="tl-dot wait"></div><div class="tl-vl"></div></div><div class="tl-body"><div class="tl-title wait">订单驳回</div><div class="tl-time">工单驳回后记录驳回时间</div></div></div>
            <div class="tl-row"><div class="tl-spine"><div class="tl-dot wait"></div></div><div class="tl-body"><div class="tl-title wait">订单取消</div><div class="tl-time">用户取消订单后记录取消时间</div></div></div>
          </div>
        </el-card>

        <!-- 满意度评价 -->
        <el-card shadow="hover" class="description-card">
          <div slot="header" class="clearfix">
            <span>满意度评价</span>
            <el-button
              type="primary"
              size="small"
              style="float: right"
              :disabled="!canReview"
              @click="openReviewDialog"
            >新增满意度评价</el-button>
          </div>
          <div class="review-result">
            <div class="review-score-row">
              <span class="review-label">满意度评分</span>
              <el-rate v-if="reviewInfo.hasReviewed" v-model="reviewInfo.score" disabled />
              <span v-else class="review-desc">--</span>
            </div>
            <div class="review-score-row">
              <span class="review-label">评价内容</span>
              <span class="review-desc">{{ reviewInfo.hasReviewed ? reviewInfo.description : '--' }}</span>
            </div>
            <div class="review-score-row">
              <span class="review-label">评价时间</span>
              <span class="review-desc mono">{{ reviewInfo.hasReviewed ? reviewInfo.reviewTime : '--' }}</span>
            </div>
          </div>
        </el-card>
      </div>

      <div class="detail-right">
        <!-- 关联工单 -->
        <el-card shadow="hover" class="mb-4">
          <div slot="header" class="clearfix">
            <span>关联工单</span>
          </div>
          <div style="border:1px solid #b2f2bb;border-left:3px solid #2f9e44;border-radius:8px;padding:12px;background:#ebfbee">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">
              <span style="font-family:'DM Mono',monospace;font-size:11px;color:#2f9e44;font-weight:600">TK-0235</span>
            </div>
            <div style="font-size:13px;font-weight:500;margin-bottom:5px;color:#1c2033">统一身份认证组件部署交付</div>
            <div class="av-chip" style="font-size:11px;color:#9aa0b8">负责人：王五（安全团队）</div>
          </div>
          <div style="display:flex;gap:6px;margin-top:10px">
            <el-button plain size="small" style="width:100%">查看工单</el-button>
          </div>
        </el-card>

      </div>
    </div>

    <!-- 新增满意度评价弹窗 -->
    <el-dialog title="新增满意度评价" :visible.sync="reviewDialogVisible" width="520px" :close-on-click-modal="false" :modal-append-to-body="false" custom-class="review-dialog">
      <el-form ref="reviewFormRef" :model="reviewForm" :rules="reviewRules" label-width="100px" class="review-dialog-form">
        <el-form-item label="满意度评分" prop="score">
          <el-rate v-model="reviewForm.score" />
        </el-form-item>
        <el-form-item label="评价描述" prop="description">
          <el-input v-model="reviewForm.description" type="textarea" :rows="4" placeholder="请输入评价描述（非必填）" maxlength="500" show-word-limit />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reviewDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReview">提交评价</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'OrderMyInitiatedDetail',
  data() {
    return {
      source: 'initiated',
      orderStatus: '已完成',
      reviewInfo: {
        hasReviewed: false,
        score: 0,
        description: '',
        reviewTime: ''
      },
      reviewDialogVisible: false,
      reviewForm: {
        score: 0,
        description: ''
      },
      reviewRules: {
        score: [
          { required: true, message: '请选择满意度评分', trigger: 'change', type: 'number', min: 1 }
        ]
      }
    };
  },
  computed: {
    canReview() {
      return this.source === 'initiated' && this.orderStatus === '已完成' && !this.reviewInfo.hasReviewed;
    }
  },
  created() {
    if (this.$route.query.source) {
      this.source = this.$route.query.source;
    }
  },
  methods: {
    goBack() {
      this.$router.push('/workorder/order/myInitiated');
    },
    openReviewDialog() {
      this.reviewForm = { score: 0, description: '' };
      this.reviewDialogVisible = true;
      this.$nextTick(() => {
        if (this.$refs.reviewFormRef) {
          this.$refs.reviewFormRef.clearValidate();
        }
      });
    },
    submitReview() {
      this.$refs.reviewFormRef.validate(valid => {
        if (!valid) return;
        const now = new Date();
        const pad = n => (n < 10 ? '0' + n : '' + n);
        const reviewTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        this.reviewInfo = {
          hasReviewed: true,
          score: this.reviewForm.score,
          description: this.reviewForm.description || '--',
          reviewTime
        };
        this.reviewDialogVisible = false;
        this.$message.success('评价提交成功');
      });
    },
    forceCloseOrder() {
      this.$confirm('确定要强制关单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('强制关单成功');
      }).catch(() => {});
    },
    cancelOrder() {
      this.$confirm('确定要取消订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        this.$message.success('订单取消成功');
      }).catch(() => {});
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
.av.amber{background:#fff9db;color:#e67700}
.av.green{background:#ebfbee;color:#2f9e44}

/* Scrollbar */
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:#c8cdd9;border-radius:3px}

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
  background-color: #ecf5ff;
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

/* 满意度评价 */
.review-result {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 4px 0;
}

.review-score-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.review-label {
  color: #8c8c8c;
  font-size: 14px;
  width: 100px;
  flex-shrink: 0;
  font-weight: 400;
  white-space: nowrap;
}

.review-desc {
  color: #262626;
  font-size: 14px;
  flex: 1;
  font-weight: 400;
  word-break: break-all;
  min-width: 0;
}

.review-desc.mono {
  font-family: 'DM Mono', monospace;
  font-size: 13px;
}

.review-placeholder {
  padding: 20px 0;
  text-align: center;
}

.review-placeholder-text {
  color: #9aa0b8;
  font-size: 13px;
}
</style>