<template>
  <div class="sidebar-submenu">
    <button
      type="button"
      class="sidebar-submenu__title"
      :class="{ 'sidebar-submenu__title--active': isParentActive }"
      @click="toggleExpand"
    >
      <span class="sidebar-submenu__icon" v-if="route.meta && route.meta.icon">
        <svg-icon :icon-class="route.meta.icon" />
      </span>
      <span class="sidebar-submenu__label" v-if="!collapsed">{{ route.meta && route.meta.title || route.name }}</span>
      <DownOutlined
        v-if="!collapsed"
        class="sidebar-submenu__caret"
        :class="{ 'sidebar-submenu__caret--expanded': expanded || isParentActive }"
      />
    </button>
    <div class="sidebar-submenu__children" v-show="(expanded || isParentActive) && !collapsed">
      <template v-for="child in visibleChildren" :key="resolveChildPath(child.path)">
        <sidebar-sub-menu
          v-if="hasChildren(child)"
          :route="child"
          :base-path="fullPath"
        />
        <router-link
          v-else
          :to="resolveChildPath(child.path)"
          class="sidebar-submenu__item"
          :class="{ 'sidebar-submenu__item--active': isActive(resolveChildPath(child.path)) }"
        >
          <span class="sidebar-submenu__item-label">{{ child.meta && child.meta.title || child.name }}</span>
        </router-link>
      </template>
    </div>
  </div>
</template>

<script>
import { DownOutlined } from '@ant-design/icons-vue'
import SvgIcon from '@/components/SvgIcon/index.vue'

export default {
  name: 'SidebarSubMenu',
  components: { DownOutlined, SvgIcon },
  props: {
    route: { type: Object, required: true },
    basePath: { type: String, default: '' },
    collapsed: { type: Boolean, default: false }
  },
  data() {
    return {
      expanded: false
    }
  },
  computed: {
    fullPath() {
      return this.resolvePath(this.route.path)
    },
    visibleChildren() {
      return (this.route.children || []).filter(c => !c.hidden)
    },
    isParentActive() {
      return this.visibleChildren.some(c => this.isActive(this.resolveChildPath(c.path)))
    }
  },
  watch: {
    $route: {
      handler(to) {
        if (this.isParentActive) {
          this.expanded = true
        }
      },
      immediate: true
    }
  },
  methods: {
    hasChildren(route) {
      return route.children && route.children.filter(c => !c.hidden).length > 0
    },
    resolvePath(routePath) {
      if (routePath.startsWith('/')) {
        return routePath
      }
      const base = this.basePath.endsWith('/') ? this.basePath.slice(0, -1) : this.basePath
      return `${base}/${routePath}`.replace(/\/+/g, '/')
    },
    resolveChildPath(childPath) {
      if (childPath.startsWith('/')) {
        return childPath
      }
      const base = this.fullPath.endsWith('/') ? this.fullPath.slice(0, -1) : this.fullPath
      return `${base}/${childPath}`.replace(/\/+/g, '/')
    },
    isActive(path) {
      const meta = this.$route.meta || {}
      const current = meta.activeMenu || this.$route.path
      return current === path || current.startsWith(path + '/')
    },
    toggleExpand() {
      this.expanded = !this.expanded
    }
  }
}
</script>

<style scoped>
.sidebar-submenu {
  margin-bottom: 2px;
}

.sidebar-submenu__title {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  padding: 0 8px;
  border-radius: 6px;
  font-size: 14px;
  color: #4E5969;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
  text-align: left;
}

.sidebar-submenu__title:hover {
  background: #F7F8FA;
  color: #165DFF;
}

.sidebar-submenu__title--active {
  color: #165DFF;
  font-weight: 500;
}

.sidebar-submenu__icon {
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #86909C;
}

.sidebar-submenu__title--active .sidebar-submenu__icon,
.sidebar-submenu__title:hover .sidebar-submenu__icon {
  color: #165DFF;
}

.sidebar-submenu__label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-submenu__caret {
  font-size: 10px;
  color: rgba(134, 144, 156, 0.6);
  transition: transform 0.2s, color 0.2s;
  flex-shrink: 0;
}

.sidebar-submenu__caret--expanded {
  transform: rotate(180deg);
  color: rgba(22, 93, 255, 0.7);
}

.sidebar-submenu__children {
  padding-top: 2px;
}

.sidebar-submenu__item {
  display: flex;
  align-items: center;
  height: 40px;
  margin-bottom: 2px;
  padding: 0 8px 0 34px;
  border-radius: 6px;
  font-size: 14px;
  color: #4E5969;
  text-decoration: none;
  transition: all 0.2s;
  overflow: hidden;
}

.sidebar-submenu__item:hover {
  background: #F7F8FA;
  color: #165DFF;
}

.sidebar-submenu__item--active {
  background: #F2F3F5;
  color: #165DFF;
  font-weight: 500;
}

.sidebar-submenu__item-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
