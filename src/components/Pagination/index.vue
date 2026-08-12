<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <a-pagination
      :current="currentPage"
      :page-size="pageSize"
      :page-size-options="pageSizeOptions"
      :total="total"
      :show-size-changer="true"
      :show-quick-jumper="true"
      :show-total="(t) => `共 ${t} 条`"
      v-bind="$attrs"
      @change="handleCurrentChange"
      @showSizeChange="handleSizeChange"
    />
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      }
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    },
    pageSizeOptions() {
      return this.pageSizes.map(String)
    }
  },
  methods: {
    handleSizeChange(current, size) {
      if (this.currentPage * size > this.total) {
        this.currentPage = 1
      }
      this.$emit('update:limit', size)
      this.$emit('pagination', { page: this.currentPage, limit: size })
    },
    handleCurrentChange(current) {
      this.$emit('update:page', current)
      this.$emit('pagination', { page: current, limit: this.pageSize })
    }
  }
}
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 16px;
  display: flex;
  justify-content: flex-end;
}
.pagination-container.hidden {
  display: none;
}
</style>
