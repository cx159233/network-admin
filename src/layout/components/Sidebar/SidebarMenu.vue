<template>
  <div class="sidebar-menu">
    <!-- flatSidebar 平铺模式：容器节点作为分组标题，叶子菜单直接展开 -->
    <template v-if="flatSidebar">
      <template v-for="(item, idx) in flatItems" :key="idx">
        <div
          v-if="item.type === 'group'"
          v-show="!collapsed"
          class="sidebar-group-title"
          :class="{ 'sidebar-group-title--sub': item.sub }"
        >
          {{ item.label }}
        </div>
        <router-link
          v-else
          :to="item.path"
          class="sidebar-item"
          :class="{ 'sidebar-item--active': isActive(item.path) }"
          :title="item.label"
        >
          <span class="sidebar-item__label" v-if="!collapsed">{{ item.label }}</span>
        </router-link>
      </template>
    </template>

    <!-- 普通模式：可折叠子菜单 -->
    <template v-else>
      <template v-for="route in visibleRoutes" :key="resolvePath(route.path)">
        <sidebar-sub-menu
          v-if="hasChildren(route)"
          :route="route"
          :base-path="basePath"
          :collapsed="collapsed"
        />
        <router-link
          v-else
          :to="resolvePath(route.path)"
          class="sidebar-item"
          :class="{ 'sidebar-item--active': isActive(resolvePath(route.path)) }"
        >
          <span class="sidebar-item__icon" v-if="route.meta && route.meta.icon">
            <svg-icon :icon-class="route.meta.icon" />
          </span>
          <span class="sidebar-item__label" v-if="!collapsed">{{ route.meta && route.meta.title || route.name }}</span>
        </router-link>
      </template>
    </template>
  </div>
</template>

<script>
import SidebarSubMenu from './SidebarSubMenu.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'

export default {
  name: 'SidebarMenu',
  components: { SidebarSubMenu, SvgIcon },
  props: {
    routes: { type: Array, default: () => [] },
    basePath: { type: String, default: '' },
    collapsed: { type: Boolean, default: false },
    flatSidebar: { type: Boolean, default: false }
  },
  computed: {
    visibleRoutes() {
      return (this.routes || []).filter(r => !r.hidden)
    },
    flatItems() {
      if (!this.flatSidebar) return []
      const items = []
      this.visibleRoutes.forEach(route => {
        const routePath = this.resolvePath(route.path)
        if (this.hasChildren(route)) {
          items.push({ type: 'group', label: this.routeTitle(route) })
          this.visibleChildrenOf(route).forEach(child => {
            const childPath = this.joinPath(routePath, child.path)
            if (this.hasChildren(child)) {
              items.push({ type: 'group', label: this.routeTitle(child), sub: true })
              this.visibleChildrenOf(child).forEach(gc => {
                const gcPath = this.joinPath(childPath, gc.path)
                items.push({ type: 'item', label: this.routeTitle(gc), path: gcPath })
              })
            } else {
              items.push({ type: 'item', label: this.routeTitle(child), path: childPath })
            }
          })
        } else {
          items.push({ type: 'item', label: this.routeTitle(route), path: routePath, icon: route.meta && route.meta.icon })
        }
      })
      return items
    }
  },
  methods: {
    hasChildren(route) {
      return route.children && route.children.filter(c => !c.hidden).length > 0
    },
    visibleChildrenOf(route) {
      return (route.children || []).filter(c => !c.hidden)
    },
    routeTitle(route) {
      return (route.meta && route.meta.title) || route.name || ''
    },
    resolvePath(routePath) {
      if (routePath.startsWith('/')) {
        return routePath
      }
      const base = this.basePath.endsWith('/') ? this.basePath.slice(0, -1) : this.basePath
      return `${base}/${routePath}`.replace(/\/+/g, '/')
    },
    joinPath(parentPath, childPath) {
      if (childPath.startsWith('/')) {
        return childPath.replace(/\/+/g, '/')
      }
      const base = parentPath.endsWith('/') ? parentPath.slice(0, -1) : parentPath
      return `${base}/${childPath}`.replace(/\/+/g, '/')
    },
    isActive(path) {
      const meta = this.$route.meta || {}
      const current = meta.activeMenu || this.$route.path
      return current === path || current.startsWith(path + '/')
    }
  }
}
</script>

<style scoped>
.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  padding: 0 8px;
  border-radius: 6px;
  font-size: 14px;
  color: #4E5969;
  text-decoration: none;
  transition: all 0.2s;
  overflow: hidden;
}

.sidebar-item:hover {
  background: #F7F8FA;
  color: #165DFF;
}

.sidebar-item--active {
  background: #F2F3F5;
  color: #165DFF;
  font-weight: 500;
}

.sidebar-item__icon {
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #86909C;
}

.sidebar-item--active .sidebar-item__icon {
  color: #165DFF;
}

.sidebar-item__label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* flatSidebar 分组标题 */
.sidebar-group-title {
  padding: 12px 8px 4px;
  font-size: 11px;
  font-weight: 600;
  color: #86909C;
  letter-spacing: 0.05em;
  line-height: 1.4;
}

.sidebar-group-title--sub {
  padding-top: 8px;
  padding-left: 8px;
  font-weight: 500;
}
</style>
