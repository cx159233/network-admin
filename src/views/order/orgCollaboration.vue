<template>
  <div class="org-collab-page">
    <PageHeader
      title="机构列表"
      description="管理注册的服务使用方与服务提供方机构，支持查看机构详情信息"
    />

    <CloudCard class="org-collab-page__table-card">
      <FilterBar @search="handleQuery" @reset="resetQuery">
        <a-input
          v-model:value="filter.unitName"
          placeholder="机构名称"
          allow-clear
          style="width: 200px"
          @pressEnter="handleQuery"
        />
        <a-input
          v-model:value="filter.creditCode"
          placeholder="统一社会信用代码"
          allow-clear
          style="width: 200px"
          @pressEnter="handleQuery"
        />
        <a-select
          v-model:value="filter.role"
          placeholder="机构类型"
          allow-clear
          style="width: 140px"
        >
          <a-select-option value="provider">服务提供方</a-select-option>
          <a-select-option value="consumer">服务使用方</a-select-option>
        </a-select>
        <a-select
          v-model:value="filter.status"
          placeholder="状态"
          allow-clear
          style="width: 130px"
        >
          <a-select-option value="enabled">启用</a-select-option>
          <a-select-option value="disabled">停用</a-select-option>
        </a-select>
      </FilterBar>
      <div class="org-collab-page__divider"></div>
      <div class="org-collab-page__table-wrap">
        <a-table
          :columns="columns"
          :data-source="filteredData"
          :loading="loading"
          :pagination="paginationConfig"
          row-key="orgId"
          size="middle"
          @change="onTableChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'index'">
              <span class="cell-default">{{ getRowIndex(record) }}</span>
            </template>
            <span v-else-if="column.dataIndex === 'unitName'" class="cell-primary">{{ record.unitName || '--' }}</span>
            <template v-else-if="column.dataIndex === 'orgRole'">
              <span style="white-space: nowrap">
                <span v-for="r in record.roles" :key="r" :class="['org-role-tag', `org-role-tag--${r}`]" style="margin-right:4px">{{ getOrgRoleText([r]) }}</span>
              </span>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <a-badge :status="getStatusBadge(record.status)" :text="getStatusText(record.status)" />
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-space size="small">
                <a-button type="link" size="small" class="!p-0" @click="handleDetail(record)">详情</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-button type="link" size="small" class="!p-0" @click="handleAccountList(record)">账户列表</a-button>
                <a-divider type="vertical" class="!mx-[2px]" />
                <a-button v-if="record.status === 'enabled'" type="link" size="small" danger class="!p-0" @click="handleToggleStatus(record)">停用</a-button>
                <a-button v-else type="link" size="small" class="!p-0" @click="handleToggleStatus(record)">启用</a-button>
              </a-space>
            </template>
            <span v-else class="cell-default">{{ record[column.dataIndex] || '--' }}</span>
          </template>
        </a-table>
      </div>
    </CloudCard>

    <!-- 机构详情抽屉 -->
    <a-drawer
      v-model:open="drawer.visible"
      title="机构详情"
      :width="960"
      placement="right"
    >
      <template v-if="drawer.record">
        <div class="drawer-header-row">
          <div class="drawer-header-info">
            <div class="drawer-header-title-row">
              <span class="drawer-header-title">{{ drawer.record.unitName }}</span>
              <a-badge :status="getStatusBadge(drawer.record.status)" :text="getStatusText(drawer.record.status)" />
            </div>
            <div class="drawer-header-sub">
              <span>ID：{{ drawer.record.creditCode || '--' }}</span>
            </div>
          </div>
        </div>

        <a-tabs v-model:activeKey="drawer.activeTab" class="mvp-detail-tabs">
          <a-tab-pane key="overview" tab="概览">
            <div class="overview-section">
              <div class="overview-section__title">企业基本情况</div>
              <a-descriptions :column="2" bordered size="small" class="drawer-desc">
                <a-descriptions-item label="机构类型">
                  <span style="white-space: nowrap">
                    <span v-for="r in drawer.record.roles" :key="r" :class="['org-role-tag', `org-role-tag--${r}`]" style="margin-right:4px">{{ getOrgRoleText([r]) }}</span>
                  </span>
                  <span v-if="!drawer.record.roles || !drawer.record.roles.length" class="cell-default">--</span>
                </a-descriptions-item>
                <a-descriptions-item label="法定代表人">{{ drawer.record.legalPerson || '--' }}</a-descriptions-item>
                <a-descriptions-item label="单位性质">{{ drawer.record.unitNature ? drawer.record.unitNature.join('、') : '--' }}</a-descriptions-item>
                <a-descriptions-item label="成立时间">
                  <span class="cell-mono">{{ drawer.record.establishDate || '--' }}</span>
                </a-descriptions-item>
                <a-descriptions-item label="单位注册地" :span="2">{{ formatAddress(drawer.record, 'register') }}</a-descriptions-item>
                <a-descriptions-item label="单位地址" :span="2">{{ formatAddress(drawer.record, 'address') }}</a-descriptions-item>
                <a-descriptions-item label="联系人">
                  {{ drawer.record.contactName || '--' }}<template v-if="drawer.record.contactDuty"> / {{ drawer.record.contactDuty }}</template>
                </a-descriptions-item>
                <a-descriptions-item label="联系电话">
                  <span class="cell-mono">{{ drawer.record.contactPhone || '--' }}</span>
                </a-descriptions-item>
                <a-descriptions-item label="E-mail/微信" :span="2">
                  <span class="cell-mono">{{ drawer.record.contactEmail || '--' }}</span>
                </a-descriptions-item>
              </a-descriptions>
            </div>

            <div class="overview-section">
              <div class="overview-section__title">服务介绍</div>
              <a-descriptions :column="1" bordered size="small" class="drawer-desc">
                <a-descriptions-item label="企业简介">
                  <span class="desc-text">{{ drawer.record.companyIntro || '--' }}</span>
                </a-descriptions-item>
                <a-descriptions-item label="主要产品或服务介绍">
                  <span class="desc-text">{{ drawer.record.productIntro || '--' }}</span>
                </a-descriptions-item>
                <a-descriptions-item label="人力情况介绍">
                  <span class="desc-text">{{ drawer.record.hrIntro || '--' }}</span>
                </a-descriptions-item>
              </a-descriptions>
            </div>

            <div class="overview-section">
              <div class="overview-section__title">资质材料</div>
              <a-list :data-source="drawer.record.materials || []" class="material-list">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta>
                      <template #avatar>
                        <div class="material-icon"><FileOutlined /></div>
                      </template>
                      <template #title>
                        <span class="material-name">{{ item.name }}</span>
                      </template>
                      <template #description>
                        <span class="material-size">{{ item.size }}</span>
                      </template>
                    </a-list-item-meta>
                    <template #actions>
                      <a-button type="link" size="small" @click="downloadMaterial(item)">
                        <template #icon><DownloadOutlined /></template>
                        下载
                      </a-button>
                    </template>
                  </a-list-item>
                </template>
              </a-list>
            </div>
          </a-tab-pane>
        </a-tabs>
      </template>
    </a-drawer>
  </div>
