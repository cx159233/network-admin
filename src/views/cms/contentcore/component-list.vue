<template>
  <div class="app-container">
    <el-row :gutter="24" class="mb12">
      <el-col :span="8">
        <el-row :gutter="10" class="mt--8">
          <el-col :span="1.5" class="mt-8">
            <el-button
              plain
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              >{{ $t("Common.Add") }}</el-button
            >
          </el-col>
          <el-col :span="1.5" class="mt-8">
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
          <el-col :span="1.5" class="mt-8">
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
          <el-col :span="1.5" class="mt-8">
            <el-button
              plain
              type="success"
              icon="el-icon-s-promotion"
              size="mini"
              :disabled="multiple"
              @click="handlePublish"
              >发布</el-button
            >
          </el-col>
          <el-col :span="1.5" class="mt-8">
            <el-button
              plain
              type="warning"
              icon="el-icon-download"
              size="mini"
              :disabled="multiple"
              @click="handleSold"
              >下线</el-button
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
          class="el-form-search mt--8"
        >
          <el-form-item prop="name" class="mt-8">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入能力组件名称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="name1" class="mt-8">
            <el-select
              v-model="cover"
              multiple
              placeholder="开放范围"
              clearable
            >
              <el-option
                v-for="item in dict.type.OpenRange"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="status" class="mt-8">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择状态"
              clearable
            >
              <el-option
                v-for="item in statusColumn"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="mt-8">
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
        prop="name"
        align="center"
        width="180"
      />
      <el-table-column label="能力组件ID" prop="componentId" width="120" />
      <el-table-column label="组件描述" prop="description" align="center" />
      <el-table-column label="状态" align="center" width="110">
        <template slot-scope="scope">
          <dict-tag :options="statusColumn" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
        label="组件服务商"
        prop="serviceProviderName"
        align="center"
        width="120"
      />

      <el-table-column
        label="云服务商"
        prop="deployServiceProviderView"
        align="center"
        width="120"
      />
      <el-table-column label="开放范围" align="center" width="110">
        <template slot-scope="scope">
          <span>{{ dealCover(scope.row.cover) }}</span>
        </template>
      </el-table-column>
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
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <p class="fz-16 mt--8">基本信息</p>
        <el-form-item label="能力组件名称" prop="name">
          <el-input v-model="form.name" maxlength="20" />
        </el-form-item>
        <el-form-item label="上传LOGO">
          <el-upload
            ref="upload"
            drag
            :data="form"
            :action="upload.url"
            :headers="upload.headers"
            :file-list="upload.fileList"
            :on-progress="handleFileUploadProgress"
            :on-success="handleFileSuccess"
            :before-upload="handleBeforeUpload"
            :on-change="handleUploadChange"
            :limit="1"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              建议上传图片尺寸为640*640，大小不超过1M支持jpg、jpeg、png、bmp图片格式
            </div>
            <div class="el-upload__tip" slot="tip">
              {{ $t("CMS.Resource.UploadTip2", [upload.accept, fileSizeName]) }}
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="能力组件描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            maxlength="1000"
            :autosize="{ minRows: 4, maxRows: 4 }"
          />
        </el-form-item>

        <!-- <el-form-item label="系统地址" prop="address">
          <el-input v-model="form.address" />
        </el-form-item> -->
        <el-form-item label="显示顺序" prop="showOrder">
          <el-input-number v-model="form.showOrder" :min="0" />
        </el-form-item>
        <p class="fz-16">联系信息</p>
        <el-form-item label="服务商名称" prop="serviceProviderName">
          <el-input v-model="form.serviceProviderName" maxlength="20" />
        </el-form-item>
        <el-form-item label="合作伙伴名称" prop="partnerName">
          <el-input
            v-model="form.partnerName"
            placeholder="请输入合作伙伴全称，多个合作伙伴请通过；分隔"
          />
        </el-form-item>
        <el-form-item label="联系方式1" prop="lxr1">
          <div class="flex">
            <el-input
              v-model="form.contactName1"
              placeholder="请输入联系人姓名"
              maxlength="20"
            />
            <span class="pl-4"> - </span>
            <el-input
              v-model="form.contactPhone1"
              placeholder="请输入联系人手机号"
              maxlength="20"
            />
          </div>
        </el-form-item>
        <el-form-item label="联系方式2">
          <div class="flex">
            <el-input
              v-model="form.contactName2"
              placeholder="请输入联系人姓名"
              maxlength="20"
            />
            <span class="pl-4"> - </span>
            <el-input
              v-model="form.contactPhone2"
              placeholder="请输入联系人手机号"
              maxlength="20"
            />
          </div>
        </el-form-item>
        <p class="fz-16">分类标签</p>
        <el-form-item label="开放范围" prop="cover">
          <el-radio-group v-model="form.cover">
            <el-radio
              v-for="(item, index) in dict.type.OpenRange"
              :label="`${item.value}`"
              :key="index"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="部署云服务商" prop="deployServiceProvider">
          <el-radio-group v-model="form.deployServiceProvider">
            <el-radio
              v-for="(item, index) in dict.type.CloudProvider"
              :label="`${item.value}`"
              :key="index"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
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
      width="800px"
      append-to-body
    >
      <p class="fz-16 mt--8">基本信息</p>
      <div class="gird">
        <div class="content">
          <span>能力组件名称</span><span>{{ detail.name || "--" }}</span>
        </div>
        <div class="content">
          <span class="pr-16">LOGO</span>
          <img :src="detail.logo" v-if="detail.logo" class="img" />
          <span v-else>--</span>
        </div>
        <div class="content">
          <span>显示顺序</span><span>{{ detail.showOrder || "--" }}</span>
        </div>
      </div>
      <div class="content pt-24">
        <span>能力组件描述</span><span>{{ detail.description || "--" }}</span>
      </div>
      <p class="pt-24 fz-16">联系信息</p>
      <div class="gird">
        <div class="content">
          <span>服务商名称</span
          ><span>{{ detail.serviceProviderName || "--" }}</span>
        </div>
        <div class="content">
          <span>联系方式1</span
          ><span
            >{{ detail.contactName1 || "--" }}
            {{ detail.contactPhone1 || "--" }}</span
          >
        </div>
        <div class="content">
          <span>联系方式2</span
          ><span
            >{{ detail.contactName2 || "--" }}
            {{ detail.contactPhone2 || "--" }}</span
          >
        </div>
      </div>
      <p class="pt-24 fz-16">分类标签</p>
      <div class="gird">
        <div class="content">
          <span>开放范围</span><span>{{ dealCover(detail.cover) }}</span>
        </div>
        <div class="content">
          <span>部署云服务商</span
          ><span>{{ detail.deployServiceProviderView || "--" }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { getToken } from "@/utils/auth";
import {
  createComponent,
  getCmsPutComponent,
  getComponentDetail,
  getComponentList,
  deleteComponent,
  publishComponent,
  putComponent,
} from "@/api/admin/index";

export default {
  name: "CmsContentcoreResource",
  dicts: ["OpenRange", "CloudProvider", "STATUS"],
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
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        resourceType: undefined,
        name: undefined,
      },
      resourceTypes: [],
      // 表单参数
      form: {
        name: "",
        showOrder: 0,
        logo: "",
        description: "",
        address: "",
        serviceProviderName: "",
        partnerName: "",
        contactName1: "",
        contactPhone1: "",
        contactName2: "",
        contactPhone2: "",
        architecture: "",
        deployServiceProvider: "",
        cover: undefined,
        status: undefined,
      },
      // 表单校验
      checkList: [],
      rules: {
        name: [
          {
            required: true,
            message: "请输入能力组件名称",
            trigger: ["blur", "change"],
          },
        ],
        description: [
          {
            required: true,
            message: "请输入能力组件描述",
            trigger: ["blur", "change"],
          },
        ],
        showOrder: [
          {
            required: true,
            message: "请输入显示顺序",
            trigger: ["blur", "change"],
          },
        ],
        // address: [
        //   {
        //     required: true,
        //     message: "请输入服务商名称",
        //     trigger: ["blur", "change"],
        //   },
        // ],
        // serviceProviderName: [
        //   {
        //     required: true,
        //     message: "请输入服务商名称",
        //     trigger: ["blur", "change"],
        //   },
        // ],
        // lxr1: [
        //   {
        //     required: true,
        //     trigger: ["blur", "change"],
        //     //方法
        //     validator: (rule, value, callback) => {
        //       if (!this.form.contactName1) {
        //         callback(new Error("请输入联系人姓名"));
        //       } else if (!this.form.contactPhone1) {
        //         callback(new Error("请输入联系人手机号"));
        //       } else {
        //         callback();
        //       }
        //     },
        //   },
        // ],
        cover: [
          {
            required: true,
            message: "请选择组件开放范围范围",
            trigger: ["blur", "change"],
          },
        ],
        deployServiceProvider: [
          {
            required: true,
            message: "请选择部署云服务商",
            trigger: ["blur", "change"],
          },
        ],
      },
      // 上传参数
      upload: {
        // 是否禁用上传
        isUploading: false,
        accept: "image/png, image/jpeg,image/jpg,image/bmp",
        acceptSize: 1 * 1024 * 1024,
        // 设置上传的请求头部
        headers: {
          // Authorization: "Bearer " + getToken(),
          CurrentSite: this.$cache.local.get("CurrentSite"),
        },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/cms/resource/upload",
        // 上传的文件列表
        fileList: [],
        data: {},
      },
      cover: undefined,
      statusColumn: [],
    };
  },
  watch: {
    "dict.type.STATUS": {
      handler(val) {
        let arr = [];
        val.forEach((i) => {
          arr.push({
            label: i.label,
            value: i.raw.dictValue,
            raw: {
              listClass:
                i.raw.dictValue === "0"
                  ? "default"
                  : i.raw.dictValue === "10"
                  ? "success"
                  : "danger",
            },
          });
        });
        this.statusColumn = arr;
      },
      deep: true,
    },
  },
  computed: {
    fileSizeName() {
      return this.upload.acceptSize / 1024 / 1024 + " MB";
    },
  },
  created() {
    this.getList();
  },
  methods: {
    dealCover(cover) {
      let str = "--";
      this.dict.type.OpenRange.forEach((i) => {
        if (`${i.value}` == cover) {
          str = i.label;
        }
      });
      return str;
    },
    /** 查询资源列表 */
    getList() {
      this.loading = true;
      getComponentList(this.queryParams)
        .then((response) => {
          this.resourceList = response.data.rows;
          this.total = parseInt(response.data.total);
          this.loading = false;
        })
        .catch((error) => {
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
        showOrder: 0,
        logo: "",
        description: "",
        address: "",
        serviceProviderName: "",
        partnerName: "",
        contactName1: "",
        contactPhone1: "",
        contactName2: "",
        contactPhone2: "",
        architecture: "",
        deployServiceProvider: "",
        cover: undefined,
        status: undefined,
      };
      this.upload.fileList = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      if (this.cover) {
        let arr = this.dict.type.OpenRange.filter(
          (i) => i.label === "不限"
        ).map((i) => i.value);
        this.queryParams.cover = this.cover
          .filter((i) => !arr.includes(i))
          .join(";");
      }
      this.queryParams.pageNum = 1;

      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.resourceType = undefined;
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.componentId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const componentId = row.componentId || this.ids;
      getComponentDetail(componentId).then((response) => {
        this.form = response.data;
        this.title = "编辑";
        this.open = true;
      });
    },
    handleDetail(row) {
      const componentId = row.componentId || this.ids;
      getComponentDetail(componentId).then((response) => {
        this.detail = response.data;
        this.title = `${this.detail.name}详情`;
        this.detailDialog = true;
      });
    },
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    handleFileSuccess(response, file, fileList) {
      this.form.logo = file?.response?.data?.src;
      this.upload.fileList = fileList;
      this.upload.isUploading = false;
      this.$modal.msgSuccess(response.msg);
    },
    handleUploadChange(file) {
      console.log(file);
      // this.form.name = file.name;
    },
    handleBeforeUpload(file) {
      return true;
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          let res = null;
          this.upload.isUploading = true;
          const form = {
            ...this.form,
            status: 0,
          };
          if (this.title === "新增") {
            res = await createComponent(form);
          } else {
            res = await getCmsPutComponent(form);
          }
          if (res.code === 200) {
            this.$modal.msgSuccess(res.msg);
            this.open = false;
            this.getList();
          }
          this.upload.isUploading = false;
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const componentIds = row.componentId ? [row.componentId] : this.ids;
      this.$modal
        .confirm(this.$t("Common.ConfirmDelete"))
        .then(function () {
          return deleteComponent(componentIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess(this.$t("Common.DeleteSuccess"));
        })
        .catch(function () {});
    },
    /** 下架 */
    handleSold(row) {
      const componentIds = row.componentId || this.ids;
      this.$modal
        .confirm("下线后门户网站不可见，确认要下线吗？")
        .then(function () {
          return putComponent(componentIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("下线成功");
        })
        .catch(function () {});
    },
    /** 发布 */
    handlePublish(row) {
      const componentIds = row.componentId || this.ids;
      this.$modal
        .confirm("发布后门户网站可见，确认要发布吗？")
        .then(function () {
          return publishComponent(componentIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("发布成功");
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
.pr-16 {
  padding-right: 16px;
}
.pt-24 {
  padding-top: 24px;
  padding-bottom: 12px;
}
.img {
  width: 40px;
  height: 40px;
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
.flex {
  display: flex;
}
.pl-4 {
  padding: 0 4px;
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
    flex: 1;
  }
}
.mt--8 {
  margin-top: -8px;
}
.mt-8 {
  margin-top: 8px;
}
</style>
