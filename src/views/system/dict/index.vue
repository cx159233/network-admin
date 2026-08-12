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
        <a-input
          v-model:value="queryParams.dictType"
          placeholder="请输入字典类型"
          allow-clear
          style="width: 200px"
          @pressEnter="handleQuery"
        />
        <a-select
          v-model:value="queryParams.status"
          placeholder="状态"
          allow-clear
          style="width: 120px"
        >
          <a-select-option value="0">正常</a-select-option>
          <a-select-option value="1">停用</a-select-option>
        </a-select>
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

    <!-- 字典数据抽屉 -->
    <a-drawer
      :title="`字典数据 - ${currentType.dictName || ''}`"
      :open="dataDrawerOpen"
      :width="900"
      :mask-closable="false"
      @close="closeDataDrawer"
    >
      <div class="dict-data-panel">
        <!-- 顶部筛选区 -->
        <div class="dict-data-panel__filter">
          <div class="dict-data-panel__filter-left">
            <div class="dict-data-panel__field">
              <label class="dict-data-panel__label">字典名称</label>
              <a-select v-model:value="currentType.dictId" disabled style="width: 180px">
                <a-select-option :value="currentType.dictId">{{ currentType.dictName }}</a-select-option>
              </a-select>
            </div>
            <div class="dict-data-panel__field">
              <label class="dict-data-panel__label">字典标签</label>
              <a-input v-model:value="dataQuery.dictLabel" placeholder="请输入字典标签" allow-clear style="width: 180px" @pressEnter="loadDataList" />
            </div>
            <div class="dict-data-panel__field">
              <label class="dict-data-panel__label">状态</label>
              <a-select v-model:value="dataQuery.status" placeholder="数据状态" allow-clear style="width: 140px">
                <a-select-option value="0">正常</a-select-option>
                <a-select-option value="1">停用</a-select-option>
              </a-select>
            </div>
            <a-button type="primary" @click="loadDataList">
              <template #icon><SearchOutlined /></template>
              搜索
            </a-button>
            <a-button @click="resetDataQuery">
              <template #icon><ReloadOutlined /></template>
              重置
            </a-button>
          </div>
        </div>

        <!-- 操作按钮区 -->
        <div class="dict-data-panel__toolbar">
          <a-space>
            <a-button type="primary" @click="handleAddData">
              <template #icon><PlusOutlined /></template>
              新增
            </a-button>
            <a-button :disabled="dataSingle" @click="handleEditData()">
              <template #icon><EditOutlined /></template>
              修改
            </a-button>
            <a-button danger :disabled="dataMultiple" @click="handleDeleteData">
              <template #icon><DeleteOutlined /></template>
              删除
            </a-button>
            <a-button @click="closeDataDrawer">关闭</a-button>
          </a-space>
          <span class="dict-data-panel__selected">
            已选择 <strong>{{ dataSelectedRowKeys.length }}</strong> 条
          </span>
        </div>
        <a-table
          :columns="dataColumns"
          :data-source="dataList"
          :loading="dataLoading"
          :pagination="dataPagination"
          :row-key="(record) => record.dictCode"
          :row-selection="{ selectedRowKeys: dataSelectedRowKeys, onChange: handleDataSelectionChange }"
          size="middle"
          @change="onDataTableChange"
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
            <template v-else-if="column.dataIndex === 'dictLabel'">
              <a-tag v-if="record.listClass" :color="record.listClass">{{ record.dictLabel }}</a-tag>
              <span v-else>{{ record.dictLabel }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <a-tag :color="record.status === '0' ? 'green' : 'red'">
                {{ record.status === '0' ? '正常' : '停用' }}
              </a-tag>
            </template>
            <template v-else-if="column.dataIndex === 'icon'">
              <a-image v-if="record.icon" :src="record.icon" :width="32" :height="32" :preview="{ mask: false }" />
              <span v-else class="cell-muted">--</span>
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-space size="small">
                <a-button type="link" size="small" class="!p-0" @click="handleEditData(record)">修改</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-button type="link" size="small" danger class="!p-0" @click="handleDeleteData(record)">删除</a-button>
              </a-space>
            </template>
            <span v-else class="cell-default">{{ record[column.dataIndex] || '--' }}</span>
          </template>
        </a-table>
      </div>
    </a-drawer>

    <!-- 新增/修改字典数据 -->
    <a-modal
      :title="dataTitle"
      v-model:open="dataOpen"
      width="520px"
      :mask-closable="false"
    >
      <a-form ref="dataFormRef" :model="dataForm" :rules="dataRules" :label-col="{ style: { width: '100px' } }">
        <a-form-item label="字典类型">
          <a-input :value="currentType.dictType" disabled placeholder="字典类型" />
        </a-form-item>
        <a-form-item label="数据标签" name="dictLabel">
          <a-input v-model:value="dataForm.dictLabel" placeholder="请输入数据标签" />
        </a-form-item>
        <a-form-item label="数据键值" name="dictValue">
          <a-input v-model:value="dataForm.dictValue" placeholder="请输入数据键值" />
        </a-form-item>
        <a-form-item label="样式属性" name="listClass">
          <a-input v-model:value="dataForm.listClass" placeholder="请输入样式属性" />
        </a-form-item>
        <a-form-item label="显示排序" name="dictSort">
          <a-input-number v-model:value="dataForm.dictSort" :min="0" style="width: 100%" />
        </a-form-item>
        <a-form-item label="回显样式" name="cssClass">
          <a-select v-model:value="dataForm.cssClass" placeholder="默认" allow-clear>
            <a-select-option value="default">默认</a-select-option>
            <a-select-option value="primary">主要</a-select-option>
            <a-select-option value="success">成功</a-select-option>
            <a-select-option value="info">信息</a-select-option>
            <a-select-option value="warning">警告</a-select-option>
            <a-select-option value="danger">危险</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-radio-group v-model:value="dataForm.status">
            <a-radio value="0">正常</a-radio>
            <a-radio value="1">停用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="备注" name="remark">
          <a-textarea v-model:value="dataForm.remark" :rows="3" placeholder="请输入内容" />
        </a-form-item>
        <a-form-item label="图标" name="icon">
          <a-upload
            v-model:file-list="dataForm.iconFileList"
            :before-upload="beforeUploadIcon"
            :show-upload-list="false"
            accept="image/*"
          >
            <a-button>点击上传</a-button>
          </a-upload>
          <span class="dict-form-tip">请上传图片</span>
          <div v-if="dataForm.icon" class="dict-form-icon-preview">
            <a-image :src="dataForm.icon" :width="48" :height="48" />
            <a-button type="link" size="small" @click="dataForm.icon = ''">删除</a-button>
          </div>
        </a-form-item>
      </a-form>
      <template #footer>
        <div class="dialog-footer">
          <a-button type="primary" @click="submitDataForm">确 定</a-button>
          <a-button @click="cancelData">取 消</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import FilterBar from '@/components/cloud/FilterBar.vue'
import { listType, getType, addType, updateType, delType, refreshCache } from '@/api/system/dict/type'
import { listData, getData, addData, updateData, delData } from '@/api/system/dict/data'

export default {
  name: 'SystemDict',
  components: {
    PageHeader,
    CloudCard,
    FilterBar,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ReloadOutlined,
    SearchOutlined
  },
  data() {
    return {
      loading: false,
      typeList: [],
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
        dictType: '',
        status: ''
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
      },
      // 字典数据
      dataDrawerOpen: false,
      currentType: {},
      dataLoading: false,
      dataList: [],
      dataSelectedRows: [],
      dataSelectedRowKeys: [],
      dataSingle: true,
      dataMultiple: true,
      dataTitle: '',
      dataOpen: false,
      dataForm: {},
      dataQuery: {
        pageNum: 1,
        pageSize: 10,
        dictLabel: '',
        status: ''
      },
      dataRules: {
        dictLabel: [{ required: true, message: '请输入数据标签', trigger: 'blur' }],
        dictValue: [{ required: true, message: '请输入数据键值', trigger: 'blur' }],
        dictSort: [{ required: true, message: '请输入显示排序', trigger: 'blur' }]
      },
      dataColumns: [
        { title: '字典编码', dataIndex: 'dictCode', key: 'dictCode', width: 90 },
        { title: '字典标签', dataIndex: 'dictLabel', key: 'dictLabel', width: 120 },
        { title: '字典键值', dataIndex: 'dictValue', key: 'dictValue', width: 120 },
        { title: '字典排序', dataIndex: 'dictSort', key: 'dictSort', width: 90 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
        { title: '备注', dataIndex: 'remark', key: 'remark', ellipsis: true },
        { title: '图标', dataIndex: 'icon', key: 'icon', width: 80, align: 'center' },
        { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 170 },
        { title: '操作', dataIndex: 'action', key: 'action', width: 140, fixed: 'right' }
      ],
      dataPagination: {
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
      listType(this.queryParams).then((response) => {
        this.typeList = response.data.rows || []
        this.paginationConfig.total = response.data.total || 0
        this.paginationConfig.current = this.queryParams.pageNum
        this.paginationConfig.pageSize = this.queryParams.pageSize
      }).finally(() => {
        this.loading = false
      })
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.loadList()
    },
    resetQuery() {
      this.queryParams = { pageNum: 1, pageSize: 10, dictName: '', dictType: '', status: '' }
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
    // 字典数据
    handleViewData(row) {
      this.currentType = row
      this.dataDrawerOpen = true
      this.dataQuery = { pageNum: 1, pageSize: 10, dictLabel: '', status: '', dictType: row.dictType }
      this.loadDataList()
    },
    resetDataQuery() {
      this.dataQuery = { pageNum: 1, pageSize: 10, dictLabel: '', status: '', dictType: this.currentType.dictType }
      this.loadDataList()
    },
    closeDataDrawer() {
      this.dataDrawerOpen = false
      this.currentType = {}
      this.dataList = []
      this.dataSelectedRowKeys = []
      this.dataSelectedRows = []
    },
    loadDataList() {
      if (!this.currentType.dictType) return
      this.dataLoading = true
      listData({ ...this.dataQuery, dictType: this.currentType.dictType }).then((response) => {
        this.dataList = response.data.rows || []
        this.dataPagination.total = response.data.total || 0
        this.dataPagination.current = this.dataQuery.pageNum
        this.dataPagination.pageSize = this.dataQuery.pageSize
      }).finally(() => {
        this.dataLoading = false
      })
    },
    onDataTableChange(pagination) {
      this.dataQuery.pageNum = pagination.current
      this.dataQuery.pageSize = pagination.pageSize
      this.loadDataList()
    },
    handleDataSelectionChange(selectedRowKeys, selectedRows) {
      this.dataSelectedRowKeys = selectedRowKeys
      this.dataSelectedRows = selectedRows
      this.dataSingle = selectedRows.length !== 1
      this.dataMultiple = !selectedRows.length
    },
    handleAddData() {
      this.resetData()
      this.dataTitle = '新增字典数据'
      this.dataOpen = true
    },
    handleEditData(row) {
      this.resetData()
      const target = row || this.dataSelectedRows[0]
      this.dataTitle = '修改字典数据'
      getData(target.dictCode).then((response) => {
        this.dataForm = { ...response.data }
        this.dataOpen = true
      })
    },
    resetData() {
      this.dataForm = { dictLabel: '', dictValue: '', dictSort: 0, listClass: '', cssClass: 'default', status: '0', remark: '', icon: '', iconFileList: [] }
    },
    beforeUploadIcon(file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.dataForm.icon = reader.result
      }
      return false
    },
    cancelData() {
      this.dataOpen = false
      this.resetData()
    },
    submitDataForm() {
      this.$refs.dataFormRef.validate().then(() => {
        const payload = { ...this.dataForm, dictType: this.currentType.dictType }
        if (this.dataForm.dictCode) {
          updateData(payload).then(() => {
            message.success('修改成功')
            this.dataOpen = false
            this.loadDataList()
          })
        } else {
          addData(payload).then(() => {
            message.success('新增成功')
            this.dataOpen = false
            this.loadDataList()
          })
        }
      }).catch(() => {})
    },
    handleDeleteData(row) {
      const rows = row.dictCode ? [row] : this.dataSelectedRows
      const dictCodes = rows.map((r) => r.dictCode)
      Modal.confirm({
        title: '确认删除',
        content: `是否确认删除选中的 ${rows.length} 条字典数据？`,
        onOk: () => {
          return delData(dictCodes).then(() => {
            message.success('删除成功')
            this.loadDataList()
          })
        }
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

.dict-data-panel {
  padding: 0 4px;
}

.dict-data-panel__filter {
  background: #F7F8FA;
  border: 1px solid #F0F1F3;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
}

.dict-data-panel__filter-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.dict-data-panel__field {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dict-data-panel__label {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.85);
  white-space: nowrap;
}

.dict-data-panel__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 12px;
  flex-wrap: wrap;
}

.dict-data-panel__selected {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
}

.dict-data-panel__selected strong {
  color: #165DFF;
  font-weight: 600;
  margin: 0 2px;
}

.dict-form-tip {
  margin-left: 8px;
  font-size: 12px;
  color: #F5222D;
}

.dict-form-icon-preview {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
