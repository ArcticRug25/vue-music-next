<template>
  <div class="search-input">
    <i class="icon-search"></i>
    <input
      type="text"
      class="input-inner"
      :placeholder="placeholder"
      v-model="query"
    />
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script>
import { debounce } from 'throttle-debounce'
export default {
  name: 'search-input',
  props: {
    modelValue: String,
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data() {
    return {
      query: this.modelValue
    }
  },
  created() {
    this.$watch(
      'query',
      debounce(300, newQuery => {
        this.$emit('update:modelValue', newQuery.trim())
      })
    )
    // 父组件传过来的事modelValue 当父组件值修改后 子组件因为把 modelValue 写在 data函数里 所以需要监听modelValue
    this.$watch('modelValue', newVal => {
      this.query = newVal.trim()
    })
  },
  methods: {
    clear() {
      this.query = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.search-input {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 32px;
  background: $color-highlight-background;
  border-radius: 6px;

  .icon-search {
    font-size: 24px;
    color: $color-text-d;
  }

  .input-inner {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: $color-highlight-background;
    color: $color-text;
    font-size: $font-size-medium;
    outline: 0;

    &::placeholder {
      color: $color-text-d;
    }
  }

  .icon-dismiss {
    font-size: 16px;
    color: $color-text-d;
  }
}
</style>
