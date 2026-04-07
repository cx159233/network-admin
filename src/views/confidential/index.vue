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
      <a-col span="6">
        <a-form-model-item label="摘要">
          <a-input v-model="form.hmacFuzzy" class="width200" />
        </a-form-model-item>
      </a-col>
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
        hmacFuzzy: '',
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
      // Mock 校验结果
      const mockResult = Math.random() > 0.3 // 70% 概率成功
      setTimeout(() => {
        if (mockResult) {
          this.$message.success('校验成功')
          this.dataSource = this.dataSource.map((item) => {
            if (item.sourceId === record.sourceId) {
              item.result = true
            }
            return item
          })
        } else {
          this.$message.error('校验失败，数据可能被篡改')
          this.dataSource = this.dataSource.map((item) => {
            if (item.sourceId === record.sourceId) {
              item.result = false
            }
            return item
          })
        }
      }, 300)
    },
    find () {
      // Mock 数据
      const mockData = {
        code: 200,
        message: '操作成功',
        data: [
          {
            sourceId: '1001',
            hmac: 'a3f2c1d4e5b6789012345678abcdef',
            createTime: '2024-01-15 10:30:00',
            updateTime: '2024-03-20 14:22:00',
            tableName: 'sys_user',
            columnName: 'username',
            result: null
          },
          {
            sourceId: '1002',
            hmac: 'b4e3d2c5f6a7890123456789bcdef1',
            createTime: '2024-02-10 09:15:00',
            updateTime: '2024-03-18 16:45:00',
            tableName: 'sys_user',
            columnName: 'email',
            result: true
          },
          {
            sourceId: '1003',
            hmac: 'c5f4e3d6a7b8901234567890cdef12',
            createTime: '2024-02-20 11:20:00',
            updateTime: '2024-03-15 10:30:00',
            tableName: 'sys_role',
            columnName: 'role_name',
            result: null
          },
          {
            sourceId: '1004',
            hmac: 'd6a5f4e7b8c9012345678901def123',
            createTime: '2024-03-01 08:00:00',
            updateTime: '2024-03-22 09:10:00',
            tableName: 'sys_menu',
            columnName: 'menu_name',
            result: false
          },
          {
            sourceId: '1005',
            hmac: 'e7b6a5f8c9d012345678902ef1234',
            createTime: '2024-03-05 14:30:00',
            updateTime: '2024-03-21 11:25:00',
            tableName: 'sys_dept',
            columnName: 'dept_name',
            result: null
          },
          {
            sourceId: '1006',
            hmac: 'f8c7b6a9d0e12345678903f12345a',
            createTime: '2024-03-08 16:00:00',
            updateTime: '2024-03-19 15:40:00',
            tableName: 'sys_config',
            columnName: 'config_key',
            result: true
          },
          {
            sourceId: '1007',
            hmac: 'a9d8c7b0e1f2345678904a123456b',
            createTime: '2024-03-10 10:10:00',
            updateTime: '2024-03-17 08:50:00',
            tableName: 'sys_dict',
            columnName: 'dict_type',
            result: null
          },
          {
            sourceId: '1008',
            hmac: 'b0e9d8c1f2a345678905b1234567c',
            createTime: '2024-03-12 13:45:00',
            updateTime: '2024-03-16 17:30:00',
            tableName: 'sys_notice',
            columnName: 'notice_title',
            result: null
          },
          {
            sourceId: '1009',
            hmac: 'c1f0e9d2a3b45678906c12345678d',
            createTime: '2024-03-14 09:20:00',
            updateTime: '2024-03-14 12:00:00',
            tableName: 'sys_oper_log',
            columnName: 'oper_ip',
            result: true
          },
          {
            sourceId: '1010',
            hmac: 'd2a1f0e3b4c5678907d123456789e',
            createTime: '2024-03-18 11:00:00',
            updateTime: '2024-03-23 10:15:00',
            tableName: 'sys_logininfor',
            columnName: 'ipaddr',
            result: null
          }
        ],
        pagination: {
          total: 86
        }
      }

      // 模拟筛选逻辑
      let filteredData = [...mockData.data]

      // 按 hmac 模糊筛选
      if (this.form.hmacFuzzy) {
        filteredData = filteredData.filter(item =>
          item.hmac.includes(this.form.hmacFuzzy)
        )
      }

      // 按时间范围筛选
      if (this.form.lastUpdateTime && this.form.lastUpdateTime[0]) {
        const startTime = new Date(this.form.lastUpdateTime[0]).getTime()
        filteredData = filteredData.filter(item => {
          const itemTime = new Date(item.updateTime).getTime()
          return itemTime >= startTime
        })
      }
      if (this.form.lastUpdateTime && this.form.lastUpdateTime[1]) {
        const endTime = new Date(this.form.lastUpdateTime[1]).getTime()
        filteredData = filteredData.filter(item => {
          const itemTime = new Date(item.updateTime).getTime()
          return itemTime <= endTime
        })
      }

      // 分页
      const start = (this.form.pageNum - 1) * this.form.pageSize
      const end = start + this.form.pageSize
      const pageData = filteredData.slice(start, end)

      this.dataSource = pageData
      this.total = filteredData.length
    },
    reset () {
      this.form = {
        databaseName: 'ucmp_system',
        lastUpdateTime: [null, null],
        hmacFuzzy: '',
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
