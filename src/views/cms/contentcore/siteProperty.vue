<template>
  <div>
    <div class="mb12" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
      <a-space>
        <a-button
          type="primary"
          ghost
          v-hasPermi="[$p('Site:Edit:{0}', [site])]"
          @click="handleAdd"
        >
          <template #icon><PlusOutlined /></template>
          {{ $t("Common.Add") }}
        </a-button>
        <a-button
          danger
          :disabled="multiple"
          v-hasPermi="[$p('Site:Edit:{0}', [site])]"
          @click="handleDelete"
        >
          <template #icon><DeleteOutlined /></template>
          {{ $t("Common.Delete") }}
        </a-button>
      </a-space>
      <a-form :model="queryParams" ref="queryForm" layout="inline" @submit.prevent>
        <a-form-item name="query">
          <a-input
            v-model:value="queryParams.query"
            :placeholder="$t('CMS.Site.Property.QueryPlaceholder')"
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
      :data-source="propertyList"
      size="small"
      row-key="propertyId"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: handleSelectionChange }"
      :pagination="false"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <a-space size="small">
            <a-button
              type="link"
              size="small"
              class="!p-0"
              v-hasPermi="[$p('Site:Edit:{0}', [record.siteId])]"
              @click="handleEdit(record)"
            >{{ $t("Common.Edit") }}</a-button>
            <a-divider type="vertical" class="!mx-[2px]" />
            <a-button
              type="link"
              size="small"
              class="!p-0"
              danger
              v-hasPermi="[$p('Site:Edit:{0}', [record.siteId])]"
              @click="handleDelete(record)"
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
      @pagination="loadSitePropertyList"
    />

    <!-- 添加或修改对话框 -->
    <a-modal :get-container="getDemoContainer"
      :title="title"
      :open="open"
      :mask-closable="false"
      width="500px"
      @cancel="cancel"
    >
      <a-form ref="form" :model="form" :rules="rules" :label-col="{ style: { width: '80px' } }">
        <a-form-item :label="$t('CMS.Site.Property.PropName')" name="propName">
          <a-input v-model:value="form.propName" />
        </a-form-item>
        <a-form-item :label="$t('CMS.Site.Property.PropCode')" name="propCode">
          <a-input v-model:value="form.propCode" />
        </a-form-item>
        <a-form-item :label="$t('CMS.Site.Property.PropValue')" name="propValue">
          <a-input v-model:value="form.propValue" />
        </a-form-item>
        <a-form-item :label="$t('Common.Remark')" name="remark">
          <a-textarea v-model:value="form.remark" />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button type="primary" @click="submitForm">{{ $t("Common.Confirm") }}</a-button>
        <a-button class="ml8" @click="cancel">{{ $t("Common.Cancel") }}</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { PlusOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from "@ant-design/icons-vue";
import { getSitePropertyList, addSiteProperty, saveSiteProperty, deleteSiteProperty } from "@/api/contentcore/site";

export default {
  name: "CMSSitePropperty",
  components: {
    PlusOutlined,
    DeleteOutlined,
    SearchOutlined,
    ReloadOutlined,
  },
  props: {
    site: {
      type: String,
      default: undefined,
      required: false,
    },
  },
  data() {
    return {
      loading: false,
      ids: [],
      selectedRowKeys: [],
      multiple: true,
      total: 0,
      propertyList: [],
      title: "",
      open: false,
      queryParams: {
        siteId: this.site,
        pageNum: 1,
        pageSize: 20,
        query: undefined,
      },
      columns: [
        { title: "ID", dataIndex: "propertyId", key: "propertyId", align: "center", width: 180 },
        { title: this.$t("CMS.Site.Property.PropName"), dataIndex: "propName", key: "propName" },
        { title: this.$t("CMS.Site.Property.PropCode"), dataIndex: "propCode", key: "propCode" },
        { title: this.$t("CMS.Site.Property.PropValue"), dataIndex: "propValue", key: "propValue" },
        { title: this.$t("Common.Remark"), dataIndex: "remark", key: "remark" },
        { title: this.$t("Common.Operation"), dataIndex: "action", key: "action", align: "center", width: 180 },
      ],
      form: {},
      rules: {
        propName: [
          { required: true, message: this.$t("CMS.Site.Property.RuleTips.PropName"), trigger: "blur" },
        ],
        propCode: [
          { required: true, pattern: "^[A-Za-z0-9_]+$", message: this.$t("CMS.Site.Property.RuleTips.PropCode"), trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.loadSitePropertyList();
  },
  methods: {
    getDemoContainer() {
      return document.querySelector('.app-main__content') || document.body;
    },
    getDrawerContainer() {
      return document.querySelector('.app-overlay') || document.body;
    },
    loadSitePropertyList() {
      this.loading = true;
      getSitePropertyList(this.queryParams)
        .then((response) => {
          this.propertyList = response.data.rows;
          this.total = parseInt(response.data.total);
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.loadSitePropertyList();
    },
    resetQuery() {
      if (this.$refs.queryForm) {
        this.$refs.queryForm.resetFields();
      }
      this.queryParams.query = undefined;
      this.handleQuery();
    },
    handleSelectionChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.ids = selectedRows.map((item) => item.propertyId);
      this.multiple = !selectedRows.length;
    },
    cancel() {
      this.open = false;
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },
    handleAdd() {
      this.form = { siteId: this.queryParams.siteId };
      this.title = "添加属性";
      this.open = true;
    },
    handleEdit(row) {
      this.form = { ...row };
      this.title = "编辑属性";
      this.open = true;
    },
    submitForm() {
      this.$refs["form"]
        .validate()
        .then(() => {
          if (this.form.propertyId) {
            saveSiteProperty(this.form).then((response) => {
              this.$modal.msgSuccess(response.msg);
              this.open = false;
              this.loadSitePropertyList();
            });
          } else {
            this.form.siteId = this.queryParams.siteId;
            addSiteProperty(this.form).then((response) => {
              this.$modal.msgSuccess(response.msg);
              this.open = false;
              this.loadSitePropertyList();
            });
          }
        })
        .catch(() => {});
    },
    handleDelete(row) {
      const propertyIds = row.propertyId ? [row.propertyId] : this.ids;
      this.$modal
        .confirm(this.$t("Common.ConfirmDelete"))
        .then(function () {
          return deleteSiteProperty(propertyIds);
        })
        .then(() => {
          this.loadSitePropertyList();
          this.$modal.msgSuccess(this.$t("Common.DeleteSuccess"));
        })
        .catch(function () {});
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
