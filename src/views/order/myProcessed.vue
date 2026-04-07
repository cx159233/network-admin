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
              <el-option label="北京市朝阳区智慧城市建设局" value="北京市朝阳区智慧城市建设局" />
              <el-option label="北京市西城区政务服务管理局" value="北京市西城区政务服务管理局" />
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
  name: "OrderMyProcessed",
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
          orderNo: '#ORD-2024-0087',
          serviceName: '云主机（ECS）',
          serviceSpec: '2核4G，200G SSD',
          orgName: '北京市朝阳区智慧城市建设局',
          applicant: '李四',
          department: '信息中心',
          serviceType: '标准云资源',
          status: '审批通过',
          workorderId: 'TK-0232',
          applyTime: '2024-03-14 10:20'
        },
        {
          orderNo: '#ORD-2024-0088',
          serviceName: '网站安全防护',
          serviceSpec: '基础版，含WAF防护',
          orgName: '北京市西城区政务服务管理局',
          applicant: '王五',
          department: '网络科',
          serviceType: '安全服务',
          status: '已驳回',
          workorderId: 'TK-0233',
          applyTime: '2024-03-13 15:40'
        },
        {
          orderNo: '#ORD-2024-0086',
          serviceName: '数据可视化平台',
          serviceSpec: '企业版，含10个数据源',
          orgName: '北京市海淀区数字经济发展局',
          applicant: '赵六',
          department: '数据分析部',
          serviceType: '数字应用服务',
          status: '审批通过',
          workorderId: 'TK-0231',
          applyTime: '2024-03-12 09:30'
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
      // 模拟API请求
      setTimeout(() => {
        this.total = this.orderList.length;
        this.loading = false;
      }, 500);
    },
    goToDetail(row) {
      this.$router.push('/workorder/order/myProcessedDetail');
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
        '已驳回': 'danger',
        '已关闭': 'info'
      };
      return colorMap[status] || 'info';
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
</style>