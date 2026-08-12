<template>
  <div class="detail-container">
    <div class="detail-header-wrap">
      <el-button size="small" @click="goBack" class="back-btn">
        <i class="el-icon-arrow-left"></i> 返回列表
      </el-button>
    </div>

    <div class="detail-content-wrap">
      <div class="detail-left">
        <!-- 服务基本信息 -->
        <el-card shadow="hover" class="mb-4">
          <div slot="header" class="clearfix">
            <span>服务基本信息</span>
          </div>

          <div class="detail-section">
            <div class="detail-section-title">基本信息</div>
            <div class="detail-kv">
              <div class="kv-item"><label>服务ID</label><span>{{ serviceInfo.serviceId || '--' }}</span></div>
              <div class="kv-item"><label>服务名称</label><span>{{ serviceInfo.serviceName || '--' }}</span></div>
              <div class="kv-item"><label>服务类型</label><span>{{ serviceInfo.serviceType || '--' }}</span></div>
              <div class="kv-item"><label>显示顺序</label><span>{{ serviceInfo.sortOrder || '0' }}</span></div>
              <div class="kv-item full"><label>服务描述</label><span>{{ serviceInfo.description || '--' }}</span></div>
            </div>
          </div>

          <div class="detail-section">
            <div class="detail-section-title">服务信息</div>
            <div class="detail-kv">
              <div class="kv-item"><label>部署云服务商</label><span>{{ serviceInfo.cloudProvider || '--' }}</span></div>
              <div class="kv-item"><label>区域</label><span>{{ serviceInfo.region || '--' }}</span></div>
            </div>
          </div>

          <div class="detail-section">
            <div class="detail-section-title">附件材料</div>
            <div class="detail-kv">
              <div class="kv-item full">
                <a v-for="(m, i) in serviceInfo.materials" :key="i" class="file-link" href="javascript:void(0)" @click="downloadMaterial(m)">{{ m.name }}</a>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 审核记录 -->
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>审核记录</span>
          </div>
          <el-table :data="auditRecords" size="small" class="audit-table" :header-cell-style="{background:'#f5f7fa'}">
            <el-table-column label="提交时间" width="150">
              <template slot-scope="scope">{{ scope.row.submitTime || '--' }}</template>
            </el-table-column>
            <el-table-column prop="status" label="审核状态" width="100">
              <template slot-scope="scope">
                <el-tag :type="getAuditStatusType(scope.row.status)" size="mini" effect="dark">{{ getAuditStatusText(scope.row.status) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="审核人" width="110">
              <template slot-scope="scope">{{ scope.row.auditor || '--' }}</template>
            </el-table-column>
            <el-table-column label="审核时间" width="150">
              <template slot-scope="scope">{{ scope.row.auditTime || '--' }}</template>
            </el-table-column>
            <el-table-column label="审核意见" min-width="200" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.opinion || '--' }}</template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>

      <div class="detail-right">
        <!-- 评价信息 -->
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>评价信息</span>
          </div>
          <div class="review-section">
            <div class="review-row">
              <span class="review-label">平台评分</span>
              <el-rate v-model="serviceInfo.platformRating" disabled show-score />
            </div>
            <div class="review-row">
              <span class="review-label">用户评分</span>
              <el-rate v-model="serviceInfo.usageRating" disabled show-score />
            </div>
            <div class="review-dimensions">
              <div class="dim-item" v-for="d in dimLabels" :key="d">
                <span class="dim-label">{{ d }}</span>
                <span class="dim-score">{{ avgDimScores[d] }}</span>
              </div>
            </div>
            <div class="review-row">
              <span class="review-label">评价数量</span>
              <span class="review-count-link" @click="openReviewList">{{ reviewListAll.length }} 条</span>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 用户评分列表弹窗 -->
    <el-dialog title="用户评分列表" :visible.sync="reviewDialogVisible" width="1050px" :modal-append-to-body="false">
      <el-table :data="reviewList" size="small" style="width: 100%" :header-cell-style="{background:'#f5f7fa'}">
        <el-table-column label="评分" width="200">
          <template slot-scope="scope">
            <div class="dim-compact">
              <div class="dim-compact-row">
                <span class="dim-compact-label">准确性</span>
                <span class="dim-compact-score" :class="scoreClass(scope.row.ratings['准确性'])">{{ scope.row.ratings['准确性'] }}</span>
                <span class="dim-compact-label">稳定性</span>
                <span class="dim-compact-score" :class="scoreClass(scope.row.ratings['稳定性'])">{{ scope.row.ratings['稳定性'] }}</span>
              </div>
              <div class="dim-compact-row">
                <span class="dim-compact-label">响应时效</span>
                <span class="dim-compact-score" :class="scoreClass(scope.row.ratings['响应时效'])">{{ scope.row.ratings['响应时效'] }}</span>
                <span class="dim-compact-label">业务适配性</span>
                <span class="dim-compact-score" :class="scoreClass(scope.row.ratings['业务适配性'])">{{ scope.row.ratings['业务适配性'] }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="服务/订单号" min-width="200">
          <template slot-scope="scope">
            <div><div class="rv-title">{{ scope.row.serviceName || '--' }}</div><div class="rv-sub">{{ scope.row.orderNo || '--' }}</div></div>
          </template>
        </el-table-column>
        <el-table-column label="评价机构" min-width="180">
          <template slot-scope="scope">{{ scope.row.orgName || '--' }}</template>
        </el-table-column>
        <el-table-column label="评价内容" min-width="250">
          <template slot-scope="scope"><div class="rv-content">{{ scope.row.content || '--' }}</div></template>
        </el-table-column>
        <el-table-column label="评价时间" width="130">
          <template slot-scope="scope">{{ scope.row.time || '--' }}</template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === '已回复' ? 'success' : 'warning'" size="mini">{{ scope.row.status || '--' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="回复内容" min-width="250">
          <template slot-scope="scope"><div class="rv-content">{{ scope.row.reply || '--' }}</div></template>
        </el-table-column>
        <el-table-column label="回复时间" width="130">
          <template slot-scope="scope">{{ scope.row.replyTime || '--' }}</template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          :current-page="reviewPage.currentPage"
          :page-size="reviewPage.pageSize"
          :total="reviewPage.total"
          layout="total, prev, pager, next, jumper"
          @current-change="handleReviewPageChange"
          @size-change="handleReviewSizeChange"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import emitter from "@/utils/emitter";
export default {
  name: 'BasicServiceDetail',
  data() {
    return {
      serviceInfo: {
        id: '',
        serviceId: '',
        serviceName: '',
        description: '',
        sortOrder: 0,
        cloudProvider: '',
        serviceType: '',
        region: '',
        submitTime: '',
        platformRating: 0,
        usageRating: 0,
        materials: []
      },
      auditRecords: [],
      reviewListAll: [],
      reviewList: [],
      reviewDialogVisible: false,
      dimLabels: ['准确性', '稳定性', '响应时效', '业务适配性'],
      reviewPage: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  computed: {
    avgDimScores() {
      const dims = { '准确性': 0, '稳定性': 0, '响应时效': 0, '业务适配性': 0 };
      const list = this.reviewListAll;
      if (!list.length) return dims;
      this.dimLabels.forEach(d => {
        let sum = 0;
        list.forEach(r => { sum += (r.ratings && r.ratings[d]) || 0; });
        dims[d] = (sum / list.length).toFixed(1);
      });
      return dims;
    },
  },
  watch: {
    reviewDialogVisible(val) {
      if (val) { emitter.emit('set-prd-anchor', 'prd-3.2.1.3.4'); }
    },
  },
  created() {
    const q = this.$route.query;
    // 加载服务基本信息
    this.serviceInfo = {
      ...this.serviceInfo,
      id: q.id || '1',
      serviceId: q.serviceId || 'SVC-2024-0001',
      serviceName: q.serviceName || '弹性计算服务 ECS',
      description: q.description || '弹性计算服务（ECS）是一种简单高效、处理能力可弹性伸缩的计算服务，帮助快速构建更稳定、安全的应用，提升运维效率，降低 IT 成本。',
      sortOrder: parseInt(q.sortOrder) || 1,
      cloudProvider: q.cloudProvider || '浪潮云',
      serviceType: q.serviceType || '计算服务',
      region: q.region || '华东',
      submitTime: q.submitTime || '2024-03-01 10:00:00',
      platformRating: parseFloat(q.platformRating) || parseFloat((Math.random() * 4 + 1).toFixed(1)),
      usageRating: parseFloat(q.usageRating) || parseFloat((Math.random() * 4 + 1).toFixed(1)),
      materials: [
        { name: '服务技术白皮书.pdf', size: '3.2 MB' },
        { name: '安全合规认证.pdf', size: '1.5 MB' },
        { name: '服务等级协议 SLA.pdf', size: '920 KB' },
        { name: '厂商资质证明.pdf', size: '1.1 MB' }
      ]
    };
    this.loadAuditRecords();
    this.loadReviewList();
  },
  methods: {
    scoreClass(val) {
      if (val >= 4) return 'score-high';
      if (val >= 3) return 'score-mid';
      return 'score-low';
    },
    goBack() {
      this.$router.push('/portal/service/serviceCatalog');
    },
    loadAuditRecords() {
      this.auditRecords = [
        {
          id: '1',
          submitTime: '2024-03-01 10:00',
          status: 'approved',
          auditor: '平台管理员',
          auditTime: '2024-03-02 09:30',
          opinion: '服务符合上架标准，审核通过。'
        },
        {
          id: '2',
          submitTime: '2024-03-05 11:00',
          status: 'pending',
          auditor: '',
          auditTime: '',
          opinion: ''
        }
      ];
    },
    loadReviewList() {
      this.reviewListAll = [
        {
          id: '1',
          ratings: { '准确性': 5, '稳定性': 5, '响应时效': 4, '业务适配性': 5 },
          serviceName: '云存储服务',
          orderNo: 'ORD20240118001',
          orgName: '测试机构',
          content: '服务稳定，响应速度快，非常满意！',
          time: '2024-01-18 09:30:00',
          status: '已回复',
          reply: '感谢您的认可！',
          replyTime: '2024-01-18 10:00:00'
        },
        {
          id: '2',
          ratings: { '准确性': 4, '稳定性': 4, '响应时效': 5, '业务适配性': 4 },
          serviceName: '云存储服务',
          orderNo: 'ORD20240115002',
          orgName: '研发部门',
          content: '存储空间充足，价格合理',
          time: '2024-01-15 14:00:00',
          status: '待回复',
          reply: '--',
          replyTime: '--'
        },
        {
          id: '3',
          ratings: { '准确性': 5, '稳定性': 4, '响应时效': 5, '业务适配性': 5 },
          serviceName: '云存储服务',
          orderNo: 'ORD20240112003',
          orgName: '产品部门',
          content: 'API文档清晰，集成简单',
          time: '2024-01-12 11:20:00',
          status: '已回复',
          reply: '感谢反馈，我们会持续优化文档',
          replyTime: '2024-01-12 12:00:00'
        }
      ];
      this.reviewPage.total = this.reviewListAll.length;
      this.updateReviewList();
    },
    updateReviewList() {
      const start = (this.reviewPage.currentPage - 1) * this.reviewPage.pageSize;
      const end = start + this.reviewPage.pageSize;
      this.reviewList = this.reviewListAll.slice(start, end);
    },
    handleReviewPageChange(val) {
      this.reviewPage.currentPage = val;
      this.updateReviewList();
    },
    handleReviewSizeChange(val) {
      this.reviewPage.pageSize = val;
      this.updateReviewList();
    },
    openReviewList() {
      this.reviewPage.currentPage = 1;
      this.updateReviewList();
      this.reviewDialogVisible = true;
    },
    goToReview() {
      this.$message.info('评价功能开发中');
    },
    downloadMaterial(material) {
      this.$message.success('下载附件：' + material.name);
    },
    getAuditStatusType(status) {
      const map = { approved: 'success', rejected: 'danger', pending: 'warning' };
      return map[status] || 'info';
    },
    getAuditStatusText(status) {
      const map = { approved: '已通过', rejected: '已驳回', pending: '待审核' };
      return map[status] || '未知';
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

.back-btn { border-radius: 4px; padding: 8px 16px; font-weight: 500; }
.back-btn:hover { background-color: #ecf5ff; border-color: #409eff; color: #409eff; }

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

.detail-left > * {
  min-width: 0;
  overflow: hidden;
}

.detail-right {
  width: 272px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card-header {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #303133;
  font-size: 14px;
}

.logo-thumb {
  height: 22px;
  border-radius: 3px;
  vertical-align: middle;
}

/* 分组 */
.detail-section {
  margin-bottom: 16px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

/* 审核记录表格 */
.audit-table {
  min-height: auto !important;
}

.audit-table :deep(.el-table) {
  --el-table-row-height: 32px !important;
}

.audit-table :deep(.el-table__row) {
  height: 32px !important;
  line-height: 32px !important;
}

.audit-table :deep(.el-table__header-wrapper) {
  padding: 0 !important;
  margin: 0 !important;
}

.audit-table :deep(.el-table__body-wrapper) {
  padding: 0 !important;
  margin: 0 !important;
}

.audit-table :deep(.el-table td),
.audit-table :deep(.el-table th) {
  padding: 6px 12px !important;
}

.detail-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 14px;
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.kv-item .mono {
  font-family: 'DM Mono', monospace;
  font-size: 13px;
}

.file-link {
  display: inline-block;
  margin: 2px 16px 2px 0;
  font-size: 13px;
  color: #3b5bdb;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}

.file-link:hover {
  color: #2f3ea5;
}

/* Review Section */
.review-section { display: flex; flex-direction: column; gap: 12px; padding: 4px 0; }
.review-row { display: flex; align-items: center; gap: 16px; }
.review-label { color: #8c8c8c; font-size: 14px; width: 72px; flex-shrink: 0; font-weight: 400; }
.review-count-link { color: #409eff; font-size: 13px; cursor: pointer; font-weight: 500; }
.review-count-link:hover { text-decoration: underline; }

/* Stars */
.stars { display: flex; gap: 2px; }
.star { font-size: 14px; color: #d9d9d9; }
.star.full { color: #faad14; }

.rv-title { font-size: 14px; font-weight: 500; color: #262626; }
.rv-sub { font-size: 12px; color: #8c8c8c; margin-top: 4px; }
.rv-content { font-size: 12px; color: #5c6480; line-height: 1.5; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

/* 四维度评分 */
.review-dimensions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 12px;
  padding: 8px 0 0;
  border-top: 1px solid #f0f0f0;
  margin-top: 4px;
}
.dim-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
}
.dim-label { color: #8c8c8c; }
.dim-score { font-weight: 600; color: #409eff; }

.dim-compact { display: flex; flex-direction: column; gap: 4px; }
.dim-compact-row { display: flex; align-items: center; gap: 4px; }
.dim-compact-label { font-size: 11px; color: #8c8c8c; width: 52px; flex-shrink: 0; }
.dim-compact-score {
  display: inline-flex; align-items: center; justify-content: center;
  width: 28px; height: 22px; border-radius: 4px;
  font-size: 12px; font-weight: 600;
  margin-right: 4px;
}
.score-high { background: #ebfbee; color: #2f9e44; }
.score-mid { background: #fff9db; color: #e67700; }
.score-low { background: #fff5f5; color: #c92a2a; }

/* 弹窗仅覆盖左侧Demo区域 */
:deep(.el-dialog__wrapper) {
  position: absolute !important;
}
:deep(.v-modal) {
  position: absolute !important;
}

::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #c8cdd9; border-radius: 3px; }
</style>