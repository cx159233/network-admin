<template>
  <div class="digital-app-audit-page">
    <PageHeader
      title="数字应用审核"
      description="审核机构提交的数字应用上架申请，支持按应用名称、面向对象和审核状态筛选"
    />

    <CloudCard class="digital-app-audit-page__table-card">
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
        <a-input v-model:value="filter.title" placeholder="数字应用名称" allow-clear style="width: 180px" @pressEnter="handleQuery" />
        <a-input v-model:value="filter.serviceId" placeholder="数字应用ID" allow-clear style="width: 180px" @pressEnter="handleQuery" />
        <a-input v-model:value="filter.serviceProvider" placeholder="服务商名称" allow-clear style="width: 160px" @pressEnter="handleQuery" />
        <a-select v-model:value="filter.appScope" placeholder="应用覆盖范围" allow-clear style="width: 150px">
          <a-select-option v-for="item in appScopeOptions" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
        </a-select>
        <a-select v-model:value="filter.targetObjectStr" placeholder="面向对象" allow-clear style="width: 150px">
          <a-select-option v-for="item in targetObjectOptions" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
        </a-select>
        <template #suffix>
          <ColumnSettings v-model="hiddenKeys" :columns="columns" />
        </template>
      </FilterBar>
      <div class="digital-app-audit-page__divider"></div>

      <div class="digital-app-audit-page__table-wrap">
        <a-table
          :columns="visibleColumns"
          :data-source="filteredData"
          :pagination="paginationConfig"
          :loading="loading"
          row-key="submissionId"
          size="middle"
          @change="onTableChange"
        >
          <template #bodyCell="{ column, record }">
            <span v-if="column.dataIndex === 'title'" class="cell-name">
              <span class="cell-name__title">{{ record.title || '--' }}</span>
              <span class="cell-name__id">{{ record.serviceId || '--' }}</span>
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
    <a-drawer
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
              <span class="drawer-header-title">{{ drawer.record.title }}</span>
              <StatusDot :type="getAuditStatusKey(drawer.record.auditStatus)" :text="getAuditStatusText(drawer.record.auditStatus)" />
            </div>
            <div class="drawer-header-sub">
              <span>ID：{{ drawer.record.serviceId || '--' }}</span>
            </div>
          </div>
        </div>

        <div class="drawer-split">
          <!-- 左侧：概览信息 -->
          <div class="drawer-split__left">
            <div class="split-section">
              <div class="split-section__title">基本信息</div>
              <a-descriptions :column="1" bordered size="small">
                <a-descriptions-item label="系统地址">
                  {{ drawer.record.systemUrl || '--' }}
                </a-descriptions-item>
                <a-descriptions-item label="显示顺序">
                  {{ drawer.record.sortOrder != null ? drawer.record.sortOrder : 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="应用描述">
                  {{ drawer.record.description || '--' }}
                </a-descriptions-item>
              </a-descriptions>
            </div>
            <div class="split-section">
              <div class="split-section__title">联系信息</div>
              <a-descriptions :column="1" bordered size="small">
                <a-descriptions-item label="服务商名称">{{ drawer.record.serviceProvider || '--' }}</a-descriptions-item>
                <a-descriptions-item label="合作伙伴">{{ drawer.record.cooperativeEnterprise || '--' }}</a-descriptions-item>
                <a-descriptions-item label="联系方式1">{{ drawer.record.contact1Name || '--' }} {{ drawer.record.contact1Phone || '' }}</a-descriptions-item>
                <a-descriptions-item label="联系方式2">{{ drawer.record.contact2Name || '--' }} {{ drawer.record.contact2Phone || '' }}</a-descriptions-item>
              </a-descriptions>
            </div>
            <div class="split-section">
              <div class="split-section__title">分类标签</div>
              <a-descriptions :column="1" bordered size="small">
                <a-descriptions-item label="面向对象">{{ drawer.record.targetObjectStr || '--' }}</a-descriptions-item>
                <a-descriptions-item label="应用架构">{{ drawer.record.appArchitecture || '--' }}</a-descriptions-item>
                <a-descriptions-item label="部署云服务商">{{ drawer.record.cloudProviderStr || '--' }}</a-descriptions-item>
                <a-descriptions-item v-if="drawer.record.targetObject && drawer.record.targetObject.includes('基层医疗卫生机构')" label="基层应用覆盖范围">{{ formatArray(drawer.record.coverBase) }}</a-descriptions-item>
                <a-descriptions-item v-if="drawer.record.targetObject && drawer.record.targetObject.includes('公立医院')" label="公立应用覆盖范围">{{ formatArray(drawer.record.coverPublic) }}</a-descriptions-item>
                <a-descriptions-item v-if="drawer.record.targetObject && drawer.record.targetObject.includes('医技护人员')" label="医技应用覆盖范围">{{ formatArray(drawer.record.coverTech) }}</a-descriptions-item>
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
import AuditResultCard from './components/AuditResultCard.vue'
import PendingTip from './components/PendingTip.vue'
import AuditActionBox from './components/AuditActionBox.vue'
import {
  CheckOutlined, CloseOutlined, DownloadOutlined, FileOutlined, RobotOutlined,
  FileTextOutlined, PaperClipOutlined
} from '@ant-design/icons-vue'
import { Modal, message } from 'ant-design-vue'

export default {
  name: 'DigitalAppAudit',
  components: {
    PageHeader, CloudCard, FilterBar, StatusDot, ColumnSettings,
    AuditResultCard, PendingTip, AuditActionBox,
    CheckOutlined, CloseOutlined, DownloadOutlined, FileOutlined, RobotOutlined,
    FileTextOutlined, PaperClipOutlined
  },
  data() {
    return {
      loading: false,
      hiddenKeys: [],
      filter: { title: '', serviceId: '', serviceProvider: '', appScope: undefined, targetObjectStr: undefined, status: undefined, step: undefined, submitTimeRange: [] },
      applied: { title: '', serviceId: '', serviceProvider: '', appScope: undefined, targetObjectStr: undefined, status: undefined, step: undefined, submitTimeRange: [] },
      pagination: { current: 1, pageSize: 10 },
      appScopeOptions: [
        { value: '基本公共卫生服务', label: '基本公共卫生服务' },
        { value: '医院信息系统（HIS）', label: '医院信息系统（HIS）' },
        { value: '家庭医生签约', label: '家庭医生签约' },
        { value: '实验室信息管理系统（LIS）', label: '实验室信息管理系统（LIS）' },
        { value: '影像归档和通信系统（PACS）', label: '影像归档和通信系统（PACS）' }
      ],
      targetObjectOptions: [
        { value: '基层医疗卫生机构', label: '基层医疗卫生机构' },
        { value: '公立医院', label: '公立医院' },
        { value: '医技护人员', label: '医技护人员' }
      ],
      columns: [
        { title: '提交审核时间', dataIndex: 'submitTime', key: 'submitTime', width: 170 },
        { title: '审核状态', dataIndex: 'auditStatus', key: 'auditStatus', width: 110 },
        { title: '审核阶段', dataIndex: 'currentStep', key: 'currentStep', width: 140 },
        { title: '数字应用名称/ID', dataIndex: 'title', key: 'title', width: 240 },
        { title: '面向对象', dataIndex: 'targetObjectStr', key: 'targetObjectStr', width: 130 },
        { title: '应用覆盖范围', dataIndex: 'appScope', key: 'appScope', width: 200 },
        { title: '服务商名称', dataIndex: 'serviceProvider', key: 'serviceProvider', ellipsis: true, width: 150 },
        { title: '合作企业', dataIndex: 'cooperativeEnterprise', key: 'cooperativeEnterprise', ellipsis: true, width: 150 },
        { title: '部署云服务商', dataIndex: 'cloudProviderStr', key: 'cloudProviderStr', width: 120 },
        { title: '操作', dataIndex: 'action', key: 'action', width: 90, fixed: 'right' }
      ],
      // 每条 = 一次提交工单，版本号只是展示字段
      appList: [
        { submissionId: 'SZYY202410220001-V1', serviceGroup: 'GRP_SYNC', serviceId: 'SZYY202410220001', title: '同步远方医疗服务', versionNo: 1, targetObjectStr: '公立医院', appScope: '全国', description: '提供远程会诊、远程教学、远程培训等多种远程医疗服务模式。', auditStatus: 30, currentStep: 3, cloudProviderStr: '影像云', serviceProvider: '影像云科技有限公司', cooperativeEnterprise: '中科软科技、华为技术', submitTime: '2026-02-10 09:05' },
        { submissionId: 'SZYY202410220001-V2', serviceGroup: 'GRP_SYNC', serviceId: 'SZYY202410220001', title: '同步远方医疗服务', versionNo: 2, targetObjectStr: '公立医院', appScope: '全国', description: '提供远程会诊、远程教学、远程培训等多种远程医疗服务模式。', auditStatus: 10, currentStep: 2, cloudProviderStr: '影像云', serviceProvider: '影像云科技有限公司', cooperativeEnterprise: '中科软科技、华为技术', submitTime: '2026-05-15 14:20' },
        { submissionId: 'SZYY202410230001-V1', serviceGroup: 'GRP_ZHYL', serviceId: 'SZYY202410230001', title: '智慧住院服务', versionNo: 1, targetObjectStr: '公立医院', appScope: '省级', description: '涵盖住院流程管理、床位管理、费用结算等全流程住院服务。', auditStatus: 10, currentStep: 2, cloudProviderStr: '电信云', serviceProvider: '东软集团', cooperativeEnterprise: '中科软科技、浪潮', submitTime: '2026-10-23 09:15:32' },
        { submissionId: 'SZYY202410240001-V1', serviceGroup: 'GRP_YLTC', serviceId: 'SZYY202410240001', title: '久远康嘉医联体一体化服务', versionNo: 1, targetObjectStr: '基层医疗卫生机构', appScope: '省级', description: '实现医联体内部诊疗协同、检查检验互认、双向转诊等服务。', auditStatus: 20, currentStep: 4, cloudProviderStr: '移动云', serviceProvider: '久远康嘉医疗科技有限公司', cooperativeEnterprise: '华为技术、阿里云', submitTime: '2026-10-24 14:59:25' },
        { submissionId: 'SZYY202410240002-V1', serviceGroup: 'GRP_ZYFZ', serviceId: 'SZYY202410240002', title: '中医智能辅助服务', versionNo: 1, targetObjectStr: '公立医院', appScope: '全国', description: '基于中医药知识库，提供智能辨证、方剂推荐、针灸穴位定位等辅助服务。', auditStatus: 20, currentStep: 4, cloudProviderStr: '联通云', serviceProvider: '九州通医药集团', cooperativeEnterprise: '科大讯飞', submitTime: '2026-10-24 15:00:03' },
        { submissionId: 'SZYY202410240003-V1', serviceGroup: 'GRP_MBGL', serviceId: 'SZYY202410240003', title: '智慧慢病管理一体化服务', versionNo: 1, targetObjectStr: '基层医疗卫生机构', appScope: '市级', description: '面向高血压、糖尿病等慢性病患者，提供全周期健康管理服务。', auditStatus: 30, currentStep: 3, cloudProviderStr: '浪潮云', serviceProvider: '万达信息', cooperativeEnterprise: '腾讯医疗、丁香园', submitTime: '2026-10-24 15:00:21' },
        { submissionId: 'SZYY202410240004-V1', serviceGroup: 'GRP_JZJJ', serviceId: 'SZYY202410240004', title: '急诊急救指挥调度服务', versionNo: 1, targetObjectStr: '公立医院', appScope: '市级', description: '为急诊、急救场景提供资源调度、路线规划、多方协同指挥等功能。', auditStatus: 10, currentStep: 1, cloudProviderStr: '电信云', serviceProvider: '卫宁健康', cooperativeEnterprise: '华为技术', submitTime: '2026-10-24 15:00:40' },
        { submissionId: 'SZYY202410240005-V1', serviceGroup: 'GRP_ZHGL', serviceId: 'SZYY202410240005', title: '智慧医疗综合管理服务', versionNo: 1, targetObjectStr: '公立医院', appScope: '省级', description: '面向医疗机构的综合管理平台，涵盖运营、质控、人力等多维度管理。', auditStatus: 20, currentStep: 4, cloudProviderStr: '移动云', serviceProvider: '东华软件', cooperativeEnterprise: 'IBM、Oracle', submitTime: '2026-03-10 08:00:00' },
        { submissionId: 'SZYY202410240005-V2', serviceGroup: 'GRP_ZHGL', serviceId: 'SZYY202410240005', title: '智慧医疗综合管理服务', versionNo: 2, targetObjectStr: '公立医院', appScope: '省级', description: '面向医疗机构的综合管理平台，涵盖运营、质控、人力等多维度管理。', auditStatus: 10, currentStep: 1, cloudProviderStr: '移动云', serviceProvider: '东华软件', cooperativeEnterprise: 'IBM、Oracle', submitTime: '2026-06-01 09:30:00' }
      ],
      drawer: { visible: false, record: null },
      auditForm: { opinion: '' },
      activeStepIdx: 0,
      appDetailMock: {
        logo: 'https://img.alicdn.com/imgextra/i3/O1CN01Wr5Kxq1NqSGZXMKBf_!!6000000001620-2-tps-120-120.png',
        systemUrl: 'https://app.medical-cloud.cn/telemedicine',
        serviceProvider: '影像云科技有限公司',
        cooperativeEnterprise: '中科软科技、华为技术',
        contact1Name: '张经理',
        contact1Phone: '13800138000',
        contact2Name: '李助理',
        contact2Phone: '13900139000',
        appArchitecture: 'B/S架构、移动端H5、小程序',
        targetObject: ['基层医疗卫生机构', '公立医院'],
        coverBase: ['基本公共卫生服务', '家庭医生签约'],
        coverPublic: ['医院信息系统（HIS）', '实验室信息管理系统（LIS）'],
        coverTech: ['影像归档和通信系统（PACS）'],
        sortOrder: 1
      },
      // 每个提交的审核步骤数据（key: submissionId → stageKey → stage data）
      submissionAuditData: {
        // 同步远方医疗服务 V1 — 被驳回于步骤3
        'SZYY202410220001-V1': {
          1: {
            id: 'v1s1', status: 'approved', statusKey: 'done', statusText: '已通过',
            auditor: '李主管', auditTime: '2026-03-18 15:30',
            _records: [
              { id: 1, nodeType: 'submit', submitTime: '2026-02-10 09:05', remark: '机构提交申报材料' },
              { id: 2, nodeType: 'audit', status: 'rejected', auditTime: '2026-02-12 11:20', auditor: '李主管', opinion: '安全报告缺少数据加密章节，请补充后重新提交' },
              { id: 3, nodeType: 'submit', submitTime: '2026-02-20 14:30', remark: '机构补齐安全报告并重新提交' },
              { id: 4, nodeType: 'audit', status: 'approved', auditTime: '2026-03-18 15:30', auditor: '李主管', opinion: '材料完整、信息有效，本阶段通过' }
            ]
          },
          2: {
            id: 'v1s2', status: 'approved', statusKey: 'done', statusText: '已通过',
            auditor: '王工程师', auditTime: '2026-03-21 14:00',
            _records: [
              { id: 5, nodeType: 'submit', submitTime: '2026-03-19 10:00', remark: '材料评估通过后自动进入技术测评' },
              { id: 6, nodeType: 'audit', status: 'approved', auditTime: '2026-03-21 14:00', auditor: '王工程师', opinion: '功能完整性、性能指标、安全合规均达到标准，技术测评通过' }
            ]
          },
          3: {
            id: 'v1s3', status: 'rejected', statusKey: 'rejected', statusText: '已驳回',
            auditor: '张主任', auditTime: '2026-03-25 17:30',
            _records: [
              { id: 7, nodeType: 'submit', submitTime: '2026-03-22 09:00', remark: '技术测评通过，预约现场演示' },
              { id: 8, nodeType: 'audit', status: 'rejected', auditTime: '2026-03-25 17:30', auditor: '张主任', opinion: '核心功能演示不完整，缺少数据同步演示环节' }
            ]
          },
          4: { id: 'v1s4', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] }
        },
        // 同步远方医疗服务 V2 — 待审核，当前在步骤2
        'SZYY202410220001-V2': {
          1: {
            id: 'v2s1', status: 'approved', statusKey: 'done', statusText: '已通过',
            auditor: '李主管', auditTime: '2026-05-20 10:00',
            _records: [
              { id: 21, nodeType: 'submit', submitTime: '2026-05-15 14:20', remark: '机构修改后重新提交申报材料' },
              { id: 22, nodeType: 'audit', status: 'approved', auditTime: '2026-05-20 10:00', auditor: '李主管', opinion: '修改后的材料完整合规，本阶段通过' }
            ]
          },
          2: {
            id: 'v2s2', status: 'processing', statusKey: 'processing', statusText: '进行中',
            auditor: '', auditTime: '',
            _records: [
              { id: 23, nodeType: 'submit', submitTime: '2026-05-21 09:00', remark: '材料评估通过，进入技术测评' }
            ]
          },
          3: { id: 'v2s3', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] },
          4: { id: 'v2s4', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] }
        },
        // 智慧住院服务 V1
        'SZYY202410230001-V1': {
          1: {
            id: 's3s1', status: 'approved', statusKey: 'done', statusText: '已通过',
            auditor: '李主管', auditTime: '2026-10-25 10:00',
            _records: [
              { id: 51, nodeType: 'submit', submitTime: '2026-10-23 09:15', remark: '机构提交申报材料' },
              { id: 52, nodeType: 'audit', status: 'approved', auditTime: '2026-10-25 10:00', auditor: '李主管', opinion: '材料完整合规，通过评估' }
            ]
          },
          2: {
            id: 's3s2', status: 'processing', statusKey: 'processing', statusText: '进行中',
            auditor: '', auditTime: '',
            _records: [
              { id: 53, nodeType: 'submit', submitTime: '2026-10-26 09:00', remark: '材料通过，进入技术测评' }
            ]
          },
          3: { id: 's3s3', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] },
          4: { id: 's3s4', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] }
        },
        // 久远康嘉医联体一体化服务 V1 — 已通过
        'SZYY202410240001-V1': {
          1: { id: 's4s1', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '刘主管', auditTime: '2026-11-01 10:00', _records: [{ id: 61, nodeType: 'submit', submitTime: '2026-10-24 14:59', remark: '机构提交申报材料' }, { id: 62, nodeType: 'audit', status: 'approved', auditTime: '2026-11-01 10:00', auditor: '刘主管', opinion: '材料完整合规' }] },
          2: { id: 's4s2', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '陈工程师', auditTime: '2026-11-05 14:00', _records: [{ id: 63, nodeType: 'submit', submitTime: '2026-11-02 09:00', remark: '进入技术测评' }, { id: 64, nodeType: 'audit', status: 'approved', auditTime: '2026-11-05 14:00', auditor: '陈工程师', opinion: '架构合理、性能达标' }] },
          3: { id: 's4s3', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '周主任', auditTime: '2026-11-10 16:00', _records: [{ id: 65, nodeType: 'submit', submitTime: '2026-11-06 10:00', remark: '预约现场答辩' }, { id: 66, nodeType: 'audit', status: 'approved', auditTime: '2026-11-10 16:00', auditor: '周主任', opinion: '演示完整、答辩通过' }] },
          4: { id: 's4s4', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '赵管理员', auditTime: '2026-11-15 09:00', _records: [{ id: 67, nodeType: 'submit', submitTime: '2026-11-11 14:00', remark: '提交发布申请' }, { id: 68, nodeType: 'audit', status: 'approved', auditTime: '2026-11-15 09:00', auditor: '赵管理员', opinion: '发布至服务目录' }] }
        },
        // 中医智能辅助服务 V1 — 已通过
        'SZYY202410240002-V1': {
          1: { id: 's5s1', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '刘主管', auditTime: '2026-11-02 09:00', _records: [{ id: 71, nodeType: 'submit', submitTime: '2026-10-24 15:00', remark: '机构提交申报材料' }, { id: 72, nodeType: 'audit', status: 'approved', auditTime: '2026-11-02 09:00', auditor: '刘主管', opinion: '材料齐全' }] },
          2: { id: 's5s2', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '王工程师', auditTime: '2026-11-06 11:00', _records: [{ id: 73, nodeType: 'submit', submitTime: '2026-11-03 09:00', remark: '进入技术测评' }, { id: 74, nodeType: 'audit', status: 'approved', auditTime: '2026-11-06 11:00', auditor: '王工程师', opinion: '技术测评通过' }] },
          3: { id: 's5s3', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '张主任', auditTime: '2026-11-12 15:00', _records: [{ id: 75, nodeType: 'submit', submitTime: '2026-11-07 10:00', remark: '预约答辩' }, { id: 76, nodeType: 'audit', status: 'approved', auditTime: '2026-11-12 15:00', auditor: '张主任', opinion: '答辩通过' }] },
          4: { id: 's5s4', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '赵管理员', auditTime: '2026-11-16 10:00', _records: [{ id: 77, nodeType: 'submit', submitTime: '2026-11-13 14:00', remark: '发布申请' }, { id: 78, nodeType: 'audit', status: 'approved', auditTime: '2026-11-16 10:00', auditor: '赵管理员', opinion: '已发布' }] }
        },
        // 智慧慢病管理一体化服务 V1 — 被驳回于步骤3
        'SZYY202410240003-V1': {
          1: { id: 's6s1', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '李主管', auditTime: '2026-11-03 10:00', _records: [{ id: 81, nodeType: 'submit', submitTime: '2026-10-24 15:00', remark: '机构提交申报材料' }, { id: 82, nodeType: 'audit', status: 'approved', auditTime: '2026-11-03 10:00', auditor: '李主管', opinion: '材料完整' }] },
          2: { id: 's6s2', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '王工程师', auditTime: '2026-11-07 14:00', _records: [{ id: 83, nodeType: 'submit', submitTime: '2026-11-04 09:00', remark: '进入技术测评' }, { id: 84, nodeType: 'audit', status: 'approved', auditTime: '2026-11-07 14:00', auditor: '王工程师', opinion: '技术测试通过' }] },
          3: { id: 's6s3', status: 'rejected', statusKey: 'rejected', statusText: '已驳回', auditor: '张主任', auditTime: '2026-11-14 16:00', _records: [{ id: 85, nodeType: 'submit', submitTime: '2026-11-08 10:00', remark: '预约答辩' }, { id: 86, nodeType: 'audit', status: 'rejected', auditTime: '2026-11-14 16:00', auditor: '张主任', opinion: '慢病管理闭环流程不完整，缺少患者随访跟踪环节' }] },
          4: { id: 's6s4', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] }
        },
        // 急诊急救指挥调度服务 V1 — 待审核，步骤1
        'SZYY202410240004-V1': {
          1: {
            id: 's7s1', status: 'processing', statusKey: 'processing', statusText: '进行中',
            auditor: '', auditTime: '',
            _records: [
              { id: 91, nodeType: 'submit', submitTime: '2026-10-24 15:00', remark: '机构提交申报材料' }
            ]
          },
          2: { id: 's7s2', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] },
          3: { id: 's7s3', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] },
          4: { id: 's7s4', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] }
        },
        // 智慧医疗综合管理服务 V1 — 已通过
        'SZYY202410240005-V1': {
          1: { id: 's8s1', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '李主管', auditTime: '2026-03-15 14:00', _records: [{ id: 101, nodeType: 'submit', submitTime: '2026-03-10 08:00', remark: '机构提交申报材料' }, { id: 102, nodeType: 'audit', status: 'approved', auditTime: '2026-03-15 14:00', auditor: '李主管', opinion: '材料齐全，审核通过' }] },
          2: { id: 's8s2', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '王工程师', auditTime: '2026-03-20 10:00', _records: [{ id: 103, nodeType: 'submit', submitTime: '2026-03-16 09:00', remark: '进入技术测评' }, { id: 104, nodeType: 'audit', status: 'approved', auditTime: '2026-03-20 10:00', auditor: '王工程师', opinion: '技术架构合理，性能达标' }] },
          3: { id: 's8s3', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '张主任', auditTime: '2026-03-28 15:00', _records: [{ id: 105, nodeType: 'submit', submitTime: '2026-03-21 10:00', remark: '预约答辩' }, { id: 106, nodeType: 'audit', status: 'approved', auditTime: '2026-03-28 15:00', auditor: '张主任', opinion: '演示流畅，功能完备' }] },
          4: { id: 's8s4', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '赵管理员', auditTime: '2026-04-02 09:00', _records: [{ id: 107, nodeType: 'submit', submitTime: '2026-03-29 14:00', remark: '提交发布申请' }, { id: 108, nodeType: 'audit', status: 'approved', auditTime: '2026-04-02 09:00', auditor: '赵管理员', opinion: '已发布至数字应用目录' }] }
        },
        // 智慧医疗综合管理服务 V2 — 待审核，步骤1
        'SZYY202410240005-V2': {
          1: {
            id: 's9s1', status: 'processing', statusKey: 'processing', statusText: '进行中',
            auditor: '', auditTime: '',
            _records: [
              { id: 111, nodeType: 'submit', submitTime: '2026-06-01 09:30', remark: '机构修改应用架构后重新提交V2' }
            ]
          },
          2: { id: 's9s2', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] },
          3: { id: 's9s3', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] },
          4: { id: 's9s4', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] }
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
      const list = this.appList.filter(item => {
        if (f.title && !(item.title || '').includes(f.title)) return false
        if (f.serviceId && !(item.serviceId || '').includes(f.serviceId)) return false
        if (f.targetObjectStr && item.targetObjectStr !== f.targetObjectStr) return false
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
  methods: {
    handleQuery() {
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    resetQuery() {
      this.filter = { title: '', serviceId: '', serviceProvider: '', appScope: undefined, targetObjectStr: undefined, status: undefined, step: undefined, submitTimeRange: [] }
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
    // 当前应用的审核进度：currentStep 表示正在进行的阶段（1~4）
    isStepApproved(idx) {
      if (!this.drawer.record) return false
      const status = String(this.drawer.record.auditStatus)
      const cur = this.drawer.record.currentStep || 1
      // 整体已通过：所有步骤都已完成
      if (status === '20') return true
      // 整体已驳回：驳回步骤之前的算已通过
      if (status === '30') return idx < cur - 1
      // 待审核：当前步骤之前的算已通过
      return idx < cur - 1
    },
    isStepRejected(idx) {
      if (!this.drawer.record) return false
      const status = String(this.drawer.record.auditStatus)
      const cur = this.drawer.record.currentStep || 1
      // 整体已驳回：当前步骤为驳回步骤
      return status === '30' && idx === cur - 1
    },
    isStepCurrent(idx) {
      if (!this.drawer.record) return false
      const status = String(this.drawer.record.auditStatus)
      const cur = this.drawer.record.currentStep || 1
      // 待审核状态：当前步骤为进行中
      return status === '10' && idx === cur - 1
    },
    // 获取该步骤的审核记录（从当前提交的审核数据中查找）
    getStepRecord(idx) {
      const record = this.drawer.record
      if (!record || !record.submissionId) return null
      const subData = this.submissionAuditData[record.submissionId]
      if (!subData) return null
      const stageData = subData[this.auditSteps[idx].key]
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
    getStepCardClass(idx) {
      if (this.isStepApproved(idx)) return 'done'
      if (this.isStepRejected(idx)) return 'rejected'
      if (this.isStepCurrent(idx)) return 'processing'
      return 'wait'
    },
    getAttachmentsForStep(idx) {
      return []
    },
    formatTime(time) {
      if (!time) return '--'
      if (/\d{2}:\d{2}:\d{2}/.test(time)) return time
      return time + ':00'
    },
    formatArray(arr) {
      if (!arr || !Array.isArray(arr) || arr.length === 0) return '--'
      return arr.join('、')
    },
    getCurrentStepNumber() {
      return this.drawer.record ? (this.drawer.record.currentStep || 1) : 1
    },
    getCurrentStepStatusClass() {
      const record = this.drawer.record
      if (!record || !record.submissionId) return ''
      const subData = this.submissionAuditData[record.submissionId]
      if (!subData) return ''
      const cur = record.currentStep || 1
      const stage = subData[cur]
      if (!stage) return ''
      return stage.status === 'rejected' ? 'rejected' : 'done'
    },
    getCurrentStepRecord() {
      const record = this.drawer.record
      if (!record || !record.submissionId) return null
      const subData = this.submissionAuditData[record.submissionId]
      if (!subData) return null
      const cur = record.currentStep || 1
      const stage = subData[cur]
      if (!stage) return null
      return {
        auditor: stage.auditor || '',
        auditTime: stage.auditTime || '',
        opinion: (stage._records || []).filter(r => r.nodeType === 'audit').slice(-1)[0]?.opinion || ''
      }
    },
    getHistorySteps() {
      const record = this.drawer.record
      if (!record || !record.submissionId) return []
      const subData = this.submissionAuditData[record.submissionId]
      if (!subData) return []
      const cur = record.currentStep || 1
      const history = []
      for (let i = 0; i < cur - 1; i++) {
        const stage = subData[this.auditSteps[i].key]
        if (stage && (stage.status === 'approved' || stage.status === 'rejected')) {
          const lastAudit = (stage._records || []).filter(r => r.nodeType === 'audit').slice(-1)[0]
          history.push({
            idx: i,
            status: stage.status === 'rejected' ? 'rejected' : 'done',
            auditor: stage.auditor || '',
            auditTime: stage.auditTime || '',
            opinion: lastAudit ? lastAudit.opinion : ''
          })
        }
      }
      return history
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
    startAudit(app) {
      this.openDrawer(app)
    },
    viewDetails(app) {
      this.openDrawer(app)
    },
    openDrawer(app) {
      this.drawer.record = {
        ...this.appDetailMock,
        submissionId: app.submissionId,
        title: app.title,
        serviceId: app.serviceId,
        cloudProviderStr: app.cloudProviderStr,
        targetObjectStr: app.targetObjectStr,
        appScope: app.appScope,
        serviceProvider: app.serviceProvider,
        cooperativeEnterprise: app.cooperativeEnterprise,
        description: app.description,
        submitTime: app.submitTime,
        auditStatus: app.auditStatus,
        currentStep: app.currentStep || 1
      }
      this.auditForm.opinion = ''
      this.activeStepIdx = (app.currentStep || 1) - 1
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
        title: '确认通过',
        content: '确定要通过该应用的审核吗？',
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
        title: '确认驳回',
        content: '确定要驳回该应用的审核吗？',
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
.digital-app-audit-page {
  padding: 4px 0;
}

.digital-app-audit-page__divider {
  height: 1px;
  background: #F2F3F5;
  margin: 0 16px;
}

.digital-app-audit-page__table-wrap {
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

.step-node__header-right {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
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

/* 左侧概览 — 标签列 */
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