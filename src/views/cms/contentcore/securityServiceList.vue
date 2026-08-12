<template>
  <div class="security-service-list-page">
    <PageHeader
      title="安全服务管理"
    />

    <CloudCard class="security-service-list-page__table-card">
      <FilterBar @search="handleQuery" @reset="resetQuery">
        <template #actions>
          <a-button type="primary" @click="handleAdd">
            <template #icon><PlusOutlined /></template>
            {{ $t("Common.Add") }}
          </a-button>
          <a-button
            type="primary"
            :disabled="single"
            v-hasPermi="[$p('Catalog:EditContent:{0}', [catalogId])]"
            @click="handleEdit()"
          >
            <template #icon><EditOutlined /></template>
            修改
          </a-button>
          <a-button
            type="primary"
            danger
            :disabled="multiple"
            v-hasPermi="[$p('Catalog:DeleteContent:{0}', [catalogId])]"
            @click="handleDelete"
          >
            <template #icon><DeleteOutlined /></template>
            {{ $t("Common.Delete") }}
          </a-button>
          <a-button
            type="primary"
            :disabled="multiple"
            v-hasPermi="[$p('Catalog:EditContent:{0}', [catalogId])]"
            @click="handlePublish"
          >
            <template #icon><SendOutlined /></template>
            {{ $t("CMS.ContentCore.Publish") }}
          </a-button>
          <a-button
            type="primary"
            :disabled="multiple"
            v-hasPermi="[$p('Catalog:EditContent:{0}', [catalogId])]"
            @click="handleOffline"
          >
            <template #icon><DownloadOutlined /></template>
            {{ $t("CMS.Content.Offline") }}
          </a-button>
        </template>
        <a-input
          v-model:value="queryParams.title"
          placeholder="安全服务名称"
          allow-clear
          style="width: 160px"
          @pressEnter="handleQuery"
        />
        <a-input
          v-model:value="queryParams.appId"
          placeholder="安全服务ID"
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
          v-model:value="queryParams.cloud"
          placeholder="部署云服务商"
          allow-clear
          style="width: 150px"
        >
          <a-select-option value="电信云">电信云</a-select-option>
          <a-select-option value="移动云">移动云</a-select-option>
          <a-select-option value="联通云">联通云</a-select-option>
          <a-select-option value="浪潮云">浪潮云</a-select-option>
          <a-select-option value="紫光云">紫光云</a-select-option>
          <a-select-option value="影像云">影像云</a-select-option>
        </a-select>
        <a-select
          v-model:value="queryParams.status"
          placeholder="状态"
          allow-clear
          style="width: 110px"
        >
          <a-select-option value="10">已上线使用</a-select-option>
          <a-select-option value="40">已下架</a-select-option>
        </a-select>
      </FilterBar>
      <div class="security-service-list-page__divider"></div>
      <div class="security-service-list-page__table-wrap">
        <a-table
          ref="tableContentList"
          :columns="columns"
          :data-source="contentList"
          :loading="loading"
          :pagination="paginationConfig"
          :row-key="(record) => record.contentId"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: handleSelectionChange }"
          :scroll="{ y: tableHeight }"
          :custom-row="(record) => ({ onDblclick: () => handleEdit(record) })"
          @change="onTableChange"
        >
        <template #bodyCell="{ column, record }">
          <span v-if="column.dataIndex === 'title'" class="cell-name">
            <span class="cell-name__title">{{ record.title }}</span>
            <span class="cell-name__id">{{ record.appId || '--' }}</span>
          </span>
          <span v-else-if="column.dataIndex === 'cover'" class="cell-default">{{ formatCover(record.cover) }}</span>
          <a-badge v-else-if="column.dataIndex === 'status'" :status="record.status === 10 ? 'success' : record.status === 40 ? 'error' : 'default'" :text="record.status === 10 ? '已上线使用' : record.status === 40 ? '已下架' : '未知'" />
          <span v-else-if="column.dataIndex === 'platformRating'" @click="goToReview(record)" class="rating-star">{{ record.platformRating || 0 }}</span>
          <span v-else-if="column.dataIndex === 'usageRating'" @click="goToReview(record)" class="rating-star">{{ record.usageRating || 0 }}</span>
          <template v-else-if="column.dataIndex === 'action'">
            <a-space size="small">
              <a-button type="link" size="small" class="!p-0" @click.stop="handleDetail(record)">详情</a-button>
              <a-divider type="vertical" class="!mx-[2px]" />
              <a-button type="link" size="small" class="!p-0" v-hasPermi="[$p('Catalog:EditContent:{0}', [record.catalogId])]" @click="handleEdit(record)">修改</a-button>
              <a-divider type="vertical" class="!mx-[2px]" />
              <a-button type="link" size="small" danger class="!p-0" v-hasPermi="[$p('Catalog:DeleteContent:{0}', [record.catalogId])]" @click="handleDelete(record)">删除</a-button>
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
        <!-- 应用信息 -->
        <p class="fz-16 mt--8">应用信息</p>
        <div class="gird">
          <div class="content">
            <span>服务名称</span>
            <span>{{ detailForm.title || '--' }}</span>
          </div>
          <div class="content">
            <span>系统地址</span>
            <span>{{ detailForm.systemUrl || '--' }}</span>
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

        <!-- 联系信息 -->
        <p class="pt-24 fz-16">联系信息</p>
        <div class="gird">
          <div class="content">
            <span>服务商名称</span>
            <span>{{ detailForm.serviceProvider || '--' }}</span>
          </div>
          <div class="content">
            <span>合作伙伴名称</span>
            <span>{{ detailForm.cooperativeEnterprise || '--' }}</span>
          </div>
          <div class="content">
            <span>联系方式1</span>
            <span>{{ detailForm.contactName1 || '--' }} {{ detailForm.contactPhone1 || '--' }}</span>
          </div>
          <div class="content">
            <span>联系方式2</span>
            <span>{{ detailForm.contactName2 || '--' }} {{ detailForm.contactPhone2 || '--' }}</span>
          </div>
        </div>

        <!-- 分类标签 -->
        <p class="pt-24 fz-16">分类标签</p>
        <div class="gird">
          <div class="content">
            <span>应用架构</span>
            <span>{{ detailForm.appArchitecture ? detailForm.appArchitecture.join('；') : '--' }}</span>
          </div>
          <div class="content">
            <span>部署云服务商</span>
            <span>{{ detailForm.cloudProvider ? detailForm.cloudProvider.join('；') : '--' }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <a-button @click="detailDialogVisible = false">关闭</a-button>
        </div>
      </template>
    </a-modal>

    <!-- 置顶时间设置弹窗 -->
    <a-modal
      :title="$t('CMS.Content.SetTop')"
      width="400px"
      v-model:open="topDialogVisible"
      :mask-closable="false"
    >
      <a-form ref="top_form" :label-col="{ style: { width: '100px' } }" :model="topForm">
        <a-form-item :label="$t('CMS.Content.TopEndTime')" name="topEndTime">
          <a-date-picker
            v-model:value="topForm.topEndTime"
            :disabled-date="topEndTimePickerOptions.disabledDate"
            value-format="YYYY-MM-DD HH:mm:ss"
            show-time
            style="width: 100%"
          />
        </a-form-item>
      </a-form>
      <template #footer>
        <div class="dialog-footer">
          <a-button type="primary" @click="handleTopDialogOk">{{
            $t("Common.Confirm")
          }}</a-button>
          <a-button @click="topDialogVisible = false">{{
            $t("Common.Cancel")
          }}</a-button>
        </div>
      </template>
    </a-modal>
    <!-- 进度条 -->
    <cms-progress
      :title="$t('CMS.ContentCore.PublishProgressTitle')"
      v-model:open="openProgress"
      :taskId="taskId"
    ></cms-progress>
    <!-- 栏目选择组件 -->
    <cms-catalog-selector
      :open="openCatalogSelector"
      :showCopyToolbar="isCopy"
      :multiple="isCopy"
      @ok="handleCatalogSelectorOk"
      @close="handleCatalogSelectorClose"
    ></cms-catalog-selector>

    <!-- 评价弹窗 -->
    <a-modal
      title="应用评价"
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
                <template v-else-if="column.dataIndex === 'service'">
                  <div>
                    <div class="review-service">{{ record.serviceName }}</div>
                    <div class="review-order">{{ record.orderNo }}</div>
                  </div>
                </template>
                <template v-else-if="column.dataIndex === 'org'">
                  <div>
                    <div class="review-org">{{ record.orgName }}</div>
                    <div class="review-user">{{ record.userName }} · {{ record.department }}</div>
                  </div>
                </template>
                <template v-else-if="column.dataIndex === 'content'">
                  {{ record.content }}
                </template>
                <template v-else-if="column.dataIndex === 'time'">
                  {{ formatTime(record.time) }}
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
      title="安全服务详情"
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
              <span class="drawer-header-title">{{ drawer.record.title || '--' }}</span>
              <a-badge :status="drawerStatusBadge(drawer.record.status)" :text="getStatusText(drawer.record.status)" />
            </div>
            <div class="drawer-header-sub">
              <span>ID：{{ drawer.record.appId || drawer.record.contentId || '--' }}</span>
            </div>
          </div>
        </div>

        <a-tabs v-model:activeKey="drawer.activeTab" class="mvp-detail-tabs">
          <a-tab-pane key="overview" tab="概览">
            <div class="overview-section__title">基本信息</div>
            <a-descriptions :column="2" bordered size="small" class="mb-[16px]">
              <a-descriptions-item label="系统地址" :span="2">
                {{ drawer.record.systemUrl || '--' }}
              </a-descriptions-item>
              <a-descriptions-item label="显示顺序" :span="2">
                {{ drawer.record.sortOrder != null ? drawer.record.sortOrder : 0 }}
              </a-descriptions-item>
              <a-descriptions-item label="服务描述" :span="2">
                {{ drawer.record.description || '--' }}
              </a-descriptions-item>
            </a-descriptions>
            <div class="overview-section__title">联系信息</div>
            <a-descriptions :column="2" bordered size="small" class="mb-[16px]">
              <a-descriptions-item label="服务商名称">{{ drawer.record.serviceProvider || '--' }}</a-descriptions-item>
              <a-descriptions-item label="合作伙伴">{{ drawer.record.cooperativeEnterprise || '--' }}</a-descriptions-item>
              <a-descriptions-item label="联系方式1">
                {{ drawer.record.contactName1 || '--' }} {{ drawer.record.contactPhone1 || '' }}
              </a-descriptions-item>
              <a-descriptions-item label="联系方式2">
                {{ drawer.record.contactName2 || '--' }} {{ drawer.record.contactPhone2 || '' }}
              </a-descriptions-item>
            </a-descriptions>
            <div class="overview-section__title">分类标签</div>
            <a-descriptions :column="2" bordered size="small">
              <a-descriptions-item label="应用架构" :span="2">{{ formatArray(drawer.record.appArchitecture) }}</a-descriptions-item>
              <a-descriptions-item label="部署云服务商" :span="2">{{ formatArray(drawer.record.cloudProvider) }}</a-descriptions-item>
            </a-descriptions>
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
import { getUserPreference } from "@/api/system/user";
import { getContentTypes } from "@/api/contentcore/catalog";
import {
  getContentList,
  delContent,
  publishContent,
  createIndexes,
  copyContent,
  moveContent,
  setTopContent,
  cancelTopContent,
  sortContent,
  offlineContent,
  archiveContent,
  toPublishContent,
  addContentAttribute,
  removeContentAttribute,
} from "@/api/contentcore/content";
import CMSCatalogSelector from "@/views/cms/contentcore/catalogSelector";
import CMSProgress from "@/views/components/Progress";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  SendOutlined,
  EyeOutlined,
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
  name: "CMSSecurityServiceList",
  components: {
    "cms-catalog-selector": CMSCatalogSelector,
    "cms-progress": CMSProgress,
    PageHeader,
    CloudCard,
    FilterBar,
    StatusDot,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    ReloadOutlined,
    DownloadOutlined,
    SendOutlined,
    EyeOutlined,
    RobotOutlined,
    CheckOutlined,
    CloseOutlined,
  },
  props: {
    cid: {
      type: String,
      default: undefined,
      required: false,
    },
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 详情抽屉
      drawer: { visible: false, record: null, activeTab: 'overview' },
      expandedRowKeys: [],
      addPopoverVisible: false,
      showSearch: false,
      contentTypeOptions: [],
      catalogId: this.cid || '603612031287366',
      contentList: [],
      total: 0,
      tableHeight: 600, // 表格高度
      tableMaxHeight: 600, // 表格最大高度
      selectedRows: [], // 表格选中行
      selectedRowKeys: [],
      single: true,
      multiple: true,
      dateRange: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        appId: undefined,
        contentType: undefined,
        status: undefined,
        serviceProvider: undefined,
        cloud: undefined,
        catalogId: undefined,
        sorts: "",
      },
      columns: [
        { title: '安全服务名称/ID', dataIndex: 'title', key: 'title', width: 220 },
        { title: '服务描述', dataIndex: 'description', key: 'description', width: 280, ellipsis: true },
        { title: '服务商名称', dataIndex: 'serviceProvider', key: 'serviceProvider', ellipsis: true, width: 150 },
        { title: '合作伙伴', dataIndex: 'cooperativeEnterprise', key: 'cooperativeEnterprise', ellipsis: true, width: 150 },
        { title: '部署云服务商', dataIndex: 'cloudProvider', key: 'cloudProvider', ellipsis: true, width: 150 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
        { title: '平台评分', dataIndex: 'platformRating', key: 'platformRating', width: 90 },
        { title: '用户评分', dataIndex: 'usageRating', key: 'usageRating', width: 90 },
        { title: '操作', dataIndex: 'action', key: 'action', width: 200, fixed: 'right' }
      ],
      ratingColumns: [
        { title: '评分', dataIndex: 'score', key: 'score', width: 200 },
        { title: '服务/订单号', dataIndex: 'service', key: 'service', width: 200 },
        { title: '评价机构', dataIndex: 'org', key: 'org', width: 200 },
        { title: '评价内容', dataIndex: 'content', key: 'content', ellipsis: true },
        { title: '评价时间', dataIndex: 'time', key: 'time', width: 140 }
      ],
      // 详情弹窗
      detailDialogVisible: false,
      detailForm: {
        title: '',
        logo: '',
        description: '',
        systemUrl: '',
        sortOrder: 0,
        serviceProvider: '',
        cooperativeEnterprise: '',
        contactName1: '',
        contactPhone1: '',
        contactName2: '',
        contactPhone2: '',
        targetObject: [],
        appArchitecture: [],
        cloudProvider: [],
        appScope: ''
      },
      topDialogVisible: false,
      topForm: {
        topEndTime: undefined,
      },
      topEndTimePickerOptions: {
        disabledDate(current) {
          return current && current.valueOf() < Date.now() - 8.64e7; //如果没有后面的-8.64e7就是不可以选择今天的
        },
      },
      openProgress: false,
      taskId: "",
      addContentType: "",
      openCatalogSelector: false, // 栏目选择弹窗
      isCopy: false,
      openContentSortDialog: false, // 内容选择弹窗
      openEditorW: true,
      // 评价弹窗
      ratingDialogVisible: false,
      activeTab: 'platform',
      ratingForm: {
        score: 0,
        description: ''
      },
      dimLabels: ['准确性', '稳定性', '响应时效', '业务适配性'],
      currentApp: null,
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
      usageRatings: [
        {
          ratings: { '准确性': 5, '稳定性': 5, '响应时效': 4, '业务适配性': 5 },
          serviceName: '智慧园区综合管理平台',
          orderNo: '#ORD-2024-0089',
          orgName: '北京市海淀区数字经济发展局',
          userName: '张三',
          department: '技术部',
          content: '平台运行稳定，功能齐全，售后服务响应及时，整体体验很好。',
          time: '2024-03-15 14:32:00'
        },
        {
          ratings: { '准确性': 4, '稳定性': 4, '响应时效': 5, '业务适配性': 4 },
          serviceName: '统一身份认证组件',
          orderNo: '#ORD-2024-0090',
          orgName: '北京市朝阳区卫健委',
          userName: '李四',
          department: '信息科',
          content: '组件集成方便，文档完善，基本满足需求，部分场景适配需优化。',
          time: '2024-03-12 09:15:00'
        }
      ],
    };
  },
  watch: {
    cid(newVal) {
      this.catalogId = newVal;
    },
    catalogId(newVal) {
      this.loadContentList();
    },
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
      const appName = rec.title || '数字应用'
      return [
        { ratings: { '准确性': 5, '稳定性': 5, '响应时效': 4, '业务适配性': 5 }, serviceName: appName, orderNo: '#ORD-2026-0089', orgName: '重庆医科大学附属第一医院', userName: '张三', department: '信息科', content: '平台运行稳定，功能齐全，售后服务响应及时，整体体验很好。', time: '2026-03-15 14:32:00', reply: '感谢您的认可与支持，我们将持续优化平台功能！', replyTime: '2026-03-15 16:00:00' },
        { ratings: { '准确性': 4, '稳定性': 4, '响应时效': 5, '业务适配性': 4 }, serviceName: appName, orderNo: '#ORD-2026-0090', orgName: '重庆市人民医院', userName: '李四', department: '信息科', content: '组件集成方便，文档完善，基本满足需求，部分场景适配需优化。', time: '2026-03-12 09:15:00' },
        { ratings: { '准确性': 4, '稳定性': 4, '响应时效': 4, '业务适配性': 4 }, serviceName: appName, orderNo: '#ORD-2026-0092', orgName: '重庆大学附属肿瘤医院', userName: '王五', department: '信息中心', content: '使用体验良好，功能基本满足业务需求。', time: '2026-03-10 16:20:00' }
      ]
    }
  },
  created() {
    this.changeTableHeight();
    getContentTypes().then((response) => {
      this.contentTypeOptions = response.data;
      if (this.contentTypeOptions && this.contentTypeOptions.length > 0) {
        this.addContentType = this.contentTypeOptions[0].id;
      }
    });
    if (this.catalogId && this.catalogId > 0) {
      this.loadContentList();
    }
  },
  methods: {
    loadContentList() {
      this.loading = true;
      this.queryParams.catalogId = this.catalogId;
      getContentList({
        beginTime:
          this.dateRange && this.dateRange.length == 2
            ? this.dateRange[0]
            : null,
        endTime:
          this.dateRange && this.dateRange.length == 2
            ? this.dateRange[1]
            : null,
        ...this.queryParams,
      }).then((response) => {
        this.contentList = response.data.rows.map(item => {
          // 为每个应用添加随机的五分制评分
          return {
            ...item,
            platformRating: parseFloat((Math.random() * 4 + 1).toFixed(1)), // 1-5分，保留一位小数
            usageRating: parseFloat((Math.random() * 4 + 1).toFixed(1)) // 1-5分，保留一位小数
          };
        });
        this.total = parseInt(response.data.total);
        this.loading = false;
      });
    },
    contentTypeFormat(row, column) {
      var hitValue = [];
      this.contentTypeOptions.forEach((ct) => {
        if (ct.id == "" + row.contentType) {
          hitValue = ct.name;
          return;
        }
      });
      return hitValue;
    },
    handleSelectionChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
      this.single = selectedRows.length != 1;
      this.multiple = !selectedRows.length;
    },
    handleRowClick(currentRow) {
      // 不执行任何操作，避免影响按钮的点击事件
    },
    toggleAllCheckedRows() {
      this.selectedRowKeys = [];
      this.selectedRows = [];
    },
    onTableChange(pag) {
      this.queryParams.pageNum = pag.current;
      this.queryParams.pageSize = pag.pageSize;
      this.loadContentList();
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.loadContentList();
    },
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleAdd() {
      this.$router.push({ path: '/portal/service/securityServiceForm', query: { cid: this.catalogId } });
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
      this.$router.push({ path: '/portal/order/review', query: { serviceId: row.contentId } });
    },
    getStatusKey(status) {
      const map = {
        10: 'done',
        40: 'cancelled',
        20: 'warning'
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
        10: '已上线使用',
        40: '已下架',
        20: '待审核'
      };
      return map[status] || '未知';
    },
    formatArray(arr) {
      if (Array.isArray(arr)) return arr.join('、') || '--';
      return arr || '--';
    },
    formatCover(cover) {
      if (Array.isArray(cover)) return cover.map(item => item.value || item).join('、') || '--';
      return cover || '--';
    },
    formatTime(time) {
      if (!time) return '--';
      // 统一转为 yyyy-MM-dd HH:mm:ss
      const d = new Date(time);
      if (isNaN(d.getTime())) return time;
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    },
    handleTestDetail() {
      console.log('handleTestDetail called');
      this.handleDetail({});
    },
    handleEdit(row) {
      const editRow = row || (this.selectedRows && this.selectedRows[0]);
      if (!editRow) return;
      this.$router.push({ path: '/portal/service/securityServiceForm', query: { id: editRow.contentId, cid: this.catalogId } });
    },
    handleDelete(row) {
      const safeRow = row || {};
      const contentIds = safeRow.contentId
        ? [safeRow.contentId]
        : this.selectedRows.map((r) => r.contentId);
      if (contentIds.length === 0) {
        message.warning(this.$t("CMS.Content.SelectRowFirst"));
        return;
      }
      Modal.confirm({
        title: this.$t("Common.SystemTip"),
        content: "是否确认删除？",
        onOk: () => {
          return delContent(contentIds).then(() => {
            this.loadContentList();
            message.success(this.$t("Common.DeleteSuccess"));
          });
        },
        onCancel: () => {},
      });
    },
    handlePublish(row) {
      const safeRow = row || {};
      const contentIds = safeRow.contentId
        ? [safeRow.contentId]
        : this.selectedRows.map((r) => r.contentId);
      if (contentIds.length == 0) {
        message.warning(this.$t("CMS.Content.SelectRowFirst"));
        return;
      }
      const _this = this;
      Modal.confirm({
        title: this.$t("Common.SystemTip"),
        content: "发布后将在门户网站上显示，是否确认发布？",
        onOk: () => {
          _this.updateArticle(contentIds);
        },
      });
    },
    updateArticle(contentIds) {
      console.log(contentIds);
      const hide = message.loading("Loading...", 0);
      publishContent(contentIds)
        .then((response) => {
          hide();
          message.success(this.$t("CMS.ContentCore.PublishSuccess"));
          this.loadContentList();
          this.$cache.local.set("publish_flag", "true");
        })
        .catch(() => {
          hide();
        });
    },
    handlePreview(row) {
      let contentId = undefined;
      if (row) {
        contentId = row.contentId;
      } else if (this.selectedRows.length > 0) {
        contentId = this.selectedRows[0].contentId;
      } else {
        message.warning(this.$t("CMS.Content.SelectRowFirst"));
        return;
      }
      let routeData = this.$router.resolve({
        path: "/cms/preview",
        query: { type: "content", dataId: contentId },
      });
      window.open(routeData.href, "_blank");
    },
    handleDropdownBtn(command, row) {},
    changeTableHeight() {
      let height = document.body.offsetHeight; // 网页可视区域高度
      this.tableHeight = height - 330;
      this.tableMaxHeight = this.tableHeight;
    },
    handleCreateIndex(row) {
      createIndexes(row.contentId).then((response) => {
        message.success(this.$t("Common.OpSuccess"));
      });
    },
    handleCopy(row) {
      if (row.contentId) {
        this.selectedRows = [row];
      }
      this.isCopy = true;
      this.openCatalogSelector = true;
    },
    doCopy(catalogs, copyType) {
      const data = {
        contentIds: this.selectedRows.map((item) => item.contentId),
        catalogIds: catalogs.map((item) => item.id),
        copyType: copyType,
      };
      copyContent(data).then((response) => {
        message.success(this.$t("Common.OpSuccess"));
        this.openCatalogSelector = false;
        if (this.catalogId && data.catalogIds.indexOf(this.catalogId) > -1) {
          this.loadContentList();
        }
      });
    },
    handleMove(row) {
      if (row.contentId) {
        this.selectedRows = [row];
      }
      this.isCopy = false;
      this.openCatalogSelector = true;
    },
    doMove(catalogs) {
      const data = {
        contentIds: this.selectedRows.map((item) => item.contentId),
        catalogId: catalogs[0].id,
      };
      moveContent(data).then((response) => {
        message.success(this.$t("Common.OpSuccess"));
        this.openCatalogSelector = false;
        this.loadContentList();
      });
    },
    handleCatalogSelectorOk(catalogs, copyType) {
      if (this.isCopy) {
        this.doCopy(catalogs, copyType);
      } else {
        this.doMove(catalogs);
      }
    },
    handleCatalogSelectorClose() {
      this.openCatalogSelector = false;
    },
    handleSetTop(row) {
      if (row.contentId) {
        this.toggleAllCheckedRows();
        this.selectedRows.push(row);
      }
      this.topDialogVisible = true;
    },
    handleTopDialogOk() {
      const contentIds = this.selectedRows.map((item) => item.contentId);
      if (contentIds.length == 0) {
        message.warning(this.$t("CMS.Content.SelectRowFirst"));
        return;
      }
      this.$refs.top_form.validate().then(() => {
        setTopContent({
          contentIds: contentIds,
          topEndTime: this.topForm.topEndTime,
        }).then((response) => {
          message.success(this.$t("Common.OpSuccess"));
          this.topDialogVisible = false;
          this.topForm.topEndTime = undefined;
          this.loadContentList();
        });
      }).catch(() => {});
    },
    handleCancelTop(row) {
      const contentIds = row.contentId
        ? [row.contentId]
        : this.selectedRows.map((item) => item.contentId);
      cancelTopContent(contentIds).then((response) => {
        message.success(this.$t("Common.OpSuccess"));
        this.loadContentList();
      });
    },
    handleSort(row) {
      if (row.contentId) {
        this.toggleAllCheckedRows();
        this.selectedRows.push(row);
      }
      this.openContentSortDialog = true;
    },
    handleContentSortDialogOk(contents) {
      if (contents && contents.length > 0) {
        this.doSort(contents[0].contentId);
      }
    },
    handleContentSortDialogClose() {
      this.openContentSortDialog = false;
    },
    doSort(targetContentId) {
      const data = {
        contentId: this.selectedRows[0].contentId,
        targetContentId: targetContentId,
      };
      sortContent(data).then((response) => {
      });
    },
    openRatingDialog(row) {
      this.currentApp = row;
      this.ratingForm.score = row.platformRating || 0;
      this.ratingForm.description = '';
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
      // 提交平台评分
      message.success('评价成功');
      this.ratingDialogVisible = false;
      // 模拟更新评分
      this.currentApp.platformRating = this.ratingForm.score;
    },
    handleOffline(row) {
      const _this = this;
      const safeRow = row || {};
      const contentIds = safeRow.contentId
        ? [safeRow.contentId]
        : _this.selectedRows.map((item) => item.contentId);
      if (contentIds.length === 0) {
        message.warning(this.$t("CMS.Content.SelectRowFirst"));
        return;
      }
      Modal.confirm({
        title: this.$t("Common.SystemTip"),
        content: "下线后将在门户网站上隐藏，是否确认下线？",
        onOk: () => {
          offlineContent(contentIds).then((response) => {
            message.success(_this.$t("Common.OpSuccess"));
            _this.loadContentList();
          });
        },
      });
    },
    handleToPublish(row) {
      const _this = this;
      const safeRow = row || {};
      const contentIds = safeRow.contentId
        ? [safeRow.contentId]
        : _this.selectedRows.map((item) => item.contentId);
      if (contentIds.length === 0) {
        message.warning(this.$t("CMS.Content.SelectRowFirst"));
        return;
      }
      Modal.confirm({
        title: this.$t("Common.SystemTip"),
        content: "待发布后将在门户网站上隐藏，是否确认待发布？",
        onOk: () => {
          toPublishContent(contentIds).then((response) => {
            message.success(
              _this.$t("CMS.ContentCore.ToPublishSuccess")
            );
            _this.loadContentList();
          });
        },
      });
    },
  },
};
</script>
<style scoped>
.security-service-list-page {
  padding: 4px 0;
}

.security-service-list-page__divider {
  height: 1px;
  background: #F2F3F5;
  margin: 0 16px;
}

.security-service-list-page__table-wrap {
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

/* 列表状态列文字统一 0.65（色点不变） */
:deep(.ant-badge-status-text) {
  color: rgba(0, 0, 0, 0.65) !important;
}

/* 新增/编辑弹窗样式 */
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
.img {
  width: 60px;
  height: 60px;
  border-radius: 4px;
}
/* 评分样式 */
.rating-star {
  color: #165DFF;
  cursor: pointer;
  font-weight: 400;
}

.rating-star:hover {
  text-decoration: underline;
}

/* 星级评分 */
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

/* 表格单元格样式 */
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

.review-content {
  font-size: 12px;
  color: #5c6480;
  line-height: 1.5;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
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
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
}

.muted {
  color: #4E5969;
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
  margin-bottom: 10px;
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

.link-text {
  color: #165DFF;
  cursor: pointer;
}

.link-text:hover {
  color: #4096FF;
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

/* 弹窗内四维度评分 */
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

/* 审核记录时间字段：等宽数字 */
.cell-num {
  font-family: "SF Mono", "Cascadia Code", "Consolas", "Roboto Mono", monospace;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.2px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
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
