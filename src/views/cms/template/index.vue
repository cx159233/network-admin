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
        <el-form-item label="模版名称" prop="templateName">
          <el-input
            v-model="queryParams.templateName"
            placeholder="请输入模版名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="模版类型" prop="templateType">
          <el-select
            v-model="queryParams.templateType"
            placeholder="请选择模版类型"
          >
            <el-option
              v-for="item in options"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option>
          </el-select>
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
        style="background-color: #fff"
      >
        <el-table-column label="模版类型" prop="templateTypeDesc" />
        <el-table-column label="模版id" prop="id" />
        <el-table-column
          label="模版名称"
          prop="templateName"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="模版归属"
          prop="userName"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="模版说明"
          prop="templateDesc"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="模版关联角色"
          prop="roleNameList"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="操作" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="action(1, scope.row)"
              v-hasPermi="['system:template:find']"
              >查看</el-button
            >
            <el-button
              type="text"
              @click="action(2, scope.row)"
              v-hasPermi="['system:template:delete']"
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
  </div>
</template>

<script>
import { queryTemplate, deleteTemplate } from "@/api/system/template";
export default {
  name: "template",
  data() {
    return {
      options: [
        { key: 0, value: "公共模版" },
        { key: 1, value: "用户自定义模版" },
      ],
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 模版管理表格数据
      infoList: [],
      // 弹出层标题
      title: "",
      deptOptions: [],
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        templateName: null,
        templateType: null,
      },
      // 表单参数
      form: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    action(index, row) {
      if (index === 1) {
        window.open(`${window.location.origin}/index?templateId=${row.id}`);
        // this.$router.push({
        //   path: "/index",
        //   query: {
        //     templateId: row.id,
        //   },
        // });
      } else {
        if (index === 2) this.handleDelete(row);
      }
    },
    /** 查询模版管理列表 */
    getList() {
      this.loading = true;
      queryTemplate(this.queryParams).then((response) => {
        this.infoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id;
      this.$modal
        .confirm('是否确认删除模版管理编号为"' + ids + '"的数据项？')
        .then(function () {
          return deleteTemplate(ids);
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
