<template>
  <div class="catalog-info-container">
    <a-row :gutter="10" class="mb12 btn-row">
      <a-col :span="1.5">
        <a-button
          type="primary"
          size="small"
          :disabled="!this.catalogId"
          v-hasPermi="[$p('Catalog:Edit:{0}', [catalogId])]"
          @click="handleUpdate"
        >
          <template #icon><EditOutlined /></template>
          {{ $t("Common.Save") }}
        </a-button>
      </a-col>
      <a-col :span="1.5">
        <a-button
          v-hasPermi="[$p('Catalog:Publish:{0}', [catalogId])]"
          size="small"
          type="primary"
          :disabled="!this.catalogId"
          @click="handlePublish(-1)"
        >
          <template #icon><SendOutlined /></template>
          {{ $t("CMS.ContentCore.Publish") }}
        </a-button>
      </a-col>
      <a-col :span="1.5">
        <a-button
          size="small"
          type="primary"
          :disabled="!this.catalogId"
          v-hasPermi="[$p('Catalog:ShowHide:{0}', [catalogId])]"
          @click="handleChangeVisible"
        >
          <template #icon>
            <EyeInvisibleOutlined v-if="catalogVisible" />
            <EyeOutlined v-else />
          </template>
          {{ catalogVisible ? $t("Common.Hide") : $t("Common.Show") }}
        </a-button>
      </a-col>
      <a-col :span="1.5">
        <a-button
          type="primary"
          size="small"
          :disabled="!this.catalogId"
          v-hasPermi="[$p('Catalog:Move:{0}', [catalogId])]"
          @click="handleMoveCatalog"
        >
          <template #icon><DragOutlined /></template>
          {{ $t("Common.Move") }}
        </a-button>
      </a-col>
      <a-col :span="1.5">
        <a-popover
          v-model:open="showSortPop"
          class="btn-permi"
          v-hasPermi="[$p('Catalog:Sort:{0}', [catalogId])]"
          trigger="click"
        >
          <template #content>
            <a-input-number
              v-model:value="sortValue"
              size="small"
              style="width: 200px"
            />
            <div style="color: #909399; font-size: 12px; line-height: 30px">
              <InfoCircleOutlined class="mr5" />{{ $t("CMS.Catalog.SortTip") }}
            </div>
            <div style="text-align: right; margin-top: 5px">
              <a-button
                size="small"
                type="link"
                @click="handleSortCatalogCancel"
                >{{ $t("Common.Cancel") }}</a-button
              >
              <a-button type="primary" size="small" @click="handleSortCatalog">{{
                $t("Common.Confirm")
              }}</a-button>
            </div>
          </template>
          <a-button size="small" type="primary" :disabled="!this.catalogId">
            <template #icon><SortAscendingOutlined /></template>
            {{ $t("Common.Sort") }}
          </a-button>
        </a-popover>
      </a-col>
      <a-col :span="1.5">
        <a-popconfirm
          :title="$t('CMS.Catalog.DeleteTip')"
          @confirm="handleDelete"
          class="btn-permi"
          v-hasPermi="[$p('Catalog:Delete:{0}', [catalogId])]"
        >
          <a-button
            type="primary"
            danger
            size="small"
            :disabled="!this.catalogId"
          >
            <template #icon><DeleteOutlined /></template>
            {{ $t("Common.Delete") }}
          </a-button>
        </a-popconfirm>
      </a-col>
    </a-row>
    <a-spin :spinning="loading">
      <a-form
        ref="form_info"
        :model="form_info"
        :rules="rules"
        :disabled="!this.catalogId"
        :label-col="{ style: { width: '165px' } }"
      >
        <a-card class="info-card">
          <template #title>
            <span>{{ $t("CMS.Catalog.Basic") }}</span>
          </template>
          <a-form-item :label="$t('CMS.Catalog.CatalogId')" name="catalogId">
            <span
              class="span_catalogid"
              v-if="form_info.catalogId != undefined"
              >{{ form_info.catalogId }}</span
            >
          </a-form-item>
          <a-form-item :label="$t('CMS.Catalog.Name')" name="name">
            <a-input v-model:value="form_info.name" />
          </a-form-item>
          <a-form-item :label="$t('CMS.Catalog.Alias')" name="alias">
            <a-input v-model:value="form_info.alias" />
          </a-form-item>
          <a-form-item :label="$t('CMS.Catalog.Path')" name="path">
            <a-input v-model:value="form_info.path" />
          </a-form-item>
          <a-form-item :label="$t('CMS.Catalog.Desc')" name="description">
            <a-textarea
              v-model:value="form_info.description"
              :maxlength="500"
            />
          </a-form-item>
          <a-form-item :label="$t('CMS.Catalog.Logo')" name="logo">
            <cms-logo-view
              v-model="form_info.logo"
              :src="form_info.logoSrc"
              :height="150"
              @changeSrc="handleLogoChange"
            ></cms-logo-view>
          </a-form-item>
        </a-card>
        <a-card v-if="showEXModel" class="info-card">
          <template #title>
            <span>{{ $t("CMS.Catalog.ExModelProps") }}</span>
          </template>

          <cms-exmodel-editor
            ref="EXModelEditor"
            :xmodel="form_info.configProps.CatalogExtendModel"
            type="catalog"
            :id="form_info.catalogId"
          >
          </cms-exmodel-editor>
        </a-card>
      </a-form>
    </a-spin>
    <a-modal :get-container="getDemoContainer"
      :title="$t('CMS.Catalog.PublishDialogTitle')"
      v-model:open="publishDialogVisible"
      width="500px"
      class="publish-dialog"
    >
      <div>
        <p>{{ $t("Common.Tips") }}</p>
        <p>{{ $t("CMS.Catalog.PublishTips") }}</p>
        <a-checkbox v-model:checked="publishChild">{{
          $t("CMS.Catalog.ContainsChildren")
        }}</a-checkbox>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <a-button @click="publishDialogVisible = false">{{
            $t("Common.Cancel")
          }}</a-button>
          <a-button type="primary" @click="handleDoPublish">{{
            $t("Common.Confirm")
          }}</a-button>
        </div>
      </template>
    </a-modal>
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
      :showRootNode="showCatalogSelectorRootNode"
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
    <!-- 站点文件选择组件 -->
    <cms-file-selector
      v-model:open="openFileSelector"
      suffix="css"
      @ok="handleSetUEditorStyle"
      @close="openFileSelector = false"
    ></cms-file-selector>
    <!-- 进度条 -->
    <cms-progress
      :title="progressTitle"
      v-model:open="openProgress"
      :taskId="taskId"
      @close="handleCloseProgress"
    ></cms-progress>
  </div>
