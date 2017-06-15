<template>
  <transition name="slide">
    <music-list></music-list>
  </transition>
</template>
<script>
  import musicList from 'components/music-list'

  export default {
    components: {
      musicList
    }
  }
</script>
<style lang="stylus" scoped>
</style>
