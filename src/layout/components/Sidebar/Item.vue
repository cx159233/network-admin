<script>
import { h } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'

export default {
  name: 'MenuItem',
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render() {
    const vnodes = []
    if (this.icon) {
      vnodes.push(h(SvgIcon, { iconClass: this.icon }))
    }
    if (this.title) {
      if (this.title.length > 5) {
        vnodes.push(h('span', { slot: 'title', title: this.title }, this.title))
      } else {
        vnodes.push(h('span', { slot: 'title' }, this.title))
      }
    }
    return vnodes
  }
}
</script>
