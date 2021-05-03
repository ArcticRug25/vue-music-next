import BScroll from '@better-scroll/core'
import ObesrveDOM from '@better-scroll/observe-dom'
import {
  onMounted,
  onUnmounted,
  ref
} from 'vue'

BScroll.use(ObesrveDOM)

export default function useScroll(wrapperRef, options) {
  const scroll = ref(null)

  onMounted(() => {
    scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options
    })
  })

  onUnmounted(() => {
    scroll.value.destory()
  })
}
