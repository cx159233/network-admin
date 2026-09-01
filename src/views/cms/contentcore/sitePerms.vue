<template>
  <div class="menu-perms-container">
    <div class="mb12">
      <a-space>
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
      :loading="loading"
      :columns="columns"
      :data-source="sitePrivs"
      row-key="siteId"
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
            @change="(e) => handleRowSelectAll(e.target.checked, record.siteId)"
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
  </div>
</template>
<script>
import { EditOutlined, CheckOutlined } from "@ant-design/icons-vue";
import { getSitePermissions, saveSitePermissions } from "@/api/contentcore/perms"

export default {
  name: "SitePermission",
  components: {
    EditOutlined,
    CheckOutlined
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
  mounted() {
    this.loadData();
  },
  data() {
    return {
      loading: true,
      selectAll: false,
      selectColumnAll: {},
      sitePrivs: [],
      sitePrivItems: [],
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
        { title: this.$t("CMS.Site.Name"), dataIndex: "name", key: "name", width: 200 }
      ];
      this.sitePrivItems.forEach((item) => {
        if (item.id != 'View') {
          cols.push({ title: item.name, dataIndex: item.id, key: item.id, width: 100, align: "center", permId: item.id });
        }
      });
      return cols;
    }
  },
  methods: {
    loadData() {
      this.loading = true;
      const params = { ownerType: this.ownerType, owner: this.owner }
      getSitePermissions(params).then(response => {
        this.sitePrivItems = response.data.sitePrivItems;
        response.data.sitePrivs.forEach(item => {
          this.sitePrivItems.forEach(privItem => {
            if (!item.perms.hasOwnProperty(privItem.id)) {
              item.perms[privItem.id] = { granted: false, inherited: false };
            }
          });
        });
        this.sitePrivs = response.data.sitePrivs;
        this.loading = false;
      });
    },
    handleSelectAll() {
      this.selectAll = !this.selectAll;
      this.sitePrivs.forEach(row => {
        Object.keys(row.perms).forEach(key => {
          if (!row.perms[key].inherited) {
            row.perms[key].granted = this.selectAll
          }
        })
      })
    },
    handleRowSelectAll(value, siteId) {
      this.sitePrivs.some(row => {
        if (row.siteId == siteId) {
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
      this.sitePrivs.forEach(row => {
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
        perms: this.sitePrivs
      };
      saveSitePermissions(data).then(response => {
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
</style>
