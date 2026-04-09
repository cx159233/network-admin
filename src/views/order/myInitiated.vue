<template>
  <div class="app-container">
    <!-- 筛选条件 -->
    <el-row :gutter="24" class="mb12">
      <el-col :span="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          class="el-form-search"
          :inline="true"
        >
          <el-form-item prop="keyword">
            <el-input
              v-model="queryParams.keyword"
              placeholder="订单号、机构名、服务名称"
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item prop="org">
            <el-select
              v-model="queryParams.org"
              placeholder="所有机构"
              clearable
              style="width: 150px"
            >
              <el-option label="北京市海淀区数字经济发展局" value="北京市海淀区数字经济发展局" />
            </el-select>
          </el-form-item>
          <el-form-item prop="serviceType">
            <el-select
              v-model="queryParams.serviceType"
              placeholder="所有服务类型"
              clearable
              style="width: 150px"
            >
              <el-option label="标准云资源" value="标准云资源" />
              <el-option label="安全服务" value="安全服务" />
              <el-option label="数字应用服务" value="数字应用服务" />
              <el-option label="能力组件服务" value="能力组件服务" />
              <el-option label="定制化资源" value="定制化资源" />
            </el-select>
          </el-form-item>
          <el-form-item prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="所有状态"
              clearable
              style="width: 150px"
            >
              <el-option label="审批中" value="approving" />
              <el-option label="审批通过" value="approved" />
              <el-option label="已驳回" value="rejected" />
              <el-option label="已生效" value="effective" />
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
      :data="orderList"
      size="small"
      style="width: 100%"
      class-name="small-padding fixed-width"
    >
      <el-table-column prop="orderNo" label="订单号" width="150" />
      <el-table-column prop="serviceName" label="服务名称 / 规格" min-width="220">
        <template slot-scope="scope">
          <div>
            <div class="tbl-name">{{ scope.row.serviceName }}</div>
            <div class="tbl-sub">{{ scope.row.serviceSpec }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="orgName" label="申请机构" min-width="220">
        <template slot-scope="scope">
          <div>
            <div class="tbl-name">{{ scope.row.orgName }}</div>
            <div class="tbl-sub">{{ scope.row.applicant }} · {{ scope.row.department }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="serviceType" label="服务类型" width="120">
        <template slot-scope="scope">
          <el-tag :type="getServiceTypeColor(scope.row.serviceType)" size="small">{{ scope.row.serviceType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="120">
        <template slot-scope="scope">
          <el-tag :type="getStatusColor(scope.row.status)" size="small">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="workorderId" label="关联工单" width="120" />
      <el-table-column prop="applyTime" label="申请时间" width="160" />
      <el-table-column label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="goToDetail(scope.row)">详情</el-button>
          <el-button v-if="scope.row.status === '已完成'" type="text" size="small" @click="openReviewDialog(scope.row)">满意度评价</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="loadOrderList"
    />

    <!-- 满意度评价弹窗 -->
    <el-dialog
      title="服务满意度评价"
      width="520px"
      :visible.sync="reviewDialogVisible"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="review-order-info">
        <span class="review-order-no">{{ reviewForm.orderNo }}</span>
        <span class="review-order-name">{{ reviewForm.serviceName }}</span>
      </div>
      <el-form ref="reviewFormRef" :model="reviewForm" :rules="reviewRules" label-width="90px">
        <el-form-item label="满意度" prop="score">
          <el-rate v-model="reviewForm.score" show-text :texts="['非常差', '差', '一般', '好', '非常好']" />
        </el-form-item>
        <el-form-item label="评价描述" prop="description">
          <el-input v-model="reviewForm.description" type="textarea" :rows="4" placeholder="请输入您对本次服务的评价" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reviewDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleReviewSubmit">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index.vue';

export default {
  name: "OrderMyInitiated",
  components: {
    Pagination
  },
  data() {
    return {
      loading: false,
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        keyword: undefined,
        org: undefined,
        serviceType: undefined,
        status: undefined
      },
      // 满意度评价弹窗
      reviewDialogVisible: false,
      reviewForm: {
        orderNo: '',
        serviceName: '',
        score: 0,
        description: ''
      },
      reviewRules: {
        score: [{ required: true, message: '请选择满意度评分', trigger: 'change', type: 'number', min: 1 }]
      },
      orderList: [
        {
          orderNo: '#ORD-2024-0089',
          serviceName: '智慧园区综合管理平台',
          serviceSpec: '标准版，含500个设备接入 + 数据看板',
          orgName: '北京市海淀区数字经济发展局',
          applicant: '张三',
          department: '技术部',
          serviceType: '数字应用服务',
          status: '审批通过',
          workorderId: 'TK-0234',
          applyTime: '2024-03-15 14:32'
        },
        {
          orderNo: '#ORD-2024-0090',
          serviceName: '统一身份认证组件',
          serviceSpec: '支持OAuth2.0/SAML，含SSO单点登录',
          orgName: '北京市海淀区数字经济发展局',
          applicant: '张三',
          department: '技术部',
          serviceType: '能力组件服务',
          status: '已生效',
          workorderId: 'TK-0235',
          applyTime: '2024-03-10 09:15'
        },
        {
          orderNo: '#ORD-2024-0091',
          serviceName: '数据可视化分析平台',
          serviceSpec: '企业版，含20个数据源接入 + 大屏展示',
          orgName: '北京市海淀区数字经济发展局',
          applicant: '张三',
          department: '技术部',
          serviceType: '数字应用服务',
          status: '审批中',
          workorderId: 'TK-0236',
          applyTime: '2024-03-05 16:45'
        },
        {
          orderNo: '#ORD-2024-0088',
          serviceName: '消息推送中间件',
          serviceSpec: '支持短信/邮件/站内信多通道，100万条/月',
          orgName: '北京市海淀区数字经济发展局',
          applicant: '张三',
          department: '技术部',
          serviceType: '能力组件服务',
          status: '已完成',
          workorderId: 'TK-0230',
          applyTime: '2024-02-20 10:00'
        }
      ]
    };
  },
  created() {
    this.loadOrderList();
  },
  watch: {
    $route: {
      handler: function() {
        this.loadOrderList();
      },
      immediate: true
    }
  },
  methods: {
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.loadOrderList();
    },
    resetQuery() {
      this.$refs.queryForm.resetFields();
      this.handleQuery();
    },
    loadOrderList() {
      this.loading = true;
      // 模拟API请求 - 只显示当前机构发起的订单
      setTimeout(() => {
        this.total = this.orderList.length;
        this.loading = false;
      }, 500);
    },
    goToDetail(row) {
      this.$router.push('/workorder/order/myInitiatedDetail');
    },
    getServiceTypeColor(type) {
      const colorMap = {
        '标准云资源': 'primary',
        '安全服务': 'warning',
        '数字应用服务': 'info',
        '能力组件服务': 'success',
        '定制化资源': 'info'
      };
      return colorMap[type] || 'info';
    },
    getStatusColor(status) {
      const colorMap = {
        '审批中': 'warning',
        '审批通过': 'success',
        '已生效': 'success',
        '已完成': 'success',
        '已驳回': 'danger',
        '已关闭': 'info'
      };
      return colorMap[status] || 'info';
    },
    openReviewDialog(row) {
      this.reviewForm = {
        orderNo: row.orderNo,
        serviceName: row.serviceName,
        score: 0,
        description: ''
      };
      this.reviewDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.reviewFormRef && this.$refs.reviewFormRef.clearValidate();
      });
    },
    handleReviewSubmit() {
      this.$refs.reviewFormRef.validate(valid => {
        if (!valid) return;
        this.$modal.msgSuccess('评价提交成功');
        this.reviewDialogVisible = false;
      });
    }
  }
};
</script>

<style scoped>
.mb12 {
  margin-bottom: 12px;
}

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

:deep(.el-form-search .el-form-item) {
  margin-bottom: 0;
  margin-right: 0;
}

.tbl-name {
  color: #262626;
  font-size: 13px;
  font-weight: 500;
}

.tbl-sub {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
}

.review-order-info {
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 20px;
}

.review-order-no {
  font-size: 12px;
  color: #909399;
  margin-right: 12px;
}

.review-order-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}
</style>