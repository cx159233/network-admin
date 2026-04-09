<template>
  <div class="app-container">
    <!-- 筛选条件 -->
    <el-row :gutter="24" class="mb12">
      <el-col :span="24">
        <el-form :model="queryParams" ref="queryForm" size="small" class="el-form-search" :inline="true">
          <el-form-item prop="orgName">
            <el-input v-model="queryParams.orgName" placeholder="访问机构" clearable style="width: 150px" @keyup.enter.native="handleSearch" />
          </el-form-item>
          <el-form-item prop="module">
            <el-select v-model="queryParams.module" placeholder="访问模块" clearable style="width: 140px">
              <el-option label="数字应用" value="数字应用" />
              <el-option label="能力组件" value="能力组件" />
              <el-option label="服务市场" value="服务市场" />
              <el-option label="门户首页" value="门户首页" />
            </el-select>
          </el-form-item>
          <el-form-item prop="action">
            <el-select v-model="queryParams.action" placeholder="操作类型" clearable style="width: 120px">
              <el-option label="浏览" value="浏览" />
              <el-option label="搜索" value="搜索" />
              <el-option label="申请使用" value="申请使用" />
              <el-option label="下载" value="下载" />
              <el-option label="评价" value="评价" />
            </el-select>
          </el-form-item>
          <el-form-item prop="dateRange">
            <el-date-picker v-model="queryParams.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" style="width: 240px" />
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
              <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
            </el-button-group>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="logList" size="small" style="width: 100%" :header-cell-style="{background:'#f5f7fa'}">
      <el-table-column prop="time" label="访问时间" width="160" />
      <el-table-column prop="orgName" label="访问机构" min-width="180" show-overflow-tooltip />
      <el-table-column prop="userName" label="访问人" width="100" />
      <el-table-column prop="module" label="访问模块" width="110">
        <template slot-scope="scope">
          <el-tag size="mini" effect="plain">{{ scope.row.module }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="target" label="访问对象" width="160" show-overflow-tooltip />
      <el-table-column prop="action" label="操作类型" width="100">
        <template slot-scope="scope">
          <el-tag :type="getActionTag(scope.row.action)" size="mini" effect="plain">{{ scope.row.action }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ip" label="访问IP" width="130" />
      <el-table-column prop="source" label="来源页面" width="120" />
      <el-table-column prop="device" label="设备/浏览器" width="130" show-overflow-tooltip />
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="loadList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index.vue';

export default {
  name: 'SystemAccessLog',
  components: { Pagination },
  data() {
    return {
      loading: false,
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orgName: '',
        module: '',
        action: '',
        dateRange: []
      },
      logList: [
        { time: '2024-03-20 09:15:30', orgName: '华能数智科技集团', userName: '张三', module: '数字应用', target: '智能办公系统', action: '浏览', ip: '10.0.1.50', source: '应用市场', device: 'Chrome / Windows' },
        { time: '2024-03-20 08:50:12', orgName: '中远云科技有限公司', userName: '王经理', module: '数字应用', target: '企业管理系统', action: '申请使用', ip: '10.0.2.80', source: '应用市场', device: 'Edge / Windows' },
        { time: '2024-03-19 17:30:00', orgName: '北京协和医学院', userName: '李护士长', module: '能力组件', target: '统一身份认证组件', action: '浏览', ip: '10.0.3.120', source: '搜索结果', device: 'Safari / macOS' },
        { time: '2024-03-19 15:20:45', orgName: '华能数智科技集团', userName: '赵主管', module: '数字应用', target: '智能办公系统', action: '下载', ip: '10.0.1.55', source: '应用详情', device: 'Chrome / Windows' },
        { time: '2024-03-19 11:00:00', orgName: '朝阳区卫生健康委', userName: '刘科长', module: '服务市场', target: '数据交换服务', action: '浏览', ip: '10.0.4.30', source: '推荐列表', device: 'Chrome / Windows' },
        { time: '2024-03-18 16:45:20', orgName: '海淀区医院', userName: '周院长', module: '门户首页', target: '-', action: '浏览', ip: '10.0.5.60', source: '直接访问', device: 'Firefox / Windows' },
        { time: '2024-03-18 14:10:30', orgName: '中远云科技有限公司', userName: '陈工程师', module: '能力组件', target: '消息推送组件', action: '搜索', ip: '10.0.2.90', source: '搜索框', device: 'Chrome / Linux' },
        { time: '2024-03-18 10:20:00', orgName: '丰台区疾控中心', userName: '孙主任', module: '数字应用', target: '数据分析平台', action: '评价', ip: '10.0.6.45', source: '我的订单', device: 'Edge / Windows' },
        { time: '2024-03-17 09:30:15', orgName: '华能数智科技集团', userName: '张三', module: '服务市场', target: '云存储服务', action: '申请使用', ip: '10.0.1.50', source: '服务详情', device: 'Chrome / Windows' },
        { time: '2024-03-17 08:15:00', orgName: '西城区卫生健康委', userName: '吴科长', module: '门户首页', target: '-', action: '浏览', ip: '10.0.7.20', source: '直接访问', device: 'Safari / macOS' }
      ]
    };
  },
  created() {
    this.loadList();
  },
  methods: {
    loadList() {
      this.loading = true;
      setTimeout(() => {
        this.total = this.logList.length;
        this.loading = false;
      }, 300);
    },
    getActionTag(action) {
      const map = { '浏览': '', '搜索': 'info', '申请使用': 'primary', '下载': 'success', '评价': 'warning' };
      return map[action] || 'info';
    },
    handleSearch() {
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    resetQuery() {
      this.queryParams = { pageNum: 1, pageSize: 10, orgName: '', module: '', action: '', dateRange: [] };
      this.loadList();
    }
  }
};
</script>

<style scoped>
:deep(.el-form-search) {
  margin-bottom: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 12px;
  padding: 0;
}

:deep(.el-form-search .el-form-item:last-child) {
  margin-right: 0;
}

:deep(.el-form-search .el-form-item) {
  margin-bottom: 0;
  margin-right: 0;
}
</style>
