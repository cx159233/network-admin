<template>
  <div class="menu-perms-container">
    <div class="mb12">
      <a-space>
        <a-select
          v-model:value="currentSiteId"
          size="small"
          style="min-width: 160px"
          @change="handleSiteChange"
        >
          <a-select-option
            v-for="item in siteOptions"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
        <a-button type="primary" ghost size="small" @click="handleSave">
          <template #icon><EditOutlined /></template>
          {{ $t("Common.Save") }}
        </a-button>
        <a-button ghost size="small" @click="handleSelectAll">
          <template #icon><CheckOutlined /></template>
          {{ selectAll ? $t('Common.CheckInverse') : $t('Common.CheckAll') }}
        </a-button>
      </a-space>
    </div>
    <a-table
      v-if="siteOptions.length > 0"
      :loading="loading"
      :columns="columns"
      :data-source="catalogPrivs"
      row-key="catalogId"
      size="small"
      v-model:expanded-row-keys="expandedRowKeys"
      :scroll="{ x: 'max-content', y: tableHeight }"
      :pagination="false"
      style="width: 100%"
    >
      <template #headerCell="{ column }">
        <template v-if="column.permId && column.permId !== 'View'">
          <a-checkbox @change="handleColumnSelectAll(column.permId)">{{ column.title }}</a-checkbox>
        </template>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          <a-checkbox
            v-model:checked="record.perms['View'].granted"
            :disabled="record.perms['View'].inherited"
            @change="(e) => handleRowSelectAll(e.target.checked, record.catalogId)"
          >{{ record.name }}</a-checkbox>
        </template>
        <template v-else-if="column.permId">
          <a-checkbox
            v-model:checked="record.perms[column.permId].granted"
            :disabled="record.perms[column.permId].inherited"
            @change="(e) => handleRowColumnChange(e.target.checked, record)"
          />
        </template>
      </template>
    </a-table>
    <div v-else class="no-perms-tip">
      <InfoCircleOutlined class="mr5" />{{ $t("CMS.Catalog.NoSitePermissions") }}
    </div>
  </div>
</template>
<script>
import { EditOutlined, CheckOutlined, InfoCircleOutlined } from "@ant-design/icons-vue";
import { getCatalogPermissions, saveCatalogPermissions, getSiteOptions } from "@/api/contentcore/perms"

