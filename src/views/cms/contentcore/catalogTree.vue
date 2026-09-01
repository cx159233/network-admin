<template>
  <div class="catalog-tree">
    <div class="head-container">
      <a-dropdown
        v-if="showNewBtn"
        placement="bottomLeft"
        style="margin-top: 2px"
      >
        <a-button type="link" @click="handleAdd">
          <template #icon><PlusOutlined /></template>
          {{ $t("CMS.Catalog.AddCatalog") }}
          <DownOutlined />
        </a-button>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="handleAdd">{{
              $t("CMS.Catalog.AddCatalog")
            }}</a-menu-item>
            <a-menu-item @click="handleBatchAdd">{{
              $t("CMS.Catalog.BatchAddCatalog")
            }}</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <a-input
        :placeholder="$t('CMS.Catalog.CatalogNamePlaceholder')"
        v-model:value="filterCatalogName"
        allow-clear
        size="small"
      >
        <template #suffix><SearchOutlined /></template>
      </a-input>
    </div>
    <div class="tree-container">
      <a-button
        :loading="loading"
        :title="siteName"
        type="link"
        class="tree-header"
        @click="handleTreeRootClick"
      >
        <template #icon><HomeOutlined /></template>
        {{ siteName }}
      </a-button>
      <a-tree
        :tree-data="filteredCatalogOptions"
        :field-names="{ children: 'children', title: 'label', key: 'id' }"
        :expanded-keys="expandedKeys"
        :selected-keys="selectedKeys"
        :show-line="false"
        @select="handleNodeSelect"
        @expand="handleExpand"
      >
        <template #title="nodeData">
          <span class="tree-node">
            <span class="node-text" :title="nodeData.label">{{ nodeData.label }}</span>
            <span class="node-tool">
              <a-dropdown :trigger="['hover']" placement="bottomRight">
                <a-button type="link" class="row-more-btn" size="small">
                  <MoreOutlined />
                </a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item
                      v-hasPermi="[$p('Catalog:Publish:{0}', [nodeData.catalogId])]"
                      @click="handlePublish(nodeData)"
                    >
                      <SendOutlined /> {{ $t("CMS.ContentCore.Publish") }}
                    </a-menu-item>
                    <a-menu-item
                      v-hasPermi="[$p('Catalog:Sort:{0}', [nodeData.catalogId])]"
                      @click="handleSortUp(nodeData)"
                    >
                      <SortAscendingOutlined /> {{ $t("CMS.Catalog.SortUp") }}
                    </a-menu-item>
                    <a-menu-item
                      v-hasPermi="[$p('Catalog:Sort:{0}', [nodeData.catalogId])]"
                      @click="handleSortDown(nodeData)"
                    >
                      <SortDescendingOutlined /> {{ $t("CMS.Catalog.SortDown") }}
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </span>
          </span>
        </template>
      </a-tree>
    </div>
    <!-- 添加栏目对话框 -->
    <a-modal :get-container="getDemoContainer"
      :title="$t('CMS.Catalog.AddCatalog')"
      v-model:open="diagOpen"
      :mask-closable="false"
      width="600px"
    >
      <a-form ref="form" :model="form" :rules="rules" :label-col="{ style: { width: '120px' } }">
        <a-form-item :label="$t('CMS.Catalog.ParentCatalog')" name="parentId">
          <a-tree-select
            v-model:value="form.parentId"
            :tree-data="catalogOptions"
            :field-names="{ children: 'children', label: 'label', value: 'id' }"
            tree-default-expand-all
            allow-clear
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item :label="$t('CMS.Catalog.Name')" name="name">
          <a-input v-model:value="form.name" @blur="handleNameBlur" />
        </a-form-item>
        <a-form-item :label="$t('CMS.Catalog.Alias')" name="alias">
          <a-input v-model:value="form.alias" />
        </a-form-item>
        <a-form-item :label="$t('CMS.Catalog.Path')" name="path">
          <a-input v-model:value="form.path" />
        </a-form-item>
      </a-form>
      <template #footer>
        <div class="dialog-footer">
          <a-button type="primary" @click="handleAddSave">{{
            $t("Common.Confirm")
          }}</a-button>
          <a-button @click="cancel">{{ $t("Common.Cancel") }}</a-button>
        </div>
      </template>
    </a-modal>

    <a-modal :get-container="getDemoContainer"
      :title="$t('CMS.Catalog.BatchAddCatalog')"
      v-model:open="openBatchAdd"
      :mask-closable="false"
      width="500px"
      style="padding-top: 0; padding-bottom: 0"
    >
      <a-form
        ref="formBatch"
        :model="formBatch"
        :rules="rulesBatch"
        layout="vertical"
      >
        <a-form-item :label="$t('CMS.Catalog.ParentCatalog')" name="parentId">
          <a-tree-select
            v-model:value="formBatch.parentId"
            :tree-data="catalogOptions"
            :field-names="{ children: 'children', label: 'label', value: 'id' }"
            tree-default-expand-all
            allow-clear
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item :label="$t('CMS.Catalog.CatalogTree')" name="catalogs">
          <a-textarea v-model:value="formBatch.catalogs" :rows="10" />
        </a-form-item>
      </a-form>
      <div
        style="
          background-color: #f4f4f5;
          color: #909399;
          font-size: 12px;
          line-height: 30px;
          padding-left: 10px;
        "
      >
        <InfoCircleOutlined class="mr5" />{{ $t("CMS.Catalog.BatchAddTip") }}
      </div>
      <template #footer>
        <div class="dialog-footer">
          <a-button type="primary" :loading="loading" @click="handleBatchAddSave">{{
            $t("Common.Confirm")
          }}</a-button>
          <a-button @click="openBatchAdd = false">{{
            $t("Common.Cancel")
          }}</a-button>
        </div>
      </template>
    </a-modal>

    <a-modal :get-container="getDemoContainer"
      :title="$t('CMS.Catalog.PublishDialogTitle')"
      v-model:open="publishDialogVisible"
      width="500px"
      class="publish-dialog"
    >
      <div>
        <p>{{ $t("Common.Tips") }}</p>
        <p>{{ $t("CMS.Catalog.PublishTips") }}</p>
        <a-checkbox v-model:checked="publishChild">{{
          $t("CMS.Catalog.ContainsChildren")
        }}</a-checkbox>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <a-button @click="publishDialogVisible = false">{{
            $t("Common.Cancel")
          }}</a-button>
          <a-button type="primary" @click="handleDoPublish">{{
            $t("Common.Confirm")
          }}</a-button>
        </div>
      </template>
    </a-modal>
    <!-- 进度条 -->
    <cms-progress
      :title="$t('CMS.Catalog.PublishProgressTitle')"
      v-model:open="openProgress"
      :taskId="taskId"
      @close="handleCloseProgress"
    ></cms-progress>
  </div>
