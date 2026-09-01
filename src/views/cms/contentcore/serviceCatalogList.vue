<template>
  <div class="service-catalog-list-page">
    <PageHeader
      title="基础服务管理"
    />

    <CloudCard class="service-catalog-list-page__table-card">
      <FilterBar @search="handleQuery" @reset="resetQuery">
        <template #actions>
          <a-button type="primary" @click="handleAdd">
            <template #icon><PlusOutlined /></template>
            {{ $t("Common.Add") }}
          </a-button>
          <a-button type="primary" :disabled="single" @click="handleEdit()">
            <template #icon><EditOutlined /></template>
            修改
          </a-button>
          <a-button type="primary" danger :disabled="multiple" @click="handleDelete">
            <template #icon><DeleteOutlined /></template>
            {{ $t("Common.Delete") }}
          </a-button>
          <a-button type="primary" :disabled="multiple" @click="handlePublish">
            <template #icon><SendOutlined /></template>
            发布
          </a-button>
          <a-button type="primary" :disabled="multiple" @click="handleOffline">
            <template #icon><DownloadOutlined /></template>
            下线
          </a-button>
        </template>
        <a-input
          v-model:value="queryParams.serviceName"
          placeholder="基础服务名称"
          allow-clear
          style="width: 160px"
          @pressEnter="handleQuery"
        />
        <a-input
          v-model:value="queryParams.serviceId"
          placeholder="基础服务ID"
          allow-clear
          style="width: 160px"
          @pressEnter="handleQuery"
        />
        <a-input
          v-model:value="queryParams.serviceProvider"
          placeholder="服务商名称"
          allow-clear
          style="width: 160px"
          @pressEnter="handleQuery"
        />
        <a-select
          v-model:value="queryParams.serviceZone"
          placeholder="服务专区"
          allow-clear
          style="width: 150px"
        >
          <a-select-option
            v-for="item in serviceZoneOptions"
            :key="item.value"
            :value="item.value"
          >{{ item.label }}</a-select-option>
        </a-select>
        <a-select
          v-model:value="queryParams.cloudProvider"
          placeholder="部署云服务商"
          allow-clear
          style="width: 150px"
        >
          <a-select-option
            v-for="item in cloudProviderOptions"
            :key="item.value"
            :value="item.value"
          >{{ item.label }}</a-select-option>
        </a-select>
        <a-select
          v-model:value="queryParams.status"
          placeholder="状态"
          allow-clear
          style="width: 110px"
        >
          <a-select-option value="20">已上线使用</a-select-option>
          <a-select-option value="30">已下架</a-select-option>
        </a-select>
      </FilterBar>
      <div class="service-catalog-list-page__divider"></div>
      <div class="service-catalog-list-page__table-wrap">
        <a-table
          ref="tableServiceCatalogList"
          :columns="columns"
          :data-source="serviceCatalogList"
          :loading="loading"
          :pagination="paginationConfig"
          :row-key="(record) => record.serviceId"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: handleSelectionChange }"
          :scroll="{ x: 1360, y: tableHeight }"
          @change="onTableChange"
        >
          <template #bodyCell="{ column, record }">
            <span v-if="column.dataIndex === 'serviceName'" class="cell-name">
              <span class="cell-name__title">{{ record.serviceName }}</span>
              <span class="cell-name__id">{{ record.serviceId || '--' }}</span>
            </span>
            <a-badge v-else-if="column.dataIndex === 'status'" :status="record.status === 20 ? 'success' : record.status === 30 ? 'error' : 'default'" :text="record.status === 20 ? '已上线使用' : record.status === 30 ? '已下架' : '未知'" />
            <span v-else-if="column.dataIndex === 'platformRating'">{{ record.platformRating || 0 }}</span>
            <span v-else-if="column.dataIndex === 'usageRating'">{{ record.usageRating || 0 }}</span>
            <span v-else-if="column.dataIndex === 'serviceZone'">{{ getServiceZoneLabel(record.serviceZone) }}</span>
            <span v-else-if="column.dataIndex === 'serviceType'">{{ getServiceTypeLabel(record.serviceType) }}</span>
            <template v-else-if="column.dataIndex === 'action'">
              <a-space size="small">
                <a-button type="link" size="small" class="!p-0" @click.stop="handleDetail(record)">详情</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-button type="link" size="small" class="!p-0" @click="handleEdit(record)">修改</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-button type="link" size="small" danger class="!p-0" @click="handleDelete(record)">删除</a-button>
              </a-space>
            </template>
            <span v-else class="cell-default">{{ record[column.dataIndex] || '--' }}</span>
          </template>
        </a-table>
      </div>
    </CloudCard>

    <!-- 详情弹窗 -->
    <a-modal :get-container="getDemoContainer"
      title="详情"
      width="920px"
      v-model:open="detailDialogVisible"
      :mask-closable="false"
      :footer="null"
    >
      <div class="add-form">
        <div class="form-section">
          <div class="form-section-title">基本信息</div>
          <div class="gird">
            <div class="content">
              <span>服务名称</span>
              <span>{{ detailForm.serviceName || '--' }}</span>
            </div>
            <div class="content">
              <span>服务ID</span>
              <span>{{ detailForm.serviceId || '--' }}</span>
            </div>
            <div class="content">
              <span class="pr-16">LOGO</span>
              <img v-if="detailForm.logo" :src="detailForm.logo" class="img" />
              <span v-else>--</span>
            </div>
            <div class="content">
              <span>显示顺序</span>
              <span>{{ detailForm.sortOrder || 0 }}</span>
            </div>
          </div>
          <div class="content pt-24">
            <span>服务描述</span>
            <span>{{ detailForm.description || '--' }}</span>
          </div>
        </div>
        <div class="form-section">
          <div class="form-section-title">联系信息</div>
          <div class="gird">
            <div class="content">
              <span>服务商名称</span>
              <span>{{ detailForm.vendor || '--' }}</span>
            </div>
            <div class="content">
              <span>联系方式1</span>
              <span>{{ detailForm.contactPhone1 || '--' }}</span>
            </div>
            <div class="content">
              <span>联系方式2</span>
              <span>{{ detailForm.contactPhone2 || '--' }}</span>
            </div>
          </div>
        </div>
        <div class="form-section">
          <div class="form-section-title">服务信息</div>
          <div class="gird">
            <div class="content">
              <span>服务专区</span>
              <span>{{ getServiceZoneLabel(detailForm.serviceZone) }}</span>
            </div>
            <div class="content">
              <span>部署云服务商</span>
              <span>{{ detailForm.cloudProvider || '--' }}</span>
            </div>
            <div class="content">
              <span>服务分类</span>
              <span>{{ detailForm.serviceType || '--' }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-footer">
        <a-button @click="detailDialogVisible = false">关闭</a-button>
      </div>
    </a-modal>

    <!-- 评价弹窗 -->
    <a-modal :get-container="getDemoContainer"
      title="服务评价"
      width="920px"
      v-model:open="ratingDialogVisible"
      :mask-closable="false"
      :footer="null"
    >
      <div class="add-form">
        <a-tabs v-model:activeKey="activeTab">
          <a-tab-pane tab="平台评分" key="platform">
            <a-form ref="ratingForm" :model="ratingForm" :label-col="{ style: { width: '80px' } }">
              <a-form-item label="评分">
                <div class="stars">
                  <span v-for="i in 5" :key="i" class="star" :class="{ full: i <= ratingForm.score }" @click="ratingForm.score = i">★</span>
                </div>
                <span class="score-text">{{ ratingForm.score }}分</span>
              </a-form-item>
              <a-form-item label="评价描述">
                <a-textarea v-model:value="ratingForm.description" :rows="4" placeholder="请输入评价描述" />
              </a-form-item>
            </a-form>
          </a-tab-pane>
          <a-tab-pane tab="用户评分" key="user">
            <a-table :scroll="{ x: 'max-content' }"
              :columns="ratingColumns"
              :data-source="usageRatings"
              :pagination="false"
              size="small"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'score'">
                  <div class="dim-compact">
                    <div class="dim-compact-row">
                      <span class="dim-compact-label">准确性</span>
                      <span class="dim-compact-score" :class="scoreClass(record.ratings['准确性'])">{{ record.ratings['准确性'] }}</span>
                      <span class="dim-compact-label">稳定性</span>
                      <span class="dim-compact-score" :class="scoreClass(record.ratings['稳定性'])">{{ record.ratings['稳定性'] }}</span>
                    </div>
                    <div class="dim-compact-row">
                      <span class="dim-compact-label">响应时效</span>
                      <span class="dim-compact-score" :class="scoreClass(record.ratings['响应时效'])">{{ record.ratings['响应时效'] }}</span>
                      <span class="dim-compact-label">业务适配性</span>
                      <span class="dim-compact-score" :class="scoreClass(record.ratings['业务适配性'])">{{ record.ratings['业务适配性'] }}</span>
                    </div>
                  </div>
                </template>
                <template v-else-if="column.dataIndex === 'serviceName'">
                  <div>
                    <div class="review-service">{{ record.serviceName }}</div>
                    <div class="review-order">{{ record.orderNo }}</div>
                  </div>
                </template>
                <template v-else-if="column.dataIndex === 'orgName'">
                  <div>
                    <div class="review-org">{{ record.orgName }}</div>
                    <div class="review-user">{{ record.userName }} · {{ record.department }}</div>
                  </div>
                </template>
              </template>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </div>
      <div class="dialog-footer">
        <a-button v-if="activeTab === 'platform'" type="primary" @click="handleRatingSubmit">提交</a-button>
        <a-button @click="ratingDialogVisible = false">关闭</a-button>
      </div>
    </a-modal>

    <!-- 详情抽屉 -->
    <a-drawer :get-container="getDrawerContainer"
      v-model:open="drawer.visible"
      title="基础服务详情"
      :width="860"
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
              <span class="drawer-header-title">{{ drawer.record.serviceName || '--' }}</span>
              <a-badge :status="drawerStatusBadge(drawer.record.status)" :text="getStatusText(drawer.record.status)" />
            </div>
            <div class="drawer-header-sub">
              <span>ID：{{ drawer.record.serviceId || '--' }}</span>
            </div>
          </div>
        </div>

        <a-tabs v-model:activeKey="drawer.activeTab" class="mvp-detail-tabs">
          <a-tab-pane key="overview" tab="概览">
            <div class="overview-section">
              <div class="overview-section__title">基本信息</div>
              <a-descriptions :column="2" bordered size="small" class="drawer-desc">
                <a-descriptions-item label="付费方式参考" :span="2">
                  <span class="muted">{{ drawer.record.paymentMethodRef || '--' }}</span>
                </a-descriptions-item>
                <a-descriptions-item label="服务描述" :span="2">
                  <span class="muted">{{ drawer.record.description || '--' }}</span>
                </a-descriptions-item>
              </a-descriptions>
            </div>
            <div class="overview-section">
              <div class="overview-section__title">联系信息</div>
              <a-descriptions :column="2" bordered size="small" class="drawer-desc">
                <a-descriptions-item label="服务商名称" :span="2">{{ drawer.record.vendor || '--' }}</a-descriptions-item>
                <a-descriptions-item label="联系方式1">{{ drawer.record.contactPhone1 || '--' }}</a-descriptions-item>
                <a-descriptions-item label="联系方式2">{{ drawer.record.contactPhone2 || '--' }}</a-descriptions-item>
              </a-descriptions>
            </div>
<div class="overview-section">
                <div class="overview-section__title">分类标签</div>
                <a-descriptions :column="2" bordered size="small" class="drawer-desc">
                  <a-descriptions-item label="服务专区">{{ getServiceZoneLabel(drawer.record.serviceZone) }}</a-descriptions-item>
                  <a-descriptions-item label="部署云服务商">{{ drawer.record.cloudProvider || '--' }}</a-descriptions-item>
                  <a-descriptions-item label="服务分类">{{ drawer.record.serviceType || '--' }}</a-descriptions-item>
                </a-descriptions>
              </div>
            <div class="overview-section">
                <div class="overview-section__title">管理信息</div>
                <a-descriptions :column="2" bordered size="small" class="drawer-desc">
                  <a-descriptions-item label="显示顺序" :span="2">{{ drawer.record.sortOrder != null ? drawer.record.sortOrder : 0 }}</a-descriptions-item>
                  <a-descriptions-item label="服务征集得分" :span="2">{{ drawer.record.recruitScore != null ? drawer.record.recruitScore : '--' }}</a-descriptions-item>
                </a-descriptions>
              </div>
          </a-tab-pane>
          <a-tab-pane key="audit" tab="审核信息">
            <div class="overview-section__title">审核记录</div>
            <a-table :scroll="{ x: 'max-content' }"
              :columns="auditVersionColumns"
              :data-source="auditVersionRows"
              :pagination="false"
              size="small"
              row-key="versionKey"
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
                <span v-if="column.dataIndex === 'submittedAt'" class="cell-num">{{ formatTime(record.submittedAt) }}</span>
                <a-tag v-else-if="column.dataIndex === 'status'" :color="auditStatusColor(record.status)" class="!m-0 !text-[11px]">{{ record.status }}</a-tag>
                <span v-else-if="column.dataIndex === 'auditTime'" class="cell-num">{{ formatTime(record.auditTime) }}</span>
                <span v-else-if="column.dataIndex === 'opinion'" class="cell-opinion">{{ record.opinion || '--' }}</span>
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
                  <div class="rating-overview__label">用户评分</div>
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
                  <div class="rating-card__body">
                    <div class="rating-card__row">
                      <span class="rating-card__org">{{ item.orgName || '--' }}</span>
                      <span class="rating-card__sep">·</span>
                      <span class="rating-card__order">{{ item.orderNo }}</span>
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
                    <div class="rating-card__content">{{ item.content }}</div>
                    <div class="rating-card__time">{{ formatTime(item.time) }}</div>
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
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SendOutlined,
  DownloadOutlined,
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
  RobotOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons-vue";
import { message, Modal } from "ant-design-vue";
import PageHeader from "@/components/cloud/PageHeader.vue";
import CloudCard from "@/components/cloud/CloudCard.vue";
import FilterBar from "@/components/cloud/FilterBar.vue";
import StatusDot from "@/components/cloud/StatusDot.vue";

export default {
  name: "ServiceCatalogList",
  components: {
    PageHeader,
    CloudCard,
    FilterBar,
    StatusDot,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SendOutlined,
    DownloadOutlined,
    ReloadOutlined,
    SearchOutlined,
    EyeOutlined,
    QuestionCircleOutlined,
    RobotOutlined,
    CheckOutlined,
    CloseOutlined,
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 详情抽屉
      drawer: { visible: false, record: null, activeTab: 'overview' },
      expandedRowKeys: [],
      auditVersionColumns: [
        { title: '提交审核时间', dataIndex: 'submittedAt', key: 'submittedAt', width: 160 },
        { title: '提交人', dataIndex: 'submitter', key: 'submitter', width: 140 },
        { title: '审核状态', dataIndex: 'status', key: 'status', width: 100 },
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
      versionAuditMock: {
        V1: {
          1: { statusKey: 'done', statusText: '已通过', auditor: '李主管', auditTime: '2026-01-18 15:30', opinion: '材料完整、信息有效，本阶段通过' },
          2: { statusKey: 'done', statusText: '已通过', auditor: '王工程师', auditTime: '2026-01-21 14:00', opinion: '功能完整性、性能指标、安全合规均达到标准' },
          3: { statusKey: 'done', statusText: '已通过', auditor: '张主任', auditTime: '2026-02-01 16:00', opinion: '核心功能演示完整，数据同步逻辑清晰，答辩通过' },
          4: { statusKey: 'done', statusText: '已通过', auditor: '赵管理员', auditTime: '2026-02-05 10:00', opinion: '服务信息完整，发布至服务目录' }
        },
        V2: {
          1: { statusKey: 'done', statusText: '已通过', auditor: '李主管', auditTime: '2026-04-20 10:00', opinion: '修改后的材料完整合规，本阶段通过' },
          2: { statusKey: 'done', statusText: '已通过', auditor: '王工程师', auditTime: '2026-04-25 16:00', opinion: '功能完整、性能达标，技术测评通过' },
          3: { statusKey: 'processing', statusText: '进行中' },
          4: { statusKey: 'pending', statusText: '未开始' }
        },
        V3: {
          1: { statusKey: 'done', statusText: '已通过', auditor: '李主管', auditTime: '2026-05-08 09:30', opinion: '申报材料齐全、资质真实有效，本阶段通过' },
          2: { statusKey: 'done', statusText: '已通过', auditor: '王工程师', auditTime: '2026-05-14 11:00', opinion: '应用功能完整、性能指标达标，技术测评通过' },
          3: { statusKey: 'rejected', statusText: '已驳回', auditor: '张主任', auditTime: '2026-05-20 15:00', opinion: '现场演示未能体现核心业务闭环，数据安全方案存在明显缺陷' },
          4: { statusKey: 'pending', statusText: '未开始' }
        },
        V4: {
          1: { statusKey: 'done', statusText: '已通过', auditor: '刘经理', auditTime: '2026-06-02 10:00', opinion: '材料齐全，资质审核通过' },
          2: { statusKey: 'rejected', statusText: '已驳回', auditor: '陈工程师', auditTime: '2026-06-08 14:00', opinion: '应用性能测试不达标，并发处理能力不足，需优化后重新提交' },
          3: { statusKey: 'pending', statusText: '未开始' },
          4: { statusKey: 'pending', statusText: '未开始' }
        },
        V5: {
          1: { statusKey: 'done', statusText: '已通过', auditor: '刘经理', auditTime: '2026-07-12 09:00', opinion: '优化后材料重新提交，申报材料评估通过' },
          2: { statusKey: 'done', statusText: '已通过', auditor: '陈工程师', auditTime: '2026-07-18 16:00', opinion: '性能优化后各项指标达标，技术测评通过' },
          3: { statusKey: 'done', statusText: '已通过', auditor: '周主任', auditTime: '2026-07-25 14:00', opinion: '现场演示完整，答辩通过' },
          4: { statusKey: 'processing', statusText: '进行中' }
        },
        V6: {
          1: { statusKey: 'rejected', statusText: '已驳回', auditor: '孙主管', auditTime: '2026-08-05 11:00', opinion: '申报材料关键资质缺失，请补充法人证书及等保测评报告' },
          2: { statusKey: 'pending', statusText: '未开始' },
          3: { statusKey: 'pending', statusText: '未开始' },
          4: { statusKey: 'pending', statusText: '未开始' }
        }
      },
      // 云服务商选项
      serviceZoneOptions: [
        { value: 'X86Zone', label: 'X86专区' },
        { value: 'XinChuangZone', label: '信创专区' },
        { value: 'CipherZone', label: '密码服务专区' },
        { value: 'SuperComputeZone', label: '超算、智算专区' }
      ],
      cloudProviderOptions: [
        { value: '影像云', label: '影像云' },
        { value: '电信云', label: '电信云' },
        { value: '移动云', label: '移动云' },
        { value: '联通云', label: '联通云' },
        { value: '浪潮云', label: '浪潮云' }
      ],
      serviceCatalogList: [],
      total: 0,
      tableHeight: 600, // 表格高度
      tableMaxHeight: 600, // 表格最大高度
      selectedRows: [], // 表格选中行
      selectedRowKeys: [],
      single: true,
      multiple: true,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        serviceName: undefined,
        serviceId: undefined,
        serviceProvider: undefined,
        serviceZone: undefined,
        cloudProvider: undefined,
        status: undefined,
      },
      columns: [
        { title: '基础服务名称/ID', dataIndex: 'serviceName', key: 'serviceName', ellipsis: true, width: 200 },
        { title: '服务专区', dataIndex: 'serviceZone', key: 'serviceZone', width: 120 },
        { title: '服务分类', dataIndex: 'serviceType', key: 'serviceType', width: 120 },
        { title: '服务描述', dataIndex: 'description', key: 'description', width: 250, customCell: () => ({ class: 'cell-wrap' }) },
        { title: '服务商名称', dataIndex: 'vendor', key: 'vendor', width: 180 },
        { title: '部署云服务商', dataIndex: 'cloudProvider', key: 'cloudProvider', ellipsis: true, width: 150 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
        { title: '平台评分', dataIndex: 'platformRating', key: 'platformRating', width: 90 },
        { title: '用户评分', dataIndex: 'usageRating', key: 'usageRating', width: 90 },
        { title: '操作', dataIndex: 'action', key: 'action', width: 200, fixed: 'right' },
      ],
      ratingColumns: [
        { title: '评分', dataIndex: 'score', key: 'score', width: 200 },
        { title: '服务/订单号', dataIndex: 'serviceName', key: 'serviceName', width: 200 },
        { title: '评价机构', dataIndex: 'orgName', key: 'orgName', width: 200 },
        { title: '评价内容', dataIndex: 'content', key: 'content', ellipsis: true },
        { title: '评价时间', dataIndex: 'time', key: 'time', width: 140 },
      ],
      // 详情弹窗
      detailDialogVisible: false,
      detailForm: {
        serviceName: '',
        serviceId: '',
        logo: '',
        description: '',
        serviceType: '',
        cloudProvider: '',
        sortOrder: 0,
        vendor: '',
        contactPhone1: '',
        contactPhone2: ''
      },
      // 评价弹窗
      ratingDialogVisible: false,
      activeTab: 'platform',
      ratingForm: {
        score: 0,
        description: ''
      },
      dimLabels: ['准确性', '稳定性', '响应时效', '业务适配性'],
      currentService: null,
      usageRatings: [
        {
          ratings: { '准确性': 5, '稳定性': 5, '响应时效': 4, '业务适配性': 5 },
          serviceName: '弹性计算服务ECS',
          orderNo: '#ORD-2026-0101',
          orgName: '北京市海淀区数字经济发展局',
          userName: '张三',
          department: '技术部',
          content: '计算性能稳定，弹性扩容响应快，性价比高，满足业务需求。',
          time: '2026-03-18 10:30:00'
        },
        {
          ratings: { '准确性': 4, '稳定性': 4, '响应时效': 5, '业务适配性': 4 },
          serviceName: '对象存储服务OSS',
          orderNo: '#ORD-2026-0098',
          orgName: '北京市第一人民医院',
          userName: '李四',
          department: '信息科',
          content: '存储容量充足，数据安全性好，上传下载速度较快。',
          time: '2026-03-15 14:00:00'
        }
      ],
    };
  },
  computed: {
    auditVersionRows() {
      if (!this.drawer.record) return []
      const s = (key) => this.versionAuditMock[key][4] || {}
      return [
        { versionKey: 'V1', versionLabel: 'V1', submittedAt: '2026-01-10 09:05:00', submitter: '管理员', status: '已通过', auditor: s('V1').auditor || '', auditTime: s('V1').auditTime || '', opinion: s('V1').opinion || '' },
        { versionKey: 'V2', versionLabel: 'V2', submittedAt: '2026-03-18 10:30:00', submitter: '管理员', status: '审核中', auditor: s('V2').auditor || '', auditTime: s('V2').auditTime || '', opinion: s('V2').opinion || '' },
        { versionKey: 'V3', versionLabel: 'V3', submittedAt: '2026-04-08 14:00:00', submitter: '管理员', status: '已驳回', auditor: s('V3').auditor || '', auditTime: s('V3').auditTime || '', opinion: s('V3').opinion || '' },
        { versionKey: 'V4', versionLabel: 'V4', submittedAt: '2026-05-20 08:30:00', submitter: '管理员', status: '已驳回', auditor: s('V4').auditor || '', auditTime: s('V4').auditTime || '', opinion: s('V4').opinion || '' },
        { versionKey: 'V5', versionLabel: 'V5', submittedAt: '2026-06-15 09:00:00', submitter: '管理员', status: '审核中', auditor: s('V5').auditor || '', auditTime: s('V5').auditTime || '', opinion: s('V5').opinion || '' },
        { versionKey: 'V6', versionLabel: 'V6', submittedAt: '2026-07-20 16:00:00', submitter: '管理员', status: '已驳回', auditor: s('V6').auditor || '', auditTime: s('V6').auditTime || '', opinion: s('V6').opinion || '' }
      ]
    },
    paginationConfig() {
      return {
        current: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
        total: this.total,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (t) => `共 ${t} 条`
      };
    },
    drawerUsageRatings() {
      const rec = this.drawer.record
      if (!rec) return []
      const serviceName = rec.serviceName || '基础服务'
      return [
        { ratings: { '准确性': 5, '稳定性': 5, '响应时效': 4, '业务适配性': 5 }, serviceName: serviceName, orderNo: '#ORD-2026-0101', orgName: '北京市海淀区数字经济发展局', userName: '张三', department: '技术部', content: '计算性能稳定，弹性扩容响应快，性价比高，满足业务需求。', time: '2026-03-18 10:30:00', reply: '感谢您的认可！我们持续优化计算服务性能，后续将推出更多弹性策略以满足不同场景需求。如有任何问题欢迎随时联系我们。', replyTime: '2026-03-18 14:20:00' },
        { ratings: { '准确性': 4, '稳定性': 4, '响应时效': 5, '业务适配性': 4 }, serviceName: serviceName, orderNo: '#ORD-2026-0098', orgName: '北京人工智能研究院', userName: '王五', department: '运维部', content: '存储服务稳定可靠，数据访问延迟低，整体表现优秀。', time: '2026-03-16 14:20:00', reply: '感谢您的使用反馈！关于存储服务的性能优化我们一直在持续迭代，期待您后续更多宝贵建议。', replyTime: '2026-03-16 16:30:00' },
        { ratings: { '准确性': 4, '稳定性': 4, '响应时效': 4, '业务适配性': 4 }, serviceName: serviceName, orderNo: '#ORD-2026-0095', orgName: '北京市卫健委', userName: '赵六', department: '信息中心', content: '服务响应及时，技术支持到位，使用体验良好。', time: '2026-03-14 09:15:00' }
      ]
    }
  },
  created() {
    this.changeTableHeight();
    this.loadServiceCatalogList();
  },
  methods: {
    getDemoContainer() {
      return document.querySelector('.app-main__content') || document.body;
    },
    getDrawerContainer() {
      return document.querySelector('.app-overlay') || document.body;
    },
    loadServiceCatalogList() {
      this.loading = true;
      // 模拟数据
      setTimeout(() => {
        let list = [
          {
            serviceId: 'SVC001',
            serviceName: '云服务器ECS',
            vendor: '浪潮云信息技术有限公司',
            contactPhone1: '400-880-8800',
            contactPhone2: '010-8888-0001',
            description: '弹性计算服务，提供安全可靠、弹性可扩展的云服务器',
            serviceZone: 'X86Zone',
            serviceType: '计算服务',
            cloudProvider: '电信云',
            status: 20,
            sortOrder: 1
          },
          {
            serviceId: 'SVC002',
            serviceName: '对象存储OSS',
            vendor: '中科信息安全有限公司',
            contactPhone1: '400-881-9901',
            contactPhone2: '021-6222-0002',
            description: '安全、稳定、高效的云存储服务',
            serviceZone: 'X86Zone',
            serviceType: '存储服务',
            cloudProvider: '移动云',
            status: 20,
            sortOrder: 2
          },
          {
            serviceId: 'SVC003',
            serviceName: '云数据库RDS',
            vendor: '华能数智科技集团',
            contactPhone1: '400-882-8802',
            contactPhone2: '010-6666-0003',
            description: '稳定可靠的关系型数据库服务',
            serviceZone: 'X86Zone',
            serviceType: '数据库服务',
            cloudProvider: '联通云',
            status: 10,
            sortOrder: 3
          },
          {
            serviceId: 'SVC004',
            serviceName: '负载均衡SLB',
            vendor: '中科信息安全有限公司',
            contactPhone1: '400-883-8803',
            contactPhone2: '010-6666-0004',
            description: '将访问流量分发到多台云服务器，提升应用可用性',
            serviceZone: 'XinChuangZone',
            serviceType: '网络服务',
            cloudProvider: '浪潮云',
            status: 20,
            sortOrder: 4
          }
        ];
        if (this.queryParams.serviceZone) {
          list = list.filter(i => i.serviceZone === this.queryParams.serviceZone);
        }
        this.serviceCatalogList = list;
        this.total = list.length;
        this.loading = false;
      }, 1000);
    },
    handleSelectionChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
      this.single = selectedRows.length != 1;
      this.multiple = !selectedRows.length;
    },
    handleRowClick(currentRow) {
      // 不执行任何操作
    },
    onTableChange(pag) {
      this.queryParams.pageNum = pag.current;
      this.queryParams.pageSize = pag.pageSize;
      this.loadServiceCatalogList();
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.loadServiceCatalogList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleAdd() {
      this.$router.push({ path: '/portal/service/serviceCatalogForm' });
    },
    handleDetail(row) {
      this.drawer.record = row;
      this.drawer.activeTab = '';
      this.drawer.visible = true;
      this.$nextTick(() => {
        this.drawer.activeTab = 'overview';
      });
    },
    scoreClass(val) {
      if (val >= 4) return 'score-high';
      if (val >= 3) return 'score-mid';
      return 'score-low';
    },
    getStatusKey(status) {
      const map = {
        20: 'done',
        30: 'cancelled',
        10: 'warning'
      };
      return map[status] || 'default';
    },
    drawerStatusBadge(status) {
      const text = this.getStatusText(status);
      if (text === '已上线使用') return 'success';
      if (text === '已下架') return 'warning';
      if (text === '待审核') return 'processing';
      return 'default';
    },
    getStatusText(status) {
      const map = {
        20: '已上线使用',
        30: '已下架',
        10: '待审核'
      };
      return map[status] || '未知';
    },
    getServiceTypeLabel(type) {
      const map = { compute: '计算服务', storage: '存储服务', network: '网络服务', security: '安全服务', bigdata: '大数据服务', database: '数据库服务', backup: '备份容灾服务', software: '软件与应用服务', hosting: '机房托管服务' }
      return map[type] || type || '--'
    },
    getServiceTypeClass(type) {
      const map = {
        compute: 'service-type-tag--compute',
        storage: 'service-type-tag--storage',
        network: 'service-type-tag--network',
        security: 'service-type-tag--security',
        bigdata: 'service-type-tag--bigdata',
        database: 'service-type-tag--database',
        backup: 'service-type-tag--backup',
        software: 'service-type-tag--software',
        hosting: 'service-type-tag--hosting'
      }
      return map[type] || ''
    },
    getServiceZoneLabel(zone) {
      const map = { X86Zone: 'X86专区', XinChuangZone: '信创专区', CipherZone: '密码服务专区', SuperComputeZone: '超算、智算专区' }
      return map[zone] || zone || '--'
    },
    formatTime(time) {
      if (!time) return '--';
      const d = new Date(time);
      if (isNaN(d.getTime())) return time;
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    },
    handleEdit(row) {
      const target = (row && row.serviceId) ? row : (this.selectedRows.length === 1 ? this.selectedRows[0] : null);
      if (!target) {
        message.warning('请选择一条记录');
        return;
      }
      this.$router.push({ path: '/portal/service/serviceCatalogForm', query: { id: target.serviceId } });
    },
    handleDelete(row) {
      const safeRow = row || {};
      const serviceIds = safeRow.serviceId
        ? [safeRow.serviceId]
        : this.selectedRows.map((r) => r.serviceId);
      Modal.confirm({
        getContainer: this.getDemoContainer,
        title: '系统提示',
        content: '是否确认删除？',
        onOk: () => {
          message.success('删除成功');
          this.loadServiceCatalogList();
        },
      });
    },
    handlePublish(row) {
      const safeRow = row || {};
      const serviceIds = safeRow.serviceId
        ? [safeRow.serviceId]
        : this.selectedRows.map((r) => r.serviceId);
      if (serviceIds.length == 0) {
        message.warning('请选择要发布的记录');
        return;
      }
      Modal.confirm({
        getContainer: this.getDemoContainer,
        title: '系统提示',
        content: '发布后将在门户网站上显示，是否确认发布？',
        onOk: () => {
          message.success('发布成功');
          this.loadServiceCatalogList();
        },
      });
    },
    handleOffline(row) {
      const safeRow = row || {};
      const serviceIds = safeRow.serviceId
        ? [safeRow.serviceId]
        : this.selectedRows.map((r) => r.serviceId);
      if (serviceIds.length == 0) {
        message.warning('请选择要下线的记录');
        return;
      }
      Modal.confirm({
        getContainer: this.getDemoContainer,
        title: '系统提示',
        content: '下线后将在门户网站上隐藏，是否确认下线？',
        onOk: () => {
          message.success('下线成功');
          this.loadServiceCatalogList();
        },
      });
    },
    openRatingDialog(row) {
      this.currentService = row;
      this.ratingForm.score = row.platformRating || 0;
      this.ratingForm.description = '';
      this.activeTab = 'platform';
      this.ratingDialogVisible = true;
    },
    auditStatusColor(status) {
      if (status === '已通过') return 'success';
      if (status === '已驳回') return 'error';
      return 'processing';
    },
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
    handleRatingSubmit() {
      message.success('评价成功');
      this.ratingDialogVisible = false;
      if (this.currentService) {
        this.currentService.platformRating = this.ratingForm.score;
      }
    },
    handleSyncData() {
      const hide = message.loading('同步中...', 0);
      // 模拟同步过程
      setTimeout(() => {
        hide();
        message.success('同步成功');
        this.loadServiceCatalogList();
      }, 1500);
    },
    changeTableHeight() {
      let height = document.body.offsetHeight;
      this.tableHeight = height - 330;
      this.tableMaxHeight = this.tableHeight;
    },
  },
};
</script>

<style scoped>
.service-catalog-list-page {
  padding: 4px 0;
}

.service-catalog-list-page__divider {
  height: 1px;
  background: #F2F3F5;
  margin: 0 16px;
}

.service-catalog-list-page__table-wrap {
  padding: 0 16px 16px 16px;
}

.cell-default {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
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
.service-type-tag--network { color: #722ED1; background: #F5F0FF; border-color: rgba(114, 46, 209, 0.20); }
.service-type-tag--security { color: #F53F3F; background: #FFF0ED; border-color: rgba(245, 63, 63, 0.20); }
.service-type-tag--bigdata { color: #D97000; background: #FFF3E8; border-color: rgba(217, 112, 0, 0.20); }
.service-type-tag--database { color: #0891B2; background: #ECFEFF; border-color: rgba(8, 145, 178, 0.20); }
.service-type-tag--backup { color: #0D9488; background: #F0FDFA; }
.service-type-tag--software { color: #4F46E5; background: #EEF2FF; }
.service-type-tag--hosting { color: #64748B; background: #F1F5F9; }

.cell-primary {
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-weight: 600;
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

.add-form {
  padding: 12px 24px 20px;
}

.form-section {
  margin-bottom: 24px;
}

.form-section:last-child {
  margin-bottom: 0;
}

.form-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

/* 详情弹窗样式 */
.fz-16 {
  font-size: 16px;
  font-weight: bold;
}
.mt--8 {
  margin-top: -8px;
}
.pt-24 {
  padding-top: 24px;
}
.pr-16 {
  padding-right: 16px;
}
.gird {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.content {
  display: flex;
  width: 50%;
  margin-bottom: 16px;
}
.content span:first-child {
  width: 100px;
  color: #666;
}
.content span:last-child {
  flex: 1;
  color: #333;
}

/* 评价样式 */


/* 列表状态列文字统一 0.65（色点不变） */
:deep(.ant-badge-status-text) {
  color: rgba(0, 0, 0, 0.65) !important;
}

.stars {
  display: inline-flex;
  gap: 2px;
  vertical-align: middle;
}

.star {
  font-size: 20px;
  color: #d9d9d9;
  cursor: pointer;
  transition: color 0.2s;
}

.star:hover {
  color: #faad14;
}

.star.full {
  color: #faad14;
}

.score-text {
  font-size: 15px;
  font-weight: 500;
  color: #1890ff;
  margin-left: 10px;
  vertical-align: middle;
}

.review-service {
  color: #262626;
  font-size: 13px;
  font-weight: 500;
}

.review-order {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 2px;
}

.review-org {
  color: #262626;
  font-size: 13px;
  font-weight: 500;
}

.review-user {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 2px;
}

.dialog-footer {
  text-align: right;
  padding-top: 12px;
}

/* 审核记录时间字段：等宽数字 */
.cell-num {
  font-family: "SF Mono", "Cascadia Code", "Consolas", "Roboto Mono", monospace;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.2px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
}

/* Drawer 样式 */
.cell-mono {
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
  font-variant-numeric: tabular-nums;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  letter-spacing: -0.2px;
}

.drawer-header-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 4px 0 8px;
  margin-bottom: 8px;
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

.drawer-header-sub__sep {
  color: #C9CDD4;
}

.drawer-desc :deep(.ant-descriptions-item-content) {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}

.muted {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 1.6;
}

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
  margin-bottom: 12px;
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

.rating-card__org {
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.8);
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

.dim-compact { display: flex; flex-direction: column; gap: 4px; }
.dim-compact-row { display: flex; align-items: center; gap: 4px; }
.dim-compact-label { font-size: 11px; color: #8c8c8c; width: 52px; flex-shrink: 0; }
.dim-compact-score {
  display: inline-flex; align-items: center; justify-content: center;
  width: 28px; height: 22px; border-radius: 4px;
  font-size: 12px; font-weight: 600;
  margin-right: 4px;
}

.rating-card__sep {
  color: #C9CDD4;
}

.rating-card__order {
  font-size: 13px;
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

:deep(.ant-drawer .ant-table-wrapper),
:deep(.ant-drawer .ant-table-wrapper .ant-table),
:deep(.ant-drawer .ant-table-wrapper .ant-table-container),
:deep(.ant-drawer .ant-table-wrapper .ant-table-thead > tr > th),
:deep(.ant-drawer .ant-table-wrapper .ant-table-tbody > tr > td),
:deep(.ant-drawer .ant-table-wrapper .ant-table-thead > tr:first-child > th:first-child),
:deep(.ant-drawer .ant-table-wrapper .ant-table-tbody > tr:first-child > td:first-child),
:deep(.ant-drawer .ant-descriptions),
:deep(.ant-drawer .ant-descriptions-bordered),
:deep(.ant-drawer .ant-descriptions-view),
:deep(.ant-drawer .ant-descriptions-view table),
:deep(.ant-drawer .ant-descriptions-row),
:deep(.ant-drawer .ant-descriptions-row > td),
:deep(.ant-drawer .ant-descriptions-row > th),
:deep(.ant-drawer .ant-descriptions-item-container),
:deep(.ant-drawer .ant-descriptions-item-label),
:deep(.ant-drawer .ant-descriptions-item-content) {
  border-radius: 0 !important;
}

:deep(.ant-drawer .ant-table-thead .ant-table-cell) {
  font-weight: normal !important;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
}

:deep(.ant-drawer .ant-descriptions-item-label) {
  background: #FAFBFC !important;
  font-weight: 400 !important;
  color: rgba(0, 0, 0, 0.85) !important;
  font-size: 14px !important;
  font-feature-settings: "tnum" !important;
  width: 160px !important;
  min-width: 160px !important;
  max-width: 160px !important;
  text-align: left !important;
  white-space: nowrap;
}
</style>

<style>
/* Drawer 内 descriptions 列宽与字体颜色（unscoped，因 a-drawer teleport 到 body） */
.ant-drawer .ant-descriptions-view table {
  width: 100% !important;
}

.ant-drawer .ant-descriptions-item-label {
  width: 160px !important;
  min-width: 160px !important;
  max-width: 160px !important;
  text-align: left !important;
  white-space: nowrap;
}

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

.pipeline-step__tag--pending {
  background: #F2F3F5;
  color: #86909C;
}

.pipeline-step__tag--processing {
  background: #E8F3FF;
  color: #165DFF;
}

.pipeline-step__tag--done {
  background: #E9F9EF;
  color: #16A34A;
}

.pipeline-step__tag--rejected {
  background: #FFEDEC;
  color: #EF4444;
}

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
