<template>
  <div class="logo-viewer" :style="{ width: imgWidth, height: imgHeight }">
    <div class="picture" v-show="showImage">
      <a-image
        :src="imageSrc"
        :style="{ width: imgWidth, height: imgHeight }"
        :preview="false"
        fit="scale-down"
        @click="handleEdit"
      />
      <div class="toolbar">
        <a-tooltip :title="$t('Common.View')" placement="top">
          <EyeOutlined @click="handleView" />
        </a-tooltip>
        <a-tooltip :title="$t('Common.Edit')" placement="top">
          <EditOutlined @click="handleEdit" />
        </a-tooltip>
        <a-tooltip :title="$t('Common.Remove')" placement="top">
          <DeleteOutlined @click="handleRemove" />
        </a-tooltip>
      </div>
    </div>
    <div
      v-show="showText"
      class="no-picture"
      :style="{ width: noWidth, height: noHeight, 'font-size': svgSize }"
    >
      <svg-icon icon-class="upload" @click="handleEdit"></svg-icon>
    </div>
    <a-modal :get-container="getDemoContainer"
      v-model:open="showImageViewer"
      :footer="null"
      centered
      width="800px"
      @cancel="handleImageViewerClose"
    >
      <img :src="imageSrc" class="logo-preview-img" />
    </a-modal>
    <cms-resource-dialog
      v-model:open="openResourceDialog"
      rtype="image"
      :upload-limit="1"
      @ok="handleResourceDialogOk"
    >
    </cms-resource-dialog>
  </div>
</template>
<script>
import CMSResourceDialog from "@/views/cms/contentcore/resourceDialog";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons-vue";

export default {
  name: "CMSLogoView",
  components: {
    "cms-resource-dialog": CMSResourceDialog,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
  },
  emits: ["update:modelValue", "changeSrc"],
  props: {
    modelValue: {
      type: String,
      default: undefined,
      required: false,
    },
    src: {
      type: String,
      default: "",
      required: false,
    },
    width: {
      type: Number,
      default: 218,
      required: false,
    },
    height: {
      type: Number,
      default: 150,
      required: false,
    },
  },
  computed: {
    imgWidth() {
      return this.width + "px";
    },
    imgHeight() {
      return this.height + "px";
    },
    noWidth() {
      return this.width - 3 + "px";
    },
    noHeight() {
      return this.height - 3 + "px";
    },
    svgSize() {
      return this.height - 5 + "px";
    },
    showImage() {
      return (
        this.imagePath != undefined &&
        this.imagePath != null &&
        this.imagePath.length > 0
      );
    },
    showText() {
      return (
        this.imagePath == undefined ||
        this.imagePath == null ||
        this.imagePath.length == 0
      );
    },
  },
  watch: {
    modelValue(newVal) {
      this.imagePath = newVal;
    },
    src(newVal) {
      this.imageSrc = newVal;
    },
    imagePath(newVal) {
      this.$emit("update:modelValue", newVal);
    },
    imageSrc(newVal) {
      if (newVal && newVal.length > 0) {
        this.imageViewerList = [newVal];
        this.$emit("changeSrc", newVal);
      } else {
        this.imageViewerList.splice(0);
      }
    },
  },
  data() {
    return {
      imagePath: this.modelValue,
      imageSrc: this.src,
      openResourceDialog: false,
      showImageViewer: false,
      imageViewerList: [],
    };
  },
  methods: {
    getDemoContainer() {
      return document.querySelector('.app-main__content') || document.body;
    },
    getDrawerContainer() {
      return document.querySelector('.app-overlay') || document.body;
    },
    handleResourceDialogOk(results) {
      if (results && results.length > 0) {
        const r = results[0];
        this.imagePath = r.path;
        this.imageSrc = r.src;
      }
    },
    handleView() {
      this.showImageViewer = true;
    },
    handleImageViewerClose() {
      this.showImageViewer = false;
    },
    handleEdit() {
      this.openResourceDialog = true;
    },
    handleRemove() {
      this.imagePath = "";
    },
    handleCut() {
      this.$modal.alert("没整呢~");
    },
  },
};
</script>
<style scoped>
.logo-viewer {
  line-height: 0;
}
.logo-viewer .picture {
  position: relative;
  overflow: hidden;
  background-color: #fff;
  box-sizing: border-box;
  display: block;
}
.logo-viewer .picture:hover .toolbar {
  opacity: 1;
}
.logo-viewer .toolbar {
  position: absolute;
  text-align: center;
  width: 100%;
  height: 30px;
  top: 120px;
  z-index: 100;
  color: #eee;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s;
  opacity: 0;
}
.logo-viewer .toolbar .anticon {
  font-size: 16px;
  padding: 7px;
  cursor: pointer;
}
.logo-viewer .toolbar .anticon:hover {
  color: #409eff;
}
.logo-viewer .no-picture {
  border: 3px dashed #a7a7a7;
  text-align: center;
  color: #777;
  cursor: pointer;
}
.logo-viewer .no-picture:hover {
  color: #409eff;
}
.logo-preview-img {
  width: 100%;
  max-height: 70vh;
  object-fit: contain;
}
</style>
