<template>
  <div class="component-audit-page">
    <PageHeader
      title="能力组件审核"
      description="审核机构提交的能力组件上架申请，支持按组件名称、开放范围和审核状态筛选"
    />

    <CloudCard class="component-audit-page__table-card">
      <FilterBar @search="handleQuery" @reset="resetQuery">
        <a-range-picker v-model:value="filter.submitTimeRange" :placeholder="['提交审核时间', '提交审核时间']" allow-clear style="width: 240px" value-format="YYYY-MM-DD" />
        <a-select v-model:value="filter.status" placeholder="审核状态" allow-clear style="width: 130px">
          <a-select-option value="10">待审核</a-select-option>
          <a-select-option value="20">已通过</a-select-option>
          <a-select-option value="30">已驳回</a-select-option>
        </a-select>
        <a-select v-model:value="filter.step" placeholder="审核阶段" allow-clear style="width: 150px">
          <a-select-option :value="1">申报材料评估</a-select-option>
          <a-select-option :value="2">应用技术测评</a-select-option>
          <a-select-option :value="3">现场演示答辩</a-select-option>
          <a-select-option :value="4">服务目录发布</a-select-option>
        </a-select>
        <a-input v-model:value="filter.name" placeholder="组件名称" allow-clear style="width: 160px" @pressEnter="handleQuery" />
        <a-input v-model:value="filter.componentId" placeholder="组件ID" allow-clear style="width: 160px" @pressEnter="handleQuery" />
        <a-input v-model:value="filter.serviceProvider" placeholder="服务商名称" allow-clear style="width: 160px" @pressEnter="handleQuery" />
        <template #suffix>
          <ColumnSettings v-model="hiddenKeys" :columns="columns" />
        </template>
      </FilterBar>
      <div class="component-audit-page__divider"></div>

      <div class="component-audit-page__table-wrap">
        <a-table :scroll="{ x: 1430 }"
          :columns="visibleColumns"
          :data-source="filteredData"
          :pagination="paginationConfig"
          :loading="loading"
          row-key="submissionId"
          size="middle"
          @change="onTableChange"
        >
          <template #bodyCell="{ column, record }">
            <span v-if="column.dataIndex === 'name'" class="cell-name">
              <span class="cell-name__title">{{ record.name || '--' }}</span>
              <span class="cell-name__id">{{ record.componentId || '--' }}</span>
            </span>
            <template v-else-if="column.dataIndex === 'auditStatus'">
              <StatusDot :type="getAuditStatusKey(record.auditStatus)" :text="getAuditStatusText(record.auditStatus)" />
            </template>
            <span v-else-if="column.dataIndex === 'submitTime'" class="cell-default">{{ record.submitTime || '--' }}</span>
            <span v-else-if="column.dataIndex === 'currentStep'" class="cell-default">{{ getStepName(record.currentStep) }}</span>
            <template v-else-if="column.dataIndex === 'action'">
              <a-space size="small">
                <a-button v-if="String(record.auditStatus) === '10'" type="link" size="small" class="!p-0" @click="startAudit(record)">审核</a-button>
                <a-button v-else type="link" size="small" class="!p-0" @click="viewDetails(record)">详情</a-button>
              </a-space>
            </template>
            <span v-else class="cell-default">{{ record[column.dataIndex] || '--' }}</span>
          </template>
        </a-table>
      </div>
    </CloudCard>

    <!-- 详情抽屉 -->
    <a-drawer :get-container="getDrawerContainer"
      v-model:open="drawer.visible"
      title="审核详情"
      :width="1100"
      placement="right"
      :body-style="{ padding: '24px' }"
    >
      <template v-if="drawer.record">
        <div class="drawer-header-row">
          <div class="drawer-header-icon">
            <img v-if="drawer.record.logo" :src="drawer.record.logo" class="drawer-header-logo" alt="" />
            <RobotOutlined v-else class="drawer-header-fallback" />
          </div>
          <div class="drawer-header-info">
            <div class="drawer-header-title-row">
              <span class="drawer-header-title">{{ drawer.record.name }}</span>
              <StatusDot :type="getAuditStatusKey(drawer.record.auditStatus)" :text="getAuditStatusText(drawer.record.auditStatus)" />
            </div>
            <div class="drawer-header-sub">
              <span>ID：{{ drawer.record.componentId || '--' }}</span>
            </div>
          </div>
        </div>

        <div class="drawer-split">
          <!-- 左侧：概览信息 -->
          <div class="drawer-split__left">
            <div class="split-section">
              <div class="split-section__title">基本信息</div>
              <a-descriptions :column="1" bordered size="small">
                <a-descriptions-item label="组件描述">
                  {{ drawer.record.description || '--' }}
                </a-descriptions-item>
                <a-descriptions-item label="付费方式参考">
                  {{ drawer.record.paymentMethodRef || '--' }}
                </a-descriptions-item>
              </a-descriptions>
            </div>
            <div class="split-section">
              <div class="split-section__title">联系信息</div>
              <a-descriptions :column="1" bordered size="small">
                <a-descriptions-item label="服务商名称">{{ drawer.record.serviceProviderName || '--' }}</a-descriptions-item>
                <a-descriptions-item label="联系方式1">
                  {{ drawer.record.contact1Name || '--' }} {{ drawer.record.contact1Phone || '' }}
                </a-descriptions-item>
                <a-descriptions-item label="联系方式2">
                  {{ drawer.record.contact2Name || '--' }} {{ drawer.record.contact2Phone || '' }}
                </a-descriptions-item>
              </a-descriptions>
            </div>
            <div class="split-section">
              <div class="split-section__title">分类标签</div>
              <a-descriptions :column="1" bordered size="small">
                <a-descriptions-item label="部署云服务商">{{ drawer.record.deployServiceProviderView || '--' }}</a-descriptions-item>
                <a-descriptions-item label="开放范围">{{ drawer.record.coverView || '--' }}</a-descriptions-item>
              </a-descriptions>
            </div>
          </div>

          <!-- 分割线 -->
          <div class="drawer-split__divider"></div>

          <!-- 右侧：审核进度 -->
          <div class="drawer-split__right">
            <div class="split-section">
              <div class="split-section__title">审核操作</div>

              <!-- 纵向步骤列表 -->
              <div class="step-list">
                <div
                  v-for="(step, idx) in auditSteps"
                  :key="step.key"
                  class="step-node"
                  :class="{
                    'step-node--done': isStepApproved(idx),
                    'step-node--rejected': isStepRejected(idx),
                    'step-node--active': isStepCurrent(idx)
                  }"
                >
                  <div class="step-node__indicator">
                    <div class="step-node__dot" :class="getStepIndexClass(idx)">
                      <CheckOutlined v-if="isStepApproved(idx)" />
                      <CloseOutlined v-else-if="isStepRejected(idx)" />
                      <span v-else>{{ idx + 1 }}</span>
                    </div>
                    <div v-if="idx < auditSteps.length - 1" class="step-node__line" :class="isStepApproved(idx) ? 'step-node__line--done' : ''"></div>
                  </div>

                  <div class="step-node__body">
                    <div class="step-node__header">
                      <span class="step-node__title">阶段 {{ idx + 1 }}：{{ step.title }}</span>
                      <span class="step-node__tag" :class="getStepTagClass(idx)">{{ getStepTagText(idx) }}</span>
                    </div>

                    <!-- 当前阶段 + 待审核：操作区 -->
                    <div v-if="isStepCurrent(idx) && isAuditing" class="step-node__action">
                      <div class="audit-textarea-wrap">
                        <a-textarea v-model:value="auditForm.opinion" :rows="3" :maxlength="200" placeholder="请输入审核意见" />
                        <span class="audit-textarea-count">{{ auditForm.opinion.length }}/200</span>
                      </div>
                      <div class="step-node__btns">
                        <a-button type="primary" size="small" @click="approve">
                          <template #icon><CheckOutlined /></template>
                          {{ getApproveText(idx) }}
                        </a-button>
                        <a-button size="small" @click="reject">驳回</a-button>
                      </div>
                    </div>

                    <!-- 已完成/已驳回：审核记录 -->
                    <div v-else-if="getStepRecord(idx)" class="step-node__record">
                      <div v-if="getStepRecord(idx).opinion" class="step-node__opinion">{{ getStepRecord(idx).opinion }}</div>
                      <div class="step-node__meta">
                        <span>{{ getStepRecord(idx).auditor }}</span>
                        <span>{{ formatTime(getStepRecord(idx).auditTime) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </a-drawer>
  </div>
</template>

<script>
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import FilterBar from '@/components/cloud/FilterBar.vue'
import StatusDot from '@/components/cloud/StatusDot.vue'
import ColumnSettings from '@/components/cloud/ColumnSettings.vue'
import {
  CheckOutlined, CloseOutlined, DownloadOutlined, FileOutlined,
  RobotOutlined
} from '@ant-design/icons-vue'
import { Modal, message } from 'ant-design-vue'
import { getDicts } from '@/api/system/dict/data'

export default {
  name: 'ComponentAudit',
  components: {
    PageHeader, CloudCard, FilterBar, StatusDot, ColumnSettings,
    CheckOutlined, CloseOutlined, DownloadOutlined, FileOutlined,
    RobotOutlined
  },
  data() {
    return {
      loading: false,
      hiddenKeys: [],
      filter: { name: '', componentId: '', serviceProvider: '', cloudProvider: undefined, cover: undefined, status: undefined, step: undefined, submitTimeRange: [] },
      applied: { name: '', componentId: '', serviceProvider: '', cloudProvider: undefined, cover: undefined, status: undefined, step: undefined, submitTimeRange: [] },
      pagination: { current: 1, pageSize: 10 },
      coverOptions: [],
      cloudProviderOptions: [
        { value: '电信云', label: '电信云' },
        { value: '移动云', label: '移动云' },
        { value: '联通云', label: '联通云' },
        { value: '浪潮云', label: '浪潮云' },
        { value: '紫光云', label: '紫光云' },
        { value: '影像云', label: '影像云' }
      ],
      columns: [
        { title: '提交审核时间', dataIndex: 'submitTime', key: 'submitTime', width: 170 },
        { title: '审核状态', dataIndex: 'auditStatus', key: 'auditStatus', width: 110 },
        { title: '审核阶段', dataIndex: 'currentStep', key: 'currentStep', width: 140 },
        { title: '能力组件名称/ID', dataIndex: 'name', key: 'name', width: 240 },
        { title: '组件描述', dataIndex: 'description', key: 'description', width: 300, customCell: () => ({ class: 'cell-wrap' }) },
        { title: '服务商名称', dataIndex: 'serviceProviderName', key: 'serviceProviderName', width: 150, ellipsis: true },
        { title: '部署云服务商', dataIndex: 'deployServiceProviderView', key: 'deployServiceProviderView', width: 120 },
        { title: '开放范围', dataIndex: 'coverView', key: 'coverView', width: 110 },
        { title: '操作', dataIndex: 'action', key: 'action', width: 90, fixed: 'right' }
      ],
      componentList: [
        { submissionId: 'NLZJ202410210001-V1', componentId: 'NLZJ202410210001', name: '电子健康卡', versionNo: 1, serviceGroup: 'GROUP_A', description: '电子健康卡是按照国家统一标准生成的、具备身份识别功能的「健康身份证」，可实现诊前、诊中、诊后各环节医疗服务「一码通用」。', serviceProviderName: '中科软科技', deployServiceProviderView: '影像云', coverView: '市级', auditStatus: 10, currentStep: 1, submitTime: '2026-10-21 10:43:04' },
        { submissionId: 'NLZJ202410220001-V1', componentId: 'NLZJ202410220001', name: '无界诊疗的云桌面系统', versionNo: 1, serviceGroup: 'GROUP_B', description: '提供手机、平板、笔记本等多种可移动接入的国产化云桌面诊疗终端，一套专属账号保障了所有数据的跟随。', serviceProviderName: '华为技术', deployServiceProviderView: '移动云', coverView: '区（县）域', auditStatus: 10, currentStep: 2, submitTime: '2026-10-22 14:08:38' },
        { submissionId: 'NLZJ202410240001-V1', componentId: 'NLZJ202410240001', name: '慧影影像AI辅助诊断整合工具', versionNo: 1, serviceGroup: 'GROUP_C', description: '通过运用云计算、大数据分析和机器学习等方法，提供面向临床的影像智能辅助诊断服务。', serviceProviderName: '东软集团', deployServiceProviderView: '浪潮云', coverView: '市级', auditStatus: 20, currentStep: 4, submitTime: '2026-10-24 14:59:25' },
        { submissionId: 'NLZJ202410240002-V1', componentId: 'NLZJ202410240002', name: '慧影影像分析工具', versionNo: 1, serviceGroup: 'GROUP_D', description: '以影像数据为驱动，融合放射组学、深度学习分析方法和人工智能技术，辅助医生完成高价值的科研工作。', serviceProviderName: '东软集团', deployServiceProviderView: '浪潮云', coverView: '不限', auditStatus: 20, currentStep: 4, submitTime: '2026-10-24 15:00:03' },
        { submissionId: 'NLZJ202410240003-V1', componentId: 'NLZJ202410240003', name: '慧影影像结果查看器组件', versionNo: 1, serviceGroup: 'GROUP_E', description: '患者可随时随地获取个人DICOM格式的影像数据和检查报告，支持通过电脑、平板、手机等移动终端查看。', serviceProviderName: '东软集团', deployServiceProviderView: '浪潮云', coverView: '不限', auditStatus: 30, currentStep: 3, submitTime: '2026-10-24 15:00:21' },
        { submissionId: 'NLZJ202410240004-V1', componentId: 'NLZJ202410240004', name: '医信签CA认证工具', versionNo: 1, serviceGroup: 'GROUP_F', description: '提供用户在线实名核验、CA数字证书签发、证书续期和基于数字证书的登录认证服务。', serviceProviderName: '北京数字认证', deployServiceProviderView: '浪潮云', coverView: '不限', auditStatus: 10, currentStep: 1, submitTime: '2026-10-24 15:00:40' },
        { submissionId: 'NLZJ202410240005-V1', componentId: 'NLZJ202410240005', name: '医信签医护电子签名工具', versionNo: 1, serviceGroup: 'GROUP_G', description: '为医护人员提供医疗文书电子签名服务，支持扫码签名、授权签名、移动签名、对方会签等多种方式。', serviceProviderName: '北京数字认证', deployServiceProviderView: '浪潮云', coverView: '不限', auditStatus: 20, currentStep: 4, submitTime: '2026-10-24 15:01:13' },
        { submissionId: 'NLZJ202410240005-V2', componentId: 'NLZJ202410240005', name: '医信签医护电子签名工具', versionNo: 2, serviceGroup: 'GROUP_G', description: '为医护人员提供医疗文书电子签名服务，支持扫码签名、授权签名、移动签名、对方会签等多种方式。', serviceProviderName: '北京数字认证', deployServiceProviderView: '浪潮云', coverView: '不限', auditStatus: 10, currentStep: 1, submitTime: '2026-10-24 15:01:13' },
        { submissionId: 'NLZJ202410240006-V1', componentId: 'NLZJ202410240006', name: '医信签患者电子签名工具', versionNo: 1, serviceGroup: 'GROUP_H', description: '为患者、家属提供医疗文书电子签名服务，支持智能签名屏、有线签字板、智能手机等多种终端。', serviceProviderName: '北京数字认证', deployServiceProviderView: '浪潮云', coverView: '不限', auditStatus: 30, currentStep: 2, submitTime: '2026-10-24 15:01:28' },
        { submissionId: 'NLZJ202410240007-V1', componentId: 'NLZJ202410240007', name: '亲笔签手写电子化签名与电子印章能力组件', versionNo: 1, serviceGroup: 'GROUP_I', description: '手写电子化签名与电子印章能力组件是电子文件、电子公文、电子病案的关键基础设施支撑。', serviceProviderName: '亲笔签科技', deployServiceProviderView: '浪潮云', coverView: '不限', auditStatus: 20, currentStep: 4, submitTime: '2026-10-24 15:01:43' },
        { submissionId: 'NLZJ202410240008-V1', componentId: 'NLZJ202410240008', name: '数科文档网页轻阅读组件', versionNo: 1, serviceGroup: 'GROUP_J', description: '系统提供在线预览和文件处理服务，实现多格式阅览、文件编辑、安全管控、可视化签章验章等特色功能。', serviceProviderName: '数科技术', deployServiceProviderView: '浪潮云', coverView: '不限', auditStatus: 20, currentStep: 4, submitTime: '2026-10-24 15:13:21' }
      ],
      drawer: { visible: false, record: null, activeTab: 'overview' },
      auditForm: { opinion: '' },
      activeStepIdx: 0,
      compDetailMock: {
        logo: '',
        contact1Name: '张经理',
        contact1Phone: '13800138000',
        contact2Name: '李助理',
        contact2Phone: '13900139000',
        paymentMethodRef: '按调用量计费，含技术支持服务，具体费用根据服务内容协商确定',
        sortOrder: 1
      },
      // 审核数据：按submissionId索引，每个提交含4阶段审核信息
      submissionAuditData: {
        'NLZJ202410210001-V1': {
          1: { id: 'SUB001_s1', status: 'processing', statusKey: 'processing', statusText: '进行中', auditor: '', auditTime: '', _records: [{ nodeType: 'submit', status: 'pending', submitTime: '2026-10-21 10:43:04', auditTime: '2026-10-21 10:43:04', remark: '机构提交申报材料', auditor: '', opinion: '' }] },
          2: { id: 'SUB001_s2', status: 'pending', statusKey: 'default', statusText: '未开始', auditor: '', auditTime: '', _records: [] },
          3: { id: 'SUB001_s3', status: 'pending', statusKey: 'default', statusText: '未开始', auditor: '', auditTime: '', _records: [] },
          4: { id: 'SUB001_s4', status: 'pending', statusKey: 'default', statusText: '未开始', auditor: '', auditTime: '', _records: [] }
        },
        'NLZJ202410220001-V1': {
          1: { id: 'SUB002_s1', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '李主管', auditTime: '2026-10-29 15:30', _records: [{ nodeType: 'submit', status: 'pending', submitTime: '2026-10-22 14:08:38', auditTime: '2026-10-22 14:08:38', remark: '机构提交申报材料', auditor: '', opinion: '' }, { nodeType: 'audit', status: 'approved', submitTime: '2026-10-22 14:08:38', auditTime: '2026-10-29 15:30', auditor: '李主管', opinion: '材料完整有效，本阶段通过' }] },
          2: { id: 'SUB002_s2', status: 'processing', statusKey: 'processing', statusText: '进行中', auditor: '', auditTime: '', _records: [{ nodeType: 'submit', status: 'pending', submitTime: '2026-10-30 09:00', auditTime: '2026-10-30 09:00', remark: '材料评估通过后自动进入技术测评', auditor: '', opinion: '' }] },
          3: { id: 'SUB002_s3', status: 'pending', statusKey: 'default', statusText: '未开始', auditor: '', auditTime: '', _records: [] },
          4: { id: 'SUB002_s4', status: 'pending', statusKey: 'default', statusText: '未开始', auditor: '', auditTime: '', _records: [] }
        },
        'NLZJ202410240001-V1': {
          1: { id: 'SUB003_s1', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '张主管', auditTime: '2026-11-01 10:30', _records: [{ nodeType: 'submit', status: 'pending', submitTime: '2026-10-24 14:59:25', auditTime: '2026-10-24 14:59:25', remark: '机构提交申报材料', auditor: '', opinion: '' }, { nodeType: 'audit', status: 'approved', submitTime: '2026-10-24 14:59:25', auditTime: '2026-11-01 10:30', auditor: '张主管', opinion: '材料齐全，审核通过' }] },
          2: { id: 'SUB003_s2', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '王工程师', auditTime: '2026-11-05 14:00', _records: [{ nodeType: 'submit', status: 'pending', submitTime: '2026-11-02 09:00', auditTime: '2026-11-02 09:00', remark: '材料评估通过后自动进入技术测评', auditor: '', opinion: '' }, { nodeType: 'audit', status: 'approved', submitTime: '2026-11-02 09:00', auditTime: '2026-11-05 14:00', auditor: '王工程师', opinion: '功能完整性和性能指标达标，技术测评通过' }] },
          3: { id: 'SUB003_s3', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '刘主任', auditTime: '2026-11-12 16:00', _records: [{ nodeType: 'submit', status: 'pending', submitTime: '2026-11-06 09:00', auditTime: '2026-11-06 09:00', remark: '技术测评通过，预约现场演示', auditor: '', opinion: '' }, { nodeType: 'audit', status: 'approved', submitTime: '2026-11-06 09:00', auditTime: '2026-11-12 16:00', auditor: '刘主任', opinion: '核心功能演示完整，AI辅助诊断效果显著，答辩通过' }] },
          4: { id: 'SUB003_s4', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '陈管理员', auditTime: '2026-11-15 11:00', _records: [{ nodeType: 'submit', status: 'pending', submitTime: '2026-11-13 09:00', auditTime: '2026-11-13 09:00', remark: '答辩通过，提交服务目录发布申请', auditor: '', opinion: '' }, { nodeType: 'audit', status: 'approved', submitTime: '2026-11-13 09:00', auditTime: '2026-11-15 11:00', auditor: '陈管理员', opinion: '发布信息配置正确，已上架至服务目录' }] }
        },
        'NLZJ202410240002-V1': {
          1: { id: 'SUB004_s1', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '张主管', auditTime: '2026-11-01 11:00', _records: [{ nodeType: 'submit', status: 'pending', submitTime: '2026-10-24 15:00:03', auditTime: '2026-10-24 15:00:03', remark: '机构提交申报材料', auditor: '', opinion: '' }, { nodeType: 'audit', status: 'approved', submitTime: '2026-10-24 15:00:03', auditTime: '2026-11-01 11:00', auditor: '张主管', opinion: '材料齐全，审核通过' }] },
          2: { id: 'SUB004_s2', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '王工程师', auditTime: '2026-11-05 15:30', _records: [{ nodeType: 'submit', status: 'pending', submitTime: '2026-11-02 09:00', auditTime: '2026-11-02 09:00', remark: '材料评估通过后自动进入技术测评', auditor: '', opinion: '' }, { nodeType: 'audit', status: 'approved', submitTime: '2026-11-02 09:00', auditTime: '2026-11-05 15:30', auditor: '王工程师', opinion: '影像分析能力满足需求，技术测评通过' }] },
          3: { id: 'SUB004_s3', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '刘主任', auditTime: '2026-11-12 17:00', _records: [{ nodeType: 'submit', status: 'pending', submitTime: '2026-11-06 09:00', auditTime: '2026-11-06 09:00', remark: '技术测评通过，预约现场演示', auditor: '', opinion: '' }, { nodeType: 'audit', status: 'approved', submitTime: '2026-11-06 09:00', auditTime: '2026-11-12 17:00', auditor: '刘主任', opinion: '放射组学分析流程演示清晰，答辩通过' }] },
          4: { id: 'SUB004_s4', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '陈管理员', auditTime: '2026-11-15 14:00', _records: [{ nodeType: 'submit', status: 'pending', submitTime: '2026-11-13 09:00', auditTime: '2026-11-13 09:00', remark: '答辩通过，提交服务目录发布申请', auditor: '', opinion: '' }, { nodeType: 'audit', status: 'approved', submitTime: '2026-11-13 09:00', auditTime: '2026-11-15 14:00', auditor: '陈管理员', opinion: '发布信息配置正确，已上架至服务目录' }] }
        },
        'NLZJ202410240003-V1': {
          1: { id: 'SUB005_s1', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '张主管', auditTime: '2026-11-02 10:00', _records: [{ nodeType: 'submit', status: 'pending', submitTime: '2026-10-24 15:00:21', auditTime: '2026-10-24 15:00:21', remark: '机构提交申报材料', auditor: '', opinion: '' }, { nodeType: 'audit', status: 'approved', submitTime: '2026-10-24 15:00:21', auditTime: '2026-11-02 10:00', auditor: '张主管', opinion: '材料齐全，审核通过' }] },
          2: { id: 'SUB005_s2', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '王工程师', auditTime: '2026-11-06 11:00', _records: [{ nodeType: 'submit', status: 'pending', submitTime: '2026-11-03 09:00', auditTime: '2026-11-03 09:00', remark: '材料评估通过后自动进入技术测评', auditor: '', opinion: '' }, { nodeType: 'audit', status: 'approved', submitTime: '2026-11-03 09:00', auditTime: '2026-11-06 11:00', auditor: '王工程师', opinion: 'DICOM格式兼容性正常，技术测评通过' }] },
          3: { id: 'SUB005_s3', status: 'rejected', statusKey: 'rejected', statusText: '已驳回', auditor: '刘主任', auditTime: '2026-11-13 16:30', _records: [{ nodeType: 'submit', status: 'pending', submitTime: '2026-11-07 09:00', auditTime: '2026-11-07 09:00', remark: '技术测评通过，预约现场演示', auditor: '', opinion: '' }, { nodeType: 'audit', status: 'rejected', submitTime: '2026-11-07 09:00', auditTime: '2026-11-13 16:30', auditor: '刘主任', opinion: '影像结果查看器在移动端适配不完善，平板端界面布局异常，请优化后重新答辩' }] },
          4: { id: 'SUB005_s4', status: 'pending', statusKey: 'default', statusText: '未开始', auditor: '', auditTime: '', _records: [] }
        },
        'NLZJ202410240004-V1': {
          1: { id: 'SUB006_s1', status: 'processing', statusKey: 'processing', statusText: '进行中', auditor: '', auditTime: '', _records: [{ nodeType: 'submit', status: 'pending', submitTime: '2026-10-24 15:00:40', auditTime: '2026-10-24 15:00:40', remark: '机构提交申报材料', auditor: '', opinion: '' }] },
          2: { id: 'SUB006_s2', status: 'pending', statusKey: 'default', statusText: '未开始', auditor: '', auditTime: '', _records: [] },
          3: { id: 'SUB006_s3', status: 'pending', statusKey: 'default', statusText: '未开始', auditor: '', auditTime: '', _records: [] },
          4: { id: 'SUB006_s4', status: 'pending', statusKey: 'default', statusText: '未开始', auditor: '', auditTime: '', _records: [] }
        },
        'NLZJ202410240005-V1': {
          1: { id: 'SUB007_s1', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '张主管', auditTime: '2026-11-03 09:30', _records: [{ nodeType: 'submit', status: 'pending', submitTime: '2026-10-24 15:01:13', auditTime: '2026-10-24 15:01:13', remark: '机构提交申报材料', auditor: '', opinion: '' }, { nodeType: 'audit', status: 'approved', submitTime: '2026-10-24 15:01:13', auditTime: '2026-11-03 09:30', auditor: '张主管', opinion: '电子签名资质完备，材料审核通过' }] },
          2: { id: 'SUB007_s2', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '王工程师', auditTime: '2026-11-08 10:00', _records: [{ nodeType: 'submit', status: 'pending', submitTime: '2026-11-04 09:00', auditTime: '2026-11-04 09:00', remark: '材料评估通过后自动进入技术测评', auditor: '', opinion: '' }, { nodeType: 'audit', status: 'approved', submitTime: '2026-11-04 09:00', auditTime: '2026-11-08 10:00', auditor: '王工程师', opinion: '扫码签名和授权签名功能正常，技术测评通过' }] },
          3: { id: 'SUB007_s3', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '刘主任', auditTime: '2026-11-14 14:30', _records: [{ nodeType: 'submit', status: 'pending', submitTime: '2026-11-09 09:00', auditTime: '2026-11-09 09:00', remark: '技术测评通过，预约现场演示', auditor: '', opinion: '' }, { nodeType: 'audit', status: 'approved', submitTime: '2026-11-09 09:00', auditTime: '2026-11-14 14:30', auditor: '刘主任', opinion: '电子签名流程完整合规，移动签名体验良好，答辩通过' }] },
          4: { id: 'SUB007_s4', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '陈管理员', auditTime: '2026-11-18 09:00', _records: [{ nodeType: 'submit', status: 'pending', submitTime: '2026-11-15 09:00', auditTime: '2026-11-15 09:00', remark: '答辩通过，提交服务目录发布申请', auditor: '', opinion: '' }, { nodeType: 'audit', status: 'approved', submitTime: '2026-11-15 09:00', auditTime: '2026-11-18 09:00', auditor: '陈管理员', opinion: '发布信息配置正确，已上架至服务目录' }] }
        },
        'NLZJ202410240005-V2': {
          1: { id: 'SUB008_s1', status: 'processing', statusKey: 'processing', statusText: '进行中', auditor: '', auditTime: '', _records: [{ nodeType: 'submit', status: 'pending', submitTime: '2026-10-24 15:01:13', auditTime: '2026-10-24 15:01:13', remark: 'V2版本提交申报材料（新增双方会签功能）', auditor: '', opinion: '' }] },
          2: { id: 'SUB008_s2', status: 'pending', statusKey: 'default', statusText: '未开始', auditor: '', auditTime: '', _records: [] },
          3: { id: 'SUB008_s3', status: 'pending', statusKey: 'default', statusText: '未开始', auditor: '', auditTime: '', _records: [] },
          4: { id: 'SUB008_s4', status: 'pending', statusKey: 'default', statusText: '未开始', auditor: '', auditTime: '', _records: [] }
        },
        'NLZJ202410240006-V1': {
          1: { id: 'SUB009_s1', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '张主管', auditTime: '2026-11-03 10:30', _records: [{ nodeType: 'submit', status: 'pending', submitTime: '2026-10-24 15:01:28', auditTime: '2026-10-24 15:01:28', remark: '机构提交申报材料', auditor: '', opinion: '' }, { nodeType: 'audit', status: 'approved', submitTime: '2026-10-24 15:01:28', auditTime: '2026-11-03 10:30', auditor: '张主管', opinion: '患者签名场景材料齐全，审核通过' }] },
          2: { id: 'SUB009_s2', status: 'rejected', statusKey: 'rejected', statusText: '已驳回', auditor: '王工程师', auditTime: '2026-11-08 16:00', _records: [{ nodeType: 'submit', status: 'pending', submitTime: '2026-11-04 09:00', auditTime: '2026-11-04 09:00', remark: '材料评估通过后自动进入技术测评', auditor: '', opinion: '' }, { nodeType: 'audit', status: 'rejected', submitTime: '2026-11-04 09:00', auditTime: '2026-11-08 16:00', auditor: '王工程师', opinion: '智能签名屏驱动兼容性问题，部分有线签字板无法正常识别签名，需修复后重新测评' }] },
          3: { id: 'SUB009_s3', status: 'pending', statusKey: 'default', statusText: '未开始', auditor: '', auditTime: '', _records: [] },
          4: { id: 'SUB009_s4', status: 'pending', statusKey: 'default', statusText: '未开始', auditor: '', auditTime: '', _records: [] }
        },
        'NLZJ202410240007-V1': {
          1: { id: 'SUB010_s1', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '张主管', auditTime: '2026-11-03 14:00', _records: [{ nodeType: 'submit', status: 'pending', submitTime: '2026-10-24 15:01:43', auditTime: '2026-10-24 15:01:43', remark: '机构提交申报材料', auditor: '', opinion: '' }, { nodeType: 'audit', status: 'approved', submitTime: '2026-10-24 15:01:43', auditTime: '2026-11-03 14:00', auditor: '张主管', opinion: '电子签名和印章资质齐全，审核通过' }] },
          2: { id: 'SUB010_s2', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '王工程师', auditTime: '2026-11-07 15:00', _records: [{ nodeType: 'submit', status: 'pending', submitTime: '2026-11-04 09:00', auditTime: '2026-11-04 09:00', remark: '材料评估通过后自动进入技术测评', auditor: '', opinion: '' }, { nodeType: 'audit', status: 'approved', submitTime: '2026-11-04 09:00', auditTime: '2026-11-07 15:00', auditor: '王工程师', opinion: '手写签名识别率达标，电子印章验证功能正常，技术测评通过' }] },
          3: { id: 'SUB010_s3', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '刘主任', auditTime: '2026-11-14 10:00', _records: [{ nodeType: 'submit', status: 'pending', submitTime: '2026-11-08 09:00', auditTime: '2026-11-08 09:00', remark: '技术测评通过，预约现场演示', auditor: '', opinion: '' }, { nodeType: 'audit', status: 'approved', submitTime: '2026-11-08 09:00', auditTime: '2026-11-14 10:00', auditor: '刘主任', opinion: '手写电子化和印章场景演示完整，答辩通过' }] },
          4: { id: 'SUB010_s4', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '陈管理员', auditTime: '2026-11-18 11:00', _records: [{ nodeType: 'submit', status: 'pending', submitTime: '2026-11-15 09:00', auditTime: '2026-11-15 09:00', remark: '答辩通过，提交服务目录发布申请', auditor: '', opinion: '' }, { nodeType: 'audit', status: 'approved', submitTime: '2026-11-15 09:00', auditTime: '2026-11-18 11:00', auditor: '陈管理员', opinion: '发布信息配置正确，已上架至服务目录' }] }
        },
        'NLZJ202410240008-V1': {
          1: { id: 'SUB011_s1', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '张主管', auditTime: '2026-11-04 10:00', _records: [{ nodeType: 'submit', status: 'pending', submitTime: '2026-10-24 15:13:21', auditTime: '2026-10-24 15:13:21', remark: '机构提交申报材料', auditor: '', opinion: '' }, { nodeType: 'audit', status: 'approved', submitTime: '2026-10-24 15:13:21', auditTime: '2026-11-04 10:00', auditor: '张主管', opinion: '文档资质齐全，审核通过' }] },
          2: { id: 'SUB011_s2', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '王工程师', auditTime: '2026-11-08 14:00', _records: [{ nodeType: 'submit', status: 'pending', submitTime: '2026-11-05 09:00', auditTime: '2026-11-05 09:00', remark: '材料评估通过后自动进入技术测评', auditor: '', opinion: '' }, { nodeType: 'audit', status: 'approved', submitTime: '2026-11-05 09:00', auditTime: '2026-11-08 14:00', auditor: '王工程师', opinion: '多格式文档预览和签章验章功能稳定，技术测评通过' }] },
          3: { id: 'SUB011_s3', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '刘主任', auditTime: '2026-11-15 10:30', _records: [{ nodeType: 'submit', status: 'pending', submitTime: '2026-11-09 09:00', auditTime: '2026-11-09 09:00', remark: '技术测评通过，预约现场演示', auditor: '', opinion: '' }, { nodeType: 'audit', status: 'approved', submitTime: '2026-11-09 09:00', auditTime: '2026-11-15 10:30', auditor: '刘主任', opinion: '文档轻阅读体验流畅，安全管控功能完善，答辩通过' }] },
          4: { id: 'SUB011_s4', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '陈管理员', auditTime: '2026-11-19 09:30', _records: [{ nodeType: 'submit', status: 'pending', submitTime: '2026-11-16 09:00', auditTime: '2026-11-16 09:00', remark: '答辩通过，提交服务目录发布申请', auditor: '', opinion: '' }, { nodeType: 'audit', status: 'approved', submitTime: '2026-11-16 09:00', auditTime: '2026-11-19 09:30', auditor: '陈管理员', opinion: '发布信息配置正确，已上架至服务目录' }] }
        }
      },
      auditSteps: [
        { key: 1, title: '申报材料评估' },
        { key: 2, title: '应用技术测评' },
        { key: 3, title: '现场演示答辩' },
        { key: 4, title: '服务目录发布' }
      ]
    }
  },
  computed: {
    visibleColumns() {
      return this.columns.filter(c => !this.hiddenKeys.includes(c.key))
    },
    isAuditing() {
      return this.drawer.record && String(this.drawer.record.auditStatus) === '10'
    },
    filteredData() {
      const f = this.applied
      const list = this.componentList.filter(item => {
        if (f.name && !(item.name || '').includes(f.name)) return false
        if (f.componentId && !(item.componentId || '').includes(f.componentId)) return false
        if (f.submitTimeRange && f.submitTimeRange.length === 2) {
          const itemDate = (item.submitTime || '').slice(0, 10)
          if (itemDate < f.submitTimeRange[0] || itemDate > f.submitTimeRange[1]) return false
        }
        if (f.status && String(item.auditStatus) !== String(f.status)) return false
        if (f.step && Number(item.currentStep) !== Number(f.step)) return false
        return true
      })
      list.sort((a, b) => {
        const aPending = String(a.auditStatus) === '10' ? 0 : 1
        const bPending = String(b.auditStatus) === '10' ? 0 : 1
        if (aPending !== bPending) return aPending - bPending
        return a.submitTime < b.submitTime ? 1 : -1
      })
      return list.map(i => ({ key: i.submissionId, ...i }))
    },
    paginationConfig() {
      return {
        current: this.pagination.current,
        pageSize: this.pagination.pageSize,
        total: this.filteredData.length,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (t) => `共 ${t} 条`
      }
    },
  },
  created() {
    this.loadCoverOptions();
  },
  methods: {
    getDemoContainer() {
      return document.querySelector('.app-main__content') || document.body;
    },
    getDrawerContainer() {
      return document.querySelector('.app-overlay') || document.body;
    },
    loadCoverOptions() {
      getDicts('OpenRange').then((response) => {
        this.coverOptions = (response.data || []).map((item) => ({
          value: String(item.dictCode),
          label: item.dictLabel
        }));
      });
    },
    handleQuery() {
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    resetQuery() {
      this.filter = { name: '', componentId: '', serviceProvider: '', status: undefined, step: undefined, submitTimeRange: [] }
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    onTableChange(pag) {
      this.pagination.current = pag.current
      this.pagination.pageSize = pag.pageSize
    },
    getAuditStatusKey(status) {
      const map = { 10: 'processing', 20: 'done', 30: 'rejected' }
      return map[String(status)] || 'default'
    },
    getAuditStatusText(status) {
      const map = { 10: '待审核', 20: '已通过', 30: '已驳回' }
      return map[String(status)] || ''
    },
    getStepName(step) {
      const names = { 1: '申报材料评估', 2: '应用技术测评', 3: '现场演示答辩', 4: '服务目录发布' }
      return names[step] || '--'
    },
    // ===== 步骤条相关方法（基于record.currentStep判断） =====
    isStepApproved(idx) {
      if (!this.drawer.record) return false
      const status = String(this.drawer.record.auditStatus)
      const cur = this.drawer.record.currentStep || 1
      if (status === '20') return true
      if (status === '30') return idx < cur - 1
      return idx < cur - 1
    },
    isStepRejected(idx) {
      if (!this.drawer.record) return false
      const status = String(this.drawer.record.auditStatus)
      const cur = this.drawer.record.currentStep || 1
      return status === '30' && idx === cur - 1
    },
    isStepCurrent(idx) {
      if (!this.drawer.record) return false
      const status = String(this.drawer.record.auditStatus)
      const cur = this.drawer.record.currentStep || 1
      return status === '10' && idx === cur - 1
    },
    getStepRecord(idx) {
      if (!this.drawer.record || !this.drawer.record.submissionId) return null
      const subData = this.submissionAuditData[this.drawer.record.submissionId]
      if (!subData) return null
      const stepKey = this.auditSteps[idx].key
      const stageData = subData[stepKey]
      if (!stageData || !stageData._records || stageData._records.length === 0) return null
      const auditRecords = stageData._records.filter(r => r.nodeType === 'audit')
      if (auditRecords.length === 0) return null
      const last = auditRecords[auditRecords.length - 1]
      return {
        status: last.status,
        auditor: last.auditor,
        auditTime: last.auditTime,
        opinion: last.opinion,
        submitTime: last.submitTime
      }
    },
    getPriorSteps(currentIdx) {
      const prior = []
      for (let i = 0; i < currentIdx; i++) {
        const rec = this.getStepRecord(i)
        if (rec && rec.opinion) {
          prior.push({ idx: i, ...rec })
        }
      }
      return prior
    },
    getStepTabClass(idx) {
      const classes = []
      if (idx === this.activeStepIdx) classes.push('step-tab--active')
      if (this.isStepApproved(idx)) classes.push('step-tab--done')
      if (this.isStepRejected(idx)) classes.push('step-tab--rejected')
      return classes
    },
    getStepIndexClass(idx) {
      if (this.isStepApproved(idx)) return 'step-node__dot--done'
      if (this.isStepRejected(idx)) return 'step-node__dot--rejected'
      if (this.isStepCurrent(idx)) return 'step-node__dot--active'
      return 'step-node__dot--pending'
    },
    getStepTagClass(idx) {
      if (this.isStepApproved(idx)) return 'step-node__tag--done'
      if (this.isStepRejected(idx)) return 'step-node__tag--rejected'
      if (this.isStepCurrent(idx)) return 'step-node__tag--active'
      return 'step-node__tag--pending'
    },
    getStepTagText(idx) {
      if (this.isStepApproved(idx)) return '已通过'
      if (this.isStepRejected(idx)) return '已驳回'
      if (this.isStepCurrent(idx)) return '待审核'
      return '待审核'
    },
    formatTime(time) {
      if (!time) return '--'
      if (/\d{2}:\d{2}:\d{2}/.test(time)) return time
      return time + ':00'
    },
    getApproveText(idx) {
      const texts = [
        '通过材料评估，进入技术测评',
        '通过技术测评，进入现场答辩',
        '通过答辩评审，进入发布环节',
        '确认发布至服务目录'
      ]
      return texts[idx] || '审核通过'
    },
    // ===== 抽屉操作 =====
    startAudit(comp) {
      this.openDrawer(comp)
    },
    viewDetails(comp) {
      this.openDrawer(comp)
    },
    openDrawer(comp) {
      this.drawer.record = {
        ...this.compDetailMock,
        name: comp.name,
        componentId: comp.componentId,
        submissionId: comp.submissionId,
        serviceProviderName: comp.serviceProviderName,
        deployServiceProviderView: comp.deployServiceProviderView,
        coverView: comp.coverView,
        description: comp.description,
        submitTime: comp.submitTime,
        auditStatus: comp.auditStatus,
        currentStep: comp.currentStep || 1
      }
      this.auditForm.opinion = ''
      this.activeStepIdx = (comp.currentStep || 1) - 1
      this.drawer.activeTab = 'overview'
      this.drawer.visible = true
    },
    downloadMaterial(material) {
      message.success('下载附件：' + material.name)
    },
    approve() {
      if (!this.auditForm.opinion.trim()) {
        message.warning('请填写审核意见')
        return
      }
      Modal.confirm({
        getContainer: this.getDemoContainer,
        title: '确认通过',
        content: '确定要通过该组件的审核吗？',
        okText: '确定',
        cancelText: '取消',
        okType: 'primary',
        onOk: () => {
          message.success('审核通过')
          this.drawer.visible = false
        }
      })
    },
    reject() {
      if (!this.auditForm.opinion.trim()) {
        message.warning('请填写驳回原因')
        return
      }
      Modal.confirm({
        getContainer: this.getDemoContainer,
        title: '确认驳回',
        content: '确定要驳回该组件的审核吗？',
        okText: '确定',
        cancelText: '取消',
        okType: 'danger',
        onOk: () => {
          message.success('审核已驳回')
          this.drawer.visible = false
        }
      })
    },
  }
}
</script>

<style scoped>
.component-audit-page {
  padding: 4px 0;
}

.component-audit-page__divider {
  height: 1px;
  background: #F2F3F5;
  margin: 0 16px;
}

.component-audit-page__table-wrap {
  padding: 0 16px 16px 16px;
}

.cell-default {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}

.cell-primary {
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-weight: 500;
}

.cell-mono {
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
  font-variant-numeric: tabular-nums;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  letter-spacing: -0.2px;
}

.cell-name {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cell-name__title {
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-weight: 600;
}

.cell-name__id {
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}

/* ===== 抽屉头部 ===== */
.drawer-header-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 4px 0 16px;
  border-bottom: 1px solid #F2F3F5;
  margin-bottom: 20px;
}

.drawer-header-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, #165DFF 0%, #4096ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.drawer-header-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.drawer-header-fallback {
  font-size: 28px;
  color: #fff;
}

.drawer-header-info {
  flex: 1;
  min-width: 0;
}

.drawer-header-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.drawer-header-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
}

.drawer-header-sub {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #64748b;
}

/* ===== 左右分栏 ===== */
.drawer-split {
  display: flex;
  gap: 0;
  min-height: 0;
}

.drawer-split__left {
  flex: 3;
  min-width: 0;
  padding-right: 24px;
  overflow-y: auto;
}

.drawer-split__divider {
  width: 1px;
  background: #E5E6EB;
  flex-shrink: 0;
  align-self: stretch;
}

.drawer-split__right {
  flex: 2;
  min-width: 0;
  padding-left: 24px;
  overflow-y: auto;
}

/* ===== 分区区块 ===== */
.split-section {
  margin-bottom: 20px;
}

.split-section:last-child {
  margin-bottom: 0;
}

.split-section__title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 12px;
}

/* ===== 附件材料 ===== */
.material-list :deep(.ant-list-item) {
  padding: 10px 0;
}

.material-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: #E8F3FF;
  color: #165DFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.material-name {
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.material-size {
  font-size: 11px;
  color: #86909C;
}

/* ===== 纵向步骤列表 ===== */
.step-list {
  display: flex;
  flex-direction: column;
}

.step-node {
  display: flex;
  gap: 12px;
}

.step-node__indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 24px;
}

