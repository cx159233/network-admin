<template>
  <div class="app-container">
    <!-- 操作按钮 + 筛选条件 -->
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
            >新增</el-button>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          class="el-form-search"
          style="text-align: right"
          :inline="true"
        >
          <el-form-item prop="title">
            <el-input
              v-model="queryParams.title"
              placeholder="请输入应用名称"
              clearable
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item prop="cover">
            <el-select
              v-model="queryParams.cover"
              placeholder="请选择应用覆盖范围"
              clearable
              style="width: 150px"
            >
              <el-option
                v-for="item in appScopeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="target">
            <el-select
              v-model="queryParams.target"
              placeholder="请选择面向对象"
              clearable
              style="width: 150px"
            >
              <el-option
                v-for="item in targetObjectOptions"
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
              <el-option label="草稿" value="draft" />
              <el-option label="待审核" value="pending_review" />
              <el-option label="已发布" value="published" />
              <el-option label="已驳回" value="rejected" />
              <el-option label="已下线" value="offline" />
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
      :data="appList"
      ref="tableAppList"
      size="small"
      style="width: 100%"
      class-name="small-padding fixed-width"
    >
      <el-table-column label="应用名称" :show-overflow-tooltip="true" min-width="180">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="应用ID" width="120" align="center" prop="appId">
        <template slot-scope="scope">
          {{ scope.row.appId || scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="面向对象" width="120" align="center" prop="targetObject">
        <template slot-scope="scope">
          {{ scope.row.targetObject || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="应用覆盖范围" width="200" align="center" prop="appScope">
        <template slot-scope="scope">
          {{ scope.row.cover ? scope.row.cover.map(item => item.value).join(';') : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="80">
        <template slot-scope="scope">
          <el-tag :type="getStatusTag(scope.row.status)" size="small">{{ getStatusText(scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="应用服务商" :show-overflow-tooltip="true" min-width="150" prop="serviceProvider">
        <template slot-scope="scope">
          {{ scope.row.serviceProvider || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="合作企业" :show-overflow-tooltip="true" min-width="150" prop="cooperativeEnterprise">
        <template slot-scope="scope">
          {{ scope.row.cooperativeEnterprise || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="云服务商" :show-overflow-tooltip="true" min-width="150" prop="cloudProvider">
        <template slot-scope="scope">
          {{ scope.row.cloudProvider || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="平台评价" width="90" align="center">
        <template slot-scope="scope">
          <span class="rating-star" @click="goToDetail(scope.row)">{{ scope.row.platformRating || 0 }}分</span>
        </template>
      </el-table-column>
      <el-table-column label="用户评价" width="90" align="center">
        <template slot-scope="scope">
          <span class="rating-star" @click="goToDetail(scope.row)">{{ scope.row.usageRating || 0 }}分</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="260" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <span class="btn-cell-wrap">
            <el-button size="small" type="text" icon="el-icon-view" @click.stop="goToDetail(scope.row)">详情</el-button>
          </span>
          <span class="btn-cell-wrap" v-if="scope.row.status !== 'pending_review' && scope.row.status !== 20">
            <el-button size="small" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
          </span>
          <span class="btn-cell-wrap" v-if="scope.row.status !== 'pending_review' && scope.row.status !== 20">
            <el-button size="small" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="loadAppList"
    />

    <!-- 新增数字应用弹窗 -->
    <el-dialog
      title="新增数字应用"
      width="920px"
      :visible.sync="addDialogVisible"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      top="5vh"
    >
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="130px" class="add-form">
        <div class="form-section">
          <div class="form-section-title">基本信息</div>
        <el-form-item label="应用名称" prop="title" required>
          <el-input v-model="addForm.title" placeholder="请输入应用名称" />
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
        <el-form-item label="应用描述" prop="description" required>
          <el-input
            v-model="addForm.description"
            type="textarea"
            rows="4"
            placeholder="请输入应用描述"
          />
        </el-form-item>
        <el-form-item label="系统地址">
          <el-input v-model="addForm.systemUrl" placeholder="请输入系统地址" />
        </el-form-item>
        </div>

        <div class="form-section">
          <div class="form-section-title">联系信息</div>
        <el-form-item label="服务商名称" prop="serviceProvider" required>
          <el-input v-model="addForm.serviceProvider" placeholder="请输入服务商名称" />
        </el-form-item>
        <el-form-item label="合作伙伴名称">
          <el-input v-model="addForm.cooperativeEnterprise" placeholder="请输入合作伙伴全称，多个合作伙伴请通过；分隔" />
        </el-form-item>
        <el-form-item label="联系方式1" required>
          <div style="display: flex; align-items: center;">
            <el-input v-model="addForm.contactName1" placeholder="请输入联系人姓名" style="width: 200px" />
            <span style="margin: 0 16px;">-</span>
            <el-input v-model="addForm.contactPhone1" placeholder="请输入联系人手机号" style="width: 200px" />
          </div>
        </el-form-item>
        <el-form-item label="联系方式2">
          <div style="display: flex; align-items: center;">
            <el-input v-model="addForm.contactName2" placeholder="请输入联系人姓名" style="width: 200px" />
            <span style="margin: 0 16px;">-</span>
            <el-input v-model="addForm.contactPhone2" placeholder="请输入联系人手机号" style="width: 200px" />
          </div>
        </el-form-item>
        </div>

        <div class="form-section">
          <div class="form-section-title">分类标签</div>
        <el-form-item label="面向对象" prop="targetObject" required>
          <el-checkbox-group v-model="addForm.targetObject">
            <el-checkbox label="基层医疗卫生机构">基层医疗卫生机构</el-checkbox>
            <el-checkbox label="公立医院">公立医院</el-checkbox>
            <el-checkbox label="医技护人员">医技护人员</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="应用架构">
          <el-checkbox-group v-model="addForm.appArchitecture">
            <el-checkbox label="B/S">B/S</el-checkbox>
            <el-checkbox label="C/S架构">C/S架构</el-checkbox>
            <el-checkbox label="B/S+C/S">B/S+C/S</el-checkbox>
            <el-checkbox label="单机">单机</el-checkbox>
            <el-checkbox label="其他">其他</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="部署云服务商" prop="cloudProvider" required>
          <div>
            <el-checkbox-group v-model="addForm.cloudProvider">
              <el-checkbox label="电信云">电信云</el-checkbox>
              <el-checkbox label="移动云">移动云</el-checkbox>
              <el-checkbox label="联通云">联通云</el-checkbox>
              <el-checkbox label="浪潮云">浪潮云</el-checkbox>
              <el-checkbox label="紫光云">紫光云</el-checkbox>
              <el-checkbox label="影像云">影像云</el-checkbox>
            </el-checkbox-group>
            <div v-if="addForm.targetObject.includes('基层医疗卫生机构')" style="margin-top:12px">
              <div style="font-weight:500;margin-bottom:6px;color:#606266;font-size:13px">基层应用覆盖范围</div>
              <el-checkbox-group v-model="addForm.coverBase">
                <el-checkbox v-for="item in coverBaseOptions" :key="item" :label="item">{{ item }}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div v-if="addForm.targetObject.includes('公立医院')" style="margin-top:12px">
              <div style="font-weight:500;margin-bottom:6px;color:#606266;font-size:13px">公立应用覆盖范围</div>
              <el-checkbox-group v-model="addForm.coverPublic">
                <el-checkbox v-for="item in coverPublicOptions" :key="item" :label="item">{{ item }}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div v-if="addForm.targetObject.includes('医技护人员')" style="margin-top:12px">
              <div style="font-weight:500;margin-bottom:6px;color:#606266;font-size:13px">医技应用覆盖范围</div>
              <el-checkbox-group v-model="addForm.coverTech">
                <el-checkbox v-for="item in coverTechOptions" :key="item" :label="item">{{ item }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleAddSubmit('draft')">保存草稿</el-button>
        <el-button type="primary" @click="handleAddSubmit('pending_review')">提交审核</el-button>
      </div>
    </el-dialog>

    <!-- 修改数字应用弹窗 -->
    <el-dialog
      title="编辑数字应用"
      width="920px"
      :visible.sync="editDialogVisible"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      top="5vh"
    >
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="130px" class="add-form">
        <div class="form-section">
          <div class="form-section-title">基本信息</div>
        <el-form-item label="应用名称" prop="title" required>
          <el-input v-model="editForm.title" placeholder="请输入应用名称" />
        </el-form-item>
        <el-form-item label="上传LOGO">
          <div class="upload-logo">
            <el-upload
              class="el-upload--text"
              action="#"
              :auto-upload="false"
              :on-change="handleEditLogoUpload"
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
        <el-form-item label="应用描述" prop="description" required>
          <el-input
            v-model="editForm.description"
            type="textarea"
            rows="4"
            placeholder="请输入应用描述"
          />
        </el-form-item>
        <el-form-item label="系统地址">
          <el-input v-model="editForm.systemUrl" placeholder="请输入系统地址" />
        </el-form-item>
        </div>

        <div class="form-section">
          <div class="form-section-title">联系信息</div>
        <el-form-item label="服务商名称" prop="serviceProvider" required>
          <el-input v-model="editForm.serviceProvider" placeholder="请输入服务商名称" />
        </el-form-item>
        <el-form-item label="合作伙伴名称">
          <el-input v-model="editForm.cooperativeEnterprise" placeholder="请输入合作伙伴全称，多个合作伙伴请通过；分隔" />
        </el-form-item>
        <el-form-item label="联系方式1" required>
          <div style="display: flex; align-items: center;">
            <el-input v-model="editForm.contactName1" placeholder="请输入联系人姓名" style="width: 200px" />
            <span style="margin: 0 16px;">-</span>
            <el-input v-model="editForm.contactPhone1" placeholder="请输入联系人手机号" style="width: 200px" />
          </div>
        </el-form-item>
        <el-form-item label="联系方式2">
          <div style="display: flex; align-items: center;">
            <el-input v-model="editForm.contactName2" placeholder="请输入联系人姓名" style="width: 200px" />
            <span style="margin: 0 16px;">-</span>
            <el-input v-model="editForm.contactPhone2" placeholder="请输入联系人手机号" style="width: 200px" />
          </div>
        </el-form-item>
        </div>

        <div class="form-section">
          <div class="form-section-title">分类标签</div>
        <el-form-item label="面向对象" prop="targetObject" required>
          <el-checkbox-group v-model="editForm.targetObject">
            <el-checkbox label="基层医疗卫生机构">基层医疗卫生机构</el-checkbox>
            <el-checkbox label="公立医院">公立医院</el-checkbox>
            <el-checkbox label="医技护人员">医技护人员</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="应用架构">
          <el-checkbox-group v-model="editForm.appArchitecture">
            <el-checkbox label="B/S">B/S</el-checkbox>
            <el-checkbox label="C/S架构">C/S架构</el-checkbox>
            <el-checkbox label="B/S+C/S">B/S+C/S</el-checkbox>
            <el-checkbox label="单机">单机</el-checkbox>
            <el-checkbox label="其他">其他</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="部署云服务商" prop="cloudProvider" required>
          <div>
            <el-checkbox-group v-model="editForm.cloudProvider">
              <el-checkbox label="电信云">电信云</el-checkbox>
              <el-checkbox label="移动云">移动云</el-checkbox>
              <el-checkbox label="联通云">联通云</el-checkbox>
              <el-checkbox label="浪潮云">浪潮云</el-checkbox>
              <el-checkbox label="紫光云">紫光云</el-checkbox>
              <el-checkbox label="影像云">影像云</el-checkbox>
            </el-checkbox-group>
            <div v-if="editForm.targetObject.includes('基层医疗卫生机构')" style="margin-top:12px">
              <div style="font-weight:500;margin-bottom:6px;color:#606266;font-size:13px">基层应用覆盖范围</div>
              <el-checkbox-group v-model="editForm.coverBase">
                <el-checkbox v-for="item in coverBaseOptions" :key="item" :label="item">{{ item }}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div v-if="editForm.targetObject.includes('公立医院')" style="margin-top:12px">
              <div style="font-weight:500;margin-bottom:6px;color:#606266;font-size:13px">公立应用覆盖范围</div>
              <el-checkbox-group v-model="editForm.coverPublic">
                <el-checkbox v-for="item in coverPublicOptions" :key="item" :label="item">{{ item }}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div v-if="editForm.targetObject.includes('医技护人员')" style="margin-top:12px">
              <div style="font-weight:500;margin-bottom:6px;color:#606266;font-size:13px">医技应用覆盖范围</div>
              <el-checkbox-group v-model="editForm.coverTech">
                <el-checkbox v-for="item in coverTechOptions" :key="item" :label="item">{{ item }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleEditSubmit('draft')">保存草稿</el-button>
        <el-button type="primary" @click="handleEditSubmit('pending_review')">提交审核</el-button>
      </div>
    </el-dialog>

    <!-- 删除确认弹窗 -->
    <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="420px" :modal-append-to-body="false" :close-on-click-modal="false">
      <div style="text-align:center;padding:8px 0 24px">
        <i class="el-icon-warning" style="font-size:48px;color:#f56c6c"></i>
        <p style="margin-top:16px;font-size:14px;color:#606266">是否确认删除该数字应用？删除后不可恢复。</p>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmDelete">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index.vue';
import { getContentList } from "@/api/contentcore/content";

export default {
  name: "OrderMyApps",
  components: {
    Pagination
  },
  data() {
    return {
      loading: false,
      appList: null,
      total: 0,
      appScopeOptions: [
        { value: '医院信息系统（HIS）', label: '医院信息系统（HIS）' },
        { value: '实验室信息管理系统（LIS）', label: '实验室信息管理系统（LIS）' },
        { value: '影像归档和通信系统（PACS）', label: '影像归档和通信系统（PACS）' },
        { value: '心电', label: '心电' },
        { value: '医养结合一体化', label: '医养结合一体化' },
        { value: '智慧管理平台（HRP）', label: '智慧管理平台（HRP）' },
        { value: '药店应用管理', label: '药店应用管理' },
        { value: '智能外呼', label: '智能外呼' },
        { value: '临床专病库', label: '临床专病库' },
        { value: '医共体信息平台', label: '医共体信息平台' },
        { value: '妇幼健康', label: '妇幼健康' },
        { value: '基本公共卫生服务', label: '基本公共卫生服务' },
        { value: '家庭医生签约', label: '家庭医生签约' },
        { value: '村卫生室管理', label: '村卫生室管理' },
        { value: '辅助诊疗', label: '辅助诊疗' },
        { value: '区域综合', label: '区域综合' },
        { value: '基本公共卫生服务绩效评价', label: '基本公共卫生服务绩效评价' }
      ],
      targetObjectOptions: [
        { value: '基层医疗卫生机构', label: '基层医疗卫生机构' },
        { value: '公立医院', label: '公立医院' },
        { value: '医技护人员', label: '医技护人员' }
      ],
      coverBaseOptions: ['基本公共卫生服务', '医院信息系统（HIS）', '实验室信息管理系统（LIS）', '影像归档和通信系统（PACS）', '智慧管理平台（HRP）', '心电', '家庭医生签约', '村卫生室管理', '药店应用管理', '智能外呼', '辅助诊疗', '临床专病库', '区域综合', '基本公共卫生服务绩效评价', '妇幼健康'],
      coverPublicOptions: ['医院信息系统（HIS）', '实验室信息管理系统（LIS）', '影像归档和通信系统（PACS）', '心电', '医养结合一体化', '智慧管理平台（HRP）', '药店应用管理', '智能外呼', '临床专病库', '医共体信息平台', '妇幼健康'],
      coverTechOptions: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        cover: undefined,
        target: undefined,
        status: undefined,
      },
      addDialogVisible: false,
      addForm: {
        title: '',
        logo: '',
        description: '',
        systemUrl: '',
        sortOrder: 0,
        serviceProvider: '',
        cooperativeEnterprise: '',
        contactName1: '',
        contactPhone1: '',
        contactName2: '',
        contactPhone2: '',
        targetObject: [],
        appArchitecture: [],
        cloudProvider: [],
        coverBase: [],
        coverPublic: [],
        coverTech: []
      },
      editDialogVisible: false,
      deleteDialogVisible: false,
      deleteTargetId: null,
      editForm: {
        id: '',
        title: '',
        logo: '',
        description: '',
        systemUrl: '',
        sortOrder: 0,
        serviceProvider: '',
        cooperativeEnterprise: '',
        contactName1: '',
        contactPhone1: '',
        contactName2: '',
        contactPhone2: '',
        targetObject: [],
        appArchitecture: [],
        cloudProvider: [],
        coverBase: [],
        coverPublic: [],
        coverTech: []
      },
      rules: {
        title: [
          { required: true, message: '请输入应用名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入应用描述', trigger: 'blur' }
        ],
        serviceProvider: [
          { required: true, message: '请输入服务商名称', trigger: 'blur' }
        ],
        targetObject: [
          { required: true, message: '请选择面向对象', trigger: 'change' }
        ],
        cloudProvider: [
          { required: true, message: '请选择部署云服务商', trigger: 'change' }
        ]
      }
    };
  },
  created() {
    this.loadAppList();
  },
  watch: {
    addDialogVisible(val) {
      if (val) { this.$root.$emit('set-prd-anchor', 'prd-3.1.1.2'); }
    },
    editDialogVisible(val) {
      if (val) { this.$root.$emit('set-prd-anchor', 'prd-3.1.1.3'); }
    }
  },
  methods: {
    loadAppList() {
      this.loading = true;
      getContentList({
        ...this.queryParams,
        catalogId: '603612031287365',
      }).then((response) => {
        this.appList = response.data.rows.map(item => ({
          ...item,
          platformRating: parseFloat((Math.random() * 4 + 1).toFixed(1)),
          usageRating: parseFloat((Math.random() * 4 + 1).toFixed(1))
        }));
        this.total = parseInt(response.data.total);
        this.loading = false;
      }).catch(() => {
        this.loading = false;
        // 如果API调用失败，使用mock数据
        this.appList = [
          {
            id: '1', title: '智慧医院信息管理系统', appId: 'APP001',
            targetObject: '基层医疗卫生机构',
            cover: [{ value: '门诊管理' }, { value: '住院管理' }, { value: '药房管理' }],
            status: 'published', serviceProvider: '北京健康科技有限公司',
            cooperativeEnterprise: '无', cloudProvider: '浪潮云',
            createTime: '2024-01-15 10:30', platformRating: 4.5, usageRating: 4.3
          },
          {
            id: '2', title: '远程医疗会诊平台', appId: 'APP002',
            targetObject: '公立医院',
            cover: [{ value: '远程会诊' }, { value: '医学影像' }, { value: '专家咨询' }],
            status: 'published', serviceProvider: '上海数字医疗科技有限公司',
            cooperativeEnterprise: '无', cloudProvider: '电信云',
            createTime: '2024-02-20 14:15', platformRating: 4.2, usageRating: 4.6
          },
          {
            id: '3', title: '健康档案管理系统', appId: 'APP003',
            targetObject: '医技护人员',
            cover: [{ value: '电子病历' }, { value: '健康档案' }, { value: '数据分析' }],
            status: 'draft', serviceProvider: '广州智慧健康科技有限公司',
            cooperativeEnterprise: '无', cloudProvider: '移动云',
            createTime: '2024-03-05 09:00', platformRating: 4.8, usageRating: 4.1
          },
          {
            id: '4', title: '医疗设备管理系统', appId: 'APP004',
            targetObject: '基层医疗卫生机构',
            cover: [{ value: '设备管理' }, { value: '维护保养' }, { value: '耗材管理' }],
            status: 'offline', serviceProvider: '深圳医疗信息化有限公司',
            cooperativeEnterprise: '无', cloudProvider: '联通云',
            createTime: '2024-01-10 16:45', platformRating: 4.0, usageRating: 3.9
          },
          {
            id: '5', title: '医学影像处理系统', appId: 'APP005',
            targetObject: '公立医院',
            cover: [{ value: '影像存储' }, { value: '影像分析' }, { value: 'AI辅助诊断' }],
            status: 'pending_review', serviceProvider: '杭州医学影像科技有限公司',
            cooperativeEnterprise: '无', cloudProvider: '影像云',
            createTime: '2024-02-28 11:20', platformRating: 4.6, usageRating: 4.5
          }
        ];
        this.total = this.appList.length;
      });
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.loadAppList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleAdd() {
      this.addForm = {
        title: '',
        logo: '',
        description: '',
        systemUrl: '',
        sortOrder: 0,
        serviceProvider: '',
        cooperativeEnterprise: '',
        contactName1: '',
        contactPhone1: '',
        contactName2: '',
        contactPhone2: '',
        targetObject: [],
        appArchitecture: [],
        cloudProvider: [],
        coverBase: [],
        coverPublic: [],
        coverTech: []
      };
      this.addDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.addForm && this.$refs.addForm.clearValidate();
      });
    },
    handleLogoUpload(file) {
      if (file.size > 1 * 1024 * 1024) {
        this.$modal.msgError('图片大小不能超过1MB');
        return;
      }
      this.addForm.logo = URL.createObjectURL(file.raw);
    },
    handleEditLogoUpload(file) {
      if (file.size > 1 * 1024 * 1024) {
        this.$modal.msgError('图片大小不能超过1MB');
        return;
      }
      this.editForm.logo = URL.createObjectURL(file.raw);
    },
    handleAddSubmit(status) {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          const msg = status === 'draft' ? '草稿已保存' : '已提交审核';
          this.$modal.msgSuccess(msg);
          this.addDialogVisible = false;
          this.loadAppList();
        }
      });
    },
    handlePublish(row) {
      const isOffline = row.status === 'offline' || row.status === 40;
      const msg = isOffline ? '确认重新发布该应用？将重新提交审核。' : '确认发布该应用？将提交审核。';
      this.$modal.confirm(msg).then(() => {
        this.$modal.msgSuccess('已提交审核');
        this.loadAppList();
      }).catch(() => {});
    },
    handleOffline(row) {
      this.$modal.confirm('确认下线应用 ' + row.title + ' 吗？').then(() => {
        this.$modal.msgSuccess('应用已下线');
        this.loadAppList();
      }).catch(() => {});
    },
    handleEdit(row) {
      const data = row;
      if (!data) return;
      this.editForm = {
        id: data.id || data.contentId,
        title: data.title || '',
        logo: data.logo || '',
        description: data.description || '',
        systemUrl: data.systemUrl || '',
        sortOrder: data.sortOrder || 0,
        serviceProvider: data.serviceProvider || '',
        cooperativeEnterprise: data.cooperativeEnterprise || '',
        contactName1: data.contactName1 || '',
        contactPhone1: data.contactPhone1 || '',
        contactName2: data.contactName2 || '',
        contactPhone2: data.contactPhone2 || '',
        targetObject: Array.isArray(data.targetObject) ? data.targetObject : (data.targetObject ? data.targetObject.split('、') : []),
        appArchitecture: data.appArchitecture || [],
        cloudProvider: Array.isArray(data.cloudProvider) ? data.cloudProvider : (data.cloudProvider ? data.cloudProvider.split('、') : []),
        coverBase: Array.isArray(data.coverBase) ? data.coverBase : [],
        coverPublic: Array.isArray(data.coverPublic) ? data.coverPublic : [],
        coverTech: Array.isArray(data.coverTech) ? data.coverTech : []
      };
      this.editDialogVisible = true;
    },
    handleEditSubmit(status) {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          const msg = status === 'draft' ? '草稿已保存' : '已提交审核';
          this.$modal.msgSuccess(msg);
          this.editDialogVisible = false;
          this.loadAppList();
        }
      });
    },
    getStatusTag(status) {
      const map = {
        0: 'info',
        10: 'success',
        20: 'warning',
        30: 'danger',
        40: 'danger',
        'draft': 'info',
        'pending_review': 'warning',
        'published': 'success',
        'rejected': 'danger',
        'offline': 'danger'
      };
      return map[status] || 'info';
    },
    getStatusText(status) {
      const map = {
        0: '草稿',
        10: '已发布',
        20: '待审核',
        30: '已驳回',
        40: '已下线',
        'draft': '草稿',
        'pending_review': '待审核',
        'published': '已发布',
        'rejected': '已驳回',
        'offline': '已下线'
      };
      return map[status] || status;
    },
    handleDelete(row) {
      const id = row.id || row.contentId;
      if (!id) return;
      this.deleteTargetId = id;
      this.$root.$emit('set-prd-anchor', 'prd-3.1.1.5');
      this.deleteDialogVisible = true;
    },
    confirmDelete() {
      this.deleteDialogVisible = false;
      this.$modal.msgSuccess('删除成功');
      this.loadAppList();
    },
    goToDetail(row) {
      this.$router.push({
        path: '/workorder/myAppsDetail',
        query: {
          title: row.title || '--',
          status: row.status || '--',
          serviceProvider: row.serviceProvider || '--',
          systemUrl: row.systemUrl || '--',
          description: row.description || '--',
          deployServiceProviderView: row.cooperativeEnterprise || '--',
          contactName1: row.contactName1 || '--',
          contactPhone1: row.contactPhone1 || '--',
          contactName2: row.contactName2 || '--',
          contactPhone2: row.contactPhone2 || '--',
          targetView: Array.isArray(row.targetObject) ? row.targetObject.join('、') : (row.targetObject || '--'),
          coverView: Array.isArray(row.cover) ? row.cover.map(item => item.value || item).join('、') : (row.appScope || '--'),
          cloudProviderStr: Array.isArray(row.cloudProvider) ? row.cloudProvider.join('、') : (row.cloudProvider || '--'),
          platformRating: row.platformRating || 0,
          usageRating: row.usageRating || 0
        }
      });
    }
  },
};
</script>

<style scoped>
.app-container {
  padding: 20px;
  background-color: #ffffff;
  min-height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.el-form-search {
  margin-bottom: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 0;
}

.el-form-search .el-form-item:last-child {
  margin-right: 0;
}

.el-form-search .el-form-item {
  margin-bottom: 0;
  margin-right: 0;
}

.mb12 {
  margin-bottom: 12px;
}

.rating-star {
  color: #409EFF;
  cursor: pointer;
  font-weight: bold;
}

.rating-star:hover {
  text-decoration: underline;
}

/* 弹窗样式 */
:deep(.el-dialog) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  padding: 14px 24px 6px;
  border-bottom: 1px solid #ebeef5;
  background: #fafbfc;
}

:deep(.el-dialog__title) {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

:deep(.el-dialog__body) {
  padding: 0;
  max-height: 62vh;
  overflow-y: auto;
}

:deep(.el-dialog__footer) {
  padding: 14px 24px;
  border-top: 1px solid #ebeef5;
  background: #fafbfc;
}

.add-form {
  padding: 4px 24px 20px;
}

.form-section {
  margin-bottom: 24px;
}

.form-section:last-child {
  margin-bottom: 0;
}

.form-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-form-item) {
  margin-bottom: 18px;
}

:deep(.el-form-item__label) {
  color: #606266;
  font-weight: 500;
  font-size: 13px;
}

/* 上传LOGO */
.upload-logo .el-upload--text {
  width: 100%;
  border: 0;
}

.upload-logo .el-upload-dragger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;
  min-height: 90px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  padding: 16px;
  background: #fafbfc;
}

.upload-logo .el-upload-dragger:hover {
  border-color: #409EFF;
  background: #ecf5ff;
}

.upload-logo .el-upload-dragger i {
  font-size: 28px;
  color: #8c939d;
}

.upload-logo .el-upload-dragger .avatar {
  width: 56px;
  height: 56px;
  border-radius: 4px;
  object-fit: cover;
}

.upload-logo .el-upload__text {
  font-size: 12px;
  color: #8c939d;
  margin-top: 4px;
  text-align: center;
  line-height: 1.5;
}

.upload-logo .el-upload__tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.5;
}

/* 弹窗仅覆盖左侧Demo区域 */
:deep(.el-dialog__wrapper) {
  position: absolute !important;
}
:deep(.v-modal) {
  position: absolute !important;
}
</style>
