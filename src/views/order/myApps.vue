<template>
  <div class="my-apps-page">
    <PageHeader
      title="服务上架"
      description="管理已上架的服务，支持新增、修改、删除及提交审核"
    />

    <CloudCard class="my-apps-page__table-card">
      <FilterBar @search="handleQuery" @reset="resetQuery">
        <template #actions>
          <a-button type="primary" @click="showTypeSelector = true">
            <template #icon><PlusOutlined /></template>
            新增服务
          </a-button>
        </template>
        <a-select v-model:value="filter.serviceType" placeholder="服务类型" allow-clear style="width: 140px">
          <a-select-option value="数字应用">数字应用</a-select-option>
          <a-select-option value="安全服务">安全服务</a-select-option>
          <a-select-option value="能力组件">能力组件</a-select-option>
          <a-select-option value="基础服务">基础服务</a-select-option>
        </a-select>
        <a-input v-model:value="filter.title" placeholder="服务名称" allow-clear style="width: 180px" @pressEnter="handleQuery" />
        <a-input v-model:value="filter.serviceId" placeholder="服务ID" allow-clear style="width: 160px" @pressEnter="handleQuery" />
        <a-select v-model:value="filter.status" placeholder="状态" allow-clear style="width: 130px">
          <a-select-option value="draft">草稿</a-select-option>
          <a-select-option value="pending_review">待审核</a-select-option>
          <a-select-option value="published">已上线使用</a-select-option>
          <a-select-option value="rejected">已驳回</a-select-option>
          <a-select-option value="offline">已下架</a-select-option>
        </a-select>
      </FilterBar>
      <div class="my-apps-page__divider"></div>

      <div class="my-apps-page__table-wrap">
        <a-table
          :columns="columns"
          :data-source="filteredData"
          :pagination="paginationConfig"
          :loading="loading"
          row-key="id"
          size="middle"
          @change="onTableChange"
        >
          <template #bodyCell="{ column, record }">
            <span v-if="column.dataIndex === 'title'" class="cell-name">
              <span class="cell-name__title">{{ record.title || '--' }}</span>
              <span class="cell-name__id">{{ record.appId || '--' }}</span>
            </span>
            <template v-else-if="column.dataIndex === 'serviceType'">
              <span :class="['service-type-tag', `service-type-tag--${getServiceTypeClass(record.serviceType)}`]">{{ record.serviceType }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'createTime'">
              <span class="cell-mono">{{ formatTime(record.createTime) }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <StatusDot :type="getStatusKey(record.status)" :text="getStatusText(record.status)" />
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-space size="small">
                <a-button type="link" size="small" class="!p-0" @click="goToDetail(record)">详情</a-button>
                <a-divider v-if="canEdit(record.status)" type="vertical" class="!mx-[2px]" />
                <a-button v-if="canEdit(record.status)" type="link" size="small" class="!p-0" @click="handleEdit(record)">修改</a-button>
                <a-divider v-if="canEdit(record.status)" type="vertical" class="!mx-[2px]" />
                <a-button v-if="canEdit(record.status)" type="link" size="small" danger class="!p-0" @click="handleDelete(record)">删除</a-button>
              </a-space>
            </template>
            <span v-else class="cell-default">{{ record[column.dataIndex] || '--' }}</span>
          </template>
        </a-table>
      </div>
    </CloudCard>

    <!-- 服务类型选择弹窗 -->
    <a-modal
      v-model:open="showTypeSelector"
      title="选择服务类型"
      width="520px"
      :footer="null"
      :mask-closable="false"
    >
      <div class="type-selector-grid">
        <div
          v-for="opt in serviceTypeOptions"
          :key="opt.value"
          class="type-selector-card"
          @click="onSelectType(opt.value)"
        >
          <div class="type-selector-card__icon">
            <AppstoreOutlined v-if="opt.value === '数字应用'" />
            <SafetyOutlined v-else-if="opt.value === '安全服务'" />
            <BlockOutlined v-else-if="opt.value === '能力组件'" />
            <CloudServerOutlined v-else />
          </div>
          <div class="type-selector-card__title">{{ opt.label }}</div>
          <div class="type-selector-card__desc">{{ opt.desc }}</div>
        </div>
      </div>
    </a-modal>

    <a-modal
      v-model:open="deleteDialogVisible"
      title="删除确认"
      width="420px"
      :ok-text="'确定'"
      :cancel-text="'取消'"
      ok-type="danger"
      @ok="confirmDelete"
    >
      <div class="delete-modal__body">
        <ExclamationCircleFilled class="delete-modal__icon" />
        <p class="delete-modal__text">是否确认删除该服务？删除后不可恢复。</p>
      </div>
    </a-modal>

    <!-- 应用详情抽屉 -->
    <a-drawer
      v-model:open="drawer.visible"
      :title="drawerTitle"
      :width="860"
      placement="right"
      :body-style="{ padding: '24px' }"
    >
      <template v-if="drawer.record">
        <div class="drawer-header-row">
          <div class="drawer-header-icon" :class="`drawer-header-icon--${getServiceTypeClass(drawer.record.serviceType)}`">
            <img v-if="drawer.record.logo" :src="drawer.record.logo" class="drawer-header-logo" alt="" />
            <component :is="getServiceTypeIcon(drawer.record.serviceType)" v-else class="drawer-header-fallback" />
          </div>
          <div class="drawer-header-info">
            <div class="drawer-header-title-row">
              <span class="drawer-header-title">{{ drawer.record.title || '--' }}</span>
              <StatusDot :type="getStatusKey(drawer.record.status)" :text="getStatusText(drawer.record.status)" />
            </div>
            <div class="drawer-header-sub">
              <span>服务ID：{{ drawer.record.appId || drawer.record.contentId || '--' }}</span>
              <span class="drawer-header-sub__sep">·</span>
              <span>{{ drawer.record.serviceType || '--' }}</span>
            </div>
          </div>
        </div>

        <a-tabs v-model:activeKey="drawer.activeTab" class="mvp-detail-tabs">
          <a-tab-pane key="overview" tab="概览">
            <!-- 数字应用 / 安全服务 -->
            <template v-if="['数字应用', '安全服务'].includes(drawer.record.serviceType)">
              <div class="overview-section">
                <div class="overview-section__title">基本信息</div>
                <a-descriptions :column="2" bordered size="small" class="drawer-desc">
                  <a-descriptions-item label="系统地址" :span="2">{{ drawer.record.systemUrl || '--' }}</a-descriptions-item>
                  <a-descriptions-item label="显示顺序" :span="2">{{ drawer.record.sortOrder != null ? drawer.record.sortOrder : 0 }}</a-descriptions-item>
                  <a-descriptions-item label="应用描述" :span="2">{{ drawer.record.description || '--' }}</a-descriptions-item>
                </a-descriptions>
              </div>
              <div class="overview-section">
                <div class="overview-section__title">联系信息</div>
                <a-descriptions :column="2" bordered size="small" class="drawer-desc">
                  <a-descriptions-item label="服务商名称">{{ drawer.record.serviceProvider || '--' }}</a-descriptions-item>
                  <a-descriptions-item label="合作伙伴">{{ drawer.record.cooperativeEnterprise || '--' }}</a-descriptions-item>
                  <a-descriptions-item label="联系方式1">{{ drawer.record.contactName1 || '--' }} {{ drawer.record.contactPhone1 || '' }}</a-descriptions-item>
                  <a-descriptions-item label="联系方式2">{{ drawer.record.contactName2 || '--' }} {{ drawer.record.contactPhone2 || '' }}</a-descriptions-item>
                </a-descriptions>
              </div>
              <div class="overview-section">
                <div class="overview-section__title">分类标签</div>
                <a-descriptions :column="2" bordered size="small" class="drawer-desc">
                  <a-descriptions-item label="面向对象" :span="2">{{ formatArray(drawer.record.targetObject) }}</a-descriptions-item>
                  <a-descriptions-item label="应用架构" :span="2">{{ formatArray(drawer.record.appArchitecture) }}</a-descriptions-item>
                  <a-descriptions-item label="部署云服务商" :span="2">{{ formatArray(drawer.record.cloudProvider) }}</a-descriptions-item>
                  <a-descriptions-item v-if="drawer.record.targetObject && drawer.record.targetObject.includes('基层医疗卫生机构')" label="基层应用覆盖范围" :span="2">{{ formatArray(drawer.record.coverBase) }}</a-descriptions-item>
                  <a-descriptions-item v-if="drawer.record.targetObject && drawer.record.targetObject.includes('公立医院')" label="公立应用覆盖范围" :span="2">{{ formatArray(drawer.record.coverPublic) }}</a-descriptions-item>
                  <a-descriptions-item v-if="drawer.record.targetObject && drawer.record.targetObject.includes('医技护人员')" label="医技应用覆盖范围" :span="2">{{ formatArray(drawer.record.coverTech) }}</a-descriptions-item>
                </a-descriptions>
              </div>
            </template>

            <!-- 能力组件 -->
            <template v-else-if="drawer.record.serviceType === '能力组件'">
              <div class="overview-section">
                <div class="overview-section__title">基本信息</div>
                <a-descriptions :column="2" bordered size="small" class="drawer-desc">
                  <a-descriptions-item label="显示顺序" :span="2">{{ drawer.record.sortOrder != null ? drawer.record.sortOrder : 0 }}</a-descriptions-item>
                  <a-descriptions-item label="组件描述" :span="2">{{ drawer.record.description || '--' }}</a-descriptions-item>
                </a-descriptions>
              </div>
              <div class="overview-section">
                <div class="overview-section__title">联系信息</div>
                <a-descriptions :column="2" bordered size="small" class="drawer-desc">
                  <a-descriptions-item label="服务商名称" :span="2">{{ drawer.record.serviceProvider || '--' }}</a-descriptions-item>
                  <a-descriptions-item label="联系方式1">{{ drawer.record.contactName1 || '--' }} {{ drawer.record.contactPhone1 || '' }}</a-descriptions-item>
                  <a-descriptions-item label="联系方式2">{{ drawer.record.contactName2 || '--' }} {{ drawer.record.contactPhone2 || '' }}</a-descriptions-item>
                </a-descriptions>
              </div>
              <div class="overview-section">
                <div class="overview-section__title">分类标签</div>
                <a-descriptions :column="2" bordered size="small" class="drawer-desc">
                  <a-descriptions-item label="部署云服务商">{{ formatArray(drawer.record.cloudProvider) }}</a-descriptions-item>
                  <a-descriptions-item label="开放范围">{{ drawer.record.coverView || '--' }}</a-descriptions-item>
                </a-descriptions>
              </div>
            </template>

            <!-- 基础服务 -->
            <template v-else-if="drawer.record.serviceType === '基础服务'">
              <div class="overview-section">
                <div class="overview-section__title">基本信息</div>
                <a-descriptions :column="2" bordered size="small" class="drawer-desc">
                  <a-descriptions-item label="显示顺序" :span="2">{{ drawer.record.sortOrder != null ? drawer.record.sortOrder : 0 }}</a-descriptions-item>
                  <a-descriptions-item label="服务描述" :span="2">{{ drawer.record.description || '--' }}</a-descriptions-item>
                </a-descriptions>
              </div>
              <div class="overview-section">
                <div class="overview-section__title">联系信息</div>
                <a-descriptions :column="2" bordered size="small" class="drawer-desc">
                  <a-descriptions-item label="服务商名称" :span="2">{{ drawer.record.serviceProvider || '--' }}</a-descriptions-item>
                  <a-descriptions-item label="联系方式1">{{ drawer.record.contactPhone1 || '--' }}</a-descriptions-item>
                  <a-descriptions-item label="联系方式2">{{ drawer.record.contactPhone2 || '--' }}</a-descriptions-item>
                </a-descriptions>
              </div>
              <div class="overview-section">
                <div class="overview-section__title">分类标签</div>
                <a-descriptions :column="2" bordered size="small" class="drawer-desc">
                  <a-descriptions-item label="部署云服务商">{{ formatArray(drawer.record.cloudProvider) }}</a-descriptions-item>
                  <a-descriptions-item label="服务子类">{{ drawer.record.serviceSubType || '--' }}</a-descriptions-item>
                  <a-descriptions-item label="区域" :span="2">{{ drawer.record.region || '--' }}</a-descriptions-item>
                </a-descriptions>
              </div>
            </template>
          </a-tab-pane>

          <a-tab-pane key="audit" tab="审核信息">
            <div class="overview-section__title">审核记录</div>
            <a-table
              :columns="auditColumns"
              :data-source="auditVersionRows"
              row-key="versionKey"
              size="middle"
              :pagination="false"
              :expanded-row-keys="expandedRowKeys"
              @expand="onExpand"
            >
              <template #expandedRowRender="{ record }">
                <div class="audit-pipeline">
                  <div
                    v-for="(step, idx) in auditSteps"
                    :key="step.key"
                    class="pipeline-step"
                    :class="getPipelineStepClass(record, idx)"
                  >
                    <div class="pipeline-step__dot" :class="getPipelineDotClass(record, idx)">
                      <CheckOutlined v-if="getPipelineStepStatus(record, idx) === 'done'" />
                      <CloseOutlined v-else-if="getPipelineStepStatus(record, idx) === 'rejected'" />
                      <span v-else>{{ idx + 1 }}</span>
                    </div>
                    <div class="pipeline-step__content">
                      <div class="pipeline-step__title">阶段 {{ idx + 1 }}：{{ step.title }}</div>
                      <div class="pipeline-step__tag" :class="getPipelineTagClass(record, idx)">{{ getPipelineTagText(record, idx) }}</div>
                      <div v-if="getPipelineStepDetail(record, idx)" class="pipeline-step__detail">
                        <div class="pipeline-step__opinion">{{ getPipelineStepDetail(record, idx).opinion }}</div>
                        <div class="pipeline-step__meta">
                          <div class="pipeline-step__auditor">{{ getPipelineStepDetail(record, idx).auditor }}</div>
                          <div class="pipeline-step__audit-time">{{ getPipelineStepDetail(record, idx).auditTime }}</div>
                        </div>
                      </div>
                    </div>
                    <div v-if="idx < auditSteps.length - 1" class="pipeline-step__connector" :class="getPipelineConnectorClass(record, idx)"></div>
                  </div>
                </div>
              </template>
              <template #bodyCell="{ column, record }">
                <span v-if="column.dataIndex === 'submittedAt'" class="cell-mono">{{ record.submittedAt || '--' }}</span>
                <template v-else-if="column.dataIndex === 'status'">
                  <StatusDot :type="getAuditStatusKey(record.status)" :text="getAuditStatusText(record.status)" />
                </template>
                <template v-else-if="column.dataIndex === 'auditTime'">
                  <span class="cell-mono">{{ record.auditTime || '--' }}</span>
                </template>
                <span v-else class="cell-default">{{ record[column.dataIndex] || '--' }}</span>
              </template>
            </a-table>
          </a-tab-pane>

          <a-tab-pane key="rating" tab="评价信息">
            <div class="overview-section">
              <div class="overview-section__title">评分概览</div>
              <div class="rating-overview">
                <div class="rating-overview__item">
                  <div class="rating-overview__label">平台评分</div>
                  <div class="rating-overview__body">
                    <span class="rating-overview__num">{{ drawer.record.platformRating || 0 }}</span>
                    <span class="rating-overview__unit">分</span>
                    <span class="rating-overview__stars">
                      <span v-for="i in 5" :key="i" class="star" :class="{ full: i <= (drawer.record.platformRating || 0) }">★</span>
                    </span>
                  </div>
                </div>
                <div class="rating-overview__item">
                  <div class="rating-overview__label">用户评价</div>
                  <div class="rating-overview__body">
                    <span class="rating-overview__num">{{ drawer.record.usageRating || 0 }}</span>
                    <span class="rating-overview__unit">分</span>
                    <span class="rating-overview__stars">
                      <span v-for="i in 5" :key="i" class="star" :class="{ full: i <= (drawer.record.usageRating || 0) }">★</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="overview-section">
              <div class="overview-section__head">
                <span class="overview-section__title">用户评价</span>
                <span class="overview-section__count">共 {{ drawerUsageRatings.length }} 条</span>
              </div>
              <div class="rating-list">
                <div v-for="(item, idx) in drawerUsageRatings" :key="idx" class="rating-card">
                  <div class="rating-card__avatar">{{ (item.userName || '匿').charAt(0) }}</div>
                  <div class="rating-card__body">
                    <div class="rating-card__row">
                      <span class="rating-card__name">{{ item.userName || '匿名用户' }}</span>
                    </div>
                    <div class="rating-card__dims">
                      <span v-for="d in dimLabels" :key="d" class="rating-card__dim">
                        <span class="rating-card__dim-label">{{ d }}</span>
                        <span class="rating-card__dim-stars">
                          <span v-for="i in 5" :key="i" class="star-sm" :class="{ full: i <= item.ratings[d] }">★</span>
                        </span>
                        <span class="rating-card__dim-num">{{ item.ratings[d] }}</span>
                      </span>
                    </div>
                    <div class="rating-card__meta">
                      <span>{{ item.orgName || '--' }}</span>
                      <span class="rating-card__sep">·</span>
                      <span class="rating-card__order">{{ item.orderNo }}</span>
                    </div>
                    <div class="rating-card__content">{{ item.content }}</div>
                    <div class="rating-card__time">{{ item.time }}</div>
                    <div v-if="item.reply" class="rating-card__reply">
                      <strong>开发者回复：</strong>{{ item.reply }}
                    </div>
                  </div>
                </div>
                <div v-if="!drawerUsageRatings.length" class="rating-empty">暂无评价</div>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </template>
    </a-drawer>
  </div>
</template>

<script>
import {
  PlusOutlined, ExclamationCircleFilled,
  AppstoreOutlined, SafetyOutlined,
  BlockOutlined, CloudServerOutlined,
  CheckOutlined, CloseOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import FilterBar from '@/components/cloud/FilterBar.vue'
import StatusDot from '@/components/cloud/StatusDot.vue'
import { getContentList } from '@/api/contentcore/content'

const SERVICE_TYPE_ICONS = {
  '数字应用': AppstoreOutlined,
  '安全服务': SafetyOutlined,
  '能力组件': BlockOutlined,
  '基础服务': CloudServerOutlined
}

export default {
  name: 'OrderMyApps',
  components: {
    PageHeader, CloudCard, FilterBar, StatusDot,
    PlusOutlined, ExclamationCircleFilled,
    AppstoreOutlined, SafetyOutlined,
    BlockOutlined, CloudServerOutlined,
    CheckOutlined, CloseOutlined
  },
  data() {
    return {
      loading: false,
      filter: { title: '', serviceId: '', serviceType: undefined, status: undefined },
      applied: { title: '', serviceId: '', serviceType: undefined, status: undefined },
      pagination: { current: 1, pageSize: 10 },
      showTypeSelector: false,
      serviceTypeOptions: [
        { value: '数字应用', label: '数字应用', desc: '面向基层医疗的数字应用服务' },
        { value: '安全服务', label: '安全服务', desc: '数据加密、安全审计等安全服务' },
        { value: '能力组件', label: '能力组件', desc: '可复用的技术能力组件' },
        { value: '基础服务', label: '基础服务', desc: '云基础资源与服务' }
      ],
      columns: [
        { title: '服务名称/ID', dataIndex: 'title', key: 'title', width: 240 },
        { title: '服务类型', dataIndex: 'serviceType', key: 'serviceType', width: 100 },
        { title: '服务商名称', dataIndex: 'serviceProvider', key: 'serviceProvider', width: 180, ellipsis: true },
        { title: '部署云服务商', dataIndex: 'cloudProvider', key: 'cloudProvider', width: 130, ellipsis: true },
        { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
        { title: '操作', dataIndex: 'action', key: 'action', width: 200, fixed: 'right' }
      ],
      appList: [],
      deleteDialogVisible: false,
      deleteTargetId: null,
      drawer: { visible: false, record: null, activeTab: 'info' },
      expandedRowKeys: [],
      auditColumns: [
        { title: '提交审核时间', dataIndex: 'submittedAt', key: 'submittedAt', width: 160 },
        { title: '提交人', dataIndex: 'submitter', key: 'submitter', width: 140 },
        { title: '审核状态', dataIndex: 'status', key: 'status', width: 100, align: 'center' },
        { title: '审核人', dataIndex: 'auditor', key: 'auditor', width: 120 },
        { title: '审核时间', dataIndex: 'auditTime', key: 'auditTime', width: 160 },
        { title: '审核意见', dataIndex: 'opinion', key: 'opinion', ellipsis: true }
      ],
      auditSteps: [
        { key: 1, title: '申报材料评估' },
        { key: 2, title: '应用技术测评' },
        { key: 3, title: '现场演示答辩' },
        { key: 4, title: '服务目录发布' }
      ],
      // 版本审核流水数据（按阶段记录最终审核结果）
      versionAuditMock: {
        V1: {
          1: { statusKey: 'done', statusText: '已通过', auditor: '李主管', auditTime: '2026-01-02 15:30', opinion: '材料完整、信息有效，本阶段通过' },
          2: { statusKey: 'done', statusText: '已通过', auditor: '王工程师', auditTime: '2026-01-05 14:00', opinion: '功能完整性、性能指标、安全合规均达到标准' },
          3: { statusKey: 'done', statusText: '已通过', auditor: '张主任', auditTime: '2026-01-10 16:00', opinion: '核心功能演示完整，数据同步逻辑清晰，答辩通过' },
          4: { statusKey: 'done', statusText: '已通过', auditor: '赵管理员', auditTime: '2026-01-12 10:00', opinion: '服务信息完整，发布至服务目录' }
        },
        V2: {
          1: { statusKey: 'done', statusText: '已通过', auditor: '李主管', auditTime: '2026-02-11 10:00', opinion: '修改后的材料完整合规，本阶段通过' },
          2: { statusKey: 'done', statusText: '已通过', auditor: '王工程师', auditTime: '2026-02-13 16:00', opinion: '功能完整、性能达标，技术测评通过' },
          3: { statusKey: 'processing', statusText: '进行中' },
          4: { statusKey: 'pending', statusText: '未开始' }
        },
        V3: {
          1: { statusKey: 'done', statusText: '已通过', auditor: '李主管', auditTime: '2026-02-16 09:30', opinion: '申报材料齐全、资质真实有效，本阶段通过' },
          2: { statusKey: 'done', statusText: '已通过', auditor: '王工程师', auditTime: '2026-02-18 11:00', opinion: '应用功能完整、性能指标达标，技术测评通过' },
          3: { statusKey: 'rejected', statusText: '已驳回', auditor: '张主任', auditTime: '2026-02-20 15:00', opinion: '现场演示未能体现核心业务闭环，数据安全方案存在明显缺陷' },
          4: { statusKey: 'pending', statusText: '未开始' }
        },
        V4: {
          1: { statusKey: 'done', statusText: '已通过', auditor: '刘经理', auditTime: '2026-03-02 10:00', opinion: '材料齐全，资质审核通过' },
          2: { statusKey: 'rejected', statusText: '已驳回', auditor: '陈工程师', auditTime: '2026-03-05 14:00', opinion: '应用性能测试不达标，并发处理能力不足，需优化后重新提交' },
          3: { statusKey: 'pending', statusText: '未开始' },
          4: { statusKey: 'pending', statusText: '未开始' }
        }
      },
      dimLabels: ['准确性', '稳定性', '响应时效', '业务适配性'],
      ratingKeys: ['准确性', '稳定性', '响应时效', '业务适配性']
    }
  },
  computed: {
    drawerTitle() {
      const type = this.drawer.record?.serviceType
      return type ? `${type}详情` : '服务详情'
    },
    filteredData() {
      const f = this.applied
      const list = this.appList.filter(item => {
        if (f.title && !(item.title || '').includes(f.title)) return false
        if (f.serviceId && !(item.appId || '').includes(f.serviceId)) return false
        if (f.serviceType && item.serviceType !== f.serviceType) return false
        if (f.status && String(item.status) !== f.status && this.getStatusText(item.status) !== this.getStatusText(f.status)) return false
        return true
      })
      return list.map(i => ({ key: i.id, ...i }))
    },
    drawerUsageRatings() {
      const rec = this.drawer.record
      if (!rec) return []
      const svc = rec.title || '服务'
      return [
        { ratings: { '准确性': 5, '稳定性': 5, '响应时效': 4, '业务适配性': 5 }, serviceName: svc, orderNo: '#202608100089', orgName: '重庆医科大学附属第一医院', userName: '张三', content: '服务运行稳定，功能齐全，整体体验很好。', time: '2026-03-15 14:32', reply: '感谢您的认可与支持！' },
        { ratings: { '准确性': 4, '稳定性': 4, '响应时效': 5, '业务适配性': 4 }, serviceName: svc, orderNo: '#202608100090', orgName: '重庆市人民医院', userName: '李四', content: '集成方便，文档完善，基本满足需求。', time: '2026-03-12 09:15' }
      ]
    },
    auditVersionRows() {
      if (!this.drawer.record) return []
      const s = (key) => this.versionAuditMock[key][4] || {}
      const submitter = this.drawer.record.serviceProvider || '服务提供商'
      return [
        { versionKey: 'V1', versionLabel: 'V1', submittedAt: '2026-01-01 10:00:00', submitter, status: '已通过', auditor: s('V1').auditor || '', auditTime: s('V1').auditTime || '', opinion: s('V1').opinion || '' },
        { versionKey: 'V2', versionLabel: 'V2', submittedAt: '2026-02-10 09:00:00', submitter, status: '审核中', auditor: s('V2').auditor || '', auditTime: s('V2').auditTime || '', opinion: s('V2').opinion || '' },
        { versionKey: 'V3', versionLabel: 'V3', submittedAt: '2026-02-15 11:00:00', submitter, status: '已驳回', auditor: s('V3').auditor || '', auditTime: s('V3').auditTime || '', opinion: s('V3').opinion || '' },
        { versionKey: 'V4', versionLabel: 'V4', submittedAt: '2026-03-01 14:00:00', submitter, status: '已驳回', auditor: s('V4').auditor || '', auditTime: s('V4').auditTime || '', opinion: s('V4').opinion || '' }
      ]
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
  created() {
    this.loadAppList()
  },
  methods: {
    formatCover(val) {
      if (!val) return '--'
      if (Array.isArray(val)) return val.join('、')
      return val
    },
    formatArray(arr) {
      if (Array.isArray(arr)) return arr.join('、') || '--'
      return arr || '--'
    },
    loadAppList() {
      this.loading = true
      getContentList({ pageNum: 1, pageSize: 50, catalogId: '603612031287365' }).then((response) => {
        this.appList = (response.data.rows || []).slice(0, 8).map((item, idx) => ({
          ...item,
          serviceType: ['数字应用', '安全服务', '能力组件', '基础服务'][idx % 4],
          orderNo: this.generateOrderNo(idx),
          createTime: '2026-0' + (3 + idx % 3) + '-' + (10 + idx) + ' 10:00',
          platformRating: parseFloat((Math.random() * 4 + 1).toFixed(1)),
          usageRating: parseFloat((Math.random() * 4 + 1).toFixed(1))
        }))
        this.loading = false
      }).catch(() => {
        this.appList = [
          { id: '1', title: '智慧医院信息管理系统', appId: 'APP001', orderNo: '202608100001', serviceType: '数字应用', status: 'published', serviceProvider: '北京健康科技有限公司', cloudProvider: '浪潮云', createTime: '2026-03-10 10:00', platformRating: 4.5, usageRating: 4.3 },
          { id: '2', title: '数据加密传输组件', appId: 'APP002', orderNo: '202608100002', serviceType: '安全服务', status: 'published', serviceProvider: '上海安全技术有限公司', cloudProvider: '电信云', createTime: '2026-03-09 14:00', platformRating: 4.2, usageRating: 4.6 },
          { id: '3', title: '统一身份认证组件', appId: 'APP003', orderNo: '202608100003', serviceType: '能力组件', status: 'draft', serviceProvider: '广州智慧健康科技有限公司', cloudProvider: '移动云', createTime: '2026-03-08 09:00', platformRating: 4.8, usageRating: 4.1 },
          { id: '4', title: '云数据库服务', appId: 'APP004', orderNo: '202608100004', serviceType: '基础服务', status: 'offline', serviceProvider: '深圳云计算有限公司', cloudProvider: '联通云', createTime: '2026-03-07 16:00', platformRating: 4.0, usageRating: 3.9 },
          { id: '5', title: '医学影像处理系统', appId: 'APP005', orderNo: '202608100005', serviceType: '数字应用', status: 'pending_review', serviceProvider: '杭州医学影像科技有限公司', cloudProvider: '影像云', createTime: '2026-03-06 11:00', platformRating: 4.6, usageRating: 4.5 },
          { id: '6', title: '安全审计平台', appId: 'APP006', orderNo: '202608100006', serviceType: '安全服务', status: 'published', serviceProvider: '深圳安全科技有限公司', cloudProvider: '紫光云', createTime: '2026-03-05 08:00', platformRating: 4.3, usageRating: 4.2 }
        ]
        this.loading = false
      })
    },
    handleQuery() {
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    resetQuery() {
      this.filter = { title: '', serviceId: '', serviceType: undefined, status: undefined }
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    onTableChange(pag) {
      this.pagination.current = pag.current
      this.pagination.pageSize = pag.pageSize
    },
    onSelectType(type) {
      this.showTypeSelector = false
      const routeMap = {
        '数字应用': '/portal/service/digitalAppForm',
        '安全服务': '/portal/service/securityServiceForm',
        '能力组件': '/portal/service/componentForm',
        '基础服务': '/portal/service/serviceCatalogForm'
      }
      const path = routeMap[type]
      if (path) {
        this.$router.push({ path, query: { cid: '603612031287365', mode: 'shelf' } })
      }
    },
    handleEdit(row) {
      const type = row.serviceType || '数字应用'
      const id = row.id || row.contentId
      const routeMap = {
        '数字应用': '/portal/service/digitalAppForm',
        '安全服务': '/portal/service/securityServiceForm',
        '能力组件': '/portal/service/componentForm',
        '基础服务': '/portal/service/serviceCatalogForm'
      }
      const path = routeMap[type]
      if (path) {
        this.$router.push({ path, query: { id, cid: '603612031287365', mode: 'shelf' } })
      }
    },
    handleDelete(row) {
      this.deleteTargetId = row.id || row.contentId
      this.deleteDialogVisible = true
    },
    confirmDelete() {
      this.deleteDialogVisible = false
      message.success('删除成功')
      this.loadAppList()
    },
    canEdit(status) {
      return status !== 'pending_review' && status !== 20
    },
    getStatusKey(status) {
      const map = {
        0: 'default', 10: 'done', 20: 'processing', 30: 'rejected', 40: 'cancelled',
        draft: 'default', pending_review: 'processing', published: 'done', rejected: 'rejected', offline: 'cancelled'
      }
      return map[status] || 'default'
    },
    getStatusText(status) {
      const map = {
        0: '草稿', 10: '已上线使用', 20: '待审核', 30: '已驳回', 40: '已下架',
        draft: '草稿', pending_review: '待审核', published: '已上线使用', rejected: '已驳回', offline: '已下架'
      }
      return map[status] || status
    },
    goToDetail(row) {
      this.drawer.record = row
      this.drawer.activeTab = 'overview'
      this.drawer.visible = true
    },
    getAuditStatusKey(status) {
      const map = { '已通过': 'done', '已驳回': 'rejected', '审核中': 'processing', approved: 'done', rejected: 'rejected', pending: 'processing' }
      return map[status] || 'default'
    },
    getAuditStatusText(status) {
      const map = { '已通过': '已通过', '已驳回': '已驳回', '审核中': '审核中', approved: '已通过', rejected: '已驳回', pending: '待审核' }
      return map[status] || '未知'
    },
    // ===== 审核流水展开方法 =====
    onExpand(expanded, record) {
      this.expandedRowKeys = expanded ? [record.versionKey] : []
    },
    getPipelineStepStatus(record, idx) {
      const stepData = this.versionAuditMock[record.versionKey] && this.versionAuditMock[record.versionKey][idx + 1]
      return stepData ? stepData.statusKey : 'pending'
    },
    getPipelineStepClass(record, idx) {
      return `pipeline-step--${this.getPipelineStepStatus(record, idx)}`
    },
    getPipelineDotClass(record, idx) {
      return `pipeline-step__dot--${this.getPipelineStepStatus(record, idx)}`
    },
    getPipelineTagClass(record, idx) {
      return `pipeline-step__tag--${this.getPipelineStepStatus(record, idx)}`
    },
    getPipelineTagText(record, idx) {
      const stepData = this.versionAuditMock[record.versionKey] && this.versionAuditMock[record.versionKey][idx + 1]
      return stepData ? stepData.statusText : '待审核'
    },
    getPipelineStepDetail(record, idx) {
      const stepData = this.versionAuditMock[record.versionKey] && this.versionAuditMock[record.versionKey][idx + 1]
      if (!stepData || !stepData.auditor) return null
      return stepData
    },
    getPipelineConnectorClass(record, idx) {
      return this.getPipelineStepStatus(record, idx) === 'done' ? 'pipeline-step__connector--done' : ''
    },
    getServiceTypeClass(type) {
      const map = { '数字应用': 'digital', '安全服务': 'security', '能力组件': 'component', '基础服务': 'basic' }
      return map[type] || 'default'
    },
    getServiceTypeIcon(type) {
      return SERVICE_TYPE_ICONS[type] || AppstoreOutlined
    },
    formatTime(time) {
      if (!time) return '--'
      const d = new Date(time)
      if (isNaN(d.getTime())) return time
      const pad = (n) => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    },
    generateOrderNo(seq) {
      const now = new Date()
      const pad = (n) => String(n).padStart(2, '0')
      const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
      const seqPart = String(seq + 1).padStart(4, '0')
      return `${datePart}${seqPart}`
    },
  }
}
</script>

<style scoped>
.my-apps-page {
  padding: 4px 0;
}

.my-apps-page__divider {
  height: 1px;
  background: #F2F3F5;
  margin: 0 16px;
}

.my-apps-page__table-wrap {
  padding: 0 16px 16px 16px;
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

.service-type-tag--digital { color: #165DFF; background: #E8F3FF; border-color: rgba(22, 93, 255, 0.20); }
.service-type-tag--security { color: #F53F3F; background: #FFF0ED; border-color: rgba(245, 63, 63, 0.20); }
.service-type-tag--component { color: #D97000; background: #FFF3E8; border-color: rgba(217, 112, 0, 0.20); }
.service-type-tag--basic { color: #16A34A; background: rgba(22, 163, 74, 0.10); border-color: rgba(22, 163, 74, 0.20); }

.cell-primary {
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-weight: 500;
}

.cell-default {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}

.cell-mono {
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
  font-variant-numeric: tabular-nums;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  letter-spacing: -0.2px;
}

.cell-text {
  font-size: 14px;
  color: #4E5969;
}


.delete-modal__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 12px 0 8px;
}

.delete-modal__icon {
  font-size: 40px;
  color: #F59E0B;
}

.delete-modal__text {
  margin: 0;
  font-size: 14px;
  color: #4E5969;
  text-align: center;
}

/* Drawer 样式 */
.drawer-header-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 4px 0 8px;
  margin-bottom: 8px;
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

.drawer-header-sub__sep {
  color: #C9CDD4;
}

.info-section {
  margin-bottom: 18px;
}

.info-section:last-child {
  margin-bottom: 0;
}

.info-section__title {
  font-size: 13px;
  font-weight: 600;
  color: #4E5969;
  margin-bottom: 10px;
}

.muted {
  color: #4E5969;
  font-size: 14px;
  line-height: 1.6;
}


/* 评价评分概览 */
.overview-section {
  margin-bottom: 16px;
}

.overview-section:last-child {
  margin-bottom: 0;
}

.overview-section__title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 10px;
  line-height: 1.4;
}

.overview-section__head {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 10px;
}

.overview-section__head .overview-section__title {
  margin-bottom: 0;
}

.overview-section__count {
  font-size: 12px;
  color: #86909C;
}

.rating-overview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.rating-overview__item {
  padding: 16px 20px;
  background: linear-gradient(135deg, #FFF7E6 0%, #FFFBF2 100%);
  border: 1px solid #FFE7BA;
  border-radius: 8px;
}

.rating-overview__label {
  font-size: 13px;
  color: #4E5969;
  margin-bottom: 8px;
}

.rating-overview__body {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.rating-overview__num {
  font-size: 28px;
  font-weight: 400;
  color: #FA8C16;
  line-height: 1;
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
  font-variant-numeric: tabular-nums;
}

.rating-overview__unit {
  font-size: 13px;
  color: #86909C;
}

.rating-overview__stars {
  display: inline-flex;
  gap: 2px;
  margin-left: 8px;
}

.rating-overview__stars .star {
  color: #E5E6EB;
  font-size: 16px;
  line-height: 1;
}

.rating-overview__stars .star.full {
  color: #FAAD14;
}

/* 用户评价卡片 */
.rating-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rating-card {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  background: #FAFBFC;
  border: 1px solid #F2F3F5;
  border-radius: 8px;
}

.rating-card__avatar {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #165DFF, #4096FF);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  display: grid;
  place-items: center;
}

.rating-card__body {
  flex: 1;
  min-width: 0;
}

.rating-card__row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.rating-card__name {
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}

.rating-card__dims {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 14px;
  margin-bottom: 8px;
}

.rating-card__dim {
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating-card__dim-label {
  font-size: 11px;
  color: #8c8c8c;
}

.rating-card__dim-stars {
  display: inline-flex;
  gap: 1px;
}

.star-sm {
  font-size: 13px;
  color: #E5E6EB;
  line-height: 1;
}

.star-sm.full {
  color: #FAAD14;
}

.rating-card__dim-num {
  font-size: 11px;
  font-weight: 600;
  color: #FAAD14;
  min-width: 12px;
}

.rating-card__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #86909C;
  margin-bottom: 6px;
}

.rating-card__sep {
  color: #C9CDD4;
}

.rating-card__order {
  color: #86909C;
}

.rating-card__content {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.75);
  line-height: 1.6;
  margin-bottom: 6px;
}

.rating-card__time {
  font-size: 12px;
  color: #C9CDD4;
}

.rating-card__reply {
  margin-top: 8px;
  padding: 6px 10px;
  border-left: 2px solid rgba(22, 93, 255, 0.4);
  font-size: 12px;
  color: #86909C;
  line-height: 1.5;
}

.rating-card__reply strong {
  color: #165DFF;
}

.rating-empty {
  padding: 40px 0;
  text-align: center;
  color: #C9CDD4;
  font-size: 13px;
}

/* 类型选择器 */
.type-selector-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.type-selector-card {
  padding: 20px;
  border: 1px solid #F2F3F5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.type-selector-card:hover {
  border-color: #165DFF;
  background: rgba(22, 93, 255, 0.04);
}

.type-selector-card__icon {
  font-size: 32px;
  color: #165DFF;
  margin-bottom: 10px;
}

.type-selector-card__title {
  font-size: 15px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 4px;
}

.type-selector-card__desc {
  font-size: 12px;
  color: #86909C;
}

/* 抽屉头部图标 */
.drawer-header-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  color: #fff;
}

.drawer-header-icon--digital { background: linear-gradient(135deg, #165DFF 0%, #4096ff 100%); }
.drawer-header-icon--security { background: linear-gradient(135deg, #F53F3F 0%, #ff7a7a 100%); }
.drawer-header-icon--component { background: linear-gradient(135deg, #D97000 0%, #ffa940 100%); }
.drawer-header-icon--basic { background: linear-gradient(135deg, #16A34A 0%, #52c41a 100%); }
.drawer-header-icon--default { background: linear-gradient(135deg, #86909C 0%, #a0a4ab 100%); }

.drawer-header-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.drawer-header-fallback {
  font-size: 28px;
  color: #fff;
}

.drawer-header-sub__sep {
  color: #C9CDD4;
  margin: 0 4px;
}

/* ===== 审核流水面板 ===== */
.audit-pipeline {
  display: flex;
  gap: 0;
  padding: 16px 20px;
  background: #FAFBFC;
  border: 1px solid #F2F3F5;
  border-radius: 8px;
  overflow-x: auto;
}

.pipeline-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 140px;
  position: relative;
  padding: 0 6px;
}

.pipeline-step__dot {
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
  z-index: 1;
}

.pipeline-step__dot--done {
  color: #FFFFFF;
  background: #16A34A;
  border-color: #16A34A;
}

.pipeline-step__dot--processing {
  color: #FFFFFF;
  background: #165DFF;
  border-color: #165DFF;
  box-shadow: 0 2px 6px rgba(22, 93, 255, 0.35);
}

.pipeline-step__dot--rejected {
  color: #FFFFFF;
  background: #EF4444;
  border-color: #EF4444;
}

.pipeline-step__dot--pending {
  color: #86909C;
  background: #FFFFFF;
  border-color: #C9CDD4;
}

.pipeline-step__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 10px;
  gap: 4px;
}

.pipeline-step__title {
  font-size: 12px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  white-space: nowrap;
}

.pipeline-step--processing .pipeline-step__title {
  font-weight: 600;
  color: #165DFF;
}

.pipeline-step__tag {
  display: inline-block;
  padding: 1px 8px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 4px;
  margin: 2px 0;
}

.pipeline-step__tag--pending { background: #F2F3F5; color: #86909C; }
.pipeline-step__tag--processing { background: #E8F3FF; color: #165DFF; }
.pipeline-step__tag--done { background: #E9F9EF; color: #16A34A; }
.pipeline-step__tag--rejected { background: #FFEDEC; color: #EF4444; }

.pipeline-step__detail {
  background: #F2F3F5;
  border-radius: 6px;
  padding: 10px 12px;
  max-width: 200px;
  margin-top: 4px;
}

.pipeline-step__opinion {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.pipeline-step__meta {
  margin-top: 6px;
  text-align: center;
  line-height: 1.6;
}

.pipeline-step__auditor,
.pipeline-step__audit-time {
  font-size: 12px;
  color: #86909C;
  white-space: nowrap;
}

.pipeline-step__connector {
  position: absolute;
  top: 12px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: #E5E6EB;
  z-index: 0;
}

.pipeline-step__connector--done {
  background: #16A34A;
}

</style>

<style>
/* 抽屉内 antd 组件样式覆盖（unscoped，因 a-drawer teleport 到 body，scoped + :deep 不生效） */
.ant-drawer .ant-table-wrapper,
.ant-drawer .ant-table-wrapper .ant-table,
.ant-drawer .ant-table-wrapper .ant-table-container,
.ant-drawer .ant-table-wrapper .ant-table-thead > tr > th,
.ant-drawer .ant-table-wrapper .ant-table-tbody > tr > td,
.ant-drawer .ant-table-wrapper .ant-table-thead > tr:first-child > th:first-child,
.ant-drawer .ant-table-wrapper .ant-table-tbody > tr:first-child > td:first-child,
.ant-drawer .ant-descriptions,
.ant-drawer .ant-descriptions-bordered,
.ant-drawer .ant-descriptions-view,
.ant-drawer .ant-descriptions-view table,
.ant-drawer .ant-descriptions-row,
.ant-drawer .ant-descriptions-row > td,
.ant-drawer .ant-descriptions-row > th,
.ant-drawer .ant-descriptions-item-container,
.ant-drawer .ant-descriptions-item-label,
.ant-drawer .ant-descriptions-item-content {
  border-radius: 0 !important;
}

.ant-drawer .ant-table-thead .ant-table-cell {
  font-weight: normal !important;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
}

.ant-drawer .ant-descriptions-item-label {
  width: 160px !important;
  min-width: 160px !important;
  max-width: 160px !important;
  text-align: left !important;
  white-space: nowrap;
}

.ant-drawer .ant-descriptions-item-content {
  width: auto;
}

/* MVP 详情抽屉描述列表：表头/表体与 a-table 规范统一 */
.mvp-detail-tabs .ant-descriptions-item-label {
  background: #FAFBFC !important;
  font-size: 14px !important;
  font-weight: 400 !important;
  color: rgba(0, 0, 0, 0.85) !important;
  font-feature-settings: "tnum" !important;
}

.mvp-detail-tabs .ant-descriptions-item-content {
  font-size: 14px !important;
  font-weight: 400 !important;
  color: rgba(0, 0, 0, 0.65) !important;
  font-feature-settings: "tnum" !important;
}

.mvp-detail-tabs .ant-tabs-nav {
  margin-bottom: 16px;
}

.mvp-detail-tabs .ant-tabs-tab {
  padding: 8px 0;
}
</style>
