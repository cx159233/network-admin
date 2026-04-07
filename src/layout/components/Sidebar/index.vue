<template>
  <div
    :class="{ 'has-logo': showLogo }"
    :style="{
      backgroundColor:
        settings.sideTheme === 'theme-dark'
          ? variables.menuBackground
          : variables.menuLightBackground,
    }"
  >
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="
          settings.sideTheme === 'theme-dark'
            ? variables.menuBackground
            : variables.menuLightBackground
        "
        :text-color="
          settings.sideTheme === 'theme-dark'
            ? variables.menuColor
            : variables.menuLightColor
        "
        :unique-opened="true"
        :active-text-color="settings.theme"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="(route, index) in filteredSidebarRouters"
          :key="route.path + index"
          :item="route"
          :base-path="getBasePath(route)"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/assets/styles/variables.scss";

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapState(["settings"]),
    ...mapGetters(["sidebar", "sidebarRouters"]),
    filteredSidebarRouters() {
      // 根据当前路由返回对应的侧边栏菜单
      const currentPath = this.$route.path;
      if (currentPath.startsWith('/workorder')) {
        // 工单中心 - 只显示工单中心的菜单
        const workorderRoute = this.sidebarRouters.find(r => r.path === '/workorder' || r.path === 'workorder');
        return workorderRoute && workorderRoute.children ? workorderRoute.children : [];
      } else if (currentPath.startsWith('/portal')) {
        // 门户管理 - 只显示门户管理的菜单
        const portalRoute = this.sidebarRouters.find(r => r.path === '/portal' || r.path === 'portal');
        return portalRoute && portalRoute.children ? portalRoute.children : [];
      }
      // 默认返回空
      return [];
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  methods: {
    getBasePath(route) {
      // 根据当前路由确定基础路径
      const currentPath = this.$route.path;
      if (currentPath.startsWith('/workorder')) {
        return '/workorder/' + route.path;
      }
      return '/portal/' + route.path;
    }
  }
};
</script>
<style scoped lang="scss">
::v-deep .nest-menu {
  background: #1890ff !important;
  //蓝色
}
::v-deep .is-active {
  background: #1890ff !important;
  color: white !important;
}
::v-deep .el-submenu__title:hover {
  background: #1890ff !important;
  color: white !important;
}
::v-deep .el-menu-item:hover {
  background: #1890ff !important;
  color: white !important;
}
</style>
