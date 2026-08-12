<template>
  <div class="p-[20px]">
    <PageHeader
      :title="$t('CMS.Site.Name')"
      description="管理站点信息，支持新增、编辑、发布和下线和删除"
    />

    <CloudCard class="site-page__table-card">
      <FilterBar @search="handleQuery" @reset="resetQuery">
        <template #actions>
          <a-button type="primary" @click="handleAdd">
            <template #icon><PlusOutlined /></template>
            {{ $t("Common.Add") }}
          </a-button>
        </template>
        <a-input
          v-model:value="queryParams.siteName"
          :placeholder="$t('CMS.Site.Name')"
          allow-clear
          style="width: 200px"
          @pressEnter="handleQuery"
        />
      </FilterBar>
      <div class="site-page__divider"></div>
      <div class="site-page__table-wrap">
        <a-table
          :columns="columns"
          :data-source="siteList"
          :loading="siteListLoading"
          :pagination="paginationConfig"
          row-key="siteId"
          size="middle"
          @change="onTableChange"
        >
          <template #bodyCell="{ column, record }">
            <a-button v-if="column.dataIndex === 'name'" type="link" @click="handleEdit(record)">{{ record.name }}</a-button>
            <template v-else-if="column.dataIndex === 'action'">
              <a-space size="small">
                <a-button v-if="record.isPublish !== 'Y'" type="link" size="small" class="!p-0" @click="handlePublish(record)">{{ $t("CMS.Site.PublishAll") }}</a-button>
                <a-button v-else type="link" size="small" class="!p-0" @click="handleUnPublish(record)">下线</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-button type="link" size="small" class="!p-0" v-hasPermi="[$p('Site:Edit:{0}', [record.siteId])]" @click="handleEdit(record)">{{ $t("Common.Edit") }}</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-button type="link" size="small" danger class="!p-0" v-hasPermi="[$p('Site:Delete:{0}', [record.siteId])]" @click="handleDelete(record)">{{ $t("Common.Delete") }}</a-button>
              </a-space>
            </template>
            <span v-else class="cell-default">{{ record[column.dataIndex] || '--' }}</span>
          </template>
        </a-table>
      </div>
    </CloudCard>

    <a-modal
      :title="$t('CMS.Site.Dialog.AddTitle')"
      v-model:open="open"
      width="600px"
      :footer="null"
    >
      <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        layout="vertical"
      >
        <a-form-item :label="$t('CMS.Site.Name')" name="name">
          <a-input v-model:value="form.name" />
        </a-form-item>
        <a-form-item :label="$t('CMS.Site.Path')" name="path">
          <a-input v-model:value="form.path" />
        </a-form-item>
        <a-form-item :label="$t('CMS.Site.ResourceUrl')" name="resourceUrl">
          <a-input v-model:value="form.resourceUrl" />
        </a-form-item>
        <a-form-item :label="$t('CMS.Site.Desc')" name="description">
          <a-textarea v-model:value="form.description" :maxlength="300" />
        </a-form-item>
      </a-form>
      <div class="modal-footer">
        <a-button type="primary" @click="handleAddSave">{{ $t("Common.Confirm") }}</a-button>
        <a-button @click="cancel">{{ $t("Common.Cancel") }}</a-button>
      </div>
    </a-modal>

    <cms-progress
      :title="$t('CMS.Site.DeleteProgressTitle')"
      :open="openProgress"
      :taskId="taskId"
      @close="handleCloseProgress"
    ></cms-progress>
  </div>
</template>

