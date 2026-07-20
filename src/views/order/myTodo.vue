<template>
  <div>
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
          <el-form-item prop="code">
            <el-input
              v-model="queryParams.code"
              placeholder="订单编号、机构名、服务名称"
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
              <el-option label="华能数智科技集团" value="华能数智科技集团" />
              <el-option label="中国电信股份有限公司" value="中国电信股份有限公司" />
            </el-select>
          </el-form-item>
          <el-form-item prop="type">
            <el-select
              v-model="queryParams.type"
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
      <el-table-column prop="code" label="订单号" width="150" />
      <el-table-column prop="name" label="服务名称 / 规格" min-width="220">
        <template slot-scope="scope">
          <div>
            <div class="tbl-name">{{ scope.row.name }}</div>
            <div class="tbl-sub">{{ scope.row.spec || '无规格' }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="org" label="申请机构" min-width="220">
        <template slot-scope="scope">
          <div>
            <div class="tbl-name">{{ scope.row.org }}</div>
            <div class="tbl-sub">{{ scope.row.applicant || '未知' }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="服务类型" width="120">
        <template slot-scope="scope">
          <el-tag :type="getServiceTypeColor(scope.row.type)" size="small">{{ scope.row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="120">
        <template slot-scope="scope">
          <el-tag :type="getStatusColor(scope.row.status)" size="small">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="workorderCode" label="关联工单" width="120" />
      <el-table-column prop="createTime" label="申请时间" width="160" />
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
      @pagination="loadOrderList"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index.vue';

export default {
  name: 'OrderMyTodo',
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
        org: undefined,
        type: undefined,
        status: undefined
      },
      orderList: [
        {
          id: 1,
          code: 'ORD-2024-0001',
          name: '等保三级合规评估',
          spec: '含渗透测试 + 整改报告',
          org: '北京市海淀区数字经济发展局',
          applicant: '张三',
          department: '技术部',
          type: '安全服务',
          status: '工单流转中',
          workorderCode: 'WO-2024-0001',
          createTime: '2024-03-15 10:30:00'
        },
        {
          id: 2,
          code: 'ORD-2024-0002',
          name: '云主机（ECS）',
          spec: '4核8G，500G SSD',
          org: '华能数智科技集团',
          applicant: '李四',
          department: '运维部',
          type: '标准云资源',
          status: '工单流转中',
          workorderCode: 'WO-2024-0002',
          createTime: '2024-03-14 14:20:00'
        },
        {
          id: 3,
          code: 'ORD-2024-0003',
          name: '智慧园区管理系统',
          spec: '标准版，含500个设备接入',
          org: '中国电信股份有限公司',
          applicant: '王五',
          department: '信息化部',
          type: '数字应用服务',
          status: '工单流转中',
          workorderCode: 'WO-2024-0003',
          createTime: '2024-03-13 09:15:00'
        },
        {
          id: 4,
          code: 'ORD-2024-0004',
          name: 'AI 语音识别组件',
          spec: '支持中文识别，准确率98%',
          org: '北京市海淀区数字经济发展局',
          applicant: '赵六',
          department: '创新部',
          type: '能力组件服务',
          status: '工单流转中',
          workorderCode: 'WO-2024-0004',
          createTime: '2024-03-12 16:45:00'
        },
        {
          id: 5,
          code: 'ORD-2024-0005',
          name: '定制化网络安全方案',
          spec: '企业级，含防火墙部署',
          org: '华能数智科技集团',
          applicant: '孙七',
          department: '安全部',
          type: '定制化资源',
          status: '工单流转中',
          workorderCode: 'WO-2024-0005',
          createTime: '2024-03-11 11:20:00'
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
      this.dateRange = [];
      this.$refs.queryForm.resetFields();
      this.handleQuery();
    },
    loadOrderList() {
      this.loading = true;
      // 模拟API请求 - 我的待办只显示待处理状态
      setTimeout(() => {
        this.orderList = [
          {
            id: 1,
            code: 'ORD-2024-0001',
            name: '等保三级合规评估',
            spec: '含渗透测试 + 整改报告',
            org: '北京市海淀区数字经济发展局',
            applicant: '张三',
            department: '技术部',
            type: '安全服务',
            status: '工单流转中',
            workorderCode: 'WO-2024-0001',
            createTime: '2024-03-15 10:30:00'
          },
          {
            id: 2,
            code: 'ORD-2024-0002',
            name: '云主机（ECS）',
            spec: '4核8G，500G SSD',
            org: '华能数智科技集团',
            applicant: '李四',
            department: '运维部',
            type: '标准云资源',
            status: '工单流转中',
            workorderCode: 'WO-2024-0002',
            createTime: '2024-03-14 14:20:00'
          },
          {
            id: 3,
            code: 'ORD-2024-0003',
            name: '智慧园区管理系统',
            spec: '标准版，含500个设备接入',
            org: '中国电信股份有限公司',
            applicant: '王五',
            department: '信息化部',
            type: '数字应用服务',
            status: '工单流转中',
            workorderCode: 'WO-2024-0003',
            createTime: '2024-03-13 09:15:00'
          },
          {
            id: 4,
            code: 'ORD-2024-0004',
            name: 'AI 语音识别组件',
            spec: '支持中文识别，准确率98%',
            org: '北京市海淀区数字经济发展局',
            applicant: '赵六',
            department: '创新部',
            type: '能力组件服务',
            status: '工单流转中',
            workorderCode: 'WO-2024-0004',
            createTime: '2024-03-12 16:45:00'
          },
          {
            id: 5,
            code: 'ORD-2024-0005',
            name: '定制化网络安全方案',
            spec: '企业级，含防火墙部署',
            org: '华能数智科技集团',
            applicant: '孙七',
            department: '安全部',
            type: '定制化资源',
            status: '工单流转中',
            workorderCode: 'WO-2024-0005',
            createTime: '2024-03-11 11:20:00'
          }
        ];
        this.total = this.orderList.length;
        this.loading = false;
      }, 500);
    },
    goToDetail(row) {
      this.$router.push('/workorder/order/detail');
    },
    handleProcess(row) {
      // 点击处理进入我的待办详情页面
      this.$router.push('/workorder/order/myTodoDetail');
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