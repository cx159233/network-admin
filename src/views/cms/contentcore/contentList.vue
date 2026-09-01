<template>
  <div class="p-[20px]">
    <PageHeader
      :title="$t('CMS.Content.Tab.ContentList')"
      description="管理平台内容，支持新增、编辑、发布、下线、复制和移动内容"
    />

    <CloudCard class="content-list-page__table-card">
      <FilterBar @search="handleQuery" @reset="resetQuery" :showActions="false">
        <template #actions>
          <a-button type="primary" @click="handleAdd">
            <template #icon><PlusOutlined /></template>
            {{ $t("Common.Add") }}
          </a-button>
          <a-button
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
            @click="handleToPublish"
          >
            <template #icon><ClockCircleOutlined /></template>
            {{ $t("CMS.ContentCore.ToPublish") }}
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
            :disabled="multiple"
            v-hasPermi="[$p('Catalog:EditContent:{0}', [catalogId])]"
            @click="handleOffline"
          >
            <template #icon><DownloadOutlined /></template>
            {{ $t("CMS.Content.Offline") }}
          </a-button>
          <a-button
            type="primary"
            :disabled="multiple"
            @click="handleCopy"
          >
            <template #icon><CopyOutlined /></template>
            {{ $t("Common.Copy") }}
          </a-button>
          <a-button
            type="primary"
            :disabled="multiple"
            @click="handleMove"
          >
            <template #icon><ArrowRightOutlined /></template>
            {{ $t("Common.Move") }}
          </a-button>
        </template>
        <a-input
          v-model:value="queryParams.title"
          :placeholder="$t('CMS.Content.Placeholder.Title')"
          allow-clear
          style="width: 200px"
          @pressEnter="handleQuery"
        />
        <a-select
          v-model:value="queryParams.contentType"
          :placeholder="$t('CMS.Content.ContentType')"
          allow-clear
          style="width: 125px"
        >
          <a-select-option
            v-for="ct in contentTypeOptions"
            :key="ct.id"
            :value="ct.id"
          >{{ ct.name }}</a-select-option>
        </a-select>
        <a-select
          v-model:value="queryParams.status"
          :placeholder="$t('CMS.Content.Status')"
          allow-clear
          style="width: 110px"
        >
          <a-select-option
            v-for="dict in dict.type.CMSContentStatus"
            :key="dict.value"
            :value="dict.raw.dictValue"
          >{{ dict.label }}</a-select-option>
        </a-select>
        <a-select
          v-model:value="queryParams.sorts"
          @change="loadContentList"
          style="width: 140px"
        >
          <a-select-option value="">{{ $t("CMS.Content.SortOption.Default") }}</a-select-option>
          <a-select-option value="createTime#ASC">{{ $t("CMS.Content.SortOption.CreateTimeAsc") }}</a-select-option>
          <a-select-option value="createTime#DESC">{{ $t("CMS.Content.SortOption.CreateTimeDesc") }}</a-select-option>
          <a-select-option value="publishDate#ASC">{{ $t("CMS.Content.SortOption.PublishDateAsc") }}</a-select-option>
          <a-select-option value="publishDate#DESC">{{ $t("CMS.Content.SortOption.PublishDateDesc") }}</a-select-option>
        </a-select>
        <template #extra>
          <a-button @click="showSearch = !showSearch">
            <template #icon><PlusOutlined /></template>
            {{ $t("Common.More") }}
          </a-button>
        </template>
      </FilterBar>
      <div v-show="showSearch" class="px-[16px] pb-[12px] flex items-center gap-[8px]">
        <span class="text-[12px] text-text-tertiary">{{ $t('Common.CreateTime') }}</span>
        <a-range-picker
          v-model:value="dateRange"
          style="width: 386px"
          value-format="YYYY-MM-DD HH:mm:ss"
          show-time
          :placeholder="[$t('Common.BeginDate'), $t('Common.EndDate')]"
        />
      </div>
      <div class="content-list-page__divider"></div>
      <div class="content-list-page__table-wrap">
        <a-spin :spinning="loading">
          <a-table
            ref="tableContentList"
            size="small"
            :columns="columns"
            :data-source="contentList"
            :scroll="{ x: 'max-content', y: tableHeight }"
            row-key="contentId"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: handleSelectionChange }"
            :pagination="false"
            :customRow="customRow"
          >
            <template #bodyCell="{ column, record }">
              <span v-if="column.dataIndex === 'title'" class="cell-primary">
                <span class="content_attr" v-if="record.topFlag > 0" :title="$t('CMS.Content.SetTop')">[<svg-icon icon-class="top" />]</span>
                <span v-for="dict in dict.type.CMSContentAttribute" :key="dict.value" :title="dict.label">
                  <span class="content_attr" v-if="record.attributes.indexOf(dict.value) > -1">[<svg-icon :icon-class="dict.value" />]</span>
                </span>
                {{ record.title }}
              </span>
              <span v-else-if="column.dataIndex === 'contentType'" class="cell-default">{{ contentTypeFormat(record) }}</span>
              <dict-tag v-else-if="column.dataIndex === 'status'" :options="statusColumn" :value="record.status" />
              <span v-else-if="column.dataIndex === 'createTime'" class="cell-default">{{ parseTime(record.createTime) }}</span>
              <template v-else-if="column.dataIndex === 'action'">
                <a-space size="small">
                <a-button type="link" size="small" class="!p-0" v-hasPermi="[$p('Catalog:EditContent:{0}', [record.catalogId])]" @click="handlePublish(record)">{{ $t("CMS.ContentCore.Publish") }}</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-button type="link" size="small" class="!p-0" v-hasPermi="[$p('Catalog:EditContent:{0}', [record.catalogId])]" @click="handleToPublish(record)">{{ $t("CMS.ContentCore.ToPublish") }}</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-dropdown :trigger="['click']">
                  <span class="row-more-btn"><MoreOutlined /></span>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item key="edit" v-hasPermi="[$p('Catalog:EditContent:{0}', [record.catalogId])]" @click="handleEdit(record)"><EditOutlined /> {{ $t("Common.Edit") }}</a-menu-item>
                      <a-menu-item key="delete" v-hasPermi="[$p('Catalog:DeleteContent:{0}', [record.catalogId])]" @click="handleDelete(record)"><DeleteOutlined /> {{ $t("Common.Delete") }}</a-menu-item>
                      <a-menu-item v-show="record.topFlag <= 0" key="setTop" v-hasPermi="[$p('Catalog:EditContent:{0}', [record.catalogId])]" @click="handleSetTop(record)"><VerticalAlignTopOutlined /> {{ $t("CMS.Content.SetTop") }}</a-menu-item>
                      <a-menu-item v-show="record.topFlag > 0" key="cancelTop" v-hasPermi="[$p('Catalog:EditContent:{0}', [record.catalogId])]" @click="handleCancelTop(record)"><VerticalAlignBottomOutlined /> {{ $t("CMS.Content.CancelTop") }}</a-menu-item>
                      <a-menu-item key="copy" @click="handleCopy(record)"><CopyOutlined /> {{ $t("Common.Copy") }}</a-menu-item>
                      <a-menu-item key="move" @click="handleMove(record)"><ArrowRightOutlined /> {{ $t("Common.Move") }}</a-menu-item>
                      <a-menu-item key="offline" v-hasPermi="[$p('Catalog:EditContent:{0}', [record.catalogId])]" @click="handleOffline(record)"><DownloadOutlined /> {{ $t("CMS.Content.Offline") }}</a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </a-space>
              </template>
              <span v-else class="cell-default">{{ record[column.dataIndex] || '--' }}</span>
            </template>
          </a-table>
        </a-spin>
        <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="loadContentList"
        />
      </div>
    </CloudCard>

    <!-- 置顶时间设置弹窗 -->
    <a-modal :get-container="getDemoContainer"
      :title="$t('CMS.Content.SetTop')"
      width="400px"
      v-model:open="topDialogVisible"
      :mask-closable="false"
      :footer="null"
    >
      <a-form ref="top_form" :label-col="{ style: { width: '100px' } }" :model="topForm">
        <a-form-item :label="$t('CMS.Content.TopEndTime')" name="topEndTime">
          <a-date-picker
            v-model:value="topForm.topEndTime"
            :disabled-date="disabledTopEndTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            show-time
          />
        </a-form-item>
      </a-form>
      <div class="dialog-footer">
        <a-button type="primary" @click="handleTopDialogOk">{{
          $t("Common.Confirm")
        }}</a-button>
        <a-button @click="topDialogVisible = false">{{
          $t("Common.Cancel")
        }}</a-button>
      </div>
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
    <!-- 内容排序组件 -->
    <cms-content-sort
      :open="openContentSortDialog"
      :cid="catalogId"
      @ok="handleContentSortDialogOk"
      @close="handleContentSortDialogClose"
    ></cms-content-sort>
  </div>
