<template>
  <div class="app-container">
    <!-- 统计卡片 -->
    <div class="stats-card mb12">
      <div class="stat-item">
        <div class="stat-value">1,024</div>
        <div class="stat-label">累计评价</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">4.7</div>
        <div class="stat-label">平均评分</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">89%</div>
        <div class="stat-label">好评率</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">6</div>
        <div class="stat-label">待回复差评</div>
      </div>
    </div>

    <!-- 筛选条件 -->
    <el-row :gutter="24" class="mb12">
      <el-col :span="24">
        <el-form
          :model="queryParams"
          size="small"
          class="el-form-search"
          :inline="true"
        >
          <el-form-item prop="keyword">
            <el-input
              v-model="queryParams.keyword"
              placeholder="服务名称、机构名、评价内容"
              clearable
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item prop="service">
            <el-select
              v-model="queryParams.service"
              placeholder="所有服务"
              clearable
              style="width: 150px"
            >
              <el-option label="所有服务" value="" />
              <el-option label="云主机" value="cloud" />
              <el-option label="等保评估" value="security" />
              <el-option label="云防火墙" value="firewall" />
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
      <el-table-column label="服务 / 订单号" min-width="200">
        <template slot-scope="scope">
          <div>
            <div class="review-service">{{ scope.row.serviceName }}</div>
            <div class="review-order">{{ scope.row.orderNo }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="评价机构" min-width="200">
        <template slot-scope="scope">
          <div>
            <div class="review-org">{{ scope.row.orgName }}</div>
            <div class="review-user">{{ scope.row.userName }} · {{ scope.row.department }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="评价内容" min-width="250">
        <template slot-scope="scope">
          <div class="review-content">{{ scope.row.content }}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="90">
        <template slot-scope="scope">
          <el-tag :type="getStatusTagType(scope.row.status)" size="mini">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="130">
        <template slot-scope="scope">
          {{ scope.row.time }}
        </template>
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

    <!-- 查看详情对话框 -->
    <el-dialog title="评价详情" :visible.sync="viewDialogVisible" width="600px">
      <div v-if="currentReview.content" class="review-detail">
        <div class="detail-header">
          <div class="reviewer-info">
            <div class="reviewer-name">{{ currentReview.userName }} · {{ currentReview.department }}</div>
            <div class="reviewer-org">{{ currentReview.orgName }}</div>
          </div>
          <div class="stars">
            <span v-for="i in 5" :key="i" class="star" :class="{ full: i <= currentReview.score }">★</span>
          </div>
        </div>
        <div class="detail-content">{{ currentReview.content }}</div>
        <div v-if="currentReview.reply" class="detail-reply">
          <div class="reply-label">客服回复</div>
          <div class="reply-content">{{ currentReview.reply }}</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 回复对话框 -->
    <el-dialog title="回复评价" :visible.sync="replyDialogVisible" width="600px">
      <div v-if="currentReview.content" class="reply-form">
        <div class="form-section">
          <div class="section-title">原评价</div>
          <div class="detail-header">
            <div class="reviewer-info">
              <div class="reviewer-name">{{ currentReview.userName }} · {{ currentReview.department }}</div>
              <div class="reviewer-org">{{ currentReview.orgName }}</div>
            </div>
            <div class="stars">
              <span v-for="i in 5" :key="i" class="star" :class="{ full: i <= currentReview.score }">★</span>
            </div>
          </div>
          <div class="detail-content">{{ currentReview.content }}</div>
        </div>
        <div class="form-section">
          <div class="section-title">回复内容</div>
          <el-input
            v-model="replyContent"
            type="textarea"
            placeholder="请输入回复内容..."
            :rows="5"
          />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="replyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReply">提交回复</el-button>
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
        keyword: '',
        service: '',
        score: '',
        status: ''
      },
      reviewList: [
        {
          id: 1,
          score: 5,
          serviceName: '云主机（ECS）',
          orderNo: '#ORD-2024-0085',
          orgName: '华能数智科技集团',
          userName: '张三',
          department: '技术部',
          content: '开通非常快，3分钟内到账，配置灵活，稳定性也很好。',
          time: '2024-03-15 10:30',
          status: '已回复',
          reply: '感谢您的好评，我们会继续努力提供更好的服务！'
        },
        {
          id: 2,
          score: 2,
          serviceName: '等保三级合规评估',
          orderNo: '#ORD-2024-0071',
          orgName: '中远云科技有限公司',
          userName: '王总',
          department: '信息部',
          content: '报告交付严重超期，比承诺时间晚了2周，沟通也不及时，影响了我们的申报计划。',
          time: '2024-03-14 14:20',
          status: '待回复'
        },
        {
          id: 3,
          score: 4,
          serviceName: '云防火墙',
          orderNo: '#ORD-2024-0083',
          orgName: '北京协和医学院',
          userName: '李护士长',
          department: '信息科',
          content: '防护效果很好，配置策略专业，扣一星是因为控制台UI稍微复杂了一点。',
          time: '2024-03-13 16:45',
          status: '已回复',
          reply: '感谢您的反馈，我们正在优化控制台UI，预计下月会推出新版本。'
        }
      ],
      viewDialogVisible: false,
      replyDialogVisible: false,
      currentReview: {},
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
        keyword: '',
        service: '',
        score: '',
        status: ''
      }
      this.loadReviewList()
    },
    handleView(row) {
      this.currentReview = JSON.parse(JSON.stringify(row))
      this.viewDialogVisible = true
    },
    handleReply(row) {
      this.currentReview = JSON.parse(JSON.stringify(row))
      this.replyContent = ''
      this.replyDialogVisible = true
    },
    submitReply() {
      if (!this.replyContent) {
        this.$message.warning('请输入回复内容')
        return
      }
      this.currentReview.reply = this.replyContent
      this.currentReview.status = '已回复'
      // 更新列表中的数据
      const index = this.reviewList.findIndex(item => item.id === this.currentReview.id)
      if (index > -1) {
        this.reviewList[index].status = '已回复'
        this.reviewList[index].reply = this.replyContent
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
    }
  }
}
</script>

