<template>
  <a-modal
    :open="visible"
    :title="title"
    :width="500"
    :mask-closable="false"
    :centered="true"
    :footer="null"
    @cancel="handleCancel"
  >
    <div class="percent_info">{{ progressMessage }}</div>
    <div class="err_messages" v-if="hasErrMessages()" v-html="formatErrMsg"></div>
    <a-progress
      :percent="percent"
      :status="progressStatus"
      :stroke-width="15"
    />
  </a-modal>
</template>

<script>
import { getTaskInfo } from "@/api/system/async";
import { message } from 'ant-design-vue'

export default {
  name: "AsyncTaskProgress",
  props: {
    open: {
      type: Boolean,
      default: false,
      required: true
    },
    taskId: {
      type: String,
      required: true,
      default: ""
    },
    title: {
      type: String,
      default: "任务进度",
      required: false
    },
    autoClose: {
      type: Boolean,
      default: true,
      required: false
    },
    interval: {
      type: Number,
      default: 1000,
      required: false
    }
  },
  emits: ['update:open', 'close'],
  watch: {
    open(newVal) {
      this.visible = newVal;
    },
    visible(newVal) {
      if (!newVal) {
        this.handleClose();
      } else {
        this.startInterval();
      }
    }
  },
  computed: {
    formatErrMsg() {
      return this.hasErrMessages() ? this.errMessages.join("<br/>") : "";
    }
  },
  data() {
    return {
      visible: this.open,
      progressMessage: this.$t('Component.Progress.TaskIsRunning'),
      errMessages: "",
      percent: 0,
      progressStatus: 'active',
      timer: undefined,
      resultStatus: undefined,
    };
  },
  methods: {
    startInterval() {
      if (this.taskId != "") {
        this.getProgressInfo();
        this.timer = setInterval(this.getProgressInfo, this.interval);
      }
    },
    getProgressInfo() {
      if (!this.taskId || this.taskId == '') {
        return;
      }
      getTaskInfo(this.taskId).then(response => {
        this.progressMessage = response.data.progressMessage;
        this.percent = response.data.percent;
        this.resultStatus = response.data.status;
        if (response.data.status == 'SUCCESS' || response.data.status == 'INTERRUPTED') {
          clearInterval(this.timer);
          const successMsg = response.data.progressMessage ? response.data.progressMessage : this.title + this.$t('Component.Progress.Completed');
          message.success(successMsg);
          this.progressStatus = "success";
          this.errMessages = response.data.errMessages;
          if (this.autoClose && !this.hasErrMessages()) {
            this.visible = false;
          }
        } else if (response.data.status == 'FAILED') {
          clearInterval(this.timer);
          this.percent = 100;
          this.progressStatus = "exception";
          this.errMessages = response.data.errMessages;
        } else {
        }
      });
    },
    hasErrMessages() {
      return this.errMessages && this.errMessages != null && this.errMessages.length > 0;
    },
    handleClose() {
      if (!this.visible) {
        clearInterval(this.timer);
        this.$emit('update:open', false);
        this.$emit("close", { status: this.resultStatus });
        this.percent = 0;
        this.progressMessage = "";
        this.errMessages = [];
        this.progressStatus = 'active';
        this.resultStatus = undefined;
      }
    },
    handleCancel() {
      this.visible = false;
    }
  },
  beforeUnmount() {
    clearInterval(this.timer);
  }
};
</script>

<style scoped>
.percent_info {
  padding: 10px 5px;
  width: 450px;
  line-height: 20px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.err_messages {
  max-height: 100px;
  overflow-y: scroll;
}
</style>
