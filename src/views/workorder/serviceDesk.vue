<template>
  <div>
    <!-- 常用服务 -->
    <div class="section">
      <h3 class="section-title">常用服务</h3>
      <div class="service-grid">
        <div 
          class="service-item" 
          v-for="service in commonServices" 
          :key="service.id"
          @click="handleServiceClick(service)"
        >
          {{ service.name }}
        </div>
      </div>
    </div>
    
    <!-- 全部服务 -->
    <div class="section">
      <div class="section-header">
        <h3 class="section-title">全部服务</h3>
        <div class="search-box">
          <el-input 
            v-model="searchQuery" 
            placeholder="请输入服务名称，快速定位" 
            style="width: 300px"
            @keyup.enter.native="handleSearch"
          >
            <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
          </el-input>
        </div>
      </div>
      <div class="service-grid">
        <div 
          class="service-item" 
          v-for="service in filteredServices" 
          :key="service.id"
          @click="handleServiceClick(service)"
        >
          {{ service.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WorkorderServiceDesk',
  data() {
    return {
      searchQuery: '',
      commonServices: [
        { id: 1, name: '通用服务需求' },
        { id: 2, name: 'VPN相关申请' },
        { id: 3, name: '统一用户中心系统权限申请' },
        { id: 4, name: 'Gitlab相关申请' },
        { id: 5, name: '技术中台创建云相关申请' }
      ],
      allServices: [
        { id: 1, name: '负载均衡(SLB)实例申请' },
        { id: 2, name: '通用服务需求' },
        { id: 3, name: '通用数据处理需求' },
        { id: 4, name: '云资源-主机申请' },
        { id: 5, name: 'VPN相关申请' },
        { id: 6, name: '云资源-数据库申请' },
        { id: 7, name: '堡垒机相关申请' },
        { id: 8, name: '云资源-K8S申请' },
        { id: 9, name: '云资源-SLB申请' },
        { id: 10, name: '统一用户中心系统权限申请' },
        { id: 11, name: '网站/域名相关申请' },
        { id: 12, name: '大数据平台资源相关申请' },
        { id: 13, name: 'Gitlab相关申请' },
        { id: 14, name: '技术中台创建云相关申请' },
        { id: 15, name: '安全测试单' }
      ]
    };
  },
  computed: {
    filteredServices() {
      if (!this.searchQuery) {
        return this.allServices;
      }
      return this.allServices.filter(service => 
        service.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    handleSearch() {
      // 搜索逻辑已在computed中处理
    },
    handleServiceClick(service) {
      const loading = this.$loading({
        lock: true,
        text: '正在跳转至多云管理系统...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
      });
      setTimeout(() => {
        loading.close();
      }, 2000);
    }
  }
};
</script>

<style scoped>
.section {
  margin-top: 20px;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 16px 0;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.service-item {
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.service-item:hover {
  background-color: #ecf5ff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-box {
  display: flex;
  align-items: center;
}
</style>