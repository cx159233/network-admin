<template>
  <div class="app-container-content-sort">
    <a-modal :get-container="getDemoContainer"
      :title="$t('CMS.Content.RelaContent')"
      :open="visible"
      width="800px"
      :mask-closable="false"
      @cancel="handleCancel"
    >
      <div class="mb12" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
        <a-space>
          <a-button
            type="primary"
            ghost
            size="small"
            v-hasPermi="[ $p('Catalog:EditContent:{0}', [ cid ]) ]"
            @click="handleAdd"
          >
            <template #icon><PlusOutlined /></template>
            {{ $t("Common.Add") }}
          </a-button>
          <a-button
            danger
            size="small"
            :disabled="multiple"
            v-hasPermi="[ $p('Catalog:EditContent:{0}', [ cid ]) ]"
            @click="handleDelete"
          >
            <template #icon><DeleteOutlined /></template>
            {{ $t("Common.Delete") }}
          </a-button>
        </a-space>
        <a-form
          ref="queryForm"
          :model="queryParams"
          layout="inline"
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
      </div>

      <a-table :scroll="{ x: 'max-content' }"
        :loading="loading"
        :columns="columns"
        :data-source="relaContentList"
        size="small"
        row-key="contentId"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: handleSelectionChange }"
        :pagination="false"
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
        @pagination="loadRelaContentList"
      />
      <template #footer>
        <a-button @click="handleCancel">{{ $t("Common.Cancel") }}</a-button>
      </template>
    </a-modal>
    <!-- 内容选择组件 -->
    <cms-content-selector
      :open="openContentSelector"
      @ok="handleContentSelectorOk"
      @close="handleContentSelectorClose"></cms-content-selector>
  </div>
</template>
<script>
import { PlusOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined, VerticalAlignTopOutlined } from "@ant-design/icons-vue";
import { getRelaContentList, addRelaContents, delRelaContents } from "@/api/contentcore/rela";

import CMSContentSelector from "@/views/cms/contentcore/contentSelector";

export default {
  name: "CMSContentRelaDialog",
  dicts: ['CMSContentStatus'],
  components: {
    'cms-content-selector': CMSContentSelector,
    PlusOutlined,
    DeleteOutlined,
    SearchOutlined,
    ReloadOutlined,
    VerticalAlignTopOutlined,
  },
  props: {
    open: {
      type: Boolean,
      default: false,
      required: true
    },
    cid: {
      type: String,
      default: undefined,
      required: false
    }
  },
  emits: ['close'],
  watch: {
    open () {
      this.visible = this.open;
    },
    visible (newVal) {
      if (!newVal) {
        this.handleClose();
      } else {
        this.loadRelaContentList();
      }
    },
    cid () {
      this.queryParams.catalogId = this.cid;
    }
  },
  data () {
    return {
      loading: false,
      visible: this.open,
      selectedContents: [],
      selectedRowKeys: [],
      relaContentList: [],
      multiple: true,
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        contentId: this.cid,
        title: undefined
      },
      openContentSelector: false,
      columns: [
        { title: this.$t("Common.RowNo"), dataIndex: "rowNo", key: "rowNo", align: "center", width: 50, customRender: ({ index }) => index + 1 },
        { title: this.$t("CMS.Content.Title"), dataIndex: "title", key: "title", align: "left", ellipsis: true },
        { title: this.$t("CMS.Content.Status"), dataIndex: "status", key: "status", align: "center", width: 100 },
        { title: this.$t("CMS.Content.PublishDate"), dataIndex: "publishDate", key: "publishDate", align: "center", width: 160 },
      ],
    };
  },
  methods: {
    getDemoContainer() {
      return document.querySelector('.app-main__content') || document.body;
    },
    getDrawerContainer() {
      return document.querySelector('.app-overlay') || document.body;
    },
    loadRelaContentList () {
      if (!this.visible) {
        return;
      }
      this.loading = true;
      getRelaContentList(this.queryParams).then(response => {
        this.relaContentList = response.data.rows;
        this.total = parseInt(response.data.total);
        this.selectedContents = [];
        this.selectedRowKeys = [];
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    handleSelectionChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedContents = selectedRows;
      this.multiple = !selectedRows.length;
    },
    statusFormat (value) {
      const dict = (this.dict.type.CMSContentStatus || []).find(d => d.value === String(value));
      return dict ? dict.label : value;
    },
    handleAdd () {
      this.openContentSelector = true;
    },
    handleContentSelectorOk(contents) {
      if (contents && contents.length > 0) {
        const data = { contentId: this.cid, relaContentIds: contents.map(c => c.contentId) }
        addRelaContents(data).then(response => {
            this.openContentSelector = false;
            this.$modal.msgSuccess(this.$t('Common.AddSuccess'));
            this.handleQuery();
        });
      } else {
        this.$modal.msgWarning(this.$t('Common.SelectFirst'));
      }
    },
    handleContentSelectorClose() {
      this.openContentSelector = false;
    },
    handleDelete () {
      if (this.selectedContents.length == 0) {
        this.$modal.msgWarning(this.$t('Common.SelectFirst'));
        return;
      }
      const data = { contentId: this.cid, relaContentIds: this.selectedContents.map(c => c.contentId) }
      delRelaContents(data).then(response => {
            this.$modal.msgSuccess(this.$t('Common.DeleteSuccess'));
            this.handleQuery();
        });
    },
    handleCancel () {
      this.visible = false;
    },
    handleClose () {
      this.$emit("close");
      this.resetForm("queryForm");
      this.selectedContents = [];
      this.selectedRowKeys = [];
      this.relaContentList = [];
    },
    handleQuery () {
      this.loadRelaContentList();
    },
    resetQuery () {
      this.resetForm("queryForm");
      this.handleQuery();
    }
  }
};
</script>
<style scoped>
.mb12 {
  margin-bottom: 12px;
}
.top-icon {
  color: #faad14;
  margin-right: 2px;
}
</style>
