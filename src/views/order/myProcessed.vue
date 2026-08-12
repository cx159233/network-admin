<template>
  <div class="my-processed-page">
    <PageHeader
      title="我的已办"
      description="查看当前用户已处理的工单订单，支持按订单号、机构、服务类型筛选"
    />

    <CloudCard class="my-processed-page__table-card">
      <FilterBar @search="handleQuery" @reset="resetQuery">
        <a-input v-model:value="filter.keyword" placeholder="订单号、机构名、服务名称" allow-clear style="width: 240px" @pressEnter="handleQuery" />
        <a-select v-model:value="filter.org" placeholder="所有机构" allow-clear style="width: 180px">
          <a-select-option value="北京市海淀区数字经济发展局">北京市海淀区数字经济发展局</a-select-option>
          <a-select-option value="北京市朝阳区智慧城市建设局">北京市朝阳区智慧城市建设局</a-select-option>
          <a-select-option value="北京市西城区政务服务管理局">北京市西城区政务服务管理局</a-select-option>
        </a-select>
        <a-select v-model:value="filter.serviceType" placeholder="所有服务类型" allow-clear style="width: 150px">
          <a-select-option value="标准云资源">标准云资源</a-select-option>
          <a-select-option value="数字应用">数字应用</a-select-option>
          <a-select-option value="安全服务">安全服务</a-select-option>
          <a-select-option value="能力组件">能力组件</a-select-option>
          <a-select-option value="基础服务">基础服务</a-select-option>
          <a-select-option value="定制化资源">定制化资源</a-select-option>
        </a-select>
        <a-select v-model:value="filter.status" placeholder="所有状态" allow-clear style="width: 140px">
          <a-select-option value="工单流转中">工单流转中</a-select-option>
          <a-select-option value="已完成">已完成</a-select-option>
          <a-select-option value="已评价">已评价</a-select-option>
          <a-select-option value="已驳回">已驳回</a-select-option>
          <a-select-option value="已取消">已取消</a-select-option>
        </a-select>
        <template #suffix>
          <ColumnSettings v-model="hiddenKeys" :columns="columns" />
        </template>
      </FilterBar>
      <div class="my-processed-page__divider"></div>

      <div class="my-processed-page__table-wrap">
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
            <template v-else-if="column.dataIndex === 'service'">
              <div class="cell-stack">
                <div class="cell-stack__primary">{{ record.serviceName || '--' }}</div>
                <div class="cell-stack__secondary">{{ record.serviceSpec || '--' }}</div>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'org'">
              <div class="cell-stack">
                <div class="cell-stack__primary">{{ record.orgName || '--' }}</div>
                <div class="cell-stack__secondary">{{ record.applicant || '--' }}</div>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'serviceType'">
              <span :class="['service-type-tag', `service-type-tag--${getServiceTypeClass(record.serviceType)}`]">{{ record.serviceType || '--' }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <StatusDot :type="getStatusKey(record.status)" :text="record.status" />
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-button type="link" size="small" class="!p-0" @click="goToDetail(record)">详情</a-button>
            </template>
            <span v-else class="cell-default">{{ record[column.dataIndex] || '--' }}</span>
          </template>
        </a-table>
      </div>
    </CloudCard>

    <!-- 已办详情抽屉 -->
    <a-drawer
      v-model:open="drawer.visible"
      title="已办详情"
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
              <span>服务ID：{{ drawer.record.orderNo || '--' }}</span>
            </div>
          </div>
        </div>

        <a-tabs v-model:activeKey="drawer.activeTab" class="mvp-detail-tabs">
          <a-tab-pane key="info" tab="概览">
            <a-descriptions :column="2" bordered size="small" class="drawer-desc">
              <a-descriptions-item label="订单号">
                <span class="cell-mono">{{ drawer.record.orderNo || '--' }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="服务名称">{{ drawer.record.serviceName || '--' }}</a-descriptions-item>
              <a-descriptions-item label="服务规格" :span="2">{{ drawer.record.serviceSpec || '--' }}</a-descriptions-item>
              <a-descriptions-item label="服务类型">
                <span :class="['service-type-tag', `service-type-tag--${getServiceTypeClass(drawer.record.serviceType)}`]">{{ drawer.record.serviceType || '--' }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="状态">{{ drawer.record.status || '--' }}</a-descriptions-item>
              <a-descriptions-item label="申请人">{{ drawer.record.applicant || '--' }}</a-descriptions-item>
              <a-descriptions-item label="申请部门">{{ drawer.record.department || '--' }}</a-descriptions-item>
              <a-descriptions-item label="申请机构">{{ drawer.record.orgName || '--' }}</a-descriptions-item>
              <a-descriptions-item label="申请时间">
                <span class="cell-mono">{{ drawer.record.applyTime || '--' }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="关联工单">
                <span class="cell-mono">{{ drawer.record.workorderId || '--' }}</span>
              </a-descriptions-item>
            </a-descriptions>
          </a-tab-pane>
          <a-tab-pane key="timeline" tab="流程进度">
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
          </a-tab-pane>
          <a-tab-pane key="record" tab="处理记录">
            <a-form :model="processRecord" layout="vertical" class="process-form">
              <a-form-item label="处理结果">
                <a-radio-group v-model:value="processRecord.result" disabled>
                  <a-radio value="pass">通过</a-radio>
                  <a-radio value="reject">驳回</a-radio>
                  <a-radio value="transfer">转交</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="处理意见">
                <a-textarea v-model:value="processRecord.opinion" :rows="4" disabled />
              </a-form-item>
              <a-form-item label="处理人">
                <a-input v-model:value="processRecord.handler" disabled />
              </a-form-item>
              <a-form-item label="处理时间">
                <a-input v-model:value="processRecord.handleTime" disabled />
              </a-form-item>
            </a-form>
          </a-tab-pane>
        </a-tabs>
      </template>
    </a-drawer>
  </div>
</template>

<script>
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import FilterBar from '@/components/cloud/FilterBar.vue'
import StatusDot from '@/components/cloud/StatusDot.vue'
import ColumnSettings from '@/components/cloud/ColumnSettings.vue'

export default {
  name: 'OrderMyProcessed',
  components: {
    PageHeader, CloudCard, FilterBar, StatusDot, ColumnSettings
  },
  data() {
    return {
      loading: false,
      hiddenKeys: [],
      filter: { keyword: '', org: undefined, serviceType: undefined, status: undefined },
      applied: { keyword: '', org: undefined, serviceType: undefined, status: undefined },
      pagination: { current: 1, pageSize: 10 },
      drawer: { visible: false, record: null, activeTab: 'info' },
      processRecord: {
        result: 'pass',
        opinion: '同意，配置合理，符合业务需求。',
        handler: '张三',
        handleTime: '2026-03-14 11:30:00'
      },
      drawerTimeline: [
        { title: '提交申请', time: '工单已提交', state: 'done', dotColor: 'green' },
        { title: '系统派发工单', time: '自动派发', state: 'done', dotColor: 'green' },
        { title: '工单流转中', time: '工单流转完成', state: 'done', dotColor: 'green' },
        { title: '服务交付完成', time: '收到工单系统交付完成回执', state: 'done', dotColor: 'green' },
        { title: '服务评价', time: '用户已评价', state: 'done', dotColor: 'green' },
        { title: '订单驳回', time: '工单驳回后记录驳回时间', state: 'wait', dotColor: 'gray' },
        { title: '订单取消', time: '用户取消订单后记录取消时间', state: 'wait', dotColor: 'gray' }
      ],
      columns: [
        { title: '订单号', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
        { title: '服务名称 / 规格', dataIndex: 'service', key: 'service', width: 260 },
        { title: '申请机构 / 申请人', dataIndex: 'org', key: 'org', width: 240 },
        { title: '服务类型', dataIndex: 'serviceType', key: 'serviceType', width: 130 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 120 },
        { title: '关联工单', dataIndex: 'workorderId', key: 'workorderId', width: 130 },
        { title: '申请时间', dataIndex: 'applyTime', key: 'applyTime', width: 160 },
        { title: '操作', dataIndex: 'action', key: 'action', width: 90, fixed: 'right' }
      ],
      orderList: [
        { orderNo: '202608100087', serviceName: '云主机（ECS）', serviceSpec: '2核4G，200G SSD', orgName: '北京市朝阳区智慧城市建设局', applicant: '李四', department: '信息中心', serviceType: '标准云资源', status: '已完成', workorderId: 'TK-0232', applyTime: '2026-03-14 10:20' },
        { orderNo: '202608100088', serviceName: '网站安全防护', serviceSpec: '基础版，含WAF防护', orgName: '北京市西城区政务服务管理局', applicant: '王五', department: '网络科', serviceType: '安全服务', status: '已驳回', workorderId: 'TK-0233', applyTime: '2026-03-13 15:40' },
        { orderNo: '202608100086', serviceName: '数据可视化平台', serviceSpec: '企业版，含10个数据源', orgName: '北京市海淀区数字经济发展局', applicant: '赵六', department: '数据分析部', serviceType: '数字应用', status: '已完成', workorderId: 'TK-0231', applyTime: '2026-03-12 09:30' },
        { orderNo: '202608100085', serviceName: 'AI 语音识别组件', serviceSpec: '企业版 / 100万次调用', orgName: '北京市海淀区数字经济发展局', applicant: '张伟', department: '创新部', serviceType: '能力组件', status: '已评价', workorderId: 'TK-0228', applyTime: '2026-03-11 14:11' },
        { orderNo: '202608100084', serviceName: 'GPU 云主机', serviceSpec: '8卡 NVIDIA A100', orgName: '北京市朝阳区智慧城市建设局', applicant: '吴磊', department: '运维部', serviceType: '标准云资源', status: '已取消', workorderId: '', applyTime: '2026-03-10 17:48' }
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
        if (f.keyword) {
          const kw = f.keyword.toLowerCase()
          const blob = `${item.orderNo || ''} ${item.orgName || ''} ${item.serviceName || ''}`.toLowerCase()
          if (!blob.includes(kw)) return false
        }
        if (f.org && item.orgName !== f.org) return false
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
      this.filter = { keyword: '', org: undefined, serviceType: undefined, status: undefined }
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    onTableChange(pag) {
      this.pagination.current = pag.current
      this.pagination.pageSize = pag.pageSize
    },
    loadOrderList() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 300)
    },
    goToDetail(row) {
      this.drawer.record = row
      this.drawer.activeTab = 'info'
      this.drawer.visible = true
    },
    getServiceTypeClass(type) {
      const map = {
        '标准云资源': 'basic',
        '数字应用': 'digital',
        '安全服务': 'security',
        '能力组件': 'component',
        '基础服务': 'basic',
        '定制化资源': ''
      }
      return map[type] || ''
    },
    getStatusKey(status) {
      const map = {
        '工单流转中': 'processing',
        '已完成': 'done',
        '已评价': 'evaluated',
        '已驳回': 'rejected',
        '已取消': 'cancelled'
      }
      return map[status] || 'default'
    }
  }
}
</script>

<style scoped>
.my-processed-page {
  padding: 4px 0;
}

.my-processed-page__divider {
  height: 1px;
  background: #F2F3F5;
  margin: 0 16px;
}

.my-processed-page__table-wrap {
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

.cell-stack {
  display: flex;
  flex-direction: column;
  line-height: 1.5;
}

.cell-stack__primary {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.cell-stack__secondary {
  font-size: 12px;
  color: #86909C;
  margin-top: 2px;
}

/* Drawer 样式 */
.drawer-header-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 4px 0 8px;
  margin-bottom: 8px;
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

.drawer-header-sub__sep {
  color: #C9CDD4;
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

.process-form {
  padding-top: 4px;
}
</style>

<style>
/* 抽屉内 antd 组件样式覆盖（unscoped，因 a-drawer teleport 到 body，scoped + :deep 不生效） */
.ant-drawer .ant-table-wrapper .ant-table,
.ant-drawer .ant-table-wrapper .ant-table-container,
.ant-drawer .ant-table-wrapper .ant-table-thead > tr > th,
.ant-drawer .ant-table-wrapper .ant-table-tbody > tr > td,
.ant-drawer .ant-table-wrapper .ant-table-thead > tr:first-child > th:first-child,
.ant-drawer .ant-table-wrapper .ant-table-tbody > tr:first-child > td:first-child,
.ant-drawer .ant-descriptions,
.ant-drawer .ant-descriptions-view,
.ant-drawer .ant-descriptions-row > td,
.ant-drawer .ant-descriptions-row > th {
  border-radius: 0 !important;
}

.ant-drawer .ant-table-thead .ant-table-cell {
  font-weight: normal !important;
}

.ant-drawer .ant-descriptions-item-label {
  width: 160px !important;
  min-width: 160px !important;
  max-width: 160px !important;
  text-align: left !important;
  white-space: nowrap;
}

.mvp-detail-tabs .ant-descriptions-item-label {
  background: #FAFBFC !important;
  font-size: 14px !important;
  font-weight: 400 !important;
  color: rgba(0, 0, 0, 0.85) !important;
  font-feature-settings: "tnum" !important;
}

.mvp-detail-tabs .ant-descriptions-item-content {
  font-size: 14px !important;
  font-weight: 400 !important;
  color: rgba(0, 0, 0, 0.65) !important;
  font-feature-settings: "tnum" !important;
}
</style>
