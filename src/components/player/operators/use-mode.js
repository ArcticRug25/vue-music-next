import {
  useStore
} from 'vuex'
import {
  computed
} from 'vue'
import {
  PLAY_MODE
} from '@/assets/js/constant'

export default function useMode() {
  const store = useStore()
  const playMode = computed(() => store.state.playMode)

  const modeIcon = computed(() => {
    const playModeVal = playMode.value
    return playModeVal === PLAY_MODE.sequence ? 'icon-sequence' : (playModeVal === PLAY_MODE.random ? 'icon-random' : 'icon-loop')
  })

  const changeMode = () => {
      console.log(playMode)
    const mode = (playMode.value + 1) % 3
    const mode1 = playMode.value
    console.log(mode, mode1)
    // store.dispatch('changeMode', mode)
  }

  return {
    modeIcon,
    changeMode
  }
}
