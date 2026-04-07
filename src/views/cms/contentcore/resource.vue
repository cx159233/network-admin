<template>
  <div class="resource-management">
    <div class="resource-header">
      <h2>资源目录管理</h2>
      <p>管理数字应用、能力组件和服务目录</p>
    </div>
    <div class="resource-content">
      <el-card class="resource-card">
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical-demo"
          @select="handleMenuSelect"
        >
          <el-menu-item index="digitalApp">
            <i class="el-icon-app"></i>
            <span>数字应用管理</span>
          </el-menu-item>
          <el-menu-item index="component">
            <i class="el-icon-s-grid"></i>
            <span>能力组件管理</span>
          </el-menu-item>
          <el-menu-item index="serviceCatalog">
            <i class="el-icon-document"></i>
            <span>服务目录</span>
          </el-menu-item>
        </el-menu>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "ResourceManagement",
  data() {
    return {
      activeMenu: 'digitalApp'
    };
  },
  methods: {
    handleMenuSelect(key) {
      this.activeMenu = key;
      this.$router.push(`/portal/content/resource/${key}`);
    }
  }
};
</script>

<style scoped>
.resource-management {
  padding: 20px;
}

.resource-header {
  margin-bottom: 20px;
}

.resource-header h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
  color: #333;
}

.resource-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.resource-card {
  width: 200px;
}

.el-menu-vertical-demo {
  border-right: none;
}
</style>