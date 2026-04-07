<template>
  <div class="app-container">
    <!-- 统计卡片 - 优化样式 -->
    <div class="stats-card mb12">
      <div class="stat-item stat-pending">
        <div class="stat-value">4</div>
        <div class="stat-label">待审核</div>
      </div>
      <div class="stat-item stat-approved">
        <div class="stat-value">47</div>
        <div class="stat-label">已通过</div>
      </div>
      <div class="stat-item stat-valid">
        <div class="stat-value">47</div>
        <div class="stat-label">有效机构</div>
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
          <el-form-item prop="keyword">
            <el-input
              v-model="filterForm.keyword"
              placeholder="机构名称、代码"
              clearable
              style="width: 150px"
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
          <el-form-item prop="orgType">
            <el-select
              v-model="filterForm.orgType"
              placeholder="机构类型"
              clearable
              style="width: 150px"
            >
              <el-option label="政府机关" value="government" />
              <el-option label="事业单位" value="institution" />
              <el-option label="国有企业" value="state-owned" />
              <el-option label="私营企业" value="private" />
            </el-select>
          </el-form-item>
          <el-form-item prop="status">
            <el-select
              v-model="filterForm.status"
              placeholder="审核状态"
              clearable
              style="width: 150px"
            >
              <el-option label="待审核" value="pending" />
              <el-option label="已通过" value="approved" />
              <el-option label="已驳回" value="rejected" />
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

    <!-- 机构列表 -->
    <el-table v-loading="loading" :data="orgList" size="small" style="width: 100%" :header-cell-style="{background:'#f5f7fa'}" class-name="small-padding fixed-width">
      <el-table-column prop="orgName" label="机构名称" min-width="220">
        <template slot-scope="scope">
          <div>
            <div class="org-name">{{ scope.row.orgName }}</div>
            <div class="org-code">{{ scope.row.orgCode }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="orgType" label="机构类型" width="100">
        <template slot-scope="scope">
          <el-tag :type="getOrgTypeTagType(scope.row.orgType)" size="mini" effect="plain">{{ scope.row.orgType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="applyMaterials" label="申请材料" width="120">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="viewMaterials(scope.row)">{{ scope.row.applyMaterials }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="90">
        <template slot-scope="scope">
          <el-tag :type="getStatusTagType(scope.row.status)" size="mini" effect="dark">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="applyTime" label="申请时间" width="160" />
      <el-table-column prop="auditor" label="审核人" width="100" />
      <el-table-column label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <el-link
            v-if="scope.row.status === '待审核'"
            type="primary"
            :underline="false"
            @click="startAudit(scope.row)"
          >
            开始审核
          </el-link>
          <el-link
            v-else-if="scope.row.status === '审核中'"
            type="primary"
            :underline="false"
            @click="continueAudit(scope.row)"
          >
            继续审核
          </el-link>
          <el-link
            v-else-if="scope.row.status === '已通过'"
            type="success"
            :underline="false"
            @click="viewFiles(scope.row)"
          >
            查看档案
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
      @pagination="loadOrgList"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index.vue';

export default {
  name: 'QualificationAudit',
  components: {
    Pagination
  },
  data() {
    return {
      loading: false,
      total: 0,
      filterForm: {
        keyword: '',
        orgType: '',
        status: ''
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      orgList: [
        {
          id: 1,
          orgName: '北京市海淀区数字经济发展局',
          orgCode: '91110108MA012ABC3X',
          orgType: '政府机关',
          applyMaterials: '5份 - 待审核',
          status: '待审核',
          applyTime: '2024-03-15 00:12',
          auditor: ''
        },
        {
          id: 2,
          orgName: '中远云科技有限公司',
          orgCode: '91110105MA012DEF8Y',
          orgType: '私营企业',
          applyMaterials: '4份 - 审核中',
          status: '审核中',
          applyTime: '2024-03-14 16:30',
          auditor: '李四'
        },
        {
          id: 3,
          orgName: '华能数智科技集团',
          orgCode: '91110101MA012GH15Z',
          orgType: '国有企业',
          applyMaterials: '6份 - 已归档',
          status: '已通过',
          applyTime: '2024-03-12 10:05',
          auditor: '王五'
        },
        {
          id: 4,
          orgName: '北京协和医学院附属医院',
          orgCode: '91110108MA012JKL2W',
          orgType: '事业单位',
          applyMaterials: '4份 - 已归档',
          status: '已通过',
          applyTime: '2024-03-10 14:22',
          auditor: '李四'
        },
        {
          id: 5,
          orgName: '锐途智能科技（北京）有限公司',
          orgCode: '91110102MA012MNO7P',
          orgType: '私营企业',
          applyMaterials: '3份 - 不完整',
          status: '已驳回',
          applyTime: '2024-03-09 11:45',
          auditor: '王五'
        }
      ]
    };
  },
  created() {
    this.loadOrgList();
  },
  methods: {
    loadOrgList() {
      this.loading = true;
      // 模拟API请求
      setTimeout(() => {
        this.total = this.orgList.length;
        this.loading = false;
      }, 500);
    },
    handleSizeChange(size) {
      this.queryParams.pageSize = size;
      this.loadOrgList();
    },
    handleCurrentChange(current) {
      this.queryParams.pageNum = current;
      this.loadOrgList();
    },
    getOrgTypeTagType(orgType) {
      switch (orgType) {
        case '政府机关':
          return 'primary';
        case '事业单位':
          return 'success';
        case '国有企业':
          return 'warning';
        case '私营企业':
          return 'info';
        default:
          return '';
      }
    },
    getStatusTagType(status) {
      switch (status) {
        case '待审核':
          return 'warning';
        case '审核中':
          return 'info';
        case '已通过':
          return 'success';
        case '已驳回':
          return 'danger';
        default:
          return '';
      }
    },
    viewMaterials(org) {
      // 查看申请材料
      console.log('查看申请材料:', org);
    },
    startAudit(org) {
      // 开始审核
      this.$router.push({
        path: '/workorder/auditCenter/qualificationDetail',
        query: { orgId: org.id }
      });
    },
    continueAudit(org) {
      // 继续审核
      this.$router.push({
        path: '/workorder/auditCenter/qualificationDetail',
        query: { orgId: org.id }
      });
    },
    viewFiles(org) {
      // 查看档案
      console.log('查看档案:', org);
    },
    viewDetails(org) {
      // 查看详情
      this.$router.push({
        path: '/workorder/auditCenter/qualificationDetail',
        query: { orgId: org.id }
      });
    },
    handleSearch() {
      // 执行搜索
      this.queryParams.pageNum = 1;
      this.loadOrgList();
    },
    resetFilter() {
      // 重置筛选条件
      this.filterForm = {
        keyword: '',
        orgType: '',
        status: ''
      };
      this.queryParams.pageNum = 1;
      this.loadOrgList();
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
</style>
