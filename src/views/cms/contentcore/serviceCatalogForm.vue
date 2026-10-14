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
          <a-button type="link" @click="demoNextStep">演示下一步</a-button>
          <a-button v-if="currentStep > 0" @click="prevStep">上一步</a-button>
          <a-button v-if="currentStep < 3" type="primary" @click="nextStep">下一步</a-button>
          <a-button @click="onSaveDraft">保存草稿</a-button>
          <a-button v-if="currentStep === 3" type="primary" @click="onSubmit">{{ isShelfMode ? '提交申报' : '直接发布' }}</a-button>
        </a-space>
      </div>
    </div>

    <!-- 步骤条 -->
    <div class="max-w-[1100px] mx-auto pt-[20px] px-[20px]">
      <a-steps :current="currentStep" size="small" class="form-steps">
        <a-step title="企业基本情况" />
        <a-step title="应用服务功能情况" />
        <a-step title="产品或服务的基本情况" />
        <a-step title="相关附件" />
      </a-steps>
    </div>

    <!-- 主表单 -->
    <main class="max-w-[1100px] mx-auto p-[20px]">
      <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">

        <!-- ==================== Step 1: 企业基本情况 ==================== -->
        <div v-show="currentStep === 0">
          <!-- 企业基本情况 -->
          <section class="cloud-card p-[20px] mb-[14px]">
            <div class="flex items-center gap-[8px] mb-[16px]">
              <div class="w-[4px] h-[16px] bg-primary rounded-full" />
              <span class="text-[14px] font-semibold text-text-primary">基本信息</span>
              <span class="text-[11px] text-text-tertiary">数据从机构注册信息自动带入</span>
            </div>

            <table class="w-full border-collapse text-[14px] table-fixed">
              <tbody>
                <tr>
                  <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">单位（机构）名称</td>
                  <td class="border border-border px-[12px] py-[8px]" colspan="3">
                    <a-input v-model:value="form.orgName" disabled placeholder="自动带入" />
                  </td>
                </tr>
                <tr>
                  <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">法定代表人</td>
                  <td class="border border-border px-[12px] py-[8px]">
                    <a-input v-model:value="form.legalPerson" disabled placeholder="自动带入" />
                  </td>
                  <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">统一社会信用代码</td>
                  <td class="border border-border px-[12px] py-[8px]">
                    <a-input v-model:value="form.creditCode" disabled placeholder="自动带入" />
                  </td>
                </tr>
                <tr>
                  <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">单位（机构）性质</td>
                  <td class="border border-border px-[12px] py-[8px]" colspan="3">
                    <a-radio-group v-model:value="form.orgNature" disabled>
                      <a-radio v-for="opt in orgNatureOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-radio>
                    </a-radio-group>
                  </td>
                </tr>
                <tr>
                  <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">成立时间</td>
                  <td class="border border-border px-[12px] py-[8px]" colspan="3">
                    <a-input v-model:value="form.establishDate" disabled placeholder="自动带入" />
                  </td>
                </tr>
                <tr>
                  <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">单位（机构）注册地</td>
                  <td class="border border-border px-[12px] py-[8px]" colspan="3">
                    <a-row :gutter="8">
                      <a-col :span="5">
                        <a-input v-model:value="form.regProvince" disabled placeholder="省" />
                      </a-col>
                      <a-col :span="5">
                        <a-input v-model:value="form.regCity" disabled placeholder="市" />
                      </a-col>
                      <a-col :span="5">
                        <a-input v-model:value="form.regDistrict" disabled placeholder="区" />
                      </a-col>
                      <a-col :span="9">
                        <a-input v-model:value="form.regDetail" disabled placeholder="具体到门牌号码" />
                      </a-col>
                    </a-row>
                  </td>
                </tr>
                <tr>
                  <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">单位（机构）地址</td>
                  <td class="border border-border px-[12px] py-[8px]" colspan="3">
                    <a-row :gutter="8">
                      <a-col :span="5">
                        <a-input v-model:value="form.bizProvince" disabled placeholder="省" />
                      </a-col>
                      <a-col :span="5">
                        <a-input v-model:value="form.bizCity" disabled placeholder="市" />
                      </a-col>
                      <a-col :span="5">
                        <a-input v-model:value="form.bizDistrict" disabled placeholder="区" />
                      </a-col>
                      <a-col :span="9">
                        <a-input v-model:value="form.bizDetail" disabled placeholder="具体到门牌号码" />
                      </a-col>
                    </a-row>
                  </td>
                </tr>
                <tr>
                  <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">联系人<span class="req-mark">*</span></td>
                  <td class="border border-border px-[12px] py-[8px]" colspan="3">
                    <a-row :gutter="8">
                      <a-col :span="6">
                        <a-form-item name="contactPerson" :rules="[{ required: true, message: '请填写姓名' }]" class="!mb-0">
                          <a-input v-model:value="form.contactPerson" placeholder="姓名" />
                        </a-form-item>
                      </a-col>
                      <a-col :span="6">
                        <a-form-item name="contactPhone" :rules="[{ required: true, message: '请填写电话及手机' }]" class="!mb-0">
                          <a-input v-model:value="form.contactPhone" placeholder="电话及手机" />
                        </a-form-item>
                      </a-col>
                      <a-col :span="6">
                        <a-input v-model:value="form.contactPosition" placeholder="职务" />
                      </a-col>
                      <a-col :span="6">
                        <a-input v-model:value="form.contactEmail" placeholder="邮箱/微信号" />
                      </a-col>
                    </a-row>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- 介绍情况 -->
          <section class="cloud-card p-[20px] mb-[14px]">
            <div class="flex items-center gap-[8px] mb-[16px]">
              <div class="w-[4px] h-[16px] bg-primary rounded-full" />
              <span class="text-[14px] font-semibold text-text-primary">详细信息</span>
            </div>

            <table class="w-full border-collapse text-[14px] table-fixed">
              <tbody>
                <tr>
                  <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">应用服务<span class="req-mark">*</span></td>
                  <td class="border border-border px-[12px] py-[8px]" colspan="3">
                    <a-form-item name="appServiceIntro" :rules="[{ required: true, message: '请填写应用服务' }]" class="!mb-0">
                      <div class="relative">
                        <a-textarea v-model:value="form.appServiceIntro" :rows="3" placeholder="云HIS、云LIS、云PACS、心电云、基本公共卫生服务、信息安全等，不超过400字。若为第三方产品，需在相关附件部分提供授权函" :maxlength="400" class="!pb-[28px]" />
                        <div class="absolute right-[8px] bottom-[6px] text-[12px] text-text-tertiary pointer-events-none">{{ form.appServiceIntro.length }}/400</div>
                      </div>
                    </a-form-item>
                  </td>
                </tr>
                <tr>
                  <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">企业简介<span class="req-mark">*</span></td>
                  <td class="border border-border px-[12px] py-[8px]" colspan="3">
                    <a-form-item name="orgIntro" :rules="[{ required: true, message: '请填写企业简介' }]" class="!mb-0">
                      <div class="relative">
                        <a-textarea v-model:value="form.orgIntro" :rows="3" placeholder="发展历程、主营业务、市场销售等方面基本情况，不超过400字" :maxlength="400" class="!pb-[28px]" />
                        <div class="absolute right-[8px] bottom-[6px] text-[12px] text-text-tertiary pointer-events-none">{{ form.orgIntro.length }}/400</div>
                      </div>
                    </a-form-item>
                  </td>
                </tr>
                <tr>
                  <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">主要产品或服务介绍<span class="req-mark">*</span></td>
                  <td class="border border-border px-[12px] py-[8px]" colspan="3">
                    <a-form-item name="mainProductIntro" :rules="[{ required: true, message: '请填写主要产品或服务介绍' }]" class="!mb-0">
                      <div class="relative">
                        <a-textarea v-model:value="form.mainProductIntro" :rows="3" placeholder="对主要产品或服务的功能，服务对象，应用场景进行简要描述，不超过400字" :maxlength="400" class="!pb-[28px]" />
                        <div class="absolute right-[8px] bottom-[6px] text-[12px] text-text-tertiary pointer-events-none">{{ form.mainProductIntro.length }}/400</div>
                      </div>
                    </a-form-item>
                  </td>
                </tr>
                <tr>
                  <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">人力情况介绍<span class="req-mark">*</span></td>
                  <td class="border border-border px-[12px] py-[8px]" colspan="3">
                    <a-form-item name="hrIntro" :rules="[{ required: true, message: '请填写人力情况介绍' }]" class="!mb-0">
                      <div class="relative">
                        <a-textarea v-model:value="form.hrIntro" :rows="4" placeholder="包括：员工总数、研发人员数量、运维人员数量、服务人员数量、人员结构、技术人员资质、经营管理人员资质、技术人员流动情况(技术人员=研发+运维+服务)等，不超过400字" :maxlength="400" class="!pb-[28px]" />
                        <div class="absolute right-[8px] bottom-[6px] text-[12px] text-text-tertiary pointer-events-none">{{ form.hrIntro.length }}/400</div>
                      </div>
                    </a-form-item>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- 资质材料 -->
          <section class="cloud-card p-[20px] mb-[14px]">
            <div class="flex items-center gap-[8px] mb-[16px]">
              <div class="w-[4px] h-[16px] bg-primary rounded-full" />
              <span class="text-[14px] font-semibold text-text-primary">真实性承诺</span>
            </div>

            <table class="w-full border-collapse text-[14px] table-fixed">
              <tbody>
                <tr>
                  <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">上传《真实性承诺》<span class="req-mark">*</span></td>
                  <td class="border border-border px-[12px] py-[8px]" colspan="3">
                    <div class="flex items-center gap-[8px]">
                      <a-upload v-model:file-list="form.authenticityCommit" :before-upload="beforeAuthUpload" accept=".pdf,.jpg,.jpeg,.png" :max-count="1">
                        <a-button><UploadOutlined /> 上传文件</a-button>
                      </a-upload>
                      <span class="text-[12px] text-text-tertiary whitespace-nowrap">需法人签章并加盖申报机构公章，支持 PDF/JPG/JPEG/PNG，≤ 50MB</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>

        <!-- ==================== Step 2: 应用服务功能情况 ==================== -->
        <section v-show="currentStep === 1" class="cloud-card p-[20px] mb-[14px]">
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[4px] h-[16px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">系统基本情况</span>
          </div>

          <!-- 二级分组：基本情况 -->
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[3px] h-[14px] bg-text-tertiary rounded-full" />
            <span class="text-[13px] font-medium text-text-primary">基本情况</span>
          </div>

          <table class="w-full border-collapse text-[14px] table-fixed">
            <tbody>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">应用系统名称<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-form-item name="systemName" :rules="[{ required: true, message: '请输入应用系统名称' }]" class="!mb-0">
                    <a-input v-model:value="form.systemName" placeholder="请输入应用系统名称" :maxlength="60" />
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">LOGO</td>
                <td class="border border-border px-[12px] py-[8px]">
                  <div class="flex items-center gap-[12px]">
                    <div v-if="form.logo" class="logo-preview">
                      <img :src="form.logo" alt="logo" class="w-[48px] h-[48px] object-contain border border-border rounded" />
                      <span class="logo-remove" @click="onRemoveLogo">×</span>
                    </div>
                    <a-upload :show-upload-list="false" :before-upload="handleLogoUpload" accept=".jpg,.jpeg,.png,.svg">
                      <a-button><UploadOutlined /> 上传LOGO</a-button>
                    </a-upload>
                    <span class="text-[12px] text-text-tertiary whitespace-nowrap">支持 JPG/JPEG/PNG/SVG，≤ 10MB</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">建设厂商</td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-input v-model:value="form.builderVendor" disabled placeholder="自动带入" />
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">联系人及联系方式1</td>
                <td class="border border-border px-[12px] py-[8px]">
                  <div class="flex items-center gap-[8px]">
                    <a-form-item name="sysContactName" class="!mb-0">
                      <a-input v-model:value="form.sysContactName" placeholder="姓名" style="width: 150px" />
                    </a-form-item>
                    <span class="text-text-tertiary">-</span>
                    <a-form-item name="sysContactPhone" class="!mb-0">
                      <a-input v-model:value="form.sysContactPhone" placeholder="手机号" style="width: 150px" />
                    </a-form-item>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">联系人及联系方式2</td>
                <td class="border border-border px-[12px] py-[8px]">
                  <div class="flex items-center gap-[8px]">
                    <a-input v-model:value="form.sysContact2Name" placeholder="姓名" style="width: 150px" />
                    <span class="text-text-tertiary">-</span>
                    <a-input v-model:value="form.sysContact2Phone" placeholder="手机号" style="width: 150px" />
                  </div>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">应用服务资费<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-form-item name="servicePricing" :rules="[{ required: true, message: '请输入应用服务资费' }]" class="!mb-0">
                    <a-input v-model:value="form.servicePricing" placeholder="于卫生健康云内提供应用服务的基础价格，可填写基于系统或基于功能模块等" :maxlength="200" show-count />
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">建设总投资（万元）<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-form-item name="totalInvestment" :rules="[{ required: true, message: '请输入建设总投资' }]" class="!mb-0">
                    <a-input-number v-model:value="form.totalInvestment" :min="0" placeholder="请输入建设总投资" style="width: 100%" />
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">系统主要功能<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-form-item name="systemMainFunc" :rules="[{ required: true, message: '请输入系统主要功能' }]" class="!mb-0">
                    <div class="relative">
                      <a-textarea v-model:value="form.systemMainFunc" :rows="3" placeholder="对系统主要功能进行描述，该描述将用于卫生健康云门户产品展示使用，200字以内" :maxlength="200" class="!pb-[28px]" />
                      <div class="absolute right-[8px] bottom-[6px] text-[12px] text-text-tertiary pointer-events-none">{{ form.systemMainFunc.length }}/200</div>
                    </div>
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">系统地址</td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-input v-model:value="form.systemUrl" placeholder="请输入系统地址" />
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">系统结构<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]">
                  <div class="flex items-center gap-[12px]">
                    <a-form-item name="systemStructure" :rules="[{ required: true, message: '请选择系统结构' }]" class="!mb-0">
                      <a-radio-group v-model:value="form.systemStructure">
                        <a-radio value="bs">B/S</a-radio>
                        <a-radio value="cs">C/S</a-radio>
                        <a-radio value="bscs">C/S+B/S</a-radio>
                        <a-radio value="microservice">微服务</a-radio>
                        <a-radio value="other">其他</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <div v-if="form.systemStructure === 'other'" class="flex items-center gap-[6px]"><span class="text-[12px] text-text-tertiary whitespace-nowrap"><span class="req-mark">*</span>其他内容：</span><a-input v-model:value="form.systemStructureCustom" placeholder="请输入" style="width: 180px" /></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">服务对象<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-form-item name="serviceTarget" :rules="[{ required: true, type: 'array', message: '请选择服务对象' }]" class="!mb-0">
                    <a-checkbox-group v-model:value="form.serviceTarget">
                      <a-checkbox value="公立医院">公立医院</a-checkbox>
                      <a-checkbox value="基层医疗卫生机构">基层医疗卫生机构</a-checkbox>
                      <a-checkbox value="医技护人员">医技护人员</a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">服务专区<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-form-item name="serviceZone" :rules="[{ required: true, message: '请选择服务专区' }]" class="!mb-0">
                    <a-radio-group v-model:value="form.serviceZone">
                      <a-radio v-for="opt in serviceZoneOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">服务分类<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-form-item name="serviceType" :rules="[{ required: true, type: 'array', message: '请选择服务分类' }]" class="!mb-0">
                    <a-checkbox-group v-model:value="form.serviceType">
                      <a-checkbox v-for="opt in serviceTypeOptions" :key="opt" :value="opt">{{ opt }}</a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">应用发布终端<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]">
                  <div class="flex items-center gap-[12px]">
                    <a-form-item name="publishTerminal" :rules="[{ required: true, type: 'array', message: '请选择应用发布终端' }]" class="!mb-0">
                      <a-checkbox-group v-model:value="form.publishTerminal">
                        <a-checkbox value="web">网页</a-checkbox>
                        <a-checkbox value="selfApp">自建APP</a-checkbox>
                        <a-checkbox value="wechatMini">微信小程序</a-checkbox>
                        <a-checkbox value="alipayMini">支付宝小程序</a-checkbox>
                        <a-checkbox value="other">其他</a-checkbox>
                      </a-checkbox-group>
                    </a-form-item>
                    <div v-if="form.publishTerminal.includes('other')" class="flex items-center gap-[6px]"><span class="text-[12px] text-text-tertiary whitespace-nowrap"><span class="req-mark">*</span>其他内容：</span><a-input v-model:value="form.publishTerminalCustom" placeholder="请输入" style="width: 180px" /></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">系统集成情况<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-form-item name="systemIntegration" :rules="[{ required: true, message: '请选择系统集成情况' }]" class="!mb-0">
                    <a-radio-group v-model:value="form.systemIntegration">
                      <a-radio value="integrated">已集成</a-radio>
                      <a-radio value="partialIntegrated">部分集成</a-radio>
                      <a-radio value="other">其他</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </td>
              </tr>
              <tr v-if="form.systemIntegration === 'partialIntegrated' || form.systemIntegration === 'other'">
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">集成说明<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]">
                  <div class="relative">
                    <a-textarea v-model:value="form.systemIntegrationNote" :rows="3" placeholder="说明哪些系统功能集成、哪些未集成" :maxlength="500" class="!pb-[28px]" />
                    <div class="absolute right-[8px] bottom-[6px] text-[12px] text-text-tertiary pointer-events-none">{{ (form.systemIntegrationNote || '').length }}/500</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">数据库类型</td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-input v-model:value="form.databaseType" placeholder="如 MySQL、Oracle" />
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">编程语言</td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-input v-model:value="form.programLang" placeholder="如 Java、Python" />
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">中间件类型</td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-input v-model:value="form.middlewareType" placeholder="如 Nginx、Tomcat" />
                </td>
              </tr>
            </tbody>
          </table>

          <!-- 二级分组：系统部署 -->
          <a-divider dashed />
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[3px] h-[14px] bg-text-tertiary rounded-full" />
            <span class="text-[13px] font-medium text-text-primary">系统部署</span>
          </div>

          <table class="w-full border-collapse text-[14px] table-fixed">
            <tbody>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">部署方式<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]">
                  <div class="flex items-center gap-[12px]">
                    <a-form-item name="deployMethod" :rules="[{ required: true, message: '请选择部署方式' }]" class="!mb-0">
                      <a-radio-group v-model:value="form.deployMethod">
                        <a-radio value="cloudProvider">通过云服务商部署</a-radio>
                        <a-radio value="selfBuilt">自建机房部署</a-radio>
                        <a-radio value="other">其他</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <div v-if="form.deployMethod === 'other'" class="flex items-center gap-[6px]"><span class="text-[12px] text-text-tertiary whitespace-nowrap"><span class="req-mark">*</span>其他内容：</span><a-input v-model:value="form.deployMethodCustom" placeholder="请输入" style="width: 180px" /></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">部署机房所在地<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-input v-model:value="form.deployLocation" placeholder="请输入部署机房所在地" />
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">云服务商名称（如未涉及云服务商可不填写）</td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-checkbox-group v-model:value="form.cloudProviderName">
                    <a-checkbox value="影像云">影像云</a-checkbox>
                    <a-checkbox value="电信云">电信云</a-checkbox>
                    <a-checkbox value="移动云">移动云</a-checkbox>
                    <a-checkbox value="联通云">联通云</a-checkbox>
                    <a-checkbox value="浪潮云">浪潮云</a-checkbox>
                  </a-checkbox-group>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">云服务方式（如未涉及云服务商可不填写）</td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-checkbox-group v-model:value="form.cloudServiceMode">
                    <a-checkbox value="industryCloud">行业云</a-checkbox>
                    <a-checkbox value="cloudHosting">云托管</a-checkbox>
                    <a-checkbox value="bareMetal">裸金属服务器租用</a-checkbox>
                  </a-checkbox-group>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- ===== 主要设备 ===== -->
          <a-divider dashed />
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[3px] h-[14px] bg-text-tertiary rounded-full" />
            <span class="text-[13px] font-medium text-text-primary">主要设备</span>
          </div>

          <table class="w-full border-collapse text-[14px] table-fixed">
            <tbody>
              <template v-for="device in deviceList" :key="device.key">
                <tr>
                  <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">{{ device.label }}<span class="req-mark">*</span></td>
                  <td class="border border-border px-[12px] py-[8px]">
                    <div class="flex items-center gap-[12px]">
                      <a-checkbox-group v-model:value="form[device.deployKey]">
                        <a-checkbox value="industryCloud">行业云</a-checkbox>
                        <a-checkbox value="cloudHosting">云托管</a-checkbox>
                        <a-checkbox value="bareMetal">裸金属服务器租用</a-checkbox>
                        <a-checkbox value="selfBuilt">自有机房</a-checkbox>
                      </a-checkbox-group>
                      <div v-if="form[device.deployKey] && form[device.deployKey].length > 0" class="flex items-center gap-[6px]">
                        <span class="text-[12px] text-text-tertiary whitespace-nowrap">配置说明：</span>
                        <a-input v-model:value="form[device.configKey]" :placeholder="device.configPlaceholder" style="min-width: 260px; flex: 1" />
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>

          <!-- ===== 系统互联 ===== -->
          <a-divider dashed />
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[3px] h-[14px] bg-text-tertiary rounded-full" />
            <span class="text-[13px] font-medium text-text-primary">系统互联</span>
          </div>

          <table class="w-full border-collapse text-[14px] table-fixed">
            <tbody>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">系统互联<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-form-item name="systemInterconnect" :rules="[{ required: true, message: '请选择系统互联' }]" class="!mb-0">
                    <a-radio-group v-model:value="form.systemInterconnect">
                      <a-radio value="independent">系统独立运行</a-radio>
                      <a-radio value="associated">系统关联运行</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">连接方式<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]">
                  <div class="flex items-center gap-[12px]">
                    <a-form-item name="connectMethod" :rules="[{ required: true, message: '请选择连接方式' }]" class="!mb-0">
                      <a-radio-group v-model:value="form.connectMethod">
                        <a-radio value="sso">单点登录</a-radio>
                        <a-radio value="api">接口调用</a-radio>
                        <a-radio value="other">其他</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <div v-if="form.connectMethod === 'other'" class="flex items-center gap-[6px]"><span class="text-[12px] text-text-tertiary whitespace-nowrap"><span class="req-mark">*</span>其他内容：</span><a-input v-model:value="form.connectMethodCustom" placeholder="请输入" style="width: 180px" /></div>
                  </div>
                </td>
              </tr>
              <tr v-if="form.systemInterconnect === 'associated'">
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">系统关联名称<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-form-item name="relatedSystemName" :rules="[{ required: true, message: '请输入系统关联名称' }]" class="!mb-0">
                    <a-input v-model:value="form.relatedSystemName" placeholder="请输入系统关联名称" />
                  </a-form-item>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- ===== 所属网络 ===== -->
          <a-divider dashed />
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[3px] h-[14px] bg-text-tertiary rounded-full" />
            <span class="text-[13px] font-medium text-text-primary">所属网络</span>
          </div>

          <table class="w-full border-collapse text-[14px] table-fixed">
            <tbody>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">所属网络<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]">
                  <div class="flex items-center gap-[12px]">
                    <a-form-item name="networkScope" :rules="[{ required: true, type: 'array', message: '请选择所属网络' }]" class="!mb-0">
                      <a-checkbox-group v-model:value="form.networkScope">
                        <a-checkbox value="internet">互联网</a-checkbox>
                        <a-checkbox value="biz专网">业务专网</a-checkbox>
                        <a-checkbox value="other">其他网络</a-checkbox>
                      </a-checkbox-group>
                    </a-form-item>
                    <div v-if="form.networkScope.includes('other')" class="flex items-center gap-[6px]"><span class="text-[12px] text-text-tertiary whitespace-nowrap"><span class="req-mark">*</span>其他内容：</span><a-input v-model:value="form.networkScopeCustom" placeholder="请输入" style="width: 180px" /></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">网络覆盖范围<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-form-item name="networkCoverage" :rules="[{ required: true, type: 'array', message: '请选择网络覆盖范围' }]" class="!mb-0">
                    <a-checkbox-group v-model:value="form.networkCoverage">
                      <a-checkbox value="city">市级</a-checkbox>
                      <a-checkbox value="district">区县（开发区）</a-checkbox>
                      <a-checkbox value="township">乡镇（街道）</a-checkbox>
                      <a-checkbox value="village">村（居）</a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">系统网络拓扑及说明<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-form-item name="networkTopology" :rules="[{ required: true, message: '请选择系统网络拓扑及说明' }]" class="!mb-0">
                    <a-radio-group v-model:value="form.networkTopology">
                      <a-radio value="has">有（请附网络拓扑图）</a-radio>
                      <a-radio value="none">无</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </td>
              </tr>
              <tr v-if="form.networkTopology === 'has'">
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">网络拓扑图<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-form-item name="networkTopologyFile" :rules="[{ required: true, type: 'array', message: '请上传网络拓扑图' }]" class="!mb-0">
                    <div class="flex items-center gap-[8px]">
                      <a-upload v-model:file-list="form.networkTopologyFile" :before-upload="() => false" accept=".pdf,.jpg,.jpeg,.png" :max-count="1">
                        <a-button><UploadOutlined /> 上传文件</a-button>
                      </a-upload>
                      <span class="text-[12px] text-text-tertiary whitespace-nowrap">支持 PDF/JPG/JPEG/PNG，≤ 50MB</span>
                    </div>
                  </a-form-item>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- ===== 系统安全 ===== -->
          <a-divider dashed />
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[3px] h-[14px] bg-text-tertiary rounded-full" />
            <span class="text-[13px] font-medium text-text-primary">系统安全</span>
          </div>

          <table class="w-full border-collapse text-[14px] table-fixed">
            <tbody>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">系统等级保护定级情况<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]" colspan="3">
                  <a-form-item name="protectionLevel" :rules="[{ required: true, message: '请选择系统等级保护定级情况' }]" class="!mb-0">
                    <a-radio-group v-model:value="form.protectionLevel">
                      <a-radio value="level2">二级</a-radio>
                      <a-radio value="level3">三级</a-radio>
                      <a-radio value="level4">四级</a-radio>
                      <a-radio value="level5">五级</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">等保备案情况<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]" :colspan="form.protectionFiling === 'filed' ? 1 : 3">
                  <a-form-item name="protectionFiling" :rules="[{ required: true, message: '请选择等保备案情况' }]" class="!mb-0">
                    <a-radio-group v-model:value="form.protectionFiling">
                      <a-radio value="filed">已备案</a-radio>
                      <a-radio value="notFiled">未备案</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </td>
                <template v-if="form.protectionFiling === 'filed'">
                  <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">等保备案号<span class="req-mark">*</span></td>
                  <td class="border border-border px-[12px] py-[8px]">
                    <a-input v-model:value="form.filingNumber" placeholder="请输入等保备案号" />
                  </td>
                </template>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">系统分级保护定级情况<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]" colspan="3">
                  <a-form-item name="classifiedProtection" :rules="[{ required: true, message: '请选择系统分级保护定级情况' }]" class="!mb-0">
                    <a-radio-group v-model:value="form.classifiedProtection">
                      <a-radio value="secret">秘密</a-radio>
                      <a-radio value="confidential">机密</a-radio>
                      <a-radio value="topSecret">绝密</a-radio>
                      <a-radio value="none">无涉密</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">分级保护备案情况<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]" :colspan="form.classifiedFiling === 'filed' ? 1 : 3">
                  <a-form-item name="classifiedFiling" :rules="[{ required: true, message: '请选择分级保护备案情况' }]" class="!mb-0">
                    <a-radio-group v-model:value="form.classifiedFiling">
                      <a-radio value="filed">已备案</a-radio>
                      <a-radio value="notFiled">未备案</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </td>
                <template v-if="form.classifiedFiling === 'filed'">
                  <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">分保备案号<span class="req-mark">*</span></td>
                  <td class="border border-border px-[12px] py-[8px]">
                    <a-input v-model:value="form.classifiedFilingNumber" placeholder="请输入分保备案号" />
                  </td>
                </template>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">安全测评及备案报告<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]" colspan="3">
                  <a-form-item name="securityAssessment" :rules="[{ required: true, message: '请选择安全测评及备案报告' }]" class="!mb-0">
                    <a-radio-group v-model:value="form.securityAssessment">
                      <a-radio value="has">有（请附测评报告）</a-radio>
                      <a-radio value="none">无</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </td>
              </tr>
              <tr v-if="form.securityAssessment === 'has'">
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">测评报告<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]" colspan="3">
                  <div class="flex items-center gap-[8px]">
                    <a-upload v-model:file-list="form.securityAssessmentFile" :before-upload="() => false" accept=".pdf,.jpg,.jpeg,.png" :max-count="1">
                      <a-button><UploadOutlined /> 上传文件</a-button>
                    </a-upload>
                    <span class="text-[12px] text-text-tertiary whitespace-nowrap">支持 PDF/JPG/JPEG/PNG，≤ 50MB</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- 组件共享区块（基础服务不涉及，已去掉；能力组件表单中保留） -->

          <!-- ===== 数据共享 ===== -->
          <a-divider dashed />
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[3px] h-[14px] bg-text-tertiary rounded-full" />
            <span class="text-[13px] font-medium text-text-primary">数据共享</span>
          </div>

          <table class="w-full border-collapse text-[14px] table-fixed">
            <tbody>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">是否能够接入市共享系统<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]" colspan="3">
                  <a-form-item name="dataShareAccess" :rules="[{ required: true, message: '请选择是否能够接入市共享系统' }]" class="!mb-0">
                    <a-radio-group v-model:value="form.dataShareAccess">
                      <a-radio value="yes">是</a-radio>
                      <a-radio value="no">否</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">数据共享类型<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]" colspan="3">
                  <a-form-item name="dataShareType" :rules="[{ required: true, message: '请选择数据共享类型' }]" class="!mb-0">
                    <a-radio-group v-model:value="form.dataShareType">
                      <a-radio value="unconditional">无条件共享</a-radio>
                      <a-radio value="conditional">有条件共享（请注明文件依据）</a-radio>
                      <a-radio value="refuse">不予共享（请注明文件依据）</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </td>
              </tr>
              <tr v-if="form.dataShareType === 'conditional' || form.dataShareType === 'refuse'">
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">文件依据<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]" colspan="3">
                  <div class="relative">
                    <a-textarea v-model:value="form.dataShareBasis" :rows="2" placeholder="请注明文件依据" :maxlength="500" class="!pb-[28px]" />
                    <div class="absolute right-[8px] bottom-[6px] text-[12px] text-text-tertiary pointer-events-none">{{ (form.dataShareBasis || '').length }}/500</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">数据共享方式<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]" colspan="3">
                  <div class="flex items-center gap-[12px]">
                    <a-form-item name="dataShareMode" :rules="[{ required: true, message: '请选择数据共享方式' }]" class="!mb-0">
                      <a-radio-group v-model:value="form.dataShareMode">
                        <a-radio value="api">API接口共享</a-radio>
                        <a-radio value="db">数据库共享</a-radio>
                        <a-radio value="file">数据文件共享</a-radio>
                        <a-radio value="other">其他</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <div v-if="form.dataShareMode === 'other'" class="flex items-center gap-[6px]"><span class="text-[12px] text-text-tertiary whitespace-nowrap"><span class="req-mark">*</span>其他内容：</span><a-input v-model:value="form.dataShareModeCustom" placeholder="请输入" style="width: 180px" /></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">数据资源目录<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]" colspan="3">
                  <a-form-item name="dataResourceCatalog" :rules="[{ required: true, message: '请选择数据资源目录' }]" class="!mb-0">
                    <a-radio-group v-model:value="form.dataResourceCatalog">
                      <a-radio value="has">有（请附数据资源目录附件）</a-radio>
                      <a-radio value="none">无</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </td>
              </tr>
              <tr v-if="form.dataResourceCatalog === 'has'">
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">数据资源目录附件<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]" colspan="3">
                  <div class="flex items-center gap-[8px]">
                    <a-upload v-model:file-list="form.dataResourceCatalogFile" :before-upload="() => false" accept=".pdf,.jpg,.jpeg,.png" :max-count="1">
                      <a-button><UploadOutlined /> 上传文件</a-button>
                    </a-upload>
                    <span class="text-[12px] text-text-tertiary whitespace-nowrap">支持 PDF/JPG/JPEG/PNG，≤ 50MB</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- ===== 密码应用 ===== -->
          <a-divider dashed />
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[3px] h-[14px] bg-text-tertiary rounded-full" />
            <span class="text-[13px] font-medium text-text-primary">密码应用</span>
          </div>

          <table class="w-full border-collapse text-[14px] table-fixed">
            <tbody>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">系统使用的密码产品情况<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]" colspan="3">
                  <a-form-item name="cipherProduct" :rules="[{ required: true, message: '请选择系统使用的密码产品情况' }]" class="!mb-0">
                    <a-radio-group v-model:value="form.cipherProduct" class="flex flex-col gap-y-[10px]">
                      <a-radio value="coreCipher">核心密码</a-radio>
                      <a-radio value="generalCipher">普通密码</a-radio>
                      <a-radio value="commercialCipher">商用密码</a-radio>
                      <a-radio value="productCount" class="cipher-complex-radio">
                        <span class="text-[13px] leading-[1.6]">
                          系统使用密码产品<a-input-number v-model:value="form.cipherProductTotal" :min="0" class="cipher-inline-input" size="small" />（台/套），其中：独立使用<a-input-number v-model:value="form.cipherProductIndependent" :min="0" class="cipher-inline-input" size="small" />（台/套），共享使用<a-input-number v-model:value="form.cipherProductShared" :min="0" class="cipher-inline-input" size="small" />（台/套）
                        </span>
                      </a-radio>
                      <a-radio value="approval" class="cipher-complex-radio">
                        <span class="text-[13px] leading-[1.6]">
                          已取得国家密码管理局审批型号的产品<a-input-number v-model:value="form.cipherProductApproved" :min="0" class="cipher-inline-input" size="small" />（台/套），未取得审批型号的产品<a-input-number v-model:value="form.cipherProductUnapproved" :min="0" class="cipher-inline-input" size="small" />（台/套）
                        </span>
                      </a-radio>
                      <a-radio value="noCipher">系统未使用密码产品</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">密码应用方案和密码应用安全性评估<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]" colspan="3">
                  <a-form-item name="cipherAssessment" :rules="[{ required: true, message: '请选择密码应用方案和密码应用安全性评估' }]" class="!mb-0">
                    <a-radio-group v-model:value="form.cipherAssessment">
                      <a-radio value="has">有（请附测评报告）</a-radio>
                      <a-radio value="none">无</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </td>
              </tr>
              <tr v-if="form.cipherAssessment === 'has'">
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">测评报告<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]" colspan="3">
                  <div class="flex items-center gap-[8px]">
                    <a-upload v-model:file-list="form.cipherAssessmentFile" :before-upload="() => false" accept=".pdf,.jpg,.jpeg,.png" :max-count="1">
                      <a-button><UploadOutlined /> 上传文件</a-button>
                    </a-upload>
                    <span class="text-[12px] text-text-tertiary whitespace-nowrap">支持 PDF/JPG/JPEG/PNG，≤ 50MB</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">国产适配<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]" colspan="3">
                  <a-form-item name="domesticAdaptation" :rules="[{ required: true, message: '请选择国产适配' }]" class="!mb-0">
                    <a-radio-group v-model:value="form.domesticAdaptation">
                      <a-radio value="domestic">国产化产品</a-radio>
                      <a-radio value="nonDomesticAdapted">非国产化产品，已完成适配</a-radio>
                      <a-radio value="nonDomestic">非国产化产品</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <!-- ===== 系统运维情况 ===== -->
        <section v-show="currentStep === 1" class="cloud-card p-[20px] mb-[14px]">
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[4px] h-[16px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">系统运维情况</span>
          </div>

          <table class="w-full border-collapse text-[14px] table-fixed">
            <tbody>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">运维模式<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-form-item name="opsMode" :rules="[{ required: true, message: '请选择运维模式' }]" class="!mb-0">
                    <a-radio-group v-model:value="form.opsMode">
                      <a-radio value="unified">统一运维</a-radio>
                      <a-radio value="distributed">分级运维</a-radio>
                      <a-radio value="partialOutsource">部分服务外包</a-radio>
                      <a-radio value="none">无运维</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">主要运维内容<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-form-item name="opsContent" :rules="[{ required: true, message: '请输入主要运维内容' }]" class="!mb-0">
                    <div class="relative">
                      <a-textarea v-model:value="form.opsContent" :rows="3" placeholder="请描述主要运维内容（300字以内）" :maxlength="300" class="!pb-[28px]" />
                      <div class="absolute right-[8px] bottom-[6px] text-[12px] text-text-tertiary pointer-events-none">{{ form.opsContent.length }}/300</div>
                    </div>
                  </a-form-item>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <!-- ===== 建设预期指标 ===== -->
        <section v-show="currentStep === 1" class="cloud-card p-[20px] mb-[14px]">
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[4px] h-[16px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">建设预期指标</span>
          </div>

          <table class="w-full border-collapse text-[14px] table-fixed">
            <thead>
              <tr>
                <th class="border border-border px-[12px] py-[8px] bg-bg text-left font-medium text-text-primary w-[35%]">指标</th>
                <th class="border border-border px-[12px] py-[8px] bg-bg text-left font-medium text-text-primary w-[20%]">指标值</th>
                <th class="border border-border px-[12px] py-[8px] bg-bg text-left font-medium text-text-primary w-[25%]">指标性质</th>
                <th class="border border-border px-[12px] py-[8px] bg-bg text-left font-medium text-text-primary w-[20%]">计量单位</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-border px-[12px] py-[8px] text-text-primary">系统使用用户数量</td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-input-number v-model:value="form.expectedUsers" :min="0" placeholder="预估值" style="width: 100%" />
                </td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-select v-model:value="form.expectedUsersType" style="width: 100%" placeholder="请选择">
                    <a-select-option value=">=">≥</a-select-option>
                    <a-select-option value="<=">≤</a-select-option>
                    <a-select-option value="=">=</a-select-option>
                  </a-select>
                </td>
                <td class="border border-border px-[12px] py-[8px] text-text-secondary">个</td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] text-text-primary">系统响应时间（简单操作）</td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-input-number v-model:value="form.responseTimeSimple" :min="0" placeholder="详细值" style="width: 100%" />
                </td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-select v-model:value="form.responseTimeSimpleType" style="width: 100%" placeholder="请选择">
                    <a-select-option value=">=">≥</a-select-option>
                    <a-select-option value="<=">≤</a-select-option>
                    <a-select-option value="=">=</a-select-option>
                  </a-select>
                </td>
                <td class="border border-border px-[12px] py-[8px] text-text-secondary">毫秒</td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] text-text-primary">系统响应时间（复杂操作）</td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-input-number v-model:value="form.responseTimeComplex" :min="0" placeholder="详细值" style="width: 100%" />
                </td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-select v-model:value="form.responseTimeComplexType" style="width: 100%" placeholder="请选择">
                    <a-select-option value=">=">≥</a-select-option>
                    <a-select-option value="<=">≤</a-select-option>
                    <a-select-option value="=">=</a-select-option>
                  </a-select>
                </td>
                <td class="border border-border px-[12px] py-[8px] text-text-secondary">毫秒</td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] text-text-primary">系统最大并发数</td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-input-number v-model:value="form.maxConcurrency" :min="0" placeholder="详细值" style="width: 100%" />
                </td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-select v-model:value="form.maxConcurrencyType" style="width: 100%" placeholder="请选择">
                    <a-select-option value=">=">≥</a-select-option>
                    <a-select-option value="<=">≤</a-select-option>
                    <a-select-option value="=">=</a-select-option>
                  </a-select>
                </td>
                <td class="border border-border px-[12px] py-[8px] text-text-secondary">个</td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] text-text-primary">共享数据目录条数</td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-input-number v-model:value="form.sharedDataCount" :min="0" placeholder="详细值" style="width: 100%" />
                </td>
                <td class="border border-border px-[12px] py-[8px]">
                  <a-select v-model:value="form.sharedDataCountType" style="width: 100%" placeholder="请选择">
                    <a-select-option value=">=">≥</a-select-option>
                    <a-select-option value="<=">≤</a-select-option>
                    <a-select-option value="=">=</a-select-option>
                  </a-select>
                </td>
                <td class="border border-border px-[12px] py-[8px] text-text-secondary">条</td>
              </tr>
            </tbody>
          </table>
        </section>

        <!-- ==================== Step 3: 产品或服务的基本情况 ==================== -->
        <section v-show="currentStep === 2" class="cloud-card p-[20px] mb-[14px]">
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[4px] h-[16px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">产品或服务的基本情况</span>
          </div>

          <table class="w-full border-collapse text-[14px] table-fixed">
            <tbody>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">主要产品或服务详细功能介绍<span class="req-mark">*</span></td>
                <td class="border border-border px-[12px] py-[8px]" colspan="3">
                  <a-form-item name="productDetailIntro" :rules="[{ required: true, message: '请填写主要产品或服务详细功能介绍' }]" class="!mb-0">
                    <div class="relative">
                      <a-textarea v-model:value="form.productDetailIntro" :rows="4" placeholder="请详细介绍主要产品或服务的功能模块、核心业务流程等" :maxlength="1000" class="!pb-[28px]" />
                      <div class="absolute right-[8px] bottom-[6px] text-[12px] text-text-tertiary pointer-events-none">{{ form.productDetailIntro.length }}/1000</div>
                    </div>
                  </a-form-item>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">性能指标</td>
                <td class="border border-border px-[12px] py-[8px]" colspan="3">
                  <div class="relative">
                    <a-textarea v-model:value="form.performanceMetrics" :rows="4" placeholder="包括服务性能指标、网络性能指标、云性能指标等" :maxlength="1000" class="!pb-[28px]" />
                    <div class="absolute right-[8px] bottom-[6px] text-[12px] text-text-tertiary pointer-events-none">{{ form.performanceMetrics.length }}/1000</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">安全性介绍</td>
                <td class="border border-border px-[12px] py-[8px]" colspan="3">
                  <div class="relative">
                    <a-textarea v-model:value="form.securityIntro" :rows="4" placeholder="包括安全管理制度、访问控制、系统安全、数据安全、身份验证安全、用户隐私等" :maxlength="1000" class="!pb-[28px]" />
                    <div class="absolute right-[8px] bottom-[6px] text-[12px] text-text-tertiary pointer-events-none">{{ form.securityIntro.length }}/1000</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">可靠性介绍</td>
                <td class="border border-border px-[12px] py-[8px]" colspan="3">
                  <div class="relative">
                    <a-textarea v-model:value="form.reliabilityIntro" :rows="3" placeholder="请描述系统可靠性保障措施（如容灾备份、故障恢复等）" :maxlength="1000" class="!pb-[28px]" />
                    <div class="absolute right-[8px] bottom-[6px] text-[12px] text-text-tertiary pointer-events-none">{{ form.reliabilityIntro.length }}/1000</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">易用性介绍</td>
                <td class="border border-border px-[12px] py-[8px]" colspan="3">
                  <div class="relative">
                    <a-textarea v-model:value="form.usabilityIntro" :rows="3" placeholder="请描述系统易用性设计（如界面设计、操作便捷性等）" :maxlength="1000" class="!pb-[28px]" />
                    <div class="absolute right-[8px] bottom-[6px] text-[12px] text-text-tertiary pointer-events-none">{{ form.usabilityIntro.length }}/1000</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">可维护性介绍</td>
                <td class="border border-border px-[12px] py-[8px]" colspan="3">
                  <div class="relative">
                    <a-textarea v-model:value="form.maintainabilityIntro" :rows="3" placeholder="请描述系统可维护性（如日志管理、版本更新、故障排查等）" :maxlength="1000" class="!pb-[28px]" />
                    <div class="absolute right-[8px] bottom-[6px] text-[12px] text-text-tertiary pointer-events-none">{{ form.maintainabilityIntro.length }}/1000</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- 管理员专属字段 -->
          <template v-if="!isShelfMode">
            <a-divider dashed />
            <div class="flex items-center gap-[8px] mb-[16px]">
              <div class="w-[4px] h-[16px] bg-warning rounded-full" />
              <span class="text-[14px] font-semibold text-text-primary">管理信息</span>
              <span class="text-[11px] text-text-tertiary">仅管理员可见</span>
            </div>
            <table class="w-full border-collapse text-[14px] table-fixed">
              <tbody>
                <tr>
                  <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">显示顺序</td>
                  <td class="border border-border px-[12px] py-[8px]">
                    <a-input-number v-model:value="form.sortOrder" :min="0" style="width: 100%" />
                  </td>
                  <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">服务征集得分</td>
                  <td class="border border-border px-[12px] py-[8px]">
                    <a-input-number v-model:value="form.recruitScore" :min="0" :step="0.1" style="width: 100%" placeholder="请输入服务征集得分" />
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
        </section>

        <!-- ==================== Step 4: 相关附件 ==================== -->
        <section v-show="currentStep === 3" class="cloud-card p-[20px] mb-[14px]">
          <div class="flex items-center gap-[8px] mb-[16px]">
            <div class="w-[4px] h-[16px] bg-primary rounded-full" />
            <span class="text-[14px] font-semibold text-text-primary">相关附件</span>
            <span class="text-[11px] text-text-tertiary">请上传相关资质证明材料</span>
          </div>

          <table class="w-full border-collapse text-[14px] table-fixed">
            <tbody>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px] align-top">申报单位营业执照<br/><span class="text-[12px] text-text-tertiary font-normal">（若为分支机构，请提供总公司出具的授权文件）</span></td>
                <td class="border border-border px-[12px] py-[8px]" colspan="3">
                  <div class="flex items-center gap-[8px]">
                    <a-upload v-model:file-list="form.bizLicense" :before-upload="() => false" accept=".pdf,.jpg,.jpeg,.png" :multiple="true">
                      <a-button><UploadOutlined /> 上传文件</a-button>
                    </a-upload>
                    <span class="text-[12px] text-text-tertiary whitespace-nowrap">支持 PDF/JPG/JPEG/PNG，≤ 50MB</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">企业资质证明材料</td>
                <td class="border border-border px-[12px] py-[8px]" colspan="3">
                  <div class="flex items-center gap-[8px]">
                    <a-upload v-model:file-list="form.enterpriseQualification" :before-upload="() => false" accept=".pdf,.jpg,.jpeg,.png" :multiple="true">
                      <a-button><UploadOutlined /> 上传文件</a-button>
                    </a-upload>
                    <span class="text-[12px] text-text-tertiary whitespace-nowrap">支持 PDF/JPG/JPEG/PNG，≤ 50MB</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px] align-top">典型案例企业证明材料<br/><span class="text-[12px] text-text-tertiary font-normal">（如合同、用户报告或反馈意见等）</span></td>
                <td class="border border-border px-[12px] py-[8px]" colspan="3">
                  <div class="flex items-center gap-[8px]">
                    <a-upload v-model:file-list="form.typicalCase" :before-upload="() => false" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" :multiple="true">
                      <a-button><UploadOutlined /> 上传文件</a-button>
                    </a-upload>
                    <span class="text-[12px] text-text-tertiary whitespace-nowrap">支持 PDF/图片/Word，≤ 50MB</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">参与服务的团队能力及相关证明材料</td>
                <td class="border border-border px-[12px] py-[8px]" colspan="3">
                  <div class="flex items-center gap-[8px]">
                    <a-upload v-model:file-list="form.teamAbility" :before-upload="() => false" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" :multiple="true">
                      <a-button><UploadOutlined /> 上传文件</a-button>
                    </a-upload>
                    <span class="text-[12px] text-text-tertiary whitespace-nowrap">支持 PDF/图片/Word，≤ 50MB</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">《信息安全等级保护》相关证明材料</td>
                <td class="border border-border px-[12px] py-[8px]" colspan="3">
                  <div class="flex items-center gap-[8px]">
                    <a-upload v-model:file-list="form.securityReport" :before-upload="() => false" accept=".pdf,.jpg,.jpeg,.png" :multiple="true">
                      <a-button><UploadOutlined /> 上传文件</a-button>
                    </a-upload>
                    <span class="text-[12px] text-text-tertiary whitespace-nowrap">支持 PDF/JPG/JPEG/PNG，≤ 50MB</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px]">商用密码产品认证能力相关证明材料</td>
                <td class="border border-border px-[12px] py-[8px]" colspan="3">
                  <div class="flex items-center gap-[8px]">
                    <a-upload v-model:file-list="form.cipherCert" :before-upload="() => false" accept=".pdf,.jpg,.jpeg,.png" :multiple="true">
                      <a-button><UploadOutlined /> 上传文件</a-button>
                    </a-upload>
                    <span class="text-[12px] text-text-tertiary whitespace-nowrap">支持 PDF/JPG/JPEG/PNG，≤ 50MB</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="border border-border px-[12px] py-[8px] bg-bg text-text-secondary font-medium w-[200px] align-top">其他相关文件及其他需要说明的情况<br/><span class="text-[12px] text-text-tertiary font-normal">（如：第三方服务产品授权函）</span></td>
                <td class="border border-border px-[12px] py-[8px]" colspan="3">
                  <div class="flex items-center gap-[8px]">
                    <a-upload v-model:file-list="form.otherFiles" :before-upload="() => false" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" :multiple="true">
                      <a-button><UploadOutlined /> 上传文件</a-button>
                    </a-upload>
                    <span class="text-[12px] text-text-tertiary whitespace-nowrap">支持 PDF/图片/Word，≤ 50MB</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

      </a-form>
    </main>
  </div>
