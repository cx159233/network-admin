<template>
  <div class="min-h-full bg-bg">
    <!-- 顶部操作栏 -->
    <div class="sticky top-0 z-30 bg-surface border-b border-border px-[24px] py-[12px]">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-[12px]">
          <a class="text-text-secondary hover:text-primary text-[13px] flex items-center gap-[4px]" @click="onBack">
            <ArrowLeftOutlined />
            返回
          </a>
          <a-divider type="vertical" />
          <span class="text-[16px] font-semibold text-text-primary">{{ isEdit ? '编辑基础服务' : '新增基础服务' }}</span>
        </div>
        <template v-if="isShelfMode">
          <a-space>
            <a-button @click="onSaveDraft">保存草稿</a-button>
            <a-button type="primary" @click="onSubmit">提交审核</a-button>
          </a-space>
        </template>
        <a-button v-else type="primary" @click="onSubmit">直接发布</a-button>
      </div>
    </div>

    <!-- 主表单 -->
    <main class="max-w-[920px] mx-auto p-[20px]">
      <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">

        <!-- 1. 基本信息 -->
        <section class="cloud-card p-[20px] mb-[14px] scroll-mt-[80px]">
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[4px] h-[16px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">基本信息</span>
            <span class="text-[11px] text-text-tertiary">用于平台纳管与应用展示</span>
          </div>
          <a-form-item label="基础服务名称" name="serviceName" :rules="[{ required: true, message: '请输入基础服务名称' }]">
            <a-input v-model:value="form.serviceName" placeholder="请输入基础服务名称" :maxlength="40" show-count />
          </a-form-item>
          <a-form-item label="LOGO">
            <div class="flex items-center gap-[14px]">
              <div class="relative w-[80px] h-[80px] flex-shrink-0">
                <a-upload
                  :max-count="1"
                  :show-upload-list="false"
                  accept=".png,.jpg,.jpeg,.svg"
                  :before-upload="handleLogoUpload"
                >
                  <div class="group relative w-[80px] h-[80px] rounded-[8px] border border-border-soft bg-bg grid place-items-center overflow-hidden cursor-pointer">
                    <img v-if="form.logo" :src="form.logo" alt="logo" class="w-full h-full object-cover" />
                    <PictureOutlined v-else class="text-[24px] text-text-tertiary" />
                    <div class="absolute inset-0 bg-black/45 grid place-items-center opacity-0 group-hover:opacity-100 transition">
                      <PlusOutlined v-if="!form.logo" class="text-[20px] text-white" />
                      <template v-else>
                        <div class="text-[11px] text-white/90 text-center leading-[16px]">点击替换</div>
                      </template>
                    </div>
                  </div>
                </a-upload>
                <a
                  v-if="form.logo"
                  class="absolute -top-[6px] -right-[6px] w-[20px] h-[20px] rounded-full bg-danger text-white grid place-items-center text-[11px] shadow-sm hover:bg-danger/90 z-10"
                  title="删除 LOGO"
                  @click.stop="onRemoveLogo"
                >
                  <CloseOutlined />
                </a>
              </div>
              <div class="text-[11px] text-text-tertiary">支持 PNG / JPG / JPEG / SVG，建议 640×640，≤ 1MB</div>
            </div>
          </a-form-item>
          <a-form-item label="服务描述" name="description" :rules="[{ required: true, message: '请输入服务描述' }]">
            <div class="relative">
              <a-textarea v-model:value="form.description" :rows="4" placeholder="请输入服务描述" :maxlength="500" class="!pb-[28px]" />
              <div class="absolute right-[8px] bottom-[6px] text-[12px] text-text-tertiary pointer-events-none">
                {{ form.description.length }}/500
              </div>
            </div>
          </a-form-item>
          <a-form-item label="显示顺序">
            <a-input-number v-model:value="form.sortOrder" :min="0" style="width: 200px" />
          </a-form-item>
        </section>

        <!-- 2. 联系信息 -->
        <section class="cloud-card p-[20px] mb-[14px] scroll-mt-[80px]">
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[4px] h-[16px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">联系信息</span>
            <span class="text-[11px] text-text-tertiary">服务商联系方式</span>
          </div>
          <a-form-item label="服务商名称">
            <a-input v-model:value="form.serviceProvider" placeholder="请输入服务商名称" />
          </a-form-item>
          <a-form-item label="联系方式1">
            <div class="flex items-center gap-[12px]">
              <a-input v-model:value="form.contactName1" placeholder="请输入联系人姓名" style="width: 200px" />
              <span class="text-text-tertiary text-[13px]">-</span>
              <a-input v-model:value="form.contactPhone1" placeholder="请输入联系人手机号" style="width: 200px" />
            </div>
          </a-form-item>
          <a-form-item label="联系方式2">
            <div class="flex items-center gap-[12px]">
              <a-input v-model:value="form.contactName2" placeholder="请输入联系人姓名" style="width: 200px" />
              <span class="text-text-tertiary text-[13px]">-</span>
              <a-input v-model:value="form.contactPhone2" placeholder="请输入联系人手机号" style="width: 200px" />
            </div>
          </a-form-item>
        </section>

        <!-- 3. 分类标签 -->
        <section class="cloud-card p-[20px] mb-[14px] scroll-mt-[80px]">
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[4px] h-[16px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">分类标签</span>
            <span class="text-[11px] text-text-tertiary">服务分类与部署信息</span>
          </div>
          <a-form-item label="服务子类" name="serviceType" :rules="[{ required: true, message: '请选择服务子类', trigger: 'change', type: 'array', min: 1 }]">
            <a-checkbox-group v-model:value="form.serviceType">
              <a-checkbox v-for="opt in serviceTypeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
          <a-form-item label="部署云服务商" name="cloudProvider" :rules="[{ required: true, message: '请选择部署云服务商', trigger: 'change', type: 'array', min: 1 }]">
            <a-checkbox-group v-model:value="form.cloudProvider">
              <a-checkbox v-for="opt in cloudProviderOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
          <a-form-item label="区域" name="region" :rules="[{ required: true, message: '请选择区域', trigger: 'change', type: 'array', min: 1 }]">
            <a-checkbox-group v-model:value="form.region">
              <a-checkbox v-for="opt in regionOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
        </section>

      </a-form>
    </main>
  </div>
</template>

<script>
import { ArrowLeftOutlined, PictureOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import emitter from '@/utils/emitter';

export default {
  name: 'CMSServiceCatalogForm',
  components: {
    ArrowLeftOutlined,
    PictureOutlined,
    PlusOutlined,
    CloseOutlined,
  },
  data() {
    return {
      form: {
        serviceId: '',
        serviceName: '',
        logo: '',
        description: '',
        sortOrder: 0,
        serviceProvider: '',
        contactName1: '',
        contactPhone1: '',
        contactName2: '',
        contactPhone2: '',
        serviceType: [],
        cloudProvider: [],
        region: [],
      },
      serviceTypeOptions: [
        { value: 'compute', label: '计算服务' },
        { value: 'storage', label: '存储服务' },
        { value: 'network', label: '网络服务' },
        { value: 'security', label: '安全服务' },
        { value: 'bigdata', label: '大数据服务' },
        { value: 'database', label: '数据库服务' },
        { value: 'backup', label: '备份容灾服务' },
        { value: 'software', label: '软件与应用服务' },
        { value: 'hosting', label: '机房托管服务' },
      ],
      cloudProviderOptions: [
        { value: '10251', label: '影像云' },
        { value: '10252', label: '电信云' },
        { value: '10253', label: '移动云' },
        { value: '10254', label: '联通云' },
        { value: '10250', label: '浪潮云' },
      ],
      regionOptions: [
        { value: 'east', label: '华东' },
        { value: 'north', label: '华北' },
        { value: 'south', label: '华南' },
        { value: 'southwest', label: '西南' },
      ],
      rules: {
        serviceName: [{ required: true, message: '请输入基础服务名称', trigger: 'blur' }],
        description: [{ required: true, message: '请输入服务描述', trigger: 'blur' }],
        serviceType: [{ required: true, message: '请选择服务子类', trigger: 'change', type: 'array', min: 1 }],
        cloudProvider: [{ required: true, message: '请选择部署云服务商', trigger: 'change', type: 'array', min: 1 }],
        region: [{ required: true, message: '请选择区域', trigger: 'change', type: 'array', min: 1 }],
      },
    };
  },
  computed: {
    isEdit() {
      return !!this.$route.query.id;
    },
    isShelfMode() {
      return this.$route.query.mode === 'shelf';
    },
  },
  created() {
    emitter.emit('set-prd-anchor', this.isShelfMode
      ? (this.isEdit ? 'prd-3.1.1.1.3.4' : 'prd-3.1.1.1.2.4')
      : (this.isEdit ? 'prd-3.2.1.4.3' : 'prd-3.2.1.4.2'));
    if (this.isEdit) {
      this.loadRecord();
    }
  },
  methods: {
    loadRecord() {
      const serviceId = this.$route.query.id;
      if (!serviceId) return;
      // 从列表页缓存或 localStorage 获取记录数据
      const cached = this.$cache?.local?.get('serviceCatalogData');
      const rows = cached || [];
      const row = rows.find((r) => r.serviceId === serviceId);
      if (row) {
        this.form = {
          serviceId: row.serviceId,
          serviceName: row.serviceName || '',
          logo: row.logo || '',
          description: row.description || '',
          sortOrder: row.sortOrder != null ? row.sortOrder : 0,
          serviceProvider: row.serviceProvider || '',
          contactName1: row.contactName1 || '',
          contactPhone1: row.contactPhone1 || '',
          contactName2: row.contactName2 || '',
          contactPhone2: row.contactPhone2 || '',
          serviceType: Array.isArray(row.serviceType) ? row.serviceType : (row.serviceType ? [row.serviceType] : []),
          cloudProvider: Array.isArray(row.cloudProvider) ? row.cloudProvider : (row.cloudProvider ? [row.cloudProvider] : []),
          region: Array.isArray(row.region) ? row.region : (row.region ? [row.region] : []),
        };
      }
    },
    handleLogoUpload(file) {
      if (file.size > 1 * 1024 * 1024) {
        message.warning('LOGO 文件不能超过 1MB');
        return false;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        this.form.logo = e.target?.result;
      };
      reader.readAsDataURL(file);
      return false;
    },
    onRemoveLogo() {
      this.form.logo = '';
    },
    onBack() {
      this.$router.back();
    },
    onSubmit() {
      this.$refs.formRef.validate().then(() => {
        message.success(this.isShelfMode ? '提交成功' : (this.isEdit ? '修改成功' : '新增成功'));
        this.$router.back();
      }).catch(() => {});
    },
    onSaveDraft() {
      this.$refs.formRef.validate().then(() => {
        message.success('草稿已保存');
        this.$router.back();
      }).catch(() => {});
    },
  },
};
</script>

<style scoped>
:deep(.ant-checkbox-wrapper) {
  margin-bottom: 8px;
}
</style>
