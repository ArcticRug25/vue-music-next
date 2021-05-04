import {
  ref,
  computed,
  watch
} from 'vue'

export default function useBubble(props) {
  const circleRef = ref(0)
  const top = ref(0)
  const showBubble = ref(false)
  //   let t = null

  const bubbleTop = computed(() => {
    if (!circleRef.value) return
    const ANCHOR_HEIGHT = props.bubbleInfo.ANCHOR_HEIGHT
    const initTop = -parseInt(getComputedStyle(circleRef.value).height) / 2 + ANCHOR_HEIGHT
    const topVal = top.value = initTop + (props.bubbleInfo.index * ANCHOR_HEIGHT) - ANCHOR_HEIGHT / 2
    return {
      top: `${topVal}px`
    }
  })

  watch(() => props.bubbleInfo.flag, (n) => {
    n ? showBubble.value = true : showBubble.value = false
  })

  return {
    circleRef,
    bubbleTop,
    showBubble
  }
}
