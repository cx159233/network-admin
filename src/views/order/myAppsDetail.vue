<template>
  <div class="detail-container">
    <div class="detail-header-wrap">
      <el-button size="small" @click="goBack" class="back-btn">
        <i class="el-icon-arrow-left"></i> 返回列表
      </el-button>
    </div>

    <div class="detail-content-wrap">
      <div class="detail-left">
        <!-- 应用基本信息 -->
        <el-card shadow="hover" class="mb-4">
          <div slot="header" class="clearfix">
            <span>应用基本信息</span>
            <span :class="['sb', getStatusClass(appInfo.status)]" style="float: right">{{ getStatusText(appInfo.status) }}</span>
          </div>

          <div class="detail-section">
            <div class="detail-section-title">基本信息</div>
            <div class="detail-kv">
              <div class="kv-item"><label>应用名称</label><span>{{ appInfo.appName || '--' }}</span></div>
              <div class="kv-item"><label>应用ID</label><span>{{ appInfo.applicationId || '--' }}</span></div>
              <div class="kv-item"><label>系统地址</label><span>{{ appInfo.systemUrl || '--' }}</span></div>
              <div class="kv-item"><label>应用LOGO</label><span><img v-if="appInfo.logo" :src="appInfo.logo" class="logo-thumb" /><template v-else>--</template></span></div>
              <div class="kv-item full"><label>应用描述</label><span>{{ appInfo.description || '--' }}</span></div>
            </div>
          </div>

          <div class="detail-section">
            <div class="detail-section-title">联系信息</div>
            <div class="detail-kv">
              <div class="kv-item"><label>服务商名称</label><span>{{ appInfo.serviceProvider || '--' }}</span></div>
              <div class="kv-item"><label>合作伙伴</label><span>{{ appInfo.deployServiceProviderView || '--' }}</span></div>
              <div class="kv-item"><label>联系人1</label><span>{{ appInfo.contactName1 || '--' }}</span></div>
              <div class="kv-item"><label>联系电话1</label><span>{{ appInfo.contactPhone1 || '--' }}</span></div>
              <div class="kv-item"><label>联系人2</label><span>{{ appInfo.contactName2 || '--' }}</span></div>
              <div class="kv-item"><label>联系电话2</label><span>{{ appInfo.contactPhone2 || '--' }}</span></div>
            </div>
          </div>

          <div class="detail-section">
            <div class="detail-section-title">分类标签</div>
            <div class="detail-kv">
              <div class="kv-item"><label>面向对象</label><span>{{ appInfo.targetView || '--' }}</span></div>
              <div class="kv-item"><label>应用架构</label><span>{{ appInfo.appArchitecture || '--' }}</span></div>
              <div class="kv-item"><label>部署云服务商</label><span>{{ appInfo.cloudProviderStr || '--' }}</span></div>
              <div class="kv-item"><label>应用覆盖范围</label><span>{{ appInfo.coverView || '--' }}</span></div>
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
            <el-table-column label="提交人" width="110">
              <template slot-scope="scope">{{ scope.row.createBy || '--' }}</template>
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
              <span class="review-label">平台评价</span>
              <el-rate v-model="appInfo.platformRating" disabled show-score />
            </div>
            <div class="review-row">
              <span class="review-label">用户评价</span>
              <el-rate v-model="appInfo.usageRating" disabled show-score />
            </div>
            <div class="review-row">
              <span class="review-label">评价数量</span>
              <span class="review-count-link" @click="openReviewList">{{ reviewListAll.length }} 条</span>
            </div>
          </div>
        </el-card>

      </div>
    </div>

    <!-- 用户评价列表弹窗 -->
    <el-dialog title="用户评价列表" :visible.sync="reviewDialogVisible" width="1050px" :modal-append-to-body="false">
      <el-table :data="reviewList" size="small" style="width: 100%" :header-cell-style="{background:'#f5f7fa'}">
        <el-table-column label="评分" width="80">
          <template slot-scope="scope">
            <div class="stars"><span v-for="i in 5" :key="i" class="star" :class="{ full: i <= scope.row.score }">★</span></div>
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

    <!-- 评价详情弹窗 -->
    <el-dialog title="评价详情" :visible.sync="reviewDetailVisible" width="600px" :modal-append-to-body="false">
      <div class="rv-detail">
        <div class="rv-detail-header">
          <div class="rv-detail-info">
            <div class="rv-detail-name">{{ currentReview.userName || '--' }} · {{ currentReview.department || '--' }}</div>
            <div class="rv-detail-org">{{ currentReview.orgName || '--' }}</div>
          </div>
          <div class="stars"><span v-for="i in 5" :key="i" class="star" :class="{ full: i <= currentReview.score }">★</span></div>
        </div>
        <div class="rv-detail-body">{{ currentReview.content || '--' }}</div>
        <div v-if="currentReview.reply" class="rv-detail-reply">
          <div class="rv-reply-label">客服回复</div>
          <div class="rv-reply-body">{{ currentReview.reply }}</div>
        </div>
      </div>
      <div slot="footer"><el-button @click="reviewDetailVisible = false">关闭</el-button></div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'MyAppsDetail',
  data() {
    return {
      appInfo: {
        id: 1,
        appName: '智能办公系统',
        status: 'published',
        applicationId: 'APP-2024-0001',
        serviceProvider: '腾讯科技',
        deployServiceProviderView: '北京协同科技有限公司',
        systemUrl: 'https://oa.tencent.com',
        logo: '',
        contactName1: '张经理',
        contactPhone1: '13800138000',
        contactName2: '李主管',
        contactPhone2: '13900139000',
        submitTime: '2024-01-01 10:00',
        description: '智能办公系统是一款集协同办公、文档管理、审批流程等功能于一体的企业级办公软件，旨在提高企业内部沟通效率和管理水平。',
        targetView: '基层医疗卫生机构、公立医院',
        appArchitecture: 'B/S',
        cloudProviderStr: '浪潮云、移动云',
        coverView: '医院信息系统（HIS）、基本公共卫生服务',
        platformRating: 4.5,
        usageRating: 4.2,
        materials: [
          { name: '应用截图.png', size: '2.4 MB' },
          { name: '应用说明文档.pdf', size: '1.8 MB' },
          { name: '安全评估报告.pdf', size: '890 KB' },
          { name: '厂商资质证明.pdf', size: '1.1 MB' }
        ]
      },
      reviewDialogVisible: false,
      reviewDetailVisible: false,
      currentReview: {},
      reviewList: [],
      reviewPage: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      reviewListAll: [
        { id: 1, score: 5, serviceName: '智能办公系统', orderNo: '#ORD-2024-0085', orgName: '华能数智科技集团', userName: '张三', department: '技术部', content: '系统非常稳定，功能齐全，满足我们日常办公需求，响应速度也很快。', time: '2024-03-15 10:30', status: '已回复', reply: '感谢您的好评，我们会继续努力提供更好的服务！' },
        { id: 2, score: 4, serviceName: '智能办公系统', orderNo: '#ORD-2024-0071', orgName: '中远云科技有限公司', userName: '王经理', department: '信息部', content: '整体不错，协同办公功能很好用，希望后续能增加移动端适配。', time: '2024-03-14 14:20', status: '已回复', reply: '感谢您的建议，移动端适配已在规划中，预计下个版本上线。' },
        { id: 3, score: 3, serviceName: '智能办公系统', orderNo: '#ORD-2024-0063', orgName: '北京协和医学院', userName: '李护士长', department: '信息科', content: '文档管理功能基本满足需求，但批量操作效率有待提升。', time: '2024-03-13 16:45', status: '待回复' }
      ],
      auditRecords: [
        { id: 1, submitTime: '2024-01-01 10:00', createBy: '张经理', status: 'approved', auditor: '平台管理员', auditTime: '2024-01-02 14:30', opinion: '审核通过，应用符合上架标准。' },
        { id: 2, submitTime: '2024-02-10 09:00', createBy: '张经理', status: 'rejected', auditor: '平台管理员', auditTime: '2024-02-11 16:00', opinion: '安全评估报告不完整，请补充后重新提交。' },
        { id: 3, submitTime: '2024-02-15 11:00', createBy: '张经理', status: 'approved', auditor: '平台管理员', auditTime: '2024-02-16 10:30', opinion: '材料已补齐，审核通过。' },
        { id: 4, submitTime: '2024-03-01 14:00', createBy: '张经理', status: 'pending', auditor: '', auditTime: '', opinion: '' }
      ]
    };
  },
  watch: {
    reviewDialogVisible(val) {
      // 详情页内评价下钻不再更新 PRD 锚点
    },
    reviewDetailVisible(val) {
      // 详情页内评价详情下钻不再更新 PRD 锚点
    },
  },
  created() {
    const q = this.$route.query;
    if (q && q.title) {
      this.appInfo = {
        ...this.appInfo,
        appName: q.title || '--',
        status: q.status || 'published',
        serviceProvider: q.serviceProvider || '--',
        systemUrl: q.systemUrl || '--',
        description: q.description || '--',
        deployServiceProviderView: q.deployServiceProviderView || '--',
        contactName1: q.contactName1 || '--',
        contactPhone1: q.contactPhone1 || '--',
        contactName2: q.contactName2 || '--',
        contactPhone2: q.contactPhone2 || '--',
        targetView: q.targetView || '--',
        coverView: q.coverView || '--',
        cloudProviderStr: q.cloudProviderStr || '--',
        platformRating: parseFloat(q.platformRating) || 0,
        usageRating: parseFloat(q.usageRating) || 0
      };
      this.reviewList.forEach(item => { item.serviceName = this.appInfo.appName; });
    }
  },
  methods: {
    goBack() {
      this.$router.push('/workorder/myApps');
    },
    openReviewList() {
      this.reviewPage.currentPage = 1;
      this.reviewPage.total = this.reviewListAll.length;
      this.loadReviewPage();
      this.reviewDialogVisible = true;
    },
    loadReviewPage() {
      const start = (this.reviewPage.currentPage - 1) * this.reviewPage.pageSize;
      const end = start + this.reviewPage.pageSize;
      this.reviewList = this.reviewListAll.slice(start, end);
    },
    handleReviewPageChange(val) {
      this.reviewPage.currentPage = val;
      this.loadReviewPage();
    },
    handleReviewSizeChange(val) {
      this.reviewPage.pageSize = val;
      this.reviewPage.currentPage = 1;
      this.loadReviewPage();
    },
    viewReviewDetail(row) {
      this.currentReview = JSON.parse(JSON.stringify(row));
      this.reviewDetailVisible = true;
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
    },
    getStatusClass(status) {
      const map = {
        0: 'draft', 10: 'approved', 20: 'pending', 30: 'rejected', 40: 'offline',
        draft: 'draft', pending_review: 'pending', published: 'approved', rejected: 'rejected', offline: 'offline'
      };
      return map[status] || '';
    },
    getStatusText(status) {
      const map = {
        0: '草稿', 10: '已发布', 20: '待审核', 30: '已驳回', 40: '已下线',
        draft: '草稿', pending_review: '待审核', published: '已发布', rejected: '已驳回', offline: '已下线'
      };
      return map[status] || status || '--';
    },
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
  background-color: #f2f4f8;
}

