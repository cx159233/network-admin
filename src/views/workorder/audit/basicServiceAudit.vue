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
          <el-form-item prop="serviceName">
            <el-input
              v-model="queryParams.serviceName"
              placeholder="请输入服务名称"
              clearable
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item prop="cloudProvider">
            <el-select
              v-model="queryParams.cloudProvider"
              placeholder="请选择云服务商"
              clearable
              style="width: 150px"
            >
              <el-option
                v-for="item in cloudProviderOptions"
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
      ref="tableServiceList"
      size="small"
      :data="serviceList"
      :height="tableHeight"
      :max-height="tableMaxHeight"
      @row-click="handleRowClick"
      @cell-dblclick="handleEdit"
    >
      <el-table-column
        label="服务名称"
        :show-overflow-tooltip="true"
        min-width="180"
      >
        <template slot-scope="scope">
          {{ scope.row.serviceName }}
        </template>
      </el-table-column>
      <el-table-column
        label="服务ID"
        width="140"
        align="center"
        prop="serviceId"
      >
        <template slot-scope="scope">
          {{ scope.row.serviceId }}
        </template>
      </el-table-column>
      <el-table-column
        label="服务描述"
        :show-overflow-tooltip="true"
        min-width="250"
        prop="description"
      >
        <template slot-scope="scope">
          {{ scope.row.description || '无' }}
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
        label="服务类型"
        width="120"
        align="center"
        prop="serviceType"
      >
        <template slot-scope="scope">
          {{ scope.row.serviceType || '未设置' }}
        </template>
      </el-table-column>
      <el-table-column
        label="区域"
        width="120"
        align="center"
        prop="region"
      >
        <template slot-scope="scope">
          {{ scope.row.region || '未设置' }}
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
      @pagination="loadServiceList"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index.vue';

export default {
  name: "BasicServiceAudit",
  components: { Pagination },
  data() {
    return {
      loading: false,
      total: 0,
      tableHeight: 600,
      tableMaxHeight: 600,
      cloudProviderOptions: [
        { value: '影像云', label: '影像云' },
        { value: '电信云', label: '电信云' },
        { value: '移动云', label: '移动云' },
        { value: '联通云', label: '联通云' },
        { value: '浪潮云', label: '浪潮云' }
      ],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        serviceName: undefined,
        cloudProvider: undefined,
        status: undefined,
      },
      serviceList: [],
    };
  },
  created() {
    this.changeTableHeight();
    this.loadServiceList();
  },
  methods: {
    loadServiceList() {
      this.loading = true;
      setTimeout(() => {
        this.serviceList = [
          {
            serviceId: 'SVC001',
            serviceName: '云服务器ECS',
            description: '弹性计算服务，提供安全可靠、弹性可扩展的云服务器',
            serviceType: 'ecs',
            cloudProvider: '电信云',
            region: '华东',
            status: 20,
            auditStatus: 20,
            submitTime: '2024-10-18 11:21:45'
          },
          {
            serviceId: 'SVC002',
            serviceName: '对象存储OSS',
            description: '安全、稳定、高效的云存储服务',
            serviceType: 'storage',
            cloudProvider: '移动云',
            region: '华北',
            status: 20,
            auditStatus: 20,
            submitTime: '2024-10-21 14:45:23'
          },
          {
            serviceId: 'SVC003',
            serviceName: '云数据库RDS',
            description: '稳定可靠的关系型数据库服务',
            serviceType: 'database',
            cloudProvider: '联通云',
            region: '华南',
            status: 10,
            auditStatus: 10,
            submitTime: '2024-10-21 15:38:24'
          }
        ];
        this.total = 3;
        this.loading = false;
      }, 500);
    },
    handleRowClick(currentRow) {},
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.loadServiceList();
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
    startAudit(service) {
      this.$router.push({
        path: '/portal/auditCenter/basicServiceAuditDetail',
        query: { id: service.serviceId }
      });
    },
    viewDetails(service) {
      this.$router.push({
        path: '/portal/auditCenter/basicServiceAuditDetail',
        query: { id: service.serviceId }
      });
    }
  }
};
</script>

<style scoped>
.mb12 { margin-bottom: 12px; }
</style>
