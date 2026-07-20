<template>
  <div>
    <!-- 筛选条件 -->
    <el-row :gutter="24" class="mb12">
      <el-col :span="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          class="el-form-search"
          style="text-align: right"
          :inline="true"
        >
          <el-form-item prop="title">
            <el-input
              v-model="queryParams.title"
              placeholder="请输入应用名称"
              clearable
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item prop="appScope">
            <el-select
              v-model="queryParams.appScope"
              placeholder="请选择应用覆盖范围"
              clearable
              style="width: 150px"
            >
              <el-option
                v-for="item in appScopeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="targetObject">
            <el-select
              v-model="queryParams.targetObject"
              placeholder="请选择面向对象"
              clearable
              style="width: 150px"
            >
              <el-option
                v-for="item in targetObjectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="审核状态"
              clearable
              style="width: 110px"
            >
              <el-option label="待审核" value="10" />
              <el-option label="已通过" value="20" />
              <el-option label="已拒绝" value="30" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="handleQuery"
              >搜索</el-button>
              <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
            </el-button-group>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      ref="tableAppList"
      size="small"
      :data="appList"
      :height="tableHeight"
      :max-height="tableMaxHeight"
      @row-click="handleRowClick"
      @cell-dblclick="handleEdit"
    >
      <el-table-column
        label="应用名称"
        :show-overflow-tooltip="true"
        min-width="180"
      >
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column
        label="应用ID"
        width="120"
        align="center"
        prop="appId"
      >
        <template slot-scope="scope">
          {{ scope.row.appId || scope.row.contentId }}
        </template>
      </el-table-column>
      <el-table-column
        label="面向对象"
        width="120"
        align="center"
        prop="targetObject"
      >
        <template slot-scope="scope">
          {{ scope.row.targetObject || '未设置' }}
        </template>
      </el-table-column>
      <el-table-column
        label="应用覆盖范围"
        width="200"
        align="center"
        prop="appScope"
      >
        <template slot-scope="scope">
          {{ scope.row.cover ? scope.row.cover.map(item => item.value).join(';') : (scope.row.appScope || '未设置') }}
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        width="80"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.auditStatus === 20 ? 'success' : scope.row.auditStatus === 30 ? 'danger' : 'warning'">
            {{ scope.row.auditStatus === 10 ? '待审核' : scope.row.auditStatus === 20 ? '已通过' : '已拒绝' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="应用服务商"
        :show-overflow-tooltip="true"
        min-width="150"
        prop="serviceProvider"
      >
        <template slot-scope="scope">
          {{ scope.row.serviceProvider || '未设置' }}
        </template>
      </el-table-column>
      <el-table-column
        label="合作企业"
        :show-overflow-tooltip="true"
        min-width="150"
        prop="cooperativeEnterprise"
      >
        <template slot-scope="scope">
          {{ scope.row.cooperativeEnterprise || '未设置' }}
        </template>
      </el-table-column>
      <el-table-column
        label="云服务商"
        :show-overflow-tooltip="true"
        min-width="150"
        prop="cloudProvider"
      >
        <template slot-scope="scope">
          {{ scope.row.cloudProvider || '未设置' }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <span class="btn-cell-wrap">
            <el-button
              v-if="scope.row.auditStatus === 10"
              size="small"
              type="text"
              icon="el-icon-edit"
              @click="startAudit(scope.row)"
            >审核</el-button>
            <el-button
              v-else
              size="small"
              type="text"
              icon="el-icon-view"
              @click.stop="viewDetails(scope.row)"
            >详情</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="loadAppList"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index.vue';
import { getContentList } from '@/api/contentcore/content';

export default {
  name: "DigitalAppAudit",
  components: { Pagination },
  data() {
    return {
      loading: false,
      total: 0,
      tableHeight: 600,
      tableMaxHeight: 600,
      appScopeOptions: [
        { value: '基本公共卫生服务', label: '基本公共卫生服务' },
        { value: '医院信息系统（HIS）', label: '医院信息系统（HIS）' },
        { value: '家庭医生签约', label: '家庭医生签约' },
        { value: '实验室信息管理系统（LIS）', label: '实验室信息管理系统（LIS）' },
        { value: '影像归档和通信系统（PACS）', label: '影像归档和通信系统（PACS）' }
      ],
      targetObjectOptions: [
        { value: '基层医疗卫生机构', label: '基层医疗卫生机构' },
        { value: '公立医院', label: '公立医院' },
        { value: '医技护人员', label: '医技护人员' }
      ],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        appScope: undefined,
        targetObject: undefined,
        status: undefined,
        catalogId: '603612031287365'
      },
      appList: []
    };
  },
  created() {
    this.changeTableHeight();
    this.loadAppList();
  },
  methods: {
    loadAppList() {
      this.loading = true;
      getContentList({
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
        catalogId: this.queryParams.catalogId
      }).then((response) => {
        this.appList = response.data.rows.map(item => ({
          ...item,
          auditStatus: item.status,
          submitTime: item.createTime
        }));
        this.total = parseInt(response.data.total);
        this.loading = false;
      });
    },
    handleRowClick(currentRow) {},
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.loadAppList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    changeTableHeight() {
      let height = document.body.offsetHeight;
      this.tableHeight = height - 330;
      this.tableMaxHeight = this.tableHeight;
    },
    startAudit(app) {
      this.$router.push({
        path: '/portal/auditCenter/digitalAppAuditDetail',
        query: { id: app.contentId }
      });
    },
    viewDetails(app) {
      this.$router.push({
        path: '/portal/auditCenter/digitalAppAuditDetail',
        query: { id: app.contentId }
      });
    }
  }
};
</script>

<style scoped>
.mb12 { margin-bottom: 12px; }
</style>
