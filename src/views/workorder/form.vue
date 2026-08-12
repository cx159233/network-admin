<template>
  <div class="workorder-form-page">
    <PageHeader
      :title="isViewMode ? '工单详情' : (form.title ? '编辑工单' : '创建工单')"
      :description="isViewMode ? '查看工单信息' : '填写工单信息并提交，或保存为模板供后续使用'"
    >
      <template #actions>
        <a-button @click="goBack">
          <template #icon><ArrowLeftOutlined /></template>
          返回
        </a-button>
      </template>
    </PageHeader>

    <CloudCard class="workorder-form-page__card">
      <div class="card-head">
        <span class="card-head__title">{{ form.title || '工单表单' }}</span>
        <StatusDot v-if="form.status" :type="getStatusKey(form.status)" :text="form.status" />
      </div>

      <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        layout="vertical"
        :disabled="isViewMode"
        class="workorder-form"
      >
        <div class="form-section">
          <div class="form-section__title">申请人信息</div>
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item label="申请人" name="applicant">
                <a-input v-model:value="form.applicant" placeholder="请输入申请人" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="申请部门" name="department">
                <a-input v-model:value="form.department" placeholder="请输入申请部门" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="联系方式" name="contact">
                <a-input v-model:value="form.contact" placeholder="请输入联系方式" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>

        <div class="form-section">
          <div class="form-section__title">工单信息</div>
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item label="工单类型" name="type">
                <a-select v-model:value="form.type" placeholder="请选择工单类型">
                  <a-select-option value="business">业务申请</a-select-option>
                  <a-select-option value="technical">技术支持</a-select-option>
                  <a-select-option value="feedback">问题反馈</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="优先级" name="priority">
                <a-select v-model:value="form.priority" placeholder="请选择优先级">
                  <a-select-option value="low">低</a-select-option>
                  <a-select-option value="medium">中</a-select-option>
                  <a-select-option value="high">高</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item label="请求内容" name="content">
            <a-textarea v-model:value="form.content" :rows="4" placeholder="请详细描述您的请求内容" />
          </a-form-item>
          <a-form-item label="附件">
            <a-upload
              :file-list="fileList"
              :before-upload="handleBeforeUpload"
              @remove="handleRemove"
              :disabled="isViewMode"
            >
              <a-button v-if="!isViewMode">
                <template #icon><UploadOutlined /></template>
                点击上传
              </a-button>
              <template #itemRender></template>
            </a-upload>
            <div class="upload-tip">只能上传 jpg/png 文件，且不超过 500KB</div>
          </a-form-item>
        </div>

        <div v-if="!isViewMode" class="form-footer">
          <a-button type="primary" @click="submitForm">提交</a-button>
          <a-button @click="saveAsTemplate">存为模板</a-button>
          <a-button @click="resetForm">重置</a-button>
        </div>
      </a-form>
    </CloudCard>
  </div>
</template>

<script>
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import StatusDot from '@/components/cloud/StatusDot.vue'

export default {
  name: 'WorkorderForm',
  components: {
    PageHeader, CloudCard, StatusDot,
    ArrowLeftOutlined, UploadOutlined
  },
  data() {
    return {
      form: {
        title: '',
        applicant: '',
        department: '',
        contact: '',
        type: undefined,
        priority: undefined,
        content: '',
        status: ''
      },
      rules: {
        applicant: [{ required: true, message: '请输入申请人', trigger: 'blur' }],
        department: [{ required: true, message: '请输入申请部门', trigger: 'blur' }],
        contact: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
        type: [{ required: true, message: '请选择工单类型', trigger: 'change' }],
        priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
        content: [{ required: true, message: '请输入请求内容', trigger: 'blur' }]
      },
      fileList: [],
      isViewMode: false
    }
  },
  created() {
    const { serviceName, workorderId, from } = this.$route.query
    if (serviceName) {
      this.form.title = serviceName
    }
    if (workorderId) {
      this.loadWorkorderDetail(workorderId)
      if (from === 'myInitiated') {
        this.isViewMode = true
      }
    }
  },
  methods: {
    goBack() {
      const { from } = this.$route.query
      if (from === 'myInitiated') {
        this.$router.replace('/workorder/myInitiated')
      } else {
        this.$router.replace('/workorder/serviceDesk')
      }
    },
    submitForm() {
      this.$refs.formRef.validate().then(() => {
        message.success('工单提交成功')
        this.$router.replace('/workorder/serviceDesk')
      }).catch(() => {})
    },
    saveAsTemplate() {
      this.$refs.formRef.validate().then(() => {
        message.success('模板保存成功')
      }).catch(() => {})
    },
    resetForm() {
      this.form = {
        title: this.form.title,
        applicant: '',
        department: '',
        contact: '',
        type: undefined,
        priority: undefined,
        content: '',
        status: ''
      }
      this.fileList = []
    },
    loadWorkorderDetail() {
      setTimeout(() => {
        this.form = {
          title: '网络服务申请',
          applicant: '张三',
          department: '技术部',
          contact: '13800138000',
          type: 'business',
          priority: 'medium',
          content: '申请开通办公网络权限',
          status: '待处理'
        }
      }, 300)
    },
    handleBeforeUpload(file) {
      this.fileList = [...this.fileList, file]
      return false
    },
    handleRemove(file) {
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    getStatusKey(status) {
      const map = {
        '待处理': 'processing',
        '处理中': 'processing',
        '已完成': 'done',
        '已关闭': 'cancelled'
      }
      return map[status] || 'default'
    }
  }
}
</script>

<style scoped>
.workorder-form-page {
  padding: 4px 0;
}

.workorder-form-page__card {
  padding: 16px 20px;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid #F2F3F5;
}

.card-head__title {
  font-size: 15px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}

.workorder-form .form-section {
  margin-bottom: 22px;
}

.workorder-form .form-section__title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid #F2F3F5;
}

.upload-tip {
  font-size: 11px;
  color: #86909C;
  margin-top: 4px;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 14px;
  border-top: 1px solid #F2F3F5;
}
</style>
