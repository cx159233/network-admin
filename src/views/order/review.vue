<template>
  <div>
    <!-- 筛选条件 -->
    <el-row :gutter="24" class="mb12">
      <el-col :span="24">
        <el-form
          :model="queryParams"
          size="small"
          class="el-form-search"
          :inline="true"
        >
          <el-form-item prop="serviceName">
            <el-input
              v-model="queryParams.serviceName"
              placeholder="请输入服务名称"
              clearable
              style="width: 160px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item prop="orgName">
            <el-input
              v-model="queryParams.orgName"
              placeholder="请输入机构名称"
              clearable
              style="width: 160px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item prop="serviceType">
            <el-select
              v-model="queryParams.serviceType"
              placeholder="所有服务类型"
              clearable
              style="width: 150px"
            >
              <el-option label="数字应用服务" value="数字应用服务" />
              <el-option label="能力组件服务" value="能力组件服务" />
              <el-option label="安全服务" value="安全服务" />
              <el-option label="基础资源服务" value="基础资源服务" />
            </el-select>
          </el-form-item>
          <el-form-item prop="score">
            <el-select
              v-model="queryParams.score"
              placeholder="所有评分"
              clearable
              style="width: 150px"
            >
              <el-option label="所有评分" value="" />
              <el-option label="5星" value="5" />
              <el-option label="4星" value="4" />
              <el-option label="3星及以下" value="3" />
            </el-select>
          </el-form-item>
          <el-form-item prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="所有状态"
              clearable
              style="width: 150px"
            >
              <el-option label="所有状态" value="" />
              <el-option label="待回复" value="pending" />
              <el-option label="已回复" value="replied" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="handleQuery"
              >搜索</el-button>
              <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
            </el-button-group>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!-- 评价列表 -->
    <el-table
      v-loading="loading"
      :data="reviewList"
      size="small"
      style="width: 100%"
      :header-cell-style="{background:'#f5f7fa'}"
      class-name="small-padding fixed-width"
    >
      <el-table-column label="评分" width="80">
        <template slot-scope="scope">
          <div class="stars">
            <span v-for="i in 5" :key="i" class="star" :class="{ full: i <= scope.row.score }">★</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="服务/订单号" min-width="200">
        <template slot-scope="scope">
          <div><div class="rv-title">{{ scope.row.serviceName || '--' }}</div><div class="rv-sub">{{ scope.row.orderNo || '--' }}</div></div>
        </template>
      </el-table-column>
      <el-table-column label="服务类型" width="120">
        <template slot-scope="scope">
          <el-tag :type="getServiceTypeColor(scope.row.serviceType)" size="small">{{ scope.row.serviceType || '--' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="评价机构" min-width="180">
        <template slot-scope="scope">{{ scope.row.orgName || '--' }}</template>
      </el-table-column>
      <el-table-column label="评价内容" min-width="250">
        <template slot-scope="scope"><div class="rv-content">{{ scope.row.content || '--' }}</div></template>
      </el-table-column>
      <el-table-column label="评价时间" width="130">
        <template slot-scope="scope">{{ scope.row.time || '--' }}</template>
      </el-table-column>
      <el-table-column label="状态" width="90">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === '已回复' ? 'success' : 'warning'" size="mini">{{ scope.row.status || '--' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="回复内容" min-width="250">
        <template slot-scope="scope"><div class="rv-content">{{ scope.row.reply || '--' }}</div></template>
      </el-table-column>
      <el-table-column label="回复时间" width="130">
        <template slot-scope="scope">{{ scope.row.replyTime || '--' }}</template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-link v-if="scope.row.status === '已回复'" type="primary" :underline="false" @click="handleView(scope.row)">查看</el-link>
          <el-link v-else type="primary" :underline="false" @click="handleReply(scope.row)">回复</el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="loadReviewList"
    />

    <!-- 回复对话框 -->
    <el-dialog :title="isViewMode ? '评价详情' : '回复评价'" :visible.sync="replyDialogVisible" width="620px" top="5vh" :close-on-click-modal="false" :modal-append-to-body="false">
      <div class="dialog-tip" v-if="!isViewMode">
        <i class="el-icon-info"></i>
        <span>请对用户评价进行回复，回复内容将对用户可见。</span>
      </div>
      <div class="review-info-box" v-if="currentReview.content">
        <div class="form-section-title">评价信息</div>
        <div class="detail-kv">
          <div class="kv-item"><label>评价人</label><span>{{ currentReview.userName || '--' }}</span></div>
          <div class="kv-item"><label>所属部门</label><span>{{ currentReview.department || '--' }}</span></div>
          <div class="kv-item"><label>评价机构</label><span>{{ currentReview.orgName || '--' }}</span></div>
          <div class="kv-item"><label>服务名称</label><span>{{ currentReview.serviceName || '--' }}</span></div>
          <div class="kv-item"><label>订单号</label><span>{{ currentReview.orderNo || '--' }}</span></div>
          <div class="kv-item"><label>评分</label><span><div class="stars-inline"><span v-for="i in 5" :key="i" class="star" :class="{ full: i <= currentReview.score }">★</span></div></span></div>
          <div class="kv-item full"><label>评价内容</label><span>{{ currentReview.content }}</span></div>
        </div>
      </div>
      <el-form
        v-if="!isViewMode"
        ref="replyFormRef"
        :model="replyForm"
        label-width="100px"
        class="add-form"
      >
        <div class="form-section">
          <div class="form-section-title">回复信息</div>
          <el-form-item label="回复内容" prop="replyContent">
            <el-input
              v-model="replyForm.replyContent"
              type="textarea"
              :rows="5"
              placeholder="请输入回复内容..."
            />
          </el-form-item>
        </div>
      </el-form>
      <div v-if="isViewMode && currentReview.reply" class="review-info-box">
        <div class="form-section-title">客服回复</div>
        <div class="detail-kv">
          <div class="kv-item full"><label>回复内容</label><span>{{ currentReview.reply }}</span></div>
          <div class="kv-item"><label>回复时间</label><span>{{ currentReview.replyTime || '--' }}</span></div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="replyDialogVisible = false">取 消</el-button>
        <el-button v-if="!isViewMode" type="primary" @click="submitReply">提交回复</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index.vue'

export default {
  name: 'ServiceReview',
  components: {
    Pagination
  },
  data() {
    return {
      loading: false,
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        serviceName: '',
        orgName: '',
        serviceType: '',
        score: '',
        status: ''
      },
      reviewList: [
        {
          id: 1,
          score: 5,
          serviceName: '云主机（ECS）',
          serviceType: '基础资源服务',
          orderNo: '#ORD-2024-0085',
          orgName: '华能数智科技集团',
          userName: '张三',
          department: '技术部',
          content: '开通非常快，3 分钟内到账，配置灵活，稳定性也很好。',
          time: '2024-03-15 10:30',
          status: '已回复',
          reply: '感谢您的好评，我们会继续努力提供更好的服务！',
          replyTime: '2024-03-15 14:20'
        },
        {
          id: 2,
          score: 2,
          serviceName: '等保三级合规评估',
          serviceType: '安全服务',
          orderNo: '#ORD-2024-0071',
          orgName: '中远云科技有限公司',
          userName: '王总',
          department: '信息部',
          content: '报告交付严重超期，比承诺时间晚了 2 周，沟通也不及时，影响了我们的申报计划。',
          time: '2024-03-14 14:20',
          status: '待回复'
        },
        {
          id: 3,
          score: 4,
          serviceName: '云防火墙',
          serviceType: '安全服务',
          orderNo: '#ORD-2024-0083',
          orgName: '北京协和医学院',
          userName: '李护士长',
          department: '信息科',
          content: '防护效果很好，配置策略专业，扣一星是因为控制台 UI 稍微复杂了一点。',
          time: '2024-03-13 16:45',
          status: '已回复',
          reply: '感谢您的反馈，我们正在优化控制台 UI，预计下月会推出新版本。',
          replyTime: '2024-03-13 18:30'
        }
      ],
      viewDialogVisible: false,
      replyDialogVisible: false,
      isViewMode: false,
      currentReview: {},
      replyForm: {
        replyContent: ''
      },
      replyContent: ''
    }
  },
  created() {
    this.loadReviewList()
  },
  methods: {
    loadReviewList() {
      this.loading = true
      setTimeout(() => {
        this.total = this.reviewList.length
        this.loading = false
      }, 500)
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.loadReviewList()
    },
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        serviceName: '',
        orgName: '',
        serviceType: '',
        score: '',
        status: ''
      }
      this.loadReviewList()
    },
    handleView(row) {
      this.currentReview = JSON.parse(JSON.stringify(row))
      this.isViewMode = true
      this.replyDialogVisible = true
    },
    handleReply(row) {
      this.currentReview = JSON.parse(JSON.stringify(row))
      this.replyForm = {
        replyContent: ''
      }
      this.isViewMode = false
      this.replyDialogVisible = true
    },
    submitReply() {
      if (!this.replyForm.replyContent) {
        this.$message.warning('请输入回复内容')
        return
      }
      this.currentReview.reply = this.replyForm.replyContent
      this.currentReview.status = '已回复'
      const index = this.reviewList.findIndex(item => item.id === this.currentReview.id)
      if (index > -1) {
        this.reviewList[index].status = '已回复'
        this.reviewList[index].reply = this.replyForm.replyContent
      }
      this.replyDialogVisible = false
      this.$message.success('回复成功')
    },
    getStatusTagType(status) {
      switch (status) {
        case '待回复':
          return 'warning'
        case '已回复':
          return 'success'
        default:
          return ''
      }
    },
    getServiceTypeColor(type) {
      const colorMap = {
        '数字应用服务': 'info',
        '能力组件服务': 'success',
        '安全服务': 'warning',
        '基础资源服务': 'primary'
      }
      return colorMap[type] || 'info'
    }
  }
}
</script>

