// Vue 3 移除了 $on/$emit/$off 事件总线 API
// 用一个简单的自定义事件发射器替代 this.$root.$on / $emit
const listeners = {}

export const emitter = {
  on(event, handler) {
    if (!listeners[event]) listeners[event] = []
    listeners[event].push(handler)
    return () => this.off(event, handler)
  },
  off(event, handler) {
    if (!listeners[event]) return
    const idx = listeners[event].indexOf(handler)
    if (idx > -1) listeners[event].splice(idx, 1)
  },
  emit(event, ...args) {
    if (!listeners[event]) return
    listeners[event].slice().forEach(h => {
      try {
        h(...args)
      } catch (e) {
        console.error('[emitter] handler error:', e)
      }
    })
  }
}

export default emitter
