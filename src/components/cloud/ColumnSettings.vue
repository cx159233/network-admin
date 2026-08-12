<template>
  <a-dropdown :trigger="['click']">
    <a-button size="small" type="text">
      <template #icon><SettingOutlined /></template>
    </a-button>
    <template #overlay>
      <a-menu>
        <a-menu-item-group title="显示列">
          <a-menu-item v-for="col in columns" :key="col.key">
            <a-checkbox
              :checked="!hiddenKeys.includes(col.key)"
              @change="(e) => onToggle(col.key, e.target.checked)"
            >
              {{ col.title }}
            </a-checkbox>
          </a-menu-item>
        </a-menu-item-group>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script>
import { SettingOutlined } from '@ant-design/icons-vue'

export default {
  name: 'ColumnSettings',
  components: { SettingOutlined },
  model: {
    prop: 'hiddenKeys',
    event: 'change'
  },
  props: {
    columns: { type: Array, default: () => [] },
    hiddenKeys: { type: Array, default: () => [] }
  },
  methods: {
    onToggle(key, checked) {
      const next = checked
        ? this.hiddenKeys.filter(k => k !== key)
        : [...this.hiddenKeys, key]
      this.$emit('change', next)
    }
  }
}
</script>
