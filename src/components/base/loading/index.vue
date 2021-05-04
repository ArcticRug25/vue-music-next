<template>
  <div class="loading">
    <div class="loading-content">
      <img width="325" height="325" src="./load.gif" />
      <p class="desc">{{ title }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loading',
  data() {
    return {
      title: '正在载入...'
    }
  },
  methods: {
    setTitle(title) {
      this.title = title
    }
  }
}
</script>

<style lang="scss" scoped>
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);

  .loading-content {
    text-align: center;

    .desc {
      position: absolute;
      line-height: 20px;
      top: 65%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
      font-size: $font-size-small;
      color: $color-text-l;
    }
  }
}
</style>
