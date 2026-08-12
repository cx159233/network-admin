<template>
  <div id="catalog-selector">
    <a-modal
      :title="$t('CMS.Catalog.SelectCatalog')"
      :open="visible"
      @update:open="v => visible = v"
      width="450px"
      :mask-closable="false"
      class="catalog-selector"
      :get-container="getModalContainer"
    >
      <div v-if="showToolbar" class="header-toolbar">
        <div v-if="showCopyToolbar">
          <a-radio-group v-model:value="copyType" size="small">
            <a-radio-button value="1">{{
              $t("CMS.Catalog.CopyContent")
            }}</a-radio-button>
            <a-radio-button value="2">{{
              $t("CMS.Catalog.MappingContent")
            }}</a-radio-button>
          </a-radio-group>
          <a-tooltip placement="right" style="margin-left: 5px">
            <template #title>
              {{ $t("CMS.Catalog.CopyContentTip") }}<br />
              {{ $t("CMS.Catalog.MappingContentTip") }}
            </template>
            <InfoCircleOutlined />
          </a-tooltip>
        </div>
      </div>
      <div class="search-toolbar">
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
        <div style="max-height: 400px; overflow-y: auto">
          <a-button
            v-if="showRootNode"
            type="text"
            :class="'tree-root' + (rootSelected ? ' cc-current' : '')"
            @click="handleTreeRootClick"
          >
            <template #icon><HomeOutlined /></template>
            {{ siteName }}
          </a-button>
          <a-tree
            v-if="catalogOptions"
            :tree-data="catalogOptions"
            :field-names="fieldNames"
            :show-line="false"
            :checkable="multiple"
            :check-strictly="checkStrictly"
            :default-expand-all="true"
            :loading="loading"
            @select="handleTreeSelect"
            @check="handleTreeCheck"
          >
            <template #title="{ key, title, disabled }">
              <span
                :id="'tn-' + key"
                :class="disabled ? 'cc-disabled' : ''"
              >{{ title }}</span>
            </template>
          </a-tree>
        </div>
      </div>
      <template #footer>
        <a-button type="primary" @click="handleOk">{{
          $t("Common.Confirm")
        }}</a-button>
        <a-button @click="handleCancel">{{ $t("Common.Cancel") }}</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { getCatalogTreeData } from "@/api/contentcore/catalog";
import { SearchOutlined, HomeOutlined, InfoCircleOutlined } from "@ant-design/icons-vue";

export default {
  name: "CMSCatalogSelector",
  components: {
    SearchOutlined,
    HomeOutlined,
    InfoCircleOutlined,
  },
  props: {
    open: {
      type: Boolean,
      default: false,
      required: true,
    },
    showCopyToolbar: {
      type: Boolean,
      default: false,
      required: false,
    },
    showRootNode: {
      type: Boolean,
      default: false,
      required: false,
    },
    multiple: {
      type: Boolean,
      default: false,
      required: false,
    },
    checkStrictly: {
      type: Boolean,
      default: true,
      required: false,
    },
    disableLink: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  computed: {
    showToolbar() {
      return this.showCopyToolbar;
    },
  },
  data() {
    return {
      loading: false,
      visible: this.open,
      filterCatalogName: undefined,
      catalogOptions: undefined,
      siteName: undefined,
      rootSelected: false,
      selectedCatalogs: [],
      copyType: '1',
      fieldNames: {
        children: "children",
        title: "label",
        key: "id",
      },
    };
  },
  watch: {
    open() {
      this.visible = this.open;
    },
    visible(newVal) {
      if (!newVal) {
        this.handleCancel();
      } else {
        this.loadCatalogTreeData();
      }
    },
    filterCatalogName(val) {
      // antd-vue tree filtering is done via expandedKeys + filterTreeNode
      // for now, this triggers a re-render of filtered nodes
    },
  },
  methods: {
    getModalContainer() {
      return document.body;
    },
    loadCatalogTreeData() {
      this.selectedCatalogs = [];
      this.rootSelected = false;
      this.loading = true;
      getCatalogTreeData({ disableLink: this.disableLink }).then((response) => {
        if (response.code == 200) {
          this.catalogOptions = response.data.rows;
          this.siteName = response.data.siteName;
        }
        this.loading = false;
      });
    },
    setNodeHighlight(node) {
      document
        .querySelectorAll(".cc-current")
        .forEach((item) => item.classList.remove("cc-current"));
      if (node) {
        const el = document.querySelector("#tn-" + node.key);
        if (el) el.classList.add("cc-current");
      }
    },
    handleTreeSelect(selectedKeys, info) {
      if (!this.multiple && selectedKeys.length > 0) {
        const node = info.node;
        const data = (node && node.dataRef) || {};
        if (!this.disableLink || !data.disabled) {
          this.setNodeHighlight(node);
          this.selectedCatalogs = [
            { id: data.id, name: data.label, props: data.props || data },
          ];
          this.rootSelected = false;
        }
      }
    },
    handleTreeCheck(checkedKeys, info) {
      if (this.multiple) {
        this.selectedCatalogs = (info.checkedNodes || []).map((item) => ({
          id: item.id,
          name: item.label,
          props: item.props || item,
        }));
      }
    },
    handleTreeRootClick() {
      if (!this.multiple) {
        this.selectedCatalogs = [{ id: "0", name: this.siteName, props: {} }];
        this.rootSelected = true;
      }
    },
    handleOk() {
      if (this.selectedCatalogs.length == 0) {
        this.$modal.alertWarning(this.$t("CMS.Catalog.SelectCatalogFirst"));
        return;
      }
      this.setNodeHighlight();
      this.$emit("ok", this.selectedCatalogs, this.copyType);
    },
    handleCancel() {
      this.$emit("close");
      this.selectedCatalogs = [];
      this.copyType = '1';
    },
  },
};
</script>
<style>
.catalog-selector .header-toolbar {
  margin-bottom: 10px;
}
.catalog-selector .tree-container {
  margin: 10px 0;
}
.catalog-selector .tree-container .tree-root {
  width: 100%;
  text-align: left;
  border-radius: 0;
  padding: 5px;
}
.catalog-selector .tree-container .tree-root:hover {
  background-color: #f5f7fa;
}
.catalog-selector .tree-container .cc-current {
  color: #409eff;
}
.catalog-selector .tree-container .cc-disabled {
  color: #c0c4cc;
  cursor: not-allowed;
}
</style>
