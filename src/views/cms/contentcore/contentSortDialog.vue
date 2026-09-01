<template>
  <a-modal :get-container="getDemoContainer"
    :title="$t('CMS.Content.SortDialogTitle')"
    :open="visible"
    width="800px"
    :mask-closable="false"
    class="content-sort-dialog"
    @cancel="handleClose"
  >
    <div class="content-sort-tip">
      <InfoCircleOutlined class="mr5" />{{ $t("CMS.Content.SortDialogTip") }}
    </div>
    <a-form
      ref="queryForm"
      :model="queryParams"
      layout="inline"
      class="mt10 mb10"
      style="text-align: left"
      @submit.prevent
    >
      <a-form-item name="title">
        <a-input-search
          v-model:value="queryParams.title"
          :placeholder="$t('CMS.Content.Placeholder.Title')"
          style="width: 260px"
          allow-clear
          @search="handleQuery"
        />
      </a-form-item>
      <a-form-item>
        <a-button @click="resetQuery">
          <template #icon><ReloadOutlined /></template>
          {{ $t("Common.Reset") }}
        </a-button>
      </a-form-item>
    </a-form>
    <a-table :scroll="{ x: 'max-content' }"
      :loading="loading"
      :columns="columns"
      :data-source="contentList"
      :pagination="false"
      size="small"
      row-key="contentId"
      :row-selection="{ type: 'radio', selectedRowKeys: selectedRowKeys, onChange: handleSelectionChange }"
      :custom-row="customRow"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'title'">
          <span v-if="record.topFlag > 0" class="top-icon" :title="$t('CMS.Content.SetTop')">
            <VerticalAlignTopOutlined />
          </span>
          {{ record.title }}
        </template>
        <span v-else-if="column.dataIndex === 'status'">{{ statusFormat(record.status) }}</span>
        <span v-else-if="column.dataIndex === 'publishDate'">{{ parseTime(record.publishDate) }}</span>
      </template>
    </a-table>
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="loadContentList"
    />
    <template #footer>
      <a-button type="primary" @click="handleOk">{{ $t("Common.Confirm") }}</a-button>
      <a-button class="ml8" @click="handleClose">{{ $t("Common.Cancel") }}</a-button>
    </template>
  </a-modal>
</template>
<script>
import {
  InfoCircleOutlined,
  ReloadOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons-vue";
import { getContentList } from "@/api/contentcore/content";

export default {
  name: "CMSContentSortDialog",
  dicts: ["CMSContentStatus"],
  components: {
    InfoCircleOutlined,
    ReloadOutlined,
    VerticalAlignTopOutlined,
  },
  props: {
    open: {
      type: Boolean,
      default: false,
      required: true,
    },
    cid: {
      type: String,
      default: undefined,
      required: false,
    },
  },
  watch: {
    open() {
      this.visible = this.open;
    },
    visible(newVal) {
      if (!newVal) {
        this.handleClose();
      } else {
        this.loadContentList();
      }
    },
    cid() {
      this.queryParams.catalogId = this.cid;
    },
  },
  data() {
    return {
      loading: false,
      visible: this.open,
      selectedContents: [],
      selectedRowKeys: [],
      contentList: [],
      total: 0,
      columns: [
        { title: this.$t("CMS.Content.Title"), dataIndex: "title", key: "title", ellipsis: true },
        { title: this.$t("CMS.Content.Status"), dataIndex: "status", key: "status", align: "center", width: 90 },
        { title: this.$t("CMS.Content.PublishDate"), dataIndex: "publishDate", key: "publishDate", align: "center", width: 160 },
      ],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        catalogId: this.cid,
        title: undefined,
      },
    };
  },
  methods: {
    getDemoContainer() {
      return document.querySelector('.app-main__content') || document.body;
    },
    getDrawerContainer() {
      return document.querySelector('.app-overlay') || document.body;
    },
    statusFormat(value) {
      const dict = (this.dict.type.CMSContentStatus || []).find((d) => d.value === String(value));
      return dict ? dict.label : value;
    },
    loadContentList() {
      if (!this.visible) {
        return;
      }
      this.loading = true;
      getContentList(this.queryParams)
        .then((response) => {
          this.contentList = response.data.rows;
          this.total = parseInt(response.data.total);
          this.selectedContents = [];
          this.selectedRowKeys = [];
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleSelectionChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedContents = selectedRows;
    },
    customRow(record) {
      return {
        onClick: () => {
          this.handleSelectionChange([record.contentId], [record]);
        },
      };
    },
    handleOk() {
      this.$emit("ok", this.selectedContents);
    },
    handleClose() {
      this.$emit("close");
      if (this.$refs.queryForm) {
        this.$refs.queryForm.resetFields();
      }
      this.selectedContents = [];
      this.selectedRowKeys = [];
      this.contentList = [];
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.loadContentList();
    },
    resetQuery() {
      if (this.$refs.queryForm) {
        this.$refs.queryForm.resetFields();
      }
      this.handleQuery();
    },
  },
};
</script>
<style scoped>
.content-sort-tip {
  background-color: #f4f4f5;
  color: #909399;
  font-size: 12px;
  line-height: 30px;
  padding-left: 10px;
}
.top-icon {
  font-weight: bold;
  font-size: 12px;
  color: green;
}
.ml8 {
  margin-left: 8px;
}
</style>
