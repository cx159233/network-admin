<template>
  <div class="app-container">
    <!-- 统计卡片 -->
    <div class="stats-card mb12">
      <div class="stat-item">
        <div class="stat-value">138</div>
        <div class="stat-label">全部订单</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">6</div>
        <div class="stat-label">审批中</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">4</div>
        <div class="stat-label">开通中</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">124</div>
        <div class="stat-label">已生效</div>
      </div>
    </div>

    <!-- 筛选条件 -->
    <el-row :gutter="24" class="mb12">
      <el-col :span="24">
        <el-form
          :model="queryParams"
          size="small"
          class="el-form-search"
          :inline="true"
        >
          <el-form-item prop="keyword">
            <el-input
              v-model="queryParams.keyword"
              placeholder="订单号、机构名、服务名称"
              clearable
              style="width: 200px"
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
              <el-option label="所有机构" value="" />
              <el-option label="北京市海淀区数字经济发展局" value="1" />
              <el-option label="中远云科技有限公司" value="2" />
              <el-option label="华能数智科技集团" value="3" />
            </el-select>
          </el-form-item>
          <el-form-item prop="serviceType">
            <el-select
              v-model="queryParams.serviceType"
              placeholder="所有服务类型"
              clearable
              style="width: 150px"
            >
              <el-option label="所有服务类型" value="" />
              <el-option label="标准云资源" value="cloud" />
              <el-option label="安全服务" value="security" />
              <el-option label="数字应用服务" value="digitalApp" />
              <el-option label="能力组件服务" value="component" />
              <el-option label="定制化资源" value="custom" />
            </el-select>
          </el-form-item>
          <el-form-item prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="所有状态"
              clearable
              style="width: 150px"
            >
              <el-option label="所有状态" value="" />
              <el-option label="审批中" value="pending" />
              <el-option label="开通中" value="provisioning" />
              <el-option label="已生效" value="active" />
              <el-option label="已驳回" value="rejected" />
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
      <el-table-column label="操作" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="goToDetail(scope.row)">详情</el-button>
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
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index.vue';

export default {
  name: "OrderList",
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
      orderList: [
        {
          orderNo: '#ORD-2024-0089',
          serviceName: '智慧园区综合管理平台',
          serviceSpec: '标准版，含500个设备接入 + 数据看板',
          orgName: '北京市海淀区数字经济发展局',
          applicant: '张三',
          department: '技术部',
          serviceType: '数字应用服务',
          status: '工单处理中',
          workorderId: 'TK-0234',
          applyTime: '2024-03-15'
        },
        {
          orderNo: '#ORD-2024-0088',
          serviceName: '统一身份认证组件',
          serviceSpec: '支持OAuth2.0/SAML，含SSO单点登录',
          orgName: '中远云科技有限公司',
          applicant: '李明',
          department: '运维部',
          serviceType: '能力组件服务',
          status: '审批中',
          workorderId: '—',
          applyTime: '2024-03-15'
        },
        {
          orderNo: '#ORD-2024-0087',
          serviceName: '数据可视化分析平台',
          serviceSpec: '企业版，含20个数据源接入 + 大屏展示',
          orgName: '华能数智科技集团',
          applicant: '王芳',
          department: '信息化部',
          serviceType: '数字应用服务',
          status: '已生效',
          workorderId: 'TK-0233',
          applyTime: '2024-03-14'
        },
        {
          orderNo: '#ORD-2024-0086',
          serviceName: 'AI 语音识别组件',
          serviceSpec: '企业版 / 100万次调用',
          orgName: '北京市海淀区数字经济发展局',
          applicant: '张伟',
          department: '创新部',
          serviceType: '能力组件服务',
          status: '开通中',
          workorderId: 'TK-0232',
          applyTime: '2024-03-14'
        }
      ]
    };
  },
  created() {
    this.loadOrderList();
  },
  methods: {
    loadOrderList() {
      this.loading = true;
      setTimeout(() => {
        this.total = this.orderList.length;
        this.loading = false;
      }, 500);
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.loadOrderList();
    },
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        keyword: undefined,
        org: undefined,
        serviceType: undefined,
        status: undefined
      };
      this.loadOrderList();
    },
    goToDetail(row) {
      this.$router.push('/workorder/order/detail');
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
        '开通中': 'primary',
        '已生效': 'success',
        '已驳回': 'danger',
        '工单处理中': 'info'
      };
      return colorMap[status] || 'info';
    }
  }
};
</script>

<style scoped>
/* 统计卡片样式 */
.stats-card {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 16px;
  border-radius: 6px;
  background: #fff;
  border: none;
  border-top: 3px solid #1890ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #1890ff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 13px;
  color: #8c8c8c;
  font-weight: 500;
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

.mb12 {
  margin-bottom: 12px;
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
</style>
