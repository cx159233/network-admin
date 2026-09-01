<template>
  <div class="app-layout" :style="{ '--prd-area-width': prdAreaWidth }">
    <header class="app-header">
      <div class="app-header__left">
        <div class="app-logo__icon">
          <CloudOutlined class="app-logo__icon-svg" />
        </div>
        <span class="app-logo__text">云网管理中枢</span>
      </div>
      <div class="app-header__right">
        <a-tooltip title="公告动态">
          <button class="app-header__icon-btn">
            <BellOutlined />
            <span class="app-header__dot"></span>
          </button>
        </a-tooltip>
        <div class="app-header__divider"></div>
        <a-dropdown placement="bottomRight">
          <button class="app-header__user" @click.prevent>
            <a-avatar :size="28" class="app-header__avatar">{{ avatarText }}</a-avatar>
            <div class="app-header__user-info">
              <div class="app-header__username">{{ userName || '管理员' }}</div>
              <div class="app-header__orgname">{{ orgName || '运营管理平台' }}</div>
            </div>
            <DownOutlined class="app-header__caret" />
          </button>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="goProfile"><SettingOutlined /> 个人中心</a-menu-item>
              <a-menu-divider />
              <div class="app-header__role-tip">点击切换演示角色</div>
              <a-menu-item
                v-for="r in roleList"
                :key="r.key"
                :class="{ 'app-header__role-active': currentRole === r.key }"
                @click="switchRole(r.key)"
              >
                {{ r.orgName }}
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item @click="handleLogout"><LogoutOutlined /> 退出登录</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </header>

    <aside class="app-sider" :class="{ 'app-sider--collapsed': sidebarCollapsed }">
      <nav class="app-sider__nav">
        <sidebar-menu :routes="sidebarRoutes" :collapsed="sidebarCollapsed" :flat-sidebar="flatSidebar" />
      </nav>
      <div class="app-sider__footer">
        <button class="app-sider__toggle" @click="toggleSidebar">
          <MenuUnfoldOutlined v-if="sidebarCollapsed" />
          <MenuFoldOutlined v-else />
        </button>
      </div>
    </aside>

    <main class="app-main" :class="{ 'app-main--prd-open': prdVisible && showPrd }">
      <div v-if="renderError" class="app-render-error">
        <div class="app-render-error__title">页面渲染出错</div>
        <pre class="app-render-error__detail">{{ renderError }}</pre>
      </div>
      <div v-else class="app-main__content" :class="{ 'app-main__content--full-bleed': isFullBleed }">
        <router-view />
      </div>
    </main>

    <!-- 弹层挂载容器：覆盖 Demo 区域（顶部导航+左侧导航+页面内容），右边界与 PRD 分隔条对齐 -->
    <div class="app-overlay"></div>

    <aside class="prd-area" :class="{ 'prd-area--open': prdVisible && showPrd, 'prd-area--visible': showPrd }">
      <div v-if="showPrd" class="prd-divider" @click="prdVisible = !prdVisible">
        <div class="prd-divider-line"></div>
        <div class="prd-divider-btn">
          <DownOutlined class="prd-divider-arrow" :class="{ 'prd-divider-arrow--open': prdVisible }" />
          <span class="prd-divider-text">PRD</span>
        </div>
        <div class="prd-divider-line"></div>
      </div>

      <transition name="prd-panel">
        <div v-if="prdVisible && showPrd" class="prd-panel">
          <div class="prd-header">
            <div class="prd-title">
              <FileTextOutlined class="prd-title-icon" />
              <span class="prd-title-text">产品需求文档</span>
              <span class="prd-title-badge">{{ prdPageName }}</span>
            </div>
            <div class="prd-header-actions">
              <button class="prd-export-btn" @click="exportWord" title="导出 Word">
                <DownloadOutlined />
                <span>导出PRD</span>
              </button>
              <button class="prd-close" @click="prdVisible = false">
                <CloseOutlined />
              </button>
            </div>
          </div>
          <div class="prd-body">
            <div class="prd-toc">
              <div class="prd-toc__title">目录导航</div>
              <div class="prd-toc__list">
                <div
                  v-for="item in prdToc"
                  :key="item.id"
                  class="prd-toc__item"
                  :class="{
                    'prd-toc__item--active': item.id === activeTocAnchor,
                    [`prd-toc__item--level-${item.level}`]: true
                  }"
                  :title="item.text"
                  @click="scrollToTocItem(item.id)"
                >{{ item.text }}</div>
              </div>
            </div>
            <div class="prd-content">
              <div class="prd-doc" v-html="prdContent"></div>
            </div>
          </div>
        </div>
      </transition>
    </aside>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  DownOutlined,
  SettingOutlined,
  LogoutOutlined,
  CloudOutlined,
  FileTextOutlined,
  DownloadOutlined,
  CloseOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import SidebarMenu from './components/Sidebar/SidebarMenu.vue'
