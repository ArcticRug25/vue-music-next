import {
  ref
} from 'vue'
import animations from 'create-keyframe-animation'

export default function useAnimation() {
  const CDRef = ref(null)
  let entering = false
  let leaving = false

  // 动画钩子 el 为当前作用的DOM元素 done 当动画结束时 需要通过done函数执行 来到下一个钩子函数
  function enter(_, done) {
    // vue 内部有处理 但是如果使用 JavaScript 动画钩子 需要手动处理
    if (leaving) {
      afterLeave()
    }
    entering = true
    const {
      x,
      y,
      scale
    } = getPosAndScale()

    const animation = {
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      },
      100: {
        transform: 'translate3d(0, 0, 0) scale(1)'
      }
    }

    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 600,
        easing: 'cubic-bezier(0.45, 0, 0.55, 1)'
      }
    })

    animations.runAnimation(CDRef.value.cdWrapperRef, 'move', done)
  }

  // 清理
  function afterEnter() {
    entering = false
    animations.unregisterAnimation('move')
    CDRef.value.cdWrapperRef.style.animation = ''
  }

  function leave(_, done) {
    // 因为是异步执行 所以当 enter 还未执行完再去执行 leave 会导致一些问题 所以为了避免这个问题需要用标志位 清理未执行完成的 enter
    if (entering) {
      afterEnter()
    }
    leaving = true
    const {
      x,
      y,
      scale
    } = getPosAndScale()

    const cdWrapperEl = CDRef.value.cdWrapperRef

    cdWrapperEl.style.transition = 'all .6s cubic-bezier(0.45, 0, 0.55, 1)'
    cdWrapperEl.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
    cdWrapperEl.addEventListener('transitionend', _next)

    function _next() {
      cdWrapperEl.removeEventListener('transitionend', _next)
      done()
    }
  }

  function afterLeave() {
    leaving = false
    const cdWrapperEl = CDRef.value.cdWrapperRef
    cdWrapperEl.style.transition = ''
    cdWrapperEl.style.transform = ''
  }

  function getPosAndScale() {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    // mini cd的直径
    const targetWidth = 45
    // mini cd 距离左边的距离 半径 + paddingLeft
    const paddingLeft = 22.5 + 15
    // mini cd 距离下边的距离 (父容器 - 直径) / 2 + 半径  居中
    const paddingBottom = (60 - 45) / 2 + 22.5
    // 大 CD 距离顶部位置
    const paddingTop = 80
    // 大 CD 宽度 (css设置为width：80%)
    const width = windowWidth * 0.8
    // 大 CD 到 mini cd 需要偏移 X 坐标的量
    const x = -(windowWidth / 2 - paddingLeft)
    // 大 CD 到 mini cd 需要偏移 Y 坐标的量
    const y = windowHeight - paddingTop - width / 2 - paddingBottom
    // 大 CD 与 mini cd 的大小比
    const scale = targetWidth / width

    return {
      x,
      y,
      scale
    }
  }

  return {
    CDRef,
    enter,
    afterEnter,
    leave,
    afterLeave
  }
}
