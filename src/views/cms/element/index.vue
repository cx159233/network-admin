<template>
  <div class="app-container extend">
    <div style="background-color: #fff; padding: 16px 20px">
      <el-form
        :model="queryParams"
        ref="queryForm"
        size="small"
        :inline="true"
        v-show="showSearch"
        label-width="68px"
        style="background-color: #fff"
      >
        <el-form-item label="组件标题" prop="elementTitle">
          <el-input
            v-model="queryParams.elementTitle"
            placeholder="请输入组件标题"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            style="border-color: #1890ff; color: #1890ff"
            size="mini"
            @click="handleQuery"
            >搜索</el-button
          >
          <el-button
            style="border-color: #1890ff; color: #1890ff"
            size="mini"
            @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>

      <el-row :gutter="10" style="margin-right: 0">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['system:element:addOrUpdate']"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            size="mini"
            type="primary"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['system:element:addOrUpdate']"
            >修改</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            size="mini"
            type="primary"
            :disabled="!multiple"
            @click="handleDelete"
            v-hasPermi="['system:element:remove']"
            >删除</el-button
          >
        </el-col>
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
        <Tips :chosedNum="multiple"></Tips>
      </el-row>
    </div>
    <div
      style="
        background-color: #fff;
        padding: 0 20px 20px 20px;
        flex: 1;
        overflow-y: auto;
      "
    >
      <el-table
        v-loading="loading"
        :data="infoList"
        @selection-change="handleSelectionChange"
        style="background-color: #fff"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="组件类型" prop="elementType" />
        <el-table-column label="组件标题" prop="elementTitle" />
        <el-table-column
          label="组件标志符"
          prop="elementCode"
          :show-overflow-tooltip="true"
        />
        <el-table-column prop="icon" label="图标" width="100">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.icon" v-if="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column label="是否可用">
          <template slot-scope="scope">
            {{ scope.row.status === 1 ? "可用" : "不可用" }}
          </template>
        </el-table-column>
        <el-table-column
          label="组件权限字符"
          prop="permission"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="组件配置"
          prop="elementContext"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="操作" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:element:addOrUpdate']"
              >修改</el-button
            >
            <el-button
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:element:delete']"
              >删除</el-button
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
    </div>

    <!-- 添加或修改组件管理对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="96px">
        <el-form-item label="组件类型" prop="elementType">
          <el-input v-model="form.elementType" placeholder="请输入组件类型" />
        </el-form-item>
        <el-form-item label="组件标题" prop="elementTitle">
          <el-input v-model="form.elementTitle" placeholder="请输入组件标题" />
        </el-form-item>
        <el-form-item label="组件标识符" prop="elementCode">
          <el-input v-model="form.elementCode" placeholder="请输入组件标识符" />
        </el-form-item>
        <el-form-item label="组件图标" prop="icon">
          <el-popover
            placement="bottom-start"
            width="620"
            trigger="click"
            @show="$refs['iconSelect'].reset()"
          >
            <IconSelect ref="iconSelect" @selected="selected" />
            <el-input
              slot="reference"
              v-model="form.icon"
              placeholder="点击选择图标"
              clearable
              @change="iconChange"
            >
              <svg-icon
                v-if="form.icon"
                slot="prefix"
                :icon-class="form.icon"
                class="el-input__icon"
                style="height: 32px; width: 16px"
              />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </el-form-item>
        <el-form-item label="是否可用" prop="menuType">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">可用</el-radio>
            <el-radio :label="0">不可用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="组件权限字符" prop="permission">
          <el-input v-model="form.permission" placeholder="请输入组件类型" />
        </el-form-item>
        <el-form-item label="组件配置" prop="elementContext">
          <el-input
            v-model="form.elementContext"
            placeholder="请输入组件配置"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryElementList,
  deleteMenu,
  addOrUpdateTemplate,
} from "@/api/system/template";
import Tips from "./components/Tips";
import IconSelect from "./components/IconSelect";
export default {
  name: "element",
  components: {
    Tips,
    IconSelect,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: 0,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 组件管理表格数据
      infoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        elementTitle: null,
        elementCode: null,
        elementContext: null,
        elementType: null,
        icon: null,
        permission: null,
        status: 1,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    iconChange(val) {
      this.form.icon = val || "#";
    },
    // 选择图标
    selected(name) {
      this.form.icon = name;
    },
    /** 查询组件管理列表 */
    getList() {
      this.loading = true;
      queryElementList(this.queryParams).then((response) => {
        this.infoList = response.rows;
        this.total = response.total;
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
        id: null,
        elementTitle: null,
        elementCode: null,
        elementContext: null,
        elementType: null,
        icon: null,
        permission: null,
        status: 1,
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
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加组件管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      let obj = row;
      if (this.ids) {
        this.infoList.forEach((item) => {
          if (this.ids.includes(item.id)) {
            obj = item;
          }
        });
      }
      this.reset();
      this.open = true;
      this.title = "修改组件管理";
      this.form = JSON.parse(JSON.stringify(obj)) || {};
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          addOrUpdateTemplate(this.form).then((response) => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除组件管理编号为"' + ids + '"的数据项？')
        .then(function () {
          return deleteMenu(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
  },
};
</script>
