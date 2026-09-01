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
      <div class="service-groups">
        <div
          v-for="group in filteredGroups"
          :key="group.type"
          class="service-group"
          :class="`service-group--${getServiceTypeClass(group.type)}`"
        >
          <div class="service-group__head">
            <span :class="['service-type-tag', `service-type-tag--${getServiceTypeClass(group.type)}`]">{{ group.type }}</span>
            <span class="service-group__count">{{ group.services.length }} 个服务</span>
          </div>
          <div class="service-grid">
            <div
              v-for="service in group.services"
              :key="service.id"
              class="service-item"
              @click="handleServiceClick(service)"
            >
              <div class="service-item__icon">
                <component :is="getServiceIcon(service.name)" />
              </div>
              <div class="service-item__name">{{ service.name }}</div>
            </div>
          </div>
        </div>
        <div v-if="filteredGroups.length === 0" class="empty-state">
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
  GitlabOutlined, BranchesOutlined, ClusterOutlined, FireOutlined,
  LockOutlined, KeyOutlined, FileProtectOutlined, IdcardOutlined, SendOutlined
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
    GitlabOutlined, BranchesOutlined, ClusterOutlined, FireOutlined,
    LockOutlined, KeyOutlined, FileProtectOutlined, IdcardOutlined, SendOutlined
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
      // 全部服务数据来源：服务目录管理中状态为已上线使用的服务，按服务类型分组
      serviceGroups: [
        {
          type: '数字应用',
          services: [
            { id: 1, name: '卫宁健康区域医疗卫生信息应用服务' },
            { id: 2, name: '同步远方医卫一体化应用服务' },
            { id: 3, name: '中联公共卫生应用服务' },
            { id: 4, name: '智慧医院信息管理系统' },
            { id: 5, name: '医学影像处理系统' },
            { id: 6, name: '大数据分析平台' }
          ]
        },
        {
          type: '安全服务',
          services: [
            { id: 7, name: '数据加密传输服务' },
            { id: 8, name: '安全审计平台' },
            { id: 9, name: '网络安全防护服务' },
            { id: 10, name: '主机安全检测服务' }
          ]
        },
        {
          type: '能力组件',
          services: [
            { id: 11, name: '统一身份认证组件' },
            { id: 12, name: '电子健康卡组件' },
            { id: 13, name: '消息推送中间件' },
            { id: 14, name: '人脸识别组件' }
          ]
        },
        {
          type: '基础服务',
          services: [
            { id: 15, name: '弹性云服务器' },
            { id: 16, name: '云数据库服务' },
            { id: 17, name: '对象存储OSS' },
            { id: 18, name: '负载均衡SLB' }
          ]
        }
      ]
    }
  },
  computed: {
    filteredGroups() {
      if (!this.searchQuery) {
        return this.serviceGroups
      }
      const q = this.searchQuery.toLowerCase()
      return this.serviceGroups
        .map(group => ({
          ...group,
          services: group.services.filter(s => s.name.toLowerCase().includes(q))
        }))
        .filter(group => group.services.length > 0)
    }
  },
  methods: {
    handleSearch() {
      if (this.filteredGroups.length === 0) {
        message.info('未找到匹配的服务')
      }
    },
    handleServiceClick(service) {
      message.loading({ content: '正在跳转至多云管理系统...', key: 'serviceJump', duration: 1.5 })
    },
    getServiceTypeClass(type) {
      const map = {
        '数字应用': 'digital',
        '安全服务': 'security',
        '能力组件': 'component',
        '基础服务': 'basic'
      }
      return map[type] || ''
    },
    getServiceIcon(name) {
      if (name.includes('数据库')) return 'DatabaseOutlined'
      if (name.includes('网站') || name.includes('域名')) return 'GlobalOutlined'
      if (name.includes('Gitlab')) return 'GitlabOutlined'
      if (name.includes('K8S') || name.includes('集群')) return 'ClusterOutlined'
      if (name.includes('VPN') || name.includes('网络') || name.includes('安全防护')) return 'BranchesOutlined'
      if (name.includes('大数据') || name.includes('安全')) return 'FireOutlined'
      if (name.includes('云资源') || name.includes('SLB')) return 'CloudOutlined'
      if (name.includes('身份认证') || name.includes('权限')) return 'KeyOutlined'
      if (name.includes('电子健康卡') || name.includes('人脸识别')) return 'IdcardOutlined'
      if (name.includes('加密')) return 'LockOutlined'
      if (name.includes('审计')) return 'FileProtectOutlined'
      if (name.includes('消息推送')) return 'SendOutlined'
      if (name.includes('服务') && name.includes('数据')) return 'AppstoreOutlined'
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

.service-groups {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.service-group__head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.service-group__count {
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

.service-group--digital .service-item__icon { background: #E8F3FF; color: #165DFF; }
.service-group--digital .service-item:hover { border-color: rgba(22, 93, 255, 0.30); }
.service-group--security .service-item__icon { background: #FFF0ED; color: #F53F3F; }
.service-group--security .service-item:hover { border-color: rgba(245, 63, 63, 0.30); }
.service-group--component .service-item__icon { background: #FFF3E8; color: #D97000; }
.service-group--component .service-item:hover { border-color: rgba(217, 112, 0, 0.30); }
.service-group--basic .service-item__icon { background: rgba(22, 163, 74, 0.10); color: #16A34A; }
.service-group--basic .service-item:hover { border-color: rgba(22, 163, 74, 0.30); }

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