<script>
import { PlusOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import FilterBar from '@/components/cloud/FilterBar.vue'
import {
  delSite,
  addSite,
  listSite,
  publishSite,
  publishUnSite,
} from "@/api/contentcore/site";
import CMSProgress from "@/views/components/Progress";

export default {
  name: "CmsContentcoreSite",
  components: {
    PageHeader, CloudCard, FilterBar, PlusOutlined,
    "cms-progress": CMSProgress,
  },
  data() {
    return {
      open: false,
      siteList: undefined,
      siteListLoading: true,
      pagination: { current: 1, pageSize: 10 },
      columns: [
        { title: 'ID', dataIndex: 'siteId', key: 'siteId', width: 200 },
        { title: this.$t('CMS.Site.Name'), dataIndex: 'name', key: 'name' },
        { title: this.$t('CMS.Site.Path'), dataIndex: 'path', key: 'path' },
        { title: this.$t('Common.Operation'), dataIndex: 'action', key: 'action', width: 310, fixed: 'right' }
      ],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        siteName: undefined,
      },
      form: {},
      rules: {
        name: [
          { required: true, message: this.$t("CMS.Site.RuleTips.Name"), trigger: "blur" },
        ],
        path: [
          { required: true, pattern: "^[A-Za-z0-9]+$", message: this.$t("CMS.Site.RuleTips.Path"), trigger: "blur" },
        ],
      },
      openProgress: false,
      taskId: "",
    };
  },
  computed: {
    paginationConfig() {
      return {
        current: this.pagination.current,
        pageSize: this.pagination.pageSize,
        total: this.siteTotal,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (t) => `共 ${t} 条`
      }
    },
    siteTotal() {
      return this.siteList ? this.siteList.length : 0
    }
  },
  created() {
    this.loadSiteList();
  },
  methods: {
    loadSiteList() {
      this.siteListLoading = true;
      listSite(this.queryParams).then((response) => {
        this.siteList = response.data.rows;
        this.siteListLoading = false;
      });
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.pagination.current = 1;
      this.loadSiteList();
    },
    resetQuery() {
      this.queryParams.siteName = undefined;
      this.handleQuery();
    },
    onTableChange(pag) {
      this.pagination.current = pag.current;
      this.pagination.pageSize = pag.pageSize;
      this.queryParams.pageNum = pag.current;
      this.queryParams.pageSize = pag.pageSize;
      this.loadSiteList();
    },
    cancel() {
      this.open = false;
      this.resetAddForm();
    },
    resetAddForm() {
      this.form = {
        name: undefined,
        description: undefined,
        path: undefined,
        url: undefined,
        resourceUrl: undefined,
      };
    },
    handleAdd() {
      this.resetAddForm();
      this.open = true;
    },
    handleAddSave() {
      this.$refs.formRef.validate().then(() => {
        this.form.parentId = 0;
        addSite(this.form).then(() => {
          message.success(this.$t("Common.AddSuccess"));
          this.open = false;
          if (!this.siteList || this.siteList.length === 0) {
            this.$router.go(0);
          } else {
            this.loadSiteList();
          }
        });
      }).catch(() => {});
    },
    handleEdit(row) {
      const siteId = row.siteId;
      this.$router.push({ path: "/cms/site/tabs", query: { siteId: siteId } });
    },
    handleDelete(row) {
      const siteId = row.siteId;
      Modal.confirm({
        title: this.$t("Common.ConfirmDelete"),
        onOk: () => {
          return delSite(siteId).then((response) => {
            if (this.$cache.local.get("CurrentSite") == siteId) {
              this.$cache.local.set("CurrentSite", "0");
            }
            this.taskId = response.data;
            this.openProgress = true;
          });
        }
      });
    },
    handleCloseProgress() {
      this.$router.go(0);
    },
    handlePreview(row) {
      const siteId = row.siteId;
      let routeData = this.$router.resolve({
        path: "/cms/preview",
        query: { type: "site", dataId: siteId },
      });
      window.open(routeData.href, "_blank");
    },
    handlePublish(row) {
      publishSite({ siteId: row.siteId, publishIndex: true }).then((response) => {
        if (response.code == 200) {
          message.success(this.$t("CMS.ContentCore.PublishSuccess"));
          this.handleQuery();
        }
      });
    },
    handleUnPublish(row) {
      publishUnSite({ siteId: row.siteId, publishIndex: true }).then((response) => {
        if (response.code == 200) {
          message.success("下线成功");
          this.handleQuery();
        }
      });
    },
  },
};
</script>

<style scoped>
.site-page {
  padding: 4px 0;
}

.site-page__divider {
  height: 1px;
  background: #F2F3F5;
  margin: 0 16px;
}

.site-page__table-wrap {
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

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #F2F3F5;
}
</style>
