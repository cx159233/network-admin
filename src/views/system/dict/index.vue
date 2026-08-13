<template>
  <div class="dict-page">
    <PageHeader
      title="字典管理"
      description="维护平台常用字典分类与字典项，供下拉选择、状态展示等场景使用"
    >
      <template #actions>
        <a-button @click="handleRefreshCache">
          <template #icon><ReloadOutlined /></template>
          刷新缓存
        </a-button>
      </template>
    </PageHeader>

    <CloudCard class="dict-page__table-card">
      <FilterBar @search="handleQuery" @reset="resetQuery">
        <template #actions>
          <a-button type="primary" @click="handleAdd">
            <template #icon><PlusOutlined /></template>
            新增
          </a-button>
          <a-button
            type="primary"
            :disabled="single"
            @click="handleEdit()"
          >
            <template #icon><EditOutlined /></template>
            修改
          </a-button>
          <a-button
            danger
            :disabled="multiple"
            @click="handleDelete"
          >
            <template #icon><DeleteOutlined /></template>
            删除
          </a-button>
        </template>
        <a-input
          v-model:value="queryParams.dictName"
          placeholder="请输入字典名称"
          allow-clear
          style="width: 200px"
          @pressEnter="handleQuery"
        />
        <a-select
          v-model:value="queryParams.dictType"
          placeholder="字典类型"
          allow-clear
          style="width: 200px"
        >
          <a-select-option v-for="t in typeOptions" :key="t.dictType" :value="t.dictType">{{ t.dictName }}</a-select-option>
        </a-select>
        <a-select
          v-model:value="queryParams.status"
          placeholder="状态"
          allow-clear
          style="width: 120px"
        >
          <a-select-option value="0">正常</a-select-option>
          <a-select-option value="1">停用</a-select-option>
        </a-select>
        <a-range-picker
          v-model:value="queryParams.createTimeRange"
          value-format="YYYY-MM-DD"
          format="YYYY-MM-DD"
          style="width: 240px"
        />
      </FilterBar>
      <div class="dict-page__divider"></div>
      <div class="dict-page__table-wrap">
        <a-table
          :columns="columns"
          :data-source="typeList"
          :loading="loading"
          :pagination="paginationConfig"
          :row-key="(record) => record.dictId"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: handleSelectionChange }"
          size="middle"
          @change="onTableChange"
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
            <span v-else-if="column.dataIndex === 'dictName'" class="cell-primary">
              <a @click="handleViewData(record)">{{ record.dictName }}</a>
            </span>
            <span v-else-if="column.dataIndex === 'dictType'" class="cell-mono">
              <a @click="handleViewData(record)">{{ record.dictType }}</a>
            </span>
            <template v-else-if="column.dataIndex === 'status'">
              <a-tag :color="record.status === '0' ? 'green' : 'red'">
                {{ record.status === '0' ? '正常' : '停用' }}
              </a-tag>
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-space size="small">
                <a-button type="link" size="small" class="!p-0" @click="handleViewData(record)">查看数据</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-button type="link" size="small" class="!p-0" @click="handleEdit(record)">修改</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-button type="link" size="small" danger class="!p-0" @click="handleDelete(record)">删除</a-button>
              </a-space>
            </template>
            <span v-else class="cell-default">{{ record[column.dataIndex] || '--' }}</span>
          </template>
        </a-table>
      </div>
    </CloudCard>

    <!-- 新增/修改字典类型 -->
    <a-modal
      :title="title"
      v-model:open="open"
      width="520px"
      :mask-closable="false"
    >
      <a-form ref="formRef" :model="form" :rules="rules" :label-col="{ style: { width: '100px' } }">
        <a-form-item label="字典名称" name="dictName">
          <a-input v-model:value="form.dictName" placeholder="请输入字典名称" />
        </a-form-item>
        <a-form-item label="字典类型" name="dictType">
          <a-input v-model:value="form.dictType" placeholder="请输入字典类型" :disabled="!!form.dictId" />
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-radio-group v-model:value="form.status">
            <a-radio value="0">正常</a-radio>
            <a-radio value="1">停用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="备注" name="remark">
          <a-textarea v-model:value="form.remark" :rows="3" placeholder="请输入备注" />
        </a-form-item>
      </a-form>
      <template #footer>
        <div class="dialog-footer">
          <a-button type="primary" @click="submitForm">确 定</a-button>
          <a-button @click="cancel">取 消</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import FilterBar from '@/components/cloud/FilterBar.vue'
