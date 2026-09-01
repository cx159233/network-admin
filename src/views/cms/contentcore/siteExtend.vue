<template>
  <div class="site-extend-container">
    <div class="mb12">
      <a-button
        type="primary"
        ghost
        size="small"
        :disabled="!siteId"
        v-hasPermi="[ $p('Site:Edit:{0}', [ siteId ]) ]"
        @click="handleSaveExtend"
      >
        <template #icon><EditOutlined /></template>
        {{ $t("Common.Save") }}
      </a-button>
    </div>
    <a-spin :spinning="loading">
      <a-form
        ref="form_extend"
        :model="form_extend"
        :disabled="!siteId"
        :label-col="{ style: { width: '200px' } }"
      >
        <a-card class="mb10">
          <template #title>
            <span>{{ $t("CMS.Site.Extend.BasicCardTitle") }}</span>
          </template>
          <a-form-item :label="$t('CMS.Site.Extend.EnableIndex')" name="EnableIndex">
            <a-switch
              v-model:checked="form_extend.EnableIndex"
              :checked-children="$t('Common.Yes')"
              :un-checked-children="$t('Common.No')"
              checked-value="Y"
              un-checked-value="N">
            </a-switch>
          </a-form-item>
          <a-form-item :label="$t('CMS.Site.Extend.TitleRepeatCheck')" name="RepeatTitleCheck">
            <a-select v-model:value="form_extend.RepeatTitleCheck" show-search option-filter-prop="label">
              <a-select-option
                v-for="item in repeatCheckOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label="$t('CMS.Site.Extend.ExModel')" name="SiteExtendModel">
            <a-select
              v-model:value="form_extend.SiteExtendModel"
              show-search
              option-filter-prop="label"
              allow-clear>
              <a-select-option
                v-for="item in exmodelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label="$t('CMS.Site.Extend.PublishMaxPageNum')" name="MaxPageOnContentPublish">
            <a-input-number v-model:value="form_extend.MaxPageOnContentPublish" :min="-1"></a-input-number>
          </a-form-item>
          <a-form-item :label="$t('CMS.Site.Extend.EnableEditPublished')" name="PublishedContentEdit">
            <a-switch
              v-model:checked="form_extend.PublishedContentEdit"
              :checked-children="$t('Common.Yes')"
              :un-checked-children="$t('Common.No')"
              checked-value="Y"
              un-checked-value="N">
            </a-switch>
          </a-form-item>
          <a-form-item :label="$t('CMS.Site.Extend.EnableSSI')" name="SSIEnabled">
            <a-switch
              v-model:checked="form_extend.SSIEnabled"
              :checked-children="$t('Common.Yes')"
              :un-checked-children="$t('Common.No')"
              checked-value="Y"
              un-checked-value="N">
            </a-switch>
          </a-form-item>
          <a-form-item :label="$t('CMS.Site.Extend.EnableSiteDeleteBackup')" name="EnableSiteDeleteBackup">
            <a-switch
              v-model:checked="form_extend.EnableSiteDeleteBackup"
              :checked-children="$t('Common.Yes')"
              :un-checked-children="$t('Common.No')"
              checked-value="Y"
              un-checked-value="N">
            </a-switch>
          </a-form-item>
          <a-form-item :label="$t('CMS.Site.Extend.SiteApiUrl')" name="SiteApiUrl">
            <a-input v-model:value="form_extend.SiteApiUrl" placeholder="http(s)://"></a-input>
          </a-form-item>
        </a-card>
        <a-card class="mb10">
          <template #title>
            <span>{{ $t("CMS.Site.Extend.CatalogConfCardTitle") }}</span>
          </template>
          <a-form-item :label="$t('CMS.Site.Extend.CatalogPageSize')" name="CatalogPageSize">
            <a-input-number v-model:value="form_extend.CatalogPageSize" :min="0"></a-input-number>
            <div style="color: #909399;font-size:12px;line-height: 30px;">
              <InfoCircleOutlined class="mr5" />{{ $t('CMS.Site.Extend.CatalogPageSizeTip') }}
            </div>
          </a-form-item>
        </a-card>
        <a-card class="mb10">
          <template #title>
            <span>{{ $t("CMS.Site.Extend.ContentConfCardTitle") }}</span>
          </template>
          <!-- <a-form-item
            label="文章正文图片尺寸">
            宽：<a-input v-model:value="form_extend.ArticleImageWidth" style="width:100px"></a-input>
            高：<a-input v-model:value="form_extend.ArticleImageHeight" style="width:100px"></a-input>
          </a-form-item> -->
          <a-form-item :label="$t('CMS.Site.Extend.AutoArticleLogo')" name="AutoArticleLogo">
            <a-switch
              v-model:checked="form_extend.AutoArticleLogo"
              :checked-children="$t('Common.Yes')"
              :un-checked-children="$t('Common.No')"
              checked-value="Y"
              un-checked-value="N">
            </a-switch>
          </a-form-item>
          <a-form-item :label="$t('CMS.Site.Extend.DownloadRemoteImage')" name="DownloadRemoteImage">
            <a-switch
              v-model:checked="form_extend.DownloadRemoteImage"
              :checked-children="$t('Common.Yes')"
              :un-checked-children="$t('Common.No')"
              checked-value="Y"
              un-checked-value="N">
            </a-switch>
          </a-form-item>
          <a-form-item :label="$t('CMS.Site.Extend.RecycleKeepDays')" name="RecycleKeepDays">
            <a-input-number v-model:value="form_extend.RecycleKeepDays" :min="0"></a-input-number>
            <div style="color: #909399;font-size:12px;line-height: 30px;">
              <InfoCircleOutlined class="mr5" />{{ $t('CMS.Site.Extend.RecycleKeepDaysTip') }}
            </div>
          </a-form-item>
        </a-card>
        <a-card class="mb10">
          <template #title>
            <span>{{ $t("CMS.Site.Extend.ResourceConfCardTitle") }}</span>
          </template>
          <a-form-item :label="$t('CMS.Site.Extend.ThumbnailWidth')">
            <a-input-number v-model:value="form_extend.ThumbnailWidth" :min="0"></a-input-number>
          </a-form-item>
          <a-form-item :label="$t('CMS.Site.Extend.ThumbnailHeight')">
            <a-input-number v-model:value="form_extend.ThumbnailHeight" :min="0"></a-input-number>
            <div style="color: #909399;font-size:12px;line-height: 30px;">
              <InfoCircleOutlined class="mr5" />{{ $t('CMS.Site.Extend.ThumbnailSizeTip') }}
            </div>
          </a-form-item>
          <a-form-item :label="$t('CMS.Site.Extend.StorageType')" name="FileStorageType">
            <a-radio-group v-model:value="form_extend.FileStorageType" size="small" @change="handleFileStorageTypeChange">
              <a-radio-button
                v-for="rt in storageTypes"
                :key="rt.id"
                :value="rt.id">{{ rt.name }}</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item v-if="form_extend.FileStorageType != 'Local'" label="access key">
            <a-input v-model:value="form_extend.FileStorageArgs.accessKey"></a-input>
          </a-form-item>
          <a-form-item v-if="form_extend.FileStorageType != 'Local'" label="access secret">
            <a-input v-model:value="form_extend.FileStorageArgs.accessSecret"></a-input>
          </a-form-item>
          <a-form-item v-if="form_extend.FileStorageType != 'Local'" label="bucket">
            <a-input v-model:value="form_extend.FileStorageArgs.bucket"></a-input>
          </a-form-item>
          <a-form-item v-if="form_extend.FileStorageType != 'Local'" label="domain">
            <a-input v-model:value="form_extend.FileStorageArgs.domain"></a-input>
          </a-form-item>
          <a-form-item v-if="form_extend.FileStorageType != 'Local'" label="endpoint">
            <a-input v-model:value="form_extend.FileStorageArgs.endpoint"></a-input>
          </a-form-item>
          <a-form-item v-if="form_extend.FileStorageType != 'Local'" label="pipeline">
            <a-input v-model:value="form_extend.FileStorageArgs.pipeline"></a-input>
          </a-form-item>
        </a-card>
        <a-card class="mb10">
          <template #title>
            <span>{{ $t("CMS.Site.Extend.ImageWatermarkCardTitle") }}</span>
          </template>
          <a-form-item :label="$t('CMS.Site.Extend.ImageWatermark')" name="ImageWatermark">
            <a-switch
              v-model:checked="form_extend.ImageWatermark"
              :checked-children="$t('Common.Yes')"
              :un-checked-children="$t('Common.No')"
              checked-value="Y"
              un-checked-value="N">
            </a-switch>
          </a-form-item>
          <a-form-item v-show="form_extend.ImageWatermark=='Y'" :label="$t('CMS.Site.Extend.WatermarkImage')">
            <cms-image-viewer
              :path="form_extend.ImageWatermarkArgs.image"
              :src="watermarkImageSrc"
              :site="siteId"
              action="/cms/site/upload_watermarkimage"
              @change="handleWatermarkImageChange"
            ></cms-image-viewer>
          </a-form-item>
          <a-form-item v-show="form_extend.ImageWatermark=='Y'" :label="$t('CMS.Site.Extend.WatermarkPosition')">
            <div class="watermarker_position">
              <a-radio-group v-model:value="form_extend.ImageWatermarkArgs.position" size="small">
                <a-radio-button value="TOP_LEFT">↖</a-radio-button>
                <a-radio-button value="TOP_CENTER">↑</a-radio-button>
                <a-radio-button value="TOP_RIGHT">↗</a-radio-button>
                <a-radio-button value="CENTER_LEFT">←</a-radio-button>
                <a-radio-button value="CENTER">┼</a-radio-button>
                <a-radio-button value="CENTER_RIGHT">-&gt;</a-radio-button>
                <a-radio-button value="BOTTOM_LEFT">↙</a-radio-button>
                <a-radio-button value="BOTTOM_CENTER">↓</a-radio-button>
                <a-radio-button value="BOTTOM_RIGHT">↘</a-radio-button>
              </a-radio-group>
            </div>
          </a-form-item>
          <a-form-item v-show="form_extend.ImageWatermark=='Y'" :label="$t('CMS.Site.Extend.WatermarkOpacity')">
            <a-input-number
              v-model:value="form_extend.ImageWatermarkArgs.opacity"
              :precision="1"
              :step="0.1"
              :min="0.1"
              :max="1"></a-input-number>
            <a-tooltip placement="right">
              <template #title>
                {{ $t('CMS.Site.Extend.WatermarkOpacityTip') }}
              </template>
              <span class="ml5"><InfoCircleOutlined /></span>
            </a-tooltip>
          </a-form-item>
          <a-form-item v-show="form_extend.ImageWatermark=='Y'" :label="$t('CMS.Site.Extend.WatermarkRatio')">
            <a-input-number
              v-model:value="form_extend.ImageWatermarkArgs.ratio"
              :step="1"
              :min="1"
              :max="100"></a-input-number>
            <a-tooltip placement="right">
              <template #title>
                {{ $t('CMS.Site.Extend.WatermarkRatioTip') }}
              </template>
              <span class="ml5"><InfoCircleOutlined /></span>
            </a-tooltip>
          </a-form-item>
        </a-card>
        <a-card class="mb10">
          <template #title>
            <span>{{ $t('CMS.Site.Extend.WordConfCardTitle') }}</span>
          </template>
          <a-form-item
            :label="$t('CMS.Site.Extend.SensitiveWordEnable')"
            name="SensitiveWordEnable">
            <a-switch
              v-model:checked="form_extend.SensitiveWordEnable"
              :checked-children="$t('Common.Yes')"
              :un-checked-children="$t('Common.No')"
              checked-value="Y"
              un-checked-value="N">
            </a-switch>
          </a-form-item>
          <a-form-item
            :label="$t('CMS.Site.Extend.ErrorProneWordEnable')"
            name="ErrorProneWordEnable">
            <a-switch
              v-model:checked="form_extend.ErrorProneWordEnable"
              :checked-children="$t('Common.Yes')"
              :un-checked-children="$t('Common.No')"
              checked-value="Y"
              un-checked-value="N">
            </a-switch>
          </a-form-item>
          <a-form-item
            :label="$t('CMS.Site.Extend.HotWordGroup')"
            name="HotWordGroups">
            <a-checkbox-group v-model:value="form_extend.HotWordGroups">
              <a-checkbox v-for="group in hotWordGroups" :key="group.code" :value="group.code">{{ group.name }}</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
        </a-card>
        <a-card class="mb10">
          <template #title>
            <span>{{ $t('CMS.Site.Extend.SEO') }}</span>
          </template>
          <a-form-item
            :label="$t('CMS.Site.Extend.BaiduPushAccessSecret')"
            name="BaiduPushAccessSecret">
            <a-input v-model:value="form_extend.BaiduPushAccessSecret"></a-input>
          </a-form-item>
        </a-card>
        <a-card class="mb10">
          <template #title>
            <span>{{ $t('CMS.Site.Extend.StatConfCardTitle') }}</span>
          </template>
          <a-form-item
            :label="$t('CMS.Site.Extend.BaiduApiKey')"
            name="BaiduTjApiKey">
            <a-input v-model:value="form_extend.BaiduTjApiKey"></a-input>
          </a-form-item>
          <a-form-item
            :label="$t('CMS.Site.Extend.BaiduSecretKey')"
            name="BaiduTjSecretKey">
            <a-input v-model:value="form_extend.BaiduTjSecretKey"></a-input>
          </a-form-item>
          <a-form-item
            :label="$t('CMS.Site.Extend.BaiduRefreshToken')"
            name="BaiduTjRefreshToken">
            <a-input v-model:value="form_extend.BaiduTjRefreshToken"></a-input>
          </a-form-item>
          <a-form-item
            :label="$t('CMS.Site.Extend.BaiduAccessToken')"
            name="BaiduTjAccessToken">
            <a-input v-model:value="form_extend.BaiduTjAccessToken"></a-input>
            <span class="btn-cell-wrap ml5">
              <a-button
                type="primary"
                size="small"
                :disabled="!siteId"
                v-hasPermi="[ $p('Site:Edit:{0}', [ siteId ]) ]"
                @click="handleRefreshBdTongjiToken">
                <template #icon><ReloadOutlined /></template>
                {{ $t("Common.Refresh") }}
              </a-button>
            </span>
          </a-form-item>
          <a-form-item
            :label="$t('CMS.Site.Extend.BaiduDomain')"
            name="BaiduTjDomain">
            <a-input v-model:value="form_extend.BaiduTjDomain"></a-input>
            <div style="color: #909399;font-size:12px;line-height: 30px;">
              <InfoCircleOutlined class="mr5" />{{ $t('CMS.Site.Extend.BaiduDomainTip') }}
            </div>
          </a-form-item>
        </a-card>

        <a-card class="mb10">
          <template #title>
            <span>{{ $t('CMS.Site.Extend.CustomFormCardTitle') }}</span>
          </template>
          <a-form-item :label="$t('CMS.Site.Extend.EnableCustomFormCaptcha')" name="EnableCustomFormCaptcha">
            <a-switch
              v-model:checked="form_extend.EnableCustomFormCaptcha"
              :checked-children="$t('Common.Yes')"
              :un-checked-children="$t('Common.No')"
              checked-value="Y"
              un-checked-value="N">
            </a-switch>
          </a-form-item>
        </a-card>

        <a-card class="mb10">
          <template #title>
            <span>{{ $t('CMS.Site.Extend.CommentCardTitle') }}</span>
          </template>
          <a-form-item :label="$t('CMS.Site.Extend.EnableCommentAudit')" name="EnableCommentAudit">
            <a-switch
              v-model:checked="form_extend.EnableCommentAudit"
              :checked-children="$t('Common.Yes')"
              :un-checked-children="$t('Common.No')"
              checked-value="Y"
              un-checked-value="N">
            </a-switch>
          </a-form-item>
        </a-card>
      </a-form>
    </a-spin>
  </div>
