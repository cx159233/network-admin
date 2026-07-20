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
              v-hasPermi="[$p('Catalog:EditContent:{0}', [catalogId])]"
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
              v-hasPermi="[$p('Catalog:DeleteContent:{0}', [catalogId])]"
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
              v-hasPermi="[$p('Catalog:EditContent:{0}', [catalogId])]"
              @click="handlePublish"
              >{{ $t("CMS.ContentCore.Publish") }}
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              plain
              type="warning"
              icon="el-icon-download"
              size="mini"
              :disabled="multiple"
              v-hasPermi="[$p('Catalog:EditContent:{0}', [catalogId])]"
              @click="handleOffline"
              >{{ $t("CMS.Content.Offline") }}
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
              <el-option label="已发布" value="10" />
              <el-option label="已下线" value="40" />
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
      ref="tableContentList"
      size="small"
      :data="contentList"
      :height="tableHeight"
      :max-height="tableMaxHeight"
      @row-click="handleRowClick"
      @cell-dblclick="handleEdit"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column
        label="应用名称"
        :show-overflow-tooltip="true"
        min-width="180"
      >
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column
        label="应用ID"
        width="120"
        align="center"
        prop="appId"
      >
        <template slot-scope="scope">
          {{ scope.row.appId || scope.row.contentId }}
        </template>
      </el-table-column>
      <el-table-column
        label="面向对象"
        width="120"
        align="center"
        prop="targetObject"
      >
        <template slot-scope="scope">
          {{ scope.row.targetObject || '--' }}
        </template>
      </el-table-column>
      <el-table-column
        label="应用覆盖范围"
        width="200"
        align="center"
        prop="appScope"
      >
        <template slot-scope="scope">
          {{ scope.row.cover ? scope.row.cover.map(item => item.value).join(';') : '--' }}
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        width="80"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 10 ? 'success' : scope.row.status === 40 ? 'danger' : 'info'">
            {{ scope.row.status === 10 ? '已发布' : scope.row.status === 40 ? '已下线' : '未知' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="应用服务商"
        :show-overflow-tooltip="true"
        min-width="150"
        prop="serviceProvider"
      >
        <template slot-scope="scope">
          {{ scope.row.serviceProvider || '--' }}
        </template>
      </el-table-column>
      <el-table-column
        label="合作企业"
        :show-overflow-tooltip="true"
        min-width="150"
        prop="cooperativeEnterprise"
      >
        <template slot-scope="scope">
          {{ scope.row.cooperativeEnterprise || '--' }}
        </template>
      </el-table-column>
      <el-table-column
        label="云服务商"
        :show-overflow-tooltip="true"
        min-width="150"
        prop="cloudProvider"
      >
        <template slot-scope="scope">
          {{ scope.row.cloudProvider || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="平台评价" width="90" align="center">
        <template slot-scope="scope">
          <span @click="handleDetail(scope.row)" class="rating-star">{{ scope.row.platformRating || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户评价" width="90" align="center">
        <template slot-scope="scope">
          <span @click="handleDetail(scope.row)" class="rating-star">{{ scope.row.usageRating || 0 }}</span>
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
              v-hasPermi="[
                $p('Catalog:EditContent:{0}', [scope.row.catalogId]),
              ]"
              @click="handleEdit(scope.row)"
              >修改</el-button
            >
          </span>
          <span class="btn-cell-wrap">
            <el-button
              size="small"
              type="text"
              icon="el-icon-delete"
              v-hasPermi="[
                $p('Catalog:DeleteContent:{0}', [scope.row.catalogId]),
              ]"
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
      @pagination="loadContentList"
    />

    <!-- 新增弹窗 -->
    <el-dialog
      title="新增数字应用"
      width="920px"
      :visible.sync="addDialogVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
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
        <el-form-item label="显示顺序">
          <el-input-number
            v-model="addForm.sortOrder"
            :min="0"
            controls-position="right"
          />
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
            <el-checkbox v-for="opt in flatTargetObjectAdd" :key="opt" :label="opt">{{ opt }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="应用架构">
          <el-checkbox-group v-model="addForm.appArchitecture">
            <el-checkbox v-for="opt in flatArchAdd" :key="opt" :label="opt">{{ opt }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="部署云服务商" prop="cloudProvider" required>
          <div>
            <el-checkbox-group v-model="addForm.cloudProvider">
              <el-checkbox v-for="opt in flatCloudAdd" :key="opt" :label="opt">{{ opt }}</el-checkbox>
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
        <el-button type="primary" @click="handleAddSubmit">直接发布</el-button>
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
        <!-- 应用信息 -->
        <p class="fz-16 mt--8">应用信息</p>
        <div class="gird">
          <div class="content">
            <span>应用名称</span>
            <span>{{ detailForm.title || '--' }}</span>
          </div>
          <div class="content">
            <span>系统地址</span>
            <span>{{ detailForm.systemUrl || '--' }}</span>
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
          <span>应用描述</span>
          <span>{{ detailForm.description || '--' }}</span>
        </div>

        <!-- 服务商信息 -->
        <p class="pt-24 fz-16">服务商信息</p>
        <div class="gird">
          <div class="content">
            <span>服务商名称</span>
            <span>{{ detailForm.serviceProvider || '--' }}</span>
          </div>
          <div class="content">
            <span>合作伙伴名称</span>
            <span>{{ detailForm.cooperativeEnterprise || '--' }}</span>
          </div>
          <div class="content">
            <span>联系方式1</span>
            <span>{{ detailForm.contactName1 || '--' }} {{ detailForm.contactPhone1 || '--' }}</span>
          </div>
          <div class="content">
            <span>联系方式2</span>
            <span>{{ detailForm.contactName2 || '--' }} {{ detailForm.contactPhone2 || '--' }}</span>
          </div>
        </div>

        <!-- 分类标签 -->
        <p class="pt-24 fz-16">分类标签</p>
        <div class="gird">
          <div class="content">
            <span>面向对象</span>
            <span>{{ detailForm.targetObject ? detailForm.targetObject.join('；') : '--' }}</span>
          </div>
          <div class="content">
            <span>应用架构</span>
            <span>{{ detailForm.appArchitecture ? detailForm.appArchitecture.join('；') : '--' }}</span>
          </div>
          <div class="content">
            <span>部署云服务商</span>
            <span>{{ detailForm.cloudProvider ? detailForm.cloudProvider.join('；') : '--' }}</span>
          </div>
          <div class="content">
            <span>应用覆盖范围</span>
            <span>{{ detailForm.appScope || '--' }}</span>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 编辑弹窗 -->
    <el-dialog
      title="编辑数字应用"
      width="920px"
      :visible.sync="editDialogVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
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
        <el-form-item label="显示顺序">
          <el-input-number
            v-model="editForm.sortOrder"
            :min="0"
            controls-position="right"
          />
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
            <el-checkbox v-for="opt in flatTargetObjectEdit" :key="opt" :label="opt">{{ opt }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="应用架构">
          <el-checkbox-group v-model="editForm.appArchitecture">
            <el-checkbox v-for="opt in flatArchEdit" :key="opt" :label="opt">{{ opt }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="部署云服务商" prop="cloudProvider" required>
          <div>
            <el-checkbox-group v-model="editForm.cloudProvider">
              <el-checkbox v-for="opt in flatCloudEdit" :key="opt" :label="opt">{{ opt }}</el-checkbox>
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
        <el-button type="primary" @click="handleEditSubmit">直接发布</el-button>
        <el-button @click="editDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 置顶时间设置弹窗 -->
    <el-dialog
      :title="$t('CMS.Content.SetTop')"
      width="400px"
      :visible.sync="topDialogVisible"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="top_form" label-width="100px" :model="topForm">
        <el-form-item :label="$t('CMS.Content.TopEndTime')" prop="topEndTime">
          <el-date-picker
            v-model="topForm.topEndTime"
            :picker-options="topEndTimePickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleTopDialogOk">{{
          $t("Common.Confirm")
        }}</el-button>
        <el-button @click="topDialogVisible = false">{{
          $t("Common.Cancel")
        }}</el-button>
      </div>
    </el-dialog>
    <!-- 进度条 -->
    <cms-progress
      :title="$t('CMS.ContentCore.PublishProgressTitle')"
      :open.sync="openProgress"
      :taskId="taskId"
    ></cms-progress>
    <!-- 栏目选择组件 -->
    <cms-catalog-selector
      :open="openCatalogSelector"
      :showCopyToolbar="isCopy"
      :multiple="isCopy"
      @ok="handleCatalogSelectorOk"
      @close="handleCatalogSelectorClose"
    ></cms-catalog-selector>

    <!-- 评价弹窗 -->
    <el-dialog
      title="应用评价"
      width="920px"
      :visible.sync="ratingDialogVisible"
      :close-on-click-modal="false"
      append-to-body
      top="5vh"
    >
      <div class="add-form">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="平台评价" name="platform">
            <el-form ref="ratingForm" :model="ratingForm" label-width="80px">
              <el-form-item label="评分">
                <div class="stars">
                  <span v-for="i in 5" :key="i" class="star" :class="{ full: i <= ratingForm.score }" @click="ratingForm.score = i">★</span>
                </div>
                <span class="score-text">{{ ratingForm.score }}分</span>
              </el-form-item>
              <el-form-item label="评价描述">
                <el-input v-model="ratingForm.description" type="textarea" rows="4" placeholder="请输入评价描述" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="用户评价" name="user">
            <el-table :data="usageRatings" style="width: 100%" :header-cell-style="{background:'#f5f7fa'}" class-name="small-padding fixed-width">
              <el-table-column label="评分" width="80">
                <template slot-scope="scope">
                  <div class="stars">
                    <span v-for="i in 5" :key="i" class="star" :class="{ full: i <= scope.row.score }">★</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="服务/订单号" width="200">
                <template slot-scope="scope">
                  <div>
                    <div class="review-service">{{ scope.row.serviceName }}</div>
                    <div class="review-order">{{ scope.row.orderNo }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="评价机构" width="200">
                <template slot-scope="scope">
                  <div>
                    <div class="review-org">{{ scope.row.orgName }}</div>
                    <div class="review-user">{{ scope.row.userName }} · {{ scope.row.department }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="评价内容" min-width="160" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.content }}
                </template>
              </el-table-column>
              <el-table-column label="评价时间" width="140">
                <template slot-scope="scope">
                  {{ scope.row.time }}
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="activeTab === 'platform'" type="primary" @click="handleRatingSubmit">提交</el-button>
        <el-button @click="ratingDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getUserPreference } from "@/api/system/user";
import { getContentTypes } from "@/api/contentcore/catalog";
import {
  getContentList,
  delContent,
  publishContent,
  createIndexes,
  copyContent,
  moveContent,
  setTopContent,
  cancelTopContent,
  sortContent,
  offlineContent,
  archiveContent,
  toPublishContent,
  addContentAttribute,
  removeContentAttribute,
} from "@/api/contentcore/content";
import CMSCatalogSelector from "@/views/cms/contentcore/catalogSelector";
import CMSProgress from "@/views/components/Progress";

export default {
  name: "CMSDigitalAppList",
  components: {
    "cms-catalog-selector": CMSCatalogSelector,
    "cms-progress": CMSProgress,
  },
  dicts: ["CMSContentStatus", "CMSContentAttribute"],
  props: {
    cid: {
      type: String,
      default: undefined,
      required: false,
    },
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      addPopoverVisible: false,
      showSearch: false,
      contentTypeOptions: [],
      // 应用覆盖范围选项
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
      // 面向对象选项
      targetObjectOptions: [
        { value: '基层医疗卫生机构', label: '基层医疗卫生机构' },
        { value: '公立医院', label: '公立医院' },
        { value: '医技护人员', label: '医技护人员' }
      ],
      coverBaseOptions: ['基本公共卫生服务', '医院信息系统（HIS）', '实验室信息管理系统（LIS）', '影像归档和通信系统（PACS）', '智慧管理平台（HRP）', '心电', '家庭医生签约', '村卫生室管理', '药店应用管理', '智能外呼', '辅助诊疗', '临床专病库', '区域综合', '基本公共卫生服务绩效评价', '妇幼健康'],
      coverPublicOptions: ['医院信息系统（HIS）', '实验室信息管理系统（LIS）', '影像归档和通信系统（PACS）', '心电', '医养结合一体化', '智慧管理平台（HRP）', '药店应用管理', '智能外呼', '临床专病库', '医共体信息平台', '妇幼健康'],
      coverTechOptions: [],
      catalogId: this.cid || '603612031287365',
      contentList: null,
      total: 0,
      tableHeight: 600, // 表格高度
      tableMaxHeight: 600, // 表格最大高度
      selectedRows: [], // 表格选中行
      single: true,
      multiple: true,
      dateRange: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        contentType: undefined,
        status: undefined,
        cover: undefined,
        target: undefined,
        catalogId: undefined,
        sorts: "",
      },
      // 新增弹窗
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
      // 编辑弹窗
      editDialogVisible: false,
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
      // 详情弹窗
      detailDialogVisible: false,
      detailForm: {
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
        appScope: ''
      },
      // 分类标签子分组配置（新增弹窗）
      targetObjectSubgroupsAdd: [
        { key: 'org', title: '机构类', options: ['基层医疗卫生机构', '公立医院'] },
        { key: 'person', title: '人员类', options: ['医技护人员'] }
      ],
      archSubgroupsAdd: [
        { key: 'web', title: 'Web架构', options: ['B/S'] },
        { key: 'client', title: '客户端架构', options: ['C/S架构', 'B/S+C/S'] },
        { key: 'standalone', title: '独立部署', options: ['单机', '其他'] }
      ],
      cloudSubgroupsAdd: [
        { key: 'carrier', title: '运营商云', options: ['电信云', '移动云', '联通云'] },
        { key: 'independent', title: '独立云厂商', options: ['浪潮云', '紫光云', '影像云'] }
      ],
      // 分类标签子分组配置（编辑弹窗）
      targetObjectSubgroupsEdit: [
        { key: 'org', title: '机构类', options: ['基层医疗卫生机构', '公立医院'] },
        { key: 'person', title: '人员类', options: ['医护人员', '市民'] },
        { key: 'org2', title: '组织类', options: ['企业'] }
      ],
      archSubgroupsEdit: [
        { key: 'deploy', title: '部署方式', options: ['云端部署', '本地部署'] }
      ],
      cloudSubgroupsEdit: [
        { key: 'carrier', title: '运营商云', options: ['电信云', '移动云', '联通云'] },
        { key: 'platform', title: '云平台厂商', options: ['阿里云', '腾讯云', '华为云'] },
        { key: 'independent', title: '独立云厂商', options: ['紫光云'] }
      ],
      // 表单验证规则
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
      },
      topDialogVisible: false,
      topForm: {
        topEndTime: undefined,
      },
      topEndTimePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7; //如果没有后面的-8.64e7就是不可以选择今天的
        },
      },
      openProgress: false,
      taskId: "",
      addContentType: "",
      openCatalogSelector: false, // 栏目选择弹窗
      isCopy: false,
      openContentSortDialog: false, // 内容选择弹窗
      openEditorW: true,
      statusColumn: [],
      // 评价弹窗
      ratingDialogVisible: false,
      activeTab: 'platform',
      ratingForm: {
        score: 0,
        description: ''
      },
      currentApp: null,
      usageRatings: [
        {
          score: 5,
          serviceName: '智慧园区综合管理平台',
          orderNo: '#ORD-2024-0089',
          orgName: '北京市海淀区数字经济发展局',
          userName: '张三',
          department: '技术部',
          content: '平台运行稳定，功能齐全，售后服务响应及时，整体体验很好。',
          time: '2024-03-15 14:32'
        },
        {
          score: 4,
          serviceName: '统一身份认证组件',
          orderNo: '#ORD-2024-0090',
          orgName: '北京市朝阳区卫健委',
          userName: '李四',
          department: '信息科',
          content: '组件集成方便，文档完善，基本满足需求，部分场景适配需优化。',
          time: '2024-03-12 09:15'
        }
      ],
    };
  },
  watch: {
    cid(newVal) {
      this.catalogId = newVal;
    },
    catalogId(newVal) {
      this.loadContentList();
    },
    addDialogVisible(val) {
      if (val) { this.$root.$emit('set-prd-anchor', 'prd-3.2.1.2'); }
    },
    editDialogVisible(val) {
      if (val) { this.$root.$emit('set-prd-anchor', 'prd-3.2.1.3'); }
    },
    "dict.type.CMSContentStatus": {
      handler(val) {
        let arr = [];
        val.forEach((i) => {
          arr.push({
            label: i.label,
            value: i.raw.dictValue,
            raw: {
              listClass:
                i.raw.dictValue === "30"
                  ? "success"
                  : i.raw.dictValue === "40"
                  ? "danger"
                  : "default",
            },
          });
        });
        this.statusColumn = arr;
      },
      deep: true,
    },
  },
  computed: {
    flatTargetObjectAdd() {
      return this.targetObjectSubgroupsAdd.flatMap(sg => sg.options);
    },
    flatArchAdd() {
      return this.archSubgroupsAdd.flatMap(sg => sg.options);
    },
    flatCloudAdd() {
      return this.cloudSubgroupsAdd.flatMap(sg => sg.options);
    },
    flatTargetObjectEdit() {
      return this.targetObjectSubgroupsEdit.flatMap(sg => sg.options);
    },
    flatArchEdit() {
      return this.archSubgroupsEdit.flatMap(sg => sg.options);
    },
    flatCloudEdit() {
      return this.cloudSubgroupsEdit.flatMap(sg => sg.options);
    },
  },
  created() {
    this.changeTableHeight();
    getContentTypes().then((response) => {
      this.contentTypeOptions = response.data;
      this.addContentType = this.contentTypeOptions[0].id;
    });
    if (this.catalogId && this.catalogId > 0) {
      this.loadContentList();
    }
  },
  methods: {
    loadContentList() {
      this.loading = true;
      this.queryParams.catalogId = this.catalogId;
      getContentList({
        beginTime:
          this.dateRange && this.dateRange.length == 2
            ? this.dateRange[0]
            : null,
        endTime:
          this.dateRange && this.dateRange.length == 2
            ? this.dateRange[1]
            : null,
        ...this.queryParams,
      }).then((response) => {
        this.contentList = response.data.rows.map(item => {
          // 为每个应用添加随机的五分制评分
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
    contentTypeFormat(row, column) {
      var hitValue = [];
      this.contentTypeOptions.forEach((ct) => {
        if (ct.id == "" + row.contentType) {
          hitValue = ct.name;
          return;
        }
      });
      return hitValue;
    },
    handleSelectionChange(selection) {
      this.selectedRows = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    handleRowClick(currentRow) {
      // 不执行任何操作，避免影响按钮的点击事件
    },
    toggleAllCheckedRows() {
      this.selectedRows.forEach((row) => {
        this.$refs.tableContentList.toggleRowSelection(row, false);
      });
      this.selectedRows = [];
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.loadContentList();
    },
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleAdd() {
      this.addDialogVisible = true;
    },
    handleLogoUpload(file) {
      // 这里可以处理文件上传逻辑
      console.log('上传的文件:', file);
      // 模拟上传成功，设置logo路径
      this.addForm.logo = URL.createObjectURL(file.raw);
    },
    handleAddSubmit() {
      // 表单验证
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          // 这里可以处理表单提交逻辑
          console.log('表单数据:', this.addForm);
          // 模拟提交成功
          this.$modal.msgSuccess('保存成功');
          this.addDialogVisible = false;
          // 重置表单
          this.resetForm('addForm');
          // 重新加载列表
          this.loadContentList();
        }
      });
    },
    handleDetail(row) {
      this.$router.push({
        path: '/portal/service/digitalAppDetail',
        query: {
          title: row.title || '--',
          status: row.status || '--',
          serviceProvider: row.serviceProvider || '--',
          systemUrl: row.systemUrl || '--',
          description: row.description || '--',
          deployServiceProviderView: row.cooperativeEnterprise || '--',
          contactName1: row.contactName1 || '--',
          contactPhone1: row.contactPhone1 || '--',
          targetView: Array.isArray(row.targetObject) ? row.targetObject.join('、') : (row.targetObject || '--'),
          coverView: Array.isArray(row.cover) ? row.cover.map(item => item.value || item).join('、') : (row.coverView || '--'),
          cloudProviderStr: Array.isArray(row.cloudProvider) ? row.cloudProvider.join('、') : (row.cloudProviderStr || row.cloudProvider || '--'),
          sortOrder: row.sortOrder,
          platformRating: row.platformRating || 0,
          usageRating: row.usageRating || 0
        }
      });
    },
    handleTestDetail() {
      console.log('handleTestDetail called');
      this.handleDetail({});
    },
    handleEdit(row) {
      // 填充编辑表单数据
      this.editForm = {
        id: row.id,
        title: row.title || '',
        logo: row.logo || '',
        description: row.description || '',
        systemUrl: row.systemUrl || '',
        sortOrder: row.sortOrder || 0,
        serviceProvider: row.serviceProvider || '',
        cooperativeEnterprise: row.cooperativeEnterprise || '',
        contactName1: row.contactName1 || '',
        contactPhone1: row.contactPhone1 || '',
        contactName2: row.contactName2 || '',
        contactPhone2: row.contactPhone2 || '',
        targetObject: row.targetObject || [],
        appArchitecture: row.appArchitecture || [],
        cloudProvider: row.cloudProvider || [],
        coverBase: Array.isArray(row.coverBase) ? row.coverBase : [],
        coverPublic: Array.isArray(row.coverPublic) ? row.coverPublic : [],
        coverTech: Array.isArray(row.coverTech) ? row.coverTech : [],
        appScope: row.appScope || ''
      };
      console.log('editForm set:', this.editForm);
      // 使用setTimeout确保异步更新
      setTimeout(() => {
        this.editDialogVisible = true;
        console.log('editDialogVisible set to:', this.editDialogVisible);
      }, 0);
    },
    handleEditSubmit() {
      // 表单验证
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          // 这里可以处理表单提交逻辑
          console.log('表单数据:', this.editForm);
          // 模拟提交成功
          this.$modal.msgSuccess('保存成功');
          this.editDialogVisible = false;
          // 重新加载列表
          this.loadContentList();
        }
      });
    },
    handleDelete(row) {
      const contentIds = row.contentId
        ? [row.contentId]
        : this.selectedRows.map((row) => row.contentId);
      this.$modal
        .confirm("是否确认删除？")
        .then(function () {
          return delContent(contentIds);
        })
        .then(() => {
          this.loadContentList();
          this.$modal.msgSuccess(this.$t("Common.DeleteSuccess"));
        })
        .catch(function () {});
    },
    handlePublish(row) {
      const contentIds = row.contentId
        ? [row.contentId]
        : this.selectedRows.map((row) => row.contentId);
      if (contentIds.length == 0) {
        this.$modal.msgWarning(this.$t("CMS.Content.SelectRowFirst"));
        return;
      }
      const _this = this;
      this.$modal
        .confirm("发布后将在门户网站上显示，是否确认发布？")
        .then(function () {
          _this.updateArticle(contentIds);
        });
    },
    updateArticle(contentIds) {
      console.log(contentIds);
      this.$modal.loading("Loading...");
      publishContent(contentIds)
        .then((response) => {
          this.$modal.closeLoading();
          this.$modal.msgSuccess(this.$t("CMS.ContentCore.PublishSuccess"));
          this.loadContentList();
          this.$cache.local.set("publish_flag", "true");
        })
        .catch(() => {
          this.$modal.closeLoading();
        });
    },
    handlePreview(row) {
      let contentId = undefined;
      if (row) {
        contentId = row.contentId;
      } else if (this.selectedRows.length > 0) {
        contentId = this.selectedRows[0].contentId;
      } else {
        this.$modal.msgWarning(this.$t("CMS.Content.SelectRowFirst"));
        return;
      }
      let routeData = this.$router.resolve({
        path: "/cms/preview",
        query: { type: "content", dataId: contentId },
      });
      window.open(routeData.href, "_blank");
    },
    handleDropdownBtn(command, row) {},
    changeTableHeight() {
      let height = document.body.offsetHeight; // 网页可视区域高度
      this.tableHeight = height - 330;
      this.tableMaxHeight = this.tableHeight;
    },
    handleCreateIndex(row) {
      createIndexes(row.contentId).then((response) => {
        this.$modal.msgSuccess(this.$t("Common.OpSuccess"));
      });
    },
    handleCopy(row) {
      if (row.contentId) {
        this.selectedRows = [row];
      }
      this.isCopy = true;
      this.openCatalogSelector = true;
    },
    doCopy(catalogs, copyType) {
      const data = {
        contentIds: this.selectedRows.map((item) => item.contentId),
        catalogIds: catalogs.map((item) => item.id),
        copyType: copyType,
      };
      copyContent(data).then((response) => {
        this.$modal.msgSuccess(this.$t("Common.OpSuccess"));
        this.openCatalogSelector = false;
        if (this.catalogId && data.catalogIds.indexOf(this.catalogId) > -1) {
          this.loadContentList();
        }
      });
    },
    handleMove(row) {
      if (row.contentId) {
        this.selectedRows = [row];
      }
      this.isCopy = false;
      this.openCatalogSelector = true;
    },
    doMove(catalogs) {
      const data = {
        contentIds: this.selectedRows.map((item) => item.contentId),
        catalogId: catalogs[0].id,
      };
      moveContent(data).then((response) => {
        this.$modal.msgSuccess(this.$t("Common.OpSuccess"));
        this.openCatalogSelector = false;
        this.loadContentList();
      });
    },
    handleCatalogSelectorOk(catalogs, copyType) {
      if (this.isCopy) {
        this.doCopy(catalogs, copyType);
      } else {
        this.doMove(catalogs);
      }
    },
    handleCatalogSelectorClose() {
      this.openCatalogSelector = false;
    },
    handleSetTop(row) {
      if (row.contentId) {
        this.toggleAllCheckedRows();
        this.selectedRows.push(row);
      }
      this.topDialogVisible = true;
    },
    handleTopDialogOk() {
      const contentIds = this.selectedRows.map((item) => item.contentId);
      if (contentIds.length == 0) {
        this.$modal.msgWarning(this.$t("CMS.Content.SelectRowFirst"));
        return;
      }
      this.$refs["top_form"].validate((valid) => {
        if (valid) {
          setTopContent({
            contentIds: contentIds,
            topEndTime: this.topForm.topEndTime,
          }).then((response) => {
            this.$modal.msgSuccess(this.$t("Common.OpSuccess"));
            this.topDialogVisible = false;
            this.topForm.topEndTime = undefined;
            this.loadContentList();
          });
        }
      });
    },
    handleCancelTop(row) {
      const contentIds = row.contentId
        ? [row.contentId]
        : this.selectedRows.map((item) => item.contentId);
      cancelTopContent(contentIds).then((response) => {
        this.$modal.msgSuccess(this.$t("Common.OpSuccess"));
        this.loadContentList();
      });
    },
    handleSort(row) {
      if (row.contentId) {
        this.toggleAllCheckedRows();
        this.selectedRows.push(row);
      }
      this.openContentSortDialog = true;
    },
    handleContentSortDialogOk(contents) {
      if (contents && contents.length > 0) {
        this.doSort(contents[0].contentId);
      }
    },
    handleContentSortDialogClose() {
      this.openContentSortDialog = false;
    },
    doSort(targetContentId) {
      const data = {
        contentId: this.selectedRows[0].contentId,
        targetContentId: targetContentId,
      };
      sortContent(data).then((response) => {
      });
    },
    openRatingDialog(row) {
      this.currentApp = row;
      this.ratingForm.score = row.platformRating || 0;
      this.ratingForm.description = '';
      this.ratingDialogVisible = true;
    },
    handleRatingSubmit() {
      // 提交平台评价
      this.$modal.msgSuccess('评价成功');
      this.ratingDialogVisible = false;
      // 模拟更新评分
      this.currentApp.platformRating = this.ratingForm.score;
    },
    handleOffline(row) {
      const _this = this;
      this.$modal
        .confirm("下线后将在门户网站上隐藏，是否确认下线？")
        .then(function () {
          const contentIds = row.contentId
            ? [row.contentId]
            : _this.selectedRows.map((item) => item.contentId);
          offlineContent(contentIds).then((response) => {
            _this.$modal.msgSuccess(_this.$t("Common.OpSuccess"));
            _this.loadContentList();
          });
        });
    },
    handleToPublish(row) {
      const _this = this;
      this.$modal
        .confirm("待发布后将在门户网站上隐藏，是否确认待发布？")
        .then(function () {
          const contentIds = row.contentId
            ? [row.contentId]
            : _this.selectedRows.map((item) => item.contentId);
          toPublishContent(contentIds).then((response) => {
            _this.$modal.msgSuccess(
              _this.$t("CMS.ContentCore.ToPublishSuccess")
            );
            _this.loadContentList();
          });
        });
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

/* 新增/编辑弹窗样式 */
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

.score-text {
  font-size: 15px;
  font-weight: 500;
  color: #1890ff;
  margin-left: 10px;
  vertical-align: middle;
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

/* 弹窗仅覆盖左侧Demo区域 */
:deep(.el-dialog__wrapper) {
  position: absolute !important;
}
:deep(.v-modal) {
  position: absolute !important;
}
</style>