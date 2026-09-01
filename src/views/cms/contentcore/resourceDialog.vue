<template>
  <a-modal :get-container="getDemoContainer"
    class="resource-dialog"
    :title="$t('CMS.Resource.SelectorTitle')"
    :open="visible"
    width="1010px"
    :mask-closable="false"
    :footer="null"
    @cancel="handleCancel"
  >
    <a-tabs v-model:activeKey="activeName">
      <a-tab-pane :tab="$t('CMS.Resource.LocalUpload')" key="local">
        <a-form :model="form_upload" :label-col="{ style: { width: '130px' } }">
          <a-form-item :label="$t('CMS.Resource.Source')" name="source">
            <a-radio-group v-model:value="form_upload.source" button-style="solid">
              <a-radio-button value="local">{{ $t("CMS.Resource.LocalUpload") }}</a-radio-button>
              <a-radio-button value="net">{{ $t("CMS.Resource.RemoteLink") }}</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item v-show="showLocal" :label="$t('CMS.Resource.Upload')" name="path">
            <a-spin :spinning="upload.isUploading">
              <a-upload
                ref="upload"
                list-type="picture-card"
                :accept="upload.accept"
                :max-count="upload.limit"
                :multiple="upload.limit > 1"
                :headers="upload.headers"
                :data="upload.data"
                v-model:file-list="upload.fileList"
                :before-upload="handleFileBeforeUpload"
              >
                <PlusOutlined />
                <template #itemRender="{ file }">
                  <div class="resource-upload-item">
                    <img
                      v-if="isImageResource(file.name)"
                      class="resource-upload-thumb"
                      :src="file.thumbUrl || file.url"
                    />
                    <FileImageOutlined v-else class="resource-upload-fileicon" />
                    <span class="resource-upload-actions">
                      <DeleteOutlined @click="handleRemoveFile(file)" />
                    </span>
                  </div>
                </template>
              </a-upload>
              <div class="resource-upload-tip">
                {{ $t("CMS.Resource.UPloadTip", [upload.accept, fileSizeName]) }}
              </div>
            </a-spin>
          </a-form-item>
          <a-form-item v-show="showNet" :label="$t('CMS.Resource.RemoteLink')" name="path">
            <a-input v-model:value="form_upload.path" placeholder="http(s)://" style="width: 360px" />
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>

    <div class="resource-dialog-footer">
      <a-space>
        <a-button type="primary" :loading="upload.isUploading" @click="handleOk">
          {{ $t("Common.Confirm") }}
        </a-button>
        <a-button @click="handleCancel">{{ $t("Common.Cancel") }}</a-button>
      </a-space>
    </div>
  </a-modal>
</template>
<script>
import { PlusOutlined, DeleteOutlined, FileImageOutlined } from "@ant-design/icons-vue";
import { isImage, getFileSvgIconClass } from "@/utils/chestnut";
import { getResrouceList, getResourceTypes } from "@/api/contentcore/resource";
import { getConfigKey } from "@/api/system/config";

