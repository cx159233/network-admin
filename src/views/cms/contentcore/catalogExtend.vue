<template>
  <div class="catalog-extend-container">
    <a-row :gutter="10" class="mb12">
      <a-col :span="1.5">
        <a-button
          type="primary"
          size="small"
          :disabled="!this.catalogId"
          v-hasPermi="[ $p('Catalog:Edit:{0}', [ catalogId ]) ]"
          @click="handleSaveExtends"
        >
          <template #icon><EditOutlined /></template>
          {{ $t("Common.Save") }}
        </a-button>
      </a-col>
      <a-col :span="1.5">
        <a-button
          type="primary"
          size="small"
          :disabled="!this.catalogId"
          v-hasPermi="[ $p('Catalog:Edit:{0}', [ catalogId ]) ]"
          @click="handleApplyAllToCatalog()"
        >
          <template #icon><ArrowDownOutlined /></template>
          {{ $t('CMS.Catalog.ApplyToChildren') }}
        </a-button>
      </a-col>
    </a-row>
    <a-spin :spinning="loading">
      <a-form
        class="catalog-extend-form"
        ref="form_extend"
        :model="form_extend"
        :disabled="!this.catalogId"
        :label-col="{ style: { width: '160px' } }">
        <a-card class="info-card">
          <template #title>
            <span>{{ $t('CMS.Catalog.Extend.Basic') }}</span>
          </template>
          <a-form-item :label="$t('CMS.Catalog.Extend.EnableIndex')" name="EnableIndex">
            <a-switch
              v-model:checked="form_extend.EnableIndex"
              :checked-children="$t('Common.Yes')"
              :un-checked-children="$t('Common.No')"
              checked-value="Y"
              un-checked-value="N">
            </a-switch>
          </a-form-item>
          <a-form-item :label="$t('CMS.Catalog.Extend.CatalogExModel')" name="CatalogExtendModel">
            <a-select
              class="mr5"
              v-model:value="form_extend.CatalogExtendModel"
              show-search
              allow-clear>
              <a-select-option
                v-for="item in exmodelOptions"
                :key="item.value"
                :value="item.value"
                :label="item.label">
                {{ item.label }}
              </a-select-option>
            </a-select>
            <a-button
              class="btn-apply-child"
              type="primary"
              @click="handleApplyToCatalog('CatalogExtendModel')"
            >
              <template #icon><CheckSquareOutlined /></template>
              {{ $t('CMS.ContentCore.ApplyToCatalog') }}
            </a-button>
          </a-form-item>
          <a-form-item :label="$t('CMS.Catalog.Extend.ContentExModel')" name="ContentExtendModel">
            <a-select
              class="mr5"
              v-model:value="form_extend.ContentExtendModel"
              show-search
              allow-clear>
              <a-select-option
                v-for="item in exmodelOptions"
                :key="item.value"
                :value="item.value"
                :label="item.label">
                {{ item.label }}
              </a-select-option>
            </a-select>
            <a-button
              class="btn-apply-child"
              type="primary"
              @click="handleApplyToCatalog('ContentExtendModel')"
            >
              <template #icon><CheckSquareOutlined /></template>
              {{ $t('CMS.ContentCore.ApplyToCatalog') }}
            </a-button>
          </a-form-item>
          <a-form-item :label="$t('CMS.Catalog.Extend.CatalogPageSize')" name="CatalogPageSize">
            <a-input-number v-model:value="form_extend.CatalogPageSize" :min="0"></a-input-number>
            <div style="color: #909399;font-size:12px;line-height: 30px;">
              <InfoCircleOutlined class="mr5" />{{ $t('CMS.Catalog.Extend.CatalogPageSizeTip') }}
            </div>
          </a-form-item>
        </a-card>
        <a-card class="info-card">
          <template #title>
            <span>{{ $t('CMS.Catalog.Extend.ContentConfig') }}</span>
          </template>
          <a-form-item :label="$t('CMS.Catalog.Extend.EnableContribute')" name="EnableContribute">
            <a-switch
              v-model:checked="form_extend.EnableContribute"
              :checked-children="$t('Common.Yes')"
              :un-checked-children="$t('Common.No')"
              checked-value="Y"
              un-checked-value="N">
            </a-switch>
          </a-form-item>
        </a-card>
        <a-card class="info-card">
          <template #title>
            <span>{{ $t('CMS.Catalog.Extend.WordConfig') }}</span>
          </template>
          <a-form-item :label="$t('CMS.Catalog.Extend.HotWordGroup')" name="HotWordGroups">
            <a-checkbox-group v-model:value="form_extend.HotWordGroups">
              <a-checkbox v-for="group in hotWordGroups" :value="group.code" :key="group.code">{{ group.name }}</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
        </a-card>
      </a-form>
    </a-spin>
    <!-- 栏目选择组件 -->
    <cms-catalog-selector
      v-model:open="openCatalogSelector"
      multiple
      @ok="doApplyToCatalog"
      @close="handleCatalogSelectorClose"></cms-catalog-selector>
  </div>
