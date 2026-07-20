<template>
  <div class="detail-container">
    <div class="detail-header-wrap">
      <el-button size="small" @click="goBack" class="back-btn">
        <i class="el-icon-arrow-left"></i> 返回列表
      </el-button>
    </div>

    <div class="detail-content-wrap">
      <div class="detail-left">
        <!-- 组件基本信息 -->
        <el-card shadow="hover" class="mb-4">
          <div slot="header" class="clearfix">
            <span>组件基本信息</span>
            <span class="sb pending" style="float: right">待审核</span>
          </div>

          <div class="detail-section">
            <div class="detail-section-title">组件信息</div>
            <div class="detail-kv">
              <div class="kv-item"><label>组件名称</label><span>{{ compInfo.name }}</span></div>
              <div class="kv-item"><label>组件ID</label><span>{{ compInfo.componentId }}</span></div>
              <div class="kv-item"><label>服务商名称</label><span>{{ compInfo.serviceProviderName }}</span></div>
              <div class="kv-item"><label>云服务商</label><span>{{ compInfo.deployServiceProviderView }}</span></div>
              <div class="kv-item"><label>开放范围</label><span>{{ compInfo.coverView }}</span></div>
              <div class="kv-item"><label>提交时间</label><span>{{ compInfo.submitTime }}</span></div>
              <div class="kv-item full"><label>组件描述</label><span>{{ compInfo.description }}</span></div>
            </div>
          </div>

          <div class="detail-section">
            <div class="detail-section-title">联系信息</div>
            <div class="detail-kv">
              <div class="kv-item"><label>联系人1</label><span>{{ compInfo.contact1Name }}</span></div>
              <div class="kv-item"><label>联系电话1</label><span>{{ compInfo.contact1Phone }}</span></div>
              <div class="kv-item"><label>联系人2</label><span>{{ compInfo.contact2Name || '--' }}</span></div>
              <div class="kv-item"><label>联系电话2</label><span>{{ compInfo.contact2Phone || '--' }}</span></div>
            </div>
          </div>

          <!-- 附件材料 - 暂时注释
          <div class="detail-section">
            <div class="detail-section-title">附件材料</div>
            <div class="detail-kv">
              <div class="kv-item full">
                <a v-for="(m, i) in compInfo.materials" :key="i" class="file-link" href="javascript:void(0)" @click="downloadMaterial(m)">{{ m.name }}</a>
              </div>
            </div>
          </div>
          -->
        </el-card>

        <!-- 审核记录 -->
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>审核记录</span>
          </div>
          <el-table :data="auditRecords" size="small" class="audit-table" :header-cell-style="{background:'#f5f7fa'}">
            <el-table-column prop="submitTime" label="提交时间" width="150" />
            <el-table-column prop="status" label="审核状态" width="100">
              <template slot-scope="scope">
                <el-tag :type="getAuditStatusType(scope.row.status)" size="mini" effect="dark">{{ getAuditStatusText(scope.row.status) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="auditor" label="审核人" width="110" />
            <el-table-column prop="auditTime" label="审核时间" width="150" />
            <el-table-column prop="opinion" label="审核意见" min-width="200" show-overflow-tooltip />
          </el-table>
        </el-card>
      </div>

      <div class="detail-right">
        <!-- 审核操作 -->
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>审核操作</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px">
            <textarea
              v-model="auditForm.opinion"
              class="rf-textarea"
              style="min-height: 72px; margin-bottom: 0"
              placeholder="填写审核意见（通过/驳回时必填）..."
            ></textarea>
            <button class="btn btn-success" style="width: 100%; justify-content: center" @click="approve">
              ✓ 审核通过
            </button>
            <button class="btn btn-danger" style="width: 100%; justify-content: center" @click="reject">
              ✕ 驳回申请
            </button>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ComponentAuditDetail",
  data() {
    return {
      compInfo: {
        id: 1,
        name: '电子签章服务组件',
        componentId: 'COMP-2024-001',
        serviceProviderName: '华为技术',
        deployServiceProviderView: '电信云',
        coverView: '不限',
        submitTime: '2024-03-10 09:30',
        description: '电子签章服务组件提供数字签名、电子印章、合同签署等能力，支持PDF、OFD等格式，符合国家电子签名法要求。',
        contact1Name: '张经理',
        contact1Phone: '13800138000',
        contact2Name: '李助理',
        contact2Phone: '13900139000',
        materials: [
          { name: '组件功能说明.pdf', size: '1.8 MB' },
          { name: '安全评估报告.pdf', size: '2.1 MB' },
          { name: '厂商资质证明.pdf', size: '960 KB' }
        ],
        processSteps: [
          { title: '提交申请', time: '2024-03-10 09:30', handler: '华为技术', statusClass: 'done' },
          { title: '人工审核', time: '进行中', handler: '等待审核', statusClass: 'on' },
          { title: '审核结果通知', time: '等待审核结果', handler: '', statusClass: 'wait' }
        ]
      },
      auditForm: { opinion: '' },
      auditRecords: [
        { id: 1, submitTime: '2024-03-10 09:30', status: 'approved', auditor: '平台管理员', auditTime: '2024-03-11 10:00', opinion: '组件功能符合标准，审核通过。' },
        { id: 2, submitTime: '2024-03-12 14:00', status: 'pending', auditor: '', auditTime: '', opinion: '' }
      ]
    };
  },
  created() {
    const compId = this.$route.query.id;
    if (compId) {
      this.loadCompDetail(compId);
    }
  },
  methods: {
    loadCompDetail(compId) {},
    goBack() {
      this.$router.push('/portal/auditCenter/componentAudit');
    },
    approve() {
      if (!this.auditForm.opinion.trim()) {
        this.$message.error('请填写审核意见');
        return;
      }
      this.$confirm('确定要通过该组件的审核吗？', '确认通过', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'success'
      }).then(() => {
        this.$message.success('审核通过，组件已激活');
        this.goBack();
      }).catch(() => {});
    },
    reject() {
      if (!this.auditForm.opinion.trim()) {
        this.$message.error('请填写驳回原因');
        return;
      }
      this.$confirm('确定要拒绝该组件的审核吗？', '确认拒绝', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'error'
      }).then(() => {
        this.$message.success('审核已拒绝');
        this.goBack();
      }).catch(() => {});
    },
    downloadMaterial(material) {
      this.$message.success('下载附件：' + material.name);
    },
    getAuditStatusType(status) {
      const map = { approved: 'success', rejected: 'danger', pending: 'warning' };
      return map[status] || 'info';
    },
    getAuditStatusText(status) {
      const map = { approved: '已通过', rejected: '已驳回', pending: '待审核' };
      return map[status] || '未知';
    }
  }
};
</script>

