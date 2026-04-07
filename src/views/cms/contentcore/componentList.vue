<template>
  <div class="cms-content-list">
    <!-- 操作按钮 -->
    <el-row :gutter="24" class="mb12">
      <el-col :span="12">
        <el-row :gutter="10">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              plain
              @click="handleAdd"
              >{{ $t("Common.Add") }}
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              plain
              :disabled="single"
              @click="handleEdit()"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              plain
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              >{{ $t("Common.Delete") }}
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              plain
              type="success"
              icon="el-icon-s-promotion"
              size="mini"
              :disabled="multiple"
              @click="handlePublish"
              >发布
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              plain
              type="warning"
              icon="el-icon-download"
              size="mini"
              :disabled="multiple"
              @click="handleOffline"
              >下线
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-refresh"
              size="mini"
              plain
              @click="handleSyncData"
              >同步数据<span class="el-icon-question" style="margin-left:4px" v-tooltip="{content: '点击手动从应用管理系统拉取最新组件数据'}"></span>
            </el-button>
          </el-col>
        </el-row>
      </el-col>
      <!-- 筛选条件 -->
      <el-col :span="12">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          class="el-form-search"
          style="text-align: right"
          :inline="true"
        >
          <el-form-item prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入组件名称"
              clearable
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item prop="cover">
            <el-select
              v-model="queryParams.cover"
              placeholder="请选择开放范围"
              clearable
              style="width: 150px"
            >
              <el-option
                v-for="item in coverOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择状态"
              clearable
              style="width: 110px"
            >
              <el-option label="草稿" value="10" />
              <el-option label="发布" value="20" />
              <el-option label="下线" value="30" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="handleQuery"
                >搜索</el-button
              >
              <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
            </el-button-group>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      ref="tableComponentList"
      size="small"
      :data="componentList"
      :height="tableHeight"
      :max-height="tableMaxHeight"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column
        label="能力组件名称"
        :show-overflow-tooltip="true"
        min-width="180"
      >
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
        label="能力组件ID"
        width="140"
        align="center"
        prop="componentId"
      >
        <template slot-scope="scope">
          {{ scope.row.componentId }}
        </template>
      </el-table-column>
      <el-table-column
        label="组件描述"
        :show-overflow-tooltip="true"
        min-width="250"
        prop="description"
      >
        <template slot-scope="scope">
          {{ scope.row.description || '无' }}
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        width="80"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 20 ? 'success' : scope.row.status === 30 ? 'danger' : 'info'">
            {{ scope.row.status === 10 ? '草稿' : scope.row.status === 20 ? '发布' : scope.row.status === 30 ? '下线' : '未知' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="组件服务商"
        :show-overflow-tooltip="true"
        min-width="150"
        prop="serviceProviderName"
      >
        <template slot-scope="scope">
          {{ scope.row.serviceProviderName || '未设置' }}
        </template>
      </el-table-column>
      <el-table-column
        label="云服务商"
        :show-overflow-tooltip="true"
        min-width="120"
        prop="deployServiceProviderView"
      >
        <template slot-scope="scope">
          {{ scope.row.deployServiceProviderView || '未设置' }}
        </template>
      </el-table-column>
      <el-table-column
        label="开放范围"
        width="120"
        align="center"
        prop="coverView"
      >
        <template slot-scope="scope">
          {{ scope.row.coverView || '未设置' }}
        </template>
      </el-table-column>
      <el-table-column label="平台评价" width="100">
        <template slot-scope="scope">
          <span @click="openRatingDialog(scope.row)" class="rating-star">{{ scope.row.platformRating || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用评价" width="100">
        <template slot-scope="scope">
          <span @click="openRatingDialog(scope.row)" class="rating-star">{{ scope.row.usageRating || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <span class="btn-cell-wrap">
            <el-button
              size="small"
              type="text"
              icon="el-icon-view"
              @click.stop="handleDetail(scope.row)"
              >详情</el-button
            >
          </span>
          <span class="btn-cell-wrap">
            <el-button
              size="small"
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
              >修改</el-button
            >
          </span>
          <span class="btn-cell-wrap">
            <el-button
              size="small"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="loadComponentList"
    />

    <!-- 新增弹窗 -->
    <el-dialog
      title="新增能力组件"
      width="900px"
      :visible.sync="addDialogVisible"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="130px">
        <!-- 基本信息 -->
        <el-form-item>
          <p class="fz-16 mt--8">基本信息</p>
        </el-form-item>
        <el-form-item label="组件名称" prop="name" required>
          <el-input v-model="addForm.name" placeholder="请输入组件名称" />
        </el-form-item>
        <el-form-item label="上传LOGO">
          <div class="upload-logo">
            <el-upload
              class="el-upload--text"
              action="#"
              :auto-upload="false"
              :on-change="handleLogoUpload"
              :limit="1"
              :accept="'image/png,image/jpeg,image/jpg,image/bmp'"
            >
              <div class="el-upload-dragger">
                <i class="el-icon-upload" v-if="!addForm.logo"></i>
                <img v-else :src="addForm.logo" class="avatar" />
                <div class="el-upload__text">
                  建议上传图片尺寸为640*640，大小不超过1M支持jpg、jpeg、png、bmp图片格式
                </div>
              </div>
            </el-upload>
            <div class="el-upload__tip">
              只能上传 image/png, image/jpeg,image/jpg,image/bmp 文件，且不超过 1 MB
            </div>
          </div>
        </el-form-item>
        <el-form-item label="组件描述" prop="description" required>
          <el-input
            v-model="addForm.description"
            type="textarea"
            rows="4"
            placeholder="请输入组件描述"
          />
        </el-form-item>
        <el-form-item label="显示顺序">
          <el-input-number
            v-model="addForm.sortOrder"
            :min="0"
            controls-position="right"
          />
        </el-form-item>

        <!-- 联系信息 -->
        <el-form-item>
          <p class="fz-16 mt--8">联系信息</p>
        </el-form-item>
        <el-form-item label="服务商名称">
          <el-input v-model="addForm.serviceProviderName" placeholder="请输入服务商名称" />
        </el-form-item>
        <el-form-item label="联系方式1">
          <div style="display: flex; align-items: center;">
            <el-input v-model="addForm.contact1Name" placeholder="请输入联系人姓名" style="width: 200px" />
            <span style="margin: 0 16px;">-</span>
            <el-input v-model="addForm.contact1Phone" placeholder="请输入联系人手机号" style="width: 200px" />
          </div>
        </el-form-item>
        <el-form-item label="联系方式2">
          <div style="display: flex; align-items: center;">
            <el-input v-model="addForm.contact2Name" placeholder="请输入联系人姓名" style="width: 200px" />
            <span style="margin: 0 16px;">-</span>
            <el-input v-model="addForm.contact2Phone" placeholder="请输入联系人手机号" style="width: 200px" />
          </div>
        </el-form-item>

        <!-- 分类标签 -->
        <el-form-item>
          <p class="fz-16 mt--8">分类标签</p>
        </el-form-item>
        <el-form-item label="云服务商" prop="deployServiceProvider" required>
          <el-select v-model="addForm.deployServiceProvider" placeholder="请选择云服务商" style="width: 300px">
            <el-option label="影像云" value="10251" />
            <el-option label="电信云" value="10252" />
            <el-option label="移动云" value="10253" />
            <el-option label="联通云" value="10254" />
            <el-option label="浪潮云" value="10250" />
          </el-select>
        </el-form-item>
        <el-form-item label="开放范围" prop="cover" required>
          <el-select v-model="addForm.cover" placeholder="请选择开放范围" style="width: 300px">
            <el-option label="不限" value="10256" />
            <el-option label="市级" value="10257" />
            <el-option label="区（县）域" value="10258" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAddSubmit">保存草稿</el-button>
        <el-button @click="addDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog
      title="详情"
      width="800px"
      :visible.sync="detailDialogVisible"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="dialog-body">
        <!-- 基本信息 -->
        <p class="fz-16 mt--8">基本信息</p>
        <div class="gird">
          <div class="content">
            <span>组件名称</span>
            <span>{{ detailForm.name || '--' }}</span>
          </div>
          <div class="content">
            <span class="pr-16">LOGO</span>
            <img v-if="detailForm.logo" :src="detailForm.logo" class="img" />
            <span v-else>--</span>
          </div>
          <div class="content">
            <span>显示顺序</span>
            <span>{{ detailForm.sortOrder || 0 }}</span>
          </div>
        </div>
        <div class="content pt-24">
          <span>组件描述</span>
          <span>{{ detailForm.description || '--' }}</span>
        </div>

        <!-- 联系信息 -->
        <p class="pt-24 fz-16">联系信息</p>
        <div class="gird">
          <div class="content">
            <span>服务商名称</span>
            <span>{{ detailForm.serviceProviderName || '--' }}</span>
          </div>
          <div class="content">
            <span>联系方式1</span>
            <span>{{ detailForm.contact1Name || '--' }} {{ detailForm.contact1Phone || '--' }}</span>
          </div>
          <div class="content">
            <span>联系方式2</span>
            <span>{{ detailForm.contact2Name || '--' }} {{ detailForm.contact2Phone || '--' }}</span>
          </div>
        </div>

        <!-- 分类标签 -->
        <p class="pt-24 fz-16">分类标签</p>
        <div class="gird">
          <div class="content">
            <span>云服务商</span>
            <span>{{ detailForm.deployServiceProviderView || '--' }}</span>
          </div>
          <div class="content">
            <span>开放范围</span>
            <span>{{ detailForm.coverView || '--' }}</span>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 编辑弹窗 -->
    <el-dialog
      title="编辑能力组件"
      width="900px"
      :visible.sync="editDialogVisible"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="130px">
        <!-- 基本信息 -->
        <el-form-item>
          <p class="fz-16 mt--8">基本信息</p>
        </el-form-item>
        <el-form-item label="组件名称" prop="name" required>
          <el-input v-model="editForm.name" placeholder="请输入组件名称" />
        </el-form-item>
        <el-form-item label="上传LOGO">
          <div class="upload-logo">
            <el-upload
              class="el-upload--text"
              action="#"
              :auto-upload="false"
              :on-change="handleLogoUpload"
              :limit="1"
              :accept="'image/png,image/jpeg,image/jpg,image/bmp'"
            >
              <div class="el-upload-dragger">
                <i class="el-icon-upload" v-if="!editForm.logo"></i>
                <img v-else :src="editForm.logo" class="avatar" />
                <div class="el-upload__text">
                  建议上传图片尺寸为640*640，大小不超过1M支持jpg、jpeg、png、bmp图片格式
                </div>
              </div>
            </el-upload>
            <div class="el-upload__tip">
              只能上传 image/png, image/jpeg,image/jpg,image/bmp 文件，且不超过 1 MB
            </div>
          </div>
        </el-form-item>
        <el-form-item label="组件描述" prop="description" required>
          <el-input
            v-model="editForm.description"
            type="textarea"
            rows="4"
            placeholder="请输入组件描述"
          />
        </el-form-item>
        <el-form-item label="显示顺序">
          <el-input-number
            v-model="editForm.sortOrder"
            :min="0"
            controls-position="right"
          />
        </el-form-item>

        <!-- 联系信息 -->
        <el-form-item>
          <p class="fz-16 mt--8">联系信息</p>
        </el-form-item>
        <el-form-item label="服务商名称">
          <el-input v-model="editForm.serviceProviderName" placeholder="请输入服务商名称" />
        </el-form-item>
        <el-form-item label="联系方式1">
          <div style="display: flex; align-items: center;">
            <el-input v-model="editForm.contact1Name" placeholder="请输入联系人姓名" style="width: 200px" />
            <span style="margin: 0 16px;">-</span>
            <el-input v-model="editForm.contact1Phone" placeholder="请输入联系人手机号" style="width: 200px" />
          </div>
        </el-form-item>
        <el-form-item label="联系方式2">
          <div style="display: flex; align-items: center;">
            <el-input v-model="editForm.contact2Name" placeholder="请输入联系人姓名" style="width: 200px" />
            <span style="margin: 0 16px;">-</span>
            <el-input v-model="editForm.contact2Phone" placeholder="请输入联系人手机号" style="width: 200px" />
          </div>
        </el-form-item>

        <!-- 分类标签 -->
        <el-form-item>
          <p class="fz-16 mt--8">分类标签</p>
        </el-form-item>
        <el-form-item label="云服务商" prop="deployServiceProvider" required>
          <el-select v-model="editForm.deployServiceProvider" placeholder="请选择云服务商" style="width: 300px">
            <el-option label="影像云" value="10251" />
            <el-option label="电信云" value="10252" />
            <el-option label="移动云" value="10253" />
            <el-option label="联通云" value="10254" />
            <el-option label="浪潮云" value="10250" />
          </el-select>
        </el-form-item>
        <el-form-item label="开放范围" prop="cover" required>
          <el-select v-model="editForm.cover" placeholder="请选择开放范围" style="width: 300px">
            <el-option label="不限" value="10256" />
            <el-option label="市级" value="10257" />
            <el-option label="区（县）域" value="10258" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleEditSubmit">保存草稿</el-button>
        <el-button @click="editDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 评分弹窗 -->
    <el-dialog
      title="组件评价"
      width="800px"
      :visible.sync="ratingDialogVisible"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="rating-dialog-content">
        <el-tabs v-model="activeTab" class="rating-tabs">
          <el-tab-pane label="平台评价">
            <div class="rating-form">
              <el-form ref="ratingForm" :model="ratingForm" label-width="80px">
                <el-form-item label="评分">
                  <div class="stars">
                    <span v-for="i in 5" :key="i" class="star" :class="{ full: i <= ratingForm.score }" @click="ratingForm.score = i">★</span>
                  </div>
                  <span class="score-text">{{ ratingForm.score }}分</span>
                </el-form-item>
                <el-form-item label="评价描述">
                  <el-input v-model="ratingForm.description" type="textarea" rows="4" placeholder="请输入评价描述" class="description-input" />
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="使用评价列表">
            <el-table :data="usageRatings" style="width: 100%" :header-cell-style="{background:'#f5f7fa'}" class-name="small-padding fixed-width">
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
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="activeTab === '0'" type="primary" @click="handleRatingSubmit">提交</el-button>
        <el-button @click="ratingDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getComponentList, delComponent, publishComponent, offlineComponent } from "@/api/contentcore/component";

export default {
  name: "CMSComponentList",
  data() {
    return {
      // 遮罩层
      loading: false,
      // 开放范围选项
      coverOptions: [
        { value: '不限', label: '不限' },
        { value: '市级', label: '市级' },
        { value: '区（县）域', label: '区（县）域' }
      ],
      componentList: null,
      total: 0,
      tableHeight: 600, // 表格高度
      tableMaxHeight: 600, // 表格最大高度
      selectedRows: [], // 表格选中行
      single: true,
      multiple: true,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        cover: undefined,
        status: undefined,
      },
      // 新增弹窗
      addDialogVisible: false,
      addForm: {
        name: '',
        logo: '',
        description: '',
        sortOrder: 0,
        serviceProviderName: '',
        contact1Name: '',
        contact1Phone: '',
        contact2Name: '',
        contact2Phone: '',
        deployServiceProvider: '',
        cover: ''
      },
      // 编辑弹窗
      editDialogVisible: false,
      editForm: {
        componentId: '',
        name: '',
        logo: '',
        description: '',
        sortOrder: 0,
        serviceProviderName: '',
        contact1Name: '',
        contact1Phone: '',
        contact2Name: '',
        contact2Phone: '',
        deployServiceProvider: '',
        cover: ''
      },
      // 详情弹窗
      detailDialogVisible: false,
      detailForm: {
        name: '',
        logo: '',
        description: '',
        sortOrder: 0,
        serviceProviderName: '',
        contact1Name: '',
        contact1Phone: '',
        contact2Name: '',
        contact2Phone: '',
        deployServiceProviderView: '',
        coverView: ''
      },
      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入组件名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入组件描述', trigger: 'blur' }
        ],
        deployServiceProvider: [
          { required: true, message: '请选择云服务商', trigger: 'change' }
        ],
        cover: [
          { required: true, message: '请选择开放范围', trigger: 'change' }
        ]
      },
      // 评分弹窗
      ratingDialogVisible: false,
      activeTab: '0', // 0: 平台评价, 1: 使用评价列表
      ratingForm: {
        score: 0,
        description: ''
      },
      usageRatings: [],
      currentComponent: null,
    };
  },
  created() {
    this.changeTableHeight();
    this.loadComponentList();
  },
  methods: {
    loadComponentList() {
      this.loading = true;
      getComponentList(this.queryParams).then((response) => {
        this.componentList = response.data.rows.map(item => {
          // 为每个组件添加随机的五分制评分
          return {
            ...item,
            platformRating: parseFloat((Math.random() * 4 + 1).toFixed(1)), // 1-5分，保留一位小数
            usageRating: parseFloat((Math.random() * 4 + 1).toFixed(1)) // 1-5分，保留一位小数
          };
        });
        this.total = parseInt(response.data.total);
        this.loading = false;
      });
    },
    handleSelectionChange(selection) {
      this.selectedRows = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    handleRowClick(currentRow) {
      // 不执行任何操作
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.loadComponentList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleAdd() {
      this.addDialogVisible = true;
    },
    handleLogoUpload(file) {
      console.log('上传的文件:', file);
      this.addForm.logo = URL.createObjectURL(file.raw);
    },
    handleAddSubmit() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          console.log('表单数据:', this.addForm);
          this.$modal.msgSuccess('保存成功');
          this.addDialogVisible = false;
          this.resetForm('addForm');
          this.loadComponentList();
        }
      });
    },
    handleDetail(row) {
      this.detailForm = { ...row };
      this.detailDialogVisible = true;
    },
    handleEdit(row) {
      if (row && row.componentId) {
        this.editForm = { ...row };
      } else if (this.selectedRows.length === 1) {
        this.editForm = { ...this.selectedRows[0] };
      } else {
        this.$modal.msgWarning('请选择一条记录');
        return;
      }
      this.editDialogVisible = true;
    },
    handleEditSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          console.log('表单数据:', this.editForm);
          this.$modal.msgSuccess('保存成功');
          this.editDialogVisible = false;
          this.loadComponentList();
        }
      });
    },
    handleDelete(row) {
      const componentIds = row.componentId
        ? [row.componentId]
        : this.selectedRows.map((row) => row.componentId);
      this.$modal
        .confirm("是否确认删除？")
        .then(function () {
          return delComponent(componentIds);
        })
        .then(() => {
          this.loadComponentList();
          this.$modal.msgSuccess(this.$t("Common.DeleteSuccess"));
        })
        .catch(function () {});
    },
    handlePublish(row) {
      const componentIds = row.componentId
        ? [row.componentId]
        : this.selectedRows.map((row) => row.componentId);
      if (componentIds.length == 0) {
        this.$modal.msgWarning('请选择要发布的记录');
        return;
      }
      this.$modal
        .confirm("发布后将在门户网站上显示，是否确认发布？")
        .then(() => {
          publishComponent(componentIds).then((response) => {
            this.$modal.msgSuccess('发布成功');
            this.loadComponentList();
          });
        });
    },
    handleOffline(row) {
      const componentIds = row.componentId
        ? [row.componentId]
        : this.selectedRows.map((row) => row.componentId);
      if (componentIds.length == 0) {
        this.$modal.msgWarning('请选择要下线的记录');
        return;
      }
      this.$modal
        .confirm("下线后将在门户网站上隐藏，是否确认下线？")
        .then(() => {
          offlineComponent(componentIds).then((response) => {
            this.$modal.msgSuccess('下线成功');
            this.loadComponentList();
          });
        });
    },
    changeTableHeight() {
      let height = document.body.offsetHeight;
      this.tableHeight = height - 330;
      this.tableMaxHeight = this.tableHeight;
    },
    handleSyncData() {
      // 同步数据逻辑
      this.$modal.loading('同步中...');
      // 模拟同步过程
      setTimeout(() => {
        this.$modal.closeLoading();
        this.$modal.msgSuccess('同步成功');
        this.loadComponentList();
      }, 1500);
    },
    openRatingDialog(row) {
      this.currentComponent = row;
      this.activeTab = '0';
      this.ratingForm.score = row.platformRating || 0;
      this.ratingForm.description = '';
      // 模拟使用评价数据，与服务评价列表字段一致
      this.usageRatings = [
        {
          id: 1,
          score: 5,
          serviceName: row.name || '能力组件',
          orderNo: '#ORD-2024-0085',
          orgName: '华能数智科技集团',
          userName: '张三',
          department: '技术部',
          content: '组件功能强大，使用简单，非常满意。',
          time: '2024-03-15 10:30',
          status: '已回复',
          reply: '感谢您的好评，我们会继续努力提供更好的组件！'
        },
        {
          id: 2,
          score: 4,
          serviceName: row.name || '能力组件',
          orderNo: '#ORD-2024-0071',
          orgName: '中远云科技有限公司',
          userName: '王总',
          department: '信息部',
          content: '组件性能稳定，文档完善，值得推荐。',
          time: '2024-03-14 14:20',
          status: '已回复',
          reply: '感谢您的反馈，我们会不断优化组件性能。'
        },
        {
          id: 3,
          score: 3,
          serviceName: row.name || '能力组件',
          orderNo: '#ORD-2024-0083',
          orgName: '北京协和医学院',
          userName: '李护士长',
          department: '信息科',
          content: '组件功能基本满足需求，但配置稍显复杂。',
          time: '2024-03-13 16:45',
          status: '待回复'
        }
      ];
      this.ratingDialogVisible = true;
    },
    handleRatingSubmit() {
      // 提交平台评价
      this.$modal.msgSuccess('评价成功');
      this.ratingDialogVisible = false;
      // 模拟更新评分
      this.currentComponent.platformRating = this.ratingForm.score;
    },
    getStatusTagType(status) {
      switch (status) {
        case '待回复':
          return 'warning';
        case '已回复':
          return 'success';
        default:
          return '';
      }
    },

  },
};
</script>
<style scoped>
.cms-content-list .head-container .el-select .el-input {
  width: 110px;
}
.cms-content-list .el-divider {
  margin-top: 10px;
}
.cms-content-list .el-tabs__header {
  margin-bottom: 10px;
}
.cms-content-list .pagination-container {
  height: 30px;
}
.cms-content-list .row-more-btn {
  padding-left: 10px;
}
.cms-content-list .top-icon {
  font-weight: bold;
  font-size: 12px;
  color: green;
}
.cms-content-list .content_attr {
  margin-left: 2px;
}

