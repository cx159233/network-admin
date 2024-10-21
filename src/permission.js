import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { isRelogin } from '@/utils/request'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect', '/bind', '/register']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if(store.getters.permissions.length>0)  {
    NProgress.done()
    return next()
  }
  store.dispatch('GetInfo').then(() => {
    isRelogin.show = false
    store.dispatch('GenerateRoutes').then(accessRoutes => {
      // 根据roles权限生成可访问的路由表
      router.addRoutes(accessRoutes) // 动态添加可访问路由表
      next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
    })
  }).catch(err => {
      store.dispatch('LogOut').then(() => {
        Message.error(err)
        // window.location.href = '/'
      })
    })
    NProgress.done()
    next()
})

router.afterEach(() => {
  NProgress.done()
})
