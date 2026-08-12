import axios from 'axios'
import { message, notification, Modal, Spin } from 'ant-design-vue'
import store from '@/store'
import { getToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import { tansParams, blobValidate } from '@/utils/chestnut'
import cache from '@/plugins/cache'
import { saveAs } from 'file-saver'
import i18n from '@/i18n'

let downloadLoadingInstance
// 是否显示重新登录
export let isRelogin = { show: false }

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 600000
})

// request拦截器
service.interceptors.request.use(config => {
  const nonToken = (config.headers || {}).isToken === false
  const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
  if (getToken() && !nonToken) {
    if (cache.local.get('CurrentSite')) {
      config.headers['CurrentSite'] = cache.local.get('CurrentSite')
    }
  }
  if (config.url.includes('/gdmercury-api')) {
    delete config.headers['Authorization']
    config.baseURL = ''
  }
  if (config['CSRF-Token']) {
    config.headers['csrf-token'] = config['CSRF-Token']
  }
  config.headers['Accept-Language'] = i18n.global.locale
  if (config.method === 'get' && config.params) {
    let url = config.url + '?' + tansParams(config.params)
    url = url.slice(0, -1)
    config.params = {}
    config.url = url
  }
  if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
    const requestObj = {
      url: config.url,
      data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
      time: new Date().getTime()
    }
    const sessionObj = cache.session.getJSON('sessionObj')
    if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
      cache.session.setJSON('sessionObj', requestObj)
    } else {
      const s_url = sessionObj.url
      const s_data = sessionObj.data
      const s_time = sessionObj.time
      const interval = 1000
      if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
        const msg = i18n.global.t('Common.RepeatSubmit')
        console.warn(`[${s_url}]: ` + msg)
        return Promise.reject(new Error(msg))
      } else {
        cache.session.setJSON('sessionObj', requestObj)
      }
    }
  }
  if (config.method === 'put' || config.method === 'delete') {
    config.headers['change-method'] = config.method
    config.method = 'post'
  }
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
  const code = res.data.code || 200
  const msg = errorCode[code] || res.data.msg || errorCode['default']
  if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
    return res.data
  }
  if (code === 401) {
    if (!isRelogin.show) {
      isRelogin.show = true
      Modal.confirm({
        title: i18n.global.t('Common.SystemTip'),
        content: i18n.global.t('Common.SessionExpired'),
        okText: i18n.global.t('Common.Relogin'),
        cancelText: i18n.global.t('Common.Cancel'),
        onOk() {
          isRelogin.show = false
          window.location.href = window.CONFIG.ssoLoginUrl
        },
        onCancel() {
          isRelogin.show = false
        }
      })
    }
    return Promise.reject(i18n.global.t('Common.InvalidSession'))
  } else if (code === 500) {
    message.error(msg)
    return Promise.reject('error')
  } else if (code === 601) {
    message.warning(msg)
    return Promise.reject('error')
  } else if (code !== 200) {
    console.log(res.data)
    notification.error({ message: msg })
    return Promise.reject('error')
  } else {
    return res.data
  }
}, error => {
  console.log('err' + error)
  let { message: errMsg } = error
  if (errMsg === 'Network Error') {
    errMsg = i18n.global.t('Common.ServerConnectFailed')
  } else if (errMsg.includes('timeout')) {
    errMsg = i18n.global.t('Common.ServerConnectTimeout')
  } else if (errMsg.includes('Request failed with status code')) {
    errMsg = i18n.global.t('Common.ServerApiError', [errMsg.substr(errMsg.length - 3)])
  }
  message.error(errMsg, 5)
  return Promise.reject(error)
})

export function exportExcel(url, params, filename, config) {
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'cc-export': 1 }
  return download0(url, params, filename, headers, config)
}

export function download(url, params, filename, config) {
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
  return download0(url, params, filename, headers, config)
}

function download0(url, params, filename, headers, config) {
  const hide = message.loading(i18n.global.t('Common.Downloading'), 0)
  downloadLoadingInstance = { close: hide }
  return service.post(url, params, {
    transformRequest: [(params) => { return tansParams(params) }],
    headers: headers,
    responseType: 'blob',
    ...config
  }).then(async (data) => {
    const isLogin = await blobValidate(data)
    if (isLogin) {
      const blob = new Blob([data])
      saveAs(blob, filename)
    } else {
      const resText = await data.text()
      const rspObj = JSON.parse(resText)
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
      message.error(errMsg)
    }
    hide()
  }).catch((r) => {
    console.error(r)
    message.error(i18n.global.t('Common.DownloadFailed'))
    hide()
  })
}

export default service