export default {
  name: "CatalogPermission",
  components: {
    EditOutlined,
    CheckOutlined,
    InfoCircleOutlined
  },
  emits: [],
  props: {
    ownerType: {
      type: String,
      require: false,
      default: ""
    },
    owner: {
      type: String,
      require: false,
      default: ""
    }
  },
  watch: {
    ownerType: {
      handler(newV, oldV) {
        if (newV && newV != '') {
          this.form.ownerType = newV;
          this.loadData();
        }
      }
    },
    owner: {
      handler(newV, oldV) {
        if (newV && newV != '') {
          this.form.owner = newV;
          this.loadData();
        }
      }
    },
  },
  data() {
    return {
      loading: false,
      tableHeight: 600,
      tableMaxHeight: 900,
      selectAll: false,
      selectColumnAll: {},
      catalogPrivs: [],
      catalogPrivItems: [],
      expandedRowKeys: [],
      currentSiteId: "",
      siteOptions: [],
      form: {
        ownerType: "",
        owner: ""
      }
    };
  },
  computed: {
    columns() {
      const cols = [
        { title: this.$t("CMS.Catalog.Name"), dataIndex: "name", key: "name", width: 200 }
      ];
      this.catalogPrivItems.forEach((item) => {
        if (item.id != 'View') {
          cols.push({ title: item.name, dataIndex: item.id, key: item.id, width: 100, align: "center", permId: item.id });
        }
      });
      return cols;
    }
  },
  created () {
    this.changeTableHeight();
    this.loadSiteOptions();
  },
  methods: {
    changeTableHeight () {
      let height = document.body.offsetHeight // 网页可视区域高度
      this.tableHeight = height - 140;
      this.tableMaxHeight = this.tableHeight;
    },
    loadSiteOptions() {
      const params = { ownerType: this.ownerType, owner: this.owner }
      getSiteOptions(params).then(response => {
        this.siteOptions = response.data.rows;
        if (this.siteOptions.length > 0) {
          this.currentSiteId = this.siteOptions[0].id;
          this.loadData();
        }
      })
    },
    loadData() {
      this.loading = true;
      const params = { ownerType: this.ownerType, owner: this.owner, siteId: this.currentSiteId }
      getCatalogPermissions(params).then(response => {
        this.catalogPrivItems = response.data.catalogPrivItems;
        this.catalogPrivs = this.initCatalogPrivs(response.data.catalogPrivs);
        this.expandedRowKeys = this.getExpandKeys(this.catalogPrivs);
        this.loading = false;
      });
    },
    initCatalogPrivs(catalogPrivs) {
      catalogPrivs.forEach(item => {
        this.catalogPrivItems.forEach(privItem => {
          if (!item.perms.hasOwnProperty(privItem.id)) {
            item.perms[privItem.id] = { granted: false, inherited: false };
          }
        });
        if (item.children && item.children.length > 0) {
          this.initCatalogPrivs(item.children);
        }
      });
      return catalogPrivs;
    },
    getExpandKeys(arr) {
      // 树表数据异步加载后 defaultExpandAllRows 不生效，改为受控展开全部
      const keys = [];
      arr.forEach(row => {
        if (row.children && row.children.length > 0) {
          keys.push(row.catalogId);
          keys.push(...this.getExpandKeys(row.children));
        }
      });
      return keys;
    },
    handleSiteChange() {
      this.loadData();
    },
    handleSelectAll() {
      this.selectAll = !this.selectAll;
      this.selectCatalogPrivs(this.catalogPrivs, this.selectAll)
    },
    selectCatalogPrivs(arr, checked) {
      arr.forEach(row => {
        Object.keys(row.perms).forEach(key => {
          if (!row.perms[key].inherited) {
            row.perms[key].granted = checked
          }
        })
        if (row.children && row.children.length > 0) {
          this.selectCatalogPrivs(row.children, checked)
        }
      });
    },
    handleRowSelectAll(value, catalogId) {
      this.selectRowAll(this.catalogPrivs, value, catalogId)
    },
    selectRowAll(arr, checked, catalogId) {
      this.$nextTick(() => {
        arr.some(row => {
          if (row.catalogId == catalogId) {
            const permItems = Object.keys(row.perms)
            if (checked) {
              permItems.forEach(key => {
                if (!row.perms[key].inherited) {
                  row.perms[key].granted = checked;
                }
              })
            } else {
              let hasCheckedPerm = false;
              for (let i = 0; i < permItems.length; i++) {
                if (permItems[i] != 'View' && row.perms[permItems[i]].granted) {
                  hasCheckedPerm = true;
                  break;
                }
              }
              if (hasCheckedPerm) {
                permItems.forEach(key => {
                  if (key != 'View') {
                    if (!row.perms[key].inherited) {
                      row.perms[key].granted = checked;
                    }
                  }
                })
                row.perms['View'].granted = hasCheckedPerm
              }
            }
            return true;
          }
          if (row.children && row.children.length > 0) {
            this.selectRowAll(row.children, checked, catalogId)
          }
          return false
        })
      })
    },
    handleColumnSelectAll(column) {
      this.selectColumnAll[column] = !this.selectColumnAll[column];
      this.selectColumn(this.catalogPrivs, column, this.selectColumnAll[column]);
    },
    selectColumn(arr, column, checked) {
      arr.forEach(row => {
        Object.keys(row.perms).forEach(key => {
          if (key == column) {
            if (!row.perms[key].inherited) {
              row.perms[key].granted = checked;
              if (checked) {
                row.perms['View'].granted = checked
              }
            }
          }
        })
        if (row.children && row.children.length > 0) {
          this.selectColumn(row.children, column, checked)
        }
      });
    },
    handleRowColumnChange(value, row) {
      if (value) {
        row.perms['View'].granted = true;
      }
    },
    handleSave() {
      const data = {
        ownerType: this.ownerType,
        owner: this.owner,
        siteId: this.currentSiteId,
        perms: this.catalogPrivs
      };
      saveCatalogPermissions(data).then(response => {
        this.$modal.notifySuccess(this.$t('Common.SaveSuccess'));
      });
    },
    getPermissionKeys(arr, permissions) {
      arr.forEach(row => {
        Object.keys(row.perms).forEach(key => {
          if (row.perms[key].granted) {
            permissions.push(key + ":" + row.catalogId);
          }
        })
        if (row.children && row.children.length > 0) {
          this.getPermissionKeys(row.children, permissions)
        }
      })
    }
  }
};
</script>
<style scoped>
.mb12 {
  margin-bottom: 12px;
}
.mr5 {
  margin-right: 5px;
}
.no-perms-tip {
  background-color: #f4f4f5;
  color: #909399;
  font-size: 12px;
  line-height: 30px;
  padding-left: 10px;
}
</style>
