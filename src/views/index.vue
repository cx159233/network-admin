<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="10">
      <el-col :span="24">
        <user-info></user-info>
      </el-col>
    </el-row>
    <div style="margin-top: 16px">
      <div><el-button type="primary">互认能力开发知识中心</el-button></div>
      <div>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>卡片名称</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import SysUserInfo from '@/views/cms/dashboard/userInfo'

export default {
  name: 'Index',
  components: {
    'user-info': SysUserInfo
  },
  data() {
    return {
    }
  },
  created () {
  },
  methods: {
  }
}
</script>
<style lang="scss">
.box-card {
  margin-top: 16px;
  .el-card__header {
    padding: 18px 20px !important;
  }
}
</style>
<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 10px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
