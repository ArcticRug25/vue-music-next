import {
  ref
} from 'vue'

export default function useMiddleInteractive() {
  // 当前显示模块
  const currentShow = ref('cd')
  const middleLStyle = ref(null)
  const middleRStyle = ref(null)

  const touch = {}
  let currentView = 'cd'

  function onMiddleTouchStart(e) {
    touch.startX = e.touches[0].pageX
    touch.startY = e.touches[0].pageY
    // 方向锁
    touch.directionLocked = ''
  }

  function onMiddleTouchMove(e) {
    // 视口宽度
    const viewWidth = window.innerWidth
    // 移动的偏移量
    const deltaX = e.touches[0].pageX - touch.startX
    const deltaY = e.touches[0].pageY - touch.startY

    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)
    // 如果X轴的偏移量大于Y轴的偏移量 那么方向则为 横向滑动
    if (!touch.directionLocked) {
      touch.directionLocked = absDeltaX >= absDeltaY ? 'h' : 'v'
    }

    if (touch.directionLocked === 'v') {
      return
    }

    const left = currentView === 'cd' ? 0 : -viewWidth
    const offsetWidth = Math.max(-viewWidth, Math.min(0, left + deltaX))
    // 偏移比例
    touch.percent = Math.abs(offsetWidth / viewWidth)

    if (currentView === 'cd') {
      currentShow.value = touch.percent > 0.2 ? 'lyric' : 'cd'
    } else {
      currentShow.value = touch.percent < 0.8 ? 'cd' : 'lyric'
    }

    middleLStyle.value = {
      opacity: 1 - touch.percent
    }

    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`
    }
  }

  function onMiddleTouchEnd() {
    let offsetWidth
    let opacity
    if (currentShow.value === 'cd') {
      currentView = 'cd'
      offsetWidth = 0
      opacity = 1
    } else {
      currentView = 'lyric'
      offsetWidth = -window.innerWidth
      opacity = 0
    }

    const duration = 300
    middleLStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`
    }

    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: `${duration}ms`
    }
  }

  return {
    currentShow,
    middleLStyle,
    middleRStyle,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd
  }
}
