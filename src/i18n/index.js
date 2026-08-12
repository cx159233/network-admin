import { createI18n } from 'vue-i18n'
import Cache from '@/plugins/cache'

import zhCNLocale from './lang/zh-CN'
import zhTWLocale from './lang/zh-TW'
import enLocale from './lang/en'

const messages = {
  'zh-CN': { ...zhCNLocale },
  'zh-TW': { ...zhTWLocale },
  'en': { ...enLocale }
}

export const defaultLang = Cache.local.get('lang') || 'zh-CN'

const i18n = createI18n({
  legacy: true,
  globalInjection: true,
  locale: defaultLang,
  fallbackLocale: defaultLang,
  messages
})

export default i18n
