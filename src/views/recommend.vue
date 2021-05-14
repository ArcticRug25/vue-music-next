<template>
  <div class="recommend" v-loading:[loadingText]="loading">
    <Scroll class="recommend-content">
      <div>
        <div class="slider-wrapper">
          <div class="slider-content">
            <Slider v-if="sliders.length" :sliders="sliders" />
          </div>
        </div>
        <RecommendList
          @click-album="onCLick"
          :albums="albums"
          v-show="!loading"
        />
      </div>
    </Scroll>
    <RouterView v-slot="{ Component }">
      <Transition appear name="slide">
        <Component :is="Component" :data="selectedAlbum" />
      </Transition>
    </RouterView>
  </div>
</template>

<script>
import { getRecommend } from '@/service/recommend'
import Slider from '@/components/base/slider'
import RecommendList from '@/components/recommend-list'
import Scroll from '@/components/wrap-scroll'
export default {
  name: 'recommend',
  components: {
    Slider,
    RecommendList,
    Scroll
  },
  data() {
    return {
      sliders: [],
      albums: [],
      selectedAlbum: null,
      loadingText: '正在拼命加载...'
    }
  },
  computed: {
    loading() {
      return !this.sliders.length && !this.albums.length
    }
  },
  async created() {
    const result = await getRecommend()
    this.sliders = result.sliders
    this.albums = result.albums
  },
  methods: {
    onCLick(album) {
      this.selectedAlbum = album
    }
  }
}
</script>

<style lang="scss" scoped>
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;

      .slider-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
