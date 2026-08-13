<template>
  <div class="component-list-page">
    <PageHeader
      title="能力组件管理"
    />

    <CloudCard class="component-list-page__table-card">
      <FilterBar @search="handleQuery" @reset="resetQuery">
        <template #actions>
          <a-button type="primary" @click="handleAdd">
            <template #icon><PlusOutlined /></template>
            {{ $t("Common.Add") }}
          </a-button>
          <a-button
            type="primary"
            :disabled="single"
            @click="handleEdit()"
          >
            <template #icon><EditOutlined /></template>
            修改
          </a-button>
          <a-button
            type="primary"
            danger
            :disabled="multiple"
            @click="handleDelete"
          >
            <template #icon><DeleteOutlined /></template>
            {{ $t("Common.Delete") }}
          </a-button>
          <a-button
            type="primary"
            :disabled="multiple"
            @click="handlePublish"
          >
            <template #icon><SendOutlined /></template>
            发布
          </a-button>
          <a-button
            type="primary"
            :disabled="multiple"
            @click="handleOffline"
          >
            <template #icon><DownloadOutlined /></template>
            下线
          </a-button>
        </template>
        <a-input
          v-model:value="queryParams.name"
          placeholder="能力组件名称"
          allow-clear
          style="width: 160px"
          @pressEnter="handleQuery"
        />
        <a-input
          v-model:value="queryParams.componentId"
          placeholder="能力组件ID"
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
          v-model:value="queryParams.cover"
          placeholder="开放范围"
          allow-clear
          style="width: 150px"
        >
          <a-select-option
            v-for="item in coverOptions"
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
      <div class="component-list-page__divider"></div>
      <div class="component-list-page__table-wrap">
        <a-table
          ref="tableComponentList"
          :columns="columns"
          :data-source="componentList"
          :loading="loading"
          :pagination="paginationConfig"
          :row-key="(record) => record.componentId"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: handleSelectionChange }"
          :scroll="{ y: tableHeight }"
          :custom-row="(record) => ({ onDblclick: () => handleEdit(record) })"
          @change="onTableChange"
        >
          <template #bodyCell="{ column, record }">
            <span v-if="column.dataIndex === 'name'" class="cell-name">
              <span class="cell-name__title">{{ record.name }}</span>
              <span class="cell-name__id">{{ record.componentId || '--' }}</span>
            </span>
            <a-badge v-else-if="column.dataIndex === 'status'" :status="record.status === 20 ? 'success' : record.status === 30 ? 'error' : 'default'" :text="record.status === 20 ? '已上线使用' : record.status === 30 ? '已下架' : '未知'" />
            <span v-else-if="column.dataIndex === 'platformRating'" @click="goToReview(record)" class="rating-star">{{ record.platformRating || 0 }}</span>
            <span v-else-if="column.dataIndex === 'usageRating'" @click="goToReview(record)" class="rating-star">{{ record.usageRating || 0 }}</span>
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
    <a-modal
      title="详情"
      width="800px"
      v-model:open="detailDialogVisible"
      :mask-closable="false"
    >
      <div class="dialog-body">
        <p class="fz-16 mt--8">基本信息</p>
        <div class="gird">
          <div class="content">
            <span>组件名称</span>
            <span>{{ detailForm.name || '--' }}</span>
          </div>
          <div class="content">
            <span class="pr-16">LOGO</span>
            <img v-if="detailForm.logo" :src="detailForm.logo" class="img" />
            <span v-else>--</span>
          </div>
          <div class="content pt-24">
            <span>组件描述</span>
            <span>{{ detailForm.description || '--' }}</span>
          </div>
          <div class="content">
            <span>显示顺序</span>
            <span>{{ detailForm.sortOrder || 0 }}</span>
          </div>
        </div>

        <p class="pt-24 fz-16">联系信息</p>
        <div class="gird">
          <div class="content">
            <span>服务商名称</span>
            <span>{{ detailForm.serviceProviderName || '--' }}</span>
          </div>
          <div class="content">
            <span>联系方式1</span>
            <span>{{ detailForm.contact1Name || '--' }} {{ detailForm.contact1Phone || '--' }}</span>
          </div>
          <div class="content">
            <span>联系方式2</span>
            <span>{{ detailForm.contact2Name || '--' }} {{ detailForm.contact2Phone || '--' }}</span>
          </div>
        </div>

        <p class="pt-24 fz-16">分类标签</p>
        <div class="gird">
          <div class="content">
            <span>部署云服务商</span>
            <span>{{ detailForm.deployServiceProviderView || '--' }}</span>
          </div>
          <div class="content">
            <span>开放范围</span>
            <span>{{ detailForm.coverView || '--' }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <a-button @click="detailDialogVisible = false">关闭</a-button>
        </div>
      </template>
    </a-modal>

    <!-- 评价弹窗 -->
    <a-modal
      title="组件评价"
      width="920px"
      v-model:open="ratingDialogVisible"
      :mask-closable="false"
    >
      <div class="add-form">
        <a-tabs v-model:activeKey="activeTab">
          <a-tab-pane key="platform" tab="平台评分">
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
          <a-tab-pane key="user" tab="用户评分">
            <a-table
              :columns="ratingColumns"
              :data-source="usageRatings"
              :pagination="false"
              size="small"
              style="width: 100%"
              :row-key="(record, index) => index"
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
                <template v-else-if="column.dataIndex === 'content'">
                  {{ record.content }}
                </template>
                <template v-else-if="column.dataIndex === 'time'">
                  {{ record.time }}
                </template>
              </template>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <a-button v-if="activeTab === 'platform'" type="primary" @click="handleRatingSubmit">提交</a-button>
          <a-button @click="ratingDialogVisible = false">关闭</a-button>
        </div>
      </template>
    </a-modal>

    <!-- 详情抽屉 -->
    <a-drawer
      v-model:open="drawer.visible"
      title="能力组件详情"
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
              <span class="drawer-header-title">{{ drawer.record.name || '--' }}</span>
              <a-badge :status="drawerStatusBadge(drawer.record.status)" :text="getStatusText(drawer.record.status)" />
            </div>
            <div class="drawer-header-sub">
              <span>ID：{{ drawer.record.componentId || '--' }}</span>
            </div>
          </div>
        </div>

        <a-tabs v-model:activeKey="drawer.activeTab" class="mvp-detail-tabs">
          <a-tab-pane key="overview" tab="概览">
            <div class="overview-section">
              <div class="overview-section__title">基本信息</div>
              <a-descriptions :column="2" bordered size="small" class="drawer-desc">
                <a-descriptions-item label="显示顺序" :span="2">
                  <span class="cell-mono">{{ drawer.record.sortOrder != null ? drawer.record.sortOrder : 0 }}</span>
                </a-descriptions-item>
                <a-descriptions-item label="组件描述" :span="2">
                  <span class="muted">{{ drawer.record.description || '--' }}</span>
                </a-descriptions-item>
              </a-descriptions>
            </div>
            <div class="overview-section">
              <div class="overview-section__title">联系信息</div>
              <a-descriptions :column="2" bordered size="small" class="drawer-desc">
                <a-descriptions-item label="服务商名称" :span="2">{{ drawer.record.serviceProviderName || '--' }}</a-descriptions-item>
                <a-descriptions-item label="联系方式1">
                  {{ drawer.record.contact1Name || '--' }} {{ drawer.record.contact1Phone || '' }}
                </a-descriptions-item>
                <a-descriptions-item label="联系方式2">
                  {{ drawer.record.contact2Name || '--' }} {{ drawer.record.contact2Phone || '' }}
                </a-descriptions-item>
              </a-descriptions>
            </div>
            <div class="overview-section">
              <div class="overview-section__title">分类标签</div>
              <a-descriptions :column="2" bordered size="small" class="drawer-desc">
                <a-descriptions-item label="部署云服务商">{{ drawer.record.deployServiceProviderView || '--' }}</a-descriptions-item>
                <a-descriptions-item label="开放范围">{{ drawer.record.coverView || '--' }}</a-descriptions-item>
              </a-descriptions>
            </div>
          </a-tab-pane>
          <a-tab-pane key="audit" tab="审核信息">
            <div class="overview-section__title">审核记录</div>
            <a-table
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
                <span class="overview-section__title">用户评分</span>
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
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  SendOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
  RobotOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import { getComponentList, delComponent, publishComponent, offlineComponent } from "@/api/contentcore/component";
import PageHeader from "@/components/cloud/PageHeader.vue";
import CloudCard from "@/components/cloud/CloudCard.vue";
import FilterBar from "@/components/cloud/FilterBar.vue";
import StatusDot from "@/components/cloud/StatusDot.vue";

export default {
  name: "CMSComponentList",
  components: {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    ReloadOutlined,
    DownloadOutlined,
    SendOutlined,
    EyeOutlined,
    QuestionCircleOutlined,
    RobotOutlined,
    CheckOutlined,
    CloseOutlined,
    PageHeader,
    CloudCard,
    FilterBar,
    StatusDot,
  },
  data() {
    return {
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
      coverOptions: [
        { value: '不限', label: '不限' },
        { value: '市级', label: '市级' },
        { value: '区（县）域', label: '区（县）域' }
      ],
      cloudProviderOptions: [
        { value: '电信云', label: '电信云' },
        { value: '移动云', label: '移动云' },
        { value: '联通云', label: '联通云' },
        { value: '浪潮云', label: '浪潮云' },
        { value: '紫光云', label: '紫光云' },
        { value: '影像云', label: '影像云' }
      ],
      componentList: [],
      total: 0,
      tableHeight: 600,
      tableMaxHeight: 600,
      selectedRows: [],
      selectedRowKeys: [],
      single: true,
      multiple: true,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        componentId: undefined,
        serviceProvider: undefined,
        cloudProvider: undefined,
        cover: undefined,
        status: undefined,
      },
      columns: [
        { title: '能力组件名称/ID', dataIndex: 'name', key: 'name', ellipsis: true, width: 180 },

        { title: '组件描述', dataIndex: 'description', key: 'description', ellipsis: true, width: 250 },
        { title: '服务商名称', dataIndex: 'serviceProviderName', key: 'serviceProviderName', ellipsis: true, width: 150 },
        { title: '部署云服务商', dataIndex: 'deployServiceProviderView', key: 'deployServiceProviderView', ellipsis: true, width: 120 },
        { title: '开放范围', dataIndex: 'coverView', key: 'coverView', width: 120 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
        { title: '平台评分', dataIndex: 'platformRating', key: 'platformRating', width: 100 },
        { title: '用户评分', dataIndex: 'usageRating', key: 'usageRating', width: 100 },
        { title: '操作', dataIndex: 'action', key: 'action', width: 200, fixed: 'right' }
      ],
      ratingColumns: [
        { title: '评分', dataIndex: 'score', key: 'score', width: 200 },
        { title: '服务/订单号', dataIndex: 'serviceName', key: 'serviceName', width: 200 },
        { title: '评价机构', dataIndex: 'orgName', key: 'orgName', width: 200 },
        { title: '评价内容', dataIndex: 'content', key: 'content', ellipsis: true },
        { title: '评价时间', dataIndex: 'time', key: 'time', width: 140 }
      ],
      detailDialogVisible: false,
      detailForm: {
        name: '',
        logo: '',
        description: '',
        sortOrder: 0,
        serviceProviderName: '',
        contact1Name: '',
        contact1Phone: '',
        contact2Name: '',
        contact2Phone: '',
        deployServiceProviderView: '',
        coverView: ''
      },
      ratingDialogVisible: false,
      activeTab: 'platform',
      ratingForm: { score: 0, description: '' },
      usageRatings: [],
      dimLabels: ['准确性', '稳定性', '响应时效', '业务适配性'],
      currentComponent: null,
    };
  },
  computed: {
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
    drawerUsageRatings() {
      const rec = this.drawer.record
      if (!rec) return []
      const compName = rec.name || '能力组件'
      return [
        { ratings: { '准确性': 5, '稳定性': 5, '响应时效': 4, '业务适配性': 5 }, serviceName: compName, orderNo: '#ORD-2026-0085', orgName: '华能数智科技集团', userName: '张三', department: '技术部', content: '组件功能强大，使用简单，非常满意。', time: '2026-03-15 10:30:00', reply: '感谢您的认可！我们会继续优化组件功能和文档。', replyTime: '2026-03-15 14:20:00' },
        { ratings: { '准确性': 4, '稳定性': 4, '响应时效': 5, '业务适配性': 4 }, serviceName: compName, orderNo: '#ORD-2026-0071', orgName: '中远云科技有限公司', userName: '王总', department: '信息部', content: '组件性能稳定，文档完善，值得推荐。', time: '2026-03-14 14:20:00' },
        { ratings: { '准确性': 3, '稳定性': 3, '响应时效': 4, '业务适配性': 3 }, serviceName: compName, orderNo: '#ORD-2026-0083', orgName: '北京协和医学院', userName: '李护士长', department: '信息科', content: '组件功能基本满足需求，但配置稍显复杂。', time: '2026-03-13 16:45:00' }
      ]
    }
  },
  created() {
    this.changeTableHeight();
    this.loadComponentList();
  },
  methods: {
    loadComponentList() {
      this.loading = true;
      getComponentList(this.queryParams).then((response) => {
        this.componentList = response.data.rows.map(item => {
          return {
            ...item,
            platformRating: parseFloat((Math.random() * 4 + 1).toFixed(1)),
            usageRating: parseFloat((Math.random() * 4 + 1).toFixed(1))
          };
        });
        this.total = parseInt(response.data.total);
        this.loading = false;
      });
    },
    handleSelectionChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
      this.single = selectedRows.length != 1;
      this.multiple = !selectedRows.length;
    },
    onTableChange(pag) {
      this.queryParams.pageNum = pag.current;
      this.queryParams.pageSize = pag.pageSize;
      this.loadComponentList();
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.loadComponentList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleAdd() {
      this.$router.push({ path: '/portal/service/componentForm' });
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
    goToReview(row) {
      this.$router.push({ path: '/portal/order/review', query: { serviceId: row.componentId } });
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
    formatTime(time) {
      if (!time) return '--';
      const d = new Date(time);
      if (isNaN(d.getTime())) return time;
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    },
    handleEdit(row) {
      const editRow = row || (this.selectedRows && this.selectedRows[0]);
      if (!editRow) {
        message.warning('请选择一条记录');
        return;
      }
      this.$router.push({ path: '/portal/service/componentForm', query: { id: editRow.componentId } });
    },
    handleDelete(row) {
      const safeRow = row || {};
      const componentIds = safeRow.componentId
        ? [safeRow.componentId]
        : this.selectedRows.map((r) => r.componentId);
      if (componentIds.length === 0) {
        message.warning('请选择要删除的记录');
        return;
      }
      Modal.confirm({
        title: "是否确认删除？",
        onOk: () => {
          return delComponent(componentIds).then(() => {
            this.loadComponentList();
            message.success(this.$t("Common.DeleteSuccess"));
          });
        },
        onCancel() {}
      });
    },
    handlePublish(row) {
      const safeRow = row || {};
      const componentIds = safeRow.componentId
        ? [safeRow.componentId]
        : this.selectedRows.map((r) => r.componentId);
      if (componentIds.length == 0) {
        message.warning('请选择要发布的记录');
        return;
      }
      Modal.confirm({
        title: "发布后将在门户网站上显示，是否确认发布？",
        onOk: () => {
          return publishComponent(componentIds).then(() => {
            message.success('发布成功');
            this.loadComponentList();
          });
        }
      });
    },
    handleOffline(row) {
      const safeRow = row || {};
      const componentIds = safeRow.componentId
        ? [safeRow.componentId]
        : this.selectedRows.map((r) => r.componentId);
      if (componentIds.length == 0) {
        message.warning('请选择要下线的记录');
        return;
      }
      Modal.confirm({
        title: "下线后将在门户网站上隐藏，是否确认下线？",
        onOk: () => {
          return offlineComponent(componentIds).then(() => {
            message.success('下线成功');
            this.loadComponentList();
          });
        }
      });
    },
    changeTableHeight() {
      let height = document.body.offsetHeight;
      this.tableHeight = height - 330;
      this.tableMaxHeight = this.tableHeight;
    },
    handleSyncData() {
      const hide = message.loading('同步中...', 0);
      setTimeout(() => {
        hide();
        message.success('同步成功');
        this.loadComponentList();
      }, 1500);
    },
    openRatingDialog(row) {
      this.currentComponent = row;
      this.activeTab = 'platform';
      this.ratingForm.score = row.platformRating || 0;
      this.ratingForm.description = '';
      this.usageRatings = [
        { id: 1, ratings: { '准确性': 5, '稳定性': 5, '响应时效': 4, '业务适配性': 5 }, serviceName: row.name || '能力组件', orderNo: '#ORD-2026-0085', orgName: '华能数智科技集团', userName: '张三', department: '技术部', content: '组件功能强大，使用简单，非常满意。', time: '2026-03-15 10:30:00' },
        { id: 2, ratings: { '准确性': 4, '稳定性': 4, '响应时效': 5, '业务适配性': 4 }, serviceName: row.name || '能力组件', orderNo: '#ORD-2026-0071', orgName: '中远云科技有限公司', userName: '王总', department: '信息部', content: '组件性能稳定，文档完善，值得推荐。', time: '2026-03-14 14:20:00' },
        { id: 3, ratings: { '准确性': 3, '稳定性': 3, '响应时效': 4, '业务适配性': 3 }, serviceName: row.name || '能力组件', orderNo: '#ORD-2026-0083', orgName: '北京协和医学院', userName: '李护士长', department: '信息科', content: '组件功能基本满足需求，但配置稍显复杂。', time: '2026-03-13 16:45:00' }
      ];
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
      this.currentComponent.platformRating = this.ratingForm.score;
    },
  },
};
</script>
<style scoped>
.component-list-page {
  padding: 4px 0;
}

.component-list-page__divider {
  height: 1px;
  background: #F2F3F5;
  margin: 0 16px;
}

.component-list-page__table-wrap {
  padding: 0 16px 16px 16px;
}

.cell-default {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}

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

.upload-logo {
  margin-top: 10px;
}
.upload-dragger {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.upload-dragger .avatar {
  width: 120px;
  height: 120px;
  border-radius: 6px;
  object-fit: cover;
}
.upload-text {
  font-size: 14px;
  color: #909399;
  line-height: 1.5;
}
.upload-tip {
  font-size: 12px;
  color: #909399;
  text-align: center;
  margin: 0;
}

.add-form {
  padding: 4px 24px 20px;
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
.img {
  width: 60px;
  height: 60px;
  border-radius: 4px;
}

.rating-star {
  color: #165DFF;
  cursor: pointer;
  font-weight: 400;
}

.rating-star:hover {
  text-decoration: underline;
}

/* 列表状态列文字统一 0.65（色点不变） */
:deep(.ant-badge-status-text) {
  color: rgba(0, 0, 0, 0.65) !important;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 14px;
  color: #d9d9d9;
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
  font-size: 13px;
  font-weight: 500;
  color: #262626;
}

.review-order {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
}

.review-org {
  font-size: 13px;
  font-weight: 500;
  color: #262626;
}

.review-user {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
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

.cell-stack {
  display: flex;
  flex-direction: column;
  line-height: 1.5;
}

.cell-stack__primary {
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.cell-stack__secondary {
  font-size: 12px;
  color: #86909C;
  margin-top: 2px;
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

.dim-compact { display: flex; flex-direction: column; gap: 4px; }
.dim-compact-row { display: flex; align-items: center; gap: 4px; }
.dim-compact-label { font-size: 11px; color: #8c8c8c; width: 52px; flex-shrink: 0; }
.dim-compact-score {
  display: inline-flex; align-items: center; justify-content: center;
  width: 28px; height: 22px; border-radius: 4px;
  font-size: 12px; font-weight: 600;
  margin-right: 4px;
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
.audit-pipeline { display: flex; gap: 0; padding: 16px 20px; background: #FAFBFC; border: 1px solid #F2F3F5; border-radius: 8px; overflow-x: auto; }
.pipeline-step { display: flex; flex-direction: column; align-items: center; flex: 1; min-width: 140px; position: relative; padding: 0 6px; }
.pipeline-step__dot { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0; transition: all 0.2s; color: #86909C; background: #FFFFFF; border: 1.5px solid #C9CDD4; z-index: 1; }
.pipeline-step__dot--done { color: #FFFFFF; background: #16A34A; border-color: #16A34A; }
.pipeline-step__dot--processing { color: #FFFFFF; background: #165DFF; border-color: #165DFF; box-shadow: 0 2px 6px rgba(22, 93, 255, 0.35); }
.pipeline-step__dot--rejected { color: #FFFFFF; background: #EF4444; border-color: #EF4444; }
.pipeline-step__dot--pending { color: #86909C; background: #FFFFFF; border-color: #C9CDD4; }
.pipeline-step__content { display: flex; flex-direction: column; align-items: center; text-align: center; margin-top: 10px; gap: 4px; }
.pipeline-step__title { font-size: 12px; font-weight: 500; color: rgba(0, 0, 0, 0.85); white-space: nowrap; }
.pipeline-step--processing .pipeline-step__title { font-weight: 600; color: #165DFF; }
.pipeline-step__tag { display: inline-block; padding: 1px 8px; font-size: 11px; font-weight: 500; border-radius: 4px; margin: 2px 0; }
.pipeline-step__tag--pending { background: #F2F3F5; color: #86909C; }
.pipeline-step__tag--processing { background: #E8F3FF; color: #165DFF; }
.pipeline-step__tag--done { background: #E9F9EF; color: #16A34A; }
.pipeline-step__tag--rejected { background: #FFEDEC; color: #EF4444; }
.pipeline-step__detail { background: #F2F3F5; border-radius: 6px; padding: 10px 12px; max-width: 200px; margin-top: 4px; }
.pipeline-step__opinion { font-size: 13px; color: rgba(0, 0, 0, 0.65); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.pipeline-step__meta { margin-top: 6px; text-align: center; line-height: 1.6; }
.pipeline-step__auditor, .pipeline-step__audit-time { font-size: 12px; color: #86909C; white-space: nowrap; }
.pipeline-step__connector { position: absolute; top: 12px; left: 50%; width: 100%; height: 2px; background: #E5E6EB; z-index: 0; }
.pipeline-step__connector--done { background: #16A34A; }
</style>
