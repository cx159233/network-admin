<template>
  <div class="detail-container">
    <div class="detail-header-wrap">
      <el-button size="small" @click="goBack" class="back-btn">
        <i class="el-icon-arrow-left"></i> 返回列表
      </el-button>
    </div>

    <div class="detail-content-wrap">
      <div class="detail-left">
        <el-card shadow="hover" class="mb-4">
          <div slot="header" class="clearfix">
            <span>需求信息</span>
            <span class="sb" :class="statusClass" style="float: right">{{ demandInfo.status }}</span>
          </div>
          <div class="detail-kv">
            <div class="kv-item"><label>需求编号</label><span class="mono">{{ demandInfo.demandNo }}</span></div>
            <div class="kv-item"><label>服务类型</label><span>{{ demandInfo.serviceType }}</span></div>
            <div class="kv-item"><label>申请机构</label><span>{{ demandInfo.orgName }}</span></div>
            <div class="kv-item"><label>申请人</label><span>{{ demandInfo.applicant }}</span></div>
            <div class="kv-item"><label>需求状态</label><span>{{ demandInfo.status }}</span></div>
            <div class="kv-item"><label>发布时间</label><span class="mono">{{ demandInfo.publishTime }}</span></div>
            <div class="kv-item full"><label>需求描述</label><span>{{ demandInfo.demandDescription }}</span></div>
          </div>
        </el-card>

        <el-card shadow="hover" class="description-card">
          <div slot="header" class="clearfix">
            <span>响应信息</span>
          </div>
          <div class="detail-kv">
            <div class="kv-item"><label>响应机构</label><span>{{ demandInfo.respondent || '--' }}</span></div>
            <div class="kv-item"><label>响应时间</label><span class="mono">{{ demandInfo.responseTime || '--' }}</span></div>
            <div class="kv-item full"><label>响应内容</label><span>{{ demandInfo.responseContent }}</span></div>
            <div class="kv-item"><label>预估报价</label><span>¥{{ demandInfo.estimatedPrice }}</span></div>
            <div class="kv-item"><label>预计工期</label><span>{{ demandInfo.estimatedDuration || '--' }}</span></div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyDemandResponseDetail',
  data() {
    return {
      demandInfo: {
        demandNo: '#DM-2024-0007',
        demandDescription: '需要采购高性能GPU计算集群，用于AI模型训练',
        serviceType: '基础资源服务',
        orgName: '北京人工智能研究院',
        applicant: '王五',
        status: '已响应',
        publishTime: '2024-03-12 08:30:00',
        respondent: '北京云计算科技有限公司',
        responseContent: '我方可提供NVIDIA A100集群方案，包含8卡GPU服务器2台，配套分布式训练框架，支持PyTorch/TensorFlow。提供7×24小时运维支持。',
        estimatedPrice: '580,000',
        estimatedDuration: '45个工作日',
        responseTime: '2024-03-13 09:20:00'
      }
    };
  },
  computed: {
    statusClass() {
      const map = {
        '待响应': 'processing',
        '已响应': 'info',
        '已完成': 'done',
        '已关闭': 'closed'
      };
      return map[this.demandInfo.status] || '';
    }
  },
  methods: {
    goBack() {
      this.$router.push('/workorder/myDemand/response');
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

.detail-left .mb-4 {
  margin-bottom: 0 !important;
}

.description-card {
  margin-bottom: 0;
}

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

.sb{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600;white-space:nowrap}
.sb::before{content:'';width:5px;height:5px;border-radius:50%;flex-shrink:0}
.sb.processing{background:#fff9db;color:#e67700}
.sb.processing::before{background:#e67700}
.sb.info{background:#eef2ff;color:#3b5bdb}
.sb.info::before{background:#3b5bdb}
.sb.done{background:#ebfbee;color:#2f9e44}
.sb.done::before{background:#2f9e44}
.sb.closed{background:#fff5f5;color:#c92a2a}
.sb.closed::before{background:#c92a2a}

::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:#c8cdd9;border-radius:3px}
</style>
