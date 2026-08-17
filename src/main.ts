import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

import Cookies from 'js-cookie'
import i18n from './i18n'
import App from './App.vue'
import router from './router'
import store from './store'
import { parsePermi } from './utils/permission'

import './styles.css'
import 'virtual:svg-icons-register'
import './permission'
import directive from './directive'
import plugins from './plugins'

import { getDicts } from '@/api/system/dict/data'
import { getConfigKey } from '@/api/system/config'
import { getDicts as fetchDicts } from '@/api/admin/index'
import DataDict from '@/utils/dict'
import { download, exportExcel } from '@/utils/request'
import {
  parseTime,
  resetForm,
  addDateRange,
  selectDictLabel,
  selectDictLabels,
  handleTree,
  transferDuration
} from '@/utils/chestnut'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(Antd)
app.use(i18n)

// 全局方法挂载（Vue 3 用 globalProperties 替代 prototype）
app.config.globalProperties.getDicts = getDicts
app.config.globalProperties.getConfigKey = getConfigKey
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.selectDictLabels = selectDictLabels
app.config.globalProperties.download = download
app.config.globalProperties.exportExcel = exportExcel
app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.transferDuration = transferDuration
app.config.globalProperties.$p = parsePermi
app.config.globalProperties.$storage = Cookies

// 全局组件注册（阶段 2/3 适配后逐个恢复）
import Pagination from '@/components/Pagination/index.vue'
app.component('Pagination', Pagination)
// app.component('DictTag', DictTag)
// app.component('RightToolbar', RightToolbar)
// app.component('Editor', Editor)
// app.component('FileUpload', FileUpload)
// app.component('ImageUpload', ImageUpload)
// app.component('ImagePreview', ImagePreview)

// 自定义指令与插件
app.use(directive)
app.use(plugins)

// 字典插件（dicts 选项支持，dict.type.XXX 数据来源）
function searchDictByKey(dict: any, key: string) {
  if (key == null || key === '') return null
  try {
    for (let i = 0; i < dict.length; i++) {
      if (dict[i].key == key) return dict[i].value
    }
  } catch (e) {
    return null
  }
}
app.use(DataDict as any, {
  metas: {
    '*': {
      labelField: 'dictLabel',
      valueField: 'dictCode',
      request(dictMeta: any) {
        const storeDict = searchDictByKey(store.getters.dict, dictMeta.type)
        if (storeDict) {
          return Promise.resolve(storeDict)
        }
        return fetchDicts(dictMeta.type).then((res: any) => {
          store.dispatch('dict/setDict', { key: dictMeta.type, value: res.rows })
          return res.rows
        })
      },
    },
  },
})

try {
  app.mount('#app')
} catch (e) {
  console.error('[mount error]', e)
  const loader = document.getElementById('app-loader')
  if (loader) {
    loader.innerHTML = `
      <div style="text-align:center;max-width:560px;padding:24px;border-radius:8px;background:#fff;border:1px solid #FEF0C7;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
        <div style="font-size:14px;font-weight:600;color:#EF4444;margin-bottom:8px;">系统启动失败</div>
        <div style="font-size:12px;color:#4E5969;line-height:1.6;font-family:SF Mono,Consolas,monospace;white-space:pre-wrap;text-align:left;">${(e && e.stack) || String(e)}</div>
      </div>`
  }
}

// 兜底移除 loading（Vue mount 成功后会替换 #app 内容，loader 也会被移除；
// 此处用 setTimeout 处理 mount 异步失败的情况）
setTimeout(() => {
  const loader = document.getElementById('app-loader')
  if (loader) {
    loader.classList.add('hide')
    setTimeout(() => loader.remove(), 300)
  }
}, 800)
