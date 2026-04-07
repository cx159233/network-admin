<template>
  <div v-if="!item.hidden">
    <!-- 分类标题：小字展示 + 渲染子菜单 -->
    <template v-if="item.meta && item.meta.category">
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
</style>

<script>
import pathModule from 'path'
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
    submenuIndex() {
      const resolved = this.resolvePath(this.item.path)
      return this.categoryPrefix ? resolved + '__' + this.categoryPrefix : resolved
    }
  },
  methods: {
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
        return { path: pathModule.resolve(this.basePath, routePath), query: query }
      }
      return pathModule.resolve(this.basePath, routePath)
    },
    // For category items: skip the category's own path and resolve child from parent level
    getChildBasePath(childPath) {
      const parentBase = this.resolvePath('..')
      return pathModule.resolve(parentBase, childPath)
    }
  }
}
</script>
