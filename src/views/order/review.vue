<template>
  <div class="review-page">
    <PageHeader
      :title="viewMode === 'summary' ? '质量评价管理' : '评价明细'"
      :description="viewMode === 'summary'
        ? '查看平台服务的评价汇总数据，支持按服务名称、服务ID和服务类型筛选，可点击查看评价明细'
        : '查看该服务的用户评价明细，支持回复用户评价'"
    />

    <!-- 汇总视图 -->
    <div v-if="viewMode === 'summary'" class="review-page__summary">
      <CloudCard class="review-page__table-card">
        <FilterBar @search="handleQuery" @reset="resetQuery">
          <a-input v-model:value="filter.serviceName" placeholder="服务名称" allow-clear style="width: 180px" @pressEnter="handleQuery" />
          <a-input v-model:value="filter.serviceId" placeholder="服务ID" allow-clear style="width: 180px" @pressEnter="handleQuery" />
          <a-select v-model:value="filter.serviceType" placeholder="服务类型" allow-clear style="width: 150px">
            <a-select-option value="数字应用">数字应用</a-select-option>
            <a-select-option value="安全服务">安全服务</a-select-option>
            <a-select-option value="能力组件">能力组件</a-select-option>
            <a-select-option value="基础服务">基础服务</a-select-option>
          </a-select>
        </FilterBar>
        <div class="review-page__divider"></div>

        <div class="review-page__table-wrap">
          <a-table
            :columns="summaryColumns"
            :data-source="summaryData"
            :pagination="paginationConfig"
            :loading="loading"
            row-key="serviceId"
            size="middle"
            @change="onTableChange"
          >
            <template #headerCell="{ column }">
              <template v-if="column.key === 'avgScore'">
                <a-tooltip title="所有用户的平均分值">
                  <span class="header-with-tip">用户评分 <QuestionCircleOutlined class="header-tip-icon" /></span>
                </a-tooltip>
              </template>
              <template v-else-if="column.key === 'platformScore'">
                <a-tooltip title="平台管理员赋分">
                  <span class="header-with-tip">平台评分 <QuestionCircleOutlined class="header-tip-icon" /></span>
                </a-tooltip>
              </template>
            </template>
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'serviceName'">
                <div class="summary-service">
                  <div class="summary-service__name">{{ record.serviceName || '--' }}</div>
                  <div class="summary-service__id">{{ record.serviceId || '--' }}</div>
                </div>
              </template>
              <template v-else-if="column.dataIndex === 'avgAccuracy'">
                <span :class="metricClass(record.avgAccuracy, 4.5)">{{ record.avgAccuracy.toFixed(1) }}</span>
              </template>
              <template v-else-if="column.dataIndex === 'avgStability'">
                <span :class="metricClass(record.avgStability, 4.0)">{{ record.avgStability.toFixed(1) }}</span>
              </template>
              <template v-else-if="column.dataIndex === 'avgResponseTime'">
                <span :class="metricClass(record.avgResponseTime, 4.5)">{{ record.avgResponseTime.toFixed(1) }}</span>
              </template>
              <template v-else-if="column.dataIndex === 'avgBusinessFit'">
                <span :class="metricClass(record.avgBusinessFit, 4.0)">{{ record.avgBusinessFit.toFixed(1) }}</span>
              </template>
              <template v-else-if="column.dataIndex === 'avgScore'">
                <a-progress
                  type="circle"
                  :percent="record.avgScore * 20"
                  :size="36"
                  :stroke-color="scoreColor(record.avgScore)"
                  :format="() => record.avgScore.toFixed(1)"
                />
              </template>
              <template v-else-if="column.dataIndex === 'platformScore'">
                <a-progress
                  type="circle"
                  :percent="record.platformScore * 20"
                  :size="36"
                  :stroke-color="scoreColor(record.platformScore)"
                  :format="() => record.platformScore.toFixed(1)"
                />
              </template>
              <template v-else-if="column.dataIndex === 'action'">
                <a-space :size="0">
                  <a-button type="link" size="small" @click="viewServiceDetail(record)">查看明细</a-button>
                  <a-divider type="vertical" />
                  <a-button type="link" size="small" @click="onPlatformEvaluate(record)">平台评分</a-button>
                </a-space>
              </template>
              <span v-else class="cell-default">{{ record[column.dataIndex] || '--' }}</span>
            </template>
          </a-table>
        </div>
      </CloudCard>
    </div>

    <!-- 明细视图 -->
    <template v-else>
      <div class="sticky top-0 z-30 bg-surface border-b border-border px-[24px] py-[12px] -mx-[0] mb-[12px] rounded-t-[8px]">
        <div class="flex items-center gap-[12px]">
          <a class="text-text-secondary hover:text-primary text-[13px] flex items-center gap-[4px]" @click="backToSummary">
            <ArrowLeftOutlined />
            返回
          </a>
          <a-divider type="vertical" />
          <span class="text-[16px] font-semibold text-text-primary">评价明细</span>
          <template v-if="selectedService">
            <span class="text-[13px] text-text-tertiary">服务名称：{{ selectedService.serviceName }}</span>
            <span class="text-[12px] text-text-tertiary">ID：{{ selectedService.serviceId }}</span>
          </template>
        </div>
      </div>

      <CloudCard class="review-page__table-card">
        <FilterBar @search="handleDetailQuery" @reset="resetDetailQuery">
          <a-select v-model:value="detailFilter.score" placeholder="四维均分" allow-clear style="width: 120px">
            <a-select-option value="5">5 星</a-select-option>
            <a-select-option value="4">4 星</a-select-option>
            <a-select-option value="3">3 星及以下</a-select-option>
          </a-select>
          <a-select v-model:value="detailFilter.status" placeholder="状态" allow-clear style="width: 120px">
            <a-select-option value="待回复">待回复</a-select-option>
            <a-select-option value="已回复">已回复</a-select-option>
          </a-select>
        </FilterBar>
        <div class="review-page__divider"></div>

        <div class="review-page__table-wrap">
          <a-table
            :columns="columns"
            :data-source="filteredDetailData"
            :pagination="paginationConfig"
            :loading="loading"
            row-key="id"
            size="middle"
            @change="onTableChange"
          >
            <template #headerCell="{ column }">
              <template v-if="column.key === 'avgScore'">
                <a-tooltip title="准确性、稳定性、响应时效、业务适配性的平均分值">
                  <span class="header-with-tip">四维均分 <QuestionCircleOutlined class="header-tip-icon" /></span>
                </a-tooltip>
              </template>
            </template>
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'dims'">
                <div class="dim-scores">
                  <span v-for="d in ratingKeys" :key="d" class="dim-score-item">
                    <span class="dim-score-label">{{ d }}</span>
                    <span class="metric" :class="scoreClass(record.ratings[d])">{{ record.ratings[d] }}</span>
                  </span>
                </div>
              </template>
              <template v-else-if="column.dataIndex === 'avgScore'">
                <span class="metric" :class="scoreClass(itemAvgScore(record))">{{ itemAvgScore(record).toFixed(1) }}</span>
              </template>
              <template v-else-if="column.dataIndex === 'orderNo'">
                <span class="cell-mono">{{ record.orderNo || '--' }}</span>
              </template>
              <template v-else-if="column.dataIndex === 'content'">
                <div class="cell-ellipsis">{{ record.content || '--' }}</div>
              </template>
              <template v-else-if="column.dataIndex === 'replyContent'">
                <div v-if="record.reply" class="reply-inline">
                  <span class="reply-inline__text">{{ record.reply }}</span>
                </div>
                <span v-else class="text-[12px] text-text-tertiary">--</span>
              </template>
              <template v-else-if="column.dataIndex === 'status'">
                <StatusDot :type="record.status === '已回复' ? 'done' : 'warning'" :text="record.status" />
              </template>
              <template v-else-if="column.dataIndex === 'action'">
                <a-button v-if="record.status !== '已回复'" type="link" size="small" class="!p-0" @click="openReplyModal(record)">回复</a-button>
                <span v-else class="text-[12px] text-text-tertiary">--</span>
              </template>
              <span v-else class="cell-default">{{ record[column.dataIndex] || '--' }}</span>
            </template>
          </a-table>
        </div>
      </CloudCard>
    </template>

    <!-- 回复弹窗 -->
    <a-modal v-model:open="replyModalVisible" title="回复评价" :width="480" :footer="null" :destroy-on-close="true">
      <div class="mb-[14px]">
        <div class="text-[13px] font-semibold text-text-primary mb-[6px]">回复内容</div>
        <a-textarea v-model:value="replyForm.replyContent" :rows="4" placeholder="请输入回复内容..." />
      </div>
      <div class="review-page__divider" style="margin: 0 -24px"></div>
      <div class="flex justify-end gap-[8px] mt-[14px]">
        <a-button @click="replyModalVisible = false">取消</a-button>
        <a-button type="primary" @click="submitReply">提交回复</a-button>
      </div>
    </a-modal>

    <!-- 平台评分弹窗 -->
    <a-modal v-model:open="platformEvalVisible" title="平台评分" :width="480" :footer="null" :destroy-on-close="true">
      <a-form layout="vertical">
        <a-form-item label="平台评分">
          <a-rate v-model:value="platformEvalForm.score" style="font-size: 24px" />
          <span class="text-[13px] text-text-tertiary ml-[8px]">{{ platformEvalForm.score }} 星</span>
        </a-form-item>
        <a-form-item label="评价内容" required>
          <a-textarea v-model:value="platformEvalForm.content" :rows="4" placeholder="请输入平台评分内容..." :maxlength="500" />
        </a-form-item>
      </a-form>
      <div class="review-page__divider" style="margin: 0 -24px"></div>
      <div class="flex justify-end gap-[8px] mt-[16px]">
        <a-button @click="platformEvalVisible = false">取消</a-button>
        <a-button type="primary" @click="submitPlatformEval">提交评价</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { ArrowLeftOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import PageHeader from '@/components/cloud/PageHeader.vue'
import CloudCard from '@/components/cloud/CloudCard.vue'
import FilterBar from '@/components/cloud/FilterBar.vue'
import StatusDot from '@/components/cloud/StatusDot.vue'

export default {
  name: 'ServiceReview',
  components: {
    PageHeader, CloudCard, FilterBar, StatusDot,
    ArrowLeftOutlined, QuestionCircleOutlined
  },
  data() {
    return {
      loading: false,
      viewMode: 'summary',
      selectedService: null,
      filter: { serviceName: '', serviceId: '', serviceType: undefined },
      applied: { serviceName: '', serviceId: '', serviceType: undefined },
      detailFilter: { score: undefined, status: undefined },
      detailApplied: { score: undefined, status: undefined },
      pagination: { current: 1, pageSize: 10 },
      summaryColumns: [
        { title: '服务名称/ID', dataIndex: 'serviceName', key: 'serviceName' },
        { title: '平均准确性', dataIndex: 'avgAccuracy', key: 'avgAccuracy', width: 105 },
        { title: '平均稳定性', dataIndex: 'avgStability', key: 'avgStability', width: 105 },
        { title: '平均响应时效', dataIndex: 'avgResponseTime', key: 'avgResponseTime', width: 115 },
        { title: '平均业务适配性', dataIndex: 'avgBusinessFit', key: 'avgBusinessFit', width: 130 },
        { title: '用户评分', dataIndex: 'avgScore', key: 'avgScore', width: 110 },
        { title: '平台评分', dataIndex: 'platformScore', key: 'platformScore', width: 110 },
        { title: '操作', dataIndex: 'action', key: 'action', width: 160 },
      ],
      columns: [
        { title: '评分维度', dataIndex: 'dims', key: 'dims', width: 240 },
        { title: '四维均分', dataIndex: 'avgScore', key: 'avgScore', width: 80 },
        { title: '服务单号', dataIndex: 'orderNo', key: 'orderNo', width: 140 },
        { title: '评价机构', dataIndex: 'orgName', key: 'orgName', width: 170, ellipsis: true },
        { title: '评价内容', dataIndex: 'content', key: 'content', width: 260, ellipsis: true },
        { title: '评价时间', dataIndex: 'time', key: 'time', width: 140 },
        { title: '回复内容', dataIndex: 'replyContent', key: 'replyContent', width: 200, ellipsis: true },
        { title: '回复人', dataIndex: 'replyBy', key: 'replyBy', width: 100 },
        { title: '回复时间', dataIndex: 'replyTime', key: 'replyTime', width: 140 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
        { title: '操作', dataIndex: 'action', key: 'action', width: 90, fixed: 'right' }
      ],
      reviewList: [
        { id: 1, ratings: { '准确性': 5, '稳定性': 5, '响应时效': 5, '业务适配性': 4 }, serviceId: 'SVC001', serviceName: '云服务器ECS', serviceType: '基础服务', orderNo: '202608100085', orgName: '华能数智科技集团', userName: '张三', department: '技术部', content: '开通非常快，3 分钟内到账，配置灵活，稳定性也很好。', time: '2026-03-15 10:30', status: '已回复', reply: '感谢您的好评，我们会继续努力提供更好的服务！', replyBy: '平台管理员', replyTime: '2026-03-15 14:20' },
        { id: 2, ratings: { '准确性': 4, '稳定性': 4, '响应时效': 4, '业务适配性': 4 }, serviceId: 'SVC001', serviceName: '云服务器ECS', serviceType: '基础服务', orderNo: '202608100090', orgName: '北京协和医学院', userName: '李四', department: '信息科', content: '性能稳定，弹性扩展方便，性价比不错。', time: '2026-03-18 09:15', status: '已回复', reply: '感谢反馈！', replyBy: '平台管理员', replyTime: '2026-03-18 11:00' },
        { id: 3, ratings: { '准确性': 3, '稳定性': 3, '响应时效': 2, '业务适配性': 3 }, serviceId: 'SVC001', serviceName: '云服务器ECS', serviceType: '基础服务', orderNo: '202608100095', orgName: '中远云科技有限公司', userName: '王五', department: '运维部', content: '基本可用，但高峰期偶尔有延迟。', time: '2026-03-20 16:40', status: '待回复' },
        { id: 4, ratings: { '准确性': 4, '稳定性': 2, '响应时效': 1, '业务适配性': 3 }, serviceId: 'SVC002', serviceName: '等保三级合规评估', serviceType: '安全服务', orderNo: '202608100071', orgName: '中远云科技有限公司', userName: '王总', department: '信息部', content: '报告交付严重超期，比承诺时间晚了 2 周，沟通也不及时，影响了我们的申报计划。', time: '2026-03-14 14:20', status: '待回复' },
        { id: 5, ratings: { '准确性': 5, '稳定性': 5, '响应时效': 4, '业务适配性': 5 }, serviceId: 'SVC002', serviceName: '等保三级合规评估', serviceType: '安全服务', orderNo: '202608100078', orgName: '华能数智科技集团', userName: '赵六', department: '安全部', content: '评估报告专业详细，整改建议很有价值。', time: '2026-03-16 11:00', status: '已回复', reply: '感谢认可！', replyBy: '平台管理员', replyTime: '2026-03-16 14:30' },
        { id: 6, ratings: { '准确性': 4, '稳定性': 4, '响应时效': 3, '业务适配性': 4 }, serviceId: 'SVC003', serviceName: '云防火墙', serviceType: '安全服务', orderNo: '202608100083', orgName: '北京协和医学院', userName: '李护士长', department: '信息科', content: '防护效果很好，配置策略专业，扣一星是因为控制台 UI 稍微复杂了一点。', time: '2026-03-13 16:45', status: '已回复', reply: '感谢您的反馈，我们正在优化控制台 UI，预计下月会推出新版本。', replyBy: '平台管理员', replyTime: '2026-03-13 18:30' },
        { id: 7, ratings: { '准确性': 5, '稳定性': 5, '响应时效': 5, '业务适配性': 4 }, serviceId: 'SVC003', serviceName: '云防火墙', serviceType: '安全服务', orderNo: '202608100088', orgName: '海淀区数字经济发展局', userName: '钱七', department: '技术处', content: '安全防护到位，告警及时，非常好用。', time: '2026-03-19 10:20', status: '已回复', reply: '感谢支持！', replyBy: '平台管理员', replyTime: '2026-03-19 15:00' },
        { id: 8, ratings: { '准确性': 4, '稳定性': 4, '响应时效': 4, '业务适配性': 5 }, serviceId: 'C001', serviceName: '智慧医院信息管理系统', serviceType: '数字应用', orderNo: '202608100092', orgName: '北京协和医学院', userName: '孙医生', department: '门诊办', content: '门诊流程清晰，挂号方便，建议增加医保在线结算功能。', time: '2026-03-17 14:00', status: '已回复', reply: '感谢建议，医保在线结算功能已在开发计划中。', replyBy: '平台管理员', replyTime: '2026-03-17 16:30' },
        { id: 9, ratings: { '准确性': 5, '稳定性': 4, '响应时效': 5, '业务适配性': 5 }, serviceId: 'NLZJ202610210001', serviceName: '电子健康卡', serviceType: '能力组件', orderNo: '202608100096', orgName: '海淀区数字经济发展局', userName: '周八', department: '卫健处', content: '一码通用非常方便，居民体验很好。', time: '2026-03-21 09:30', status: '待回复' }
      ],
      ratingKeys: ['准确性', '稳定性', '响应时效', '业务适配性'],
      replyModalVisible: false,
      replyTarget: null,
      replyForm: { replyContent: '' },
      platformEvalVisible: false,
      platformEvalTarget: null,
      platformEvalForm: { score: 0, content: '' }
    }
  },
  computed: {
    summaryData() {
      const f = this.applied
      const groupMap = {}
      this.reviewList.forEach(item => {
        if (f.serviceName && !(item.serviceName || '').includes(f.serviceName)) return
        if (f.serviceId && !(item.serviceId || '').includes(f.serviceId)) return
        if (f.serviceType && item.serviceType !== f.serviceType) return
        const key = item.serviceId || item.serviceName
        if (!groupMap[key]) {
          groupMap[key] = {
            serviceId: item.serviceId || '--',
            serviceName: item.serviceName,
            serviceType: item.serviceType,
            reviews: [],
            accSum: 0, stabSum: 0, rtSum: 0, bizSum: 0,
            reviewCount: 0
          }
        }
        const g = groupMap[key]
        g.reviews.push(item)
        g.reviewCount++
        g.accSum += item.ratings['准确性']
        g.stabSum += item.ratings['稳定性']
        g.rtSum += item.ratings['响应时效']
        g.bizSum += item.ratings['业务适配性']
      })
      return Object.values(groupMap).map(g => ({
        key: g.serviceId,
        serviceId: g.serviceId,
        serviceName: g.serviceName,
        serviceType: g.serviceType,
        reviews: g.reviews,
        reviewCount: g.reviewCount,
        avgAccuracy: g.reviewCount ? g.accSum / g.reviewCount : 0,
        avgStability: g.reviewCount ? g.stabSum / g.reviewCount : 0,
        avgResponseTime: g.reviewCount ? g.rtSum / g.reviewCount : 0,
        avgBusinessFit: g.reviewCount ? g.bizSum / g.reviewCount : 0,
        avgScore: g.reviewCount ? (g.accSum + g.stabSum + g.rtSum + g.bizSum) / (g.reviewCount * 4) : 0,
        platformScore: +(g.reviewCount ? ((g.accSum + g.stabSum + g.rtSum + g.bizSum) / (g.reviewCount * 4) + (Math.random() * 1.2 - 0.4)) : 0).toFixed(1)
      })).map(g => ({ ...g, platformScore: Math.min(5, Math.max(1, g.platformScore)) })).sort((a, b) => b.avgScore - a.avgScore)
    },
    filteredDetailData() {
      if (!this.selectedService) return []
      const f = this.detailApplied
      const list = this.reviewList.filter(item => {
        if ((item.serviceId || item.serviceName) !== (this.selectedService.serviceId || this.selectedService.serviceName)) return false
        if (f.status && item.status !== f.status) return false
        if (f.score) {
          const avg = this.itemAvgScore(item)
          const s = parseInt(f.score)
          if (s === 3 && avg > 3) return false
          if (s !== 3 && Math.round(avg) !== s) return false
        }
        return true
      })
      return list.map(i => ({ key: i.id, ...i, score: this.itemAvgScore(i) }))
    },
    paginationConfig() {
      const total = this.viewMode === 'summary' ? this.summaryData.length : this.filteredDetailData.length
      return {
        current: this.pagination.current,
        pageSize: this.pagination.pageSize,
        total,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (t) => `共 ${t} 条`
      }
    }
  },
  created() {
    this.checkRouteQuery()
  },
  watch: {
    '$route.query'() {
      this.checkRouteQuery()
    }
  },
  methods: {
    checkRouteQuery() {
      const serviceId = this.$route.query.serviceId
      if (serviceId) {
        const service = this.summaryData.find(s => s.serviceId === serviceId)
        if (service) {
          this.viewServiceDetail(service)
        }
      }
    },
    handleQuery() {
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    resetQuery() {
      this.filter = { serviceName: '', serviceId: '', serviceType: undefined }
      this.applied = { ...this.filter }
      this.pagination.current = 1
    },
    handleDetailQuery() {
      this.detailApplied = { ...this.detailFilter }
      this.pagination.current = 1
    },
    resetDetailQuery() {
      this.detailFilter = { score: undefined, status: undefined }
      this.detailApplied = { ...this.detailFilter }
      this.pagination.current = 1
    },
    onTableChange(pag) {
      this.pagination.current = pag.current
      this.pagination.pageSize = pag.pageSize
    },
    viewServiceDetail(service) {
      this.selectedService = service
      this.viewMode = 'detail'
      this.detailFilter = { score: undefined, status: undefined }
      this.detailApplied = { score: undefined, status: undefined }
      this.pagination.current = 1
    },
    backToSummary() {
      this.viewMode = 'summary'
      this.selectedService = null
      this.pagination.current = 1
    },
    openReplyModal(row) {
      this.replyTarget = row
      this.replyForm = { replyContent: '' }
      this.replyModalVisible = true
    },
    submitReply() {
      if (!this.replyForm.replyContent) {
        message.warning('请输入回复内容')
        return
      }
      const index = this.reviewList.findIndex(item => item.id === this.replyTarget.id)
      if (index > -1) {
        this.reviewList[index].status = '已回复'
        this.reviewList[index].reply = this.replyForm.replyContent
        this.reviewList[index].replyBy = '当前用户'
        this.reviewList[index].replyTime = '2026-03-21 16:00'
      }
      this.replyModalVisible = false
      message.success('回复成功')
    },
    itemAvgScore(item) {
      const r = item.ratings
      return (r['准确性'] + r['稳定性'] + r['响应时效'] + r['业务适配性']) / 4
    },
    metricClass(value, threshold) {
      if (value >= 4.5) return 'metric metric--good'
      if (value >= threshold) return 'metric metric--ok'
      return 'metric metric--bad'
    },
    scoreClass(val) {
      if (val >= 4) return 'score-high'
      if (val >= 3) return 'score-mid'
      return 'score-low'
    },
    onPlatformEvaluate(record) {
      this.platformEvalTarget = record
      this.platformEvalForm = { score: 0, content: '' }
      this.platformEvalVisible = true
    },
    submitPlatformEval() {
      if (!this.platformEvalForm.score) {
        message.warning('请选择评分')
        return
      }
      if (this.platformEvalTarget) {
        this.platformEvalTarget.platformScore = this.platformEvalForm.score
        this.platformEvalTarget.platformContent = this.platformEvalForm.content
      }
      this.platformEvalVisible = false
      message.success('平台评分提交成功')
    },
    scoreColor(score) {
      if (score >= 4.5) return '#10B981'
      if (score >= 4.0) return '#165DFF'
      if (score >= 3.5) return '#F59E0B'
      return '#EF4444'
    },
  }
}
</script>

<style scoped>
.review-page {
  padding: 4px 0;
}

.review-page__divider {
  height: 1px;
  background: #F2F3F5;
  margin: 0 16px;
}

.review-page__table-wrap {
  padding: 0 16px 16px 16px;
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
}

.cell-stack {
  display: flex;
  flex-direction: column;
  line-height: 1.5;
}

.cell-stack__primary {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.cell-stack__secondary {
  font-size: 12px;
  color: #86909C;
  margin-top: 2px;
}

.cell-ellipsis {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.5;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 汇总视图 - 服务名称 */
.summary-service {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.summary-service__name {
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}

.summary-service__meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.summary-service__id {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
}

/* 明细视图头部 */
.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.detail-header__info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.detail-header__title {
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}

.detail-header__stat {
  font-size: 13px;
  color: #64748b;
}

.review-page :deep(.ant-table-thead .ant-table-cell) {
  white-space: nowrap;
}

.metric {
  font-size: 14px;
  font-weight: 600;
}

.metric--good { color: #10B981; }
.metric--ok { color: #F59E0B; }
.metric--bad { color: #EF4444; }

/* ===== 回复弹窗 ===== */
.reply-modal__info {
  padding: 12px;
  background: #FAFBFC;
  border-radius: 6px;
  margin-bottom: 4px;
}

.reply-modal__org {
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 4px;
}

.reply-modal__meta {
  font-size: 12px;
  color: #86909C;
  margin-bottom: 8px;
}

.reply-modal__content {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.6;
}

.header-with-tip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: help;
}

.header-tip-icon {
  font-size: 12px;
  color: #86909C;
}

/* 明细维度统一风格 */
.dim-scores {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.dim-score-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.dim-score-label {
  color: #86909C;
  font-size: 13px;
}

/* 评价内容+时间 */
.content-with-time {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.content-time {
  font-size: 12px;
  color: #86909C;
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
}

/* 回复内联展示 */
.reply-inline {
  max-width: 220px;
}

.reply-inline__text {
  font-size: 12px;
  color: #86909C;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

