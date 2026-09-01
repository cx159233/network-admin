<template>
  <div class="app-container preview-page">
    <div class="header-bar" v-if="type !== 'pagewidget'">
      <span class="pipe-label">{{ $t('CMS.ContentCore.PublishPipe') }}</span>
      <a-select
        v-model:value="selectedPublishPipe"
        size="small"
        style="width: 180px"
        @change="handlePublishPipeChange"
      >
        <a-select-option
          v-for="pp of publishPipes"
          :key="pp.pipeCode"
          :value="pp.pipeCode"
        >
          {{ pp.pipeName }}
        </a-select-option>
      </a-select>
      <a-radio-group size="small" v-model:value="clientType" @change="handleClientTypeChange">
        <a-radio-button v-for="ct in clientTypes" :key="ct.id" :value="ct.id">{{ ct.name }}</a-radio-button>
      </a-radio-group>
      <a-button type="primary" ghost size="small" @click="handleRefresh">
        <template #icon><ReloadOutlined /></template>
        {{ $t('Common.Refresh') }}
      </a-button>
    </div>
    <div :class="previewClass">
      <div class="preview_iframe_wrap">
        <div style="width:100%;height:100%;">
          <iframe id="iframePreview" :src="previewUrl" width="100%" height="100%" frameborder="0"></iframe>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ReloadOutlined } from "@ant-design/icons-vue";
import { getToken } from '@/utils/auth'
import { getPublishPipeSelectData } from "@/api/contentcore/publishpipe";

export default {
  name: "ContentCorePreview",
  components: {
    ReloadOutlined,
  },
  data() {
    return {
      type: this.$route.query.type,
      dataId: this.$route.query.dataId,
      publishPipes: [],
      selectedPublishPipe: undefined,
      previewUrl: undefined,
      clientTypes: [
        { id: "pc", name: this.$t("CMS.ContentCore.ClientType.PC"), className: "preview preview_pc" },
        { id: "phone", name: this.$t("CMS.ContentCore.ClientType.Phone"), className: "preview preview_mobile preview_phone" },
        { id: "pad", name: this.$t("CMS.ContentCore.ClientType.Pad"), className: "preview preview_mobile" }
      ],
      clientType: "pc",
      previewClass: "preview preview_pc",
    };
  },
  mounted() {
    document.body.style['overflow-y'] = 'hidden';
  },
  created() {
    this.loadPublishPipes();
  },
  methods: {
    loadPublishPipes() {
      getPublishPipeSelectData().then(response => {
        this.publishPipes = response.data.rows;
        this.selectedPublishPipe = response.data.rows[0].pipeCode;
        this.handlePublishPipeChange();
      });
    },
    handlePublishPipeChange () {
      this.previewUrl = process.env.VUE_APP_BASE_API + "/cms/preview/" + this.type + "/" + this.dataId
        + "?pp=" + this.selectedPublishPipe + "&Authorization=Bearer " + getToken();
    },
    handleClientTypeChange () {
      this.previewClass = this.clientTypes.find(item => item.id === this.clientType).className
    },
    handleRefresh () {
      document.querySelector('iframe').contentWindow.location.reload();
    }
  }
};
</script>
<style scoped>
.preview-page {
  padding: 0;
}
.preview-page .header-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 40px;
  padding-top: 15px;
  padding-left: 15px;
  box-sizing: content-box;
  background-color: #f7f7f7;
  border-bottom: solid 1px #ddd;
  position: relative;
  z-index: 999;
}
.preview-page .header-bar .pipe-label {
  font-size: 14px;
}
.preview {
    position: absolute;
    top: 60px;
    right: 0;
    bottom: 0;
    left: 0;
    background: #e0e0e1
}
.preview .preview_iframe_wrap iframe {
    background: #fff
}
.preview .preview_iframe_wrap {
    transition: all .3s;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background: #eeeff2
}
.preview.preview_mobile .preview_iframe_wrap {
    bottom: 76px;
    width: 768px;
    height: auto;
    margin-top: 44px;
    margin-bottom: 18px;
    padding-top: 40px;
    padding-bottom: 65px;
    box-shadow: 0 0 7px 0 rgba(53,53,53,.12);
    border-radius: 28px 28px 45px 45px
}
.preview.preview_mobile .preview_iframe_wrap:before {
    width: 45px;
    height: 8px;
    top: 15px;
    border-radius: 4px
}
.preview.preview_mobile .preview_iframe_wrap:after,.preview.preview_mobile .preview_iframe_wrap:before {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    background: #c8c9cc;
    transition: all .3s
}
.preview.preview_mobile .preview_iframe_wrap:after {
    width: 32px;
    height: 32px;
    bottom: 17px;
    border-radius: 50%
}
.preview.preview_phone .preview_iframe_wrap {
    width: 375px;
    margin: 53px auto;
    padding-bottom: 60px;
    border-radius: 33px
}
.preview.preview_phone .preview_iframe_wrap:after {
    width: 30px;
    height: 30px;
    bottom: 15px
}
</style>
