<template>
  <div class="detail-container">
    <div class="detail-header-wrap">
      <el-button size="small" @click="goBack" class="back-btn">
        <i class="el-icon-arrow-left"></i> 返回列表
      </el-button>
    </div>

    <div class="detail-content-wrap">
      <div class="detail-left">
        <!-- 应用基本信息 -->
        <el-card shadow="hover" class="mb-4">
          <div slot="header" class="clearfix">
            <span>应用基本信息</span>
            <span class="sb pending" style="float: right">待审核</span>
          </div>

          <div class="detail-section">
            <div class="detail-section-title">应用信息</div>
            <div class="detail-kv">
              <div class="kv-item"><label>应用名称</label><span>{{ appInfo.appName }}</span></div>
              <div class="kv-item"><label>系统地址</label><span>{{ appInfo.systemUrl }}</span></div>
              <div class="kv-item"><label>应用LOGO</label><span><img v-if="appInfo.logo" :src="appInfo.logo" class="logo-thumb" /><template v-else>未上传</template></span></div>
              <div class="kv-item"><label>提交时间</label><span>{{ appInfo.submitTime }}</span></div>
              <div class="kv-item full"><label>应用描述</label><span>{{ appInfo.description }}</span></div>
            </div>
          </div>

          <div class="detail-section">
            <div class="detail-section-title">服务商信息</div>
            <div class="detail-kv">
              <div class="kv-item"><label>服务商名称</label><span>{{ appInfo.serviceProvider }}</span></div>
              <div class="kv-item"><label>合作伙伴</label><span>{{ appInfo.cooperativeEnterprise }}</span></div>
              <div class="kv-item"><label>联系人1</label><span>{{ appInfo.contact1Name }}</span></div>
              <div class="kv-item"><label>联系电话1</label><span>{{ appInfo.contact1Phone }}</span></div>
              <div class="kv-item"><label>联系人2</label><span>{{ appInfo.contact2Name || '--' }}</span></div>
              <div class="kv-item"><label>联系电话2</label><span>{{ appInfo.contact2Phone || '--' }}</span></div>
            </div>
          </div>

          <div class="detail-section">
            <div class="detail-section-title">分类标签</div>
            <div class="detail-kv">
              <div class="kv-item"><label>面向对象</label><span>{{ appInfo.targetObjectStr }}</span></div>
              <div class="kv-item"><label>应用架构</label><span>{{ appInfo.appArchitecture }}</span></div>
              <div class="kv-item"><label>部署云服务商</label><span>{{ appInfo.cloudProviderStr }}</span></div>
              <div class="kv-item"><label>应用覆盖范围</label><span>{{ appInfo.appScope }}</span></div>
            </div>
          </div>

          <!-- 附件材料 - 暂时注释
          <div class="detail-section">
            <div class="detail-section-title">附件材料</div>
            <div class="detail-kv">
              <div class="kv-item full">
                <a v-for="(m, i) in appInfo.materials" :key="i" class="file-link" href="javascript:void(0)" @click="downloadMaterial(m)">{{ m.name }}</a>
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
  name: "DigitalAppAuditDetail",
  data() {
    return {
      appInfo: {
        id: 1,
        appName: '智能办公系统',
        serviceProvider: '腾讯科技',
        cooperativeEnterprise: '北京协同科技有限公司',
        systemUrl: 'https://oa.tencent.com',
        logo: '',
        contact1Name: '张经理',
        contact1Phone: '13800138000',
        contact2Name: '李主管',
        contact2Phone: '13900139000',
        submitTime: '2024-01-01 10:00',
        description: '智能办公系统是一款集协同办公、文档管理、审批流程等功能于一体的企业级办公软件，旨在提高企业内部沟通效率和管理水平。',
        targetObjectStr: '基层医疗卫生机构、公立医院',
        appArchitecture: 'B/S',
        cloudProviderStr: '浪潮云、移动云',
        appScope: '医院信息系统（HIS）、基本公共卫生服务',
        materials: [
          { name: '应用截图.png', size: '2.4 MB' },
          { name: '应用说明文档.pdf', size: '1.8 MB' },
          { name: '安全评估报告.pdf', size: '890 KB' },
          { name: '厂商资质证明.pdf', size: '1.1 MB' }
        ]
      },
      auditRecords: [
        { id: 1, submitTime: '2024-01-01 10:00', status: 'approved', auditor: '平台管理员', auditTime: '2024-01-02 14:30', opinion: '审核通过，应用符合上架标准。' },
        { id: 2, submitTime: '2024-02-10 09:00', status: 'rejected', auditor: '平台管理员', auditTime: '2024-02-11 16:00', opinion: '安全评估报告不完整，请补充后重新提交。' },
        { id: 3, submitTime: '2024-02-15 11:00', status: 'approved', auditor: '平台管理员', auditTime: '2024-02-16 10:30', opinion: '材料已补齐，审核通过。' },
        { id: 4, submitTime: '2024-03-01 14:00', status: 'pending', auditor: '', auditTime: '', opinion: '' }
      ],
      auditForm: { opinion: '' }
    };
  },
  created() {
    const appId = this.$route.query.id;
    if (appId) {
      this.loadAppDetail(appId);
    }
  },
  methods: {
    loadAppDetail(appId) {},
    goBack() {
      this.$router.push('/portal/auditCenter/digitalAppAudit');
    },
    approve() {
      if (!this.auditForm.opinion.trim()) {
        this.$message.error('请填写审核意见');
        return;
      }
      this.$confirm('确定要通过该应用的审核吗？', '确认通过', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'success'
      }).then(() => {
        this.$message.success('审核通过，应用已激活');
        this.goBack();
      }).catch(() => {});
    },
    reject() {
      if (!this.auditForm.opinion.trim()) {
        this.$message.error('请填写驳回原因');
        return;
      }
      this.$confirm('确定要拒绝该应用的审核吗？', '确认拒绝', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'error'
      }).then(() => {
        this.$message.success('审核已拒绝');
        this.goBack();
      }).catch(() => {});
    },
    sendNotice() {
      this.$message.success('补充材料通知已发送');
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
  overflow: hidden;
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

.card-header {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #303133;
  font-size: 14px;
}

.logo-thumb {
  height: 22px;
  border-radius: 3px;
  vertical-align: middle;
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
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
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
  min-width: 0;
}

.kv-item .mono {
  font-family: 'DM Mono', monospace;
  font-size: 13px;
}

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

.btn-ghost {
  background: transparent;
  color: #5c6480;
  border: 1px solid #c8cdd9;
}

.btn-ghost:hover {
  background: #f7f8fa;
  color: #1c2033;
}

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
.sb.approved { background: #ebfbee; color: #2f9e44; }
.sb.approved::before { background: #2f9e44; }

/* 时间线 */
.tl { display: flex; flex-direction: column; padding: 8px 0; }
.tl-row { display: flex; gap: 12px; }
.tl-spine { display: flex; flex-direction: column; align-items: center; width: 14px; flex-shrink: 0; }
.tl-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
.tl-dot.done { background: #2f9e44; }
.tl-dot.on { background: #3b5bdb; box-shadow: 0 0 0 3px #c5d0fa; }
.tl-dot.wait { background: #c8cdd9; }
.tl-dot.red { background: #c92a2a; }
.tl-vl { flex: 1; width: 1px; background: #e3e7ef; margin: 3px 0; min-height: 16px; }
.tl-row:last-child .tl-vl { display: none; }
.tl-body { padding-bottom: 14px; flex: 1; }
.tl-title { font-size: 13px; font-weight: 500; margin-bottom: 2px; }
.tl-title.done { color: #5c6480; }
.tl-title.on { color: #1c2033; }
.tl-title.wait { color: #9aa0b8; }
.tl-title.red { color: #c92a2a; }
.tl-time { font-size: 11px; color: #9aa0b8; font-family: 'DM Mono', monospace; }

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
