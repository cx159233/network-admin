<template>
  <div class="app-container detail-new-v1">
    <!-- 顶部标题区域 -->
      <div class="detail-header">
        <el-button size="small" @click="goBack" class="back-btn">
          <i class="el-icon-arrow-left"></i> 返回列表
        </el-button>
        <div class="header-title">
          <el-tag size="small" :type="getTagType" effect="dark" class="status-tag">
            {{ ticketStatus === '已完成' ? 'FINISHED' : 'CLOSED' }}
          </el-tag>
          <span class="title-text">{{ ticket.code }} {{ ticket.title }}</span>
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
                <span class="info-label">完成时间：</span>
                <span class="info-value">{{ ticket.finishTime }}</span>
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
                <span class="info-label">处理人：</span>
                <span class="info-value">{{ ticket.handler }}</span>
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

          <!-- 处理结果 -->
          <el-card shadow="never" class="result-card">
            <template #header>
              <div class="card-header">
                <span>处理结果</span>
              </div>
            </template>
            <div class="result-content">
              <div class="result-item">
                <span class="result-label">处理结果：</span>
                <el-tag :type="processResult.type" size="small">{{ processResult.text }}</el-tag>
              </div>
              <div class="result-item">
                <span class="result-label">处理意见：</span>
                <span class="result-value">{{ processResult.comment }}</span>
              </div>
              <div class="result-item" v-if="ticket.status === '已完成'">
                <span class="result-label">满意度评价：</span>
                <div class="satisfaction-rating">
                  <el-rate v-model="satisfaction.score" disabled show-score text-color="#ff9900" />
                  <span class="satisfaction-comment">{{ satisfaction.comment }}</span>
                </div>
              </div>
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
                :class="{ 'completed': step.status === 'completed' }"
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
      </div>    </div>
  </div>
</template>

<script>
export default {
  name: 'MyApprovedDetail',
  data() {
    return {
      ticket: {
        id: 1,
        code: 'WO20260401001',
        title: '系统权限申请',
        type: '业务申请',
        createTime: '2026-04-01 14:20:00',
        finishTime: '2026-04-01 16:30:00',
        applicant: '王五',
        department: '技术部',
        contact: '13800138001',
        status: '已完成',
        handler: '当前用户',
        description: '因工作需要，申请开通系统管理员权限，用于日常系统维护工作。'
      },
      processResult: {
        type: 'success',
        text: '通过',
        comment: '已核实申请人身份，符合权限申请条件，审批通过。'
      },
      satisfaction: {
        score: 5,
        comment: '处理速度很快，服务态度很好！'
      },
      processSteps: [
        {
          title: '提交申请',
          time: '2026-04-01 14:20:00',
          handler: '王五',
          status: 'completed'
        },
        {
          title: '部门审批',
          time: '2026-04-01 15:00:00',
          handler: '李四',
          status: 'completed'
        },
        {
          title: '权限配置',
          time: '2026-04-01 16:00:00',
          handler: '当前用户',
          status: 'completed'
        },
        {
          title: '服务交付',
          time: '2026-04-01 16:30:00',
          handler: '当前用户',
          status: 'completed'
        }
      ],
      processRecords: [
        {
          time: '2026-04-01 14:20:00',
          content: '王五提交了系统权限申请工单',
          handler: '王五'
        },
        {
          time: '2026-04-01 15:00:00',
          content: '李四审批通过了工单',
          handler: '李四'
        },
        {
          time: '2026-04-01 16:00:00',
          content: '当前用户完成了权限配置',
          handler: '当前用户'
        },
        {
          time: '2026-04-01 16:30:00',
          content: '工单已完成，申请人已确认',
          handler: '当前用户'
        }
      ]
    };
  },
  computed: {
    getTagType() {
      return this.ticket.status === '已完成' ? 'info' : 'danger';
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
      this.$router.go(-1);
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

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
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



.result-card {
  margin-top: 24px;
}

.result-content {
  padding: 8px 0;
}

.result-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.result-item:last-child {
  margin-bottom: 0;
}

.result-label {
  color: #606266;
  font-size: 13px;
  width: 100px;
  flex-shrink: 0;
  font-weight: 500;
}

.result-value {
  color: #303133;
  font-size: 13px;
  flex: 1;
  line-height: 1.5;
}

.satisfaction-rating {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.satisfaction-comment {
  font-size: 13px;
  color: #606266;
  font-style: italic;
}

.detail-right {
  width: 340px;
  flex-shrink: 0;
}

.detail-right .mb-4 {
  margin-bottom: 16px !important;
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
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.info-item:hover {
  background-color: #ecf5ff;
}

.info-label {
  color: #606266;
  font-size: 13px;
  width: 90px;
  flex-shrink: 0;
  font-weight: 500;
}

.info-value {
  color: #303133;
  font-size: 13px;
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
  display: flex;
  gap: 24px;
  padding: 0 24px 24px;
  flex: 1;
  overflow-y: auto;
}

  .detail-right {
  width: 340px;
  flex-shrink: 0;
}

.detail-right .mb-4 {
  margin-bottom: 16px !important;
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

  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-title {
    margin-left: 0;
    flex-wrap: wrap;
  }

  .title-text {
    font-size: 16px;
  }
}
</style>