.step-node__dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
  transition: all 0.2s;
  color: #86909C;
  background: #FFFFFF;
  border: 1.5px solid #C9CDD4;
}

.step-node__dot--pending {
  color: #86909C;
  background: #FFFFFF;
  border-color: #C9CDD4;
}

.step-node__dot--active {
  color: #FFFFFF;
  background: #165DFF;
  border-color: #165DFF;
  box-shadow: 0 2px 6px rgba(22, 93, 255, 0.35);
}

.step-node__dot--done {
  color: #FFFFFF;
  background: #16A34A;
  border-color: #16A34A;
}

.step-node__dot--rejected {
  color: #FFFFFF;
  background: #EF4444;
  border-color: #EF4444;
}

.step-node__line {
  width: 2px;
  flex: 1;
  min-height: 16px;
  background: #E5E6EB;
  margin: 4px 0;
}

.step-node__line--done {
  background: #16A34A;
}

.step-node__body {
  flex: 1;
  min-width: 0;
  padding-bottom: 20px;
}

.step-node__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.step-node__title {
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.step-node--active .step-node__title {
  font-weight: 600;
  color: #165DFF;
}

.step-node__tag {
  display: inline-block;
  padding: 1px 8px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 4px;
  flex-shrink: 0;
}

.step-node__tag--pending {
  background: #F2F3F5;
  color: #86909C;
}

.step-node__tag--active {
  background: #E8F3FF;
  color: #165DFF;
}

.step-node__tag--done {
  background: #E9F9EF;
  color: #16A34A;
}

.step-node__tag--rejected {
  background: #FFEDEC;
  color: #EF4444;
}

.step-node__action {
  background: #F2F7FF;
  border: 1px solid #D6E4FF;
  border-radius: 6px;
  padding: 12px;
}

.audit-textarea-wrap {
  position: relative;
  margin-bottom: 10px;
}

.audit-textarea-count {
  position: absolute;
  right: 8px;
  bottom: 4px;
  font-size: 12px;
  color: #C9CDD4;
  pointer-events: none;
}

.step-node__btns {
  display: flex;
  gap: 8px;
}

.step-node__record {
  background: #F2F3F5;
  border-radius: 6px;
  padding: 10px 12px;
}

.step-node__opinion {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.6;
}

.step-node__meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
  font-size: 12px;
  color: #86909C;
}
</style>

