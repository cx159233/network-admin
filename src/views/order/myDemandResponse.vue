<template>
  <div>
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="所有需求" name="all" />
      <el-tab-pane label="我的响应" name="my" />
    </el-tabs>

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

    <!-- 所有需求表格 -->
    <el-table
      v-if="activeTab === 'all'"
      v-loading="loading"
      :data="allDemandList"
      size="small"
      style="width: 100%"
      class-name="small-padding fixed-width"
    >
      <el-table-column prop="demandNo" label="需求编号" width="150" />
      <el-table-column prop="demandDescription" label="需求描述" min-width="220" show-overflow-tooltip />
      <el-table-column prop="orgName" label="申请机构" min-width="180">
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
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="getStatusColor(scope.row.status)" size="small">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="publishTime" label="发布时间" width="160" />
      <el-table-column label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status === '待响应'"
            type="text"
            size="small"
            @click="openResponseDialog(scope.row)"
          >响应</el-button>
          <el-button type="text" size="small" @click="viewDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 我的响应表格 -->
    <el-table
      v-if="activeTab === 'my'"
      v-loading="loading"
      :data="myResponseList"
      size="small"
      style="width: 100%"
      class-name="small-padding fixed-width"
    >
      <el-table-column prop="demandNo" label="需求编号" width="150" />
      <el-table-column prop="demandDescription" label="需求描述" min-width="180" show-overflow-tooltip />
      <el-table-column prop="orgName" label="申请机构" min-width="150">
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
      <el-table-column prop="status" label="需求状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="getStatusColor(scope.row.status)" size="small">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="estimatedPrice" label="预估报价" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.estimatedPrice">¥{{ scope.row.estimatedPrice }}</span>
          <span v-else class="tbl-empty">-</span>
        </template>
      </el-table-column>
      <el-table-column prop="responseTime" label="响应时间" width="160">
        <template slot-scope="scope">
          <span v-if="scope.row.responseTime">{{ scope.row.responseTime }}</span>
          <span v-else class="tbl-empty">-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="viewMyResponseDetail(scope.row)">详情</el-button>
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

    <!-- 响应需求弹窗 -->
    <el-dialog
      title="响应需求"
      width="620px"
      :visible.sync="responseDialogVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      top="5vh"
    >
      <div class="dialog-tip">
        <i class="el-icon-info"></i>
        <span>请根据需求内容提供您的解决方案和报价信息。</span>
      </div>
      <div class="demand-info-box">
        <div class="form-section-title">需求信息</div>
        <div class="detail-kv">
          <div class="kv-item"><label>需求编号</label><span>{{ currentDemand.demandNo }}</span></div>
          <div class="kv-item"><label>服务类型</label><span>{{ currentDemand.serviceType }}</span></div>
          <div class="kv-item"><label>申请机构</label><span>{{ currentDemand.orgName }}</span></div>
          <div class="kv-item"><label>申请人</label><span>{{ currentDemand.applicant }}</span></div>
          <div class="kv-item"><label>发布时间</label><span>{{ currentDemand.publishTime }}</span></div>
          <div class="kv-item full"><label>需求描述</label><span>{{ currentDemand.demandDescription }}</span></div>
        </div>
      </div>
      <el-form
        ref="responseFormRef"
        :model="responseForm"
        :rules="responseRules"
        label-width="80px"
        class="add-form"
      >
        <div class="form-section">
          <div class="form-section-title">响应信息</div>
          <el-form-item label="响应内容" prop="responseContent">
            <el-input
              v-model="responseForm.responseContent"
              type="textarea"
              :rows="5"
              placeholder="请描述您的解决方案、技术方案和交付计划"
            />
          </el-form-item>
          <el-form-item label="预估报价" prop="estimatedPrice">
            <div style="display: flex; align-items: center; gap: 8px;">
              <el-input
                v-model="responseForm.estimatedPrice"
                placeholder="请输入预估报价"
                style="flex: 1"
              />
              <span style="white-space: nowrap; color: #8c8c8c;">元</span>
            </div>
          </el-form-item>
          <el-form-item label="预计工期" prop="estimatedDuration">
            <el-input
              v-model="responseForm.estimatedDuration"
              placeholder="如：30个工作日"
            />
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="responseDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleResponseSubmit">提交响应</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index.vue';

