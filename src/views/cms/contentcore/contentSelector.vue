<template>
  <a-modal :get-container="getDemoContainer"
    :title="$t('CMS.ContentCore.SelectContent')"
    :open="visible"
    width="1100px"
    :mask-closable="false"
    @cancel="handleClose"
  >
    <div class="content-selector-body">
      <div class="content-selector-aside">
        <cms-catalog-tree ref="catalogTree" @node-click="handleTreeNodeClick"></cms-catalog-tree>
      </div>
      <div class="content-selector-main">
        <a-form
          ref="queryForm"
          :model="queryParams"
          layout="inline"
          class="mb12"
          @submit.prevent
        >
          <a-form-item name="title">
            <a-input
              v-model:value="queryParams.title"
              :placeholder="$t('CMS.Content.Placeholder.Title')"
              allow-clear
              @press-enter="handleQuery"
            />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleQuery">
              <template #icon><SearchOutlined /></template>
              {{ $t("Common.Search") }}
            </a-button>
          </a-form-item>
          <a-form-item>
            <a-button @click="resetQuery">
              <template #icon><ReloadOutlined /></template>
              {{ $t("Common.Reset") }}
            </a-button>
          </a-form-item>
        </a-form>
        <a-table
          :loading="loading"
          :columns="columns"
          :data-source="contentList"
          size="small"
          row-key="contentId"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: handleSelectionChange }"
          :custom-row="customRow"
          :pagination="false"
          :scroll="{ x: 'max-content', y: 360 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'title'">
              <span v-if="record.topFlag > 0" class="top-icon" :title="$t('CMS.Content.SetTop')">
                <VerticalAlignTopOutlined />
              </span>
              {{ record.title }}
            </template>
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
      </div>
    </div>
    <template #footer>
      <a-button type="primary" @click="handleOk">{{ $t("Common.Confirm") }}</a-button>
      <a-button class="ml8" @click="handleClose">{{ $t("Common.Cancel") }}</a-button>
    </template>
  </a-modal>
</template>
<script>
import { SearchOutlined, ReloadOutlined, VerticalAlignTopOutlined } from "@ant-design/icons-vue";
import { getContentList } from "@/api/contentcore/content";
import CMSCatalogTree from "@/views/cms/contentcore/catalogTree";

export default {
  name: "CMSContentSelector",
  components: {
    "cms-catalog-tree": CMSCatalogTree,
    SearchOutlined,
    ReloadOutlined,
    VerticalAlignTopOutlined,
  },
  props: {
    open: {
      type: Boolean,
      default: false,
      required: true,
    },
    contentType: {
      type: String,
      default: "",
      required: false,
    },
  },
  watch: {
    contentType(newVal) {
      this.queryParams.contentType = newVal;
    },
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
        { title: this.$t("CMS.Content.PublishDate"), dataIndex: "publishDate", key: "publishDate", align: "center", width: 160 },
      ],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        status: 30,
        catalogId: "",
        contentType: "",
        title: "",
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
    handleTreeNodeClick(data) {
      this.queryParams.catalogId = data && data != null ? data.id : "";
      this.loadContentList();
    },
    loadContentList() {
      if (!this.visible) {
        return;
      }
      this.loading = true;
      getContentList(this.queryParams)
        .then((response) => {
          if (response.code == 200) {
            this.contentList = response.data.rows;
            this.total = parseInt(response.data.total);
          }
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
          const key = record.contentId;
          const selected = this.selectedRowKeys.includes(key);
          const keys = selected
            ? this.selectedRowKeys.filter((k) => k !== key)
            : [...this.selectedRowKeys, key];
          const rows = this.contentList.filter((r) => keys.includes(r.contentId));
          this.handleSelectionChange(keys, rows);
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
      this.queryParams.contentType = "";
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
.content-selector-body {
  display: flex;
  gap: 12px;
}
.content-selector-aside {
  width: 260px;
  flex-shrink: 0;
  background-color: #fff;
  overflow: auto;
}
.content-selector-main {
  flex: 1;
  min-width: 0;
}
.top-icon {
  font-weight: bold;
  font-size: 12px;
  color: green;
}
.mb12 {
  margin-bottom: 12px;
}
.ml8 {
  margin-left: 8px;
}
</style>
