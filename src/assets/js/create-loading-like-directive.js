import {
  createApp
} from 'vue'
import {
  addClass,
  removeClass
} from '@/assets/js/dom'

const relativeCls = 'g-relative'

export default function createLoadingLikeDirective(Comp) {
  const name = Comp.name

  const append = (el) => {
    const style = getComputedStyle(el)
    if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
      addClass(el, relativeCls)
    }
    el.appendChild(el[name].instance.$el)
  }

  const remove = (el) => {
    removeClass(el, relativeCls)
    el.removeChild(el[name].instance.$el)
  }

  return {
    mounted(el, binding) {
      const app = createApp(Comp)
      // v-xxx:[text] => binding.arg = text
      const title = binding.arg
      const instance = app.mount(document.createElement('div'))
      // 当一个元素同时绑定多个指令时，防止覆盖
      if (!el[name]) {
        el[name] = {}
      }
      el[name].instance = instance

      if (typeof title !== 'undefined') {
        instance.setTitle(title)
      }

      if (binding.value) {
        append(el)
      }
    },
    updated(el, binding) {
      const title = binding.arg
      if (typeof title !== 'undefined') {
        el[name].instance.setTitle(title)
      }

      if (binding.value !== binding.oldValue) {
        binding.value ? append(el) : remove(el)
      }
    }
  }
}
