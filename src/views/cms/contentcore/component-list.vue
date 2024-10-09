<template>
  <div class="app-container">
    <el-row :gutter="24" class="mb12">
      <el-col :span="8">
        <el-row :gutter="10">
          <el-col :span="1.5">
            <el-button
              plain
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              >{{ $t("Common.Add") }}</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              plain
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              >{{ $t("Common.Edit") }}</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              plain
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              >{{ $t("Common.Delete") }}</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              plain
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handlePublish"
              >发布</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              plain
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleSold"
              >下架</el-button
            >
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="16">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          size="mini"
          style="text-align: right"
          class="el-form-search"
        >
          <el-form-item prop="name1">
            <el-select v-model="queryParams.value" placeholder="请选择开放范围">
              <el-option
                v-for="item in resourceTypes"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="name2">
            <el-select v-model="queryParams.value" placeholder="请选择状态">
              <el-option
                v-for="item in resourceTypes"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="name3">
            <el-button-group>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="handleQuery"
                >{{ $t("Common.Search") }}</el-button
              >
              <el-button icon="el-icon-refresh" @click="resetQuery">{{
                $t("Common.Reset")
              }}</el-button>
            </el-button-group>
          </el-form-item>
          <el-form-item prop="name4">
            <el-button-group>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="handleQuery"
                >{{ $t("Common.Search") }}</el-button
              >
              <el-button icon="el-icon-refresh" @click="resetQuery">{{
                $t("Common.Reset")
              }}</el-button>
            </el-button-group>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      style="width: 100%"
      size="small"
      :data="resourceList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="能力组件名称"
        prop="resourceId"
        align="center"
        width="180"
      />
      <el-table-column label="能力组件ID" prop="resourceTypeName" width="80" />
      <el-table-column
        label="面向对象"
        prop="storageType"
        align="center"
        width="120"
      />
      <el-table-column
        label="能力组件覆盖范围"
        prop="fileSizeName"
        align="center"
      />
      <el-table-column label="状态" align="center" width="110">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.CMSContentStatus"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="能力组件服务商"
        prop="storageType"
        align="center"
        width="120"
      />
      <el-table-column
        label="合作企业"
        prop="storageType"
        align="center"
        width="120"
      />
      <el-table-column
        label="云服务商"
        prop="storageType"
        align="center"
        width="120"
      />
      <el-table-column
        :label="$t('Common.Operation')"
        align="center"
        fixed="right"
        width="180"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="small"
            type="text"
            icon="el-icon-edit"
            @click="handleDetail(scope.row)"
            >详情</el-button
          >
          <el-button
            size="small"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >{{ $t("Common.Edit") }}</el-button
          >
          <el-button
            size="small"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >{{ $t("Common.Delete") }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改资源对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item :label="$t('CMS.Resource.UploadResource')">
          <el-upload
            ref="upload"
            drag
            :data="form"
            :action="upload.url"
            :headers="upload.headers"
            :file-list="upload.fileList"
            :on-progress="handleFileUploadProgress"
            :on-success="handleFileSuccess"
            :auto-upload="false"
            :before-upload="handleBeforeUpload"
            :on-change="handleUploadChange"
            :limit="1"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              {{ $t("CMS.Resource.UploadTip1") }}
            </div>
            <div class="el-upload__tip" slot="tip">
              {{ $t("CMS.Resource.UploadTip2", [upload.accept, fileSizeName]) }}
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('CMS.Resource.Name')" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item :label="$t('Common.Remark')" prop="remark">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :loading="upload.isUploading"
          @click="submitForm"
          >{{ $t("Common.Confirm") }}</el-button
        >
        <el-button @click="cancel">{{ $t("Common.Cancel") }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="title"
      :visible.sync="detailDialog"
      width="500px"
      append-to-body
    >
      <p class="fz-16 mt--8">基本信息</p>
      <div class="gird">
        <div class="content">
          <span>能力组件名称</span><span>{{ "--" }}</span>
        </div>
        <div class="content">
          <span>上传LOGO</span><span>{{ "--" }}</span>
        </div>
        <div class="content">
          <span>能力组件描述</span><span>{{ "--" }}</span>
        </div>
        <div class="content">
          <span>系统地址</span><span>{{ "--" }}</span>
        </div>
        <div class="content">
          <span>显示顺序</span><span>{{ "--" }}</span>
        </div>
      </div>

      <p class="pt-24 fz-16">联系信息</p>
      <div class="gird">
        <div class="content">
          <span>服务商名称</span><span>{{ "--" }}</span>
        </div>
        <div class="content">
          <span>合作伙伴名称</span><span>{{ "--" }}</span>
        </div>
        <div class="content">
          <span>联系方式1</span><span>{{ "--" }}</span>
        </div>
        <div class="content">
          <span>联系方式2</span><span>{{ "--" }}</span>
        </div>
      </div>
      <p class="pt-24 fz-16">分类标签</p>
      <div class="gird">
        <div class="content">
          <span>面向对象</span><span>{{ "--" }}</span>
        </div>
        <div class="content">
          <span>能力组件架构</span><span>{{ "--" }}</span>
        </div>
        <div class="content">
          <span>部署云服务商</span><span>{{ "--" }}</span>
        </div>
        <div class="content">
          <span>能力组件覆盖范围</span><span>{{ "--" }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getFileSvgIconClass } from "@/utils/chestnut";
import { getToken } from "@/utils/auth";
import {
  getResourceTypes,
  getResrouceList,
  getResourceDetail,
  delResource,
} from "@/api/contentcore/resource";
import { getConfigKey } from "@/api/system/config";

export default {
  name: "CmsContentcoreResource",
  dicts: ["CMSContentStatus", "CMSContentAttribute"],
  data() {
    return {
      detailDialog: false,
      detail: {},
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 资源表格数据
      resourceList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        resourceType: undefined,
        name: undefined,
        beginTime: undefined,
        endTime: undefined,
      },
      resourceTypes: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          {
            required: true,
            message: this.$t("CMS.Resource.RuleTips.Name"),
            trigger: "blur",
          },
        ],
      },
      // 上传参数
      upload: {
        // 是否禁用上传
        isUploading: false,
        accept: "",
        acceptSize: 0,
        // 设置上传的请求头部
        headers: {
          Authorization: "Bearer " + getToken(),
          CurrentSite: this.$cache.local.get("CurrentSite"),
        },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/cms/resource",
        // 上传的文件列表
        fileList: [],
        data: {},
      },
    };
  },
  computed: {
    fileSizeName() {
      if (this.upload.acceptSize > 0) {
        return this.upload.acceptSize / 1024 / 1024 + " MB";
      } else {
        return "∞";
      }
    },
  },
  created() {
    getConfigKey("ResourceUploadAcceptSize").then((res) => {
      this.upload.acceptSize = parseInt(res.data);
    });
    this.loadResourceTypes();
    this.getList();
  },
  methods: {
    loadResourceTypes() {
      getResourceTypes().then((response) => {
        this.resourceTypes = response.data;
        this.resourceTypes.forEach((item) => {
          this.upload.accept += "." + item.accepts.replaceAll(",", ",.");
        });
      });
    },
    /** 查询资源列表 */
    getList() {
      this.loading = true;
      if (this.dateRange && this.dateRange.length == 2) {
        this.queryParams.beginTime = this.dateRange[0];
        this.queryParams.endTime = this.dateRange[1];
      }
      getResrouceList(this.queryParams).then((response) => {
        this.resourceList = response.data.rows;
        this.resourceList.forEach(
          (r) => (r.iconClass = getFileSvgIconClass(r.name))
        );
        this.total = parseInt(response.data.total);
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        name: "",
        remark: "",
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.resourceType = undefined;
      this.dateRange = [];
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.resourceId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = this.$t("CMS.Resource.AddDialogTitle");
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const resourceId = row.resourceId || this.ids;
      getResourceDetail(resourceId).then((response) => {
        this.form = response.data;
        this.title = this.$t("CMS.Resource.EditDialogTitle");
        this.open = true;
      });
    },
    handleDetail(row) {
      const resourceId = row.resourceId || this.ids;
      getResourceDetail(resourceId).then((response) => {
        this.detail = response.data;
        this.title = "详情";
        this.detailDialog = true;
      });
    },
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    handleFileSuccess(response, file, fileList) {
      this.upload.isUploading = false;
      this.$modal.msgSuccess(response.msg);
      if (response.code == 200) {
        this.open = false;
        this.getList();
      }
      this.$refs.upload.clearFiles();
      this.resetForm("form");
    },
    handleUploadChange(file) {
      file.name = file.name.toLowerCase();
      // if (!file.name.endsWith(".png") && !file.name.endsWith(".jpg")) {
      //   this.$modal.msgError(this.$t('CMS.Resource.FileTypeErrMsg'));
      //   this.upload.fileList = [];
      //   return;
      // }
      this.form.name = file.name;
    },
    handleBeforeUpload(file) {
      return true;
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.$refs.upload.submit();
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const resourceIds = row.resourceId || this.ids;
      this.$modal
        .confirm(this.$t("Common.ConfirmDelete"))
        .then(function () {
          return delResource(resourceIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess(this.$t("Common.DeleteSuccess"));
        })
        .catch(function () {});
    },
    /** 下架 */
    handleSold(row) {
      const resourceIds = row.resourceId || this.ids;
      this.$modal
        .confirm(this.$t("Common.ConfirmDelete"))
        .then(function () {
          return delResource(resourceIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess(this.$t("Common.DeleteSuccess"));
        })
        .catch(function () {});
    },
    /** 发布 */
    handlePublish(row) {
      const resourceIds = row.resourceId || this.ids;
      this.$modal
        .confirm(this.$t("Common.ConfirmDelete"))
        .then(function () {
          return delResource(resourceIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess(this.$t("Common.DeleteSuccess"));
        })
        .catch(function () {});
    },
  },
};
</script>
<style lang="scss" scoped>
.mt--8 {
  margin-top: -8px;
}
.pt-24 {
  padding-top: 24px;
  padding-bottom: 12px;
}
.fz-16 {
  font-size: 16px;
  font-weight: 500;
}
.gird {
  display: grid;
  grid-template-columns: repeat(2, 50%);
  grid-gap: 24px;
}
.content {
  display: flex;
  padding-left: 24px;
  > span:nth-child(1) {
    color: rgba(0, 0, 0, 0.45);
  }
  > span:nth-child(2) {
    padding-left: 8px;
    color: rgba(0, 0, 0, 0.65);
  }
}
</style>