</template>
<script>
import {
  PlusOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  SendOutlined,
  DownloadOutlined,
  CopyOutlined,
  ArrowRightOutlined,
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  MoreOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
} from "@ant-design/icons-vue";
import { message, Modal } from "ant-design-vue";
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
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import FilterBar from '@/components/cloud/FilterBar.vue'
import CMSCatalogSelector from "@/views/cms/contentcore/catalogSelector";
import CMSContentSort from "@/views/cms/contentcore/contentSortDialog";
import CMSProgress from "@/views/components/Progress";

export default {
  name: "CMSContentList",
  components: {
    PageHeader,
    CloudCard,
    FilterBar,
    PlusOutlined,
    DeleteOutlined,
    ClockCircleOutlined,
    SendOutlined,
    DownloadOutlined,
    CopyOutlined,
    ArrowRightOutlined,
    SearchOutlined,
    ReloadOutlined,
    EditOutlined,
    MoreOutlined,
    VerticalAlignTopOutlined,
    VerticalAlignBottomOutlined,
    "cms-catalog-selector": CMSCatalogSelector,
    "cms-content-sort": CMSContentSort,
    "cms-progress": CMSProgress,
  },
  dicts: ["CMSContentStatus", "CMSContentAttribute"],
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
      addPopoverVisible: false,
      showSearch: false,
      contentTypeOptions: [],
      catalogId: this.cid,
      contentList: null,
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
        contentType: undefined,
        status: undefined,
        catalogId: undefined,
        sorts: "",
      },
      columns: [
        { title: this.$t('CMS.Content.Title'), dataIndex: 'title', key: 'title', ellipsis: true },
        { title: this.$t('CMS.Content.ContentType'), dataIndex: 'contentType', key: 'contentType', width: 110 },
        { title: this.$t('CMS.Content.Status'), dataIndex: 'status', key: 'status', width: 110 },
        { title: this.$t('Common.CreateTime'), dataIndex: 'createTime', key: 'createTime', width: 160 },
        { title: this.$t('Common.Operation'), dataIndex: 'action', key: 'action', width: 260, fixed: 'right' },
      ],
      topDialogVisible: false,
      topForm: {
        topEndTime: undefined,
      },
      openProgress: false,
      taskId: "",
      addContentType: "",
      openCatalogSelector: false, // 栏目选择弹窗
      isCopy: false,
      openContentSortDialog: false, // 内容选择弹窗
      openEditorW: true,
      statusColumn: [],
    };
  },
  watch: {
    cid(newVal) {
      this.catalogId = newVal;
    },
    catalogId(newVal) {
      this.loadContentList();
    },
    "dict.type.CMSContentStatus": {
      handler(val) {
        let arr = [];
        val.forEach((i) => {
          arr.push({
            label: i.label,
            value: i.raw.dictValue,
            raw: {
              listClass:
                i.raw.dictValue === "30"
                  ? "success"
                  : i.raw.dictValue === "40"
                  ? "danger"
                  : "default",
            },
          });
        });
        this.statusColumn = arr;
      },
      deep: true,
    },
  },
  created() {
    this.changeTableHeight();
    getContentTypes().then((response) => {
      this.contentTypeOptions = response.data;
      this.addContentType = this.contentTypeOptions[0].id;
    });
    if (this.catalogId && this.catalogId > 0) {
      this.loadContentList();
    }
  },
  methods: {
    getDemoContainer() {
      return document.querySelector('.app-main__content') || document.body;
    },
    getDrawerContainer() {
      return document.querySelector('.app-overlay') || document.body;
    },
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
        this.contentList = response.data.rows;
        this.total = parseInt(response.data.total);
        this.loading = false;
      });
    },
    contentTypeFormat(row) {
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
    customRow(record) {
      return {
        onClick: () => {
          this.handleRowClick(record);
        },
        onDblclick: () => {
          this.handleEdit(record);
        },
      };
    },
    handleRowClick(record) {
      this.selectedRowKeys = [record.contentId];
      this.selectedRows = [record];
      this.single = false;
      this.multiple = false;
    },
    toggleAllCheckedRows() {
      this.selectedRowKeys = [];
      this.selectedRows = [];
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
      if (!this.catalogId) {
        message.error(this.$t("CMS.Content.SelectCatalogFirst"));
        return;
      }
      this.addPopoverVisible = false;
      this.openEditor(this.catalogId, 0, this.addContentType);
    },
    handleEdit(row) {
      this.openEditor(row.catalogId, row.contentId, row.contentType);
    },
    openEditor(catalogId, contentId, contentType) {
      if (this.openEditorW) {
        let routeData = this.$router.resolve({
          path: "/cms/content/editorW",
          query: { type: contentType, catalogId: catalogId, id: contentId },
        });
        let winEditor = window.open(routeData.href, "_blank");
        let that = this;
        winEditor.onbeforeunload = function () {
          that.loadContentList();
        };
      } else {
        this.$router.push({
          path: "/cms/content/editor",
          query: {
            type: contentType,
            catalogId: catalogId,
            id: contentId,
            w: this.openEditorW,
          },
        });
      }
    },
    handleDelete(row) {
      const contentIds = row.contentId
        ? [row.contentId]
        : this.selectedRows.map((row) => row.contentId);
      Modal.confirm({
        getContainer: this.getDemoContainer,
        content: "删除后门户网站不可见，是否确认删除？",
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
      const contentIds = row.contentId
        ? [row.contentId]
        : this.selectedRows.map((row) => row.contentId);
      if (contentIds.length == 0) {
        message.warning(this.$t("CMS.Content.SelectRowFirst"));
        return;
      }
      Modal.confirm({
        getContainer: this.getDemoContainer,
        content: "发布后将在门户网站上显示，是否确认发布？",
        onOk: () => {
          this.updateArticle(contentIds);
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
    disabledTopEndTime(current) {
      if (!current) return false;
      return current.valueOf() < Date.now() - 8.64e7;
    },
    handleCreateIndex(row) {
      createIndexes(row.contentId).then((response) => {
        message.success(this.$t("Common.OpSuccess"));
      });
    },
    handleCopy(row) {
      if (row.contentId) {
        this.selectedRows = [row];
        this.selectedRowKeys = [row.contentId];
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
        this.selectedRowKeys = [row.contentId];
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
        this.selectedRowKeys = [row.contentId];
      }
      this.topDialogVisible = true;
    },
    handleTopDialogOk() {
      const contentIds = this.selectedRows.map((item) => item.contentId);
      if (contentIds.length == 0) {
        message.warning(this.$t("CMS.Content.SelectRowFirst"));
        return;
      }
      this.$refs["top_form"].validate().then(() => {
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
        this.selectedRowKeys = [row.contentId];
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
        message.success(this.$t("Common.OpSuccess"));
        this.openContentSortDialog = false;
        this.loadContentList();
      });
    },
    handleOffline(row) {
      Modal.confirm({
        getContainer: this.getDemoContainer,
        content: "下线后将在门户网站上隐藏，是否确认下线？",
        onOk: () => {
          const contentIds = row.contentId
            ? [row.contentId]
            : this.selectedRows.map((item) => item.contentId);
          offlineContent(contentIds).then((response) => {
            message.success(this.$t("Common.OpSuccess"));
            this.loadContentList();
          });
        },
      });
    },
    handleToPublish(row) {
      Modal.confirm({
        getContainer: this.getDemoContainer,
        content: "待发布后将在门户网站上隐藏，是否确认待发布？",
        onOk: () => {
          const contentIds = row.contentId
            ? [row.contentId]
            : this.selectedRows.map((item) => item.contentId);
          toPublishContent(contentIds).then((response) => {
            message.success(
              this.$t("CMS.ContentCore.ToPublishSuccess")
            );
            this.loadContentList();
          });
        },
      });
    },
    handleArchive(row) {
      const contentIds = row.contentId
        ? [row.contentId]
        : this.selectedRows.map((item) => item.contentId);
      archiveContent(contentIds).then((response) => {
        message.success(this.$t("Common.OpSuccess"));
        this.loadContentList();
      });
    },
    handleRecommend(row) {
      const contentIds = row.contentId
        ? [row.contentId]
        : this.selectedRows.map((item) => item.contentId);
      addContentAttribute({ contentIds: contentIds, attr: "recommend" }).then(
        (response) => {
          message.success(this.$t("Common.OpSuccess"));
          this.loadContentList();
        }
      );
    },
    handleCancelRecommend(row) {
      const contentIds = row.contentId
        ? [row.contentId]
        : this.selectedRows.map((item) => item.contentId);
      removeContentAttribute({
        contentIds: contentIds,
        attr: "recommend",
      }).then((response) => {
        message.success(this.$t("Common.OpSuccess"));
        this.loadContentList();
      });
    },
    handleHot(row) {
      const contentIds = row.contentId
        ? [row.contentId]
        : this.selectedRows.map((item) => item.contentId);
      addContentAttribute({ contentIds: contentIds, attr: "hot" }).then(
        (response) => {
          message.success(this.$t("Common.OpSuccess"));
          this.loadContentList();
        }
      );
    },
    handleCancelHot(row) {
      const contentIds = row.contentId
        ? [row.contentId]
        : this.selectedRows.map((item) => item.contentId);
      removeContentAttribute({ contentIds: contentIds, attr: "hot" }).then(
        (response) => {
          message.success(this.$t("Common.OpSuccess"));
          this.loadContentList();
        }
      );
    },
  },
};
</script>
<style scoped>
.content-list-page {
  padding: 4px 0;
}

.content-list-page__divider {
  height: 1px;
  background: #F2F3F5;
  margin: 0 16px;
}

.content-list-page__table-wrap {
  padding: 0 16px 16px 16px;
}

.row-more-btn {
  padding-left: 10px;
  cursor: pointer;
}

.content_attr {
  margin-left: 2px;
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

.dialog-footer {
  text-align: right;
  padding-top: 12px;
}
</style>
