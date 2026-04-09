<template>
  <div class="app-container">
    <!-- 统计卡片 -->
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
        <div class="stat-label">总组件数</div>
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
          <el-form-item prop="name">
            <el-input
              v-model="filterForm.name"
              placeholder="组件名称、服务商"
              clearable
              style="width: 150px"
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
          <el-form-item prop="cover">
            <el-select
              v-model="filterForm.cover"
              placeholder="开放范围"
              clearable
              style="width: 150px"
            >
              <el-option label="不限" value="all" />
              <el-option label="市级" value="city" />
              <el-option label="区（县）域" value="district" />
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

    <!-- 组件列表 -->
    <el-table v-loading="loading" :data="componentList" size="small" style="width: 100%" :header-cell-style="{background:'#f5f7fa'}" class-name="small-padding fixed-width">
      <el-table-column prop="name" label="组件名称" min-width="220">
        <template slot-scope="scope">
          <div>
            <div class="org-name">{{ scope.row.name }}</div>
            <div class="org-code">{{ scope.row.componentId }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="serviceProviderName" label="服务商" width="120">
        <template slot-scope="scope">
          <el-tag :type="getVendorTagType(scope.row.serviceProviderName)" size="mini" effect="plain">{{ scope.row.serviceProviderName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="deployServiceProviderView" label="云服务商" width="120" />
      <el-table-column prop="coverView" label="开放范围" width="120" />
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
      @pagination="loadComponentList"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index.vue';

export default {
  name: "ComponentAudit",
  components: {
    Pagination
  },
  data() {
    return {
      loading: false,
      total: 0,
      filterForm: {
        name: '',
        cover: '',
        auditStatus: ''
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      componentList: [
        {
          id: 1,
          name: '电子签章服务组件',
          componentId: 'COMP-2024-001',
          serviceProviderName: '华为技术',
          deployServiceProviderView: '电信云',
          coverView: '不限',
          submitTime: '2024-03-10 09:30:00',
          auditStatus: 10
        },
        {
          id: 2,
          name: '身份认证组件',
          componentId: 'COMP-2024-002',
          serviceProviderName: '阿里云计算',
          deployServiceProviderView: '移动云',
          coverView: '市级',
          submitTime: '2024-03-11 14:20:00',
          auditStatus: 10
        },
        {
          id: 3,
          name: '消息推送组件',
          componentId: 'COMP-2024-003',
          serviceProviderName: '腾讯科技',
          deployServiceProviderView: '联通云',
          coverView: '区（县）域',
          submitTime: '2024-03-05 10:00:00',
          auditStatus: 20
        }
      ]
    };
  },
  created() {
    this.loadComponentList();
  },
  methods: {
    loadComponentList() {
      this.loading = true;
      setTimeout(() => {
        this.total = this.componentList.length;
        this.loading = false;
      }, 500);
    },
    getVendorTagType(vendor) {
      const vendors = {
        '华为技术': 'primary',
        '阿里云计算': 'success',
        '腾讯科技': 'warning'
      };
      return vendors[vendor] || 'info';
    },
    getStatusTagType(status) {
      switch (status) {
        case 10: return 'warning';
        case 20: return 'success';
        case 30: return 'danger';
        default: return '';
      }
    },
    startAudit(comp) {
      this.$router.push({
        path: '/portal/auditCenter/componentAuditDetail',
        query: { id: comp.id }
      });
    },
    viewDetails(comp) {
      this.$router.push({
        path: '/portal/auditCenter/componentAuditDetail',
        query: { id: comp.id }
      });
    },
    handleSearch() {
      this.queryParams.pageNum = 1;
      this.loadComponentList();
    },
    resetFilter() {
      this.filterForm = { name: '', cover: '', auditStatus: '' };
      this.queryParams.pageNum = 1;
      this.loadComponentList();
    }
  }
};
</script>

<style scoped>
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

.stat-pending .stat-value { color: #faad14; }
.stat-approved .stat-value { color: #52c41a; }
.stat-valid .stat-value { color: #722ed1; }

.stat-label {
  font-size: 13px;
  color: #8c8c8c;
  font-weight: 500;
}

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

:deep(.el-form-search .el-form-item:last-child) {
  margin-right: 0;
}

:deep(.el-form-search .el-form-item) {
  margin-bottom: 0;
  margin-right: 0;
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
</style>
