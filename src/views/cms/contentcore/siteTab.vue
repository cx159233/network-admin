<template>
  <div class="p-[20px]">
    <a-tabs v-model:activeKey="activeName">
      <a-tab-pane :tab="$t('CMS.Site.Tab.Basic')" key="basicInfo">
        <cms-site-info v-if="activeName === 'basicInfo'" :site="siteId"></cms-site-info>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import CMSSiteInfo from "@/views/cms/contentcore/siteInfo";
import CMSSiteExtend from "@/views/cms/contentcore/siteExtend";
import CMSSiteProperty from "@/views/cms/contentcore/siteProperty";
import CMSSiteDefaultTemplate from "@/views/cms/contentcore/siteDefaultTemplate";

export default {
  name: "CMSSiteTab",
  components: {
    "cms-site-info": CMSSiteInfo,
    "cms-site-extend": CMSSiteExtend,
    "cms-site-property": CMSSiteProperty,
    "cms-site-dtemplate": CMSSiteDefaultTemplate,
  },
  data() {
    return {
      activeName: "basicInfo",
      siteId: this.$route.query.siteId,
    };
  },
};
</script>
