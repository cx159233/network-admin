<template>
  <div class="security-audit-page">
    <PageHeader
      title="安全服务审核"
      description="审核服务商提交的安全服务上架申请，支持按服务名称、服务ID和审核状态筛选"
    />

    <CloudCard class="security-audit-page__table-card">
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
        <a-input v-model:value="filter.title" placeholder="安全服务名称" allow-clear style="width: 180px" @pressEnter="handleQuery" />
        <a-input v-model:value="filter.serviceId" placeholder="安全服务ID" allow-clear style="width: 180px" @pressEnter="handleQuery" />
        <a-input v-model:value="filter.serviceProvider" placeholder="服务商名称" allow-clear style="width: 160px" @pressEnter="handleQuery" />
        <template #suffix>
          <ColumnSettings v-model="hiddenKeys" :columns="columns" />
        </template>
      </FilterBar>
      <div class="security-audit-page__divider"></div>

      <div class="security-audit-page__table-wrap">
        <a-table :scroll="{ x: 1450 }"
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
                <a-descriptions-item label="服务描述">
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
                <a-descriptions-item label="服务商名称">{{ drawer.record.serviceProvider || '--' }}</a-descriptions-item>
                <a-descriptions-item label="合作伙伴">{{ drawer.record.cooperativeEnterprise || '--' }}</a-descriptions-item>
                <a-descriptions-item label="联系方式1">{{ drawer.record.contact1Name || '--' }} {{ drawer.record.contact1Phone || '' }}</a-descriptions-item>
                <a-descriptions-item label="联系方式2">{{ drawer.record.contact2Name || '--' }} {{ drawer.record.contact2Phone || '' }}</a-descriptions-item>
              </a-descriptions>
            </div>
            <div class="split-section">
              <div class="split-section__title">分类标签</div>
              <a-descriptions :column="1" bordered size="small">
                <a-descriptions-item label="应用架构">{{ drawer.record.appArchitecture || '--' }}</a-descriptions-item>
                <a-descriptions-item label="部署云服务商">{{ drawer.record.cloudProviderStr || '--' }}</a-descriptions-item>
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

