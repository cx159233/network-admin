<template>
  <div class="p-[20px]">
    <PageHeader
      :title="$t('CMS.Catalog.Tab.Basic')"
      description="管理栏目信息，支持新增、编辑和删除栏目"
    />

    <a-row :gutter="20">
      <a-col :span="4" :xs="24">
        <cms-catalog-tree
          ref="catalogTree"
          :new-btn="true"
          @node-click="handleTreeNodeClick"
        >
        </cms-catalog-tree>
      </a-col>
      <a-col :span="20" :xs="24">
        <CloudCard class="catalog-page__table-card">
          <div class="catalog-page__table-wrap">
            <a-tabs v-model:activeKey="activeName" @change="handleTabClick">
              <a-tab-pane :tab="$t('CMS.Catalog.Tab.Basic')" key="basicInfo">
                <cms-catalog-info
                  v-if="activeName == 'basicInfo'"
                  :key="selectedCatalogId"
                  :cid="selectedCatalogId"
                  @update="handleCatalogUpdate"
                  @remove="handleCatalogDelete"
                ></cms-catalog-info>
              </a-tab-pane>
            </a-tabs>
          </div>
        </CloudCard>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import CMSCatalogTree from "@/views/cms/contentcore/catalogTree";
import CMSCatalogInfo from "@/views/cms/contentcore/catalogInfo";
import CMSCatalogExtend from "@/views/cms/contentcore/catalogExtend";

export default {
  name: "CmsContentcoreCatalog",
  components: {
    PageHeader,
    CloudCard,
    "cms-catalog-tree": CMSCatalogTree,
    "cms-catalog-info": CMSCatalogInfo,
    "cms-catalog-extend": CMSCatalogExtend,
  },
  data() {
    return {
      activeName: "basicInfo",
      selectedCatalogId: undefined,
    };
  },
  computed: {
    selectedCatalog() {
      return this.selectedCatalogId && this.selectedCatalogId.length > 0;
    },
  },
  methods: {
    handleTabClick(key) {},
    handleCatalogUpdate() {
      this.$refs.catalogTree.loadCatalogTreeData();
    },
    handleCatalogDelete() {
      this.$refs.catalogTree.loadCatalogTreeData();
    },
    handleTreeNodeClick(data) {
      this.selectedCatalogId = data && data != null ? data.id : "";
    },
  },
};
</script>
<style scoped>
.catalog-page {
  padding: 4px 0;
}

.catalog-page__divider {
  height: 1px;
  background: #F2F3F5;
  margin: 0 16px;
}

.catalog-page__table-wrap {
  padding: 0 16px 16px 16px;
}
</style>
