import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onUnmounted
} from 'vue'
import {
  useStore
} from 'vuex'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
BScroll.use(Slide)

export default function useMiniSlider() {
  const sliderWrapperRef = ref(null)
  const slider = ref(null)

  const store = useStore()
  const state = store.state
  const fullScreen = computed(() => state.fullScreen)
  const playList = computed(() => state.playList)
  const currentIndex = computed(() => state.currentIndex)

  const sliderShow = computed(() => !fullScreen.value && !!playList.value)

  onMounted(() => {
    let sliderVal
    watch(sliderShow, async (newSliderShow) => {
      if (!newSliderShow) return
      await nextTick()
      // 当 BScroll 实例化后 切换全屏防止重复构造
      if (!sliderVal) {
        sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
          click: true,
          scrollX: true,
          scrollY: false,
          momentum: false,
          bounce: false,
          probeType: 2,
          slide: {
            autoplay: false,
            loop: true
          }
        })
        // 初始化后监听滑块改变后
        sliderVal.on('slidePageChanged', ({
          pageX
        }) => {
          store.commit('setCurrentIndex', pageX)
        })
      } else {
        sliderVal.refresh()
      }
      // 每次初始化或刷新后立马切到当前播放歌曲
      sliderVal.goToPage(currentIndex.value, 0, 0)
    })

    // 歌曲切换时候 跳转到下一首要播放的歌曲
    watch(currentIndex, (newIndex) => {
      if (sliderVal && sliderShow.value) {
        sliderVal.goToPage(newIndex, 0, 0)
      }
    })

    // 当删除列表歌曲时，虽然数据删除了 但是DOM还是存在的，需要执行 refresh
    watch(playList, async (newList) => {
      if (sliderVal && sliderShow.value && newList.length) {
        await nextTick()
        sliderVal.refresh()
      }
    })
  })

  onUnmounted(() => {
    if (slider.value) {
      slider.value.destroy()
    }
  })

  return {
    slider,
    sliderWrapperRef
  }
}
