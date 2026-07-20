<template>
  <div>
    <el-page-header
      @back="goBack"
      :title="form.title || '工单表单'"
    />
    
    <el-card shadow="always" class="mt-20">
      <template slot="header">
        <div class="card-header">
          <span>{{ form.title || '工单表单' }}</span>
          <span class="status-tag" v-if="form.status">{{ form.status }}</span>
        </div>
      </template>
      
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" :disabled="isViewMode">
        <el-form-item label="申请人" prop="applicant">
          <el-input v-model="form.applicant" placeholder="请输入申请人" />
        </el-form-item>
        
        <el-form-item label="申请部门" prop="department">
          <el-input v-model="form.department" placeholder="请输入申请部门" />
        </el-form-item>
        
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入联系方式" />
        </el-form-item>
        
        <el-form-item label="工单类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择工单类型">
            <el-option label="业务申请" value="business" />
            <el-option label="技术支持" value="technical" />
            <el-option label="问题反馈" value="feedback" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="form.priority" placeholder="请选择优先级">
            <el-option label="低" value="low" />
            <el-option label="中" value="medium" />
            <el-option label="高" value="high" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="请求内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="4"
            placeholder="请详细描述您的请求内容"
          />
        </el-form-item>
        
        <el-form-item label="附件">
          <el-upload
            class="upload-demo"
            action="#"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false"
            :disabled="isViewMode"
          >
            <el-button v-if="!isViewMode" size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        
        <el-form-item v-if="!isViewMode">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="saveAsTemplate">存为模板</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'WorkorderForm',
  data() {
    return {
      form: {
        title: '',
        applicant: '',
        department: '',
        contact: '',
        type: '',
        priority: '',
        content: '',
        status: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入工单标题', trigger: 'blur' }
        ],
        applicant: [
          { required: true, message: '请输入申请人', trigger: 'blur' }
        ],
        department: [
          { required: true, message: '请输入申请部门', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择工单类型', trigger: 'change' }
        ],
        priority: [
          { required: true, message: '请选择优先级', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入请求内容', trigger: 'blur' }
        ]
      },
      fileList: [],
      isViewMode: false
    };
  },
  created() {
    // 从路由参数中获取服务信息或工单信息
    const { serviceId, serviceName, workorderId, from } = this.$route.query;
    if (serviceName) {
      this.form.title = serviceName;
    }
    if (workorderId) {
      // 模拟加载工单详情
      this.loadWorkorderDetail(workorderId);
      // 如果是从"我发起的"页面进入，则设置为查看模式
      if (from === 'myInitiated') {
        this.isViewMode = true;
      }
    }
  },
  methods: {
    goBack() {
      const { from } = this.$route.query;
      if (from === 'myInitiated') {
        this.$router.replace('/workorder/myInitiated');
      } else {
        this.$router.replace('/workorder/serviceDesk');
      }
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 模拟提交
          this.$modal.msgSuccess('工单提交成功');
          this.$router.replace('/workorder/serviceDesk');
        }
      });
    },
    saveAsTemplate() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 模拟保存模板
          this.$modal.msgSuccess('模板保存成功');
        }
      });
    },
    loadWorkorderDetail(workorderId) {
      // 模拟加载工单详情
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
        };
      }, 500);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    }
  }
};
</script>

<style scoped>
.mt-20 {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-tag {
  padding: 4px 12px;
  background-color: #ecf5ff;
  color: #409EFF;
  border-radius: 12px;
  font-size: 12px;
}
</style>