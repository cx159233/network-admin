<template>
  <div class="p-[20px]">
    <PageHeader
      :title="$t('CMS.Content.Tab.ContentList')"
      description="管理内容列表，支持新增、编辑、发布、下线和删除内容"
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
        <a-tabs v-model:activeKey="activeName" @change="handleTabClick" class="bg-surface rounded-[8px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden">
          <a-tab-pane
            :tab="$t('CMS.Content.Tab.ContentList')"
            key="contentList"
          >
            <div class="px-[16px] py-[16px]">
              <cms-content-list
                v-if="activeName === 'contentList'"
                :cid="selectedCatalogId"
              ></cms-content-list>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import PageHeader from '@/components/cloud/PageHeader.vue'
import CMSCatalogTree from "@/views/cms/contentcore/catalogTree";
import CMSContentList from "@/views/cms/contentcore/contentList";
import CMSPageWidget from "@/views/cms/contentcore/pageWidget";
import CMSContentRecycleList from "@/views/cms/contentcore/contentRecycleList";
export default {
  name: "CmsContentcoreContentManage",
  components: {
    PageHeader,
    "cms-catalog-tree": CMSCatalogTree,
    "cms-content-list": CMSContentList,
    "cms-pagewidget-list": CMSPageWidget,
    "cms-recycle-list": CMSContentRecycleList,
  },
  data() {
    return {
      loading: false,
      activeName: this.$route.params.tab || "contentList",
      selectedCatalogId: "",
    };
  },
  async created() {},
  methods: {
    handleTabClick(key) {},
    handleTreeNodeClick(data) {
      this.selectedCatalogId = data && data != null ? data.id : "";
    },
  },
};
</script>