export default {
  name: "CMSResourceDialog",
  components: {
    PlusOutlined,
    DeleteOutlined,
    FileImageOutlined,
  },
  emits: ["ok", "close", "update:open"],
  props: {
    open: {
      type: Boolean,
      default: false,
      required: true,
    },
    rtype: {
      type: String,
      required: false,
      default: "file",
    },
    uploadLimit: {
      type: Number,
      default: 1,
      required: false,
    },
  },
  data() {
    return {
      visible: false,
      activeName: "local",
      form_upload: {
        source: "local",
        tags: [],
      },
      upload: {
        isUploading: false,
        accept: "",
        acceptSize: 0,
        limit: this.uploadLimit,
        headers: {
          CurrentSite: this.$cache.local.get("CurrentSite"),
        },
        url: process.env.VUE_APP_BASE_API + "/cms/resource/upload",
        fileList: [],
        data: {},
      },
      uploadedCount: 0,
      results: [],
      loadingList: false,
      resourcesLoaded: false,
      resourceList: [],
      resourceTotal: 0,
      filterQuery: {
        pageNum: 1,
        pageSize: 10,
        resourceType: this.rtype,
        owner: false,
        name: undefined,
      },
      dateRange: [],
    };
  },
  computed: {
    showLocal() {
      return this.form_upload.source == "local";
    },
    showNet() {
      return this.form_upload.source == "net";
    },
    fileSizeName() {
      if (this.upload.acceptSize > 0) {
        return this.upload.acceptSize / 1024 / 1024 + " MB";
      }
      return "∞";
    },
  },
  watch: {
    open(newVal) {
      this.visible = newVal;
    },
    visible(newVal) {
      if (!newVal) {
        this.noticeClose();
      } else {
        this.upload.isUploading = false;
        this.uploadedCount = 0;
      }
    },
    rtype() {
      this.loadResourceTypes();
    },
  },
  created() {
    this.loadResourceTypes();
    getConfigKey("ResourceUploadAcceptSize").then((res) => {
      this.upload.acceptSize = parseInt(res.data);
    });
  },
  methods: {
    getDemoContainer() {
      return document.querySelector('.app-main__content') || document.body;
    },
    getDrawerContainer() {
      return document.querySelector('.app-overlay') || document.body;
    },
    isImageResource(src) {
      return isImage(src);
    },
    getResourceFileIconClass(path) {
      return getFileSvgIconClass(path);
    },
    loadResourceTypes() {
      getResourceTypes().then((response) => {
        response.data.forEach((item) => {
          if (item.id == this.rtype) {
            this.upload.accept = "." + item.accepts.replaceAll(",", ",.");
          }
        });
      });
    },
    handleRemoveFile(file) {
      const uid = file.uid;
      this.upload.fileList = this.upload.fileList.filter((f) => f.uid !== uid);
    },
    handleFileBeforeUpload(file) {
      if (this.upload.acceptSize > 0 && file.size > this.upload.acceptSize) {
        this.$modal.msgError(this.$t("CMS.Resource.UploadFileSizeLimit", [this.fileSizeName]));
        return false;
      }
      return false;
    },
    uploadOne(file) {
      const rawFile = file.originFileBody || file.originFileObj || file;
      const formData = new FormData();
      formData.append("file", rawFile);
      Object.keys(this.form_upload).forEach((key) => {
        if (key !== "source") {
          formData.append(key, this.form_upload[key]);
        }
      });
      return fetch(this.upload.url, {
        method: "POST",
        headers: this.upload.headers,
        body: formData,
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.code == 200) {
            this.results.push({
              path: response.data.src,
              name: response.data.name,
              src: response.data.src,
              width: response.data.width,
              height: response.data.height,
              fileSize: response.data.fileSize,
              fileSizeName: response.data.fileSizeName,
              resourceType: response.data.resourceType,
            });
          } else {
            this.$modal.msgError(response.msg);
          }
        });
    },
    handleOk() {
      if (this.activeName === "local") {
        if (this.form_upload.source === "local") {
          const pending = this.upload.fileList.filter(
            (f) => f.status !== "removed" && !f.response
          );
          if (pending.length === 0) {
            this.$modal.msgError(this.$t("CMS.Resource.RemoteLinkErr"));
            return;
          }
          if (this.upload.limit && this.upload.fileList.length > this.upload.limit) {
            this.$modal.msgWarning(this.$t("CMS.Resource.UploadLimit", [this.upload.limit]));
            return;
          }
          this.upload.isUploading = true;
          Promise.all(pending.map((f) => this.uploadOne(f)))
            .then(() => {
              this.upload.isUploading = false;
              this.noticeOk();
            })
            .catch(() => {
              this.upload.isUploading = false;
            });
        } else {
          const url = this.form_upload.path;
          if (!url || (!url.startsWith("http://") && !url.startsWith("https://"))) {
            this.$modal.msgError(this.$t("CMS.Resource.RemoteLinkErr"));
            return;
          }
          const name = url.substring(url.lastIndexOf("/") + 1);
          this.results.push({
            path: url,
            name: name,
            src: url,
            width: 0,
            height: 0,
            fileSize: 0,
            fileSizeName: "",
            resourceType: "unknown",
            net: true,
          });
          this.noticeOk();
        }
      } else {
        const selected = this.resourceList.filter((item) => item.selected);
        if (selected.length === 0) {
          this.$modal.msgError(this.$t("Common.SelectFirst"));
          return;
        }
        selected.forEach((item) => {
          this.results.push({
            path: item.src,
            name: item.name,
            src: item.src,
            width: item.width,
            height: item.height,
            fileSize: item.fileSize,
            fileSizeName: item.fileSizeName,
            resourceType: item.resourceType,
          });
        });
        this.noticeOk();
      }
    },
    handleCancel() {
      this.visible = false;
    },
    noticeOk() {
      if (this.visible) {
        this.$emit("ok", this.results);
        this.visible = false;
      }
    },
    noticeClose() {
      if (!this.visible) {
        this.$emit("update:open", false);
        this.$emit("close");
        this.reset();
      }
    },
    reset() {
      this.activeName = "local";
      this.form_upload = { source: "local", tags: [] };
      this.upload.fileList = [];
      this.upload.data = {};
      this.uploadedCount = 0;
      this.results = [];
      this.resourcesLoaded = false;
      this.resourceList = [];
      this.resourceTotal = 0;
      this.filterQuery.pageNum = 1;
      this.filterQuery.owner = false;
      this.filterQuery.name = undefined;
      this.dateRange = [];
    },
  },
};
</script>
<style scoped>
.resource-upload-item {
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background-color: #fafafa;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  overflow: hidden;
}
.resource-upload-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.resource-upload-fileicon {
  font-size: 28px;
  color: #86909c;
}
.resource-upload-actions {
  position: absolute;
  inset: 0;
  display: none;
  place-items: center;
  background-color: rgba(0, 0, 0, 0.45);
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}
.resource-upload-item:hover .resource-upload-actions {
  display: grid;
}
.resource-upload-tip {
  margin-top: 6px;
  font-size: 12px;
  color: #86909c;
}
.resource-dialog-footer {
  text-align: right;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}
</style>
