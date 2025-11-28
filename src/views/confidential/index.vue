<template>
  <div class="container">
    <a-form-model
      :layout="form.layout"
      :model="form"
      v-bind="formItemLayout"
      style="overflow: hidden"
    >
      <a-col
        span="24"
        class="mpsj"
      >完整性校验</a-col>
      <a-col span="6">
        <a-form-model-item label="更新时间">
          <a-range-picker
            format="YYYY-MM-DD HH:mm:ss"
            v-model="form.lastUpdateTime"
            class="width200"
          />
        </a-form-model-item>
      </a-col>
      <!-- <a-col span="6">
        <a-form-model-item label="摘要类型">
          <a-select
            v-model="form.databaseName"
            placeholder="请选择摘要类型"
            class="width200"
          >
            <a-select-option value="ucmp_system">鉴权信息</a-select-option>
            <a-select-option value="uuc_manage_log">日志信息</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col> -->
      <a-col span="6">
        <a-form-model-item class="pl-20">
          <a-button
            type="primary"
            @click="findData"
          > 查询 </a-button>
          <a-button
            style="margin-left: 12px"
            @click="reset"
          > 重置 </a-button>
        </a-form-model-item>
      </a-col>
    </a-form-model>
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="false"
      key="id"
    >
      <span
        slot="action"
        slot-scope="text, record"
      >
        <span
          @click="handleClick(record, 2)"
          class="pl-20 blue cursor"
        >校验</span>
      </span>
      <template
        slot="result"
        slot-scope="text"
      >
        <span
          v-if="text === true"
          style="color: green"
        >SUCCESS</span>
        <span
          v-else-if="text === false"
          style="color: red"
        >ERROR</span>
        <span v-else>--</span>
      </template>
    </a-table>
    <a-pagination
      show-quick-jumper
      :current="form.pageNum"
      :pageSize="form.pageSize"
      :total="total"
      @change="onChange"
      class="pagination"
      :page-size-options="pageSizeOptions"
      show-size-changer
      @showSizeChange="onShowSizeChange"
    />
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      pageSizeOptions: ['10', '20', '30', '40', '50'],
      total: 0,
      api: '/digest-api',
      formItemLayout: {
        labelCol: { span: 10 },
        wrapperCol: { span: 14 }
      },
      form: {
        databaseName: 'ucmp_system',
        lastUpdateTime: [null, null],
        pageNum: 1,
        pageSize: 10
      },
      columns: [
        {
          title: '原始数据id',
          dataIndex: 'sourceId'
        },
        {
          title: '生成的hmac值',
          dataIndex: 'hmac'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime'
        },
        {
          title: '校验结果',
          dataIndex: 'result',
          scopedSlots: { customRender: 'result' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      dataSource: [],
      loading: false
    }
  },
  mounted () {
    this.find()
  },
  methods: {
    onShowSizeChange(_current, pageSize) {
      this.form.pageSize = pageSize
      this.form.pageNum = 1
      this.find()
    },
    findData () {
      this.form.pageNum = 1
      this.find()
    },
    onChange (pageNum) {
      this.form.pageNum = pageNum
      this.find()
    },
    formatTime (data) {
      if (!data) return ''
      const time = new Date(data)
      return (
        time.getFullYear() +
        '-' +
        (time.getMonth() + 1) +
        '-' +
        time.getDate() +
        ' ' +
        time.getHours() +
        ':' +
        time.getMinutes() +
        ':' +
        time.getSeconds()
      )
    },
    handleClick (record) {
      const params = {
        columnName: record.columnName,
        databaseName: this.form.databaseName,
        hmac: record.hmac,
        sourceId: record.sourceId,
        tableName: record.tableName
      }
      axios.post(this.api + '/hmac/checkHmac', params).then((res) => {
        if (res.data.code === 200) {
          this.$message.success(res.data.message)
          this.dataSource = this.dataSource.map((item) => {
            if (item.sourceId === record.sourceId) {
              item.result = res.data.data
            }
            return item
          })
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    find () {
      const params = {
        lastUpdateTimeStart: this.form.lastUpdateTime ? this.formatTime(this.form.lastUpdateTime[0]) : null,
        lastUpdateTimeEnd: this.form.lastUpdateTime ? this.formatTime(this.form.lastUpdateTime[1]) : null,
        pageNum: this.form.pageNum,
        pageSize: this.form.pageSize,
        databaseName: this.form.databaseName
      }
      axios.post(this.api + '/hmac/list', params).then((res) => {
        const { data, pagination } = res.data
        this.dataSource = data || []
        this.total = pagination.total
      })
    },
    reset () {
      this.form = {
        databaseName: 'ucmp_system',
        lastUpdateTime: [null, null],
        pageNum: 1,
        pageSize: 10
      }
      this.find()
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background: white;
  padding: 24px;

  .mpsj {
    font-size: 20px;
    font-weight: 600;
    padding-left: 8px;
    border-left: 4px solid #1890ff;
    line-height: 20px;
    margin-bottom: 16px;
  }
}

.cursor {
  cursor: pointer;
}

.ml-20 {
  margin-left: 12px;
}

.pl-20 {
  padding-left: 12px;
}

.width200 {
  width: 200px !important;
}

.blue {
  color: blue;
}

:deep(.ant-form-item) {
  margin-bottom: 24px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
