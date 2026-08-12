<template>
  <div class="qualification-audit-page">
    <PageHeader
      title="机构资质审核"
      description="审核机构提交的资质认证申请，支持按机构名称、机构代码、机构类型和审核状态筛选"
    />

    <CloudCard class="qualification-audit-page__table-card">
      <FilterBar @search="handleQuery" @reset="resetQuery">
        <a-input v-model:value="filter.orgName" placeholder="机构名称" allow-clear style="width: 180px" @pressEnter="handleQuery" />
        <a-input v-model:value="filter.orgCode" placeholder="统一社会信用代码" allow-clear style="width: 210px" @pressEnter="handleQuery" />
        <a-select v-model:value="filter.orgType" placeholder="机构类型" allow-clear style="width: 140px">
          <a-select-option value="政府机关">政府机关</a-select-option>
          <a-select-option value="事业单位">事业单位</a-select-option>
          <a-select-option value="国有企业">国有企业</a-select-option>
          <a-select-option value="私营企业">私营企业</a-select-option>
        </a-select>
        <a-select v-model:value="filter.status" placeholder="审核状态" allow-clear style="width: 130px">
          <a-select-option value="10">待审核</a-select-option>
          <a-select-option value="20">已通过</a-select-option>
          <a-select-option value="30">已驳回</a-select-option>
        </a-select>
        <template #suffix>
          <ColumnSettings v-model="hiddenKeys" :columns="columns" />
        </template>
      </FilterBar>
      <div class="qualification-audit-page__divider"></div>

      <div class="qualification-audit-page__table-wrap">
        <a-table
          :columns="visibleColumns"
          :data-source="filteredData"
          :pagination="paginationConfig"
          :loading="loading"
          row-key="id"
          size="middle"
          @change="onTableChange"
        >
          <template #bodyCell="{ column, record }">
            <span v-if="column.dataIndex === 'orgName'" class="cell-primary">{{ record.orgName || '--' }}</span>
            <span v-else-if="column.dataIndex === 'orgRole'" :class="['org-role-tag', `org-role-tag--${record.orgRole}`]">{{ getOrgRoleText(record.orgRole) }}</span>
            <template v-else-if="column.dataIndex === 'auditStatus'">
              <StatusDot :type="getAuditStatusKey(record.auditStatus)" :text="getAuditStatusText(record.auditStatus)" />
            </template>
            <span v-else-if="column.dataIndex === 'submitTime'" class="cell-default">{{ record.submitTime || '--' }}</span>
            <template v-else-if="column.dataIndex === 'action'">
              <a-space size="small">
                <a-button v-if="String(record.auditStatus) === '10'" type="link" size="small" class="!p-0" @click="startAudit(record)">审核</a-button>
                <a-button v-else type="link" size="small" class="!p-0" @click="viewDetails(record)">详情</a-button>
              </a-space>
            </template>
            <span v-else class="cell-default">{{ record[column.dataIndex] || '--' }}</span>
          </template>
        </a-table>
      </div>
    </CloudCard>

    <!-- 详情抽屉 -->
    <a-drawer
      v-model:open="drawer.visible"
      title="审核详情"
      :width="1100"
      placement="right"
      :body-style="{ padding: '24px' }"
    >
      <template v-if="drawer.record">
        <div class="drawer-header-row">
          <div class="drawer-header-info">
            <div class="drawer-header-title-row">
              <span class="drawer-header-title">{{ drawer.record.unitName || '--' }}</span>
              <StatusDot :type="getAuditStatusKey(drawer.record.auditStatus)" :text="getAuditStatusText(drawer.record.auditStatus)" />
            </div>
            <div class="drawer-header-sub">
              <span class="cell-mono">{{ drawer.record.creditCode || '--' }}</span>
            </div>
          </div>
        </div>

        <div class="drawer-split">
          <!-- 左侧：概览信息 -->
          <div class="drawer-split__left">
            <div class="split-section">
              <div class="split-section__title">企业基本情况</div>
              <a-descriptions :column="1" bordered size="small">
                <a-descriptions-item label="机构类型">
                  <span :class="['org-role-tag', `org-role-tag--${drawer.record.orgRole}`]">{{ getOrgRoleText(drawer.record.orgRole) || '--' }}</span>
                </a-descriptions-item>
                <a-descriptions-item label="法定代表人">{{ drawer.record.legalPerson || '--' }}</a-descriptions-item>
                <a-descriptions-item label="单位性质">{{ drawer.record.unitNature ? drawer.record.unitNature.join('、') : '--' }}</a-descriptions-item>
                <a-descriptions-item label="成立时间">
                  <span class="cell-mono">{{ drawer.record.establishDate || '--' }}</span>
                </a-descriptions-item>
                <a-descriptions-item label="单位注册地">{{ drawer.record.registerProvince }}{{ drawer.record.registerCity }}{{ drawer.record.registerDistrict }}{{ drawer.record.registerDetail }}</a-descriptions-item>
                <a-descriptions-item label="单位地址">{{ drawer.record.addressProvince }}{{ drawer.record.addressCity }}{{ drawer.record.addressDistrict }}{{ drawer.record.addressDetail }}</a-descriptions-item>
                <a-descriptions-item label="联系人">{{ drawer.record.contactName }}<template v-if="drawer.record.contactDuty"> / {{ drawer.record.contactDuty }}</template></a-descriptions-item>
                <a-descriptions-item label="联系电话">
                  <span class="cell-mono">{{ drawer.record.contactPhone || '--' }}</span>
                </a-descriptions-item>
                <a-descriptions-item label="E-mail/微信号">
                  <span class="cell-mono">{{ drawer.record.contactEmail || '--' }}</span>
                </a-descriptions-item>
              </a-descriptions>
            </div>

            <div class="split-section">
              <div class="split-section__title">服务介绍</div>
              <a-descriptions :column="1" bordered size="small">
                <a-descriptions-item label="企业简介">{{ drawer.record.companyIntro || '--' }}</a-descriptions-item>
                <a-descriptions-item label="主要产品或服务介绍">{{ drawer.record.productIntro || '--' }}</a-descriptions-item>
                <a-descriptions-item label="人力情况介绍">{{ drawer.record.hrIntro || '--' }}</a-descriptions-item>
              </a-descriptions>
            </div>

            <div class="split-section">
              <div class="split-section__title">管理员信息</div>
              <a-descriptions :column="1" bordered size="small">
                <a-descriptions-item label="管理员姓名">{{ drawer.record.adminName || '--' }}</a-descriptions-item>
                <a-descriptions-item label="身份证号">
                  <span class="cell-mono">{{ maskIdCard(drawer.record.idCard) }}</span>
                </a-descriptions-item>
                <a-descriptions-item label="手机号">
                  <span class="cell-mono">{{ drawer.record.phone || '--' }}</span>
                </a-descriptions-item>
              </a-descriptions>
            </div>

            <div class="split-section">
              <div class="split-section__title">资质材料</div>
              <a-list :data-source="drawer.record.materials" class="material-list">
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
          </div>

          <!-- 分割线 -->
          <div class="drawer-split__divider"></div>

          <!-- 右侧：审核操作 -->
          <div class="drawer-split__right">
            <div class="split-section">
              <div class="split-section__title">审核操作</div>
              <template v-if="isAuditing">
                <a-textarea v-model:value="auditForm.opinion" :rows="4" :maxlength="200" show-count placeholder="请输入审核意见" style="margin-bottom: 12px" />
                <div class="step-node__btns">
                  <a-button type="primary" @click="approve">
                    <template #icon><CheckOutlined /></template>
                    审核通过
                  </a-button>
                  <a-button @click="reject">驳回</a-button>
                </div>
              </template>
              <template v-else>
                <div class="step-node__record">
                  <div class="step-node__opinion">{{ getAuditResult().opinion }}</div>
                  <div class="step-node__meta">
                    <span>{{ getAuditResult().auditor }}</span>
                    <span>{{ getAuditResult().auditTime }}</span>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </template>
    </a-drawer>
  </div>
