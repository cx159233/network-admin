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
          <span class="text-[16px] font-semibold text-text-primary">{{ isEdit ? '编辑数字应用' : '新增数字应用' }}</span>
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
          <div class="grid grid-cols-2 gap-x-[16px]">
            <a-form-item label="数字应用名称" name="title" :rules="[{ required: true, message: '请输入数字应用名称' }]">
              <a-input v-model:value="form.title" placeholder="请输入数字应用名称" :maxlength="20" show-count />
            </a-form-item>
            <a-form-item label="系统地址">
              <a-input v-model:value="form.systemUrl" placeholder="请输入系统地址" />
            </a-form-item>
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
          <a-form-item label="应用描述" name="description" :rules="[{ required: true, message: '请输入应用描述' }]">
            <div class="relative">
              <a-textarea v-model:value="form.description" :rows="4" placeholder="请输入应用描述" :maxlength="1000" class="!pb-[28px]" />
              <div class="absolute right-[8px] bottom-[6px] text-[12px] text-text-tertiary pointer-events-none">
                {{ form.description.length }}/500
              </div>
            </div>
          </a-form-item>
          <a-form-item label="付费方式参考">
            <div class="relative">
              <a-textarea v-model:value="form.paymentMethodRef" :rows="2" placeholder="请输入付费方式参考" :maxlength="200" class="!pb-[28px]" />
              <div class="absolute right-[8px] bottom-[6px] text-[12px] text-text-tertiary pointer-events-none">
                {{ form.paymentMethodRef.length }}/200
              </div>
            </div>
          </a-form-item>
        </section>

        <!-- 2. 联系信息 -->
        <section class="cloud-card p-[20px] mb-[14px] scroll-mt-[80px]">
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[4px] h-[16px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">联系信息</span>
            <span class="text-[11px] text-text-tertiary">服务商与合作方联系方式</span>
          </div>
          <div class="grid grid-cols-2 gap-x-[16px]">
            <a-form-item label="服务商名称" name="serviceProvider" :rules="[{ required: true, message: '请输入服务商名称' }]">
              <a-input v-model:value="form.serviceProvider" placeholder="请输入服务商名称" :maxlength="20" />
            </a-form-item>
            <a-form-item label="合作伙伴名称">
              <a-input v-model:value="form.cooperativeEnterprise" placeholder="多个合作伙伴请通过；分隔" />
            </a-form-item>
          </div>
          <a-form-item label="联系方式1" name="contactName1" :rules="[{ required: true, message: '请输入联系人姓名' }]">
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
            <span class="text-[11px] text-text-tertiary">应用分类与部署信息</span>
          </div>
          <a-form-item label="服务对象" name="targetObject" :rules="[{ required: true, message: '请选择服务对象', trigger: 'change', type: 'array', min: 1 }]">
            <a-checkbox-group v-model:value="form.targetObject">
              <a-checkbox v-for="opt in flatTargetObject" :key="opt" :value="opt">{{ opt }}</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
          <a-form-item label="应用架构">
            <a-checkbox-group v-model:value="form.appArchitecture">
              <a-checkbox v-for="opt in flatArch" :key="opt" :value="opt">{{ opt }}</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
          <a-form-item label="部署云服务商" name="cloudProvider" :rules="[{ required: true, message: '请选择部署云服务商', trigger: 'change', type: 'array', min: 1 }]">
            <div>
              <a-checkbox-group v-model:value="form.cloudProvider">
                <a-checkbox v-for="opt in flatCloud" :key="opt" :value="opt">{{ opt }}</a-checkbox>
              </a-checkbox-group>
              <div v-if="form.targetObject.includes('基层医疗卫生机构')" class="mt-[12px] p-[12px] rounded-[8px] border border-border-soft bg-bg">
                <div class="text-[13px] font-semibold text-text-primary mb-[8px]">基层应用覆盖范围</div>
                <a-checkbox-group v-model:value="form.coverBase">
                  <a-checkbox v-for="item in coverBaseOptions" :key="item" :value="item">{{ item }}</a-checkbox>
                </a-checkbox-group>
              </div>
              <div v-if="form.targetObject.includes('公立医院')" class="mt-[12px] p-[12px] rounded-[8px] border border-border-soft bg-bg">
                <div class="text-[13px] font-semibold text-text-primary mb-[8px]">公立应用覆盖范围</div>
                <a-checkbox-group v-model:value="form.coverPublic">
                  <a-checkbox v-for="item in coverPublicOptions" :key="item" :value="item">{{ item }}</a-checkbox>
                </a-checkbox-group>
              </div>
              <div v-if="form.targetObject.includes('医技护人员')" class="mt-[12px] p-[12px] rounded-[8px] border border-border-soft bg-bg">
                <div class="text-[13px] font-semibold text-text-primary mb-[8px]">医技应用覆盖范围</div>
                <a-checkbox-group v-model:value="form.coverTech">
                  <a-checkbox v-for="item in coverTechOptions" :key="item" :value="item">{{ item }}</a-checkbox>
                </a-checkbox-group>
              </div>
            </div>
          </a-form-item>
        </section>

        <!-- 4. 管理信息 -->
        <section v-if="!isShelfMode" class="cloud-card p-[20px] mb-[14px] scroll-mt-[80px]">
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[4px] h-[16px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">管理信息</span>
            <span class="text-[11px] text-text-tertiary">仅管理员服务目录管理可见</span>
          </div>
          <a-form-item label="显示顺序">
            <a-input-number v-model:value="form.sortOrder" :min="0" style="width: 200px" />
          </a-form-item>
          <a-form-item label="服务征集得分">
            <a-input-number v-model:value="form.recruitScore" :min="0" :step="0.1" style="width: 200px" placeholder="请输入服务征集得分" />
          </a-form-item>
        </section>

      </a-form>
    </main>
  </div>
</template>

<script>
import { ArrowLeftOutlined, PictureOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { getContentList } from '@/api/contentcore/content';
import emitter from '@/utils/emitter';

export default {
  name: 'CMSDigitalAppForm',
  components: {
    ArrowLeftOutlined,
    PictureOutlined,
    PlusOutlined,
    CloseOutlined,
  },
  data() {
    return {
      catalogId: '',
      form: {
        id: '',
        title: '',
        logo: '',
        description: '',
        paymentMethodRef: '',
        systemUrl: '',
        sortOrder: 0,
        recruitScore: undefined,
        serviceProvider: '',
        cooperativeEnterprise: '',
        contactName1: '',
        contactPhone1: '',
        contactName2: '',
        contactPhone2: '',
        targetObject: [],
        appArchitecture: [],
        cloudProvider: [],
        coverBase: [],
        coverPublic: [],
        coverTech: [],
      },
      coverBaseOptions: ['基本公共卫生服务', '医院信息系统（HIS）', '实验室信息管理系统（LIS）', '影像归档和通信系统（PACS）', '智慧管理平台（HRP）', '心电', '家庭医生签约', '村卫生室管理', '药店应用管理', '智能外呼', '辅助诊疗', '临床专病库', '区域综合', '基本公共卫生服务绩效评价', '妇幼健康'],
      coverPublicOptions: ['医院信息系统（HIS）', '实验室信息管理系统（LIS）', '影像归档和通信系统（PACS）', '心电', '医养结合一体化', '智慧管理平台（HRP）', '药店应用管理', '智能外呼', '临床专病库', '医共体信息平台', '妇幼健康'],
      coverTechOptions: [],
      targetObjectSubgroups: [
        { key: 'org', title: '机构类', options: ['基层医疗卫生机构', '公立医院'] },
        { key: 'person', title: '人员类', options: ['医技护人员'] },
      ],
      archSubgroups: [
        { key: 'web', title: 'Web架构', options: ['B/S'] },
        { key: 'client', title: '客户端架构', options: ['C/S架构', 'B/S+C/S'] },
        { key: 'standalone', title: '独立部署', options: ['单机', '其他'] },
      ],
      cloudSubgroups: [
        { key: 'carrier', title: '运营商云', options: ['电信云', '移动云', '联通云'] },
        { key: 'independent', title: '独立云厂商', options: ['浪潮云', '紫光云', '影像云'] },
      ],
      rules: {
        title: [{ required: true, message: '请输入数字应用名称', trigger: 'blur' }],
        description: [{ required: true, message: '请输入应用描述', trigger: 'blur' }],
        serviceProvider: [{ required: true, message: '请输入服务商名称', trigger: 'blur' }],
        targetObject: [{ required: true, message: '请选择服务对象', trigger: 'change', type: 'array', min: 1 }],
        cloudProvider: [{ required: true, message: '请选择部署云服务商', trigger: 'change', type: 'array', min: 1 }],
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
    flatTargetObject() {
      return this.targetObjectSubgroups.flatMap(sg => sg.options);
    },
    flatArch() {
      return this.archSubgroups.flatMap(sg => sg.options);
    },
    flatCloud() {
      return this.cloudSubgroups.flatMap(sg => sg.options);
    },
  },
  created() {
    emitter.emit('set-prd-anchor', this.isShelfMode
      ? (this.isEdit ? 'prd-3.1.2.1.3.1' : 'prd-3.1.2.1.2.1')
      : (this.isEdit ? 'prd-3.2.1.1.3' : 'prd-3.2.1.1.2'));
    this.catalogId = this.$route.query.cid || '603612031287365';
    if (this.isEdit) {
      this.loadRecord();
    }
  },
  methods: {
    loadRecord() {
      const contentId = this.$route.query.id;
      if (!contentId) return;
      getContentList({ catalogId: this.catalogId, pageNum: 1, pageSize: 1000 }).then((response) => {
        const row = response.data.rows.find((r) => r.contentId === contentId);
        if (row) {
          this.form = {
            id: row.id,
            title: row.title || '',
            logo: row.logo || '',
            description: row.description || '',
            paymentMethodRef: row.paymentMethodRef || '',
            systemUrl: row.systemUrl || '',
            sortOrder: row.sortOrder || 0,
            recruitScore: row.recruitScore != null ? row.recruitScore : undefined,
            serviceProvider: row.serviceProvider || '',
            cooperativeEnterprise: row.cooperativeEnterprise || '',
            contactName1: row.contactName1 || '',
            contactPhone1: row.contactPhone1 || '',
            contactName2: row.contactName2 || '',
            contactPhone2: row.contactPhone2 || '',
            targetObject: Array.isArray(row.targetObject) ? row.targetObject : [],
            appArchitecture: Array.isArray(row.appArchitecture) ? row.appArchitecture : [],
            cloudProvider: Array.isArray(row.cloudProvider) ? row.cloudProvider : [],
            coverBase: Array.isArray(row.coverBase) ? row.coverBase : [],
            coverPublic: Array.isArray(row.coverPublic) ? row.coverPublic : [],
            coverTech: Array.isArray(row.coverTech) ? row.coverTech : [],
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
/* 页面内无需额外 scoped 样式，完全复用全局 cloud-card / bg / text token */
</style>
