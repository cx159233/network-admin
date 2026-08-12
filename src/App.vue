<template>
  <a-config-provider :theme="themeConfig" :locale="zhCN">
    <router-view />
  </a-config-provider>
</template>

<script>
import { theme as antdTheme } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

export default {
  name: 'App',
  data() {
    return {
      zhCN,
      themeConfig: {
        token: {
          colorPrimary: '#165DFF',
          colorInfo: '#165DFF',
          colorSuccess: '#16A34A',
          colorWarning: '#F59E0B',
          colorError: '#EF4444',
          colorLink: '#165DFF',
          borderRadius: 6,
          lineWidthFocus: 0,
          fontFamily: '"PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", "Hiragino Sans GB", "Helvetica Neue", Helvetica, Arial, sans-serif',
          fontSize: 14
        },
        components: {
          Table: {
            headerBg: '#FAFBFC',
            headerColor: 'rgba(0, 0, 0, 0.85)',
            headerSortActiveBg: '#F2F3F5',
            borderColor: '#e8e8e8',
            rowHoverBg: '#FAFBFC',
            rowSelectedBg: '#E8F3FF',
            rowSelectedHoverBg: '#BEDAFF',
            footerColor: 'rgba(0, 0, 0, 0.85)',
            cellPaddingBlock: 16,
            cellPaddingInline: 16,
            cellFontSize: 14
          },
          Button: {
            lineWidthFocus: 0
          }
        },
        algorithm: antdTheme.defaultAlgorithm
      }
    }
  }
}
</script>
