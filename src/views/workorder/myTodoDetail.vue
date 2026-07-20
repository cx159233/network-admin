<template>
  <div class="app-container detail-new-v1">
    <!-- 顶部标题区域 -->
    <div class="detail-header">
      <div class="header-left">
        <el-button size="small" @click="goBack" class="back-btn">
          <i class="el-icon-arrow-left"></i> 返回列表
        </el-button>
      </div>
      <div class="header-title">
        <el-tag size="small" :type="getTagType" effect="dark" class="status-tag">
          {{ ticketStatus === '已完成' ? 'FINISHED' : 'RUNNING' }}
        </el-tag>
        <span class="title-text">{{ ticket.code }} {{ ticket.title }}</span>
      </div>
      <div class="header-right">
        <el-button type="primary" size="small" icon="el-icon-check" @click="handleProcess" class="process-btn">
          处理
        </el-button>
      </div>
    </div>

    <!-- 工单详情内容 -->
    <div class="detail-content">
        <!-- 左侧基本信息 -->
        <div class="detail-left">
          <el-card shadow="never" class="mb-4">
            <template #header>
              <div class="card-header">
                <span>基本信息</span>
              </div>
            </template>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">工单类型：</span>
                <span class="info-value">{{ ticket.type }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">申请时间：</span>
                <span class="info-value">{{ ticket.createTime }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">申请人：</span>
                <span class="info-value">{{ ticket.applicant }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">所属部门：</span>
                <span class="info-value">{{ ticket.department }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">联系方式：</span>
                <span class="info-value">{{ ticket.contact }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">工单状态：</span>
                <span class="info-value">{{ ticket.status }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">紧急程度：</span>
                <span class="info-value">{{ ticket.priority }}</span>
              </div>
            </div>
          </el-card>

          <!-- 工单描述 -->
          <el-card shadow="never" class="description-card">
            <template #header>
              <div class="card-header">
                <span>工单描述</span>
              </div>
            </template>
            <div class="ticket-description">
              {{ ticket.description }}
            </div>
          </el-card>

          <!-- 处理操作区域 -->
          <el-card shadow="never" class="process-action-card">
            <template #header>
              <div class="card-header">
                <span>处理操作</span>
              </div>
            </template>
            <div class="process-form">
              <el-form :model="processForm" label-position="top">
                <el-form-item label="处理结果">
                  <el-radio-group v-model="processForm.result">
                    <el-radio label="pass">通过</el-radio>
                    <el-radio label="reject">驳回</el-radio>
                    <el-radio label="transfer">转交</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="处理意见">
                  <el-input
                    v-model="processForm.comment"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入处理意见"
                    maxlength="500"
                    show-word-limit
                  />
                </el-form-item>
                <el-form-item v-if="processForm.result === 'transfer'" label="转交人">
                  <el-select v-model="processForm.transferTo" placeholder="请选择转交人" style="width: 100%">
                    <el-option label="王五" value="wangwu" />
                    <el-option label="赵六" value="zhaoliu" />
                    <el-option label="孙七" value="sunqi" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-check" @click="submitProcess">提交处理</el-button>
                  <el-button @click="resetProcess">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </div>

        <!-- 右侧处理状态 -->
        <div class="detail-right">
          <el-card shadow="never" class="mb-4">
            <template #header>
              <div class="card-header">
                <span>处理状态</span>
              </div>
            </template>
            <div class="process-steps">
              <div
                v-for="(step, index) in processSteps"
                :key="index"
                class="process-step"
                :class="{ 'completed': step.status === 'completed', 'processing': step.status === 'processing' }"
              >
                <div class="step-icon">{{ index + 1 }}</div>
                <div class="step-content">
                  <div class="step-title">{{ step.title }}</div>
                  <div class="step-time">{{ step.time }}</div>
                  <div class="step-handler">{{ step.handler }}</div>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 处理记录 -->
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
                <span>处理记录</span>
              </div>
            </template>
            <div class="process-records">
              <div
                v-for="(record, index) in processRecords"
                :key="index"
                class="process-record"
              >
                <div class="record-time">{{ record.time }}</div>
                <div class="record-content">{{ record.content }}</div>
                <div class="record-handler">{{ record.handler }}</div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyTodoDetail',
  data() {
    return {
      ticket: {
        id: 1,
        code: 'WO20260402001',
        title: '网络服务申请',
        type: '业务申请',
        createTime: '2026-04-02 10:00:00',
        applicant: '张三',
        department: '技术部',
        contact: '13800138000',
        status: '待处理',
        priority: '普通',
        description: '因业务需求，需要申请网络服务，用于公司内部系统访问。请相关部门尽快处理。'
      },
      processForm: {
        result: 'pass',
        comment: '',
        transferTo: ''
      },
      processSteps: [
        {
          title: '提交申请',
          time: '2026-04-02 10:00:00',
          handler: '张三',
          status: 'completed'
        },
        {
          title: '部门审批',
          time: '',
          handler: '当前用户',
          status: 'processing'
        },
        {
          title: '网络服务配置',
          time: '',
          handler: '',
          status: 'pending'
        },
        {
          title: '服务交付',
          time: '',
          handler: '',
          status: 'pending'
        }
      ],
      processRecords: [
        {
          time: '2026-04-02 10:00:00',
          content: '张三提交了网络服务申请工单',
          handler: '张三'
        }
      ]
    };
  },
  computed: {
    getTagType() {
      return this.ticket.status === '已完成' ? 'info' : 'success';
    },
    ticketStatus() {
      return this.ticket.status;
    }
  },
  created() {
    // 从路由参数中获取工单ID
    const ticketId = this.$route.query.workorderId;
    if (ticketId) {
      this.loadTicketDetail(ticketId);
    }
  },
  methods: {
    loadTicketDetail(ticketId) {
      // 模拟API请求
      setTimeout(() => {
        // 这里可以根据ticketId获取真实的工单详情
        // 现在使用模拟数据
      }, 500);
    },
    goBack() {
      this.$router.push('/workorder/myBills/myTodo');
    },
    handleProcess() {
      // 点击处理按钮，滚动到处理操作区域
      const processCard = document.querySelector('.process-action-card');
      if (processCard) {
        processCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    },
    submitProcess() {
      // 提交处理
      if (!this.processForm.comment.trim()) {
        this.$modal.msgWarning('请输入处理意见');
        return;
      }
      if (this.processForm.result === 'transfer' && !this.processForm.transferTo) {
        this.$modal.msgWarning('请选择转交人');
        return;
      }

      const resultText = {
        'pass': '通过',
        'reject': '驳回',
        'transfer': '转交'
      }[this.processForm.result];

      this.$modal.confirm({
        title: '确认提交',
        content: `确定要${resultText}该工单吗？`,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        // 模拟提交处理
        setTimeout(() => {
          this.$modal.msgSuccess('处理成功');
          // 添加处理记录
          this.processRecords.unshift({
            time: new Date().toLocaleString(),
            content: `当前用户${resultText}了工单，处理意见：${this.processForm.comment}`,
            handler: '当前用户'
          });
          // 更新步骤状态
          this.processSteps[1].status = 'completed';
          this.processSteps[1].time = new Date().toLocaleString();
          this.processSteps[2].status = 'processing';
          // 重置表单
          this.resetProcess();
        }, 500);
      }).catch(() => {});
    },
    resetProcess() {
      this.processForm = {
        result: 'pass',
        comment: '',
        transferTo: ''
      };
    }
  }
};
</script>

<style scoped>
.detail-new-v1 {
  display: flex;
  flex-direction: column;
  padding: 0 !important;
  margin: -20px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 12px 24px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  margin: 0;
  border-radius: 0;
  height: auto;
  flex-shrink: 0;
}

.header-left {
  flex: 0 0 auto;
}

.header-right {
  margin-left: auto;
}

.header-left {
  flex: 0 0 auto;
}

.header-title {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  margin: 0;
  gap: 8px;
}

.header-right {
  margin-left: auto;
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

.process-btn {
  border-radius: 4px;
  padding: 8px 20px;
  font-weight: 500;
}


.status-tag {
  margin-right: 12px;
  font-weight: 500;
  padding: 0 10px;
  height: 24px;
  line-height: 22px;
}

.title-text {
  font-weight: 600;
  font-size: 18px;
  color: #303133;
}

.detail-content {
  display: flex;
  gap: 24px;
  padding: 20px 24px 24px;
  flex: 1;
  overflow-y: auto;
  background-color: #f2f4f8;
}

.detail-left {
  flex: 1;
  min-width: 0;
}

.detail-left .mb-4 {
  margin-bottom: 16px !important;
}

.description-card {
  margin-bottom: 16px;
}

.process-action-card {
  margin-bottom: 16px;
}

.process-form {
  padding: 8px 0;
}

.process-form .el-form-item {
  margin-bottom: 20px;
}

.process-form .el-radio-group {
  display: flex;
  gap: 20px;
}

.process-form .el-radio {
  margin-right: 0;
}

.detail-right {
  width: 340px;
  flex-shrink: 0;
}

.detail-right .mb-4 {
  margin-bottom: 16px !important;
}

.card-header {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #409eff;
  font-size: 15px;
  padding: 4px 0;
}

.card-header::before {
  content: '';
  width: 4px;
  height: 16px;
  background-color: #409eff;
  margin-right: 8px;
  border-radius: 2px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 40px;
  padding: 8px 0;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-radius: 0;
  transition: none;
}

.info-item:hover {
  background-color: transparent;
}

.info-label {
  color: #8c8c8c;
  font-size: 14px;
  width: 90px;
  flex-shrink: 0;
  font-weight: 400;
}

.info-value {
  color: #262626;
  font-size: 14px;
  flex: 1;
  font-weight: 400;
}

.ticket-description {
  font-size: 14px;
  line-height: 1.8;
  color: #303133;
  white-space: pre-wrap;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  min-height: 80px;
}

.process-steps {
  margin-top: 8px;
  padding: 0 8px;
}

.process-step {
  display: flex;
  margin-bottom: 20px;
  position: relative;
}

.process-step::before {
  content: '';
  position: absolute;
  left: 11px;
  top: 24px;
  bottom: -20px;
  width: 2px;
  background-color: #e4e7ed;
  z-index: 0;
}

.process-step:last-child::before {
  display: none;
}

.process-step.completed::before {
  background-color: #67c23a;
}

.process-step.processing .step-icon {
  background-color: #409eff;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(64, 158, 255, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(64, 158, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(64, 158, 255, 0);
  }
}

.step-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #e4e7ed;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-right: 14px;
  flex-shrink: 0;
  z-index: 1;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.process-step.completed .step-icon {
  background-color: #67c23a;
}

.step-content {
  flex: 1;
  z-index: 1;
  padding-top: 2px;
}

.step-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}

.step-time {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.step-handler {
  font-size: 12px;
  color: #606266;
  font-weight: 500;
}

/* 处理记录样式 */
.process-records {
  margin-top: 8px;
  padding: 0 8px;
}

.process-record {
  margin-bottom: 16px;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-radius: 6px;
  border-left: 3px solid #409eff;
  transition: transform 0.2s, box-shadow 0.2s;
}

.process-record:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.process-record:last-child {
  margin-bottom: 0;
}

.record-time {
  font-size: 12px;
  color: #909399;
  margin-bottom: 6px;
}

.record-content {
  font-size: 13px;
  color: #303133;
  margin-bottom: 8px;
  line-height: 1.5;
}

.record-handler {
  font-size: 12px;
  color: #606266;
  text-align: right;
  font-weight: 500;
}

@media (max-width: 992px) {
  .detail-content {
    flex-direction: column;
  }

  .detail-right {
    width: 100%;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .detail-header {
    flex-direction: column;
    gap: 12px;
  }

  .header-title {
    margin: 0;
    justify-content: flex-start;
  }

  .header-right {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
}

@media (max-width: 768px) {
  .detail-header {
    align-items: flex-start;
  }

  .header-title {
    flex-wrap: wrap;
  }

  .title-text {
    font-size: 16px;
  }
}
</style>
