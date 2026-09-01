<template>
  <div class="my-demand-initiate-page">
    <PageHeader
      title="需求发起"
      description="管理本机构发布的需求，支持按需求编号、申请机构、方案类型、服务类型和状态筛选"
    />

    <CloudCard class="my-demand-initiate-page__table-card">
      <FilterBar @search="handleQuery" @reset="resetQuery">
        <template #actions>
          <a-button type="primary" @click="openAddPage">
            <template #icon><PlusOutlined /></template>
            新增需求
          </a-button>
        </template>
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
        <a-select v-model:value="filter.status" placeholder="状态" allow-clear style="width: 130px">
          <a-select-option value="待响应">待响应</a-select-option>
          <a-select-option value="已响应">已响应</a-select-option>
          <a-select-option value="已完成">已完成</a-select-option>
          <a-select-option value="已关闭">已关闭</a-select-option>
        </a-select>
      </FilterBar>
      <div class="my-demand-initiate-page__divider"></div>

      <div class="my-demand-initiate-page__table-wrap">
        <a-table :scroll="{ x: 1620 }"
          :columns="columns"
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
              <a-tag class="plan-type-tag">{{ record.planType || '--' }}</a-tag>
            </template>
            <template v-else-if="column.dataIndex === 'serviceItems'">
              <a-tooltip :title="record.serviceItems" placement="topLeft">
                <span class="cell-default">{{ record.serviceItems || '--' }}</span>
              </a-tooltip>
            </template>
            <template v-else-if="column.dataIndex === 'demandDescription'">
              <a-tooltip :title="record.demandDescription" placement="topLeft">
                <span class="cell-default">{{ record.demandDescription || '--' }}</span>
              </a-tooltip>
            </template>
            <template v-else-if="column.dataIndex === 'org'">
              <div class="cell-stack">
                <div class="cell-stack__primary">{{ record.orgName || '--' }}</div>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'serviceType'">
              <span :class="['service-type-tag', `service-type-tag--${getServiceTypeClass(record.serviceType)}`]">{{ record.serviceType }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <StatusDot :type="getStatusKey(record.status)" :text="record.status" />
            </template>
            <template v-else-if="column.dataIndex === 'responseTime'">
              <span class="cell-mono">{{ record.responseTime || '--' }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-space size="small">
                <a-button type="link" size="small" class="!p-0" @click="viewDetail(record)">详情</a-button>
                <a-divider v-if="record.status === '已响应'" type="vertical" class="!mx-[2px]" />
                <a-button v-if="record.status === '已响应'" type="link" size="small" class="!p-0" @click="handleConfirmResponse(record)">确认响应</a-button>
                <a-divider v-if="record.status === '待响应'" type="vertical" class="!mx-[2px]" />
                <a-button v-if="record.status === '待响应'" type="link" size="small" danger class="!p-0" @click="handleClose(record)">关闭</a-button>
              </a-space>
            </template>
            <span v-else class="cell-default">{{ record[column.dataIndex] || '--' }}</span>
          </template>
        </a-table>
      </div>
    </CloudCard>

    <a-modal :get-container="getDemoContainer"
      v-model:open="closeDialogVisible"
      title="关闭需求"
      width="420px"
      ok-text="确定"
      cancel-text="取消"
      @ok="handleCloseConfirm"
    >
      <p class="close-modal__text">确认关闭需求吗？关闭后不可恢复。</p>
    </a-modal>

    <a-modal :get-container="getDemoContainer"
      v-model:open="confirmResponseDialogVisible"
      title="确认响应"
      width="420px"
      ok-text="确定"
      cancel-text="取消"
      @ok="handleConfirmResponseConfirm"
    >
      <p class="close-modal__text">确认接受该响应吗？确认后需求状态将变更为"已完成"。</p>
    </a-modal>

    <!-- 详情抽屉 -->
    <a-drawer :get-container="getDrawerContainer"
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
              <span class="drawer-header-title">{{ drawer.record.planName || '--' }}</span>
              <StatusDot :type="getStatusKey(drawer.record.status)" :text="drawer.record.status" />
            </div>
            <div class="drawer-header-sub">
              <span class="cell-mono">需求编号：{{ drawer.record.demandNo || '--' }}</span>
            </div>
          </div>
        </div>

        <div class="overview-section">
          <div class="overview-section__title">需求信息</div>
          <a-descriptions :column="2" bordered size="small" class="drawer-desc">
            <a-descriptions-item label="服务类型">
              <span :class="['service-type-tag', `service-type-tag--${getServiceTypeClass(drawer.record.serviceType)}`]">{{ drawer.record.serviceType || '--' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="方案类型">{{ drawer.record.planType || '--' }}</a-descriptions-item>
            <a-descriptions-item label="服务项" :span="2">
              <span class="cell-default">{{ drawer.record.serviceItems || '--' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="需求说明" :span="2">
              <span class="muted">{{ drawer.record.demandDescription || '--' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="申请机构">{{ drawer.record.orgName || '--' }}</a-descriptions-item>
            <a-descriptions-item label="发布时间">
              <span class="cell-mono">{{ drawer.record.publishTime || '--' }}</span>
            </a-descriptions-item>
          </a-descriptions>
        </div>

        <template v-if="drawer.record.responseContent">
          <div class="overview-section">
            <div class="overview-section__title">响应信息</div>
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
          </div>
        </template>
      </template>
    </a-drawer>
  </div>
</template>

<script>
import {
  PlusOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import FilterBar from '@/components/cloud/FilterBar.vue'
import StatusDot from '@/components/cloud/StatusDot.vue'

export default {
  name: 'MyDemandInitiate',
  components: {
    PageHeader, CloudCard, FilterBar, StatusDot,
    PlusOutlined
  },
  data() {
    return {
      loading: false,
      filter: { demandNo: '', orgName: '', planType: undefined, serviceType: undefined, status: undefined },
      applied: { demandNo: '', orgName: '', planType: undefined, serviceType: undefined, status: undefined },
      pagination: { current: 1, pageSize: 10 },
      drawer: { visible: false, record: null },
      columns: [
        { title: '需求编号', dataIndex: 'demandNo', key: 'demandNo', width: 150 },
        { title: '方案名称', dataIndex: 'planName', key: 'planName', width: 180, ellipsis: true },
        { title: '方案类型', dataIndex: 'planType', key: 'planType', width: 120 },
        { title: '服务项', dataIndex: 'serviceItems', key: 'serviceItems', width: 220, ellipsis: true },
        { title: '需求说明', dataIndex: 'demandDescription', key: 'demandDescription', width: 220, customCell: () => ({ class: 'cell-wrap' }) },
        { title: '申请机构', dataIndex: 'org', key: 'org', width: 200 },
        { title: '服务类型', dataIndex: 'serviceType', key: 'serviceType', width: 110 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 110 },
        { title: '发布时间', dataIndex: 'publishTime', key: 'publishTime', width: 160 },
        { title: '响应机构', dataIndex: 'respondent', key: 'respondent', width: 180, ellipsis: true },
        { title: '响应时间', dataIndex: 'responseTime', key: 'responseTime', width: 160 },
        { title: '操作', dataIndex: 'action', key: 'action', width: 150, fixed: 'right' }
      ],
      demandList: [
        {
          demandNo: 'DM-20260810-0012',
          planName: '统一身份认证平台采购',
          planType: '安全可控',
          serviceItems: '统一身份认证平台、安全审计服务',
          demandDescription: '需要一个统一的身份认证平台，支持OAuth2.0和SAML协议，要求支持至少10万用户的并发认证，并提供SSO单点登录功能',
          serviceType: '安全服务',
          orgName: '北京市海淀区数字经济发展局',
          status: '已响应',
          publishTime: '2026-03-18 10:30:00',
          respondent: '北京信息安全技术有限公司',
          responseContent: '可提供统一身份认证平台方案，支持OAuth2.0/SAML协议，含SSO单点登录，支持10万+用户并发认证。',
          estimatedPrice: '280,000',
          estimatedDuration: '40个工作日',
          responseTime: '2026-03-19 14:20:00'
        },
        {
          demandNo: 'DM-20260810-0011',
          planName: '大数据分析平台建设',
          planType: '政务信创',
          serviceItems: '大数据分析平台、数据可视化组件',
          demandDescription: '需要部署一套大数据分析平台，支持PB级数据处理，包含数据采集、清洗、分析、可视化全流程',
          serviceType: '数字应用',
          orgName: '北京市海淀区数字经济发展局',
          status: '待响应',
          publishTime: '2026-03-15 14:20:00'
        },
        {
          demandNo: 'DM-20260810-0010',
          planName: '弹性云服务器采购',
          planType: '通用商用',
          serviceItems: '云服务器ECS、对象存储OSS',
          demandDescription: '需要采购弹性云服务器资源，配置不低于32核64G内存，带宽不低于100Mbps',
          serviceType: '基础服务',
          orgName: '北京市海淀区数字经济发展局',
          status: '待响应',
          publishTime: '2026-03-10 09:00:00'
        }
      ],
      closeDialogVisible: false,
      closeTarget: {},
      confirmResponseDialogVisible: false,
      confirmResponseTarget: {}
    }
  },
  computed: {
    filteredData() {
      const f = this.applied
      const list = this.demandList.filter(item => {
        if (f.demandNo && !(item.demandNo || '').includes(f.demandNo)) return false
        if (f.orgName && !(item.orgName || '').includes(f.orgName)) return false
        if (f.planType && item.planType !== f.planType) return false
        if (f.serviceType && item.serviceType !== f.serviceType) return false
        if (f.status && item.status !== f.status) return false
        return true
      })
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
  methods: {
    getDemoContainer() {
      return document.querySelector('.app-main__content') || document.body;
    },
    getDrawerContainer() {
      return document.querySelector('.app-overlay') || document.body;
    },
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
    openAddPage() {
      window.open('https://network-org.tssz.qzz.io/#/demand', '_blank')
    },
    viewDetail(row) {
      this.drawer.record = row
      this.drawer.visible = true
    },
    handleClose(row) {
      this.closeTarget = row
      this.closeDialogVisible = true
    },
    handleCloseConfirm() {
      message.success('需求已关闭')
      this.closeDialogVisible = false
    },
    handleConfirmResponse(row) {
      this.confirmResponseTarget = row
      this.confirmResponseDialogVisible = true
    },
    handleConfirmResponseConfirm() {
      const target = this.demandList.find(i => i.demandNo === this.confirmResponseTarget.demandNo)
      if (target) target.status = '已完成'
      message.success('确认响应成功')
      this.confirmResponseDialogVisible = false
    },
    getServiceTypeClass(type) {
      const map = {
        '数字应用': 'digital',
        '安全服务': 'security',
        '能力组件': 'component',
        '基础服务': 'basic'
      }
      return map[type] || ''
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
    getServiceItemList(serviceItems) {
      if (!serviceItems) return []
      return serviceItems.split(/[、，,]/).map(s => s.trim()).filter(Boolean)
    }
  }
}
</script>

<style scoped>
.my-demand-initiate-page {
  padding: 4px 0;
}

.my-demand-initiate-page__divider {
  height: 1px;
  background: #F2F3F5;
  margin: 0 16px;
}

.my-demand-initiate-page__table-wrap {
  padding: 0 16px 16px 16px;
}

.cell-mono {
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
  font-variant-numeric: tabular-nums;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  letter-spacing: -0.2px;
}

.cell-primary {
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-weight: 500;
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

.cell-default {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}

/* 服务类型标签（与需求响应列表一致） */
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

.dialog-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px 0;
  padding: 10px 14px;
  background: #E8F3FF;
  border: 1px solid rgba(22, 93, 255, 0.20);
  border-radius: 6px;
  font-size: 13px;
  color: #165DFF;
}

.dialog-tip__icon {
  font-size: 16px;
  flex-shrink: 0;
}

.app-form .form-section__title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid #F2F3F5;
}

.app-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #F2F3F5;
}

.close-modal__text {
  margin: 0;
  padding: 8px 4px;
  font-size: 14px;
  color: #4E5969;
}

/* Drawer 样式 */
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

.drawer-header-sub__sep {
  color: #C9CDD4;
}

.muted {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 1.6;
}

.price-text {
  color: #F59E0B;
  font-weight: 600;
  font-size: 14px;
}

.overview-section {
  margin-bottom: 16px;
}

.overview-section:last-child {
  margin-bottom: 0;
}

.overview-section__title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin: 0 0 12px 0;
  line-height: 1.4;
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
  width: 160px !important;
  min-width: 160px !important;
  max-width: 160px !important;
  white-space: nowrap;
}

</style>
