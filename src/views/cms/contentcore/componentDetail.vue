<template>
  <div class="detail-container">
    <div class="detail-header-wrap">
      <el-button size="small" @click="goBack" class="back-btn">
        <i class="el-icon-arrow-left"></i> 返回列表
      </el-button>
    </div>

    <div class="detail-content-wrap">
      <div class="detail-left">
        <!-- 组件基本信息 -->
        <el-card shadow="hover" class="mb-4">
          <div slot="header" class="clearfix">
            <span>组件基本信息</span>
          </div>

          <div class="detail-section">
            <div class="detail-section-title">基本信息</div>
            <div class="detail-kv">
              <div class="kv-item"><label>组件ID</label><span>{{ compInfo.componentId || '--' }}</span></div>
              <div class="kv-item"><label>组件名称</label><span>{{ compInfo.name || '--' }}</span></div>
              <div class="kv-item"><label>状态</label><span>{{ compInfo.statusView || '--' }}</span></div>
              <div class="kv-item full"><label>组件描述</label><span>{{ compInfo.description || '--' }}</span></div>
              <div class="kv-item full"><label>付费方式参考</label><span>{{ compInfo.paymentMethodRef || '--' }}</span></div>
              <div class="kv-item"><label>显示顺序</label><span>{{ compInfo.sortOrder || '0' }}</span></div>
              <div class="kv-item"><label>服务征集得分</label><span>{{ compInfo.recruitScore != null ? compInfo.recruitScore : '--' }}</span></div>
            </div>
          </div>

          <div class="detail-section">
            <div class="detail-section-title">联系信息</div>
            <div class="detail-kv">
              <div class="kv-item"><label>服务商名称</label><span>{{ compInfo.serviceProviderName || '--' }}</span></div>
              <div class="kv-item"><label>联系人1</label><span>{{ compInfo.contact1Name || '--' }}</span></div>
              <div class="kv-item"><label>联系电话1</label><span>{{ compInfo.contact1Phone || '--' }}</span></div>
              <div class="kv-item"><label>联系人2</label><span>{{ compInfo.contact2Name || '--' }}</span></div>
              <div class="kv-item"><label>联系电话2</label><span>{{ compInfo.contact2Phone || '--' }}</span></div>
            </div>
          </div>

          <div class="detail-section">
            <div class="detail-section-title">分类标签</div>
            <div class="detail-kv">
              <div class="kv-item"><label>部署云服务商</label><span>{{ compInfo.deployServiceProviderView || '--' }}</span></div>
              <div class="kv-item"><label>开放范围</label><span>{{ compInfo.coverView || '--' }}</span></div>
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
              <el-rate v-model="compInfo.platformRating" disabled show-score />
            </div>
            <div class="review-row">
              <span class="review-label">用户评分</span>
              <el-rate v-model="compInfo.usageRating" disabled show-score />
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
  name: 'ComponentDetail',
  data() {
    return {
      compInfo: {
        id: '',
        componentId: '',
        name: '',
        description: '',
        paymentMethodRef: '',
        sortOrder: 0,
        recruitScore: null,
        status: 20,
        statusView: '已发布',
        serviceProviderName: '',
        contact1Name: '',
        contact1Phone: '',
        contact2Name: '',
        contact2Phone: '',
        deployServiceProviderView: '',
        coverView: '',
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
      if (val) { emitter.emit('set-prd-anchor', 'prd-3.2.1.2.4'); }
    },
  },
  created() {
    const q = this.$route.query;
    // 加载组件基本信息
    this.compInfo = {
      ...this.compInfo,
      id: q.id || '1',
      componentId: q.componentId || 'COMP-2024-001',
      name: q.name || '电子签章服务组件',
      description: q.description || '电子签章服务组件提供数字签名、电子印章、合同签署等能力，支持 PDF、OFD 等格式，符合国家电子签名法要求。',
      paymentMethodRef: q.paymentMethodRef || '按调用次数计费 0.05 元/次，包年包月 500 元/月',
      sortOrder: parseInt(q.sortOrder) || 1,
      recruitScore: q.recruitScore != null ? parseFloat(q.recruitScore) : 85,
      status: parseInt(q.status) || 20,
      statusView: parseInt(q.status) === 20 ? '已发布' : parseInt(q.status) === 30 ? '已下线' : '未知',
      serviceProviderName: q.serviceProviderName || '华为技术',
      contact1Name: q.contact1Name || '张经理',
      contact1Phone: q.contact1Phone || '13800138000',
      contact2Name: q.contact2Name || '李助理',
      contact2Phone: q.contact2Phone || '13900139000',
      deployServiceProviderView: q.deployServiceProviderView || '电信云',
      coverView: q.coverView || '不限',
      submitTime: q.submitTime || '2024-03-10 09:30',
      platformRating: parseFloat(q.platformRating) || parseFloat((Math.random() * 4 + 1).toFixed(1)),
      usageRating: parseFloat(q.usageRating) || parseFloat((Math.random() * 4 + 1).toFixed(1)),
      materials: [
        { name: '组件功能说明.pdf', size: '1.8 MB' },
        { name: '安全评估报告.pdf', size: '2.1 MB' },
        { name: '厂商资质证明.pdf', size: '960 KB' }
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
      this.$router.push('/portal/service/component');
    },
    loadAuditRecords() {
      this.auditRecords = [
        {
          id: '1',
          submitTime: '2024-03-10 09:30',
          status: 'approved',
          auditor: '平台管理员',
          auditTime: '2024-03-11 10:00',
          opinion: '组件功能符合标准，审核通过。'
        },
        {
          id: '2',
          submitTime: '2024-03-12 14:00',
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
          serviceName: '智能数据分析组件',
          orderNo: 'ORD20240120001',
          orgName: '测试机构',
          content: '组件功能强大，数据分析效果很好，推荐使用！',
          time: '2024-01-20 10:30:00',
          status: '已回复',
          reply: '感谢您的评价，我们会继续优化！',
          replyTime: '2024-01-20 11:00:00'
        },
        {
          id: '2',
          ratings: { '准确性': 4, '稳定性': 4, '响应时效': 5, '业务适配性': 4 },
          serviceName: '智能数据分析组件',
          orderNo: 'ORD20240118002',
          orgName: '研发部门',
          content: '使用体验不错，希望能增加更多可视化图表类型',
          time: '2024-01-18 14:20:00',
          status: '已回复',
          reply: '您的建议已收到，我们正在规划新版本功能',
          replyTime: '2024-01-18 15:00:00'
        },
        {
          id: '3',
          ratings: { '准确性': 5, '稳定性': 4, '响应时效': 5, '业务适配性': 5 },
          serviceName: '智能数据分析组件',
          orderNo: 'ORD20240116003',
          orgName: '产品部门',
          content: '文档清晰，集成简单，好评！',
          time: '2024-01-16 09:15:00',
          status: '待回复',
          reply: '--',
          replyTime: '--'
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