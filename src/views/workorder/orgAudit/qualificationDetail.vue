<template>
  <div class="qualification-detail-page">
    <PageHeader
      :title="`机构入驻审核 · ${orgInfo.unitName}`"
      description="查看机构资质申请详情、附件材料及审核记录，并通过审核激活账号或驳回申请"
    >
      <template #actions>
        <a-button @click="goBack">
          <template #icon><ArrowLeftOutlined /></template>
          返回列表
        </a-button>
      </template>
    </PageHeader>

    <div class="qualification-detail-page__body">
      <div class="qualification-detail-page__main">
        <CloudCard class="qualification-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">机构基本情况</span>
          </div>
          <a-descriptions :column="2" size="small" class="info-desc">
            <a-descriptions-item label="法定代表人">{{ orgInfo.legalPerson }}</a-descriptions-item>
            <a-descriptions-item label="机构性质">
              <span>{{ orgInfo.unitNature.join('、') }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="成立时间">
              <span class="cell-mono">{{ orgInfo.establishDate || '--' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="机构注册地" :span="2">
              {{ orgInfo.registerProvince }}{{ orgInfo.registerCity }}{{ orgInfo.registerDistrict }}{{ orgInfo.registerDetail }}
            </a-descriptions-item>
            <a-descriptions-item label="机构居住地" :span="2">
              {{ orgInfo.addressProvince }}{{ orgInfo.addressCity }}{{ orgInfo.addressDistrict }}{{ orgInfo.addressDetail }}
            </a-descriptions-item>
          </a-descriptions>
        </CloudCard>

        <CloudCard class="qualification-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">服务介绍</span>
          </div>
          <a-descriptions :column="1" size="small" class="info-desc">
            <a-descriptions-item label="机构简介">
              <span class="desc-text">{{ orgInfo.companyIntro }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="主要产品或服务介绍">
              <span class="desc-text">{{ orgInfo.productIntro || '--' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="人力情况介绍">
              <span class="desc-text">{{ orgInfo.hrIntro || '--' }}</span>
            </a-descriptions-item>
          </a-descriptions>
        </CloudCard>

        <CloudCard class="qualification-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">联系信息</span>
          </div>
          <a-descriptions :column="2" size="small" class="info-desc">
            <a-descriptions-item label="真实姓名">{{ orgInfo.contactName }}</a-descriptions-item>
            <a-descriptions-item label="登录账号">
              <span class="cell-mono">{{ orgInfo.account }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="身份证号">
              <span class="cell-mono">{{ maskIdCard(orgInfo.idCard) }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="联系方式">
              <span class="cell-mono">{{ orgInfo.contactPhone }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="职务">{{ orgInfo.contactDuty || '--' }}</a-descriptions-item>
            <a-descriptions-item label="E-mail/微信号">
              <span class="cell-mono">{{ orgInfo.contactEmail || '--' }}</span>
            </a-descriptions-item>
          </a-descriptions>
        </CloudCard>

        <CloudCard class="qualification-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">资质材料</span>
          </div>
          <a-list :data-source="orgInfo.materials" class="material-list">
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
        </CloudCard>

        <CloudCard class="qualification-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">审核记录</span>
          </div>
          <a-table :scroll="{ x: 'max-content' }"
            :columns="auditColumns"
            :data-source="auditRecords"
            :pagination="false"
            row-key="id"
            size="middle"
          >
            <template #bodyCell="{ column, record }">
              <StatusDot v-if="column.dataIndex === 'status'" :type="getAuditStatusKey(record.status)" :text="getAuditStatusText(record.status)" />
              <span v-else class="cell-default">{{ record[column.dataIndex] || '--' }}</span>
            </template>
          </a-table>
        </CloudCard>
      </div>

      <div class="qualification-detail-page__side">
        <CloudCard class="qualification-detail-page__card">
          <div class="card-head">
            <span class="card-head__title">审核操作</span>
          </div>
          <a-textarea
            v-model:value="auditForm.opinion"
            :rows="5"
            :maxlength="200"
            show-count
            placeholder="填写审核意见（通过/驳回时必填）"
            class="audit-textarea"
          />
          <div class="action-list">
            <a-button block type="primary" @click="approve">
              <template #icon><CheckOutlined /></template>
              审核通过 · 激活账号
            </a-button>
            <a-button block type="primary" danger @click="reject">
              <template #icon><CloseOutlined /></template>
              驳回申请
            </a-button>
          </div>
        </CloudCard>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ArrowLeftOutlined, CheckOutlined, CloseOutlined, DownloadOutlined, FileOutlined
} from '@ant-design/icons-vue'
import { Modal, message } from 'ant-design-vue'
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import StatusDot from '@/components/cloud/StatusDot.vue'

export default {
  name: 'QualificationDetail',
  components: {
    PageHeader, CloudCard, StatusDot,
    ArrowLeftOutlined, CheckOutlined, CloseOutlined, DownloadOutlined, FileOutlined
  },
  data() {
    return {
      orgInfo: {
        id: 1,
        // 企业基本情况
        unitName: '影像云科技有限公司',
        legalPerson: '张建国',
        creditCode: '91110108MA012ABC3X',
        unitNature: ['民营'],
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
        account: 'liming2026',
        // 服务介绍
        companyIntro: '影像云科技成立于2018年，专注于医疗影像AI云服务，为全国200余家医疗机构提供智能影像分析、远程诊断及云端存储解决方案。公司拥有自主知识产权的深度学习算法引擎，已获NMPA三类医疗器械注册证及多项专利。',
        productIntro: '1. 医学影像智能分析平台：基于深度学习的CT/MRI/DR影像辅助诊断\n2. 远程影像协同诊断系统：支持多院区实时会诊与报告互认\n3. 云端影像档案管理：DICOM标准存储，支持PB级数据归档与快速检索',
        hrIntro: '现有员工150人，其中研发团队80人（博士6人、硕士28人）、医学团队20人（主任医师4人）、市场及运维50人。管理团队核心成员来自GE医疗、百度、腾讯等企业。',
        // 资质材料
        materials: [
          { name: '真实性承诺书.pdf', size: '1.2 MB' },
          { name: '社会统一信用代码证.jpg', size: '890 KB' },
          { name: '保密承诺书.pdf', size: '780 KB' },
          { name: '营业执照.jpg', size: '1.5 MB' },
          { name: '信用信息报告.pdf', size: '3.2 MB' },
          { name: '服务商Logo.png', size: '420 KB' }
        ],
        // 联系信息
        idCard: '110108199001011234'
      },
      auditForm: { opinion: '' },
      auditRecords: [
        { id: 1, submitTime: '2024-03-15 09:12', status: 'approved', auditor: '平台管理员', auditTime: '2024-03-15 14:30', opinion: '资质材料齐全，审核通过。' },
        { id: 2, submitTime: '2024-03-20 10:00', status: 'pending', auditor: '', auditTime: '', opinion: '' }
      ],
      auditColumns: [
        { title: '提交时间', dataIndex: 'submitTime', key: 'submitTime', width: 150 },
        { title: '审核状态', dataIndex: 'status', key: 'status', width: 100 },
        { title: '审核人', dataIndex: 'auditor', key: 'auditor', width: 110 },
        { title: '审核时间', dataIndex: 'auditTime', key: 'auditTime', width: 150 },
        { title: '审核意见', dataIndex: 'opinion', key: 'opinion', ellipsis: true }
      ]
    }
  },
  created() {
    const orgId = this.$route.query.orgId
    if (orgId) {
      this.loadOrgDetail(orgId)
    }
  },
  methods: {
    getDemoContainer() {
      return document.querySelector('.app-main__content') || document.body;
    },
    getDrawerContainer() {
      return document.querySelector('.app-overlay') || document.body;
    },
    loadOrgDetail() {},
    goBack() {
      this.$router.push('/portal/auditCenter/qualificationAudit')
    },
    approve() {
      if (!this.auditForm.opinion.trim()) {
        message.warning('请填写审核意见')
        return
      }
      Modal.confirm({
        getContainer: this.getDemoContainer,
        title: '确认通过',
        content: '确定要通过该机构的资质审核并激活账号吗？',
        okText: '确定',
        cancelText: '取消',
        okType: 'primary',
        onOk: () => {
          message.success('审核通过，账号已激活')
          this.goBack()
        }
      })
    },
    reject() {
      if (!this.auditForm.opinion.trim()) {
        message.warning('请填写驳回原因')
        return
      }
      Modal.confirm({
        getContainer: this.getDemoContainer,
        title: '确认驳回',
        content: '确定要驳回该机构的资质审核吗？',
        okText: '确定',
        cancelText: '取消',
        okType: 'danger',
        onOk: () => {
          message.success('审核已驳回')
          this.goBack()
        }
      })
    },
    downloadMaterial(material) {
      message.success('下载附件：' + material.name)
    },
    maskIdCard(val) {
      if (!val) return '--'
      const s = String(val)
      if (s.length <= 7) return val
      return s.slice(0, 3) + '*'.repeat(s.length - 7) + s.slice(-4)
    },
    getOrgTypeKey(type) {
      const map = { '政府机关': 'gov', '事业单位': 'inst', '国有企业': 'state', '私营企业': 'private' }
      return map[type] || 'default'
    },
    getAuditStatusKey(status) {
      const map = { approved: 'done', rejected: 'rejected', pending: 'processing' }
      return map[status] || 'default'
    },
    getAuditStatusText(status) {
      const map = { approved: '已通过', rejected: '已驳回', pending: '待审核' }
      return map[status] || '未知'
    }
  }
}
</script>

<style scoped>
.qualification-detail-page {
  padding: 4px 0;
}

.qualification-detail-page__body {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 14px;
  margin-top: 14px;
}

.qualification-detail-page__main,
.qualification-detail-page__side {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.card-head__title {
  font-size: 15px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}

.qualification-detail-page :deep(.ant-table-thead .ant-table-cell) {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
}

.qualification-detail-page :deep(.ant-table-tbody .ant-table-cell) {
  color: rgba(0, 0, 0, 0.65);
}

.cell-default {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}

.cell-mono {
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
  font-variant-numeric: tabular-nums;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
  letter-spacing: -0.2px;
}

.desc-text {
  color: rgba(0, 0, 0, 0.65);
  font-size: 13px;
  line-height: 1.7;
  white-space: pre-line;
}

.info-desc :deep(.ant-descriptions-item-label) {
  color: rgba(0, 0, 0, 0.85);
  font-size: 13px;
  white-space: nowrap;
}

.info-desc :deep(.ant-descriptions-item-content) {
  color: rgba(0, 0, 0, 0.65);
  font-size: 13px;
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

@media (max-width: 1100px) {
  .qualification-detail-page__body {
    grid-template-columns: 1fr;
  }
}
</style>