.detail-left {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-left > * {
  min-width: 0;
  overflow-x: hidden;
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

/* Timeline */
.tl { display: flex; flex-direction: column; padding: 8px 0; }
.tl-row { display: flex; gap: 12px; }
.tl-spine { display: flex; flex-direction: column; align-items: center; width: 14px; flex-shrink: 0; }
.tl-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
.tl-dot.done { background: #2f9e44; }
.tl-dot.on { background: #3b5bdb; box-shadow: 0 0 0 3px #c5d0fa; }
.tl-dot.wait { background: #c8cdd9; }
.tl-dot.red { background: #c92a2a; }
.tl-vl { flex: 1; width: 1px; background: #e3e7ef; margin: 3px 0; min-height: 16px; }
.tl-row:last-child .tl-vl { display: none; }
.tl-body { padding-bottom: 14px; flex: 1; }
.tl-title { font-size: 13px; font-weight: 500; margin-bottom: 2px; }
.tl-title.done { color: #5c6480; }
.tl-title.on { color: #1c2033; }
.tl-title.wait { color: #9aa0b8; }
.tl-title.red { color: #c92a2a; }
.tl-time { font-size: 11px; color: #9aa0b8; font-family: 'DM Mono', monospace; }

/* Stars */
.stars { display: flex; gap: 2px; }
.star { font-size: 14px; color: #d9d9d9; }
.star.full { color: #faad14; }
.rv-title { font-size: 12px; font-weight: 400; color: #262626; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
.rv-sub { font-size: 12px; color: #8c8c8c; margin-top: 2px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
.rv-content { font-size: 12px; color: #5c6480; line-height: 1.5; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }

/* Review Detail Dialog */
.rv-detail { padding: 16px; }
.rv-detail-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0; }
.rv-detail-info { flex: 1; }
.rv-detail-name { font-size: 13px; font-weight: 500; color: #1c2033; }
.rv-detail-org { font-size: 12px; color: #8c8c8c; margin-top: 4px; }
.rv-detail-body { font-size: 13px; color: #5c6480; line-height: 1.7; margin-bottom: 16px; }
.rv-detail-reply { background: #f7f8fa; border-left: 3px solid #1890ff; padding: 12px; border-radius: 4px; margin-top: 12px; }
.rv-reply-label { font-size: 11px; color: #1890ff; font-weight: 600; margin-bottom: 6px; }
.rv-reply-body { font-size: 12px; color: #5c6480; line-height: 1.6; }

/* 状态标签 */
.sb {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 12px;
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

.sb.draft { background: #f0f0f0; color: #666; }
.sb.draft::before { background: #666; }
.sb.pending { background: #fff9db; color: #e67700; }
.sb.pending::before { background: #e67700; }
.sb.approved { background: #ebfbee; color: #2f9e44; }
.sb.approved::before { background: #2f9e44; }
.sb.rejected { background: #fff5f5; color: #c92a2a; }
.sb.rejected::before { background: #c92a2a; }
.sb.offline { background: #f0f0f0; color: #999; }
.sb.offline::before { background: #999; }

/* 弹窗仅覆盖左侧Demo区域 */
:deep(.el-dialog__wrapper) {
  position: absolute !important;
}
:deep(.v-modal) {
  position: absolute !important;
}

/* Scrollbar */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }
</style>
