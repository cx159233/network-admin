<template>
  <div class="app-container">
    <div class="detail-container">
      <!-- 顶部标题区域 -->
      <div class="detail-header-wrap">
        <el-button size="small" @click="goBack" class="back-btn">
          <i class="el-icon-arrow-left"></i> 返回列表
        </el-button>
        <span class="header-divider"></span>
        <span class="header-title">{{ appInfo.title }}</span>
        <span class="sb done" style="margin-left:12px">发布</span>
      </div>

      <!-- 应用详情内容 -->
      <div class="detail-content-wrap">
        <div class="detail-left">
          <!-- 应用基本信息 -->
          <el-card shadow="never">
            <template #header>
              <div class="card-header"><span>应用基本信息</span></div>
            </template>
            <div class="info-grid">
              <div class="info-item"><div class="info-label">应用名称</div><div class="info-value">{{ appInfo.title }}</div></div>
              <div class="info-item"><div class="info-label">服务商名称</div><div class="info-value">{{ appInfo.serviceProvider }}</div></div>
              <div class="info-item"><div class="info-label">系统地址</div><div class="info-value mono">{{ appInfo.systemUrl }}</div></div>
              <div class="info-item"><div class="info-label">面向对象</div><div class="info-value">{{ appInfo.targetObjectStr }}</div></div>
              <div class="info-item"><div class="info-label">应用覆盖范围</div><div class="info-value">{{ appInfo.appScope }}</div></div>
              <div class="info-item"><div class="info-label">部署云服务商</div><div class="info-value">{{ appInfo.cloudProviderStr }}</div></div>
              <div class="info-item"><div class="info-label">合作企业</div><div class="info-value">{{ appInfo.cooperativeEnterprise }}</div></div>
              <div class="info-item"><div class="info-label">联系人</div><div class="info-value">{{ appInfo.contact1Name }}</div></div>
              <div class="info-item"><div class="info-label">联系电话</div><div class="info-value mono">{{ appInfo.contact1Phone }}</div></div>
              <div class="info-item full"><div class="info-label">应用描述</div><div class="info-value muted">{{ appInfo.description }}</div></div>
            </div>
          </el-card>
        </div>

        <div class="detail-right">
          <!-- 评价信息 -->
          <el-card shadow="never">
            <template #header>
              <div class="card-header"><span>评价信息</span></div>
            </template>
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
                <span class="review-count-link" @click="openReviewList">{{ reviewList.length }} 条</span>
              </div>
              <div class="review-row" style="margin-top: 10px;">
                <el-button type="primary" size="small" @click="goToReview">去评价</el-button>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>

    <!-- 评价列表弹窗 -->
    <el-dialog title="使用评价列表" :visible.sync="reviewDialogVisible" width="800px" append-to-body>
      <el-table :data="reviewList" size="small" style="width: 100%" :header-cell-style="{background:'#f5f7fa'}">
        <el-table-column label="评分" width="80">
          <template slot-scope="scope">
            <div class="stars"><span v-for="i in 5" :key="i" class="star" :class="{ full: i <= scope.row.score }">★</span></div>
          </template>
        </el-table-column>
        <el-table-column label="服务/订单号" min-width="200">
          <template slot-scope="scope">
            <div><div class="rv-title">{{ scope.row.serviceName || scope.row.title }}</div><div class="rv-sub">{{ scope.row.orderNo || '无订单号' }}</div></div>
          </template>
        </el-table-column>
        <el-table-column label="评价机构" min-width="200">
          <template slot-scope="scope">
            <div><div class="rv-title">{{ scope.row.orgName || '未知机构' }}</div><div class="rv-sub">{{ scope.row.userName || '未知用户' }} · {{ scope.row.department || '' }}</div></div>
          </template>
        </el-table-column>
        <el-table-column label="评价内容" min-width="250">
          <template slot-scope="scope"><div class="rv-content">{{ scope.row.content || '无评价内容' }}</div></template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === '已回复' ? 'success' : 'warning'" size="mini">{{ scope.row.status || '待回复' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="评价时间" width="130">
          <template slot-scope="scope">{{ scope.row.time }}</template>
        </el-table-column>
        <el-table-column label="操作" width="80" fixed="right">
          <template slot-scope="scope"><el-button type="text" size="small" @click="viewReviewDetail(scope.row)">查看</el-button></template>
        </el-table-column>
      </el-table>
      <div slot="footer"><el-button @click="reviewDialogVisible = false">关闭</el-button></div>
    </el-dialog>

    <!-- 评价详情弹窗 -->
    <el-dialog title="评价详情" :visible.sync="reviewDetailVisible" width="600px" append-to-body>
      <div v-if="currentReview.content" class="rv-detail">
        <div class="rv-detail-header">
          <div class="rv-detail-info">
            <div class="rv-detail-name">{{ currentReview.userName }} · {{ currentReview.department }}</div>
            <div class="rv-detail-org">{{ currentReview.orgName }}</div>
          </div>
          <div class="stars"><span v-for="i in 5" :key="i" class="star" :class="{ full: i <= currentReview.score }">★</span></div>
        </div>
        <div class="rv-detail-body">{{ currentReview.content }}</div>
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
  name: 'CMSDigitalAppDetail',
  data() {
    return {
      appInfo: {
        title: '未设置',
        serviceProvider: '未设置',
        systemUrl: '未设置',
        description: '未设置',
        cooperativeEnterprise: '未设置',
        contact1Name: '未设置',
        contact1Phone: '未设置',
        targetObjectStr: '未设置',
        appScope: '未设置',
        cloudProviderStr: '未设置',
        platformRating: 0,
        usageRating: 0
      },
      reviewDialogVisible: false,
      reviewDetailVisible: false,
      currentReview: {},
      reviewList: [
        { id: 1, score: 5, serviceName: '', orderNo: '#ORD-2024-0085', orgName: '华能数智科技集团', userName: '张三', department: '技术部', content: '系统非常稳定，功能齐全，满足我们日常办公需求，响应速度也很快。', time: '2024-03-15 10:30', status: '已回复', reply: '感谢您的好评，我们会继续努力提供更好的服务！' },
        { id: 2, score: 4, serviceName: '', orderNo: '#ORD-2024-0071', orgName: '中远云科技有限公司', userName: '王经理', department: '信息部', content: '整体不错，协同办公功能很好用，希望后续能增加移动端适配。', time: '2024-03-14 14:20', status: '已回复', reply: '感谢您的建议，移动端适配已在规划中，预计下个版本上线。' },
        { id: 3, score: 3, serviceName: '', orderNo: '#ORD-2024-0063', orgName: '北京协和医学院', userName: '李护士长', department: '信息科', content: '文档管理功能基本满足需求，但批量操作效率有待提升。', time: '2024-03-13 16:45', status: '待回复' }
      ]
    };
  },
  created() {
    const q = this.$route.query;
    if (q && q.title) {
      this.appInfo = {
        title: q.title || '未设置',
        serviceProvider: q.serviceProvider || '未设置',
        systemUrl: q.systemUrl || '未设置',
        description: q.description || '未设置',
        cooperativeEnterprise: q.cooperativeEnterprise || '未设置',
        contact1Name: q.contact1Name || '未设置',
        contact1Phone: q.contact1Phone || '未设置',
        targetObjectStr: q.targetObjectStr || '未设置',
        appScope: q.appScope || '未设置',
        cloudProviderStr: q.cloudProviderStr || '未设置',
        platformRating: parseFloat(q.platformRating) || 0,
        usageRating: parseFloat(q.usageRating) || 0
      };
      // 更新评价列表中的应用名称
      this.reviewList.forEach(item => { item.serviceName = this.appInfo.title; });
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    openReviewList() {
      this.reviewDialogVisible = true;
    },
    viewReviewDetail(row) {
      this.currentReview = JSON.parse(JSON.stringify(row));
      this.reviewDetailVisible = true;
    },
    goToReview() {
      // 跳转到评价页面
      this.$message.info('跳转到评价页面');
    }
  }
};
</script>

