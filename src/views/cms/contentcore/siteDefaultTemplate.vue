<template>
  <div class="site-def-temp-container">
    <div class="mb12">
      <a-button
        type="primary"
        ghost
        :disabled="!siteId"
        v-hasPermi="[$p('Site:Edit:{0}', [siteId])]"
        @click="handleSave"
      >
        <template #icon><EditOutlined /></template>
        {{ $t("Common.Save") }}
      </a-button>
    </div>
    <a-spin :spinning="loading">
      <a-form
        ref="form"
        :model="form"
        :disabled="!siteId"
        :label-col="{ style: { width: '260px' } }"
      >
        <a-card class="mb10" :title="$t('CMS.Site.DefaultTemplate.Title')">
          <a-tabs v-model:activeKey="publishPipeActiveName">
            <a-tab-pane
              v-for="pp in form.publishPipeProps"
              :key="pp.pipeCode"
              :tab="pp.pipeName"
            >
              <a-divider orientation="left" plain>
                {{ $t("CMS.Site.DefaultTemplate.StaticizePageConfig") }}
              </a-divider>
              <a-form-item :label="$t('CMS.Site.DefaultTemplate.CatalogList')" name="defaultListTemplate">
                <a-input v-model:value="pp.props.defaultListTemplate" style="width: 320px">
                  <template #append>
                    <a-button type="primary" @click="handleSelectTemplate('defaultListTemplate')">
                      {{ $t("Common.Select") }}
                    </a-button>
                  </template>
                </a-input>
                <a-button class="ml8" @click="handleApplyToCatalog('defaultListTemplate')">
                  {{ $t("CMS.ContentCore.ApplyToCatalog") }}
                </a-button>
              </a-form-item>
              <a-form-item
                v-for="ct of contentTypes"
                :key="ct.id"
                :label="ct.name + $t('CMS.Site.DefaultTemplate.ContentDetail')"
                :name="`defaultDetailTemplate_${ct.id}`"
              >
                <a-input v-model:value="pp.props[`defaultDetailTemplate_${ct.id}`]" style="width: 320px">
                  <template #append>
                    <a-button type="primary" @click="handleSelectTemplate(`defaultDetailTemplate_${ct.id}`)">
                      {{ $t("Common.Select") }}
                    </a-button>
                  </template>
                </a-input>
                <a-button class="ml8" @click="handleApplyToCatalog(`defaultDetailTemplate_${ct.id}`)">
                  {{ $t("CMS.ContentCore.ApplyToCatalog") }}
                </a-button>
              </a-form-item>
              <a-form-item :label="$t('CMS.Site.DefaultTemplate.CustomForm')" name="defaultCustomFormTemplate">
                <a-input v-model:value="pp.props.defaultCustomFormTemplate" style="width: 320px">
                  <template #append>
                    <a-button type="primary" @click="handleSelectTemplate('defaultCustomFormTemplate')">
                      {{ $t("Common.Select") }}
                    </a-button>
                  </template>
                </a-input>
                <a-button class="ml8" @click="handleApplyToCatalog('defaultCustomFormTemplate')">
                  {{ $t("CMS.ContentCore.ApplyToCatalog") }}
                </a-button>
              </a-form-item>
              <a-divider orientation="left" plain>
                {{ $t("CMS.Site.DefaultTemplate.DynamicPageConfig") }}
              </a-divider>
              <a-form-item
                v-for="dpt in dynamicPageTypes"
                :key="dpt.type"
                :label="dpt.name"
                :name="dpt.publishPipeKey"
              >
                <a-input v-model:value="pp.props[dpt.publishPipeKey]" style="width: 320px">
                  <template #append>
                    <a-button type="primary" @click="handleSelectTemplate(dpt.publishPipeKey)">
                      {{ $t("Common.Select") }}
                    </a-button>
                  </template>
                </a-input>
              </a-form-item>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-form>
    </a-spin>
    <!-- 栏目选择组件 -->
    <cms-catalog-selector
      :open="openCatalogSelector"
      multiple
      @ok="doApplyToCatalog"
      @close="handleCatalogSelectorClose"
    ></cms-catalog-selector>
    <!-- 模板选择组件 -->
    <cms-template-selector
      :open="openTemplateSelector"
      :publishPipeCode="publishPipeActiveName"
      @ok="handleTemplateSelected"
      @cancel="handleTemplateSelectorCancel"
    />
  </div>
