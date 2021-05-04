<template>
  <div class="recommend-list">
    <h1 class="list-title">热门歌单推荐</h1>
    <ul>
      <li class="item" v-for="item in albums" :key="item.id">
        <div class="icon">
          <img width="60" height="60" v-lazy="item.pic" />
        </div>
        <div class="text">
          <h2 class="name">
            {{ item.username }}
          </h2>
          <p class="title">
            {{ item.title }}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'recommend-list',
  props: {
    albums: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.recommend-list {
  .list-title {
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: $font-size-medium;
    color: $color-theme;
  }

  .item {
    display: flex;
    box-sizing: border-box;
    align-items: center;
    padding: 0 15px 15px 15px;

    .icon {
      flex: 0 0 60px;
      width: 60px;
      padding-right: 15px;

      img {
        display: block;
        border-radius: 4px;
        box-shadow: 0 0 8px rgba($color: #000000, $alpha: 0.5);
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      font-size: $font-size-medium;
    }

    .name {
      margin-bottom: 10px;
      color: $color-text;
    }

    .title {
      color: $color-text-d;
    }
  }
}
</style>