</template>

<script>
import { ArrowLeftOutlined, PictureOutlined, PlusOutlined, CloseOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { message, Modal, Upload } from 'ant-design-vue';
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
        orgNature: undefined,
        establishDate: '2020-03-15',
        regProvince: '重庆市',
        regCity: '重庆市',
        regDistrict: '渝北区',
        regDetail: '龙山街道XXX号',
        bizProvince: '重庆市',
        bizCity: '重庆市',
        bizDistrict: '渝北区',
        bizDetail: '龙山街道XXX号',
        contactPerson: '',
        contactPhone: '',
        contactPosition: '',
        contactEmail: '',
        orgIntro: '',
        appServiceIntro: '',
        mainProductIntro: '',
        hrIntro: '',
        authenticityCommit: [],

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
        // 系统基本情况
        systemName: '',
        builderVendor: '重庆市卫生健康信息技术有限公司',
        sysContactName: '',
        sysContactPhone: '',
        sysContact2Name: '',
        sysContact2Phone: '',
        servicePricing: '',
        totalInvestment: undefined,
        systemMainFunc: '',
        systemUrl: '',
        systemStructure: undefined,
        systemStructureCustom: '',
        serviceTarget: [],
        serviceTargetCustom: '',
        coverageScope: '',
        publishTerminal: [],
        publishTerminal: [],
        publishTerminalCustom: '',
        systemIntegration: undefined,
        systemIntegrationNote: '',
        // 技术架构详情
        databaseType: '',
        programLang: '',
        middlewareType: '',
        deployMethod: undefined,
        deployMethodCustom: '',
        deployLocation: '',
        cloudProviderName: [],
        cloudServiceMode: [],
        // 主要设备
        serverName: '',
        serverConfig: '',
        serverDeployMode: [],
        storageName: '',
        storageDevice: '',
        storageDeployMode: [],
        backupName: '',
        backupDevice: '',
        backupDeployMode: [],
        networkName: '',
        networkDevice: '',
        networkDeployMode: [],
        otherName: '',
        otherDevice: '',
        otherDeployMode: [],
        // 网络与连接
        systemInterconnect: undefined,
        relatedSystemName: '',
        connectMethod: undefined,
        connectMethodCustom: '',
        networkScope: [],
        networkScopeCustom: '',
        networkCoverage: [],
        networkTopology: undefined,
        networkTopologyFile: [],
        // 安全与密码
        protectionLevel: undefined,
        protectionFiling: undefined,
        filingNumber: '',
        classifiedProtection: undefined,
        classifiedFiling: undefined,
        classifiedFilingNumber: '',
        securityAssessment: undefined,
        securityAssessmentFile: [],
        componentShare: undefined,
        componentSplit: undefined,
        componentShareMode: [],
        componentShareModeCustom: '',
        dataShareAccess: undefined,
        dataShareType: undefined,
        dataShareBasis: '',
        dataShareMode: undefined,
        dataShareModeCustom: '',
        dataResourceCatalog: undefined,
        dataResourceCatalogFile: [],
        cipherProduct: undefined,
        cipherProductTotal: undefined,
        cipherProductIndependent: undefined,
        cipherProductShared: undefined,
        cipherProductApproved: undefined,
        cipherProductUnapproved: undefined,
        domesticAdaptation: undefined,
        cipherAssessment: undefined,
        cipherAssessmentFile: [],
        // 运维情况
        opsMode: undefined,
        opsContent: '',
        // 系统建议预期指标
        expectedUsers: undefined,
        expectedUsersType: undefined,
        responseTimeSimple: undefined,
        responseTimeSimpleType: undefined,
        responseTimeComplex: undefined,
        responseTimeComplexType: undefined,
        maxConcurrency: undefined,
        maxConcurrencyType: undefined,
        sharedDataCount: undefined,
        sharedDataCountType: undefined,

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
        productDetailIntro: '',
        performanceMetrics: '',
        securityIntro: '',
        reliabilityIntro: '',
        usabilityIntro: '',
        maintainabilityIntro: '',
        sortOrder: 0,
        recruitScore: undefined,

        // Step4: 相关附件
        bizLicense: [],
        securityReport: [],
        ipCertificate: [],
        otherCerts: [],
        serviceAgreement: [],
        enterpriseQualification: [],
        typicalCase: [],
        teamAbility: [],
        cipherCert: [],
        financialReport: [],
        creditReport: [],
        dataSecurityCommitment: [],
        authenticityStatement: [],
        operationPlan: [],
        otherFiles: [],
      },
      deviceList: [
        { key: 'server', label: '服务器', nameKey: 'serverName', namePlaceholder: '数量(台/套)、型号等', configPlaceholder: '示例：数量___（台/套），型号___，主要配置 4路8核 AMD 6136，16G内存，2*300G，设备原值___万元', configKey: 'serverConfig', deployKey: 'serverDeployMode' },
        { key: 'storage', label: '存储设备', nameKey: 'storageName', namePlaceholder: '数量(台/套)、型号等', configPlaceholder: '数量(台/套)、型号等', configKey: 'storageDevice', deployKey: 'storageDeployMode' },
        { key: 'backup', label: '备份设备', nameKey: 'backupName', namePlaceholder: '数量(台/套)、型号等', configPlaceholder: '数量(台/套)、型号等', configKey: 'backupDevice', deployKey: 'backupDeployMode' },
        { key: 'network', label: '网络设备', nameKey: 'networkName', namePlaceholder: '数量(台/套)、型号等', configPlaceholder: '数量(台/套)、型号等', configKey: 'networkDevice', deployKey: 'networkDeployMode' },
        { key: 'other', label: '其他设备', nameKey: 'otherName', namePlaceholder: '数量(台/套)、型号等', configPlaceholder: '数量(台/套)、型号等', configKey: 'otherDevice', deployKey: 'otherDeployMode' },
      ],
      orgNatureOptions: [
        { value: 'state', label: '国有' },
        { value: 'private', label: '民营' },
        { value: 'foreign', label: '三资' },
        { value: 'other', label: '其他' },
      ],
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
      return this.isEdit ? '编辑基础服务申报' : '新增基础服务申报';
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
        this.$refs.formRef.validateFields(['appServiceIntro', 'orgIntro', 'mainProductIntro', 'hrIntro', 'contactPerson', 'contactPhone']).then(() => {
          if (!this.form.authenticityCommit?.length) {
            message.warning('请上传《真实性承诺》');
            return;
          }
          this.currentStep = 1;
        }).catch(() => {});
        return;
      }
      this.$refs.formRef.validate().then(() => {
        if (!this.validateConditionalFields()) return;
        if (this.currentStep < 3) this.currentStep++;
      }).catch(() => {});
    },
    prevStep() {
      if (this.currentStep > 0) this.currentStep--;
    },
    demoNextStep() {
      if (this.currentStep < 3) this.currentStep++;
    },
    beforeAuthUpload(file) {
      if (file.size > 50 * 1024 * 1024) {
        message.warning('文件大小不能超过 50MB');
        return Upload.LIST_IGNORE;
      }
      return false;
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
      if (file.size > 10 * 1024 * 1024) {
        message.warning('LOGO 文件不能超过 10MB');
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
        if (!this.validateConditionalFields()) return;
        if (this.isShelfMode) {
          Modal.confirm({
            title: '确认提交申报？',
            content: '提交后将进入申报审核流程，是否确认提交？',
            okText: '确定',
            cancelText: '取消',
            getContainer: () => document.querySelector('.app-main') || document.body,
            onOk: () => {
              message.success('提交成功');
              this.$router.back();
            },
          });
          return;
        }
        message.success(this.isEdit ? '修改成功' : '新增成功');
        this.$router.back();
      }).catch(() => {
        this.jumpToFirstError();
      });
    },
    onSaveDraft() {
      message.success('草稿已保存');
    },
    validateConditionalFields() {
      const checks = [
        { show: true, val: this.form.authenticityCommit?.length, msg: '请上传《真实性承诺》' },
        ...this.deviceList.map(d => ({ show: true, val: this.form[d.deployKey]?.length, msg: `请勾选${d.label}的部署方式` })),
        { show: this.form.systemIntegration === 'partialIntegrated' || this.form.systemIntegration === 'other', val: this.form.systemIntegrationNote, msg: '请填写集成说明' },
        { show: this.form.systemStructure === 'other', val: this.form.systemStructureCustom, msg: '请填写系统结构其他内容' },
        { show: this.form.serviceTarget?.includes('other'), val: this.form.serviceTargetCustom, msg: '请填写服务对象其他内容' },
        { show: this.form.publishTerminal?.includes('other'), val: this.form.publishTerminalCustom, msg: '请填写应用发布终端其他内容' },
        { show: this.form.deployMethod === 'other', val: this.form.deployMethodCustom, msg: '请填写部署方式其他内容' },
        { show: this.form.connectMethod === 'other', val: this.form.connectMethodCustom, msg: '请填写连接方式其他内容' },
        { show: this.form.networkScope?.includes('other'), val: this.form.networkScopeCustom, msg: '请填写所属网络其他内容' },
        { show: this.form.dataShareMode === 'other', val: this.form.dataShareModeCustom, msg: '请填写数据共享方式其他内容' },
        { show: this.form.protectionFiling === 'filed', val: this.form.filingNumber, msg: '请填写等保备案号' },
        { show: this.form.classifiedFiling === 'filed', val: this.form.classifiedFilingNumber, msg: '请填写分级保护备案号' },
        { show: this.form.securityAssessment === 'has', val: this.form.securityAssessmentFile?.length, msg: '请上传安全测评及备案报告的测评报告' },
        { show: this.form.dataResourceCatalog === 'has', val: this.form.dataResourceCatalogFile?.length, msg: '请上传数据资源目录附件' },
        { show: this.form.cipherAssessment === 'has', val: this.form.cipherAssessmentFile?.length, msg: '请上传密码应用方案和密码应用安全性评估的测评报告' },
      ];
      for (const c of checks) {
        if (c.show && !c.val) {
          message.warning(c.msg);
          return false;
        }
      }
      return true;
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

/* 复选框组改为 flex 布局，用 gap 控制间距，保证单元格内垂直居中 */
:deep(.ant-checkbox-group) {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 16px;
}
:deep(.ant-checkbox-wrapper) {
  margin-right: 0;
  margin-bottom: 0;
}

:deep(.ant-steps-item-title) {
  font-size: 13px !important;
}

/* 表格单元格统一最低高度，与应用服务资费（show-count 输入框）行对齐 */
:deep(td) {
  min-height: 56px;
  vertical-align: middle;
  word-break: break-all;
}

/* 输入框占位符垂直居中 */
:deep(.ant-input-number-input) {
  line-height: normal;
}
:deep(.ant-input-number .ant-input-number-input) {
  height: 32px;
  line-height: 32px;
}
:deep(.ant-select-selector) {
  display: flex !important;
  align-items: center;
}

/* 必填星号固定占位，保持字段名称对齐 */
.req-mark {
  display: inline-block;
  width: 8px;
  color: #ff4d4f;
  flex-shrink: 0;
  margin-left: 2px;
}

/* 表格化表单样式 */
.form-table {
  border: 1px solid var(--border, #e8e8e8);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 16px;
}

.form-table-row {
  display: flex;
  align-items: flex-start;
  border-bottom: 1px solid var(--border-soft, #f0f0f0);
  min-height: 42px;
}

.form-table-row:last-child {
  border-bottom: none;
}

.form-table-row:nth-child(even) {
  background: var(--bg, #fafafa);
}

.form-table-label {
  width: 200px;
  min-width: 200px;
  padding: 10px 16px;
  font-size: 13px;
  color: var(--text-primary, #333);
  font-weight: 500;
  background: var(--bg, #f5f5f5);
  border-right: 1px solid var(--border-soft, #e8e8e8);
  display: flex;
  align-items: center;
}

.form-table-label.required::before {
  content: '*';
  color: #ff4d4f;
  margin-right: 4px;
}

.form-table-value {
  flex: 1;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.form-table-value :deep(.ant-form-item) {
  margin-bottom: 0;
  width: 100%;
}

.form-table-value :deep(.ant-form-item-label) {
  display: none;
}

.cipher-inline-input {
  width: 56px;
  display: inline-flex;
  vertical-align: middle;
  margin: 0 2px;
}

.cipher-inline-input :deep(.ant-input-number) {
  width: 56px;
  border: none;
  border-bottom: 1px solid #c9cdd4;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  padding: 0;
  height: 22px;
  line-height: 22px;
}

.cipher-inline-input :deep(.ant-input-number-handler-wrap) {
  display: none;
}

.cipher-inline-input :deep(.ant-input-number:hover),
.cipher-inline-input :deep(.ant-input-number-focused) {
  border-bottom-color: #165dff;
  box-shadow: none;
}

.cipher-inline-input :deep(.ant-input-number-input-wrap input) {
  text-align: center;
  height: 22px;
  line-height: 22px;
  padding: 0;
}

.cipher-complex-radio {
  align-items: flex-start;
  height: auto;
  padding-top: 3px;
}

.logo-preview {
  position: relative;
  display: inline-block;
}

.logo-remove {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  line-height: 16px;
  text-align: center;
  background: #ff4d4f;
  color: #fff;
  border-radius: 50%;
  font-size: 12px;
  cursor: pointer;
}
</style>