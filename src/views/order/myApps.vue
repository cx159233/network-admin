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
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="openAddDialog">新增应用</el-button>
          </el-form-item>
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

    <!-- 新增应用弹窗 -->
    <el-dialog
      title="新增应用"
      width="600px"
      :visible.sync="addDialogVisible"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="100px">
        <el-form-item label="应用名称" prop="appName">
          <el-input v-model="addForm.appName" placeholder="请输入应用名称" />
        </el-form-item>
        <el-form-item label="版本" prop="version">
          <el-input v-model="addForm.version" placeholder="请输入版本号，如 v1.0.0" />
        </el-form-item>
        <el-form-item label="厂商" prop="vendor">
          <el-select v-model="addForm.vendor" placeholder="请选择厂商" style="width: 100%">
            <el-option label="腾讯科技" value="腾讯科技" />
            <el-option label="阿里巴巴" value="阿里巴巴" />
            <el-option label="百度" value="百度" />
            <el-option label="华为" value="华为" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="addForm.category" placeholder="请选择分类" style="width: 100%">
            <el-option label="办公软件" value="办公软件" />
            <el-option label="企业管理" value="企业管理" />
            <el-option label="数据分析" value="数据分析" />
            <el-option label="安全防护" value="安全防护" />
            <el-option label="云计算" value="云计算" />
          </el-select>
        </el-form-item>
        <el-form-item label="云服务商" prop="cloudProvider">
          <el-select v-model="addForm.cloudProvider" placeholder="请选择云服务商" style="width: 100%">
            <el-option label="腾讯云" value="腾讯云" />
            <el-option label="阿里云" value="阿里云" />
            <el-option label="百度云" value="百度云" />
            <el-option label="华为云" value="华为云" />
          </el-select>
        </el-form-item>
        <el-form-item label="应用描述" prop="description">
          <el-input v-model="addForm.description" type="textarea" :rows="3" placeholder="请输入应用描述" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index.vue';

export default {
  name: "OrderMyApps",
  components: {
    Pagination
  },
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
      // 新增应用弹窗
      addDialogVisible: false,
      addForm: {
        appName: '',
        version: '',
        vendor: '',
        category: '',
        cloudProvider: '',
        description: ''
      },
      addRules: {
        appName: [{ required: true, message: '请输入应用名称', trigger: 'blur' }],
        version: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
        vendor: [{ required: true, message: '请选择厂商', trigger: 'change' }],
        category: [{ required: true, message: '请选择分类', trigger: 'change' }],
        cloudProvider: [{ required: true, message: '请选择云服务商', trigger: 'change' }]
      }
    };
  },
  created() {
    this.loadAppList();
  },
  methods: {
    loadAppList() {
      this.loading = true;
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
        this.total = this.appList.length;
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
      this.$router.push({ path: '/workorder/myAppsDetail', query: { id: row.id } });
    },
    openAddDialog() {
      this.addForm = {
        appName: '',
        version: '',
        vendor: '',
        category: '',
        cloudProvider: '',
        description: ''
      };
      this.addDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.addForm && this.$refs.addForm.clearValidate();
      });
    },
    handleAddSubmit() {
      this.$refs.addForm.validate(valid => {
        if (!valid) return;
        const now = new Date();
        const pad = n => String(n).padStart(2, '0');
        const createTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        const newApp = {
          id: Date.now(),
          appName: this.addForm.appName,
          version: this.addForm.version,
          vendor: this.addForm.vendor,
          category: this.addForm.category,
          cloudProvider: this.addForm.cloudProvider,
          platformRating: 0,
          usageRating: 0,
          status: 20,
          createTime: createTime,
          description: this.addForm.description
        };
        this.appList.unshift(newApp);
        this.total = this.appList.length;
        this.addDialogVisible = false;
        this.$modal.msgSuccess('新增成功');
      });
    }
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
