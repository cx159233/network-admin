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
  // 如果已经生成过动态路由，直接放行
  if(store.getters.permission_routes.length > 7)  {
    NProgress.done()
    return next()
  }

  // 尝试获取用户信息，失败也继续生成路由
  const generateRoutesAndGo = () => {
    store.dispatch('GenerateRoutes').then(accessRoutes => {
      router.addRoutes(accessRoutes)
      next({ ...to, replace: true })
    })
  }

  store.dispatch('GetInfo').then(() => {
    isRelogin.show = false
    generateRoutesAndGo()
  }).catch(err => {
    // API失败也继续生成路由，不跳转登录页
    console.warn('GetInfo failed:', err)
    generateRoutesAndGo()
  })
})

router.afterEach(() => {
  NProgress.done()
})