</template>

<script>
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import FilterBar from '@/components/cloud/FilterBar.vue'
import StatusDot from '@/components/cloud/StatusDot.vue'
import ColumnSettings from '@/components/cloud/ColumnSettings.vue'
import {
  CheckOutlined, CloseOutlined, DownloadOutlined, FileOutlined
} from '@ant-design/icons-vue'
import { Modal, message } from 'ant-design-vue'

export default {
  name: 'QualificationAudit',
  components: {
    PageHeader, CloudCard, FilterBar, StatusDot, ColumnSettings,
    CheckOutlined, CloseOutlined, DownloadOutlined, FileOutlined
  },
  data() {
    return {
      loading: false,
      hiddenKeys: [],
      filter: { orgName: '', orgCode: '', orgType: undefined, status: undefined },
      applied: { orgName: '', orgCode: '', orgType: undefined, status: undefined },
      pagination: { current: 1, pageSize: 10 },
      columns: [
        { title: '提交审核时间', dataIndex: 'submitTime', key: 'submitTime', width: 170 },
        { title: '审核状态', dataIndex: 'auditStatus', key: 'auditStatus', width: 100 },
        { title: '机构名称', dataIndex: 'orgName', key: 'orgName', width: 220 },
        { title: '机构类型', dataIndex: 'orgRole', key: 'orgRole', width: 110 },
        { title: '统一社会信用代码', dataIndex: 'orgCode', key: 'orgCode', width: 200 },
        { title: '单位注册地', dataIndex: 'registerAddr', key: 'registerAddr', width: 200, ellipsis: true },
        { title: '联系人', dataIndex: 'contactName', key: 'contactName', width: 90 },
        { title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone', width: 130 },
        { title: 'E-mail/邮箱', dataIndex: 'contactEmail', key: 'contactEmail', width: 180, ellipsis: true },
        { title: '企业简介', dataIndex: 'companyIntro', key: 'companyIntro', width: 200, ellipsis: true },
        { title: '操作', dataIndex: 'action', key: 'action', width: 90, fixed: 'right' }
      ],
      orgList: [
        { id: 1, orgName: '北京市海淀区数字经济发展局', orgCode: '91110108MA012ABC3X', orgType: '政府机关', orgRole: 'consumer', auditStatus: 10, submitTime: '2026-10-22 10:20:00', auditor: '', registerAddr: '北京市海淀区中关村南大街1号数字经济大厦', contactName: '张明', contactPhone: '13910123456', contactEmail: 'zhangming@bjhd.gov.cn', companyIntro: '负责海淀区数字经济政策制定与产业规划，推动智慧政务与数字基础设施融合发展。' },
        { id: 2, orgName: '中远云科技有限公司', orgCode: '91110105MA012DEF8Y', orgType: '私营企业', orgRole: 'provider', auditStatus: 10, submitTime: '2026-10-22 14:30:00', auditor: '', registerAddr: '北京市朝阳区望京SOHO 3号楼15层', contactName: '陈静', contactPhone: '13810234567', contactEmail: 'chenjing@zycloud.cn', companyIntro: '专注于混合云管平台与企业级容器编排，为金融、政务行业提供云原生解决方案。' },
        { id: 3, orgName: '华能数智科技集团', orgCode: '91110101MA012GH15Z', orgType: '国有企业', orgRole: 'provider', auditStatus: 20, submitTime: '2026-10-23 09:15:00', auditor: '王五', registerAddr: '北京市东城区长安街2号华能大厦', contactName: '刘洋', contactPhone: '13701345678', contactEmail: 'liuyang@hnjt.com', companyIntro: '能源行业数字化转型服务商，提供智慧电厂、智慧矿山一体化管控平台。' },
        { id: 4, orgName: '北京协和医学院附属医院', orgCode: '91110108MA012JKL2W', orgType: '事业单位', orgRole: 'consumer', auditStatus: 20, submitTime: '2026-10-24 14:59:00', auditor: '李四', registerAddr: '北京市海淀区学院路38号', contactName: '王芳', contactPhone: '13651234567', contactEmail: 'wangfang@pumch.cn', companyIntro: '集医疗、教学、科研于一体的三甲综合医院，推动互联网医院与远程诊疗建设。' },
        { id: 5, orgName: '锐途智能科技（北京）有限公司', orgCode: '91110102MA012MNO7P', orgType: '私营企业', orgRole: 'provider', auditStatus: 30, submitTime: '2026-10-24 15:00:00', auditor: '王五', registerAddr: '北京市西城区金融街19号富凯大厦B座', contactName: '赵刚', contactPhone: '13501234567', contactEmail: 'zhaogang@ratu.ai', companyIntro: '提供AI视觉检测与工业缺陷识别方案，服务于智能制造与质检自动化领域。' }
      ],
      drawer: { visible: false, record: null },
      auditForm: { opinion: '' },
      orgDetailMock: {
        legalPerson: '张建国',
        creditCode: '',
        unitNature: [],
        establishDate: '2018-04-12',
        registerProvince: '北京市',
        registerCity: '北京市',
        registerDistrict: '海淀区',
        registerDetail: '中关村南大街1号数字经济大厦',
        addressProvince: '北京市',
        addressCity: '北京市',
        addressDistrict: '海淀区',
        addressDetail: '中关村南大街1号数字经济大厦',
        contactName: '李明',
        contactPhone: '13812345678',
        contactDuty: '技术总监',
        contactEmail: 'liming@example.com',
        companyIntro: '该机构专注于智慧政务系统建设，为区域数字化转型提供技术支撑与服务保障。',
        productIntro: '1. 智慧政务协同平台：支撑跨部门业务协同\n2. 数据共享交换系统：实现多源数据融合\n3. 城市运行管理平台：提供全域态势感知',
        hrIntro: '现有员工200人，其中技术团队120人（硕士以上40人），管理团队30人，运营团队50人。',
        adminName: '李明',
        idCard: '110108199001011234',
        phone: '13812345678',
        materials: [
          { name: '真实性承诺书.pdf', size: '1.2 MB' }
        ]
      },
    }
  },
  computed: {
    visibleColumns() {
      return this.columns.filter(c => !this.hiddenKeys.includes(c.key))
    },
    isAuditing() {
      return this.drawer.record && String(this.drawer.record.auditStatus) === '10'
    },
    filteredData() {
      const f = this.applied
      const list = this.orgList.filter(item => {
        if (f.orgName && !(item.orgName || '').includes(f.orgName)) return false
        if (f.orgCode && !(item.orgCode || '').includes(f.orgCode)) return false
        if (f.orgType && item.orgType !== f.orgType) return false
        if (f.status && String(item.auditStatus) !== String(f.status)) return false
        return true
      })
      list.sort((a, b) => {
        if (a.auditStatus !== b.auditStatus) return a.auditStatus === 10 ? -1 : b.auditStatus === 10 ? 1 : a.auditStatus - b.auditStatus
        return a.submitTime < b.submitTime ? 1 : -1
      })
      return list.map(i => ({ key: i.id, ...i }))
    },
    paginationConfig() {
      return {
        current: this.pagination.current,
        pageSize: this.pagination.pageSize,
        total: this.filteredData.length,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (t) => `共 ${t} 条`
      }
    }
  },
  created() {
    this.loadOrgList()
  },
  methods: {
    loadOrgList() {
      this.loading = true
      setTimeout(() => { this.loading = false }, 200)
    },
    handleQuery() {
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    resetQuery() {
      this.filter = { orgName: '', orgCode: '', orgType: undefined, status: undefined }
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    onTableChange(pag) {
      this.pagination.current = pag.current
      this.pagination.pageSize = pag.pageSize
    },
    getOrgTypeKey(type) {
      const map = { '政府机关': 'gov', '事业单位': 'inst', '国有企业': 'state', '私营企业': 'private' }
      return map[type] || 'default'
    },
    getAuditStatusKey(status) {
      const map = { 10: 'processing', 20: 'done', 30: 'rejected' }
      return map[String(status)] || 'default'
    },
    getAuditStatusText(status) {
      const map = { 10: '待审核', 20: '已通过', 30: '已驳回' }
      return map[String(status)] || '未知'
    },
    getOrgRoleText(role) {
      const map = { provider: '服务提供方', consumer: '服务使用方' }
      return map[role] || ''
    },
    getAuditResult() {
      const rec = this.drawer.record
      if (!rec) return {}
      if (String(rec.auditStatus) === '20') return { opinion: '资质材料齐全，机构信息核实无误，审核通过。', auditor: rec.auditor, auditTime: rec.submitTime }
      if (String(rec.auditStatus) === '30') return { opinion: '资质材料不完整，缺少必要的法人证书，审核不通过。', auditor: rec.auditor, auditTime: rec.submitTime }
      return {}
    },
    formatTime(time) {
      if (!time) return '--'
      if (/\d{2}:\d{2}:\d{2}/.test(time)) return time
      return time + ':00'
    },
    startAudit(org) {
      this.openDrawer(org)
    },
    viewDetails(org) {
      this.openDrawer(org)
    },
    openDrawer(org) {
      this.drawer.record = {
        ...this.orgDetailMock,
        unitName: org.orgName,
        creditCode: org.orgCode,
        unitNature: [org.orgType],
        orgRole: org.orgRole,
        auditStatus: org.auditStatus,
        submitTime: org.submitTime,
        auditor: org.auditor
      }
      this.auditForm.opinion = ''
      this.drawer.visible = true
    },
    downloadMaterial(material) {
      message.success('下载附件：' + material.name)
    },
    approve() {
      if (!this.auditForm.opinion.trim()) {
        message.warning('请填写审核意见')
        return
      }
      Modal.confirm({
        title: '确认通过',
        content: '确定要通过该机构的资质审核吗？',
        okText: '确定',
        cancelText: '取消',
        okType: 'primary',
        onOk: () => {
          message.success('审核通过')
          this.drawer.visible = false
        }
      })
    },
    maskIdCard(val) {
      if (!val) return '--'
      const s = String(val)
      if (s.length <= 7) return val
      return s.slice(0, 3) + '*'.repeat(s.length - 7) + s.slice(-4)
    },
    reject() {
      if (!this.auditForm.opinion.trim()) {
        message.warning('请填写驳回原因')
        return
      }
      Modal.confirm({
        title: '确认驳回',
        content: '确定要驳回该机构的资质审核吗？',
        okText: '确定',
        cancelText: '取消',
        okType: 'danger',
        onOk: () => {
          message.success('审核已驳回')
          this.drawer.visible = false
        }
      })
    }
  }
}
</script>

<style scoped>
.qualification-audit-page {
  padding: 4px 0;
}

.overview-section {
  margin-bottom: 20px;
}

.overview-section:last-child {
  margin-bottom: 0;
}

.overview-section__title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 12px;
}

.qualification-audit-page__divider {
  height: 1px;
  background: #F2F3F5;
  margin: 0 16px;
}

.qualification-audit-page__table-wrap {
  padding: 0 16px 16px 16px;
}

.qualification-audit-page__table-wrap :deep(.ant-table-thead .ant-table-cell) {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
}

.qualification-audit-page__table-wrap :deep(.ant-table-tbody .ant-table-cell) {
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
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
  font-variant-numeric: tabular-nums;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  letter-spacing: -0.2px;
}

.type-pill {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  border-radius: 11px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
}

.type-pill--gov { background: #E8F3FF; color: #165DFF; }
.type-pill--inst { background: rgba(22, 163, 74, 0.10); color: #16A34A; }
.type-pill--state { background: rgba(245, 158, 11, 0.10); color: #F59E0B; }
.type-pill--private { background: rgba(134, 144, 156, 0.12); color: #4E5969; }
.type-pill--default { background: #F2F3F5; color: #4E5969; }

/* Drawer 样式 */
.drawer-header-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 4px 0 16px;
  border-bottom: 1px solid #F2F3F5;
  margin-bottom: 20px;
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

.drawer-header-sub__sep {
  color: #C9CDD4;
}

.drawer-desc :deep(.ant-descriptions-item-content) {
  color: rgba(0, 0, 0, 0.85);
  font-size: 13px;
}

.muted {
  color: #4E5969;
  font-size: 14px;
  line-height: 1.6;
}

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

.audit-textarea {
  margin-bottom: 12px;
}

.action-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

:deep(.ant-drawer .ant-table-wrapper),
:deep(.ant-drawer .ant-table-wrapper .ant-table),
:deep(.ant-drawer .ant-table-wrapper .ant-table-container),
:deep(.ant-drawer .ant-table-wrapper .ant-table-thead > tr > th),
:deep(.ant-drawer .ant-table-wrapper .ant-table-tbody > tr > td),
:deep(.ant-drawer .ant-table-wrapper .ant-table-thead > tr:first-child > th:first-child),
:deep(.ant-drawer .ant-table-wrapper .ant-table-tbody > tr:first-child > td:first-child),
:deep(.ant-drawer .ant-descriptions),
:deep(.ant-drawer .ant-descriptions-view),
:deep(.ant-drawer .ant-descriptions-row > td),
:deep(.ant-drawer .ant-descriptions-row > th) {
  border-radius: 0 !important;
}

:deep(.ant-drawer .ant-table-thead .ant-table-cell) {
  font-weight: normal !important;
}

:deep(.ant-drawer .ant-descriptions-item-label) {
  width: 160px;
  min-width: 160px;
  max-width: 160px;
  white-space: nowrap;
}

/* ===== 左右分栏 ===== */
.drawer-split {
  display: flex;
  gap: 0;
  min-height: 0;
}

.drawer-split__left {
  flex: 3;
  min-width: 0;
  padding-right: 24px;
  overflow-y: auto;
}

.drawer-split__divider {
  width: 1px;
  background: #E5E6EB;
  flex-shrink: 0;
  align-self: stretch;
}

.drawer-split__right {
  flex: 2;
  min-width: 0;
  padding-left: 24px;
  overflow-y: auto;
}

.split-section {
  margin-bottom: 20px;
}

.split-section:last-child {
  margin-bottom: 0;
}

.split-section__title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 12px;
}

/* ===== 左侧概览 - 标签列 ===== */
.drawer-split__left .ant-descriptions-item-label {
  width: 130px !important;
  min-width: 130px !important;
  max-width: 130px !important;
  text-align: left !important;
  word-break: break-all;
  white-space: normal;
  background: #FAFBFC !important;
  font-size: 13px !important;
  font-weight: 400 !important;
  color: rgba(0, 0, 0, 0.85) !important;
  line-height: 1.5;
}

.drawer-split__left .ant-descriptions-item-content {
  font-size: 13px !important;
  font-weight: 400 !important;
  color: rgba(0, 0, 0, 0.65) !important;
  word-break: break-all;
  white-space: pre-line;
  line-height: 1.7;
}

/* ===== 纵向步骤列表 ===== */
.step-list {
  display: flex;
  flex-direction: column;
}

.step-node {
  display: flex;
  gap: 12px;
}

.step-node__indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 24px;
}

.step-node__dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
  transition: all 0.2s;
  color: #86909C;
  background: #FFFFFF;
  border: 1.5px solid #C9CDD4;
}

.step-node__dot--pending {
  color: #86909C;
  background: #FFFFFF;
  border-color: #C9CDD4;
}

.step-node__dot--active {
  color: #FFFFFF;
  background: #165DFF;
  border-color: #165DFF;
  box-shadow: 0 2px 6px rgba(22, 93, 255, 0.35);
}

.step-node__dot--done {
  color: #FFFFFF;
  background: #16A34A;
  border-color: #16A34A;
}

.step-node__dot--rejected {
  color: #FFFFFF;
  background: #EF4444;
  border-color: #EF4444;
}

.step-node__line {
  width: 2px;
  flex: 1;
  min-height: 16px;
  background: #E5E6EB;
  margin: 4px 0;
}

.step-node__line--done {
  background: #16A34A;
}

.step-node__body {
  flex: 1;
  min-width: 0;
  padding-bottom: 20px;
}

.step-node__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.step-node__title {
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.step-node--active .step-node__title {
  font-weight: 600;
  color: #165DFF;
}

.step-node__tag {
  display: inline-block;
  padding: 1px 8px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 4px;
  flex-shrink: 0;
}

.step-node__tag--pending {
  background: #F2F3F5;
  color: #86909C;
}

.step-node__tag--active {
  background: #E8F3FF;
  color: #165DFF;
}

.step-node__tag--done {
  background: #E9F9EF;
  color: #16A34A;
}

.step-node__tag--rejected {
  background: #FFEDEC;
  color: #EF4444;
}

.step-node__action {
  background: #F2F7FF;
  border: 1px solid #D6E4FF;
  border-radius: 6px;
  padding: 12px;
}

.step-node__action .ant-input {
  margin-bottom: 10px;
}

.step-node__btns {
  display: flex;
  gap: 8px;
}

.step-node__record {
  background: #F2F3F5;
  border-radius: 6px;
  padding: 10px 12px;
}

.step-node__opinion {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.6;
}

.step-node__meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
  font-size: 12px;
  color: #86909C;
}
</style>
