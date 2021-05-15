<template>
  <div class="search-history" v-show="searches.length">
    <h1 class="title" v-if="showDelete">
      <span class="text">搜索历史</span>
      <span class="clear" @click="showConfirm">
        <i class="icon-clear"></i>
      </span>
    </h1>
    <Confirm
      ref="confirmRef"
      text="是否清空所有搜索历史"
      confirm-btn-text="清空"
      @confirm="clearSearch"
    />
    <div class="search-list">
      <TransitionGroup name="list" tag="ul">
        <li
          v-for="item in searches"
          :key="item"
          class="search-item"
          @click="selectItem(item)"
        >
          <span class="text">{{ item }}</span>
          <span class="icon" v-if="showDelete" @click.stop="deleteItem(item)">
            <i class="icon-delete"></i>
          </span>
        </li>
      </TransitionGroup>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import Confirm from '@/components/base/confirm'
import useSearchHistory from '@/components/search/use-search-history'

export default {
  name: 'search-list',
  components: {
    Confirm
  },
  props: {
    searches: {
      type: Array,
      default() {
        return []
      }
    },
    showDelete: {
      type: Boolean,
      default: true
    }
  },
  emits: ['select', 'delete'],
  setup(_, { emit }) {
    const confirmRef = ref(null)

    const { clearSearch } = useSearchHistory()

    function showConfirm() {
      confirmRef.value.show()
    }

    function selectItem(item) {
      emit('select', item)
    }

    function deleteItem(item) {
      emit('delete', item)
    }

    return {
      selectItem,
      deleteItem,
      confirmRef,
      showConfirm,
      // useSearchHistory
      clearSearch
    }
  }
}
</script>

<style lang="scss" scoped>
.search-history {
  position: relative;

  .title {
    display: flex;
    align-items: center;
    height: 40px;
    font-size: $font-size-medium;
    color: $color-text-l;

    .text {
      flex: 1;
    }

    .clear {
      @include extend-click();

      .icon-clear {
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
  }

  .search-list {
    .search-item {
      display: flex;
      align-items: center;
      height: 40px;
      overflow: hidden;

      .text {
        flex: 1;
        color: $color-text-l;
      }

      .icon {
        @include extend-click();

        .icon-delete {
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
    }
  }
}
</style>
