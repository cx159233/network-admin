<template>
  <div class="my-initiated-page">
    <PageHeader title="开通记录" />

    <CloudCard class="my-initiated-page__table-card">
      <FilterBar @search="handleQuery" @reset="resetQuery">
        <a-input v-model:value="filter.orderNo" placeholder="服务单号" allow-clear style="width: 170px" @pressEnter="handleQuery" />
        <a-input v-model:value="filter.serviceName" placeholder="服务名称" allow-clear style="width: 170px" @pressEnter="handleQuery" />
        <a-input v-model:value="filter.serviceId" placeholder="服务ID" allow-clear style="width: 170px" @pressEnter="handleQuery" />
        <a-input v-model:value="filter.orgName" placeholder="申请机构" allow-clear style="width: 170px" @pressEnter="handleQuery" />
        <a-select v-model:value="filter.serviceType" placeholder="服务类型" allow-clear style="width: 150px">
          <a-select-option value="数字应用">数字应用</a-select-option>
          <a-select-option value="安全服务">安全服务</a-select-option>
          <a-select-option value="能力组件">能力组件</a-select-option>
          <a-select-option value="基础服务">基础服务</a-select-option>
        </a-select>
        <a-select v-model:value="filter.status" placeholder="状态" allow-clear style="width: 130px">
          <a-select-option value="处理中">处理中</a-select-option>
          <a-select-option value="已完成">已完成</a-select-option>
          <a-select-option value="已评价">已评价</a-select-option>
          <a-select-option value="已驳回">已驳回</a-select-option>
          <a-select-option value="已取消">已取消</a-select-option>
        </a-select>
        <template #suffix>
          <ColumnSettings v-model="hiddenKeys" :columns="columns" />
        </template>
      </FilterBar>
      <div class="my-initiated-page__divider"></div>

      <div class="my-initiated-page__table-wrap">
        <a-table
          :columns="visibleColumns"
          :data-source="filteredData"
          :pagination="paginationConfig"
          :loading="loading"
          row-key="orderNo"
          size="middle"
          @change="onTableChange"
        >
          <template #bodyCell="{ column, record }">
            <span v-if="column.dataIndex === 'orderNo'" class="cell-primary">{{ record.orderNo || '--' }}</span>
            <span v-else-if="column.dataIndex === 'service'" class="cell-name">
              <span class="cell-name__title">{{ record.serviceName || '--' }}</span>
              <span class="cell-name__id">{{ record.serviceId || '--' }}</span>
            </span>
            <template v-else-if="column.dataIndex === 'org'">
              <span class="cell-default">{{ record.orgName || '--' }}</span>
            </template>
            <span v-else-if="column.dataIndex === 'serviceType'" :class="['service-type-tag', getServiceTypeClass(record.serviceType)]">{{ record.serviceType || '--' }}</span>
            <span v-else-if="column.dataIndex === 'applyTime'" class="cell-default">{{ formatTime(record.applyTime) }}</span>
            <template v-else-if="column.dataIndex === 'status'">
              <StatusDot :type="getStatusKey(record.status)" :text="record.status" />
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-space size="small">
                <a-button type="link" size="small" class="!p-0" @click="goToDetail(record)">详情</a-button>
                <template v-if="record.status === '已评价'">
                  <a-divider type="vertical" class="!mx-[2px]" />
                  <a-button type="link" size="small" class="!p-0" @click="onViewReview(record)">查看评价</a-button>
                  <a-divider type="vertical" class="!mx-[2px]" />
                  <a-button type="link" size="small" class="!p-0" @click="onReplyReview(record)">回复</a-button>
                </template>
              </a-space>
            </template>
            <span v-else class="cell-default">{{ record[column.dataIndex] || '--' }}</span>
          </template>
        </a-table>
      </div>
    </CloudCard>

    <!-- 详情抽屉 -->
    <a-drawer
      v-model:open="drawer.visible"
      title="服务开通详情"
      :width="860"
      placement="right"
      :body-style="{ padding: '24px' }"
    >
      <template v-if="drawer.record">
        <div class="drawer-header-row">
          <div class="drawer-header-info">
            <div class="drawer-header-title-row">
              <span class="drawer-header-title">{{ drawer.record.serviceName || '--' }}</span>
              <StatusDot :type="getStatusKey(drawer.record.status)" :text="drawer.record.status" />
            </div>
            <div class="drawer-header-sub">
              <span>ID：{{ drawer.record.serviceId || drawer.record.orderNo || '--' }}</span>
            </div>
          </div>
        </div>

        <div class="overview-section">
          <div class="overview-section__title">基本信息</div>
          <a-descriptions :column="2" bordered size="small">
            <a-descriptions-item label="服务单号">
              <span class="cell-mono">{{ drawer.record.orderNo || '--' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="服务类型">
              <span :class="['service-type-tag', getServiceTypeClass(drawer.record.serviceType)]">{{ drawer.record.serviceType || '--' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="申请机构">{{ drawer.record.orgName || '--' }}</a-descriptions-item>
            <a-descriptions-item label="创建时间">
              <span class="cell-mono">{{ drawer.record.applyTime || '--' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="关联工单">
              <span>{{ drawer.record.workorderId || '--' }}</span>
            </a-descriptions-item>
          </a-descriptions>
        </div>

        <div class="overview-section">
          <div class="overview-section__title">流程进度</div>
          <a-timeline class="drawer-timeline">
            <a-timeline-item
              v-for="(step, idx) in drawerTimeline"
              :key="idx"
              :color="step.dotColor"
            >
              <div :class="['tl-title', `tl-title--${step.state}`]">{{ step.title }}</div>
              <div class="tl-time">{{ step.time }}</div>
            </a-timeline-item>
          </a-timeline>
        </div>
      </template>
    </a-drawer>

    <!-- 查看评价弹窗 -->
    <a-modal
      v-model:open="viewEvalVisible"
      title="服务评价"
      :footer="null"
      :width="480"
    >
      <template v-if="viewEvalData.orderNo">
        <div class="grid grid-cols-2 gap-[10px] mb-[14px]">
          <div v-for="key in ratingKeys" :key="key" class="rounded-[6px] border border-border-soft p-[10px]">
            <div class="text-[11px] text-text-tertiary">{{ key }}</div>
            <div class="mt-[4px] flex items-center gap-[6px]">
              <a-rate :value="viewEvalData.ratings[key]" disabled allow-half style="font-size: 13px" />
              <span class="text-[12px] font-semibold text-primary">{{ viewEvalData.ratings[key] }}</span>
            </div>
          </div>
        </div>
        <div class="text-[12px] font-semibold text-text-primary mb-[6px]">评价内容</div>
        <div class="rounded-[6px] bg-bg p-[10px] mb-[10px] text-[12px] text-text-primary leading-[20px]">{{ viewEvalData.content }}</div>
        <div v-if="viewEvalData.reply" class="rounded-[6px] border border-border-soft p-[10px] bg-primary/5">
          <div class="flex items-center gap-[6px] mb-[4px]">
            <a-tag color="cyan" class="!m-0 !text-[10px]">开发者回复</a-tag>
          </div>
          <div class="text-[12px] text-text-primary leading-[18px]">{{ viewEvalData.reply }}</div>
        </div>
        <a-alert v-if="!viewEvalData.reply" type="info" show-icon class="!mt-[10px]" message="开发者尚未回复，平台将在 3 个工作日内跟进" />
      </template>
    </a-modal>

    <!-- 回复弹窗 -->
    <a-modal v-model:open="replyModalVisible" title="回复评价" :width="480" :footer="null" :destroy-on-close="true">
      <div class="mb-[14px]">
        <div class="text-[13px] font-semibold text-text-primary mb-[6px]">回复内容</div>
        <a-textarea v-model:value="replyContent" :rows="4" placeholder="请输入回复内容..." />
      </div>
      <div class="eval-divider" style="margin: 0 -24px"></div>
      <div class="flex justify-end gap-[8px] mt-[14px]">
        <a-button @click="replyModalVisible = false">取消</a-button>
        <a-button type="primary" @click="submitReply">提交回复</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { message } from 'ant-design-vue'
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import FilterBar from '@/components/cloud/FilterBar.vue'
import StatusDot from '@/components/cloud/StatusDot.vue'
import ColumnSettings from '@/components/cloud/ColumnSettings.vue'

export default {
  name: 'OrderMyInitiated',
  components: {
    PageHeader, CloudCard, FilterBar, StatusDot, ColumnSettings
  },
  data() {
    return {
      loading: false,
      hiddenKeys: [],
      filter: { orderNo: '', serviceName: '', serviceId: '', orgName: '', serviceType: undefined, status: undefined },
      applied: { orderNo: '', serviceName: '', serviceId: '', orgName: '', serviceType: undefined, status: undefined },
      pagination: { current: 1, pageSize: 10 },
      drawer: { visible: false, record: null },
      viewEvalVisible: false,
      replyModalVisible: false,
      replyTarget: null,
      replyContent: '',
      ratingKeys: ['准确性', '稳定性', '响应时效', '业务适配性'],
      viewEvalData: {
        orderNo: '', serviceName: '', ratings: { '准确性': 0, '稳定性': 0, '响应时效': 0, '业务适配性': 0 },
        content: '', reviewTime: '', reply: ''
      },
      reviewRecords: {
        '202608100087': {
          ratings: { '准确性': 5, '稳定性': 4, '响应时效': 5, '业务适配性': 4 },
          content: '服务响应及时，功能符合预期，整体体验良好。',
          reviewTime: '2026-03-20 10:00:00',
          reply: '感谢您的认可与支持，我们将持续优化服务质量！'
        }
      },
      drawerTimeline: [
        { title: '提交申请', time: '工单已提交', state: 'done', dotColor: 'green' },
        { title: '系统派发工单', time: '自动派发', state: 'done', dotColor: 'green' },
        { title: '工单流转中', time: '工单流转完成', state: 'done', dotColor: 'green' },
        { title: '服务交付完成', time: '收到工单系统交付完成回执', state: 'done', dotColor: 'green' },
        { title: '服务评价', time: '可新增满意度评价', state: 'on', dotColor: 'blue' },
        { title: '订单驳回', time: '工单驳回后记录驳回时间', state: 'wait', dotColor: 'gray' },
        { title: '订单取消', time: '用户取消订单后记录取消时间', state: 'wait', dotColor: 'gray' }
      ],
      columns: [
        { title: '服务单号', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
        { title: '服务名称/ID', dataIndex: 'service', key: 'service', width: 220 },
        { title: '服务类型', dataIndex: 'serviceType', key: 'serviceType', width: 130 },
        { title: '申请机构', dataIndex: 'org', key: 'org', width: 200 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 120 },
        { title: '关联工单', dataIndex: 'workorderId', key: 'workorderId', width: 130 },
        { title: '创建时间', dataIndex: 'applyTime', key: 'applyTime', width: 160 },
        { title: '操作', dataIndex: 'action', key: 'action', width: 200, fixed: 'right' }
      ],
      orderList: [
        { orderNo: '202608100089', serviceId: 'SVC-0234', serviceName: '智慧园区综合管理平台', serviceSpec: '标准版，含500个设备接入 + 数据看板', orgName: '北京市海淀区数字经济发展局', applicant: '张三', department: '技术部', serviceType: '数字应用', status: '已完成', workorderId: 'TK-0234', applyTime: '2026-03-15 14:32' },
        { orderNo: '202608100090', serviceId: 'SVC-0235', serviceName: '统一身份认证组件', serviceSpec: '支持OAuth2.0/SAML，含SSO单点登录', orgName: '北京市海淀区数字经济发展局', applicant: '张三', department: '技术部', serviceType: '能力组件', status: '已完成', workorderId: 'TK-0235', applyTime: '2026-03-10 09:15' },
        { orderNo: '202608100091', serviceId: 'SVC-0236', serviceName: '数据可视化分析平台', serviceSpec: '企业版，含20个数据源接入 + 大屏展示', orgName: '北京市海淀区数字经济发展局', applicant: '张三', department: '技术部', serviceType: '数字应用', status: '已完成', workorderId: 'TK-0236', applyTime: '2026-03-05 16:45' },
        { orderNo: '202608100088', serviceId: 'SVC-0230', serviceName: '消息推送中间件', serviceSpec: '支持短信/邮件/站内信多通道，100万条/月', orgName: '北京市海淀区数字经济发展局', applicant: '张三', department: '技术部', serviceType: '能力组件', status: '已评价', workorderId: 'TK-0230', applyTime: '2026-02-20 10:00' },
        { orderNo: '202608100087', serviceId: 'SVC-0205', serviceName: '政务协同办公平台', serviceSpec: '旗舰版 / 200账号 / 含流程引擎', orgName: '北京市海淀区数字经济发展局', applicant: '赵敏', department: '技术部', serviceType: '数字应用', status: '已评价', workorderId: 'TK-0205', applyTime: '2026-02-15 11:14' },
      ]
    }
  },
  computed: {
    visibleColumns() {
      return this.columns.filter(c => !this.hiddenKeys.includes(c.key))
    },
    filteredData() {
      const f = this.applied
      const list = this.orderList.filter(item => {
        if (f.orderNo && !(item.orderNo || '').includes(f.orderNo)) return false
        if (f.serviceName && !(item.serviceName || '').includes(f.serviceName)) return false
        if (f.serviceId && !(item.serviceId || '').includes(f.serviceId)) return false
        if (f.orgName && !(item.orgName || '').includes(f.orgName)) return false
        if (f.serviceType && item.serviceType !== f.serviceType) return false
        if (f.status && item.status !== f.status) return false
        return true
      })
      list.sort((a, b) => (a.applyTime < b.applyTime ? 1 : -1))
      return list.map(i => ({ key: i.orderNo, ...i }))
    },
    paginationConfig() {
      return {
        current: this.pagination.current,
        pageSize: this.pagination.pageSize,
        total: this.filteredData.length,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (t) => `共 ${t} 条`
      }
    }
  },
  created() {
    this.loadOrderList()
  },
  methods: {
    handleQuery() {
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    resetQuery() {
      this.filter = { orderNo: '', serviceName: '', serviceId: '', orgName: '', serviceType: undefined, status: undefined }
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    onTableChange(pag) {
      this.pagination.current = pag.current
      this.pagination.pageSize = pag.pageSize
    },
    loadOrderList() {
      this.loading = true
      setTimeout(() => { this.loading = false }, 300)
    },
    goToDetail(row) {
      this.drawer.record = row
      this.drawer.visible = true
    },
    onViewReview(row) {
      const data = this.reviewRecords[row.orderNo]
      if (data) {
        this.viewEvalData = { orderNo: row.orderNo, serviceName: row.serviceName, ...data }
      }
      this.replyContent = ''
      this.viewEvalVisible = true
    },
    onReplyReview(row) {
      this.replyTarget = row
      const data = this.reviewRecords[row.orderNo]
      this.replyContent = data ? data.reply || '' : ''
      this.replyModalVisible = true
    },
    submitReply() {
      if (!this.replyContent) {
        message.warning('请填写回复内容')
        return
      }
      const orderNo = this.replyTarget.orderNo
      if (!this.reviewRecords[orderNo]) {
        this.reviewRecords[orderNo] = { ratings: {}, content: '', reviewTime: '', reply: '' }
      }
      this.viewEvalData.reply = this.replyContent
      this.reviewRecords[orderNo].reply = this.replyContent
      this.replyContent = ''
      this.replyModalVisible = false
      this.replyTarget = null
      message.success('回复成功')
    },
    getServiceTypeClass(type) {
      const map = {
        '数字应用': 'service-type-tag--digital',
        '安全服务': 'service-type-tag--security',
        '能力组件': 'service-type-tag--component',
        '基础服务': 'service-type-tag--basic'
      }
      return map[type] || ''
    },
    formatTime(time) {
      if (!time) return '--'
      const d = new Date(time)
      if (isNaN(d.getTime())) return time
      const pad = (n) => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    },
    getStatusKey(status) {
      const map = {
        '已完成': 'done',
        '已评价': 'evaluated',
      }
      return map[status] || 'default'
    }
  }
}
</script>

<style scoped>
.my-initiated-page {
  padding: 4px 0;
}

.my-initiated-page__divider {
  height: 1px;
  background: #F2F3F5;
  margin: 0 16px;
}

.my-initiated-page__table-wrap {
  padding: 0 16px 16px 16px;
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

.cell-mono {
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
  font-variant-numeric: tabular-nums;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  letter-spacing: -0.2px;
}

.cell-name {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cell-name__title {
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-weight: 600;
}

.cell-name__id {
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}

.overview-section {
  margin-top: 20px;
}

.overview-section__title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 12px;
  line-height: 1.4;
}

.service-type-tag {
  display: inline-block;
  padding: 0 6px;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  border-radius: 3px;
  border: 1px solid;
  vertical-align: middle;
}

.service-type-tag--digital { color: #165DFF; background: #E8F3FF; border-color: rgba(22, 93, 255, 0.20); }
.service-type-tag--security { color: #F53F3F; background: #FFF0ED; border-color: rgba(245, 63, 63, 0.20); }
.service-type-tag--component { color: #D97000; background: #FFF3E8; border-color: rgba(217, 112, 0, 0.20); }
.service-type-tag--basic { color: #16A34A; background: rgba(22, 163, 74, 0.10); border-color: rgba(22, 163, 74, 0.20); }

.drawer-header-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 4px 0 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #F2F3F5;
}

.drawer-header-info {
  flex: 1;
  min-width: 0;
}

.drawer-header-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.drawer-header-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
}

.drawer-header-sub {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #64748b;
}

.drawer-timeline {
  padding-top: 8px;
}

.tl-title {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 2px;
}

.tl-title--done { color: #4E5969; }
.tl-title--on { color: #165DFF; font-weight: 600; }
.tl-title--wait { color: #C9CDD4; }

.tl-time {
  font-size: 11px;
  color: #86909C;
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
  letter-spacing: -0.2px;
}

:deep(.ant-drawer .ant-table-wrapper),
:deep(.ant-drawer .ant-table-wrapper .ant-table),
:deep(.ant-drawer .ant-table-wrapper .ant-table-container),
:deep(.ant-drawer .ant-table-wrapper .ant-table-thead > tr > th),
:deep(.ant-drawer .ant-table-wrapper .ant-table-tbody > tr > td),
:deep(.ant-drawer .ant-table-wrapper .ant-table-thead > tr:first-child > th:first-child),
:deep(.ant-drawer .ant-table-wrapper .ant-table-tbody > tr:first-child > td:first-child),
:deep(.ant-drawer .ant-descriptions),
:deep(.ant-drawer .ant-descriptions-view),
:deep(.ant-drawer .ant-descriptions-row > td),
:deep(.ant-drawer .ant-descriptions-row > th) {
  border-radius: 0 !important;
}

:deep(.ant-drawer .ant-table-thead .ant-table-cell) {
  font-weight: normal !important;
}

:deep(.ant-drawer .ant-descriptions-item-label) {
  width: 160px;
  min-width: 160px;
  max-width: 160px;
  white-space: nowrap;
}

.eval-divider {
  height: 1px;
  background: #F2F3F5;
}
</style>
