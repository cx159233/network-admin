<template>
  <div class="pagewidget-container">
    <div class="mb12" style="display: flex; justify-content: space-between; align-items: center;">
      <a-button
        type="primary"
        ghost
        v-hasPermi="[$p('Site:AddPageWidget:{0}', [siteId])]"
        @click="handleAdd"
      >
        <template #icon><PlusOutlined /></template>
        {{ $t("Common.Add") }}
      </a-button>
      <a-select
        v-model:value="queryParams.type"
        :placeholder="$t('CMS.PageWidget.Placeholder.Type')"
        style="width: 200px"
        allow-clear
        @change="loadPageWidgetList"
      >
        <a-select-option v-for="item in pageWidgetTypes" :key="item.id" :value="item.id">
          {{ item.name }}
        </a-select-option>
      </a-select>
    </div>
    <a-table
      :loading="loading"
      ref="pageWidgetList"
      size="small"
      :columns="columns"
      :data-source="pageWidgetList"
      :scroll="{ x: 'max-content', y: tableHeight }"
      row-key="pageWidgetId"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: handleSelectionChange }"
      :custom-row="customRow"
      :pagination="false"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'type'">{{ pageWidgetTypeName(record.type) }}</template>
        <span v-else-if="column.dataIndex === 'state'">{{ statusFormat(record.state) }}</span>
        <template v-else-if="column.dataIndex === 'publishPipeCode'">{{ publishPipeName(record.publishPipeCode) }}</template>
        <template v-else-if="column.dataIndex === 'action'">
          <a-space size="small">
            <a-button
              type="link"
              size="small"
              class="!p-0"
              v-hasPermi="[$p('PageWidget:Publish:{0}', [record.pageWidgetId])]"
              @click.stop="handlePublish(record)"
            >{{ $t("CMS.ContentCore.Publish") }}</a-button>
            <a-divider type="vertical" class="!mx-[2px]" />
            <a-button type="link" size="small" class="!p-0" @click.stop="handlePreview(record)">
              {{ $t("CMS.ContentCore.Preview") }}
            </a-button>
            <a-divider type="vertical" class="!mx-[2px]" />
            <a-button
              type="link"
              size="small"
              class="!p-0"
              v-hasPermi="[$p('PageWidget:Edit:{0}', [record.pageWidgetId])]"
              @click.stop="handleEdit(record)"
            >{{ $t("Common.Edit") }}</a-button>
            <a-divider type="vertical" class="!mx-[2px]" />
            <a-button
              type="link"
              size="small"
              class="!p-0"
              danger
              v-hasPermi="[$p('PageWidget:Delete:{0}', [record.pageWidgetId])]"
              @click.stop="handleDelete(record)"
            >{{ $t("Common.Delete") }}</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="loadPageWidgetList"
    />
    <!-- 添加对话框 -->
    <a-modal :get-container="getDemoContainer"
      :title="$t('CMS.PageWidget.AddTitle')"
      :open="dialogVisible"
      :mask-closable="false"
      width="600px"
      @cancel="handleAddDialogClose"
    >
      <a-form ref="form" :model="form" :rules="rules" :label-col="{ style: { width: '110px' } }">
        <a-form-item :label="$t('CMS.PageWidget.Type')" name="type">
          <a-select v-model:value="form.type" allow-clear>
            <a-select-option v-for="item in pageWidgetTypes" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('CMS.PageWidget.Name')" name="name">
          <a-input v-model:value="form.name" />
        </a-form-item>
        <a-form-item :label="$t('CMS.PageWidget.Code')" name="code">
          <a-input v-model:value="form.code" />
        </a-form-item>
        <a-form-item :label="$t('CMS.PageWidget.PublishPipe')" name="publishPipeCode">
          <a-select v-model:value="form.publishPipeCode">
            <a-select-option v-for="pp in publishPipes" :key="pp.pipeCode" :value="pp.pipeCode">
              {{ pp.pipeName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('CMS.PageWidget.Path')" name="path">
          <a-input v-model:value="form.path" />
        </a-form-item>
        <a-form-item :label="$t('Common.Remark')" name="remark">
          <a-textarea v-model:value="form.remark" :maxlength="100" />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button type="primary" @click="handleAddDialogOk">{{ $t("Common.Confirm") }}</a-button>
        <a-button class="ml8" @click="handleAddDialogClose">{{ $t("Common.Cancel") }}</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { PlusOutlined } from "@ant-design/icons-vue";
import { getPublishPipeSelectData } from "@/api/contentcore/publishpipe";
import { listPageWidgetTypes, listPageWidgets, addPageWidget, deletePageWidget, publishPageWidgets } from "@/api/contentcore/pagewidget";

export default {
  name: "CMSPageWdiget",
  dicts: ["CMSPageWidgetStatus"],
  components: {
    PlusOutlined,
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
      tableHeight: 600,
      selectedRows: [],
      selectedRowKeys: [],
      siteId: this.$cache.local.get("CurrentSite"),
      catalogId: this.cid,
      dialogVisible: false,
      publishPipes: [],
      pageWidgetTypes: [],
      pageWidgetList: [],
      total: 0,
      queryParams: {
        type: undefined,
        pageSize: 20,
        pageNum: 1,
      },
      columns: [
        { title: this.$t("CMS.PageWidget.Name"), dataIndex: "name", key: "name", ellipsis: true },
        { title: this.$t("CMS.PageWidget.Code"), dataIndex: "code", key: "code", ellipsis: true },
        { title: this.$t("CMS.PageWidget.Type"), dataIndex: "type", key: "type", align: "center", width: 100 },
        { title: this.$t("CMS.Content.Status"), dataIndex: "state", key: "state", align: "center", width: 100 },
        { title: this.$t("CMS.PageWidget.PublishPipe"), dataIndex: "publishPipeCode", key: "publishPipeCode", align: "center", width: 110 },
        { title: this.$t("CMS.PageWidget.Path"), dataIndex: "path", key: "path", width: 180, ellipsis: true },
        { title: this.$t("Common.Operation"), dataIndex: "action", key: "action", align: "right", width: 250 },
      ],
      form: {
        path: "include/pagewidget/",
      },
      rules: {
        type: [
          { required: true, message: this.$t("CMS.PageWidget.RuleTips.Type"), trigger: "change" },
        ],
        name: [
          { required: true, message: this.$t("CMS.PageWidget.RuleTips.Name"), trigger: "blur" },
        ],
        code: [
          { required: true, pattern: "^[A-Za-z0-9_]+$", message: this.$t("CMS.PageWidget.RuleTips.Code"), trigger: "blur" },
        ],
        publishPipeCode: [
          { required: true, message: this.$t("CMS.PageWidget.RuleTips.PublishPipe"), trigger: "change" },
        ],
        path: [
          { required: true, pattern: "^[A-Za-z0-9_/]+$", message: this.$t("CMS.PageWidget.RuleTips.Path"), trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    cid(newVal) {
      this.catalogId = newVal;
    },
    catalogId() {
      this.loadPageWidgetList();
    },
  },
  created() {
    this.changeTableHeight();
    this.loadPageWidgetList();
    this.loadPageWdigetTypes();
    this.loadPublishPipes();
  },
  methods: {
    getDemoContainer() {
      return document.querySelector('.app-main__content') || document.body;
    },
    getDrawerContainer() {
      return document.querySelector('.app-overlay') || document.body;
    },
    changeTableHeight() {
      const height = document.body.offsetHeight;
      this.tableHeight = height - 330;
    },
    loadPageWdigetTypes() {
      listPageWidgetTypes().then((response) => {
        this.pageWidgetTypes = response.data.rows;
      });
    },
    pageWidgetTypeName(type) {
      const pt = this.pageWidgetTypes.find((v) => v.id == type);
      return pt ? pt.name : type;
    },
    statusFormat(value) {
      const dict = (this.dict.type.CMSPageWidgetStatus || []).find((d) => d.value === String(value));
      return dict ? dict.label : value;
    },
    loadPublishPipes() {
      getPublishPipeSelectData().then((response) => {
        this.publishPipes = response.data.rows;
      });
    },
    publishPipeName(code) {
      const pp = this.publishPipes.find((v) => v.pipeCode == code);
      return pp ? pp.pipeName : code;
    },
    loadPageWidgetList() {
      this.loading = true;
      this.queryParams.catalogId = this.catalogId;
      listPageWidgets(this.queryParams)
        .then((response) => {
          this.pageWidgetList = response.data.rows;
          this.total = parseInt(response.data.total);
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleSelectionChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    customRow(record) {
      return {
        onClick: () => {
          this.handleSelectionChange([record.pageWidgetId], [record]);
        },
      };
    },
    handleAdd() {
      this.dialogVisible = true;
      this.form = { path: "include/pagewidget/" };
    },
    handleAddDialogClose() {
      this.dialogVisible = false;
    },
    handleAddDialogOk() {
      this.$refs.form.validate().then(() => {
        this.form.catalogId = this.catalogId && this.catalogId.length > 0 ? this.catalogId : 0;
        addPageWidget(this.form).then((response) => {
          this.$modal.msgSuccess(response.msg);
          this.loadPageWidgetList();
          this.handleAddDialogClose();
        });
      });
    },
    handleDelete(row) {
      const pageWidgetIds = [row.pageWidgetId];
      this.$modal
        .confirm(this.$t("Common.ConfigmDelete"))
        .then(function () {
          return deletePageWidget(pageWidgetIds);
        })
        .then((response) => {
          this.$modal.msgSuccess(response.msg);
          this.loadPageWidgetList();
        })
        .catch(() => {});
    },
    handleEdit(row) {
      this.$router.push({ path: row.route, query: { id: row.pageWidgetId, from: "pagewidget" } });
    },
    handlePublish(row) {
      const pageWidgetIds = [row.pageWidgetId];
      publishPageWidgets(pageWidgetIds).then((response) => {
        if (response.code === 200) {
          this.$modal.msgSuccess(response.msg);
          this.loadPageWidgetList();
        }
      });
    },
    handlePreview(row) {
      const routeData = this.$router.resolve({
        path: "/cms/preview",
        query: { type: "pagewidget", dataId: row.pageWidgetId },
      });
      window.open(routeData.href, "_blank");
    },
  },
};
</script>
<style scoped>
.mb12 {
  margin-bottom: 12px;
}
.ml8 {
  margin-left: 8px;
}
</style>