<style scoped>
.mb12 {
  margin-bottom: 12px;
}

.stars {
  display: flex;
  gap: 2px;
}

.stars-inline {
  display: inline-flex;
  gap: 2px;
}

.star {
  font-size: 14px;
  color: #d9d9d9;
}

.star.full {
  color: #faad14;
}

/* 评价列表样式 - 与其他列表保持一致 */
.rv-title { font-size: 12px; font-weight: 400; color: #606266; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
.rv-sub { font-size: 12px; color: #8c8c8c; margin-top: 2px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
.rv-content { font-size: 12px; color: #606266; line-height: 1.5; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }

/* 弹窗样式 */
.dialog-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 10px 20px;
  padding: 10px 16px;
  background: #eef6ff;
  border: 1px solid #d4e5ff;
  border-radius: 2px;
  font-size: 13px;
  color: #3b5bdb;
}

.dialog-tip i {
  font-size: 16px;
  color: #3b5bdb;
  flex-shrink: 0;
}

.add-form {
  padding: 12px 24px 20px;
}

:deep(.el-dialog__header) {
  padding: 14px 24px 6px;
}

:deep(.el-dialog__body) {
  padding: 0;
}

:deep(.el-dialog__footer) {
  padding: 8px 24px 16px;
}

.form-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  padding-bottom: 10px;
  margin-bottom: 18px;
  border-bottom: 1px solid #ebeef5;
}

.review-info-box {
  margin: 0 20px 10px;
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 4px;
}

/* 键值对网格 */
.detail-kv {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 6px 40px;
}

.kv-item {
  display: flex;
  align-items: baseline;
  font-size: 14px;
  line-height: 2;
}

.kv-item.full {
  grid-column: 1 / -1;
}

.kv-item label {
  color: #8c8c8c;
  width: 80px;
  flex-shrink: 0;
  font-weight: 400;
  white-space: nowrap;
}

.kv-item span {
  color: #262626;
  word-break: break-all;
  font-weight: 400;
  font-size: 14px;
  min-width: 0;
}

.dialog-footer {
  text-align: right;
}
</style>
