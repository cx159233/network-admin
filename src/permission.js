import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { isRelogin } from '@/utils/request'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect', '/bind', '/register']

router.beforeEach((to, from, next) => {
  NProgress.start()
  // 路由已在 constantRoutes 中静态注册，直接放行
  // 仅在首次进入时生成侧边栏菜单数据
  if (store.getters.permission_routes.length === 0) {
    store.dispatch('GenerateRoutes').then(() => {
      isRelogin.show = false
      next()
    }).catch(() => {
      next()
    })
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})
