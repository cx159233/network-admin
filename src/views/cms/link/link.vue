<template>
  <div class="link-page">
    <PageHeader
      :title="$t('CMS.FriendLink.LinkName')"
      description="管理友链信息，支持新增、编辑和删除链接"
    >
      <template #actions>
        <a-button @click="handleGoBack">
          <template #icon><ArrowLeftOutlined /></template>
          {{ $t("CMS.FriendLink.GoBack") }}
        </a-button>
      </template>
    </PageHeader>

    <CloudCard class="link-page__table-card">
      <FilterBar @search="handleQuery" @reset="resetQuery">
        <template #actions>
          <a-button type="primary" v-hasPermi="['cms:friendlink:add']" @click="handleAdd">
            <template #icon><PlusOutlined /></template>
            {{ $t("Common.Add") }}
          </a-button>
          <a-button
            type="primary"
            :disabled="single"
            v-hasPermi="['cms:friendlink:add', 'cms:friendlink:edit']"
            @click="handleEdit()"
          >
            <template #icon><EditOutlined /></template>
            {{ $t("Common.Edit") }}
          </a-button>
          <a-button
            danger
            :disabled="multiple"
            v-hasPermi="['cms:friendlink:delete']"
            @click="handleDelete"
          >
            <template #icon><DeleteOutlined /></template>
            {{ $t("Common.Delete") }}
          </a-button>
        </template>
        <a-input
          v-model:value="queryParams.query"
          :placeholder="$t('CMS.FriendLink.Placeholder.LinkQuery')"
          allow-clear
          style="width: 200px"
          @pressEnter="handleQuery"
        />
      </FilterBar>
      <div class="link-page__divider"></div>
      <div class="link-page__table-wrap">
        <a-table
          :columns="columns"
          :data-source="linkList"
          :loading="loading"
          :pagination="false"
          :row-key="(record) => record.linkId"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: handleSelectionChange }"
          size="middle"
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'index'">
              {{ index + 1 }}
            </template>
            <template v-else-if="column.dataIndex === 'logo'">
              <img v-if="record.src" :src="record.src" class="h-[60px] object-contain" />
              <span v-else>--</span>
            </template>
            <span v-else-if="column.dataIndex === 'name'" class="cell-primary">{{ record.name }}</span>
            <span v-else-if="column.dataIndex === 'updateTime'" class="cell-default">
              {{ record.updateTime ? parseTime(record.updateTime) : parseTime(record.createTime) }}
            </span>
            <template v-else-if="column.dataIndex === 'action'">
              <a-space size="small">
                <a-button
                  type="link"
                  size="small"
                  class="!p-0"
                  v-hasPermi="['cms:friendlink:add', 'cms:friendlink:edit']"
                  @click="handleEdit(record)"
                >{{ $t("Common.Edit") }}</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-button
                  type="link"
                  size="small"
                  danger
                  class="!p-0"
                  v-hasPermi="['cms:friendlink:delete']"
                  @click="handleDelete(record)"
                >{{ $t("Common.Delete") }}</a-button>
              </a-space>
            </template>
            <span v-else class="cell-default">{{ record[column.dataIndex] || '--' }}</span>
          </template>
        </a-table>
      </div>
    </CloudCard>

    <!-- 添加/编辑弹窗 -->
    <a-modal
      :title="title"
      v-model:open="open"
      width="500px"
      :mask-closable="false"
    >
      <a-form ref="formRef" :model="form" :rules="rules" :label-col="{ style: { width: '80px' } }">
        <a-form-item :label="$t('CMS.FriendLink.LinkName')" name="name">
          <a-input v-model:value="form.name" />
        </a-form-item>
        <a-form-item :label="$t('CMS.FriendLink.LinkUrl')" name="url">
          <a-input v-model:value="form.url" placeholder="http(s)://" />
        </a-form-item>
        <a-form-item label="Logo" name="logo">
          <cms-logo-view
            v-model="form.logo"
            :src="form.src"
            :width="218"
            :height="150"
          />
        </a-form-item>
        <a-form-item v-if="form.linkId" :label="$t('CMS.FriendLink.SortFlag')" name="sortFlag">
          <a-input-number v-model:value="form.sortFlag" :min="0" />
        </a-form-item>
        <a-form-item :label="$t('Common.Remark')" name="remark">
          <a-input v-model:value="form.remark" />
        </a-form-item>
      </a-form>
      <template #footer>
        <div class="dialog-footer">
          <a-button type="primary" @click="submitForm">{{ $t("Common.Confirm") }}</a-button>
          <a-button @click="cancel">{{ $t("Common.Cancel") }}</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { PlusOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import { urlValidator } from "@/utils/validate";
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import FilterBar from '@/components/cloud/FilterBar.vue'
import { getLinkList, addLink, editLink, deleteLink } from "@/api/link/link";
import CMSLogoView from "@/views/cms/components/LogoView";

export default {
  name: "CmsLink",
  components: {
    PageHeader,
    CloudCard,
    FilterBar,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ArrowLeftOutlined,
    "cms-logo-view": CMSLogoView,
  },
  data() {
    return {
      loading: true,
      showSearch: true,
      selectedRows: [],
      selectedRowKeys: [],
      single: true,
      multiple: true,
      linkList: [],
      title: "",
      open: false,
      queryParams: {
        query: undefined,
        groupId: this.$route.query.groupId,
        pageSize: 20,
        pageNo: 1,
      },
      form: {},
      rules: {
        name: [
          { required: true, message: this.$t("Common.RuleTips.NotEmpty"), trigger: "blur" },
        ],
      },
      columns: [
        { title: this.$t('Common.RowNo'), dataIndex: 'index', key: 'index', width: 60 },
        { title: 'Logo', dataIndex: 'logo', key: 'logo', width: 100 },
        { title: this.$t('CMS.FriendLink.LinkName'), dataIndex: 'name', key: 'name', width: 300 },
        { title: this.$t('CMS.FriendLink.LinkUrl'), dataIndex: 'url', key: 'url' },
        { title: this.$t('Common.UpdateTime'), dataIndex: 'updateTime', key: 'updateTime', width: 160 },
        { title: this.$t('Common.Operation'), dataIndex: 'action', key: 'action', width: 180, fixed: 'right' },
      ],
    };
  },
  created() {
    this.loadListData();
  },
  methods: {
    loadListData() {
      this.loading = true;
      getLinkList(this.queryParams).then((response) => {
        this.linkList = response.data.rows;
        this.loading = false;
      });
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    reset() {
      this.form = {};
    },
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.loadListData();
    },
    resetQuery() {
      this.queryParams.query = undefined;
      this.handleQuery();
    },
    handleSelectionChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
      this.single = selectedRows.length != 1;
      this.multiple = !selectedRows.length;
    },
    handleAdd() {
      this.reset();
      this.title = this.$t("CMS.FriendLink.AddLinkTitle");
      this.open = true;
    },
    handleEdit(row) {
      const data = row && row.linkId ? row : this.selectedRows[0];
      this.reset();
      this.title = this.$t("CMS.FriendLink.EditLinkTitle");
      this.form = data;
      this.open = true;
    },
    submitForm() {
      this.$refs.formRef.validate().then(() => {
        this.form.groupId = this.queryParams.groupId;
        if (this.form.linkId) {
          editLink(this.form).then((response) => {
            message.success(response.msg);
            this.open = false;
            this.loadListData();
          });
        } else {
          addLink(this.form).then((response) => {
            message.success(response.msg);
            this.open = false;
            this.loadListData();
          });
        }
      }).catch(() => {});
    },
    handleDelete(row) {
      const rows = row.linkId ? [{ linkId: row.linkId }] : this.selectedRows;
      Modal.confirm({
        title: this.$t("Common.ConfirmDelete"),
        onOk: () => {
          return deleteLink(rows).then((response) => {
            message.success(response.msg);
            this.loadListData();
          });
        },
      });
    },
    handleGoBack() {
      this.$router.push({ path: "/system/friendLink" });
    },
  },
};
</script>

<style scoped>
.link-page {
  padding: 4px 0;
}

.link-page__divider {
  height: 1px;
  background: #F2F3F5;
  margin: 0 16px;
}

.link-page__table-wrap {
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
