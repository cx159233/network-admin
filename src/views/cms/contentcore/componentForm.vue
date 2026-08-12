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
          <span class="text-[16px] font-semibold text-text-primary">{{ isEdit ? '编辑能力组件' : '新增能力组件' }}</span>
        </div>
        <a-button type="primary" @click="onSubmit">直接发布</a-button>
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
          <div class="grid grid-cols-2 gap-x-[16px]">
            <a-form-item label="能力组件名称" name="name" :rules="[{ required: true, message: '请输入能力组件名称' }]">
              <a-input v-model:value="form.name" placeholder="请输入能力组件名称" :maxlength="20" show-count />
            </a-form-item>
            <a-form-item></a-form-item>
          </div>
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
          <a-form-item label="组件描述" name="description" :rules="[{ required: true, message: '请输入组件描述' }]">
            <div class="relative">
              <a-textarea v-model:value="form.description" :rows="4" placeholder="请输入组件描述" :maxlength="1000" class="!pb-[28px]" />
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
            <a-input v-model:value="form.serviceProviderName" placeholder="请输入服务商名称" :maxlength="20" />
          </a-form-item>
          <a-form-item label="联系方式1">
            <div class="flex items-center gap-[12px]">
              <a-input v-model:value="form.contact1Name" placeholder="请输入联系人姓名" style="width: 200px" />
              <span class="text-text-tertiary text-[13px]">-</span>
              <a-input v-model:value="form.contact1Phone" placeholder="请输入联系人手机号" style="width: 200px" />
            </div>
          </a-form-item>
          <a-form-item label="联系方式2">
            <div class="flex items-center gap-[12px]">
              <a-input v-model:value="form.contact2Name" placeholder="请输入联系人姓名" style="width: 200px" />
              <span class="text-text-tertiary text-[13px]">-</span>
              <a-input v-model:value="form.contact2Phone" placeholder="请输入联系人手机号" style="width: 200px" />
            </div>
          </a-form-item>
        </section>

        <!-- 3. 分类标签 -->
        <section class="cloud-card p-[20px] mb-[14px] scroll-mt-[80px]">
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[4px] h-[16px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">分类标签</span>
            <span class="text-[11px] text-text-tertiary">组件分类与部署信息</span>
          </div>
          <a-form-item label="部署云服务商" name="deployServiceProvider" :rules="[{ required: true, message: '请选择部署云服务商', trigger: 'change', type: 'array', min: 1 }]">
            <a-checkbox-group v-model:value="form.deployServiceProvider">
              <a-checkbox v-for="opt in cloudProviderOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
          <a-form-item label="开放范围" name="cover" :rules="[{ required: true, message: '请选择开放范围', trigger: 'change', type: 'array', min: 1 }]">
            <a-checkbox-group v-model:value="form.cover">
              <a-checkbox v-for="opt in coverOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-checkbox>
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
import { getComponentList } from '@/api/contentcore/component';

export default {
  name: 'CMSComponentForm',
  components: {
    ArrowLeftOutlined,
    PictureOutlined,
    PlusOutlined,
    CloseOutlined,
  },
  data() {
    return {
      form: {
        componentId: '',
        name: '',
        logo: '',
        description: '',
        sortOrder: 0,
        serviceProviderName: '',
        contact1Name: '',
        contact1Phone: '',
        contact2Name: '',
        contact2Phone: '',
        deployServiceProvider: [],
        cover: [],
      },
      cloudProviderOptions: [
        { value: '10251', label: '影像云' },
        { value: '10252', label: '电信云' },
        { value: '10253', label: '移动云' },
        { value: '10254', label: '联通云' },
        { value: '10250', label: '浪潮云' },
      ],
      coverOptions: [
        { value: '10256', label: '不限' },
        { value: '10257', label: '市级' },
        { value: '10258', label: '区（县）域' },
      ],
      rules: {
        name: [{ required: true, message: '请输入能力组件名称', trigger: 'blur' }],
        description: [{ required: true, message: '请输入组件描述', trigger: 'blur' }],
        deployServiceProvider: [{ required: true, message: '请选择部署云服务商', trigger: 'change', type: 'array', min: 1 }],
        cover: [{ required: true, message: '请选择开放范围', trigger: 'change', type: 'array', min: 1 }],
      },
    };
  },
  computed: {
    isEdit() {
      return !!this.$route.query.id;
    },
  },
  created() {
    if (this.isEdit) {
      this.loadRecord();
    }
  },
  methods: {
    loadRecord() {
      const componentId = this.$route.query.id;
      if (!componentId) return;
      getComponentList({ pageNum: 1, pageSize: 100 }).then((response) => {
        const row = response.data.rows.find((r) => r.componentId === componentId);
        if (row) {
          this.form = {
            componentId: row.componentId,
            name: row.name || '',
            logo: row.logo || '',
            description: row.description || '',
            sortOrder: row.sortOrder || 0,
            serviceProviderName: row.serviceProviderName || '',
            contact1Name: row.contact1Name || '',
            contact1Phone: row.contact1Phone || '',
            contact2Name: row.contact2Name || '',
            contact2Phone: row.contact2Phone || '',
            deployServiceProvider: Array.isArray(row.deployServiceProvider) ? row.deployServiceProvider : (row.deployServiceProvider ? [row.deployServiceProvider] : []),
            cover: Array.isArray(row.cover) ? row.cover : (row.cover ? [row.cover] : []),
          };
        }
      });
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
        message.success(this.isEdit ? '修改成功' : '新增成功');
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