export default {
  name: "MyDemandResponse",
  components: {
    Pagination
  },
  data() {
    return {
      loading: false,
      total: 0,
      activeTab: 'all',
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        demandNo: undefined,
        orgName: undefined,
        serviceType: undefined,
        status: undefined
      },
      responseDialogVisible: false,
      currentDemand: {},
      responseForm: {
        responseContent: '',
        estimatedPrice: '',
        estimatedDuration: ''
      },
      responseRules: {
        responseContent: [{ required: true, message: '请输入响应内容', trigger: 'blur' }],
        estimatedPrice: [{ required: true, message: '请输入预估报价', trigger: 'blur' }]
      },
      allDemandList: [
        {
          demandNo: '#DM-2024-0012',
          demandDescription: '需要一个统一的身份认证平台，支持OAuth2.0和SAML协议，要求支持至少10万用户的并发认证，并提供SSO单点登录功能',
          serviceType: '安全服务',
          orgName: '北京市海淀区数字经济发展局',
          applicant: '张三',
          status: '待响应',
          publishTime: '2024-03-18 10:30:00'
        },
        {
          demandNo: '#DM-2024-0008',
          demandDescription: '需要部署一套智慧医疗数据中台，支持多源异构数据整合与分析',
          serviceType: '数字应用服务',
          orgName: '北京市第一人民医院',
          applicant: '李四',
          status: '待响应',
          publishTime: '2024-03-16 11:00:00'
        },
        {
          demandNo: '#DM-2024-0007',
          demandDescription: '需要采购高性能GPU计算集群，用于AI模型训练',
          serviceType: '基础服务',
          orgName: '北京人工智能研究院',
          applicant: '王五',
          status: '已响应',
          publishTime: '2024-03-12 08:30:00',
          respondent: '北京云计算科技有限公司',
          responseContent: '我方可提供NVIDIA A100集群方案，包含8卡GPU服务器2台，配套分布式训练框架，支持PyTorch/TensorFlow。提供7×24小时运维支持。',
          estimatedPrice: '580,000',
          estimatedDuration: '45个工作日',
          responseTime: '2024-03-13 09:20:00'
        },
        {
          demandNo: '#DM-2024-0005',
          demandDescription: '需要一套完整的网络安全防护方案，包括防火墙、入侵检测、日志审计等',
          serviceType: '安全服务',
          orgName: '北京市海淀区数字经济发展局',
          applicant: '张三',
          status: '已响应',
          publishTime: '2024-03-08 15:20:00',
          respondent: '北京信息安全技术有限公司',
          responseContent: '推荐部署下一代防火墙+态势感知平台，包含入侵防御、Web应用防护、日志审计模块。支持等保三级合规要求。',
          estimatedPrice: '320,000',
          estimatedDuration: '30个工作日',
          responseTime: '2024-03-09 14:30:00'
        }
      ],
      myResponseList: [
        {
          demandNo: '#DM-2024-0007',
          demandDescription: '需要采购高性能GPU计算集群，用于AI模型训练',
          serviceType: '基础服务',
          orgName: '北京人工智能研究院',
          applicant: '王五',
          status: '已响应',
          publishTime: '2024-03-12 08:30:00',
          responseContent: '我方可提供NVIDIA A100集群方案，包含8卡GPU服务器2台，配套分布式训练框架，支持PyTorch/TensorFlow。提供7×24小时运维支持。',
          estimatedPrice: '580,000',
          estimatedDuration: '45个工作日',
          responseTime: '2024-03-13 09:20:00'
        },
        {
          demandNo: '#DM-2024-0005',
          demandDescription: '需要一套完整的网络安全防护方案，包括防火墙、入侵检测、日志审计等',
          serviceType: '安全服务',
          orgName: '北京市海淀区数字经济发展局',
          applicant: '张三',
          status: '已响应',
          publishTime: '2024-03-08 15:20:00',
          responseContent: '推荐部署下一代防火墙+态势感知平台，包含入侵防御、Web应用防护、日志审计模块。支持等保三级合规要求。',
          estimatedPrice: '320,000',
          estimatedDuration: '30个工作日',
          responseTime: '2024-03-09 14:30:00'
        },
        {
          demandNo: '#DM-2024-0003',
          demandDescription: '需要构建统一数据治理平台，实现数据质量管理、元数据管理、数据血缘分析',
          serviceType: '数字应用服务',
          orgName: '北京市卫健委',
          applicant: '赵六',
          status: '已完成',
          publishTime: '2024-03-01 10:00:00',
          responseContent: '提供一站式数据治理解决方案，涵盖数据标准管理、质量监控、血缘追踪。支持对接主流数据库与大数据平台。',
          estimatedPrice: '450,000',
          estimatedDuration: '60个工作日',
          responseTime: '2024-03-02 16:00:00'
        }
      ]
    };
  },
  computed: {
    demandList() {
      return this.activeTab === 'all' ? this.allDemandList : this.myResponseList;
    }
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
    responseDialogVisible(val) {
      if (val) { this.$root.$emit('set-prd-anchor', 'prd-3.1.3.2.2'); }
    }
  },
  methods: {
    handleTabClick() {
      this.queryParams.pageNum = 1;
      this.loadDemandList();
    },
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
      const list = this.activeTab === 'all' ? this.allDemandList : this.myResponseList;
      setTimeout(() => {
        this.total = list.length;
        this.loading = false;
      }, 500);
    },
    openResponseDialog(row) {
      this.currentDemand = row;
      this.responseForm = {
        responseContent: '',
        estimatedPrice: '',
        estimatedDuration: ''
      };
      this.responseDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.responseFormRef && this.$refs.responseFormRef.clearValidate();
      });
    },
    handleResponseSubmit() {
      this.$refs.responseFormRef.validate(valid => {
        if (!valid) return;
        this.$modal.msgSuccess('响应提交成功');
        this.responseDialogVisible = false;
        this.loadDemandList();
      });
    },
    viewDetail(row) {
      this.$router.push({ path: '/workorder/myDemand/allDetail', query: { id: row.demandNo } });
    },
    viewMyResponseDetail(row) {
      this.$router.push({ path: '/workorder/myDemand/responseDetail', query: { id: row.demandNo } });
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

:deep(.el-tabs__header) {
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
