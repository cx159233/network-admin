<template>
  <div class="my-initiated-v2">
    <h3 style="display:none">我发起的页面 V2</h3>
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
          <el-form-item prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="工单状态"
              clearable
              style="width: 150px"
            >
              <el-option label="待处理" value="pending" />
              <el-option label="处理中" value="processing" />
              <el-option label="已完成" value="completed" />
              <el-option label="已关闭" value="closed" />
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
      <el-table-column prop="code" label="单号" width="180" />
      <el-table-column prop="title" label="标题" min-width="200">
        <template slot-scope="scope">
          <el-link type="primary" @click="handleWorkorderClick(scope.row)">{{ scope.row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="service" label="服务" width="120" />
      <el-table-column prop="currentStep" label="当前步骤" width="120" />
      <el-table-column prop="handler" label="当前处理人" width="120" />
      <el-table-column prop="status" label="状态" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '待处理'" type="warning" size="small">待处理</el-tag>
          <el-tag v-else-if="scope.row.status === '处理中'" type="primary" size="small">处理中</el-tag>
          <el-tag v-else-if="scope.row.status === '已完成'" type="success" size="small">已完成</el-tag>
          <el-tag v-else-if="scope.row.status === '已关闭'" type="info" size="small">已关闭</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="提单时间" width="180" />
      <el-table-column label="操作" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === '已完成'" type="text" size="small" @click="handleSatisfactionEvaluation(scope.row)">满意度评价</el-button>
          <el-button v-else type="text" size="small" @click="handleWorkorderClick(scope.row)">查看</el-button>
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

    <!-- 满意度评价对话框 -->
    <el-dialog
      title="满意度评价"
      :visible.sync="satisfactionDialogVisible"
      width="500px"
      :close-on-click-modal="false"
      custom-class="satisfaction-dialog"
    >
      <div class="satisfaction-content">
        <div class="satisfaction-item">
          <label class="satisfaction-label">服务评分：</label>
          <el-rate
            v-model="satisfactionForm.score"
            :max="5"
            show-score
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
            score-template="{value} 分"
          />
        </div>
        <div class="satisfaction-item">
          <label class="satisfaction-label">评价描述：</label>
          <el-input
            v-model="satisfactionForm.comment"
            type="textarea"
            :rows="4"
            placeholder="请输入您对本次服务的评价（选填）"
            maxlength="200"
            show-word-limit
          />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="satisfactionDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitSatisfaction">提交评价</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index.vue';

export default {
  name: 'MyInitiated',
  components: {
    Pagination
  },
  data() {
    return {
      loading: false,
      dateRange: [],
      total: 0,
      satisfactionDialogVisible: false,
      submitting: false,
      currentWorkorder: null,
      satisfactionForm: {
        score: 5,
        comment: ''
      },
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
          service: '网络服务',
          currentStep: '提交申请',
          status: '待处理',
          createTime: '2026-04-02 10:00:00',
          handler: '张三'
        },
        {
          id: 2,
          code: 'WO20260402002',
          title: '设备采购申请',
          service: '设备采购',
          currentStep: '部门审批',
          status: '处理中',
          createTime: '2026-04-02 09:30:00',
          handler: '李四'
        },
        {
          id: 3,
          code: 'WO20260401001',
          title: '系统权限申请',
          service: '系统权限',
          currentStep: '权限配置',
          status: '已完成',
          createTime: '2026-04-01 14:20:00',
          handler: '王五'
        },
        {
          id: 4,
          code: 'WO20260331001',
          title: '技术支持请求',
          service: '技术支持',
          currentStep: '问题解决',
          status: '已关闭',
          createTime: '2026-03-31 11:00:00',
          handler: '赵六'
        },
        {
          id: 5,
          code: 'WO20260330001',
          title: '问题反馈',
          service: '问题反馈',
          currentStep: '反馈处理',
          status: '处理中',
          createTime: '2026-03-30 16:00:00',
          handler: '孙七'
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
      // 模拟API请求
      setTimeout(() => {
        // 确保workorderList有数据
        this.workorderList = [
          {
            id: 1,
            code: 'WO20260402001',
            title: '网络服务申请',
            service: '网络服务',
            currentStep: '提交申请',
            status: '待处理',
            createTime: '2026-04-02 10:00:00',
            handler: '张三'
          },
          {
            id: 2,
            code: 'WO20260402002',
            title: '设备采购申请',
            service: '设备采购',
            currentStep: '部门审批',
            status: '处理中',
            createTime: '2026-04-02 09:30:00',
            handler: '李四'
          },
          {
            id: 3,
            code: 'WO20260401001',
            title: '系统权限申请',
            service: '系统权限',
            currentStep: '权限配置',
            status: '已完成',
            createTime: '2026-04-01 14:20:00',
            handler: '王五'
          },
          {
            id: 4,
            code: 'WO20260331001',
            title: '技术支持请求',
            service: '技术支持',
            currentStep: '问题解决',
            status: '已关闭',
            createTime: '2026-03-31 11:00:00',
            handler: '赵六'
          },
          {
            id: 5,
            code: 'WO20260330001',
            title: '问题反馈',
            service: '问题反馈',
            currentStep: '反馈处理',
            status: '处理中',
            createTime: '2026-03-30 16:00:00',
            handler: '孙七'
          }
        ];
        this.total = this.workorderList.length;
        this.loading = false;
      }, 500);
    },
    handleWorkorderClick(workorder) {
      // 添加时间戳参数，确保每次跳转都是一个新的请求，避免缓存问题
      const timestamp = new Date().getTime();
      this.$router.push({
        path: '/workorder/myBills/detail',
        query: { workorderId: workorder.id, t: timestamp }
      });
    },
    handleSatisfactionEvaluation(workorder) {
      // 打开满意度评价对话框
      this.currentWorkorder = workorder;
      this.satisfactionForm = {
        score: 5,
        comment: ''
      };
      this.satisfactionDialogVisible = true;
    },
    submitSatisfaction() {
      this.submitting = true;
      // 模拟提交评价
      setTimeout(() => {
        this.$modal.msgSuccess('评价提交成功，感谢您的反馈！');
        this.submitting = false;
        this.satisfactionDialogVisible = false;
        // 刷新列表
        this.loadWorkorderList();
      }, 800);
    }
  }
};
</script>

<style scoped>
.mt-20 {
  margin-top: 20px;
}

/* 满意度评价对话框样式 */
.satisfaction-content {
  padding: 20px 10px;
}

.satisfaction-item {
  margin-bottom: 24px;
}

.satisfaction-item:last-child {
  margin-bottom: 0;
}

.satisfaction-label {
  display: block;
  margin-bottom: 12px;
  font-weight: 500;
  color: #606266;
  font-size: 14px;
}

:deep(.satisfaction-dialog .el-dialog__header) {
  border-bottom: 1px solid #ebeef5;
  padding: 20px;
}

:deep(.satisfaction-dialog .el-dialog__title) {
  font-weight: 600;
  font-size: 16px;
  color: #303133;
}

:deep(.satisfaction-dialog .el-dialog__body) {
  padding: 20px;
}

:deep(.satisfaction-dialog .el-dialog__footer) {
  border-top: 1px solid #ebeef5;
  padding: 15px 20px;
}

:deep(.el-rate__icon) {
  font-size: 28px;
}

:deep(.el-rate__text) {
  font-size: 16px;
  font-weight: 500;
  margin-left: 12px;
  color: #ff9900;
}

.dialog-footer {
  text-align: right;
}

.dialog-footer .el-button {
  padding: 9px 20px;
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