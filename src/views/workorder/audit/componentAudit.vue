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
          <el-form-item prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入组件名称"
              clearable
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item prop="cover">
            <el-select
              v-model="queryParams.cover"
              placeholder="请选择开放范围"
              clearable
              style="width: 150px"
            >
              <el-option
                v-for="item in coverOptions"
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
      ref="tableComponentList"
      size="small"
      :data="componentList"
      :height="tableHeight"
      :max-height="tableMaxHeight"
      @row-click="handleRowClick"
      @cell-dblclick="handleEdit"
    >
      <el-table-column
        label="能力组件名称"
        :show-overflow-tooltip="true"
        min-width="180"
      >
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
        label="能力组件ID"
        width="140"
        align="center"
        prop="componentId"
      >
        <template slot-scope="scope">
          {{ scope.row.componentId }}
        </template>
      </el-table-column>
      <el-table-column
        label="组件描述"
        :show-overflow-tooltip="true"
        min-width="250"
        prop="description"
      >
        <template slot-scope="scope">
          {{ scope.row.description || '无' }}
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
        label="组件服务商"
        :show-overflow-tooltip="true"
        min-width="150"
        prop="serviceProviderName"
      >
        <template slot-scope="scope">
          {{ scope.row.serviceProviderName || '未设置' }}
        </template>
      </el-table-column>
      <el-table-column
        label="云服务商"
        :show-overflow-tooltip="true"
        min-width="120"
        prop="deployServiceProviderView"
      >
        <template slot-scope="scope">
          {{ scope.row.deployServiceProviderView || '未设置' }}
        </template>
      </el-table-column>
      <el-table-column
        label="开放范围"
        width="120"
        align="center"
        prop="coverView"
      >
        <template slot-scope="scope">
          {{ scope.row.coverView || '未设置' }}
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
      @pagination="loadComponentList"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index.vue';

