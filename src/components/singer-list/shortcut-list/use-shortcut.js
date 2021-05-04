import {
  ref,
  computed
} from 'vue'

export default function useShortcut(props, emit) {
  const ANCHOR_HEIGHT = 18
  //   const BUBBLE_SHOW_TIME = 1000
  const touch = {}
  //   let t = null
  const bubbleInfo = ref({})

  const shortcutList = computed(() => {
    return props.data.map((group) => {
      return group.title
    })
  })

  function onShortcutTouchStart(e) {
    const anchorIndex = parseInt(e.target.dataset.index)
    touch.y1 = e.touches[0].pageY
    touch.anchorIndex = anchorIndex

    scrollTo(anchorIndex)
  }

  function onShortcutTouchMove(e) {
    touch.y2 = e.touches[0].pageY
    // | 或 向下取整 等同于 Math.floor
    const delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0
    // 当手指移出时，保证index在 0 ~ shortcutList.value.length - 1 之间
    const anchorIndex = touch.anchorIndex + delta

    scrollTo(anchorIndex)
  }

  function onShortcutTouchEnd() {
    bubbleInfo.value.flag = false
  }

  function scrollTo(index) {
    if (isNaN(index)) return
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    bubbleInfo.value = {
      index,
      text: shortcutList.value[index],
      flag: true,
      ANCHOR_HEIGHT
    }
    emit('scrollTo', index)
  }

  return {
    bubbleInfo,
    shortcutList,
    onShortcutTouchStart,
    onShortcutTouchMove,
    onShortcutTouchEnd
  }
}