</template>
<script>
import { EditOutlined, ReloadOutlined, InfoCircleOutlined } from "@ant-design/icons-vue";
import { saveSiteExtends, getSiteExtends } from "@/api/contentcore/site";
import { getHotWordGroupOptions } from "@/api/contentcore/word";
import { listXModelOptions } from "@/api/contentcore/exmodel";
import { refreshBdTongjiToken } from "@/api/stat/baidu";
import CMSSimpleImageViewer from '@/views/cms/components/SimpleImageViewer';

export default {
  name: "CMSSiteExtend",
  components: {
    "cms-image-viewer": CMSSimpleImageViewer,
    EditOutlined,
    ReloadOutlined,
    InfoCircleOutlined,
  },
  props: {
    site: {
      type: String,
      default: undefined,
      required: false,
    }
  },
  data () {
    return {
      loading: false,
      siteId: this.site,
      repeatCheckOptions: [
        { label: this.$t("CMS.Site.Extend.TitlteRepeatCheckNone"), value: "0" },
        { label: this.$t("CMS.Site.Extend.TitlteRepeatCheckSite"), value: "1" },
        { label: this.$t("CMS.Site.Extend.TitlteRepeatCheckCatalog"), value: "2" }
        ],
      exmodelOptions: [],
      form_extend: {
        FileStorageArgs: {},
        ImageWatermarkArgs: {},
        HotWordGroups:[]
      },
      hotWordGroups: [],
      storageTypes: [
        { id: "Local", name: this.$t("CMS.Site.Extend.Local") },
        { id: "AliyunOSS", name: this.$t("CMS.Site.Extend.AliyunOSS") },
        { id: "TencentCOS", name: this.$t("CMS.Site.Extend.TencentCOS") },
        { id: "MinIO", name: this.$t("CMS.Site.Extend.MinIO") }
      ]
    };
  },
  computed: {
    watermarkImageSrc() {
      if (this.form_extend.ImageWatermarkArgs && this.form_extend.ImageWatermarkArgs.image
          && this.form_extend.ImageWatermarkArgs.image.length > 0) {
        return this.form_extend.PreviewPrefix + this.form_extend.ImageWatermarkArgs.image;
      }
      return undefined;
    }
  },
  watch: {
    siteId(newVal) {
      if (newVal != undefined && newVal != null && newVal.length > 0) {
        this.loadSiteExtends();
      }
    },
  },
  created() {
    this.loadEXModelList();
    this.loadSiteExtends();
    this.loadHotWordGroups();
  },
  methods: {
    loadSiteExtends () {
      this.loading = true;
      const params = { siteId: this.siteId };
      getSiteExtends(params).then(response => {
        const data = response.data == null ? {} : response.data;
        if (!data.FileStorageArgs) {
          data.FileStorageArgs = {};
        }
        if (!data.ImageWatermarkArgs) {
          data.ImageWatermarkArgs = {};
        }
        if (!data.HotWordGroups) {
          data.HotWordGroups = [];
        }
        this.form_extend = data;
        this.loading = false;
      }).catch(() => {
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
    handleFileStorageTypeChange() {
      if (this.form_extend.FileStorageType === 'local') {
        // this.form_extend.FileStorageArgs = {};
      }
    },
    handleWatermarkImageChange(path) {
      this.form_extend.ImageWatermarkArgs.image = path;
    },
    handleSaveExtend () {
      this.$refs["form_extend"].validate()
        .then(() => {
          const data = {};
          Object.keys(this.form_extend).forEach(key => {
            if (typeof this.form_extend[key] == 'object') {
            data[key] = JSON.stringify(this.form_extend[key]);
            } else {
              data[key] = this.form_extend[key];
            }
          })
          saveSiteExtends(this.siteId, data).then(response => {
            this.$modal.msgSuccess(this.$t("Common.SaveSuccess"),);
          });
        })
        .catch(() => {});
    },
    handleRefreshBdTongjiToken() {
      refreshBdTongjiToken().then(response => {
        this.$modal.msgSuccess(this.$t("Common.SaveSuccess"),);
      });
    }
  }
};
</script>
<style>
.site-extend-container .ant-form-item {
  margin-bottom: 12px;
}
.site-extend-container .ant-card {
  margin-bottom: 10px;
}
.site-extend-container .ant-input,
.site-extend-container .ant-input-number,
.site-extend-container .ant-select {
  width: 301.5px;
}
.site-extend-container .ant-upload-list {
  width: 300px;
}
.site-extend-container .mr5 {
  margin-right: 5px;
}
.site-extend-container .ml5 {
  margin-left: 5px;
}
.site-extend-container .mb12 {
  margin-bottom: 12px;
}
.watermarker_position {
  width: 188px;
  border: 1px solid #a7a7a7;
  border-radius: 4px;
  padding: 3px;
}
.watermarker_position .ant-radio-group {
  display: flex;
  flex-wrap: wrap;
}
.watermarker_position .ant-radio-button-wrapper {
  width: 56px;
  margin: 2px;
  border: 1px dashed #a7a7a7;
  border-radius: 0;
  text-align: center;
}
.watermarker_position .ant-radio-button-wrapper::before {
  display: none;
}
</style>
