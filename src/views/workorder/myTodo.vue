<template>
  <div class="my-todo-page">
    <PageHeader
      title="我的待办"
      description="查看当前用户待处理的工单，支持按工单编号、标题和类型筛选，可点击处理进入工单详情"
    />

    <CloudCard class="my-todo-page__table-card">
      <FilterBar @search="handleQuery" @reset="resetQuery">
        <a-input v-model:value="filter.code" placeholder="工单编号" allow-clear style="width: 180px" @pressEnter="handleQuery" />
        <a-input v-model:value="filter.title" placeholder="工单标题" allow-clear style="width: 180px" @pressEnter="handleQuery" />
        <a-select v-model:value="filter.type" placeholder="工单类型" allow-clear style="width: 150px">
          <a-select-option value="业务申请">业务申请</a-select-option>
          <a-select-option value="技术支持">技术支持</a-select-option>
          <a-select-option value="问题反馈">问题反馈</a-select-option>
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
            <span v-if="column.dataIndex === 'title'" class="cell-primary">{{ record.title || '--' }}</span>
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

    <!-- 详情抽屉 -->
    <a-drawer
      v-model:open="drawer.visible"
      title="待办工单详情"
      :width="860"
      placement="right"
      :body-style="{ padding: '24px' }"
    >
      <template v-if="drawer.record">
        <div class="drawer-header-row">
          <div class="drawer-header-info">
            <div class="drawer-header-title-row">
              <span class="drawer-header-title">{{ drawer.record.code }}</span>
              <StatusDot :type="getStatusKey(drawer.record.status)" :text="drawer.record.status" />
            </div>
            <div class="drawer-header-sub">
              <span :class="['type-pill', `type-pill--${getTypeKey(drawer.record.type)}`]">{{ drawer.record.type }}</span>
              <span class="drawer-header-sub__sep">·</span>
              <span>{{ drawer.record.title }}</span>
            </div>
          </div>
        </div>

        <a-tabs v-model:activeKey="drawer.activeTab">
          <a-tab-pane key="basic" tab="基本信息">
            <a-descriptions :column="2" bordered size="small" class="drawer-desc">
              <a-descriptions-item label="工单编号">
                <span class="cell-mono">{{ drawer.record.code || '--' }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="工单类型">{{ drawer.record.type || '--' }}</a-descriptions-item>
              <a-descriptions-item label="申请人">{{ drawer.record.applicant || '--' }}</a-descriptions-item>
              <a-descriptions-item label="所属部门">{{ drawer.record.department || '--' }}</a-descriptions-item>
              <a-descriptions-item label="联系方式">
                <span class="cell-mono">{{ drawer.record.contact || '--' }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="紧急程度">
                <span :class="['priority-pill', `priority-pill--${getPriorityKey(drawer.record.priority)}`]">{{ drawer.record.priority || '--' }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="申请时间">
                <span class="cell-mono">{{ drawer.record.createTime || '--' }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="工单状态">{{ drawer.record.status || '--' }}</a-descriptions-item>
              <a-descriptions-item label="工单描述" :span="2">
                <span class="muted">{{ drawer.record.description || '--' }}</span>
              </a-descriptions-item>
            </a-descriptions>
          </a-tab-pane>
          <a-tab-pane key="timeline" tab="处理状态">
            <a-timeline class="process-timeline">
              <a-timeline-item
                v-for="(step, idx) in (drawer.record.processSteps || [])"
                :key="idx"
                :color="getTimelineColor(step.status)"
              >
                <div :class="['tl-title', `tl-title--${step.status}`]">{{ step.title }}</div>
                <div class="tl-time">{{ step.time || '待处理' }}</div>
                <div class="tl-handler">处理人：{{ step.handler || '--' }}</div>
              </a-timeline-item>
            </a-timeline>
          </a-tab-pane>
          <a-tab-pane key="records" tab="处理记录">
            <div class="record-list">
              <div v-for="(record, idx) in (drawer.record.processRecords || [])" :key="idx" class="record-item">
                <div class="record-time cell-mono">{{ record.time }}</div>
                <div class="record-content">{{ record.content }}</div>
                <div class="record-handler">- {{ record.handler }}</div>
              </div>
              <div v-if="!(drawer.record.processRecords && drawer.record.processRecords.length)" class="empty-text">暂无处理记录</div>
            </div>
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
  name: 'MyTodo',
  components: {
    PageHeader, CloudCard, FilterBar, StatusDot, ColumnSettings
  },
  data() {
    return {
      loading: false,
      hiddenKeys: [],
      filter: { code: '', title: '', type: undefined },
      applied: { code: '', title: '', type: undefined },
      pagination: { current: 1, pageSize: 10 },
      drawer: { visible: false, record: null, activeTab: 'basic' },
      columns: [
        { title: '工单编号', dataIndex: 'code', key: 'code', width: 160 },
        { title: '工单标题', dataIndex: 'title', key: 'title', width: 220 },
        { title: '工单类型', dataIndex: 'type', key: 'type', width: 120 },
        { title: '工单状态', dataIndex: 'status', key: 'status', width: 110 },
        { title: '申请人 / 处理人', dataIndex: 'applicant', key: 'applicant', width: 180 },
        { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
        { title: '操作', dataIndex: 'action', key: 'action', width: 90, fixed: 'right' }
      ],
      workorderList: []
    }
  },
  computed: {
    visibleColumns() {
      return this.columns.filter(c => !this.hiddenKeys.includes(c.key))
    },
    filteredData() {
      const f = this.applied
      const list = this.workorderList.filter(item => {
        if (f.code && !(item.code || '').includes(f.code)) return false
        if (f.title && !(item.title || '').includes(f.title)) return false
        if (f.type && item.type !== f.type) return false
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
    this.loadWorkorderList()
  },
  watch: {
    $route: {
      handler() {
        this.loadWorkorderList()
      },
      immediate: true
    }
  },
  methods: {
    handleQuery() {
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    resetQuery() {
      this.filter = { code: '', title: '', type: undefined }
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    onTableChange(pag) {
      this.pagination.current = pag.current
      this.pagination.pageSize = pag.pageSize
    },
    loadWorkorderList() {
      this.loading = true
      setTimeout(() => {
        this.workorderList = [
          {
            id: 1, code: 'WO20260402001', title: '网络服务申请', type: '业务申请', status: '待处理',
            createTime: '2026-04-02 10:00:00', applicant: '张三', handler: '当前用户',
            department: '技术部', contact: '13800138000', priority: '普通',
            description: '因业务需求，需要申请网络服务，用于公司内部系统访问。请相关部门尽快处理。',
            processSteps: [
              { title: '提交申请', time: '2026-04-02 10:00:00', handler: '张三', status: 'completed' },
              { title: '部门审批', time: '', handler: '当前用户', status: 'processing' },
              { title: '网络服务配置', time: '', handler: '', status: 'pending' },
              { title: '服务交付', time: '', handler: '', status: 'pending' }
            ],
            processRecords: [
              { time: '2026-04-02 10:00:00', content: '张三提交了网络服务申请工单', handler: '张三' }
            ]
          },
          {
            id: 2, code: 'WO20260402002', title: '设备采购申请', type: '业务申请', status: '待处理',
            createTime: '2026-04-02 09:30:00', applicant: '李四', handler: '当前用户',
            department: '采购部', contact: '13800138001', priority: '高',
            description: '因部门业务扩展，需要采购一批办公设备，包括笔记本电脑、显示器等。',
            processSteps: [
              { title: '提交申请', time: '2026-04-02 09:30:00', handler: '李四', status: 'completed' },
              { title: '部门审批', time: '', handler: '当前用户', status: 'processing' },
              { title: '采购执行', time: '', handler: '', status: 'pending' },
              { title: '服务交付', time: '', handler: '', status: 'pending' }
            ],
            processRecords: [
              { time: '2026-04-02 09:30:00', content: '李四提交了设备采购申请工单', handler: '李四' }
            ]
          },
          {
            id: 3, code: 'WO20260401001', title: '系统权限申请', type: '业务申请', status: '待处理',
            createTime: '2026-04-01 14:20:00', applicant: '王五', handler: '当前用户',
            department: '运营部', contact: '13800138002', priority: '普通',
            description: '申请开通系统管理员权限，用于日常系统维护工作。',
            processSteps: [
              { title: '提交申请', time: '2026-04-01 14:20:00', handler: '王五', status: 'completed' },
              { title: '部门审批', time: '', handler: '当前用户', status: 'processing' },
              { title: '权限配置', time: '', handler: '', status: 'pending' },
              { title: '服务交付', time: '', handler: '', status: 'pending' }
            ],
            processRecords: [
              { time: '2026-04-01 14:20:00', content: '王五提交了系统权限申请工单', handler: '王五' }
            ]
          },
          {
            id: 4, code: 'WO20260331001', title: '技术支持请求', type: '技术支持', status: '待处理',
            createTime: '2026-03-31 11:00:00', applicant: '赵六', handler: '当前用户',
            department: '财务部', contact: '13800138003', priority: '紧急',
            description: '财务系统无法正常登录，请求技术支持协助排查。',
            processSteps: [
              { title: '提交申请', time: '2026-03-31 11:00:00', handler: '赵六', status: 'completed' },
              { title: '问题排查', time: '', handler: '当前用户', status: 'processing' },
              { title: '问题解决', time: '', handler: '', status: 'pending' }
            ],
            processRecords: [
              { time: '2026-03-31 11:00:00', content: '赵六提交了技术支持请求工单', handler: '赵六' }
            ]
          },
          {
            id: 5, code: 'WO20260330001', title: '问题反馈', type: '问题反馈', status: '待处理',
            createTime: '2026-03-30 16:00:00', applicant: '孙七', handler: '当前用户',
            department: '市场部', contact: '13800138004', priority: '低',
            description: '系统页面加载缓慢，影响日常使用，请反馈处理。',
            processSteps: [
              { title: '提交申请', time: '2026-03-30 16:00:00', handler: '孙七', status: 'completed' },
              { title: '反馈处理', time: '', handler: '当前用户', status: 'processing' },
              { title: '服务交付', time: '', handler: '', status: 'pending' }
            ],
            processRecords: [
              { time: '2026-03-30 16:00:00', content: '孙七提交了问题反馈工单', handler: '孙七' }
            ]
          }
        ]
        this.loading = false
      }, 300)
    },
    handleProcess(workorder) {
      this.drawer.record = workorder
      this.drawer.activeTab = 'basic'
      this.drawer.visible = true
    },
    getTypeKey(type) {
      const map = {
        '业务申请': 'business',
        '技术支持': 'technical',
        '问题反馈': 'feedback'
      }
      return map[type] || 'default'
    },
    getStatusKey(status) {
      const map = {
        '待处理': 'processing',
        '处理中': 'processing',
        '已完成': 'done',
        '已关闭': 'cancelled'
      }
      return map[status] || 'default'
    },
    getPriorityKey(priority) {
      const map = { '紧急': 'urgent', '高': 'high', '普通': 'medium', '中': 'medium', '低': 'low' }
      return map[priority] || 'medium'
    },
    getTimelineColor(status) {
      const map = { completed: 'green', processing: 'blue', pending: 'gray' }
      return map[status] || 'gray'
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

.cell-default {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}

.cell-primary {
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-weight: 500;
}

.cell-mono {
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
  font-variant-numeric: tabular-nums;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  letter-spacing: -0.2px;
}

.type-pill {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  border-radius: 11px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
}

.type-pill--business { background: #E8F3FF; color: #165DFF; }
.type-pill--technical { background: rgba(22, 163, 74, 0.10); color: #16A34A; }
.type-pill--feedback { background: rgba(245, 158, 11, 0.10); color: #F59E0B; }
.type-pill--default { background: #F2F3F5; color: #4E5969; }

.priority-pill {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  border-radius: 11px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
}

.priority-pill--low { background: #F2F3F5; color: #4E5969; }
.priority-pill--medium { background: #E8F3FF; color: #165DFF; }
.priority-pill--high { background: rgba(245, 158, 11, 0.10); color: #F59E0B; }
.priority-pill--urgent { background: rgba(239, 68, 68, 0.10); color: #EF4444; }

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

.drawer-desc :deep(.ant-descriptions-item-content) {
  color: rgba(0, 0, 0, 0.85);
  font-size: 13px;
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

.muted {
  color: #4E5969;
  font-size: 14px;
  line-height: 1.6;
}

.process-timeline {
  padding-top: 4px;
}

.tl-title {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 2px;
}

.tl-title--completed { color: #4E5969; }
.tl-title--processing { color: #165DFF; font-weight: 600; }
.tl-title--pending { color: #C9CDD4; }

.tl-time {
  font-size: 11px;
  color: #86909C;
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
  letter-spacing: -0.2px;
  margin-bottom: 2px;
}

.tl-handler {
  font-size: 11px;
  color: #86909C;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.record-item {
  padding: 10px 12px;
  background: #F7F8FA;
  border-radius: 6px;
  border-left: 3px solid #165DFF;
}

.record-time {
  font-size: 11px;
  color: #86909C;
  margin-bottom: 4px;
}

.record-content {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 1.5;
  margin-bottom: 4px;
}

.record-handler {
  font-size: 11px;
  color: #4E5969;
  text-align: right;
}

.empty-text {
  text-align: center;
  color: #C9CDD4;
  font-size: 13px;
  padding: 24px 0;
}
</style>