<style scoped>
/* 容器样式 */
.app-container {
  display: flex;
  flex-direction: column;
}

/* 统计卡片样式 */
.stats-card {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 16px;
  border-radius: 6px;
  background: #fff;
  border: none;
  border-top: 3px solid #1890ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #1890ff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 13px;
  color: #8c8c8c;
  font-weight: 500;
}

.mb12 {
  margin-bottom: 12px;
}

/* El-form 搜索样式 */
:deep(.el-form-search) {
  margin-bottom: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 12px;
  padding: 0;
}

/* 确保按钮组右对齐 */
:deep(.el-form-search .el-form-item:last-child) {
  margin-right: 0;
}

:deep(.el-form-search .el-form-item) {
  margin-bottom: 0;
  margin-right: 0;
}

/* 星级评分 */
.stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 14px;
  color: #d9d9d9;
}

.star.full {
  color: #faad14;
}

/* 表格单元格样式 */
.review-service {
  font-size: 13px;
  font-weight: 500;
  color: #262626;
}

.review-order {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
}

.review-org {
  font-size: 13px;
  font-weight: 500;
  color: #262626;
}

.review-user {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
}

.review-content {
  font-size: 12px;
  color: #5c6480;
  line-height: 1.5;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 对话框样式 */
.review-detail {
  padding: 16px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.reviewer-info {
  flex: 1;
}

.reviewer-name {
  font-size: 13px;
  font-weight: 500;
  color: #1c2033;
}

.reviewer-org {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
}

.detail-content {
  font-size: 13px;
  color: #5c6480;
  line-height: 1.7;
  margin-bottom: 16px;
}

.detail-reply {
  background: #f7f8fa;
  border-left: 3px solid #1890ff;
  padding: 12px;
  border-radius: 4px;
  margin-top: 12px;
}

.reply-label {
  font-size: 11px;
  color: #1890ff;
  font-weight: 600;
  margin-bottom: 6px;
}

.reply-content {
  font-size: 12px;
  color: #5c6480;
  line-height: 1.6;
}

/* 回复表单 */
.reply-form {
  padding: 16px;
}

.form-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: #606266;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.dialog-footer {
  text-align: right;
}
</style>
