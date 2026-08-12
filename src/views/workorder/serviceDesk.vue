<template>
  <div class="service-desk-page">
    <PageHeader
      title="工作台"
      description="快速发起常用服务申请，或从全部服务目录中查找所需服务"
    />

    <CloudCard class="service-desk-page__card">
      <div class="card-head">
        <span class="card-head__title">常用服务</span>
        <span class="card-head__hint">点击服务卡片即可快速发起申请</span>
      </div>
      <div class="service-grid">
        <div
          v-for="service in commonServices"
          :key="service.id"
          class="service-item service-item--primary"
          @click="handleServiceClick(service)"
        >
          <div class="service-item__icon">
            <ThunderboltOutlined />
          </div>
          <div class="service-item__name">{{ service.name }}</div>
        </div>
      </div>
    </CloudCard>

    <CloudCard class="service-desk-page__card">
      <div class="card-head">
        <span class="card-head__title">全部服务</span>
        <a-input
          v-model:value="searchQuery"
          placeholder="请输入服务名称，快速定位"
          allow-clear
          style="width: 280px"
          @pressEnter="handleSearch"
        >
          <template #prefix><SearchOutlined /></template>
        </a-input>
      </div>
      <div class="service-grid">
        <div
          v-for="service in filteredServices"
          :key="service.id"
          class="service-item"
          :class="`service-item--${getServiceTone(service.name)}`"
          @click="handleServiceClick(service)"
        >
          <div class="service-item__icon">
            <component :is="getServiceIcon(service.name)" />
          </div>
          <div class="service-item__name">{{ service.name }}</div>
        </div>
        <div v-if="filteredServices.length === 0" class="empty-state">
          <FrownOutlined class="empty-state__icon" />
          <span>未找到匹配的服务</span>
        </div>
      </div>
    </CloudCard>
  </div>
</template>

<script>
import {
  AppstoreOutlined, CloudOutlined, SearchOutlined,
  ThunderboltOutlined, FrownOutlined, DatabaseOutlined, GlobalOutlined,
  GitlabOutlined, BranchesOutlined, ClusterOutlined, FireOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'

export default {
  name: 'WorkorderServiceDesk',
  components: {
    PageHeader, CloudCard,
    AppstoreOutlined, CloudOutlined, SearchOutlined,
    ThunderboltOutlined, FrownOutlined, DatabaseOutlined, GlobalOutlined,
    GitlabOutlined, BranchesOutlined, ClusterOutlined, FireOutlined
  },
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
    }
  },
  computed: {
    filteredServices() {
      if (!this.searchQuery) {
        return this.allServices
      }
      return this.allServices.filter(service =>
        service.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    }
  },
  methods: {
    handleSearch() {
      if (this.filteredServices.length === 0) {
        message.info('未找到匹配的服务')
      }
    },
    handleServiceClick(service) {
      message.loading({ content: '正在跳转至多云管理系统...', key: 'serviceJump', duration: 1.5 })
    },
    getServiceTone(name) {
      if (name.includes('云资源') || name.includes('SLB') || name.includes('K8S')) return 'success'
      if (name.includes('权限') || name.includes('堡垒机') || name.includes('VPN')) return 'warning'
      if (name.includes('安全') || name.includes('Gitlab')) return 'danger'
      return 'primary'
    },
    getServiceIcon(name) {
      if (name.includes('数据库')) return 'DatabaseOutlined'
      if (name.includes('网站') || name.includes('域名')) return 'GlobalOutlined'
      if (name.includes('Gitlab')) return 'GitlabOutlined'
      if (name.includes('K8S') || name.includes('集群')) return 'ClusterOutlined'
      if (name.includes('VPN') || name.includes('网络')) return 'BranchesOutlined'
      if (name.includes('大数据') || name.includes('安全')) return 'FireOutlined'
      if (name.includes('云资源') || name.includes('SLB')) return 'CloudOutlined'
      return 'AppstoreOutlined'
    }
  }
}
</script>

<style scoped>
.service-desk-page {
  padding: 4px 0;
}

.service-desk-page__card {
  padding: 16px 20px;
  margin-bottom: 14px;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-head__title {
  font-size: 15px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}

.card-head__hint {
  font-size: 12px;
  color: #86909C;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}

.service-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #F7F8FA;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.service-item:hover {
  background: #FFFFFF;
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.10);
  transform: translateY(-1px);
}

.service-item__icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.service-item--primary .service-item__icon { background: #E8F3FF; color: #165DFF; }
.service-item--primary:hover { border-color: rgba(22, 93, 255, 0.30); }
.service-item--success .service-item__icon { background: rgba(22, 163, 74, 0.10); color: #16A34A; }
.service-item--success:hover { border-color: rgba(22, 163, 74, 0.30); }
.service-item--warning .service-item__icon { background: rgba(245, 158, 11, 0.10); color: #F59E0B; }
.service-item--warning:hover { border-color: rgba(245, 158, 11, 0.30); }
.service-item--danger .service-item__icon { background: rgba(239, 68, 68, 0.10); color: #EF4444; }
.service-item--danger:hover { border-color: rgba(239, 68, 68, 0.30); }

.service-item__name {
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  line-height: 1.4;
}

.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 0;
  color: #C9CDD4;
  font-size: 13px;
}

.empty-state__icon {
  font-size: 32px;
}
</style>
