<template>
  <div id="app">
    <!-- 主布局：双栏并排 -->
    <div class="main-layout">
      <!-- 左侧：Demo区域 -->
      <div class="demo-panel">
        <router-view />
      </div>

      <!-- PRD分隔线+触发按钮 -->
      <div v-if="showPrd" class="prd-divider" @click="prdVisible = !prdVisible">
        <div class="prd-divider-line"></div>
        <div class="prd-divider-btn">
          <svg class="w-3.5 h-3.5 transition-transform duration-300" :class="{ 'rotate-180': prdVisible }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
          <span class="prd-divider-text">PRD</span>
        </div>
        <div class="prd-divider-line"></div>
      </div>

      <!-- 右侧：PRD面板 -->
      <transition name="prd-panel">
        <div
          v-if="prdVisible && showPrd"
          class="prd-panel"
        >
          <div class="prd-header">
            <div class="prd-title">
              <svg class="prd-title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span class="prd-title-text">产品需求文档</span>
              <span class="prd-title-badge">{{ prdPageName }}</span>
            </div>
            <div class="prd-header-actions">
              <button class="prd-export-btn" @click="exportWord" title="导出 Word">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                <span>导出PRD</span>
              </button>
              <div class="prd-close" @click="prdVisible = false">
                <svg class="prd-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </div>
            </div>
          </div>
          <div class="prd-content">
            <div class="prd-doc" v-html="prdContent"></div>
          </div>
        </div>
      </transition>
    </div>

    <theme-picker />
  </div>
</template>

<script>
import ThemePicker from "@/components/ThemePicker";
import { shouldShowPrd, getAllPrdHtml, getPrdAnchor, getPrdPageName } from '@/data/prd'

