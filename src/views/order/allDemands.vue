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
          <el-form-item prop="demandNo">
            <el-input
              v-model="queryParams.demandNo"
              placeholder="请输入需求编号"
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
          <el-form-item prop="serviceType">
            <el-select
              v-model="queryParams.serviceType"
              placeholder="所有服务类型"
              clearable
              style="width: 150px"
            >
              <el-option label="数字应用服务" value="数字应用服务" />
              <el-option label="能力组件服务" value="能力组件服务" />
              <el-option label="安全服务" value="安全服务" />
              <el-option label="基础资源服务" value="基础资源服务" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="handleQuery"
              >搜索</el-button>
              <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
            </el-button-group>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="demandList"
      size="small"
      style="width: 100%"
      class-name="small-padding fixed-width"
    >
      <el-table-column prop="demandNo" label="需求编号" width="150" />
      <el-table-column prop="demandDescription" label="需求描述" min-width="200" show-overflow-tooltip />
      <el-table-column prop="orgName" label="申请机构" min-width="180">
        <template slot-scope="scope">
          <div>
            <div class="tbl-name">{{ scope.row.orgName }}</div>
            <div class="tbl-sub">{{ scope.row.applicant }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="respondent" label="响应机构" min-width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.respondent">{{ scope.row.respondent }}</span>
          <span v-else class="tbl-empty">-</span>
        </template>
      </el-table-column>
      <el-table-column prop="serviceType" label="服务类型" width="120">
        <template slot-scope="scope">
          <el-tag :type="getServiceTypeColor(scope.row.serviceType)" size="small">{{ scope.row.serviceType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="getStatusColor(scope.row.status)" size="small">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="publishTime" label="发布时间" width="160" />
      <el-table-column label="操作" width="100" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="viewDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="loadDemandList"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index.vue';

export default {
  name: "AllDemands",
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
        demandNo: undefined,
        orgName: undefined,
        serviceType: undefined,
        status: undefined
      },
      demandList: [
        {
          demandNo: '#DM-2024-0012',
          demandDescription: '需要一个统一的身份认证平台，支持OAuth2.0和SAML协议，要求支持至少10万用户的并发认证',
          serviceType: '安全服务',
          orgName: '北京市海淀区数字经济发展局',
          applicant: '张三',
          status: '待响应',
          publishTime: '2024-03-18 10:30:00'
        },
        {
          demandNo: '#DM-2024-0011',
          demandDescription: '需要部署一套大数据分析平台，支持PB级数据处理',
          serviceType: '数字应用服务',
          orgName: '北京市海淀区数字经济发展局',
          applicant: '张三',
          status: '已响应',
          publishTime: '2024-03-15 14:20:00',
          respondent: '北京大数据技术有限公司',
          responseContent: '可提供PB级大数据分析平台方案，支持数据采集、清洗、分析、可视化全流程。',
          estimatedPrice: '460,000',
          estimatedDuration: '60个工作日',
          responseTime: '2024-03-16 11:00:00'
        },
        {
          demandNo: '#DM-2024-0010',
          demandDescription: '需要采购弹性云服务器资源，配置不低于32核64G内存',
          serviceType: '基础资源服务',
          orgName: '北京市海淀区数字经济发展局',
          applicant: '张三',
          status: '已完成',
          publishTime: '2024-03-10 09:00:00',
          respondent: '北京云计算科技有限公司',
          responseContent: '可提供32核64G云服务器，含200G SSD系统盘，1Gbps带宽。',
          estimatedPrice: '36,000',
          estimatedDuration: '5个工作日',
          responseTime: '2024-03-11 10:30:00'
        },
        {
          demandNo: '#DM-2024-0009',
          demandDescription: '需要消息推送中间件，支持短信/邮件/站内信多通道',
          serviceType: '能力组件服务',
          orgName: '北京市朝阳区卫健委',
          applicant: '赵六',
          status: '已关闭',
          publishTime: '2024-03-05 16:00:00'
        },
        {
          demandNo: '#DM-2024-0008',
          demandDescription: '需要部署一套智慧医疗数据中台',
          serviceType: '数字应用服务',
          orgName: '北京市第一人民医院',
          applicant: '李四',
          status: '待响应',
          publishTime: '2024-03-16 11:00:00'
        },
        {
          demandNo: '#DM-2024-0007',
          demandDescription: '需要采购高性能GPU计算集群，用于AI模型训练',
          serviceType: '基础资源服务',
          orgName: '北京人工智能研究院',
          applicant: '王五',
          status: '已响应',
          publishTime: '2024-03-12 08:30:00',
          respondent: '北京云计算科技有限公司',
          responseContent: '我方可提供NVIDIA A100集群方案，包含8卡GPU服务器2台，配套分布式训练框架，支持PyTorch/TensorFlow。提供7×24小时运维支持。',
          estimatedPrice: '580,000',
          estimatedDuration: '45个工作日',
          responseTime: '2024-03-13 09:20:00'
        }
      ]
    };
  },
  created() {
    this.loadDemandList();
  },
  watch: {
    $route: {
      handler: function() {
        this.loadDemandList();
      },
      immediate: true
    }
  },
  methods: {
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.loadDemandList();
    },
    resetQuery() {
      this.$refs.queryForm.resetFields();
      this.handleQuery();
    },
    loadDemandList() {
      this.loading = true;
      setTimeout(() => {
        this.total = this.demandList.length;
        this.loading = false;
      }, 500);
    },
    viewDetail(row) {
      this.$router.push({ path: '/portal/demand/detail', query: { id: row.demandNo } });
    },
    getServiceTypeColor(type) {
      const colorMap = {
        '数字应用服务': 'info',
        '能力组件服务': 'success',
        '安全服务': 'warning',
        '基础资源服务': ''
      };
      return colorMap[type] || 'info';
    },
    getStatusColor(status) {
      const colorMap = {
        '待响应': 'warning',
        '已响应': 'info',
        '已完成': 'success',
        '已关闭': 'danger'
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

:deep(.el-form-search) {
  margin-bottom: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 12px;
  padding: 0;
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

.tbl-empty {
  color: #c0c4cc;
}

/* 详情弹窗 */
:deep(.el-dialog__header) {
  padding: 14px 24px 6px;
}

:deep(.el-dialog__body) {
  padding: 0;
}

:deep(.el-dialog__footer) {
  padding: 8px 24px 16px;
}

.form-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  padding-bottom: 10px;
  margin-bottom: 18px;
  border-bottom: 1px solid #ebeef5;
}

.detail-kv {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 6px 40px;
  padding: 4px 12px;
}

.kv-item {
  display: flex;
  align-items: baseline;
  font-size: 14px;
  line-height: 2;
}

.kv-item.full {
  grid-column: 1 / -1;
}

.kv-item label {
  color: #8c8c8c;
  width: 80px;
  flex-shrink: 0;
  font-weight: 400;
  white-space: nowrap;
}

.kv-item span {
  color: #262626;
  word-break: break-all;
  font-weight: 400;
  font-size: 14px;
  min-width: 0;
}
</style>
