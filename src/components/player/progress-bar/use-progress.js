import {
  ref,
  computed,
  watch
} from 'vue'

const progressBtnWidth = 16

export default function useProgress(props, emit) {
  const touch = {}
  const offset = ref(0)
  const progressBarRef = ref(null)
  const progressRef = ref(null)

  const progressStyle = computed(() => `width:${offset.value}px`)
  const btnStyle = computed(
    () => `transform:translate3d(${offset.value}px,0,0)`
  )

  watch(() => props.progress, newProgress => {
    setOffset(newProgress)
  })

  function onTouchStart(e) {
    touch.x1 = e.touches[0].pageX
    touch.beginWidth = progressRef.value.clientWidth
  }

  function setOffset(progress) {
    const barWidth = progressBarRef.value.clientWidth - progressBtnWidth
    offset.value = barWidth * progress
  }

  function onTouchMove(e) {
    const delta = e.touches[0].pageX - touch.x1
    const tempWidth = touch.beginWidth + delta
    const barWidth = progressBarRef.value.clientWidth - progressBtnWidth
    const progress = Math.min(1, Math.max(0, tempWidth / barWidth))
    offset.value = barWidth * progress
    emit('progress-changing', progress)
  }

  function onTouchEnd() {
    const barWidth = progressBarRef.value.clientWidth - progressBtnWidth
    const progress = progressRef.value.clientWidth / barWidth
    emit('progress-changed', progress)
  }

  function onClick(e) {
    const rect = progressBarRef.value.getBoundingClientRect()
    const offsetWidth = e.pageX - rect.left
    const progress = offsetWidth / (rect.right - rect.left - progressBtnWidth)
    emit('progress-click', progress)
  }

  return {
    progressBarRef,
    progressRef,
    progressStyle,
    btnStyle,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onClick
  }
}
