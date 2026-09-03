<template>
  <div class="account-list-page">
    <div class="sticky top-0 z-30 bg-surface border-b border-border px-[24px] py-[12px] -mx-[0] mb-[12px] rounded-t-[8px]">
      <div class="flex items-center gap-[12px]">
        <a class="text-text-secondary hover:text-primary text-[13px] flex items-center gap-[4px]" @click="goBack">
          <ArrowLeftOutlined />
          返回
        </a>
        <a-divider type="vertical" />
        <span class="text-[16px] font-semibold text-text-primary">账户列表</span>
        <span class="text-[13px] text-text-tertiary">{{ orgName }}</span>
      </div>
    </div>

    <CloudCard class="account-list-page__table-card">
      <FilterBar @search="handleQuery" @reset="resetQuery">
        <a-input
          v-model:value="filter.username"
          placeholder="真实姓名"
          allow-clear
          style="width: 180px"
          @pressEnter="handleQuery"
        />
        <a-select
          v-model:value="filter.status"
          placeholder="状态"
          allow-clear
          style="width: 130px"
        >
          <a-select-option value="enabled">启用</a-select-option>
          <a-select-option value="disabled">停用</a-select-option>
        </a-select>
      </FilterBar>
      <div class="account-list-page__divider"></div>
      <div class="account-list-page__table-wrap">
        <a-table :scroll="{ x: 'max-content' }"
          :columns="columns"
          :data-source="filteredData"
          :loading="loading"
          :pagination="paginationConfig"
          row-key="id"
          size="middle"
          @change="onTableChange"
        >
          <template #bodyCell="{ column, record }">
            <span v-if="column.dataIndex === 'username'" class="cell-primary">{{ record.username }}</span>
            <span v-else-if="column.dataIndex === 'idCard'" class="cell-default">{{ maskIdCard(record.idCard) }}</span>
            <template v-else-if="column.dataIndex === 'status'">
              <a-badge :status="record.status === 'enabled' ? 'success' : 'error'" :text="record.status === 'enabled' ? '启用' : '停用'" />
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-space size="small">
                <a-button
                  type="link"
                  size="small"
                  :danger="record.status === 'enabled'"
                  class="!p-0"
                  @click="handleToggleStatus(record)"
                >{{ record.status === 'enabled' ? '停用' : '启用' }}</a-button>
              </a-space>
            </template>
            <span v-else class="cell-default">{{ record[column.dataIndex] || '--' }}</span>
          </template>
        </a-table>
      </div>
    </CloudCard>
  </div>
</template>

<script>
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import FilterBar from '@/components/cloud/FilterBar.vue'
import StatusDot from '@/components/cloud/StatusDot.vue'

export default {
  name: 'AccountList',
  components: {
    CloudCard,
    FilterBar,
    StatusDot,
    ArrowLeftOutlined
  },
  data() {
    return {
      loading: false,
      orgName: '',
      filter: { username: '', status: undefined },
      applied: { username: '', status: undefined },
      pagination: { current: 1, pageSize: 10 },
      columns: [
        { title: '序号', dataIndex: 'index', key: 'index', width: 60 },
        { title: '真实姓名', dataIndex: 'username', key: 'username', width: 110 },
        { title: '登录账号', dataIndex: 'account', key: 'account', width: 150 },
        { title: '身份证号', dataIndex: 'idCard', key: 'idCard', width: 170 },
        { title: '联系方式', dataIndex: 'phone', key: 'phone', width: 130 },
        { title: '职务', dataIndex: 'duty', key: 'duty', width: 110 },
        { title: 'E-mail/微信号', dataIndex: 'email', key: 'email', width: 180, ellipsis: true },
        { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
        { title: '启停状态', dataIndex: 'status', key: 'status', width: 90 },
        { title: '操作', dataIndex: 'action', key: 'action', width: 90, fixed: 'right' }
      ],
      accountList: [
        { id: 1, username: '李雪', account: 'lixue2026', idCard: '110108199001011234', phone: '13800138001', duty: '商务经理', email: 'li.xue@yingxiangyun.com', createTime: '2026-03-15 10:30:00', status: 'enabled' },
        { id: 2, username: '张明', account: 'zhangming01', idCard: '320102198805152345', phone: '13800138002', duty: '项目经理', email: 'zhang.m@yingxiangyun.com', createTime: '2026-03-16 09:15:00', status: 'enabled' },
        { id: 3, username: '王刚', account: 'wanggang02', idCard: '440106199210203456', phone: '13800138003', duty: '运维工程师', email: 'wang.g@yingxiangyun.com', createTime: '2026-03-17 14:20:00', status: 'disabled' }
      ]
    }
  },
  computed: {
    filteredData() {
      const f = this.applied
      return this.accountList.filter(item => {
        if (f.username && !(item.username || '').includes(f.username)) return false
        if (f.status !== undefined && item.status !== f.status) return false
        return true
      }).map((item, i) => ({ key: item.id, ...item, index: i + 1 }))
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
    this.orgName = this.$route.query.orgName || '--'
    this.loadAccountList()
  },
  methods: {
    getDemoContainer() {
      return document.querySelector('.app-main__content') || document.body;
    },
    getDrawerContainer() {
      return document.querySelector('.app-overlay') || document.body;
    },
    loadAccountList() {
      this.loading = true
      setTimeout(() => { this.loading = false }, 200)
    },
    goBack() {
      this.$router.push('/portal/orgCollaboration/list')
    },
    handleQuery() {
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    resetQuery() {
      this.filter = { username: '', status: undefined }
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    onTableChange(pag) {
      this.pagination.current = pag.current
      this.pagination.pageSize = pag.pageSize
    },
    maskIdCard(val) {
      if (!val) return '--'
      const s = String(val)
      if (s.length <= 7) return val
      return s.slice(0, 3) + '*'.repeat(s.length - 7) + s.slice(-4)
    },
    handleToggleStatus(record) {
      const action = record.status === 'enabled' ? '停用' : '启用'
      Modal.confirm({
        getContainer: this.getDemoContainer,
        title: `确认${action}`,
        content: `确定要${action}该账户吗？`,
        okText: '确定',
        cancelText: '取消',
        okType: record.status === 'enabled' ? 'danger' : 'primary',
        onOk: () => {
          message.success(`账户已${action}`)
        }
      })
    }
  }
}
</script>

<style scoped>
.account-list-page {
  padding: 4px 0;
}

.account-list-page__divider {
  height: 1px;
  background: #F2F3F5;
  margin: 0 16px;
}

.account-list-page__table-wrap {
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
</style>