<style scoped>
.app-container {
  padding: 20px;
  background-color: #ffffff;
  min-height: 100%;
  box-sizing: border-box;
}

.detail-container {
  display: flex;
  flex-direction: column;
  margin: -20px;
  height: calc(100% + 40px);
}

.detail-header-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
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
  word-break: break-all;
}

.info-value.mono {
  font-family: 'DM Mono', monospace;
  font-size: 12px;
}

.info-value.muted {
  font-weight: 400;
  color: #5c6480;
}

.sb {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  background: #ebfbee;
  color: #2f9e44;
}

.sb::before {
  content: '';
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #2f9e44;
  flex-shrink: 0;
}

.review-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 4px 0;
}

.review-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.review-label {
  color: #606266;
  font-size: 13px;
  width: 72px;
  flex-shrink: 0;
  font-weight: 500;
}

.review-count-link {
  color: #409eff;
  font-size: 13px;
  cursor: pointer;
  font-weight: 500;
}

.review-count-link:hover {
  text-decoration: underline;
}

/* 评价列表 */
.stars { display: flex; gap: 2px; }
.star { font-size: 14px; color: #d9d9d9; }
.star.full { color: #faad14; }
.rv-title { font-size: 13px; font-weight: 500; color: #262626; }
.rv-sub { font-size: 12px; color: #8c8c8c; margin-top: 4px; }
.rv-content { font-size: 12px; color: #5c6480; line-height: 1.5; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }

/* 评价详情 */
.rv-detail { padding: 16px; }
.rv-detail-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0; }
.rv-detail-info { flex: 1; }
.rv-detail-name { font-size: 13px; font-weight: 500; color: #1c2033; }
.rv-detail-org { font-size: 12px; color: #8c8c8c; margin-top: 4px; }
.rv-detail-body { font-size: 13px; color: #5c6480; line-height: 1.7; margin-bottom: 16px; }
.rv-detail-reply { background: #f7f8fa; border-left: 3px solid #1890ff; padding: 12px; border-radius: 4px; margin-top: 12px; }
.rv-reply-label { font-size: 11px; color: #1890ff; font-weight: 600; margin-bottom: 6px; }
.rv-reply-body { font-size: 12px; color: #5c6480; line-height: 1.6; }

::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #c8cdd9; border-radius: 3px; }
</style>
