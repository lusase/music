<template>
  <div id="app">
    <m-header></m-header>
    <m-tab></m-tab>
    <router-view></router-view>
  </div>
</template>

<script>
  import mHeader from 'components/m-header'
  import mTab from 'components/m-tab'
  export default {
    name: 'app',
    components: {
      mHeader,
      mTab
    }
  }
</script>

<style lang="stylus">

</style>