import { listType, getType, addType, updateType, delType, refreshCache } from '@/api/system/dict/type'

export default {
  name: 'SystemDict',
  components: {
    PageHeader,
    CloudCard,
    FilterBar,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ReloadOutlined
  },
  data() {
    return {
      loading: false,
      typeList: [],
      typeOptions: [],
      selectedRows: [],
      selectedRowKeys: [],
      single: true,
      multiple: true,
      title: '',
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dictName: '',
        dictType: undefined,
        status: undefined,
        createTimeRange: []
      },
      form: {},
      rules: {
        dictName: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
        dictType: [{ required: true, message: '请输入字典类型', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      columns: [
        { title: '字典编号', dataIndex: 'dictId', key: 'dictId', width: 100 },
        { title: '字典名称', dataIndex: 'dictName', key: 'dictName' },
        { title: '字典类型', dataIndex: 'dictType', key: 'dictType' },
        { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
        { title: '备注', dataIndex: 'remark', key: 'remark', ellipsis: true },
        { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
        { title: '操作', dataIndex: 'action', key: 'action', width: 220, fixed: 'right' }
      ],
      paginationConfig: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total) => `共 ${total} 条`,
        showSizeChanger: true
      }
    }
  },
  created() {
    this.loadList()
  },
  methods: {
    loadList() {
      this.loading = true
      const params = { ...this.queryParams }
      if (params.createTimeRange && params.createTimeRange.length === 2) {
        params.beginTime = params.createTimeRange[0]
        params.endTime = params.createTimeRange[1]
      }
      delete params.createTimeRange
      listType(params).then((response) => {
        this.typeList = response.data.rows || []
        this.paginationConfig.total = response.data.total || 0
        this.paginationConfig.current = this.queryParams.pageNum
        this.paginationConfig.pageSize = this.queryParams.pageSize
      }).finally(() => {
        this.loading = false
      })
      // 同步字典类型下拉选项（基于全部字典，不受筛选影响）
      listType({ pageNum: 1, pageSize: 1000 }).then((res) => {
        this.typeOptions = res.data.rows || []
      })
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.loadList()
    },
    resetQuery() {
      this.queryParams = { pageNum: 1, pageSize: 10, dictName: '', dictType: undefined, status: undefined, createTimeRange: [] }
      this.loadList()
    },
    onTableChange(pagination) {
      this.queryParams.pageNum = pagination.current
      this.queryParams.pageSize = pagination.pageSize
      this.loadList()
    },
    handleSelectionChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.single = selectedRows.length !== 1
      this.multiple = !selectedRows.length
    },
    handleAdd() {
      this.reset()
      this.title = '新增字典类型'
      this.open = true
    },
    handleEdit(row) {
      this.reset()
      const target = row || this.selectedRows[0]
      this.title = '修改字典类型'
      getType(target.dictId).then((response) => {
        this.form = { ...response.data }
        this.open = true
      })
    },
    reset() {
      this.form = { dictName: '', dictType: '', status: '0', remark: '' }
    },
    cancel() {
      this.open = false
      this.reset()
    },
    submitForm() {
      this.$refs.formRef.validate().then(() => {
        if (this.form.dictId) {
          updateType(this.form).then(() => {
            message.success('修改成功')
            this.open = false
            this.loadList()
          })
        } else {
          addType(this.form).then(() => {
            message.success('新增成功')
            this.open = false
            this.loadList()
          })
        }
      }).catch(() => {})
    },
    handleDelete(row) {
      const rows = row.dictId ? [row] : this.selectedRows
      const dictIds = rows.map((r) => r.dictId)
      Modal.confirm({
        title: '确认删除',
        content: `是否确认删除选中的 ${rows.length} 条字典类型数据？`,
        onOk: () => {
          return delType(dictIds).then(() => {
            message.success('删除成功')
            this.loadList()
          })
        }
      })
    },
    handleRefreshCache() {
      refreshCache().then(() => {
        message.success('刷新缓存成功')
      })
    },
    handleViewData(row) {
      this.$router.push({
        path: '/system/dict/data',
        query: { dictId: row.dictId, dictName: row.dictName, dictType: row.dictType }
      })
    }
  }
}
</script>

<style scoped>
.dict-page {
  padding: 4px 0;
}

.dict-page__divider {
  height: 1px;
  background: #F2F3F5;
  margin: 0 16px;
}

.dict-page__table-wrap {
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
  font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
  font-size: 13px;
  color: #165DFF;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
