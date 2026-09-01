<template>
  <div class="order-list-page">
    <PageHeader
      title="服务开通列表"
    />

    <CloudCard class="order-list-page__table-card">
      <FilterBar @search="handleQuery" @reset="resetQuery">
        <a-input v-model:value="filter.orderNo" placeholder="服务单号" allow-clear style="width: 180px" @pressEnter="handleQuery" />
        <a-input v-model:value="filter.serviceName" placeholder="服务名称" allow-clear style="width: 180px" @pressEnter="handleQuery" />
        <a-input v-model:value="filter.serviceId" placeholder="服务ID" allow-clear style="width: 160px" @pressEnter="handleQuery" />
        <a-input v-model:value="filter.serviceProvider" placeholder="服务商名称" allow-clear style="width: 180px" @pressEnter="handleQuery" />
        <a-input v-model:value="filter.orgName" placeholder="申请机构" allow-clear style="width: 180px" @pressEnter="handleQuery" />
        <a-select v-model:value="filter.serviceType" placeholder="服务类型" allow-clear style="width: 150px">
          <a-select-option value="数字应用">数字应用</a-select-option>
          <a-select-option value="安全服务">安全服务</a-select-option>
          <a-select-option value="能力组件">能力组件</a-select-option>
          <a-select-option value="基础服务">基础服务</a-select-option>
        </a-select>
        <a-select v-model:value="filter.status" placeholder="状态" allow-clear style="width: 140px">
          <a-select-option value="工单流转中">工单流转中</a-select-option>
          <a-select-option value="已完成">已完成</a-select-option>
          <a-select-option value="已评价">已评价</a-select-option>
          <a-select-option value="已驳回">已驳回</a-select-option>
          <a-select-option value="已取消">已取消</a-select-option>
        </a-select>
        <template #suffix>
          <ColumnSettings v-model="hiddenKeys" :columns="columns" />
        </template>
      </FilterBar>
      <div class="order-list-page__divider"></div>

      <div class="order-list-page__table-wrap">
        <a-table :scroll="{ x: 'max-content' }"
          :columns="visibleColumns"
          :data-source="filteredData"
          :pagination="paginationConfig"
          :loading="loading"
          row-key="orderNo"
          size="middle"
          @change="onTableChange"
        >
          <template #bodyCell="{ column, record }">
            <span v-if="column.dataIndex === 'orderNo'" class="cell-primary">{{ record.orderNo || '--' }}</span>
            <template v-else-if="column.dataIndex === 'service'">
              <span class="cell-name">
                <span class="cell-name__title">{{ record.serviceName || '--' }}</span>
                <span class="cell-name__id">{{ record.serviceId || '--' }}</span>
              </span>
            </template>
            <template v-else-if="column.dataIndex === 'org'">
              <div class="cell-stack">
                <div class="cell-stack__primary">{{ record.orgName || '--' }}</div>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'serviceType'">
              <span :class="['service-type-tag', getServiceTypeClass(record.serviceType)]">{{ record.serviceType || '--' }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <StatusDot :type="getStatusKey(record.status)" :text="record.status" />
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <a-space size="small">
                <a-button type="link" size="small" class="!p-0" @click="goToDetail(record)">详情</a-button>
                <template v-if="record.status === '工单流转中'">
                  <a-divider type="vertical" class="!mx-[2px]" />
                  <a-button type="link" size="small" danger class="!p-0" @click="cancelOrder(record)">取消</a-button>
                </template>
                <template v-if="record.status === '已评价'">
                  <a-divider type="vertical" class="!mx-[2px]" />
                  <a-button type="link" size="small" class="!p-0" @click="onViewReview(record)">查看评价</a-button>
                </template>
              </a-space>
            </template>
            <span v-else class="cell-default">{{ record[column.dataIndex] || '--' }}</span>
          </template>
        </a-table>
      </div>
    </CloudCard>

    <!-- 详情抽屉 -->
    <a-drawer :get-container="getDrawerContainer"
      v-model:open="drawer.visible"
      title="服务开通详情"
      :width="860"
      placement="right"
      :body-style="{ padding: '24px' }"
    >
      <template v-if="drawer.record">
        <div class="drawer-header-row">
          <div class="drawer-header-info">
            <div class="drawer-header-title-row">
              <span class="drawer-header-title">{{ drawer.record.serviceName || '--' }}</span>
              <StatusDot :type="getStatusKey(drawer.record.status)" :text="drawer.record.status" />
            </div>
            <div class="drawer-header-sub">
              <span class="cell-mono">服务单号：{{ drawer.record.orderNo || '--' }}</span>
            </div>
          </div>
        </div>

        <div class="overview-section">
          <div class="overview-section__title">基本信息</div>
          <a-descriptions :column="2" bordered size="small">
            <a-descriptions-item label="服务ID">
              <span class="cell-mono">{{ drawer.record.serviceId || '--' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="服务类型">
              <span :class="['service-type-tag', getServiceTypeClass(drawer.record.serviceType)]">{{ drawer.record.serviceType || '--' }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="申请机构">{{ drawer.record.orgName || '--' }}</a-descriptions-item>
            <a-descriptions-item label="服务商名称">{{ drawer.record.serviceProvider || '--' }}</a-descriptions-item>
            <a-descriptions-item label="创建时间">{{ drawer.record.applyTime || '--' }}</a-descriptions-item>
            <a-descriptions-item label="关联工单">
              <span class="workorder-link">
                <span>{{ drawer.record.workorderId || '--' }}</span>
                <a-button v-if="drawer.record.workorderId" type="link" size="small" @click="goToWorkorder(drawer.record.workorderId)" class="!px-1">跳转工单 →</a-button>
              </span>
            </a-descriptions-item>
          </a-descriptions>
        </div>

        <div class="overview-section">
          <div class="overview-section__title">流程进度</div>
          <a-timeline class="drawer-timeline">
            <a-timeline-item
              v-for="(step, idx) in drawerTimeline"
              :key="idx"
              :color="step.dotColor"
            >
              <div :class="['tl-title', `tl-title--${step.state}`]">
                {{ step.title }}
                <span :class="['tl-state', `tl-state--${step.state}`]">{{ step.stateLabel }}</span>
              </div>
              <div class="tl-time">{{ step.time }}</div>
            </a-timeline-item>
          </a-timeline>
        </div>
      </template>
    </a-drawer>

    <!-- 查看评价弹窗 -->
    <a-modal :get-container="getDemoContainer" v-model:open="reviewVisible" title="用户评价" :width="520" :footer="null" :destroy-on-close="true">
      <template v-if="currentReview.ratings">
        <div class="review-modal__rating-grid">
          <div v-for="key in ratingKeys" :key="key" class="review-modal__rating-item">
            <div class="review-modal__rating-label">{{ key }}</div>
            <a-rate :value="currentReview.ratings[key]" disabled style="font-size: 14px" />
          </div>
        </div>
        <div class="review-modal__composite">
          <span class="review-modal__composite-label">综合评分</span>
          <span class="review-modal__composite-score">{{ reviewAvgScore.toFixed(1) }}</span>
        </div>
        <div class="review-modal__content">
          <div class="review-modal__content-label">评价内容</div>
          <p class="review-modal__content-text">{{ currentReview.content || '--' }}</p>
        </div>
        <div class="review-modal__meta">
          <span>{{ currentReview.orgName || '--' }}</span>
          <span class="review-modal__meta-sep">·</span>
          <span>{{ currentReview.time || '--' }}</span>
        </div>
        <div v-if="currentReview.reply" class="review-modal__reply">
          <div class="review-modal__reply-label">回复内容</div>
          <p class="review-modal__reply-text">{{ currentReview.reply.content || '--' }}</p>
          <div class="review-modal__reply-meta">
            <span>{{ currentReview.reply.role || '--' }}</span>
            <span class="review-modal__meta-sep">·</span>
            <span>{{ currentReview.reply.time || '--' }}</span>
          </div>
        </div>
      </template>
      <a-empty v-else description="暂无评价信息" />
    </a-modal>
  </div>
</template>

<script>
import { Modal, message } from 'ant-design-vue'
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import FilterBar from '@/components/cloud/FilterBar.vue'
import StatusDot from '@/components/cloud/StatusDot.vue'
import ColumnSettings from '@/components/cloud/ColumnSettings.vue'

export default {
  name: 'OrderList',
  components: {
    PageHeader, CloudCard, FilterBar, StatusDot, ColumnSettings
  },
  data() {
    return {
      loading: false,
      hiddenKeys: [],
      filter: {
        orderNo: '',
        serviceName: '',
        serviceId: '',
        serviceProvider: '',
        orgName: '',
        serviceType: undefined,
        status: undefined
      },
      applied: {
        orderNo: '',
        serviceName: '',
        serviceId: '',
        serviceProvider: '',
        orgName: '',
        serviceType: undefined,
        status: undefined
      },
      pagination: { current: 1, pageSize: 10 },
      drawer: { visible: false, record: null },
      reviewInfo: { score: 0, description: '', reviewTime: '' },
      reviewForm: { score: 0, description: '', submitting: false },
      reviewVisible: false,
      currentReview: {},
      ratingKeys: ['准确性', '稳定性', '响应时效', '业务适配性'],
      reviewMock: {
        ratings: { '准确性': 5, '稳定性': 4, '响应时效': 4, '业务适配性': 5 },
        content: '服务响应及时，功能符合预期，整体体验良好。',
        orgName: '北京市海淀区数字经济发展局',
        time: '2026-03-20 10:00:00'
      },
      columns: [
        { title: '服务单号', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
        { title: '服务名称/ID', dataIndex: 'service', key: 'service', width: 220 },
        { title: '服务类型', dataIndex: 'serviceType', key: 'serviceType', width: 130 },
        { title: '服务商名称', dataIndex: 'serviceProvider', key: 'serviceProvider', width: 180, ellipsis: true },
        { title: '申请机构', dataIndex: 'org', key: 'org', width: 240 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 120 },
        { title: '关联工单', dataIndex: 'workorderId', key: 'workorderId', width: 120 },
        { title: '创建时间', dataIndex: 'applyTime', key: 'applyTime', width: 130 },
        { title: '操作', dataIndex: 'action', key: 'action', width: 90, fixed: 'right' }
      ],
      orderList: [
        {
          orderNo: '202608100095',
          serviceId: 'SVC-DA-001',
          serviceName: '智慧园区综合管理平台',
          serviceProvider: '北京健康科技有限公司',
          serviceSpec: '标准版，含500个设备接入 + 数据看板',
          orgName: '北京市海淀区数字经济发展局',
          applicant: '张三',
          creditCode: '12100000400001101M',
          serviceType: '数字应用',
          status: '工单流转中',
          workorderId: 'TK-0245',
          applyTime: '2026-03-15 09:42:18'
        },
        {
          orderNo: '202608100094',
          serviceId: 'SVC-COMP-001',
          serviceName: '统一身份认证组件',
          serviceProvider: '中科软科技',
          serviceSpec: '支持OAuth2.0/SAML，含SSO单点登录',
          orgName: '中远云科技有限公司',
          applicant: '李明',
          creditCode: '91110108MA01X2Y3Z4A',
          serviceType: '能力组件',
          status: '工单流转中',
          workorderId: 'TK-0244',
          applyTime: '2026-03-15 08:30:05'
        },
        {
          orderNo: '202608100093',
          serviceId: 'SVC-DA-002',
          serviceName: '数据可视化分析平台',
          serviceProvider: '东华软件',
          serviceSpec: '企业版，含20个数据源接入 + 大屏展示',
          orgName: '华能数智科技集团',
          applicant: '王芳',
          creditCode: '91110000710911901K',
          serviceType: '数字应用',
          status: '已完成',
          workorderId: 'TK-0233',
          applyTime: '2026-03-14 16:20:47'
        },
        {
          orderNo: '202608100092',
          serviceId: 'SVC-COMP-002',
          serviceName: 'AI 语音识别组件',
          serviceProvider: '科大讯飞',
          serviceSpec: '企业版 / 100万次调用',
          orgName: '北京市海淀区数字经济发展局',
          applicant: '张伟',
          creditCode: '12100000400001101M',
          serviceType: '能力组件',
          status: '已评价',
          workorderId: 'TK-0228',
          applyTime: '2026-03-13 14:11:32',
          reply: {
            role: '开发者',
            content: '感谢您的反馈，响应时效问题已纳入下一版本优化计划，届时将进一步缩短接口调用耗时。',
            time: '2026-03-21 15:30:00'
          }
        },
        {
          orderNo: '202608100091',
          serviceId: 'SVC-SEC-001',
          serviceName: 'Web应用防火墙',
          serviceProvider: '启明星辰',
          serviceSpec: '企业版 / 域名数 10 / QPS 5000',
          orgName: '中科信息安全有限公司',
          applicant: '陈静',
          creditCode: '91110108MA01ABCDEF',
          serviceType: '安全服务',
          status: '已驳回',
          workorderId: 'TK-0219',
          applyTime: '2026-03-12 10:05:14'
        },
        {
          orderNo: '202608100090',
          serviceId: 'SVC-ECS-001',
          serviceName: '云主机',
          serviceProvider: '浪潮云信息技术有限公司',
          serviceSpec: '8核16G / 500G SSD / 5M带宽',
          orgName: '重庆市渝中区城市运行管理中心',
          applicant: '刘洋',
          creditCode: '12500000450000001C',
          serviceType: '基础服务',
          status: '已取消',
          workorderId: '',
          applyTime: '2026-03-11 17:48:09'
        },
        {
          orderNo: '202608100089',
          serviceId: 'SVC-COMP-003',
          serviceName: '智能问答机器人',
          serviceProvider: '腾讯医疗',
          serviceSpec: '标准版 / 50万次调用 / 知识库容量 1G',
          orgName: '中远云科技有限公司',
          applicant: '周强',
          creditCode: '91110108MA01X2Y3Z4A',
          serviceType: '能力组件',
          status: '工单流转中',
          workorderId: 'TK-0240',
          applyTime: '2026-03-11 09:22:36'
        },
        {
          orderNo: '202608100088',
          serviceId: 'SVC-OSS-001',
          serviceName: '对象存储服务',
          serviceProvider: '中科信息安全有限公司',
          serviceSpec: '标准型 / 5TB / 1年',
          orgName: '华能数智科技集团',
          applicant: '孙莉',
          creditCode: '91110000710911901K',
          serviceType: '基础服务',
          status: '已评价',
          workorderId: 'TK-0210',
          applyTime: '2026-03-10 15:33:51'
        },
        {
          orderNo: '202608100087',
          serviceId: 'SVC-DA-003',
          serviceName: '政务协同办公平台',
          serviceProvider: '万达信息',
          serviceSpec: '旗舰版 / 200账号 / 含流程引擎',
          orgName: '北京市海淀区数字经济发展局',
          applicant: '赵敏',
          creditCode: '12100000400001101M',
          serviceType: '数字应用',
          status: '已完成',
          workorderId: 'TK-0205',
          applyTime: '2026-03-09 11:14:25'
        },
        {
          orderNo: '202608100086',
          serviceId: 'SVC-SEC-002',
          serviceName: '数据加密传输组件',
          serviceProvider: '上海安全技术有限公司',
          serviceSpec: '国密SM2/SM4 / 100万次调用',
          orgName: '中科信息安全有限公司',
          applicant: '林峰',
          creditCode: '91110108MA01ABCDEF',
          serviceType: '安全服务',
          status: '已完成',
          workorderId: 'TK-0201',
          applyTime: '2026-03-08 13:50:42'
        },
        {
          orderNo: '202608100085',
          serviceId: 'SVC-GPU-001',
          serviceName: 'GPU 云主机',
          serviceProvider: '深圳云计算有限公司',
          serviceSpec: '8卡 NVIDIA A100 / 1T NVMe',
          orgName: '重庆市渝中区城市运行管理中心',
          applicant: '吴磊',
          creditCode: '12500000450000001C',
          serviceType: '基础服务',
          status: '已驳回',
          workorderId: 'TK-0196',
          applyTime: '2026-03-07 09:08:17'
        },
        {
          orderNo: '202608100084',
          serviceId: 'SVC-COMP-004',
          serviceName: '电子签章组件',
          serviceProvider: '北京数字认证',
          serviceSpec: '企业版 / 5万次签署 / 1年',
          orgName: '中远云科技有限公司',
          applicant: '郑华',
          creditCode: '91110108MA01X2Y3Z4A',
          serviceType: '能力组件',
          status: '已取消',
          workorderId: '',
          applyTime: '2026-03-06 16:42:30'
        }
      ]
    }
  },
  computed: {
    visibleColumns() {
      return this.columns.filter(c => !this.hiddenKeys.includes(c.key))
    },
    filteredData() {
      const f = this.applied
      const list = this.orderList.filter(item => {
        if (f.orderNo && !(item.orderNo || '').includes(f.orderNo)) return false
        if (f.serviceName && !(item.serviceName || '').includes(f.serviceName)) return false
        if (f.serviceId && !(item.serviceId || '').includes(f.serviceId)) return false
        if (f.serviceProvider && !(item.serviceProvider || '').includes(f.serviceProvider)) return false
        if (f.orgName && !(item.orgName || '').includes(f.orgName)) return false
        if (f.serviceType && item.serviceType !== f.serviceType) return false
        if (f.status && item.status !== f.status) return false
        return true
      })
      list.sort((a, b) => (a.applyTime < b.applyTime ? 1 : -1))
      return list.map(i => ({ key: i.orderNo, ...i }))
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
    },
    reviewAvgScore() {
      const r = this.currentReview.ratings
      if (!r) return 0
      return (r['准确性'] + r['稳定性'] + r['响应时效'] + r['业务适配性']) / 4
    },
    drawerTimeline() {
      const rec = this.drawer.record
      if (!rec) return []
      const fmt = (minutes) => this.offsetTime(rec.applyTime, minutes)
      const DONE = { state: 'done', stateLabel: '已完成', dotColor: 'green' }
      const ON = { state: 'on', stateLabel: '进行中', dotColor: 'blue' }
      const WAIT = { state: 'wait', stateLabel: '待处理', dotColor: 'gray', time: '--' }
      const node = (title, time, st) => ({ title, time: time || '--', ...st })
      switch (rec.status) {
        case '工单流转中':
          return [
            node('提交申请', fmt(0), DONE),
            node('系统派发工单', fmt(2), DONE),
            node('工单流转中', fmt(2), ON),
            node('服务交付完成', '', WAIT),
            node('服务评价', '', WAIT)
          ]
        case '已完成':
          return [
            node('提交申请', fmt(0), DONE),
            node('系统派发工单', fmt(2), DONE),
            node('工单流转中', fmt(2), DONE),
            node('服务交付完成', fmt(24 * 60 + 35), DONE),
            node('服务评价', '', ON)
          ]
        case '已评价':
          return [
            node('提交申请', fmt(0), DONE),
            node('系统派发工单', fmt(2), DONE),
            node('工单流转中', fmt(2), DONE),
            node('服务交付完成', fmt(24 * 60 + 35), DONE),
            node('服务评价', fmt(26 * 60 + 10), DONE)
          ]
        case '已驳回':
          return [
            node('提交申请', fmt(0), DONE),
            node('系统派发工单', fmt(2), DONE),
            node('工单流转中', fmt(2), DONE),
            node('订单驳回', fmt(5 * 60 + 20), DONE)
          ]
        case '已取消':
          return [
            node('提交申请', fmt(0), DONE),
            node('订单取消', fmt(40), DONE)
          ]
        default:
          return []
      }
    }
  },
  methods: {
    getDemoContainer() {
      return document.querySelector('.app-main__content') || document.body;
    },
    getDrawerContainer() {
      return document.querySelector('.app-overlay') || document.body;
    },
    handleQuery() {
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    resetQuery() {
      this.filter = {
        orderNo: '',
        serviceName: '',
        serviceId: '',
        serviceProvider: '',
        orgName: '',
        serviceType: undefined,
        status: undefined
      }
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    onTableChange(pag) {
      this.pagination.current = pag.current
      this.pagination.pageSize = pag.pageSize
    },
    offsetTime(base, minutes) {
      if (!base) return '--'
      const t = new Date(String(base).replace(/-/g, '/'))
      if (isNaN(t.getTime())) return '--'
      t.setMinutes(t.getMinutes() + minutes)
      const p = (n) => String(n).padStart(2, '0')
      return `${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())} ${p(t.getHours())}:${p(t.getMinutes())}:${p(t.getSeconds())}`
    },
    goToDetail(row) {
      this.drawer.record = row
      this.drawer.visible = true
    },
    onViewReview(row) {
      this.currentReview = { ...this.reviewMock, reply: row.reply || null }
      this.reviewVisible = true
    },
    goToWorkorder(workorderId) {
      if (workorderId) {
        window.open(`https://yunyi-cloud.example.com/workorder/detail?workorderId=${workorderId}`, '_blank')
      }
    },
    submitReview() {
      if (this.reviewForm.score === 0) {
        message.warning('请选择满意度评分')
        return
      }
      this.reviewForm.submitting = true
      setTimeout(() => {
        this.reviewForm.submitting = false
        const idx = this.orderList.findIndex(item => item.orderNo === this.drawer.record.orderNo)
        if (idx > -1) {
          this.orderList[idx].status = '已评价'
        }
        this.drawer.record.status = '已评价'
        this.reviewInfo = {
          score: this.reviewForm.score,
          description: this.reviewForm.description || '用户未填写评价内容',
          reviewTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
        }
        message.success('评价提交成功')
      }, 600)
    },
    cancelOrder(row) {
      const target = row || this.drawer.record
      Modal.confirm({
        getContainer: this.getDemoContainer,
        title: '取消服务单',
        content: `确定要取消服务单 ${target ? target.orderNo : ''} 吗？取消后无法恢复。`,
        okText: '确定',
        cancelText: '取消',
        okType: 'danger',
        onOk: () => {
          if (target) {
            target.status = '已取消'
          }
          message.success('取消成功')
        }
      })
    },
    getServiceTypeClass(type) {
      const map = {
        '数字应用': 'service-type-tag--digital',
        '安全服务': 'service-type-tag--security',
        '能力组件': 'service-type-tag--component',
        '基础服务': 'service-type-tag--basic'
      }
      return map[type] || ''
    },
    getStatusKey(status) {
      const map = {
        '工单流转中': 'processing',
        '已完成': 'done',
        '已评价': 'evaluated',
        '已驳回': 'rejected',
        '已取消': 'cancelled'
      }
      return map[status] || 'default'
    }
  }
}
</script>

<style scoped>
.order-list-page {
  padding: 4px 0;
}

.order-list-page__divider {
  height: 1px;
  background: #F2F3F5;
  margin: 0 16px;
}

.order-list-page__table-wrap {
  padding: 0 16px 16px 16px;
}

.cell-primary {
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-weight: 500;
}

.cell-default {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}

.cell-mono {
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
  font-variant-numeric: tabular-nums;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  letter-spacing: -0.2px;
}

.cell-name {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cell-name__title {
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-weight: 600;
}

.cell-name__id {
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}

.service-type-tag {
  display: inline-block;
  padding: 0 6px;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  border-radius: 3px;
  border: 1px solid;
  vertical-align: middle;
}

.service-type-tag--digital { color: #165DFF; background: #E8F3FF; border-color: rgba(22, 93, 255, 0.20); }
.service-type-tag--security { color: #F53F3F; background: #FFF0ED; border-color: rgba(245, 63, 63, 0.20); }
.service-type-tag--component { color: #D97000; background: #FFF3E8; border-color: rgba(217, 112, 0, 0.20); }
.service-type-tag--basic { color: #16A34A; background: rgba(22, 163, 74, 0.10); border-color: rgba(22, 163, 74, 0.20); }

/* Drawer 样式 */
.drawer-header-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 4px 0 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #F2F3F5;
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

.muted {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 1.6;
}

.workorder-link {
  display: flex;
  align-items: center;
  gap: 8px;
}

.drawer-timeline {
  padding-top: 4px;
}

.tl-title {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 2px;
}

.tl-title--done { color: #4E5969; }
.tl-title--on { color: #165DFF; font-weight: 600; }
.tl-title--wait { color: #C9CDD4; }

.tl-state {
  display: inline-block;
  margin-left: 8px;
  padding: 0 6px;
  border-radius: 2px;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  vertical-align: 1px;
}

.tl-state--done { color: #4E5969; background: #F2F3F5; }
.tl-state--on { color: #165DFF; background: #E8F3FF; }
.tl-state--wait { color: #C9CDD4; background: #FAFAFA; }

.tl-time {
  font-size: 11px;
  color: #86909C;
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
  letter-spacing: -0.2px;
}

.review-result {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 4px 0;
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 4px 0;
}

.review-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.review-label {
  color: #86909C;
  font-size: 13px;
  width: 80px;
  flex-shrink: 0;
  white-space: nowrap;
}

.review-desc {
  color: rgba(0, 0, 0, 0.85);
  font-size: 13px;
  flex: 1;
  word-break: break-all;
  min-width: 0;
}

.review-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px 0;
  color: #C9CDD4;
  font-size: 13px;
}

.action-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 4px;
}

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
  margin-bottom: 10px;
  line-height: 1.4;
}
</style>

<style>
/* 抽屉内 antd 组件样式覆盖（unscoped，因 a-drawer teleport 到 body，scoped + :deep 不生效） */
.ant-drawer .ant-table-wrapper,
.ant-drawer .ant-table-wrapper .ant-table,
.ant-drawer .ant-table-wrapper .ant-table-container,
.ant-drawer .ant-table-wrapper .ant-table-thead > tr > th,
.ant-drawer .ant-table-wrapper .ant-table-tbody > tr > td,
.ant-drawer .ant-table-wrapper .ant-table-thead > tr:first-child > th:first-child,
.ant-drawer .ant-table-wrapper .ant-table-tbody > tr:first-child > td:first-child,
.ant-drawer .ant-descriptions,
.ant-drawer .ant-descriptions-view,
.ant-drawer .ant-descriptions-row > td,
.ant-drawer .ant-descriptions-row > th {
  border-radius: 0 !important;
}

.ant-drawer .ant-table-thead .ant-table-cell {
  font-weight: normal !important;
}

.ant-drawer .ant-descriptions-item-label {
  width: 160px !important;
  min-width: 160px !important;
  max-width: 160px !important;
  text-align: left !important;
  white-space: nowrap;
}

.mvp-detail-tabs .ant-descriptions-item-label {
  background: #FAFBFC !important;
  font-size: 14px !important;
  font-weight: 400 !important;
  color: rgba(0, 0, 0, 0.85) !important;
  font-feature-settings: "tnum" !important;
}

.mvp-detail-tabs .ant-descriptions-item-content {
  font-size: 14px !important;
  font-weight: 400 !important;
  color: rgba(0, 0, 0, 0.65) !important;
  font-feature-settings: "tnum" !important;
}
</style>

<style scoped>
.review-modal__rating-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 14px;
}

.review-modal__rating-item {
  border: 1px solid #F2F3F5;
  border-radius: 4px;
  padding: 10px 12px;
}

.review-modal__rating-label {
  font-size: 12px;
  color: #86909C;
  margin-bottom: 4px;
}

.review-modal__composite {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #FAFBFC;
  border-radius: 6px;
  margin-bottom: 14px;
}

.review-modal__composite-label {
  font-size: 13px;
  color: #86909C;
}

.review-modal__composite-score {
  font-size: 20px;
  font-weight: 700;
  color: #165DFF;
}

.review-modal__content {
  margin-bottom: 12px;
}

.review-modal__content-label {
  font-size: 13px;
  color: #86909C;
  margin-bottom: 6px;
}

.review-modal__content-text {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.6;
  margin: 0;
}

.review-modal__meta {
  font-size: 12px;
  color: #86909C;
  display: flex;
  align-items: center;
  gap: 6px;
}

.review-modal__meta-sep {
  color: #C9CDD4;
}

.review-modal__reply {
  margin-top: 12px;
  padding: 12px;
  background: #F7F8FA;
  border-radius: 4px;
}

.review-modal__reply-label {
  font-size: 13px;
  color: #86909C;
  margin-bottom: 6px;
}

.review-modal__reply-text {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.6;
  margin: 0 0 6px;
}

.review-modal__reply-meta {
  font-size: 12px;
  color: #86909C;
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
