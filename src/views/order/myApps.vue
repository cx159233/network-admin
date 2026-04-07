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
          <el-form-item prop="appName">
            <el-input
              v-model="queryParams.appName"
              placeholder="应用名称、厂商、服务名称"
              clearable
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item prop="vendor">
            <el-select
              v-model="queryParams.vendor"
              placeholder="所有厂商"
              clearable
              style="width: 150px"
            >
              <el-option label="所有厂商" value="" />
              <el-option label="腾讯科技" value="1" />
              <el-option label="阿里巴巴" value="2" />
              <el-option label="百度" value="3" />
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
              <el-option label="上架" value="20" />
              <el-option label="下架" value="30" />
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
      :data="appList"
      size="small"
      style="width: 100%"
      class-name="small-padding fixed-width"
    >
      <el-table-column prop="appName" label="应用名称 / 版本" min-width="220">
        <template slot-scope="scope">
          <div>
            <div class="tbl-name">{{ scope.row.appName }}</div>
            <div class="tbl-sub">{{ scope.row.version }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="vendor" label="厂商" min-width="150" />
      <el-table-column prop="category" label="分类" width="120">
        <template slot-scope="scope">
          <el-tag size="small">{{ scope.row.category }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="cloudProvider" label="云服务商" min-width="150" />
      <el-table-column prop="status" label="状态" width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 20 ? 'success' : 'danger'" size="small">
            {{ scope.row.status === 20 ? '上架' : '下架' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="上架时间" width="160" />
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
      @pagination="loadAppList"
    />

    <!-- 评分弹窗 -->
    <el-dialog
      :title="ratingDialogTitle"
      width="600px"
      :visible.sync="ratingDialogVisible"
      :close-on-click-modal="false"
      append-to-body
    >
      <div v-if="ratingType === 'platform'">
        <el-form ref="ratingForm" :model="ratingForm" label-width="80px">
          <el-form-item label="评分">
            <el-rate v-model="ratingForm.score" :max="5" show-score />
          </el-form-item>
          <el-form-item label="评价描述">
            <el-input v-model="ratingForm.description" type="textarea" rows="4" placeholder="请输入评价描述" />
          </el-form-item>
        </el-form>
      </div>
      <div v-else-if="ratingType === 'usage'">
        <el-table :data="usageRatings" style="width: 100%">
          <el-table-column prop="user" label="用户" width="120" />
          <el-table-column prop="score" label="评分" width="80" />
          <el-table-column prop="description" label="评价内容" />
          <el-table-column prop="createTime" label="评价时间" width="180" />
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="ratingType === 'platform'" type="primary" @click="handleRatingSubmit">提交</el-button>
        <el-button @click="ratingDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "OrderMyApps",
  data() {
    return {
      // 遮罩层
      loading: false,
      appList: null,
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        appName: undefined,
        vendor: undefined,
        status: undefined,
      },
      // 评分弹窗
      ratingDialogVisible: false,
      ratingType: '', // platform 或 usage
      ratingDialogTitle: '',
      ratingForm: {
        score: 0,
        description: ''
      },
      usageRatings: [],
      currentApp: null,
    };
  },
  created() {
    this.loadAppList();
  },
  methods: {
    loadAppList() {
      this.loading = true;
      // 模拟数据
      setTimeout(() => {
        this.appList = [
          {
            id: 1,
            appName: '智能办公系统',
            version: 'v1.0.0',
            vendor: '腾讯科技',
            category: '办公软件',
            cloudProvider: '腾讯云',
            platformRating: 4.5,
            usageRating: 4.2,
            status: 20,
            createTime: '2024-01-01 10:00:00'
          },
          {
            id: 2,
            appName: '企业管理系统',
            version: 'v2.0.0',
            vendor: '阿里巴巴',
            category: '企业管理',
            cloudProvider: '阿里云',
            platformRating: 4.8,
            usageRating: 4.5,
            status: 20,
            createTime: '2024-01-02 11:00:00'
          },
          {
            id: 3,
            appName: '数据分析平台',
            version: 'v3.0.0',
            vendor: '百度',
            category: '数据分析',
            cloudProvider: '百度云',
            platformRating: 4.0,
            usageRating: 3.8,
            status: 30,
            createTime: '2024-01-03 12:00:00'
          }
        ];
        this.total = 3;
        this.loading = false;
      }, 1000);
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.loadAppList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    goToDetail(row) {
      // 跳转到应用详情页面
      this.$router.push({ path: '/workorder/myAppsDetail', query: { id: row.id } });
    },
    openRatingDialog(row, type) {
      this.currentApp = row;
      this.ratingType = type;
      if (type === 'platform') {
        this.ratingDialogTitle = '平台评价';
        this.ratingForm.score = row.platformRating || 0;
        this.ratingForm.description = '';
      } else {
        this.ratingDialogTitle = '使用评价列表';
        // 模拟使用评价数据
        this.usageRatings = [
          { user: '用户1', score: 5, description: '非常好用', createTime: '2024-01-01 10:00:00' },
          { user: '用户2', score: 4, description: '还不错', createTime: '2024-01-02 11:00:00' }
        ];
      }
      this.ratingDialogVisible = true;
    },
    handleRatingSubmit() {
      // 提交平台评价
      this.$modal.msgSuccess('评价成功');
      this.ratingDialogVisible = false;
      // 模拟更新评分
      this.currentApp.platformRating = this.ratingForm.score;
    },
  },
};
</script>

<style scoped>
.app-container {
  padding: 20px;
  background-color: #ffffff;
  min-height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
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

/* 评分样式 */
.rating-star {
  color: #409EFF;
  cursor: pointer;
  font-weight: bold;
}

.rating-star:hover {
  text-decoration: underline;
}
</style>