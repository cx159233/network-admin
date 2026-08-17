<template>
  <div class="cms-content-list">
    <div class="mb12" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
      <a-space>
        <a-button
          type="primary"
          ghost
          :disabled="multiple"
          @click="handleRecover"
        >
          <template #icon><RollbackOutlined /></template>
          {{ $t("CMS.Content.Restore") }}
        </a-button>
        <a-button danger :disabled="multiple" @click="handleDeleteSelected">
          <template #icon><DeleteOutlined /></template>
          {{ $t("Common.Delete") }}
        </a-button>
      </a-space>
      <a-form ref="queryForm" :model="queryParams" layout="inline" @submit.prevent>
        <a-form-item name="title">
          <a-input
            v-model:value="queryParams.title"
            :placeholder="$t('CMS.Content.Placeholder.Title')"
            allow-clear
            style="width: 200px"
            @press-enter="handleQuery"
          />
        </a-form-item>
        <a-form-item name="contentType">
          <a-select
            v-model:value="queryParams.contentType"
            :placeholder="$t('CMS.Content.ContentType')"
            allow-clear
            style="width: 125px"
          >
            <a-select-option v-for="ct in contentTypeOptions" :key="ct.id" :value="ct.id">
              {{ ct.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="status">
          <a-select
            v-model:value="queryParams.status"
            :placeholder="$t('CMS.Content.Status')"
            allow-clear
            style="width: 110px"
          >
            <a-select-option v-for="dict in dict.type.CMSContentStatus" :key="dict.value" :value="dict.value">
              {{ dict.label }}
            </a-select-option>
          </a-select>
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

    <a-table
      :loading="loading"
      :columns="columns"
      :data-source="contentRecycleList"
      :scroll="{ y: tableHeight }"
      size="small"
      row-key="contentId"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: handleSelectionChange }"
      :pagination="false"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'contentType'">{{ contentTypeFormat(record) }}</template>
        <template v-else-if="column.dataIndex === 'status'">
          <a-tag :color="statusTagColor(record.status)">{{ statusFormat(record, "status") }}</a-tag>
        </template>
        <span v-else-if="column.dataIndex === 'updateTime'">{{ parseTime(record.updateTime) }}</span>
        <template v-else-if="column.dataIndex === 'action'">
          <a-button type="link" size="small" class="!p-0" danger @click="handleDelete(record)">
            {{ $t("Common.Delete") }}
          </a-button>
        </template>
      </template>
    </a-table>
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="loadRecyclecontentRecycleList"
    />
  </div>
</template>
<script>
import { RollbackOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from "@ant-design/icons-vue";
import { getContentTypes } from "@/api/contentcore/catalog";
import { getRecycleContentList, recoverRecycleContent, deleteRecycleContents } from "@/api/contentcore/recycle";

export default {
  name: "CMScontentRecycleList",
  dicts: ["CMSContentStatus"],
  components: {
    RollbackOutlined,
    DeleteOutlined,
    SearchOutlined,
    ReloadOutlined,
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
      loading: false,
      contentTypeOptions: [],
      catalogId: this.cid,
      contentRecycleList: null,
      total: 0,
      tableHeight: 600,
      selectedRows: [],
      selectedRowKeys: [],
      multiple: true,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        contentType: undefined,
        status: undefined,
        catalogId: undefined,
      },
      columns: [
        { title: this.$t("CMS.Content.Title"), dataIndex: "title", key: "title", ellipsis: true },
        { title: this.$t("CMS.Content.ContentType"), dataIndex: "contentType", key: "contentType", align: "center", width: 110 },
        { title: this.$t("CMS.Content.StatusBefore"), dataIndex: "status", key: "status", align: "center", width: 110 },
        { title: this.$t("CMS.Content.DeleteTime"), dataIndex: "updateTime", key: "updateTime", align: "center", width: 160 },
        { title: this.$t("CMS.Content.DeleteUser"), dataIndex: "updateBy", key: "updateBy", align: "center", width: 140, ellipsis: true },
        { title: this.$t("Common.Operation"), dataIndex: "action", key: "action", align: "center", width: 100 },
      ],
    };
  },
  watch: {
    cid(newVal) {
      this.catalogId = newVal;
    },
    catalogId() {
      this.loadRecyclecontentRecycleList();
    },
  },
  created() {
    this.changeTableHeight();
    getContentTypes().then((response) => {
      this.contentTypeOptions = response.data;
    });
    if (this.catalogId && this.catalogId > 0) {
      this.loadRecyclecontentRecycleList();
    }
  },
  methods: {
    loadRecyclecontentRecycleList() {
      this.loading = true;
      this.queryParams.catalogId = this.catalogId;
      getRecycleContentList(this.queryParams)
        .then((response) => {
          this.contentRecycleList = response.data.rows;
          this.total = parseInt(response.data.total);
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    statusFormat(row, column) {
      return this.selectDictLabel(this.dict.type.CMSContentStatus, row[column]);
    },
    contentTypeFormat(row) {
      let hitValue = [];
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
      this.multiple = !selectedRows.length;
    },
    statusTagColor(status) {
      if (status == 40) {
        return "warning";
      } else if (status == 20 || status == 30) {
        return "success";
      } else if (status == 0) {
        return "default";
      }
      return "processing";
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.loadRecyclecontentRecycleList();
    },
    resetQuery() {
      this.$refs.queryForm.resetFields();
      this.handleQuery();
    },
    handleDelete(row) {
      const backupIds = row.backupId ? [row.backupId] : this.selectedRows.map((r) => r.backupId);
      this.$modal
        .confirm(this.$t("Common.ConfirmDelete"))
        .then(function () {
          return deleteRecycleContents(backupIds);
        })
        .then(() => {
          this.loadRecyclecontentRecycleList();
          this.$modal.msgSuccess(this.$t("Common.DeleteSuccess"));
        })
        .catch(function () {});
    },
    handleDeleteSelected() {
      if (!this.selectedRows.length) {
        return;
      }
      const backupIds = this.selectedRows.map((r) => r.backupId);
      this.$modal
        .confirm(this.$t("Common.ConfirmDelete"))
        .then(function () {
          return deleteRecycleContents(backupIds);
        })
        .then(() => {
          this.loadRecyclecontentRecycleList();
          this.$modal.msgSuccess(this.$t("Common.DeleteSuccess"));
        })
        .catch(function () {});
    },
    changeTableHeight() {
      const height = document.body.offsetHeight;
      this.tableHeight = height - 330;
    },
    handleRecover() {
      const backupIds = this.selectedRows.map((r) => r.backupId);
      recoverRecycleContent(backupIds).then(() => {
        this.loadRecyclecontentRecycleList();
        this.$modal.msgSuccess(this.$t("Common.OpSuccess"));
      });
    },
  },
};
</script>
<style scoped>
.mb12 {
  margin-bottom: 12px;
}
</style>