export default {
  name: "ComponentAudit",
  components: { Pagination },
  data() {
    return {
      loading: false,
      total: 0,
      tableHeight: 600,
      tableMaxHeight: 600,
      coverOptions: [
        { value: '不限', label: '不限' },
        { value: '市级', label: '市级' },
        { value: '区（县）域', label: '区（县）域' }
      ],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        cover: undefined,
        status: undefined,
      },
      componentList: [],
      mockData: [
        {
          componentId: 'NLZJ202410210001',
          name: '电子健康卡',
          description: '电子健康卡是按照国家统一标准生成的、具备身份识别功能的「健康身份证」，可实现诊前、诊中、诊后各环节医疗服务「一码通用」。',
          serviceProviderName: '中科软科技',
          deployServiceProviderView: '影像云',
          coverView: '市级',
          auditStatus: 10,
          submitTime: '2024-10-21 10:43:04'
        },
        {
          componentId: 'NLZJ202410220001',
          name: '无界诊疗的云桌面系统',
          description: '提供手机、平板、笔记本等多种可移动接入的国产化云桌面诊疗终端，一套专属账号保障了所有数据的跟随。',
          serviceProviderName: '华为技术',
          deployServiceProviderView: '移动云',
          coverView: '区（县）域',
          auditStatus: 10,
          submitTime: '2024-10-22 14:08:38'
        },
        {
          componentId: 'NLZJ202410240001',
          name: '慧影影像AI辅助诊断整合工具',
          description: '通过运用云计算、大数据分析和机器学习等方法，提供面向临床的影像智能辅助诊断服务。',
          serviceProviderName: '东软集团',
          deployServiceProviderView: '浪潮云',
          coverView: '市级',
          auditStatus: 20,
          submitTime: '2024-10-24 14:59:25'
        },
        {
          componentId: 'NLZJ202410240002',
          name: '慧影影像分析工具',
          description: '以影像数据为驱动，融合放射组学、深度学习分析方法和人工智能技术，辅助医生完成高价值的科研工作。',
          serviceProviderName: '东软集团',
          deployServiceProviderView: '浪潮云',
          coverView: '不限',
          auditStatus: 20,
          submitTime: '2024-10-24 15:00:03'
        },
        {
          componentId: 'NLZJ202410240003',
          name: '慧影影像结果查看器组件',
          description: '患者可随时随地获取个人DICOM格式的影像数据和检查报告，支持通过电脑、平板、手机等移动终端查看。',
          serviceProviderName: '东软集团',
          deployServiceProviderView: '浪潮云',
          coverView: '不限',
          auditStatus: 30,
          submitTime: '2024-10-24 15:00:21'
        },
        {
          componentId: 'NLZJ202410240004',
          name: '医信签CA认证工具',
          description: '提供用户在线实名核验、CA数字证书签发、证书续期和基于数字证书的登录认证服务。',
          serviceProviderName: '北京数字认证',
          deployServiceProviderView: '浪潮云',
          coverView: '不限',
          auditStatus: 10,
          submitTime: '2024-10-24 15:00:40'
        },
        {
          componentId: 'NLZJ202410240005',
          name: '医信签医护电子签名工具',
          description: '为医护人员提供医疗文书电子签名服务，支持扫码签名、授权签名、移动签名、对方会签等多种方式。',
          serviceProviderName: '北京数字认证',
          deployServiceProviderView: '浪潮云',
          coverView: '不限',
          auditStatus: 20,
          submitTime: '2024-10-24 15:01:13'
        },
        {
          componentId: 'NLZJ202410240006',
          name: '医信签患者电子签名工具',
          description: '为患者、家属提供医疗文书电子签名服务，支持智能签名屏、有线签字板、智能手机等多种终端。',
          serviceProviderName: '北京数字认证',
          deployServiceProviderView: '浪潮云',
          coverView: '不限',
          auditStatus: 30,
          submitTime: '2024-10-24 15:01:28'
        },
        {
          componentId: 'NLZJ202410240007',
          name: '亲笔签手写电子化签名与电子印章能力组件',
          description: '手写电子化签名与电子印章能力组件是电子文件、电子公文、电子病案的关键基础设施支撑。',
          serviceProviderName: '亲笔签科技',
          deployServiceProviderView: '浪潮云',
          coverView: '不限',
          auditStatus: 20,
          submitTime: '2024-10-24 15:01:43'
        },
        {
          componentId: 'NLZJ202410240008',
          name: '数科文档网页轻阅读组件',
          description: '系统提供在线预览和文件处理服务，实现多格式阅览、文件编辑、安全管控、可视化签章验章等特色功能。',
          serviceProviderName: '数科技术',
          deployServiceProviderView: '浪潮云',
          coverView: '不限',
          auditStatus: 20,
          submitTime: '2024-10-24 15:13:21'
        }
      ]
    };
  },
  created() {
    this.changeTableHeight();
    this.loadComponentList();
  },
  methods: {
    loadComponentList() {
      this.loading = true;
      setTimeout(() => {
        let filteredData = [...this.mockData];
        if (this.queryParams.name) {
          filteredData = filteredData.filter(item => item.name && item.name.includes(this.queryParams.name));
        }
        if (this.queryParams.cover) {
          filteredData = filteredData.filter(item => item.coverView === this.queryParams.cover);
        }
        if (this.queryParams.status) {
          filteredData = filteredData.filter(item => String(item.auditStatus) === String(this.queryParams.status));
        }
        filteredData.sort((a, b) => (b.submitTime || '').localeCompare(a.submitTime || ''));
        const pageNum = this.queryParams.pageNum;
        const pageSize = this.queryParams.pageSize;
        const start = (pageNum - 1) * pageSize;
        const end = start + pageSize;
        this.componentList = filteredData.slice(start, end);
        this.total = filteredData.length;
        this.loading = false;
      }, 300);
    },
    handleRowClick(currentRow) {},
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.loadComponentList();
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
    startAudit(comp) {
      this.$router.push({
        path: '/portal/auditCenter/componentAuditDetail',
        query: { id: comp.componentId }
      });
    },
    viewDetails(comp) {
      this.$router.push({
        path: '/portal/auditCenter/componentAuditDetail',
        query: { id: comp.componentId }
      });
    }
  }
};
</script>

<style scoped>
.mb12 { margin-bottom: 12px; }
</style>
