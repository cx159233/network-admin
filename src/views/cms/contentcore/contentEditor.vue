<template>
  <div class="app-container content-editor-container">
    <div class="btn-bar">
      <a-space>
        <a-button
          type="primary"
          ghost
          v-if="contentId == '0'"
          v-hasPermi="[$p('Catalog:AddContent:{0}', [catalogId])]"
          @click="handleSave"
        >
          <template #icon><EditOutlined /></template>
          {{ $t("Common.Save") }}
        </a-button>
        <a-button
          type="primary"
          ghost
          v-else
          v-hasPermi="[$p('Catalog:EditContent:{0}', [catalogId])]"
          @click="handleSave"
        >
          <template #icon><EditOutlined /></template>
          {{ $t("Common.Save") }}
        </a-button>
        <a-button
          type="primary"
          ghost
          v-hasPermi="[$p('Catalog:Publish:{0}', [catalogId])]"
          @click="handleToPublish"
        >
          <template #icon><ClockCircleOutlined /></template>
          {{ $t("CMS.ContentCore.ToPublish") }}
        </a-button>
        <a-button
          type="primary"
          ghost
          v-hasPermi="[$p('Catalog:Publish:{0}', [catalogId])]"
          @click="handlePublish"
        >
          <template #icon><SendOutlined /></template>
          {{ $t("CMS.ContentCore.Publish") }}
        </a-button>
        <a-button @click="handleClose">
          <template #icon><CloseOutlined /></template>
          {{ $t("Common.Close") }}
        </a-button>
      </a-space>
    </div>
    <a-spin :spinning="loading" class="art-editor-container">
      <a-form ref="form" :model="form" :rules="rules" :label-col="{ style: { width: '110px' } }" class="editor-form">
        <div class="editor-layout">
          <div class="editor-main">
            <a-card class="card-title">
              <a-form-item :label="$t('CMS.Content.Title')" prop="title">
                <a-input v-model:value="form.title" :maxlength="360" show-count>
                  <template #suffix>
                    <DownOutlined class="toggle-other-title" @click="toggleOtherTitle" />
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item
                :label="$t('CMS.Content.ShortTitle')"
                v-if="showOtherTitle"
                prop="shortTitle"
              >
                <a-input v-model:value="form.shortTitle" :maxlength="120" show-count />
              </a-form-item>
              <a-form-item
                :label="$t('CMS.Content.SubTitle')"
                v-if="showOtherTitle"
                prop="subTitle"
              >
                <a-input v-model:value="form.subTitle" :maxlength="120" show-count />
              </a-form-item>
              <a-form-item :label="$t('CMS.Content.LinkFlag')" prop="linkFlag">
                <a-checkbox
                  :checked="form.linkFlag === 'Y'"
                  @change="(e) => (form.linkFlag = e.target.checked ? 'Y' : 'N')"
                />
              </a-form-item>
              <a-form-item
                :label="$t('CMS.Content.RedirectUrl')"
                v-if="form.linkFlag === 'Y'"
                prop="redirectUrl"
              >
                <a-input v-model:value="form.redirectUrl" placeholder="http(s)://" style="width: 360px" />
                <a-dropdown class="ml8">
                  <a-button type="primary" class="ml8">
                    {{ $t("CMS.ContentCore.InternalUrl") }} <DownOutlined />
                  </a-button>
                  <template #overlay>
                    <a-menu @click="handleLinkTo">
                      <a-menu-item key="content">{{ $t("CMS.ContentCore.SelectContent") }}</a-menu-item>
                      <a-menu-item key="catalog">{{ $t("CMS.ContentCore.SelectCatalog") }}</a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </a-form-item>
            </a-card>
            <a-card v-if="xmodelVisible" class="card-exmodel">
              <cms-exmodel-editor
                ref="EXModelEditor"
                :xmodel="form.catalogConfigProps.ContentExtendModel"
                type="content"
                :id="form.contentId"
              ></cms-exmodel-editor>
            </a-card>
            <a-card v-if="form.linkFlag !== 'Y' && contentType === 'article'" class="card-editor">
              <div class="editor-toolbar-row">
                <a-form-item
                  :label="$t('CMS.Content.DownloadImage')"
                  prop="downloadRemoteImage"
                  style="margin-bottom: 0"
                >
                  <a-switch
                    v-model:checked="form.downloadRemoteImage"
                    checked-value="Y"
                    un-checked-value="N"
                  />
                  <span class="field-tip">
                    <InfoCircleOutlined class="mr5 ml10" />{{ $t("CMS.Content.DownloadImageTip") }}
                  </span>
                </a-form-item>
                <a-form-item style="text-align: right; margin-bottom: 0">
                  <a-tooltip :title="$t('CMS.Content.ImportCSSTip')">
                    <InfoCircleOutlined style="color: #909399; margin-right: 8px" />
                  </a-tooltip>
                  <a-select
                    v-model:value="ueditorImportCss"
                    :placeholder="$t('CMS.Content.Placeholder.ImportCSS')"
                    allow-clear
                    style="width: 160px"
                    @change="handleChangeUEditorCSS()"
                  >
                    <a-select-option
                      v-for="pp in publishPipeProps"
                      :key="pp.pipeCode"
                      :value="pp.pipeCode"
                    >{{ pp.pipeName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
              <ueditor editorId="ue_article" v-model="form.contentHtml" :height="800"></ueditor>
            </a-card>
            <div v-if="form.linkFlag !== 'Y' && contentType === 'image'" class="mb10">
              <cms-image-editor v-model="form.imageList" @choose="handleSetLogo"></cms-image-editor>
            </div>
            <div v-if="form.linkFlag !== 'Y' && contentType === 'audio'" class="mb10">
              <cms-audio-editor v-model="form.audioList" :logo="form.logoSrc" @choose="handleSetLogo"></cms-audio-editor>
            </div>
            <div v-if="form.linkFlag !== 'Y' && contentType === 'video'" class="mb10">
              <cms-video-editor v-model="form.videoList" @choose="handleSetLogo"></cms-video-editor>
            </div>
          </div>
          <div class="editor-side">
            <a-card>
              <a-tabs v-model:activeKey="activeName">
                <a-tab-pane :tab="$t('CMS.Content.Basic')" key="basic">
                  <a-form-item :label="$t('CMS.Content.Catalog')" prop="catalogId">
                    <a-input-group compact>
                      <a-input :value="form.catalogName" disabled style="width: 152px" />
                      <a-button type="primary" @click="handleCatalogChange">
                        <template #icon><EditOutlined /></template>
                      </a-button>
                    </a-input-group>
                  </a-form-item>
                  <a-form-item :label="$t('CMS.Content.Logo')" prop="logo">
                    <cms-logo-view
                      v-model="form.logo"
                      :src="form.logoSrc"
                      :width="210"
                      :height="150"
                    ></cms-logo-view>
                  </a-form-item>
                  <a-form-item :label="$t('CMS.Content.Author')" prop="author">
                    <a-input v-model:value="form.author" />
                  </a-form-item>
                  <a-form-item :label="$t('CMS.Content.Summary')" prop="summary">
                    <a-textarea
                      v-model:value="form.summary"
                      :auto-size="{ minRows: 3, maxRows: 6 }"
                      :maxlength="500"
                      show-count
                    />
                  </a-form-item>
                  <a-form-item :label="$t('CMS.Content.Source')" prop="source">
                    <a-input v-model:value="form.source" />
                  </a-form-item>
                  <a-form-item :label="$t('CMS.Content.SourceUrl')" prop="sourceUrl">
                    <a-input v-model:value="form.sourceUrl" placeholder="http(s)://" />
                  </a-form-item>
                  <a-divider></a-divider>
                  <a-form-item :label="$t('CMS.Content.PublishDate')" prop="publishDate">
                    <a-date-picker
                      v-model:value="form.publishDate"
                      value-format="YYYY-MM-DD HH:mm:ss"
                      show-time
                      style="width: 195px"
                    />
                  </a-form-item>
                  <a-form-item :label="$t('CMS.Content.OfflineDate')" prop="offlineDate">
                    <a-date-picker
                      v-model:value="form.offlineDate"
                      value-format="YYYY-MM-DD HH:mm:ss"
                      show-time
                      style="width: 195px"
                    />
                  </a-form-item>
                </a-tab-pane>
              </a-tabs>
            </a-card>
          </div>
        </div>
      </a-form>
    </a-spin>
    <!-- 模板选择组件 -->
    <cms-template-selector
      :open="openTemplateSelector"
      :publishPipeCode="publishPipeActiveName"
      @ok="handleTemplateSelected"
      @cancel="handleTemplateSelectorCancel"
    />
    <!-- 栏目选择组件 -->
    <cms-catalog-selector
      :open="openCatalogSelector"
      :disableLink="disableLinkCatalog"
      @ok="handleCatalogSelectorOk"
      @close="handleCatalogSelectorClose"
    ></cms-catalog-selector>
    <!-- 内容选择组件 -->
    <cms-content-selector
      :open="openContentSelector"
      @ok="handleContentSelectorOk"
      @close="handleContentSelectorClose"
    ></cms-content-selector>
    <cms-content-rela-dialog
      :cid="contentId"
      :open="openRelaContentDialog"
      @close="handleRelaContentClose"
    ></cms-content-rela-dialog>
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
import {
  EditOutlined,
  ClockCircleOutlined,
  SendOutlined,
  CloseOutlined,
  DownOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons-vue";
import { getContentTypes } from "@/api/contentcore/catalog";
import {
  getInitContentEditorData,
  addContent,
  saveContent,
  toPublishContent,
  publishContent,
  lockContent,
  unLockContent,
  moveContent,
} from "@/api/contentcore/content";
import { getUEditorCSS } from "@/api/contentcore/article";
import { pushToBaidu } from "@/api/seo/baidupush";
import UEditor from "@/views/cms/components/UEditorPlus";
import CMSProgress from "@/views/components/Progress";
import CMSImageEditor from "@/views/cms/imageAlbum/editor";
import CMSAudioEditor from "@/views/cms/media/audioEditor";
import CMSVideoEditor from "@/views/cms/media/videoEditor";
import CMSLogoView from "@/views/cms/components/LogoView";
import CMSCatalogSelector from "@/views/cms/contentcore/catalogSelector";
import CMSContentSelector from "@/views/cms/contentcore/contentSelector";
import CMSContrentRelaDialog from "@/views/cms/contentcore/contentRelaDialog";
import CMSTemplateSelector from "@/views/cms/contentcore/templateSelector";
import CMSEXModelEditor from "@/views/cms/components/EXModelEditor";

export default {
  name: "CMSContentEditor",
  dicts: ["CMSContentAttribute"],
  components: {
    ueditor: UEditor,
    "cms-template-selector": CMSTemplateSelector,
    "cms-progress": CMSProgress,
    "cms-image-editor": CMSImageEditor,
    "cms-audio-editor": CMSAudioEditor,
    "cms-video-editor": CMSVideoEditor,
    "cms-logo-view": CMSLogoView,
    "cms-catalog-selector": CMSCatalogSelector,
    "cms-content-selector": CMSContentSelector,
    "cms-content-rela-dialog": CMSContrentRelaDialog,
    "cms-exmodel-editor": CMSEXModelEditor,
    EditOutlined,
    ClockCircleOutlined,
    SendOutlined,
    CloseOutlined,
    DownOutlined,
    InfoCircleOutlined,
  },
  computed: {
    isLock() {
      return this.form.isLock === "Y" && this.form.lockUser != "";
    },
    xmodelVisible() {
      return (
        this.form.catalogConfigProps &&
        this.form.catalogConfigProps.ContentExtendModel != null &&
        this.form.catalogConfigProps.ContentExtendModel.length > 0
      );
    },
  },
  data() {
    return {
      loading: false,
      openProgress: false,
      progressTitle: "",
      taskId: "",
      showOtherTitle: false,
      showTemplate: false,
      activeName: "basic",
      catalogId: this.$route.query.catalogId || "0",
      contentId: this.$route.query.id || "0",
      contentType: this.$route.query.type,
      openCatalogSelector: false,
      disableLinkCatalog: false,
      catalogSelectorFor: undefined,
      openContentSelector: false,
      contentTypeOptions: [],
      addContentType: "",
      addPopoverVisible: false,
      form: {
        attributes: [],
        contentJson: [],
        contentHtml: "",
        downloadRemoteImage: "Y",
        original: "N",
        publishPipe: [],
        imageList: [],
        tags: [],
        keywords: [],
      },
      isUpdateOperate: false,
      initDataStr: undefined,
      publishPipeProps: [],
      rules: {
        title: [
          {
            required: true,
            message: this.$t("CMS.Content.RuleTips.Title"),
            trigger: "blur",
          },
        ],
      },
      openTemplateSelector: false,
      publishPipeActiveName: "",
      selectExTemplate: false,
      publishAfterSave: false,
      toPublishAfterSave: false,
      openRelaContentDialog: false,
      ueditorImportCss: "",
    };
  },
  created() {
    this.initData();
    this.loadUEditorCSS();
    getContentTypes().then((response) => {
      this.contentTypeOptions = response.data;
      this.addContentType = this.contentTypeOptions[0].id;
    });
  },
  methods: {
    toggleOtherTitle() {
      this.showOtherTitle = !this.showOtherTitle;
    },
    initData() {
      this.loading = true;
      getInitContentEditorData(this.catalogId, this.contentType, this.contentId)
        .then((response) => {
          this.loading = false;
          response.data.attributes = response.data.attributes || [];
          response.data.tags = response.data.tags || [];
          response.data.keywords = response.data.keywords || [];
          this.form = response.data;
          this.catalogId = this.form.catalogId;
          this.contentId = this.form.contentId;
          this.contentType = this.form.contentType;
          this.publishPipeProps = this.form.publishPipeProps;
          this.showOtherTitle =
            "Y" === this.form.showSubTitle ||
            (this.form.shortTitle && this.form.shortTitle.length > 0) ||
            (this.form.subTitle && this.form.subTitle.length > 0);
          this.publishPipeProps.forEach((pp) => {
            if (pp.props.template && pp.props.template.length > 0) {
              this.showTemplate = true;
            }
          });
          this.initDataStr = JSON.stringify(this.form);
          this.isUpdateOperate =
            (this.form.createTime && this.form.createTime.length > 0) == true;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    isFormChanged() {
      return JSON.stringify(this.form) != this.initDataStr;
    },
    handleClose() {
      if (this.isFormChanged()) {
        this.$modal
          .confirm(this.$t("CMS.Content.CloseContentEditorTip"))
          .then(() => {
            this.closePage();
          })
          .catch(() => {});
      } else {
        this.closePage();
      }
    },
    closePage() {
      if (this.$route.path.endsWith("editorW")) {
        window.close();
      } else {
        const obj = { path: "/configs/content" };
        this.$tab.closeOpenPage(obj);
      }
    },
    reset() {
      this.form = {};
      this.resetForm("form");
    },
    handleShowTemplateChange() {
      if (!this.showTemplate) {
        this.publishPipeProps.forEach((pp) => {
          pp.props.template = "";
        });
      }
    },
    handleSelectTemplate(publishPipe, extend = false) {
      this.publishPipeActiveName = publishPipe.pipeCode;
      this.selectExTemplate = extend;
      this.$nextTick(() => {
        this.openTemplateSelector = true;
      });
    },
    handleTemplateSelected(template) {
      this.publishPipeProps.map((pp) => {
        if (pp.pipeCode == this.publishPipeActiveName) {
          if (this.selectExTemplate) {
            pp.props.contentExTemplate = template;
          } else {
            pp.props.template = template;
          }
        }
      });
      this.openTemplateSelector = false;
    },
    handleTemplateSelectorCancel() {
      this.openTemplateSelector = false;
    },
    handleSetLogo(path, src) {
      this.form.logoSrc = src;
      this.form.logo = path;
    },
    /** 提交 */
    handleSave: function () {
      this.$refs["form"]
        .validate()
        .then(() => {
          this.form.template = {};
          this.publishPipeProps.map((item) => {
            this.form.template[item.pipeCode] = item.props.template;
          });
          if (this.xmodelVisible) {
            this.form.params = this.$refs.EXModelEditor.getDatas();
          }
          if (this.isUpdateOperate) {
            saveContent(this.form).then((response) => {
              this.taskId = response.data.taskId;
              this.openProgress = true;
              this.progressTitle = this.$t("CMS.Content.SaveProgressTitle");
            });
          } else {
            this.form.catalogId = this.catalogId;
            this.form.contentType = this.contentType;
            addContent(this.form).then((response) => {
              this.taskId = response.data.taskId;
              this.openProgress = true;
              this.progressTitle = this.$t("CMS.Content.SaveProgressTitle");
            });
          }
        })
        .catch(() => {});
    },
    handleToPublish() {
      if (!this.isUpdateOperate || this.isFormChanged()) {
        this.handleSave();
        this.toPublishAfterSave = true;
        return;
      }
      this.doToPublishContent();
    },
    doToPublishContent() {
      this.$modal
        .confirm("待发布后将在门户网站上隐藏，是否确认待发布？")
        .then(() => {
          toPublishContent([this.form.contentId]).then(() => {
            this.$modal.msgSuccess(this.$t("CMS.ContentCore.ToPublishSuccess"));
          });
        })
        .catch(() => {});
    },
    handlePublish() {
      if (!this.isUpdateOperate || this.isFormChanged()) {
        this.handleSave();
        this.publishAfterSave = true;
        return;
      }
      this.doPublishContent();
    },
    doPublishContent() {
      this.$modal
        .confirm("发布后将在门户网站上显示，是否确认发布？")
        .then(() => {
          publishContent([this.form.contentId]).then(() => {
            this.$modal.msgSuccess(this.$t("CMS.ContentCore.PublishSuccess"));
            this.$cache.local.set("publish_flag", "true");
          });
        })
        .catch(() => {});
    },
    handleProgressClose(result) {
      if (result && result.status == "SUCCESS") {
        if (this.publishAfterSave) {
          this.publishAfterSave = false;
          this.doPublishContent();
        }
        if (this.toPublishAfterSave) {
          this.toPublishAfterSave = false;
          this.doToPublishContent();
        }
        this.initData();
        this.$router.push({
          path: this.$route.path,
          query: {
            type: this.contentType,
            catalogId: this.catalogId,
            id: this.contentId,
          },
        });
      }
    },
    handlePreview() {
      const routeData = this.$router.resolve({
        path: "/cms/preview",
        query: { type: "content", dataId: this.form.contentId },
      });
      window.open(routeData.href, "_blank");
    },
    handleChangeLockState() {
      if (this.isLock) {
        unLockContent(this.form.contentId).then(() => {
          this.form.isLock = "N";
          this.$modal.msgSuccess(this.$t("Common.OpSuccess"));
        });
      } else {
        lockContent(this.form.contentId).then((response) => {
          this.form.isLock = "Y";
          this.form.lockUser = response.data;
          this.$modal.msgSuccess(this.$t("Common.OpSuccess"));
        });
      }
    },
    handleCatalogChange() {
      this.openCatalogSelector = true;
      this.disableLinkCatalog = false;
      this.catalogSelectorFor = "change";
    },
    handleCatalogSelectorOk(catalogs) {
      if (this.catalogSelectorFor === "change") {
        if (this.form.contentId && this.form.contentId != null) {
          if (this.form.catalogId != catalogs[0].id) {
            const data = {
              contentIds: [this.form.contentId],
              catalogId: catalogs[0].id,
            };
            moveContent(data).then((response) => {
              if (response.code == 200) {
                this.$modal.msgSuccess(this.$t("Common.OpSuccess"));
                this.form.catalogId = catalogs[0].id;
                this.form.catalogName = catalogs[0].name;
              }
            });
          }
        } else {
          this.form.catalogId = catalogs[0].id;
          this.form.catalogName = catalogs[0].name;
        }
      } else if (this.catalogSelectorFor === "linkflag") {
        if (catalogs && catalogs.length > 0) {
          this.form.redirectUrl = catalogs[0].props.src;
        }
      }
      this.openCatalogSelector = false;
    },
    handleCatalogSelectorClose() {
      this.openCatalogSelector = false;
    },
    handleLinkTo({ key }) {
      if (key === "content") {
        this.openContentSelector = true;
      } else if (key === "catalog") {
        this.openCatalogSelector = true;
        this.catalogSelectorFor = "linkflag";
        this.disableLinkCatalog = true;
      }
    },
    handleContentSelectorOk(contents) {
      if (contents && contents.length > 0) {
        this.form.redirectUrl = contents[0].src;
        if (!this.form.logo || this.form.logo.length == 0) {
          this.form.logo = contents[0].logo;
          this.form.logoSrc = contents[0].logoSrc;
        }
        if (!this.form.title || this.form.title.length == 0) {
          this.form.title = contents[0].title;
        }
        if (!this.form.shortTitle || this.form.shortTitle.length == 0) {
          this.form.shortTitle = contents[0].shortTitle;
        }
        if (!this.form.subTitle || this.form.subTitle.length == 0) {
          this.form.subTitle = contents[0].subTitle;
        }
        if (!this.form.author || this.form.author.length == 0) {
          this.form.author = contents[0].author;
        }
        if (!this.form.editor || this.form.editor.length == 0) {
          this.form.editor = contents[0].editor;
        }
        if (!this.form.tags || this.form.tags.length == 0) {
          this.form.tags = contents[0].tags;
        }
        if (!this.form.keywords || this.form.keywords.length == 0) {
          this.form.keywords = contents[0].keywords;
        }
        if (!this.form.summary || this.form.summary.length == 0) {
          this.form.summary = contents[0].summary;
        }
        this.showOtherTitle =
          "Y" === this.form.showSubTitle ||
          (this.form.shortTitle && this.form.shortTitle.length > 0) ||
          (this.form.subTitle && this.form.subTitle.length > 0);
        this.openContentSelector = false;
      } else {
        this.$modal.msgWarning(this.$t("Common.SelectFirst"));
      }
    },
    handleContentSelectorClose() {
      this.openContentSelector = false;
    },
    handleRelaContent() {
      this.openRelaContentDialog = true;
    },
    handleRelaContentClose() {
      this.openRelaContentDialog = false;
    },
    handlePushToBaidu() {
      pushToBaidu([this.form.contentId]).then((response) => {
        let msg = "";
        response.data.forEach((item) => {
          msg +=
            "【" +
            item.publishPipeCode +
            "】成功 " +
            item.success +
            " 条，剩余 " +
            item.remain +
            " 条。<br/>";
        });
        this.$modal.alert(msg);
      });
    },
    loadUEditorCSS() {
      if (this.contentType == "article") {
        getUEditorCSS({ catalogId: this.catalogId }).then((response) => {
          this.ueditorCss = response.data;
        });
      }
    },
    findUEIframes(element) {
      const children = element.children[0].children;
      for (let i = 0; i < children.length; i++) {
        if (children[i].classList.contains("edui-editor-iframeholder")) {
          return children[i].children[0];
        }
      }
      return;
    },
    handleChangeUEditorCSS() {
      const iframe = this.findUEIframes(document.getElementById("ue_article"));
      if (!iframe || !iframe.contentDocument) {
        return;
      }
      const links = iframe.contentDocument.getElementsByTagName("link");
      for (let i = 0; i < links.length; i++) {
        if (links[i].id === "import_css") {
          links[i].parentNode.removeChild(links[i]);
        }
      }
      if (this.ueditorImportCss && this.ueditorImportCss.length > 0) {
        const css = this.ueditorCss[this.ueditorImportCss];
        if (css && css.length > 0) {
          const link = document.createElement("link");
          link.setAttribute("rel", "stylesheet");
          link.setAttribute("type", "text/css");
          link.setAttribute("id", "import_css");
          link.setAttribute("href", css);
          iframe.contentDocument.head.appendChild(link);
        }
      }
    },
    handleNewContent() {
      this.addPopoverVisible = false;
      this.contentId = "0";
      this.contentType = this.addContentType;
      this.$router.push({
        path: this.$route.path,
        query: {
          type: this.contentType,
          catalogId: this.catalogId,
          id: this.contentId,
        },
      });
      this.initData();
    },
  },
};
</script>
<style scoped>
.content-editor-container .btn-bar {
  background-color: #fff;
  padding: 10px 12px;
  margin-bottom: 10px;
  border-radius: 8px;
}
.content-editor-container .art-editor-container {
  display: block;
  margin-top: 0;
}
.content-editor-container .editor-layout {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.content-editor-container .editor-main {
  flex: 1;
  min-width: 0;
}
.content-editor-container .editor-side {
  width: 420px;
  flex-shrink: 0;
}
.content-editor-container .card-title,
.content-editor-container .card-exmodel,
.content-editor-container .card-editor {
  margin-bottom: 10px;
}
.content-editor-container .card-editor {
  min-height: 700px;
}
.content-editor-container .toggle-other-title {
  color: #86909c;
  cursor: pointer;
}
.content-editor-container .editor-toolbar-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.content-editor-container .field-tip {
  color: #909399;
  font-size: 12px;
  margin-left: 10px;
}
.content-editor-container :deep(.ant-form-item) {
  margin-bottom: 12px;
}
.mb10 {
  margin-bottom: 10px;
}
.ml8 {
  margin-left: 8px;
}
.mr5 {
  margin-right: 5px;
}
</style>
