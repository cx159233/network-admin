<template>
  <div class="my-demand-response-page">
    <PageHeader
      title="需求响应"
      description="查看所有待响应需求及我的响应记录，支持按需求编号、机构名称、服务类型筛选"
    />

    <CloudCard class="my-demand-response-page__table-card">
      <a-tabs v-model:activeKey="activeTab" class="response-tabs">
        <a-tab-pane key="all" tab="所有待响应需求" />
        <a-tab-pane key="my" tab="我的响应" />
      </a-tabs>
      <FilterBar @search="handleQuery" @reset="resetQuery">
        <a-input v-model:value="filter.demandNo" placeholder="需求编号" allow-clear style="width: 180px" @pressEnter="handleQuery" />
        <a-input v-model:value="filter.orgName" placeholder="机构名称" allow-clear style="width: 180px" @pressEnter="handleQuery" />
        <a-select v-model:value="filter.serviceType" placeholder="服务类型" allow-clear style="width: 150px">
          <a-select-option value="数字应用">数字应用</a-select-option>
          <a-select-option value="安全服务">安全服务</a-select-option>
          <a-select-option value="能力组件">能力组件</a-select-option>
          <a-select-option value="基础服务">基础服务</a-select-option>
        </a-select>
      </FilterBar>
      <div class="my-demand-response-page__divider"></div>

      <div class="my-demand-response-page__table-wrap">
        <a-table
          v-if="activeTab === 'all'"
          :columns="allColumns"
          :data-source="filteredAllData"
          :pagination="paginationConfig"
          :loading="loading"
          row-key="demandNo"
          size="middle"
          @change="onTableChange"
        >
          <template #bodyCell="{ column, record }">
            <span v-if="column.dataIndex === 'demandNo'" class="cell-primary">{{ record.demandNo || '--' }}</span>
            <template v-else-if="column.dataIndex === 'org'">
              <div class="cell-stack">
                <div class="cell-stack__primary">{{ record.orgName || '--' }}</div>
                <div class="cell-stack__secondary">{{ record.applicant || '--' }}</div>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'serviceType'">
              <span :class="['service-type-tag', `service-type-tag--${getServiceTypeClass(record.serviceType)}`]">{{ record.serviceType }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <StatusDot :type="getStatusKey(record.status)" :text="record.status" />
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-space size="small">
                <a-button v-if="record.status === '待响应'" type="link" size="small" class="!p-0" @click="openResponseDialog(record)">响应</a-button>
                <a-divider v-if="record.status === '待响应'" type="vertical" class="!mx-[2px]" />
                <a-button type="link" size="small" class="!p-0" @click="viewDetail(record)">详情</a-button>
              </a-space>
            </template>
            <span v-else class="cell-default">{{ record[column.dataIndex] || '--' }}</span>
          </template>
        </a-table>
        <a-table
          v-else
          :columns="myColumns"
          :data-source="filteredMyData"
          :pagination="paginationConfig"
          :loading="loading"
          row-key="demandNo"
          size="middle"
          @change="onTableChange"
        >
          <template #bodyCell="{ column, record }">
            <span v-if="column.dataIndex === 'demandNo'" class="cell-primary">{{ record.demandNo || '--' }}</span>
            <template v-else-if="column.dataIndex === 'org'">
              <div class="cell-stack">
                <div class="cell-stack__primary">{{ record.orgName || '--' }}</div>
                <div class="cell-stack__secondary">{{ record.applicant || '--' }}</div>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'serviceType'">
              <span :class="['service-type-tag', `service-type-tag--${getServiceTypeClass(record.serviceType)}`]">{{ record.serviceType }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <StatusDot :type="getStatusKey(record.status)" :text="record.status" />
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-button type="link" size="small" class="!p-0" @click="viewMyResponseDetail(record)">详情</a-button>
            </template>
            <span v-else class="cell-default">{{ record[column.dataIndex] || '--' }}</span>
          </template>
        </a-table>
      </div>
    </CloudCard>

    <a-drawer
      v-model:open="responseDialogVisible"
      title="响应需求"
      :width="560"
      placement="right"
      :body-style="{ padding: '24px' }"
      :mask-closable="false"
    >
      <div class="dialog-tip">
        <InfoCircleOutlined class="dialog-tip__icon" />
        <span>请根据需求内容提供您的解决方案和报价信息。</span>
      </div>
      <div class="demand-info-box">
        <div class="form-section__title">需求信息</div>
        <a-descriptions :column="2" size="small" class="demand-desc">
          <a-descriptions-item label="需求编号">
            <span class="cell-mono">{{ currentDemand.demandNo }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="服务类型">{{ currentDemand.serviceType }}</a-descriptions-item>
          <a-descriptions-item label="申请机构">{{ currentDemand.orgName }}</a-descriptions-item>
          <a-descriptions-item label="申请人">{{ currentDemand.applicant }}</a-descriptions-item>
          <a-descriptions-item label="发布时间" :span="2">
            <span class="cell-mono">{{ currentDemand.publishTime }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="需求描述" :span="2">{{ currentDemand.demandDescription }}</a-descriptions-item>
        </a-descriptions>
      </div>
      <a-form ref="responseFormRef" :model="responseForm" :rules="responseRules" layout="vertical" class="app-form">
        <div class="form-section">
          <div class="form-section__title">响应信息</div>
          <a-form-item label="响应内容" name="responseContent">
            <a-textarea v-model:value="responseForm.responseContent" :rows="5" placeholder="请描述您的解决方案、技术方案和交付计划" />
          </a-form-item>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="预估报价" name="estimatedPrice">
                <a-input v-model:value="responseForm.estimatedPrice" placeholder="请输入预估报价">
                  <template #suffix>元</template>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="预计工期">
                <a-input v-model:value="responseForm.estimatedDuration" placeholder="如：30个工作日" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
      </a-form>
      <template #footer>
        <div class="app-modal__footer">
          <a-button @click="responseDialogVisible = false">取消</a-button>
          <a-button type="primary" @click="handleResponseSubmit">提交响应</a-button>
        </div>
      </template>
    </a-drawer>
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
              <span class="drawer-header-title">{{ drawer.record.planName || '--' }}</span>
              <StatusDot :type="getStatusKey(drawer.record.status)" :text="drawer.record.status" />
            </div>
            <div class="drawer-header-sub">
              <span class="cell-mono">{{ drawer.record.demandNo || '--' }}</span>
            </div>
          </div>
        </div>

        <a-tabs v-model:activeKey="drawer.activeTab">
          <a-tab-pane key="overview" tab="概览">
            <div class="overview-section-title">需求信息</div>
            <a-descriptions :column="2" bordered size="small" class="drawer-desc">
              <a-descriptions-item label="需求编号">
                <span class="cell-mono">{{ drawer.record.demandNo || '--' }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="服务类型">{{ drawer.record.serviceType || '--' }}</a-descriptions-item>
              <a-descriptions-item label="申请机构">{{ drawer.record.orgName || '--' }}</a-descriptions-item>
              <a-descriptions-item label="申请人">{{ drawer.record.applicant || '--' }}</a-descriptions-item>
              <a-descriptions-item label="发布时间">
                <span class="cell-mono">{{ drawer.record.publishTime || '--' }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="需求状态">{{ drawer.record.status || '--' }}</a-descriptions-item>
              <a-descriptions-item label="需求描述" :span="2">
                <span class="muted">{{ drawer.record.demandDescription || '--' }}</span>
              </a-descriptions-item>
            </a-descriptions>

            <template v-if="drawer.record.responseContent">
              <div class="overview-section-title overview-section-title--spaced">响应信息</div>
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
            </template>
          </a-tab-pane>
        </a-tabs>
      </template>
    </a-drawer>
  </div>
</template>

<script>
import {
  InfoCircleOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import FilterBar from '@/components/cloud/FilterBar.vue'
import StatusDot from '@/components/cloud/StatusDot.vue'

export default {
  name: 'MyDemandResponse',
  components: {
    PageHeader, CloudCard, FilterBar, StatusDot,
    InfoCircleOutlined
  },
  data() {
    return {
      loading: false,
      activeTab: 'all',
      filter: { demandNo: '', orgName: '', serviceType: undefined },
      applied: { demandNo: '', orgName: '', serviceType: undefined },
      pagination: { current: 1, pageSize: 10 },
      allColumns: [
        { title: '需求编号', dataIndex: 'demandNo', key: 'demandNo', width: 150 },
        { title: '需求描述', dataIndex: 'demandDescription', key: 'demandDescription', ellipsis: true },
        { title: '申请机构 / 申请人', dataIndex: 'org', key: 'org', width: 220 },
        { title: '服务类型', dataIndex: 'serviceType', key: 'serviceType', width: 130 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 110 },
        { title: '发布时间', dataIndex: 'publishTime', key: 'publishTime', width: 160 },
        { title: '操作', dataIndex: 'action', key: 'action', width: 150, fixed: 'right' }
      ],
      myColumns: [
        { title: '需求编号', dataIndex: 'demandNo', key: 'demandNo', width: 150 },
        { title: '需求描述', dataIndex: 'demandDescription', key: 'demandDescription', ellipsis: true },
        { title: '申请机构 / 申请人', dataIndex: 'org', key: 'org', width: 220 },
        { title: '服务类型', dataIndex: 'serviceType', key: 'serviceType', width: 130 },
        { title: '需求状态', dataIndex: 'status', key: 'status', width: 110 },
        { title: '预估报价', dataIndex: 'estimatedPrice', key: 'estimatedPrice', width: 120 },
        { title: '响应时间', dataIndex: 'responseTime', key: 'responseTime', width: 160 },
        { title: '操作', dataIndex: 'action', key: 'action', width: 90, fixed: 'right' }
      ],
      allDemandList: [
        { demandNo: 'DM-20260810-0012', planName: '统一身份认证平台采购', demandDescription: '需要一个统一的身份认证平台，支持OAuth2.0和SAML协议，要求支持至少10万用户的并发认证，并提供SSO单点登录功能', serviceType: '安全服务', orgName: '北京市海淀区数字经济发展局', applicant: '张三', status: '待响应', publishTime: '2026-03-18 10:30:00' },
        { demandNo: 'DM-20260810-0008', planName: '智慧医疗数据中台建设', demandDescription: '需要部署一套智慧医疗数据中台，支持多源异构数据整合与分析', serviceType: '数字应用', orgName: '北京市第一人民医院', applicant: '李四', status: '待响应', publishTime: '2026-03-16 11:00:00' },
        { demandNo: 'DM-20260810-0007', planName: '高性能GPU计算集群采购', demandDescription: '需要采购高性能GPU计算集群，用于AI模型训练', serviceType: '基础服务', orgName: '北京人工智能研究院', applicant: '王五', status: '已响应', publishTime: '2026-03-12 08:30:00', respondent: '北京云计算科技有限公司', responseContent: '我方可提供NVIDIA A100集群方案，包含8卡GPU服务器2台，配套分布式训练框架，支持PyTorch/TensorFlow。提供7×24小时运维支持。', estimatedPrice: '580,000', estimatedDuration: '45个工作日', responseTime: '2026-03-13 09:20:00' },
        { demandNo: 'DM-20260810-0005', planName: '网络安全防护方案', demandDescription: '需要一套完整的网络安全防护方案，包括防火墙、入侵检测、日志审计等', serviceType: '安全服务', orgName: '北京市海淀区数字经济发展局', applicant: '张三', status: '已响应', publishTime: '2026-03-08 15:20:00', respondent: '北京信息安全技术有限公司', responseContent: '推荐部署下一代防火墙+态势感知平台，包含入侵防御、Web应用防护、日志审计模块。支持等保三级合规要求。', estimatedPrice: '320,000', estimatedDuration: '30个工作日', responseTime: '2026-03-09 14:30:00' }
      ],
      myResponseList: [
        { demandNo: 'DM-20260810-0007', planName: '高性能GPU计算集群采购', demandDescription: '需要采购高性能GPU计算集群，用于AI模型训练', serviceType: '基础服务', orgName: '北京人工智能研究院', applicant: '王五', status: '已响应', publishTime: '2026-03-12 08:30:00', responseContent: '我方可提供NVIDIA A100集群方案，包含8卡GPU服务器2台，配套分布式训练框架，支持PyTorch/TensorFlow。提供7×24小时运维支持。', estimatedPrice: '580,000', estimatedDuration: '45个工作日', responseTime: '2026-03-13 09:20:00' },
        { demandNo: 'DM-20260810-0005', planName: '网络安全防护方案', demandDescription: '需要一套完整的网络安全防护方案，包括防火墙、入侵检测、日志审计等', serviceType: '安全服务', orgName: '北京市海淀区数字经济发展局', applicant: '张三', status: '已响应', publishTime: '2026-03-08 15:20:00', responseContent: '推荐部署下一代防火墙+态势感知平台，包含入侵防御、Web应用防护、日志审计模块。支持等保三级合规要求。', estimatedPrice: '320,000', estimatedDuration: '30个工作日', responseTime: '2026-03-09 14:30:00' },
        { demandNo: 'DM-20260810-0003', planName: '统一数据治理平台建设', demandDescription: '需要构建统一数据治理平台，实现数据质量管理、元数据管理、数据血缘分析', serviceType: '数字应用', orgName: '北京市卫健委', applicant: '赵六', status: '已完成', publishTime: '2026-03-01 10:00:00', responseContent: '提供一站式数据治理解决方案，涵盖数据标准管理、质量监控、血缘追踪。支持对接主流数据库与大数据平台。', estimatedPrice: '450,000', estimatedDuration: '60个工作日', responseTime: '2026-03-02 16:00:00' }
      ],
      responseDialogVisible: false,
      currentDemand: {},
      responseForm: { responseContent: '', estimatedPrice: '', estimatedDuration: '' },
      responseRules: {
        responseContent: [{ required: true, message: '请输入响应内容', trigger: 'blur' }],
        estimatedPrice: [{ required: true, message: '请输入预估报价', trigger: 'blur' }]
      },
      drawer: { visible: false, record: null, activeTab: 'overview' }
    }
  },
  computed: {
    filteredAllData() {
      const f = this.applied
      const list = this.allDemandList.filter(item => {
        if (item.status !== '待响应') return false
        if (f.demandNo && !(item.demandNo || '').includes(f.demandNo)) return false
        if (f.orgName && !(item.orgName || '').includes(f.orgName)) return false
        if (f.serviceType && item.serviceType !== f.serviceType) return false
        return true
      })
      return list.map(i => ({ key: i.demandNo, ...i }))
    },
    filteredMyData() {
      const f = this.applied
      const list = this.myResponseList.filter(item => {
        if (f.demandNo && !(item.demandNo || '').includes(f.demandNo)) return false
        if (f.orgName && !(item.orgName || '').includes(f.orgName)) return false
        if (f.serviceType && item.serviceType !== f.serviceType) return false
        return true
      })
      return list.map(i => ({ key: i.demandNo, ...i }))
    },
    paginationConfig() {
      const total = this.activeTab === 'all' ? this.filteredAllData.length : this.filteredMyData.length
      return {
        current: this.pagination.current,
        pageSize: this.pagination.pageSize,
        total,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (t) => `共 ${t} 条`
      }
    }
  },
  methods: {
    handleQuery() {
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    resetQuery() {
      this.filter = { demandNo: '', orgName: '', serviceType: undefined }
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    onTableChange(pag) {
      this.pagination.current = pag.current
      this.pagination.pageSize = pag.pageSize
    },
    openResponseDialog(row) {
      this.currentDemand = row
      this.responseForm = { responseContent: '', estimatedPrice: '', estimatedDuration: '' }
      this.responseDialogVisible = true
    },
    handleResponseSubmit() {
      this.$refs.responseFormRef.validate().then(() => {
        message.success('响应提交成功')
        this.responseDialogVisible = false
      }).catch(() => {})
    },
    viewDetail(row) {
      this.drawer.record = row
      this.drawer.activeTab = 'overview'
      this.drawer.visible = true
    },
    viewMyResponseDetail(row) {
      this.drawer.record = row
      this.drawer.activeTab = 'overview'
      this.drawer.visible = true
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
    }
  }
}
</script>

<style scoped>
.my-demand-response-page {
  padding: 4px 0;
}

.response-tabs :deep(.ant-tabs-nav) {
  margin: 0 16px;
}

.my-demand-response-page__divider {
  height: 1px;
  background: #F2F3F5;
  margin: 0 16px;
}

.my-demand-response-page__table-wrap {
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

.cell-default {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
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

.cell-empty {
  color: #C9CDD4;
  font-size: 14px;
}

.price-text {
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
  font-variant-numeric: tabular-nums;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
}

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

.demand-info-box {
  background: #F7F8FA;
  border-radius: 8px;
  padding: 14px 16px;
  margin-bottom: 16px;
}

.form-section__title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid #F2F3F5;
}

.demand-desc :deep(.ant-descriptions-item-label) {
  color: #86909C;
  font-size: 13px;
  width: 160px !important;
  min-width: 160px !important;
  max-width: 160px !important;
  white-space: nowrap;
}

.demand-desc :deep(.ant-descriptions-item-content) {
  color: rgba(0, 0, 0, 0.85);
  font-size: 13px;
}

.app-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
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
  color: #4E5969;
  font-size: 14px;
  line-height: 1.6;
}

.overview-section-title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin: 0 0 12px 0;
  padding-left: 8px;
  border-left: 3px solid #165DFF;
}

.overview-section-title--spaced {
  margin-top: 20px;
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
