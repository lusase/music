<template>
  <div class="no-result">
    <div class="icon"></div>
    <p class="text"><slot></slot></p>
  </div>
</template>
<script>

</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .no-result
    text-align: center
    .icon
      width: 86px
      height: 90px
      margin: 0 auto
      bg-image('no-result')
      background-size: 86px 90px
    .text
      margin-top: 30px
      font-size: $f-m
      color: $c-text-d
</style>