</template>
<script>
import { getCatalogExtends, saveCatalogExtends, applyConfigPropsToChildren } from "@/api/contentcore/catalog";
import { getHotWordGroupOptions } from "@/api/contentcore/word";
import { listXModelOptions } from "@/api/contentcore/exmodel";
import CMSCatalogSelector from "@/views/cms/contentcore/catalogSelector";
import { message } from "ant-design-vue";
import {
  EditOutlined,
  ArrowDownOutlined,
  CheckSquareOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons-vue";

export default {
  name: "CMSCatalogExtend",
  components: {
    "cms-catalog-selector": CMSCatalogSelector,
    EditOutlined,
    ArrowDownOutlined,
    CheckSquareOutlined,
    InfoCircleOutlined,
  },
  props: {
    cid: {
      type: String,
      default: undefined,
      required: true,
    }
  },
  data () {
    return {
      loading: false,
      siteId: undefined,
      catalogId: this.cid,
      openCatalogSelector: false,
      applyConfigPropKey: "",
      exmodelOptions: [],
      form_extend: {
        HotWordGroups: []
      },
      hotWordGroups: []
    };
  },
  watch: {
    cid(newVal) {
      this.catalogId = newVal;
    },
    catalogId(newVal) {
      if (newVal && newVal > 0) {
        this.loadCatalogExtends();
      } else {
        this.form_extend = { HotWordGroups: [] };
      }
    },
  },
  created() {
    this.loadEXModelList();
    this.loadHotWordGroups();
    this.loadCatalogExtends();
  },
  methods: {
    loadCatalogExtends () {
      this.loading = true;
      const params = { catalogId: this.catalogId };
      getCatalogExtends(params).then(response => {
        this.form_extend = response.data;
        this.siteId = response.data.siteId;
        this.loading = false;
      });
    },
    loadEXModelList() {
      listXModelOptions().then(response => {
        this.exmodelOptions = response.data.rows.map(m => {
          return { label: m.name, value: m.modelId };
        });
      });
    },
    loadHotWordGroups() {
      getHotWordGroupOptions().then(response => {
        this.hotWordGroups = response.data.rows;
      });
    },
    handleSaveExtends () {
      console.log("handleSaveExtends", 1);
      this.$refs["form_extend"].validate().then(() => {
        const data = {};
        Object.keys(this.form_extend).forEach(key => {
          if (typeof this.form_extend[key] == 'object') {
            data[key] = JSON.stringify(this.form_extend[key]);
          } else {
            data[key] = this.form_extend[key];
          }
        });
        saveCatalogExtends(this.catalogId, data).then(response => {
          message.success(this.$t('Common.SaveSuccess'));
        });
      }).catch(() => {});
    },
    handleApplyAllToCatalog() {
      const data = {
        catalogId: this.catalogId,
        allExtends: true
      }
      this.$modal.loading("Loading...");
      applyConfigPropsToChildren(data).then(res => {
        this.$modal.closeLoading();
        message.success(res.msg);
      });
    },
    handleApplyToCatalog(propKey) {
      this.openCatalogSelector = true;
      this.applyConfigPropKey = propKey;
    },
    doApplyToCatalog (catalogs) {
      const data = {
        catalogId: this.catalogId,
        toCatalogIds: catalogs.map(c => c.id),
        configPropKeys: [ this.applyConfigPropKey ]
      }
      applyConfigPropsToChildren(data).then(res => {
        message.success(res.msg);
        this.openCatalogSelector = false;
      });
    },
    handleCatalogSelectorClose() {
      this.applyConfigPropKey = "";
      this.openCatalogSelector = false;
    }
  }
};
</script>
<style scoped>
.catalog-extend-form .ant-form-item {
  margin-bottom: 12px;
  width: 700px;
}
.catalog-extend-form .info-card {
  margin-bottom: 10px;
}
.catalog-extend-form :deep(.ant-input),
.catalog-extend-form :deep(.ant-select),
.catalog-extend-form :deep(.ant-input-number) {
  width: 301.5px;
}
.catalog-extend-form :deep(.ant-upload-list) {
  width: 300px;
}
.catalog-extend-form .btn-apply-child {
  padding: 10px;
}
</style>