</template>
<script>
import * as catalogApi from "@/api/contentcore/catalog";
import CMSCatalogSelector from "@/views/cms/contentcore/catalogSelector";
import CMSContentSelector from "@/views/cms/contentcore/contentSelector";
import CMSTemplateSelector from "@/views/cms/contentcore/templateSelector";
import CMSProgress from "@/views/components/Progress";
import CMSLogoView from "@/views/cms/components/LogoView";
import CMSEXModelEditor from "@/views/cms/components/EXModelEditor";
import CMSFileSelector from "@/views/cms/components/FileSelector";
import { message, Modal } from "ant-design-vue";
import {
  EditOutlined,
  SendOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  DragOutlined,
  SortAscendingOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons-vue";

export default {
  name: "CMSCatalogInfo",
  components: {
    "cms-exmodel-editor": CMSEXModelEditor,
    "cms-template-selector": CMSTemplateSelector,
    "cms-catalog-selector": CMSCatalogSelector,
    "cms-content-selector": CMSContentSelector,
    "cms-progress": CMSProgress,
    "cms-logo-view": CMSLogoView,
    "cms-file-selector": CMSFileSelector,
    EditOutlined,
    SendOutlined,
    EyeInvisibleOutlined,
    EyeOutlined,
    DragOutlined,
    SortAscendingOutlined,
    DeleteOutlined,
    InfoCircleOutlined,
  },
  props: {
    cid: {
      type: String,
      default: undefined,
      required: false,
    },
  },
  computed: {
    showEXModel() {
      return (
        this.form_info.configProps &&
        this.form_info.configProps.CatalogExtendModel != null &&
        this.form_info.configProps.CatalogExtendModel.length > 0
      );
    },
    catalogVisible() {
      return this.form_info.visibleFlag == "Y";
    },
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      activeName: "basicInfo",
      openCatalogSelector: false,
      catalogSelectorFor: undefined,
      showCatalogSelectorRootNode: false,
      disableLinkCatalog: false,
      openContentSelector: false,
      openTemplateSelector: false, // 是否显示模板选择弹窗
      propKey: "", // 选择模板时记录变更的模板对应属性Key
      openProgress: false, // 是否显示任务进度条
      progressTitle: "",
      progressType: "",
      taskId: "", // 任务ID
      // 发布选项弹窗
      publishDialogVisible: false,
      publishChild: false,
      publishStatus: -1,
      publishPipeActiveName: "", // 当前选中的发布通道Tab
      catalogId: this.cid,
      showSortPop: false,
      sortValue: 0,
      // 栏目信息表单
      form_info: {
        siteId: "",
      },
      catalogTypeOptions: [],
      publishPipes: [], // 栏目发布通道数据
      // 表单校验
      rules: {
        name: [
          {
            required: true,
            message: this.$t("CMS.Catalog.RuleTips.Name"),
            trigger: "blur",
          },
        ],
        alias: [
          {
            required: true,
            message: this.$t("CMS.Catalog.RuleTips.Alias"),
            trigger: "blur",
          },
        ],
        path: [
          {
            required: true,
            pattern: "^[A-Za-z0-9_\/]+$",
            message: this.$t("CMS.Catalog.RuleTips.Path"),
            trigger: "blur",
          },
        ],
      },
      openFileSelector: false,
    };
  },
  created() {
    this.loadCatalogTypes();
    this.loadContentTypes();
    this.loadCatalogInfo();
  },
  watch: {
    cid(newVal) {
      this.catalogId = newVal;
      if (newVal && newVal.length > 0) {
        this.$nextTick(() => {
          this.loadCatalogInfo();
        });
      } else {
        this.form_info = { siteId: "" };
      }
    },
  },
  methods: {
    getDemoContainer() {
      return document.querySelector('.app-main__content') || document.body;
    },
    getDrawerContainer() {
      return document.querySelector('.app-overlay') || document.body;
    },
    handleLogoChange(val) {
      this.form_info.logo = val;
      this.form_info.logoSrc = val;
    },
    loadContentTypes() {
      catalogApi.getContentTypes().then((response) => {
        this.contentTypes = response.data;
      });
    },
    loadCatalogTypes() {
      catalogApi.getCatalogTypes().then((response) => {
        this.catalogTypeOptions = response.data;
      });
    },
    loadCatalogInfo() {
      if (!this.catalogId) {
        return;
      }
      this.loading = true;
      // 重置表单数据
      this.form_info = { siteId: "" };
      catalogApi.getCatalogData(this.catalogId).then((response) => {
        this.form_info = response.data;
        if (this.form_info.publishPipeDatas && this.form_info.publishPipeDatas.length > 0) {
          this.publishPipeActiveName =
            this.form_info.publishPipeDatas[0].pipeCode;
        }
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
          catalogApi.updateCatalog(this.form_info).then((response) => {
            message.success(this.$t("Common.SaveSuccess"));
            this.$emit("update", response.data);
          });
        })
        .catch(() => {});
    },
    handleChangeVisible() {
      Modal.confirm({
        getContainer: this.getDemoContainer,
        title: this.$t("Common.SystemTip"),
        content: this.catalogVisible
          ? "是否在门户网站上隐藏？"
          : "是否在门户网站上显示？",
        onOk: () => {
          const visible = this.form_info.visibleFlag == "Y" ? "N" : "Y";
          catalogApi
            .changeVisible(this.form_info.catalogId, visible)
            .then((response) => {
              message.success(
                this.catalogVisible
                  ? "已设置为在门户网站上隐藏"
                  : "已设置为在门户网站上显示"
              );
              this.form_info.visibleFlag = visible;
            });
        },
      });
    },
    handlePreview() {
      let routeData = this.$router.resolve({
        path: "/cms/preview",
        query: { type: "catalog", dataId: this.form_info.catalogId },
      });
      window.open(routeData.href, "_blank");
    },
    handlePublish(publishStatus) {
      this.publishStatus = publishStatus;
      this.publishDialogVisible = true;
    },
    handleDoPublish() {
      const data = {
        catalogId: this.form_info.catalogId,
        publishDetail: this.publishStatus != -1,
        publishStatus: this.publishStatus,
        publishChild: this.publishChild,
      };
      this.publishDialogVisible = false;
      this.publishChild = false;
      catalogApi.publishCatalog(data).then((response) => {
        this.taskId = response.data;
        this.progressTitle = this.$t("CMS.Catalog.PublishProgressTitle");
        this.progressType = "Publish";
        this.openProgress = true;
        this.$cache.local.set("publish_flag", "true");
      });
    },
    handleDelete() {
      if (!this.catalogId) {
        message.error(this.$t("CMS.Catalog.SelectCatalogFirst"));
        return;
      }
      catalogApi.delCatalog(this.catalogId).then((response) => {
        if (response.data && response.data != "") {
          this.taskId = response.data;
          this.progressTitle = this.$t("CMS.Catalog.DeleteProgressTitle");
          this.progressType = "Delete";
          this.openProgress = true;

          console.log("parentId", this.form_info.parentId);
          this.$cache.local.set(
            "LastSelectedCatalogId",
            this.form_info.parentId
          );
        }
      });
    },
    handleMoveCatalog() {
      this.catalogSelectorFor = "MoveCatalog";
      this.openCatalogSelector = true;
      this.showCatalogSelectorRootNode = true;
      this.disableLinkCatalog = false;
    },
    handleCloseProgress() {
      if (this.progressType == "Delete" || this.progressType == "Move") {
        this.resetForm("form_info");
        this.$emit("remove", this.catalogId);
      }
    },
    handleSelectTemplate(propKey) {
      this.propKey = propKey;
      this.openTemplateSelector = true;
    },
    handleTemplateSelected(template) {
      this.form_info.publishPipeDatas.map((item) => {
        if (item.pipeCode == this.publishPipeActiveName) {
          item.props[this.propKey] = template;
        }
      });
      this.openTemplateSelector = false;
    },
    handleTemplateSelectorCancel() {
      this.openTemplateSelector = false;
    },
    handleApplyToChildren(propKey) {
      const data = {
        catalogId: this.catalogId,
        publishPipeCode: this.publishPipeActiveName,
        publishPipePropKeys: [propKey],
      };
      catalogApi.applyPublishPipeToChildren(data).then((res) => {
        message.success(res.msg);
      });
    },
    handleLinkTo(type) {
      if (type === "content") {
        this.openContentSelector = true;
      } else if (type === "catalog") {
        this.openCatalogSelector = true;
        this.showCatalogSelectorRootNode = false;
        this.disableLinkCatalog = true;
        this.catalogSelectorFor = "";
      }
    },
    handleCatalogSelectorOk(catalogs) {
      if (this.catalogSelectorFor == "MoveCatalog") {
        let toCatalog = "0";
        if (catalogs && catalogs.length > 0) {
          toCatalog = catalogs[0].id;
        }
        catalogApi.moveCatalog(this.catalogId, toCatalog).then((response) => {
          if (response.data && response.data != "") {
            this.taskId = response.data;
            this.progressTitle = this.$t("CMS.Catalog.MoveProgressTitle");
            this.progressType = "Move";
            this.openProgress = true;
          }
        });
      } else {
        if (catalogs && catalogs.length > 0) {
          this.form_info.redirectUrl = catalogs[0].props.internalUrl;
        }
      }
      this.openCatalogSelector = false;
      this.catalogSelectorFor = undefined;
    },
    handleCatalogSelectorClose() {
      this.openCatalogSelector = false;
    },
    handleContentSelectorOk(contents) {
      if (contents && contents.length > 0) {
        this.form_info.redirectUrl = contents[0].internalUrl;
      }
      this.openContentSelector = false;
    },
    handleContentSelectorClose() {
      this.openContentSelector = false;
    },
    handleSortCatalog() {
      if (this.sortValue == 0) {
        message.warning("排序值不能为0");
        return;
      }
      let data = { catalogId: this.catalogId, sort: this.sortValue };
      catalogApi.sortCatalog(data).then((response) => {
        message.success(response.msg);
        this.showSortPop = false;
        this.sortValue = 0;
        this.$emit("update");
      });
    },
    handleSortCatalogCancel() {
      this.showSortPop = false;
      this.sortValue = 0;
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
.catalog-info-container .ant-form-item {
  margin-bottom: 18px;
  width: 700px;
}
.catalog-info-container :deep(.ant-input),
.catalog-info-container :deep(.ant-select),
.catalog-info-container :deep(.ant-input-affix-wrapper) {
  width: 330px;
}
.catalog-info-container .info-card {
  margin-bottom: 10px;
}
</style>
