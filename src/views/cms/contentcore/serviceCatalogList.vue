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
              >同步数据<span class="el-icon-question" style="margin-left:4px" v-tooltip="{content: '点击手动从多云管理系统拉取最新服务数据'}"></span>
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
          <el-form-item prop="serviceName">
            <el-input
              v-model="queryParams.serviceName"
              placeholder="请输入服务名称"
              clearable
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item prop="cloudProvider">
            <el-select
              v-model="queryParams.cloudProvider"
              placeholder="请选择云服务商"
              clearable
              style="width: 150px"
            >
              <el-option
                v-for="item in cloudProviderOptions"
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
      ref="tableServiceCatalogList"
      size="small"
      :data="serviceCatalogList"
      :height="tableHeight"
      :max-height="tableMaxHeight"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column
        label="服务名称"
        :show-overflow-tooltip="true"
        min-width="180"
      >
        <template slot-scope="scope">
          {{ scope.row.serviceName }}
        </template>
      </el-table-column>
      <el-table-column
        label="服务ID"
        width="140"
        align="center"
        prop="serviceId"
      >
        <template slot-scope="scope">
          {{ scope.row.serviceId }}
        </template>
      </el-table-column>
      <el-table-column
        label="服务描述"
        :show-overflow-tooltip="true"
        min-width="250"
        prop="description"
      >
        <template slot-scope="scope">
          {{ scope.row.description || '无' }}
        </template>
      </el-table-column>
      <el-table-column
        label="云服务商"
        :show-overflow-tooltip="true"
        min-width="150"
        prop="cloudProvider"
      >
        <template slot-scope="scope">
          {{ scope.row.cloudProvider || '未设置' }}
        </template>
      </el-table-column>
      <el-table-column
        label="服务类型"
        width="120"
        align="center"
        prop="serviceType"
      >
        <template slot-scope="scope">
          {{ scope.row.serviceType || '未设置' }}
        </template>
      </el-table-column>
      <el-table-column
        label="区域"
        width="120"
        align="center"
        prop="region"
      >
        <template slot-scope="scope">
          {{ scope.row.region || '未设置' }}
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
      @pagination="loadServiceCatalogList"
    />

    <!-- 新增弹窗 -->
    <el-dialog
      title="新增服务目录"
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
        <el-form-item label="服务名称" prop="serviceName" required>
          <el-input v-model="addForm.serviceName" placeholder="请输入服务名称" />
        </el-form-item>
        <el-form-item label="服务描述" prop="description" required>
          <el-input
            v-model="addForm.description"
            type="textarea"
            rows="4"
            placeholder="请输入服务描述"
          />
        </el-form-item>
        <el-form-item label="服务类型" prop="serviceType" required>
          <el-select v-model="addForm.serviceType" placeholder="请选择服务类型" style="width: 300px">
            <el-option label="计算服务" value="compute" />
            <el-option label="存储服务" value="storage" />
            <el-option label="网络服务" value="network" />
            <el-option label="安全服务" value="security" />
            <el-option label="大数据服务" value="bigdata" />
            <el-option label="数据库服务" value="database" />
            <el-option label="备份容灾服务" value="backup" />
            <el-option label="软件与应用服务" value="software" />
            <el-option label="机房托管服务" value="hosting" />
          </el-select>
        </el-form-item>
        <el-form-item label="云服务商" prop="cloudProvider" required>
          <el-select v-model="addForm.cloudProvider" placeholder="请选择云服务商" style="width: 300px">
            <el-option label="影像云" value="10251" />
            <el-option label="电信云" value="10252" />
            <el-option label="移动云" value="10253" />
            <el-option label="联通云" value="10254" />
            <el-option label="浪潮云" value="10250" />
          </el-select>
        </el-form-item>
        <el-form-item label="区域" prop="region" required>
          <el-select v-model="addForm.region" placeholder="请选择区域" style="width: 300px">
            <el-option label="华东" value="east" />
            <el-option label="华北" value="north" />
            <el-option label="华南" value="south" />
            <el-option label="西南" value="southwest" />
          </el-select>
        </el-form-item>
        <el-form-item label="显示顺序">
          <el-input-number
            v-model="addForm.sortOrder"
            :min="0"
            controls-position="right"
          />
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
            <span>服务名称</span>
            <span>{{ detailForm.serviceName || '--' }}</span>
          </div>
          <div class="content">
            <span>服务ID</span>
            <span>{{ detailForm.serviceId || '--' }}</span>
          </div>
          <div class="content">
            <span>显示顺序</span>
            <span>{{ detailForm.sortOrder || 0 }}</span>
          </div>
        </div>
        <div class="content pt-24">
          <span>服务描述</span>
          <span>{{ detailForm.description || '--' }}</span>
        </div>

        <!-- 服务信息 -->
        <p class="pt-24 fz-16">服务信息</p>
        <div class="gird">
          <div class="content">
            <span>云服务商</span>
            <span>{{ detailForm.cloudProvider || '--' }}</span>
          </div>
          <div class="content">
            <span>服务类型</span>
            <span>{{ detailForm.serviceType || '--' }}</span>
          </div>
          <div class="content">
            <span>区域</span>
            <span>{{ detailForm.region || '--' }}</span>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 编辑弹窗 -->
    <el-dialog
      title="编辑服务目录"
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
        <el-form-item label="服务名称" prop="serviceName" required>
          <el-input v-model="editForm.serviceName" placeholder="请输入服务名称" />
        </el-form-item>
        <el-form-item label="服务描述" prop="description" required>
          <el-input
            v-model="editForm.description"
            type="textarea"
            rows="4"
            placeholder="请输入服务描述"
          />
        </el-form-item>
        <el-form-item label="服务类型" prop="serviceType" required>
          <el-select v-model="editForm.serviceType" placeholder="请选择服务类型" style="width: 300px">
            <el-option label="计算服务" value="compute" />
            <el-option label="存储服务" value="storage" />
            <el-option label="网络服务" value="network" />
            <el-option label="安全服务" value="security" />
            <el-option label="大数据服务" value="bigdata" />
            <el-option label="数据库服务" value="database" />
            <el-option label="备份容灾服务" value="backup" />
            <el-option label="软件与应用服务" value="software" />
            <el-option label="机房托管服务" value="hosting" />
          </el-select>
        </el-form-item>
        <el-form-item label="云服务商" prop="cloudProvider" required>
          <el-select v-model="editForm.cloudProvider" placeholder="请选择云服务商" style="width: 300px">
            <el-option label="影像云" value="10251" />
            <el-option label="电信云" value="10252" />
            <el-option label="移动云" value="10253" />
            <el-option label="联通云" value="10254" />
            <el-option label="浪潮云" value="10250" />
          </el-select>
        </el-form-item>
        <el-form-item label="区域" prop="region" required>
          <el-select v-model="editForm.region" placeholder="请选择区域" style="width: 300px">
            <el-option label="华东" value="east" />
            <el-option label="华北" value="north" />
            <el-option label="华南" value="south" />
            <el-option label="西南" value="southwest" />
          </el-select>
        </el-form-item>
        <el-form-item label="显示顺序">
          <el-input-number
            v-model="editForm.sortOrder"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleEditSubmit">保存草稿</el-button>
        <el-button @click="editDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ServiceCatalogList",
  data() {
    return {
      // 遮罩层
      loading: false,
      // 云服务商选项
      cloudProviderOptions: [
        { value: '影像云', label: '影像云' },
        { value: '电信云', label: '电信云' },
        { value: '移动云', label: '移动云' },
        { value: '联通云', label: '联通云' },
        { value: '浪潮云', label: '浪潮云' }
      ],
      serviceCatalogList: null,
      total: 0,
      tableHeight: 600, // 表格高度
      tableMaxHeight: 600, // 表格最大高度
      selectedRows: [], // 表格选中行
      single: true,
      multiple: true,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        serviceName: undefined,
        cloudProvider: undefined,
        status: undefined,
      },
      // 新增弹窗
      addDialogVisible: false,
      addForm: {
        serviceName: '',
        description: '',
        serviceType: '',
        cloudProvider: '',
        region: '',
        sortOrder: 0
      },
      // 编辑弹窗
      editDialogVisible: false,
      editForm: {
        serviceId: '',
        serviceName: '',
        description: '',
        serviceType: '',
        cloudProvider: '',
        region: '',
        sortOrder: 0
      },
      // 详情弹窗
      detailDialogVisible: false,
      detailForm: {
        serviceName: '',
        serviceId: '',
        description: '',
        serviceType: '',
        cloudProvider: '',
        region: '',
        sortOrder: 0
      },
      // 表单验证规则
      rules: {
        serviceName: [
          { required: true, message: '请输入服务名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入服务描述', trigger: 'blur' }
        ],
        serviceType: [
          { required: true, message: '请选择服务类型', trigger: 'change' }
        ],
        cloudProvider: [
          { required: true, message: '请选择云服务商', trigger: 'change' }
        ],
        region: [
          { required: true, message: '请选择区域', trigger: 'change' }
        ]
      },
    };
  },
  created() {
    this.changeTableHeight();
    this.loadServiceCatalogList();
  },
  methods: {
    loadServiceCatalogList() {
      this.loading = true;
      // 模拟数据
      setTimeout(() => {
        this.serviceCatalogList = [
          {
            serviceId: 'SVC001',
            serviceName: '云服务器ECS',
            description: '弹性计算服务，提供安全可靠、弹性可扩展的云服务器',
            serviceType: 'ecs',
            cloudProvider: '电信云',
            region: '华东',
            status: 20,
            sortOrder: 1
          },
          {
            serviceId: 'SVC002',
            serviceName: '对象存储OSS',
            description: '安全、稳定、高效的云存储服务',
            serviceType: 'storage',
            cloudProvider: '移动云',
            region: '华北',
            status: 20,
            sortOrder: 2
          },
          {
            serviceId: 'SVC003',
            serviceName: '云数据库RDS',
            description: '稳定可靠的关系型数据库服务',
            serviceType: 'database',
            cloudProvider: '联通云',
            region: '华南',
            status: 10,
            sortOrder: 3
          }
        ];
        this.total = 3;
        this.loading = false;
      }, 1000);
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
      this.loadServiceCatalogList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleAdd() {
      this.addDialogVisible = true;
    },
    handleAddSubmit() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          console.log('表单数据:', this.addForm);
          this.$modal.msgSuccess('保存成功');
          this.addDialogVisible = false;
          this.resetForm('addForm');
          this.loadServiceCatalogList();
        }
      });
    },
    handleDetail(row) {
      this.$router.push({
        path: '/portal/service/serviceCatalogDetail',
        query: row
      });
    },
    handleEdit(row) {
      if (row && row.serviceId) {
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
          this.loadServiceCatalogList();
        }
      });
    },
    handleDelete(row) {
      const serviceIds = row.serviceId
        ? [row.serviceId]
        : this.selectedRows.map((row) => row.serviceId);
      this.$modal
        .confirm("是否确认删除？")
        .then(() => {
          this.$modal.msgSuccess('删除成功');
          this.loadServiceCatalogList();
        })
        .catch(() => {});
    },
    handlePublish(row) {
      const serviceIds = row.serviceId
        ? [row.serviceId]
        : this.selectedRows.map((row) => row.serviceId);
      if (serviceIds.length == 0) {
        this.$modal.msgWarning('请选择要发布的记录');
        return;
      }
      this.$modal
        .confirm("发布后将在门户网站上显示，是否确认发布？")
        .then(() => {
          this.$modal.msgSuccess('发布成功');
          this.loadServiceCatalogList();
        });
    },
    handleOffline(row) {
      const serviceIds = row.serviceId
        ? [row.serviceId]
        : this.selectedRows.map((row) => row.serviceId);
      if (serviceIds.length == 0) {
        this.$modal.msgWarning('请选择要下线的记录');
        return;
      }
      this.$modal
        .confirm("下线后将在门户网站上隐藏，是否确认下线？")
        .then(() => {
          this.$modal.msgSuccess('下线成功');
          this.loadServiceCatalogList();
        });
    },
    handleSyncData() {
      // 同步数据逻辑
      this.$modal.loading('同步中...');
      // 模拟同步过程
      setTimeout(() => {
        this.$modal.closeLoading();
        this.$modal.msgSuccess('同步成功');
        this.loadServiceCatalogList();
      }, 1500);
    },
    changeTableHeight() {
      let height = document.body.offsetHeight;
      this.tableHeight = height - 330;
      this.tableMaxHeight = this.tableHeight;
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
</style>