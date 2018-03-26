<template>
  <div id="app">
    <m-header/>
    <m-tab/>
    <router-view></router-view>
    <m-player/>
  </div>
</template>

<script>
  import mHeader from 'components/m-header'
  import mTab from 'components/m-tab'
  import mPlayer from 'components/m-player'
  export default {
    name: 'app',
    components: {
      mHeader,
      mTab,
      mPlayer
    }
  }
</script>

<style lang="stylus">

</style>