</template>

<script>
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import FilterBar from '@/components/cloud/FilterBar.vue'
import { FileOutlined, DownloadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

export default {
  name: 'OrgCollaboration',
  components: {
    PageHeader,
    CloudCard,
    FilterBar,
    FileOutlined,
    DownloadOutlined
  },
  data() {
    return {
      loading: false,
      filter: { unitName: '', creditCode: '', role: undefined, status: undefined },
      applied: { unitName: '', creditCode: '', role: undefined, status: undefined },
      pagination: { current: 1, pageSize: 10 },
      columns: [
        { title: '序号', key: 'index', width: 50 },
        { title: '机构名称', dataIndex: 'unitName', key: 'unitName', width: 200 },
        { title: '机构类型', dataIndex: 'orgRole', key: 'orgRole', width: 110 },
        { title: '统一社会信用代码', dataIndex: 'creditCode', key: 'creditCode', width: 200 },
        { title: '单位注册地', dataIndex: 'registerAddr', key: 'registerAddr', width: 180, ellipsis: true },
        { title: '联系人', dataIndex: 'contactName', key: 'contactName', width: 80 },
        { title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone', width: 130 },
        { title: 'E-mail/邮箱', dataIndex: 'contactEmail', key: 'contactEmail', width: 170, ellipsis: true },
        { title: '企业简介', dataIndex: 'companyIntro', key: 'companyIntro', width: 180, ellipsis: true },
        { title: '注册时间', dataIndex: 'registerTime', key: 'registerTime', width: 150 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 70 },
        { title: '操作', dataIndex: 'action', key: 'action', width: 190, fixed: 'right' }
      ],
      orgList: [
        {
          orgId: 1,
          unitName: '影像云科技有限公司',
          legalPerson: '张明',
          creditCode: '91110108MA01ABC123X',
          unitNature: ['民营'],
          establishDate: '2018-05-12',
          registerProvince: '北京市', registerCity: '北京市', registerDistrict: '海淀区', registerDetail: '中关村大街27号院16号楼',
          addressProvince: '北京市', addressCity: '北京市', addressDistrict: '海淀区', addressDetail: '中关村大街27号院16号楼',
          contactName: '李雪',
          contactPhone: '13800138001',
          contactDuty: '商务经理',
          contactEmail: 'li.xue@yingxiangyun.com',
          companyIntro: '影像云科技专注于医学影像云服务，为医疗机构提供完整的影像存储、传输与智能诊断辅助解决方案，已服务国内300+医院。',
          productIntro: '主要产品包括医学影像云平台、智能影像诊断辅助系统、影像数据治理工具集等，服务对象为各级医疗机构。',
          hrIntro: '员工总数 120 人，研发人员 65 人，运维人员 12 人，技术人员持证比例 80%。',
          roles: ['provider', 'consumer'],
          adminPhone: '13800138001',
          adminIdCard: '110108199001011234',
          registerTime: '2026-02-15 10:30:00',
          status: 'enabled',
          materials: [
            { name: '真实性承诺书.pdf', size: '1.2 MB', url: '#' },
            { name: '营业执照.jpg', size: '2.1 MB', url: '#' },
            { name: '社会统一信用代码证.jpg', size: '890 KB', url: '#' },
            { name: '保密承诺书.pdf', size: '780 KB', url: '#' },
            { name: '信用信息报告.pdf', size: '3.2 MB', url: '#' },
            { name: '服务商Logo.png', size: '420 KB', url: '#' }
          ]
        },
        {
          orgId: 2,
          unitName: '华能数智科技集团',
          legalPerson: '王伟',
          creditCode: '91110108MA02DEF456Y',
          unitNature: ['国有'],
          establishDate: '2015-09-01',
          registerProvince: '北京市', registerCity: '北京市', registerDistrict: '朝阳区', registerDetail: '建国路88号',
          addressProvince: '北京市', addressCity: '北京市', addressDistrict: '朝阳区', addressDetail: '建国路88号',
          contactName: '赵主管',
          contactPhone: '13900139002',
          contactDuty: '项目经理',
          contactEmail: 'zhao.zg@huaneng.com',
          companyIntro: '华能数智科技集团隶属于华能集团，专注于数字化转型与智慧能源解决方案，致力于为政企客户提供端到端的数字化服务。',
          productIntro: '主要产品涵盖智慧能源管理平台、政务协同办公系统、企业级数据中台等。',
          hrIntro: '员工总数 280 人，研发人员 150 人，运维人员 30 人。',
          roles: ['provider'],
          adminPhone: '13900139002',
          adminIdCard: '110105198812120002',
          registerTime: '2026-01-08 14:20:00',
          status: 'enabled',
          materials: [
            { name: '真实性承诺书.pdf', size: '1.5 MB', url: '#' },
            { name: '营业执照.jpg', size: '1.8 MB', url: '#' },
            { name: '社会统一信用代码证.jpg', size: '920 KB', url: '#' },
            { name: '保密承诺书.pdf', size: '650 KB', url: '#' },
            { name: '信用信息报告.pdf', size: '2.8 MB', url: '#' }
          ]
        },
        {
          orgId: 3,
          unitName: '朝阳区卫生健康委',
          legalPerson: '刘建国',
          creditCode: '11110105MA03GHI789Z',
          unitNature: ['其他'],
          establishDate: '2001-03-15',
          registerProvince: '北京市', registerCity: '北京市', registerDistrict: '朝阳区', registerDetail: '日坛北街33号',
          addressProvince: '北京市', addressCity: '北京市', addressDistrict: '朝阳区', addressDetail: '日坛北街33号',
          contactName: '刘科长',
          contactPhone: '13700137003',
          contactDuty: '科长',
          contactEmail: 'liu.kz@chywj.bj.gov.cn',
          companyIntro: '朝阳区卫生健康委员会是负责朝阳区卫生健康工作的政府职能部门，统筹辖区医疗机构、公共卫生和健康促进等事务。',
          productIntro: '',
          hrIntro: '',
          roles: ['consumer'],
          adminPhone: '13700137003',
          adminIdCard: '110105197506050001',
          registerTime: '2026-03-01 09:15:00',
          status: 'enabled',
          materials: [
            { name: '真实性承诺书.pdf', size: '1.0 MB', url: '#' },
            { name: '统一社会信用代码证书.pdf', size: '1.3 MB', url: '#' },
            { name: '法人任职文件.pdf', size: '2.4 MB', url: '#' },
            { name: '保密承诺书.pdf', size: '560 KB', url: '#' }
          ]
        },
        {
          orgId: 4,
          unitName: '中远云科技有限公司',
          legalPerson: '陈刚',
          creditCode: '91310115MA04JKL012A',
          unitNature: ['三资'],
          establishDate: '2017-11-20',
          registerProvince: '上海市', registerCity: '上海市', registerDistrict: '浦东新区', registerDetail: '世纪大道100号',
          addressProvince: '上海市', addressCity: '上海市', addressDistrict: '浦东新区', addressDetail: '世纪大道100号',
          contactName: '王经理',
          contactPhone: '13600136004',
          contactDuty: '销售总监',
          contactEmail: 'wang.jl@zhongyuan.com',
          companyIntro: '中远云科技专注于云计算与企业数字化服务，提供云基础设施、SaaS 应用以及行业解决方案。',
          productIntro: '主要产品包括企业云平台、智能分析系统等。',
          hrIntro: '员工总数 95 人，研发人员 50 人。',
          roles: ['provider', 'consumer'],
          adminPhone: '13600136004',
          adminIdCard: '310115199002020003',
          registerTime: '2026-03-10 16:00:00',
          status: 'disabled',
          materials: [
            { name: '真实性承诺书.pdf', size: '1.1 MB', url: '#' },
            { name: '营业执照.jpg', size: '2.0 MB', url: '#' },
            { name: '社会统一信用代码证.jpg', size: '850 KB', url: '#' },
            { name: '保密承诺书.pdf', size: '720 KB', url: '#' },
            { name: '信用信息报告.pdf', size: '3.5 MB', url: '#' },
            { name: '服务商Logo.png', size: '380 KB', url: '#' }
          ]
        },
        {
          orgId: 5,
          unitName: '海淀区医院',
          legalPerson: '周院长',
          creditCode: '12110108MA05MNO345B',
          unitNature: ['其他'],
          establishDate: '1985-06-30',
          registerProvince: '北京市', registerCity: '北京市', registerDistrict: '海淀区', registerDetail: '学院路22号',
          addressProvince: '北京市', addressCity: '北京市', addressDistrict: '海淀区', addressDetail: '学院路22号',
          contactName: '孙主任',
          contactPhone: '13500135005',
          contactDuty: '信息科主任',
          contactEmail: 'sun.zr@haidianyy.com',
          companyIntro: '海淀区医院是一所集医疗、教学、科研为一体的综合性三级医院。',
          productIntro: '',
          hrIntro: '',
          roles: ['consumer'],
          adminPhone: '13500135005',
          adminIdCard: '110108197808080002',
          registerTime: '2026-03-12 11:40:00',
          status: 'disabled',
          materials: [
            { name: '真实性承诺书.pdf', size: '0.9 MB', url: '#' },
            { name: '医疗机构执业许可证.pdf', size: '3.6 MB', url: '#' },
            { name: '统一社会信用代码证书.pdf', size: '1.1 MB', url: '#' },
            { name: '法人任职文件.pdf', size: '1.8 MB', url: '#' },
            { name: '保密承诺书.pdf', size: '520 KB', url: '#' }
          ]
        }
      ],
      drawer: {
        visible: false,
        activeTab: 'basic',
        record: null
      }
    }
  },
  computed: {
    filteredData() {
      const list = this.orgList.filter((item) => {
        if (this.applied.unitName && !item.unitName.includes(this.applied.unitName)) return false
        if (this.applied.creditCode && !item.creditCode.includes(this.applied.creditCode)) return false
        if (this.applied.role && !item.roles.includes(this.applied.role)) return false
        if (this.applied.status && item.status !== this.applied.status) return false
        return true
      })
      list.sort((a, b) => (a.registerTime < b.registerTime ? 1 : -1))
      return list.map(item => ({
        ...item,
        registerAddr: [item.registerProvince, item.registerCity, item.registerDistrict, item.registerDetail].filter(Boolean).join(' ')
      }))
    },
    paginationConfig() {
      return {
        current: this.pagination.current,
        pageSize: this.pagination.pageSize,
        total: this.filteredData.length,
        showTotal: (total) => `共 ${total} 条`,
        showSizeChanger: true
      }
    }
  },
  created() {
    this.loading = true
    setTimeout(() => {
      this.loading = false
    }, 200)
  },
  methods: {
    getOrgRoleText(roles) {
      if (!roles || !roles.length) return ''
      const map = { provider: '服务提供方', consumer: '服务使用方' }
      return roles.map(r => map[r] || r).join('、')
    },
    getRowIndex(record) {
      const idx = this.filteredData.indexOf(record)
      return idx >= 0 ? (this.pagination.current - 1) * this.pagination.pageSize + idx + 1 : '--'
    },
    handleQuery() {
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    resetQuery() {
      this.filter = { unitName: '', creditCode: '', role: undefined, status: undefined }
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    onTableChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
    },
    handleDetail(record) {
      this.drawer.record = record
      this.drawer.activeTab = 'overview'
      this.drawer.visible = true
    },
    handleAccountList(record) {
      this.$router.push({
        path: '/portal/orgCollaboration/accounts',
        query: { orgName: record.unitName, orgId: record.orgId }
      })
    },
    handleToggleStatus(record) {
      const newStatus = record.status === 'enabled' ? 'disabled' : 'enabled'
      const label = newStatus === 'enabled' ? '启用' : '停用'
      message.success(`已${label}机构：${record.unitName}`)
      record.status = newStatus
    },
    getStatusBadge(status) {
      const map = { enabled: 'success', disabled: 'error' }
      return map[status] || 'default'
    },
    getStatusText(status) {
      const map = { enabled: '启用', disabled: '停用' }
      return map[status] || '未知'
    },
    formatAddress(record, prefix) {
      const province = record[`${prefix}Province`] || ''
      const city = record[`${prefix}City`] || ''
      const district = record[`${prefix}District`] || ''
      const detail = record[`${prefix}Detail`] || ''
      const result = [province, city, district, detail].filter(Boolean).join(' ')
      return result || '--'
    },
    downloadMaterial(item) {
      message.info(`下载文件：${item.name}`)
    },
    maskIdCard(idCard) {
      if (!idCard) return '--'
      const str = String(idCard)
      if (str.length <= 8) return str
      return str.slice(0, 6) + '********' + str.slice(-4)
    }
  }
}
</script>

<style scoped>
.org-collab-page {
  padding: 4px 0;
}

.org-collab-page__divider {
  height: 1px;
  background: #F2F3F5;
  margin: 0 16px;
}

.org-collab-page__table-wrap {
  padding: 0 16px 16px 16px;
}

.org-collab-page__table-wrap :deep(.ant-table-thead .ant-table-cell) {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
}

.org-collab-page__table-wrap :deep(.ant-table-tbody .ant-table-cell) {
  color: rgba(0, 0, 0, 0.65);
}

.cell-default {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}

.cell-primary {
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-weight: 500;
}

.org-role-tag {
  display: inline-block;
  padding: 0 6px;
  font-size: 11px;
  font-weight: 400;
  line-height: 18px;
  border-radius: 3px;
  vertical-align: middle;
}

.org-role-tag--provider {
  color: #165DFF;
  background: #E8F3FF;
}

.org-role-tag--consumer {
  color: #16A34A;
  background: rgba(22, 163, 74, 0.10);
}

.cell-mono {
  font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
}

/* === Drawer === */

.drawer-header-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 4px 0 8px;
  margin-bottom: 8px;
}

.drawer-header-info {
  flex: 1;
  min-width: 0;
}

.drawer-header-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.drawer-header-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
}

.drawer-header-sub {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #64748b;
}

/* === Tabs === */

.mvp-detail-tabs :deep(.ant-tabs-nav) {
  margin-bottom: 16px;
}

/* === Overview sections === */

.overview-section {
  margin-bottom: 16px;
}

.overview-section:last-child {
  margin-bottom: 0;
}

.overview-section__title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 12px;
  line-height: 1.4;
}

/* === Descriptions === */

.drawer-desc :deep(.ant-descriptions-item-label) {
  color: rgba(0, 0, 0, 0.85);
  font-size: 13px;
  white-space: nowrap;
}

.drawer-desc :deep(.ant-descriptions-item-content) {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}

/* === Material list === */

.material-list :deep(.ant-list-item) {
  padding: 10px 0;
}

.material-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: #E8F3FF;
  color: #165DFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.material-name {
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.material-size {
  font-size: 11px;
  color: #86909C;
}

/* === Misc === */

.desc-text {
  color: rgba(0, 0, 0, 0.65);
  font-size: 13px;
  line-height: 1.7;
  white-space: pre-line;
}

.muted {
  color: #86909C;
  font-size: 13px;
}
</style>