</template>
<script>
import {
  getCatalogTypes,
  getCatalogTreeData,
  addCatalog,
  batchAddCatalog,
  publishCatalog,
  sortCatalog,
  generateAliasAndPath,
} from "@/api/contentcore/catalog";
import CMSProgress from "@/views/components/Progress";
import { message } from "ant-design-vue";
import {
  PlusOutlined,
  DownOutlined,
  SearchOutlined,
  HomeOutlined,
  MoreOutlined,
  SendOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons-vue";

export default {
  name: "CMSCatalogTree",
  components: {
    "cms-progress": CMSProgress,
    PlusOutlined,
    DownOutlined,
    SearchOutlined,
    HomeOutlined,
    MoreOutlined,
    SendOutlined,
    SortAscendingOutlined,
    SortDescendingOutlined,
    InfoCircleOutlined,
  },
  props: {
    newBtn: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    },
    filteredCatalogOptions() {
      return this.filterNodes(this.filterCatalogName, this.catalogOptions);
    },
  },
  data() {
    return {
      loading: false,
      // 是否显示新增栏目按钮
      showNewBtn: this.newBtn,
      // 是否显示弹出层
      diagOpen: false,
      // 栏目类型
      catalogTypeOptions: [],
      // 栏目树过滤：栏目名称
      filterCatalogName: "",
      // 栏目树数据
      catalogOptions: [],
      // 站点名称
      siteName: "",
      expandMode: "",
      // 当前选中栏目ID
      selectedCatalogId: "",
      treeExpandedKeys: [],
      expandedKeys: [],
      selectedKeys: [],
      // 新增栏目表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          {
            required: true,
            message: this.$t("CMS.Catalog.RuleTips.Name"),
            trigger: "blur",
          },
        ],
        alias: [
          {
            required: true,
            message: "请输入栏目别名",
            trigger: "blur",
          },
        ],
        path: [
          {
            required: true,
            pattern: "^[A-Za-z0-9_\/]+$",
            message: this.$t("CMS.Catalog.RuleTips.Path"),
            trigger: "blur",
          },
        ],
      },
      openBatchAdd: false,
      formBatch: {},
      rulesBatch: {
        catalogs: [
          {
            required: true,
            message: this.$t("Common.RuleTips.NotEmpty"),
            trigger: "blur",
          },
        ],
      },
      publishCatalogId: 0,
      publishDialogVisible: false,
      publishChild: false,
      openProgress: false,
      taskId: "",
    };
  },
  created() {
    this.loadCatalogTreeData();
    // 加载栏目类型数据
    getCatalogTypes().then((response) => {
      this.catalogTypeOptions = response.data;
    });
  },
  methods: {
    getDemoContainer() {
      return document.querySelector('.app-main__content') || document.body;
    },
    getDrawerContainer() {
      return document.querySelector('.app-overlay') || document.body;
    },
    /** 查询栏目树结构 */
    loadCatalogTreeData() {
      this.loading = true;
      getCatalogTreeData().then((response) => {
        this.catalogOptions = response.data.rows;
        if (this.catalogOptions.length == 0) {
          this.$cache.local.remove("LastSelectedCatalogId");
        }
        this.siteName = response.data.siteName;
        this.expandMode = response.data.expandMode;
        this.loading = false;
        this.$nextTick(() => {
          this.selectedCatalogId = this.$cache.local.get(
            "LastSelectedCatalogId"
          );
          if (this.selectedCatalogId && this.catalogOptions.length > 0) {
            this.selectedKeys = [this.selectedCatalogId];
            this.treeExpandedKeys = [this.selectedCatalogId];
            this.expandedKeys = [this.selectedCatalogId];
            const node = this.findNodeById(
              this.selectedCatalogId,
              this.catalogOptions
            );
            this.$emit("node-click", node);
          } else {
            this.selectedKeys = [];
            this.$emit("node-click", null);
          }
        });
      });
    },
    findNodeById(id, nodes) {
      if (!nodes) return null;
      for (const n of nodes) {
        if (n.id == id) return n;
        if (n.children && n.children.length > 0) {
          const found = this.findNodeById(id, n.children);
          if (found) return found;
        }
      }
      return null;
    },
    filterNodes(value, nodes) {
      if (!value) return nodes || [];
      const result = [];
      if (!nodes) return result;
      nodes.forEach((n) => {
        const filteredChildren = this.filterNodes(value, n.children);
        const matches = this.filterNode(value, n);
        if (matches || filteredChildren.length > 0) {
          result.push({ ...n, children: filteredChildren });
        }
      });
      return result;
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label && data.label.indexOf(value) > -1;
    },
    // 根节点点击事件
    handleTreeRootClick() {
      this.selectedCatalogId = undefined;
      this.$cache.local.remove("LastSelectedCatalogId");
      this.selectedKeys = [];
      this.$emit("node-click", null);
    },
    // 节点单击事件
    handleNodeSelect(selectedKeys, info) {
      if (info.selectedNodes && info.selectedNodes.length > 0) {
        const data = info.selectedNodes[0];
        this.selectedCatalogId = data.id;
        this.$cache.local.set("LastSelectedCatalogId", this.selectedCatalogId);
        this.$emit("node-click", data);
      }
    },
    handleExpand(keys) {
      this.expandedKeys = keys;
    },
    // 取消按钮
    cancel() {
      this.diagOpen = false;
      this.resetAddForm();
    },
    // 表单重置
    resetAddForm() {
      this.resetForm("form");
    },
    handleNameBlur() {
      let data = this.openBatchAdd ? this.formBatch : this.form;
      if (!data.name || data.name.length == 0) {
        return;
      }
      if (
        !data.alias ||
        data.alias.length == 0 ||
        !data.path ||
        data.path.length == 0
      ) {
        generateAliasAndPath({ parentId: data.parentId, name: data.name }).then(
          (response) => {
            if (!data.alias || data.alias.length == 0) {
              data.alias = response.data.alias;
            }
            if (!data.path || data.path.length == 0) {
              data.path = response.data.path;
            }
          }
        );
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.resetAddForm();
      this.form = {
        parentId: this.selectedCatalogId,
        alias: "",
        path: "",
        catalogType: this.catalogTypeOptions[0].id,
      };
      this.diagOpen = true;
    },
    /** 新增栏目提交 */
    handleAddSave: function () {
      this.$refs["form"]
        .validate()
        .then(() => {
          if (!this.selectedCatalogId) {
            this.form.parentId = 0;
          }
          addCatalog(this.form).then((response) => {
            this.$cache.local.set(
              "LastSelectedCatalogId",
              response.data.catalogId
            );
            this.diagOpen = false;
            message.success(this.$t("Common.AddSuccess"));
            this.loadCatalogTreeData();
          });
        })
        .catch(() => {});
    },
    handleBatchAdd() {
      this.formBatch = { parentId: this.selectedCatalogId };
      this.openBatchAdd = true;
    },
    handleBatchAddSave() {
      this.$refs["formBatch"]
        .validate()
        .then(() => {
          this.loading = true;
          batchAddCatalog(this.formBatch).then((response) => {
            this.openBatchAdd = false;
            this.loading = false;
            message.success(this.$t("Common.AddSuccess"));
            this.loadCatalogTreeData();
          });
        })
        .catch(() => {});
    },
    handlePreview(data) {
      let routeData = this.$router.resolve({
        path: "/cms/preview",
        query: { type: "catalog", dataId: data.id },
      });
      window.open(routeData.href, "_blank");
    },
    handleSortUp(nodeData) {
      let data = { catalogId: nodeData.id, sort: -1 };
      sortCatalog(data).then((response) => {
        message.success(this.$t("Common.OpSuccess"));
        this.loadCatalogTreeData();
      });
    },
    handleSortDown(nodeData) {
      let data = { catalogId: nodeData.id, sort: 1 };
      sortCatalog(data).then((response) => {
        message.success(this.$t("Common.OpSuccess"));
        this.loadCatalogTreeData();
      });
    },
    handlePublish(nodeData) {
      this.publishCatalogId = nodeData.id;
      this.publishDialogVisible = true;
    },
    handleDoPublish() {
      const data = {
        catalogId: this.publishCatalogId,
        publishChild: this.publishChild,
        publishDetail: false,
        publishStatus: 30,
      };
      publishCatalog(data).then((response) => {
        this.taskId = response.data;
        this.progressTitle = this.$t("CMS.Catalog.PublishProgressTitle");
        this.progressType = "Publish";
        this.openProgress = true;
        this.$cache.local.set("publish_flag", "true");
      });
      this.publishDialogVisible = false;
      this.publishChild = false;
    },
    handleCloseProgress() {},
  },
};
</script>
<style scoped>
.catalog-tree .head-container {
  margin-bottom: 10px;
}
.catalog-tree .tree-header {
  font-size: 16px;
  font-weight: 700;
  line-height: 22px;
  color: #424242;
  width: 100%;
  text-align: left;
  padding-left: 4px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.catalog-tree-header:hover {
  background-color: #f5f7fa;
}
.catalog-tree .tree-node {
  width: 100%;
  line-height: 30px;
  position: relative;
  overflow: hidden;
}
.catalog-tree .tree-node .node-text {
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
}
.catalog-tree .tree-node .node-tool {
  display: none;
  position: absolute;
  right: 5px;
  top: 0;
}
.catalog-tree .tree-node:hover .node-tool {
  display: inline-block;
}
.catalog-tree .tree-node .node-tool .ant-btn {
  font-size: 14px;
}
</style>
