<template>
  <div class="siteinfo-container">
    <div class="mb12">
      <a-button
        type="primary"
        ghost
        :disabled="!siteId"
        v-hasPermi="[$p('Site:Edit:{0}', [siteId])]"
        @click="handleUpdate"
      >
        <template #icon><EditOutlined /></template>
        {{ $t("Common.Save") }}
      </a-button>
    </div>
    <a-spin :spinning="loading">
      <a-form
        ref="form_info"
        :model="form_info"
        :rules="rules"
        :disabled="!siteId"
        :label-col="{ style: { width: '135px' } }"
      >
        <a-card class="mb10" :title="$t('CMS.Site.BasicCardTitle')">
          <a-form-item :label="$t('CMS.Site.SiteId')" name="siteId">
            <span class="span_siteId" v-if="form_info.siteId != undefined">{{ form_info.siteId }}</span>
          </a-form-item>
          <a-form-item :label="$t('CMS.Site.Name')" name="name">
            <a-input v-model:value="form_info.name" />
          </a-form-item>
          <a-form-item :label="$t('CMS.Site.Path')" name="path">
            <a-input v-model:value="form_info.path" disabled />
          </a-form-item>
          <a-form-item :label="$t('CMS.Site.ResourceUrl')" name="resourceUrl">
            <a-input v-model:value="form_info.resourceUrl" placeholder="http(s)://" />
          </a-form-item>
          <a-form-item :label="$t('CMS.Site.Logo')" name="logo">
            <cms-logo-view v-model="form_info.logo" :src="form_info.logoSrc" :width="218" :height="150"></cms-logo-view>
          </a-form-item>
          <a-form-item :label="$t('CMS.Site.Desc')" name="description">
            <a-textarea v-model:value="form_info.description" :maxlength="300" />
          </a-form-item>
        </a-card>
        <a-card v-if="showEXModel" class="mb10" :title="$t('CMS.Site.ExModelCardTitle')">
          <cms-exmodel-editor
            ref="EXModelEditor"
            :xmodel="form_info.configProps.SiteExtendModel"
            type="site"
            :id="form_info.siteId"
          ></cms-exmodel-editor>
        </a-card>
      </a-form>
    </a-spin>
    <!-- 导入主题对话框 -->
    <a-modal :get-container="getDemoContainer" :title="title" :open="open" width="500px" @cancel="cancelImportSiteTheme">
      <a-upload-dragger
        v-model:file-list="upload.fileList"
        :max-count="1"
        :before-upload="handleUploadChange"
      >
        <p class="ant-upload-drag-icon"><InboxOutlined /></p>
        <div class="ant-upload-text">{{ $t("CMS.Resource.UploadTip1") }}</div>
        <div class="ant-upload-hint">{{ $t("CMS.Resource.UploadTip2", [".zip", "100M"]) }}</div>
      </a-upload-dragger>
      <template #footer>
        <a-button type="primary" :loading="upload.isUploading" @click="uploadSiteThemeZipFile">
          {{ $t("Common.Confirm") }}
        </a-button>
        <a-button class="ml8" @click="cancelImportSiteTheme">{{ $t("Common.Cancel") }}</a-button>
      </template>
    </a-modal>
    <!-- 模板选择组件 -->
    <cms-template-selector
      :open="openTemplateSelector"
      :publishPipeCode="publishPipeActiveName"
      @ok="handleTemplateSelected"
      @cancel="handleTemplateSelectorCancel"
    />
    <!-- 站点文件选择组件 -->
    <cms-file-selector
      v-model:open="openFileSelector"
      :path="fileSelectorPath"
      suffix="css"
      @ok="handleSetUEditorStyle"
      @close="openFileSelector = false"
    ></cms-file-selector>
    <!-- 进度条 -->
    <cms-progress
      :title="progressTitle"
      v-model:open="openProgress"
      :taskId="taskId"
      @close="handleProgressClose"
    ></cms-progress>
  </div>