export default {
  name: "App",
  components: { ThemePicker },
  data() {
    return {
      prdVisible: false,
      currentPath: '',
      dialogAnchor: ''
    }
  },
  computed: {
    showPrd() {
      return shouldShowPrd(this.currentPath || '')
    },
    prdPageName() {
      return getPrdPageName(this.currentPath || '')
    },
    prdContent() {
      return getAllPrdHtml()
    }
  },
  watch: {
    prdVisible(val) {
      this.updatePrdCssVar()
      if (val) {
        setTimeout(() => this.scrollToAnchor(), 350)
      }
    },
    currentPath() {
      this.updatePrdCssVar()
      if (this.prdVisible) {
        setTimeout(() => this.scrollToAnchor(), 350)
      }
    },
    '$route'(to) {
      this.currentPath = to.path
      this.dialogAnchor = ''
    }
  },
  created() {
    this.currentPath = this.$route.path
    this.updatePrdCssVar()
    this.$root.$on('set-prd-anchor', (anchor) => {
      this.dialogAnchor = anchor
      if (this.prdVisible) {
        if (anchor) {
          setTimeout(() => this.scrollToAnchor(), 350)
        } else {
          setTimeout(() => this.scrollToAnchor(), 350)
        }
      }
    })
  },
  beforeDestroy() {
    this.$root.$off('set-prd-anchor')
  },
  methods: {
    updatePrdCssVar() {
      const offset = this.prdVisible && this.showPrd ? '508px' : '0px'
      document.documentElement.style.setProperty('--prd-width', offset)
    },
    exportWord() {
      const html = this.prdContent
      // 根据 prd-X.Y.Z 的段数动态转换标题层级，让 Word 导航窗格按实际层级显示
      // prd-3.1 (2段) -> h3, prd-3.1.1 (3段) -> h4, prd-3.1.1.1 (4段) -> h5, prd-3.1.1.1.1 (5段) -> h6
      const processedHtml = html.replace(/<h3\s+id="prd-([\d.]+)"([^>]*)>([\s\S]*?)<\/h3>/g, (match, num, attrs, content) => {
        const segments = num.split('.').length
        const level = Math.min(segments + 1, 6)
        if (level === 3) return match
        return `<h${level} id="prd-${num}"${attrs}>${content}</h${level}>`
      })
      const fullHtml = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>产品需求文档</title>
<!--[if gte mso 9]><xml>
<w:WordDocument>
  <w:View>Print</w:View>
  <w:Zoom>100</w:Zoom>
  <w:DoNotOptimizeForBrowser/>
</w:WordDocument>
</xml><![endif]-->
<style>
  @page WordSection1 {
    size: 595.3pt 841.9pt;
    margin: 72pt 90pt 72pt 90pt;
    mso-header-margin: 35.4pt;
    mso-footer-margin: 35.4pt;
    mso-paper-source: 0;
  }
  div.WordSection1 { page: WordSection1; }
  body, h1, h2, h3, h4, h5, h6, p, th, td, li, strong, span, a, div {
    font-family: '微软雅黑', 'Microsoft YaHei', Arial, sans-serif;
  }
  body { font-size: 14px; line-height: 1.8; }
  h1 { font-size: 22px; font-weight: 700; margin: 0 0 20px 0; padding-bottom: 12px; border-bottom: 2px solid #035BFE; }
  h2 { font-size: 17px; font-weight: 600; margin-top: 24px; margin-bottom: 12px; padding-left: 10px; border-left: 3px solid #035BFE; }
  h3 { font-size: 15px; font-weight: 600; margin-top: 16px; margin-bottom: 8px; }
  h4 { font-size: 14px; font-weight: 600; margin-top: 14px; margin-bottom: 6px; }
  h5 { font-size: 13px; font-weight: 600; margin-top: 12px; margin-bottom: 6px; }
  h6 { font-size: 13px; font-weight: 600; margin-top: 12px; margin-bottom: 6px; }
  p { margin-bottom: 12px; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px; }
  th { background: #f5f7fa; padding: 8px 12px; text-align: left; border: 1px solid #e8ecf0; font-weight: 600; }
  td { padding: 8px 12px; border: 1px solid #e8ecf0; }
  ul { padding-left: 20px; margin-bottom: 12px; }
  li { margin-bottom: 6px; }
  pre { background: #f5f7fa; padding: 12px; font-size: 13px; line-height: 1.8; font-family: 'Courier New', Courier, monospace; white-space: pre; }
</style>
</head>
<body>
<div class="WordSection1">
${processedHtml}
</div>
</body>
</html>`
      const blob = new Blob(['﻿' + fullHtml], { type: 'application/msword;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = '产品需求文档.doc'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      this.$message && this.$message.success('导出成功')
    },
    scrollToAnchor(retryCount = 0) {
      const anchor = this.dialogAnchor || getPrdAnchor(this.currentPath || '')
      if (!anchor) return
      this.$nextTick(() => {
        requestAnimationFrame(() => {
          const el = document.getElementById(anchor)
          const container = document.querySelector('.prd-content')
          if (el && container) {
            let offset = 0
            let node = el
            while (node && node !== container) {
              offset += node.offsetTop
              node = node.offsetParent
            }
            if (node === container) {
              container.scrollTop = offset
            } else {
              const elRect = el.getBoundingClientRect()
              const containerRect = container.getBoundingClientRect()
              container.scrollTop += elRect.top - containerRect.top
            }
          } else if (retryCount < 8) {
            setTimeout(() => this.scrollToAnchor(retryCount + 1), 100)
          }
        })
      })
    }
  },
  metaInfo() {
    return {
      title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
      titleTemplate: title => {
        return title ? `${title} - ${this.$t('APP.TITLE')}` : this.$t('APP.TITLE')
      }
    }
  }
};
</script>
<style scoped>
#app .theme-picker {
  display: none;
}

/* 主布局 */
.main-layout {
  display: flex;
  height: 100vh;
}

/* 左侧：Demo区域 - 自适应剩余宽度 */
.demo-panel {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* PRD分隔线触发按钮 */
.prd-divider {
  position: relative;
  z-index: 51;
  width: 28px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  background: #f8fafc;
  border-left: 1px solid #e8ecf0;
  transition: background 0.2s;
}
.prd-divider:hover {
  background: #eef3ff;
}
.prd-divider-line {
  width: 1px;
  flex: 1;
  background: #e2e8f0;
}
.prd-divider-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 4px;
  color: #035BFE;
  border-radius: 4px;
  transition: background 0.2s;
}
.prd-divider:hover .prd-divider-btn {
  background: rgba(3, 91, 254, 0.08);
}
.prd-divider-text {
  font-size: 10px;
  font-weight: 600;
  color: #035BFE;
  writing-mode: vertical-lr;
  letter-spacing: 2px;
}

/* 右侧：PRD面板 */
.prd-panel {
  position: relative;
  z-index: 51;
  width: 480px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: white;
  border-left: 1px solid #e8ecf0;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.08);
}

.prd-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e8ecf0;
  flex-shrink: 0;
}

.prd-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.prd-title-icon {
  width: 16px;
  height: 16px;
  color: #035BFE;
  flex-shrink: 0;
}

.prd-title-text {
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #333;
}

.prd-title-badge {
  font-size: 12px;
  line-height: 16px;
  color: #999;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 4px;
}

.prd-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.prd-export-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 10px;
  border: 1px solid #d4e5ff;
  border-radius: 4px;
  background: #eef6ff;
  color: #035BFE;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.prd-export-btn:hover {
  background: #d4e5ff;
  border-color: #035BFE;
}

.prd-close {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  color: #999;
  transition: all 0.2s;
}

.prd-close:hover {
  background: #f5f7fa;
  color: #035BFE;
}

.prd-close-icon {
  width: 16px;
  height: 16px;
}

.prd-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* PRD文档样式 */
.prd-doc {
  color: #333;
  font-size: 14px;
  line-height: 1.8;
}

.prd-doc >>> h1 {
  font-size: 22px;
  line-height: 1.8;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #035BFE;
}

.prd-doc >>> h2 {
  font-size: 17px;
  line-height: 1.8;
  font-weight: 600;
  color: #1a1a1a;
  margin-top: 24px;
  margin-bottom: 12px;
  padding-left: 10px;
  border-left: 3px solid #035BFE;
}

.prd-doc >>> h3 {
  font-size: 15px;
  line-height: 1.8;
  font-weight: 600;
  color: #333;
  margin-top: 16px;
  margin-bottom: 8px;
}

.prd-doc >>> p {
  margin-bottom: 12px;
  color: #555;
}

.prd-doc >>> ul {
  padding-left: 20px;
  margin-bottom: 12px;
}

.prd-doc >>> li {
  margin-bottom: 6px;
  color: #555;
}

.prd-doc >>> strong {
  color: #1a1a1a;
}

.prd-doc >>> table {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
  font-size: 13px;
}

.prd-doc >>> th {
  background: #f5f7fa;
  padding: 8px 12px;
  text-align: left;
  border: 1px solid #e8ecf0;
  font-weight: 600;
  color: #333;
}

.prd-doc >>> td {
  padding: 8px 12px;
  border: 1px solid #e8ecf0;
  color: #555;
}

.prd-doc >>> pre {
  color: #555;
}

/* PRD面板展开收起动画 */
.prd-panel-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.prd-panel-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.prd-panel-enter,
.prd-panel-leave-to {
  width: 0 !important;
  opacity: 0;
  overflow: hidden;
}
</style>

<style>
/* MessageBox/Dialog 弹窗蒙层及点击捕获层仅覆盖左侧Demo区域 */
.v-modal,
.el-message-box__wrapper,
.el-dialog__wrapper {
  right: var(--prd-width, 0px) !important;
}

.v-modal {
  width: auto !important;
}
</style>
