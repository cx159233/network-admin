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
          <span class="text-[16px] font-semibold text-text-primary">{{ pageTitle }}</span>
        </div>
        <a-space>
          <a-button v-if="currentStep > 0" @click="prevStep">上一步</a-button>
          <a-button v-if="currentStep < 3" type="primary" @click="nextStep">下一步</a-button>
          <template v-else>
            <a-button v-if="isShelfMode" @click="onSaveDraft">保存草稿</a-button>
            <a-button type="primary" @click="onSubmit">{{ isShelfMode ? '提交审核' : '直接发布' }}</a-button>
          </template>
        </a-space>
      </div>
    </div>

    <!-- 步骤条 -->
    <div class="max-w-[920px] mx-auto pt-[20px] px-[20px]">
      <a-steps :current="currentStep" size="small" class="form-steps">
        <a-step title="企业基本情况" />
        <a-step title="应用服务功能情况" />
        <a-step title="产品或服务的基本情况" />
        <a-step title="相关附件" />
      </a-steps>
    </div>

    <!-- 主表单 -->
    <main class="max-w-[920px] mx-auto p-[20px]">
      <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">

        <!-- ==================== Step 1: 企业基本情况 ==================== -->
        <section v-show="currentStep === 0" class="cloud-card p-[20px] mb-[14px]">
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[4px] h-[16px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">企业基本情况</span>
            <span class="text-[11px] text-text-tertiary">数据从机构注册信息自动带入</span>
          </div>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="企业（机构）名称" name="orgName">
                <a-input v-model:value="form.orgName" disabled placeholder="自动带入" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="统一社会信用代码" name="creditCode">
                <a-input v-model:value="form.creditCode" disabled placeholder="自动带入" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="法定代表人" name="legalPerson">
                <a-input v-model:value="form.legalPerson" disabled placeholder="自动带入" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="成立日期" name="establishDate">
                <a-input v-model:value="form.establishDate" disabled placeholder="自动带入" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="注册资金（万元）" name="registeredCapital">
                <a-input v-model:value="form.registeredCapital" disabled placeholder="自动带入" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="企业规模" name="companyScale">
                <a-input v-model:value="form.companyScale" disabled placeholder="自动带入" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item label="注册地址" name="registeredAddress">
            <a-input v-model:value="form.registeredAddress" disabled placeholder="自动带入" />
          </a-form-item>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="联系人" name="contactPerson">
                <a-input v-model:value="form.contactPerson" disabled placeholder="自动带入" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="联系电话" name="contactPhone">
                <a-input v-model:value="form.contactPhone" disabled placeholder="自动带入" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item label="企业简介">
            <a-textarea v-model:value="form.orgIntro" disabled :rows="3" placeholder="自动带入" />
          </a-form-item>
        </section>

        <!-- ==================== Step 2: 应用服务功能情况 ==================== -->
        <section v-show="currentStep === 1" class="cloud-card p-[20px] mb-[14px]">
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[4px] h-[16px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">应用服务功能情况</span>
          </div>

          <a-form-item label="应用服务名称" name="serviceName" :rules="[{ required: true, message: '请输入应用服务名称' }]">
            <a-input v-model:value="form.serviceName" placeholder="请输入应用服务名称" :maxlength="60" show-count />
          </a-form-item>

          <a-form-item label="LOGO">
            <div class="flex items-center gap-[14px]">
              <div class="relative w-[80px] h-[80px] flex-shrink-0">
                <a-upload :max-count="1" :show-upload-list="false" accept=".png,.jpg,.jpeg,.svg" :before-upload="handleLogoUpload">
                  <div class="group relative w-[80px] h-[80px] rounded-[8px] border border-border-soft bg-bg grid place-items-center overflow-hidden cursor-pointer">
                    <img v-if="form.logo" :src="form.logo" alt="logo" class="w-full h-full object-cover" />
                    <PictureOutlined v-else class="text-[24px] text-text-tertiary" />
                    <div class="absolute inset-0 bg-black/45 grid place-items-center opacity-0 group-hover:opacity-100 transition">
                      <PlusOutlined v-if="!form.logo" class="text-[20px] text-white" />
                      <div v-else class="text-[11px] text-white/90 text-center leading-[16px]">点击替换</div>
                    </div>
                  </div>
                </a-upload>
                <a v-if="form.logo" class="absolute -top-[6px] -right-[6px] w-[20px] h-[20px] rounded-full bg-danger text-white grid place-items-center text-[11px] shadow-sm hover:bg-danger/90 z-10" @click.stop="onRemoveLogo">
                  <CloseOutlined />
                </a>
              </div>
              <div class="text-[11px] text-text-tertiary">支持 PNG / JPG / JPEG / SVG，建议 640×640，≤ 1MB</div>
            </div>
          </a-form-item>

          <a-form-item label="服务类别" name="serviceCategory" :rules="[{ required: true, message: '请选择服务类别', trigger: 'change' }]">
            <a-select v-model:value="form.serviceCategory" placeholder="请选择服务类别" :options="serviceCategoryOptions" />
          </a-form-item>

          <a-form-item label="服务功能概述" name="description" :rules="[{ required: true, message: '请输入服务功能概述' }]">
            <div class="relative">
              <a-textarea v-model:value="form.description" :rows="4" placeholder="请描述应用服务的核心功能、解决的主要业务问题" :maxlength="800" class="!pb-[28px]" />
              <div class="absolute right-[8px] bottom-[6px] text-[12px] text-text-tertiary pointer-events-none">{{ form.description.length }}/800</div>
            </div>
          </a-form-item>

          <a-form-item label="技术架构" name="techArchitecture">
            <div class="relative">
              <a-textarea v-model:value="form.techArchitecture" :rows="3" placeholder="请描述技术架构（如微服务、容器化部署等）" :maxlength="500" class="!pb-[28px]" />
              <div class="absolute right-[8px] bottom-[6px] text-[12px] text-text-tertiary pointer-events-none">{{ form.techArchitecture.length }}/500</div>
            </div>
          </a-form-item>

          <a-form-item label="数据对接能力" name="dataIntegration">
            <a-checkbox-group v-model:value="form.dataIntegration">
              <a-checkbox value="healthCloud">与卫生健康云数据互通</a-checkbox>
              <a-checkbox value="realtimeInterface">实时接口对接</a-checkbox>
              <a-checkbox value="etlSync">ETL定时同步</a-checkbox>
              <a-checkbox value="standards">符合数据标准规范</a-checkbox>
            </a-checkbox-group>
          </a-form-item>

          <a-form-item label="信息安全等级">
            <a-radio-group v-model:value="form.securityLevel">
              <a-radio value="level2">等保二级</a-radio>
              <a-radio value="level3">等保三级</a-radio>
              <a-radio value="other">其他认证</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item label="适用场景">
            <div class="relative">
              <a-textarea v-model:value="form.applicableScenario" :rows="3" placeholder="请描述应用服务的适用场景和目标用户" :maxlength="500" class="!pb-[28px]" />
              <div class="absolute right-[8px] bottom-[6px] text-[12px] text-text-tertiary pointer-events-none">{{ form.applicableScenario.length }}/500</div>
            </div>
          </a-form-item>
        </section>

        <!-- ==================== Step 3: 产品或服务的基本情况 ==================== -->
        <section v-show="currentStep === 2" class="cloud-card p-[20px] mb-[14px]">
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[4px] h-[16px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">产品或服务的基本情况</span>
          </div>

          <a-form-item label="服务专区" name="serviceZone" :rules="[{ required: true, message: '请选择服务专区', trigger: 'change' }]">
            <a-radio-group v-model:value="form.serviceZone">
              <a-radio v-for="opt in serviceZoneOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item label="服务分类" name="serviceType" :rules="[{ required: true, message: '请选择服务分类', trigger: 'change', type: 'array', min: 1 }]">
            <a-checkbox-group v-model:value="form.serviceType">
              <a-checkbox v-for="opt in serviceTypeOptions" :key="opt" :value="opt">{{ opt }}</a-checkbox>
            </a-checkbox-group>
            <div v-if="!form.serviceZone" class="mt-[4px] text-[12px] text-text-tertiary">请先选择服务专区</div>
          </a-form-item>

          <a-form-item label="部署云服务商" name="cloudProvider" :rules="[{ required: true, message: '请选择部署云服务商', trigger: 'change', type: 'array', min: 1 }]">
            <a-checkbox-group v-model:value="form.cloudProvider">
              <a-checkbox v-for="opt in cloudProviderOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-checkbox>
            </a-checkbox-group>
          </a-form-item>

          <a-form-item label="服务模式">
            <a-checkbox-group v-model:value="form.serviceMode">
              <a-checkbox value="saas">SaaS服务</a-checkbox>
              <a-checkbox value="paas">PaaS服务</a-checkbox>
              <a-checkbox value="iaas">IaaS服务</a-checkbox>
              <a-checkbox value="private">私有化部署</a-checkbox>
            </a-checkbox-group>
          </a-form-item>

          <a-form-item label="付费方式参考">
            <div class="relative">
              <a-textarea v-model:value="form.paymentMethodRef" :rows="2" placeholder="请描述付费方式（如按年订阅、按量计费、免费试用等）" :maxlength="300" class="!pb-[28px]" />
              <div class="absolute right-[8px] bottom-[6px] text-[12px] text-text-tertiary pointer-events-none">{{ form.paymentMethodRef.length }}/300</div>
            </div>
          </a-form-item>

          <a-form-item label="服务SLA承诺">
            <div class="relative">
              <a-textarea v-model:value="form.slaCommitment" :rows="2" placeholder="请描述可用性承诺（如99.9%可用性、故障响应时间等）" :maxlength="300" class="!pb-[28px]" />
              <div class="absolute right-[8px] bottom-[6px] text-[12px] text-text-tertiary pointer-events-none">{{ form.slaCommitment.length }}/300</div>
            </div>
          </a-form-item>

          <a-form-item label="技术服务保障">
            <div class="relative">
              <a-textarea v-model:value="form.techSupport" :rows="2" placeholder="请描述技术支持方式（如7×24热线、在线工单、驻场服务等）" :maxlength="300" class="!pb-[28px]" />
              <div class="absolute right-[8px] bottom-[6px] text-[12px] text-text-tertiary pointer-events-none">{{ form.techSupport.length }}/300</div>
            </div>
          </a-form-item>

          <a-form-item label="团队规模">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="总人数" :label-col="{ style: { fontSize: '12px' } }">
                  <a-input-number v-model:value="form.teamTotal" :min="0" placeholder="总人数" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="核心研发" :label-col="{ style: { fontSize: '12px' } }">
                  <a-input-number v-model:value="form.teamCore" :min="0" placeholder="核心研发人数" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="运维人员" :label-col="{ style: { fontSize: '12px' } }">
                  <a-input-number v-model:value="form.teamOps" :min="0" placeholder="运维人员" style="width: 100%" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form-item>

          <!-- 管理员专属字段 -->
          <template v-if="!isShelfMode">
            <a-divider dashed />
            <div class="flex items-center gap-[8px] mb-[16px]">
              <div class="w-[4px] h-[16px] bg-warning rounded-full" />
              <span class="text-[14px] font-semibold text-text-primary">管理信息</span>
              <span class="text-[11px] text-text-tertiary">仅管理员可见</span>
            </div>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="显示顺序">
                  <a-input-number v-model:value="form.sortOrder" :min="0" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="服务征集得分">
                  <a-input-number v-model:value="form.recruitScore" :min="0" :step="0.1" style="width: 100%" placeholder="请输入服务征集得分" />
                </a-form-item>
              </a-col>
            </a-row>
          </template>
        </section>

        <!-- ==================== Step 4: 相关附件 ==================== -->
        <section v-show="currentStep === 3" class="cloud-card p-[20px] mb-[14px]">
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[4px] h-[16px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">相关附件</span>
            <span class="text-[11px] text-text-tertiary">请上传相关资质证明材料</span>
          </div>

          <a-form-item label="营业执照">
            <a-upload v-model:file-list="form.bizLicense" :before-upload="() => false" accept=".pdf,.jpg,.png" :max-count="1">
              <a-button>
                <UploadOutlined /> 上传文件
              </a-button>
              <template #tip>
                <div class="text-[12px] text-text-tertiary mt-[4px]">支持 PDF/JPG/PNG，≤ 10MB</div>
              </template>
            </a-upload>
          </a-form-item>

          <a-form-item label="等保测评报告">
            <a-upload v-model:file-list="form.securityReport" :before-upload="() => false" accept=".pdf,.jpg,.png" :max-count="3">
              <a-button>
                <UploadOutlined /> 上传文件
              </a-button>
              <template #tip>
                <div class="text-[12px] text-text-tertiary mt-[4px]">支持 PDF/JPG/PNG，≤ 10MB，最多3个文件</div>
              </template>
            </a-upload>
          </a-form-item>

          <a-form-item label="知识产权证明">
            <a-upload v-model:file-list="form.ipCertificate" :before-upload="() => false" accept=".pdf,.jpg,.png" :max-count="5">
              <a-button>
                <UploadOutlined /> 上传文件
              </a-button>
              <template #tip>
                <div class="text-[12px] text-text-tertiary mt-[4px]">软件著作权、专利证书等，支持 PDF/JPG/PNG，≤ 10MB，最多5个文件</div>
              </template>
            </a-upload>
          </a-form-item>

          <a-form-item label="其他资质材料">
            <a-upload v-model:file-list="form.otherCerts" :before-upload="() => false" accept=".pdf,.jpg,.png,.doc,.docx" :max-count="5">
              <a-button>
                <UploadOutlined /> 上传文件
              </a-button>
              <template #tip>
                <div class="text-[12px] text-text-tertiary mt-[4px]">如医疗器械经营许可证、药品经营许可证等，支持 PDF/图片/Word，≤ 10MB，最多5个文件</div>
              </template>
            </a-upload>
          </a-form-item>

          <a-form-item label="服务协议/合同模板">
            <a-upload v-model:file-list="form.serviceAgreement" :before-upload="() => false" accept=".pdf,.doc,.docx" :max-count="2">
              <a-button>
                <UploadOutlined /> 上传文件
              </a-button>
              <template #tip>
                <div class="text-[12px] text-text-tertiary mt-[4px]">支持 PDF/Word，≤ 10MB，最多2个文件</div>
              </template>
            </a-upload>
          </a-form-item>
        </section>

      </a-form>
    </main>
  </div>
</template>

<script>
import { ArrowLeftOutlined, PictureOutlined, PlusOutlined, CloseOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import emitter from '@/utils/emitter';

export default {
  name: 'CMSServiceCatalogForm',
  components: {
    ArrowLeftOutlined,
    PictureOutlined,
    PlusOutlined,
    CloseOutlined,
    UploadOutlined,
  },
  data() {
    return {
      currentStep: 0,
      form: {
        // Step1: 企业基本情况（机构注册数据代入）
        orgName: '重庆市卫生健康信息技术有限公司',
        creditCode: '91500000MA60XXXXXX',
        legalPerson: '张三',
        establishDate: '2020-03-15',
        registeredCapital: '5000',
        companyScale: '中型企业',
        registeredAddress: '重庆市渝北区龙山街道XXX号',
        contactPerson: '李四',
        contactPhone: '13800138000',
        orgIntro: '专注于卫生健康信息化领域，提供云计算、大数据、人工智能等技术服务',

        // Step2: 应用服务功能情况
        serviceId: '',
        serviceName: '',
        logo: '',
        serviceCategory: undefined,
        description: '',
        techArchitecture: '',
        dataIntegration: [],
        securityLevel: undefined,
        applicableScenario: '',

        // Step3: 产品或服务的基本情况
        serviceZone: 'X86Zone',
        serviceType: [],
        cloudProvider: [],
        serviceMode: [],
        paymentMethodRef: '',
        slaCommitment: '',
        techSupport: '',
        teamTotal: undefined,
        teamCore: undefined,
        teamOps: undefined,
        sortOrder: 0,
        recruitScore: undefined,

        // Step4: 相关附件
        bizLicense: [],
        securityReport: [],
        ipCertificate: [],
        otherCerts: [],
        serviceAgreement: [],
      },
      serviceCategoryOptions: [
        { value: 'clinical', label: '临床医疗服务类' },
        { value: 'publicHealth', label: '公共卫生服务类' },
        { value: 'imaging', label: '医学影像类' },
        { value: 'tcm', label: '中医药服务类' },
        { value: 'pharmacy', label: '药品供应保障类' },
        { value: 'maternal', label: '妇幼保健类' },
        { value: 'chronic', label: '慢病管理类' },
        { value: 'emergency', label: '院前急救类' },
        { value: 'blood', label: '血液管理类' },
        { value: 'supervision', label: '卫生监督类' },
        { value: 'aid', label: '医疗援助类' },
        { value: 'platform', label: '平台运营类' },
        { value: 'collab', label: '业务协同类' },
        { value: 'dataService', label: '数据服务类' },
        { value: 'infra', label: '基础设施类' },
        { value: 'security', label: '信息安全类' },
        { value: 'ai', label: '人工智能类' },
        { value: 'other', label: '其他' },
      ],
      serviceZoneOptions: [
        { value: 'X86Zone', label: 'X86专区' },
        { value: 'XinChuangZone', label: '信创专区' },
        { value: 'CipherZone', label: '密码服务专区' },
        { value: 'SuperComputeZone', label: '超算、智算专区' },
      ],
      zoneServiceTypeMap: {
        X86Zone: ['机房云托管服务', '计算服务', '存储服务', '网络服务', '安全服务', '大数据服务', '备份容灾服务', '数据库服务'],
        XinChuangZone: ['机房云托管服务', '计算服务', '存储服务', '网络服务', '软件服务'],
        CipherZone: ['密码服务'],
        SuperComputeZone: ['超算服务', '智算服务'],
      },
      cloudProviderOptions: [
        { value: '10251', label: '影像云' },
        { value: '10252', label: '电信云' },
        { value: '10253', label: '移动云' },
        { value: '10254', label: '联通云' },
        { value: '10250', label: '浪潮云' },
      ],
      rules: {
        serviceName: [{ required: true, message: '请输入应用服务名称', trigger: 'blur' }],
        serviceCategory: [{ required: true, message: '请选择服务类别', trigger: 'change' }],
        description: [{ required: true, message: '请输入服务功能概述', trigger: 'blur' }],
        serviceZone: [{ required: true, message: '请选择服务专区', trigger: 'change' }],
        serviceType: [{ required: true, message: '请选择服务分类', trigger: 'change', type: 'array', min: 1 }],
        cloudProvider: [{ required: true, message: '请选择部署云服务商', trigger: 'change', type: 'array', min: 1 }],
      },
    };
  },
  computed: {
    serviceTypeOptions() {
      return this.zoneServiceTypeMap[this.form.serviceZone] || [];
    },
    isEdit() {
      return !!this.$route.query.id;
    },
    isShelfMode() {
      return this.$route.query.mode === 'shelf';
    },
    pageTitle() {
      if (this.isShelfMode) return this.isEdit ? '编辑数字应用' : '新增数字应用';
      return this.isEdit ? '编辑基础服务' : '新增基础服务';
    },
  },
  watch: {
    'form.serviceZone'() {
      this.form.serviceType = [];
    },
  },
  created() {
    emitter.emit('set-prd-anchor', this.isShelfMode
      ? (this.isEdit ? 'prd-3.1.2.1.3.4' : 'prd-3.1.2.1.2.4')
      : (this.isEdit ? 'prd-3.2.1.4.3' : 'prd-3.2.1.4.2'));
    if (this.isEdit) {
      this.loadRecord();
    }
  },
  methods: {
    nextStep() {
      if (this.currentStep === 0) {
        // Step1 企业信息为只读，直接通过
        this.currentStep = 1;
        return;
      }
      this.$refs.formRef.validate().then(() => {
        if (this.currentStep < 3) this.currentStep++;
      }).catch(() => {});
    },
    prevStep() {
      if (this.currentStep > 0) this.currentStep--;
    },
    loadRecord() {
      const serviceId = this.$route.query.id;
      if (!serviceId) return;
      const cached = this.$cache?.local?.get('serviceCatalogData');
      const rows = cached || [];
      const row = rows.find((r) => r.serviceId === serviceId);
      if (row) {
        Object.assign(this.form, {
          serviceId: row.serviceId,
          serviceName: row.serviceName || '',
          logo: row.logo || '',
          description: row.description || '',
          paymentMethodRef: row.paymentMethodRef || '',
          sortOrder: row.sortOrder != null ? row.sortOrder : 0,
          recruitScore: row.recruitScore != null ? row.recruitScore : undefined,
          serviceType: Array.isArray(row.serviceType) ? row.serviceType : (row.serviceType ? [row.serviceType] : []),
          cloudProvider: Array.isArray(row.cloudProvider) ? row.cloudProvider : (row.cloudProvider ? [row.cloudProvider] : []),
          serviceZone: row.serviceZone || 'X86Zone',
        });
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
      }).catch(() => {
        // 定位到第一个有错误的步骤
        this.jumpToFirstError();
      });
    },
    onSaveDraft() {
      message.success('草稿已保存');
    },
    jumpToFirstError() {
      // 简单策略：回退到第一个步骤
      if (!this.form.serviceName || !this.form.serviceCategory || !this.form.description) {
        this.currentStep = 1;
      } else if (!this.form.serviceZone || !this.form.serviceType?.length || !this.form.cloudProvider?.length) {
        this.currentStep = 2;
      }
    },
  },
};
</script>

<style scoped>
.form-steps {
  margin-bottom: 8px;
}

:deep(.ant-checkbox-wrapper) {
  margin-bottom: 8px;
}

:deep(.ant-steps-item-title) {
  font-size: 13px !important;
}
</style>