</template>
<script>
import { EditOutlined, InboxOutlined } from "@ant-design/icons-vue";
import { getToken } from "@/utils/auth";
import { getSite, publishSite, updateSite, exportSiteTheme } from "@/api/contentcore/site";
import { genSitemap } from "@/api/seo/sitemap";
import CMSTemplateSelector from "@/views/cms/contentcore/templateSelector";
import CMSProgress from "@/views/components/Progress";
import CMSLogoView from "@/views/cms/components/LogoView";
import CMSEXModelEditor from "@/views/cms/components/EXModelEditor";
import CMSFileSelector from "@/views/cms/components/FileSelector";

export default {
  name: "CMSSiteInfo",
  components: {
    "cms-template-selector": CMSTemplateSelector,
    "cms-progress": CMSProgress,
    "cms-logo-view": CMSLogoView,
    "cms-exmodel-editor": CMSEXModelEditor,
    "cms-file-selector": CMSFileSelector,
    EditOutlined,
    InboxOutlined,
  },
  dicts: ["CMSStaticSuffix", "CMSSitemapPageType"],
  computed: {
    showEXModel() {
      return (
        this.form_info.configProps &&
        this.form_info.configProps.SiteExtendModel != null &&
        this.form_info.configProps.SiteExtendModel.length > 0
      );
    },
    fileSelectorPath() {
      return this.form_info.path + "_" + this.publishPipeActiveName + "/";
    },
  },
  props: {
    site: {
      type: String,
      default: undefined,
      required: false,
    },
  },
  data() {
    return {
      loading: false,
      title: "",
      progressTitle: "",
      open: false,
      upload: {
        isUploading: false,
        headers: {
          Authorization: "Bearer " + getToken(),
          CurrentSite: this.$cache.local.get("CurrentSite"),
        },
        url: process.env.VUE_APP_BASE_API + "/cms/site/importTheme",
        fileList: [],
      },
      importForm: {
        siteId: this.site,
      },
      openTemplateSelector: false,
      publishPipeActiveName: "",
      openFileSelector: false,
      openProgress: false,
      taskId: "",
      siteId: this.site,
      form_info: {},
      rules: {
        name: [
          { required: true, message: this.$t("CMS.Site.RuleTips.Name"), trigger: "blur" },
        ],
        path: [
          { required: true, pattern: "^[A-Za-z0-9]+$", message: this.$t("CMS.Site.RuleTips.Path"), trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    site(newVal) {
      this.siteId = newVal;
    },
    siteId(newVal) {
      if (newVal != undefined && newVal != null && newVal.length > 0) {
        this.loadSiteInfo();
      }
    },
  },
  created() {
    this.loadSiteInfo();
  },
  methods: {
    getDemoContainer() {
      return document.querySelector('.app-main__content') || document.body;
    },
    getDrawerContainer() {
      return document.querySelector('.app-overlay') || document.body;
    },
    loadSiteInfo() {
      if (!this.siteId || this.siteId <= 0) {
        this.$modal.msgError("Invalid siteId: " + this.siteId);
        return;
      }
      this.loading = true;
      getSite(this.siteId)
        .then((response) => {
          this.form_info = response.data;
          if (this.form_info.publishPipeDatas.length > 0) {
            this.publishPipeActiveName = this.form_info.publishPipeDatas[0].pipeCode;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleUpdate() {
      this.$refs["form_info"]
        .validate()
        .then(() => {
          if (this.showEXModel) {
            this.form_info.params = this.$refs.EXModelEditor.getDatas();
          }
          updateSite(this.form_info).then(() => {
            this.$modal.msgSuccess(this.$t("Common.SaveSuccess"));
          });
        })
        .catch(() => {});
    },
    handleSelectTemplate() {
      this.openTemplateSelector = true;
    },
    handleTemplateSelected(template) {
      this.form_info.publishPipeDatas.map((item) => {
        if (item.pipeCode == this.publishPipeActiveName) {
          item.props.indexTemplate = template;
        }
      });
      this.openTemplateSelector = false;
    },
    handleTemplateSelectorCancel() {
      this.openTemplateSelector = false;
    },
    handleGoPublishPipe() {
      this.$router.push({
        path: "/configs/publishpipe",
      });
    },
    handlePreview() {
      const routeData = this.$router.resolve({
        path: "/cms/preview",
        query: { type: "site", dataId: this.siteId },
      });
      window.open(routeData.href, "_blank");
    },
    handlePublish() {
      publishSite({ siteId: this.siteId, publishIndex: true }).then((response) => {
        if (response.code == 200) {
          this.$modal.msgSuccess(this.$t("CMS.ContentCore.PublishSuccess"));
        }
      });
    },
    handlePublishAll(status) {
      const params = { siteId: this.siteId, publishIndex: false, contentStatus: status };
      publishSite(params).then((response) => {
        if (response.code == 200) {
          if (response.data && response.data != "") {
            this.taskId = response.data;
            this.progressTitle = this.$t("CMS.ContentCore.PublishProgressTitle");
            this.openProgress = true;
            this.$cache.local.set("publish_flag", "true");
          }
        } else {
          this.$modal.msgError(response.msg);
        }
      });
    },
    handleGenSitemap() {
      const params = { siteId: this.siteId };
      genSitemap(params).then((response) => {
        if (response.data && response.data != "") {
          this.taskId = response.data;
          this.progressTitle = this.$t("CMS.Site.SitemapProgressTitle");
          this.openProgress = true;
        }
      });
    },
    handleImportTheme() {
      this.open = true;
    },
    cancelImportSiteTheme() {
      this.open = false;
      this.upload.fileList = [];
    },
    handleUploadChange(file) {
      const name = file.name.toLowerCase();
      if (!name.endsWith(".zip")) {
        this.$modal.msgError(this.$t("CMS.Site.ThemeFileTypeErrMsg"));
        this.upload.fileList = [];
        return false;
      }
      return false;
    },
    uploadSiteThemeZipFile() {
      if (!this.upload.fileList || this.upload.fileList.length === 0) {
        return;
      }
      const fileItem = this.upload.fileList[0];
      const rawFile = fileItem.originFileBody || fileItem.originFileObj || fileItem;
      const formData = new FormData();
      formData.append("file", rawFile);
      formData.append("siteId", this.importForm.siteId);
      this.upload.isUploading = true;
      fetch(this.upload.url, {
        method: "POST",
        headers: this.upload.headers,
        body: formData,
      })
        .then((res) => res.json())
        .then((response) => {
          this.upload.isUploading = false;
          this.upload.fileList = [];
          if (response.code == 200) {
            this.open = false;
            this.taskId = response.data;
            this.progressTitle = this.$t("CMS.Site.ImportTheme");
            this.openProgress = true;
          } else {
            this.$modal.msgError(response.msg);
          }
        })
        .catch(() => {
          this.upload.isUploading = false;
        });
    },
    handleExportTheme() {
      const data = { siteId: this.siteId };
      exportSiteTheme(data).then((response) => {
        if (response.code == 200) {
          this.taskId = response.data;
          this.progressTitle = this.$t("CMS.Site.ExportTheme");
          this.openProgress = true;
        } else {
          this.$modal.msgError(response.msg);
        }
      });
    },
    handleProgressClose(resultStatus) {
      if (this.progressTitle == this.$t("CMS.Site.ExportTheme")) {
        this.download(
          "cms/site/theme_download",
          {
            ...{ siteId: this.siteId },
          },
          `SiteTheme.zip`
        );
      } else if (this.progressTitle == this.$t("CMS.Site.ImportTheme")) {
        const { fullPath } = this.$route;
        this.$nextTick(() => {
          this.$router.replace({
            path: "/redirect" + fullPath,
          });
        });
      }
    },
    handleSelectFile() {
      this.openFileSelector = true;
    },
    handleSetUEditorStyle(files) {
      if (files.length > 0) {
        this.form_info.publishPipeDatas.map((item) => {
          if (item.pipeCode == this.publishPipeActiveName) {
            item.props.ueditorCss = files[0].filePath;
          }
        });
      }
      this.openFileSelector = false;
    },
  },
};
</script>
<style scoped>
.siteinfo-container .ant-form-item {
  margin-bottom: 12px;
  width: 460px;
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