export default {
  name: 'SecurityServiceAudit',
  components: {
    PageHeader, CloudCard, FilterBar, StatusDot, ColumnSettings,
    CheckOutlined, CloseOutlined, DownloadOutlined, FileOutlined,
    RobotOutlined
  },
  data() {
    return {
      loading: false,
      hiddenKeys: [],
      filter: { title: '', serviceId: '', serviceProvider: '', status: undefined, step: undefined, submitTimeRange: [] },
      applied: { title: '', serviceId: '', serviceProvider: '', status: undefined, step: undefined, submitTimeRange: [] },
      pagination: { current: 1, pageSize: 10 },
      columns: [
        { title: '提交审核时间', dataIndex: 'submitTime', key: 'submitTime', width: 170 },
        { title: '审核状态', dataIndex: 'auditStatus', key: 'auditStatus', width: 110 },
        { title: '审核阶段', dataIndex: 'currentStep', key: 'currentStep', width: 140 },
        { title: '安全服务名称/ID', dataIndex: 'title', key: 'title', width: 240 },
        { title: '服务描述', dataIndex: 'description', key: 'description', width: 280, customCell: () => ({ class: 'cell-wrap' }) },
        { title: '服务商名称', dataIndex: 'serviceProvider', key: 'serviceProvider', width: 150, ellipsis: true },
        { title: '合作伙伴', dataIndex: 'cooperativeEnterprise', key: 'cooperativeEnterprise', ellipsis: true, width: 150 },
        { title: '部署云服务商', dataIndex: 'cloudProviderStr', key: 'cloudProviderStr', width: 120 },
        { title: '操作', dataIndex: 'action', key: 'action', width: 90, fixed: 'right' }
      ],
      serviceList: [
        { submissionId: 'AQFW202410220001-V1', serviceId: 'AQFW202410220001', serviceGroup: '等保三级合规评估', versionNo: 1, title: '等保三级合规评估', appArchitecture: 'B/S架构', serviceProvider: '深信服科技股份有限公司', cloudProviderStr: '移动云、联通云', auditStatus: 10, currentStep: 1, submitTime: '2026-10-22 10:20:04' },
        { submissionId: 'AQFW202410220001-V2', serviceId: 'AQFW202410220001', serviceGroup: '等保三级合规评估', versionNo: 2, title: '等保三级合规评估', appArchitecture: 'B/S架构', serviceProvider: '深信服科技股份有限公司', cloudProviderStr: '移动云、联通云', auditStatus: 10, currentStep: 1, submitTime: '2026-10-22 14:30:00' },
        { submissionId: 'AQFW202410230001-V1', serviceId: 'AQFW202410230001-V1', serviceGroup: '云防火墙', versionNo: 1, title: '云防火墙', appArchitecture: 'B/S、C/S架构', serviceProvider: '奇安信科技集团', cloudProviderStr: '电信云', auditStatus: 10, currentStep: 2, submitTime: '2026-10-23 09:15:32' },
        { submissionId: 'AQFW202410240001', serviceId: 'AQFW202410240001', serviceGroup: '云安全中心', versionNo: 1, title: '云安全中心', appArchitecture: 'B/S架构、移动端H5', serviceProvider: '绿盟科技', cloudProviderStr: '浪潮云', auditStatus: 20, currentStep: 4, submitTime: '2026-10-24 14:59:25' },
        { submissionId: 'AQFW202410240002', serviceId: 'AQFW202410240002', serviceGroup: '数据安全审计', versionNo: 1, title: '数据安全审计', appArchitecture: 'B/S架构', serviceProvider: '安恒信息', cloudProviderStr: '联通云、影像云', auditStatus: 20, currentStep: 4, submitTime: '2026-10-24 15:00:03' },
        { submissionId: 'AQFW202410240003', serviceId: 'AQFW202410240003', serviceGroup: 'DDoS高防', versionNo: 1, title: 'DDoS高防', appArchitecture: 'C/S架构', serviceProvider: '华为技术', cloudProviderStr: '移动云', auditStatus: 30, currentStep: 3, submitTime: '2026-10-24 15:00:21' },
        { submissionId: 'AQFW202410240004', serviceId: 'AQFW202410240004', serviceGroup: 'Web应用防火墙', versionNo: 1, title: 'Web应用防火墙', appArchitecture: 'B/S架构', serviceProvider: '启明星辰', cloudProviderStr: '电信云、移动云', auditStatus: 10, currentStep: 1, submitTime: '2026-10-24 15:00:40' },
        { submissionId: 'AQFW202410240005', serviceId: 'AQFW202410240005', serviceGroup: '漏洞扫描服务', versionNo: 1, title: '漏洞扫描服务', appArchitecture: 'B/S架构', serviceProvider: '天融信', cloudProviderStr: '紫光云', auditStatus: 20, currentStep: 4, submitTime: '2026-10-24 15:01:13' },
        { submissionId: 'AQFW202410240006', serviceId: 'AQFW202410240006', serviceGroup: '安全态势感知', versionNo: 1, title: '安全态势感知', appArchitecture: 'B/S、C/S架构', serviceProvider: '360安全', cloudProviderStr: '浪潮云、影像云', auditStatus: 30, currentStep: 2, submitTime: '2026-10-24 15:01:28' }
      ],
      drawer: { visible: false, record: null, activeTab: 'overview' },
      auditForm: { opinion: '' },
      activeStepIdx: 0,
      serviceDetailMock: {
        logo: 'https://img.alicdn.com/imgextra/i3/O1CN01Wr5Kxq1NqSGZXMKBf_!!6000000001620-2-tps-120-120.png',
        systemUrl: 'https://security.cloud.cn/service',
        description: '提供全面的等保合规评估与安全审计服务，支持多云环境部署。',
        serviceProvider: '深信服科技股份有限公司',
        cooperativeEnterprise: '奇安信科技、绿盟科技',
        contact1Name: '赵经理',
        contact1Phone: '13800138001',
        contact2Name: '钱助理',
        contact2Phone: '13900139001',
        paymentMethodRef: '按年订阅付费，含安全运维与升级服务，费用根据服务内容协商确定',
        sortOrder: 1,
        appArchitecture: 'B/S、C/S架构',
        targetObjectStr: '公立医院',
        appScope: '全国'
      },
      submissionAuditData: {
        'AQFW202410220001-V1': {
          1: { id: 's1', stage: '申报材料评估', stageIdx: 0, status: 'pending', statusKey: 'processing', statusText: '进行中', auditor: '', auditTime: '', _records: [{ id: 1, nodeType: 'submit', status: 'pending', submitTime: '2026-10-22 10:20:04', auditTime: '2026-10-22 10:20:04', remark: '服务商提交申报材料', auditor: '', opinion: '' }] },
          2: { id: 's2', stage: '应用技术测评', stageIdx: 1, status: 'pending', statusKey: 'default', statusText: '待审核', auditor: '', auditTime: '', _records: [] },
          3: { id: 's3', stage: '现场演示答辩', stageIdx: 2, status: 'pending', statusKey: 'default', statusText: '待审核', auditor: '', auditTime: '', _records: [] },
          4: { id: 's4', stage: '服务目录发布', stageIdx: 3, status: 'pending', statusKey: 'default', statusText: '待审核', auditor: '', auditTime: '', _records: [] }
        },
        'AQFW202410220001-V2': {
          1: { id: 's1', stage: '申报材料评估', stageIdx: 0, status: 'pending', statusKey: 'processing', statusText: '进行中', auditor: '', auditTime: '', _records: [{ id: 1, nodeType: 'submit', status: 'pending', submitTime: '2026-10-22 14:30:00', auditTime: '2026-10-22 14:30:00', remark: '服务商提交V2版本申报材料（含AI审计模块）', auditor: '', opinion: '' }] },
          2: { id: 's2', stage: '应用技术测评', stageIdx: 1, status: 'pending', statusKey: 'default', statusText: '待审核', auditor: '', auditTime: '', _records: [] },
          3: { id: 's3', stage: '现场演示答辩', stageIdx: 2, status: 'pending', statusKey: 'default', statusText: '待审核', auditor: '', auditTime: '', _records: [] },
          4: { id: 's4', stage: '服务目录发布', stageIdx: 3, status: 'pending', statusKey: 'default', statusText: '待审核', auditor: '', auditTime: '', _records: [] }
        },
        'AQFW202410230001-V1': {
          1: { id: 's1', stage: '申报材料评估', stageIdx: 0, status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '李主管', auditTime: '2026-10-25 15:30', _records: [{ id: 1, nodeType: 'submit', status: 'pending', submitTime: '2026-10-23 09:15:32', auditTime: '2026-10-23 09:15:32', remark: '服务商提交申报材料', auditor: '', opinion: '' }, { id: 2, nodeType: 'audit', status: 'approved', submitTime: '2026-10-23 09:15:32', auditTime: '2026-10-25 15:30', auditor: '李主管', opinion: '材料完整、资质齐全，本阶段通过' }] },
          2: { id: 's2', stage: '应用技术测评', stageIdx: 1, status: 'pending', statusKey: 'processing', statusText: '进行中', auditor: '', auditTime: '', _records: [{ id: 3, nodeType: 'submit', status: 'pending', submitTime: '2026-10-26 10:00', auditTime: '2026-10-26 10:00', remark: '材料评估通过，进入技术测评', auditor: '', opinion: '' }] },
          3: { id: 's3', stage: '现场演示答辩', stageIdx: 2, status: 'pending', statusKey: 'default', statusText: '待审核', auditor: '', auditTime: '', _records: [] },
          4: { id: 's4', stage: '服务目录发布', stageIdx: 3, status: 'pending', statusKey: 'default', statusText: '待审核', auditor: '', auditTime: '', _records: [] }
        },
        'AQFW202410240001': {
          1: { id: 's1', stage: '申报材料评估', stageIdx: 0, status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '李主管', auditTime: '2026-10-27 10:00', _records: [{ id: 1, nodeType: 'submit', status: 'pending', submitTime: '2026-10-24 14:59:25', auditTime: '2026-10-24 14:59:25', remark: '服务商提交申报材料', auditor: '', opinion: '' }, { id: 2, nodeType: 'audit', status: 'approved', submitTime: '2026-10-24 14:59:25', auditTime: '2026-10-27 10:00', auditor: '李主管', opinion: '材料完整，通过' }] },
          2: { id: 's2', stage: '应用技术测评', stageIdx: 1, status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '王工程师', auditTime: '2026-10-29 14:00', _records: [{ id: 3, nodeType: 'submit', status: 'pending', submitTime: '2026-10-28 09:00', auditTime: '2026-10-28 09:00', remark: '进入技术测评', auditor: '', opinion: '' }, { id: 4, nodeType: 'audit', status: 'approved', submitTime: '2026-10-28 09:00', auditTime: '2026-10-29 14:00', auditor: '王工程师', opinion: '安全能力与性能指标均达标' }] },
          3: { id: 's3', stage: '现场演示答辩', stageIdx: 2, status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '张主任', auditTime: '2026-11-01 16:00', _records: [{ id: 5, nodeType: 'submit', status: 'pending', submitTime: '2026-10-30 10:00', auditTime: '2026-10-30 10:00', remark: '预约现场演示', auditor: '', opinion: '' }, { id: 6, nodeType: 'audit', status: 'approved', submitTime: '2026-10-30 10:00', auditTime: '2026-11-01 16:00', auditor: '张主任', opinion: '功能演示完整，答辩通过' }] },
          4: { id: 's4', stage: '服务目录发布', stageIdx: 3, status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '刘总监', auditTime: '2026-11-03 10:00', _records: [{ id: 7, nodeType: 'submit', status: 'pending', submitTime: '2026-11-02 09:00', auditTime: '2026-11-02 09:00', remark: '答辩通过，提交发布申请', auditor: '', opinion: '' }, { id: 8, nodeType: 'audit', status: 'approved', submitTime: '2026-11-02 09:00', auditTime: '2026-11-03 10:00', auditor: '刘总监', opinion: '符合发布标准，发布至服务目录' }] }
        },
        'AQFW202410240002': {
          1: { id: 's1', stage: '申报材料评估', stageIdx: 0, status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '李主管', auditTime: '2026-10-27 11:00', _records: [{ id: 1, nodeType: 'submit', status: 'pending', submitTime: '2026-10-24 15:00:03', auditTime: '2026-10-24 15:00:03', remark: '服务商提交申报材料', auditor: '', opinion: '' }, { id: 2, nodeType: 'audit', status: 'approved', submitTime: '2026-10-24 15:00:03', auditTime: '2026-10-27 11:00', auditor: '李主管', opinion: '材料齐全，审核通过' }] },
          2: { id: 's2', stage: '应用技术测评', stageIdx: 1, status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '王工程师', auditTime: '2026-10-29 15:00', _records: [{ id: 3, nodeType: 'submit', status: 'pending', submitTime: '2026-10-28 09:30', auditTime: '2026-10-28 09:30', remark: '进入技术测评', auditor: '', opinion: '' }, { id: 4, nodeType: 'audit', status: 'approved', submitTime: '2026-10-28 09:30', auditTime: '2026-10-29 15:00', auditor: '王工程师', opinion: '审计能力覆盖全面，性能优秀' }] },
          3: { id: 's3', stage: '现场演示答辩', stageIdx: 2, status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '张主任', auditTime: '2026-11-01 17:00', _records: [{ id: 5, nodeType: 'submit', status: 'pending', submitTime: '2026-10-30 14:00', auditTime: '2026-10-30 14:00', remark: '预约现场演示', auditor: '', opinion: '' }, { id: 6, nodeType: 'audit', status: 'approved', submitTime: '2026-10-30 14:00', auditTime: '2026-11-01 17:00', auditor: '张主任', opinion: '数据溯源与告警联动演示完整' }] },
          4: { id: 's4', stage: '服务目录发布', stageIdx: 3, status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '刘总监', auditTime: '2026-11-03 14:00', _records: [{ id: 7, nodeType: 'submit', status: 'pending', submitTime: '2026-11-02 10:00', auditTime: '2026-11-02 10:00', remark: '提交发布申请', auditor: '', opinion: '' }, { id: 8, nodeType: 'audit', status: 'approved', submitTime: '2026-11-02 10:00', auditTime: '2026-11-03 14:00', auditor: '刘总监', opinion: '发布至服务目录' }] }
        },
        'AQFW202410240003': {
          1: { id: 's1', stage: '申报材料评估', stageIdx: 0, status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '李主管', auditTime: '2026-10-27 15:00', _records: [{ id: 1, nodeType: 'submit', status: 'pending', submitTime: '2026-10-24 15:00:21', auditTime: '2026-10-24 15:00:21', remark: '服务商提交申报材料', auditor: '', opinion: '' }, { id: 2, nodeType: 'audit', status: 'approved', submitTime: '2026-10-24 15:00:21', auditTime: '2026-10-27 15:00', auditor: '李主管', opinion: '材料完整，通过' }] },
          2: { id: 's2', stage: '应用技术测评', stageIdx: 1, status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '王工程师', auditTime: '2026-10-30 10:00', _records: [{ id: 3, nodeType: 'submit', status: 'pending', submitTime: '2026-10-28 10:00', auditTime: '2026-10-28 10:00', remark: '进入技术测评', auditor: '', opinion: '' }, { id: 4, nodeType: 'audit', status: 'approved', submitTime: '2026-10-28 10:00', auditTime: '2026-10-30 10:00', auditor: '王工程师', opinion: '防护能力与清洗效率达标' }] },
          3: { id: 's3', stage: '现场演示答辩', stageIdx: 2, status: 'rejected', statusKey: 'rejected', statusText: '已驳回', auditor: '张主任', auditTime: '2026-11-04 11:00', _records: [{ id: 5, nodeType: 'submit', status: 'pending', submitTime: '2026-10-31 09:00', auditTime: '2026-10-31 09:00', remark: '预约现场演示', auditor: '', opinion: '' }, { id: 6, nodeType: 'audit', status: 'rejected', submitTime: '2026-10-31 09:00', auditTime: '2026-11-04 11:00', auditor: '张主任', opinion: '攻击流量模拟场景不足，缺少多协议混合攻击演示，请补充后重新答辩' }] },
          4: { id: 's4', stage: '服务目录发布', stageIdx: 3, status: 'pending', statusKey: 'default', statusText: '待审核', auditor: '', auditTime: '', _records: [] }
        },
        'AQFW202410240004': {
          1: { id: 's1', stage: '申报材料评估', stageIdx: 0, status: 'pending', statusKey: 'processing', statusText: '进行中', auditor: '', auditTime: '', _records: [{ id: 1, nodeType: 'submit', status: 'pending', submitTime: '2026-10-24 15:00:40', auditTime: '2026-10-24 15:00:40', remark: '服务商提交申报材料', auditor: '', opinion: '' }] },
          2: { id: 's2', stage: '应用技术测评', stageIdx: 1, status: 'pending', statusKey: 'default', statusText: '待审核', auditor: '', auditTime: '', _records: [] },
          3: { id: 's3', stage: '现场演示答辩', stageIdx: 2, status: 'pending', statusKey: 'default', statusText: '待审核', auditor: '', auditTime: '', _records: [] },
          4: { id: 's4', stage: '服务目录发布', stageIdx: 3, status: 'pending', statusKey: 'default', statusText: '待审核', auditor: '', auditTime: '', _records: [] }
        },
        'AQFW202410240005': {
          1: { id: 's1', stage: '申报材料评估', stageIdx: 0, status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '李主管', auditTime: '2026-10-28 09:00', _records: [{ id: 1, nodeType: 'submit', status: 'pending', submitTime: '2026-10-24 15:01:13', auditTime: '2026-10-24 15:01:13', remark: '服务商提交申报材料', auditor: '', opinion: '' }, { id: 2, nodeType: 'audit', status: 'approved', submitTime: '2026-10-24 15:01:13', auditTime: '2026-10-28 09:00', auditor: '李主管', opinion: '材料完整，通过' }] },
          2: { id: 's2', stage: '应用技术测评', stageIdx: 1, status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '王工程师', auditTime: '2026-10-30 16:00', _records: [{ id: 3, nodeType: 'submit', status: 'pending', submitTime: '2026-10-29 09:00', auditTime: '2026-10-29 09:00', remark: '进入技术测评', auditor: '', opinion: '' }, { id: 4, nodeType: 'audit', status: 'approved', submitTime: '2026-10-29 09:00', auditTime: '2026-10-30 16:00', auditor: '王工程师', opinion: '漏洞检测准确率高，扫描效率优秀' }] },
          3: { id: 's3', stage: '现场演示答辩', stageIdx: 2, status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '张主任', auditTime: '2026-11-02 15:00', _records: [{ id: 5, nodeType: 'submit', status: 'pending', submitTime: '2026-10-31 10:00', auditTime: '2026-10-31 10:00', remark: '预约现场演示', auditor: '', opinion: '' }, { id: 6, nodeType: 'audit', status: 'approved', submitTime: '2026-10-31 10:00', auditTime: '2026-11-02 15:00', auditor: '张主任', opinion: '报告生成与修复建议演示清晰' }] },
          4: { id: 's4', stage: '服务目录发布', stageIdx: 3, status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '刘总监', auditTime: '2026-11-04 09:00', _records: [{ id: 7, nodeType: 'submit', status: 'pending', submitTime: '2026-11-03 09:00', auditTime: '2026-11-03 09:00', remark: '提交发布申请', auditor: '', opinion: '' }, { id: 8, nodeType: 'audit', status: 'approved', submitTime: '2026-11-03 09:00', auditTime: '2026-11-04 09:00', auditor: '刘总监', opinion: '发布至服务目录' }] }
        },
        'AQFW202410240006': {
          1: { id: 's1', stage: '申报材料评估', stageIdx: 0, status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '李主管', auditTime: '2026-10-28 14:00', _records: [{ id: 1, nodeType: 'submit', status: 'pending', submitTime: '2026-10-24 15:01:28', auditTime: '2026-10-24 15:01:28', remark: '服务商提交申报材料', auditor: '', opinion: '' }, { id: 2, nodeType: 'audit', status: 'approved', submitTime: '2026-10-24 15:01:28', auditTime: '2026-10-28 14:00', auditor: '李主管', opinion: '材料完整，通过' }] },
          2: { id: 's2', stage: '应用技术测评', stageIdx: 1, status: 'rejected', statusKey: 'rejected', statusText: '已驳回', auditor: '王工程师', auditTime: '2026-11-05 10:00', _records: [{ id: 3, nodeType: 'submit', status: 'pending', submitTime: '2026-10-29 10:00', auditTime: '2026-10-29 10:00', remark: '进入技术测评', auditor: '', opinion: '' }, { id: 4, nodeType: 'audit', status: 'rejected', submitTime: '2026-10-29 10:00', auditTime: '2026-11-05 10:00', auditor: '王工程师', opinion: 'AI威胁检测准确率低于95%标准，误报率偏高，请优化模型后重新提交' }] },
          3: { id: 's3', stage: '现场演示答辩', stageIdx: 2, status: 'pending', statusKey: 'default', statusText: '待审核', auditor: '', auditTime: '', _records: [] },
          4: { id: 's4', stage: '服务目录发布', stageIdx: 3, status: 'pending', statusKey: 'default', statusText: '待审核', auditor: '', auditTime: '', _records: [] }
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
      const list = this.serviceList.filter(item => {
        if (f.title && !(item.title || '').includes(f.title)) return false
        if (f.serviceId && !(item.serviceId || '').includes(f.serviceId)) return false
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
    }
  },
  methods: {
    getDemoContainer() {
      return document.querySelector('.app-main__content') || document.body;
    },
    getDrawerContainer() {
      return document.querySelector('.app-overlay') || document.body;
    },
    handleQuery() {
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    resetQuery() {
      this.filter = { title: '', serviceId: '', serviceProvider: '', status: undefined, step: undefined, submitTimeRange: [] }
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
      const subData = this.submissionAuditData[this.drawer.record.submissionId]
      if (!subData) return null
      const mock = subData[this.auditSteps[idx].key]
      if (!mock || !mock._records || mock._records.length === 0) return null
      const auditRecords = mock._records.filter(r => r.nodeType === 'audit')
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
    startAudit(service) {
      this.openDrawer(service)
    },
    viewDetails(service) {
      this.openDrawer(service)
    },
    openDrawer(service) {
      this.drawer.record = {
        ...this.serviceDetailMock,
        title: service.title,
        serviceId: service.serviceId,
        submissionId: service.submissionId,
        cloudProviderStr: service.cloudProviderStr,
        appArchitecture: service.appArchitecture,
        serviceProvider: service.serviceProvider,
        submitTime: service.submitTime,
        auditStatus: service.auditStatus,
        currentStep: service.currentStep || 1
      }
      this.auditForm.opinion = ''
      this.activeStepIdx = (service.currentStep || 1) - 1
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
        content: '确定要通过该安全服务的审核吗？',
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
        content: '确定要驳回该安全服务的审核吗？',
        okText: '确定',
        cancelText: '取消',
        okType: 'danger',
        onOk: () => {
          message.success('审核已驳回')
          this.drawer.visible = false
        }
      })
    }
  }
}
</script>

<style scoped>
.security-audit-page {
  padding: 4px 0;
}

.security-audit-page__divider {
  height: 1px;
  background: #F2F3F5;
  margin: 0 16px;
}

.security-audit-page__table-wrap {
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
