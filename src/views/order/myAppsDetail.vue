<template>
  <div class="app-detail-page">
    <PageHeader
      :title="`应用详情 · ${appInfo.appName}`"
      description="查看应用基本信息、审核记录及用户评价"
    >
      <template #actions>
        <a-button @click="goBack">
          <template #icon><ArrowLeftOutlined /></template>
          返回列表
        </a-button>
      </template>
    </PageHeader>

    <div class="app-detail-page__body">
      <div class="app-detail-page__main">
        <CloudCard class="app-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">应用基本信息</span>
            <StatusDot :type="getStatusKey(appInfo.status)" :text="getStatusText(appInfo.status)" />
          </div>

          <div class="info-section">
            <div class="info-section__title">基本信息</div>
            <a-descriptions :column="2" size="small" class="app-desc">
              <a-descriptions-item label="应用名称">{{ appInfo.appName || '--' }}</a-descriptions-item>
              <a-descriptions-item label="应用ID">
                <span class="cell-mono">{{ appInfo.applicationId || '--' }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="系统地址">{{ appInfo.systemUrl || '--' }}</a-descriptions-item>
              <a-descriptions-item label="应用LOGO">
                <img v-if="appInfo.logo" :src="appInfo.logo" class="logo-thumb" />
                <template v-else>--</template>
              </a-descriptions-item>
              <a-descriptions-item label="应用描述" :span="2">
                <span class="muted">{{ appInfo.description || '--' }}</span>
              </a-descriptions-item>
            </a-descriptions>
          </div>

          <div class="info-section">
            <div class="info-section__title">联系信息</div>
            <a-descriptions :column="2" size="small" class="app-desc">
              <a-descriptions-item label="服务商名称">{{ appInfo.serviceProvider || '--' }}</a-descriptions-item>
              <a-descriptions-item label="合作伙伴">{{ appInfo.deployServiceProviderView || '--' }}</a-descriptions-item>
              <a-descriptions-item label="联系人1">{{ appInfo.contactName1 || '--' }}</a-descriptions-item>
              <a-descriptions-item label="联系电话1">
                <span class="cell-mono">{{ appInfo.contactPhone1 || '--' }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="联系人2">{{ appInfo.contactName2 || '--' }}</a-descriptions-item>
              <a-descriptions-item label="联系电话2">
                <span class="cell-mono">{{ appInfo.contactPhone2 || '--' }}</span>
              </a-descriptions-item>
            </a-descriptions>
          </div>

          <div class="info-section">
            <div class="info-section__title">分类标签</div>
            <a-descriptions :column="2" size="small" class="app-desc">
              <a-descriptions-item label="面向对象">{{ appInfo.targetView || '--' }}</a-descriptions-item>
              <a-descriptions-item label="应用架构">{{ appInfo.appArchitecture || '--' }}</a-descriptions-item>
              <a-descriptions-item label="部署云服务商">{{ appInfo.cloudProviderStr || '--' }}</a-descriptions-item>
              <a-descriptions-item label="应用覆盖范围">{{ appInfo.coverView || '--' }}</a-descriptions-item>
            </a-descriptions>
          </div>
        </CloudCard>

        <CloudCard class="app-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">审核记录</span>
          </div>
          <a-table
            :columns="auditColumns"
            :data-source="auditRecords"
            row-key="id"
            size="middle"
            :pagination="false"
          >
            <template #bodyCell="{ column, record }">
              <StatusDot v-if="column.dataIndex === 'status'" :type="getAuditStatusKey(record.status)" :text="getAuditStatusText(record.status)" />
              <span v-else class="cell-default">{{ record[column.dataIndex] || '--' }}</span>
            </template>
          </a-table>
        </CloudCard>
      </div>

      <div class="app-detail-page__side">
        <CloudCard class="app-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">评价信息</span>
          </div>
          <div class="review-section">
            <div class="review-row">
              <span class="review-label">平台评分</span>
              <div class="review-rating">
                <a-rate :value="appInfo.platformRating" disabled allow-half />
                <span class="review-score">{{ appInfo.platformRating || 0 }} 分</span>
              </div>
            </div>
            <div class="review-row">
              <span class="review-label">用户评价</span>
              <div class="review-rating">
                <a-rate :value="appInfo.usageRating" disabled allow-half />
                <span class="review-score">{{ appInfo.usageRating || 0 }} 分</span>
              </div>
            </div>
            <div class="review-row">
              <span class="review-label">评价数量</span>
              <span class="review-count-link" @click="openReviewList">{{ reviewListAll.length }} 条</span>
            </div>
          </div>
        </CloudCard>
      </div>
    </div>

    <a-modal
      v-model:open="reviewDialogVisible"
      title="用户评价列表"
      width="1080px"
      :footer="null"
      :mask-closable="false"
    >
      <a-table
        :columns="reviewColumns"
        :data-source="reviewListAll"
        row-key="id"
        size="middle"
        :pagination="reviewPaginationConfig"
        :scroll="{ x: 1100 }"
      >
        <template #bodyCell="{ column, record }">
          <a-rate v-if="column.dataIndex === 'score'" :value="record.score" disabled />
          <template v-else-if="column.dataIndex === 'service'">
            <div class="cell-stack">
              <div class="cell-stack__primary">{{ record.serviceName || '--' }}</div>
              <div class="cell-stack__secondary cell-mono">{{ record.orderNo || '--' }}</div>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <StatusDot :type="record.status === '已回复' ? 'done' : 'warning'" :text="record.status" />
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <a-button type="link" size="small" class="!p-0" @click="viewReviewDetail(record)">详情</a-button>
          </template>
          <span v-else class="cell-default">{{ record[column.dataIndex] || '--' }}</span>
        </template>
      </a-table>
    </a-modal>

    <a-modal
      v-model:open="reviewDetailVisible"
      title="评价详情"
      width="600px"
      :footer="null"
    >
      <div class="rv-detail">
        <div class="rv-detail-header">
          <div class="rv-detail-info">
            <div class="rv-detail-name">{{ currentReview.userName || '--' }} · {{ currentReview.department || '--' }}</div>
            <div class="rv-detail-org">{{ currentReview.orgName || '--' }}</div>
          </div>
          <a-rate :value="currentReview.score" disabled />
        </div>
        <div class="rv-detail-body">{{ currentReview.content || '--' }}</div>
        <div v-if="currentReview.reply" class="rv-detail-reply">
          <div class="rv-reply-label">客服回复</div>
          <div class="rv-reply-body">{{ currentReview.reply }}</div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import StatusDot from '@/components/cloud/StatusDot.vue'

export default {
  name: 'MyAppsDetail',
  components: {
    PageHeader, CloudCard, StatusDot,
    ArrowLeftOutlined
  },
  data() {
    return {
      appInfo: {
        id: 1,
        appName: '智能办公系统',
        status: 'published',
        applicationId: 'APP-2026-0001',
        serviceProvider: '腾讯科技',
        deployServiceProviderView: '北京协同科技有限公司',
        systemUrl: 'https://oa.tencent.com',
        logo: '',
        contactName1: '张经理',
        contactPhone1: '13800138000',
        contactName2: '李主管',
        contactPhone2: '13900139000',
        submitTime: '2026-01-01 10:00',
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
      reviewListAll: [
        { id: 1, score: 5, serviceName: '智能办公系统', orderNo: '#202608100085', orgName: '华能数智科技集团', userName: '张三', department: '技术部', content: '系统非常稳定，功能齐全，满足我们日常办公需求，响应速度也很快。', time: '2026-03-15 10:30', status: '已回复', reply: '感谢您的好评，我们会继续努力提供更好的服务！', replyTime: '2026-03-15 11:00' },
        { id: 2, score: 4, serviceName: '智能办公系统', orderNo: '#202608100071', orgName: '中远云科技有限公司', userName: '王经理', department: '信息部', content: '整体不错，协同办公功能很好用，希望后续能增加移动端适配。', time: '2026-03-14 14:20', status: '已回复', reply: '感谢您的建议，移动端适配已在规划中，预计下个版本上线。', replyTime: '2026-03-14 15:00' },
        { id: 3, score: 3, serviceName: '智能办公系统', orderNo: '#202608100063', orgName: '北京协和医学院', userName: '李护士长', department: '信息科', content: '文档管理功能基本满足需求，但批量操作效率有待提升。', time: '2026-03-13 16:45', status: '待回复', reply: '', replyTime: '' }
      ],
      auditRecords: [
        { id: 1, submitTime: '2026-01-01 10:00', createBy: '张经理', status: 'approved', auditor: '平台管理员', auditTime: '2026-01-02 14:30', opinion: '审核通过，应用符合上架标准。' },
        { id: 2, submitTime: '2026-02-10 09:00', createBy: '张经理', status: 'rejected', auditor: '平台管理员', auditTime: '2026-02-11 16:00', opinion: '安全评估报告不完整，请补充后重新提交。' },
        { id: 3, submitTime: '2026-02-15 11:00', createBy: '张经理', status: 'approved', auditor: '平台管理员', auditTime: '2026-02-16 10:30', opinion: '材料已补齐，审核通过。' },
        { id: 4, submitTime: '2026-03-01 14:00', createBy: '张经理', status: 'pending', auditor: '', auditTime: '', opinion: '' }
      ],
      auditColumns: [
        { title: '提交时间', dataIndex: 'submitTime', key: 'submitTime', width: 160 },
        { title: '提交人', dataIndex: 'createBy', key: 'createBy', width: 110 },
        { title: '审核状态', dataIndex: 'status', key: 'status', width: 110, align: 'center' },
        { title: '审核人', dataIndex: 'auditor', key: 'auditor', width: 120 },
        { title: '审核时间', dataIndex: 'auditTime', key: 'auditTime', width: 160 },
        { title: '审核意见', dataIndex: 'opinion', key: 'opinion', ellipsis: true }
      ],
      reviewColumns: [
        { title: '评分', dataIndex: 'score', key: 'score', width: 150 },
        { title: '服务/订单号', dataIndex: 'service', key: 'service', width: 200 },
        { title: '评价机构', dataIndex: 'orgName', key: 'orgName', width: 180 },
        { title: '评价内容', dataIndex: 'content', key: 'content', ellipsis: true },
        { title: '评价时间', dataIndex: 'time', key: 'time', width: 130 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
        { title: '回复内容', dataIndex: 'reply', key: 'reply', ellipsis: true },
        { title: '回复时间', dataIndex: 'replyTime', key: 'replyTime', width: 130 },
        { title: '操作', dataIndex: 'action', key: 'action', width: 80, fixed: 'right' }
      ],
      reviewPagination: { current: 1, pageSize: 10 }
    }
  },
  computed: {
    reviewPaginationConfig() {
      return {
        current: this.reviewPagination.current,
        pageSize: this.reviewPagination.pageSize,
        total: this.reviewListAll.length,
        showSizeChanger: true,
        showTotal: (t) => `共 ${t} 条`
      }
    }
  },
  created() {
    const q = this.$route.query
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
      }
      this.reviewListAll.forEach(item => { item.serviceName = this.appInfo.appName })
    }
  },
  methods: {
    goBack() {
      this.$router.push('/workorder/myApps')
    },
    openReviewList() {
      this.reviewPagination.current = 1
      this.reviewDialogVisible = true
    },
    viewReviewDetail(row) {
      this.currentReview = JSON.parse(JSON.stringify(row))
      this.reviewDetailVisible = true
    },
    downloadMaterial(material) {
      message.success('下载附件：' + material.name)
    },
    getAuditStatusKey(status) {
      const map = { approved: 'done', rejected: 'rejected', pending: 'processing' }
      return map[status] || 'default'
    },
    getAuditStatusText(status) {
      const map = { approved: '已通过', rejected: '已驳回', pending: '待审核' }
      return map[status] || '未知'
    },
    getStatusKey(status) {
      const map = {
        0: 'default', 10: 'done', 20: 'processing', 30: 'rejected', 40: 'cancelled',
        draft: 'default', pending_review: 'processing', published: 'done', rejected: 'rejected', offline: 'cancelled'
      }
      return map[status] || 'default'
    },
    getStatusText(status) {
      const map = {
        0: '草稿', 10: '已发布', 20: '待审核', 30: '已驳回', 40: '已下线',
        draft: '草稿', pending_review: '待审核', published: '已发布', rejected: '已驳回', offline: '已下线'
      }
      return map[status] || status || '--'
    }
  }
}
</script>

<style scoped>
.app-detail-page {
  padding: 4px 0;
}

.app-detail-page__body {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 14px;
  margin-top: 14px;
}

.app-detail-page__main,
.app-detail-page__side {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.card-head__title {
  font-size: 15px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}

.info-section {
  padding: 14px 0;
  border-top: 1px solid #F2F3F5;
}

.info-section:first-of-type {
  padding-top: 0;
  border-top: none;
}

.info-section:last-of-type {
  padding-bottom: 0;
}

.info-section__title {
  font-size: 13px;
  font-weight: 600;
  color: #4E5969;
  margin-bottom: 12px;
}

.cell-mono {
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
  font-variant-numeric: tabular-nums;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.85);
  letter-spacing: -0.2px;
}

.cell-primary {
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-weight: 500;
}

.cell-default {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}

.muted {
  color: #4E5969;
  font-size: 13px;
  line-height: 1.6;
}

.logo-thumb {
  height: 22px;
  border-radius: 3px;
  vertical-align: middle;
}

.app-desc :deep(.ant-descriptions-item-label) {
  color: #86909C;
  font-size: 13px;
  width: 96px;
}

.app-desc :deep(.ant-descriptions-item-content) {
  color: rgba(0, 0, 0, 0.85);
  font-size: 13px;
}

.review-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 4px 0;
}

.review-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.review-label {
  color: #86909C;
  font-size: 13px;
  width: 72px;
  flex-shrink: 0;
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.review-score {
  font-size: 13px;
  font-weight: 600;
  color: #F59E0B;
}

.review-count-link {
  color: #165DFF;
  font-size: 13px;
  cursor: pointer;
  font-weight: 500;
}

.review-count-link:hover {
  text-decoration: underline;
}

.cell-stack {
  display: flex;
  flex-direction: column;
  line-height: 1.5;
}

.cell-stack__primary {
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.cell-stack__secondary {
  font-size: 11px;
  color: #86909C;
  margin-top: 2px;
}

.rv-detail {
  padding: 4px 0;
}

.rv-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #F2F3F5;
}

.rv-detail-info {
  flex: 1;
  min-width: 0;
}

.rv-detail-name {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.rv-detail-org {
  font-size: 12px;
  color: #86909C;
  margin-top: 4px;
}

.rv-detail-body {
  font-size: 13px;
  color: #4E5969;
  line-height: 1.7;
  margin-bottom: 16px;
}

.rv-detail-reply {
  background: #F7F8FA;
  border-left: 3px solid #165DFF;
  padding: 12px;
  border-radius: 4px;
  margin-top: 12px;
}

.rv-reply-label {
  font-size: 11px;
  color: #165DFF;
  font-weight: 600;
  margin-bottom: 6px;
}

.rv-reply-body {
  font-size: 12px;
  color: #4E5969;
  line-height: 1.6;
}

@media (max-width: 1100px) {
  .app-detail-page__body {
    grid-template-columns: 1fr;
  }
}
</style>
