<template>
  <div>
    <!-- 筛选条件 -->
    <el-row :gutter="24" class="mb12">
      <el-col :span="24">
        <el-form
          :model="queryParams"
          size="small"
          class="el-form-search"
          :inline="true"
        >
          <el-form-item prop="orderNo">
            <el-input
              v-model="queryParams.orderNo"
              placeholder="请输入订单号"
              clearable
              style="width: 160px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item prop="orgName">
            <el-input
              v-model="queryParams.orgName"
              placeholder="请输入机构名称"
              clearable
              style="width: 160px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item prop="serviceName">
            <el-input
              v-model="queryParams.serviceName"
              placeholder="请输入服务名称"
              clearable
              style="width: 160px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item prop="serviceType">
            <el-select
              v-model="queryParams.serviceType"
              placeholder="所有服务类型"
              clearable
              style="width: 150px"
            >
              <el-option label="所有服务类型" value="" />
              <el-option label="数字应用服务" value="digitalApp" />
              <el-option label="能力组件服务" value="component" />
              <el-option label="安全服务" value="security" />
              <el-option label="基础资源服务" value="basicResource" />
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
              <el-option label="工单流转中" value="工单流转中" />
              <el-option label="已完成" value="已完成" />
              <el-option label="已评价" value="已评价" />
              <el-option label="已驳回" value="已驳回" />
              <el-option label="已取消" value="已取消" />
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
            <div class="tbl-sub">{{ scope.row.applicant }}</div>
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
        orderNo: undefined,
        orgName: undefined,
        serviceName: undefined,
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
          status: '工单流转中',
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
          status: '工单流转中',
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
          status: '已完成',
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
          status: '工单流转中',
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
        orderNo: undefined,
        orgName: undefined,
        serviceName: undefined,
        serviceType: undefined,
        status: undefined
      };
      this.loadOrderList();
    },
    goToDetail(row) {
      const currentPath = this.$route.path;
      if (currentPath.startsWith('/portal/order')) {
        this.$router.push('/portal/order/detail');
      } else {
        this.$router.push('/workorder/order/detail');
      }
    },
    getServiceTypeColor(type) {
      const colorMap = {
        '数字应用服务': 'info',
        '能力组件服务': 'success',
        '安全服务': 'warning',
        '基础资源服务': 'primary'
      };
      return colorMap[type] || 'info';
    },
    getStatusColor(status) {
      const colorMap = {
        '工单流转中': '',
        '已完成': 'success',
        '已评价': 'success',
        '已驳回': 'danger',
        '已取消': 'info'
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
