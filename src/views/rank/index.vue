<template>
  <div>
    <m-scroll :listenScroll="true" style="height:600px;overflow: hidden;">
      <ul>
        <li v-for="n in 20" class="item"></li>
      </ul>
    </m-scroll>
  </div>
</template>
<script>
  import mScroll from 'components/m-scroll'
  export default {
    components: {
      mScroll
    }
  }
</script>
<style lang="stylus" scoped>
  .item
    height: 100px
    margin-top: 10px
    background: #f0ad4e

</style>
