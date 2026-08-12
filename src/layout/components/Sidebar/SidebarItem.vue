<template>
  <div v-if="!item.hidden">
    <!-- 平铺模式：机构/开发者侧边栏，一级菜单作为小字分组标题，二级菜单直接展示 -->
    <template v-if="flatMode && hasMultipleShowingChildren(item)">
      <div class="flat-group-title">
        {{ item.meta && item.meta.title || item.name }}
      </div>
      <sidebar-item
        v-for="child in showingChildren(item)"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu flat-child"
      />
    </template>

    <!-- 分类标题：小字展示 + 渲染子菜单 -->
    <template v-else-if="item.meta && item.meta.category">
      <div class="category-title">
        {{ item.meta.title }}
      </div>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="isNest"
        :item="child"
        :base-path="getChildBasePath(child.path)"
        :category-prefix="item.path"
        class="nest-menu"
      />
    </template>

    <!-- 普通菜单项 -->
    <template v-else-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path, onlyOneChild.query)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <item :icon="onlyOneChild.meta.icon" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="submenuIndex" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        :category-prefix="categoryPrefix"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<style scoped>
.category-title {
  padding: 12px 20px 6px;
  font-size: 12px;
  color: #909399;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.flat-group-title {
  padding: 12px 8px 4px;
  font-size: 11px;
  color: #86909C;
  font-weight: 600;
  letter-spacing: 0.4px;
}

.flat-child :deep(.el-menu-item) {
  padding-left: 8px !important;
}
</style>

<script>
import { resolve as pathResolve } from '@/utils/path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    },
    categoryPrefix: {
      type: String,
      default: ''
    }
  },
  data() {
    this.onlyOneChild = null
    return {}
  },
  computed: {
    flatMode() {
      return this.$route.path.startsWith('/workorder')
    },
    submenuIndex() {
      const resolved = this.resolvePath(this.item.path)
      return this.categoryPrefix ? resolved + '__' + this.categoryPrefix : resolved
    }
  },
  methods: {
    hasMultipleShowingChildren(item) {
      const children = (item.children || []).filter(c => !c.hidden)
      return children.length > 1
    },
    showingChildren(item) {
      return (item.children || []).filter(c => !c.hidden)
    },
    hasOneShowingChild(children = [], parent) {
      if (!children) {
        children = [];
      }
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          this.onlyOneChild = item
          return true
        }
      })

      if (showingChildren.length === 1) {
        return true
      }

      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath, routeQuery) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      if (routeQuery) {
        let query = JSON.parse(routeQuery);
        return { path: pathResolve(this.basePath, routePath), query: query }
      }
      return pathResolve(this.basePath, routePath)
    },
    getChildBasePath(childPath) {
      const parentBase = this.resolvePath('..')
      return pathResolve(parentBase, childPath)
    }
  }
}
</script>
