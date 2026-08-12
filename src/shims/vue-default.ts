export * from 'vue'
import * as Vue from 'vue'

const VueWithDefault = {
  ...Vue,
  default: Vue,
  prototype: {
    $isServer: false,
    $el: undefined as any,
    $options: {} as any,
    $parent: undefined as any,
    $root: undefined as any,
    $children: [] as any[],
    $refs: {} as any,
    $slots: {} as any,
    $scopedSlots: {} as any,
  },
  extend: (options: any) => options,
  component: (_name: string, component: any) => component,
  directive: (_name: string, directive: any) => directive,
  use: (_plugin: any, ..._args: any[]) => _plugin,
  set: (target: any, key: string | number | symbol, value: any) => {
    target[key] = value
    return value
  },
  delete: (target: any, key: string | number | symbol) => {
    const hadKey = Object.prototype.hasOwnProperty.call(target, key)
    delete target[key]
    return hadKey
  },
  nextTick: Vue.nextTick,
}

export default VueWithDefault