</template>
<script>
import { EditOutlined } from "@ant-design/icons-vue";
import { getDefaultTemplates, saveDefaultTemplates, applyDefaultTemplate, getDynamicPageTypes } from "@/api/contentcore/site";
import { getContentTypes } from "@/api/contentcore/catalog";
import CMSTemplateSelector from "@/views/cms/contentcore/templateSelector";
import CMSCatalogSelector from "@/views/cms/contentcore/catalogSelector";

export default {
  name: "CMSSiteDefaultTemplate",
  components: {
    "cms-catalog-selector": CMSCatalogSelector,
    "cms-template-selector": CMSTemplateSelector,
    EditOutlined,
  },
  props: {
    site: {
      type: String,
      default: undefined,
      required: false,
    },
  },
  watch: {
    site(newVal) {
      this.siteId = newVal;
    },
    siteId(newVal) {
      if (newVal != undefined && newVal != null && newVal.length > 0) {
        this.loadDefaultTemplates();
      }
    },
  },
  data() {
    return {
      loading: false,
      siteId: this.site,
      contentTypes: [],
      dynamicPageTypes: [],
      openCatalogSelector: false,
      publishPipeActiveName: "",
      openTemplateSelector: false,
      templatePropKey: "",
      form: {},
    };
  },
  created() {
    this.loadContentTypes();
    this.loadDynamicPageTypes();
    this.loadDefaultTemplates();
  },
  methods: {
    loadContentTypes() {
      getContentTypes().then((response) => {
        this.contentTypes = response.data;
      });
    },
    loadDynamicPageTypes() {
      getDynamicPageTypes().then((response) => {
        this.dynamicPageTypes = response.data;
      });
    },
    loadDefaultTemplates() {
      if (!this.siteId) {
        return;
      }
      this.loading = true;
      const params = { siteId: this.siteId };
      getDefaultTemplates(params)
        .then((response) => {
          this.form = response.data;
          if (this.form.publishPipeProps.length > 0) {
            this.publishPipeActiveName = this.form.publishPipeProps[0].pipeCode;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleSave() {
      saveDefaultTemplates(this.form).then(() => {
        this.$modal.msgSuccess(this.$t("Common.SaveSuccess"));
      });
    },
    handleSelectTemplate(propKey) {
      this.templatePropKey = propKey;
      this.openTemplateSelector = true;
    },
    handleTemplateSelected(template) {
      this.form.publishPipeProps.map((item) => {
        if (item.pipeCode == this.publishPipeActiveName) {
          item.props[this.templatePropKey] = template;
        }
      });
      this.openTemplateSelector = false;
    },
    handleTemplateSelectorCancel() {
      this.openTemplateSelector = false;
    },
    handleApplyToCatalog(propKey) {
      this.openCatalogSelector = true;
      this.templatePropKey = propKey;
    },
    doApplyToCatalog(catalogs) {
      if (catalogs.length == 0) {
        this.$modal.msgWarning(this.$t("CMS.Site.DefaultTemplate.SelectCatalogFirst"));
        return;
      }
      const data = {
        siteId: this.siteId,
        toCatalogIds: catalogs.map((c) => c.id),
      };
      this.form.publishPipeProps.forEach((item) => {
        if (item.pipeCode == this.publishPipeActiveName) {
          data.publishPipeProps = [{ pipeCode: item.pipeCode, props: {} }];
          data.publishPipeProps[0].props[this.templatePropKey] = "";
        }
      });
      applyDefaultTemplate(data).then((res) => {
        this.$modal.msgSuccess(res.msg);
        this.openCatalogSelector = false;
      });
    },
    handleCatalogSelectorClose() {
      this.openCatalogSelector = false;
    },
  },
};
</script>
<style scoped>
.site-def-temp-container .ant-form-item {
  margin-bottom: 18px;
  width: 800px;
}
.mb12 {
  margin-bottom: 12px;
}
.mb10 {
  margin-bottom: 10px;
}
.ml8 {
  margin-left: 8px;
}
</style>