<style>
/* 抽屉内 antd 组件样式覆盖（unscoped，因 a-drawer teleport 到 body，scoped + :deep 不生效） */
.ant-drawer .ant-table-wrapper,
.ant-drawer .ant-table-wrapper .ant-table,
.ant-drawer .ant-table-wrapper .ant-table-container,
.ant-drawer .ant-table-wrapper .ant-table-thead > tr > th,
.ant-drawer .ant-table-wrapper .ant-table-tbody > tr > td {
  border-radius: 0 !important;
}

.ant-drawer .ant-table-thead .ant-table-cell {
  font-weight: normal !important;
}

/* 左侧概览 - 标签列 */
.drawer-split__left .ant-descriptions-item-label {
  width: 130px !important;
  min-width: 130px !important;
  max-width: 130px !important;
  text-align: left !important;
  word-break: break-all;
  white-space: normal;
  background: #FAFBFC !important;
  font-size: 14px !important;
  font-weight: 400 !important;
  color: rgba(0, 0, 0, 0.85) !important;
  line-height: 1.5;
}

.drawer-split__left .ant-descriptions-item-content {
  font-size: 14px !important;
  font-weight: 400 !important;
  color: rgba(0, 0, 0, 0.65) !important;
  word-break: break-all;
}
</style>
