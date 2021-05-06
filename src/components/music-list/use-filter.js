import {
  ref,
  computed,
  onMounted
} from 'vue'

const RESERVED_HEIGHT = 40

export default function useFilter(props) {
  const imageHeight = ref(0)
  const scrollY = ref(0)
  const maxTranslateY = ref(0)
  const bgImageRef = ref(null)

  const bgImageStyle = computed(() => {
    const scrollYVal = scrollY.value
    let zIndex = 0
    let paddingTop = '70%'
    let height = 0
    // 解决IOS头部还是会挡住列表
    let translateZ = 0

    if (scrollYVal > maxTranslateY.value) {
      zIndex = 10
      paddingTop = 0
      height = `${RESERVED_HEIGHT}px`
      translateZ = 1
    }

    let scale = 1
    if (scrollYVal < 0) {
      scale = 1 + Math.abs(scrollYVal / imageHeight.value)
    }

    return {
      zIndex,
      paddingTop,
      height,
      backgroundImage: `url(${props.pic})`,
      transform: `scale(${scale})translateZ(${translateZ}px)`
    }
  })

  const scrollStyle = computed(() => {
    return {
      top: `${imageHeight.value}px`
    }
  })

  const filterStyle = computed(() => {
    let blur = 0
    const scrollYVal = scrollY.value
    const imageHeightVal = imageHeight.value
    if (scrollYVal >= 0) {
      blur =
        Math.min(maxTranslateY.value / imageHeightVal, scrollYVal / imageHeightVal) * 20
    }
    return {
      backdropFilter: `blur(${blur}px)`
    }
  })

  const playBtnStyle = computed(() => {
    let display = ''
    if (scrollY.value >= maxTranslateY.value) {
      display = 'none'
    }
    return {
      display
    }
  })

  onMounted(() => {
    const imageHeigtVal = imageHeight.value = bgImageRef.value.clientHeight
    maxTranslateY.value = imageHeigtVal - RESERVED_HEIGHT
  })

  function onScroll(pos) {
    scrollY.value = -pos.y
  }

  return {
    bgImageRef,
    bgImageStyle,
    scrollStyle,
    filterStyle,
    playBtnStyle,
    onScroll
  }
}
