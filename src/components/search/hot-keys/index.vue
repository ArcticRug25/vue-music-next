<template>
  <div class="hot-keys">
    <h1 class="title">热门搜索</h1>
    <ul>
      <li
        class="item"
        v-for="item in hotKeys"
        :key="item.id"
        @click="addQuery(item.key)"
      >
        <span>{{ item.key }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'hot-keys',
  props: {
    hotKeys: Array
  },
  methods: {
    addQuery(key) {
      this.$emit('tap-hot-key', key)
    }
  }
}
</script>

<style lang="scss" scoped>
.hot-keys {
  margin: 0 20px 20px 20px;

  .title {
    margin-bottom: 20px;
    font-size: $font-size-medium;
    color: $color-text-l;
  }

  .item {
    display: inline-block;
    padding: 5px 10px;
    margin: 0 20px 10px 0;
    border-radius: 6px;
    background: $color-highlight-background;
    font-size: $font-size-medium;
    color: $color-text-d;
  }
}
</style>
