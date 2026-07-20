<template>
  <div>
    <!-- 操作按钮 + 筛选条件 -->
    <el-row :gutter="24" class="mb12">
      <el-col :span="12">
        <el-row :gutter="10">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              plain
              @click="openAddDialog"
            >新增需求</el-button>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          class="el-form-search"
          style="text-align: right"
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
          <el-form-item prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="所有状态"
              clearable
              style="width: 150px"
            >
              <el-option label="待响应" value="pending" />
              <el-option label="已响应" value="responded" />
              <el-option label="已完成" value="completed" />
              <el-option label="已关闭" value="closed" />
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
      <el-table-column prop="demandDescription" label="需求描述" min-width="220" show-overflow-tooltip />
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
      <el-table-column label="操作" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="viewDetail(scope.row)">详情</el-button>
          <el-button
            v-if="scope.row.status === '待响应'"
            type="text"
            size="small"
            @click="handleClose(scope.row)"
          >关闭</el-button>
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

    <!-- 新增需求弹窗 -->
    <el-dialog
      title="新增需求"
      width="620px"
      :visible.sync="addDialogVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      top="5vh"
    >
      <div class="dialog-tip">
        <i class="el-icon-info"></i>
        <span>请详细描述您的业务需求，服务供应方将根据需求内容进行响应。</span>
      </div>
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addRules"
        label-width="100px"
        class="add-form"
      >
        <div class="form-section">
          <div class="form-section-title">需求信息</div>
          <el-form-item label="申请机构" prop="orgName">
            <el-input v-model="addForm.orgName" placeholder="请输入申请机构名称" disabled />
          </el-form-item>
          <el-form-item label="服务类型" prop="serviceType">
            <el-select v-model="addForm.serviceType" placeholder="请选择服务类型" style="width: 100%">
              <el-option label="数字应用服务" value="数字应用服务" />
              <el-option label="能力组件服务" value="能力组件服务" />
              <el-option label="安全服务" value="安全服务" />
              <el-option label="基础资源服务" value="基础资源服务" />
            </el-select>
          </el-form-item>
          <el-form-item label="需求描述" prop="demandDescription">
            <el-input
              v-model="addForm.demandDescription"
              type="textarea"
              :rows="5"
              placeholder="请详细描述您的需求，包括功能需求、性能要求、预算范围等"
            />
          </el-form-item>
          <el-form-item label="期望时间" prop="expectedDate">
            <el-date-picker
              v-model="addForm.expectedDate"
              type="date"
              placeholder="请选择期望交付时间"
              style="width: 100%"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddSubmit">发 布</el-button>
      </div>
    </el-dialog>

    <!-- 关闭需求确认弹窗 -->
    <el-dialog
      title="关闭需求"
      width="420px"
      :visible.sync="closeDialogVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      top="15vh"
    >
      <p style="padding: 6px 20px; font-size: 14px; color: #333;">确认关闭需求吗？关闭后不可恢复。</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCloseConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index.vue';

export default {
  name: "MyDemandInitiate",
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
      addDialogVisible: false,
      closeDialogVisible: false,
      closeTarget: {},
      addForm: {
        orgName: '',
        serviceType: '',
        demandDescription: '',
        expectedDate: ''
      },
      addRules: {
        orgName: [{ required: true, message: '请输入申请机构名称', trigger: 'blur' }],
        serviceType: [{ required: true, message: '请选择服务类型', trigger: 'change' }],
        demandDescription: [{ required: true, message: '请输入需求描述', trigger: 'blur' }]
      },
      demandList: [
        {
          demandNo: '#DM-2024-0012',
          demandDescription: '需要一个统一的身份认证平台，支持OAuth2.0和SAML协议，要求支持至少10万用户的并发认证，并提供SSO单点登录功能',
          serviceType: '安全服务',
          orgName: '北京市海淀区数字经济发展局',
          applicant: '张三',
          status: '已响应',
          publishTime: '2024-03-18 10:30:00',
          respondent: '北京信息安全技术有限公司',
          responseContent: '可提供统一身份认证平台方案，支持OAuth2.0/SAML协议，含SSO单点登录，支持10万+用户并发认证。',
          estimatedPrice: '280,000',
          estimatedDuration: '40个工作日',
          responseTime: '2024-03-19 14:20:00'
        },
        {
          demandNo: '#DM-2024-0011',
          demandDescription: '需要部署一套大数据分析平台，支持PB级数据处理，包含数据采集、清洗、分析、可视化全流程',
          serviceType: '数字应用服务',
          orgName: '北京市海淀区数字经济发展局',
          applicant: '张三',
          status: '待响应',
          publishTime: '2024-03-15 14:20:00'
        },
        {
          demandNo: '#DM-2024-0010',
          demandDescription: '需要采购弹性云服务器资源，配置不低于32核64G内存，带宽不低于100Mbps',
          serviceType: '基础资源服务',
          orgName: '北京市海淀区数字经济发展局',
          applicant: '张三',
          status: '待响应',
          publishTime: '2024-03-10 09:00:00'
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
    },
    addDialogVisible(val) {
      if (val) { this.$root.$emit('set-prd-anchor', 'prd-3.1.3.1.2'); }
    },
    closeDialogVisible(val) {
      if (val) { this.$root.$emit('set-prd-anchor', 'prd-3.1.3.1.3'); }
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
    openAddDialog() {
      this.addForm = {
        orgName: '北京市海淀区数字经济发展局',
        serviceType: '',
        demandDescription: '',
        expectedDate: ''
      };
      this.addDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.addFormRef && this.$refs.addFormRef.clearValidate();
      });
    },
    handleAddSubmit() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return;
        this.$modal.msgSuccess('需求发布成功');
        this.addDialogVisible = false;
        this.loadDemandList();
      });
    },
    viewDetail(row) {
      this.$router.push({ path: '/workorder/myDemand/initiateDetail', query: { id: row.demandNo } });
    },
    handleClose(row) {
      this.closeTarget = row;
      this.closeDialogVisible = true;
    },
    handleCloseConfirm() {
      this.$modal.msgSuccess('需求已关闭');
      this.closeDialogVisible = false;
      this.loadDemandList();
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

.dialog-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 10px 20px;
  padding: 10px 16px;
  background: #eef6ff;
  border: 1px solid #d4e5ff;
  border-radius: 2px;
  font-size: 13px;
  color: #3b5bdb;
}

.dialog-tip i {
  font-size: 16px;
  color: #3b5bdb;
  flex-shrink: 0;
}

.add-form {
  padding: 12px 24px 20px;
}

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

/* 详情弹窗键值对网格 */
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