/* 上传LOGO样式 */
.upload-logo {
  margin-top: 10px;
}
.upload-area {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
  margin-bottom: 10px;
}
.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.upload-content .el-icon {
  font-size: 48px;
  color: #409EFF;
  margin-bottom: 10px;
}
.upload-content .avatar {
  width: 120px;
  height: 120px;
  border-radius: 6px;
  margin-bottom: 10px;
}
.upload-text {
  font-size: 14px;
  color: #909399;
  line-height: 1.5;
}
.upload-tip {
  font-size: 12px;
  color: #909399;
  text-align: center;
  margin: 0;
}

/* 弹窗样式 */
.el-dialog__body {
  max-height: 600px;
  overflow-y: auto;
}

/* 详情弹窗样式 */
.fz-16 {
  font-size: 16px;
  font-weight: bold;
}
.mt--8 {
  margin-top: -8px;
}
.pt-24 {
  padding-top: 24px;
}
.pr-16 {
  padding-right: 16px;
}
.gird {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.content {
  display: flex;
  width: 50%;
  margin-bottom: 16px;
}
.content span:first-child {
  width: 100px;
  color: #666;
}
.content span:last-child {
  flex: 1;
  color: #333;
}
.img {
  width: 60px;
  height: 60px;
  border-radius: 4px;
}

/* 评分样式 */
.rating-star {
  color: #409EFF;
  cursor: pointer;
  font-weight: bold;
}

.rating-star:hover {
  text-decoration: underline;
}

/* 评分弹窗样式 */
.rating-dialog-content {
  padding: 16px;
}

.rating-tabs {
  margin-bottom: 20px;
}

.rating-tabs .el-tabs__header {
  margin-bottom: 20px;
}

.rating-tabs .el-tabs__nav {
  border-bottom: 1px solid #f0f0f0;
}

.rating-tabs .el-tabs__item {
  padding: 10px 20px;
  font-size: 14px;
  color: #606266;
}

.rating-tabs .el-tabs__item.is-active {
  color: #1890ff;
  font-weight: 500;
}

.rating-tabs .el-tabs__active-bar {
  background-color: #1890ff;
  height: 2px;
}

/* 评分表单样式 */
.rating-form {
  background: #fff;
  padding: 20px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.stars {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}

.star {
  font-size: 24px;
  color: #d9d9d9;
  cursor: pointer;
  transition: all 0.3s ease;
}

.star:hover {
  color: #faad14;
  transform: scale(1.1);
}

.star.full {
  color: #faad14;
}

.score-text {
  font-size: 16px;
  font-weight: 500;
  color: #1890ff;
  margin-left: 12px;
}

.description-input {
  width: 100%;
  border-radius: 4px;
}

.description-input textarea {
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
}

/* 评价内容样式 */
.review-content {
  font-size: 12px;
  color: #5c6480;
  line-height: 1.5;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 表格样式 */
.rating-tabs .el-table {
  border-radius: 6px;
  overflow: hidden;
}

.rating-tabs .el-table th {
  font-weight: 500;
  color: #606266;
}

.rating-tabs .el-table td {
  font-size: 13px;
  color: #303133;
}

/* 弹窗底部样式 */
.dialog-footer {
  text-align: right;
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
  margin-top: 0;
}

.dialog-footer .el-button {
  margin-left: 8px;
}
</style>
