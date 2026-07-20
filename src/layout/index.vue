<template>
  <div :class="classObj" class="app-wrapper" :style="{'--current-color': theme}">
    <!-- 顶部导航 -->
    <div class="top-nav-container">
      <top-nav />
    </div>
    <div class="main-content">
      <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
      <sidebar v-if="!sidebar.hide && showNav === '1'" class="sidebar-container" />
      <div :class="{hasTagsView:needTagsView,sidebarHide:sidebar.hide,'ml-0': showNav !== '1'}" class="main-container">
        <div :class="{'fixed-header':fixedHeader}" v-if="showNav === '1'">
          <navbar />
          <tags-view v-if="needTagsView" />
        </div>
        <app-main />
        <right-panel>
          <settings />
        </right-panel>
      </div>
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import TopNav from '@/components/TopNav'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
import variables from '@/assets/styles/variables.scss'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView,
    TopNav
  },
  data() {
    return {
      showNav: this.$route.query.showNav || "1",
    }
  },
  watch: {
    $route: {
      handler() {
        // 当路由是系统管理时，隐藏左侧导航
        if (this.$route.path.startsWith('/system')) {
          this.showNav = "0";
        } else {
          this.showNav = "1";
        }
      },
      immediate: true
    }
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      theme: state => state.settings.theme,
      sideTheme: state => state.settings.sideTheme,
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    variables() {
      return variables;
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/mixin.scss";
  @import "~@/assets/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    &.mobile.openSidebar {
      position: fixed;
      top: 50px;
    }
  }

  .top-nav-container {
    height: 50px;
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 21, 41, 0.1);
    flex-shrink: 0;
    position: relative;
    z-index: 1001;
  }

  .sidebar-container {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: $base-sidebar-width;
    z-index: 1000;
    transition: width 0.28s;
  }

  .main-content {
    flex: 1;
    display: flex;
    min-height: 0;
    position: relative;
    z-index: 0;
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 50px;
    height: 100%;
    position: absolute;
    z-index: 998;
  }

  .main-container {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .fixed-header {
    position: sticky;
    top: 0;
    z-index: 9;
    width: 100%;
    transition: width 0.28s;
    flex-shrink: 0;
  }

  .sidebarHide .fixed-header {
    width: 100%;
  }

  .mobile .fixed-header {
    width: 100%;
  }
  .ml-0{
    margin-left: 0 !important;
  }
</style>
