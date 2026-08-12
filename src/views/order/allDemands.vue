<template>
  <div class="all-demands-page">
    <PageHeader
      title="所有需求"
      description="展示全量需求数据，供管理员查看所有机构提交的需求，支持按需求编号、申请机构、方案类型、服务类型、状态筛选"
    />

    <CloudCard class="all-demands-page__table-card">
      <FilterBar @search="handleQuery" @reset="resetQuery">
        <a-input v-model:value="filter.demandNo" placeholder="需求编号" allow-clear style="width: 180px" @pressEnter="handleQuery" />
        <a-input v-model:value="filter.orgName" placeholder="申请机构" allow-clear style="width: 180px" @pressEnter="handleQuery" />
        <a-select v-model:value="filter.planType" placeholder="方案类型" allow-clear style="width: 150px">
          <a-select-option value="政务信创">政务信创</a-select-option>
          <a-select-option value="金融合规">金融合规</a-select-option>
          <a-select-option value="安全可控">安全可控</a-select-option>
          <a-select-option value="科研提算">科研提算</a-select-option>
          <a-select-option value="通用商用">通用商用</a-select-option>
        </a-select>
        <a-select v-model:value="filter.serviceType" placeholder="服务类型" allow-clear style="width: 150px">
          <a-select-option value="数字应用">数字应用</a-select-option>
          <a-select-option value="安全服务">安全服务</a-select-option>
          <a-select-option value="能力组件">能力组件</a-select-option>
          <a-select-option value="基础服务">基础服务</a-select-option>
        </a-select>
        <a-select v-model:value="filter.status" placeholder="状态" allow-clear style="width: 150px">
          <a-select-option value="待响应">待响应</a-select-option>
          <a-select-option value="已响应">已响应</a-select-option>
          <a-select-option value="已完成">已完成</a-select-option>
          <a-select-option value="已关闭">已关闭</a-select-option>
        </a-select>
        <template #suffix>
          <ColumnSettings v-model="hiddenKeys" :columns="columns" />
        </template>
      </FilterBar>
      <div class="all-demands-page__divider"></div>

      <div class="all-demands-page__table-wrap">
        <a-table
          :columns="visibleColumns"
          :data-source="filteredData"
          :pagination="paginationConfig"
          :loading="loading"
          row-key="demandNo"
          size="middle"
          @change="onTableChange"
        >
          <template #bodyCell="{ column, record }">
            <span v-if="column.dataIndex === 'demandNo'" class="cell-primary">{{ record.demandNo || '--' }}</span>
            <template v-else-if="column.dataIndex === 'planType'">
              <span class="cell-default">{{ record.planType || '--' }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'serviceItems'">
              <a-tooltip :title="record.serviceItems" placement="topLeft">
                <span class="cell-text">{{ record.serviceItems || '--' }}</span>
              </a-tooltip>
            </template>
            <template v-else-if="column.dataIndex === 'demandDescription'">
              <a-tooltip :title="record.demandDescription" placement="topLeft">
                <div class="cell-desc">{{ record.demandDescription || '--' }}</div>
              </a-tooltip>
            </template>
            <template v-else-if="column.dataIndex === 'org'">
              <div class="cell-stack">
                <div class="cell-stack__primary">{{ record.orgName || '--' }}</div>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'serviceType'">
              <span :class="['service-type-tag', `service-type-tag--${getServiceTypeClass(record.serviceType)}`]">{{ record.serviceType || '--' }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <StatusDot :type="getStatusKey(record.status)" :text="record.status" />
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-button type="link" size="small" class="!p-0" @click="viewDetail(record)">详情</a-button>
            </template>
            <span v-else class="cell-default">{{ record[column.dataIndex] || '--' }}</span>
          </template>
        </a-table>
      </div>
    </CloudCard>

    <!-- 详情抽屉 -->
    <a-drawer
      v-model:open="drawer.visible"
      title="需求详情"
      :width="860"
      placement="right"
      :body-style="{ padding: '24px' }"
    >
      <template v-if="drawer.record">
        <div class="drawer-header-row">
          <div class="drawer-header-info">
            <div class="drawer-header-title-row">
              <span class="drawer-header-title">{{ drawer.record.demandNo }}</span>
              <span class="drawer-header-plan-type">{{ drawer.record.planType }}</span>
            </div>
            <div class="drawer-header-sub">
              <span class="drawer-header-sub__name">{{ drawer.record.planName }}</span>
              <span class="drawer-header-sub__sep">·</span>
              <span :class="['service-type-tag', `service-type-tag--${getServiceTypeClass(drawer.record.serviceType)}`]">{{ drawer.record.serviceType }}</span>
            </div>
          </div>
        </div>

        <a-tabs v-model:activeKey="drawer.activeTab">
          <a-tab-pane key="demand" tab="需求信息">
            <a-descriptions :column="2" bordered size="small" class="drawer-desc">
              <a-descriptions-item label="需求编号">
                <span class="cell-mono">{{ drawer.record.demandNo || '--' }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="方案类型">{{ drawer.record.planType || '--' }}</a-descriptions-item>
              <a-descriptions-item label="方案名称" :span="2">{{ drawer.record.planName || '--' }}</a-descriptions-item>
              <a-descriptions-item label="服务项" :span="2">
                <span class="cell-text">{{ drawer.record.serviceItems || '--' }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="需求说明" :span="2">
                <span class="muted">{{ drawer.record.demandDescription || '--' }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="申请机构">{{ drawer.record.orgName || '--' }}</a-descriptions-item>
              <a-descriptions-item label="发布时间">
                <span class="cell-mono">{{ drawer.record.publishTime || '--' }}</span>
              </a-descriptions-item>
            </a-descriptions>
          </a-tab-pane>
          <a-tab-pane v-if="drawer.record.responseContent" key="response" tab="响应信息">
            <a-descriptions :column="2" bordered size="small" class="drawer-desc">
              <a-descriptions-item label="响应机构">{{ drawer.record.respondent || '--' }}</a-descriptions-item>
              <a-descriptions-item label="响应时间">
                <span class="cell-mono">{{ drawer.record.responseTime || '--' }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="预估报价">
                <span class="price-text">¥{{ drawer.record.estimatedPrice || '--' }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="预计工期">{{ drawer.record.estimatedDuration || '--' }}</a-descriptions-item>
              <a-descriptions-item label="响应内容" :span="2">
                <span class="muted">{{ drawer.record.responseContent || '--' }}</span>
              </a-descriptions-item>
            </a-descriptions>
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
  name: 'AllDemands',
  components: {
    PageHeader, CloudCard, FilterBar, StatusDot, ColumnSettings
  },
  data() {
    return {
      loading: false,
      hiddenKeys: [],
      filter: { demandNo: '', orgName: '', planType: undefined, serviceType: undefined, status: undefined },
      applied: { demandNo: '', orgName: '', planType: undefined, serviceType: undefined, status: undefined },
      pagination: { current: 1, pageSize: 10 },
      drawer: { visible: false, record: null, activeTab: 'demand' },
      columns: [
        { title: '需求编号', dataIndex: 'demandNo', key: 'demandNo', width: 150 },
        { title: '方案名称', dataIndex: 'planName', key: 'planName', width: 180, ellipsis: true },
        { title: '方案类型', dataIndex: 'planType', key: 'planType', width: 120 },
        { title: '服务项', dataIndex: 'serviceItems', key: 'serviceItems', width: 280, ellipsis: true },
        { title: '需求说明', dataIndex: 'demandDescription', key: 'demandDescription', width: 240, ellipsis: true },
        { title: '申请机构', dataIndex: 'org', key: 'org', width: 220 },
        { title: '服务类型', dataIndex: 'serviceType', key: 'serviceType', width: 130 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 110 },
        { title: '发布时间', dataIndex: 'publishTime', key: 'publishTime', width: 160 },
        { title: '操作', dataIndex: 'action', key: 'action', width: 90, fixed: 'right' }
      ],
      demandList: [
        { demandNo: 'DM-20260810-0012', planName: '统一身份认证平台采购', planType: '安全可控', serviceItems: '统一身份认证平台、安全审计服务', demandDescription: '需要一个统一的身份认证平台，支持OAuth2.0和SAML协议，要求支持至少10万用户的并发认证', serviceType: '安全服务', orgName: '北京市海淀区数字经济发展局', status: '待响应', publishTime: '2026-03-18 10:30:00' },
        { demandNo: 'DM-20260810-0011', planName: '大数据分析平台建设', planType: '政务信创', serviceItems: '大数据分析平台、数据可视化组件', demandDescription: '需要部署一套大数据分析平台，支持PB级数据处理', serviceType: '数字应用', orgName: '北京市海淀区数字经济发展局', status: '已响应', publishTime: '2026-03-15 14:20:00', respondent: '北京大数据技术有限公司', responseContent: '可提供PB级大数据分析平台方案，支持数据采集、清洗、分析、可视化全流程。', estimatedPrice: '460,000', estimatedDuration: '60个工作日', responseTime: '2026-03-16 11:00:00' },
        { demandNo: 'DM-20260810-0010', planName: '弹性云服务器采购', planType: '通用商用', serviceItems: '云服务器ECS、对象存储OSS', demandDescription: '需要采购弹性云服务器资源，配置不低于32核64G内存', serviceType: '基础服务', orgName: '北京市海淀区数字经济发展局', status: '已完成', publishTime: '2026-03-10 09:00:00', respondent: '北京云计算科技有限公司', responseContent: '可提供32核64G云服务器，含200G SSD系统盘，1Gbps带宽。', estimatedPrice: '36,000', estimatedDuration: '5个工作日', responseTime: '2026-03-11 10:30:00' },
        { demandNo: 'DM-20260810-0009', planName: '消息推送中间件', planType: '安全可控', serviceItems: '消息推送中间件', demandDescription: '需要消息推送中间件，支持短信/邮件/站内信多通道', serviceType: '能力组件', orgName: '北京市朝阳区卫健委', status: '已关闭', publishTime: '2026-03-05 16:00:00' },
        { demandNo: 'DM-20260810-0008', planName: '智慧医疗数据中台', planType: '政务信创', serviceItems: '智慧医疗数据中台', demandDescription: '需要部署一套智慧医疗数据中台', serviceType: '数字应用', orgName: '北京市第一人民医院', status: '待响应', publishTime: '2026-03-16 11:00:00' },
        { demandNo: 'DM-20260810-0007', planName: '高性能GPU计算集群', planType: '科研提算', serviceItems: 'GPU计算集群、分布式训练框架', demandDescription: '需要采购高性能GPU计算集群，用于AI模型训练', serviceType: '基础服务', orgName: '北京人工智能研究院', status: '已响应', publishTime: '2026-03-12 08:30:00', respondent: '北京云计算科技有限公司', responseContent: '我方可提供NVIDIA A100集群方案，包含8卡GPU服务器2台，配套分布式训练框架，支持PyTorch/TensorFlow。提供7×24小时运维支持。', estimatedPrice: '580,000', estimatedDuration: '45个工作日', responseTime: '2026-03-13 09:20:00' }
      ]
    }
  },
  computed: {
    visibleColumns() {
      return this.columns.filter(c => !this.hiddenKeys.includes(c.key))
    },
    filteredData() {
      const f = this.applied
      const list = this.demandList.filter(item => {
        if (f.status && item.status !== f.status) return false
        if (f.demandNo && !(item.demandNo || '').includes(f.demandNo)) return false
        if (f.orgName && !(item.orgName || '').includes(f.orgName)) return false
        if (f.planType && item.planType !== f.planType) return false
        if (f.serviceType && item.serviceType !== f.serviceType) return false
        return true
      })
      list.sort((a, b) => (a.publishTime < b.publishTime ? 1 : -1))
      return list.map(i => ({ key: i.demandNo, ...i }))
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
    this.loadDemandList()
  },
  methods: {
    handleQuery() {
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    resetQuery() {
      this.filter = { demandNo: '', orgName: '', planType: undefined, serviceType: undefined, status: undefined }
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    onTableChange(pag) {
      this.pagination.current = pag.current
      this.pagination.pageSize = pag.pageSize
    },
    loadDemandList() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 300)
    },
    viewDetail(row) {
      this.drawer.record = row
      this.drawer.activeTab = 'demand'
      this.drawer.visible = true
    },
    getStatusKey(status) {
      const map = {
        '待响应': 'warning',
        '已响应': 'processing',
        '已完成': 'done',
        '已关闭': 'cancelled'
      }
      return map[status] || 'default'
    },
    getServiceTypeClass(type) {
      const map = {
        '数字应用': 'digital',
        '安全服务': 'security',
        '能力组件': 'component',
        '基础服务': 'basic'
      }
      return map[type] || ''
    }
  }
}
</script>

<style scoped>
.all-demands-page {
  padding: 4px 0;
}

.all-demands-page__divider {
  height: 1px;
  background: #F2F3F5;
  margin: 0 16px;
}

.all-demands-page__table-wrap {
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

.cell-text {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
}

.cell-empty {
  color: #C9CDD4;
  font-size: 14px;
}

.cell-desc {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 1.5;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
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
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
}

.drawer-header-plan-type {
  font-size: 13px;
  color: #64748b;
  font-weight: 400;
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

.drawer-header-sub__name {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
}

.plan-type-tag {
  display: inline-flex;
  align-items: center;
  padding: 1px 8px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 20px;
  background: #F4F8FF;
  color: #035BFE;
  border: 1px solid rgba(3, 91, 254, 0.20);
  font-weight: 500;
  margin: 0;
}

.muted {
  color: #4E5969;
  font-size: 14px;
  line-height: 1.6;
}

.price-text {
  color: #F59E0B;
  font-weight: 600;
  font-size: 14px;
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

</style>