import { filterMenusByRole, roleList, roleLabels } from '@/config/roleMenus'
import { getAllPrdHtml, getPrdAnchor, getPrdPageName, getPrdToc } from '@/data/prd'
import emitter from '@/utils/emitter'

export default {
  name: 'Layout',
  components: {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BellOutlined,
    DownOutlined,
    SettingOutlined,
    LogoutOutlined,
    CloudOutlined,
    FileTextOutlined,
    DownloadOutlined,
    CloseOutlined,
    SidebarMenu
  },
  data() {
    return {
      roleList,
      prdVisible: true,
      currentPath: '',
      dialogAnchor: '',
      renderError: null
    }
  },
  errorCaptured(err, vm, info) {
    console.error('[layout errorCaptured]', err, info)
    this.renderError = (err && err.stack) ? err.stack : String(err)
    return false
  },
  computed: {
    ...mapState({ storeSidebar: state => state.app.sidebar }),
    ...mapGetters(['cachedViews', 'name', 'role']),
    sidebarCollapsed() {
      return !this.storeSidebar.opened
    },
    sidebarRoutes() {
      const all = this.$store.getters.sidebarRouters || []
      return filterMenusByRole(all, this.currentRole)
    },
    currentRole() {
      return this.role || 'admin'
    },
    userName() {
      return this.$store.getters.name
    },
    orgName() {
      const r = roleLabels[this.currentRole]
      return r ? r.orgName : ''
    },
    avatarText() {
      const n = this.userName || '管'
      return n.charAt(0)
    },
    routeKey() {
      return this.$route.path
    },
    isFullBleed() {
      return this.$route.meta?.fullBleed === true
    },
    flatSidebar() {
      return this.currentRole === 'developer' || this.currentRole === 'org'
    },
    showPrd() {
      return true
    },
    prdPageName() {
      return getPrdPageName(this.currentPath || '')
    },
    prdContent() {
      return getAllPrdHtml()
    },
    prdToc() {
      return getPrdToc()
    },
    activeTocAnchor() {
      return this.dialogAnchor || getPrdAnchor(this.currentPath || '')
    },
    prdAreaWidth() {
      if (this.prdVisible && this.showPrd) return '708px'
      if (this.showPrd) return '28px'
      return '0px'
    }
  },
  watch: {
    prdVisible() {
      if (this.prdVisible) {
        setTimeout(() => this.scrollToAnchor(), 350)
      }
    },
    currentPath() {
      if (this.prdVisible) {
        setTimeout(() => this.scrollToAnchor(), 350)
      }
    },
    '$route'(to) {
      this.currentPath = to.path
      this.dialogAnchor = ''
      // 上一个页面的渲染错误不阻塞新页面展示
      this.renderError = null
    }
  },
  created() {
    this.currentPath = this.$route.path
    this._prdAnchorHandler = (anchor) => {
      this.dialogAnchor = anchor
      if (this.prdVisible) {
        setTimeout(() => this.scrollToAnchor(), 350)
      }
    }
    emitter.on('set-prd-anchor', this._prdAnchorHandler)
  },
  beforeUnmount() {
    emitter.off('set-prd-anchor', this._prdAnchorHandler)
  },
  methods: {
    toggleSidebar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    goProfile() {
      this.$router.push('/user/profile')
    },
    switchRole(role) {
      this.$store.dispatch('app/switchRole', role)
      const defaultRoutes = {
        admin: '/portal/content/site',
        developer: '/workorder/myApps',
        org: '/workorder/serviceDesk'
      }
      this.$router.push(defaultRoutes[role]).catch(() => {})
    },
    handleLogout() {
      this.$store.dispatch('LogOut').then(() => {
        location.href = window.CONFIG && window.CONFIG.ssoLoginUrl ? window.CONFIG.ssoLoginUrl : '/login'
      })
    },
    exportWord() {
      const html = this.prdContent
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
<style>
  @page WordSection1 {
    size: 595.3pt 841.9pt;
    margin: 72pt 90pt 72pt 90pt;
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
  pre { background: #f5f7fa; padding: 12px; font-size: 13px; line-height: 1.8; }
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
      message.success('导出成功')
    },
    scrollToTocItem(anchor) {
      this.dialogAnchor = anchor
      this.scrollToAnchor()
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
            // 同步滚动 TOC 到当前激活项
            const tocActive = document.querySelector('.prd-toc__item--active')
            if (tocActive) {
              tocActive.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
            }
          } else if (retryCount < 8) {
            setTimeout(() => this.scrollToAnchor(retryCount + 1), 100)
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.app-layout {
  position: relative;
  min-height: 100vh;
  background: #F7F8FA;
}

.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: var(--prd-area-width, 0px);
  z-index: 30;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #E5E6EB;
  padding: 0 16px;
  box-shadow: 0 4px 10px rgba(78, 89, 105, 0.06);
  transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.app-header__left {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 32px;
}

.app-logo__icon {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  background: #165DFF;
}

.app-logo__icon-svg {
  color: #fff;
  font-size: 16px;
}

.app-logo__text {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: #1D2129;
}

.app-header__right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.app-header__icon-btn {
  position: relative;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: #4E5969;
  cursor: pointer;
  transition: all 0.2s;
}

.app-header__icon-btn:hover {
  background: #F2F3F5;
  color: #165DFF;
}

.app-header__dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #F53F3F;
  box-shadow: 0 0 0 2px #fff;
}

.app-header__divider {
  height: 20px;
  width: 1px;
  background: #E5E6EB;
}

.app-header__user {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 6px;
  border-radius: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: background 0.2s;
}

.app-header__user:hover {
  background: #F2F3F5;
}

.app-header__avatar {
  background: linear-gradient(135deg, #165DFF, #0E42D2);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}

.app-header__user-info {
  text-align: left;
  line-height: 1;
}

.app-header__username {
  font-size: 13px;
  font-weight: 600;
  color: #1D2129;
}

.app-header__orgname {
  font-size: 11px;
  color: #86909C;
  margin-top: 2px;
}

.app-header__caret {
  font-size: 11px;
  color: #86909C;
}

.app-header__role-tip {
  padding: 8px 12px 4px;
  font-size: 12px;
  color: #86909C;
  margin-bottom: 4px;
}

.app-header__role-active {
  background: #E8F3FF;
  color: #165DFF;
  font-weight: 500;
}

.app-sider {
  position: fixed;
  top: 60px;
  bottom: 0;
  left: 0;
  z-index: 20;
  width: 220px;
  background: #fff;
  border-right: 1px solid #E5E6EB;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  transition: width 0.2s;
}

.app-sider--collapsed {
  width: 64px;
}

.app-sider__nav {
  flex: 1;
  padding: 8px 12px;
  width: 100%;
}

.app-sider__footer {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 12px;
  gap: 10px;
  width: 100%;
  height: 48px;
  background: #fff;
  border-top: 1px solid #F2F3F5;
}

.app-sider--collapsed .app-sider__footer {
  justify-content: center;
}

.app-sider__toggle {
  width: 24px;
  height: 24px;
  background: #F7F8FA;
  border-radius: 2px;
  border: none;
  display: grid;
  place-items: center;
  cursor: pointer;
  color: #86909C;
  transition: background 0.2s;
}

.app-sider__toggle:hover {
  background: #E5E6EB;
}

.app-main {
  padding: 0;
  margin-top: 60px;
  margin-left: 220px;
  margin-right: var(--prd-area-width, 0px);
  height: calc(100vh - 60px);
  transition: margin-left 0.2s, margin-right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #F7F8FA;
  display: flex;
  flex-direction: row;
  overflow: hidden;
}

.app-render-error {
  flex: 1;
  padding: 24px;
  overflow: auto;
}

.app-render-error__title {
  font-size: 16px;
  font-weight: 600;
  color: #EF4444;
  margin-bottom: 12px;
}

.app-render-error__detail {
  font-size: 12px;
  color: #4E5969;
  line-height: 1.6;
  font-family: "SF Mono", Consolas, monospace;
  white-space: pre-wrap;
  background: #FAFBFC;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #E5E6EB;
}

.app-main__content {
  flex: 1;
  min-width: 0;
  padding: 20px 24px;
  overflow-y: auto;
  height: 100%;
  position: relative;
  /* 创建新的 fixed 定位包含块：挂载进来的弹窗/抽屉蒙层（position: fixed）被限制在内容区域内 */
  transform: translateZ(0);
}

.app-main__content--full-bleed {
  padding: 0;
}

/* 弹层挂载容器（抽屉级）：覆盖整个 Demo 区域（含顶部/左侧导航），z-index 高于 header(30)/sider(20)；transform 创建 fixed 包含块，抽屉蒙层被限制在该区域内；overflow:hidden 裁掉滑入动画溢出部分，抽屉从 Demo 区右边缘滑入 */
.app-overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: var(--prd-area-width, 0px);
  z-index: 40;
  pointer-events: none;
  transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateZ(0);
  overflow: hidden;
}

.app-sider--collapsed ~ .app-main {
  margin-left: 64px;
}

.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* PRD 区域：右侧固定全高容器，承载分隔条与面板 */
.prd-area {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 25;
  display: flex;
  flex-direction: row;
  width: var(--prd-area-width, 0px);
  pointer-events: none;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.prd-area > * {
  pointer-events: auto;
}

/* PRD 分隔条 */
.prd-divider {
  position: relative;
  width: 28px;
  flex-shrink: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  background: #FAFBFC;
  border-left: 1px solid #E5E6EB;
  transition: background 0.2s;
}

.prd-divider:hover {
  background: #E8F3FF;
}

.prd-divider-line {
  width: 1px;
  flex: 1;
  background: #E5E6EB;
}

.prd-divider-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 4px;
  color: #165DFF;
  border-radius: 4px;
  transition: background 0.2s;
}

.prd-divider:hover .prd-divider-btn {
  background: rgba(22, 93, 255, 0.08);
}

.prd-divider-arrow {
  font-size: 12px;
  transition: transform 0.2s;
}

.prd-divider-arrow--open {
  transform: rotate(-90deg);
}

.prd-divider-text {
  font-size: 10px;
  font-weight: 600;
  color: #165DFF;
  writing-mode: vertical-lr;
  letter-spacing: 2px;
}

/* PRD 面板 */
.prd-panel {
  position: relative;
  width: 680px;
  flex-shrink: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-left: 1px solid #E5E6EB;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.prd-body {
  flex: 1;
  display: flex;
  overflow: hidden;
  min-height: 0;
}

/* PRD 目录导航 */
.prd-toc {
  width: 200px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #E5E6EB;
  background: #FAFBFC;
  overflow: hidden;
}

.prd-toc__title {
  padding: 12px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #1D2129;
  border-bottom: 1px solid #E5E6EB;
  flex-shrink: 0;
}

.prd-toc__list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.prd-toc__item {
  padding: 5px 14px;
  font-size: 12px;
  line-height: 1.5;
  color: #4E5969;
  cursor: pointer;
  transition: all 0.15s;
  border-left: 2px solid transparent;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.prd-toc__item:hover {
  background: #E8F3FF;
  color: #165DFF;
}

.prd-toc__item--active {
  background: #E8F3FF;
  color: #165DFF;
  font-weight: 600;
  border-left-color: #165DFF;
}

/* TOC level indentation */
.prd-toc__item--level-1 {
  font-weight: 600;
  font-size: 13px;
  color: #1D2129;
  padding-top: 7px;
  padding-bottom: 7px;
}

.prd-toc__item--level-2 {
  padding-left: 24px;
}

.prd-toc__item--level-3 {
  padding-left: 34px;
}

.prd-toc__item--level-4 {
  padding-left: 44px;
  font-size: 11px;
  color: #86909C;
}

.prd-toc__item--level-5 {
  padding-left: 52px;
  font-size: 11px;
  color: #86909C;
}

.prd-toc__item--level-6 {
  padding-left: 60px;
  font-size: 11px;
  color: #86909C;
}

.prd-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #E5E6EB;
  flex-shrink: 0;
}

.prd-title {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.prd-title-icon {
  font-size: 16px;
  color: #165DFF;
}

.prd-title-text {
  font-size: 14px;
  font-weight: 600;
  color: #1D2129;
}

.prd-title-badge {
  font-size: 12px;
  color: #165DFF;
  background: #E8F3FF;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
}

.prd-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.prd-export-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  font-size: 12px;
  color: #165DFF;
  background: #E8F3FF;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.prd-export-btn:hover {
  background: #165DFF;
  color: #fff;
}

.prd-close {
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border: none;
  background: transparent;
  color: #86909C;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.prd-close:hover {
  background: #F2F3F5;
  color: #1D2129;
}

.prd-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}

.prd-doc {
  color: #333;
  font-size: 14px;
  line-height: 1.8;
}

.prd-doc :deep(h1) {
  font-size: 22px;
  line-height: 1.8;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #165DFF;
}

.prd-doc :deep(h2) {
  font-size: 17px;
  line-height: 1.8;
  font-weight: 600;
  color: #1a1a1a;
  margin-top: 24px;
  margin-bottom: 12px;
  padding-left: 10px;
  border-left: 3px solid #165DFF;
}

.prd-doc :deep(h3) {
  font-size: 15px;
  line-height: 1.8;
  font-weight: 600;
  color: #333;
  margin-top: 16px;
  margin-bottom: 8px;
}

.prd-doc :deep(h4),
.prd-doc :deep(h5),
.prd-doc :deep(h6) {
  font-size: 14px;
  line-height: 1.8;
  font-weight: 600;
  color: #333;
  margin-top: 12px;
  margin-bottom: 6px;
}

.prd-doc :deep(p) {
  margin-bottom: 12px;
  color: #555;
}

.prd-doc :deep(strong) {
  color: #1a1a1a;
  font-weight: 700;
}

.prd-doc :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
  font-size: 13px;
}

.prd-doc :deep(th) {
  background: #f5f7fa;
  padding: 8px 12px;
  text-align: left;
  border: 1px solid #e8ecf0;
  font-weight: 600;
  color: #333;
}

.prd-doc :deep(td) {
  padding: 8px 12px;
  border: 1px solid #e8ecf0;
  color: #555;
}

.prd-doc :deep(ul),
.prd-doc :deep(ol) {
  padding-left: 20px;
  margin-bottom: 12px;
}

.prd-doc :deep(li) {
  margin-bottom: 6px;
  color: #555;
}

.prd-doc :deep(pre) {
  background: #f5f7fa;
  padding: 12px;
  font-size: 13px;
  line-height: 1.8;
  border-radius: 4px;
  overflow-x: auto;
  color: #555;
}

.prd-panel-enter-active,
.prd-panel-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.prd-panel-enter-from,
.prd-panel-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
</style>
