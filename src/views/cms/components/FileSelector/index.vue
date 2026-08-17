<template>
  <a-modal
    :open="visible"
    title="选择文件"
    :width="1100"
    :mask-closable="false"
    :footer="null"
    @cancel="handleCancel"
  >
    <div class="file-selector-toolbar">
      <a-button type="link" size="small" @click="handlePathClick(-1)">
        <template #icon><FolderOutlined /></template>
      </a-button>
      <template v-for="(item, index) in pathArray" :key="item">
        <span class="path-spliter">/</span>
        <a-button
          v-if="index < pathArray.length - 1"
          type="link"
          size="small"
          @click="handlePathClick(index)"
        >{{ item }}</a-button>
        <span v-else class="path-current">{{ item }}</span>
      </template>
      <a-input
        v-model:value="queryParams.fileName"
        placeholder="请输入文件名"
        allow-clear
        size="small"
        style="width: 180px; margin-left: auto"
        @change="handleFilterFile"
      />
    </div>
    <a-table
      :loading="loading"
      :data-source="fileList"
      row-key="fileName"
      :columns="columns"
      :pagination="false"
      :row-selection="multi ? { selectedRowKeys, onChange: handleSelectionChange } : undefined"
      :row-class-name="rowClassName"
      @row-click="handleRowClick"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'fileName'">
          <a-button
            v-if="record.isDirectory"
            type="link"
            size="small"
            @click.stop="handleDirectoryClick(record)"
          >
            <template #icon><FolderOutlined /></template>{{ record.fileName }}
          </a-button>
          <span v-else><svg-icon :icon-class="record.iconClass" /> {{ record.fileName }}</span>
        </template>
      </template>
    </a-table>
    <div class="dialog-footer">
      <a-button type="primary" @click="handleOk">{{ $t("Common.Confirm") }}</a-button>
      <a-button @click="handleCancel">{{ $t("Common.Cancel") }}</a-button>
    </div>
  </a-modal>
</template>
<script>
import { getFileList } from "@/api/contentcore/file";
import { isImage, getFileSvgIconClass } from "@/utils/chestnut";
import { FolderOutlined } from "@ant-design/icons-vue";

export default {
  name: "CMSFileSelector",
  components: { FolderOutlined },
  emits: ["update:open", "ok", "close"],
  props: {
    open: {
      type: Boolean,
      default: false,
      required: true
    },
    multi: {
      type: Boolean,
      default: false,
      required: false
    },
    path: {
      type: String,
      default: '',
      required: false
    },
    suffix: {
      type: String,
      default: '',
      required: false
    }
  },
  watch: {
    path(newVal) {
      this.queryParams.filePath = newVal
    },
    open() {
      this.visible = this.open;
    },
    suffix(newVal) {
      this.queryParams.fileName = "." + newVal
    },
    visible(newVal) {
      if (!newVal) {
        this.handleClose();
      } else {
        this.loadFileList();
      }
    }
  },
  computed: {
    pathArray() {
      if (this.queryParams.filePath == "/") {
        return [];
      }
      return this.queryParams.filePath.split("/");
    },
  },
  data() {
    return {
      loading: false,
      visible: this.open,
      selectedFiles: [],
      selectedRowKeys: [],
      fileList: [],
      sourceFileList: [],
      queryParams: {
        filePath: '/',
        fileName: ''
      },
      columns: [
        { title: this.$t('CMS.File.FileName'), dataIndex: 'fileName', key: 'fileName' },
        { title: this.$t('CMS.File.FileSize'), dataIndex: 'fileSize', key: 'fileSize', width: 160, align: 'center' },
        { title: this.$t('CMS.File.ModifyTime'), dataIndex: 'modifyTime', key: 'modifyTime', width: 200, align: 'center' },
      ],
    };
  },
  methods: {
    rowClassName(record) {
      return this.selectedRowKeys.indexOf(record.fileName) > -1 ? 'file-row-selected' : '';
    },
    loadFileList() {
      if (!this.visible) {
        return;
      }
      this.loading = true;
      getFileList(this.queryParams).then(response => {
        this.sourceFileList = response.data;
        this.sourceFileList.forEach(f => {
          f.isImage = isImage(f.fileName);
          f.iconClass = getFileSvgIconClass(f.fileName);
        });
        this.fileList = this.sourceFileList;
        this.loading = false;
      });
    },
    handleDirectoryClick(row) {
      this.queryParams.filePath = row.filePath + "/";
      this.loadFileList();
    },
    handlePathClick(index) {
      if (index == -1) {
        this.queryParams.filePath = "/";
      } else {
        this.queryParams.filePath = this.pathArray.slice(0, index + 1).join("/") + "/";
      }
      this.loadFileList();
    },
    handleRowClick(row) {
      if (this.multi) {
        const keys = [...this.selectedRowKeys];
        const idx = keys.indexOf(row.fileName);
        if (idx > -1) keys.splice(idx, 1);
        else keys.push(row.fileName);
        this.selectedRowKeys = keys;
        this.selectedFiles = this.fileList.filter(f => keys.indexOf(f.fileName) > -1);
      } else {
        this.selectedRowKeys = [row.fileName];
        this.selectedFiles = [row];
      }
    },
    handleSelectionChange(keys, rows) {
      this.selectedRowKeys = keys;
      this.selectedFiles = rows;
    },
    handleOk() {
      this.$emit("ok", this.selectedFiles);
    },
    handleClose() {
      this.$emit("update:open", false);
      this.$emit("close");
      this.queryParams.filePath = '/'
      this.selectedFiles = [];
      this.selectedRowKeys = [];
      this.fileList = [];
    },
    handleCancel() {
      this.visible = false;
    },
    handleFilterFile() {
      this.fileList = this.sourceFileList.filter(data => {
        if (!this.queryParams.fileName || this.queryParams.fileName.length == 0) {
          return true;
        }
        return data.fileName.toLowerCase().includes(this.queryParams.fileName.toLowerCase());
      });
    },
  }
};
</script>
<style scoped>
.file-selector-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 10px;
}
.path-spliter {
  margin: 0 4px;
  color: #c0c4cc;
}
.path-current {
  color: #606266;
}
.dialog-footer {
  text-align: right;
  margin-top: 12px;
}
:deep(.file-row-selected > td) {
  background-color: #e6f7ff;
}
</style>
