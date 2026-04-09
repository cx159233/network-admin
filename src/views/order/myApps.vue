<template>
  <div class="app-container">
    <!-- 操作按钮 + 筛选条件 -->
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
            <el-button type="primary" icon="el-icon-plus" size="mini" plain @click="openAddDialog">新增应用</el-button>
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
              <el-option label="待审核" value="10" />
              <el-option label="审核未通过" value="15" />
              <el-option label="上架" value="20" />
              <el-option label="下架" value="30" />
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left: auto;">
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
          <el-tag :type="getStatusTagType(scope.row.status)" size="small">
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="提交时间" width="160" />
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
      title="新增应用 · 提交上架审核"
      width="920px"
      :visible.sync="addDialogVisible"
      :close-on-click-modal="false"
      append-to-body
      top="5vh"
    >
      <div class="dialog-tip">
        <i class="el-icon-info"></i>
        <span>请完整填写以下信息并上传相关附件，提交后将进入平台审核流程。</span>
      </div>
      <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="110px" class="add-form">
        <!-- 应用信息 -->
        <div class="form-section">
          <div class="form-section-title">应用信息</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="应用名称" prop="appName">
                <el-input v-model="addForm.appName" placeholder="请输入应用名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="版本号" prop="version">
                <el-input v-model="addForm.version" placeholder="如 v1.0.0" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="系统地址">
                <el-input v-model="addForm.systemUrl" placeholder="https://" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上传LOGO">
                <el-upload
                  class="logo-uploader"
                  action="#"
                  :auto-upload="false"
                  :on-change="handleLogoUpload"
                  :limit="1"
                  :accept="'image/png,image/jpeg,image/jpg'"
                  :show-file-list="false"
                >
                  <div class="logo-upload-area" v-if="!addForm.logo">
                    <i class="el-icon-plus"></i>
                    <span>点击上传</span>
                  </div>
                  <img v-else :src="addForm.logo" class="logo-preview" />
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="应用描述" prop="description">
            <el-input v-model="addForm.description" type="textarea" :rows="3" placeholder="请详细描述应用的功能、适用场景等" />
          </el-form-item>
        </div>

        <!-- 服务商信息 -->
        <div class="form-section">
          <div class="form-section-title">服务商信息</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="服务商名称" prop="vendor">
                <el-input v-model="addForm.vendor" placeholder="请输入企业全称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合作伙伴">
                <el-input v-model="addForm.cooperativeEnterprise" placeholder="多个用分号分隔" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="联系人" prop="contact1Name">
                <el-input v-model="addForm.contact1Name" placeholder="姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话" prop="contact1Phone">
                <el-input v-model="addForm.contact1Phone" placeholder="手机号码" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="备用联系人">
                <el-input v-model="addForm.contact2Name" placeholder="姓名（选填）" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备用电话">
                <el-input v-model="addForm.contact2Phone" placeholder="手机号码（选填）" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 分类标签 -->
        <div class="form-section">
          <div class="form-section-title">分类标签</div>
          <el-form-item label="面向对象" prop="targetObject">
            <el-checkbox-group v-model="addForm.targetObject">
              <el-checkbox label="基层医疗卫生机构">基层医疗卫生机构</el-checkbox>
              <el-checkbox label="公立医院">公立医院</el-checkbox>
              <el-checkbox label="医技护人员">医技护人员</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="应用架构">
            <el-checkbox-group v-model="addForm.appArchitecture">
              <el-checkbox label="B/S">B/S</el-checkbox>
              <el-checkbox label="C/S架构">C/S架构</el-checkbox>
              <el-checkbox label="B/S+C/S">B/S+C/S</el-checkbox>
              <el-checkbox label="单机">单机</el-checkbox>
              <el-checkbox label="其他">其他</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="部署云服务商" prop="cloudProvider">
            <el-checkbox-group v-model="addForm.cloudProvider">
              <el-checkbox label="浪潮云">浪潮云</el-checkbox>
              <el-checkbox label="电信云">电信云</el-checkbox>
              <el-checkbox label="移动云">移动云</el-checkbox>
              <el-checkbox label="联通云">联通云</el-checkbox>
              <el-checkbox label="紫光云">紫光云</el-checkbox>
              <el-checkbox label="影像云">影像云</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>

        <!-- 上传附件 -->
        <div class="form-section">
          <div class="form-section-title">上传附件</div>
          <div class="upload-tip-text">请上传以下审核所需材料，支持 pdf、png、jpg 格式，单个文件不超过 10MB</div>
          <el-upload
            class="file-uploader"
            action="#"
            :auto-upload="false"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :file-list="addForm.fileList"
            :accept="'.pdf,.png,.jpg,.jpeg'"
            multiple
          >
            <el-button size="small" type="primary" plain icon="el-icon-upload2">选择文件</el-button>
          </el-upload>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddSubmit" icon="el-icon-s-promotion">提交审核</el-button>
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
        logo: '',
        description: '',
        systemUrl: '',
        vendor: '',
        cooperativeEnterprise: '',
        contact1Name: '',
        contact1Phone: '',
        contact2Name: '',
        contact2Phone: '',
        targetObject: [],
        appArchitecture: [],
        cloudProvider: [],
        fileList: []
      },
      addRules: {
        appName: [{ required: true, message: '请输入应用名称', trigger: 'blur' }],
        version: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
        vendor: [{ required: true, message: '请输入服务商名称', trigger: 'blur' }],
        contact1Name: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        contact1Phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        targetObject: [{ type: 'array', required: true, message: '请选择面向对象', trigger: 'change' }],
        cloudProvider: [{ type: 'array', required: true, message: '请选择部署云服务商', trigger: 'change' }]
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
            cloudProvider: '浪潮云',
            status: 20,
            createTime: '2024-01-01 10:00:00'
          },
          {
            id: 2,
            appName: '企业管理系统',
            version: 'v2.0.0',
            vendor: '阿里巴巴',
            category: '企业管理',
            cloudProvider: '电信云',
            status: 20,
            createTime: '2024-01-02 11:00:00'
          },
          {
            id: 3,
            appName: '数据分析平台',
            version: 'v3.0.0',
            vendor: '百度',
            category: '数据分析',
            cloudProvider: '移动云',
            status: 30,
            createTime: '2024-01-03 12:00:00'
          },
          {
            id: 4,
            appName: '电子病历管理系统',
            version: 'v1.2.0',
            vendor: '华为技术',
            category: '医疗信息化',
            cloudProvider: '联通云',
            status: 10,
            createTime: '2024-03-10 09:30:00'
          },
          {
            id: 5,
            appName: '远程会诊平台',
            version: 'v2.1.0',
            vendor: '中兴通讯',
            category: '远程医疗',
            cloudProvider: '紫光云',
            status: 15,
            createTime: '2024-03-08 14:20:00'
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
        logo: '',
        description: '',
        systemUrl: '',
        vendor: '',
        cooperativeEnterprise: '',
        contact1Name: '',
        contact1Phone: '',
        contact2Name: '',
        contact2Phone: '',
        targetObject: [],
        appArchitecture: [],
        cloudProvider: [],
        fileList: []
      };
      this.addDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.addForm && this.$refs.addForm.clearValidate();
      });
    },
    handleLogoUpload(file) {
      if (file.size > 1 * 1024 * 1024) {
        this.$modal.msgError('图片大小不能超过1MB');
        return;
      }
      this.addForm.logo = URL.createObjectURL(file.raw);
    },
    handleFileChange(file, fileList) {
      if (file.size > 10 * 1024 * 1024) {
        fileList.pop();
        this.$modal.msgError('单个文件大小不能超过10MB');
        return;
      }
      this.addForm.fileList = fileList;
    },
    handleFileRemove(file, fileList) {
      this.addForm.fileList = fileList;
    },
    handleAddSubmit() {
      this.$refs.addForm.validate(valid => {
        if (!valid) return;
        this.addDialogVisible = false;
        this.$confirm('应用已提交审核，请等待平台管理员审核结果。', '提交成功', {
          confirmButtonText: '我知道了',
          showCancelButton: false,
          type: 'success'
        });
      });
    },
    getStatusTagType(status) {
      switch (status) {
        case 10: return 'warning';
        case 15: return 'danger';
        case 20: return 'success';
        case 30: return 'info';
        default: return '';
      }
    },
    getStatusText(status) {
      switch (status) {
        case 10: return '待审核';
        case 15: return '审核未通过';
        case 20: return '上架';
        case 30: return '下架';
        default: return '';
      }
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
  justify-content: flex-start;
  align-items: center;
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

/* 新增弹窗样式 */
:deep(.el-dialog) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  padding: 16px 24px 14px;
  border-bottom: 1px solid #ebeef5;
  background: #fafbfc;
}

