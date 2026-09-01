<template>
  <a-modal :get-container="getDemoContainer"
    :title="$t('CMS.Template.SelectorTitle')"
    :open="visible"
    width="700px"
    :mask-closable="false"
    @cancel="handleCancel"
  >
    <a-form
      :model="queryParams"
      ref="queryForm"
      layout="inline"
      class="mb12"
      @submit.prevent
    >
      <a-form-item name="filename">
        <a-input
          v-model:value="queryParams.filename"
          :placeholder="$t('CMS.Template.Name')"
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
      :data-source="templateList"
      size="small"
      row-key="path"
      :row-selection="{ type: 'radio', selectedRowKeys: selectedRowKeys, onChange: handleSelectionChange }"
      :custom-row="customRow"
      :pagination="false"
      :scroll="{ x: 'max-content', y: 360 }"
    >
      <template #bodyCell="{ column, record }">
        <span v-if="column.dataIndex === 'path'" v-html="record.displayPath"></span>
      </template>
    </a-table>
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
    <template #footer>
      <a-button type="primary" :disabled="okBtnDisabled" @click="handleOk">{{ $t("Common.Confirm") }}</a-button>
      <a-button class="ml8" @click="handleCancel">{{ $t("Common.Cancel") }}</a-button>
    </template>
  </a-modal>
</template>
<script>
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons-vue";
import { getTemplateList } from "@/api/contentcore/template";

export default {
  name: "CMSTemplateSelector",
  components: {
    SearchOutlined,
    ReloadOutlined,
  },
  props: {
    publishPipeCode: {
      type: String,
      required: true,
    },
    open: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  watch: {
    open() {
      this.visible = this.open;
    },
    visible(newVal) {
      if (!newVal) {
        this.handleCancel();
      } else {
        this.getList();
      }
    },
    publishPipeCode() {
      this.queryParams.publishPipeCode = this.publishPipeCode;
    },
  },
  computed: {
    okBtnDisabled() {
      return this.selectedTemplate == undefined;
    },
  },
  data() {
    return {
      loading: false,
      visible: this.open,
      selectedTemplate: undefined,
      selectedRowKeys: [],
      templateList: [],
      total: 0,
      columns: [
        { title: this.$t("CMS.Template.Name"), dataIndex: "path", key: "path", ellipsis: false },
      ],
      queryParams: {
        publishPipeCode: this.publishPipeCode,
        filename: undefined,
        pageNum: 1,
        pageSize: 8,
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
    getList() {
      if (!this.visible) {
        return;
      }
      this.loading = true;
      getTemplateList(this.queryParams)
        .then((response) => {
          this.templateList = response.data.rows.map((item) => {
            const arr = item.path.split("/");
            if (arr.length > 1) {
              item.displayPath = "";
              for (let i = 0; i < arr.length - 1; i++) {
                item.displayPath += '<span style="color: #1890ff">' + arr[i] + "</span> / ";
              }
              item.displayPath += arr[arr.length - 1];
            } else {
              item.displayPath = arr[0];
            }
            return item;
          });
          this.total = parseInt(response.data.total);
          this.selectedTemplate = undefined;
          this.selectedRowKeys = [];
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleSelectionChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedTemplate = selectedRows && selectedRows.length > 0 ? selectedRows[0].path : undefined;
    },
    customRow(record) {
      return {
        onClick: () => {
          this.handleSelectionChange([record.path], [record]);
        },
      };
    },
    handleOk() {
      this.$emit("ok", this.selectedTemplate);
    },
    handleCancel() {
      this.$emit("cancel");
      this.queryParams.filename = undefined;
      this.selectedTemplate = undefined;
      this.selectedRowKeys = [];
      this.templateList = [];
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.queryParams.filename = undefined;
      this.handleQuery();
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
