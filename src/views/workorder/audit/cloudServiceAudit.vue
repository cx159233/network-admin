<template>
  <div class="app-container">
    <!-- 统计卡片 - 优化样式 -->
    <div class="stats-card mb12">
      <div class="stat-item stat-pending">
        <div class="stat-value">2</div>
        <div class="stat-label">待审核</div>
      </div>
      <div class="stat-item stat-approved">
        <div class="stat-value">1</div>
        <div class="stat-label">已通过</div>
      </div>
      <div class="stat-item stat-valid">
        <div class="stat-value">3</div>
        <div class="stat-label">总应用数</div>
      </div>
    </div>

    <!-- 筛选条件 -->
    <el-row :gutter="24" class="mb12">
      <el-col :span="24">
        <el-form
          :model="filterForm"
          size="small"
          class="el-form-search"
          :inline="true"
        >
          <el-form-item prop="appName">
            <el-input
              v-model="filterForm.appName"
              placeholder="应用名称、厂商"
              clearable
              style="width: 150px"
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
          <el-form-item prop="category">
            <el-select
              v-model="filterForm.category"
              placeholder="应用分类"
              clearable
              style="width: 150px"
            >
              <el-option label="办公软件" value="office" />
              <el-option label="企业管理" value="enterprise" />
              <el-option label="数据分析" value="data" />
              <el-option label="其他" value="other" />
            </el-select>
          </el-form-item>
          <el-form-item prop="auditStatus">
            <el-select
              v-model="filterForm.auditStatus"
              placeholder="审核状态"
              clearable
              style="width: 150px"
            >
              <el-option label="待审核" value="10" />
              <el-option label="已通过" value="20" />
              <el-option label="已拒绝" value="30" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="handleSearch"
                >搜索</el-button
              >
              <el-button icon="el-icon-refresh" @click="resetFilter">重置</el-button>
            </el-button-group>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!-- 应用列表 -->
    <el-table v-loading="loading" :data="appList" size="small" style="width: 100%" :header-cell-style="{background:'#f5f7fa'}" class-name="small-padding fixed-width">
      <el-table-column prop="appName" label="应用名称" min-width="220">
        <template slot-scope="scope">
          <div>
            <div class="org-name">{{ scope.row.appName }}</div>
            <div class="org-code">{{ scope.row.version }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="vendor" label="厂商" width="120" />
      <el-table-column prop="category" label="分类" width="100" />
      <el-table-column prop="cloudProvider" label="云服务商" width="120" />
      <el-table-column prop="submitTime" label="提交时间" width="160" />
      <el-table-column prop="auditStatus" label="状态" width="90">
        <template slot-scope="scope">
          <el-tag :type="getStatusTagType(scope.row.auditStatus)" size="mini" effect="dark">{{ scope.row.auditStatus === 10 ? '待审核' : scope.row.auditStatus === 20 ? '已通过' : '已拒绝' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <el-link
            v-if="scope.row.auditStatus === 10"
            type="primary"
            :underline="false"
            @click="startAudit(scope.row)"
          >
            开始审核
          </el-link>
          <el-link
            v-else-if="scope.row.auditStatus === 20"
            type="success"
            :underline="false"
            @click="viewDetails(scope.row)"
          >
            查看详情
          </el-link>
          <el-link
            v-else
            type="info"
            :underline="false"
            @click="viewDetails(scope.row)"
          >
            查看详情
          </el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="loadAppList"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index.vue';

export default {
  name: "DigitalAppAudit",
  components: {
    Pagination
  },
  data() {
    return {
      loading: false,
      total: 0,
      filterForm: {
        appName: '',
        category: '',
        auditStatus: ''
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      serviceList: [
        {
          id: 1,
          serviceName: '云服务器ECS',
          serviceId: 'SVC001',
          serviceType: 'ecs',
          cloudProvider: '电信云',
          region: '华东',
          submitTime: '2024-01-01 10:00:00',
          auditStatus: 10
        },
        {
          id: 2,
          serviceName: '对象存储OSS',
          serviceId: 'SVC002',
          serviceType: 'storage',
          cloudProvider: '移动云',
          region: '华北',
          submitTime: '2024-01-02 11:00:00',
          auditStatus: 10
        },
        {
          id: 3,
          serviceName: '云数据库RDS',
          serviceId: 'SVC003',
          serviceType: 'database',
          cloudProvider: '联通云',
          region: '华南',
          submitTime: '2024-01-03 12:00:00',
          auditStatus: 20
        }
      ]
    };
  },
  created() {
    this.loadServiceList();
  },
  methods: {
    loadServiceList() {
      this.loading = true;
      // 模拟API请求
      setTimeout(() => {
        this.total = this.serviceList.length;
        this.loading = false;
      }, 500);
    },
    getStatusTagType(status) {
      switch (status) {
        case 10:
          return 'warning';
        case 20:
          return 'success';
        case 30:
          return 'danger';
        default:
          return '';
      }
    },
    startAudit(service) {
      // 开始审核
      this.$router.push({
        path: '/portal/auditCenter/cloudServiceAuditDetail',
        query: { id: service.id }
      });
    },
    viewDetails(service) {
      // 查看详情
      this.$router.push({
        path: '/portal/auditCenter/cloudServiceAuditDetail',
        query: { id: service.id }
      });
    },
    handleSearch() {
      // 执行搜索
      this.queryParams.pageNum = 1;
      this.loadServiceList();
    },
    resetFilter() {
      // 重置筛选条件
      this.filterForm = {
        serviceName: '',
        serviceType: '',
        auditStatus: ''
      };
      this.queryParams.pageNum = 1;
      this.loadServiceList();
    }
  }
};
</script>

<style scoped>
/* 统计卡片样式优化 */
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
  border-top: 3px solid;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.stat-pending {
  border-top-color: #faad14;
  background: linear-gradient(135deg, #fafafa 0%, #fff 100%);
}

.stat-processing {
  border-top-color: #1890ff;
  background: linear-gradient(135deg, #fafafa 0%, #fff 100%);
}

.stat-approved {
  border-top-color: #52c41a;
  background: linear-gradient(135deg, #fafafa 0%, #fff 100%);
}

.stat-valid {
  border-top-color: #722ed1;
  background: linear-gradient(135deg, #fafafa 0%, #fff 100%);
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-pending .stat-value {
  color: #faad14;
}

.stat-processing .stat-value {
  color: #1890ff;
}

.stat-approved .stat-value {
  color: #52c41a;
}

.stat-valid .stat-value {
  color: #722ed1;
}

.stat-label {
  font-size: 13px;
  color: #8c8c8c;
  font-weight: 500;
}

/* 筛选区域样式优化 */
.filter-section {
  background: #fff;
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
}

.filter-form {
  margin-bottom: 0;
}

.compact-form-item {
  margin-bottom: 0 !important;
  margin-right: 12px !important;
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

/* 表格样式优化 */
.table-card {
  border: 1px solid #e8e8e8;
}

.org-name {
  font-size: 14px;
  color: #262626;
  font-weight: 500;
}

.org-code {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
}

.pagination-container {
  margin-top: 16px;
  text-align: right;
}
</style>tent: flex-end;
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

/* 表格样式优化 */
.table-card {
  border: 1px solid #e8e8e8;
}

.org-name {
  font-size: 14px;
  color: #262626;
  font-weight: 500;
}

.org-code {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
}

.pagination-container {
  margin-top: 16px;
  text-align: right;
}
</style>  margin-top: 16px;
  text-align: right;
}
</style>