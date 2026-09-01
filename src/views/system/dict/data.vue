<template>
  <div class="dict-data-page">
    <!-- 顶部：返回 + 标题 + 字典类型信息 -->
    <div class="dict-data-page__topbar">
      <a class="dict-data-page__back" @click="goBack">
        <ArrowLeftOutlined />
        返回
      </a>
      <a-divider type="vertical" />
      <span class="dict-data-page__title">字典数据</span>
      <template v-if="currentType.dictName">
        <a-divider type="vertical" />
        <span class="dict-data-page__sub">字典名称：{{ currentType.dictName }}</span>
        <span class="dict-data-page__sub">字典类型：{{ currentType.dictType }}</span>
      </template>
    </div>

    <CloudCard class="dict-data-page__table-card">
      <FilterBar @search="handleQuery" @reset="resetQuery">
        <template #actions>
          <a-button type="primary" @click="handleAdd">
            <template #icon><PlusOutlined /></template>
            新增
          </a-button>
          <a-button :disabled="dataSingle" @click="handleEdit()">
            <template #icon><EditOutlined /></template>
            修改
          </a-button>
          <a-button danger :disabled="dataMultiple" @click="handleDelete">
            <template #icon><DeleteOutlined /></template>
            删除
          </a-button>
          <a-button @click="goBack">关闭</a-button>
        </template>
        <a-select
          v-model:value="dataQuery.dictType"
          disabled
          style="width: 180px"
        >
          <a-select-option :value="currentType.dictType">{{ currentType.dictName }}</a-select-option>
        </a-select>
        <a-input
          v-model:value="dataQuery.dictLabel"
          placeholder="请输入字典标签"
          allow-clear
          style="width: 200px"
          @pressEnter="handleQuery"
        />
        <a-select
          v-model:value="dataQuery.status"
          placeholder="数据状态"
          allow-clear
          style="width: 140px"
        >
          <a-select-option value="0">正常</a-select-option>
          <a-select-option value="1">停用</a-select-option>
        </a-select>
      </FilterBar>
      <div class="dict-data-page__divider"></div>
      <div class="dict-data-page__table-wrap">
        <a-table :scroll="{ x: 1140 }"
          :columns="dataColumns"
          :data-source="dataList"
          :loading="dataLoading"
          :pagination="dataPagination"
          :row-key="(record) => record.dictCode"
          :row-selection="{ selectedRowKeys: dataSelectedRowKeys, onChange: handleSelectionChange }"
          size="middle"
          @change="onTableChange"
        >
          <template #bodyCell="{ column, record }">
            <span v-if="column.dataIndex === 'dictLabel'">
              <a-tag v-if="record.listClass" :color="record.listClass">{{ record.dictLabel }}</a-tag>
              <span v-else>{{ record.dictLabel }}</span>
            </span>
            <template v-else-if="column.dataIndex === 'status'">
              <a-tag :color="record.status === '0' ? 'green' : 'red'">
                {{ record.status === '0' ? '正常' : '停用' }}
              </a-tag>
            </template>
            <template v-else-if="column.dataIndex === 'icon'">
              <a-image v-if="record.icon" :src="record.icon" :width="32" :height="32" :preview="{ mask: false }" />
              <span v-else>--</span>
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-space size="small">
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

    <!-- 新增/修改字典数据弹窗 -->
    <a-modal :get-container="getDemoContainer"
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
import { PlusOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import FilterBar from '@/components/cloud/FilterBar.vue'
import { listData, getData, addData, updateData, delData } from '@/api/system/dict/data'

export default {
  name: 'SystemDictData',
  components: {
    CloudCard, FilterBar,
    PlusOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined
  },
  data() {
    return {
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
        status: '',
        dictType: ''
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
        { title: '备注', dataIndex: 'remark', key: 'remark', width: 240, customCell: () => ({ class: 'cell-wrap' }) },
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
    const query = this.$route.query
    if (query.dictId) {
      this.currentType = {
        dictId: query.dictId,
        dictName: query.dictName || '',
        dictType: query.dictType || ''
      }
      this.dataQuery.dictType = query.dictType || ''
    }
    this.loadList()
  },
  methods: {
    getDemoContainer() {
      return document.querySelector('.app-main__content') || document.body;
    },
    getDrawerContainer() {
      return document.querySelector('.app-overlay') || document.body;
    },
    goBack() {
      this.$router.push('/system/dict')
    },
    loadList() {
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
    handleQuery() {
      this.dataQuery.pageNum = 1
      this.loadList()
    },
    resetQuery() {
      this.dataQuery = {
        pageNum: 1, pageSize: 10,
        dictLabel: '', status: '',
        dictType: this.currentType.dictType
      }
      this.loadList()
    },
    onTableChange(pagination) {
      this.dataQuery.pageNum = pagination.current
      this.dataQuery.pageSize = pagination.pageSize
      this.loadList()
    },
    handleSelectionChange(selectedRowKeys, selectedRows) {
      this.dataSelectedRowKeys = selectedRowKeys
      this.dataSelectedRows = selectedRows
      this.dataSingle = selectedRows.length !== 1
      this.dataMultiple = !selectedRows.length
    },
    handleAdd() {
      this.resetForm()
      this.dataTitle = '新增字典数据'
      this.dataOpen = true
    },
    handleEdit(row) {
      this.resetForm()
      const target = row || this.dataSelectedRows[0]
      this.dataTitle = '修改字典数据'
      getData(target.dictCode).then((response) => {
        this.dataForm = { ...response.data }
        this.dataOpen = true
      })
    },
    resetForm() {
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
      this.resetForm()
    },
    submitDataForm() {
      this.$refs.dataFormRef.validate().then(() => {
        const payload = { ...this.dataForm, dictType: this.currentType.dictType }
        if (this.dataForm.dictCode) {
          updateData(payload).then(() => {
            message.success('修改成功')
            this.dataOpen = false
            this.loadList()
          })
        } else {
          addData(payload).then(() => {
            message.success('新增成功')
            this.dataOpen = false
            this.loadList()
          })
        }
      }).catch(() => {})
    },
    handleDelete(row) {
      const rows = row.dictCode ? [row] : this.dataSelectedRows
      const dictCodes = rows.map((r) => r.dictCode)
      Modal.confirm({
        getContainer: this.getDemoContainer,
        title: '确认删除',
        content: `是否确认删除选中的 ${rows.length} 条字典数据？`,
        onOk: () => {
          return delData(dictCodes).then(() => {
            message.success('删除成功')
            this.loadList()
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.dict-data-page {
  padding: 4px 0;
}

.dict-data-page__topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  margin-bottom: 12px;
  background: var(--color-surface, #fff);
  border: 1px solid var(--color-border, #F0F1F3);
  border-radius: 8px;
}

.dict-data-page__back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 13px;
  cursor: pointer;
  text-decoration: none;
}

.dict-data-page__back:hover {
  color: #165DFF;
}

.dict-data-page__title {
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
}

.dict-data-page__sub {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
  margin-left: 4px;
}

.dict-data-page__divider {
  height: 1px;
  background: #F2F3F5;
  margin: 0 16px;
}

.dict-data-page__table-wrap {
  padding: 0 16px 16px 16px;
}

.cell-default {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
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