:deep(.el-dialog__title) {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

:deep(.el-dialog__body) {
  padding: 0;
  max-height: 62vh;
  overflow-y: auto;
}

:deep(.el-dialog__footer) {
  padding: 14px 24px;
  border-top: 1px solid #ebeef5;
  background: #fafbfc;
}

.dialog-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #eef6ff;
  border-bottom: 1px solid #d4e5ff;
  font-size: 13px;
  color: #3b5bdb;
}

.dialog-tip i {
  font-size: 16px;
  flex-shrink: 0;
}

.add-form {
  padding: 20px 24px;
}

.form-section {
  margin-bottom: 24px;
}

.form-section:last-child {
  margin-bottom: 0;
}

.form-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.upload-tip-text {
  font-size: 12px;
  color: #909399;
  margin-bottom: 12px;
  line-height: 1.5;
}

.file-uploader :deep(.el-upload-list) {
  margin-top: 0;
}

.file-uploader :deep(.el-upload-list__item) {
  margin-bottom: 8px;
  border: 1px solid #e3e7ef;
  border-radius: 6px;
  transition: border-color 0.2s;
}

.file-uploader :deep(.el-upload-list__item:hover) {
  border-color: #409EFF;
}

.file-uploader :deep(.el-upload-list__item-name) {
  font-size: 13px;
}

:deep(.el-form-item) {
  margin-bottom: 18px;
}

:deep(.el-form-item__label) {
  color: #606266;
  font-weight: 500;
  font-size: 13px;
}

.logo-uploader .logo-upload-area {
  height: 32px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  cursor: pointer;
  transition: border-color 0.3s;
  background: #fafbfc;
}

.logo-uploader .logo-upload-area:hover {
  border-color: #409EFF;
  background: #ecf5ff;
}

.logo-uploader .logo-upload-area i {
  font-size: 14px;
  color: #909399;
}

.logo-uploader .logo-upload-area span {
  font-size: 12px;
  color: #909399;
}

.logo-uploader .logo-preview {
  height: 32px;
  border-radius: 4px;
  border: 1px solid #e3e7ef;
  vertical-align: middle;
}
</style>
