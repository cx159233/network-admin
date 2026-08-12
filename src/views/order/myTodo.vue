<template>
  <div class="my-todo-page">
    <PageHeader
      title="我的待办"
      description="处理当前用户待处理的工单订单，支持按订单号、机构、服务类型筛选"
    />

    <CloudCard class="my-todo-page__table-card">
      <FilterBar @search="handleQuery" @reset="resetQuery">
        <a-input v-model:value="filter.keyword" placeholder="订单号、机构名、服务名称" allow-clear style="width: 240px" @pressEnter="handleQuery" />
        <a-select v-model:value="filter.org" placeholder="所有机构" allow-clear style="width: 180px">
          <a-select-option value="北京市海淀区数字经济发展局">北京市海淀区数字经济发展局</a-select-option>
          <a-select-option value="华能数智科技集团">华能数智科技集团</a-select-option>
          <a-select-option value="中国电信股份有限公司">中国电信股份有限公司</a-select-option>
        </a-select>
        <a-select v-model:value="filter.type" placeholder="所有服务类型" allow-clear style="width: 150px">
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
      <div class="my-todo-page__divider"></div>

      <div class="my-todo-page__table-wrap">
        <a-table
          :columns="visibleColumns"
          :data-source="filteredData"
          :pagination="paginationConfig"
          :loading="loading"
          row-key="id"
          size="middle"
          @change="onTableChange"
        >
          <template #bodyCell="{ column, record }">
            <span v-if="column.dataIndex === 'code'" class="cell-primary">{{ record.code || '--' }}</span>
            <template v-else-if="column.dataIndex === 'service'">
              <div class="cell-stack">
                <div class="cell-stack__primary">{{ record.name || '--' }}</div>
                <div class="cell-stack__secondary">{{ record.spec || '无规格' }}</div>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'org'">
              <div class="cell-stack">
                <div class="cell-stack__primary">{{ record.org || '--' }}</div>
                <div class="cell-stack__secondary">{{ record.applicant || '未知' }}</div>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'type'">
              <span :class="['service-type-tag', `service-type-tag--${getServiceTypeClass(record.type)}`]">{{ record.type || '--' }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <StatusDot :type="getStatusKey(record.status)" :text="record.status" />
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-button type="link" size="small" class="!p-0" @click="handleProcess(record)">处理</a-button>
            </template>
            <span v-else class="cell-default">{{ record[column.dataIndex] || '--' }}</span>
          </template>
        </a-table>
      </div>
    </CloudCard>

    <!-- 待办详情抽屉 -->
    <a-drawer
      v-model:open="drawer.visible"
      title="待办详情"
      :width="860"
      placement="right"
      :body-style="{ padding: '24px' }"
    >
      <template v-if="drawer.record">
        <div class="drawer-header-row">
          <div class="drawer-header-info">
            <div class="drawer-header-title-row">
              <span class="drawer-header-title">{{ drawer.record.name || '--' }}</span>
              <StatusDot :type="getStatusKey(drawer.record.status)" :text="drawer.record.status" />
            </div>
            <div class="drawer-header-sub">
              <span>服务ID：{{ drawer.record.code || '--' }}</span>
            </div>
          </div>
        </div>

        <a-tabs v-model:activeKey="drawer.activeTab" class="mvp-detail-tabs">
          <a-tab-pane key="info" tab="概览">
            <a-descriptions :column="2" bordered size="small" class="drawer-desc">
              <a-descriptions-item label="订单号">
                <span class="cell-mono">{{ drawer.record.code || '--' }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="服务名称">{{ drawer.record.name || '--' }}</a-descriptions-item>
              <a-descriptions-item label="服务规格" :span="2">{{ drawer.record.spec || '--' }}</a-descriptions-item>
              <a-descriptions-item label="服务类型">
                <span :class="['service-type-tag', `service-type-tag--${getServiceTypeClass(drawer.record.type)}`]">{{ drawer.record.type || '--' }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="状态">{{ drawer.record.status || '--' }}</a-descriptions-item>
              <a-descriptions-item label="申请人">{{ drawer.record.applicant || '--' }}</a-descriptions-item>
              <a-descriptions-item label="申请部门">{{ drawer.record.department || '--' }}</a-descriptions-item>
              <a-descriptions-item label="申请机构">{{ drawer.record.org || '--' }}</a-descriptions-item>
              <a-descriptions-item label="申请时间">
                <span class="cell-mono">{{ drawer.record.createTime || '--' }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="关联工单">
                <span class="cell-mono">{{ drawer.record.workorderCode || '--' }}</span>
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
          <a-tab-pane key="process" tab="处理操作">
            <a-form :model="processForm" layout="vertical" class="process-form">
              <a-form-item label="处理结果">
                <a-radio-group v-model:value="processForm.result">
                  <a-radio value="pass">通过</a-radio>
                  <a-radio value="reject">驳回</a-radio>
                  <a-radio value="transfer">转交</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="处理意见">
                <a-textarea
                  v-model:value="processForm.comment"
                  :rows="4"
                  placeholder="请输入处理意见"
                  :maxlength="500"
                  show-count
                />
              </a-form-item>
              <a-form-item v-if="processForm.result === 'transfer'" label="转交人">
                <a-select v-model:value="processForm.transferTo" placeholder="请选择转交人">
                  <a-select-option value="wangwu">王五</a-select-option>
                  <a-select-option value="zhaoliu">赵六</a-select-option>
                  <a-select-option value="sunqi">孙七</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item>
                <a-space>
                  <a-button type="primary" @click="submitProcess">提交处理</a-button>
                  <a-button @click="resetProcess">重置</a-button>
                </a-space>
              </a-form-item>
            </a-form>
          </a-tab-pane>
        </a-tabs>
      </template>
    </a-drawer>
  </div>
</template>

<script>
import { Modal, message } from 'ant-design-vue'
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import FilterBar from '@/components/cloud/FilterBar.vue'
import StatusDot from '@/components/cloud/StatusDot.vue'
import ColumnSettings from '@/components/cloud/ColumnSettings.vue'

export default {
  name: 'OrderMyTodo',
  components: {
    PageHeader, CloudCard, FilterBar, StatusDot, ColumnSettings
  },
  data() {
    return {
      loading: false,
      hiddenKeys: [],
      filter: { keyword: '', org: undefined, type: undefined, status: undefined },
      applied: { keyword: '', org: undefined, type: undefined, status: undefined },
      pagination: { current: 1, pageSize: 10 },
      drawer: { visible: false, record: null, activeTab: 'info' },
      processForm: { result: 'pass', comment: '', transferTo: undefined },
      drawerTimeline: [
        { title: '提交申请', time: '工单流转中', state: 'done', dotColor: 'green' },
        { title: '系统派发工单', time: '自动派发', state: 'done', dotColor: 'green' },
        { title: '工单流转中', time: '当前节点', state: 'on', dotColor: 'blue' },
        { title: '服务交付完成', time: '等待工单系统回执', state: 'wait', dotColor: 'gray' },
        { title: '服务评价', time: '交付完成后可评价', state: 'wait', dotColor: 'gray' },
        { title: '订单驳回', time: '工单驳回后记录驳回时间', state: 'wait', dotColor: 'gray' },
        { title: '订单取消', time: '用户取消订单后记录取消时间', state: 'wait', dotColor: 'gray' }
      ],
      columns: [
        { title: '订单号', dataIndex: 'code', key: 'code', width: 150 },
        { title: '服务名称 / 规格', dataIndex: 'service', key: 'service', width: 260 },
        { title: '申请机构 / 申请人', dataIndex: 'org', key: 'org', width: 240 },
        { title: '服务类型', dataIndex: 'type', key: 'type', width: 130 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 120 },
        { title: '关联工单', dataIndex: 'workorderCode', key: 'workorderCode', width: 130 },
        { title: '申请时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
        { title: '操作', dataIndex: 'action', key: 'action', width: 90, fixed: 'right' }
      ],
      orderList: [
        { id: 1, code: '202608100001', name: '等保三级合规评估', spec: '含渗透测试 + 整改报告', org: '北京市海淀区数字经济发展局', applicant: '张三', department: '技术部', type: '安全服务', status: '工单流转中', workorderCode: '202608100001', createTime: '2026-03-15 10:30:00' },
        { id: 2, code: '202608100002', name: '云主机（ECS）', spec: '4核8G，500G SSD', org: '华能数智科技集团', applicant: '李四', department: '运维部', type: '标准云资源', status: '工单流转中', workorderCode: '202608100002', createTime: '2026-03-14 14:20:00' },
        { id: 3, code: '202608100003', name: '智慧园区管理系统', spec: '标准版，含500个设备接入', org: '中国电信股份有限公司', applicant: '王五', department: '信息化部', type: '数字应用', status: '工单流转中', workorderCode: '202608100003', createTime: '2026-03-13 09:15:00' },
        { id: 4, code: '202608100004', name: 'AI 语音识别组件', spec: '支持中文识别，准确率98%', org: '北京市海淀区数字经济发展局', applicant: '赵六', department: '创新部', type: '能力组件', status: '工单流转中', workorderCode: '202608100004', createTime: '2026-03-12 16:45:00' },
        { id: 5, code: '202608100005', name: '定制化网络安全方案', spec: '企业级，含防火墙部署', org: '华能数智科技集团', applicant: '孙七', department: '安全部', type: '定制化资源', status: '工单流转中', workorderCode: '202608100005', createTime: '2026-03-11 11:20:00' }
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
          const blob = `${item.code || ''} ${item.org || ''} ${item.name || ''}`.toLowerCase()
          if (!blob.includes(kw)) return false
        }
        if (f.org && item.org !== f.org) return false
        if (f.type && item.type !== f.type) return false
        if (f.status && item.status !== f.status) return false
        return true
      })
      list.sort((a, b) => (a.createTime < b.createTime ? 1 : -1))
      return list.map(i => ({ key: i.id, ...i }))
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
      this.filter = { keyword: '', org: undefined, type: undefined, status: undefined }
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
    handleProcess(row) {
      this.drawer.record = row
      this.drawer.activeTab = 'info'
      this.drawer.visible = true
      this.resetProcess()
    },
    submitProcess() {
      if (!this.processForm.comment.trim()) {
        message.warning('请输入处理意见')
        return
      }
      if (this.processForm.result === 'transfer' && !this.processForm.transferTo) {
        message.warning('请选择转交人')
        return
      }
      const resultText = {
        pass: '通过',
        reject: '驳回',
        transfer: '转交'
      }[this.processForm.result]
      Modal.confirm({
        title: '确认提交',
        content: `确定要${resultText}该订单吗？`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          setTimeout(() => {
            message.success('处理成功')
            this.drawer.visible = false
            this.resetProcess()
          }, 300)
        }
      })
    },
    resetProcess() {
      this.processForm = { result: 'pass', comment: '', transferTo: undefined }
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
.my-todo-page {
  padding: 4px 0;
}

.my-todo-page__divider {
  height: 1px;
  background: #F2F3F5;
  margin: 0 16px;
}

.my-todo-page__table-wrap {
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
.ant-drawer .ant-table-wrapper,
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
