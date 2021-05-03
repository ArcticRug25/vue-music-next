<template>
  <MHeader />
  <Tab />
  <RouterView />
</template>
<script>
import Header from '@/components/header'
import Tab from '@/components/tab'
export default {
  components: {
    MHeader: Header,
    Tab
  }
}
</script>

<style lang="scss"></style>
