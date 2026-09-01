<template>
  <div class="service-audit-page">
    <PageHeader
      title="基础服务审核"
      description="审核云服务商提交的基础资源服务上架申请，支持按服务名称、云服务商和审核状态筛选"
    />

    <CloudCard class="service-audit-page__table-card">
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
        <a-input v-model:value="filter.serviceName" placeholder="基础服务名称" allow-clear style="width: 180px" @pressEnter="handleQuery" />
        <a-input v-model:value="filter.serviceId" placeholder="基础服务ID" allow-clear style="width: 160px" @pressEnter="handleQuery" />
        <a-input v-model:value="filter.vendor" placeholder="服务商名称" allow-clear style="width: 160px" @pressEnter="handleQuery" />
        <template #suffix>
          <ColumnSettings v-model="hiddenKeys" :columns="columns" />
        </template>
      </FilterBar>
      <div class="service-audit-page__divider"></div>

      <div class="service-audit-page__table-wrap">
        <a-table :scroll="{ x: 1480 }"
          :columns="visibleColumns"
          :data-source="filteredData"
          :pagination="paginationConfig"
          :loading="loading"
          row-key="submissionId"
          size="middle"
          @change="onTableChange"
        >
          <template #bodyCell="{ column, record }">
            <span v-if="column.dataIndex === 'serviceName'" class="cell-name">
              <span class="cell-name__title">{{ record.serviceName || '--' }}</span>
              <span class="cell-name__id">{{ record.serviceId || '--' }}</span>
            </span>
            <template v-else-if="column.dataIndex === 'auditStatus'">
              <StatusDot :type="getAuditStatusKey(record.auditStatus)" :text="getAuditStatusText(record.auditStatus)" />
            </template>
            <span v-else-if="column.dataIndex === 'submitTime'" class="cell-default">{{ record.submitTime || '--' }}</span>
            <span v-else-if="column.dataIndex === 'currentStep'" class="cell-default">{{ getStepName(record.currentStep) }}</span>
            <span v-else-if="column.dataIndex === 'serviceZone'" class="cell-default">{{ getServiceZoneLabel(record.serviceZone) }}</span>
            <span v-else-if="column.dataIndex === 'serviceType'" class="cell-default">{{ record.serviceType || '--' }}</span>
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
              <span class="drawer-header-title">{{ drawer.record.serviceName }}</span>
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
                <a-descriptions-item label="服务商名称">{{ drawer.record.vendor || '--' }}</a-descriptions-item>
                <a-descriptions-item label="联系方式1">{{ drawer.record.contactPhone1 || '--' }}</a-descriptions-item>
                <a-descriptions-item label="联系方式2">{{ drawer.record.contactPhone2 || '--' }}</a-descriptions-item>
              </a-descriptions>
            </div>
            <div class="split-section">
              <div class="split-section__title">分类标签</div>
              <a-descriptions :column="1" bordered size="small">
                <a-descriptions-item label="服务专区">{{ getServiceZoneLabel(drawer.record.serviceZone) }}</a-descriptions-item>
                <a-descriptions-item label="部署云服务商">{{ drawer.record.cloudProvider || '--' }}</a-descriptions-item>
                <a-descriptions-item label="服务分类">{{ drawer.record.serviceType || '--' }}</a-descriptions-item>
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
  name: 'BasicServiceAudit',
  components: {
    PageHeader, CloudCard, FilterBar, StatusDot, ColumnSettings,
    CheckOutlined, CloseOutlined, DownloadOutlined, FileOutlined,
    RobotOutlined
  },
  data() {
    return {
      loading: false,
      hiddenKeys: [],
      filter: { serviceName: '', serviceId: '', vendor: '', cloudProvider: undefined, status: undefined, step: undefined, submitTimeRange: [] },
      applied: { serviceName: '', serviceId: '', vendor: '', cloudProvider: undefined, status: undefined, step: undefined, submitTimeRange: [] },
      pagination: { current: 1, pageSize: 10 },
      cloudProviderOptions: [
        { value: '影像云', label: '影像云' },
        { value: '电信云', label: '电信云' },
        { value: '移动云', label: '移动云' },
        { value: '联通云', label: '联通云' },
        { value: '浪潮云', label: '浪潮云' }
      ],
      columns: [
        { title: '提交审核时间', dataIndex: 'submitTime', key: 'submitTime', width: 170 },
        { title: '审核状态', dataIndex: 'auditStatus', key: 'auditStatus', width: 110 },
        { title: '审核阶段', dataIndex: 'currentStep', key: 'currentStep', width: 140 },
        { title: '基础服务名称/ID', dataIndex: 'serviceName', key: 'serviceName', width: 240 },
        { title: '服务专区', dataIndex: 'serviceZone', key: 'serviceZone', width: 120 },
        { title: '服务分类', dataIndex: 'serviceType', key: 'serviceType', width: 120 },
        { title: '服务描述', dataIndex: 'description', key: 'description', width: 280, customCell: () => ({ class: 'cell-wrap' }) },
        { title: '服务商名称', dataIndex: 'vendor', key: 'vendor', width: 200 },
        { title: '部署云服务商', dataIndex: 'cloudProvider', key: 'cloudProvider', width: 130 },
        { title: '操作', dataIndex: 'action', key: 'action', width: 90, fixed: 'right' }
      ],
      serviceList: [
        { submissionId: 'SVC001-V1', serviceId: 'SVC001', serviceGroup: '云服务器ECS', serviceName: '云服务器ECS', vendor: '浪潮云信息技术有限公司', contactPhone1: '400-880-8800', contactPhone2: '010-8888-0001', versionNo: 'V1', description: '弹性计算服务，提供安全可靠、弹性可扩展的云服务器', serviceZone: 'X86Zone', serviceType: '计算服务', cloudProvider: '电信云', auditStatus: 20, currentStep: 4, submitTime: '2026-10-18 11:21:45' },
        { submissionId: 'SVC002-V1', serviceId: 'SVC002', serviceGroup: '对象存储OSS', serviceName: '对象存储OSS', vendor: '中科信息安全有限公司', contactPhone1: '400-881-9901', contactPhone2: '021-6222-0002', versionNo: 'V1', description: '安全、稳定、高效的云存储服务', serviceZone: 'X86Zone', serviceType: '存储服务', cloudProvider: '移动云', auditStatus: 20, currentStep: 4, submitTime: '2026-10-21 14:45:23' },
        { submissionId: 'SVC002-V2', serviceId: 'SVC002', serviceGroup: '对象存储OSS', serviceName: '对象存储OSS', vendor: '中科信息安全有限公司', contactPhone1: '400-881-9901', contactPhone2: '021-6222-0002', versionNo: 'V2', description: '安全、稳定、高效的云存储服务', serviceZone: 'X86Zone', serviceType: '存储服务', cloudProvider: '移动云', auditStatus: 10, currentStep: 1, submitTime: '2026-10-22 10:00:00' },
        { submissionId: 'SVC003-V1', serviceId: 'SVC003', serviceGroup: '云数据库RDS', serviceName: '云数据库RDS', vendor: '华能数智科技集团', contactPhone1: '400-882-8802', contactPhone2: '010-6666-0003', versionNo: 'V1', description: '稳定可靠的关系型数据库服务', serviceZone: 'X86Zone', serviceType: '数据库服务', cloudProvider: '联通云', auditStatus: 10, currentStep: 2, submitTime: '2026-10-21 15:38:24' },
        { submissionId: 'SVC004-V1', serviceId: 'SVC004', serviceGroup: '负载均衡SLB', serviceName: '负载均衡SLB', vendor: '深圳云计算有限公司', contactPhone1: '400-883-8803', contactPhone2: '0755-8888-0004', versionNo: 'V1', description: '将访问流量分发到多台云服务器，提升应用可用性', serviceZone: 'XinChuangZone', serviceType: '网络服务', cloudProvider: '浪潮云', auditStatus: 10, currentStep: 1, submitTime: '2026-10-22 09:15:00' },
        { submissionId: 'SVC005-V1', serviceId: 'SVC005', serviceGroup: '内容分发网络CDN', serviceName: '内容分发网络CDN', vendor: '北京健康科技有限公司', contactPhone1: '400-884-8804', contactPhone2: '010-5555-0005', versionNo: 'V1', description: '将源站内容分发至最接近用户的节点，加速访问', serviceZone: 'XinChuangZone', serviceType: '网络服务', cloudProvider: '影像云', auditStatus: 30, currentStep: 3, submitTime: '2026-10-19 13:20:11' }
      ],
      drawer: { visible: false, record: null, activeTab: 'overview' },
      auditForm: { opinion: '' },
      activeStepIdx: 0,
      serviceDetailMock: {
        logo: '',
        vendor: '浪潮云信息技术有限公司',
        contactPhone1: '400-880-8800',
        contactPhone2: '010-8888-0001',
        serviceLevel: 'SLA 99.95%',
        serviceScope: '全国',
        region: '华东',
        paymentMethodRef: '按月/按量付费，含基础运维服务，具体费用根据服务规格协商确定',
        sortOrder: 1,
        materials: [
          { name: '服务技术白皮书.pdf', size: '3.2 MB' },
          { name: '安全合规认证.pdf', size: '1.5 MB' },
          { name: '服务等级协议SLA.pdf', size: '920 KB' },
          { name: '厂商资质证明.pdf', size: '1.1 MB' }
        ]
      },
      submissionAuditData: {
        'SVC001-V1': {
          1: { id: 's1', stage: '申报材料评估', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '平台管理员', auditTime: '2026-10-19 09:30', _records: [{ id: 1, nodeType: 'submit', status: 'pending', submitTime: '2026-10-18 11:21', auditTime: '2026-10-18 11:21', remark: '云服务商提交申报材料', auditor: '', opinion: '' }, { id: 2, nodeType: 'audit', status: 'approved', submitTime: '2026-10-18 11:21', auditTime: '2026-10-19 09:30', auditor: '平台管理员', opinion: '服务符合上架标准，审核通过。' }] },
          2: { id: 's2', stage: '应用技术测评', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '技术评审员', auditTime: '2026-10-21 14:00', _records: [{ id: 3, nodeType: 'submit', status: 'pending', submitTime: '2026-10-19 10:00', auditTime: '2026-10-19 10:00', remark: '材料评估通过后自动进入技术测评', auditor: '', opinion: '' }, { id: 4, nodeType: 'audit', status: 'approved', submitTime: '2026-10-19 10:00', auditTime: '2026-10-21 14:00', auditor: '技术评审员', opinion: '技术指标达标，性能测试通过。' }] },
          3: { id: 's3', stage: '现场演示答辩', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '答辩委员会', auditTime: '2026-10-22 16:30', _records: [{ id: 5, nodeType: 'submit', status: 'pending', submitTime: '2026-10-21 15:00', auditTime: '2026-10-21 15:00', remark: '技术测评通过后安排答辩', auditor: '', opinion: '' }, { id: 6, nodeType: 'audit', status: 'approved', submitTime: '2026-10-21 15:00', auditTime: '2026-10-22 16:30', auditor: '答辩委员会', opinion: '演示效果良好，答辩通过。' }] },
          4: { id: 's4', stage: '服务目录发布', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '平台管理员', auditTime: '2026-10-23 10:00', _records: [{ id: 7, nodeType: 'submit', status: 'pending', submitTime: '2026-10-22 17:00', auditTime: '2026-10-22 17:00', remark: '进入发布环节', auditor: '', opinion: '' }, { id: 8, nodeType: 'audit', status: 'approved', submitTime: '2026-10-22 17:00', auditTime: '2026-10-23 10:00', auditor: '平台管理员', opinion: '已发布至服务目录。' }] }
        },
        'SVC002-V1': {
          1: { id: 's1', stage: '申报材料评估', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '平台管理员', auditTime: '2026-10-22 10:00', _records: [{ id: 1, nodeType: 'submit', status: 'pending', submitTime: '2026-10-21 14:45', auditTime: '2026-10-21 14:45', remark: '云服务商提交申报材料', auditor: '', opinion: '' }, { id: 2, nodeType: 'audit', status: 'approved', submitTime: '2026-10-21 14:45', auditTime: '2026-10-22 10:00', auditor: '平台管理员', opinion: '材料齐全，审核通过。' }] },
          2: { id: 's2', stage: '应用技术测评', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '技术评审员', auditTime: '2026-10-23 15:30', _records: [{ id: 3, nodeType: 'submit', status: 'pending', submitTime: '2026-10-22 11:00', auditTime: '2026-10-22 11:00', remark: '进入技术测评阶段', auditor: '', opinion: '' }, { id: 4, nodeType: 'audit', status: 'approved', submitTime: '2026-10-22 11:00', auditTime: '2026-10-23 15:30', auditor: '技术评审员', opinion: '存储性能符合要求。' }] },
          3: { id: 's3', stage: '现场演示答辩', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '答辩委员会', auditTime: '2026-10-24 09:00', _records: [{ id: 5, nodeType: 'submit', status: 'pending', submitTime: '2026-10-23 16:00', auditTime: '2026-10-23 16:00', remark: '安排现场答辩', auditor: '', opinion: '' }, { id: 6, nodeType: 'audit', status: 'approved', submitTime: '2026-10-23 16:00', auditTime: '2026-10-24 09:00', auditor: '答辩委员会', opinion: '答辩通过。' }] },
          4: { id: 's4', stage: '服务目录发布', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '平台管理员', auditTime: '2026-10-24 16:00', _records: [{ id: 7, nodeType: 'submit', status: 'pending', submitTime: '2026-10-24 10:00', auditTime: '2026-10-24 10:00', remark: '进入发布环节', auditor: '', opinion: '' }, { id: 8, nodeType: 'audit', status: 'approved', submitTime: '2026-10-24 10:00', auditTime: '2026-10-24 16:00', auditor: '平台管理员', opinion: '已发布至服务目录。' }] }
        },
        'SVC002-V2': {
          1: { id: 's1', stage: '申报材料评估', status: 'pending', statusKey: 'processing', statusText: '进行中', auditor: '', auditTime: '', _records: [{ id: 1, nodeType: 'submit', status: 'pending', submitTime: '2026-10-22 10:00', auditTime: '2026-10-22 10:00', remark: '云服务商提交V2版本更新申报材料', auditor: '', opinion: '' }] },
          2: { id: 's2', stage: '应用技术测评', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] },
          3: { id: 's3', stage: '现场演示答辩', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] },
          4: { id: 's4', stage: '服务目录发布', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] }
        },
        'SVC003-V1': {
          1: { id: 's1', stage: '申报材料评估', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '平台管理员', auditTime: '2026-10-22 11:00', _records: [{ id: 1, nodeType: 'submit', status: 'pending', submitTime: '2026-10-21 15:38', auditTime: '2026-10-21 15:38', remark: '云服务商提交申报材料', auditor: '', opinion: '' }, { id: 2, nodeType: 'audit', status: 'approved', submitTime: '2026-10-21 15:38', auditTime: '2026-10-22 11:00', auditor: '平台管理员', opinion: 'RDS服务材料审核通过。' }] },
          2: { id: 's2', stage: '应用技术测评', status: 'pending', statusKey: 'processing', statusText: '进行中', auditor: '', auditTime: '', _records: [{ id: 3, nodeType: 'submit', status: 'pending', submitTime: '2026-10-22 12:00', auditTime: '2026-10-22 12:00', remark: '进入技术测评阶段', auditor: '', opinion: '' }] },
          3: { id: 's3', stage: '现场演示答辩', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] },
          4: { id: 's4', stage: '服务目录发布', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] }
        },
        'SVC004-V1': {
          1: { id: 's1', stage: '申报材料评估', status: 'pending', statusKey: 'processing', statusText: '进行中', auditor: '', auditTime: '', _records: [{ id: 1, nodeType: 'submit', status: 'pending', submitTime: '2026-10-22 09:15', auditTime: '2026-10-22 09:15', remark: '云服务商提交申报材料', auditor: '', opinion: '' }] },
          2: { id: 's2', stage: '应用技术测评', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] },
          3: { id: 's3', stage: '现场演示答辩', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] },
          4: { id: 's4', stage: '服务目录发布', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] }
        },
        'SVC005-V1': {
          1: { id: 's1', stage: '申报材料评估', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '平台管理员', auditTime: '2026-10-20 09:00', _records: [{ id: 1, nodeType: 'submit', status: 'pending', submitTime: '2026-10-19 13:20', auditTime: '2026-10-19 13:20', remark: '云服务商提交申报材料', auditor: '', opinion: '' }, { id: 2, nodeType: 'audit', status: 'approved', submitTime: '2026-10-19 13:20', auditTime: '2026-10-20 09:00', auditor: '平台管理员', opinion: 'CDN服务材料齐全，审核通过。' }] },
          2: { id: 's2', stage: '应用技术测评', status: 'approved', statusKey: 'done', statusText: '已通过', auditor: '技术评审员', auditTime: '2026-10-21 10:30', _records: [{ id: 3, nodeType: 'submit', status: 'pending', submitTime: '2026-10-20 10:00', auditTime: '2026-10-20 10:00', remark: '进入技术测评', auditor: '', opinion: '' }, { id: 4, nodeType: 'audit', status: 'approved', submitTime: '2026-10-20 10:00', auditTime: '2026-10-21 10:30', auditor: '技术评审员', opinion: 'CDN节点覆盖达标。' }] },
          3: { id: 's3', stage: '现场演示答辩', status: 'rejected', statusKey: 'rejected', statusText: '已驳回', auditor: '答辩委员会', auditTime: '2026-10-22 09:00', _records: [{ id: 5, nodeType: 'submit', status: 'pending', submitTime: '2026-10-21 14:00', auditTime: '2026-10-21 14:00', remark: '安排现场答辩', auditor: '', opinion: '' }, { id: 6, nodeType: 'audit', status: 'rejected', submitTime: '2026-10-21 14:00', auditTime: '2026-10-22 09:00', auditor: '答辩委员会', opinion: '答辩效果不理想，部分指标未达预期。' }] },
          4: { id: 's4', stage: '服务目录发布', status: 'pending', statusKey: 'processing', statusText: '未开始', auditor: '', auditTime: '', _records: [] }
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
        if (f.serviceName && !(item.serviceName || '').includes(f.serviceName)) return false
        if (f.vendor && !(item.vendor || '').includes(f.vendor)) return false
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
    this.loadServiceList()
  },
  methods: {
    getDemoContainer() {
      return document.querySelector('.app-main__content') || document.body;
    },
    getDrawerContainer() {
      return document.querySelector('.app-overlay') || document.body;
    },
    loadServiceList() {
      this.loading = true
      setTimeout(() => { this.loading = false }, 200)
    },
    handleQuery() {
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    resetQuery() {
      this.filter = { serviceName: '', serviceId: '', vendor: '', status: undefined, step: undefined, submitTimeRange: [] }
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    onTableChange(pag) {
      this.pagination.current = pag.current
      this.pagination.pageSize = pag.pageSize
    },
    getServiceTypeKey(type) {
      const map = { '计算服务': 'compute', '存储服务': 'storage', '数据库': 'database', '网络服务': 'network' }
      return map[type] || 'default'
    },
    getServiceTypeClass(type) {
      const map = { '计算服务': 'service-type-tag--compute', '存储服务': 'service-type-tag--storage', '数据库': 'service-type-tag--database', '网络服务': 'service-type-tag--network' }
      return map[type] || ''
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
      const data = this.submissionAuditData[this.drawer.record.submissionId]
      if (!data) return null
      const mock = data[this.auditSteps[idx].key]
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
    getServiceZoneLabel(zone) {
      const map = { X86Zone: 'X86专区', XinChuangZone: '信创专区', CipherZone: '密码服务专区', SuperComputeZone: '超算、智算专区' }
      return map[zone] || zone || '--'
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
    startAudit(service) {
      this.openDrawer(service)
    },
    viewDetails(service) {
      this.openDrawer(service)
    },
    openDrawer(service) {
      this.drawer.record = {
        ...this.serviceDetailMock,
        submissionId: service.submissionId,
        serviceName: service.serviceName,
        serviceId: service.serviceId,
        vendor: service.vendor,
        contactPhone1: service.contactPhone1,
        contactPhone2: service.contactPhone2,
        cloudProvider: service.cloudProvider,
        serviceType: service.serviceType,
        region: service.region,
        description: service.description,
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
        message.warning('审核意见为空：请填写审核意见')
        return
      }
      const isLastStage = this.activeStepIdx === this.auditSteps.length - 1
      const stepName = this.auditSteps[this.activeStepIdx]?.title || ''
      Modal.confirm({
        getContainer: this.getDemoContainer,
        title: '确认通过',
        content: isLastStage
          ? `当前为第 ${this.activeStepIdx + 1} 阶段（${stepName}），通过后将完成全部审核流程，确定通过吗？`
          : `通过后将从「${stepName}」进入下一阶段，确定通过吗？`,
        okText: '确定',
        cancelText: '取消',
        okType: 'primary',
        onOk: async () => {
          try {
            this.recordApproveLog()
            message.success('审核通过')
            this.drawer.visible = false
            this.fetchList()
          } catch (e) {
            message.error('网络异常，请稍后再试')
          }
        }
      })
    },
    reject() {
      if (!this.auditForm.opinion.trim()) {
        message.warning('审核意见为空：请填写审核意见')
        return
      }
      const stepName = this.auditSteps[this.activeStepIdx]?.title || ''
      Modal.confirm({
        getContainer: this.getDemoContainer,
        title: '确认驳回',
        content: `驳回后当前阶段（${stepName}）状态将变更为"已驳回"并终止审核流程，确定驳回吗？`,
        okText: '确定',
        cancelText: '取消',
        okType: 'danger',
        onOk: async () => {
          try {
            this.recordRejectLog()
            message.success('驳回成功')
            this.drawer.visible = false
            this.fetchList()
          } catch (e) {
            message.error('网络异常，请稍后再试')
          }
        }
      })
    },
    recordApproveLog() {
      const record = this.drawer.record
      if (!record) return
      const idx = this.activeStepIdx
      if (!record.auditFlow) record.auditFlow = {}
      record.auditFlow[`step${idx + 1}`] = {
        status: 'approved', opinion: this.auditForm.opinion, auditor: '当前审核人', auditTime: this.formatTime(new Date())
      }
      if (idx < this.auditSteps.length - 1) {
        record.currentStep = (record.currentStep || 1) + 1
      } else {
        record.auditStatus = '审核通过'
        record.currentStep = this.auditSteps.length
      }
      this.auditForm.opinion = ''
    },
    recordRejectLog() {
      const record = this.drawer.record
      if (!record) return
      const idx = this.activeStepIdx
      if (!record.auditFlow) record.auditFlow = {}
      record.auditFlow[`step${idx + 1}`] = {
        status: 'rejected', opinion: this.auditForm.opinion, auditor: '当前审核人', auditTime: this.formatTime(new Date())
      }
      record.auditStatus = '审核驳回'
      this.auditForm.opinion = ''
    },
  }
}
</script>

<style scoped>
.service-audit-page {
  padding: 4px 0;
}

.service-audit-page__divider {
  height: 1px;
  background: #F2F3F5;
  margin: 0 16px;
}

.service-audit-page__table-wrap {
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

.service-type-tag {
  display: inline-block;
  padding: 0 6px;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  border-radius: 3px;
  border: 1px solid;
  vertical-align: middle;
}

.service-type-tag--compute { color: #165DFF; background: #E8F3FF; border-color: rgba(22, 93, 255, 0.20); }
.service-type-tag--storage { color: #16A34A; background: rgba(22, 163, 74, 0.10); border-color: rgba(22, 163, 74, 0.20); }
.service-type-tag--database { color: #D97000; background: #FFF3E8; border-color: rgba(217, 112, 0, 0.20); }
.service-type-tag--network { color: #722ED1; background: #F5F0FF; border-color: rgba(114, 46, 209, 0.20); }

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