<style scoped>
.detail-container {
  display: flex;
  flex-direction: column;
  padding: 0 !important;
  margin: -20px;
  min-height: calc(100vh - 50px);
  background-color: #f2f4f8;
}

.detail-header-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  margin: 0;
  border-radius: 0;
  height: auto;
  flex-shrink: 0;
}

.back-btn {
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: 500;
}

.back-btn:hover {
  background-color: #ecf5ff;
  border-color: #409eff;
  color: #409eff;
}

.detail-content-wrap {
  display: flex;
  gap: 14px;
  padding: 20px 20px 24px;
  flex: 1;
  overflow-y: auto;
  background-color: #f2f4f8;
}

.detail-left {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-right {
  width: 272px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.detail-left .mb-4 {
  margin-bottom: 0 !important;
}

.card-header {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #303133;
  font-size: 14px;
}

/* 分组 */
.detail-section {
  margin-bottom: 20px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 14px;
}

/* 键值对网格 */
.detail-kv {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 40px;
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
  width: 100px;
  flex-shrink: 0;
  font-weight: 400;
  white-space: nowrap;
}

.kv-item span {
  color: #262626;
  word-break: break-all;
  font-weight: 400;
}

.kv-item .mono {
  font-family: 'DM Mono', monospace;
  font-size: 13px;
}

/* 附件链接 */
.file-link {
  display: inline-block;
  margin: 2px 16px 2px 0;
  font-size: 13px;
  color: #3b5bdb;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}

.file-link:hover {
  color: #2f3ea5;
}

/* 按钮 */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.12s;
  font-family: 'DM Sans', sans-serif;
  white-space: nowrap;
}

.btn-success {
  background: #ebfbee;
  color: #2f9e44;
  border: 1px solid #b2f2bb;
}

.btn-success:hover { background: #b2f2bb; }

.btn-danger {
  background: #fff5f5;
  color: #c92a2a;
  border: 1px solid #ffc9c9;
}

.btn-danger:hover { background: #ffc9c9; }

/* 状态标签 */
.sb {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.sb::before {
  content: '';
  width: 5px;
  height: 5px;
  border-radius: 50%;
  flex-shrink: 0;
}

.sb.pending { background: #fff9db; color: #e67700; }
.sb.pending::before { background: #e67700; }

/* 审核记录表格 */
.audit-table {
  min-height: auto !important;
}

.audit-table :deep(.el-table) {
  --el-table-row-height: 32px !important;
}

.audit-table :deep(.el-table__row) {
  height: 32px !important;
  line-height: 32px !important;
}

.audit-table :deep(.el-table__header-wrapper) {
  padding: 0 !important;
  margin: 0 !important;
}

.audit-table :deep(.el-table__body-wrapper) {
  padding: 0 !important;
  margin: 0 !important;
}

.audit-table :deep(.el-table td),
.audit-table :deep(.el-table th) {
  padding: 6px 12px !important;
}

/* 文本框 */
.rf-textarea {
  width: 100%;
  background: #fff;
  border: 1px solid #e3e7ef;
  border-radius: 8px;
  padding: 10px 12px;
  color: #1c2033;
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  outline: none;
  resize: vertical;
  min-height: 80px;
  line-height: 1.6;
  transition: border-color 0.12s;
}

.rf-textarea:focus { border-color: #3b5bdb; }

/* 审核记录表格 */
.audit-table {
  min-height: auto !important;
}

.audit-table :deep(.el-table) {
  --el-table-row-height: 32px !important;
}

.audit-table :deep(.el-table__row) {
  height: 32px !important;
  line-height: 32px !important;
}

.audit-table :deep(.el-table__header-wrapper) {
  padding: 0 !important;
  margin: 0 !important;
}

.audit-table :deep(.el-table__body-wrapper) {
  padding: 0 !important;
  margin: 0 !important;
}

.audit-table :deep(.el-table td),
.audit-table :deep(.el-table th) {
  padding: 6px 12px !important;
}

::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #c8cdd9; border-radius: 3px; }
</style>
