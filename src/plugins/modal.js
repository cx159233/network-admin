import i18n from '@/i18n'
import { message, notification, Modal } from 'ant-design-vue'

let loadingHide = null

export default {
  msg(content) {
    message.info(content)
  },
  msgError(content) {
    message.error(content)
  },
  msgSuccess(content) {
    message.success(content)
  },
  msgWarning(content) {
    message.warning(content)
  },
  alert(content) {
    Modal.info({ title: i18n.global.t('Common.SystemTip'), content })
  },
  alertError(content) {
    Modal.error({ title: i18n.global.t('Common.SystemTip'), content })
  },
  alertSuccess(content) {
    Modal.success({ title: i18n.global.t('Common.SystemTip'), content })
  },
  alertWarning(content) {
    Modal.warning({ title: i18n.global.t('Common.SystemTip'), content })
  },
  notify(content) {
    notification.info({ message: content })
  },
  notifyError(content) {
    notification.error({ message: content })
  },
  notifySuccess(content) {
    notification.success({ message: content })
  },
  notifyWarning(content) {
    notification.warning({ message: content })
  },
  confirm(content) {
    return new Promise((resolve, reject) => {
      Modal.confirm({
        title: i18n.global.t('Common.SystemTip'),
        content,
        okText: i18n.global.t('Common.Confirm'),
        cancelText: i18n.global.t('Common.Cancel'),
        onOk: () => resolve(true),
        onCancel: () => reject(new Error('cancel'))
      })
    })
  },
  prompt(content) {
    return new Promise((resolve, reject) => {
      let inputValue = ''
      Modal.confirm({
        title: i18n.global.t('Common.SystemTip'),
        content: () => content,
        okText: i18n.global.t('Common.Confirm'),
        cancelText: i18n.global.t('Common.Cancel'),
        onOk: () => resolve(inputValue),
        onCancel: () => reject(new Error('cancel'))
      })
    })
  },
  loading(content) {
    if (loadingHide) loadingHide()
    loadingHide = message.loading(content, 0)
  },
  closeLoading() {
    if (loadingHide) {
      loadingHide()
      loadingHide = null
    }
  }
}
