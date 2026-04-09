<template>
  <div class="detail-container">
    <!-- 顶部标题区域 -->
    <div class="detail-header-wrap">
      <el-button size="small" @click="goBack" class="back-btn">
        <i class="el-icon-arrow-left"></i> 返回列表
      </el-button>
      <span class="header-divider"></span>
      <span class="header-title">{{ appInfo.appName }} · {{ appInfo.version }}</span>
      <span class="sb done" style="margin-left:12px">上架</span>
    </div>

    <!-- 应用详情内容 -->
    <div class="detail-content-wrap">
      <div class="detail-left">
        <el-tabs v-model="activeTab" class="detail-tabs">
          <!-- 基本信息 -->
          <el-tab-pane name="info">
            <span slot="label">基本信息</span>
            <el-card shadow="never">
              <template #header>
                <div class="card-header"><span>应用基本信息</span></div>
              </template>
              <div class="info-grid">
                <div class="info-item"><div class="info-label">应用名称</div><div class="info-value">{{ appInfo.appName }}</div></div>
                <div class="info-item"><div class="info-label">版本号</div><div class="info-value">{{ appInfo.version }}</div></div>
                <div class="info-item"><div class="info-label">系统地址</div><div class="info-value">{{ appInfo.systemUrl }}</div></div>
                <div class="info-item"><div class="info-label">服务商名称</div><div class="info-value">{{ appInfo.vendor }}</div></div>
                <div class="info-item"><div class="info-label">合作伙伴</div><div class="info-value">{{ appInfo.cooperativeEnterprise }}</div></div>
                <div class="info-item"><div class="info-label">联系人</div><div class="info-value">{{ appInfo.contact1Name }}</div></div>
                <div class="info-item"><div class="info-label">联系电话</div><div class="info-value mono">{{ appInfo.contact1Phone }}</div></div>
                <div class="info-item"><div class="info-label">面向对象</div><div class="info-value">{{ appInfo.targetObject }}</div></div>
                <div class="info-item"><div class="info-label">应用架构</div><div class="info-value">{{ appInfo.appArchitecture }}</div></div>
                <div class="info-item"><div class="info-label">部署云服务商</div><div class="info-value">{{ appInfo.cloudProvider }}</div></div>
                <div class="info-item full"><div class="info-label">应用描述</div><div class="info-value muted">{{ appInfo.description }}</div></div>
              </div>
            </el-card>

            <el-card shadow="never" style="margin-top:14px">
              <template #header>
                <div class="card-header"><span>流程进度</span></div>
              </template>
              <div class="tl">
                <div class="tl-row"><div class="tl-spine"><div class="tl-dot done"></div><div class="tl-vl"></div></div><div class="tl-body"><div class="tl-title done">提交申请</div><div class="tl-time">2024-01-01 10:00 · 腾讯科技</div></div></div>
                <div class="tl-row"><div class="tl-spine"><div class="tl-dot done"></div><div class="tl-vl"></div></div><div class="tl-body"><div class="tl-title done">平台审核</div><div class="tl-time">2024-01-02 14:30 · 平台管理员 — 审核通过</div></div></div>
                <div class="tl-row"><div class="tl-spine"><div class="tl-dot done"></div><div class="tl-vl"></div></div><div class="tl-body"><div class="tl-title done">上架成功</div><div class="tl-time">2024-01-03 09:00 · 系统自动上架</div></div></div>
                <div class="tl-row"><div class="tl-spine"><div class="tl-dot on"></div></div><div class="tl-body"><div class="tl-title on">应用运行中</div><div class="tl-time">正常运行中，已为10家机构提供服务</div></div></div>
              </div>
            </el-card>
          </el-tab-pane>

          <!-- 审核记录 -->
          <el-tab-pane name="audit">
            <span slot="label">审核记录（{{ auditRecords.length }}）</span>
            <el-card shadow="never">
              <el-table :data="auditRecords" size="small" :header-cell-style="{background:'#f5f7fa'}">
                <el-table-column prop="version" label="提交版本" width="100" />
                <el-table-column prop="submitTime" label="提交时间" width="150" />
                <el-table-column prop="status" label="审核状态" width="100">
                  <template slot-scope="scope">
                    <el-tag :type="getAuditStatusType(scope.row.status)" size="mini" effect="dark">{{ getAuditStatusText(scope.row.status) }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="auditor" label="审核人" width="110" />
                <el-table-column prop="auditTime" label="审核时间" width="150" />
                <el-table-column prop="opinion" label="审核意见" min-width="200" show-overflow-tooltip />
                <el-table-column label="操作" width="110" fixed="right">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="viewAuditFlow(scope.row)">查看流程</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-tab-pane>

          <!-- 版本快照 -->
          <el-tab-pane name="version">
            <span slot="label">版本快照（{{ versionSnapshots.length }}）</span>
            <el-card shadow="never">
              <el-table :data="versionSnapshots" size="small" :header-cell-style="{background:'#f5f7fa'}">
                <el-table-column prop="version" label="版本号" width="100" />
                <el-table-column prop="publishTime" label="发布时间" width="150" />
                <el-table-column prop="changeLog" label="变更说明" min-width="260" show-overflow-tooltip />
                <el-table-column prop="status" label="状态" width="90">
                  <template slot-scope="scope">
                    <el-tag :type="scope.row.status === 'online' ? 'success' : 'info'" size="mini" effect="dark">{{ scope.row.status === 'online' ? '已上线' : '未发布' }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="110" fixed="right">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="viewSnapshot(scope.row)">查看快照</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-tab-pane>

        </el-tabs>
      </div>

      <div class="detail-right">
        <!-- 应用操作 -->
        <el-card shadow="never" class="mb-4">
          <template #header>
            <div class="card-header"><span>应用操作</span></div>
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
            <div class="card-header"><span>评价信息</span></div>
          </template>
          <div class="review-section">
            <div class="review-row">
              <span class="review-label">平台评价</span>
              <el-rate v-model="reviewInfo.platformRating" disabled show-score />
            </div>
            <div class="review-row">
              <span class="review-label">使用评价</span>
              <el-rate v-model="reviewInfo.usageRating" disabled show-score />
            </div>
            <div class="review-row">
              <span class="review-label">评价数量</span>
              <span class="review-count-link" @click="openReviewDetail">{{ reviewInfo.count }} 条</span>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 版本快照弹窗 -->
    <el-dialog :title="'版本快照 · ' + (currentSnapshot ? currentSnapshot.version : '')" :visible.sync="snapshotDialogVisible" width="720px" append-to-body>
      <div v-if="currentSnapshot" class="snapshot-detail">
        <div class="snapshot-header">
          <span class="snapshot-version">{{ currentSnapshot.version }}</span>
          <span class="snapshot-time">{{ currentSnapshot.publishTime || '未发布' }}</span>
          <el-tag :type="currentSnapshot.status === 'online' ? 'success' : 'info'" size="mini" effect="dark" style="margin-left:8px">{{ currentSnapshot.status === 'online' ? '已上线' : '未发布' }}</el-tag>
        </div>
        <div class="snapshot-section">
          <div class="snapshot-label">变更说明</div>
          <div class="snapshot-text">{{ currentSnapshot.changeLog }}</div>
        </div>
        <div class="info-grid" style="margin-top:16px">
          <div class="info-item"><div class="info-label">应用名称</div><div class="info-value">{{ currentSnapshot.data.appName }}</div></div>
          <div class="info-item"><div class="info-label">版本号</div><div class="info-value">{{ currentSnapshot.data.version }}</div></div>
          <div class="info-item"><div class="info-label">系统地址</div><div class="info-value">{{ currentSnapshot.data.systemUrl }}</div></div>
          <div class="info-item"><div class="info-label">服务商名称</div><div class="info-value">{{ currentSnapshot.data.vendor }}</div></div>
          <div class="info-item"><div class="info-label">合作伙伴</div><div class="info-value">{{ currentSnapshot.data.cooperativeEnterprise }}</div></div>
          <div class="info-item"><div class="info-label">联系人</div><div class="info-value">{{ currentSnapshot.data.contact1Name }}</div></div>
          <div class="info-item"><div class="info-label">联系电话</div><div class="info-value mono">{{ currentSnapshot.data.contact1Phone }}</div></div>
          <div class="info-item"><div class="info-label">面向对象</div><div class="info-value">{{ currentSnapshot.data.targetObject }}</div></div>
          <div class="info-item"><div class="info-label">应用架构</div><div class="info-value">{{ currentSnapshot.data.appArchitecture }}</div></div>
          <div class="info-item"><div class="info-label">部署云服务商</div><div class="info-value">{{ currentSnapshot.data.cloudProvider }}</div></div>
          <div class="info-item full"><div class="info-label">应用描述</div><div class="info-value muted">{{ currentSnapshot.data.description }}</div></div>
        </div>
      </div>
    </el-dialog>

    <!-- 审核流程弹窗 -->
    <el-dialog title="审核流程详情" :visible.sync="auditFlowDialogVisible" width="560px" append-to-body>
      <div v-if="currentAuditRecord" class="audit-flow-detail">
        <div class="audit-flow-header">
          <span>提交版本：<strong>{{ currentAuditRecord.version }}</strong></span>
          <el-tag :type="getAuditStatusType(currentAuditRecord.status)" size="small" effect="dark">{{ getAuditStatusText(currentAuditRecord.status) }}</el-tag>
        </div>
        <div class="tl" style="padding:16px 0 0">
          <div class="tl-row">
            <div class="tl-spine"><div class="tl-dot done"></div><div class="tl-vl"></div></div>
            <div class="tl-body">
              <div class="tl-title done">提交申请</div>
              <div class="tl-time">{{ currentAuditRecord.submitTime }} · {{ currentAuditRecord.submitUser }}</div>
            </div>
          </div>
          <div class="tl-row" v-if="currentAuditRecord.status !== 'pending'">
            <div class="tl-spine"><div :class="['tl-dot', currentAuditRecord.status === 'rejected' ? 'red' : 'done']"></div><div class="tl-vl"></div></div>
            <div class="tl-body">
              <div class="tl-title" :class="currentAuditRecord.status === 'rejected' ? 'red' : 'done'">人工审核</div>
              <div class="tl-time">{{ currentAuditRecord.auditTime }} · {{ currentAuditRecord.auditor }}</div>
            </div>
          </div>
          <div class="tl-row" v-if="currentAuditRecord.status !== 'pending'">
            <div class="tl-spine"><div :class="['tl-dot', currentAuditRecord.status === 'rejected' ? 'red' : 'done']"></div></div>
            <div class="tl-body">
              <div class="tl-title" :class="currentAuditRecord.status === 'rejected' ? 'red' : 'done'">{{ currentAuditRecord.status === 'approved' ? '审核通过' : '审核驳回' }}</div>
              <div class="tl-time">{{ currentAuditRecord.opinion }}</div>
            </div>
          </div>
          <div class="tl-row" v-else>
            <div class="tl-spine"><div class="tl-dot on"></div></div>
            <div class="tl-body">
              <div class="tl-title on">等待审核</div>
              <div class="tl-time">提交成功，等待平台管理员审核</div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 评价明细弹窗 -->
    <el-dialog title="评价明细" :visible.sync="reviewDialogVisible" width="800px" append-to-body>
      <el-table :data="reviewList" size="small" style="width: 100%" :header-cell-style="{background:'#f5f7fa'}">
        <el-table-column label="评分" width="80">
          <template slot-scope="scope">
            <div class="stars"><span v-for="i in 5" :key="i" class="star" :class="{ full: i <= scope.row.score }">★</span></div>
          </template>
        </el-table-column>
        <el-table-column label="评价机构" min-width="180">
          <template slot-scope="scope">
            <div><div class="rv-org">{{ scope.row.orgName }}</div><div class="rv-user">{{ scope.row.userName }} · {{ scope.row.department }}</div></div>
          </template>
        </el-table-column>
        <el-table-column label="评价内容" min-width="240">
          <template slot-scope="scope"><div class="rv-content">{{ scope.row.content }}</div></template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === '已回复' ? 'success' : 'warning'" size="mini">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="时间" width="140"><template slot-scope="scope">{{ scope.row.time }}</template></el-table-column>
        <el-table-column label="操作" width="80" fixed="right">
          <template slot-scope="scope"><el-button type="text" size="small" @click="handleViewReview(scope.row)">查看</el-button></template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer"><el-button @click="reviewDialogVisible = false">关闭</el-button></div>
    </el-dialog>

    <!-- 评价详情弹窗 -->
    <el-dialog title="评价详情" :visible.sync="viewReviewDialogVisible" width="600px" append-to-body>
      <div v-if="currentReview.content" class="review-detail">
        <div class="detail-header">
          <div class="reviewer-info">
            <div class="reviewer-name">{{ currentReview.userName }} · {{ currentReview.department }}</div>
            <div class="reviewer-org">{{ currentReview.orgName }}</div>
          </div>
          <div class="stars"><span v-for="i in 5" :key="i" class="star" :class="{ full: i <= currentReview.score }">★</span></div>
        </div>
        <div class="detail-content">{{ currentReview.content }}</div>
        <div v-if="currentReview.reply" class="detail-reply">
          <div class="reply-label">客服回复</div>
          <div class="reply-content">{{ currentReview.reply }}</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer"><el-button @click="viewReviewDialogVisible = false">关闭</el-button></div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'MyAppsDetail',
  data() {
    return {
      activeTab: 'info',
      appInfo: {
        appName: '智能办公系统',
        version: 'v2.0.0',
        systemUrl: 'https://office.example.com/v2',
        vendor: '腾讯科技',
        cooperativeEnterprise: '阿里云;华为云;百度云',
        contact1Name: '张经理',
        contact1Phone: '13800138000',
        contact2Name: '李主管',
        contact2Phone: '13900139000',
        targetObject: '公立医院、基层医疗卫生机构、社区卫生服务中心、民营医院',
        appArchitecture: 'B/S + 小程序',
        cloudProvider: '浪潮云、电信云、移动云、联通云',
        description: '全面升级系统架构，新增数据分析和智能推荐模块，支持小程序访问，扩展面向对象范围。'
      },
      reviewInfo: {
        platformRating: 4.5,
        usageRating: 4.2,
        count: 25
      },
      reviewDialogVisible: false,
      viewReviewDialogVisible: false,
      currentReview: {},
      reviewList: [
        { id: 1, score: 5, orgName: '华能数智科技集团', userName: '张三', department: '技术部', content: '系统非常稳定，功能齐全，满足我们日常办公需求，响应速度也很快。', time: '2024-03-15 10:30', status: '已回复', reply: '感谢您的好评，我们会继续努力提供更好的服务！' },
        { id: 2, score: 4, orgName: '中远云科技有限公司', userName: '王经理', department: '信息部', content: '整体不错，协同办公功能很好用，希望后续能增加移动端适配。', time: '2024-03-14 14:20', status: '已回复', reply: '感谢您的建议，移动端适配已在规划中，预计下个版本上线。' },
        { id: 3, score: 3, orgName: '北京协和医学院', userName: '李护士长', department: '信息科', content: '文档管理功能基本满足需求，但批量操作效率有待提升。', time: '2024-03-13 16:45', status: '待回复' }
      ],
      auditRecords: [
        { id: 1, version: 'v1.0.0', submitTime: '2024-01-01 10:00', submitUser: '张经理', status: 'approved', auditor: '平台管理员', auditTime: '2024-01-02 14:30', opinion: '审核通过，应用符合上架标准。' },
        { id: 2, version: 'v1.1.0', submitTime: '2024-02-10 09:00', submitUser: '张经理', status: 'rejected', auditor: '平台管理员', auditTime: '2024-02-11 16:00', opinion: '安全评估报告不完整，请补充后重新提交。' },
        { id: 3, version: 'v1.1.0', submitTime: '2024-02-15 11:00', submitUser: '张经理', status: 'approved', auditor: '平台管理员', auditTime: '2024-02-16 10:30', opinion: '材料已补齐，审核通过。' },
        { id: 4, version: 'v2.0.0', submitTime: '2024-03-01 14:00', submitUser: '张经理', status: 'pending', auditor: '', auditTime: '', opinion: '' }
      ],
      versionSnapshots: [
        {
          id: 1, version: 'v1.0.0', publishTime: '2024-01-03 09:00', changeLog: '初始版本发布', status: 'online',
          data: { appName: '智能办公系统', version: 'v1.0.0', systemUrl: 'https://office.example.com', vendor: '腾讯科技', cooperativeEnterprise: '阿里云;华为云', contact1Name: '张经理', contact1Phone: '13800138000', targetObject: '公立医院、基层医疗卫生机构', appArchitecture: 'B/S', cloudProvider: '浪潮云、电信云', description: '智能办公系统初始版本，提供基础办公自动化功能，包括文档管理、审批流程、协同办公等核心模块。' }
        },
        {
          id: 2, version: 'v1.1.0', publishTime: '2024-02-18 10:00', changeLog: '新增移动端适配，优化文档管理模块性能', status: 'online',
          data: { appName: '智能办公系统', version: 'v1.1.0', systemUrl: 'https://office.example.com', vendor: '腾讯科技', cooperativeEnterprise: '阿里云;华为云;百度云', contact1Name: '张经理', contact1Phone: '13800138000', targetObject: '公立医院、基层医疗卫生机构、社区卫生服务中心', appArchitecture: 'B/S + 移动端', cloudProvider: '浪潮云、电信云、移动云', description: '新增移动端适配，支持iOS和Android设备访问，优化文档管理模块性能，提升批量操作效率。' }
        },
        {
          id: 3, version: 'v2.0.0', publishTime: '', changeLog: '全面升级架构，新增数据分析和智能推荐模块', status: 'offline',
          data: { appName: '智能办公系统', version: 'v2.0.0', systemUrl: 'https://office.example.com/v2', vendor: '腾讯科技', cooperativeEnterprise: '阿里云;华为云;百度云', contact1Name: '张经理', contact1Phone: '13800138000', targetObject: '公立医院、基层医疗卫生机构、社区卫生服务中心、民营医院', appArchitecture: 'B/S + 小程序', cloudProvider: '浪潮云、电信云、移动云、联通云', description: '全面升级系统架构，新增数据分析和智能推荐模块，支持小程序访问，扩展面向对象范围。' }
        }
      ],
      snapshotDialogVisible: false,
      currentSnapshot: null,
      auditFlowDialogVisible: false,
      currentAuditRecord: null
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
    openReviewDetail() {
      this.reviewDialogVisible = true;
    },
    handleViewReview(row) {
      this.currentReview = JSON.parse(JSON.stringify(row));
      this.viewReviewDialogVisible = true;
    },
    getAuditStatusType(status) {
      const map = { approved: 'success', rejected: 'danger', pending: 'warning' };
      return map[status] || 'info';
    },
    getAuditStatusText(status) {
      const map = { approved: '已通过', rejected: '已驳回', pending: '待审核' };
      return map[status] || '未知';
    },
    viewAuditFlow(record) {
      this.currentAuditRecord = record;
      this.auditFlowDialogVisible = true;
    },
    viewSnapshot(snapshot) {
      this.currentSnapshot = snapshot;
      this.snapshotDialogVisible = true;
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
  --red:#c92a2a;
  --red-dim:#fff5f5;
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

.back-btn { border-radius: 4px; padding: 8px 16px; font-weight: 500; }
.back-btn:hover { background-color: #ecf5ff; border-color: #409eff; color: #409eff; }
.header-divider { width: 1px; height: 18px; background: #f0f0f0; flex-shrink: 0; }
.header-title { font-weight: 600; font-size: 18px; color: #303133; margin: 0; }

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
}

.detail-right {
  width: 340px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-left .mb-4 { margin-bottom: 0 !important; }

/* Tabs */
.detail-tabs {
  background: #fff;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
}

.detail-tabs >>> .el-tabs__header {
  margin: 0;
  padding: 0 16px;
  background: #fafbfc;
  border-bottom: 1px solid #e8e8e8;
  border-radius: 4px 4px 0 0;
}

.detail-tabs >>> .el-tabs__item {
  font-size: 13px;
  font-weight: 500;
  height: 42px;
  line-height: 42px;
  padding: 0 16px;
  color: #606266;
}

.detail-tabs >>> .el-tabs__item:hover {
  color: #409eff;
}

.detail-tabs >>> .el-tabs__item.is-active {
  color: #409eff;
  font-weight: 600;
}

.detail-tabs >>> .el-tabs__active-bar {
  background-color: #409eff;
}

.detail-tabs >>> .el-tabs__content {
  padding: 14px 16px 16px;
}

.detail-tabs >>> .el-tabs__nav-wrap::after {
  display: none;
}

/* Card Header */
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

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 32px;
  padding: 4px 0;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.info-item.full { grid-column: 1/-1; }
.info-item:hover { background-color: #ecf5ff; }
.info-label { color: #606266; font-size: 13px; width: 90px; flex-shrink: 0; font-weight: 500; }
.info-value { color: #303133; font-size: 13px; flex: 1; font-weight: 400; word-break: break-all; }
.info-value.mono { font-family: 'DM Mono', monospace; font-size: 12px; font-weight: 400; }
.info-value.muted { font-weight: 400; color: #5c6480; }

/* Status Badge */
.sb { display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 600; white-space: nowrap; }
.sb::before { content: ''; width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
.sb.done { background: var(--green-dim); color: var(--green); }
.sb.done::before { background: var(--green); }

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

/* Mono text */
.mono-text { font-family: 'DM Mono', monospace; font-size: 12px; }

/* Review Section */
.review-section { display: flex; flex-direction: column; gap: 12px; padding: 4px 0; }
.review-row { display: flex; align-items: center; gap: 16px; }
.review-label { color: #606266; font-size: 13px; width: 72px; flex-shrink: 0; font-weight: 500; }
.review-count-link { color: #409eff; font-size: 13px; cursor: pointer; font-weight: 500; }
.review-count-link:hover { text-decoration: underline; }

/* Custom Buttons */
.custom-button { width: 100%; padding: 8px 12px; border: 1px solid #dcdfe6; border-radius: 4px; background-color: #ffffff; color: #606266; font-size: 12px; text-align: left; cursor: pointer; transition: all 0.3s; box-sizing: border-box; }
.custom-button:hover { border-color: #409eff; background-color: #ecf5ff; color: #409eff; }
.custom-button.danger { border-color: #f56c6c; color: #f56c6c; }
.custom-button.danger:hover { border-color: #f56c6c; background-color: #fef0f0; color: #f56c6c; }

/* Stars */
.stars { display: flex; gap: 2px; }
.star { font-size: 14px; color: #d9d9d9; }
.star.full { color: #faad14; }
.rv-org { font-size: 13px; font-weight: 500; color: #262626; }
.rv-user { font-size: 12px; color: #8c8c8c; margin-top: 4px; }
.rv-content { font-size: 12px; color: #5c6480; line-height: 1.5; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }

/* Review Detail Dialog */
.review-detail { padding: 16px; }
.detail-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0; }
.reviewer-info { flex: 1; }
.reviewer-name { font-size: 13px; font-weight: 500; color: #1c2033; }
.reviewer-org { font-size: 12px; color: #8c8c8c; margin-top: 4px; }
.detail-content { font-size: 13px; color: #5c6480; line-height: 1.7; margin-bottom: 16px; }
.detail-reply { background: #f7f8fa; border-left: 3px solid #1890ff; padding: 12px; border-radius: 4px; margin-top: 12px; }
.reply-label { font-size: 11px; color: #1890ff; font-weight: 600; margin-bottom: 6px; }
.reply-content { font-size: 12px; color: #5c6480; line-height: 1.6; }

/* Snapshot Dialog */
.snapshot-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 16px;
}

.snapshot-version {
  font-size: 16px;
  font-weight: 600;
  color: #1c2033;
}

.snapshot-time {
  font-size: 12px;
  color: #9aa0b8;
  font-family: 'DM Mono', monospace;
}

.snapshot-section {
  background: #f5f7fa;
  border-radius: 4px;
  padding: 12px 14px;
}

.snapshot-label {
  font-size: 11px;
  color: #9aa0b8;
  margin-bottom: 4px;
  font-weight: 500;
}

.snapshot-text {
  font-size: 13px;
  color: #303133;
  line-height: 1.6;
}

/* Audit Flow Dialog */
.audit-flow-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid #e8e8e8;
  font-size: 13px;
  color: #606266;
}

.audit-flow-header strong {
  color: #1c2033;
}

/* Scrollbar */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }
</style>
