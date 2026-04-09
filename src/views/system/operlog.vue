<template>
  <div class="app-container">
    <!-- 筛选条件 -->
    <el-row :gutter="24" class="mb12">
      <el-col :span="24">
        <el-form :model="queryParams" ref="queryForm" size="small" class="el-form-search" :inline="true">
          <el-form-item prop="module">
            <el-select v-model="queryParams.module" placeholder="操作模块" clearable style="width: 140px">
              <el-option label="数字应用" value="数字应用" />
              <el-option label="能力组件" value="能力组件" />
              <el-option label="机构审核" value="机构审核" />
              <el-option label="服务评价" value="服务评价" />
              <el-option label="订单管理" value="订单管理" />
              <el-option label="系统管理" value="系统管理" />
            </el-select>
          </el-form-item>
          <el-form-item prop="type">
            <el-select v-model="queryParams.type" placeholder="操作类型" clearable style="width: 120px">
              <el-option label="新增" value="新增" />
              <el-option label="修改" value="修改" />
              <el-option label="删除" value="删除" />
              <el-option label="提交审核" value="提交审核" />
              <el-option label="审核通过" value="审核通过" />
              <el-option label="审核驳回" value="审核驳回" />
              <el-option label="上架" value="上架" />
              <el-option label="下架" value="下架" />
              <el-option label="发布" value="发布" />
            </el-select>
          </el-form-item>
          <el-form-item prop="operator">
            <el-input v-model="queryParams.operator" placeholder="操作人" clearable style="width: 120px" @keyup.enter.native="handleSearch" />
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
      <el-table-column prop="time" label="操作时间" width="160" />
      <el-table-column prop="module" label="操作模块" width="110">
        <template slot-scope="scope">
          <el-tag size="mini" effect="plain">{{ scope.row.module }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operator" label="操作人" width="100" />
      <el-table-column prop="operatorOrg" label="所属机构" width="160" show-overflow-tooltip />
      <el-table-column prop="type" label="操作类型" width="100">
        <template slot-scope="scope">
          <el-tag :type="getOperTypeTag(scope.row.type)" size="mini" effect="dark">{{ scope.row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="操作内容" min-width="260" show-overflow-tooltip />
      <el-table-column prop="target" label="操作对象" width="150" show-overflow-tooltip />
      <el-table-column prop="ip" label="IP地址" width="130" />
      <el-table-column prop="result" label="结果" width="80">
        <template slot-scope="scope">
          <span :style="{ color: scope.row.result === '成功' ? '#2f9e44' : '#c92a2a', fontWeight: 500 }">{{ scope.row.result }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="loadList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index.vue';

export default {
  name: 'SystemOperLog',
  components: { Pagination },
  data() {
    return {
      loading: false,
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        module: '',
        type: '',
        operator: '',
        dateRange: []
      },
      logList: [
        { time: '2024-03-20 09:30:15', module: '数字应用', operator: '张经理', operatorOrg: '腾讯科技有限公司', type: '提交审核', content: '提交版本 v2.0.0 审核', target: '智能办公系统', ip: '192.168.1.100', result: '成功' },
        { time: '2024-03-20 09:15:00', module: '能力组件', operator: '李主管', operatorOrg: '阿里云计算有限公司', type: '修改', content: '更新组件描述和接口文档', target: '统一身份认证组件', ip: '192.168.1.105', result: '成功' },
        { time: '2024-03-19 16:45:30', module: '数字应用', operator: '系统', operatorOrg: '系统', type: '上架', content: '版本 v1.1.0 审核通过，系统自动上架', target: '数据分析平台', ip: 'system', result: '成功' },
        { time: '2024-03-19 14:20:00', module: '机构审核', operator: '管理员', operatorOrg: '平台运营中心', type: '审核驳回', content: '资质证明材料不完整，请补充后重新提交', target: '锐途智能科技有限公司', ip: '10.0.0.1', result: '成功' },
        { time: '2024-03-19 11:10:22', module: '服务评价', operator: '管理员', operatorOrg: '平台运营中心', type: '审核通过', content: '审核通过评价内容', target: '评价#20240315-001', ip: '10.0.0.2', result: '成功' },
        { time: '2024-03-18 10:05:00', module: '数字应用', operator: '王经理', operatorOrg: '百度网络技术有限公司', type: '新增', content: '新增数字应用"电子病历管理系统"', target: '电子病历管理系统', ip: '192.168.1.200', result: '成功' },
        { time: '2024-03-18 09:30:45', module: '能力组件', operator: '系统', operatorOrg: '系统', type: '下架', content: '管理员手动下架', target: '消息推送组件', ip: 'system', result: '成功' },
        { time: '2024-03-17 15:20:10', module: '订单管理', operator: '赵科长', operatorOrg: '朝阳区卫生健康委', type: '删除', content: '取消订单', target: '订单#ORD-2024-0092', ip: '10.0.4.30', result: '成功' },
        { time: '2024-03-17 14:00:00', module: '系统管理', operator: '管理员', operatorOrg: '平台运营中心', type: '修改', content: '修改系统参数配置', target: '系统参数', ip: '10.0.0.1', result: '成功' },
        { time: '2024-03-16 10:30:00', module: '机构审核', operator: '管理员', operatorOrg: '平台运营中心', type: '审核通过', content: '审核通过机构入驻申请', target: '华能数智科技集团', ip: '10.0.0.1', result: '成功' }
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
    getOperTypeTag(type) {
      const map = { '新增': '', '修改': 'primary', '删除': 'danger', '提交审核': 'warning', '审核通过': 'success', '审核驳回': 'danger', '上架': 'success', '下架': 'warning', '发布': 'success' };
      return map[type] || 'info';
    },
    handleSearch() {
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    resetQuery() {
      this.queryParams = { pageNum: 1, pageSize: 10, module: '', type: '', operator: '', dateRange: [] };
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
