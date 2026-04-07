<template>
  <div class="app-container detail-new-v1">
    <!-- 顶部标题区域 -->
    <div class="detail-header">
        <el-button size="small" @click="goBack">
          <i class="el-icon-arrow-left"></i> 返回列表
        </el-button>
        <div class="ml-4 flex items-center">
          <el-tag size="small" :type="getTagType" effect="dark" class="mr-2">
            {{ ticketStatus === '已完成' ? 'FINISHED' : 'RUNNING' }}
          </el-tag>
          <span class="font-bold text-lg">{{ ticket.code }} {{ ticket.title }}</span>
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
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
                <span>工单描述</span>
              </div>
            </template>
            <div class="ticket-description">
              {{ ticket.description }}
            </div>
          </el-card>
        </div>
        
        <!-- 右侧处理状态 -->
        <div class="detail-right">
          <el-card shadow="never">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WorkorderDetail',
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
        status: '处理中',
        priority: '普通',
        description: '因业务需求，需要申请网络服务，用于公司内部系统访问。请相关部门尽快处理。'
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
          time: '2026-04-02 11:00:00',
          handler: '李四',
          status: 'completed'
        },
        {
          title: '网络服务配置',
          time: '2026-04-02 14:00:00',
          handler: '王五',
          status: 'processing'
        },
        {
          title: '服务交付',
          time: '',
          handler: '',
          status: 'pending'
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
      this.$router.push('/workorder/myInitiated');
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
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  margin: 0;
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
  font-weight: bold;
  color: #1890ff;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 40px;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-label {
  color: #8c8c8c;
  font-size: 13px;
  width: 100px;
  flex-shrink: 0;
}

.info-value {
  color: #262626;
  font-size: 13px;
  flex: 1;
}

.ticket-description {
  font-size: 13px;
  line-height: 1.5;
  color: #262626;
  white-space: pre-wrap;
}

.process-steps {
  margin-top: 10px;
}

.process-step {
  display: flex;
  margin-bottom: 16px;
  position: relative;
}

.process-step::before {
  content: '';
  position: absolute;
  left: 9px;
  top: 20px;
  bottom: -16px;
  width: 2px;
  background-color: #e8e8e8;
  z-index: 0;
}

.process-step:last-child::before {
  display: none;
}

.process-step.completed::before {
  background-color: #52c41a;
}

.step-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #e8e8e8;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-right: 12px;
  flex-shrink: 0;
  z-index: 1;
}

.process-step.completed .step-icon {
  background-color: #52c41a;
}

.step-content {
  flex: 1;
  z-index: 1;
}

.step-title {
  font-size: 13px;
  font-weight: 500;
  color: #262626;
  margin-bottom: 4px;
}

.step-time, .step-handler {
  font-size: 12px;
  color: #8c8c8c;
  margin-bottom: 2px;
}

@media (max-width: 768px) {
  .detail-content {
    display: block;
  }

  .detail-right {
    width: 100%;
    margin-top: 20px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>