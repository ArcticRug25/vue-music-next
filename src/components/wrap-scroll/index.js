import {
  ref,
  computed,
  watch,
  nextTick,
  h,
  mergeProps,
  withCtx,
  renderSlot
} from 'vue'
import Scroll from '@/components/base/scroll'
import {
  useStore
} from 'vuex'

export default {
  name: 'wrap-scroll',
  props: Scroll.props,
  emits: Scroll.emits,
  render(ctx) {
    return h(Scroll, mergeProps({
      ref: 'scrollRef'
    }, ctx.$props, {
      onScroll: e => {
        ctx.$emit('scroll', e)
      }
    }), {
      default: withCtx(() => {
        return [renderSlot(ctx.$slots, 'default')]
      })
    })
  },
  setup() {
    const scrollRef = ref(null)
    const store = useStore()
    const playList = computed(() => store.state.playList)
    const scroll = computed(() => scrollRef.value.scroll)

    watch(playList, async () => {
      await nextTick()
      scrollRef.value.scroll.refresh()
    })

    return {
      scrollRef,
      scroll
    }
  }
}
