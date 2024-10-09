<template>
  <div class="siteinfo-container">
    <el-row :gutter="10" class="mb12">
      <el-col :span="1.5">
        <el-button
          plain
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="!this.siteId"
          v-hasPermi="[ $p('Site:Edit:{0}', [ siteId ]) ]"
          @click="handleUpdate">{{ $t("Common.Save") }}</el-button>
      </el-col>
    </el-row>
    <el-form
      ref="form_info"
      :model="form_info"
      v-loading="loading"
      :rules="rules"
      :disabled="!this.siteId"
      label-width="135px">
      <el-card shadow="hover">
        <div slot="header" class="clearfix">
          <span>{{ $t("CMS.Site.BasicCardTitle") }}</span>
        </div>
        <el-form-item :label="$t('CMS.Site.SiteId')" prop="siteId">
          <span class="span_siteId" v-if="form_info.siteId!=undefined">{{form_info.siteId}}</span>
        </el-form-item>
        <el-form-item :label="$t('CMS.Site.Name')" prop="name">
          <el-input v-model="form_info.name" />
        </el-form-item>
        <el-form-item :label="$t('CMS.Site.Path')" prop="path">
          <el-input v-model="form_info.path" disabled />
        </el-form-item>
        <el-form-item :label="$t('CMS.Site.ResourceUrl')" prop="resourceUrl">
          <el-input v-model="form_info.resourceUrl" placeholder="http(s)://" />
        </el-form-item>
        <el-form-item :label="$t('CMS.Site.Logo')" prop="logo">
          <cms-logo-view v-model="form_info.logo" :src="form_info.logoSrc" :width="218" :height="150"></cms-logo-view>
        </el-form-item>
        <el-form-item :label="$t('CMS.Site.Desc')" prop="description">
          <el-input v-model="form_info.description" type="textarea" :maxlength="300" />
        </el-form-item>
      </el-card>
      <el-card v-if="showEXModel" shadow="hover">
        <div slot="header" class="clearfix">
          <span>{{ $t("CMS.Site.ExModelCardTitle") }}</span>
        </div>
        <cms-exmodel-editor
          ref="EXModelEditor"
          :xmodel="form_info.configProps.SiteExtendModel"
          type="site"
          :id="form_info.siteId">
        </cms-exmodel-editor>
      </el-card>
    </el-form>
    <!-- 导入主题对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      append-to-body>
      <el-form
        ref="importForm"
        :model="importForm"
        label-width="80px">
        <el-form-item :label="$t('CMS.Site.ImportTheme')">
          <el-upload
            ref="upload"
            drag
            :data="importForm"
            :action="upload.url"
            :headers="upload.headers"
            :file-list="upload.fileList"
            :on-progress="handleFileUploadProgress"
            :on-success="handleFileSuccess"
            :auto-upload="false"
            :on-change="handleUploadChange"
            :limit="1">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">{{ $t('CMS.Resource.UploadTip1') }}</div>
              <div class="el-upload__tip" slot="tip">{{ $t('CMS.Resource.UploadTip2', [ '[.zip]',  '100M']) }}</div>
            </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary" :loading="upload.isUploading" @click="uploadSiteThemeZipFile">{{ $t("Common.Confirm") }}</el-button>
        <el-button @click="cancelImportSiteTheme">{{ $t("Common.Cancel") }}</el-button>
      </div>
    </el-dialog>
    <!-- 模板选择组件 -->
    <cms-template-selector
      :open="openTemplateSelector"
      :publishPipeCode="publishPipeActiveName"
      @ok="handleTemplateSelected"
      @cancel="handleTemplateSelectorCancel" />
    <!-- 站点文件选择组件 -->
    <cms-file-selector :open.sync="openFileSelector" :path="fileSelectorPath" suffix="css" @ok="handleSetUEditorStyle" @close="openFileSelector=false"></cms-file-selector>
    <!-- 进度条 -->
    <cms-progress :title="progressTitle" :open.sync="openProgress" :taskId.sync="taskId" @close="handleProgressClose"></cms-progress>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import { getSite, publishSite, updateSite, exportSiteTheme  } from "@/api/contentcore/site";
import { genSitemap  } from "@/api/seo/sitemap";
import CMSTemplateSelector from '@/views/cms/contentcore/templateSelector';
import CMSProgress from '@/views/components/Progress';
import CMSLogoView from '@/views/cms/components/LogoView';
import CMSEXModelEditor from '@/views/cms/components/EXModelEditor';
import CMSFileSelector from '@/views/cms/components/FileSelector';

