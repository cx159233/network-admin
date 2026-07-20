<template>
  <div>
    <el-row :gutter="24" class="mb12">
      <el-col :span="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          class="el-form-search"
          :inline="true"
        >
          <el-form-item prop="code">
            <el-input
              v-model="queryParams.code"
              placeholder="工单编号"
              clearable
              style="width: 150px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item prop="title">
            <el-input
              v-model="queryParams.title"
              placeholder="工单标题"
              clearable
              style="width: 150px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item prop="type">
            <el-select
              v-model="queryParams.type"
              placeholder="工单类型"
              clearable
              style="width: 150px"
            >
              <el-option label="业务申请" value="业务申请" />
              <el-option label="技术支持" value="技术支持" />
              <el-option label="问题反馈" value="问题反馈" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="handleQuery"
                >搜索</el-button
              >
              <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
            </el-button-group>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="workorderList"
      size="small"
      style="width: 100%"
    >
      <el-table-column prop="code" label="工单编号" width="180" />
      <el-table-column prop="title" label="工单标题" min-width="200">
        <template slot-scope="scope">
          <el-link type="primary" @click="handleWorkorderClick(scope.row)">{{ scope.row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="工单类型" width="120" />
      <el-table-column prop="status" label="工单状态" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '待处理'" type="warning" size="small">待处理</el-tag>
          <el-tag v-else-if="scope.row.status === '处理中'" type="primary" size="small">处理中</el-tag>
          <el-tag v-else-if="scope.row.status === '已完成'" type="success" size="small">已完成</el-tag>
          <el-tag v-else-if="scope.row.status === '已关闭'" type="info" size="small">已关闭</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="applicant" label="申请人" width="120" />
      <el-table-column prop="handler" label="当前处理人" width="120" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleProcess(scope.row)">处理</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="loadWorkorderList"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index.vue';

export default {
  name: 'MyTodo',
  components: {
    Pagination
  },
  data() {
    return {
      loading: false,
      dateRange: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        code: undefined,
        title: undefined,
        type: undefined,
        status: undefined
      },
      workorderList: [
        {
          id: 1,
          code: 'WO20260402001',
          title: '网络服务申请',
          type: '业务申请',
          status: '待处理',
          createTime: '2026-04-02 10:00:00',
          applicant: '张三',
          handler: '当前用户'
        },
        {
          id: 2,
          code: 'WO20260402002',
          title: '设备采购申请',
          type: '业务申请',
          status: '待处理',
          createTime: '2026-04-02 09:30:00',
          applicant: '李四',
          handler: '当前用户'
        },
        {
          id: 3,
          code: 'WO20260401001',
          title: '系统权限申请',
          type: '业务申请',
          status: '待处理',
          createTime: '2026-04-01 14:20:00',
          applicant: '王五',
          handler: '当前用户'
        },
        {
          id: 4,
          code: 'WO20260331001',
          title: '技术支持请求',
          type: '技术支持',
          status: '待处理',
          createTime: '2026-03-31 11:00:00',
          applicant: '赵六',
          handler: '当前用户'
        },
        {
          id: 5,
          code: 'WO20260330001',
          title: '问题反馈',
          type: '问题反馈',
          status: '待处理',
          createTime: '2026-03-30 16:00:00',
          applicant: '孙七',
          handler: '当前用户'
        }
      ]
    };
  },
  created() {
    this.loadWorkorderList();
  },
  watch: {
    $route: {
      handler: function() {
        this.loadWorkorderList();
      },
      immediate: true
    }
  },
  methods: {
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.loadWorkorderList();
    },
    resetQuery() {
      this.dateRange = [];
      this.$refs.queryForm.resetFields();
      this.handleQuery();
    },
    loadWorkorderList() {
      this.loading = true;
      // 模拟API请求 - 我的待办只显示待处理状态
      setTimeout(() => {
        this.workorderList = [
          {
            id: 1,
            code: 'WO20260402001',
            title: '网络服务申请',
            type: '业务申请',
            status: '待处理',
            createTime: '2026-04-02 10:00:00',
            applicant: '张三',
            handler: '当前用户'
          },
          {
            id: 2,
            code: 'WO20260402002',
            title: '设备采购申请',
            type: '业务申请',
            status: '待处理',
            createTime: '2026-04-02 09:30:00',
            applicant: '李四',
            handler: '当前用户'
          },
          {
            id: 3,
            code: 'WO20260401001',
            title: '系统权限申请',
            type: '业务申请',
            status: '待处理',
            createTime: '2026-04-01 14:20:00',
            applicant: '王五',
            handler: '当前用户'
          },
          {
            id: 4,
            code: 'WO20260331001',
            title: '技术支持请求',
            type: '技术支持',
            status: '待处理',
            createTime: '2026-03-31 11:00:00',
            applicant: '赵六',
            handler: '当前用户'
          },
          {
            id: 5,
            code: 'WO20260330001',
            title: '问题反馈',
            type: '问题反馈',
            status: '待处理',
            createTime: '2026-03-30 16:00:00',
            applicant: '孙七',
            handler: '当前用户'
          }
        ];
        this.total = this.workorderList.length;
        this.loading = false;
      }, 500);
    },
    handleWorkorderClick(workorder) {
      // 跳转到我的待办详情页面
      const timestamp = new Date().getTime();
      this.$router.push({
        path: '/workorder/myBills/myTodoDetail',
        query: { workorderId: workorder.id, t: timestamp }
      });
    },
    handleProcess(workorder) {
      // 点击处理也进入我的待办详情页面
      const timestamp = new Date().getTime();
      this.$router.push({
        path: '/workorder/myBills/myTodoDetail',
        query: { workorderId: workorder.id, t: timestamp, action: 'process' }
      });
    }
  }
};
</script>

<style scoped>
.mt-20 {
  margin-top: 20px;
}

/* El-form 搜索样式 */
:deep(.el-form-search) {
  margin-bottom: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 12px;
  padding: 0;
}

/* 确保按钮组右对齐 */
:deep(.el-form-search .el-form-item:last-child) {
  margin-right: 0;
}
</style>
