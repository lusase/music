<template>
  <div class="m-loading">
    <img width="24" height="24" src="./loading.gif">
    <p class="desc">{{title}}</p>
  </div>
</template>
<script>
  export default {
    props: {
      title: {
        type: String,
        default: '正在加载...'
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  .m-loading
    width: 100%
    text-align: center
    .desc
      line-height: 20px
      font-size:$f-s
      color: $c-text-l
</style>