export default {
  name: "CMSSiteInfo",
  components: {
    'cms-template-selector': CMSTemplateSelector,
    'cms-progress': CMSProgress,
    "cms-logo-view": CMSLogoView,
    "cms-exmodel-editor": CMSEXModelEditor,
    "cms-file-selector": CMSFileSelector
  },
  dicts: ['CMSStaticSuffix','CMSSitemapPageType'],
  computed: {
    showEXModel() {
      return this.form_info.configProps && this.form_info.configProps.SiteExtendModel != null && this.form_info.configProps.SiteExtendModel.length > 0;
    },
    fileSelectorPath() {
      return this.form_info.path + "_" + this.publishPipeActiveName + "/"
    }
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
      // 遮罩层
      loading: false,
      // 弹出层标题
      title: "",
      progressTitle: "",
      // 是否显示弹出层
      open: false,
      // 上传参数
      upload: {
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken(), CurrentSite: this.$cache.local.get("CurrentSite") },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/cms/site/importTheme",
        // 上传的文件列表
        fileList: []
      },
      importForm: {
        siteId: this.site
      },
      openTemplateSelector: false,
      publishPipeActiveName: "",
      openFileSelector: false,
      openProgress: false,
      taskId: "",
      siteId: this.site,
      form_info: {
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: this.$t("CMS.Site.RuleTips.Name"), trigger: "blur" }
        ],
        path: [
          { required: true, pattern: "^[A-Za-z0-9]+$", message: this.$t("CMS.Site.RuleTips.Path"), trigger: "blur" }
        ]
      }
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
    loadSiteInfo () {
      if (!this.siteId || this.siteId <= 0) {
        this.$modal.msgError("Invalid siteId: " + this.siteId);
        return;
      }
      this.loading = true;
      getSite(this.siteId).then(response => {
        this.form_info = response.data;
        if (this.form_info.publishPipeDatas.length > 0) {
          this.publishPipeActiveName = this.form_info.publishPipeDatas[0].pipeCode;
        }
        this.loading = false;
      });
    },
    handleUpdate () {
      this.$refs["form_info"].validate(valid => {
        if (valid) {
          if (this.showEXModel) {
            this.form_info.params = this.$refs.EXModelEditor.getDatas();
          }
          updateSite(this.form_info).then(response => {
              this.$modal.msgSuccess(this.$t("Common.SaveSuccess"));
          });
        }
      });
    },
    handleSelectTemplate () {
      this.openTemplateSelector = true;
    },
    handleTemplateSelected (template) {
      this.form_info.publishPipeDatas.map(item => {
        if (item.pipeCode == this.publishPipeActiveName) {
          item.props.indexTemplate = template;
        }
      });
      this.openTemplateSelector = false;
    },
    handleTemplateSelectorCancel () {
      this.openTemplateSelector = false;
    },
    handleGoPublishPipe () {
      this.$router.push({
        path: "/configs/publishpipe"
      });
    },
    handlePreview () {
      let routeData = this.$router.resolve({
        path: "/cms/preview",
        query: { type: "site", dataId: this.siteId },
      });
      window.open(routeData.href, '_blank');
    },
    handlePublish () {
      publishSite({ siteId: this.siteId, publishIndex: true }).then(response => {
        if (response.code == 200) {
          this.$modal.msgSuccess(this.$t("CMS.ContentCore.PublishSuccess"));
        }
      });
    },
    handlePublishAll (status) {
      const params = { siteId: this.siteId, publishIndex: false, contentStatus: status }
      publishSite(params).then(response => {
        if (response.code == 200) {
          if (response.data && response.data != "") {
            this.taskId = response.data;
            this.progressTitle = this.$t('CMS.ContentCore.PublishProgressTitle');
            this.openProgress = true;
            this.$cache.local.set('publish_flag', "true")
          }
        } else {
          this.$modal.msgError(response.msg);
        }
      });
    },
    handleGenSitemap() {
      const params = { siteId: this.siteId }
      genSitemap(params).then(response => {
        if (response.data && response.data != "") {
          this.taskId = response.data;
          this.progressTitle = this.$t('CMS.Site.SitemapProgressTitle');
          this.openProgress = true;
        }
      });
    },
    handleImportTheme() {
      this.open = true;
    },
    cancelImportSiteTheme() {
      this.open = false;
      this.$refs.upload.clearFiles();
      this.resetForm("importForm");
    },
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    handleFileSuccess(response, file, fileList) {
      this.upload.isUploading = false;
      if (response.code == 200) {
        this.open = false;
        this.taskId = response.data;
        this.progressTitle = this.$t('CMS.Site.ImportTheme');
        this.openProgress = true;
      } else {
        this.$modal.msgError(response.msg);
      }
      this.$refs.upload.clearFiles();
      this.resetForm("importForm");
    },
    handleUploadChange(file) {
      file.name = file.name.toLowerCase();
      if (!file.name.endsWith(".zip")) {
        this.$modal.msgError(this.$t('CMS.Site.ThemeFileTypeErrMsg'));
        this.upload.fileList = [];
        return;
      }
    },
    uploadSiteThemeZipFile: function () {
      this.$refs["importForm"].validate(valid => {
        if (valid) {
          this.$refs.upload.submit();
        }
      });
    },
    handleExportTheme () {
      const data = { siteId: this.siteId }
      exportSiteTheme(data).then(response => {
        if (response.code == 200) {
            this.taskId = response.data;
        this.progressTitle = this.$t('CMS.Site.ExportTheme');
            this.openProgress = true;
        } else {
          this.$modal.msgError(response.msg);
        }
      });
    },
    handleProgressClose(resultStatus) {
      if (this.progressTitle == this.$t('CMS.Site.ExportTheme')) {
        this.download('cms/site/theme_download', {
          ...{ siteId: this.siteId }
        }, `SiteTheme.zip`)
      } else if (this.progressTitle == this.$t('CMS.Site.ImportTheme')) {
        const { fullPath } = this.$route
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      }
    },
    handleSelectFile() {
      this.openFileSelector = true;
    },
    handleSetUEditorStyle(files) {
      if (files.length > 0) {
        this.form_info.publishPipeDatas.map(item => {
          if (item.pipeCode == this.publishPipeActiveName) {
            item.props.ueditorCss = files[0].filePath;
          }
        });
      }
      this.openFileSelector = false;
    }
  }
};
</script>
<style scoped>
.siteinfo-container .el-form-item {
  margin-bottom: 12px;
  width: 460px;
}
.siteinfo-container .el-card {
  margin-bottom: 10px;
}
</style>
