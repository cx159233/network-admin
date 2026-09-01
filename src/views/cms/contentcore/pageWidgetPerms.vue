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
    <a-table :scroll="{ x: 'max-content' }"
      v-if="siteOptions.length > 0"
      :loading="loading"
      :columns="columns"
      :data-source="pageWidgetPrivs"
      row-key="pageWidgetId"
      size="small"
      :pagination="false"
      style="width: 100%"
    >
      <template #headerCell="{ column }">
        <template v-if="column.permId && column.permId !== 'View'">
          <a-checkbox @change="handleColumnSelectAll(column.permId)">{{ column.title }}</a-checkbox>
        </template>
      </template>
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'rowNo'">{{ index + 1 }}</template>
        <template v-else-if="column.dataIndex === 'name'">
          <a-checkbox
            v-model:checked="record.perms['View'].granted"
            :disabled="record.perms['View'].inherited"
            @change="(e) => handleRowSelectAll(e.target.checked, record.pageWidgetId)"
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
import { getPageWidgetPermissions, savePageWidgetPermissions, getSiteOptions } from "@/api/contentcore/perms"

export default {
  name: "PageWidgetPermission",
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
      selectAll: false,
      selectColumnAll: {},
      siteOptions: [],
      currentSiteId: "",
      pageWidgetPrivs: [],
      privItems: [],
      form: {
        ownerType: "",
        owner: ""
      }
    };
  },
  computed: {
    columns() {
      const cols = [
        { title: this.$t("Common.RowNo"), dataIndex: "rowNo", key: "rowNo", width: 50, align: "center" },
        { title: this.$t("CMS.PageWidget.Name"), dataIndex: "name", key: "name", width: 200 }
      ];
      this.privItems.forEach((item) => {
        if (item.id != 'View') {
          cols.push({ title: item.name, dataIndex: item.id, key: item.id, width: 100, align: "center", permId: item.id });
        }
      });
      return cols;
    }
  },
  created() {
    this.loadSiteOptions();
  },
  methods: {
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
      getPageWidgetPermissions(params).then(response => {
        this.privItems = response.data.privItems;
        response.data.pageWidgetPrivs.forEach(item => {
          this.privItems.forEach(privItem => {
            if (!item.perms.hasOwnProperty(privItem.id)) {
              item.perms[privItem.id] = { granted: false, inherited: false };
            }
          });
        });
        this.pageWidgetPrivs = response.data.pageWidgetPrivs;
        this.loading = false;
      });
    },
    handleSiteChange() {
      this.loadData();
    },
    handleSelectAll() {
      this.selectAll = !this.selectAll;
      this.pageWidgetPrivs.forEach(row => {
        Object.keys(row.perms).forEach(key => {
          if (!row.perms[key].inherited) {
            row.perms[key].granted = this.selectAll
          }
        })
      })
    },
    handleRowSelectAll(value, pageWidgetId) {
      this.pageWidgetPrivs.some(row => {
        if (row.pageWidgetId == pageWidgetId) {
          Object.keys(row.perms).forEach(key => {
            if (!row.perms[key].inherited) {
              row.perms[key].granted = value;
            }
          })
          return true;
        }
        return false;
      })
    },
    handleColumnSelectAll(column) {
      this.selectColumnAll[column] = !this.selectColumnAll[column];
      this.pageWidgetPrivs.forEach(row => {
        Object.keys(row.perms).forEach(key => {
          if (key == column) {
            if (!row.perms[key].inherited) {
              row.perms[key].granted = this.selectColumnAll[column];
              if (this.selectColumnAll[column]) {
                row.perms['View'].granted = this.selectColumnAll[column]
              }
            }
          }
        })
      })
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
        perms: this.pageWidgetPrivs
      };
      savePageWidgetPermissions(data).then(response => {
        this.$modal.notifySuccess(this.$t('Common.SaveSuccess'));
      });
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
